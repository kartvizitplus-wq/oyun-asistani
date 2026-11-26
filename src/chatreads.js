/* Chat Reads · read a book together with your live chat (PickRadar)
   Normal mode: type the next word of the page; it turns from faded grey to ink.
   LIVE mode (?live=1): the streamer loads a book (EPUB / TXT, it stays on their computer) and viewers reveal it by
   commenting its words: the next word in order (default) or any word on the page. Every finished page waits a few
   seconds so the streamer can read it aloud. Gift effects are fixed and written on screen; nothing is random. */
(function (global) {
'use strict';

const LANG = {
 en: { name: 'Chat Reads', sub: 'Read Together LIVE', intro: 'The words on the page are faded. Type the next word and it turns to ink, word by word, page by page. Use the sample story or load your own book (EPUB or TXT); it never leaves your device.', demo: 'Sample story', upload: 'Load a book (EPUB / TXT)', paste: 'Paste text', pastePh: 'Paste the text you want to read…', load: 'Load', cont: 'Continue: {t} · page {n}', page: 'Page {n}/{t}', typePh: 'Type the next word…', wpm: 'words/min', streak: 'streak', done: 'PAGE DONE', end: 'The end! 🎉', again: 'Read again', books: 'Books', readErr: 'This file could not be read. Try an EPUB or TXT file without DRM.', tooBig: 'Large book: only the first part was saved for next time.', pd: 'Please do not show the full text of copyrighted books on stream. Free public-domain books: Wikisource, Project Gutenberg.', next: 'Next page', prev: 'Previous', you: 'you', menu: 'Menu', by: 'by', loading: 'Loading…' },
 tr: { name: 'Chat Reads', sub: 'Sohbetle Kitap Okuma', intro: 'Sayfadaki kelimeler silik. Sıradaki kelimeyi yaz, mürekkebe dönüşsün; kelime kelime, sayfa sayfa. Örnek hikâyeyle başla ya da kendi kitabını yükle (EPUB ya da TXT); dosya cihazından çıkmaz.', demo: 'Örnek hikâye', upload: 'Kitap yükle (EPUB / TXT)', paste: 'Metin yapıştır', pastePh: 'Okumak istediğin metni buraya yapıştır…', load: 'Yükle', cont: 'Devam et: {t} · {n}. sayfa', page: 'Sayfa {n}/{t}', typePh: 'Sıradaki kelimeyi yaz…', wpm: 'kelime/dk', streak: 'seri', done: 'SAYFA TAMAMLANDI', end: 'Kitap bitti! 🎉', again: 'Yeniden oku', books: 'Kitaplar', readErr: 'Bu dosya okunamadı. DRM korumasız bir EPUB ya da TXT dosyası dene.', tooBig: 'Kitap büyük: sonraki sefer için yalnızca ilk kısmı kaydedildi.', pd: 'Telif hakkı süren kitapların tamamını yayında gösterme. Telifsiz ücretsiz kitaplar: Vikikaynak, Project Gutenberg.', next: 'Sonraki sayfa', prev: 'Önceki', you: 'sen', menu: 'Menü', by: 'açan', loading: 'Yükleniyor…' },
 es: { name: 'Chat Reads', sub: 'Lectura en Vivo con el Chat', intro: 'Las palabras de la página están desvaídas. Escribe la siguiente palabra y se vuelve tinta, palabra a palabra, página a página. Usa el cuento de ejemplo o carga tu propio libro (EPUB o TXT); nunca sale de tu dispositivo.', demo: 'Cuento de ejemplo', upload: 'Cargar libro (EPUB / TXT)', paste: 'Pegar texto', pastePh: 'Pega aquí el texto que quieres leer…', load: 'Cargar', cont: 'Seguir: {t} · página {n}', page: 'Página {n}/{t}', typePh: 'Escribe la siguiente palabra…', wpm: 'palabras/min', streak: 'racha', done: 'PÁGINA COMPLETA', end: '¡Fin del libro! 🎉', again: 'Leer otra vez', books: 'Libros', readErr: 'No se pudo leer el archivo. Prueba un EPUB o TXT sin DRM.', tooBig: 'Libro grande: solo se guardó la primera parte para la próxima vez.', pd: 'No muestres en directo el texto completo de libros con derechos de autor. Libros libres y gratis: Wikisource, Project Gutenberg.', next: 'Página siguiente', prev: 'Anterior', you: 'tú', menu: 'Menú', by: 'por', loading: 'Cargando…' },
 pt: { name: 'Chat Reads', sub: 'Leitura ao Vivo com o Chat', intro: 'As palavras da página estão apagadas. Digite a próxima palavra e ela vira tinta, palavra por palavra, página por página. Use o conto de exemplo ou carregue o seu livro (EPUB ou TXT); o arquivo nunca sai do seu aparelho.', demo: 'Conto de exemplo', upload: 'Carregar livro (EPUB / TXT)', paste: 'Colar texto', pastePh: 'Cole aqui o texto que você quer ler…', load: 'Carregar', cont: 'Continuar: {t} · página {n}', page: 'Página {n}/{t}', typePh: 'Digite a próxima palavra…', wpm: 'palavras/min', streak: 'sequência', done: 'PÁGINA CONCLUÍDA', end: 'Fim do livro! 🎉', again: 'Ler de novo', books: 'Livros', readErr: 'Não foi possível ler o arquivo. Tente um EPUB ou TXT sem DRM.', tooBig: 'Livro grande: só a primeira parte foi salva para a próxima vez.', pd: 'Não mostre na live o texto completo de livros com direitos autorais. Livros livres e grátis: Wikisource, Project Gutenberg.', next: 'Próxima página', prev: 'Anterior', you: 'você', menu: 'Menu', by: 'por', loading: 'Carregando…' },
 id: { name: 'Chat Reads', sub: 'Baca Bareng Chat', intro: 'Kata-kata di halaman masih pudar. Ketik kata berikutnya dan kata itu menjadi tinta, kata demi kata, halaman demi halaman. Pakai cerita contoh atau muat bukumu sendiri (EPUB atau TXT); file tidak pernah keluar dari perangkatmu.', demo: 'Cerita contoh', upload: 'Muat buku (EPUB / TXT)', paste: 'Tempel teks', pastePh: 'Tempel teks yang ingin kamu baca…', load: 'Muat', cont: 'Lanjut: {t} · halaman {n}', page: 'Halaman {n}/{t}', typePh: 'Ketik kata berikutnya…', wpm: 'kata/mnt', streak: 'beruntun', done: 'HALAMAN SELESAI', end: 'Buku selesai! 🎉', again: 'Baca lagi', books: 'Buku', readErr: 'File ini tidak bisa dibaca. Coba file EPUB atau TXT tanpa DRM.', tooBig: 'Buku besar: hanya bagian awal yang disimpan untuk lain kali.', pd: 'Jangan tampilkan seluruh teks buku berhak cipta di siaran. Buku domain publik gratis: Wikisource, Project Gutenberg.', next: 'Halaman berikutnya', prev: 'Sebelumnya', you: 'kamu', menu: 'Menu', by: 'oleh', loading: 'Memuat…' }
};

const LIVE_CR = {
 en: { boxL: "Hidden boxes per page", prizeL: "Box prizes (one per line, given in order)", prizeN: "Prizes must not be money, gifts or coins — only fun and recognition. Only comments can open boxes.", found: "🎁 @{u} found a hidden box!", prizeW: "Prize", boxLeg: "🎁 Hidden boxes on this page! Open the box word with a comment to win. Gifts can’t open boxes.", boxBy: "Box found by @{u}", pz: "I’ll read your comment out loud 🎙️\nYou pick the next chapter 📖\nShout-out on stream 📣\nYou suggest the next book 📚", off: "Off", rankH: "This stream", lead: "👑 @{u} takes the lead!", badgeUp: "@{u} is now {b}!", rankL: "Show ranking, badges and lead changes", b1: "Reader", b2: "Bookworm", b3: "Librarian", legRank: "🏆 Top 3 of this stream · badges at 10 / 50 / 100 words", nextL: 'NEXT WORD', freeL: 'Comment any word on this page', leftN: '{n} words left', legSeq: 'Comment the next word → it turns to ink', legFree: 'Comment words from the page → they turn to ink', g1: '🎁 Any gift: the next 3 words open', g2: '⭐ {c}+: the rest of the sentence opens', fair: 'Gift effects are fixed. Words you open carry your name.', worms: 'Bookworms', support: 'This page is supported by @{u} ❤', topBy: 'Most words: @{u}', readAloud: 'Reading aloud…', nextIn: 'Next page in {s}', joined: '@{u} joined the reading', opened: '@{u} opened {n} words', note: 'Simulation mode: this page is not connected to a live stream. All events here are test events made by you or by Auto demo.', obsNote: 'Add as a browser source at 1080 × 1920. Without a connection the output plays a DEMO.', obsNoteNet: 'Add as a browser source at 1080 × 1920. The page reacts to your real chat and donations.', auto: 'Auto demo: fake viewers (shown as DEMO on stream)', cfgH: 'Reading settings', bookH: 'Book', modeL: 'Mode', mSeq: 'In order (next word)', mFree: 'Free (any word on the page)', stopL: 'Small words (and, the, of…) open by themselves', skipL: 'Skip a stuck word after (seconds, 0 = off)', doneL: 'Pause after each page (seconds)', wppL: 'Words per page', starC: 'Coins to open a sentence', jump: 'Go to page', popBtn: '🪟 Open stream window', popN: 'Capture this window in OBS or LIVE Studio (Window capture). It uses the same book and connection.', obsBook: 'Uploaded books stay in this browser. In an OBS browser source: right-click the source → Interact, and load the book there once.', loaderH: 'Load the book for the stream', sRight: 'Right word', sWrong: 'Other comment', cur: 'Now reading', lgH: "League table (season)", lgOn: "Show the league table on stream (right side)", lgNL: "Rows on screen", lgPL: "Period on screen", pRot: "Rotate (every 10 s)", pLive: "This stream", pW: "This week", pM: "This month", pY: "This year", pS: "Season", pChamp: "Champions", lgDef: "Reading League", namePh: "League name (e.g. Book Club League)", sponPh: "Sponsor (optional, e.g. City Bookstore)", logoPh: "Sponsor logo link (https, optional)", pzW: "Prize for #1 of the week", pzM: "Prize for #1 of the month", pzY: "Prize for #1 of the year", przLine: "🏆 #1 wins: {p}", spon: "Sponsor: {s}", lastW: "Last week", lastM: "Last month", lastY: "Last year", lgFoot: "1 word by comment = 1 pt · box +5 · gifts give no points", lgEmpty: "No points yet. Comment the next word!", lgNote: "Points are saved only with a real stream connection, never in simulation or demo. The table lives in the browser where the game runs: stream with “Open stream window” so this panel and your stream share one table. An OBS browser source is a separate browser with its own table.", pzNote: "You choose and give the prizes. Points come only from comments; gifts never give points, so nobody can buy first place.", bk: "📥 Download backup", rs: "📤 Load backup", png: "🖼️ Save table as image", reset: "🗑️ Start a new season", resetQ: "Sure? Click again to erase the season", rsOk: "League backup loaded", rsBad: "This is not a Chat Reads league backup.", lgStat: "{n} readers this season · since {d}", lgRec: "● This window is recording the league", lgFol: "✓ The stream window is recording; this panel shows its table", lgTest: "Test mode: points are not saved", demoTag: "TEST", pts: "pts", share: "🔗 Copy league link", shareN: "The link carries the table as it is right now. Put it in your bio, Discord or video description; anyone who opens it sees the table on pickradar.net. Copy it again to share new points.", shareOk: "Copied!", vSub: "Chat Reads league", vAt: "Table from {d}", vNote: "Shared by the streamer. PickRadar does not check these results.", vPlay: "▶ Read it yourself", vOwn: "🏆 Start your own league", vBad: "This league link could not be opened.", vSince: "Season since {d}" },
 tr: { boxL: "Gizli kutu (sayfa başına)", prizeL: "Kutu ödülleri (her satıra bir tane, sırayla verilir)", prizeN: "Ödüller para, hediye ya da jeton olmamalı: sadece eğlence ve tanınma. Kutuları yalnızca yorumlar açar.", found: "🎁 @{u} gizli kutuyu buldu!", prizeW: "Ödül", boxLeg: "🎁 Bu sayfada gizli kutu var! Kutulu kelimeyi yorumla açan ödülü kazanır. Hediyeler kutu açmaz.", boxBy: "Kutuyu bulan: @{u}", pz: "Yorumunu sesli okuyacağım 🎙️\nSonraki bölümü sen seçiyorsun 📖\nYayında seni selamlayacağım 📣\nBir sonraki kitabı sen öneriyorsun 📚", off: "Kapalı", rankH: "Bu yayın", lead: "👑 @{u} zirveye çıktı!", badgeUp: "@{u} artık {b}!", rankL: "Sıralama, rozet ve zirve duyurularını göster", b1: "Okur", b2: "Kitap Kurdu", b3: "Kütüphaneci", legRank: "🏆 Bu yayının ilk 3'ü · 10 / 50 / 100 kelimede rozet", nextL: 'SIRADAKİ KELİME', freeL: 'Sayfadaki herhangi bir kelimeyi yaz', leftN: '{n} kelime kaldı', legSeq: 'Sıradaki kelimeyi yoruma yaz → mürekkebe dönsün', legFree: 'Sayfadaki kelimeleri yoruma yaz → mürekkebe dönsün', g1: '🎁 Her hediye: sonraki 3 kelime açılır', g2: '⭐ {c}+: cümlenin geri kalanı açılır', fair: 'Hediyelerin etkisi sabittir. Açtığın kelimede adın yazar.', worms: 'Kitap Kurtları', support: 'Bu sayfayı @{u} destekledi ❤', topBy: 'En çok kelime: @{u}', readAloud: 'Sesli okunuyor…', nextIn: 'Sonraki sayfa {s} sn sonra', joined: '@{u} okumaya katıldı', opened: '@{u} {n} kelime açtı', note: 'Simülasyon modu: bu sayfa bir canlı yayına bağlı değil. Buradaki tüm olaylar senin ya da otomatik demonun ürettiği test olaylarıdır.', obsNote: 'OBS ya da LIVE Studio\'ya 1080 × 1920 tarayıcı kaynağı olarak ekle. Bağlantı yoksa yayında DEMO oynar.', obsNoteNet: 'OBS ya da LIVE Studio\'ya 1080 × 1920 tarayıcı kaynağı olarak ekle. Sayfa gerçek sohbetine ve bağışlarına tepki verir.', auto: 'Otomatik demo: sahte izleyiciler (yayında DEMO yazar)', cfgH: 'Okuma ayarları', bookH: 'Kitap', modeL: 'Mod', mSeq: 'Sıralı (sıradaki kelime)', mFree: 'Serbest (sayfadaki her kelime)', stopL: 'Küçük kelimeler (ve, bir, da…) kendiliğinden açılsın', skipL: 'Takılan kelimeyi atla (saniye, 0 = kapalı)', doneL: 'Her sayfa sonunda bekle (saniye)', wppL: 'Sayfa başına kelime', starC: 'Cümle açmak için jeton', jump: 'Sayfaya git', popBtn: '🪟 Yayın penceresini aç', popN: 'Bu pencereyi OBS ya da LIVE Studio\'da Pencere Yakalama ile ekle. Aynı kitabı ve bağlantıyı kullanır.', obsBook: 'Yüklediğin kitap bu tarayıcıda kalır. OBS tarayıcı kaynağında: kaynağa sağ tıkla → Etkileşim, kitabı orada bir kez yükle.', loaderH: 'Yayın için kitabı yükle', sRight: 'Doğru kelime', sWrong: 'Başka yorum', cur: 'Okunan kitap', lgH: "Lig tablosu (sezon)", lgOn: "Lig tablosunu yayında göster (sağ tarafta)", lgNL: "Ekrandaki sıra sayısı", lgPL: "Ekranda gösterilen dönem", pRot: "Sırayla değişsin (10 sn)", pLive: "Bu yayın", pW: "Bu hafta", pM: "Bu ay", pY: "Bu yıl", pS: "Sezon", pChamp: "Şampiyonlar", lgDef: "Okuma Ligi", namePh: "Lig adı (ör. Kitap Kulübü Ligi)", sponPh: "Sponsor (isteğe bağlı, ör. Şehir Kitabevi)", logoPh: "Sponsor logo linki (https, isteğe bağlı)", pzW: "Haftanın 1.'sinin ödülü", pzM: "Ayın 1.'sinin ödülü", pzY: "Yılın 1.'sinin ödülü", przLine: "🏆 1.'nin ödülü: {p}", spon: "Sponsor: {s}", lastW: "Geçen hafta", lastM: "Geçen ay", lastY: "Geçen yıl", lgFoot: "Yorumla açılan kelime = 1 puan · kutu +5 · hediye puan vermez", lgEmpty: "Henüz puan yok. Sıradaki kelimeyi yaz!", lgNote: "Puanlar yalnızca gerçek yayın bağlantısında kaydedilir; simülasyon ve demoda kaydedilmez. Tablo, oyunun çalıştığı tarayıcıda tutulur: yayını “Yayın penceresini aç” ile yaparsan bu panel ve yayın aynı tabloyu görür. OBS tarayıcı kaynağı ayrı bir tarayıcıdır, kendi tablosunu tutar.", pzNote: "Ödülleri sen belirler, sen verirsin. Puan sadece yorumdan gelir; hediye asla puan vermez, kimse birinciliği satın alamaz.", bk: "📥 Yedeği indir", rs: "📤 Yedek yükle", png: "🖼️ Tabloyu resim olarak kaydet", reset: "🗑️ Yeni sezon başlat", resetQ: "Emin misin? Sezonu silmek için tekrar bas", rsOk: "Lig yedeği yüklendi", rsBad: "Bu dosya bir Chat Reads lig yedeği değil.", lgStat: "Sezonda {n} okur · başlangıç {d}", lgRec: "● Ligi bu pencere kaydediyor", lgFol: "✓ Ligi yayın penceresi kaydediyor; bu panel onun tablosunu gösterir", lgTest: "Test modu: puanlar kaydedilmez", demoTag: "TEST", pts: "puan", share: "🔗 Lig linkini kopyala", shareN: "Link, tablonun şu anki hâlini taşır. Bio'na, Discord'una ya da video açıklamana koy; açan herkes tabloyu pickradar.net'te görür. Yeni puanlar için linki tekrar kopyala.", shareOk: "Kopyalandı!", vSub: "Chat Reads ligi", vAt: "{d} tarihli tablo", vNote: "Bu tabloyu yayıncı paylaştı. PickRadar sonuçları doğrulamaz.", vPlay: "▶ Sen de oku", vOwn: "🏆 Kendi ligini kur", vBad: "Bu lig linki açılamadı.", vSince: "Sezon başlangıcı {d}" },
 es: { boxL: "Cajas ocultas por página", prizeL: "Premios de las cajas (uno por línea, en orden)", prizeN: "Los premios no deben ser dinero, regalos ni monedas: solo diversión y reconocimiento. Solo los comentarios abren cajas.", found: "🎁 ¡@{u} encontró una caja oculta!", prizeW: "Premio", boxLeg: "🎁 ¡Hay cajas ocultas en esta página! Abre la palabra con un comentario para ganar. Los regalos no abren cajas.", boxBy: "Caja encontrada por @{u}", pz: "Leeré tu comentario en voz alta 🎙️\nEliges el siguiente capítulo 📖\nSaludo en directo 📣\nPropones el próximo libro 📚", off: "No", rankH: "Este directo", lead: "👑 ¡@{u} toma la delantera!", badgeUp: "¡@{u} ahora es {b}!", rankL: "Mostrar clasificación, insignias y cambios de líder", b1: "Lector", b2: "Ratón de biblioteca", b3: "Bibliotecario", legRank: "🏆 Top 3 de este directo · insignias a las 10 / 50 / 100 palabras", nextL: 'SIGUIENTE PALABRA', freeL: 'Comenta cualquier palabra de la página', leftN: 'quedan {n} palabras', legSeq: 'Comenta la siguiente palabra → se vuelve tinta', legFree: 'Comenta palabras de la página → se vuelven tinta', g1: '🎁 Cualquier regalo: se abren las 3 palabras siguientes', g2: '⭐ {c}+: se abre el resto de la frase', fair: 'Los regalos tienen efectos fijos. Las palabras que abres llevan tu nombre.', worms: 'Ratones de biblioteca', support: 'Esta página la apoya @{u} ❤', topBy: 'Más palabras: @{u}', readAloud: 'Lectura en voz alta…', nextIn: 'Siguiente página en {s}', joined: '@{u} se unió a la lectura', opened: '@{u} abrió {n} palabras', note: 'Modo simulación: esta página no está conectada a un directo. Todos los eventos son de prueba, tuyos o de la demo automática.', obsNote: 'Añádelo como fuente de navegador de 1080 × 1920. Sin conexión se muestra una DEMO.', obsNoteNet: 'Añádelo como fuente de navegador de 1080 × 1920. La página reacciona a tu chat y donaciones reales.', auto: 'Demo automática: espectadores falsos (se ve DEMO en el directo)', cfgH: 'Ajustes de lectura', bookH: 'Libro', modeL: 'Modo', mSeq: 'En orden (siguiente palabra)', mFree: 'Libre (cualquier palabra de la página)', stopL: 'Las palabras cortas (y, el, de…) se abren solas', skipL: 'Saltar una palabra atascada tras (segundos, 0 = no)', doneL: 'Pausa tras cada página (segundos)', wppL: 'Palabras por página', starC: 'Monedas para abrir una frase', jump: 'Ir a la página', popBtn: '🪟 Abrir ventana del directo', popN: 'Captura esta ventana en OBS o LIVE Studio (Captura de ventana). Usa el mismo libro y conexión.', obsBook: 'Los libros cargados se quedan en este navegador. En una fuente de navegador de OBS: clic derecho → Interactuar y carga el libro allí una vez.', loaderH: 'Carga el libro para el directo', sRight: 'Palabra correcta', sWrong: 'Otro comentario', cur: 'Leyendo ahora', lgH: "Tabla de liga (temporada)", lgOn: "Mostrar la tabla de liga en el directo (a la derecha)", lgNL: "Filas en pantalla", lgPL: "Periodo en pantalla", pRot: "Rotar (cada 10 s)", pLive: "Este directo", pW: "Esta semana", pM: "Este mes", pY: "Este año", pS: "Temporada", pChamp: "Campeones", lgDef: "Liga de Lectura", namePh: "Nombre de la liga (p. ej. Liga del Club de Lectura)", sponPh: "Patrocinador (opcional, p. ej. Librería Central)", logoPh: "Enlace del logo del patrocinador (https, opcional)", pzW: "Premio para el n.º 1 de la semana", pzM: "Premio para el n.º 1 del mes", pzY: "Premio para el n.º 1 del año", przLine: "🏆 El n.º 1 gana: {p}", spon: "Patrocina: {s}", lastW: "Semana pasada", lastM: "Mes pasado", lastY: "Año pasado", lgFoot: "Palabra por comentario = 1 pt · caja +5 · los regalos no dan puntos", lgEmpty: "Aún no hay puntos. ¡Comenta la siguiente palabra!", lgNote: "Los puntos solo se guardan con una conexión real al directo, nunca en simulación o demo. La tabla vive en el navegador donde corre el juego: transmite con «Abrir ventana del directo» para que este panel y tu directo compartan la misma tabla. Una fuente de navegador de OBS es otro navegador con su propia tabla.", pzNote: "Tú eliges y das los premios. Los puntos solo vienen de comentarios; los regalos nunca dan puntos, así nadie puede comprar el primer puesto.", bk: "📥 Descargar copia", rs: "📤 Cargar copia", png: "🖼️ Guardar tabla como imagen", reset: "🗑️ Empezar nueva temporada", resetQ: "¿Seguro? Pulsa otra vez para borrar la temporada", rsOk: "Copia de la liga cargada", rsBad: "Este archivo no es una copia de liga de Chat Reads.", lgStat: "{n} lectores en la temporada · desde {d}", lgRec: "● Esta ventana registra la liga", lgFol: "✓ La ventana del directo registra la liga; este panel muestra su tabla", lgTest: "Modo prueba: los puntos no se guardan", demoTag: "PRUEBA", pts: "pts", share: "🔗 Copiar enlace de la liga", shareN: "El enlace lleva la tabla tal como está ahora. Ponlo en tu bio, Discord o descripción; quien lo abra verá la tabla en pickradar.net. Vuelve a copiarlo para compartir puntos nuevos.", shareOk: "¡Copiado!", vSub: "Liga de Chat Reads", vAt: "Tabla del {d}", vNote: "Compartida por el streamer. PickRadar no verifica estos resultados.", vPlay: "▶ Léelo tú también", vOwn: "🏆 Crea tu propia liga", vBad: "No se pudo abrir este enlace de liga.", vSince: "Temporada desde {d}" },
 pt: { boxL: "Caixas escondidas por página", prizeL: "Prêmios das caixas (um por linha, em ordem)", prizeN: "Os prêmios não podem ser dinheiro, presentes ou moedas: só diversão e reconhecimento. Só comentários abrem caixas.", found: "🎁 @{u} achou uma caixa escondida!", prizeW: "Prêmio", boxLeg: "🎁 Há caixas escondidas nesta página! Abra a palavra com um comentário para ganhar. Presentes não abrem caixas.", boxBy: "Caixa achada por @{u}", pz: "Vou ler seu comentário em voz alta 🎙️\nVocê escolhe o próximo capítulo 📖\nSalve na live 📣\nVocê sugere o próximo livro 📚", off: "Não", rankH: "Esta live", lead: "👑 @{u} assume a liderança!", badgeUp: "@{u} agora é {b}!", rankL: "Mostrar ranking, selos e trocas de liderança", b1: "Leitor", b2: "Traça de livro", b3: "Bibliotecário", legRank: "🏆 Top 3 desta live · selos com 10 / 50 / 100 palavras", nextL: 'PRÓXIMA PALAVRA', freeL: 'Comente qualquer palavra da página', leftN: 'faltam {n} palavras', legSeq: 'Comente a próxima palavra → ela vira tinta', legFree: 'Comente palavras da página → elas viram tinta', g1: '🎁 Qualquer presente: abre as 3 próximas palavras', g2: '⭐ {c}+: abre o resto da frase', fair: 'Os presentes têm efeitos fixos. As palavras que você abre levam seu nome.', worms: 'Traças de livro', support: 'Esta página tem o apoio de @{u} ❤', topBy: 'Mais palavras: @{u}', readAloud: 'Leitura em voz alta…', nextIn: 'Próxima página em {s}', joined: '@{u} entrou na leitura', opened: '@{u} abriu {n} palavras', note: 'Modo simulação: esta página não está ligada a uma live. Todos os eventos aqui são de teste, seus ou da demo automática.', obsNote: 'Adicione como fonte de navegador 1080 × 1920. Sem conexão a saída mostra uma DEMO.', obsNoteNet: 'Adicione como fonte de navegador 1080 × 1920. A página reage ao seu chat e doações reais.', auto: 'Demo automática: espectadores falsos (aparece DEMO na live)', cfgH: 'Ajustes de leitura', bookH: 'Livro', modeL: 'Modo', mSeq: 'Em ordem (próxima palavra)', mFree: 'Livre (qualquer palavra da página)', stopL: 'Palavras curtas (e, o, de…) abrem sozinhas', skipL: 'Pular palavra travada após (segundos, 0 = não)', doneL: 'Pausa depois de cada página (segundos)', wppL: 'Palavras por página', starC: 'Moedas para abrir uma frase', jump: 'Ir para a página', popBtn: '🪟 Abrir janela da live', popN: 'Capture esta janela no OBS ou LIVE Studio (Captura de janela). Usa o mesmo livro e conexão.', obsBook: 'Livros carregados ficam neste navegador. Numa fonte de navegador do OBS: clique direito → Interagir e carregue o livro lá uma vez.', loaderH: 'Carregue o livro para a live', sRight: 'Palavra certa', sWrong: 'Outro comentário', cur: 'Lendo agora', lgH: "Tabela da liga (temporada)", lgOn: "Mostrar a tabela da liga na live (à direita)", lgNL: "Linhas na tela", lgPL: "Período na tela", pRot: "Alternar (a cada 10 s)", pLive: "Esta live", pW: "Esta semana", pM: "Este mês", pY: "Este ano", pS: "Temporada", pChamp: "Campeões", lgDef: "Liga de Leitura", namePh: "Nome da liga (ex.: Liga do Clube do Livro)", sponPh: "Patrocinador (opcional, ex.: Livraria Central)", logoPh: "Link do logo do patrocinador (https, opcional)", pzW: "Prêmio do 1º da semana", pzM: "Prêmio do 1º do mês", pzY: "Prêmio do 1º do ano", przLine: "🏆 O 1º ganha: {p}", spon: "Patrocínio: {s}", lastW: "Semana passada", lastM: "Mês passado", lastY: "Ano passado", lgFoot: "Palavra por comentário = 1 pt · caixa +5 · presentes não dão pontos", lgEmpty: "Ainda sem pontos. Comente a próxima palavra!", lgNote: "Os pontos só são salvos com uma conexão real à live, nunca em simulação ou demo. A tabela fica no navegador onde o jogo roda: transmita com «Abrir janela da live» para que este painel e a live usem a mesma tabela. Uma fonte de navegador do OBS é outro navegador, com a própria tabela.", pzNote: "Você escolhe e entrega os prêmios. Os pontos vêm só de comentários; presentes nunca dão pontos, então ninguém compra o primeiro lugar.", bk: "📥 Baixar backup", rs: "📤 Carregar backup", png: "🖼️ Salvar tabela como imagem", reset: "🗑️ Começar nova temporada", resetQ: "Certeza? Clique de novo para apagar a temporada", rsOk: "Backup da liga carregado", rsBad: "Este arquivo não é um backup de liga do Chat Reads.", lgStat: "{n} leitores na temporada · desde {d}", lgRec: "● Esta janela está registrando a liga", lgFol: "✓ A janela da live está registrando; este painel mostra a tabela dela", lgTest: "Modo teste: os pontos não são salvos", demoTag: "TESTE", pts: "pts", share: "🔗 Copiar link da liga", shareN: "O link leva a tabela como está agora. Coloque na sua bio, Discord ou descrição; quem abrir vê a tabela no pickradar.net. Copie de novo para compartilhar pontos novos.", shareOk: "Copiado!", vSub: "Liga do Chat Reads", vAt: "Tabela de {d}", vNote: "Compartilhada pelo streamer. O PickRadar não verifica estes resultados.", vPlay: "▶ Leia você também", vOwn: "🏆 Crie sua própria liga", vBad: "Não foi possível abrir este link de liga.", vSince: "Temporada desde {d}" },
 id: { boxL: "Kotak rahasia per halaman", prizeL: "Hadiah kotak (satu per baris, berurutan)", prizeN: "Hadiah tidak boleh berupa uang, gift atau koin — hanya kesenangan dan pengakuan. Hanya komentar yang bisa membuka kotak.", found: "🎁 @{u} menemukan kotak rahasia!", prizeW: "Hadiah", boxLeg: "🎁 Ada kotak rahasia di halaman ini! Buka katanya lewat komentar untuk menang. Gift tidak bisa membuka kotak.", boxBy: "Kotak ditemukan @{u}", pz: "Komentarmu kubacakan keras 🎙️\nKamu pilih bab berikutnya 📖\nShout-out di siaran 📣\nKamu usulkan buku berikutnya 📚", off: "Mati", rankH: "Siaran ini", lead: "👑 @{u} memimpin!", badgeUp: "@{u} sekarang {b}!", rankL: "Tampilkan peringkat, lencana, dan pergantian pemimpin", b1: "Pembaca", b2: "Kutu Buku", b3: "Pustakawan", legRank: "🏆 Top 3 siaran ini · lencana di 10 / 50 / 100 kata", nextL: 'KATA BERIKUTNYA', freeL: 'Komentari kata mana pun di halaman ini', leftN: '{n} kata lagi', legSeq: 'Komentari kata berikutnya → jadi tinta', legFree: 'Komentari kata dari halaman → jadi tinta', g1: '🎁 Hadiah apa pun: 3 kata berikutnya terbuka', g2: '⭐ {c}+: sisa kalimat terbuka', fair: 'Efek hadiah tetap. Kata yang kamu buka memakai namamu.', worms: 'Kutu buku', support: 'Halaman ini didukung @{u} ❤', topBy: 'Kata terbanyak: @{u}', readAloud: 'Dibacakan…', nextIn: 'Halaman berikutnya {s} dtk', joined: '@{u} ikut membaca', opened: '@{u} membuka {n} kata', note: 'Mode simulasi: halaman ini tidak terhubung ke siaran live. Semua peristiwa di sini adalah tes buatanmu atau demo otomatis.', obsNote: 'Tambahkan sebagai browser source 1080 × 1920. Tanpa koneksi, output memutar DEMO.', obsNoteNet: 'Tambahkan sebagai browser source 1080 × 1920. Halaman bereaksi pada chat dan donasi aslimu.', auto: 'Demo otomatis: penonton palsu (tampil DEMO di siaran)', cfgH: 'Pengaturan baca', bookH: 'Buku', modeL: 'Mode', mSeq: 'Berurutan (kata berikutnya)', mFree: 'Bebas (kata mana pun di halaman)', stopL: 'Kata pendek (dan, di, yang…) terbuka sendiri', skipL: 'Lewati kata yang macet setelah (detik, 0 = mati)', doneL: 'Jeda setelah tiap halaman (detik)', wppL: 'Kata per halaman', starC: 'Koin untuk membuka kalimat', jump: 'Ke halaman', popBtn: '🪟 Buka jendela siaran', popN: 'Tangkap jendela ini di OBS atau LIVE Studio (Window capture). Memakai buku dan koneksi yang sama.', obsBook: 'Buku yang dimuat tetap di browser ini. Di browser source OBS: klik kanan → Interact, lalu muat bukunya sekali di sana.', loaderH: 'Muat buku untuk siaran', sRight: 'Kata benar', sWrong: 'Komentar lain', cur: 'Sedang dibaca', lgH: "Tabel liga (musim)", lgOn: "Tampilkan tabel liga di siaran (sisi kanan)", lgNL: "Baris di layar", lgPL: "Periode di layar", pRot: "Bergantian (tiap 10 dtk)", pLive: "Siaran ini", pW: "Minggu ini", pM: "Bulan ini", pY: "Tahun ini", pS: "Musim", pChamp: "Juara", lgDef: "Liga Membaca", namePh: "Nama liga (mis. Liga Klub Buku)", sponPh: "Sponsor (opsional, mis. Toko Buku Kota)", logoPh: "Link logo sponsor (https, opsional)", pzW: "Hadiah juara 1 minggu ini", pzM: "Hadiah juara 1 bulan ini", pzY: "Hadiah juara 1 tahun ini", przLine: "🏆 Juara 1 dapat: {p}", spon: "Sponsor: {s}", lastW: "Minggu lalu", lastM: "Bulan lalu", lastY: "Tahun lalu", lgFoot: "Kata dari komentar = 1 poin · kotak +5 · gift tidak memberi poin", lgEmpty: "Belum ada poin. Komentari kata berikutnya!", lgNote: "Poin hanya disimpan saat terhubung ke siaran sungguhan, tidak pernah di simulasi atau demo. Tabel disimpan di browser tempat game berjalan: siaran lewat «Buka jendela siaran» agar panel ini dan siaranmu memakai tabel yang sama. Browser source OBS adalah browser terpisah dengan tabelnya sendiri.", pzNote: "Kamu yang menentukan dan memberi hadiah. Poin hanya dari komentar; gift tidak pernah memberi poin, jadi tidak ada yang bisa membeli juara 1.", bk: "📥 Unduh cadangan", rs: "📤 Muat cadangan", png: "🖼️ Simpan tabel sebagai gambar", reset: "🗑️ Mulai musim baru", resetQ: "Yakin? Klik lagi untuk menghapus musim", rsOk: "Cadangan liga dimuat", rsBad: "File ini bukan cadangan liga Chat Reads.", lgStat: "{n} pembaca musim ini · sejak {d}", lgRec: "● Jendela ini mencatat liga", lgFol: "✓ Jendela siaran yang mencatat; panel ini menampilkan tabelnya", lgTest: "Mode uji: poin tidak disimpan", demoTag: "UJI", pts: "poin", share: "🔗 Salin link liga", shareN: "Link ini membawa tabel seperti saat ini. Taruh di bio, Discord atau deskripsi videomu; siapa pun yang membukanya melihat tabel di pickradar.net. Salin lagi untuk membagikan poin baru.", shareOk: "Tersalin!", vSub: "Liga Chat Reads", vAt: "Tabel per {d}", vNote: "Dibagikan oleh streamer. PickRadar tidak memeriksa hasil ini.", vPlay: "▶ Baca sendiri", vOwn: "🏆 Buat ligamu sendiri", vBad: "Link liga ini tidak bisa dibuka.", vSince: "Musim sejak {d}" }
};

// original sample story written for this game (no third-party text)
const DEMO = {
 tr: { title: 'Okuma Saati', author: 'PickRadar', text: 'Kasabanın en eski kitapçısı her akşam aynı saatte kapısını kapatırdı. Ama o gece ışıklar sönmedi. Raflar arasında küçük bir masa vardı ve masanın üstünde kimsenin daha önce görmediği bir kitap duruyordu. Kapağında tek bir cümle yazıyordu: Beni yüksek sesle okuyun.\n\nİlk sayfayı çeviren yaşlı kitapçı oldu. Kelimeler kâğıdın üstünde soluk, neredeyse görünmez duruyordu. Bir kelimeyi sesli okuduğunda o kelime mürekkep gibi koyulaştı. İkincisini okudu, o da koyulaştı. Kapının önünden geçen bir çocuk durdu ve camdan içeri baktı.\n\nÇocuk da okumaya başladı. Sonra fırıncı geldi, sonra postacı, sonra mahallenin bütün kedileri. Her ses bir kelimeyi uyandırıyordu. Sabaha karşı kitabın son sayfası da karardığında kimse eve gitmek istemedi. Çünkü hepsi aynı hikâyenin içindeydi ve hikâye onları birbirine bağlamıştı.\n\nO günden sonra kitapçının kapısında küçük bir not asılı kaldı: Burada kitaplar birlikte okunur.' },
 en: { title: 'The Reading Hour', author: 'PickRadar', text: 'The oldest bookshop in town closed its door at the same hour every evening. But that night the lights stayed on. Between the shelves stood a small table, and on the table lay a book that nobody had ever seen before. Its cover held a single sentence: Read me out loud.\n\nThe old bookseller was the first to turn a page. The words sat pale on the paper, almost invisible. When he read one word aloud, it darkened like ink. He read the second, and it darkened too. A child walking past the door stopped and looked in through the glass.\n\nThe child began to read as well. Then came the baker, then the postman, then every cat in the street. Each voice woke a word. When the last page turned dark near dawn, nobody wanted to go home. They were all inside the same story, and the story had tied them together.\n\nFrom that day on, a small note hung on the bookshop door: Here, books are read together.' },
 es: { title: 'La hora de leer', author: 'PickRadar', text: 'La librería más antigua del pueblo cerraba su puerta cada tarde a la misma hora. Pero aquella noche las luces no se apagaron. Entre las estanterías había una mesa pequeña y sobre la mesa descansaba un libro que nadie había visto antes. En la portada había una sola frase: Léeme en voz alta.\n\nEl viejo librero fue el primero en pasar una página. Las palabras estaban pálidas sobre el papel, casi invisibles. Cuando leyó una palabra en voz alta, se oscureció como la tinta. Leyó la segunda y también se oscureció. Un niño que pasaba frente a la puerta se detuvo y miró a través del cristal.\n\nEl niño también empezó a leer. Luego llegó el panadero, luego el cartero, luego todos los gatos de la calle. Cada voz despertaba una palabra. Cuando la última página se oscureció al amanecer, nadie quiso volver a casa. Todos estaban dentro de la misma historia, y la historia los había unido.\n\nDesde aquel día, una pequeña nota colgaba en la puerta de la librería: Aquí los libros se leen juntos.' },
 pt: { title: 'A hora da leitura', author: 'PickRadar', text: 'A livraria mais antiga da cidade fechava a porta todas as noites à mesma hora. Mas naquela noite as luzes não se apagaram. Entre as estantes havia uma mesinha e, sobre a mesa, um livro que ninguém tinha visto antes. Na capa havia uma única frase: Leia-me em voz alta.\n\nO velho livreiro foi o primeiro a virar uma página. As palavras estavam pálidas no papel, quase invisíveis. Quando ele leu uma palavra em voz alta, ela escureceu como tinta. Leu a segunda, e ela também escureceu. Um menino que passava pela porta parou e olhou pelo vidro.\n\nO menino também começou a ler. Depois veio o padeiro, depois o carteiro, depois todos os gatos da rua. Cada voz acordava uma palavra. Quando a última página escureceu perto do amanhecer, ninguém quis voltar para casa. Estavam todos dentro da mesma história, e a história os tinha unido.\n\nDesde aquele dia, um bilhetinho ficou pendurado na porta da livraria: Aqui os livros são lidos juntos.' },
 id: { title: 'Jam Membaca', author: 'PickRadar', text: 'Toko buku tertua di kota itu menutup pintunya pada jam yang sama setiap sore. Tetapi malam itu lampunya tidak padam. Di antara rak ada sebuah meja kecil, dan di atas meja itu tergeletak sebuah buku yang belum pernah dilihat siapa pun. Sampulnya hanya berisi satu kalimat: Bacalah aku dengan suara keras.\n\nPenjual buku tua itulah yang pertama membalik halaman. Kata-kata di atas kertas tampak pucat, hampir tak terlihat. Saat ia membaca satu kata dengan suara keras, kata itu menghitam seperti tinta. Ia membaca kata kedua, dan kata itu pun menghitam. Seorang anak yang lewat di depan pintu berhenti dan mengintip dari balik kaca.\n\nAnak itu pun mulai membaca. Lalu datang tukang roti, lalu tukang pos, lalu semua kucing di jalan itu. Setiap suara membangunkan satu kata. Ketika halaman terakhir menghitam menjelang fajar, tidak ada yang ingin pulang. Mereka semua berada di dalam cerita yang sama, dan cerita itu telah mengikat mereka.\n\nSejak hari itu, sebuah catatan kecil tergantung di pintu toko buku: Di sini, buku dibaca bersama.' }
};

// small words that open by themselves (folded: lower case, no accents)
const STOP = new Set(('ve ile bir bu su o da de ki mi mu ne gibi icin cok daha en her ama ya hem ' +
 'the a an and of to in is it that was on at as with his her he she i you my be by or for not but so we they their them this from had have ' +
 'el la los las lo de del y en que a un una se por con no su al es o le me mi te ' +
 'o a os as do da dos das e em um uma que se por com no na nos nas nao ao seu sua ' +
 'dan di yang ke itu ini dengan untuk dari ada tidak akan pada juga').split(' '));

const SRC_TXT = {"en": {"demo": "DEMO", "sim": "SIMULATION", "panelH": "Creator panel", "back": "← Game", "source": "Data source", "srcSim": "Test simulator", "active": "ACTIVE", "srcTT": "TikTok LIVE (official)", "srcTTn": "WAITING FOR PARTNER ACCESS", "simH": "Simulator", "blockH": "Blocked words and users (comma separated)", "obsH": "Stream output for OBS / LIVE Studio", "copy": "Copy", "copied": "Copied!", "logH": "Event queue", "panel": "Panel", "st": {"ok": "APPLIED", "dup": "DUPLICATE", "queue": "QUEUED", "filt": "FILTERED"}, "srcN": {"tikfinity": "TikTok · via TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + other platforms · via Social Stream Ninja (beta)"}, "srcH": {"twitch": "Official Twitch chat, free, nothing to install: type your channel name and connect. Bits and subs count as gifts. (Twitch does not send follows to chat.)", "youtube": "Official YouTube API, free. One-time setup: in Google Cloud Console turn on “YouTube Data API v3”, create an API key (restrict it to pickradar.net) and paste it here with your live video link. The free daily quota lasts about 3 hours of streaming. Super Chats, Super Stickers and memberships count as gifts.", "ssn": "For Kick and any other platform: use the free Social Stream Ninja app or browser extension. In its settings under Mechanics turn on “Enable remote API control” and “Send chat messages to API server”, then paste your session ID here. Donations count as gifts. Social Stream Ninja is a third-party tool, not made by us."}, "moneyNote": "Twitch, YouTube and Kick donations are converted to coins: $1 ≈ 75 coins (100 Bits = $1, a sub ≈ $5).", "twCh": "Twitch channel name", "ytKey": "YouTube API key", "ytVid": "Live video link or ID", "ssSess": "Social Stream session ID", "anyGift": "Any gift", "errGen": "CANNOT CONNECT", "needCh": "Type your Twitch channel name first.", "needYt": "Paste your API key and live video link first.", "needSs": "Paste your Social Stream session ID first.", "ytBadKey": "YouTube rejected the key, or today’s free quota is used up.", "ytNoLive": "No active live chat on this video yet. Retrying…", "obsNoteNet": "Add as a browser source at 1080 × 1920. The class reacts to your real chat and donations.", "keyWarn": "This link contains your API key, do not share it.", "liveNote": "Real live data is connected. Simulator buttons still work for testing.", "tfSt": {"off": "OFF", "wait": "CONNECTING…", "on": "CONNECTED", "err": "TIKFINITY NOT FOUND"}, "tfUse": "Connect my LIVE", "tfStop": "Disconnect", "tfHelp": "Free and runs only on your computer: install the TikFinity desktop app, log in with your TikTok account and keep it open while you are LIVE. This page reads your stream events from it (ws://localhost:21213). No keys, nothing passes through our servers. TikFinity is a third-party tool, not made by TikTok or by us.", "tfPerm": "If Chrome asks for “local network access”, click Allow.", "obsNoteTF": "Add as a browser source at 1080 × 1920 on the same computer where TikFinity is running. The class reacts to your real comments, likes and gifts.", "sFollow": "Follow"}, "tr": {"demo": "DEMO", "sim": "SİMÜLASYON", "panelH": "Yayıncı paneli", "back": "← Oyun", "source": "Veri kaynağı", "srcSim": "Test simülatörü", "active": "AKTİF", "srcTT": "TikTok LIVE (resmî)", "srcTTn": "PARTNER ONAYI BEKLENİYOR", "simH": "Simülatör", "blockH": "Engelli kelimeler ve kullanıcılar (virgülle)", "obsH": "OBS / LIVE Studio yayın çıktısı", "copy": "Kopyala", "copied": "Kopyalandı!", "logH": "Olay kuyruğu", "panel": "Panel", "st": {"ok": "UYGULANDI", "dup": "TEKRAR", "queue": "SIRADA", "filt": "FİLTRE"}, "srcN": {"tikfinity": "TikTok · TikFinity ile (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + diğer platformlar · Social Stream Ninja ile (beta)"}, "srcH": {"twitch": "Resmî Twitch sohbeti, ücretsiz, kurulum yok: kanal adını yaz ve bağla. Bits ve abonelikler hediye sayılır. (Twitch takipleri sohbete göndermez.)", "youtube": "Resmî YouTube API’si, ücretsiz. Tek seferlik kurulum: Google Cloud Console’da “YouTube Data API v3”ü aç, bir API anahtarı oluştur (pickradar.net ile sınırla) ve canlı yayın linkinle birlikte buraya yapıştır. Ücretsiz günlük kota yaklaşık 3 saatlik yayına yeter. Süper Sohbet, Süper Çıkartma ve kanal üyelikleri hediye sayılır.", "ssn": "Kick ve diğer tüm platformlar için: ücretsiz Social Stream Ninja uygulamasını ya da tarayıcı eklentisini kullan. Ayarlarında Mechanics bölümünden “Enable remote API control” ve “Send chat messages to API server” seçeneklerini aç, sonra oturum ID’ni buraya yapıştır. Bağışlar hediye sayılır. Social Stream Ninja üçüncü taraf bir araçtır; biz yapmadık."}, "moneyNote": "Twitch, YouTube ve Kick bağışları jetona çevrilir: 1 $ ≈ 75 jeton (100 Bits = 1 $, bir abonelik ≈ 5 $).", "twCh": "Twitch kanal adı", "ytKey": "YouTube API anahtarı", "ytVid": "Canlı yayın linki veya ID", "ssSess": "Social Stream oturum ID", "anyGift": "Her hediye", "errGen": "BAĞLANAMADI", "needCh": "Önce Twitch kanal adını yaz.", "needYt": "Önce API anahtarını ve canlı yayın linkini yapıştır.", "needSs": "Önce Social Stream oturum ID’ni yapıştır.", "ytBadKey": "YouTube anahtarı kabul etmedi ya da bugünkü ücretsiz kota doldu.", "ytNoLive": "Bu videoda henüz aktif canlı sohbet yok. Tekrar deneniyor…", "obsNoteNet": "1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek sohbetine ve bağışlarına tepki verir.", "keyWarn": "Bu link API anahtarını içerir, kimseyle paylaşma.", "liveNote": "Gerçek canlı yayın verisi bağlı. Simülatör düğmeleri test için yine çalışır.", "tfSt": {"off": "KAPALI", "wait": "BAĞLANIYOR…", "on": "BAĞLANDI", "err": "TIKFINITY BULUNAMADI"}, "tfUse": "Yayınımı bağla", "tfStop": "Bağlantıyı kes", "tfHelp": "Ücretsiz ve yalnızca senin bilgisayarında çalışır: TikFinity masaüstü uygulamasını kur, TikTok hesabınla giriş yap ve yayın boyunca açık tut. Bu sayfa yayın olaylarını oradan okur (ws://localhost:21213). Anahtar yok, hiçbir veri bizim sunucumuzdan geçmez. TikFinity üçüncü taraf bir araçtır; TikTok ya da biz yapmadık.", "tfPerm": "Chrome “yerel ağ erişimi” izni sorarsa İzin ver’e bas.", "obsNoteTF": "TikFinity’nin açık olduğu aynı bilgisayarda 1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek yorumlarına, beğenilerine ve hediyelerine tepki verir.", "sFollow": "Takip"}, "es": {"demo": "DEMO", "sim": "SIMULACIÓN", "panelH": "Panel del creador", "back": "← Juego", "source": "Fuente de datos", "srcSim": "Simulador de prueba", "active": "ACTIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "ESPERANDO ACCESO DE SOCIO", "simH": "Simulador", "blockH": "Palabras y usuarios bloqueados (separados por comas)", "obsH": "Salida del directo para OBS / LIVE Studio", "copy": "Copiar", "copied": "¡Copiado!", "logH": "Cola de eventos", "panel": "Panel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "EN COLA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · con TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + otras plataformas · con Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial de Twitch, gratis, sin instalar nada: escribe el nombre de tu canal y conecta. Los Bits y las suscripciones cuentan como regalos. (Twitch no envía los follows al chat.)", "youtube": "API oficial de YouTube, gratis. Configuración única: en Google Cloud Console activa “YouTube Data API v3”, crea una clave de API (restríngela a pickradar.net) y pégala aquí con el enlace de tu directo. La cuota diaria gratuita alcanza para unas 3 horas de directo. Super Chats, Super Stickers y membresías cuentan como regalos.", "ssn": "Para Kick y cualquier otra plataforma: usa la app o extensión gratuita Social Stream Ninja. En su configuración, en Mechanics, activa “Enable remote API control” y “Send chat messages to API server” y pega aquí tu ID de sesión. Las donaciones cuentan como regalos. Social Stream Ninja es una herramienta de terceros, no la hicimos nosotros."}, "moneyNote": "Las donaciones de Twitch, YouTube y Kick se convierten en monedas: 1 $ ≈ 75 monedas (100 Bits = 1 $, una suscripción ≈ 5 $).", "twCh": "Nombre del canal de Twitch", "ytKey": "Clave de API de YouTube", "ytVid": "Enlace o ID del directo", "ssSess": "ID de sesión de Social Stream", "anyGift": "Cualquier regalo", "errGen": "NO SE PUEDE CONECTAR", "needCh": "Escribe primero el nombre de tu canal de Twitch.", "needYt": "Pega primero tu clave de API y el enlace del directo.", "needSs": "Pega primero tu ID de sesión de Social Stream.", "ytBadKey": "YouTube rechazó la clave o la cuota gratuita de hoy se agotó.", "ytNoLive": "Este vídeo aún no tiene chat en directo activo. Reintentando…", "obsNoteNet": "Añádelo como fuente de navegador de 1080 × 1920. La clase reacciona a tu chat y donaciones reales.", "keyWarn": "Este enlace contiene tu clave de API, no lo compartas.", "liveNote": "Datos reales del directo conectados. Los botones del simulador siguen funcionando para pruebas.", "tfSt": {"off": "APAGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NO ENCONTRADO"}, "tfUse": "Conectar mi LIVE", "tfStop": "Desconectar", "tfHelp": "Gratis y solo en tu ordenador: instala la app de escritorio TikFinity, inicia sesión con tu cuenta de TikTok y mantenla abierta durante el directo. Esta página lee los eventos de tu directo desde ella (ws://localhost:21213). Sin claves; nada pasa por nuestros servidores. TikFinity es una herramienta de terceros, no la hizo TikTok ni nosotros.", "tfPerm": "Si Chrome pide «acceso a la red local», pulsa Permitir.", "obsNoteTF": "Añádelo como fuente de navegador de 1080 × 1920 en el mismo ordenador donde está abierto TikFinity. La clase reacciona a tus comentarios, me gusta y regalos reales.", "sFollow": "Seguir"}, "pt": {"demo": "DEMO", "sim": "SIMULAÇÃO", "panelH": "Painel do criador", "back": "← Jogo", "source": "Fonte de dados", "srcSim": "Simulador de teste", "active": "ATIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "AGUARDANDO ACESSO DE PARCEIRO", "simH": "Simulador", "blockH": "Palavras e usuários bloqueados (separados por vírgula)", "obsH": "Saída da live para OBS / LIVE Studio", "copy": "Copiar", "copied": "Copiado!", "logH": "Fila de eventos", "panel": "Painel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "NA FILA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · com TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + outras plataformas · com Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial da Twitch, grátis, sem instalar nada: digite o nome do seu canal e conecte. Bits e inscrições contam como presentes. (A Twitch não envia follows para o chat.)", "youtube": "API oficial do YouTube, grátis. Configuração única: no Google Cloud Console ative a “YouTube Data API v3”, crie uma chave de API (restrinja a pickradar.net) e cole aqui com o link da sua live. A cota diária grátis dá para cerca de 3 horas de live. Super Chats, Super Stickers e assinaturas de canal contam como presentes.", "ssn": "Para Kick e qualquer outra plataforma: use o app ou a extensão gratuita Social Stream Ninja. Nas configurações, em Mechanics, ative “Enable remote API control” e “Send chat messages to API server” e cole aqui o seu ID de sessão. Doações contam como presentes. Social Stream Ninja é uma ferramenta de terceiros, não foi feita por nós."}, "moneyNote": "Doações da Twitch, YouTube e Kick viram moedas: US$ 1 ≈ 75 moedas (100 Bits = US$ 1, uma inscrição ≈ US$ 5).", "twCh": "Nome do canal da Twitch", "ytKey": "Chave de API do YouTube", "ytVid": "Link ou ID da live", "ssSess": "ID de sessão do Social Stream", "anyGift": "Qualquer presente", "errGen": "NÃO FOI POSSÍVEL CONECTAR", "needCh": "Digite primeiro o nome do seu canal da Twitch.", "needYt": "Cole primeiro sua chave de API e o link da live.", "needSs": "Cole primeiro seu ID de sessão do Social Stream.", "ytBadKey": "O YouTube recusou a chave ou a cota grátis de hoje acabou.", "ytNoLive": "Este vídeo ainda não tem chat ao vivo ativo. Tentando de novo…", "obsNoteNet": "Adicione como fonte de navegador de 1080 × 1920. A turma reage ao seu chat e às doações reais.", "keyWarn": "Este link contém sua chave de API, não compartilhe.", "liveNote": "Dados reais da live conectados. Os botões do simulador continuam funcionando para testes.", "tfSt": {"off": "DESLIGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NÃO ENCONTRADO"}, "tfUse": "Conectar minha LIVE", "tfStop": "Desconectar", "tfHelp": "Grátis e só no seu computador: instale o app de desktop TikFinity, entre com sua conta do TikTok e deixe-o aberto durante a live. Esta página lê os eventos da sua live a partir dele (ws://localhost:21213). Sem chaves; nada passa pelos nossos servidores. TikFinity é uma ferramenta de terceiros, não foi feita pelo TikTok nem por nós.", "tfPerm": "Se o Chrome pedir “acesso à rede local”, clique em Permitir.", "obsNoteTF": "Adicione como fonte de navegador de 1080 × 1920 no mesmo computador em que o TikFinity está aberto. A turma reage aos seus comentários, curtidas e presentes reais.", "sFollow": "Seguir"}, "id": {"demo": "DEMO", "sim": "SIMULASI", "panelH": "Panel kreator", "back": "← Game", "source": "Sumber data", "srcSim": "Simulator uji", "active": "AKTIF", "srcTT": "TikTok LIVE (resmi)", "srcTTn": "MENUNGGU AKSES PARTNER", "simH": "Simulator", "blockH": "Kata dan pengguna yang diblokir (pisahkan dengan koma)", "obsH": "Output siaran untuk OBS / LIVE Studio", "copy": "Salin", "copied": "Tersalin!", "logH": "Antrean event", "panel": "Panel", "st": {"ok": "DITERAPKAN", "dup": "DUPLIKAT", "queue": "ANTRE", "filt": "DISARING"}, "srcN": {"tikfinity": "TikTok · lewat TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + platform lain · lewat Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat Twitch resmi, gratis, tanpa instalasi: ketik nama channel-mu lalu hubungkan. Bits dan langganan dihitung sebagai hadiah. (Twitch tidak mengirim follow ke chat.)", "youtube": "API YouTube resmi, gratis. Pengaturan sekali saja: di Google Cloud Console aktifkan “YouTube Data API v3”, buat API key (batasi ke pickradar.net) lalu tempel di sini bersama link live-mu. Kuota harian gratis cukup untuk sekitar 3 jam siaran. Super Chat, Super Sticker, dan keanggotaan dihitung sebagai hadiah.", "ssn": "Untuk Kick dan platform lainnya: pakai aplikasi atau ekstensi gratis Social Stream Ninja. Di pengaturannya, bagian Mechanics, nyalakan “Enable remote API control” dan “Send chat messages to API server”, lalu tempel session ID-mu di sini. Donasi dihitung sebagai hadiah. Social Stream Ninja adalah alat pihak ketiga, bukan buatan kami."}, "moneyNote": "Donasi Twitch, YouTube, dan Kick diubah jadi koin: $1 ≈ 75 koin (100 Bits = $1, satu langganan ≈ $5).", "twCh": "Nama channel Twitch", "ytKey": "API key YouTube", "ytVid": "Link atau ID video live", "ssSess": "Session ID Social Stream", "anyGift": "Hadiah apa pun", "errGen": "TIDAK BISA TERHUBUNG", "needCh": "Ketik dulu nama channel Twitch-mu.", "needYt": "Tempel dulu API key dan link video live-mu.", "needSs": "Tempel dulu session ID Social Stream-mu.", "ytBadKey": "YouTube menolak key ini, atau kuota gratis hari ini sudah habis.", "ytNoLive": "Video ini belum punya live chat aktif. Mencoba lagi…", "obsNoteNet": "Tambahkan sebagai browser source 1080 × 1920. Kelas bereaksi pada chat dan donasi aslimu.", "keyWarn": "Link ini berisi API key-mu, jangan dibagikan.", "liveNote": "Data live asli terhubung. Tombol simulator tetap bisa dipakai untuk uji.", "tfSt": {"off": "MATI", "wait": "MENGHUBUNGKAN…", "on": "TERHUBUNG", "err": "TIKFINITY TIDAK DITEMUKAN"}, "tfUse": "Hubungkan LIVE-ku", "tfStop": "Putuskan", "tfHelp": "Gratis dan hanya berjalan di komputermu: pasang aplikasi desktop TikFinity, masuk dengan akun TikTok-mu dan biarkan terbuka selama LIVE. Halaman ini membaca event siaranmu dari sana (ws://localhost:21213). Tanpa kunci; tidak ada data yang lewat server kami. TikFinity adalah alat pihak ketiga, bukan buatan TikTok atau kami.", "tfPerm": "Jika Chrome meminta “akses jaringan lokal”, klik Izinkan.", "obsNoteTF": "Tambahkan sebagai browser source 1080 × 1920 di komputer yang sama tempat TikFinity terbuka. Kelas bereaksi pada komentar, suka, dan hadiah aslimu.", "sFollow": "Ikuti"}};

