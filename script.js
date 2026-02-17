// Parse date strictly from filename substring YYYYMMDD; exclude if not found
function dateFromFilename(name){
  const m = name.match(/(20\d{2})(\d{2})(\d{2})/); // e.g., 20250816
  if(!m) return null;
  const [_, y, mo, d] = m;
  const iso = `${y}-${mo}-${d}T12:00:00`;
  return iso;
}

function formatPretty(iso){
  try{ return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'long',day:'numeric'}).format(new Date(iso)); }
  catch{ return ''; }
}

async function loadManifest(){
  const res = await fetch('gallery.json', { cache: 'no-store' });
  const data = await res.json();
  return data.map(x => (typeof x === 'string'? { filename:x } : x));
}

// Pre-filled sweet notes for key photos; add more entries by exact filename
const DESCRIPTIONS = {
  'IMG_20250517_011051_540.jpg': {
    caption: 'Otafest',
    description: 'Otafest magic ✨ My first drag show-so awesome! Before we were “us”, we were friends, and I love that our story began with laughter, curiosity, mutual thirst for anime mommies and feeling completely at ease together.'
  },
  'IMG_20250714_091914_701.jpg': {
    caption: 'Our First Concert',
    description: 'Stampede sounds & shy sparks. At our first concert, when you held the hem of my jacket instead of my hand... The gentlest little sign that you liked me. 💞'
  },
  '20250907_143845.jpg': {
    caption: 'First Date Day',
    description: 'Our first official date: hand‑pulled noodles → spontaneous LEGO adventure. Peak “us” energy—ADHD‑brain detours, impulsive plans, and the best kind of whimsy. With you, every plan becomes an adventure. 🧡'
  }
};

async function buildSite(){
  const files = await loadManifest();

  // Build list with filename-derived dates; EXCLUDE items without YYYYMMDD
  const items = files.map(f=>{
    const iso = dateFromFilename(f.filename);
    const meta = DESCRIPTIONS[f.filename] || {};
    return iso ? {
      filename: f.filename,
      date_iso: iso,
      caption: f.caption || meta.caption || null,
      description: f.description || meta.description || null
    } : null;
  }).filter(Boolean);

  // Sort chronologically by filename-derived date
  items.sort((a,b)=> a.date_iso.localeCompare(b.date_iso));

  // Render gallery (no visible dates on captions)
  const grid = document.getElementById('galleryGrid');
  items.forEach(it=>{
    const fig = document.createElement('figure');
    fig.className = 'gallery-item';
    fig.setAttribute('data-note', it.description || 'A favorite moment together.');
    fig.setAttribute('data-date', it.date_iso || '');

    const img = document.createElement('img');
    img.src = `assets/images/${it.filename}`;
    img.alt = it.caption || 'Memory photo';
    fig.appendChild(img);

    const cap = document.createElement('figcaption');
    cap.textContent = it.caption || 'Memory'; // no date shown
    fig.appendChild(cap);

    grid.appendChild(fig);
  });

  // Render timeline ONLY for items with descriptions (still sorted, no date text shown)
  const timeline = document.getElementById('timeline');
  items.filter(it=>it.description && it.description.trim()).forEach(it=>{
    const wrap = document.createElement('div'); wrap.className='tl-item';
    const dot = document.createElement('div'); dot.className='tl-dot';
    const content = document.createElement('div'); content.className='tl-content';
    const h3 = document.createElement('h3'); h3.textContent = it.caption || 'A moment I treasure';
    const p = document.createElement('p'); p.textContent = it.description;
    const d = document.createElement('div'); d.className='tl-date'; d.textContent = '';
    content.appendChild(h3); content.appendChild(p); content.appendChild(d);
    wrap.appendChild(dot); wrap.appendChild(content);
    timeline.appendChild(wrap);
  });

  setupDialog();
}

function setupDialog(){
  const dialog = document.getElementById('noteDialog');
  const noteText = document.getElementById('noteText');
  const closeDialogBtn = document.getElementById('closeDialogBtn');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const note = item.getAttribute('data-note') || 'A favorite moment together.';
      noteText.textContent = note;
      if (typeof dialog?.showModal === 'function') dialog.showModal();
      else alert(note);
    });
  });
  closeDialogBtn?.addEventListener('click', () => dialog.close());
}

// Reveal message
const revealBtn = document.getElementById('revealBtn');
const revealText = document.getElementById('revealText');
revealBtn?.addEventListener('click', () => {
  revealText.classList.remove('hidden');
  revealBtn.disabled = true;
  revealBtn.textContent = '❤️';
});

// Optional music controls (uncomment audio tag in HTML to use)
const audio = document.getElementById('bgm');
const playMusicBtn = document.getElementById('playMusicBtn');
let playing = false;
playMusicBtn?.addEventListener('click', async () => {
  try { if (!playing) { await audio.play(); playing = true; playMusicBtn.textContent = 'Pause ♪'; }
        else { audio.pause(); playing = false; playMusicBtn.textContent = 'Play Our Song ♪'; } }
  catch(e){ console.warn('Autoplay blocked until user interaction', e); }
});

buildSite();
