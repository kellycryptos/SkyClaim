import os
import time
import json
import urllib.request
import urllib.error

os.makedirs("skyclaim", exist_ok=True)

dispatcher_url = "http://13.237.89.59:7044/miner-dispatcher"

tests = [
    # 1. Miner 106004 (AIRSIGMET) base query
    {
        "name": "106004_base",
        "url": f"{dispatcher_url}/v1/106004/query?format=json",
        "desc": "AIRSIGMET default format=json"
    },
    # 2. Miner 106004 with airport & past timestamp params
    {
        "name": "106004_airport_and_past_timestamp",
        "url": f"{dispatcher_url}/v1/106004/query?format=json&airport=JFK&date=2026-11-20&timestamp=1732104000",
        "desc": "AIRSIGMET with airport=JFK and past date/timestamp"
    },
    # 3. Miner 106005 (NWS) default area=NY (US Airport State)
    {
        "name": "106005_nws_us_state_NY",
        "url": f"{dispatcher_url}/v1/106005/query?area=NY",
        "desc": "NWS alerts area=NY (covers JFK/LGA/EWR)"
    },
    # 4. Miner 106005 with European area/airport (LHR / UK / GB)
    {
        "name": "106005_nws_european_LHR",
        "url": f"{dispatcher_url}/v1/106005/query?area=LHR&airport=LHR",
        "desc": "NWS alerts with European airport LHR"
    },
    # 5. Miner 106005 with Nonsense code
    {
        "name": "106005_nws_nonsense",
        "url": f"{dispatcher_url}/v1/106005/query?area=ZZZ999",
        "desc": "NWS alerts with nonsense area ZZZ999"
    },
    # 6. Miner 106005 with past date/timestamp params
    {
        "name": "106005_nws_past_date",
        "url": f"{dispatcher_url}/v1/106005/query?area=NY&date=2026-11-20&start=2026-11-20T00:00:00Z",
        "desc": "NWS alerts area=NY with past date parameters"
    }
]

results = []

for t in tests:
    url = t["url"]
    t0 = time.time()
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    status = None
    headers_dict = {}
    body_text = ""
    err_msg = ""
    cost = "0.00"
    
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            status = resp.status
            body_text = resp.read().decode("utf-8", errors="ignore")
            headers_dict = dict(resp.headers)
    except urllib.error.HTTPError as e:
        status = e.code
        body_text = e.read().decode("utf-8", errors="ignore")
        headers_dict = dict(e.headers)
        if status == 402:
            cost = "$0.01 (x402)"
    except Exception as e:
        err_msg = str(e)
        
    latency_ms = int((time.time() - t0) * 1000)
    
    results.append({
        "test": t["name"],
        "desc": t["desc"],
        "url": url,
        "status": status,
        "latency_ms": latency_ms,
        "cost": cost,
        "error": err_msg,
        "response_preview": body_text[:600],
        "full_body": body_text,
        "headers": headers_dict
    })

# Write to skyclaim/probe-results.md
with open("skyclaim/probe-results.md", "w", encoding="utf-8") as f:
    f.write("# SkyClaim Step 1 Probe Results\n\n")
    f.write(f"Probed on live Telegraph node: `http://13.237.89.59:7044`\n\n")
    f.write("## Summary Matrix\n\n")
    f.write("| Test Name | Target URL | HTTP Status | Latency | Cost | Response Notes |\n")
    f.write("|---|---|---|---|---|---|\n")
    for r in results:
        preview = r['response_preview'].replace('\n', ' ')[:100]
        f.write(f"| **{r['test']}** | `{r['url']}` | {r['status']} | {r['latency_ms']}ms | {r['cost']} | `{preview}...` |\n")
    
    f.write("\n## Raw Outputs & Schema Analysis\n\n")
    for r in results:
        f.write(f"### {r['test']}: {r['desc']}\n")
        f.write(f"- **URL:** `{r['url']}`\n")
        f.write(f"- **Status:** `{r['status']}`\n")
        f.write(f"- **Latency:** `{r['latency_ms']}ms`\n")
        f.write(f"- **Cost:** `{r['cost']}`\n")
        f.write("```json\n")
        try:
            parsed = json.loads(r["full_body"])
            f.write(json.dumps(parsed, indent=2)[:3000])
        except:
            f.write(r["full_body"][:3000])
        f.write("\n```\n\n")

print("Probe completed and saved to skyclaim/probe-results.md")
