/* Rope Rumble · tug of war (PickRadar)
   Normal mode: your red team against the CPU, tap to pull.
   LIVE mode (?live=1): viewers of a live stream join RED or BLUE by commenting; comments and likes
   make their team pull, gifts add extra people to the team for the current round (fixed, stated rates). */
(function (global) {
'use strict';

const LANG = {
 en: { name: 'Rope Rumble', sub: 'Tug of War', red: 'RED', blue: 'BLUE', round: 'Round {n}', ready: 'Ready…', go: 'PULL!', roundWin: '{t} wins the round!', draw: 'Draw! Nobody scores', matchWin: '{t} wins the match!', play: 'Play', playAgain: 'Play again', next: 'Next level', retry: 'Try again', youWin: 'You win!', youLose: 'You lose!', level: 'Level {n}', best: 'Best level: {n}', you: 'YOU', cpu: 'CPU', tapD: 'Click or press SPACE as fast as you can!', tapM: 'Tap PULL as fast as you can!', pull: 'PULL!', intro: "Your red team against the CPU. Every time the ribbon crosses your line, one CPU player sinks into the mud. Tap fast: sink all 6 before they sink yours. If time runs out, whoever sank more wins.", liveBtn: 'LIVE mode · for streamers', soundOn: 'Sound: on', soundOff: 'Sound: off', webgl: 'Your browser could not start 3D graphics. Try another browser or turn on hardware acceleration.', paused: 'Paused', resume: 'Resume', menu: 'Menu', power: 'Power', left: "{n} left", sunk: "💦 {who} sank into the mud!", more: "+{n} more", shieldSunk: "🛡️ {n} {t} helpers sank instead!", golden: "GOLDEN PULL!", goldenSub: "Next one to sink wins", timeUp: "Time!", mud: "In the mud", cpuSunk: "A CPU player sank! 💦", youSunk: "One of yours sank! 💦" },
 tr: { name: 'Rope Rumble', sub: 'Halat Savaşı', red: 'KIRMIZI', blue: 'MAVİ', round: 'Tur {n}', ready: 'Hazır…', go: 'ÇEK!', roundWin: 'Turu {t} aldı!', draw: 'Berabere! Puan yok', matchWin: 'Maçı {t} kazandı!', play: 'Oyna', playAgain: 'Tekrar oyna', next: 'Sonraki seviye', retry: 'Tekrar dene', youWin: 'Kazandın!', youLose: 'Kaybettin!', level: 'Seviye {n}', best: 'En iyi seviye: {n}', you: 'SEN', cpu: 'BİLGİSAYAR', tapD: 'Olabildiğince hızlı tıkla ya da BOŞLUK tuşuna bas!', tapM: 'ÇEK düğmesine olabildiğince hızlı dokun!', pull: 'ÇEK!', intro: "Kırmızı takımın bilgisayara karşı. Kurdele senin çizgini her geçtiğinde bilgisayardan bir oyuncu çamura batar. Hızlı dokun: onlar seninkileri batırmadan 6'sını da batır. Süre biterse daha çok batıran kazanır.", liveBtn: 'LIVE modu · yayıncılar için', soundOn: 'Ses: açık', soundOff: 'Ses: kapalı', webgl: 'Tarayıcın 3D grafikleri başlatamadı. Başka bir tarayıcı dene ya da donanım hızlandırmayı aç.', paused: 'Duraklatıldı', resume: 'Devam', menu: 'Menü', power: 'Güç', left: "{n} kişi", sunk: "💦 {who} çamura battı!", more: "+{n} kişi daha", shieldSunk: "🛡️ {t} takımının {n} yardımcısı çamura battı!", golden: "ALTIN ÇEKİŞ!", goldenSub: "İlk batıran kazanır", timeUp: "Süre bitti!", mud: "Çamurdakiler", cpuSunk: "Bilgisayardan biri çamura battı! 💦", youSunk: "Seninkilerden biri çamura battı! 💦" },
 es: { name: 'Rope Rumble', sub: 'Juego de la Soga', red: 'ROJO', blue: 'AZUL', round: 'Ronda {n}', ready: 'Listos…', go: '¡TIRA!', roundWin: '¡{t} gana la ronda!', draw: '¡Empate! Nadie suma', matchWin: '¡{t} gana el partido!', play: 'Jugar', playAgain: 'Jugar otra vez', next: 'Siguiente nivel', retry: 'Reintentar', youWin: '¡Ganaste!', youLose: '¡Perdiste!', level: 'Nivel {n}', best: 'Mejor nivel: {n}', you: 'TÚ', cpu: 'CPU', tapD: '¡Haz clic o pulsa ESPACIO lo más rápido que puedas!', tapM: '¡Toca TIRA lo más rápido que puedas!', pull: '¡TIRA!', intro: "Tu equipo rojo contra la CPU. Cada vez que la cinta cruza tu línea, un jugador de la CPU se hunde en el barro. Toca rápido: hunde a los 6 antes de que hundan a los tuyos. Si se acaba el tiempo, gana quien hundió más.", liveBtn: 'Modo LIVE · para creadores', soundOn: 'Sonido: sí', soundOff: 'Sonido: no', webgl: 'Tu navegador no pudo iniciar los gráficos 3D. Prueba otro navegador o activa la aceleración por hardware.', paused: 'Pausa', resume: 'Seguir', menu: 'Menú', power: 'Fuerza', left: "quedan {n}", sunk: "💦 ¡{who} se hundió en el barro!", more: "+{n} más", shieldSunk: "🛡️ ¡{n} ayudantes de {t} se hundieron!", golden: "¡TIRÓN DE ORO!", goldenSub: "El próximo que hunda gana", timeUp: "¡Tiempo!", mud: "En el barro", cpuSunk: "¡Un jugador de la CPU se hundió! 💦", youSunk: "¡Uno de los tuyos se hundió! 💦" },
 pt: { name: 'Rope Rumble', sub: 'Cabo de Guerra', red: 'VERMELHO', blue: 'AZUL', round: 'Rodada {n}', ready: 'Prontos…', go: 'PUXA!', roundWin: '{t} vence a rodada!', draw: 'Empate! Ninguém pontua', matchWin: '{t} vence a partida!', play: 'Jogar', playAgain: 'Jogar de novo', next: 'Próximo nível', retry: 'Tentar de novo', youWin: 'Você venceu!', youLose: 'Você perdeu!', level: 'Nível {n}', best: 'Melhor nível: {n}', you: 'VOCÊ', cpu: 'CPU', tapD: 'Clique ou aperte ESPAÇO o mais rápido que puder!', tapM: 'Toque em PUXA o mais rápido que puder!', pull: 'PUXA!', intro: "Seu time vermelho contra a CPU. Cada vez que a fita cruza a sua linha, um jogador da CPU afunda na lama. Toque rápido: afunde os 6 antes que afundem os seus. Se o tempo acabar, vence quem afundou mais.", liveBtn: 'Modo LIVE · para criadores', soundOn: 'Som: ligado', soundOff: 'Som: desligado', webgl: 'Seu navegador não conseguiu iniciar os gráficos 3D. Tente outro navegador ou ative a aceleração de hardware.', paused: 'Pausado', resume: 'Continuar', menu: 'Menu', power: 'Força', left: "restam {n}", sunk: "💦 {who} afundou na lama!", more: "+{n}", shieldSunk: "🛡️ {n} ajudantes do {t} afundaram!", golden: "PUXADA DE OURO!", goldenSub: "Quem afundar primeiro vence", timeUp: "Tempo!", mud: "Na lama", cpuSunk: "Um jogador da CPU afundou! 💦", youSunk: "Um dos seus afundou! 💦" },
 id: { name: 'Rope Rumble', sub: 'Tarik Tambang', red: 'MERAH', blue: 'BIRU', round: 'Ronde {n}', ready: 'Siap…', go: 'TARIK!', roundWin: '{t} menang ronde ini!', draw: 'Seri! Tidak ada poin', matchWin: '{t} menang pertandingan!', play: 'Main', playAgain: 'Main lagi', next: 'Level berikutnya', retry: 'Coba lagi', youWin: 'Kamu menang!', youLose: 'Kamu kalah!', level: 'Level {n}', best: 'Level terbaik: {n}', you: 'KAMU', cpu: 'CPU', tapD: 'Klik atau tekan SPASI secepat mungkin!', tapM: 'Ketuk TARIK secepat mungkin!', pull: 'TARIK!', intro: "Tim merahmu melawan CPU. Setiap kali pita melewati garismu, satu pemain CPU tenggelam di lumpur. Ketuk cepat: tenggelamkan keenamnya sebelum mereka menenggelamkan timmu. Jika waktu habis, yang menenggelamkan lebih banyak menang.", liveBtn: 'Mode LIVE · untuk kreator', soundOn: 'Suara: nyala', soundOff: 'Suara: mati', webgl: 'Browser-mu tidak bisa memulai grafis 3D. Coba browser lain atau nyalakan akselerasi hardware.', paused: 'Jeda', resume: 'Lanjut', menu: 'Menu', power: 'Kekuatan', left: "sisa {n}", sunk: "💦 {who} tenggelam di lumpur!", more: "+{n} lagi", shieldSunk: "🛡️ {n} pembantu {t} tenggelam!", golden: "TARIKAN EMAS!", goldenSub: "Yang pertama menenggelamkan menang", timeUp: "Waktu habis!", mud: "Di lumpur", cpuSunk: "Satu pemain CPU tenggelam! 💦", youSunk: "Satu pemainmu tenggelam! 💦" }
};

const LIVE_RR = {
 en: { cls: 'Live match', wait: 'Waiting for both teams… comment RED or BLUE!', legendH: 'Join a team: comment', cmtK: 'Comment', cmt: 'your team pulls', likeK: '♥ Like', likes: 'more power', giftK: 'Gift', giftE: 'at least +1 person', giftRow: '+1 person per {c} coins', giftRowUsd: '+1 person per {c} donated', joined: 'joined {t}', brought: '@{u} brought {n} people to {t}!', strong: 'Strongman @{u} joins {t}!', mvpH: 'Top supporter', actH: 'Most active', newMatch: 'New match! Comment your team', roundOnly: 'Gift people stay until the end of the round.', note: 'Simulation mode: this page is not connected to a live stream. All events here are test events made by you or by Auto demo.', obsNote: 'Add as a browser source at 1080 × 1920. Without a connection the output plays a DEMO match.', auto: 'Auto demo: fake viewers (shown as DEMO on stream)', sRed: 'Comment RED', sBlue: 'Comment BLUE', sAny: 'Comment', sGift: 'Gift', teamsH: "Teams", team: "Team {n}", tName: "Name (empty = RED / BLUE)", tColor: "Colour", tKeys: "Extra join words, comma separated", tHint: "Viewers join by commenting the team name, its number (1 or 2) or an extra word. Team names and colours are yours to choose; please do not use logos you do not have the rights to.", orNum: "or write 1 / 2", rule: "Lose a pull and your front players sink. Last team standing wins.", shieldN: "Gift people are shields: they sink first.", regOpen: "Join now: {s}s", regClosed: "Joining closed: you are in the next match!", matchSec: "Match length (seconds)", regSec: "Joining time at the start (seconds)", cheer: "cheers from the mud", cfgH: 'Game settings', cpp: 'Coins per extra person', roundSec: 'Round length (seconds)', winR: 'Rounds to win the match' },
 tr: { cls: 'Canlı maç', wait: 'İki takım bekleniyor… yoruma KIRMIZI ya da MAVİ yaz!', legendH: 'Takıma katıl: yoruma yaz', cmtK: 'Yorum', cmt: 'takımın asılır', likeK: '♥ Beğeni', likes: 'güç verir', giftK: 'Hediye', giftE: 'en az +1 kişi', giftRow: 'her {c} jetona +1 kişi', giftRowUsd: 'her {c} bağışa +1 kişi', joined: '{t} takımına katıldı', brought: '@{u}, {t} takımına {n} kişi getirdi!', strong: 'Pehlivan @{u}, {t} takımında!', mvpH: 'En büyük destekçi', actH: 'En aktif', newMatch: 'Yeni maç! Takımını yoruma yaz', roundOnly: 'Hediyeyle gelen kişiler tur sonuna kadar kalır.', note: 'Simülasyon modu: bu sayfa bir canlı yayına bağlı değil. Buradaki tüm olaylar senin ya da Otomatik demonun oluşturduğu test olaylarıdır.', obsNote: '1080 × 1920 tarayıcı kaynağı olarak ekle. Bağlantı yokken çıktı DEMO maçı oynatır.', auto: 'Otomatik demo: sahte izleyiciler (yayında DEMO yazar)', sRed: 'Yorum: KIRMIZI', sBlue: 'Yorum: MAVİ', sAny: 'Yorum', sGift: 'Hediye', teamsH: "Takımlar", team: "{n}. takım", tName: "Ad (boş = KIRMIZI / MAVİ)", tColor: "Renk", tKeys: "Ek katılım kelimeleri, virgülle", tHint: "İzleyiciler takım adını, numarasını (1 ya da 2) ya da ek bir kelimeyi yorum yazarak katılır. Takım adlarını ve renklerini sen seçersin; hakkına sahip olmadığın logoları kullanma.", orNum: "ya da 1 / 2 yaz", rule: "Çekişi kaybeden takımın öndekileri çamura batar. Son kalan takım kazanır.", shieldN: "Hediyeyle gelenler kalkandır: önce onlar batar.", regOpen: "Katılım: {s} sn", regClosed: "Katılım kapandı: bir sonraki maçtasın!", matchSec: "Maç süresi (saniye)", regSec: "Baştaki katılım süresi (saniye)", cheer: "çamurdan tezahürat", cfgH: 'Oyun ayarları', cpp: 'Ekstra 1 kişi için jeton', roundSec: 'Tur süresi (saniye)', winR: 'Maçı kazanmak için tur' },
 es: { cls: 'Partido en directo', wait: 'Esperando a los dos equipos… ¡comenta ROJO o AZUL!', legendH: 'Únete a un equipo: comenta', cmtK: 'Comentario', cmt: 'tu equipo tira', likeK: '♥ Me gusta', likes: 'más fuerza', giftK: 'Regalo', giftE: 'mínimo +1 persona', giftRow: '+1 persona cada {c} monedas', giftRowUsd: '+1 persona cada {c} donados', joined: 'se unió a {t}', brought: '¡@{u} trajo {n} personas a {t}!', strong: '¡El forzudo @{u} se une a {t}!', mvpH: 'Mayor apoyo', actH: 'Más activo', newMatch: '¡Nuevo partido! Comenta tu equipo', roundOnly: 'Las personas de los regalos se quedan hasta el final de la ronda.', note: 'Modo simulación: esta página no está conectada a un directo. Todos los eventos aquí son de prueba, creados por ti o por la Demo automática.', obsNote: 'Añádelo como fuente de navegador de 1080 × 1920. Sin conexión, la salida muestra un partido DEMO.', auto: 'Demo automática: espectadores falsos (en el directo aparece DEMO)', sRed: 'Comentar ROJO', sBlue: 'Comentar AZUL', sAny: 'Comentario', sGift: 'Regalo', teamsH: "Equipos", team: "Equipo {n}", tName: "Nombre (vacío = ROJO / AZUL)", tColor: "Color", tKeys: "Palabras extra para unirse, separadas por comas", tHint: "Los espectadores se unen comentando el nombre del equipo, su número (1 o 2) o una palabra extra. Tú eliges nombres y colores; no uses logos sobre los que no tengas derechos.", orNum: "o escribe 1 / 2", rule: "Si pierdes un tirón, tus primeros jugadores se hunden. Gana el último equipo en pie.", shieldN: "Las personas de los regalos son escudos: se hunden primero.", regOpen: "Únete: {s} s", regClosed: "Inscripción cerrada: ¡estás en el próximo partido!", matchSec: "Duración del partido (segundos)", regSec: "Tiempo para unirse al inicio (segundos)", cheer: "anima desde el barro", cfgH: 'Ajustes del juego', cpp: 'Monedas por persona extra', roundSec: 'Duración de la ronda (segundos)', winR: 'Rondas para ganar' },
 pt: { cls: 'Partida ao vivo', wait: 'Esperando os dois times… comente VERMELHO ou AZUL!', legendH: 'Entre num time: comente', cmtK: 'Comentário', cmt: 'seu time puxa', likeK: '♥ Curtida', likes: 'mais força', giftK: 'Presente', giftE: 'no mínimo +1 pessoa', giftRow: '+1 pessoa a cada {c} moedas', giftRowUsd: '+1 pessoa a cada {c} doados', joined: 'entrou no {t}', brought: '@{u} trouxe {n} pessoas para o {t}!', strong: 'O fortão @{u} entra no {t}!', mvpH: 'Maior apoiador', actH: 'Mais ativo', newMatch: 'Nova partida! Comente seu time', roundOnly: 'As pessoas dos presentes ficam até o fim da rodada.', note: 'Modo simulação: esta página não está conectada a uma live. Todos os eventos aqui são de teste, criados por você ou pela Demo automática.', obsNote: 'Adicione como fonte de navegador de 1080 × 1920. Sem conexão, a saída mostra uma partida DEMO.', auto: 'Demo automática: espectadores falsos (aparece DEMO na live)', sRed: 'Comentar VERMELHO', sBlue: 'Comentar AZUL', sAny: 'Comentário', sGift: 'Presente', teamsH: "Times", team: "Time {n}", tName: "Nome (vazio = VERMELHO / AZUL)", tColor: "Cor", tKeys: "Palavras extras para entrar, separadas por vírgula", tHint: "Os espectadores entram comentando o nome do time, o número (1 ou 2) ou uma palavra extra. Você escolhe nomes e cores; não use logos sobre os quais você não tem direitos.", orNum: "ou escreva 1 / 2", rule: "Perdeu a puxada, os da frente afundam. Vence o último time de pé.", shieldN: "As pessoas dos presentes são escudos: afundam primeiro.", regOpen: "Entre já: {s} s", regClosed: "Entradas encerradas: você está na próxima partida!", matchSec: "Duração da partida (segundos)", regSec: "Tempo para entrar no início (segundos)", cheer: "torce da lama", cfgH: 'Ajustes do jogo', cpp: 'Moedas por pessoa extra', roundSec: 'Duração da rodada (segundos)', winR: 'Rodadas para vencer' },
 id: { cls: 'Pertandingan live', wait: 'Menunggu kedua tim… komentar MERAH atau BIRU!', legendH: 'Ikut tim: komentar', cmtK: 'Komentar', cmt: 'timmu menarik', likeK: '♥ Suka', likes: 'tambah kekuatan', giftK: 'Hadiah', giftE: 'minimal +1 orang', giftRow: '+1 orang tiap {c} koin', giftRowUsd: '+1 orang tiap donasi {c}', joined: 'bergabung ke {t}', brought: '@{u} membawa {n} orang ke {t}!', strong: 'Si kuat @{u} bergabung ke {t}!', mvpH: 'Pendukung terbesar', actH: 'Paling aktif', newMatch: 'Pertandingan baru! Komentar timmu', roundOnly: 'Orang dari hadiah tetap ada sampai ronde selesai.', note: 'Mode simulasi: halaman ini tidak terhubung ke siaran live. Semua event di sini adalah event uji yang dibuat olehmu atau oleh Demo otomatis.', obsNote: 'Tambahkan sebagai browser source 1080 × 1920. Tanpa koneksi, output menampilkan pertandingan DEMO.', auto: 'Demo otomatis: penonton palsu (di siaran tertulis DEMO)', sRed: 'Komentar MERAH', sBlue: 'Komentar BIRU', sAny: 'Komentar', sGift: 'Hadiah', teamsH: "Tim", team: "Tim {n}", tName: "Nama (kosong = MERAH / BIRU)", tColor: "Warna", tKeys: "Kata tambahan untuk ikut, pisahkan dengan koma", tHint: "Penonton ikut dengan mengomentari nama tim, nomornya (1 atau 2), atau kata tambahan. Nama dan warna tim kamu yang pilih; jangan pakai logo yang bukan hakmu.", orNum: "atau tulis 1 / 2", rule: "Kalah tarikan, pemain depan tenggelam. Tim terakhir yang bertahan menang.", shieldN: "Orang dari hadiah jadi tameng: mereka tenggelam duluan.", regOpen: "Ikut sekarang: {s} dtk", regClosed: "Pendaftaran ditutup: kamu ikut pertandingan berikutnya!", matchSec: "Lama pertandingan (detik)", regSec: "Waktu ikut di awal (detik)", cheer: "menyemangati dari lumpur", cfgH: 'Pengaturan game', cpp: 'Koin per orang tambahan', roundSec: 'Lama ronde (detik)', winR: 'Ronde untuk menang' }
};
const SRC_TXT = {"en": {"demo": "DEMO", "sim": "SIMULATION", "panelH": "Creator panel", "back": "← Game", "source": "Data source", "srcSim": "Test simulator", "active": "ACTIVE", "srcTT": "TikTok LIVE (official)", "srcTTn": "WAITING FOR PARTNER ACCESS", "simH": "Simulator", "blockH": "Blocked words and users (comma separated)", "obsH": "Stream output for OBS / LIVE Studio", "copy": "Copy", "copied": "Copied!", "logH": "Event queue", "panel": "Panel", "st": {"ok": "APPLIED", "dup": "DUPLICATE", "queue": "QUEUED", "filt": "FILTERED"}, "srcN": {"tikfinity": "TikTok · via TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + other platforms · via Social Stream Ninja (beta)"}, "srcH": {"twitch": "Official Twitch chat, free, nothing to install: type your channel name and connect. Bits and subs count as gifts. (Twitch does not send follows to chat.)", "youtube": "Official YouTube API, free. One-time setup: in Google Cloud Console turn on “YouTube Data API v3”, create an API key (restrict it to pickradar.net) and paste it here with your live video link. The free daily quota lasts about 3 hours of streaming. Super Chats, Super Stickers and memberships count as gifts.", "ssn": "For Kick and any other platform: use the free Social Stream Ninja app or browser extension. In its settings under Mechanics turn on “Enable remote API control” and “Send chat messages to API server”, then paste your session ID here. Donations count as gifts. Social Stream Ninja is a third-party tool, not made by us."}, "moneyNote": "Twitch, YouTube and Kick donations are converted to coins: $1 ≈ 75 coins (100 Bits = $1, a sub ≈ $5).", "twCh": "Twitch channel name", "ytKey": "YouTube API key", "ytVid": "Live video link or ID", "ssSess": "Social Stream session ID", "anyGift": "Any gift", "errGen": "CANNOT CONNECT", "needCh": "Type your Twitch channel name first.", "needYt": "Paste your API key and live video link first.", "needSs": "Paste your Social Stream session ID first.", "ytBadKey": "YouTube rejected the key, or today’s free quota is used up.", "ytNoLive": "No active live chat on this video yet. Retrying…", "obsNoteNet": "Add as a browser source at 1080 × 1920. The class reacts to your real chat and donations.", "keyWarn": "This link contains your API key, do not share it.", "liveNote": "Real live data is connected. Simulator buttons still work for testing.", "tfSt": {"off": "OFF", "wait": "CONNECTING…", "on": "CONNECTED", "err": "TIKFINITY NOT FOUND"}, "tfUse": "Connect my LIVE", "tfStop": "Disconnect", "tfHelp": "Free and runs only on your computer: install the TikFinity desktop app, log in with your TikTok account and keep it open while you are LIVE. This page reads your stream events from it (ws://localhost:21213). No keys, nothing passes through our servers. TikFinity is a third-party tool, not made by TikTok or by us.", "tfPerm": "If Chrome asks for “local network access”, click Allow.", "obsNoteTF": "Add as a browser source at 1080 × 1920 on the same computer where TikFinity is running. The class reacts to your real comments, likes and gifts.", "sFollow": "Follow"}, "tr": {"demo": "DEMO", "sim": "SİMÜLASYON", "panelH": "Yayıncı paneli", "back": "← Oyun", "source": "Veri kaynağı", "srcSim": "Test simülatörü", "active": "AKTİF", "srcTT": "TikTok LIVE (resmî)", "srcTTn": "PARTNER ONAYI BEKLENİYOR", "simH": "Simülatör", "blockH": "Engelli kelimeler ve kullanıcılar (virgülle)", "obsH": "OBS / LIVE Studio yayın çıktısı", "copy": "Kopyala", "copied": "Kopyalandı!", "logH": "Olay kuyruğu", "panel": "Panel", "st": {"ok": "UYGULANDI", "dup": "TEKRAR", "queue": "SIRADA", "filt": "FİLTRE"}, "srcN": {"tikfinity": "TikTok · TikFinity ile (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + diğer platformlar · Social Stream Ninja ile (beta)"}, "srcH": {"twitch": "Resmî Twitch sohbeti, ücretsiz, kurulum yok: kanal adını yaz ve bağla. Bits ve abonelikler hediye sayılır. (Twitch takipleri sohbete göndermez.)", "youtube": "Resmî YouTube API’si, ücretsiz. Tek seferlik kurulum: Google Cloud Console’da “YouTube Data API v3”ü aç, bir API anahtarı oluştur (pickradar.net ile sınırla) ve canlı yayın linkinle birlikte buraya yapıştır. Ücretsiz günlük kota yaklaşık 3 saatlik yayına yeter. Süper Sohbet, Süper Çıkartma ve kanal üyelikleri hediye sayılır.", "ssn": "Kick ve diğer tüm platformlar için: ücretsiz Social Stream Ninja uygulamasını ya da tarayıcı eklentisini kullan. Ayarlarında Mechanics bölümünden “Enable remote API control” ve “Send chat messages to API server” seçeneklerini aç, sonra oturum ID’ni buraya yapıştır. Bağışlar hediye sayılır. Social Stream Ninja üçüncü taraf bir araçtır; biz yapmadık."}, "moneyNote": "Twitch, YouTube ve Kick bağışları jetona çevrilir: 1 $ ≈ 75 jeton (100 Bits = 1 $, bir abonelik ≈ 5 $).", "twCh": "Twitch kanal adı", "ytKey": "YouTube API anahtarı", "ytVid": "Canlı yayın linki veya ID", "ssSess": "Social Stream oturum ID", "anyGift": "Her hediye", "errGen": "BAĞLANAMADI", "needCh": "Önce Twitch kanal adını yaz.", "needYt": "Önce API anahtarını ve canlı yayın linkini yapıştır.", "needSs": "Önce Social Stream oturum ID’ni yapıştır.", "ytBadKey": "YouTube anahtarı kabul etmedi ya da bugünkü ücretsiz kota doldu.", "ytNoLive": "Bu videoda henüz aktif canlı sohbet yok. Tekrar deneniyor…", "obsNoteNet": "1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek sohbetine ve bağışlarına tepki verir.", "keyWarn": "Bu link API anahtarını içerir, kimseyle paylaşma.", "liveNote": "Gerçek canlı yayın verisi bağlı. Simülatör düğmeleri test için yine çalışır.", "tfSt": {"off": "KAPALI", "wait": "BAĞLANIYOR…", "on": "BAĞLANDI", "err": "TIKFINITY BULUNAMADI"}, "tfUse": "Yayınımı bağla", "tfStop": "Bağlantıyı kes", "tfHelp": "Ücretsiz ve yalnızca senin bilgisayarında çalışır: TikFinity masaüstü uygulamasını kur, TikTok hesabınla giriş yap ve yayın boyunca açık tut. Bu sayfa yayın olaylarını oradan okur (ws://localhost:21213). Anahtar yok, hiçbir veri bizim sunucumuzdan geçmez. TikFinity üçüncü taraf bir araçtır; TikTok ya da biz yapmadık.", "tfPerm": "Chrome “yerel ağ erişimi” izni sorarsa İzin ver’e bas.", "obsNoteTF": "TikFinity’nin açık olduğu aynı bilgisayarda 1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek yorumlarına, beğenilerine ve hediyelerine tepki verir.", "sFollow": "Takip"}, "es": {"demo": "DEMO", "sim": "SIMULACIÓN", "panelH": "Panel del creador", "back": "← Juego", "source": "Fuente de datos", "srcSim": "Simulador de prueba", "active": "ACTIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "ESPERANDO ACCESO DE SOCIO", "simH": "Simulador", "blockH": "Palabras y usuarios bloqueados (separados por comas)", "obsH": "Salida del directo para OBS / LIVE Studio", "copy": "Copiar", "copied": "¡Copiado!", "logH": "Cola de eventos", "panel": "Panel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "EN COLA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · con TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + otras plataformas · con Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial de Twitch, gratis, sin instalar nada: escribe el nombre de tu canal y conecta. Los Bits y las suscripciones cuentan como regalos. (Twitch no envía los follows al chat.)", "youtube": "API oficial de YouTube, gratis. Configuración única: en Google Cloud Console activa “YouTube Data API v3”, crea una clave de API (restríngela a pickradar.net) y pégala aquí con el enlace de tu directo. La cuota diaria gratuita alcanza para unas 3 horas de directo. Super Chats, Super Stickers y membresías cuentan como regalos.", "ssn": "Para Kick y cualquier otra plataforma: usa la app o extensión gratuita Social Stream Ninja. En su configuración, en Mechanics, activa “Enable remote API control” y “Send chat messages to API server” y pega aquí tu ID de sesión. Las donaciones cuentan como regalos. Social Stream Ninja es una herramienta de terceros, no la hicimos nosotros."}, "moneyNote": "Las donaciones de Twitch, YouTube y Kick se convierten en monedas: 1 $ ≈ 75 monedas (100 Bits = 1 $, una suscripción ≈ 5 $).", "twCh": "Nombre del canal de Twitch", "ytKey": "Clave de API de YouTube", "ytVid": "Enlace o ID del directo", "ssSess": "ID de sesión de Social Stream", "anyGift": "Cualquier regalo", "errGen": "NO SE PUEDE CONECTAR", "needCh": "Escribe primero el nombre de tu canal de Twitch.", "needYt": "Pega primero tu clave de API y el enlace del directo.", "needSs": "Pega primero tu ID de sesión de Social Stream.", "ytBadKey": "YouTube rechazó la clave o la cuota gratuita de hoy se agotó.", "ytNoLive": "Este vídeo aún no tiene chat en directo activo. Reintentando…", "obsNoteNet": "Añádelo como fuente de navegador de 1080 × 1920. La clase reacciona a tu chat y donaciones reales.", "keyWarn": "Este enlace contiene tu clave de API, no lo compartas.", "liveNote": "Datos reales del directo conectados. Los botones del simulador siguen funcionando para pruebas.", "tfSt": {"off": "APAGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NO ENCONTRADO"}, "tfUse": "Conectar mi LIVE", "tfStop": "Desconectar", "tfHelp": "Gratis y solo en tu ordenador: instala la app de escritorio TikFinity, inicia sesión con tu cuenta de TikTok y mantenla abierta durante el directo. Esta página lee los eventos de tu directo desde ella (ws://localhost:21213). Sin claves; nada pasa por nuestros servidores. TikFinity es una herramienta de terceros, no la hizo TikTok ni nosotros.", "tfPerm": "Si Chrome pide «acceso a la red local», pulsa Permitir.", "obsNoteTF": "Añádelo como fuente de navegador de 1080 × 1920 en el mismo ordenador donde está abierto TikFinity. La clase reacciona a tus comentarios, me gusta y regalos reales.", "sFollow": "Seguir"}, "pt": {"demo": "DEMO", "sim": "SIMULAÇÃO", "panelH": "Painel do criador", "back": "← Jogo", "source": "Fonte de dados", "srcSim": "Simulador de teste", "active": "ATIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "AGUARDANDO ACESSO DE PARCEIRO", "simH": "Simulador", "blockH": "Palavras e usuários bloqueados (separados por vírgula)", "obsH": "Saída da live para OBS / LIVE Studio", "copy": "Copiar", "copied": "Copiado!", "logH": "Fila de eventos", "panel": "Painel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "NA FILA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · com TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + outras plataformas · com Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial da Twitch, grátis, sem instalar nada: digite o nome do seu canal e conecte. Bits e inscrições contam como presentes. (A Twitch não envia follows para o chat.)", "youtube": "API oficial do YouTube, grátis. Configuração única: no Google Cloud Console ative a “YouTube Data API v3”, crie uma chave de API (restrinja a pickradar.net) e cole aqui com o link da sua live. A cota diária grátis dá para cerca de 3 horas de live. Super Chats, Super Stickers e assinaturas de canal contam como presentes.", "ssn": "Para Kick e qualquer outra plataforma: use o app ou a extensão gratuita Social Stream Ninja. Nas configurações, em Mechanics, ative “Enable remote API control” e “Send chat messages to API server” e cole aqui o seu ID de sessão. Doações contam como presentes. Social Stream Ninja é uma ferramenta de terceiros, não foi feita por nós."}, "moneyNote": "Doações da Twitch, YouTube e Kick viram moedas: US$ 1 ≈ 75 moedas (100 Bits = US$ 1, uma inscrição ≈ US$ 5).", "twCh": "Nome do canal da Twitch", "ytKey": "Chave de API do YouTube", "ytVid": "Link ou ID da live", "ssSess": "ID de sessão do Social Stream", "anyGift": "Qualquer presente", "errGen": "NÃO FOI POSSÍVEL CONECTAR", "needCh": "Digite primeiro o nome do seu canal da Twitch.", "needYt": "Cole primeiro sua chave de API e o link da live.", "needSs": "Cole primeiro seu ID de sessão do Social Stream.", "ytBadKey": "O YouTube recusou a chave ou a cota grátis de hoje acabou.", "ytNoLive": "Este vídeo ainda não tem chat ao vivo ativo. Tentando de novo…", "obsNoteNet": "Adicione como fonte de navegador de 1080 × 1920. A turma reage ao seu chat e às doações reais.", "keyWarn": "Este link contém sua chave de API, não compartilhe.", "liveNote": "Dados reais da live conectados. Os botões do simulador continuam funcionando para testes.", "tfSt": {"off": "DESLIGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NÃO ENCONTRADO"}, "tfUse": "Conectar minha LIVE", "tfStop": "Desconectar", "tfHelp": "Grátis e só no seu computador: instale o app de desktop TikFinity, entre com sua conta do TikTok e deixe-o aberto durante a live. Esta página lê os eventos da sua live a partir dele (ws://localhost:21213). Sem chaves; nada passa pelos nossos servidores. TikFinity é uma ferramenta de terceiros, não foi feita pelo TikTok nem por nós.", "tfPerm": "Se o Chrome pedir “acesso à rede local”, clique em Permitir.", "obsNoteTF": "Adicione como fonte de navegador de 1080 × 1920 no mesmo computador em que o TikFinity está aberto. A turma reage aos seus comentários, curtidas e presentes reais.", "sFollow": "Seguir"}, "id": {"demo": "DEMO", "sim": "SIMULASI", "panelH": "Panel kreator", "back": "← Game", "source": "Sumber data", "srcSim": "Simulator uji", "active": "AKTIF", "srcTT": "TikTok LIVE (resmi)", "srcTTn": "MENUNGGU AKSES PARTNER", "simH": "Simulator", "blockH": "Kata dan pengguna yang diblokir (pisahkan dengan koma)", "obsH": "Output siaran untuk OBS / LIVE Studio", "copy": "Salin", "copied": "Tersalin!", "logH": "Antrean event", "panel": "Panel", "st": {"ok": "DITERAPKAN", "dup": "DUPLIKAT", "queue": "ANTRE", "filt": "DISARING"}, "srcN": {"tikfinity": "TikTok · lewat TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + platform lain · lewat Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat Twitch resmi, gratis, tanpa instalasi: ketik nama channel-mu lalu hubungkan. Bits dan langganan dihitung sebagai hadiah. (Twitch tidak mengirim follow ke chat.)", "youtube": "API YouTube resmi, gratis. Pengaturan sekali saja: di Google Cloud Console aktifkan “YouTube Data API v3”, buat API key (batasi ke pickradar.net) lalu tempel di sini bersama link live-mu. Kuota harian gratis cukup untuk sekitar 3 jam siaran. Super Chat, Super Sticker, dan keanggotaan dihitung sebagai hadiah.", "ssn": "Untuk Kick dan platform lainnya: pakai aplikasi atau ekstensi gratis Social Stream Ninja. Di pengaturannya, bagian Mechanics, nyalakan “Enable remote API control” dan “Send chat messages to API server”, lalu tempel session ID-mu di sini. Donasi dihitung sebagai hadiah. Social Stream Ninja adalah alat pihak ketiga, bukan buatan kami."}, "moneyNote": "Donasi Twitch, YouTube, dan Kick diubah jadi koin: $1 ≈ 75 koin (100 Bits = $1, satu langganan ≈ $5).", "twCh": "Nama channel Twitch", "ytKey": "API key YouTube", "ytVid": "Link atau ID video live", "ssSess": "Session ID Social Stream", "anyGift": "Hadiah apa pun", "errGen": "TIDAK BISA TERHUBUNG", "needCh": "Ketik dulu nama channel Twitch-mu.", "needYt": "Tempel dulu API key dan link video live-mu.", "needSs": "Tempel dulu session ID Social Stream-mu.", "ytBadKey": "YouTube menolak key ini, atau kuota gratis hari ini sudah habis.", "ytNoLive": "Video ini belum punya live chat aktif. Mencoba lagi…", "obsNoteNet": "Tambahkan sebagai browser source 1080 × 1920. Kelas bereaksi pada chat dan donasi aslimu.", "keyWarn": "Link ini berisi API key-mu, jangan dibagikan.", "liveNote": "Data live asli terhubung. Tombol simulator tetap bisa dipakai untuk uji.", "tfSt": {"off": "MATI", "wait": "MENGHUBUNGKAN…", "on": "TERHUBUNG", "err": "TIKFINITY TIDAK DITEMUKAN"}, "tfUse": "Hubungkan LIVE-ku", "tfStop": "Putuskan", "tfHelp": "Gratis dan hanya berjalan di komputermu: pasang aplikasi desktop TikFinity, masuk dengan akun TikTok-mu dan biarkan terbuka selama LIVE. Halaman ini membaca event siaranmu dari sana (ws://localhost:21213). Tanpa kunci; tidak ada data yang lewat server kami. TikFinity adalah alat pihak ketiga, bukan buatan TikTok atau kami.", "tfPerm": "Jika Chrome meminta “akses jaringan lokal”, klik Izinkan.", "obsNoteTF": "Tambahkan sebagai browser source 1080 × 1920 di komputer yang sama tempat TikFinity terbuka. Kelas bereaksi pada komentar, suka, dan hadiah aslimu.", "sFollow": "Ikuti"}};
// team keywords work in every language, so mixed audiences can join
const WORDS = { r: ['red', 'kirmizi', 'kırmızı', 'rojo', 'vermelho', 'merah', 'rouge', 'rot', 'rosso', 'kirmizii'], b: ['blue', 'mavi', 'azul', 'biru', 'bleu', 'blau', 'blu', 'mavii'] };
const EMO = { r: ['🔴', '❤️', '❤', '🟥'], b: ['🔵', '💙', '🟦'] };

