import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("public/social", exist_ok=True)

def create_card(filename, title, subtitle, badge_text, details, accent_color, tag_text):
    width, height = 1200, 675
    im = Image.new("RGBA", (width, height), (11, 17, 32, 255))
    draw = ImageDraw.Draw(im)

    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=(22, 31, 51, 80), width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=(22, 31, 51, 80), width=1)

    draw.line([(0, 0), (width, 0)], fill=accent_color, width=4)
    draw.ellipse([(width - 350, -100), (width + 150, 400)], fill=(accent_color[0], accent_color[1], accent_color[2], 25))

    try:
        font_sm = ImageFont.truetype("arial.ttf", 20)
        font_md = ImageFont.truetype("arialbd.ttf", 26)
        font_lg = ImageFont.truetype("arialbd.ttf", 44)
        font_xl = ImageFont.truetype("arialbd.ttf", 48)
        font_mono = ImageFont.truetype("consola.ttf", 21)
    except Exception:
        font_sm = font_md = font_lg = font_xl = font_mono = ImageFont.load_default()

    draw.rounded_rectangle([(60, 45), (320, 85)], radius=8, fill=(17, 24, 39, 230), outline=(30, 41, 59, 255))
    draw.text((75, 52), "✈️ SKYCLAIM · PROTOCOL", fill=(248, 250, 252), font=font_sm)

    draw.rounded_rectangle([(335, 45), (630, 85)], radius=8, fill=(17, 24, 39, 230), outline=(accent_color[0], accent_color[1], accent_color[2], 120))
    draw.text((350, 52), "TELEGRAPH HACKATHON H2", fill=accent_color, font=font_sm)

    draw.rounded_rectangle([(width - 280, 45), (width - 60, 85)], radius=8, fill=(17, 24, 39, 230), outline=(30, 41, 59, 255))
    draw.text((width - 265, 52), tag_text, fill=(148, 163, 184), font=font_sm)

    draw.rounded_rectangle([(60, 120), (60 + len(badge_text)*14, 155)], radius=6, fill=(accent_color[0], accent_color[1], accent_color[2], 40), outline=accent_color)
    draw.text((75, 126), badge_text, fill=accent_color, font=font_sm)

    draw.text((60, 180), title, fill=(248, 250, 252), font=font_xl)
    draw.text((60, 250), subtitle, fill=(148, 163, 184), font=font_md)

    draw.rounded_rectangle([(60, 310), (width - 60, 570)], radius=16, fill=(15, 23, 42, 240), outline=(30, 41, 59, 255))

    y_offset = 335
    for label, val, is_accent in details:
        draw.text((85, y_offset), label, fill=(148, 163, 184), font=font_mono)
        val_color = accent_color if is_accent else (248, 250, 252)
        draw.text((350, y_offset), val, fill=val_color, font=font_mono)
        y_offset += 48

    draw.text((60, 605), "@Telegraphprotoc · Dual-Engine Architecture (Base Sepolia + Solana Devnet)", fill=(100, 116, 139), font=font_sm)
    draw.text((width - 340, 605), "github.com/kellycryptos/SkyClaim", fill=accent_color, font=font_sm)

    out_path = os.path.join("public/social", filename)
    im.save(out_path, "PNG")
    print(f"Generated {out_path}")

create_card(
    filename="card2-consensus-engine.png",
    title="Real On-Chain Weather & Metal Filtering",
    subtitle="Live METAR Verification + CJEU Case C-502/18 Metal Enforcement",
    badge_text="UPDATE 2 · ON-CHAIN TRUTH & LEGAL TECH",
    details=[
        ("Telegraph Node Rail:", "http://13.237.89.59:7044 (HTTP 402 Challenge)", False),
        ("Miner & Observation:", "PREFLIGHT (20260828) -> METAR KJFK 231451Z VFR", True),
        ("BaseScan Tx Proof:", "0x39ce41ca6f9194af13d1955f68cd5bf901291ab5... ($0.01)", True),
        ("Operating Metal Filter:", "Excludes Delta metal ex-USA ($0 spent on DL401)", True),
        ("Contested Workflow:", "Wallentin-Hermann Art. 5(3) Challenge Notice", False)
    ],
    accent_color=(52, 211, 153),
    tag_text="DATE: NOV 20, 2026"
)

create_card(
    filename="card3-launch-and-testers.png",
    title="Dual-Engine Architecture is Live",
    subtitle="Flight Shield on Base + SolSettle Institutional Firewall on Solana",
    badge_text="UPDATE 3 · DUAL-ENGINE LAUNCH",
    details=[
        ("Engine 1 (Base Sepolia):", "Consumer Flight Shield (x402 Weather Telemetry)", False),
        ("Engine 2 (Solana):", "SolSettle Pre-Settlement Firewall (Live GLEIF + OFAC)", True),
        ("Solana Micropayments:", "Pay.sh SVM x402 Client (@x402/svm & @solana/kit)", True),
        ("Multi-Surface Access:", "Web Cockpit + Telegram Bot (@SkyClaimBot) + CLI", False),
        ("90-Second Quickstart:", "npm install && npm test (13/13 Suites Green)", True)
    ],
    accent_color=(168, 85, 247),
    tag_text="DATE: NOV 24, 2026"
)
