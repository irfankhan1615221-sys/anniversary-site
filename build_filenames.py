# Generates gallery.json WITHOUT external libraries.
# We will only include files whose names contain a date substring in the form YYYYMMDD.
# 1) Put all your photos in assets/images/
# 2) Run:  python build_filenames.py
# 3) Commit gallery.json and push to GitHub Pages

import json
import re
from pathlib import Path

IMAGES_DIR = Path('assets/images')
OUT = Path('gallery.json')
SUPPORT = {'.jpg','.jpeg','.png','.JPG','.JPEG','.PNG'}
DATE_RE = re.compile(r'(20\d{2})(\d{2})(\d{2})')

def main():
    files = []
    for p in IMAGES_DIR.iterdir():
        if p.suffix in SUPPORT and DATE_RE.search(p.name):
            files.append(p.name)
    # sort by the first YYYYMMDD match in the filename
    def key(name):
        m = DATE_RE.search(name)
        return m.group(0) if m else '99991231'
    files.sort(key=key)

    with OUT.open('w', encoding='utf-8') as f:
        json.dump(files, f, indent=2)
    print(f"Wrote {OUT} with {len(files)} dated filenames.")

if __name__ == '__main__':
    if not IMAGES_DIR.exists():
        print('Create assets/images and add your photos first.')
    else:
        main()
