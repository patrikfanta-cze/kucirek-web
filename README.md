# Zámečnictví Milan Kučírek – web (koncept)

Statický web (HTML/CSS/JS) pro Zámečnictví Milan Kučírek, Ústí nad Labem – Brná.
Stránky: index (úvod + rozcestník), sluzby, galerie (generuje tools/build-galerie.js z hlavičky ochrana-osobnich-udaju.html), postup, o-nas, kontakt, ochrana-osobnich-udaju, 404. Hlavička a patička jsou v každém souboru zvlášť – při změně menu upravit všechny a znovu spustit build galerie.
Náhled: https://patrikfanta-cze.github.io/kucirek-web/

## Údaje o klientovi
- Milan Kučírek, IČO 41333578, Sebuzínská 8, Brná, 403 21 Ústí nad Labem (ARES, živnost od 10. 8. 1992), plátce DPH
- Tel. 721 227 162, info@zamecnictvikucirek.cz (Google Workspace), FB facebook.com/ZamecnictviKucirek
- Doména zamecnictvikucirek.cz je registrovaná u WEDOS, web na ní je jen parkovací stránka

## Otevřené body
- Galerie (`galerie.html`, 8 záložek podle služeb) má 106 fotek vybraných z FB alb klienta (2009–2025). Generuje ji `node tools/build-galerie.js` (s `--resize` znovu zmenší fotky z `img/fb/all/<kategorie>-*.jpg`, ty nejsou v repu). Klient použití fotek schválil (2026-10-04); originály ve vyšším rozlišení by se hodily.
- Web3Forms: klíč založit na info@zamecnictvikucirek.cz a doplnit `WEB3FORMS_KEY` v `js/main.js`. Do té doby formulář odkazuje na e-mail/telefon.
- GoatCounter: kód `kucirek`, web založený (4. 10. 2026), statistiky na kucirek.goatcounter.com, ověřeno že počítá.
- Texty k potvrzení klientem: služby (reklamní konstrukce = co přesně?), zaměření a montáž, povrchové úpravy, dílna v Brné na adrese sídla?, doby uchování v zásadách.
- Vlastní doména: URL je napevno v canonical, og:image, JSON-LD (index.html), robots.txt, sitemap.xml a `<base>` v 404.html.
- Logo je ořez z FB titulní fotky (raster) – vyžádat vektor.

## Bezpečnost (přání klienta 2026-10-04)
- Žádné fotky dílny ani dvora (riziko vykradení). Vyřazené fotky jsou v img/fb/vyrazene (mimo repo).
- Adresa na webu jen „Ústí nad Labem“, žádná mapa. Působnost: hlavně severní Čechy, po domluvě i jinde.
- Výjimka: sídlo Sebuzínská 8 zůstává v patičce a v zásadách ochrany údajů – vyžaduje to § 435 OZ (identifikace podnikatele) a zásady GDPR. Odstranit jde jen se změnou sídla (např. virtuální sídlo).