const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const WORD_RE = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;
const fold = s => String(s || '').toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’\-]/g, '');
const tokens = s => (String(s || '').match(WORD_RE) || []).map(fold).filter(Boolean);

function mount(host, opts) {
 opts = opts || {};
 const lang = LANG[opts.lang] ? opts.lang : 'en';
 const L = Object.assign({}, LANG.en, LANG[lang]);
 const QS = new URLSearchParams(global.location ? global.location.search : '');
 const live = !!opts.live || QS.get('live') === '1';
 const clean = live && QS.get('clean') === '1';
 const outer = host;
 if (live) {
  document.documentElement.style.overflow = 'hidden';
  if (document.body && outer.parentNode !== document.body) document.body.appendChild(outer);
  outer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;width:auto;height:auto;margin:0;border:0;border-radius:0;box-shadow:none;background:#14110d';
  if (!clean) { const stage = document.createElement('div'); stage.className = 'cr-stage'; outer.appendChild(stage); host = stage; }
 }
 host.classList.add('cr'); if (live) host.classList.add('lv');
 const store = {
  get(k, d) { try { const v = localStorage.getItem('cr.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('cr.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } }
 };
 const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
 const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
 const DEF_CFG = { mode: 'seq', box: 1, prizes: '', rank: true, stop: true, skip: 25, done: 8, wpp: 40, starC: 99, block: '', book: 'demo', lg: false, lgN: 30, lgP: 'rot', lgName: '', lgSpon: '', lgLogo: '', lgPzW: '', lgPzM: '', lgPzY: '' };
 let CFG = Object.assign({}, DEF_CFG, live ? store.get('livecfg', {}) : {});
 try { const c = QS.get('cfg'); if (c && live) CFG = Object.assign({}, DEF_CFG, JSON.parse(decodeURIComponent(escape(atob(c.replace(/ /g, '+')))))); } catch (e) { }

 /* ---------- styles ---------- */
 const css = document.createElement('style');
 css.textContent = `
.cr{position:relative;overflow:hidden;display:flex;flex-direction:column;gap:.6em;padding:.8em;box-sizing:border-box;background:radial-gradient(ellipse at 50% 30%,#3a2e22,#14110d 75%);color:#2a2118;font-family:system-ui,sans-serif;user-select:none;-webkit-user-select:none}
.cr *{box-sizing:border-box}
.cr-top{display:flex;align-items:center;gap:.5em;color:#f5ead6;min-height:2.2em}
.cr-top .bk{flex:1;min-width:0;line-height:1.15}
.cr-top .bk b{display:block;font:600 1.15em 'Lora',Georgia,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-top .bk span{font-size:.78em;color:#cbb894;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block}
.cr-top .pg{flex:none;text-align:right;font-weight:800;font-size:.82em;color:#f5ead6}
.cr-top .pg i{display:block;width:7em;height:.42em;margin-top:.25em;border-radius:.3em;background:rgba(255,255,255,.15);overflow:hidden}
.cr-top .pg i u{display:block;height:100%;background:#e9b44c;text-decoration:none}
.cr-page{position:relative;flex:1;min-height:0;border-radius:.5em;padding:1.2em 1.3em;background:#f4ecdc;box-shadow:0 .6em 1.8em rgba(0,0,0,.45),inset 0 0 3em rgba(160,120,60,.22);overflow:hidden}
.cr-page:before{content:'';position:absolute;left:0;top:0;bottom:0;width:1.1em;background:linear-gradient(90deg,rgba(90,60,20,.18),rgba(90,60,20,0))}
.cr-txt{position:relative;height:100%;visibility:hidden;font-family:'Lora',Georgia,'Times New Roman',serif;line-height:1.55;text-align:left;hyphens:none;overflow-wrap:break-word}
.cr-txt .ind{display:inline-block;width:1.4em}
.cr-txt .w{color:rgba(42,33,24,.2);transition:color .35s,background .35s;border-radius:.15em}
.cr-txt .w.r{color:#231a12}
.cr-txt .w.a{color:rgba(35,26,18,.82)}
.cr-txt .w.k{color:rgba(35,26,18,.5)}
.cr-txt .w.n{color:rgba(42,33,24,.55);background:rgba(233,180,76,.35);box-shadow:0 .12em 0 #c9892a}
.cr-txt .w.bx{color:#231a12;background:rgba(233,180,76,.6);box-shadow:0 0 0 .1em #e9b44c}
.cr-box{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);z-index:3;width:82%;text-align:center;padding:.8em 1em 1em;border-radius:.8em;background:#2a1d0c;color:#f5ead6;box-shadow:0 0 0 .22em #e9b44c,0 1em 2.4em rgba(0,0,0,.55)}
.cr-box.pop{animation:crbox .5s cubic-bezier(.2,1.6,.4,1)}
@keyframes crbox{from{transform:translate(-50%,-50%) scale(.3);opacity:0}}
.cr-box i{display:block;font-style:normal;font-size:3.8em;line-height:1.1}
.cr-box b{display:block;font:800 1.6em/1.15 system-ui,sans-serif;margin-top:.15em}
.cr-box span{display:block;font:700 1.15em/1.3 system-ui,sans-serif;color:#e9b44c;margin-top:.35em}
.cr-txt .w.f{color:#1f7a3a;background:rgba(80,190,110,.25)}
.cr-chip{position:absolute;transform:translate(-50%,-100%);padding:.1em .45em;border-radius:.4em;background:#1f7a3a;color:#fff;font:700 .62em system-ui,sans-serif;white-space:nowrap;pointer-events:none;animation:crup 1.4s forwards}
@keyframes crup{0%{opacity:0;margin-top:.3em}15%{opacity:1;margin-top:0}80%{opacity:1}100%{opacity:0;margin-top:-.8em}}
.cr-sup{position:absolute;left:1.3em;right:1.3em;bottom:.45em;text-align:right;font:italic 600 .62em 'Lora',Georgia,serif;color:#a0612a}
.cr-done{position:absolute;inset:auto 0 0 0;padding:.55em .8em;background:linear-gradient(0deg,rgba(244,236,220,1) 60%,rgba(244,236,220,0));text-align:center;font-weight:800;color:#1f7a3a}
.cr-done[hidden]{display:none}
.cr-done b{display:block;font-size:1.05em;letter-spacing:.08em}
.cr-done span{display:block;font-size:.72em;color:#6b5a44;font-weight:700;margin-top:.1em}
.cr-ov{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8em;padding:1.2em;text-align:center;background:rgba(20,17,13,.88);color:#f5ead6;overflow:auto}
.cr-ov[hidden]{display:none}
.cr-ov h2{margin:0;font:600 2.6em/1 'Lora',Georgia,serif}
.cr-ov h2 span{display:block;font:800 .34em system-ui,sans-serif;letter-spacing:.2em;color:#e9b44c;margin-top:.5em;text-transform:uppercase}
.cr-ov p{margin:0;max-width:30em;font-size:.92em;line-height:1.45;color:#e8dcc4}
.cr-ov small{max-width:32em;color:#b9a682;font-size:.74em;line-height:1.4}
.cr-ov .row{display:flex;gap:.6em;flex-wrap:wrap;justify-content:center}
.cr-ov textarea{width:min(32em,100%);height:7em;border-radius:.5em;border:1px solid #6b5a44;background:#211b14;color:#f5ead6;padding:.6em;font:500 .9em system-ui,sans-serif}
.cr-btn{border:0;border-radius:.6em;padding:.6em 1.1em;font:800 1em system-ui,sans-serif;background:#e9b44c;color:#2a1d0c;cursor:pointer;box-shadow:0 .25em 0 #a06d1c}
.cr-btn:active{transform:translateY(.15em);box-shadow:0 .1em 0 #a06d1c}
.cr-btn.g{background:#f5ead6;box-shadow:0 .25em 0 #8a7a5c}
.cr-in{display:flex;gap:.5em;align-items:center}
.cr-in input{flex:1;min-width:0;padding:.65em .8em;border-radius:.6em;border:2px solid #6b5a44;background:#f9f3e7;color:#231a12;font:600 1.05em 'Lora',Georgia,serif;outline:none}
.cr-in input.bad{border-color:#d0523a;background:#fde7e1}
.cr-in .st{flex:none;color:#f5ead6;font:800 .8em system-ui,sans-serif;text-align:right;line-height:1.2}
.cr-in .st small{display:block;color:#cbb894;font-weight:700}
.cr-err{padding:1em;color:#f5ead6}
.cr-ov:has(.cr-lgv){justify-content:flex-start;background:rgba(20,17,13,.97)}
.cr-lgv{width:min(34em,100%);display:flex;flex-direction:column;align-items:center;gap:.55em;text-align:center}
.cr-lgv h2{font-size:2.1em}
.cr-lgv .sp{color:#cbb894;font-weight:700;font-size:.85em}
.cr-lgv .tb{display:flex;flex-wrap:wrap;justify-content:center;gap:.35em}
.cr-lgv .tb button{border:1px solid #6b5a44;border-radius:99em;padding:.35em .8em;background:transparent;color:#f5ead6;font:800 .78em system-ui,sans-serif;cursor:pointer}
.cr-lgv .tb button.on{background:#e9b44c;border-color:#e9b44c;color:#2a1d0c}
.cr-lgv .pz{padding:.3em .7em;border-radius:.5em;background:rgba(233,180,76,.16);color:#f5d28a;font-weight:700;font-size:.85em}
.cr-lgv ol{width:100%;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.18em}
.cr-lgv li{display:flex;align-items:center;gap:.5em;padding:.35em .6em;border-radius:.4em;background:rgba(255,255,255,.06);font-weight:700;font-size:.9em;text-align:left}
.cr-lgv li:nth-child(even){background:rgba(255,255,255,.1)}
.cr-lgv li.t1{background:rgba(233,180,76,.34)}.cr-lgv li.t2{background:rgba(233,180,76,.24)}.cr-lgv li.t3{background:rgba(233,180,76,.16)}
.cr-lgv li i{flex:none;width:1.8em;text-align:center;font-style:normal;color:#e9b44c}
.cr-lgv li b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-lgv li em{flex:none;font-style:normal;color:#e9b44c}
.cr-lgv li.e{justify-content:center;color:#cbb894}
.cr-lgv .ch{width:100%;display:flex;flex-direction:column;gap:.5em}
.cr-lgv .ch div{padding:.6em;border-radius:.5em;background:rgba(233,180,76,.16)}
.cr-lgv .ch small{display:block;color:#cbb894;text-transform:uppercase;letter-spacing:.08em}
.cr-lgv .ch b{display:block;font-size:1.2em;margin:.15em 0}
.cr-lgv .ch span{color:#f5d28a;font-size:.9em}
.cr-file{display:none}
`;
 document.head.appendChild(css);

 /* ---------- layout ---------- */
 const top = el('div', 'cr-top', `<div class="bk"><b></b><span></span></div><div class="pg"><span></span><i><u></u></i></div>`);
 const page = el('div', 'cr-page', '<div class="cr-txt"></div><div class="cr-sup"></div><div class="cr-done" hidden><b></b><span></span></div>');
 const txt = page.querySelector('.cr-txt'), sup = page.querySelector('.cr-sup'), doneBox = page.querySelector('.cr-done');
 const ov = el('div', 'cr-ov', ''); ov.hidden = true;
 const file = el('input', 'cr-file'); file.type = 'file'; file.accept = '.epub,.txt,application/epub+zip,text/plain';
 host.appendChild(top); host.appendChild(page);
 host.appendChild(ov); host.appendChild(file);

 /* ---------- book model ---------- */
 let BOOK = null; // { id, title, author, words:[{t,n,pre}], tail, secs:[[a,b]] }
 function parseBook(title, author, text) {
  text = String(text || '').replace(/\r/g, '').replace(/[ \t ]+/g, ' ').replace(/\n[ ]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const words = []; let last = 0, m;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(text))) { words.push({ t: m[0], n: fold(m[0]), pre: text.slice(last, m.index) }); last = m.index + m[0].length; }
  return { id: hash(title + '|' + text.length + '|' + text.slice(0, 200)).toString(36), title: title || '—', author: author || '', words, tail: text.slice(last), secs: [] };
 }
 const sentEnd = s => /[.!?…:;]["'»”’)\]]*\s|\n/.test(s);
 function section(B, wpp) {
  const secs = [], N = B.words.length; let a = 0;
  while (a < N) {
   let b = a + 1;
   while (b < N) { const c = b - a; if (c >= wpp && sentEnd(B.words[b].pre)) break; if (c >= wpp * 1.7 && /\s/.test(B.words[b].pre)) break; if (/\n\n/.test(B.words[b].pre) && c >= wpp * .6) break; b++; }
   secs.push([a, b]); a = b;
  }
  B.secs = secs;
 }
 const secOf = i => { const S = BOOK.secs; let lo = 0, hi = S.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (S[m][0] <= i) lo = m; else hi = m - 1; } return lo; };

 /* ---------- reading state ---------- */
 const st = { boxes: new Set(), boxBy: [], boxN: 0, keys: new Map(), top: new Map(), sess: new Map(), leader: '', leadT: -9, sec: 0, ptr: 0, rev: new Set(), phase: 'idle', t: 0, lastT: 0, pageTop: new Map(), gifter: '', time: 0, typed: 0, streak: 0, t0: 0 };
 let spans = [], chips = 0; const fx = [];
 const wpp = () => clamp(+CFG.wpp || 40, 15, 120);
 function loadBook(title, author, text, keepStored, id) {
  BOOK = parseBook(title, author, text);
  if (id) BOOK.id = id;
  if (!BOOK.words.length) { BOOK = null; return false; }
  section(BOOK, wpp());
  const pr = store.get('prog.' + BOOK.id, null);
  st.top = new Map(pr && pr.top ? pr.top : []);
  openSection(pr ? clamp(pr.sec | 0, 0, BOOK.secs.length - 1) : 0);
  if (!keepStored) {
   const raw = String(text);
   const ok = store.set('book', { id: BOOK.id, title: BOOK.title, author: BOOK.author, text: raw.length > 1200000 ? raw.slice(0, 1200000) : raw });
   if (!ok || raw.length > 1200000) banner(L.tooBig);
  }
  CFG.book = 'local';
  return true;
 }
 function saveProg() { if (BOOK) store.set('prog.' + BOOK.id, { sec: st.sec, top: [...st.top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50) }); }
 function openSection(k) {
  st.sec = clamp(k, 0, BOOK.secs.length - 1);
  const [a, b] = BOOK.secs[st.sec];
  st.rev = new Set(); st.pageTop = new Map(); st.gifter = ''; st.ptr = a; st.phase = 'read'; st.lastT = st.time;
  st.boxes = new Set(); st.boxBy = [];
  if (live && +CFG.box > 0) { const el2 = []; for (let i = a + 3; i < b; i++) if (BOOK.words[i].n.length >= 4 && !STOP.has(BOOK.words[i].n)) el2.push(i); for (let k = 0; k < Math.min(+CFG.box, el2.length); k++) st.boxes.add(el2.splice(Math.floor(Math.random() * el2.length), 1)[0]); }
  let h = '';
  for (let i = a; i < b; i++) {
   let pre = i === a ? '' : BOOK.words[i].pre;
   pre = esc(pre).replace(/\n\n/g, '<br><span class="ind"></span>').replace(/\n/g, '<br>');
   h += pre + `<span class="w" data-i="${i}">${esc(BOOK.words[i].t)}</span>`;
  }
  const tl = b === BOOK.words.length ? BOOK.tail : (BOOK.words[b] ? BOOK.words[b].pre.replace(/\s.*$/s, '') : '');
  h += esc(tl);
  txt.innerHTML = h;
  spans = [...txt.querySelectorAll('.w')];
  sup.textContent = ''; doneBox.hidden = true;
  fx.splice(0).forEach(f => { if (f.chip) { f.e.remove(); chips--; } else if (f.hide) f.e.style.display = 'none'; });
  if (live && CFG.mode === 'free' && CFG.stop) for (let i = a; i < b; i++) if (STOP.has(BOOK.words[i].n)) reveal(i, '', 'a');
  advance(true);
  fit(); renderTop(); saveProg();
  if (!live && inp) { inp.value = ''; }
 }
 const span = i => spans[i - BOOK.secs[st.sec][0]];
 function reveal(i, name, kind, gift) {
  if (st.rev.has(i)) return false;
  st.rev.add(i);
  const s = span(i); if (!s) return false;
  s.classList.remove('n'); s.classList.add(kind === 'a' ? 'a' : kind === 'k' ? 'k' : 'r');
  if (name) {
   st.pageTop.set(name, (st.pageTop.get(name) || 0) + 1);
   if (name !== L.you && !gift) { st.top.set(name, (st.top.get(name) || 0) + 1); if (live) { compete(name); lgAdd(name, 1); } }
   s.classList.add('f'); fx.push({ e: s, until: st.time + .65, cls: 'f' });
   if (live && chips < 6) chip(s, '@' + name + (CFG.rank ? badgeIcon(name) : ''));
  }
  if (st.boxes.has(i) && live) boxFound(i, s, name);
  st.lastT = st.time;
  return true;
 }
 const prizes = () => { const l = String(CFG.prizes || '').split('\n').map(x => x.trim()).filter(Boolean); return l.length ? l : LVR.pz.split('\n'); };
 let boxEl = null;
 function boxFound(i, s, name) {
  st.boxes.delete(i); s.classList.add('bx');
  if (!name) return;
  st.boxBy.push(name); st.keys.set(name, (st.keys.get(name) || 0) + 1);
  st.sess.set(name, (st.sess.get(name) || 0) + LG_BOX); lgAdd(name, LG_BOX);
  const pz = prizes()[st.boxN++ % prizes().length];
  if (!boxEl) { boxEl = el('div', 'cr-box', ''); page.appendChild(boxEl); }
  boxEl.innerHTML = `<i>🎁</i><b>${esc(fmt(LVR.found, { u: name }))}</b><span>${esc(LVR.prizeW)}: ${esc(pz)}</span>`;
  boxEl.style.display = ''; boxEl.classList.remove('pop'); void boxEl.offsetWidth; boxEl.classList.add('pop');
  fx.push({ e: boxEl, until: st.time + 4.2, hide: true });
  beep('gift'); setTimeout(() => beep('page'), 160);
  if (typeof log === 'function') log({ user: { name }, src: 'box' }, '🎁 ' + pz, 'ok');
  renderLegend && lv && renderLegend();
 }
 const badgeOf = n => n >= 100 ? ['🏛️', LVR.b3] : n >= 50 ? ['🐛', LVR.b2] : n >= 10 ? ['📖', LVR.b1] : null;
 const badgeIcon = name => { const b = badgeOf(st.top.get(name) || 0); return b ? ' ' + b[0] : ''; };
 const sessTop = n => [...st.sess.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
 // competition: this stream's ranking, badges for the book total, a short notice when the lead changes
 function compete(name) {
  st.sess.set(name, (st.sess.get(name) || 0) + 1);
  if (!CFG.rank) return;
  const tot = st.top.get(name) || 0, b = badgeOf(tot), pb = badgeOf(tot - 1);
  if (b && (!pb || b[0] !== pb[0])) { banner(fmt(LVR.badgeUp, { u: name, b: b[0] + ' ' + b[1] }), '#1f7a3a', 3); beep('gift'); }
  const lead = sessTop(1)[0];
  if (lead && lead[0] !== st.leader && lead[1] >= 3) {
   if (st.leader && st.time - st.leadT > 3) { banner(fmt(LVR.lead, { u: lead[0] }), '#a0612a', 2.6); beep('page'); st.leadT = st.time; }
   st.leader = lead[0];
  }
 }

 /* ---------- league: a season table kept in this browser (days → week / month / year / season) ---------- */
 // 1 point for every word opened by a comment, +5 for a hidden box. Gifts never give points.
 // Only events from a real connection are saved; simulator and demo points are shown but never stored.
 const LG_BOX = 5;
 const pad2 = n => String(n).padStart(2, '0');
 const dkey = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
 const wkStart = d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
 let LGD = null, LGC = null, curSim = false, lgDirty = false, lgSaveT = 0, lgBeatT = 0, lgNeed = false, lgRenderT = -9, lgRot = 0, lgRotT = 10, lgPer = '';
 const lgPrev = {}, lgUp = new Map();
 const lgFresh = () => ({ v: 1, rev: 0, since: dkey(new Date()), d: {}, mo: {} });
 function lgClean(o) {
  if (!o || o.v !== 1 || typeof o.d !== 'object' || typeof o.mo !== 'object' || !o.d || !o.mo) return null;
  const out = { v: 1, rev: +o.rev || 0, since: /^\d{4}-\d\d-\d\d$/.test(o.since) ? o.since : dkey(new Date()), d: {}, mo: {} };
  for (const [g, re] of [['d', /^\d{4}-\d\d-\d\d$/], ['mo', /^\d{4}-\d\d$/]]) for (const [k, m] of Object.entries(o[g])) {
   if (!re.test(k) || !m || typeof m !== 'object') continue;
   const t = out[g][k] = {}; for (const [u, p] of Object.entries(m)) if (u && u.length <= 24 && isFinite(p) && p > 0) t[u] = Math.round(p);
  }
  return out;
 }
 function lgLoad() { LGD = lgClean(store.get('league', null)) || lgFresh(); lgRoll(); lgCache(); }
 function lgRoll() { // days older than 62 → one bucket per month (keeps storage small; weeks never reach that far)
  const lim = dkey(new Date(Date.now() - 62 * 864e5));
  for (const k of Object.keys(LGD.d)) if (k < lim) { const M = LGD.mo[k.slice(0, 7)] || (LGD.mo[k.slice(0, 7)] = {}); for (const [u, p] of Object.entries(LGD.d[k])) M[u] = (M[u] || 0) + p; delete LGD.d[k]; lgDirty = true; }
 }
 function lgSum(filter) {
  const M = new Map();
  for (const g of ['d', 'mo']) for (const [k, o] of Object.entries(LGD[g])) if (filter(k, g)) for (const [u, p] of Object.entries(o)) M.set(u, (M.get(u) || 0) + p);
  return M;
 }
 const lgBest = M => [...M.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0] || null;
 function lgCache() {
  const now = new Date(), day = dkey(now), wk = dkey(wkStart(now)), mon = day.slice(0, 7), yr = day.slice(0, 4);
  const ws = wkStart(now), pws = dkey(new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() - 7));
  const pmD = new Date(now.getFullYear(), now.getMonth() - 1, 1), pm = pmD.getFullYear() + '-' + pad2(pmD.getMonth() + 1), py = String(now.getFullYear() - 1);
  LGC = {
   day, w: lgSum((k, g) => g === 'd' && k >= wk), m: lgSum(k => k.startsWith(mon)), y: lgSum(k => k.startsWith(yr)), s: lgSum(() => true),
   champ: { w: lgBest(lgSum((k, g) => g === 'd' && k >= pws && k < wk)), m: lgBest(lgSum(k => k.startsWith(pm))), y: lgBest(lgSum(k => k.startsWith(py))) }
  };
  lgNeed = true;
 }
 const lgOther = () => !clean && Date.now() - (+store.get('lgbeat', 0) || 0) < 6000; // a stream window is recording
 function lgAdd(name, p) {
  if (!live || !CFG.lg || !LGD) return;
  if (dkey(new Date()) !== LGC.day) { lgRoll(); lgCache(); }
  const real = SRC.on && !curSim;
  if (real && lgOther()) return; // that window saves it; its table reaches us through storage
  if (real) { const o = LGD.d[LGC.day] || (LGD.d[LGC.day] = {}); o[name] = (o[name] || 0) + p; lgDirty = true; }
  for (const k of ['w', 'm', 'y', 's']) LGC[k].set(name, (LGC[k].get(name) || 0) + p);
  lgNeed = true;
 }
 function lgSave() { if (LGD && lgDirty && (clean || !lgOther())) { store.set('league', LGD); lgDirty = false; } }
 const LG_PER = ['live', 'w', 'm', 'y', 's'];
 const lgHasChamp = () => LGC && (LGC.champ.w || LGC.champ.m || LGC.champ.y);
 function lgPeriod() {
  if (CFG.lgP !== 'rot') return CFG.lgP === 'champ' && !lgHasChamp() ? 'w' : CFG.lgP;
  const list = LG_PER.concat(lgHasChamp() ? ['champ'] : []); return list[lgRot % list.length];
 }
 const lgRows = per => [...(per === 'live' ? st.sess : LGC[per] || new Map()).entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
 const lgPerName = per => ({ live: LVR.pLive, w: LVR.pW, m: LVR.pM, y: LVR.pY, s: LVR.pS, champ: LVR.pChamp })[per];
 const lgPrize = per => ({ w: CFG.lgPzW, m: CFG.lgPzM, y: CFG.lgPzY })[per] || '';
 const okLogo = u => /^https:\/\/[^\s"'<>()]+$/i.test(String(u || '')) ? u : '';
 function renderLg() {
  lgNeed = false; lgRenderT = st.time;
  if (!lv) return;
  host.classList.toggle('lgon', !!CFG.lg);
  if (!CFG.lg) { if (lv.lg) lv.lg.style.display = 'none'; lgPanelStat(); return; }
  if (!lv.lg) { lv.lg = el('div', 'cr-lg', ''); host.insertBefore(lv.lg, ov); }
  lv.lg.style.display = '';
  const per = lgPeriod(), N = clamp(+CFG.lgN || 30, 5, 30);
  const logo = okLogo(CFG.lgLogo);
  let h = `<div class="hd"><div class="nm">${esc(CFG.lgName || LVR.lgDef)}</div>${CFG.lgSpon || logo ? `<div class="sp">${logo ? `<img src="${esc(logo)}" alt="">` : ''}${CFG.lgSpon ? esc(fmt(LVR.spon, { s: CFG.lgSpon })) : ''}</div>` : ''}
<div class="pr"><b>${esc(lgPerName(per))}</b>${SRC.on ? '' : `<u>${esc(LVR.demoTag)}</u>`}</div>${lgPrize(per) ? `<div class="pz">${esc(fmt(LVR.przLine, { p: lgPrize(per) }))}</div>` : ''}</div>`;
  if (per === 'champ') {
   h += `<div class="ch">${[['w', LVR.lastW, CFG.lgPzW], ['m', LVR.lastM, CFG.lgPzM], ['y', LVR.lastY, CFG.lgPzY]].filter(x => LGC.champ[x[0]]).map(([k, t, pz]) => `<div><small>${esc(t)}</small><b>👑 @${esc(LGC.champ[k][0])}</b><span>${LGC.champ[k][1]} ${esc(LVR.pts)}${pz ? ' · ' + esc(pz) : ''}</span></div>`).join('')}</div>`;
  } else {
   const rows = lgRows(per).slice(0, N), prev = lgPrev[per] || new Map(), now = new Map();
   rows.forEach(([n], i) => { now.set(n, i); const p = prev.get(n); if (per === lgPer && (p == null ? prev.size > 0 : i < p)) lgUp.set(per + '|' + n, st.time + 2.2); });
   lgPrev[per] = now; lgPer = per;
   h += `<ol class="n${N > 20 ? 30 : N > 10 ? 20 : 10}">${rows.length ? rows.map(([n, c], i) => {
    const up = (lgUp.get(per + '|' + n) || 0) > st.time;
    return `<li class="${i < 3 ? 't' + (i + 1) : ''}${up ? ' up' : ''}"><i>${i < 3 ? ['👑', '🥈', '🥉'][i] : i + 1}</i><b>@${esc(n)}${esc(badgeIcon(n))}${st.keys.get(n) ? ' 🗝️' : ''}</b>${up ? '<s>▲</s>' : ''}<em>${c}</em></li>`;
   }).join('') : `<li class="e">${esc(LVR.lgEmpty)}</li>`}</ol>`;
  }
  h += `<div class="ft">${esc(LVR.lgFoot)}</div>`;
  lv.lg.innerHTML = h;
  lgPanelStat();
 }
 function lgPanelStat() {
  if (!pn || !LGC) return;
  const e = pn.querySelector('[data-b=lgst]'); if (!e) return;
  const d = LGD.since.split('-'), since = new Date(+d[0], +d[1] - 1, +d[2]).toLocaleDateString(lang);
  e.textContent = fmt(LVR.lgStat, { n: LGC.s.size, d: since }) + ' · ' + (lgOther() ? LVR.lgFol : SRC.on ? LVR.lgRec : LVR.lgTest);
 }
 function lgDownload(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
 function lgBackup() { lgSave(); lgDownload('chat-reads-league-' + dkey(new Date()) + '.json', new Blob([JSON.stringify(Object.assign({ app: 'chat-reads-league', name: CFG.lgName }, LGD))], { type: 'application/json' })); }
 function lgRestore(text) {
  let o = null; try { o = lgClean(JSON.parse(text)); } catch (e) { }
  if (!o) { banner(LVR.rsBad, '#a0412a', 3); return false; }
  o.rev = Math.max(o.rev, LGD.rev) + 1; LGD = o; lgRoll(); store.set('league', LGD); lgDirty = false; lgCache(); renderLg();
  banner(LVR.rsOk, '#1f7a3a', 3); return true;
 }
 function lgReset() { LGD = Object.assign(lgFresh(), { rev: LGD.rev + 1 }); store.set('league', LGD); lgDirty = false; for (const k in lgPrev) delete lgPrev[k]; lgCache(); renderLg(); }
 // shareable picture of the table (1080 × 1350): week / month / year winners for social posts
 function lgPng() {
  let per = CFG.lgP === 'rot' || CFG.lgP === 'champ' ? 'w' : CFG.lgP;
  const rows = lgRows(per).slice(0, 30), W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), bg = g.createRadialGradient(W / 2, 300, 50, W / 2, 500, 1100);
  bg.addColorStop(0, '#3a2e22'); bg.addColorStop(1, '#14110d'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const T = (t, x, y, f, col, al) => { g.font = f; g.fillStyle = col; g.textAlign = al || 'left'; g.fillText(t, x, y); };
  const fit = (t, f, max) => { g.font = f; let s = String(t); while (s.length > 1 && g.measureText(s).width > max) s = s.slice(0, -2) + '…'; return s; };
  T(fit(CFG.lgName || LVR.lgDef, "600 62px Lora, Georgia, serif", W - 120), W / 2, 110, "600 62px Lora, Georgia, serif", '#f5ead6', 'center');
  T((lgPerName(per) + ' · ' + new Date().toLocaleDateString(lang)).toUpperCase(), W / 2, 162, '800 28px system-ui, sans-serif', '#e9b44c', 'center');
  let y0 = 200;
  if (CFG.lgSpon) { T(fit(fmt(LVR.spon, { s: CFG.lgSpon }), '700 26px system-ui, sans-serif', W - 120), W / 2, 202, '700 26px system-ui, sans-serif', '#cbb894', 'center'); y0 += 34; }
  if (lgPrize(per)) { T(fit(fmt(LVR.przLine, { p: lgPrize(per) }), '800 28px system-ui, sans-serif', W - 120), W / 2, y0 + 8, '800 28px system-ui, sans-serif', '#f5d28a', 'center'); y0 += 40; }
  const rh = Math.min(36, (H - 110 - y0 - 20) / Math.max(1, rows.length));
  rows.forEach(([n, p], i) => {
   const y = y0 + 20 + i * rh;
   g.fillStyle = i < 3 ? 'rgba(233,180,76,' + (.32 - i * .08) + ')' : i % 2 ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.08)';
   g.fillRect(90, y, W - 180, rh - 4);
   const f = '700 ' + Math.round(rh * .62) + 'px system-ui, sans-serif', ty = y + rh * .68;
   T(i < 3 ? ['👑', '🥈', '🥉'][i] : String(i + 1), 140, ty, f, '#e9b44c', 'center');
   T(fit('@' + n + badgeIcon(n), f, W - 470), 190, ty, f, '#f5ead6');
   T(p + ' ' + LVR.pts, W - 110, ty, f, '#e9b44c', 'right');
  });
  if (!rows.length) T(LVR.lgEmpty, W / 2, y0 + 80, '700 30px system-ui, sans-serif', '#cbb894', 'center');
  T(LVR.lgFoot, W / 2, H - 78, '600 24px system-ui, sans-serif', '#b9a682', 'center');
  T('Chat Reads · pickradar.net', W / 2, H - 38, '800 28px system-ui, sans-serif', '#e9b44c', 'center');
  c.toBlob(b => b && lgDownload('chat-reads-' + per + '-' + dkey(new Date()) + '.png', b), 'image/png');
 }

 // shareable snapshot: the table travels inside the link (#lig=…), nothing is stored on a server and nothing is indexed
 const b64u = u8 => { let t = ''; for (let i = 0; i < u8.length; i += 0x8000) t += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
 const unb64u = t => { t = t.replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; const b = atob(t), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
 const zpipe = async (u8, S) => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new S('deflate-raw'))).arrayBuffer());
 async function lgShareUrl() {
  lgCache(); // stored points only (test points are not shared)
  const names = [], ix = new Map(), id = n => { if (!ix.has(n)) { ix.set(n, names.length); names.push(n); } return ix.get(n); };
  const per = {}; for (const k of ['w', 'm', 'y', 's']) per[k] = lgRows(k).slice(0, 30).map(([n, p]) => [id(n), p]);
  const ch = {}; for (const k of ['w', 'm', 'y']) if (LGC.champ[k]) ch[k] = [id(LGC.champ[k][0]), LGC.champ[k][1]];
  const raw = new TextEncoder().encode(JSON.stringify({ n: CFG.lgName || '', s: CFG.lgSpon || '', z: [CFG.lgPzW || '', CFG.lgPzM || '', CFG.lgPzY || ''], t: LGC.day, f: LGD.since, u: names, p: per, c: ch }));
  let tag = 'j', body = raw;
  if (global.CompressionStream) { try { body = await zpipe(raw, global.CompressionStream); tag = 'z'; } catch (e) { body = raw; tag = 'j'; } }
  return location.origin + location.pathname + '#lig=1' + tag + b64u(body);
 }
 async function lgDecode(h) {
  const m = /^#lig=1([zj])([A-Za-z0-9_-]{4,12000})$/.exec(h || ''); if (!m) return null;
  let u8 = unb64u(m[2]); if (m[1] === 'z') u8 = await zpipe(u8, global.DecompressionStream);
  const o = JSON.parse(new TextDecoder().decode(u8));
  if (!o || !Array.isArray(o.u) || !o.p || typeof o.p !== 'object') return null;
  const u = o.u.slice(0, 200).map(n => cleanName(String(n).slice(0, 24)));
  const rows = a => (Array.isArray(a) ? a : []).slice(0, 30).filter(r => Array.isArray(r) && u[r[0]] != null && isFinite(r[1])).map(r => [u[r[0]], Math.max(0, Math.round(r[1]))]);
  const day = t => /^\d{4}-\d\d-\d\d$/.test(t) ? t : '';
  const z = Array.isArray(o.z) ? o.z : [];
  return { n: cleanText(o.n, 40), s: cleanText(o.s, 40), z: [0, 1, 2].map(i => cleanText(z[i], 60)), t: day(o.t), f: day(o.f),
   p: { w: rows(o.p.w), m: rows(o.p.m), y: rows(o.p.y), s: rows(o.p.s) },
   c: Object.fromEntries(['w', 'm', 'y'].filter(k => o.c && Array.isArray(o.c[k]) && u[o.c[k][0]] != null).map(k => [k, [u[o.c[k][0]], Math.round(+o.c[k][1] || 0)]])) };
 }
 const lgDay = t => { if (!t) return ''; const d = t.split('-'); return new Date(+d[0], +d[1] - 1, +d[2]).toLocaleDateString(lang); };
 let LGV = null;
 function lgView(tab) {
  const o = LGV, tabs = [['w', LVR.pW], ['m', LVR.pM], ['y', LVR.pY], ['s', LVR.pS]].filter(([k]) => o.p[k].length);
  if (Object.keys(o.c).length) tabs.push(['champ', LVR.pChamp]);
  if (!tabs.some(x => x[0] === tab)) tab = tabs.length ? tabs[0][0] : 'w';
  const pz = { w: o.z[0], m: o.z[1], y: o.z[2] }[tab] || '';
  const body = tab === 'champ'
   ? `<div class="ch">${[['w', LVR.lastW, o.z[0]], ['m', LVR.lastM, o.z[1]], ['y', LVR.lastY, o.z[2]]].filter(x => o.c[x[0]]).map(([k, t, p]) => `<div><small>${esc(t)}</small><b>👑 @${esc(o.c[k][0])}</b><span>${o.c[k][1]} ${esc(LVR.pts)}${p ? ' · ' + esc(p) : ''}</span></div>`).join('')}</div>`
   : `<ol>${(o.p[tab] || []).map(([n, c], i) => `<li class="${i < 3 ? 't' + (i + 1) : ''}"><i>${i < 3 ? ['👑', '🥈', '🥉'][i] : i + 1}</i><b>@${esc(n)}</b><em>${c} ${esc(LVR.pts)}</em></li>`).join('') || `<li class="e">${esc(LVR.lgEmpty)}</li>`}</ol>`;
  showOv(`<div class="cr-lgv"><h2>${esc(o.n || LVR.lgDef)}<span>${esc(LVR.vSub)}</span></h2>${o.s ? `<div class="sp">${esc(fmt(LVR.spon, { s: o.s }))}</div>` : ''}
<div class="tb">${tabs.map(([k, t]) => `<button type="button" data-a="lgt" data-t="${k}" class="${k === tab ? 'on' : ''}">${esc(t)}</button>`).join('')}</div>
${pz && tab !== 'champ' ? `<div class="pz">${esc(fmt(LVR.przLine, { p: pz }))}</div>` : ''}${body}
<div class="row"><button class="cr-btn" data-a="lgplay">${esc(LVR.vPlay)}</button><button class="cr-btn g" data-a="lgown">${esc(LVR.vOwn)}</button></div>
<small>${esc([o.t ? fmt(LVR.vAt, { d: lgDay(o.t) }) : '', o.f ? fmt(LVR.vSince, { d: lgDay(o.f) }) : ''].filter(Boolean).join(' · '))}<br>${esc(LVR.lgFoot)}<br>${esc(LVR.vNote)}</small></div>`);
  ov.scrollTop = 0;
 }
 async function lgOpen() {
  if (!/^#lig=/.test(location.hash)) return;
  try { LGV = await lgDecode(location.hash); } catch (e) { LGV = null; }
  if (LGV) lgView(); else banner(LVR.vBad, '#a0412a', 4);
 }
 function chip(s, t) {
  const r = s.getBoundingClientRect(), pr = page.getBoundingClientRect(), sc = pr.width / page.offsetWidth || 1;
  const c = el('div', 'cr-chip'); c.textContent = t;
  c.style.left = ((r.left + r.width / 2 - pr.left) / sc) + 'px'; c.style.top = ((r.top - pr.top) / sc) + 'px';
  page.appendChild(c); chips++; fx.push({ e: c, until: st.time + 1.4, chip: true });
 }
 function advance(quiet) {
  const [a, b] = BOOK.secs[st.sec];
  if (!live || CFG.mode === 'seq') {
   while (st.ptr < b && (st.rev.has(st.ptr) || (live && CFG.stop && STOP.has(BOOK.words[st.ptr].n)))) { if (!st.rev.has(st.ptr)) reveal(st.ptr, '', 'a'); st.ptr++; }
   spans.forEach(s => s.classList.remove('n'));
   if (st.ptr < b) span(st.ptr).classList.add('n');
  }
  if (st.rev.size >= b - a && st.phase === 'read') pageDone();
  if (!quiet) renderTop();
 }
 function pageDone() {
  st.phase = 'done'; st.t = live ? clamp(+CFG.done || 8, 2, 120) : 1.4;
  const best = [...st.pageTop.entries()].filter(([n]) => n !== L.you).sort((x, y) => y[1] - x[1])[0];
  doneBox.querySelector('b').textContent = '✓ ' + (st.sec >= BOOK.secs.length - 1 ? L.end : L.done);
  doneBox.querySelector('span').textContent = live ? [best ? fmt(LVR.topBy, { u: best[0] }) : '', st.boxBy.length ? fmt(LVR.boxBy, { u: st.boxBy.join(', @') }) : '', LVR.readAloud].filter(Boolean).join(' · ') : '';
  doneBox.hidden = false;
  saveProg(); beep('page');
  if (live) { feedLog(); }
 }
 function nextPage() {
  if (st.sec >= BOOK.secs.length - 1) { st.phase = 'end'; showEnd(); return; }
  openSection(st.sec + 1);
 }
 function renderTop() {
  if (!BOOK) return;
  top.querySelector('.bk b').textContent = BOOK.title;
  top.querySelector('.bk span').textContent = BOOK.author;
  const n = BOOK.secs.length, [a, b] = BOOK.secs[st.sec];
  top.querySelector('.pg span').textContent = fmt(L.page, { n: st.sec + 1, t: n });
  const done = a + st.rev.size;
  top.querySelector('.pg u').style.width = (done / BOOK.words.length * 100).toFixed(1) + '%';
  if (live) renderNext();
 }
 // biggest font that fits the page
 function fit() {
  if (!BOOK) return;
  let lo = 8, hi = live ? 64 : 40;
  for (let k = 0; k < 14; k++) { const m = (lo + hi) / 2; txt.style.fontSize = m + 'px'; if (txt.scrollHeight <= txt.clientHeight + 1) lo = m; else hi = m; }
  txt.style.fontSize = lo + 'px';
 }
 function resize() {
  const W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
  const u = live ? Math.min(W / 540, H / 960) : clamp(Math.min(W / 640, H / 560), .72, 1.25);
  host.style.fontSize = (16 * u).toFixed(2) + 'px';
  if (live) { const on = !!(CFG.lg && lv && lv.lg), fs = 16 * u, w = Math.max(11.4 * fs, .24 * W); host.style.paddingRight = on ? (w + 1.3 * fs).toFixed(1) + 'px' : ''; if (on) lv.lg.style.width = w.toFixed(1) + 'px'; }
  fit();
 }
 new ResizeObserver(resize).observe(host);

 /* ---------- sound ---------- */
 let AC = null, muted = store.get('mute', false);
 function beep(type) {
  if (muted) return;
  try {
   AC = AC || new (global.AudioContext || global.webkitAudioContext)();
   const P = { tick: [1300, 1700, .05, 'sine', .03], page: [520, 1040, .45, 'triangle', .06], bad: [220, 160, .12, 'square', .03], gift: [990, 1480, .25, 'sine', .07] }[type] || [600, 600, .1, 'sine', .05];
   const t0 = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
   o.type = P[3]; o.frequency.setValueAtTime(P[0], t0); o.frequency.exponentialRampToValueAtTime(P[1], t0 + P[2]);
   g.gain.setValueAtTime(P[4], t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + P[2] + .05);
   o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + P[2] + .08);
  } catch (e) { }
 }

 /* ---------- loading books ---------- */
 let JSZipP = null;
 function needZip() {
  if (global.JSZip) return Promise.resolve(global.JSZip);
  return JSZipP || (JSZipP = new Promise((ok, no) => { const s = document.createElement('script'); s.src = opts.jszip || '/assets/jszip.min.js'; s.onload = () => ok(global.JSZip); s.onerror = no; document.head.appendChild(s); }));
 }
 async function readEpub(buf) {
  const Z = await (await needZip()).loadAsync(buf);
  const cont = await Z.file('META-INF/container.xml').async('string');
  const opfPath = /full-path="([^"]+)"/.exec(cont)[1];
  const opf = new DOMParser().parseFromString(await Z.file(opfPath).async('string'), 'application/xml');
  const base = opfPath.replace(/[^/]*$/, '');
  const get = tag => { const e = opf.getElementsByTagNameNS('*', tag)[0]; return e ? e.textContent.trim() : ''; };
  const man = {}; [...opf.getElementsByTagNameNS('*', 'item')].forEach(i => man[i.getAttribute('id')] = i.getAttribute('href'));
  const norm = p => { const out = []; p.split('/').forEach(x => { if (x === '..') out.pop(); else if (x && x !== '.') out.push(x); }); return out.join('/'); };
  let text = '';
  for (const r of opf.getElementsByTagNameNS('*', 'itemref')) {
   const href = man[r.getAttribute('idref')]; if (!href) continue;
   const f = Z.file(norm(base + decodeURIComponent(href.split('#')[0]))); if (!f) continue;
   const doc = new DOMParser().parseFromString(await f.async('string'), 'text/html');
   doc.querySelectorAll('script,style,nav').forEach(e => e.remove());
   doc.querySelectorAll('br').forEach(e => e.replaceWith('\n'));
   doc.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,blockquote,section').forEach(e => e.append('\n\n'));
   const t = (doc.body ? doc.body.textContent : '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*/g, '\n\n').trim();
   if (t) text += t + '\n\n';
  }
  return { title: get('title'), author: get('creator'), text };
 }
 async function readFile(f) {
  try {
   if (/\.epub$/i.test(f.name) || f.type === 'application/epub+zip') { const b = await readEpub(await f.arrayBuffer()); return b.text ? b : null; }
   let t = await f.text();
   if (/�/.test(t.slice(0, 4000))) { try { t = new TextDecoder('windows-1254').decode(await f.arrayBuffer()); } catch (e) { } }
   return { title: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '), author: '', text: t };
  } catch (e) { return null; }
 }
 let onLoaded = null;
 file.addEventListener('change', async () => {
  const f = file.files && file.files[0]; file.value = ''; if (!f) return;
  banner(L.loading);
  const b = await readFile(f);
  if (!b || !loadBook(b.title, b.author, b.text)) { banner(L.readErr); return; }
  banner(''); onLoaded && onLoaded();
 });
 const loadDemo = () => { const D = DEMO[lang] || DEMO.en; loadBook(D.title, D.author, D.text, true); CFG.book = 'demo'; onLoaded && onLoaded(); };
 function loadStored() { const b = store.get('book', null); return b && b.text ? loadBook(b.title, b.author, b.text, true, b.id) : false; }

 /* ---------- banner (small notice at the top of the page) ---------- */
 const ban = el('div', '', ''); ban.style.cssText = 'position:absolute;left:50%;top:.4em;transform:translateX(-50%);z-index:4;max-width:92%;padding:.35em .8em;border-radius:.5em;background:#2a1d0c;color:#f5ead6;font:700 .72em system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:none';
 page.appendChild(ban);
 let banT = 0;
 function banner(t, color, dur) { if (!t) { ban.style.display = 'none'; return; } ban.textContent = t; ban.style.background = color || '#2a1d0c'; ban.style.display = ''; banT = dur || 3; }

 /* ---------- normal mode: type the next word ---------- */
 let inp = null, stEl = null;
 function normalUI() {
  const row = el('div', 'cr-in', `<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="next"><div class="st"></div><button class="cr-btn g" type="button" data-a="menu" title="${esc(L.menu)}">☰</button>`);
  host.insertBefore(row, ov);
  inp = row.querySelector('input'); stEl = row.querySelector('.st'); inp.placeholder = L.typePh;
  row.querySelector('[data-a=menu]').addEventListener('click', menu);
  const accept = () => { reveal(st.ptr, L.you); st.typed++; st.streak++; if (!st.t0) st.t0 = st.time; beep('tick'); advance(); inp.value = ''; inp.classList.remove('bad'); stats(); };
  inp.addEventListener('input', () => {
   if (!BOOK || st.phase !== 'read') { inp.value = ''; return; }
   const v = inp.value, want = BOOK.words[st.ptr] && BOOK.words[st.ptr].n;
   const tk = tokens(v);
   if (tk.length === 1 && tk[0] === want && !/\s$/.test(v)) return accept();
   if (/\s$/.test(v)) { if (tk[tk.length - 1] === want) return accept(); inp.value = ''; if (tk.length) { inp.classList.add('bad'); st.streak = 0; beep('bad'); stats(); setTimeout(() => inp.classList.remove('bad'), 260); } }
   else inp.classList.toggle('bad', !!tk.length && !want.startsWith(tk[tk.length - 1]));
  });
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); inp.value += ' '; inp.dispatchEvent(new Event('input')); } });
  page.addEventListener('pointerdown', () => inp.focus());
 }
 function stats() {
  if (!stEl) return;
  const min = Math.max(.1, (st.time - (st.t0 || st.time)) / 60);
  stEl.innerHTML = `${st.t0 ? Math.round(st.typed / min) : 0} ${esc(L.wpm)}<small>${st.streak} ${esc(L.streak)}</small>`;
 }
 function showOv(h) { ov.innerHTML = h; ov.hidden = false; }
 function menu() {
  const b = store.get('book', null), pr = b && b.id ? store.get('prog.' + b.id, null) : null;
  showOv(`<h2>${esc(L.name)}<span>${esc(L.sub)}</span></h2><p>${esc(L.intro)}</p>
<div class="row">${b ? `<button class="cr-btn" data-a="cont">▶ ${esc(fmt(L.cont, { t: b.title.slice(0, 30), n: (pr ? pr.sec : 0) + 1 }))}</button>` : ''}<button class="cr-btn${b ? ' g' : ''}" data-a="demo">📖 ${esc(L.demo)}</button><button class="cr-btn g" data-a="file">📂 ${esc(L.upload)}</button><button class="cr-btn g" data-a="paste">📋 ${esc(L.paste)}</button></div>
<div class="row" data-p hidden><textarea placeholder="${esc(L.pastePh)}"></textarea><button class="cr-btn" data-a="pasteok">${esc(L.load)}</button></div>
<small>${esc(L.pd)}</small>`);
 }
 function showEnd() {
  const tops = [...st.top.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  showOv(`<h2>${esc(L.end)}<span>${esc(BOOK.title)}</span></h2>${live && tops.length ? `<p>📚 ${esc(LVR.worms)}: ${tops.map(([n, c]) => '@' + esc(n) + ' ' + c).join(' · ')}</p>` : ''}${live ? '' : `<div class="row"><button class="cr-btn" data-a="again">${esc(L.again)}</button><button class="cr-btn g" data-a="menu">${esc(L.books)}</button></div>`}`);
 }
 ov.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'demo') loadDemo();
  else if (a === 'cont') { if (loadStored()) onLoaded && onLoaded(); }
  else if (a === 'file') file.click();
  else if (a === 'paste') { const r = ov.querySelector('[data-p]'); r.hidden = false; r.querySelector('textarea').focus(); }
  else if (a === 'pasteok') { const t = ov.querySelector('textarea').value; if (loadBook((t.trim().split('\n')[0] || '—').slice(0, 60), '', t)) onLoaded && onLoaded(); }
  else if (a === 'again') { openSection(0); ov.hidden = true; }
  else if (a === 'menu') menu();
  else if (a === 'lgt') lgView(b.dataset.t);
  else if (a === 'lgplay') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } menu(); }
  else if (a === 'lgown') location.href = location.pathname + '?live=1';
 });
 onLoaded = () => { ov.hidden = true; if (inp) { st.typed = 0; st.t0 = 0; st.streak = 0; stats(); inp.focus(); } if (live) { renderLegend(); renderPanelBook(); obsUrl && obsUrl(); } };

 /* ======================= LIVE MODE ======================= */
 const LV = Object.assign({}, SRC_TXT.en, SRC_TXT[lang]);
 const LVR = Object.assign({}, LIVE_CR.en, LIVE_CR[lang]);
 Object.assign(LV, LVR);
 const SAVED = clean ? {} : store.get('livesrc', {});
 const SRC = { kind: 'sim', on: false, ws: null, st: 'off', msg: '', retry: 0, t: null, n: 0, gen: 0,
  opt: { port: Math.round(+QS.get('port')) || 21213, ch: QS.get('ch') || SAVED.ch || '', yk: QS.get('yk') || SAVED.yk || '', yv: QS.get('yv') || SAVED.yv || '', ss: QS.get('ss') || SAVED.ss || '' } };
 const srcWant = QS.get('src') || SAVED.kind || '';
 const demoMode = QS.get('demo') === '1' && !srcWant;
 const LS = { users: new Map(), seen: new Set(), seenQ: [], log: [], autoT: 0, auto: demoMode, n: 0, last: null };
 const BAD_WORDS = ['fuck', 'shit', 'bitch', 'dick', 'cunt', 'nigg', 'fag', 'whore', 'slut', 'amk', 'aq', 'orospu', 'sik', 'piç', 'pic', 'yarrak', 'göt', 'got', 'ibne', 'puta', 'mierda', 'pendej', 'caralho', 'porra', 'anjing', 'bangsat', 'kontol', 'memek'];
 const blockList = () => String(CFG.block || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
 function cleanText(t, max) {
  t = String(t || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[<>]/g, '').trim().slice(0, max || 46);
  for (const w of BAD_WORDS.concat(blockList())) if (w) t = t.replace(new RegExp('(^|[^\\p{L}])(' + [...w].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '+').join('') + ')(?=$|[^\\p{L}])', 'giu'), (m, a, b) => a + '*'.repeat(b.length));
  return t;
 }
 const cleanName = n => { const c = cleanText(String(n || '').replace(/^@/, ''), 18); return c.includes('*') ? 'viewer' : c || 'viewer'; };
 const isCoins = () => SRC.kind === 'sim' || SRC.kind === 'tikfinity';

 let lv = null;
 function liveUI() {
  css.textContent += `
.cr-stage{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}
.cr.lv .cr-top{padding-left:0}
.lv-pill{flex:none;font:800 .72em system-ui,sans-serif;letter-spacing:.08em;padding:.3em .7em;border-radius:99em;background:#ff3b5c;color:#fff}
.lv-mode:empty{display:none}.lv-mode{flex:none;font:800 .66em system-ui,sans-serif;letter-spacing:.08em;padding:.3em .6em;border-radius:99em;background:#e9b44c;color:#2a1d0c}
.cr-nx{flex:none;display:flex;align-items:center;gap:.7em;padding:.5em .8em;border-radius:.6em;background:#f5ead6;box-shadow:0 .3em 0 #a06d1c}
.cr-nx small{flex:none;font:800 .68em system-ui,sans-serif;letter-spacing:.08em;color:#8a5a1c;width:5.6em;line-height:1.1}
.cr-nx b{flex:1;min-width:0;font:600 2.1em/1.1 'Lora',Georgia,serif;color:#231a12;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-nx b.fr{font:800 1.05em/1.2 system-ui,sans-serif;white-space:normal}
.cr-nx em{flex:none;font:800 .7em system-ui,sans-serif;font-style:normal;color:#8a5a1c;text-align:right}
.cr-leg{flex:none;padding:.55em .7em;border-radius:.6em;background:rgba(10,8,6,.72);color:#f5ead6;font:700 .7em/1.35 system-ui,sans-serif}
.cr-leg .g{display:grid;grid-template-columns:1fr 1fr;gap:.2em .8em}
.cr-leg .w{margin-top:.35em;padding-top:.4em;border-top:1px solid rgba(255,255,255,.12);color:#e9b44c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:1.32em;font-weight:800}
.cr-leg .w small{display:block;font-size:.62em;color:#b9a682;font-weight:700;margin-bottom:.1em}
.cr-leg .bx{margin-top:.35em;padding:.3em .5em;border-radius:.4em;background:rgba(233,180,76,.18);color:#f5d28a;font-weight:800}
.cr-leg .n{margin-top:.25em;color:#b9a682;font-weight:600;font-size:.92em;text-align:center}
.cr.lgon .cr-nx b{font-size:1.6em}.cr.lgon .cr-nx small{width:4.6em}
.cr-lg{position:absolute;top:.8em;right:.8em;bottom:.8em;z-index:2;display:flex;flex-direction:column;gap:.35em;padding:.55em .5em;border-radius:.6em;background:rgba(10,8,6,.8);box-shadow:0 0 0 .1em rgba(233,180,76,.35);color:#f5ead6;font:700 .78em/1.25 system-ui,sans-serif;overflow:hidden}
.cr-lg .hd{flex:none;text-align:center}
.cr-lg .nm{font:600 1.5em/1.1 'Lora',Georgia,serif;color:#f5ead6;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.cr-lg .sp{display:flex;align-items:center;justify-content:center;gap:.35em;margin-top:.25em;color:#cbb894;font-size:.86em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-lg .sp img{height:1.8em;max-width:5em;object-fit:contain;border-radius:.2em}
.cr-lg .pr{margin-top:.35em;display:flex;align-items:center;justify-content:center;gap:.4em}
.cr-lg .pr b{padding:.18em .7em;border-radius:99em;background:#e9b44c;color:#2a1d0c;font:800 .92em system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase}
.cr-lg .pr u{text-decoration:none;padding:.15em .45em;border-radius:99em;background:#ff3b5c;color:#fff;font-size:.72em;letter-spacing:.08em}
.cr-lg .pz{margin-top:.3em;padding:.25em .4em;border-radius:.4em;background:rgba(233,180,76,.16);color:#f5d28a;font-size:.86em}
.cr-lg ol{flex:1;min-height:0;margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.12em}
.cr-lg ol.n30{font-size:.92em}.cr-lg ol.n20{font-size:1.15em}.cr-lg ol.n10{font-size:1.7em}
.cr-lg li{flex:1 1 0;max-height:2.4em;min-height:0;display:flex;align-items:center;gap:.35em;padding:0 .4em;border-radius:.35em;background:rgba(255,255,255,.05);transition:background .4s}
.cr-lg li:nth-child(even){background:rgba(255,255,255,.09)}
.cr-lg li.t1{background:rgba(233,180,76,.34)}.cr-lg li.t2{background:rgba(233,180,76,.24)}.cr-lg li.t3{background:rgba(233,180,76,.16)}
.cr-lg li.up{background:rgba(80,190,110,.42);animation:crlg .6s}
@keyframes crlg{from{transform:translateX(.6em)}}
.cr-lg li i{flex:none;width:1.6em;text-align:center;font-style:normal;color:#e9b44c;font-weight:800}
.cr-lg li b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cr-lg li s{flex:none;text-decoration:none;color:#7be29a;font-size:.8em}
.cr-lg li em{flex:none;font-style:normal;font-weight:800;color:#e9b44c}
.cr-lg li.e{flex:none;max-height:none;padding:.6em;text-align:center;color:#cbb894;font-weight:600}
.cr-lg .ch{flex:1;display:flex;flex-direction:column;justify-content:center;gap:.6em}
.cr-lg .ch div{padding:.5em;border-radius:.5em;background:rgba(233,180,76,.16);text-align:center}
.cr-lg .ch small{display:block;color:#cbb894;font-size:.85em;text-transform:uppercase;letter-spacing:.08em}
.cr-lg .ch b{display:block;font-size:1.25em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:.15em 0}
.cr-lg .ch span{color:#f5d28a;font-size:.9em}
.cr-lg .ft{flex:none;text-align:center;color:#b9a682;font-weight:600;font-size:.74em;line-height:1.2}
.lv-panel{position:absolute;top:0;right:0;bottom:0;width:380px;box-sizing:border-box;overflow:auto;padding:14px;background:#11182b;color:#eef1f8;font:600 13px system-ui,sans-serif;border-left:1px solid #2a3555;z-index:3}
.lv-panel h3{margin:0;font:800 20px 'Baloo 2',system-ui,sans-serif}
.lv-panel h5{margin:14px 0 6px;font:800 11px system-ui,sans-serif;letter-spacing:1.5px;color:#9aa6c4;text-transform:uppercase}
.lv-panel .note{margin-top:6px;padding:8px 10px;border-radius:10px;border:2px solid #ffc93c;background:rgba(255,201,60,.1);color:#ffe07a;font-size:12px}
.lv-src{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;background:#151c30;margin-top:5px;color:#8e99b8}
.lv-src.on{background:rgba(91,192,235,.14);border:2px solid #5bc0eb;color:#eef1f8}.lv-src em{margin-left:auto;font-style:normal;font-size:10.5px;font-weight:800}
.lv-src input{padding:7px 9px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:600 12.5px system-ui,sans-serif;box-sizing:border-box}
.lv-sim{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.lv-sim button{border:0;border-radius:10px;padding:8px 4px;font:800 12px system-ui,sans-serif;color:#1e2235;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.35)}
.lv-row{display:flex;gap:6px;align-items:center;margin-top:5px}.lv-row label{flex:1}
.lv-row input[type=number],.lv-row input[type=text]{width:92px;padding:5px 7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:700 13px system-ui,sans-serif}
.lv-row input[type=text]{width:100%}
.lv-url{display:flex;gap:6px}.lv-url input{flex:1;min-width:0;padding:7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#c2cae0;font:12px ui-monospace,monospace}
.lv-btn{border:0;border-radius:9px;padding:7px 12px;background:#ffc93c;color:#1e2235;font:800 12px system-ui,sans-serif;cursor:pointer;text-decoration:none}
.lv-btn.g{background:transparent;border:2px solid #5a6585;color:#eef1f8}
.lv-log{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.lv-log li{display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center;padding:5px 7px;border-radius:8px;background:#151c30;font-size:11.5px}
.lv-log span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lv-log b{font-size:10px;padding:2px 6px;border-radius:999px;color:#1e2235}
.lv-tog{position:absolute;right:10px;top:10px;z-index:4;display:none}
@media (max-width:820px){.lv-panel{top:auto;left:0;width:auto;height:52%;border-left:0;border-top:1px solid #2a3555}.lv-panel.hide{display:none}.lv-tog{display:block}}
`;
  lv = {};
  const tp = top.querySelector('.bk'); tp.insertAdjacentHTML('beforebegin', '<span class="lv-pill">LIVE</span><span class="lv-mode"></span>');
  lv.nx = el('div', 'cr-nx', '<small></small><b></b><em></em>');
  lv.leg = el('div', 'cr-leg', '');
  host.insertBefore(lv.nx, ov); host.insertBefore(lv.leg, ov);
  renderLegend(); modeLabel(); renderNext();
 }
 function modeLabel() {
  if (!lv) return;
  top.querySelector('.lv-mode').textContent = SRC.on ? (SRC.st === 'on' ? '' : SHORT[SRC.kind].toUpperCase() + '…') : LS.auto ? LV.demo : LV.sim;
 }
 const coinTxt = c => isCoins() ? String(c) : '$' + (c / 75).toFixed(2);
 function renderLegend() {
  if (!lv) return;
  const tops = sessTop(3);
  lv.leg.innerHTML = `<div class="g"><div>💬 ${esc(CFG.mode === 'free' ? LVR.legFree : LVR.legSeq)}</div><div>${esc(LVR.g1)}</div><div>${esc(fmt(LVR.g2, { c: coinTxt(CFG.starC) }))}</div><div>${esc(LVR.fair)}</div></div>${+CFG.box > 0 ? `<div class="bx">${esc(LVR.boxLeg)}</div>` : ''}
${CFG.rank && !CFG.lg ? `<div class="w"><small>${esc(LVR.legRank)}</small>${tops.length ? tops.map(([n, c], i) => ['👑', '🥈', '🥉'][i] + ' @' + esc(n) + esc(badgeIcon(n)) + (st.keys.get(n) ? ' 🗝️' : '') + ' ' + c).join('   ') : '—'}</div>` : ''}`;
  lv.legKey = legKey();
 }
 const legKey = () => sessTop(3).map(x => x.join(':') + badgeIcon(x[0]) + (st.keys.get(x[0]) || 0)).join('|') + CFG.mode + CFG.starC + CFG.rank + CFG.box + CFG.lg;
 function renderNext() {
  if (!lv || !BOOK) return;
  const [a, b] = BOOK.secs[st.sec], left = (b - a) - st.rev.size;
  const sm = lv.nx.querySelector('small'), bb = lv.nx.querySelector('b'), em = lv.nx.querySelector('em');
  if (st.phase === 'done' || st.phase === 'end') { sm.textContent = '✓'; bb.className = 'fr'; bb.textContent = st.phase === 'end' || st.sec >= BOOK.secs.length - 1 ? L.end : fmt(LVR.nextIn, { s: Math.max(0, Math.ceil(st.t)) }); em.textContent = ''; return; }
  const bxs = st.boxes.size ? '🎁 ' + st.boxes.size + ' · ' : '';
  if (CFG.mode === 'free') { sm.textContent = '💬'; bb.className = 'fr'; bb.textContent = LVR.freeL; em.textContent = bxs + fmt(LVR.leftN, { n: left }); }
  else { sm.textContent = LVR.nextL; bb.className = ''; bb.textContent = st.ptr < b ? BOOK.words[st.ptr].t : '…'; em.textContent = bxs + fmt(LVR.leftN, { n: left }); }
 }
 function feedLog() { renderLegend(); }

 /* --- creator panel --- */
 let pn = null;
 function renderPanelBook() {
  if (!pn || !BOOK) return;
  pn.querySelector('[data-b=cur]').textContent = BOOK.title + (BOOK.author ? ' · ' + BOOK.author : '');
  const j = pn.querySelector('[data-k=jump]'); j.max = BOOK.secs.length; j.value = st.sec + 1;
  pn.querySelector('[data-b=tot]').textContent = '/ ' + BOOK.secs.length;
 }
 function livePanel() {
  pn = el('aside', 'lv-panel');
  const sel = (k, o) => `<select data-k="${k}" style="padding:5px 7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:700 13px system-ui,sans-serif">${o.map(([v, t]) => `<option value="${v}"${String(CFG[k]) === String(v) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  pn.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h3>${esc(LV.panelH)}</h3><a class="lv-btn g" href="${location.pathname}">${esc(LV.back)}</a></div>
<div class="note"></div>
<h5>${esc(LVR.bookH)}</h5>
<div style="padding:8px;border-radius:10px;background:#151c30"><div style="color:#8e99b8;font-size:11.5px">${esc(LVR.cur)}</div><b data-b="cur" style="display:block;margin-top:2px"></b>
<div class="lv-row" style="flex-wrap:wrap;margin-top:8px"><button class="lv-btn" data-s="file">📂 ${esc(L.upload)}</button><button class="lv-btn g" data-s="demo">📖 ${esc(L.demo)}</button><button class="lv-btn g" data-s="paste">📋 ${esc(L.paste)}</button></div>
<div data-pp hidden style="margin-top:6px"><textarea rows="5" placeholder="${esc(L.pastePh)}" style="width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:600 12.5px system-ui,sans-serif"></textarea><button class="lv-btn" data-s="pasteok" style="margin-top:4px">${esc(L.load)}</button></div>
<div class="lv-row"><label>${esc(LVR.jump)}</label><input type="number" min="1" data-k="jump" style="width:70px"><span data-b="tot" style="color:#8e99b8"></span><button class="lv-btn g" data-s="go">→</button></div>
<div class="lv-row"><button class="lv-btn g" data-s="prev">◀ ${esc(L.prev)}</button><button class="lv-btn" data-s="next">${esc(L.next)} ▶</button></div>
<div style="margin-top:6px;color:#ffb3a7;font-size:11.5px">${esc(L.pd)}</div></div>
<h5>${esc(LV.source)}</h5><div class="lv-srcs"></div>
<h5>${esc(LV.simH)}</h5>
<div class="lv-sim">
<button data-s="right" style="background:#9fe870">${esc(LVR.sRight)}</button><button data-s="c" style="background:#eef1f8">${esc(LVR.sWrong)}</button><button data-s="like" style="background:#ffb3a7">+100 ♥</button>
<button data-s="g1" style="background:#ff8fb1">🎁 1</button><button data-s="g99" style="background:#ffc93c">🎁 99</button><button data-s="follow" style="background:#c9f2c7">${esc(LV.sFollow)}</button>
</div>
<div class="lv-row"><label><input type="checkbox" data-c="auto"${LS.auto ? ' checked' : ''}> ${esc(LVR.auto)}</label></div>
<h5>${esc(LVR.cfgH)}</h5>
<div class="lv-row"><label>${esc(LVR.modeL)}</label>${sel('mode', [['seq', LVR.mSeq], ['free', LVR.mFree]])}</div>
<div class="lv-row"><label>${esc(LVR.wppL)}</label>${sel('wpp', [[25, '25'], [40, '40'], [60, '60'], [80, '80']])}</div>
<div class="lv-row"><label>${esc(LVR.boxL)}</label>${sel('box', [[0, LVR.off], [1, '1'], [2, '2'], [3, '3']])}</div>
<div style="padding:8px;border-radius:10px;background:#151c30"><div style="color:#8e99b8;font-size:11.5px">${esc(LVR.prizeL)}</div><textarea data-k="prizes" rows="4" placeholder="${esc(LVR.pz)}" style="width:100%;box-sizing:border-box;margin-top:4px;padding:7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:600 12.5px system-ui,sans-serif">${esc(CFG.prizes)}</textarea><div style="margin-top:4px;color:#ffb3a7;font-size:11.5px">${esc(LVR.prizeN)}</div></div>
<div class="lv-row"><label><input type="checkbox" data-k="rank"${CFG.rank ? ' checked' : ''}> ${esc(LVR.rankL)}</label></div>
<div class="lv-row"><label><input type="checkbox" data-k="stop"${CFG.stop ? ' checked' : ''}> ${esc(LVR.stopL)}</label></div>
<h5>${esc(LVR.lgH)}</h5>
<div class="lv-row"><label><input type="checkbox" data-k="lg"${CFG.lg ? ' checked' : ''}> ${esc(LVR.lgOn)}</label></div>
<div class="lv-row"><label>${esc(LVR.lgNL)}</label>${sel('lgN', [[10, '10'], [20, '20'], [30, '30']])}</div>
<div class="lv-row"><label>${esc(LVR.lgPL)}</label>${sel('lgP', [['rot', LVR.pRot], ['live', LVR.pLive], ['w', LVR.pW], ['m', LVR.pM], ['y', LVR.pY], ['s', LVR.pS], ['champ', LVR.pChamp]])}</div>
<div class="lv-row"><input type="text" data-k="lgName" maxlength="40" value="${esc(CFG.lgName)}" placeholder="${esc(LVR.namePh)}"></div>
<div class="lv-row"><input type="text" data-k="lgSpon" maxlength="40" value="${esc(CFG.lgSpon)}" placeholder="${esc(LVR.sponPh)}"></div>
<div class="lv-row"><input type="text" data-k="lgLogo" value="${esc(CFG.lgLogo)}" placeholder="${esc(LVR.logoPh)}"></div>
${[['lgPzW', LVR.pzW], ['lgPzM', LVR.pzM], ['lgPzY', LVR.pzY]].map(([k, t]) => `<div style="margin-top:6px;color:#8e99b8;font-size:11.5px">${esc(t)}</div><div class="lv-row" style="margin-top:2px"><input type="text" data-k="${k}" maxlength="60" value="${esc(CFG[k])}"></div>`).join('')}
<div style="margin-top:6px;color:#ffb3a7;font-size:11.5px">${esc(LVR.pzNote)}</div>
<div style="margin-top:6px;color:#8e99b8;font-size:11.5px">${esc(LVR.lgNote)}</div>
<div data-b="lgst" style="margin-top:6px;padding:7px 9px;border-radius:8px;background:#151c30;font-size:11.5px"></div>
<div class="lv-row" style="flex-wrap:wrap"><button class="lv-btn" data-s="lgpng">${esc(LVR.png)}</button><button class="lv-btn g" data-s="lgbk">${esc(LVR.bk)}</button><button class="lv-btn g" data-s="lgrs">${esc(LVR.rs)}</button><button class="lv-btn g" data-s="lgreset" style="border-color:#a0412a">${esc(LVR.reset)}</button></div>
<div class="lv-row"><button class="lv-btn" data-s="lgshare">${esc(LVR.share)}</button></div>
<div class="lv-url" data-lgsh hidden style="margin-top:5px"><input readonly data-u="lgsh"><a class="lv-btn g" data-lgopen target="_blank" rel="noopener">↗</a></div>
<div style="margin-top:4px;color:#8e99b8;font-size:11.5px">${esc(LVR.shareN)}</div>
<div class="lv-row"><label>${esc(LVR.skipL)}</label><input type="number" min="0" max="120" step="5" data-k="skip" value="${CFG.skip}"></div>
<div class="lv-row"><label>${esc(LVR.doneL)}</label><input type="number" min="2" max="120" step="1" data-k="done" value="${CFG.done}"></div>
<div class="lv-row"><label>${esc(LVR.starC)}</label><input type="number" min="1" step="1" data-k="starC" value="${CFG.starC}"></div>
<h5>${esc(LV.blockH)}</h5>
<div class="lv-row"><input type="text" data-k="block" value="${esc(CFG.block)}" placeholder="word1, user2"></div>
<h5>${esc(LV.obsH)}</h5>
<div class="lv-url"><input readonly data-u="obs"><button class="lv-btn" data-s="copy">${esc(LV.copy)}</button></div>
<div class="lv-obsn" style="margin-top:6px;color:#8e99b8;font-size:11.5px"></div>
<div style="margin-top:6px;color:#8e99b8;font-size:11.5px">${esc(LVR.obsBook)}</div>
<div class="lv-row" style="margin-top:8px"><button class="lv-btn" data-s="pop">${esc(LVR.popBtn)}</button></div>
<div style="margin-top:4px;color:#8e99b8;font-size:11.5px">${esc(LVR.popN)}</div>
<h5>${esc(LV.logH)}</h5><ul class="lv-log"></ul>`;
  outer.appendChild(pn);
  const tog = el('button', 'lv-btn lv-tog', esc(LV.panel)); outer.appendChild(tog);
  tog.addEventListener('click', () => pn.classList.toggle('hide'));
  pn.addEventListener('click', e => {
   const b = e.target.closest('[data-s]'); if (!b) return;
   const s = b.dataset.s;
   if (s === 'copy') { const i = pn.querySelector('[data-u=obs]'); i.select(); try { navigator.clipboard.writeText(i.value); } catch (er) { document.execCommand && document.execCommand('copy'); } b.textContent = LV.copied; setTimeout(() => b.textContent = LV.copy, 1500); return; }
   if (s === 'file') { file.click(); return; }
   if (s === 'lgpng') { lgPng(); return; }
   if (s === 'lgshare') {
    lgShareUrl().then(u => {
     const w = pn.querySelector('[data-lgsh]'), i = w.querySelector('input'); w.hidden = false; i.value = u; w.querySelector('a').href = u;
     i.select(); try { navigator.clipboard.writeText(u); } catch (er) { document.execCommand && document.execCommand('copy'); }
     b.textContent = LVR.shareOk; setTimeout(() => b.textContent = LVR.share, 1600); renderLg();
    });
    return;
   }
   if (s === 'lgbk') { lgBackup(); return; }
   if (s === 'lgrs') { lgFile.click(); return; }
   if (s === 'lgreset') { if (b.dataset.sure) { lgReset(); b.textContent = LVR.reset; delete b.dataset.sure; } else { b.dataset.sure = '1'; b.textContent = LVR.resetQ; setTimeout(() => { if (b.dataset.sure) { delete b.dataset.sure; b.textContent = LVR.reset; } }, 4000); } return; }
   if (s === 'demo') { loadDemo(); return; }
   if (s === 'paste') { pn.querySelector('[data-pp]').hidden = false; return; }
   if (s === 'pasteok') { const t = pn.querySelector('[data-pp] textarea').value; if (loadBook((t.trim().split('\n')[0] || '—').slice(0, 60), '', t)) { pn.querySelector('[data-pp]').hidden = true; onLoaded(); } return; }
   if (s === 'go') { openSection((+pn.querySelector('[data-k=jump]').value || 1) - 1); renderPanelBook(); return; }
   if (s === 'prev') { openSection(st.sec - 1); renderPanelBook(); return; }
   if (s === 'next') { nextPage(); renderPanelBook(); return; }
   if (s === 'pop') { store.set('livecfg', CFG); obsUrl(); const u = pn.querySelector('[data-u=obs]').value.replace('&demo=1', LS.auto ? '&demo=1' : ''); global.open(u + '&pop=1', 'crpop', 'width=540,height=960'); return; }
   if (s === 'src') {
    const k = b.dataset.k;
    if (SRC.on && SRC.kind === k) srcStop();
    else {
     readOpts();
     const miss = (NEED[k] || []).find(([o]) => !SRC.opt[o]);
     if (miss) { const r = b.closest('[data-row]'); r.querySelector('.msg').textContent = LV[miss[1]]; const f = r.querySelector(`[data-o=${miss[0]}]`); if (f) f.focus(); return; }
     srcStart(k);
    }
    saveSrc(); obsUrl(); return;
   }
   simEvent(s);
  });
  pn.addEventListener('change', e => {
   const t = e.target;
   if (t.dataset.c === 'auto') { LS.auto = t.checked; if (LS.auto && SRC.on) { srcStop(); saveSrc(); obsUrl(); } modeLabel(); return; }
   if (t.dataset.o) { readOpts(); if (SRC.on && t.closest('[data-row]').dataset.row === SRC.kind) srcStart(SRC.kind); saveSrc(); obsUrl(); return; }
   const k = t.dataset.k; if (!k || k === 'jump') return;
   const NUM = { skip: [0, 120], done: [2, 120], starC: [1, 1e6] };
   if (NUM[k]) { CFG[k] = clamp(Math.round(t.value === '' ? DEF_CFG[k] : +t.value), NUM[k][0], NUM[k][1]); t.value = CFG[k]; }
   else if (k === 'stop') CFG.stop = t.checked;
   else if (k === 'rank') CFG.rank = t.checked;
   else if (k === 'box') CFG.box = +t.value;
   else if (k === 'prizes') CFG.prizes = String(t.value).split('\n').map(x => cleanText(x, 60)).filter(Boolean).slice(0, 12).join('\n');
   else if (k === 'wpp') CFG.wpp = +t.value;
   else if (k === 'lg') CFG.lg = t.checked;
   else if (k === 'lgN') CFG.lgN = +t.value;
   else if (k === 'lgName' || k === 'lgSpon') { CFG[k] = cleanText(t.value, 40); t.value = CFG[k]; }
   else if (k === 'lgPzW' || k === 'lgPzM' || k === 'lgPzY') { CFG[k] = cleanText(t.value, 60); t.value = CFG[k]; }
   else if (k === 'lgLogo') { CFG.lgLogo = okLogo(t.value.trim()); t.value = CFG.lgLogo; }
   else CFG[k] = t.value;
   store.set('livecfg', CFG);
   if (BOOK && (k === 'wpp' || k === 'mode' || k === 'stop' || k === 'box')) { const first = BOOK.secs[st.sec][0]; section(BOOK, wpp()); openSection(secOf(first)); renderPanelBook(); }
   renderLegend(); renderNext(); obsUrl();
   if (k.startsWith('lg')) { lgRot = 0; lgRotT = 10; renderLg(); resize(); }
  });
  const lgFile = el('input', 'cr-file'); lgFile.type = 'file'; lgFile.accept = '.json,application/json'; pn.appendChild(lgFile);
  lgFile.addEventListener('change', async () => { const f = lgFile.files && lgFile.files[0]; lgFile.value = ''; if (f) lgRestore(await f.text()); });
  renderSrc(); obsUrl(); renderLog(); renderPanelBook();
 }
 function renderSrc() {
  if (!pn) return;
  const inp = (o, ph, type) => `<input data-o="${o}" type="${type || 'text'}" placeholder="${esc(ph)}" value="${esc(SRC.opt[o])}" autocomplete="off" spellcheck="false" style="width:100%;margin-top:6px">`;
  const F = { tikfinity: '', twitch: inp('ch', LV.twCh), youtube: inp('yk', LV.ytKey, 'password') + inp('yv', LV.ytVid), ssn: inp('ss', LV.ssSess) };
  pn.querySelector('.lv-srcs').innerHTML = `<div class="lv-src" data-row="sim"><span class="dot"></span> ${esc(LV.srcSim)}<em></em></div>
${KINDS.map(k => `<div class="lv-src" data-row="${k}" style="flex-wrap:wrap"><span class="dot"></span> ${esc(LV.srcN[k])}<em></em>
<div style="flex-basis:100%;font-size:11.5px;line-height:1.45;color:#aab4cf;margin-top:4px">${esc(LV.srcH[k])}</div>${F[k]}
<div class="msg" style="flex-basis:100%;font-size:11.5px;color:#ff8a7d;margin-top:4px"></div>
<button class="lv-btn" data-s="src" data-k="${k}" style="margin-top:6px"></button></div>`).join('')}
<div style="font-size:11.5px;color:#8e99b8;margin-top:6px">${esc(LV.moneyNote)}</div>
<div class="lv-src">○ ${esc(LV.srcTT)}<em>${esc(LV.srcTTn)}</em></div>`;
  updSrc();
 }
 function updSrc() {
  if (!pn) return;
  const col = { off: '#8e99b8', wait: '#ffc93c', on: '#3ecf7a', err: '#ff8a7d' };
  pn.querySelector('.note').textContent = SRC.on ? LV.liveNote : LVR.note;
  pn.querySelectorAll('[data-row]').forEach(r => {
   const k = r.dataset.row, act = k === 'sim' ? !SRC.on : SRC.on && SRC.kind === k, s2 = act && k !== 'sim' ? SRC.st : 'off';
   r.classList.toggle('on', act); r.querySelector('.dot').textContent = act ? '●' : '○';
   const em = r.querySelector('em'); em.style.color = k === 'sim' ? '' : col[s2];
   em.textContent = k === 'sim' ? (act ? LV.active : '') : act ? (s2 === 'err' && k === 'tikfinity' ? LV.tfSt.err : s2 === 'err' ? LV.errGen : LV.tfSt[s2]) : '';
   const m = r.querySelector('.msg'); if (m) m.textContent = act ? SRC.msg : '';
   const b = r.querySelector('button'); if (b) { b.textContent = act ? LV.tfStop : LV.tfUse; b.classList.toggle('g', act); }
  });
 }
 function readOpts() {
  if (!pn) return;
  pn.querySelectorAll('[data-o]').forEach(i => {
   let v = i.value.trim();
   if (i.dataset.o === 'ch') v = v.toLowerCase().replace(/^.*twitch\.tv\//, '').replace(/[^a-z0-9_]/g, '');
   if (i.dataset.o === 'ss') v = v.replace(/^.*[?&]session=/, '').replace(/[&#].*$/, '').replace(/[^\w-]/g, '');
   SRC.opt[i.dataset.o] = v; if (v !== i.value.trim() && document.activeElement !== i) i.value = v;
  });
 }
 function saveSrc() { const o = SRC.opt; store.set('livesrc', { kind: SRC.on ? SRC.kind : 'sim', ch: o.ch, yk: o.yk, yv: o.yv, ss: o.ss }); }
 function obsUrl() {
  if (!pn) return;
  const c = btoa(unescape(encodeURIComponent(JSON.stringify(CFG))));
  const o = SRC.opt, q = encodeURIComponent;
  const src = !SRC.on ? '&demo=1' : '&src=' + SRC.kind + ({ tikfinity: o.port !== 21213 ? '&port=' + o.port : '', twitch: '&ch=' + q(o.ch), youtube: '&yk=' + q(o.yk) + '&yv=' + q(o.yv), ssn: '&ss=' + q(o.ss) })[SRC.kind];
  pn.querySelector('[data-u=obs]').value = `${location.origin}${location.pathname}?live=1&clean=1${src}&cfg=${c}`;
  pn.querySelector('.lv-obsn').textContent = !SRC.on ? LVR.obsNote : SRC.kind === 'tikfinity' ? LV.obsNoteTF : LV.obsNoteNet + (SRC.kind === 'youtube' ? ' ' + LV.keyWarn : '');
 }
 function renderLog() {
  if (!pn) return;
  const C = { ok: '#3e9e5c', dup: '#9aa6c4', filt: '#ff8a7d' };
  pn.querySelector('.lv-log').innerHTML = LS.log.slice(0, 14).map(e => `<li><span><b style="background:none;color:#eef1f8;padding:0">${esc(e.user)}</b> · ${esc(e.what)}</span><b style="background:${C[e.st]}">${esc(LV.st[e.st])}</b></li>`).join('');
 }
 function log(ev, what, st2) { LS.log.unshift({ id: ev.id, user: '@' + ev.user.name, what, st: st2 }); LS.log.length = Math.min(LS.log.length, 40); renderLog(); }

 /* --- simulator: same event shape a real adapter produces --- */
 const SIM_USERS = ['ayse_23', 'leo.reads', 'mira.k', 'tomasz', 'yuki_s', 'omar.dev', 'ella.b', 'kemal34', 'nina.r', 'sam_w', 'deniz.k', 'lina_m', 'arif07', 'joao.p', 'putri', 'carlos.m', 'zeynep.t', 'mert_34', 'ana.luz', 'budi_s', 'efe.10', 'sofia_r'];
 const untr = s => s.replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u');
 function simEvent(kind, who) {
  LS.n++;
  const name = who || SIM_USERS[(LS.n * 7 + kind.length * 3) % SIM_USERS.length];
  const ev = { id: 'sim_' + Date.now().toString(36) + '_' + LS.n, user: { id: name, name }, src: 'sim' };
  if (kind === 'right' && BOOK) {
   const [a, b] = BOOK.secs[st.sec];
   let i = st.ptr;
   if (CFG.mode === 'free') { const hid = []; for (let k = a; k < b; k++) if (!st.rev.has(k)) hid.push(k); i = hid.length ? hid[(LS.n * 13) % hid.length] : a; }
   const w = BOOK.words[Math.min(i, b - 1)].t;
   Object.assign(ev, { type: 'comment', text: [w, w.toLocaleLowerCase(lang), untr(w).toLowerCase(), w + '!!', w + ' 📖'][LS.n % 5] });
  } else if (kind === 'right' || kind === 'c') Object.assign(ev, { type: 'comment', text: ['😍😍', 'harika', 'devam', 'lovely', 'çok güzel', 'que bonito', 'keren', '❤️'][LS.n % 8] });
  else if (kind === 'like') Object.assign(ev, { type: 'like', count: 100 });
  else if (kind === 'follow') ev.type = 'follow';
  else Object.assign(ev, { type: 'gift', gift: '🎁', coins: +kind.slice(1) });
  ingest(ev);
 }
 function autoDemo(dt) {
  if (!LS.auto) return;
  LS.autoT -= dt; if (LS.autoT > 0) return;
  LS.autoT = .45 + Math.random() * .9;
  const r = Math.random();
  simEvent(r < .7 ? 'right' : r < .93 ? 'c' : r < .97 ? 'like' : r < .995 ? 'g1' : 'g99');
 }

 const KINDS = ['tikfinity', 'twitch', 'youtube', 'ssn'];
 const SHORT = { tikfinity: 'TikFinity', twitch: 'Twitch', youtube: 'YouTube', ssn: 'Social Stream' };
 const NEED = { twitch: [['ch', 'needCh']], youtube: [['yk', 'needYt'], ['yv', 'needYt']], ssn: [['ss', 'needSs']] };
 LV.srcH = Object.assign({ tikfinity: LV.tfHelp + ' ' + LV.tfPerm }, LV.srcH);
 const usdToCoins = u => Math.max(1, Math.round((+u || 0) * 75)); // ≈ price of TikTok coins, so one gift table works everywhere
 const FX = { USD: 1, EUR: 1.08, GBP: 1.27, TRY: .029, BRL: .18, MXN: .055, IDR: .000062, INR: .012, JPY: .0067, CAD: .73, AUD: .66, NZD: .6, CHF: 1.13, ARS: .001, COP: .00025, CLP: .0011, PEN: .27, PHP: .017, KRW: .00072, RUB: .011, PLN: .25, SAR: .27, AED: .27, MYR: .22, THB: .028, VND: .00004, SEK: .095, NOK: .093, DKK: .145, CZK: .043, HUF: .0027, ZAR: .055, EGP: .02, HKD: .128, TWD: .031, SGD: .74 };
 const toUsd = (amt, cur) => (+amt || 0) * (FX[String(cur || 'USD').toUpperCase()] || 1);
 const noHtml = t => { const d = document.createElement('textarea'); d.innerHTML = String(t || '').replace(/<[^>]*>/g, ' '); return d.value.replace(/\s+/g, ' ').trim(); };
 function srcSet(st, msg) { SRC.st = st; SRC.msg = msg || ''; modeLabel(); updSrc(); }
 function srcStart(kind) {
  srcStop(true);
  SRC.kind = kind; SRC.on = true; SRC.retry = 0; SRC.gen++;
  LS.auto = false; const a = pn && pn.querySelector('[data-c=auto]'); if (a) a.checked = false;
  srcSet('wait'); if (lv) renderLegend();
  ({ tikfinity: tfConnect, twitch: twConnect, youtube: ytConnect, ssn: ssnConnect })[kind](SRC.gen);
 }
 function srcStop(quiet) {
  SRC.on = false; SRC.gen++; clearTimeout(SRC.t);
  const w = SRC.ws; SRC.ws = null; if (w) try { w.close(); } catch (e) { }
  if (!quiet) { SRC.kind = 'sim'; srcSet('off'); if (lv) renderLegend(); }
 }
 function retryLater(gen, fn, ms) { if (gen !== SRC.gen || !SRC.on) return; SRC.retry++; clearTimeout(SRC.t); SRC.t = setTimeout(() => fn(gen), ms || Math.min(10000, 1500 + SRC.retry * 1000)); }
 function wsOpen(gen, url, onOpen, onMsg, again) {
  if (gen !== SRC.gen) return;
  let ws; try { ws = new WebSocket(url); } catch (e) { srcSet('err'); return retryLater(gen, again, 5000); }
  SRC.ws = ws;
  ws.onopen = () => { if (SRC.ws !== ws) return; SRC.retry = 0; onOpen && onOpen(ws); };
  ws.onmessage = m => { if (SRC.ws !== ws) return; try { onMsg(m.data, ws); } catch (e) { } };
  ws.onclose = () => { if (SRC.ws !== ws) return; SRC.ws = null; if (!SRC.on) return; srcSet('err'); retryLater(gen, again); };
  ws.onerror = () => { };
 }
 const emit = ev => { if (ev) ingest(ev); };

 /* TikFinity (TikTok) */
 function tfConnect(gen) {
  wsOpen(gen, 'ws://localhost:' + SRC.opt.port + '/', () => srcSet('on'), d => { let j; try { j = JSON.parse(d); } catch (e) { return; } emit(tfMap(j)); }, tfConnect);
 }
 function tfMap(j) {
  if (!j || typeof j !== 'object') return null;
  const kind = String(j.event || j.type || '').toLowerCase(), d = j.data || {}, u = d.user || {};
  const uid = String(d.uniqueId || u.uniqueId || d.userId || u.userId || '');
  if (!uid) return null;
  const base = { user: { id: 'tt:' + uid, name: String(d.nickname || u.nickname || uid) }, src: 'tikfinity' };
  const mid = d.msgId || (d.common && d.common.msgId);
  const id = x => 'tf_' + (mid ? mid + (x || '') : uid + '_' + kind + '_' + (++SRC.n) + '_' + Date.now().toString(36));
  if (kind === 'chat' || kind === 'comment') return Object.assign(base, { id: id(), type: 'comment', text: String(d.comment || d.text || '') });
  if (kind === 'like') return Object.assign(base, { id: id(), type: 'like', count: Math.max(1, +(d.likeCount || d.count || 1) | 0) });
  if (kind === 'follow' || (kind === 'social' && /follow/i.test(String(d.displayType || d.label || '')))) return Object.assign(base, { id: id(), type: 'follow' });
  if (kind === 'gift') {
   const gd = d.giftDetails || d.extendedGiftInfo || {};
   const gtype = +(d.giftType != null ? d.giftType : gd.giftType);
   if (gtype === 1 && !d.repeatEnd) return null; // streak still running: wait for its final message
   const dia = +(d.diamondCount || gd.diamondCount || gd.diamond_count || 0) | 0;
   if (dia <= 0) return null;
   const rep = Math.max(1, +(d.repeatCount || 1) | 0);
   return Object.assign(base, { id: id('_' + rep), type: 'gift', gift: String(d.giftName || gd.giftName || gd.name || 'Gift'), coins: dia, repeat: rep });
  }
  return null;
 }

 /* Twitch: official chat over IRC WebSocket, anonymous read-only login (no account, no key) */
 function twConnect(gen) {
  const ch = String(SRC.opt.ch || '').trim().toLowerCase().replace(/^.*twitch\.tv\//, '').replace(/[^a-z0-9_]/g, '');
  if (!ch) { srcSet('err', LV.needCh); return; }
  wsOpen(gen, 'wss://irc-ws.chat.twitch.tv:443', ws => {
   ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands'); ws.send('PASS SCHMOOPIIE'); ws.send('NICK justinfan' + (10000 + Math.floor(Math.random() * 80000))); ws.send('JOIN #' + ch);
  }, (data, ws) => {
   String(data).split('\r\n').forEach(line => {
    if (!line) return;
    if (line.startsWith('PING')) { ws.send('PONG :tmi.twitch.tv'); return; }
    const m = ircParse(line);
    if (m.cmd === 'ROOMSTATE' || m.cmd === 'JOIN' && SRC.st !== 'on') srcSet('on');
    else if (m.cmd === 'NOTICE' && /not exist|suspended|banned/i.test(m.trailing)) srcSet('err', m.trailing);
    else emit(twMap(m));
   });
  }, twConnect);
 }
 function ircParse(line) {
  const tags = {}; let rest = line;
  if (rest[0] === '@') { const i = rest.indexOf(' '); rest.slice(1, i).split(';').forEach(kv => { const j = kv.indexOf('='); tags[kv.slice(0, j)] = kv.slice(j + 1).replace(/\\s/g, ' ').replace(/\\:/g, ';').replace(/\\\\/g, '\\'); }); rest = rest.slice(i + 1); }
  let prefix = ''; if (rest[0] === ':') { const i = rest.indexOf(' '); prefix = rest.slice(1, i); rest = rest.slice(i + 1); }
  const ti = rest.indexOf(' :'), trailing = ti >= 0 ? rest.slice(ti + 2) : '';
  const parts = (ti >= 0 ? rest.slice(0, ti) : rest).split(' ');
  return { tags, prefix, cmd: parts[0], trailing };
 }
 function twMap(m) {
  const t = m.tags, login = t.login || m.prefix.split('!')[0];
  if (m.cmd !== 'PRIVMSG' && m.cmd !== 'USERNOTICE') return null;
  const uid = t['user-id'] || login; if (!uid) return null;
  const base = { id: 'tw_' + (t.id || uid + '_' + (++SRC.n) + '_' + Date.now().toString(36)), user: { id: 'tw:' + uid, name: t['display-name'] || login }, src: 'twitch' };
  if (m.cmd === 'PRIVMSG') {
   const bits = +t.bits || 0;
   if (bits > 0) return Object.assign(base, { type: 'gift', gift: bits + ' Bits', coins: usdToCoins(bits / 100) });
   return Object.assign(base, { type: 'comment', text: m.trailing });
  }
  const kind = t['msg-id'], plan = t['msg-param-sub-plan'], usd = plan === '3000' ? 25 : plan === '2000' ? 10 : 5;
  if (kind === 'sub' || kind === 'resub' || kind === 'subgift') return Object.assign(base, { type: 'gift', gift: 'Sub', coins: usdToCoins(usd) });
  if (kind === 'submysterygift') { const n = Math.max(1, +t['msg-param-mass-gift-count'] || 1); return Object.assign(base, { type: 'gift', gift: n + ' Subs', coins: usdToCoins(usd * n) }); }
  if (kind === 'raid') return Object.assign(base, { type: 'follow' });
  return null;
 }

 /* YouTube Live: official YouTube Data API v3 with the creator's own API key (read-only, public chat) */
 const ytVid = s => { s = String(s || '').trim(); const m = s.match(/(?:v=|youtu\.be\/|\/live\/|\/shorts\/|\/embed\/)([\w-]{11})/); return m ? m[1] : /^[\w-]{11}$/.test(s) ? s : ''; };
 async function ytConnect(gen) {
  const key = String(SRC.opt.yk || '').trim(), vid = ytVid(SRC.opt.yv);
  if (!key || !vid) { srcSet('err', LV.needYt); return; }
  const G = 'https://www.googleapis.com/youtube/v3/';
  let chat = null;
  try {
   const j = await (await fetch(`${G}videos?part=liveStreamingDetails&id=${vid}&key=${encodeURIComponent(key)}`)).json();
   if (gen !== SRC.gen) return;
   if (j.error) { srcSet('err', LV.ytBadKey); return retryLater(gen, ytConnect, 60000); }
   chat = j.items && j.items[0] && j.items[0].liveStreamingDetails && j.items[0].liveStreamingDetails.activeLiveChatId;
   if (!chat) { srcSet('err', LV.ytNoLive); return retryLater(gen, ytConnect, 30000); }
  } catch (e) { if (gen !== SRC.gen) return; srcSet('err'); return retryLater(gen, ytConnect, 15000); }
  let page = '', first = true;
  const poll = async () => {
   if (gen !== SRC.gen) return;
   let wait = 6000;
   try {
    const j = await (await fetch(`${G}liveChat/messages?liveChatId=${encodeURIComponent(chat)}&part=snippet,authorDetails&maxResults=200&key=${encodeURIComponent(key)}${page ? '&pageToken=' + page : ''}`)).json();
    if (gen !== SRC.gen) return;
    if (j.error) { srcSet('err', LV.ytBadKey); wait = 60000; }
    else {
     if (!first) (j.items || []).forEach(m => emit(ytMap(m))); // skip the backlog that was there before we connected
     first = false; page = j.nextPageToken || page; wait = Math.max(6000, +j.pollingIntervalMillis || 0);
     if (j.offlineAt) { srcSet('err', LV.ytNoLive); return retryLater(gen, ytConnect, 30000); }
     srcSet('on');
    }
   } catch (e) { if (gen !== SRC.gen) return; srcSet('err'); wait = 10000; }
   clearTimeout(SRC.t); SRC.t = setTimeout(poll, wait);
  };
  poll();
 }
 function ytMap(m) {
  const s = m.snippet || {}, a = m.authorDetails || {};
  if (!a.channelId) return null;
  const base = { id: 'yt_' + m.id, user: { id: 'yt:' + a.channelId, name: a.displayName || 'viewer' }, src: 'youtube' };
  const det = s.superChatDetails || s.superStickerDetails;
  if (det) return Object.assign(base, { type: 'gift', gift: s.type === 'superStickerEvent' ? 'Super Sticker' : 'Super Chat', coins: usdToCoins(toUsd(det.amountMicros / 1e6, det.currency)) });
  if (s.type === 'newSponsorEvent' || s.type === 'memberMilestoneChatEvent') return Object.assign(base, { type: 'gift', gift: 'Member', coins: usdToCoins(5) });
  if (s.type === 'membershipGiftingEvent') { const n = Math.max(1, +(s.membershipGiftingDetails && s.membershipGiftingDetails.giftMembershipsCount) || 1); return Object.assign(base, { type: 'gift', gift: n + ' Members', coins: usdToCoins(5 * n) }); }
  if (s.type === 'textMessageEvent') return Object.assign(base, { type: 'comment', text: s.displayMessage || (s.textMessageDetails && s.textMessageDetails.messageText) || '' });
  return null;
 }

 /* Social Stream Ninja: the creator's own free multi-platform tool (Kick, YouTube, Twitch, TikTok, …) via its relay */
 function ssnConnect(gen) {
  const ss = String(SRC.opt.ss || '').trim().replace(/^.*[?&]session=/, '').replace(/[&#].*$/, '').replace(/[^\w-]/g, '');
  if (!ss) { srcSet('err', LV.needSs); return; }
  wsOpen(gen, 'wss://io.socialstream.ninja/join/' + ss + '/4', () => srcSet('on'), d => {
   let j; try { j = JSON.parse(d); } catch (e) { return; }
   [].concat(j).forEach(x => emit(ssnMap(x && (x.overlayNinja || x.contents || x))));
  }, ssnConnect);
 }
 function ssnMap(d) {
  if (!d || typeof d !== 'object' || !d.chatname) return null;
  const plat = String(d.type || 'chat').toLowerCase().replace(/[^a-z0-9]/g, '') || 'chat';
  const name = noHtml(d.chatname), uid = plat + ':' + (d.userid || name);
  const base = { id: 'ssn_' + (d.id != null && d.id !== '' ? plat + '_' + d.id : uid + '_' + (++SRC.n) + '_' + Date.now().toString(36)), user: { id: uid, name }, src: 'ssn' };
  const ev = String(d.event || '').toLowerCase();
  if (d.hasDonation || +d.donoValue > 0) {
   const usd = +d.donoValue > 0 ? +d.donoValue : plat === 'tiktok' ? .013 : parseFloat(String(d.hasDonation).replace(/[^0-9.]/g, '')) || 1;
   return Object.assign(base, { type: 'gift', gift: noHtml(d.hasDonation) || 'Donation', coins: usdToCoins(usd) });
  }
  if (ev && ev !== 'false') {
   if (/follow/.test(ev)) return Object.assign(base, { type: 'follow' });
   if (/sub|member|sponsor/.test(ev)) return Object.assign(base, { type: 'gift', gift: noHtml(d.membership) || 'Sub', coins: usdToCoins(5) });
   if (/like/.test(ev)) return Object.assign(base, { type: 'like', count: Math.max(1, parseInt(noHtml(d.chatmessage)) || 1) });
   return null;
  }
  const text = noHtml(d.chatmessage);
  return text ? Object.assign(base, { type: 'comment', text }) : null;
 }


 /* --- event pipeline: dedupe by id, filter, apply --- */
 function openNext(n, name) {
  const [a, b] = BOOK.secs[st.sec]; let k = 0;
  if (CFG.mode === 'free') { for (let i = a; i < b && k < n; i++) if (!st.boxes.has(i) && reveal(i, name, '', true)) k++; }
  else while (k < n && st.ptr < b && !st.boxes.has(st.ptr)) { if (reveal(st.ptr, name, '', true)) k++; advance(true); }
  advance();
  return k;
 }
 function ingest(ev) {
  if (!ev || !ev.id || !ev.user) return;
  ev.user.name = cleanName(ev.user.name);
  if (LS.seen.has(ev.id)) { log(ev, ev.type, 'dup'); return; }
  LS.seen.add(ev.id); LS.seenQ.push(ev.id); if (LS.seenQ.length > 5000) LS.seen.delete(LS.seenQ.shift());
  LS.last = ev; curSim = ev.src === 'sim';
  if (blockList().includes(ev.user.name.toLowerCase())) { log(ev, ev.type, 'filt'); return; }
  const u = LS.users.get(ev.user.id) || { id: ev.user.id, name: ev.user.name, lastMsg: -1e9, coins: 0 };
  LS.users.set(u.id, u); u.name = ev.user.name;
  const now = performance.now() / 1000;
  const reading = BOOK && st.phase === 'read';
  if (ev.type === 'comment') {
   if (now - u.lastMsg < .8) { log(ev, '💬', 'filt'); return; }
   u.lastMsg = now;
   let k = 0;
   if (reading) {
    const tk = tokens(ev.text), [a, b] = BOOK.secs[st.sec];
    for (const t of tk) {
     if (k >= 6 || st.phase !== 'read') break;
     if (CFG.mode === 'free') { for (let i = a; i < b; i++) if (!st.rev.has(i) && BOOK.words[i].n === t) { reveal(i, u.name); k++; break; } }
     else if (st.ptr < b && BOOK.words[st.ptr].n === t) { reveal(st.ptr, u.name); k++; advance(true); }
    }
    if (k) { beep('tick'); advance(); }
   }
   log(ev, (k ? '✓ ' : '') + '“' + cleanText(ev.text) + '”', 'ok');
  } else if (ev.type === 'like') { log(ev, '+' + (ev.count | 0) + ' ♥', 'ok'); }
  else if (ev.type === 'follow') { banner(fmt(LVR.joined, { u: u.name }), '#1f7a3a', 2.5); log(ev, LV.sFollow, 'ok'); }
  else if (ev.type === 'gift') {
   const coins = Math.max(1, (ev.coins | 0) * Math.max(1, ev.repeat | 0));
   u.coins += coins;
   let n = 0;
   if (reading) {
    st.gifter = u.name; sup.textContent = fmt(LVR.support, { u: u.name });
    if (coins >= CFG.starC) {
     // the rest of the current sentence (max 25 words)
     const [a, b] = BOOK.secs[st.sec]; let want = 0, i = CFG.mode === 'free' ? a : st.ptr;
     if (CFG.mode === 'free') { while (i < b && st.rev.has(i)) i++; }
     for (let j = i; j < b && want < 25; j++) { want++; if (j + 1 >= b || sentEnd(BOOK.words[j + 1].pre)) break; }
     n = openNext(Math.max(3, want), u.name);
    } else n = openNext(3, u.name);
   }
   banner(fmt(LVR.opened, { u: u.name, n }) + ' 🎁', '#a0612a', 3); beep('gift');
   log(ev, `${ev.gift} → +${n}`, 'ok');
  }
  renderTop();
  if (lv && legKey() !== lv.legKey) renderLegend();
 }
 function loaderCard() {
  showOv(`<h2>${esc(L.name)}<span>${esc(LVR.loaderH)}</span></h2><div class="row"><button class="cr-btn" data-a="file">📂 ${esc(L.upload)}</button><button class="cr-btn g" data-a="demo">📖 ${esc(L.demo)}</button><button class="cr-btn g" data-a="paste">📋 ${esc(L.paste)}</button></div><div class="row" data-p hidden><textarea placeholder="${esc(L.pastePh)}"></textarea><button class="cr-btn" data-a="pasteok">${esc(L.load)}</button></div><small>${esc(L.pd)}</small>`);
 }
 function startLive() {
  lgLoad();
  global.addEventListener('storage', e => {
   if (e.key !== 'cr.league' || !e.newValue) return;
   let o = null; try { o = lgClean(JSON.parse(e.newValue)); } catch (er) { }
   if (!o) return;
   if (clean ? o.rev > LGD.rev : true) { LGD = o; lgDirty = false; lgCache(); }
  });
  global.addEventListener('pagehide', lgSave);
  liveUI();
  if (!clean) livePanel();
  if (KINDS.includes(srcWant)) srcStart(srcWant);
  if (CFG.book === 'local') { if (!loadStored()) { loadDemo(); if (clean) loaderCard(); } }
  else loadDemo();
  renderLegend(); renderPanelBook(); renderLg(); resize();
  if (!clean) {
   const fitStage = () => {
    const W = outer.clientWidth, H = outer.clientHeight, wide = W > 820, aw = wide ? W - 380 : W, ah = H;
    const w = Math.min(aw, ah * 9 / 16), h = w * 16 / 9;
    host.style.width = w + 'px'; host.style.height = h + 'px'; host.style.left = ((aw - w) / 2) + 'px'; host.style.top = ((ah - h) / 2) + 'px';
   };
   global.addEventListener('resize', fitStage); fitStage();
  }
 }

 /* ---------- main loop ---------- */
 function step(dt) {
  st.time += dt;
  if (banT > 0 && (banT -= dt) <= 0) banner('');
  for (let i = fx.length - 1; i >= 0; i--) if (st.time >= fx[i].until) { const f = fx[i]; if (f.chip) { f.e.remove(); chips--; } else if (f.hide) f.e.style.display = 'none'; else f.e.classList.remove(f.cls); fx.splice(i, 1); }
  if (live) autoDemo(dt);
  if (live && CFG.lg) {
   if (CFG.lgP === 'rot' && (lgRotT -= dt) <= 0) { lgRot++; lgRotT = 10; lgNeed = true; }
   if ((lgSaveT -= dt) <= 0) { lgSaveT = 3; lgSave(); }
   if (clean && (lgBeatT -= dt) <= 0) { lgBeatT = 2; store.set('lgbeat', Date.now()); }
   if (lgUp.size && st.time - lgRenderT > .5) { for (const [k, t] of lgUp) if (t <= st.time) { lgUp.delete(k); lgNeed = true; } }
   if (lgNeed && st.time - lgRenderT > .25) renderLg();
  }
  if (!BOOK) return;
  if (st.phase === 'read' && live && CFG.mode === 'seq' && +CFG.skip > 0 && st.time - st.lastT > +CFG.skip && st.ptr < BOOK.secs[st.sec][1] && !st.boxes.has(st.ptr)) { reveal(st.ptr, '', 'k'); advance(); }
  if (st.phase === 'done') { st.t -= dt; if (live) renderNext(); if (st.t <= 0) { nextPage(); renderPanelBook(); } }
  if (!live && (st.stT = (st.stT || 0) - dt) <= 0) { st.stT = 1; stats(); }
 }
 let last = performance.now(), manual = !!opts.manual;
 function frame(now) {
  if (!manual) requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, .1); last = now;
  step(dt);
 }
 if (live) startLive(); else { normalUI(); if (!loadStored()) loadDemo(); menu(); lgOpen(); global.addEventListener('hashchange', lgOpen); }
 resize();
 const show = () => { fit(); txt.style.visibility = 'visible'; };
 if (document.fonts && document.fonts.ready) document.fonts.ready.then(show); setTimeout(show, 1500);
 if (!manual) requestAnimationFrame(frame);
 return { st, ingest: ev => ingest(ev), simEvent, loadBook, loadDemo, openSection, book: () => BOOK, LS: () => LS, lg: () => ({ LGD, LGC, period: lgPeriod() }), lgRender: renderLg, lgPng, lgShareUrl, lgOpen, lgShow: n => { lgRot = n; lgRotT = 10; renderLg(); }, src: () => SRC, adv: (ms, n) => { for (let i = 0; i < (n || 1); i++) step(ms / 1000); }, fit, resize, banner };
}

global.ChatReads = { mount };
})(window);
