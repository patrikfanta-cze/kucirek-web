// Záložky galerie – aktivní záložka se řídí kotvou v adrese (galerie.html#ploty)
const tabs = [...document.querySelectorAll('.tab')];
const panels = [...document.querySelectorAll('.tabpanel')];

const show = (id, focus) => {
  const tab = tabs.find(t => t.dataset.tab === id) || tabs[0];
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;
  });
  panels.forEach(p => { p.hidden = p.id !== 'panel-' + tab.dataset.tab; });
  tab.scrollIntoView({ block: 'nearest', inline: 'center' });
  if (focus) tab.focus();
  return tab.dataset.tab;
};

tabs.forEach((t, i) => {
  t.addEventListener('click', () => {
    history.replaceState(null, '', '#' + show(t.dataset.tab));
  });
  t.addEventListener('keydown', e => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = tabs[(i + step + tabs.length) % tabs.length];
    history.replaceState(null, '', '#' + show(next.dataset.tab, true));
  });
});
show(location.hash.slice(1));
addEventListener('hashchange', () => show(location.hash.slice(1)));

// Náhled ve velkém s listováním v rámci záložky
const lb = document.getElementById('lightbox');
if (lb && lb.showModal) {
  const img = lb.querySelector('img');
  const cap = lb.querySelector('.lightbox__caption');
  let list = [], pos = 0;
  const open = i => {
    pos = (i + list.length) % list.length;
    const a = list[pos];
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    cap.textContent = `${pos + 1} / ${list.length}`;
  };
  document.querySelectorAll('.photo-grid a').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      list = [...a.closest('.photo-grid').querySelectorAll('a')];
      open(list.indexOf(a));
      lb.showModal();
    })
  );
  lb.querySelector('.lightbox__prev').addEventListener('click', () => open(pos - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => open(pos + 1));
  lb.querySelector('.lightbox__close').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') open(pos - 1);
    if (e.key === 'ArrowRight') open(pos + 1);
  });
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) open(pos + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}
