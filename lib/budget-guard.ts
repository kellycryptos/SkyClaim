/**
 * SkyClaim Budget Guard & Rate Limiter
 * 
 * Prevents automated wallet draining during public demos & evaluations:
 * 1. Basic Rate Limiting: Max 15 requests per IP per rolling 60-second window.
 * 2. Per-Request Budget Cap: Max $0.05 USDC per individual claim evaluation.
 * 3. Daily Spend Cap: Max $5.00 USDC total on-chain spend per calendar day (UTC).
 */

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  reason?: string;
}

export interface BudgetStatus {
  allowed: boolean;
  perRequestCapUsd: number;
  dailySpendCapUsd: number;
  currentDailySpendUsd: number;
  reason?: string;
}

const PER_REQUEST_CAP_USD = 0.05;
const DAILY_SPEND_CAP_USD = 5.00;
const RATE_LIMIT_MAX_PER_MINUTE = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

// In-memory rate limiting state: ip -> timestamps[]
const ipRequests = new Map<string, number[]>();

// In-memory daily spend state: YYYY-MM-DD -> cumulative spend
const dailySpendTracker = new Map<string, number>();

function getTodayUtcKey(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Checks and updates rate limit for a given client IP.
 */
export function checkRateLimit(clientIp: string): RateLimitStatus {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = ipRequests.get(clientIp) || [];
  // Filter out timestamps outside rolling window
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_PER_MINUTE) {
    const oldestInWindow = recent[0];
    const resetSeconds = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
      reason: `Rate limit of ${RATE_LIMIT_MAX_PER_MINUTE} req/min exceeded. Try again in ${resetSeconds}s.`,
    };
  }

  recent.push(now);
  ipRequests.set(clientIp, recent);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_PER_MINUTE - recent.length,
    resetSeconds: 60,
  };
}

/**
 * Checks and records on-chain expenditure against per-request and daily caps.
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
  };
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
