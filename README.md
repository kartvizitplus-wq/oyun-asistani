# PickRadar

Mobile Legends ve Brawl Stars için çok dilli (TR, EN, ID, ES, PT) seçim ve item asistanı.

## Yapı
- `data/` oyun verileri (haftalık otomatik güncellenir, bkz. `UPDATING.md`)
- `src/` metinler (`i18n.json`), öneri motoru (`engine.js`), arayüz (`app.js`), stil
- `build.js` tüm sayfaları `dist/` klasörüne üretir (ek paket gerekmez)
- `config.json` site adı, alan adı, AdSense kimliği, iletişim e-postası

## Yayın (Cloudflare Pages)
- Build command: `node build.js`
- Build output directory: `dist`

## Alan adı ve reklam
`config.json` içinde:
- `baseUrl`: örn. `https://pickradar.com` (sitemap ve Google için gerekli)
- `adsenseClient`: AdSense onayından sonra `ca-pub-...` kimliği (ads.txt otomatik oluşur)
- `contactEmail`: Hakkında sayfasında görünecek adres
