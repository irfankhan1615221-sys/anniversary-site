# Anniversary Site (Filename-date version)

**No EXIF required.** We strictly use a **YYYYMMDD** substring inside each filename to sort photos chronologically. If a file **doesn’t** contain such a substring, it is **not included** (as requested). We also **remove visible dates** from the gallery and timeline; they’re just used for ordering.

## Quick start
1. Put **all your photos** into `assets/images/`.
2. Run:
   ```bash
   python build_filenames.py
   ```
   This writes `gallery.json` listing only files that contain a `YYYYMMDD` substring, already sorted.
3. Open `index.html` locally or push to GitHub Pages (Settings → Pages → Deploy from a branch → `main` /root).

## Add/edit sweet notes
Edit `script.js` → `DESCRIPTIONS` object. Keys are exact filenames, values have `{ caption, description }`.
Only items **with** descriptions appear in the **Timeline** (still sorted, with **no** date text shown).

## Optional music
Add `assets/audio/song.mp3` then uncomment the `<audio>` line in `index.html`.

## Local preview
```bash
python -m http.server 5500
# http://localhost:5500
```
