// Rok v patičce
const rok = document.getElementById('rok');
if (rok) rok.textContent = new Date().getFullYear();

// Logo a „Nahoru“ – hlavička je přilepená, takže kotva #top by nikam neposunula
document.querySelectorAll('a[href="#top"]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  })
);

// Mobilní menu
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  const setOpen = open => {
    toggle.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
}

// Mapa až po kliknutí (do té doby se nic nenačítá od Googlu)
const mapLoad = document.getElementById('map-load');
if (mapLoad) {
  mapLoad.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.className = 'map';
    f.title = 'Mapa: Sebuzínská 8, Ústí nad Labem';
    f.src = 'https://maps.google.com/maps?q=Sebuz%C3%ADnsk%C3%A1%208%2C%20403%2021%20%C3%9Ast%C3%AD%20nad%20Labem&z=15&output=embed';
    document.getElementById('map').replaceWith(f);
  });
}

// Galerie – náhled ve velkém
const lightbox = document.getElementById('lightbox');
if (lightbox && lightbox.showModal) {
  const img = lightbox.querySelector('img');
  const caption = lightbox.querySelector('.lightbox__caption');
  document.querySelectorAll('.gallery__item a').forEach(a =>
    a.addEventListener('click', e => {
      e.preventDefault();
      const thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb.alt;
      caption.textContent = a.closest('figure').querySelector('figcaption')?.textContent || '';
      lightbox.showModal();
    })
  );
  lightbox.querySelector('.lightbox__close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
}

// Plovoucí tlačítko Zavolat – po odscrollování z úvodu, schované u kontaktu
const fab = document.querySelector('.call-fab');
const contact = document.getElementById('kontakt');
if (fab) {
  const updateFab = () => {
    const contactVisible = contact && contact.getBoundingClientRect().top < innerHeight;
    fab.classList.toggle('is-shown', scrollY > 500 && !contactVisible);
  };
  addEventListener('scroll', updateFab, { passive: true });
  updateFab();
}
