import urllib.request
import urllib.error
import json

urls = [
    ("NWS_NY_US_State", "https://api.weather.gov/alerts/active?area=NY"),
    ("NWS_LHR_European", "https://api.weather.gov/alerts/active?area=LHR"),
    ("NWS_Nonsense", "https://api.weather.gov/alerts/active?area=ZZZ999"),
    ("AIRSIGMET_Base", "https://aviationweather.gov/api/data/airsigmet?format=json"),
    ("AIRSIGMET_Historical_Past", "https://aviationweather.gov/api/data/airsigmet?format=json&date=20261120"),
]

for name, u in urls:
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            body = r.read().decode("utf-8")
            print(f"[{name}] HTTP {r.status}, length: {len(body)}")
            try:
                parsed = json.loads(body)
                if isinstance(parsed, dict) and "features" in parsed:
                    print(f"  Type: GeoJSON, features: {len(parsed['features'])}")
                elif isinstance(parsed, list):
                    print(f"  Type: Array, items: {len(parsed)}")
                    if len(parsed) > 0:
                        print("  Sample item keys:", list(parsed[0].keys()))
            except Exception as e:
                print("  Json parse note:", e)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8', errors='ignore')
        print(f"[{name}] HTTP {e.code}: {err_body[:120]}")
    except Exception as e:
        print(f"[{name}] Error: {e}")
