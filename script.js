// Dialog for photo notes
const dialog = document.getElementById('noteDialog');
const noteText = document.getElementById('noteText');
const closeDialogBtn = document.getElementById('closeDialogBtn');

// Open a sweet note when a gallery item is clicked
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const note = item.getAttribute('data-note') || "A favorite moment together.";
    noteText.textContent = note;
    if (typeof dialog?.showModal === 'function') {
      dialog.showModal();
    } else {
      alert(note); // Fallback for older browsers
    }
  });
});

closeDialogBtn?.addEventListener('click', () => dialog.close());

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
  try {
    if (!playing) {
      await audio.play();
      playing = true;
      playMusicBtn.textContent = 'Pause ♪';
    } else {
      audio.pause();
      playing = false;
      playMusicBtn.textContent = 'Play Our Song ♪';
    }
  } catch (e) {
    console.warn('Autoplay blocked until user interaction', e);
  }
});
