"""Convert generated images in public/media/generated/ to the web formats the site expects.

Usage:  python hologram/scripts/optimize_images.py
Needs:  pip install pillow
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]  # repo root
GEN = ROOT / "public" / "media" / "generated"
SRC_EXT = {".png", ".jpg", ".jpeg", ".webp"}


def main() -> None:
    files = [p for p in GEN.iterdir() if p.suffix.lower() in SRC_EXT and ".thumb" not in p.name]
    if not files:
        print(f"No images found in {GEN}")
        return
    for src in files:
        base = src.stem
        im = Image.open(src).convert("RGB")
        if base == "og-cover":
            og = im.resize((1200, 630), Image.LANCZOS)
            og.save(GEN / "og-cover.jpg", "JPEG", quality=86, optimize=True, progressive=True)
            print("og-cover.jpg")
            continue
        full = im.copy()
        full.thumbnail((1600, 1600), Image.LANCZOS)
        full.save(GEN / f"{base}.webp", "WEBP", quality=82, method=6)
        thumb = im.copy()
        thumb.thumbnail((520, 520), Image.LANCZOS)
        thumb.save(GEN / f"{base}.thumb.webp", "WEBP", quality=74, method=6)
        print(f"{base}.webp  ({full.width}x{full.height})")


if __name__ == "__main__":
    main()
