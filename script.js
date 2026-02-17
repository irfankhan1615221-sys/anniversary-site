// Utilities
function formatDateISOToPretty(iso){
  try{
    const d = new Date(iso);
    const fmt = new Intl.DateTimeFormat(undefined, { year:'numeric', month:'long', day:'numeric' });
    return fmt.format(d);
  }catch(e){ return iso; }
}

// Build gallery and timeline from gallery.json
async function buildSite(){
  const grid = document.getElementById('galleryGrid');
  const timeline = document.getElementById('timeline');
  try{
    const res = await fetch('gallery.json', { cache: 'no-store' });
    const items = await res.json();

    // Build gallery
    items.forEach((it) => {
      const fig = document.createElement('figure');
      fig.className = 'gallery-item';
      fig.setAttribute('data-note', it.description || 'A favorite moment together.');
      fig.setAttribute('data-date', it.date_iso || '');

      const img = document.createElement('img');
      img.src = `assets/images/${it.filename}`;
      img.alt = it.alt || 'Memory photo';
      fig.appendChild(img);

      const cap = document.createElement('figcaption');
      cap.textContent = it.caption || formatDateISOToPretty(it.date_iso || '') || 'Memory';
      fig.appendChild(cap);

      grid.appendChild(fig);
    });

    // Build timeline - only items with descriptions
    items.filter(it => (it.description && it.description.trim().length>0)).forEach((it) =>{
      const wrap = document.createElement('div');
      wrap.className = 'tl-item';
      const dot = document.createElement('div');
      dot.className = 'tl-dot';
      const content = document.createElement('div');
      content.className = 'tl-content';
      const h3 = document.createElement('h3');
      h3.textContent = it.caption || 'A moment I treasure';
      const p = document.createElement('p');
      p.textContent = it.description;
      const date = document.createElement('div');
      date.className = 'tl-date';
      date.textContent = formatDateISOToPretty(it.date_iso || '');

      content.appendChild(h3);
      content.appendChild(p);
      content.appendChild(date);
      wrap.appendChild(dot);
      wrap.appendChild(content);
      timeline.appendChild(wrap);
    });

    // Hook up dialog after DOM is filled
    setupDialog();
  }catch(err){
    console.error('Failed to load gallery.json', err);
  }
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

// Kickoff
buildSite();
