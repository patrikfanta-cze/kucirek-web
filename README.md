# Zámečnictví Milan Kučírek – web (koncept)

Statický web (HTML/CSS/JS) pro Zámečnictví Milan Kučírek, Ústí nad Labem – Brná.
Stránky: index (úvod + rozcestník), sluzby, galerie (generuje tools/build-galerie.js z hlavičky ochrana-osobnich-udaju.html), postup, o-nas, kontakt, ochrana-osobnich-udaju, 404. Hlavička a patička jsou v každém souboru zvlášť – při změně menu upravit všechny a znovu spustit build galerie.
Web: https://zamecnictvikucirek.cz/ (od 2026-10-30, DNS u WEDOS: 4× A + 4× AAAA na GitHub Pages, www CNAME; MX Google nechat)

## Údaje o klientovi
- Milan Kučírek, IČO 41333578, Sebuzínská 8, Brná, 403 21 Ústí nad Labem (ARES, živnost od 10. 8. 1992), plátce DPH
- Tel. 721 227 162, info@zamecnictvikucirek.cz (Google Workspace), FB facebook.com/ZamecnictviKucirek
- Doména zamecnictvikucirek.cz je registrovaná u WEDOS, web na ní je jen parkovací stránka

## Otevřené body
- Galerie (`galerie.html`, 8 záložek): fotky z FB alb + sdílené album Google Fotky „Zakázky“ od Ondřeje Kučírka (https://photos.app.goo.gl/Tvro6KWYwamKArpt8, 393 fotek k 2026-10-20). Nové fotky z alba: `node tools/stahni-google-fotky.js` (stáhne jen nové do img/fb/gp), vybrané zkopírovat do img/fb/all/<kategorie>-0<9999-poradi>.jpg (novější první) a `node tools/build-galerie.js --resize`. Fotky dílny nepoužívat. Obrázky na úvodu a O nás jsou pevné kopie v img/uvod/ a img/o-nas.jpg.
- Formulář zrušen (rozhodnutí klienta 2026-10-05): na Kontaktu je jen e-mail a telefon. Web3Forms se nepoužívá.
- Reklamace (reklamace.html): podle zákona + pozáruční servis na zavolání (klient 2026-10-05). Text není od právníka.
- Doby uchování v zásadách potvrzeny klientem (zákonné: poptávky 1 rok, zakázky 3 roky promlčení, účetnictví 10 let).
- GoatCounter: kód `kucirek`, web založený (4. 10. 2026), statistiky na kucirek.goatcounter.com, ověřeno že počítá.
- Texty k potvrzení klientem: služby (reklamní konstrukce = co přesně?), zaměření a montáž, povrchové úpravy, dílna v Brné na adrese sídla?.
- Vlastní doména zamecnictvikucirek.cz napojená 2026-10-30 (soubor CNAME v repu).
- Logo je ořez z FB titulní fotky (raster) – vyžádat vektor.

## Bezpečnost (přání klienta 2026-10-04)
- Žádné fotky dílny ani dvora (riziko vykradení). Vyřazené fotky jsou v img/fb/vyrazene (mimo repo).
- Adresa na webu jen „Ústí nad Labem“, žádná mapa. Působnost: hlavně severní Čechy, po domluvě i jinde.
- Výjimka: sídlo Sebuzínská 8 zůstává v patičce a v zásadách ochrany údajů – vyžaduje to § 435 OZ (identifikace podnikatele) a zásady GDPR. Odstranit jde jen se změnou sídla (např. virtuální sídlo).
