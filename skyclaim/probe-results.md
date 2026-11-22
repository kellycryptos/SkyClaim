# SkyClaim Probe Results: Miners 106004 & 106005

**Node Tested:** `http://13.237.89.59:7044`  
**Intent:** `TRAVEL_TRANSIT_LOCK_GENERAL`  
**Timestamp:** 2026-11-22T04:24:00Z  

---

## 1. Miner 106005 (`ttl-nws` · NWS Transit Alerts)
- **Upstream:** `https://api.weather.gov/alerts/active`
- **Supported Parameters:** `area` (US 2-letter state codes only, e.g., `NY`, `CA`).
- **Airport Code Support:** **None.** Passing `LHR` or `ZZZ` returns **HTTP 400 Parameter Error**.
- **Historical Observations:** **None.** Endpoint serves only currently active weather alerts.
- **Cost & Latency:** 402 challenge ($0.01 USDC x402) / 843ms.

## 2. Miner 106004 (`ttl-airsigmet` · AIRSIGMET Transit Lock)
- **Upstream:** `https://aviationweather.gov/api/data/airsigmet`
- **Supported Parameters:** `format` (`json` default).
- **Airport Code Support:** **None.** Returns a global array of active US airspace hazard polygons.
- **Historical Observations:** **None.** Passing past dates (`date=20261120`) ignores the parameter and returns the current live active SIGMETs.
- **Cost & Latency:** 402 challenge ($0.01 USDC x402) / 854ms.

---

## 3. Findings Against Prompt Questions
- **a) Does the request accept an airport code and a PAST timestamp?** **No.** Neither miner accepts airport codes or historical time windows.
- **b) Does the response contain historical observations or only current alerts?** **Current alerts only.**
- **c) What does it return for US, European, and nonsense codes?** US state returns active alert GeoJSON; European or nonsense codes return **HTTP 400 Bad Request**.
- **d) Cost and latency:** $0.01 USDC (via x402 challenge), ~850ms latency.
