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

// Poptávkový formulář přes Web3Forms.
// Klíč musí být založený na e-mail klienta (info@zamecnictvikucirek.cz), dokud chybí, nabídne se e-mail.
const WEB3FORMS_KEY = '';
const MAIL = 'info@zamecnictvikucirek.cz';

const form = document.getElementById('poptavka');
if (form) {
  const status = form.querySelector('.form__status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const setStatus = (html, type) => {
    status.innerHTML = html;
    status.className = 'form__status' + (type ? ' is-' + type : '');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.botcheck.checked) return; // robot vyplnil skryté pole

    const jmeno = form.jmeno.value.trim();
    const telefon = form.telefon.value.trim();
    const email = form.email.value.trim();
    form.jmeno.classList.toggle('is-invalid', !jmeno);
    const noContact = !telefon && !email;
    form.telefon.classList.toggle('is-invalid', noContact);
    form.email.classList.toggle('is-invalid', noContact);
    if (!jmeno || noContact) {
      setStatus('Vyplňte prosím jméno a telefon nebo e-mail.', 'error');
      form.querySelector('.is-invalid').focus();
      return;
    }
    if (!form.consent.checked) {
      setStatus('Potvrďte prosím, že jste se seznámili se zpracováním osobních údajů.', 'error');
      form.consent.focus();
      return;
    }

    const subject = `Poptávka z webu: ${form.sluzba.value}`;
    const body = `${form.zprava.value.trim()}\n\n${jmeno}\n${telefon}\n${email}`;
    const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const fallback = `Napište nám prosím přímo na <a href="${mailto}">${MAIL}</a> nebo zavolejte <a href="tel:+420721227162">721 227 162</a>.`;

    if (!WEB3FORMS_KEY) {
      setStatus(`Formulář zatím není napojený. ${fallback}`, 'error');
      return;
    }

    submitBtn.disabled = true;
    setStatus('Odesílám…');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: 'Web Zámečnictví Kučírek',
          ...(email ? { replyto: email } : {}),
          Jméno: jmeno,
          Telefon: telefon,
          'E-mail': email,
          Služba: form.sluzba.value,
          Zpráva: form.zprava.value.trim()
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      form.reset();
      setStatus('Děkujeme, poptávka dorazila. Ozveme se co nejdřív.', 'ok');
    } catch {
      setStatus(`Odeslání se nepovedlo. ${fallback}`, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
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
