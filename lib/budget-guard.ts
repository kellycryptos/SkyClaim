/**
 * SkyClaim Budget Guard & Rate Limiter
 * 
 * Prevents automated wallet draining during public demos & evaluations:
 * 1. Basic Rate Limiting: Max 15 requests per IP per rolling 60-second window.
 * 2. Per-Request Budget Cap: Max $0.05 USDC per individual claim evaluation.
 * 3. Daily Spend Cap: Max $5.00 USDC total on-chain spend per calendar day (UTC).
 * 
 * Supports:
 * - Distributed mode via Upstash Redis REST API (persists across serverless cold starts)
 * - In-memory mode fallback (zero-config, for local testing & sandbox environments)
 * - Low dedicated wallet balance as the physical unbreachable on-chain circuit breaker
 */

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  reason?: string;
  isDistributed?: boolean;
}

export interface BudgetStatus {
  allowed: boolean;
  perRequestCapUsd: number;
  dailySpendCapUsd: number;
  currentDailySpendUsd: number;
  reason?: string;
  isDistributed?: boolean;
}

export const PER_REQUEST_CAP_USD = 0.05;
export const DAILY_SPEND_CAP_USD = 5.00;
export const RATE_LIMIT_MAX_PER_MINUTE = 15;
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;

// In-memory rate limiting state: ip -> timestamps[]
const ipRequests = new Map<string, number[]>();

// In-memory daily spend state: YYYY-MM-DD -> cumulative spend
const dailySpendTracker = new Map<string, number>();

function getTodayUtcKey(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Execute an Upstash Redis REST command if credentials are present.
 */
async function callUpstash(command: (string | number)[]): Promise<any> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch (err: any) {
    console.warn("[BudgetGuard] Upstash Redis call error:", err?.message || err);
    return null;
  }
}

/**
 * Synchronous rate limit check (in-memory).
 */
export function checkRateLimit(clientIp: string): RateLimitStatus {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = ipRequests.get(clientIp) || [];
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_PER_MINUTE) {
    const oldestInWindow = recent[0];
    const resetSeconds = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
      reason: `Rate limit of ${RATE_LIMIT_MAX_PER_MINUTE} req/min exceeded. Try again in ${resetSeconds}s.`,
      isDistributed: false,
    };
  }

  recent.push(now);
  ipRequests.set(clientIp, recent);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_PER_MINUTE - recent.length,
    resetSeconds: 60,
    isDistributed: false,
  };
}

/**
 * Distributed rate limit check (Upstash Redis with in-memory fallback).
 */
export async function checkRateLimitDistributed(clientIp: string): Promise<RateLimitStatus> {
  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasUpstash) {
    const minuteWindow = Math.floor(Date.now() / 60000);
    const key = `skyclaim:rl:${clientIp}:${minuteWindow}`;

    const count = await callUpstash(["INCR", key]);
    if (typeof count === "number") {
      if (count === 1) {
        // Set expiry on new window key
        await callUpstash(["EXPIRE", key, 65]);
      }

      if (count > RATE_LIMIT_MAX_PER_MINUTE) {
        return {
          allowed: false,
          remaining: 0,
          resetSeconds: 60,
          reason: `Rate limit of ${RATE_LIMIT_MAX_PER_MINUTE} req/min exceeded. Try again shortly.`,
          isDistributed: true,
        };
      }

      return {
        allowed: true,
        remaining: Math.max(0, RATE_LIMIT_MAX_PER_MINUTE - count),
        resetSeconds: 60,
        isDistributed: true,
      };
    }
  }

  // Fallback to in-memory
  return checkRateLimit(clientIp);
}

/**
 * Synchronous budget check (in-memory).
 */
