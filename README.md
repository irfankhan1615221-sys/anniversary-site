# Anniversary Site (Auto‑built Gallery + Timeline)

This site renders **all photos** in `assets/images` **chronologically** using EXIF metadata.
A separate **timeline** shows only the photos that have descriptions (special moments).

## How to use
1. Put **all your photos** into `assets/images/`.
2. (Optional) Open `build.py` and add more sweet notes in the `DESCRIPTIONS` dict using exact filenames.
3. Run the build script:
   ```bash
   python build.py
   ```
   This creates `gallery.json` (list of all photos with dates and any descriptions).
4. Open `index.html` locally or upload everything to a **public GitHub repository**.
5. Enable **GitHub Pages** (Settings → Pages → Deploy from a branch → `main` /root).

Your site will be at:
```
https://<your-username>.github.io/<repository-name>/
```

### Notes
- **Date source**: We use `DateTimeOriginal` (if present) → `DateTimeDigitized` → `DateTime` → file modified time as a last resort.
- **Formats supported**: `.jpg`, `.jpeg`, `.png`. (If you have HEIC, convert to JPG first.)
- **Filenames**: Keep them as‑is; if you rename a file, update `DESCRIPTIONS` if it has a special note.
- **Music**: Place `assets/audio/song.mp3` and uncomment the `<audio>` tag in `index.html`.

### Personalization already added
We pre‑filled descriptions for:
- `IMG_20250517_011051_540.jpg` (Otafest + first drag show + friends first)
- `IMG_20250714_091914_701.jpg` (Stampede concert + held the hem of my jacket)
- `20250907_143845.jpg` (First date: hand‑pulled noodles + LEGO)

### Local preview
```bash
python -m http.server 5500
# Visit http://localhost:5500
```