const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const COL = { r: '#e94f37', b: '#2f7fe0', rD: '#b5321f', bD: '#1f5cb0' };
const LINE = 1.6, MUD = 1.3, FRONT = 1.9, SP = .64, SLOTS = 6;

function mount(host, opts) {
 opts = opts || {};
 const lang = LANG[opts.lang] ? opts.lang : 'en';
 const L = LANG[lang];
 const QS = new URLSearchParams(global.location ? global.location.search : '');
 const live = !!opts.live || QS.get('live') === '1';
 const clean = live && QS.get('clean') === '1';
 const outer = host;
 if (live) {
  document.documentElement.style.overflow = 'hidden';
  if (document.body && outer.parentNode !== document.body) document.body.appendChild(outer);
  outer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;width:auto;height:auto;margin:0;border:0;border-radius:0;box-shadow:none;background:#0e1628';
  if (!clean) { const stage = document.createElement('div'); stage.className = 'rr-stage'; outer.appendChild(stage); host = stage; }
 }
 const T3 = global.THREE;
 const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in global;
 host.classList.add('rr');
 const store = {
  get(k, d) { try { const v = localStorage.getItem('rr.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('rr.' + k, JSON.stringify(v)); } catch (e) { } }
 };
 const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
 const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
 const DEF_CFG = { cpp: 20, matchSec: 180, regSec: 30, block: '', nR: '', nB: '', cR: COL.r, cB: COL.b, kR: '', kB: '' };
 let CFG = Object.assign({}, DEF_CFG, live ? store.get('livecfg', {}) : {});
 try { const c = QS.get('cfg'); if (c && live) CFG = Object.assign({}, DEF_CFG, JSON.parse(decodeURIComponent(escape(atob(c.replace(/ /g, '+')))))); } catch (e) { }
 // team names and colours: the streamer can rename the teams (any two names) and pick their colours
 const tname = t => String((t === 'r' ? CFG.nR : CFG.nB) || '').replace(/[<>]/g, '').trim().slice(0, 16);
 const TN = t => { const n = live ? tname(t) : ''; return n ? n.toLocaleUpperCase(lang) : t === 'r' ? L.red : L.blue; };
 const hexOk = h => /^#[0-9a-f]{6}$/i.test(String(h || ''));
 const shade = (h, f) => '#' + [1, 3, 5].map(i => Math.round(parseInt(h.substr(i, 2), 16) * f).toString(16).padStart(2, '0')).join('');
 const lum = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16) / 255); return .2126 * r + .7152 * g + .0722 * b; };
 const TC = {};
 function teamColors() {
  TC.r = live && hexOk(CFG.cR) ? CFG.cR : COL.r; TC.b = live && hexOk(CFG.cB) ? CFG.cB : COL.b;
  for (const t of ['r', 'b']) { TC[t + 'D'] = lum(TC[t]) > .62 ? shade(TC[t], .55) : shade(TC[t], .74); TC[t + 'T'] = lum(TC[t]) > .62 ? '#1e2235' : '#ffffff'; }
  for (const k of ['r', 'b', 'rD', 'bD', 'rT', 'bT']) host.style.setProperty('--rr-' + k, TC[k]);
 }
 teamColors();

 /* ---------- styles ---------- */
 const css = document.createElement('style');
 css.textContent = `
.rr{position:relative;overflow:hidden;font-family:'Baloo 2','Nunito',system-ui,sans-serif;color:#1e2235;user-select:none;-webkit-user-select:none;touch-action:manipulation;background:#bfe0f0}
.rr canvas{display:block;width:100%;height:100%;outline:none}
.rr-ui,.rr-labels{position:absolute;inset:0;pointer-events:none}
.rr-np{position:absolute;transform:translate(-50%,-100%);white-space:nowrap;padding:1px 7px;border-radius:9px;color:#fff;font:800 11px system-ui,sans-serif;box-shadow:0 2px 0 rgba(0,0,0,.25)}
.rr-np.r{background:var(--rr-r);color:var(--rr-rT)}.rr-np.b{background:var(--rr-b);color:var(--rr-bT)}.rr-np.big{font-size:13px;padding:2px 9px;background:#ffc93c;color:#1e2235}
.rr-score{position:absolute;left:10px;right:10px;top:10px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:6px;padding:6px 10px;border-radius:16px;background:rgba(255,247,232,.95);box-shadow:0 4px 0 rgba(0,0,0,.18)}
.rr-score .t{display:flex;align-items:center;gap:6px;font-weight:800;font-size:17px;line-height:1;min-width:0}
.rr-score .t span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr-score .t.b{justify-content:flex-end}
.rr-score .t.r span{color:var(--rr-rD)}.rr-score .t.b span{color:var(--rr-bD)}
.rr-score i{flex:none;width:11px;height:11px;border-radius:50%;background:#e2d8c6;display:inline-block}
.rr-score .t.r i.on{background:var(--rr-r)}.rr-score .t.b i.on{background:var(--rr-b)}
.rr-score .c{text-align:center;font:800 12px system-ui,sans-serif;letter-spacing:.5px;color:#1f5e55}
.rr-score .c b{display:block;font:800 20px 'Baloo 2',system-ui,sans-serif;color:#1e2235;line-height:1}
.rr-pow{position:absolute;left:10px;right:10px;top:70px;height:24px;border-radius:12px;overflow:hidden;display:flex;box-shadow:0 3px 0 rgba(0,0,0,.18);background:#e2d8c6}
.rr-pow div{display:flex;align-items:center;font:800 12px system-ui,sans-serif;color:#fff;white-space:nowrap;transition:width .25s}
.rr-pow .r{background:linear-gradient(90deg,var(--rr-rD),var(--rr-r));padding-left:9px;color:var(--rr-rT)}
.rr-pow .b{background:linear-gradient(90deg,var(--rr-b),var(--rr-bD));justify-content:flex-end;padding-right:9px;color:var(--rr-bT)}
.rr-big{position:absolute;left:0;right:0;top:40%;text-align:center;font-weight:800;font-size:64px;line-height:1;color:#fff7e8;text-shadow:0 5px 0 #1e2235,0 0 18px rgba(0,0,0,.25);transition:opacity .25s,transform .25s;pointer-events:none}
.rr-big.off{opacity:0;transform:scale(.7)}
.rr-big small{display:block;font-size:22px;margin-top:6px;text-shadow:0 3px 0 #1e2235}
.rr-ban{position:absolute;left:10px;right:10px;top:104px;padding:8px 12px;border-radius:14px;background:#1e2235;color:#fff7e8;box-shadow:0 4px 0 rgba(0,0,0,.3);transition:opacity .3s,transform .3s}
.rr-ban.off{opacity:0;transform:translateY(-8px)}
.rr-ban b{display:block;font-size:18px;line-height:1.15}
.rr-ban.r{background:linear-gradient(90deg,var(--rr-rD),var(--rr-r));color:var(--rr-rT)}.rr-ban.b{background:linear-gradient(90deg,var(--rr-bD),var(--rr-b));color:var(--rr-bT)}.rr-ban.gold{background:linear-gradient(90deg,#b5461f,#f2a23a)}
.rr-btn{pointer-events:auto;border:0;border-radius:14px;padding:12px 22px;font:800 18px 'Baloo 2',system-ui,sans-serif;background:#ffc93c;color:#1e2235;cursor:pointer;box-shadow:0 5px 0 #b5461f;text-decoration:none;display:inline-block}
.rr-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #b5461f}
.rr-btn.g{background:#fff7e8;box-shadow:0 5px 0 #8e99b8}
.rr-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:18px;text-align:center;background:rgba(14,22,40,.55);pointer-events:auto}
.rr-ov[hidden]{display:none}
.rr-ov h2{margin:0;font-weight:800;font-size:54px;line-height:.85;color:#fff7e8;text-shadow:0 5px 0 #b5321f}
.rr-ov h2 span{display:block;color:#ffc93c;font-size:.62em;text-shadow:0 4px 0 #1f5e55;margin-top:6px}
.rr-ov p{margin:0;max-width:440px;color:#fff7e8;font:600 15px/1.4 system-ui,sans-serif}
.rr-ov .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.rr-ov small{color:#cfe3ff;font:700 13px system-ui,sans-serif}
.rr-pull{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:132px;height:132px;border-radius:50%;font-size:30px;padding:0;box-shadow:0 7px 0 #b5461f;pointer-events:auto}
.rr-hint{position:absolute;left:0;right:0;bottom:14px;text-align:center;font:800 15px system-ui,sans-serif;color:#1e2235;text-shadow:0 1px 0 #fff}
.rr-icon{position:absolute;right:10px;bottom:10px;width:40px;height:40px;padding:0;font-size:16px;pointer-events:auto}
.rr-mud{position:absolute;left:10px;right:10px;bottom:206px;padding:5px 10px;border-radius:12px;background:rgba(94,58,31,.88);color:#fff7e8;font:700 12px system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rr-mud b{color:#ffc93c}
.rr-err{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:600 15px system-ui,sans-serif;background:#1e2235;color:#fff7e8}
`;
 document.head.appendChild(css);

 let renderer;
 try { renderer = new T3.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
 catch (e) { host.appendChild(el('div', 'rr-err', esc(L.webgl))); return; }
 const quality = touch ? 0 : 1;
 renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, quality ? 1.75 : 1.25));
 renderer.outputColorSpace = T3.SRGBColorSpace;
 renderer.toneMapping = T3.NeutralToneMapping;
 renderer.toneMappingExposure = 1.03;
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = T3.PCFSoftShadowMap;
 host.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label', L.name + ' · ' + L.sub);
 renderer.domElement.tabIndex = 0;
 const labels = el('div', 'rr-labels'), ui = el('div', 'rr-ui');
 host.appendChild(labels); host.appendChild(ui);

 /* ---------- scene ---------- */
 const scene = new T3.Scene();
 scene.background = new T3.Color('#bfe0f0');
 scene.fog = new T3.Fog('#bfe0f0', 38, 90);
 const camera = new T3.PerspectiveCamera(30, 1, .5, 200);
 scene.add(new T3.HemisphereLight('#eaf6ff', '#8fbf6a', 1.3));
 const sun = new T3.DirectionalLight('#fff0d6', 2.5);
 sun.position.set(-5, 12, 8); sun.target.position.set(0, 0, 0);
 sun.castShadow = true;
 Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 6, bottom: -6, near: 1, far: 40 });
 sun.shadow.mapSize.set(quality ? 2048 : 1024, quality ? 2048 : 1024);
 sun.shadow.bias = -.0006; sun.shadow.normalBias = .03; sun.shadow.radius = 3;
 scene.add(sun, sun.target);
 const fill = new T3.DirectionalLight('#fff4e6', .5); fill.position.set(6, 5, 10); scene.add(fill);

 const matCache = {};
 const M = (hex, rough, opt) => { const k = hex + '|' + rough + '|' + JSON.stringify(opt || {}); return matCache[k] || (matCache[k] = new T3.MeshStandardMaterial(Object.assign({ color: hex, roughness: rough == null ? .6 : rough, metalness: 0 }, opt || {}))); };
 const MB = hex => matCache['b' + hex] || (matCache['b' + hex] = new T3.MeshBasicMaterial({ color: hex }));
 const G = { sph: new T3.SphereGeometry(1, 22, 16), sphLo: new T3.SphereGeometry(1, 12, 8), box: new T3.BoxGeometry(1, 1, 1), cyl: new T3.CylinderGeometry(1, 1, 1, 18), cone: new T3.ConeGeometry(1, 1, 14), half: new T3.TorusGeometry(1, .22, 8, 16, Math.PI), torus: new T3.TorusGeometry(1, .14, 8, 26) };
 const capCache = {};
 const capG = (r, len) => capCache[r + '|' + len] || (capCache[r + '|' + len] = new T3.CapsuleGeometry(r, len, 5, 12));
 function mesh(geo, mat, x, y, z, sx, sy, sz, parent, shadow) {
  const m = new T3.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  if (sx != null) m.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
  (parent || scene).add(m);
  return m;
 }
 function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = 4;
  if (rep) { t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  return t;
 }

 // ground: mowed grass with stripes
 const grassTex = canvasTex(256, 256, (c, w, h) => {
  for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#79c26a' : '#86cc74'; c.fillRect(i * w / 8, 0, w / 8, h); }
  for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${40 + (i * 7) % 40},${110 + (i * 13) % 60},40,.18)`; c.fillRect((i * 97) % w, (i * 57) % h, 2, 4); }
 }, [10, 8]);
 const ground = mesh(new T3.PlaneGeometry(80, 60), new T3.MeshStandardMaterial({ map: grassTex, roughness: .95 }), 0, 0, 0);
 ground.rotation.x = -Math.PI / 2; ground.castShadow = false;
 // chalk court
 const chalk = MB('#f6f3ea');
 const TM = { r: new T3.MeshStandardMaterial({ color: TC.r, roughness: .6 }), b: new T3.MeshStandardMaterial({ color: TC.b, roughness: .6 }), rD: new T3.MeshStandardMaterial({ color: TC.rD, roughness: .7 }), bD: new T3.MeshStandardMaterial({ color: TC.bD, roughness: .7 }), lr: new T3.MeshBasicMaterial({ color: TC.r }), lb: new T3.MeshBasicMaterial({ color: TC.b }) };
 for (const z of [-2.1, 2.1]) mesh(G.box, chalk, 0, .012, z, 17, .01, .07, null, false);
 for (const s of [-1, 1]) { mesh(G.box, chalk, s * 8.5, .012, 0, .07, .01, 4.2, null, false); mesh(G.box, s < 0 ? TM.lr : TM.lb, s * LINE, .016, 0, .14, .01, 3.2, null, false); }
 // mud pit
 const mudTex = canvasTex(256, 256, (c, w, h) => {
  c.fillStyle = '#6b4226'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 70; i++) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, i % 3 ? 'rgba(90,52,28,.55)' : 'rgba(130,86,50,.45)'); g.addColorStop(1, 'rgba(90,52,28,0)'); c.save(); c.translate((i * 71) % w, (i * 113) % h); c.scale(10 + (i * 7) % 26, 8 + (i * 11) % 18); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore(); }
 });
 const mud = mesh(new T3.CircleGeometry(1, 40), new T3.MeshStandardMaterial({ map: mudTex, roughness: .22, metalness: .05, color: '#ffffff' }), 0, .02, 0, MUD, 1.9, 1, null, false);
 mud.rotation.x = -Math.PI / 2; mud.receiveShadow = true;
 const rim = mesh(new T3.TorusGeometry(1, .07, 8, 48), M('#7a4e2c', .85), 0, .03, 0, MUD, 1.9, 1, null, false); rim.rotation.x = -Math.PI / 2;
 // line posts with flags
 for (const s of [-1, 1]) for (const z of [-2.3, 2.3]) {
  mesh(G.cyl, M('#f6f3ea', .5), s * LINE, .55, z, .04, 1.1, .04);
  const f = mesh(G.box, s < 0 ? TM.r : TM.b, s * LINE + s * .2, .98, z, .38, .24, .02); f.castShadow = true;
 }
 // scenery: trees, fence, team banners
 const trunk = M('#8a5a3b', .8), leaf = [M('#3e9e5c', .8), M('#4fb06a', .8), M('#2f8a4e', .8)];
 for (let i = 0; i < 16; i++) {
  const x = -15 + i * 2 + ((i * 37) % 7) * .1, z = -7.5 - ((i * 53) % 5) * .7, s = .8 + ((i * 29) % 5) * .12;
  mesh(G.cyl, trunk, x, .6 * s, z, .14 * s, 1.2 * s, .14 * s);
  mesh(G.sph, leaf[i % 3], x, 1.7 * s, z, .95 * s, 1.05 * s, .95 * s);
 }
 for (const s of [1]) for (let i = 0; i < 7; i++) {
  const x = s * (10.5 + (i % 2) * 1.6 + ((i * 31) % 5) * .2), z = -5 + i * 1.7, sc = .8 + ((i * 17) % 5) * .1;
  mesh(G.cyl, trunk, x, .6 * sc, z, .14 * sc, 1.2 * sc, .14 * sc); mesh(G.sph, leaf[i % 3], x, 1.7 * sc, z, .95 * sc, 1.05 * sc, .95 * sc);
 }
 for (const s of [-1, 1]) for (const z of [-1.2, 1.2]) { mesh(G.cyl, M('#f6f3ea', .5), s * 9.3, 1.1, z, .05, 2.2, .05); mesh(G.box, s < 0 ? TM.r : TM.b, s * 9.3, 1.9, z + .45, .03, .55, .9); }
 const fenceM = M('#f2e4c9', .7);
 for (let i = -12; i <= 12; i++) mesh(G.box, fenceM, i, .4, -4.2, .08, .8, .08);
 for (const y of [.3, .6]) mesh(G.box, fenceM, 0, y, -4.2, 24.2, .07, .05);
 for (const s of [-1, 1]) for (let i = 0; i < 3; i++) {
  const x = s * (4 + i * 2.4);
  mesh(G.cyl, M('#f6f3ea', .5), x, 1.3, -4.6, .05, 2.6, .05);
  mesh(G.box, i % 2 ? (s < 0 ? TM.rD : TM.bD) : (s < 0 ? TM.r : TM.b), x + s * .45, 2.2, -4.6, .9, .55, .03);
 }

 // rope + ribbon
 const ropeTex = canvasTex(64, 16, (c, w, h) => { c.fillStyle = '#d8b07a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#a97a45'; c.lineWidth = 4; for (let x = -16; x < w + 16; x += 10) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 8, h); c.stroke(); } }, [60, 1]);
 const rope = new T3.Group(); scene.add(rope);
 const ropeY = .86;
 const ropeMesh = mesh(new T3.CylinderGeometry(.045, .045, 24, 10), new T3.MeshStandardMaterial({ map: ropeTex, roughness: .9 }), 0, ropeY, 0, 1, 1, 1, rope);
 ropeMesh.rotation.z = Math.PI / 2;
 const ribbon = new T3.Group(); ribbon.position.y = ropeY; rope.add(ribbon);
 mesh(G.sph, M('#ffc93c', .5), 0, 0, 0, .12, .12, .12, ribbon);
 const ribFlag = mesh(G.box, M('#ffc93c', .55), 0, -.32, 0, .08, .56, .3, ribbon);

 /* ---------- characters ---------- */
 const LOOK = {
  skin: ['#f2c7a5', '#e8b48f', '#d9a07a', '#b97a55', '#7a4a32', '#f6d2b8', '#c68b63'],
  hair: ['short', 'spiky', 'pony', 'buns', 'cap', 'bald', 'short', 'afro'],
  hairC: ['#2a1a12', '#4a2e1f', '#8a4b22', '#1e1410', '#c98b4e', '#3b2316', '#e0c070']
 };
 const pick = (arr, h, sh) => arr[(h >>> sh) % arr.length];
 const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
 function makeChar(team, seed, strong) {
  const h = hash(seed), R = .3;
  const skinC = pick(LOOK.skin, h, 0), skin = M(skinC, .55), shirt = M(strong ? TC[team + 'D'] : TC[team], .7), shorts = M('#2b2b36', .7);
  const root = new T3.Group(), hips = new T3.Group(); hips.position.y = .78; root.add(hips);
  const body = new T3.Group(); hips.add(body);
  const torso = mesh(G.sph, shirt, 0, .3, 0, strong ? .3 : .23, .34, strong ? .22 : .18, body);
  mesh(G.sph, shorts, 0, 0, 0, .21, .13, .17, body);
  mesh(G.box, MB('#ffffff'), 0, .36, .175, .09, .12, .01, body, false); // shirt number patch
  if (strong) mesh(G.cyl, M('#ffc93c', .3, { metalness: .5 }), 0, .1, 0, .25, .07, .2, body);
  const neck = new T3.Group(); neck.position.y = .62; body.add(neck);
  const head = new T3.Group(); head.position.y = R * .95; neck.add(head);
  mesh(G.sph, skin, 0, 0, 0, R, R * .96, R * .95, head);
  // face
  const ink = MB('#1b1b2a'), white = M('#ffffff', .3);
  const pupils = [], brows = [];
  for (const s of [-1, 1]) {
   const eye = new T3.Group(); eye.position.set(s * .37 * R, .05 * R, .86 * R); head.add(eye);
   mesh(G.sph, white, 0, 0, 0, .24 * R, .3 * R, .14 * R, eye, false);
   const p = mesh(G.sph, ink, 0, -.02 * R, .08 * R, .16 * R, .2 * R, .1 * R, eye, false); pupils.push(p);
   const br = mesh(capG(.012, .06), ink, s * .37 * R, .45 * R, .87 * R, 1, 1, 1, head, false); br.rotation.z = Math.PI / 2; brows.push(br);
   mesh(G.sphLo, M('#ff8a80', .7), s * .62 * R, -.25 * R, .74 * R, .13 * R, .08 * R, .05 * R, head, false);
  }
  const mouths = {
   grit: mesh(G.box, MB('#ffffff'), 0, -.36 * R, .9 * R, .3 * R, .1 * R, .04 * R, head, false),
   open: mesh(G.sph, M('#5a1f2b', .6), 0, -.38 * R, .88 * R, .12 * R, .15 * R, .06 * R, head, false),
   smile: mesh(G.half, ink, 0, -.3 * R, .9 * R, .17 * R, .17 * R, .12 * R, head, false),
   frown: mesh(G.half, ink, 0, -.45 * R, .9 * R, .14 * R, .14 * R, .1 * R, head, false)
  };
  mouths.smile.rotation.z = Math.PI;
  // hair / headband in team colour so teams read at a glance
  const style = pick(LOOK.hair, h, 5), hm = M(pick(LOOK.hairC, h, 9), .55);
  if (style !== 'bald') { const cap = mesh(new T3.SphereGeometry(1, 22, 12, 0, TAU, 0, 1.6), style === 'cap' ? M(TC[team], .6) : hm, 0, .03 * R, -.03 * R, R * 1.07, R * 1.07, R * 1.07, head); cap.rotation.x = -.6; }
  if (style === 'spiky') for (let i = 0; i < 5; i++) { const c = mesh(G.cone, hm, (i - 2) * .12 * R, .95 * R, -.15 * R, .14 * R, .35 * R, .14 * R, head); c.rotation.z = (i - 2) * -.25; }
  if (style === 'pony') mesh(G.sph, hm, 0, .1 * R, -1.05 * R, .28 * R, .6 * R, .28 * R, head);
  if (style === 'buns') for (const s of [-1, 1]) mesh(G.sph, hm, s * .62 * R, .78 * R, -.1 * R, .32 * R, .32 * R, .32 * R, head);
  if (style === 'afro') mesh(G.sph, hm, 0, .25 * R, -.12 * R, R * 1.25, R * 1.1, R * 1.2, head);
  if (style === 'cap') mesh(G.cyl, M(TC[team], .6), 0, .35 * R, .95 * R, .5 * R, .05 * R, .45 * R, head);
  if (style !== 'cap') { const band = mesh(G.torus, M(TC[team], .5), 0, .38 * R, 0, R * 1.03, R * 1.03, R * 1.03, head); band.rotation.x = Math.PI / 2 - .25; }
  // arms
  const arms = [];
  for (const s of [-1, 1]) {
   const sh = new T3.Group(); sh.position.set(s * (strong ? .28 : .22), .5, 0); body.add(sh);
   mesh(capG(strong ? .085 : .062, .18), strong ? skin : shirt, 0, -.14, 0, 1, 1, 1, sh);
   const elb = new T3.Group(); elb.position.y = -.28; sh.add(elb);
   mesh(capG(strong ? .075 : .055, .16), skin, 0, -.12, 0, 1, 1, 1, elb);
   mesh(G.sph, skin, 0, -.27, 0, .07, .07, .07, elb);
   arms.push({ sh, elb });
  }
  // legs (children of hips so the body can lean back on its own)
  const legs = [];
  for (const s of [-1, 1]) {
   const hp = new T3.Group(); hp.position.set(s * .1, 0, 0); hips.add(hp);
   mesh(capG(.08, .2), skin, 0, -.17, 0, 1, 1, 1, hp);
   const kn = new T3.Group(); kn.position.y = -.38; hp.add(kn);
   mesh(capG(.068, .18), M(TC[team], .7), 0, -.14, 0, 1, 1, 1, kn);
   mesh(G.sph, M('#f6f3ea', .5), 0, -.33, .05, .08, .06, .13, kn);
   legs.push({ hp, kn });
  }
  const c = { root, hips, body, head, neck, torso, arms, legs, pupils, brows, mouths, team, strong, ph: (h % 1000) / 1000 * TAU, face: '', fall: 0, blobs: [] };
  setFace(c, 'grit');
  if (strong) root.scale.setScalar(1.32);
  root.rotation.y = team === 'r' ? Math.PI / 2 - .45 : -Math.PI / 2 + .45; // turned a little toward the camera so faces read
  scene.add(root);
  return c;
 }
 function setFace(c, f) {
  if (c.face === f) return; c.face = f;
  for (const k in c.mouths) c.mouths[k].visible = k === f;
  const tilt = f === 'grit' ? -.35 : f === 'frown' ? .35 : 0;
  c.brows.forEach((b, i) => b.rotation.z = Math.PI / 2 + (i ? -tilt : tilt));
 }
 function disposeChar(c) {
  scene.remove(c.root);
  if (c.tag) c.tag.remove();
 }

 /* ---------- slots: six pullers per team, filled by viewers (LIVE) or teammates ---------- */
 const slots = { r: [], b: [] };
 function setSlot(team, i, who) {
  // who: { key, name, strong, extra }, null for a plain teammate, false for an empty place in the line
  const s = slots[team][i] || (slots[team][i] = { key: null, c: null });
  if (who === false) { if (s.c) disposeChar(s.c); s.c = null; s.key = 'empty'; s.who = null; return; }
  const key = who ? who.key + (who.strong ? '*' : '') : 'npc' + team + i;
  if (s.key === key && s.c) { if (who && s.c.tag) s.c.tag.textContent = tagText(who); return; }
  if (s.c) disposeChar(s.c);
  s.key = key; s.who = who;
  s.c = makeChar(team, who ? who.key : 'npc' + team + i + (live ? '' : 'x'), !!(who && who.strong));
  if (who) { s.c.tag = el('div', 'rr-np ' + (who.strong ? 'big' : team)); s.c.tag.textContent = tagText(who); labels.appendChild(s.c.tag); }
  placeSlot(team, i, 0);
 }
 const tagText = w => (w.you ? w.name : '@' + w.name) + (w.extra ? ' +' + w.extra : '');
 const slotX = (team, i) => { let d = FRONT; for (let k = 1; k <= i; k++) d += SP + (slots[team][k - 1] && slots[team][k - 1].c && slots[team][k - 1].c.strong ? .2 : 0); return (team === 'r' ? -1 : 1) * d + st.pos; };

 /* ---------- camera fit for any screen shape ---------- */
 // landscape: classic side view. portrait (phones, 9:16 streams): long lens from behind the red end,
 // so the rope runs up the screen and the players are about twice as big
 const camSide = new T3.Vector3(0, .46, 1).normalize(), camEnd = new T3.Vector3(-Math.cos(.62) * Math.cos(.3), Math.sin(.62), Math.cos(.62) * Math.sin(.3)).normalize();
 let camDir = camSide; const camT = new T3.Vector3(0, .75, 0);
 const CORN = [], CORN_P = [];
 for (const x of [-7.4, 7.4]) for (const y of [0, 2.1]) for (const z of [-1.6, 1.6]) CORN.push(new T3.Vector3(x, y, z));
 // portrait shows the action around the mud (front pullers); the back of each line may run off screen
 for (const x of [-5.4, 5.6]) for (const y of [0, 1.9]) for (const z of [-1.2, 1.2]) CORN_P.push(new T3.Vector3(x, y, z));
 const tmp = new T3.Vector3();
 function fitCam() {
  const W = host.clientWidth || 1, H = host.clientHeight || 1;
  camera.aspect = W / H; camera.clearViewOffset();
  const portrait = W / H < .85;
  camDir = portrait ? camEnd : camSide; camera.fov = portrait ? 8.5 : 30;
  // NDC box the field must fit in (room for scoreboard on top and buttons/legend below)
  const box = live ? (portrait ? [-.95, .95, -.54, .6] : [-.9, .9, -.55, .55]) : (portrait ? [-.95, .95, -.6, .7] : [-.92, .92, -.6, .5]);
  const corners = portrait ? CORN_P : CORN;
  let lo = 4, hi = 160;
  const fits = D => {
   camera.position.copy(camT).addScaledVector(camDir, D); camera.lookAt(camT); camera.updateMatrixWorld(); camera.updateProjectionMatrix();
   let x0 = 9, x1 = -9, y0 = 9, y1 = -9;
   for (const p of corners) { tmp.copy(p).project(camera); x0 = Math.min(x0, tmp.x); x1 = Math.max(x1, tmp.x); y0 = Math.min(y0, tmp.y); y1 = Math.max(y1, tmp.y); }
   return { ok: x1 - x0 <= box[1] - box[0] && y1 - y0 <= box[3] - box[2], cy: (y0 + y1) / 2 };
  };
  for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (fits(m).ok) hi = m; else lo = m; }
  const r = fits(hi);
  scene.fog.near = hi * .9; scene.fog.far = hi * 2.6;
  const want = (box[2] + box[3]) / 2;
  camera.setViewOffset(W, H, 0, (want - r.cy) * H / 2, W, H);
  camera.updateProjectionMatrix();
 }
 function resize() {
  const W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
  renderer.setSize(W, H, false); fitCam();
 }
 new ResizeObserver(resize).observe(host);

 /* ---------- particles: mud splash + confetti ---------- */
 const parts = [];
 const mudBlob = M('#5e3a1f', .3);
 function splash(x, n) {
  for (let i = 0; i < n; i++) {
   const p = mesh(G.sphLo, mudBlob, x, .1, (Math.random() - .5) * 1.4, .05 + Math.random() * .06, null, null, null, false);
   p.userData = { v: new T3.Vector3((Math.random() - .5) * 3, 2.5 + Math.random() * 3, (Math.random() - .5) * 2.5), t: 1.6 };
   parts.push(p);
  }
 }
 function confetti(team) {
  const mats = [M(TC[team], .5), M('#ffc93c', .5), M('#ffffff', .5)];
  for (let i = 0; i < 60; i++) {
   const p = mesh(G.box, mats[i % 3], (team === 'r' ? -1 : 1) * (2 + Math.random() * 4), 3 + Math.random() * 2, (Math.random() - .5) * 3, .08, .02, .12, null, false);
   p.userData = { v: new T3.Vector3((Math.random() - .5) * 2, Math.random() * 2, (Math.random() - .5) * 2), t: 3.5, spin: Math.random() * 8 };
   parts.push(p);
  }
 }
 function updParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
   const p = parts[i], u = p.userData;
   u.t -= dt; u.v.y -= (u.spin ? 2.2 : 9.8) * dt; p.position.addScaledVector(u.v, dt);
   if (u.spin) { p.rotation.x += u.spin * dt; p.rotation.z += u.spin * .7 * dt; }
   if (p.position.y < .02 || u.t <= 0) { scene.remove(p); parts.splice(i, 1); }
  }
 }

 /* ---------- audio ---------- */
 let AC = null, muted = store.get('mute', false);
 function beep(type) {
  if (muted) return;
  try {
   AC = AC || new (global.AudioContext || global.webkitAudioContext)();
   const P = { pop: [880, 1320, .08, 'sine', .06], tick: [700, 700, .06, 'square', .04], go: [1180, 1580, .35, 'square', .05], heave: [180, 120, .1, 'triangle', .05], win: [660, 1320, .6, 'triangle', .07], splash: [240, 60, .4, 'sawtooth', .05], gift: [990, 1480, .25, 'sine', .07] }[type] || [600, 600, .1, 'sine', .05];
   const t0 = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
   o.type = P[3]; o.frequency.setValueAtTime(P[0], t0); o.frequency.exponentialRampToValueAtTime(P[1], t0 + P[2]);
   g.gain.setValueAtTime(P[4], t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + P[2] + .05);
   o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + P[2] + .08);
  } catch (e) { }
 }

 /* ---------- HUD ---------- */
 const score = el('div', 'rr-score', `<div class="t r"><span></span><em></em></div><div class="c"><span></span><b></b></div><div class="t b"><em></em><span></span></div>`);
 const pow = el('div', 'rr-pow', '<div class="r"></div><div class="b"></div>');
 const big = el('div', 'rr-big off', '');
 const ban = el('div', 'rr-ban off', '<b></b>');
 [score, pow, big, ban].forEach(e => ui.appendChild(e));
 const ov = el('div', 'rr-ov'); ui.appendChild(ov);
 let banT = 0, bigT = 0;
 function banner(txt, cls, dur) { ban.querySelector('b').textContent = txt; ban.className = 'rr-ban ' + (cls || ''); banT = dur || 3; }
 function bigText(txt, sub, dur) { big.innerHTML = esc(txt) + (sub ? `<small>${esc(sub)}</small>` : ''); big.className = 'rr-big'; bigT = dur || 1; }
 function renderScore() {
  const cnt = t => `<i class="on" style="width:auto;height:auto;padding:1px 7px;border-radius:9px;font:800 12px system-ui,sans-serif;color:${TC[t + 'T']};font-style:normal">👤 ${aliveCount(t)}</i>`;
  score.querySelector('.t.r span').textContent = live ? TN('r') : L.you;
  score.querySelector('.t.b span').textContent = live ? TN('b') : L.cpu;
  score.querySelector('.t.r em').innerHTML = cnt('r'); score.querySelector('.t.b em').innerHTML = cnt('b');
  score.querySelector('.c span').textContent = live && st.regT > 0 && st.phase !== 'match' ? fmt(LVR.regOpen, { s: Math.ceil(st.regT) }) : st.golden ? '★' : '⏱';
 }
 function renderPow(pr, pb) {
  const tot = pr + pb || 1, a = clamp(pr / tot * 100, 12, 88);
  pow.children[0].style.width = a + '%'; pow.children[1].style.width = (100 - a) + '%';
  pow.children[0].textContent = '💪 ' + Math.round(pr); pow.children[1].textContent = Math.round(pb) + ' 💪';
 }

 /* ---------- match state: last team standing ----------
    Each time the ribbon crosses a line, the losing team's front bodies sink into the mud (gift helpers first).
    A team with nobody left loses; when time runs out the team that sank more wins (tie: golden pull). */
 const st = { phase: 'idle', t: 0, matchT: 0, regT: 0, pos: 0, vel: 0, eff: { r: 0, b: 0 }, gift: { r: 0, b: 0 }, sunk: { r: 0, b: 0 }, alive: { r: 6, b: 6 }, golden: false, level: store.get('level', 1), you: 0, cpuT: 0, surge: 0, winner: null, mudList: [] };
 const matchLen = () => live ? CFG.matchSec : 120;
 function aliveCount(t) { return live ? (LS.members[t].size + st.gift[t]) : st.alive[t]; }
 function teamPower(t) {
  if (live) return LS.members[t].size + st.gift[t] + st.eff[t];
  return st.alive[t] + st.eff[t];
 }
 function recenter() {
  st.pos = 0; st.vel = 0; st.eff.r = st.eff.b = 0;
  if (live) refreshSlots(true); else fillCpuTeams();
  for (const t of ['r', 'b']) slots[t].forEach((s, i) => { if (s.c) { s.c.fall = 0; clearBlobs(s.c); } placeSlot(t, i, 0); });
  renderScore();
 }
 function startCount() { st.phase = 'count'; st.t = 3.2; }
 function newMatch() {
  st.sunk.r = st.sunk.b = 0; st.alive.r = st.alive.b = 6; st.gift.r = st.gift.b = 0; st.golden = false; st.winner = null; st.matchT = matchLen();
  clearMud();
  if (live) {
   // players who were active in the last few minutes stay in their team; late comers from the queue join
   const now = performance.now();
   LS.members.r.clear(); LS.members.b.clear();
   LS.users.forEach(u => {
    u.coins = 0; u.comments = 0; u.roundPeople = 0; u.out = false;
    const want = u.queued || (now - u.lastActive < 300000 ? u.team : null);
    u.team = null; u.queued = null;
    if (want) { u.team = want; LS.members[want].add(u.id); }
   });
   st.regT = CFG.regSec;
   banner(LVR.newMatch, 'gold', 4);
   recenter(); st.phase = LS.members.r.size && LS.members.b.size ? 'count' : 'wait'; st.t = 3.2;
  } else { recenter(); startCount(); }
  renderScore();
 }
 // the losing team loses bodies: 1 in normal mode, about one in eight of the team in LIVE so big streams still finish
 function losePull(lose) {
  const win = lose === 'r' ? 'b' : 'r';
  st.phase = 'sink'; st.t = 1.9; st.winner = null;
  let k = live ? Math.max(1, Math.ceil(aliveCount(lose) / 8)) : 1;
  st.sunk[lose] += k;
  const names = [];
  if (live) {
   // helpers from gifts go first (biggest gifter's helpers first)
   let shield = Math.min(k, st.gift[lose]); k -= shield; st.gift[lose] -= shield;
   const shieldN = shield;
   while (shield > 0) {
    const g = [...LS.users.values()].filter(u => u.team === lose && u.roundPeople > 0).sort((a, b) => b.roundPeople - a.roundPeople)[0];
    if (!g) break; const d = Math.min(shield, g.roundPeople); g.roundPeople -= d; shield -= d;
   }
   // then real players, front of the line first
   const front = slots[lose].map(s2 => s2 && s2.who && s2.who.key).filter(id => id && LS.members[lose].has(id));
   const rest = [...LS.members[lose]].filter(id => !front.includes(id)).sort((a, b) => LS.users.get(b).lastActive - LS.users.get(a).lastActive);
   for (const id of front.concat(rest)) {
    if (k <= 0) break;
    const u = LS.users.get(id); LS.members[lose].delete(id); u.out = true; k--; names.push(u.name);
   }
   if (names.length) banner(fmt(L.sunk, { who: names.slice(0, 2).map(n => '@' + n).join(', ') + (names.length > 2 ? ' ' + fmt(L.more, { n: names.length - 2 }) : '') }), lose, 3);
   else banner(fmt(L.shieldSunk, { n: shieldN, t: TN(lose) }), lose, 3);
   st.mudList = names.concat(st.mudList).slice(0, 6); renderMudList();
  } else { st.alive[lose] = Math.max(0, st.alive[lose] - 1); bigText(lose === 'b' ? L.cpuSunk : L.youSunk, '', 1.6); }
  // the front pullers fall into the mud
  const n = Math.min(3, live ? Math.max(1, st.sunk[lose] ? Math.min(3, names.length || 1) : 1) : 1);
  slots[lose].filter(s2 => s2 && s2.c).slice(0, n).forEach((s2, i) => { s2.c.fall = .001 + i * .2; });
  setTimeout(() => { splash(0, 22); beep('splash'); }, 400);
  for (let i = 0; i < n; i++) addMudHead(lose, names[i]);
  beep('win'); renderScore();
  if (aliveCount(lose) <= 0) st.endAfterSink = win;
  else if (st.golden) st.endAfterSink = win;
 }
 function timeUp() {
  if (st.sunk.r === st.sunk.b) { st.golden = true; bigText(L.golden, L.goldenSub, 2.4); beep('go'); renderScore(); return; }
  bigText(L.timeUp, '', 1.4);
  endMatch(st.sunk.b > st.sunk.r ? 'r' : 'b');
 }
 function endMatch(w) {
  st.phase = 'match'; st.t = live ? 10 : 1e9; st.winner = w; st.endAfterSink = null;
  confetti(w);
  if (live) {
   const us = [...LS.users.values()];
   const mvp = us.filter(u => u.coins > 0).sort((a, b) => b.coins - a.coins)[0], act = us.filter(u => u.comments > 0).sort((a, b) => b.comments - a.comments)[0];
   bigText(fmt(L.matchWin, { t: TN(w) }), [mvp ? `👑 ${LVR.mvpH}: @${mvp.name}` : '', act ? `💬 ${LVR.actH}: @${act.name}` : ''].filter(Boolean).join('  ·  '), 9.5);
  } else {
   const won = w === 'r';
   if (won) { st.level++; store.set('level', st.level); store.set('best', Math.max(store.get('best', 1), st.level)); }
   setTimeout(() => showOv(`<h2>${esc(won ? L.youWin : L.youLose)}</h2><small>${esc(fmt(L.level, { n: st.level }))}</small><div class="row"><button class="rr-btn" data-a="play">${esc(won ? L.next : L.retry)}</button><button class="rr-btn g" data-a="menu">${esc(L.menu)}</button></div>`), 2300);
  }
  renderScore();
 }
 /* heads of the sunk players stay in the mud (funny, and shows the score) */
 const mudHeads = [];
 function addMudHead(team, name) {
  const g = new T3.Group(), h = hash((name || team) + mudHeads.length);
  mesh(G.sph, M(pick(LOOK.skin, h, 0), .55), 0, 0, 0, .2, .19, .19, g);
  mesh(new T3.SphereGeometry(1, 16, 10, 0, TAU, 0, 1.5), M(TC[team], .6), 0, .03, -.01, .21, .21, .21, g);
  for (const sx of [-1, 1]) { mesh(G.sph, M('#ffffff', .3), sx * .07, .02, .17, .045, .055, .03, g, false); mesh(G.sph, MB('#1b1b2a'), sx * .07, .01, .19, .025, .03, .02, g, false); }
  mesh(G.sph, M('#5a1f2b', .6), 0, -.08, .17, .035, .045, .02, g, false);
  const a = (mudHeads.length * 2.399) % TAU, r = .35 + (mudHeads.length % 4) * .22;
  g.position.set(Math.cos(a) * r * MUD * .8, -.3, Math.sin(a) * r * 1.6);
  g.userData = { y: .02 + (h % 5) * .01, ph: h % 7, t: 0 };
  scene.add(g); mudHeads.push(g);
  if (mudHeads.length > 14) scene.remove(mudHeads.shift());
 }
 function updMud(dt) { mudHeads.forEach(g => { const u = g.userData; u.t += dt; g.position.y = lerp(g.position.y, u.y + Math.sin(u.t * 2 + u.ph) * .02, clamp(dt * 2, 0, 1)); g.rotation.z = Math.sin(u.t * 1.3 + u.ph) * .15; }); }
 function clearMud() { mudHeads.splice(0).forEach(g => scene.remove(g)); st.mudList = []; renderMudList(); }
 const mudBox = el('div', 'rr-mud'); ui.appendChild(mudBox);
 function renderMudList() { mudBox.innerHTML = live && st.mudList.length ? `<b>💦 ${esc(L.mud)}</b> ${st.mudList.map(n => '@' + esc(n)).join(' ')}` : ''; mudBox.style.display = mudBox.innerHTML ? '' : 'none'; }

 /* ---------- placing and animating the pullers ---------- */
 function clearBlobs(c) { c.blobs.forEach(b => b.parent && b.parent.remove(b)); c.blobs = []; }
 function placeSlot(t, i, dt) {
  const s = slots[t][i]; if (!s || !s.c) return;
  const c = s.c, sg = t === 'r' ? -1 : 1;
  let x = slotX(t, i);
  const pulling = st.phase === 'pull' || st.phase === 'count' || st.phase === 'sink';
  const towardMe = -sg * st.vel; // >0 when my team gains
  if (c.fall > 0) {
   c.fall = Math.min(1, c.fall + dt * .9);
   const f = c.fall, fe = f * f * (3 - 2 * f);
   x = lerp(x, sg * (.3 + i * .55), fe);
   c.root.position.set(x, lerp(0, -.18, fe), i ? -.35 : .2);
   c.body.rotation.x = lerp(-.4, 1.35, fe); c.hips.rotation.x = lerp(0, .9, fe);
   setFace(c, 'open');
   if (f > .55 && !c.blobs.length) for (let k = 0; k < 4; k++) c.blobs.push(mesh(G.sphLo, mudBlob, (k - 1.5) * .12, .2 + k * .1, .17, .07, .05, .03, c.body, false));
   return;
  }
  const inMud = Math.abs(x) < MUD + .05 ? 1 : 0;
  c.root.position.set(x, -.16 * inMud, i % 2 ? .2 : -.2);
  const effort = clamp(teamPower(t) > 0 ? .6 + .4 * Math.min(1, st.eff[t] / 6) : .2, 0, 1);
  c.ph += dt * (5 + 6 * effort);
  const heave = Math.sin(c.ph) * .06 * effort;
  const lean = pulling ? .45 + heave + clamp(towardMe, -.3, .3) * .4 : st.phase === 'match' && st.winner !== t ? .1 : .05;
  c.body.rotation.x = -lean;
  c.hips.rotation.x = 0;
  // arms reach forward to the rope
  const armA = pulling ? -1.25 + lean * .85 : -.1;
  const zs = (i % 2 ? 1 : -1) * (t === 'r' ? 1 : -1); // reach across toward the rope
  c.arms.forEach((a, k) => { a.sh.rotation.x = armA; a.sh.rotation.z = (k ? -1 : 1) * .12 + zs * .28; a.elb.rotation.x = pulling ? -.25 : -.1; });
  // legs: braced forward, stepping when the rope moves
  const step = Math.sin(c.ph * .5 + i) * clamp(Math.abs(st.vel) * 4, 0, .35);
  c.legs.forEach((l, k) => { l.hp.rotation.x = (pulling ? -.45 : 0) + (k ? step : -step); l.kn.rotation.x = pulling ? .55 : 0; });
  c.hips.position.y = pulling ? .7 : .78;
  // face
  const win = st.phase === 'match' ? st.winner === t : towardMe > .05;
  setFace(c, st.phase === 'match' ? (win ? 'smile' : 'frown') : towardMe < -.12 ? 'open' : win && st.phase === 'pull' ? 'smile' : 'grit');
  // celebrate
  if (st.phase === 'match' && st.winner === t) { c.root.position.y = Math.abs(Math.sin(c.ph * .8)) * .18; c.arms.forEach(a => a.sh.rotation.x = -2.6 + Math.sin(c.ph) * .2); c.body.rotation.x = .05; }
 }
 const pv = new T3.Vector3();
 function placeTags() {
  const W = host.clientWidth, H = host.clientHeight;
  for (const t of ['r', 'b']) slots[t].forEach(s => {
   const c = s && s.c; if (!c || !c.tag) return;
   c.head.getWorldPosition(pv); pv.y += c.strong ? .62 : .48; pv.project(camera);
   c.tag.style.left = ((pv.x * .5 + .5) * W) + 'px'; c.tag.style.top = ((-pv.y * .5 + .5) * H) + 'px';
  });
 }

 /* ---------- physics: the ribbon moves by the difference in power (no randomness) ---------- */
 function physics(dt) {
  const pr = teamPower('r'), pb = teamPower('b');
  const K = live ? 1.15 : 1.8;
  const target = st.phase === 'pull' ? K * (pb - pr) / (pr + pb + 6) : 0;
  st.vel = lerp(st.vel, target, clamp(dt * 3, 0, 1));
  if (st.phase === 'pull') st.pos = clamp(st.pos + st.vel * dt, -LINE - .05, LINE + .05);
  // effort decays (comments, likes and taps are short bursts)
  const k = Math.exp(-dt / (live ? 2.2 : .6));
  st.eff.r *= k; st.eff.b *= k;
  renderPow(pr, pb);
  rope.position.x = st.pos;
  ribFlag.rotation.x = Math.sin(performance.now() / 180) * .15;
 }

 function step(dt) {
  st.t -= dt;
  if (banT > 0 && (banT -= dt) <= 0) ban.className = 'rr-ban off';
  if (bigT > 0 && (bigT -= dt) <= 0) big.className = 'rr-big off';
  const timeEl = score.querySelector('.c b');
  if (live && st.regT > 0 && (st.phase === 'count' || st.phase === 'pull' || st.phase === 'sink')) { const b0 = Math.ceil(st.regT); st.regT -= dt; if (Math.ceil(st.regT) !== b0) renderScore(); }
  if (st.phase === 'wait') {
   timeEl.textContent = fmtT(st.matchT);
   if (LS.members.r.size && LS.members.b.size) startCount();
  } else if (st.phase === 'count') {
   const n = Math.ceil(st.t - .2);
   if (n !== st.lastN) { st.lastN = n; if (n > 0) { bigText(n > 2 ? L.ready : String(n), '', .8); beep('tick'); } }
   timeEl.textContent = fmtT(st.matchT);
   if (st.t <= .2) { st.phase = 'pull'; st.lastN = null; bigText(L.go, '', .9); beep('go'); }
  } else if (st.phase === 'pull') {
   if (!st.golden) { st.matchT -= dt; if (st.matchT <= 0) { st.matchT = 0; timeUp(); } }
   timeEl.textContent = st.golden ? '★' : fmtT(Math.max(0, st.matchT));
   if (!live) cpuStep(dt);
   if (st.phase === 'pull') { if (st.pos <= -LINE) losePull('b'); else if (st.pos >= LINE) losePull('r'); }
  } else if (st.phase === 'sink') {
   if (st.t <= 0) {
    if (st.endAfterSink) endMatch(st.endAfterSink);
    else { recenter(); st.phase = live && !(LS.members.r.size + st.gift.r && LS.members.b.size + st.gift.b) ? 'wait' : 'pull'; if (st.phase === 'pull') { bigText(L.go, '', .7); beep('go'); } }
   }
  } else if (st.phase === 'match') {
   if (st.t <= 0) newMatch();
  }
  physics(dt);
  for (const t of ['r', 'b']) slots[t].forEach((s2, i) => placeSlot(t, i, dt));
  updParts(dt); updMud(dt);
  if (live) liveStep(dt);
 }
 const fmtT = s => { s = Math.ceil(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

 /* ---------- CPU opponent (normal mode only) ---------- */
 function cpuStep(dt) {
  const lv = st.level, rate = Math.min(11, 4.2 + (lv - 1) * .55) * (1 + .25 * Math.sin(st.matchT) + (st.surge > 0 ? .35 : 0));
  st.cpuT -= dt;
  if (st.cpuT <= 0) { st.cpuT += 1 / rate; st.eff.b += 1.4; }
  st.surge -= dt; if (st.surge < -9) st.surge = 2.5;
 }
 let tapTimes = [];
 function tap() {
  if (live || st.phase !== 'pull') return;
  const now = performance.now(); tapTimes = tapTimes.filter(x => now - x < 1000);
  if (tapTimes.length >= 12) return; // ignore auto-clickers
  tapTimes.push(now); st.eff.r += 1.4; beep('heave');
 }

 /* ---------- normal mode screens ---------- */
 let paused = false;
 function showOv(html) { ov.innerHTML = html; ov.hidden = false; }
 function menu() {
  st.phase = 'idle'; st.alive.r = st.alive.b = 6; clearMud(); recenter();
  const liveHref = location.pathname + '?live=1';
  showOv(`<h2>${esc(L.name)}<span>${esc(L.sub)}</span></h2><p>${esc(L.intro)}</p><small>${esc(fmt(L.level, { n: st.level }))}</small>
<div class="row"><button class="rr-btn" data-a="play">${esc(L.play)}</button><a class="rr-btn g" href="${liveHref}">${esc(L.liveBtn)}</a></div>
<div class="row"><button class="rr-btn g" data-a="snd" style="font-size:14px;padding:8px 14px">${esc(muted ? L.soundOff : L.soundOn)}</button></div>`);
 }
 ov.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'play') { ov.hidden = true; paused = false; newMatch(); renderer.domElement.focus(); }
  else if (a === 'menu') menu();
  else if (a === 'resume') { ov.hidden = true; paused = false; }
  else if (a === 'snd') { muted = !muted; store.set('mute', muted); b.textContent = muted ? L.soundOff : L.soundOn; if (!muted) beep('pop'); }
 });
 if (!live) {
  const pullBtn = el('button', 'rr-btn rr-pull', esc(L.pull));
  const hint = el('div', 'rr-hint', esc(touch ? '' : L.tapD));
  if (touch) ui.appendChild(pullBtn); else ui.appendChild(hint);
  const pauseBtn = el('button', 'rr-btn g rr-icon', '❚❚'); pauseBtn.setAttribute('aria-label', L.paused); ui.appendChild(pauseBtn);
  if (touch) pauseBtn.style.cssText = 'top:104px;bottom:auto';
  pauseBtn.addEventListener('click', () => { if (st.phase === 'idle' || st.phase === 'match') return; paused = true; showOv(`<h2>${esc(L.paused)}</h2><div class="row"><button class="rr-btn" data-a="resume">${esc(L.resume)}</button><button class="rr-btn g" data-a="menu">${esc(L.menu)}</button></div>`); });
  pullBtn.addEventListener('pointerdown', e => { e.preventDefault(); tap(); });
  renderer.domElement.addEventListener('pointerdown', () => { if (!touch) tap(); });
  host.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); if (!e.repeat) tap(); } });
  renderer.domElement.addEventListener('keydown', e => { if (e.code === 'Space') e.preventDefault(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && st.phase !== 'idle' && st.phase !== 'match' && !paused) pauseBtn.click(); });
  st.showHint = v => { hint.style.opacity = v ? 1 : 0; pullBtn.style.opacity = v ? 1 : .35; };
 }
 // the "YOU" captain in normal mode
 function fillCpuTeams() {
  for (const t of ['r', 'b']) for (let i = 0; i < SLOTS; i++) setSlot(t, i, live ? null : i >= st.alive[t] ? false : t === 'r' && i === 0 ? { key: 'you', name: L.you, you: true } : null);
 }

 /* ======================= LIVE MODE ======================= */
 const LV = Object.assign({}, SRC_TXT.en, SRC_TXT[lang]);
 const LVR = Object.assign({}, LIVE_RR.en, LIVE_RR[lang]);
 Object.assign(LV, LVR);
 const SAVED = clean ? {} : store.get('livesrc', {});
 const SRC = { kind: 'sim', on: false, ws: null, st: 'off', msg: '', retry: 0, t: null, n: 0, gen: 0,
  opt: { port: Math.round(+QS.get('port')) || 21213, ch: QS.get('ch') || SAVED.ch || '', yk: QS.get('yk') || SAVED.yk || '', yv: QS.get('yv') || SAVED.yv || '', ss: QS.get('ss') || SAVED.ss || '' } };
 const srcWant = QS.get('src') || SAVED.kind || '';
 const demoMode = QS.get('demo') === '1' && !srcWant;
 const LS = { users: new Map(), members: { r: new Set(), b: new Set() }, seen: new Set(), seenQ: [], log: [], autoT: 0, auto: demoMode, n: 0, last: null, slotT: 0 };
 const BAD_WORDS = ['fuck', 'shit', 'bitch', 'dick', 'cunt', 'nigg', 'fag', 'whore', 'slut', 'amk', 'aq', 'orospu', 'sik', 'piç', 'pic', 'yarrak', 'göt', 'got', 'ibne', 'puta', 'mierda', 'pendej', 'caralho', 'porra', 'anjing', 'bangsat', 'kontol', 'memek'];
 const blockList = () => String(CFG.block || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
 function cleanText(t, max) {
  t = String(t || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[<>]/g, '').trim().slice(0, max || 46);
  for (const w of BAD_WORDS.concat(blockList())) if (w) t = t.replace(new RegExp('(^|[^\\p{L}])(' + [...w].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '+').join('') + ')(?=$|[^\\p{L}])', 'giu'), (m, a, b) => a + '*'.repeat(b.length));
  return t;
 }
 const cleanName = n => { const c = cleanText(String(n || '').replace(/^@/, ''), 18); return c.includes('*') ? 'viewer' : c || 'viewer'; };
 const isCoins = () => SRC.kind === 'sim' || SRC.kind === 'tikfinity';

 // which team does a comment ask for?
 const norm = x => String(x || '').toLocaleLowerCase('tr').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').toLowerCase();
 function keyList(k) {
  // default teams: colour words in every language; renamed teams: the words of the name + the streamer's extra words
  const name = tname(k), extra = String((k === 'r' ? CFG.kR : CFG.kB) || '').split(',').map(x => norm(x).trim()).filter(Boolean);
  const base = name ? norm(name).split(/[^a-z0-9]+/).filter(w => w.length >= 3) : WORDS[k].map(norm);
  return base.concat(extra);
 }
 function teamWord(text) {
  const t = norm(text);
  const raw = String(text || '');
  const words = t.split(/[^a-z0-9]+/).filter(Boolean), flat = ' ' + words.join(' ') + ' ';
  const has = k => keyList(k).some(w => /[^a-z0-9]/.test(w) ? flat.includes(' ' + w.split(/[^a-z0-9]+/).filter(Boolean).join(' ') + ' ') : words.includes(w)) || (!tname(k) && EMO[k].some(e => raw.includes(e)));
  const r = has('r') || words[0] === '1' && words.length === 1, b = has('b') || words[0] === '2' && words.length === 1;
  return r && !b ? 'r' : b && !r ? 'b' : null;
 }
 function joinTeam(u, want) {
  // sunk players stay with their team (they cheer from the mud); after the joining time new players wait for the next match
  if (u.out) return u.team;
  if (u.team && (!want || want === u.team)) return u.team;
  if (st.regT <= 0 && st.phase !== 'wait' && st.phase !== 'match') {
   if (!u.queued) { u.queued = want || 'r'; if (want) banner('@' + u.name + ' · ' + LVR.regClosed, 'gold', 2.5); }
   else if (want) u.queued = want;
   return u.team;
  }
  const t = want || (LS.members.r.size <= LS.members.b.size ? (LS.members.r.size < LS.members.b.size ? 'r' : (hash(u.id) & 1 ? 'r' : 'b')) : 'b');
  if (u.team) LS.members[u.team].delete(u.id);
  u.team = t; LS.members[t].add(u.id); u.lastActive = performance.now();
  beep('pop'); LS.slotT = 0;
  return t;
 }

 /* --- overlay --- */
 let lv = null;
 function liveUI() {
  css.textContent += `
.rr-stage{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}
.lv-top{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;pointer-events:none}
.lv-pill{font:800 12px system-ui,sans-serif;letter-spacing:1px;padding:4px 10px;border-radius:999px;background:#ff6b5b;color:#1e2235}
.lv-name{font-weight:800;font-size:15px;padding:2px 12px;border-radius:999px;background:rgba(255,247,232,.94);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lv-mode:empty{display:none}.lv-mode{font:800 11px system-ui,sans-serif;letter-spacing:1px;padding:4px 9px;border-radius:999px;background:#ffc93c;color:#1e2235}
.rr.lv .rr-score{top:44px}.rr.lv .rr-pow{top:104px}.rr.lv .rr-ban{top:138px}
.lv-leg{position:absolute;left:10px;right:10px;bottom:10px;padding:10px;border-radius:16px;background:rgba(17,24,43,.88);color:#fff7e8}
.lv-leg h4{margin:0 0 7px;text-align:center;font:800 12px system-ui,sans-serif;letter-spacing:1px;color:#ffc93c;text-transform:uppercase}
.lv-leg .k{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lv-leg .k div{text-align:center;padding:6px 4px;border-radius:12px;font-weight:800;font-size:24px;line-height:1;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lv-leg .g{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px}
.lv-leg .g div{display:flex;gap:6px;align-items:center;padding:4px 7px;border-radius:10px;background:rgba(255,247,232,.08);font:700 12px/1.2 system-ui,sans-serif}
.lv-leg .g span{flex:none;padding:2px 6px;border-radius:8px;font:800 11px system-ui,sans-serif;color:#1e2235;background:#eef1f8}
.lv-leg .n{margin-top:6px;text-align:center;font:600 10.5px system-ui,sans-serif;color:#9aa6c4}
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
  host.classList.add('lv');
  lv = {};
  lv.top = el('div', 'lv-top', `<span class="lv-pill">LIVE</span><span class="lv-name">${esc(L.name)} · ${esc(L.sub)}</span><span class="lv-mode"></span>`);
  lv.leg = el('div', 'lv-leg');
  ui.appendChild(lv.top); ui.appendChild(lv.leg);
  renderLegend(); modeLabel();
 }
 function modeLabel() {
  if (!lv) return;
  lv.top.querySelector('.lv-mode').textContent = SRC.on ? (SRC.st === 'on' ? '' : SHORT[SRC.kind].toUpperCase() + '…') : LS.auto ? LV.demo : LV.sim;
 }
 function renderLegend() {
  if (!lv) return;
  const c = isCoins() ? String(CFG.cpp) : '$' + (CFG.cpp / 75).toFixed(2);
  lv.leg.innerHTML = `<h4>${esc(LVR.legendH)}</h4><div class="k">${['r', 'b'].map((t, i) => `<div style="background:${TC[t]};color:${TC[t + 'T']}">${tname(t) ? (i + 1) + ' · ' : t === 'r' ? '🔴 ' : '🔵 '}${esc(TN(t))}</div>`).join('')}</div><div class="n" style="margin:4px 0 0">${esc(LVR.orNum)}</div>
<div class="g"><div><span>${esc(LVR.cmtK)}</span>${esc(LVR.cmt)}</div><div><span>${esc(LVR.likeK)}</span>${esc(LVR.likes)}</div>
<div><span>${esc(LVR.giftK)}</span>${esc(LVR.giftE)}</div><div><span>🎁 ${esc(c)}</span>${esc(fmt(isCoins() ? LVR.giftRow : LVR.giftRowUsd, { c }).replace(/^.*?(\+)/, '+'))}</div></div>
<div class="n">⚔️ ${esc(LVR.rule)} ${esc(LVR.shieldN)}</div>`;
 }

 /* --- creator panel --- */
 let pn = null;
 function livePanel() {
  pn = el('aside', 'lv-panel');
  pn.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h3>${esc(LV.panelH)}</h3><a class="lv-btn g" href="${location.pathname}">${esc(LV.back)}</a></div>
<div class="note"></div>
<h5>${esc(LV.source)}</h5><div class="lv-srcs"></div>
<h5>${esc(LV.simH)}</h5>
<div class="lv-sim">
<button data-s="cr" style="background:#ff9a8a"></button><button data-s="cb" style="background:#8cc0ff"></button><button data-s="c" style="background:#eef1f8">${esc(LVR.sAny)}</button>
<button data-s="like" style="background:#ffb3a7">+100 ♥</button><button data-s="g1" style="background:#ff8fb1">🎁 1</button><button data-s="g99" style="background:#ffc93c">🎁 99</button>
<button data-s="g299" style="background:#b39ddb">🎁 299</button><button data-s="g999" style="background:#ff6b5b">🎁 999</button><button data-s="follow" style="background:#c9f2c7">${esc(LV.sFollow)}</button>
</div>
<div class="lv-row"><label><input type="checkbox" data-c="auto"${LS.auto ? ' checked' : ''}> ${esc(LVR.auto)}</label></div>
<h5>${esc(LVR.cfgH)}</h5>
<div class="lv-row"><label>${esc(LVR.cpp)}</label><input type="number" min="1" step="1" data-k="cpp" value="${CFG.cpp}"></div>
<div class="lv-row"><label>${esc(LVR.matchSec)}</label><input type="number" min="60" max="900" step="30" data-k="matchSec" value="${CFG.matchSec}"></div>
<div class="lv-row"><label>${esc(LVR.regSec)}</label><input type="number" min="0" max="300" step="5" data-k="regSec" value="${CFG.regSec}"></div>
<h5>${esc(LVR.teamsH)}</h5>
${['R', 'B'].map((T, i) => `<div class="lv-team" style="margin-top:6px;padding:8px;border-radius:10px;background:#151c30"><b>${esc(fmt(LVR.team, { n: i + 1 }))}</b>
<div class="lv-row"><input type="text" maxlength="16" data-k="n${T}" value="${esc(CFG['n' + T])}" placeholder="${esc(LVR.tName)}"><input type="color" data-k="c${T}" value="${esc(TC[T.toLowerCase()])}" title="${esc(LVR.tColor)}" style="width:44px;height:30px;padding:0;border:0;background:none;flex:none"></div>
<div class="lv-row"><input type="text" data-k="k${T}" value="${esc(CFG['k' + T])}" placeholder="${esc(LVR.tKeys)}"></div></div>`).join('')}
<div style="margin-top:6px;color:#8e99b8;font-size:11.5px">${esc(LVR.tHint)}</div>
<h5>${esc(LV.blockH)}</h5>
<div class="lv-row"><input type="text" data-k="block" value="${esc(CFG.block)}" placeholder="word1, user2"></div>
<h5>${esc(LV.obsH)}</h5>
<div class="lv-url"><input readonly data-u="obs"><button class="lv-btn" data-s="copy">${esc(LV.copy)}</button></div>
<div class="lv-obsn" style="margin-top:6px;color:#8e99b8;font-size:11.5px"></div>
<h5>${esc(LV.logH)}</h5><ul class="lv-log"></ul>`;
  outer.appendChild(pn);
  const tog = el('button', 'lv-btn lv-tog', esc(LV.panel)); outer.appendChild(tog);
  tog.addEventListener('click', () => pn.classList.toggle('hide'));
  pn.addEventListener('click', e => {
   const b = e.target.closest('[data-s]'); if (!b) return;
   const s = b.dataset.s;
   if (s === 'copy') { const i = pn.querySelector('[data-u=obs]'); i.select(); try { navigator.clipboard.writeText(i.value); } catch (er) { document.execCommand && document.execCommand('copy'); } b.textContent = LV.copied; setTimeout(() => b.textContent = LV.copy, 1500); return; }
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
   const k = t.dataset.k; if (!k) return;
   const TXT = ['block', 'nR', 'nB', 'kR', 'kB', 'cR', 'cB'];
   if (TXT.includes(k)) { CFG[k] = k[0] === 'n' ? cleanText(t.value, 16) : t.value; if (k[0] === 'n') t.value = CFG[k]; store.set('livecfg', CFG); if (k !== 'block') applyTeams(); obsUrl(); return; }
   const LIM = { cpp: [1, 100000], matchSec: [60, 900], regSec: [0, 300] }[k] || [1, 100000];
   CFG[k] = clamp(Math.round(t.value === '' ? DEF_CFG[k] : +t.value), LIM[0], LIM[1]);
   t.value = CFG[k];
   store.set('livecfg', CFG); if (k === 'matchSec' && (st.phase === 'wait' || st.phase === 'count')) st.matchT = CFG.matchSec; renderLegend(); renderScore(); obsUrl();
  });
  renderSrc(); obsUrl(); renderLog(); simLabels();
 }
 function simLabels() { if (!pn) return; pn.querySelector('[data-s=cr]').textContent = LVR.sAny + ': ' + TN('r'); pn.querySelector('[data-s=cb]').textContent = LVR.sAny + ': ' + TN('b'); }
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
 const SIM_USERS = ['ayse_23', 'leo.plays', 'mira.k', 'tomasz', 'yuki_s', 'omar.dev', 'ella.b', 'kemal34', 'nina.r', 'sam_w', 'deniz.k', 'lina_m', 'arif07', 'joao.p', 'putri', 'carlos.m', 'zeynep.t', 'mert_34', 'ana.luz', 'budi_s'];
 const sampleFor = k => { const w = TN(k).toLocaleLowerCase(lang); return [w, k === 'r' ? '1' : '2', w + '!!', 'go ' + w]; };
 const SAMPLE = { get r() { return sampleFor('r'); }, get b() { return sampleFor('b'); }, c: ['hahaha', '💪💪', 'çek!', 'pull!!', 'gg', '😂', 'come on', 'vamos'] };
 function simEvent(kind) {
  LS.n++;
  const name = SIM_USERS[(LS.n * 7 + kind.length * 3) % SIM_USERS.length];
  const ev = { id: 'sim_' + Date.now().toString(36) + '_' + LS.n, user: { id: name, name }, src: 'sim' };
  if (kind === 'cr' || kind === 'cb' || kind === 'c') Object.assign(ev, { type: 'comment', text: SAMPLE[kind === 'cr' ? 'r' : kind === 'cb' ? 'b' : 'c'][LS.n % 4] });
  else if (kind === 'like') Object.assign(ev, { type: 'like', count: 100 });
  else if (kind === 'follow') ev.type = 'follow';
  else Object.assign(ev, { type: 'gift', gift: '🎁', coins: +kind.slice(1) });
  ingest(ev);
 }
 function autoDemo(dt) {
  if (!LS.auto) return;
  LS.autoT -= dt; if (LS.autoT > 0) return;
  LS.autoT = .35 + Math.random() * .9;
  const r = Math.random();
  simEvent(r < .3 ? 'cr' : r < .6 ? 'cb' : r < .8 ? 'c' : r < .9 ? 'like' : r < .96 ? 'g1' : r < .985 ? 'g99' : r < .996 ? 'g299' : 'g999');
 }

 /* --- data sources. One is active at a time; each turns platform events into the same
    { id, user, type, text, gift, coins, repeat, count } shape and calls ingest().
    Nothing passes through our servers: the page talks to the platform (or the creator's own tool) directly.
    tikfinity: creator's TikFinity desktop app (ws://localhost)  · twitch: official Twitch chat, read-only, anonymous
    youtube: official YouTube Data API with the creator's own key · ssn: creator's Social Stream Ninja session (Kick + others) --- */
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
 function ingest(ev) {
  if (!ev || !ev.id || !ev.user) return;
  ev.user.name = cleanName(ev.user.name);
  if (LS.seen.has(ev.id)) { log(ev, ev.type, 'dup'); return; }
  LS.seen.add(ev.id); LS.seenQ.push(ev.id); if (LS.seenQ.length > 5000) LS.seen.delete(LS.seenQ.shift());
  LS.last = ev;
  if (blockList().includes(ev.user.name.toLowerCase())) { log(ev, ev.type, 'filt'); return; }
  const u = LS.users.get(ev.user.id) || { id: ev.user.id, name: ev.user.name, coins: 0, comments: 0, lastMsg: 0, lastActive: 0, team: null, roundPeople: 0, out: false, queued: null };
  LS.users.set(u.id, u); u.name = ev.user.name;
  const now = performance.now() / 1000;
  const playing = st.phase === 'pull';
  if (ev.type === 'comment') {
   const want = teamWord(ev.text);
   if (now - u.lastMsg < 1.5 && !(want && want !== u.team)) { log(ev, LVR.cmtK, 'filt'); return; }
   u.lastMsg = now; u.comments++;
   const was = u.team, t = joinTeam(u, want);
   u.lastActive = performance.now();
   if (playing && t) st.eff[t] += u.out ? 1 : 2;
   log(ev, !t ? '⏳' : was !== t ? '→ ' + TN(t) : (u.out ? '💦 ' : '') + '“' + cleanText(ev.text) + '”', 'ok');
  } else if (ev.type === 'like') {
   const t = joinTeam(u, null);
   if (playing && t) st.eff[t] += Math.min(6, .06 * Math.max(1, ev.count | 0));
   log(ev, '+' + (ev.count | 0) + ' ♥', 'ok');
  } else if (ev.type === 'follow') { joinTeam(u, null); log(ev, LV.sFollow, 'ok'); }
  else if (ev.type === 'gift') {
   const coins = Math.max(1, (ev.coins | 0) * Math.max(1, ev.repeat | 0));
   // a gift always helps: late gifters support the smaller team for this match
   let t = joinTeam(u, null);
   if (!t) { t = LS.members.r.size + st.gift.r <= LS.members.b.size + st.gift.b ? 'r' : 'b'; u.team = t; u.out = true; }
   const n = Math.max(1, Math.floor(coins / Math.max(1, CFG.cpp)));
   u.coins += coins; u.lastActive = performance.now();
   u.roundPeople += n; st.gift[t] += n;
   const strongNow = u.roundPeople >= 10 && !u.out;
   banner(strongNow && u.roundPeople - n < 10 ? fmt(LVR.strong, { u: u.name, t: TN(t) }) : fmt(LVR.brought, { u: u.name, n, t: TN(t) }), t, 3);
   renderScore();
   beep('gift'); LS.slotT = 0;
   log(ev, `${ev.gift} → +${n} ${TN(t)}`, 'ok');
  }
 }

 /* --- who stands on the rope: strongmen (big gifts) at the back, most recent players in front --- */
 function applyTeams() {
  teamColors();
  for (const k of ['r', 'b', 'rD', 'bD']) TM[k].color.set(TC[k]);
  TM.lr.color.set(TC.r); TM.lb.color.set(TC.b);
  for (const t of ['r', 'b']) slots[t].forEach(s2 => { if (s2) s2.key = null; });
  refreshSlots(true); renderLegend(); renderScore(); simLabels();
 }
 function refreshSlots(force) {
  for (const t of ['r', 'b']) {
   const us = [...LS.members[t]].map(id => LS.users.get(id)).filter(Boolean);
   const strong = us.filter(u => u.roundPeople >= 10).sort((a, b) => b.roundPeople - a.roundPeople).slice(0, 2);
   // line order: gift helpers in front (they sink first), then big gifters, then the most active players
   const helpers = Math.min(st.gift[t] - strong.reduce((a, u) => a + u.roundPeople, 0) > 0 ? 2 : 0, SLOTS);
   const rest = us.filter(u => !strong.includes(u)).sort((a, b) => b.lastActive - a.lastActive).slice(0, SLOTS - strong.length - helpers);
   const want = Array(helpers).fill(null).concat(strong.map(u => ({ key: u.id, name: u.name, strong: true, extra: u.roundPeople })))
    .concat(rest.map(u => ({ key: u.id, name: u.name, extra: u.roundPeople || 0 })));
   // with no players yet, show plain teammates so the field is not empty
   if (!us.length && !st.gift[t]) for (let i = 0; i < 3; i++) want.push(null);
   while (want.length < SLOTS) want.push(false);
   want.forEach((w, i) => { const s = slots[t][i]; if (force || !s || !s.c || s.c.fall <= 0) setSlot(t, i, w); });
  }
 }
 function liveStep(dt) {
  autoDemo(dt);
  LS.slotT -= dt; if (LS.slotT <= 0) { LS.slotT = .6; if (st.phase !== 'sink') { refreshSlots(false); renderScore(); } }
  if (st.phase === 'wait' && (!LS.waitT || (LS.waitT -= dt) <= 0)) { LS.waitT = 6; banner(LVR.wait, 'gold', 5); }
 }
 function startLive() {
  liveUI();
  if (!clean) livePanel();
  if (KINDS.includes(srcWant)) srcStart(srcWant);
  fillCpuTeams();
  st.matchT = matchLen(); st.regT = CFG.regSec; recenter(); st.phase = 'wait'; renderScore(); renderMudList();
  if (!clean) {
   const fit = () => {
    const W = outer.clientWidth, H = outer.clientHeight, wide = W > 820, aw = wide ? W - 380 : W, ah = H;
    const w = Math.min(aw, ah * 9 / 16), h = w * 16 / 9;
    host.style.width = w + 'px'; host.style.height = h + 'px'; host.style.left = ((aw - w) / 2) + 'px'; host.style.top = ((ah - h) / 2) + 'px';
   };
   global.addEventListener('resize', fit); fit();
  }
 }

 /* ---------- main loop ---------- */
 let last = performance.now();
 function frame(now) {
  requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, .05); last = now;
  if (!paused) step(dt);
  if (!live && st.showHint) st.showHint(st.phase === 'pull');
  placeTags();
  renderer.render(scene, camera);
 }
 fillCpuTeams();
 resize();
 if (live) { ov.hidden = true; startLive(); } else menu();
 requestAnimationFrame(frame);
 return { st, ingest: ev => ingest(ev), tap, newMatch, slots, camera, LS: () => LS };
}

global.RopeRumble = { mount };
})(window);
