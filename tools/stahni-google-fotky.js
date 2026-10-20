// Stáhne všechny fotky ze sdíleného alba Google Fotek klienta do img/fb/gp/<id>.jpg (1600 px).
// Už stažené přeskočí, takže jde spouštět opakovaně, když klient fotky přidá.
//   node tools/stahni-google-fotky.js
const fs = require('fs'), path = require('path');
const SHARE = 'https://photos.app.goo.gl/Tvro6KWYwamKArpt8';
const OUT = path.join(__dirname, '..', 'img', 'fb', 'gp');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36';

const parseItems = arr => arr.filter(x => Array.isArray(x) && typeof x[0] === 'string' && Array.isArray(x[1]))
  .map(x => ({ id: x[0], url: x[1][0], w: x[1][1], h: x[1][2], ts: x[2] }));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const res = await fetch(SHARE, { headers: { 'User-Agent': UA } });
  const html = await res.text();
  const albumUrl = new URL(res.url);
  const albumId = albumUrl.pathname.split('/').pop();
  const key = albumUrl.searchParams.get('key');
  const s = html.indexOf("AF_initDataCallback({key: 'ds:1'");
  const d0 = html.indexOf('data:', s) + 5;
  const data = JSON.parse(html.slice(d0, html.indexOf(', sideChannel:', d0)));
  let items = parseItems(data[1]);
  let token = data[2];
  const total = (html.match(/"cUFC[\w-]*",2,(\d+),/) || [])[1];
  const bl = (html.match(/"cfb2h":"([^"]+)"/) || [])[1];
  const fsid = (html.match(/"FdrFJe":"(-?\d+)"/) || [])[1];

  while (token) {
    const freq = JSON.stringify([[['snAcKc', JSON.stringify([albumId, token, null, key]), null, 'generic']]]);
    const u = `https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=snAcKc&source-path=${encodeURIComponent(albumUrl.pathname)}&f.sid=${fsid}&bl=${bl}&hl=cs&rt=c`;
    const r = await fetch(u, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }, body: 'f.req=' + encodeURIComponent(freq) });
    const txt = await r.text();
    const line = txt.split('\n').find(l => l.includes('"snAcKc"'));
    if (!line) { console.error('Další stránku se nepodařilo načíst (HTTP ' + r.status + ')'); break; }
    const page = JSON.parse(JSON.parse(line)[0][2]);
    const more = parseItems(page[1] || []);
    items = items.concat(more);
    token = page[2];
    if (!more.length) break;
  }

  const uniq = [...new Map(items.map(i => [i.id, i])).values()];
  console.log(`Album: ${uniq.length} fotek${total ? ` (podle alba ${total})` : ''}`);
  fs.writeFileSync(path.join(OUT, 'list.json'), JSON.stringify(uniq));

  let n = 0;
  const todo = uniq.filter(i => !fs.existsSync(path.join(OUT, i.id + '.jpg')));
  const worker = async () => { for (let i; (i = todo.shift());) {
    const r = await fetch(i.url + '=w1600-h1600', { headers: { 'User-Agent': UA } });
    if (r.ok) { fs.writeFileSync(path.join(OUT, i.id + '.jpg'), Buffer.from(await r.arrayBuffer())); n++; }
    else console.error('Chyba', r.status, i.id);
  } };
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(`Nově staženo: ${n}`);
})();
