// Sestaví galerie.html z fotek v img/galerie/<kategorie>/ (NN.jpg + NN-t.jpg náhled).
// Fotky připraví: node tools/build-galerie.js --resize (z img/fb/all/<kategorie>-*.jpg, potřebuje ffmpeg)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');

const cats = [
  ['brany', 'Brány a branky', 'Brány', 'Posuvné a křídlové brány, vstupní branky a mřížová vrata do domů.'],
  ['ploty', 'Ploty', 'Plot', 'Oplocení rodinných domů, firem i sportovišť z ocelových profilů, sítí a plechu.'],
  ['zabradli', 'Zábradlí', 'Zábradlí', 'Balkonová, schodišťová, střešní i ozdobná kovaná zábradlí.'],
  ['schodiste', 'Schodiště', 'Schodiště', 'Venkovní ocelová a úniková schodiště a stupně z pororoštů.'],
  ['mrize', 'Mříže', 'Mříž', 'Okenní a dveřní mříže, pevné i otevíravé.'],
  ['pristresky', 'Přístřešky a stříšky', 'Přístřešek', 'Stříšky nad vchody, pergoly a zastřešení nákladových ramp.'],
  ['reklama', 'Reklamní konstrukce', 'Reklamní konstrukce', 'Konstrukce pro reklamní poutače, bannery a firemní cedule.'],
  ['kovovyroba', 'Kovovýroba na zakázku', 'Kovovýroba', 'Nosiče kol, grily, ohniště, kontejnerová stání, nábytek a další atypické kusy.'],
];

if (process.argv.includes('--resize')) {
  const src = path.join(root, 'img/fb/all');
  for (const [id] of cats) {
    const dir = path.join(root, 'img/galerie', id);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const files = fs.readdirSync(src).filter(f => f.startsWith(id + '-')).sort();
    files.forEach((f, i) => {
      const n = String(i + 1).padStart(2, '0');
      const ff = (vf, out) => execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(src, f), '-vf', vf, '-q:v', '5', path.join(dir, out)]);
      ff("scale='min(1600,iw)':'min(1600,ih)':force_original_aspect_ratio=decrease", n + '.jpg');
      ff("scale=640:480:force_original_aspect_ratio=increase,crop=640:480", n + '-t.jpg');
    });
    console.log(id, files.length);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const privacy = fs.readFileSync(path.join(root, 'ochrana-osobnich-udaju.html'), 'utf8');
const head = privacy.slice(0, privacy.indexOf('<body>'))
  .replace(/<title>[^<]*<\/title>/, '<title>Realizace | Zámečnictví Milan Kučírek, Ústí nad Labem</title>')
  .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="Fotky realizací Zámečnictví Milan Kučírek: brány, ploty, zábradlí, schodiště, mříže, přístřešky, reklamní konstrukce a kovovýroba na zakázku.">');
const header = privacy.slice(privacy.indexOf("<body>"), privacy.indexOf("<main")).replace('<a href="galerie.html">', '<a href="galerie.html" aria-current="page">');
const foot = privacy.slice(privacy.indexOf('<footer'), privacy.indexOf('</footer>') + 9);

const tabs = [], panels = [];
for (const [id, title, alt, desc] of cats) {
  const dir = path.join(root, 'img/galerie', id);
  const nums = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^\d+\.jpg$/.test(f)).sort() : [];
  tabs.push(`        <button class="tab" role="tab" type="button" id="tab-${id}" data-tab="${id}" aria-controls="panel-${id}" aria-selected="false">${title}<span class="count">${nums.length}</span></button>`);
  panels.push(`    <section class="tabpanel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}">
      <h2>${title}</h2>
      <p>${desc}</p>
      <div class="photo-grid">
${nums.map((f, i) => `        <a href="img/galerie/${id}/${f}"><img src="img/galerie/${id}/${f.replace('.jpg', '-t.jpg')}" alt="${alt} – realizace ${i + 1}" loading="lazy" width="640" height="480"></a>`).join('\n')}
      </div>
    </section>`);
}

const html = `${head}${header}<main id="obsah">
  <section class="page-head">
    <div class="wrap">
      <p class="eyebrow">Ukázky práce</p>
      <h1>Realizace</h1>
      <p>Výběr zakázek z posledních let, roztříděný podle služeb. Vyberte si záložku a kliknutím fotku zvětšíte.</p>
    </div>
  </section>

  <div class="tabs-bar">
    <div class="wrap">
      <div class="tabs" role="tablist" aria-label="Kategorie realizací">
${tabs.join('\n')}
      </div>
    </div>
  </div>

  <div class="wrap gallery-page">
${panels.join('\n\n')}

    <div class="gallery-cta">
      <p>Líbí se vám něco podobného? Rádi vám připravíme nabídku.</p>
      <a class="btn" href="kontakt.html">Poptat zakázku</a>
    </div>
  </div>
</main>

${foot}

<dialog class="lightbox" id="lightbox" aria-label="Náhled fotky">
  <button class="lightbox__close" type="button" aria-label="Zavřít">×</button>
  <button class="lightbox__nav lightbox__prev" type="button" aria-label="Předchozí fotka">‹</button>
  <img alt="">
  <button class="lightbox__nav lightbox__next" type="button" aria-label="Další fotka">›</button>
  <p class="lightbox__caption"></p>
</dialog>

<script src="js/main.js?v=3"></script>
<script src="js/galerie.js?v=1"></script>
<!-- Anonymní měření návštěvnosti bez cookies (GoatCounter), skript hostovaný lokálně -->
<script data-goatcounter="https://kucirek.goatcounter.com/count" async src="js/count.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'galerie.html'), html);
console.log('galerie.html hotovo');
