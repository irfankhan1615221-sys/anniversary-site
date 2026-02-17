# Build script to generate gallery.json from images in assets/images
# Usage:
#   1) Put all your photos into assets/images
#   2) (Optional) Edit the DESCRIPTIONS dict below to add sweet notes per filename
#   3) Run:  python build.py
#   4) Commit files and enable GitHub Pages

import os, json
from datetime import datetime
from pathlib import Path
from PIL import Image, ExifTags

IMAGES_DIR = Path('assets/images')
OUTPUT_JSON = Path('gallery.json')

# Map for EXIF tag names
EXIF_DATETIME_KEYS = {'DateTimeOriginal', 'DateTimeDigitized', 'DateTime'}

# Add/extend your special descriptions here (filename -> description/caption)
DESCRIPTIONS = {
    'IMG_20250517_011051_540.jpg': {
        'caption': 'Otafest',
        'description': (
            'Otafest magic ✨ My first drag show—so much joy. Before we were “us”, '
            'we were friends, and I love that our story began with laughter, curiosity, '
            'and feeling completely at ease together.'
        )
    },
    'IMG_20250714_091914_701.jpg': {
        'caption': 'Our First Concert',
        'description': (
            'Stampede sounds & shy sparks. At our first concert, when you held the hem of '
            'my jacket instead of my hand—my heart knew. The gentlest little sign that you '
            'felt it too. 💞'
        )
    },
    '20250907_143845.jpg': {
        'caption': 'First Date Day',
        'description': (
            'Our first official date: hand‑pulled noodles → LEGO adventure. Peak “us” energy—'
            'ADHD‑brain detours, impulsive plans, and the best kind of whimsy. With you, every '
            'plan becomes an adventure. 🧡'
        )
    },
}

def extract_datetime_iso(path: Path) -> str:
    """Extract EXIF DateTimeOriginal (preferred) or fall back to mtime; return ISO string."""
    # Default to file modified time
    fallback = datetime.fromtimestamp(path.stat().st_mtime)
    date = fallback
    try:
        with Image.open(path) as img:
            exif = img.getexif()
            if exif:
                # Build a mapping from tag name to value
                label_map = { ExifTags.TAGS.get(tag, str(tag)): exif.get(tag) for tag in exif }
                for key in EXIF_DATETIME_KEYS:
                    if key in label_map and label_map[key]:
                        # EXIF date format: 'YYYY:MM:DD HH:MM:SS'
                        raw = str(label_map[key])
                        try:
                            date = datetime.strptime(raw, '%Y:%m:%d %H:%M:%S')
                            break
                        except Exception:
                            pass
    except Exception:
        pass
    # ISO 8601
    return date.strftime('%Y-%m-%dT%H:%M:%S')


def main():
    if not IMAGES_DIR.exists():
        print(f"Create {IMAGES_DIR} and add images first.")
        return

    items = []
    for fn in sorted(IMAGES_DIR.iterdir()):
        if fn.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
            continue
        iso = extract_datetime_iso(fn)
        meta = DESCRIPTIONS.get(fn.name, {})
        items.append({
            'filename': fn.name,
            'date_iso': iso,
            'caption': meta.get('caption'),
            'description': meta.get('description'),
        })

    # Sort by date ascending
    items.sort(key=lambda x: (x['date_iso'] or '9999'))

    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Wrote {OUTPUT_JSON} with {len(items)} items.")

if __name__ == '__main__':
    main()
