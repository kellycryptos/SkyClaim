"""
Generate balanced, multi-resolution favicons and brand icon assets for SkyClaim.
Features:
- Pure transparent RGBA corners (NO white rectangular artifact)
- Optically centered checkmark and airplane motif (12px balanced margins on all 4 sides)
- High-resolution 2048x2048 master supersampled down with Lanczos anti-aliasing
- Embedded multi-resolution favicon.ico containing 16x16, 32x32, 48x48, 64x64 frames
- Apple Touch Icon (180x180), Android / PWA icons (192x192, 512x512)
"""

import math
import os
from PIL import Image, ImageDraw, ImageFilter

def create_master_icon(size=2048):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    scale = size / 64.0

    # 1. Badge Base with Rounded Rectangle
    badge = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(badge)
    
    # Draw navy gradient on a separate layer
    grad = Image.new("RGBA", (size, size))
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2.0 * size)
            r = int(14 * (1 - t) + 4 * t)
            g = int(35 * (1 - t) + 10 * t)
            b = int(66 * (1 - t) + 20 * t)
            grad.putpixel((x, y), (r, g, b, 255))
            
    # Rounded mask
    mask = Image.new("L", (size, size), 0)
    mdraw = ImageDraw.Draw(mask)
    rx = int(14 * scale)
    mdraw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=rx, fill=255)
    
    # Composite gradient with mask
    im.paste(grad, (0, 0), mask)

    # Inner subtle stroke
    draw = ImageDraw.Draw(im)
    inset = int(1 * scale)
    inner_rx = int(13 * scale)
    draw.rounded_rectangle(
        [(inset, inset), (size - 1 - inset, size - 1 - inset)],
        radius=inner_rx,
        outline=(30, 58, 102, 160),
        width=int(1.2 * scale)
    )

    # 2. Centered Motif Coordinates
    # Original SVG was left-shifted by 3.5px on a 64px grid
    # Offset by +3.5 on X and +0.5 on Y brings all margins to ~12px
    offset_x = 3.5 * scale
    offset_y = 0.5 * scale

    # Glow layer for cyan checkmark
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    
    p0 = (int((12 * scale) + offset_x), int((38 * scale) + offset_y))
    p1 = (int((22 * scale) + offset_x), int((48 * scale) + offset_y))
    p2 = (int((26.4 * scale) + offset_x), int((48 * scale) + offset_y))
    p3 = (int((38 * scale) + offset_x), int((33 * scale) + offset_y))
    
    stroke_w = int(7 * scale)
    # Draw checkmark path
    gdraw.line([p0, p1, p2, p3], fill=(0, 212, 255, 240), width=stroke_w, joint="round")
    
    # Apply soft glow
    glow_blurred = glow.filter(ImageFilter.GaussianBlur(radius=int(2.5 * scale)))
    im = Image.alpha_composite(im, glow_blurred)
    
    # Draw crisp checkmark on top
    draw = ImageDraw.Draw(im)
    draw.line([p0, p1, p2, p3], fill=(0, 194, 255, 255), width=stroke_w, joint="round")

    # 3. Draw Airplane banking 45 degrees
    # Airplane center
    cx = (36 * scale) + offset_x
    cy = (26 * scale) + offset_y
    angle_rad = math.radians(45)

    def rot(lx, ly):
        # Rotate by 45 degrees around (0,0) and translate to (cx, cy)
        rx = lx * math.cos(angle_rad) - ly * math.sin(angle_rad)
        ry = lx * math.sin(angle_rad) + ly * math.cos(angle_rad)
        return (cx + rx, cy + ry)

    # Airplane layer
    plane = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(plane)

    # Fuselage: rounded capsule from y = -18 to y = +11, half-width = 3
    # Build polygon
    fuse_pts = []
    # Nose semicircle
    for deg in range(180, 360, 15):
        rad = math.radians(deg)
        fuse_pts.append(rot(3 * scale * math.cos(rad), -15 * scale + 3 * scale * math.sin(rad)))
    fuse_pts.append(rot(3 * scale, 8 * scale))
    fuse_pts.append(rot(1.8 * scale, 11 * scale))
    fuse_pts.append(rot(-1.8 * scale, 11 * scale))
    fuse_pts.append(rot(-3 * scale, 8 * scale))
    pdraw.polygon(fuse_pts, fill=(255, 255, 255, 255))

    # Main Wings: from x = -16 to +16, swept back
    wing_pts = [
        rot(-16 * scale, 2 * scale),
        rot(0, -5 * scale),
        rot(16 * scale, 2 * scale),
        rot(16 * scale, 5.5 * scale),
        rot(0, 0),
        rot(-16 * scale, 5.5 * scale),
    ]
    pdraw.polygon(wing_pts, fill=(255, 255, 255, 255))

    # Tail Fin: from x = -7 to +7
    tail_pts = [
        rot(-7 * scale, 9 * scale),
        rot(0, 6 * scale),
        rot(7 * scale, 9 * scale),
        rot(7 * scale, 11.5 * scale),
        rot(0, 9.5 * scale),
        rot(-7 * scale, 11.5 * scale),
    ]
    pdraw.polygon(tail_pts, fill=(255, 255, 255, 255))

    # Cockpit window (cyan ellipse)
    cockpit_center = rot(0, -12 * scale)
    c_rad_x = 1.2 * scale
    c_rad_y = 2.2 * scale
    cockpit_pts = []
    for deg in range(0, 360, 20):
        rad = math.radians(deg)
        cockpit_pts.append((
            cockpit_center[0] + c_rad_x * math.cos(rad) * math.cos(angle_rad) - c_rad_y * math.sin(rad) * math.sin(angle_rad),
            cockpit_center[1] + c_rad_x * math.cos(rad) * math.sin(angle_rad) + c_rad_y * math.sin(rad) * math.cos(angle_rad),
        ))
    pdraw.polygon(cockpit_pts, fill=(14, 165, 233, 230))

    im = Image.alpha_composite(im, plane)
    return im

def main():
    print("Generating 1024x1024 supersampled master...")
    master = create_master_icon(1024)

    # 1. Save 512x512 PWA Icon
    icon_512 = master.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save("public/icon-512.png", format="PNG")
    print("  ✓ Saved public/icon-512.png")

    # 2. Save 192x192 PWA Icon
    icon_192 = master.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save("public/icon-192.png", format="PNG")
    print("  ✓ Saved public/icon-192.png")

    # 3. Save 180x180 Apple Touch Icon (Transparent RGBA with balanced dark badge)
    icon_180 = master.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save("public/apple-touch-icon.png", format="PNG")
    print("  ✓ Saved public/apple-touch-icon.png")

    # 4. Multi-Resolution favicon.ico
    # Windows/Safari/Chrome standard resolutions: 16, 32, 48, 64
    f16 = master.resize((16, 16), Image.Resampling.LANCZOS)
    f32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    f48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    f64 = master.resize((64, 64), Image.Resampling.LANCZOS)

    # Save multi-size ICO
    f64.save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=[f16, f32, f48]
    )
    print("  ✓ Saved public/favicon.ico with multi-resolution frames (16, 32, 48, 64)")

    # Also mirror into app/ for native Next.js App Router support
    os.makedirs("app", exist_ok=True)
    f64.save(
        "app/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=[f16, f32, f48]
    )
    print("  ✓ Mirrored app/favicon.ico for Next.js App Router root detection")

if __name__ == "__main__":
    main()