export function checkAndRecordBudget(costUsd: number): BudgetStatus {
  const today = getTodayUtcKey();
  const currentDaily = dailySpendTracker.get(today) || 0;

  // 1. Check per-request cap
  if (costUsd > PER_REQUEST_CAP_USD) {
    return {
      allowed: false,
      perRequestCapUsd: PER_REQUEST_CAP_USD,
      dailySpendCapUsd: DAILY_SPEND_CAP_USD,
      currentDailySpendUsd: currentDaily,
      reason: `Requested cost ($${costUsd.toFixed(2)}) exceeds per-request budget cap ($${PER_REQUEST_CAP_USD.toFixed(2)}).`,
      isDistributed: false,
    };
  }

  // 2. Check daily spend cap
  if (currentDaily + costUsd > DAILY_SPEND_CAP_USD) {
    return {
      allowed: false,
      perRequestCapUsd: PER_REQUEST_CAP_USD,
      dailySpendCapUsd: DAILY_SPEND_CAP_USD,
      currentDailySpendUsd: currentDaily,
      reason: `Daily spend limit ($${DAILY_SPEND_CAP_USD.toFixed(2)}) reached ($${currentDaily.toFixed(2)} spent today).`,
      isDistributed: false,
    };
  }

  // Update daily spend
  const updatedDaily = Number((currentDaily + costUsd).toFixed(4));
  dailySpendTracker.set(today, updatedDaily);

  return {
    allowed: true,
    perRequestCapUsd: PER_REQUEST_CAP_USD,
    dailySpendCapUsd: DAILY_SPEND_CAP_USD,
    currentDailySpendUsd: updatedDaily,
    isDistributed: false,
  };
}

/**
 * Distributed budget check (Upstash Redis with in-memory fallback).
 */
export async function checkAndRecordBudgetDistributed(costUsd: number): Promise<BudgetStatus> {
  // 1. Check per-request cap immediately
  if (costUsd > PER_REQUEST_CAP_USD) {
    return {
      allowed: false,
      perRequestCapUsd: PER_REQUEST_CAP_USD,
      dailySpendCapUsd: DAILY_SPEND_CAP_USD,
      currentDailySpendUsd: 0,
      reason: `Requested cost ($${costUsd.toFixed(2)}) exceeds per-request budget cap ($${PER_REQUEST_CAP_USD.toFixed(2)}).`,
      isDistributed: false,
    };
  }

  const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasUpstash) {
    const today = getTodayUtcKey();
    const key = `skyclaim:spend:${today}`;

    // Read current spend
    const currentStr = await callUpstash(["GET", key]);
    const current = currentStr ? parseFloat(currentStr) : 0;

    if (current + costUsd > DAILY_SPEND_CAP_USD) {
      return {
        allowed: false,
        perRequestCapUsd: PER_REQUEST_CAP_USD,
        dailySpendCapUsd: DAILY_SPEND_CAP_USD,
        currentDailySpendUsd: current,
        reason: `Daily spend limit ($${DAILY_SPEND_CAP_USD.toFixed(2)}) reached ($${current.toFixed(2)} spent today).`,
        isDistributed: true,
      };
    }

    // Increment spend in Redis
    const newTotalStr = await callUpstash(["INCRBYFLOAT", key, costUsd]);
    const newTotal = typeof newTotalStr === "number" ? newTotalStr : parseFloat(newTotalStr || `${current + costUsd}`);
    await callUpstash(["EXPIRE", key, 86400 * 2]);

    return {
      allowed: true,
      perRequestCapUsd: PER_REQUEST_CAP_USD,
      dailySpendCapUsd: DAILY_SPEND_CAP_USD,
      currentDailySpendUsd: newTotal,
      isDistributed: true,
    };
  }

  // Fallback to in-memory
  return checkAndRecordBudget(costUsd);
}

/**
 * Returns current budget snapshot without mutating state.
 */
export function getBudgetSnapshot(): {
  perRequestCapUsd: number;
  dailySpendCapUsd: number;
  currentDailySpendUsd: number;
} {
  const today = getTodayUtcKey();
  return {
    perRequestCapUsd: PER_REQUEST_CAP_USD,
    dailySpendCapUsd: DAILY_SPEND_CAP_USD,
    currentDailySpendUsd: dailySpendTracker.get(today) || 0,
  };
}
