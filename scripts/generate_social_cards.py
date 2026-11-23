import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/social", exist_ok=True)

def create_card(filename, title, subtitle, badge_text, details, accent_color, tag_text):
    width, height = 1200, 675
    # Dark modern canvas
    im = Image.new("RGBA", (width, height), (11, 17, 32, 255))
    draw = ImageDraw.Draw(im)

    # Grid / circuit accent lines
    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=(22, 31, 51, 80), width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=(22, 31, 51, 80), width=1)

    # Top border glow
    draw.line([(0, 0), (width, 0)], fill=accent_color, width=4)

    # Decorative glows (circles)
    draw.ellipse([(width - 350, -100), (width + 150, 400)], fill=(accent_color[0], accent_color[1], accent_color[2], 25))

    # Header: Brand & Track
    try:
        font_sm = ImageFont.truetype("arial.ttf", 20)
        font_md = ImageFont.truetype("arialbd.ttf", 26)
        font_lg = ImageFont.truetype("arialbd.ttf", 46)
        font_xl = ImageFont.truetype("arialbd.ttf", 52)
        font_mono = ImageFont.truetype("consola.ttf", 22)
    except Exception:
        font_sm = font_md = font_lg = font_xl = font_mono = ImageFont.load_default()

    # Brand badge
    draw.rounded_rectangle([(60, 45), (320, 85)], radius=8, fill=(17, 24, 39, 230), outline=(30, 41, 59, 255))
    draw.text((75, 52), "✈️ SKYCLAIM · PROTOCOL", fill=(248, 250, 252), font=font_sm)

    # Hackathon badge
    draw.rounded_rectangle([(335, 45), (630, 85)], radius=8, fill=(17, 24, 39, 230), outline=(accent_color[0], accent_color[1], accent_color[2], 120))
    draw.text((350, 52), "TELEGRAPH HACKATHON H2", fill=accent_color, font=font_sm)

    # Status / Date badge top right
    draw.rounded_rectangle([(width - 280, 45), (width - 60, 85)], radius=8, fill=(17, 24, 39, 230), outline=(30, 41, 59, 255))
    draw.text((width - 265, 52), tag_text, fill=(148, 163, 184), font=font_sm)

    # Category Badge
    draw.rounded_rectangle([(60, 120), (60 + len(badge_text)*14, 155)], radius=6, fill=(accent_color[0], accent_color[1], accent_color[2], 40), outline=accent_color)
    draw.text((75, 126), badge_text, fill=accent_color, font=font_sm)

    # Main Title
    draw.text((60, 180), title, fill=(248, 250, 252), font=font_xl)

    # Subtitle
    draw.text((60, 250), subtitle, fill=(148, 163, 184), font=font_md)

    # Detail Content Box
    draw.rounded_rectangle([(60, 310), (width - 60, 570)], radius=16, fill=(15, 23, 42, 240), outline=(30, 41, 59, 255))

    y_offset = 335
    for label, val, is_accent in details:
        draw.text((85, y_offset), label, fill=(148, 163, 184), font=font_mono)
        val_color = accent_color if is_accent else (248, 250, 252)
        draw.text((360, y_offset), val, fill=val_color, font=font_mono)
        y_offset += 48

    # Bottom Footer
    draw.text((60, 605), "@Telegraphprotoc · Track 03: Apps & Agents · Mission 15: Consumer Automation", fill=(100, 116, 139), font=font_sm)
    draw.text((width - 340, 605), "github.com/kellycryptos/SkyClaim", fill=accent_color, font=font_sm)

    out_path = os.path.join("public/social", filename)
    im.save(out_path, "PNG")
    print(f"Generated {out_path}")

# Card 1: Nov 14 (Architecture & x402 Engine)
create_card(
    filename="card1-problem-and-x402.png",
    title="Autonomous Transatlantic Disruption Shield",
    subtitle="Closing the Airline Weather Excuse via Base Sepolia x402 Micropayments",
    badge_text="UPDATE 1 · ARCHITECTURE & DEMAND",
    details=[
        ("Commercial Mission:", "Mission 15: Consumer Automation (Track 03)", False),
        ("The Airline Defense:", "EU261 Article 5(3) 'Extraordinary Weather' Claims", False),
        ("Telegraph x402 Gate:", "0x036CbD...dCF7e ($0.01 Circle USDC)", True),
        ("Gasless Settlement:", "EIP-712 TransferWithAuthorization (EIP-3009)", True),
        ("Statutory Range:", "€300 – €600 (CJEU Sturgeon v Condor Arrival Delay)", False)
    ],
    accent_color=(56, 189, 248), # Cyan
    tag_text="DATE: NOV 14, 2026"
)

# Card 2: Nov 20 (Consensus Engine & Codeshare Metal)
create_card(
    filename="card2-consensus-engine.png",
    title="The Takar Consensus Pattern in Flight Claims",
    subtitle="Dual-Miner Telemetry + CJEU Case C-502/18 Operating Metal Enforcement",
    badge_text="UPDATE 2 · CONSENSUS & LEGAL TECH",
    details=[
        ("Departure Miner:", "TRAVEL_TRANSIT_LOCK_GENERAL (JFK / ORD hubs)", False),
        ("Arrival Miner:", "STORM_ALERT_GENERAL (EGLL / LFPG corridors)", False),
        ("Legal Metal Filter:", "Excludes US Metal ex-USA (Delta excluded / $0 spent)", True),
        ("Contested Workflow:", "Wallentin-Hermann Article 5(3) Challenge Notice", True),
        ("BaseScan Proof Tx:", "0x3599e21750665fe443e0db847d383ff0ae0045c5ded530b63...", True)
    ],
    accent_color=(52, 211, 153), # Emerald
    tag_text="DATE: NOV 20, 2026"
)

# Card 3: Nov 23 (Launch & Independent Testers)
create_card(
    filename="card3-launch-and-testers.png",
    title="SkyClaim is Live · Independent Testers Wanted",
    subtitle="Web Terminal + Telegram Bot (@SkyClaimBot) + 90-Second CLI Simulator",
    badge_text="UPDATE 3 · LAUNCH & AUDIT DOSSIER",
    details=[
        ("Web UI Radar:", "http://localhost:3000 (SVG Route Radar & Receipt Box)", False),
        ("Telegram Bot:", "@SkyClaimBot (/claim, /receipts, /ledger)", True),
        ("Terminal Simulator:", "npm run bot:sim (Deterministic 90-Second Review)", True),
        ("Budget Guardrails:", "$0.05/call hard cap · $5.00 daily spend ceiling", False),
        ("Tester Dossier:", "INDEPENDENT_TESTERS.md (Reports kept on record)", True)
    ],
    accent_color=(168, 85, 247), # Purple/Violet
    tag_text="DATE: NOV 23, 2026"
)
