// Scroll reveals, portrait interaction and Discord copy button.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('in-view'));
}

// Slight pointer parallax for the portrait on devices with a fine pointer.
const portrait = document.querySelector('.portrait-frame');
const stage = document.querySelector('.portrait-stage');
if (portrait && stage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  stage.addEventListener('pointermove', event => {
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.transform = `translate(${x * 7}px, ${y * 7}px) rotate(${2 + x * 2}deg)`;
  });
  stage.addEventListener('pointerleave', () => { portrait.style.transform = ''; });
}

// Discord has no public profile link, so the username is copied on click.
document.querySelectorAll('[data-copy]').forEach(btn => {
  const hint = btn.querySelector('.copy-hint');
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const t = document.createElement('textarea');
      t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (_) {}
      t.remove();
    }
    btn.classList.add('copied');
    if (hint) hint.textContent = 'COPIED ✓';
    setTimeout(() => { btn.classList.remove('copied'); if (hint) hint.textContent = 'COPY'; }, 1800);
  });
});
