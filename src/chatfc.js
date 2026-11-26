/* Chat FC · live football league for streamers (PickRadar)
   Normal mode: your team against the CPU. Tap fast: a tap is a pass when you have the ball and pressing when you don't.
   LIVE mode (?live=1): each team has a comment code. A viewer joins a team with its code (or 1 / 2), then every comment
   is a pass (ball ours) or pressing (ball theirs). 11 passes bring a one-on-one; a short comment duel decides goal or save.
   No randomness in what viewers or gifts do: gift effects are fixed, written on screen and limited per match. */
(function (global) {
'use strict';

const LANG = {
 en: { name: 'Chat FC', sub: 'Live Football League', quick: 'Quick match', league: 'League', leagueN: 'League · {n} teams', cont: 'Continue league · Week {n}', you: 'YOU', pass: 'PASS!', press: 'PRESS!', shoot: 'SHOOT!', save: 'SAVE!', hint: 'Tap fast: PASS when you have the ball, PRESS when they do', passN: 'PASS {n}/11', attack: '{t} attacking', chance: 'ONE ON ONE!', goal: 'GOAL!', saved: 'SAVED!', ft: 'FULL TIME', kick: 'Kick-off!', week: 'Week {n}', table: 'Standings', cols: ['P', 'W', 'D', 'L', 'GD', 'Pts'], scorers: 'Top scorers', champ: '{t} are champions!', next: 'Next match', again: 'Play again', menu: 'Menu', win: 'YOU WIN!', lose: 'YOU LOSE', draw: 'DRAW', myTeam: 'Chat FC', webgl: 'Your browser could not start 3D graphics (WebGL). Try another browser or turn on hardware acceleration.', paused: 'Paused', resume: 'Resume', assist: 'assist {u}', newSeason: 'New season!', turnover: '{t} win the ball', star: '⭐ Star player: {t} (10 s)', fk: '⚡ Free kick: {t}!', keeper: '🧤 Keeper mode: {t}', intro: 'Beat the CPU in a 90-second match. Tap fast: every tap is a pass when you have the ball and pressing when you don\'t. 11 passes bring a one-on-one: then tap like crazy to shoot!', lv: 'Level {n}', shootTap: 'Tap fast to SHOOT!', saveTap: 'Tap fast to SAVE!', season: 'Season {n}', shotM: 'SHOT', saveM: 'KEEPER' },
 tr: { name: 'Chat FC', sub: 'Canlı Futbol Ligi', quick: 'Hızlı maç', league: 'Lig', leagueN: 'Lig · {n} takım', cont: 'Lige devam · {n}. hafta', you: 'SEN', pass: 'PAS!', press: 'BAS!', shoot: 'ŞUT!', save: 'KURTAR!', hint: 'Hızlı dokun: top sendeyken PAS, rakipteyken BAS', passN: 'PAS {n}/11', attack: '{t} atakta', chance: 'KALEYLE KARŞI KARŞIYA!', goal: 'GOL!', saved: 'KURTARDI!', ft: 'MAÇ SONU', kick: 'Başlama vuruşu!', week: '{n}. Hafta', table: 'Puan Durumu', cols: ['O', 'G', 'B', 'M', 'AV', 'P'], scorers: 'Gol Krallığı', champ: '{t} ŞAMPİYON!', next: 'Sonraki maç', again: 'Tekrar oyna', menu: 'Menü', win: 'KAZANDIN!', lose: 'KAYBETTİN', draw: 'BERABERE', myTeam: 'Chat FC', webgl: 'Tarayıcın 3D grafikleri (WebGL) başlatamadı. Başka bir tarayıcı dene ya da donanım hızlandırmayı aç.', paused: 'Durdu', resume: 'Devam', assist: 'asist {u}', newSeason: 'Yeni sezon!', turnover: '{t} topu kaptı', star: '⭐ Yıldız oyuncu: {t} (10 sn)', fk: '⚡ Serbest vuruş: {t}!', keeper: '🧤 Kaleci modu: {t}', intro: '90 saniyelik maçta bilgisayarı yen. Hızlı dokun: top sendeyken her dokunuş pas, rakipteyken baskıdır. 11 pas seni kaleciyle karşı karşıya getirir: o an çılgınca dokun ve şutu çek!', lv: 'Seviye {n}', shootTap: 'ŞUT için hızlı dokun!', saveTap: 'KURTARIŞ için hızlı dokun!', season: '{n}. Sezon', shotM: 'ŞUT', saveM: 'KALECİ' },
 es: { name: 'Chat FC', sub: 'Liga de Fútbol en Directo', quick: 'Partido rápido', league: 'Liga', leagueN: 'Liga · {n} equipos', cont: 'Seguir liga · Jornada {n}', you: 'TÚ', pass: '¡PASE!', press: '¡PRESIÓN!', shoot: '¡CHUTA!', save: '¡PARA!', hint: 'Toca rápido: PASE si tienes el balón, PRESIÓN si lo tienen ellos', passN: 'PASE {n}/11', attack: '{t} ataca', chance: '¡MANO A MANO!', goal: '¡GOL!', saved: '¡PARADÓN!', ft: 'FINAL', kick: '¡Saque inicial!', week: 'Jornada {n}', table: 'Clasificación', cols: ['PJ', 'G', 'E', 'P', 'DG', 'Pts'], scorers: 'Goleadores', champ: '¡{t} campeón!', next: 'Siguiente partido', again: 'Jugar otra vez', menu: 'Menú', win: '¡GANASTE!', lose: 'PERDISTE', draw: 'EMPATE', myTeam: 'Chat FC', webgl: 'Tu navegador no pudo iniciar los gráficos 3D (WebGL). Prueba otro navegador o activa la aceleración por hardware.', paused: 'Pausa', resume: 'Seguir', assist: 'asist. {u}', newSeason: '¡Nueva temporada!', turnover: '{t} recupera el balón', star: '⭐ Jugador estrella: {t} (10 s)', fk: '⚡ Tiro libre: {t}!', keeper: '🧤 Modo portero: {t}', intro: 'Gana a la CPU en un partido de 90 segundos. Toca rápido: cada toque es un pase si tienes el balón y presión si no. 11 pases te dejan mano a mano: ¡entonces toca como loco para chutar!', lv: 'Nivel {n}', shootTap: '¡Toca rápido para CHUTAR!', saveTap: '¡Toca rápido para PARAR!', season: 'Temporada {n}', shotM: 'TIRO', saveM: 'PORTERO' },
 pt: { name: 'Chat FC', sub: 'Liga de Futebol ao Vivo', quick: 'Partida rápida', league: 'Liga', leagueN: 'Liga · {n} times', cont: 'Continuar liga · Rodada {n}', you: 'VOCÊ', pass: 'PASSE!', press: 'PRESSÃO!', shoot: 'CHUTA!', save: 'DEFENDE!', hint: 'Toque rápido: PASSE com a bola, PRESSÃO sem ela', passN: 'PASSE {n}/11', attack: '{t} no ataque', chance: 'CARA A CARA!', goal: 'GOL!', saved: 'DEFENDEU!', ft: 'FIM DE JOGO', kick: 'Saída de bola!', week: 'Rodada {n}', table: 'Classificação', cols: ['J', 'V', 'E', 'D', 'SG', 'Pts'], scorers: 'Artilharia', champ: '{t} campeão!', next: 'Próxima partida', again: 'Jogar de novo', menu: 'Menu', win: 'VOCÊ VENCEU!', lose: 'VOCÊ PERDEU', draw: 'EMPATE', myTeam: 'Chat FC', webgl: 'Seu navegador não conseguiu iniciar os gráficos 3D (WebGL). Tente outro navegador ou ative a aceleração de hardware.', paused: 'Pausado', resume: 'Continuar', assist: 'assist. {u}', newSeason: 'Nova temporada!', turnover: '{t} rouba a bola', star: '⭐ Craque: {t} (10 s)', fk: '⚡ Falta: {t}!', keeper: '🧤 Modo goleiro: {t}', intro: 'Vença a CPU numa partida de 90 segundos. Toque rápido: cada toque é um passe com a bola e pressão sem ela. 11 passes deixam você cara a cara: aí toque sem parar para chutar!', lv: 'Nível {n}', shootTap: 'Toque rápido para CHUTAR!', saveTap: 'Toque rápido para DEFENDER!', season: 'Temporada {n}', shotM: 'CHUTE', saveM: 'GOLEIRO' },
 id: { name: 'Chat FC', sub: 'Liga Sepak Bola Live', quick: 'Laga cepat', league: 'Liga', leagueN: 'Liga · {n} tim', cont: 'Lanjut liga · Pekan {n}', you: 'KAMU', pass: 'OPER!', press: 'TEKAN!', shoot: 'TENDANG!', save: 'TEPIS!', hint: 'Ketuk cepat: OPER saat pegang bola, TEKAN saat lawan pegang', passN: 'OPER {n}/11', attack: '{t} menyerang', chance: 'SATU LAWAN SATU!', goal: 'GOL!', saved: 'DITEPIS!', ft: 'BABAK AKHIR', kick: 'Kick-off!', week: 'Pekan {n}', table: 'Klasemen', cols: ['M', 'M', 'S', 'K', 'SG', 'Poin'], scorers: 'Top skor', champ: '{t} juara!', next: 'Laga berikutnya', again: 'Main lagi', menu: 'Menu', win: 'KAMU MENANG!', lose: 'KAMU KALAH', draw: 'SERI', myTeam: 'Chat FC', webgl: 'Browsermu tidak bisa menjalankan grafis 3D (WebGL). Coba browser lain atau nyalakan akselerasi perangkat keras.', paused: 'Jeda', resume: 'Lanjut', assist: 'assist {u}', newSeason: 'Musim baru!', turnover: '{t} merebut bola', star: '⭐ Pemain bintang: {t} (10 dtk)', fk: '⚡ Tendangan bebas: {t}!', keeper: '🧤 Mode kiper: {t}', intro: 'Kalahkan CPU dalam laga 90 detik. Ketuk cepat: tiap ketukan adalah operan saat pegang bola dan tekanan saat tidak. 11 operan membawamu satu lawan satu: lalu ketuk sekencangnya untuk menendang!', lv: 'Level {n}', shootTap: 'Ketuk cepat untuk MENENDANG!', saveTap: 'Ketuk cepat untuk MENEPIS!', season: 'Musim {n}', shotM: 'TENDANG', saveM: 'KIPER' }
};

const LIVE_FC = {
 en: { fire: "🔥 CROWD ON FIRE: {t}!", gFire: "🔥 Comments + likes fill the stand → 6 s +15% power", cls: 'Live match', legendH: 'Pick your team · comment', any: 'Then every comment is a pass for your team', or12: 'or 1 / 2', gSup: "🎁 Any gift: +3 power + your banner in the stand", gStar: "⭐ {c}+: you are the star striker for 10 s (+30%), goals count as yours (max 3)", gFk: '⚡ {c}+: free kick or keeper mode (max 2)', fair: 'Gifts never guarantee a goal. Effects are fixed.', likes: '♥ Likes add a little power', introH: 'Pick your team!', introS: 'Kick-off in {s}', note: 'Simulation mode: this page is not connected to a live stream. All events here are test events made by you or by Auto demo.', obsNote: 'Add as a browser source at 1080 × 1920. Without a connection the output plays a DEMO match.', obsNoteNet: 'Add as a browser source at 1080 × 1920. The match reacts to your real chat and donations.', auto: 'Auto demo: fake viewers (shown as DEMO on stream)', cfgH: 'Game settings', modeL: 'Mode', mLeague: 'League', mDerby: 'Derby (two teams, no table)', lgName: 'League name (e.g. your sponsor)', lgSize: 'Teams in the league', homeH: 'Your team', oppH: 'Opponents', tName: 'Team name', tCode: 'Comment code, e.g. CFC', tColor: 'Colour', oppPh: 'One team per line: Name | CODE', oppN: 'Empty = fictional teams. In derby mode the first line is the opponent. You type the names; do not use logos or crests you have no rights to.', sponsorL: 'Pitch-side board text', sponsorN: 'For a paid promotion, turn on your platform’s paid-promotion label.', matchSec: 'Match length (seconds)', duelSec: 'Shot duel (seconds)', breakSec: 'Break between matches (seconds)', starC: 'Coins for a star player', fkC: 'Coins for a free kick', btnNext: 'Skip to next match', btnReset: 'Reset league', btnPng: '📷 Standings image (PNG)', resetQ: 'Reset the league and start a new season?', saveN: 'The league is saved in this browser. Your OBS source keeps its own league and plays the next match on its own.', sAny: 'Comment', support: '@{u}: +{n} power · {t}', joined: '@{u} joined {t}', mvp: 'Man of the match', duelA: '{t}: comment to SHOOT!', duelD: '{t}: comment to SAVE!', passBy: '@{u} pass', fans: '{n} fans' },
 tr: { fire: "🔥 TRİBÜN ATEŞİ: {t}!", gFire: "🔥 Yorum + beğeni tribünü doldurur → 6 sn +%15 güç", cls: 'Canlı maç', legendH: 'Takımını seç · yoruma yaz', any: 'Sonra her yorumun takımına pas olur', or12: 'ya da 1 / 2', gSup: "🎁 Her hediye: +3 güç + tribünde pankartın", gStar: "⭐ {c}+: 10 sn yıldız forvet sensin (+%30), gol senin adına (en çok 3)", gFk: '⚡ {c}+: serbest vuruş ya da kaleci modu (en çok 2)', fair: 'Hediye gol garantisi vermez. Etkiler sabittir.', likes: '♥ Beğeniler biraz güç katar', introH: 'Takımını seç!', introS: 'Başlama vuruşu {s} sn sonra', note: 'Simülasyon modu: bu sayfa bir canlı yayına bağlı değil. Buradaki tüm olaylar senin ya da otomatik demonun ürettiği test olaylarıdır.', obsNote: 'OBS ya da LIVE Studio\'ya 1080 × 1920 tarayıcı kaynağı olarak ekle. Bağlantı yoksa yayında DEMO maç oynanır.', obsNoteNet: 'OBS ya da LIVE Studio\'ya 1080 × 1920 tarayıcı kaynağı olarak ekle. Maç gerçek sohbetine ve bağışlarına tepki verir.', auto: 'Otomatik demo: sahte izleyiciler (yayında DEMO yazar)', cfgH: 'Oyun ayarları', modeL: 'Mod', mLeague: 'Lig', mDerby: 'Derbi (iki takım, puan tablosu yok)', lgName: 'Lig adı (örn. sponsorun)', lgSize: 'Ligdeki takım sayısı', homeH: 'Senin takımın', oppH: 'Rakip takımlar', tName: 'Takım adı', tCode: 'Yorum kodu, örn. CFC', tColor: 'Renk', oppPh: 'Her satıra bir takım: İsim | KOD', oppN: 'Boş bırakırsan hayali takımlar gelir. Derbi modunda ilk satır rakiptir. İsimleri sen yazarsın; hakkın olmayan logo ve armaları kullanma.', sponsorL: 'Saha kenarı pano yazısı', sponsorN: 'Ücretli tanıtımsa platformunun reklam/ücretli tanıtım etiketini aç.', matchSec: 'Maç süresi (saniye)', duelSec: 'Şut düellosu (saniye)', breakSec: 'Maç arası (saniye)', starC: 'Yıldız oyuncu için jeton', fkC: 'Serbest vuruş için jeton', btnNext: 'Sonraki maça geç', btnReset: 'Ligi sıfırla', btnPng: '📷 Puan durumu resmi (PNG)', resetQ: 'Lig sıfırlanıp yeni sezon başlasın mı?', saveN: 'Lig bu tarayıcıda kaydedilir. OBS kaynağın kendi ligini tutar ve sonraki maçı kendiliğinden başlatır.', sAny: 'Yorum', support: '@{u}: +{n} güç · {t}', joined: '@{u} → {t}', mvp: 'Maçın oyuncusu', duelA: '{t}: ŞUT için yaz!', duelD: '{t}: KURTARIŞ için yaz!', passBy: '@{u} pası', fans: '{n} taraftar' },
 es: { fire: "🔥 ¡LA GRADA ARDE: {t}!", gFire: "🔥 Comentarios + likes llenan la grada → 6 s +15% de poder", cls: 'Partido en directo', legendH: 'Elige equipo · comenta', any: 'Luego cada comentario es un pase para tu equipo', or12: 'o 1 / 2', gSup: "🎁 Cualquier regalo: +3 de poder + tu pancarta en la grada", gStar: "⭐ {c}+: eres el delantero estrella 10 s (+30%), los goles son tuyos (máx. 3)", gFk: '⚡ {c}+: tiro libre o modo portero (máx. 2)', fair: 'Un regalo nunca garantiza un gol. Efectos fijos.', likes: '♥ Los likes suman un poco de poder', introH: '¡Elige tu equipo!', introS: 'Saque en {s}', note: 'Modo simulación: esta página no está conectada a un directo. Todos los eventos son de prueba, tuyos o de la demo automática.', obsNote: 'Añádelo como fuente de navegador de 1080 × 1920. Sin conexión se juega un partido DEMO.', obsNoteNet: 'Añádelo como fuente de navegador de 1080 × 1920. El partido reacciona a tu chat y donaciones reales.', auto: 'Demo automática: espectadores falsos (se ve DEMO en el directo)', cfgH: 'Ajustes del juego', modeL: 'Modo', mLeague: 'Liga', mDerby: 'Derbi (dos equipos, sin tabla)', lgName: 'Nombre de la liga (p. ej. tu patrocinador)', lgSize: 'Equipos en la liga', homeH: 'Tu equipo', oppH: 'Rivales', tName: 'Nombre del equipo', tCode: 'Código de comentario, p. ej. CFC', tColor: 'Color', oppPh: 'Un equipo por línea: Nombre | CÓDIGO', oppN: 'Vacío = equipos ficticios. En modo derbi la primera línea es el rival. Tú escribes los nombres; no uses escudos ni logos sin derechos.', sponsorL: 'Texto de las vallas del campo', sponsorN: 'Si es una promoción pagada, activa la etiqueta de promoción pagada de tu plataforma.', matchSec: 'Duración del partido (segundos)', duelSec: 'Duelo de tiro (segundos)', breakSec: 'Pausa entre partidos (segundos)', starC: 'Monedas para jugador estrella', fkC: 'Monedas para tiro libre', btnNext: 'Pasar al siguiente partido', btnReset: 'Reiniciar liga', btnPng: '📷 Imagen de la clasificación (PNG)', resetQ: '¿Reiniciar la liga y empezar una temporada nueva?', saveN: 'La liga se guarda en este navegador. Tu fuente de OBS guarda su propia liga y juega el siguiente partido sola.', sAny: 'Comentario', support: '@{u}: +{n} de poder · {t}', joined: '@{u} → {t}', mvp: 'Jugador del partido', duelA: '{t}: ¡comenta para CHUTAR!', duelD: '{t}: ¡comenta para PARAR!', passBy: 'pase de @{u}', fans: '{n} hinchas' },
 pt: { fire: "🔥 TORCIDA EM CHAMAS: {t}!", gFire: "🔥 Comentários + curtidas enchem a arquibancada → 6 s +15% de força", cls: 'Partida ao vivo', legendH: 'Escolha o time · comente', any: 'Depois, cada comentário é um passe do seu time', or12: 'ou 1 / 2', gSup: "🎁 Qualquer presente: +3 de força + sua faixa na arquibancada", gStar: "⭐ {c}+: você é o atacante craque por 10 s (+30%), gols no seu nome (máx. 3)", gFk: '⚡ {c}+: falta ou modo goleiro (máx. 2)', fair: 'Presente nunca garante gol. Efeitos fixos.', likes: '♥ Curtidas dão um pouco de força', introH: 'Escolha seu time!', introS: 'Saída de bola em {s}', note: 'Modo simulação: esta página não está ligada a uma live. Todos os eventos aqui são de teste, seus ou da demo automática.', obsNote: 'Adicione como fonte de navegador 1080 × 1920. Sem conexão a saída mostra uma partida DEMO.', obsNoteNet: 'Adicione como fonte de navegador 1080 × 1920. A partida reage ao seu chat e doações reais.', auto: 'Demo automática: espectadores falsos (aparece DEMO na live)', cfgH: 'Ajustes do jogo', modeL: 'Modo', mLeague: 'Liga', mDerby: 'Clássico (dois times, sem tabela)', lgName: 'Nome da liga (ex. seu patrocinador)', lgSize: 'Times na liga', homeH: 'Seu time', oppH: 'Adversários', tName: 'Nome do time', tCode: 'Código de comentário, ex. CFC', tColor: 'Cor', oppPh: 'Um time por linha: Nome | CÓDIGO', oppN: 'Vazio = times fictícios. No modo clássico a primeira linha é o adversário. Você digita os nomes; não use escudos ou logos sem direitos.', sponsorL: 'Texto das placas do campo', sponsorN: 'Se for publicidade paga, ative o selo de promoção paga da sua plataforma.', matchSec: 'Duração da partida (segundos)', duelSec: 'Duelo de chute (segundos)', breakSec: 'Intervalo entre partidas (segundos)', starC: 'Moedas para craque', fkC: 'Moedas para falta', btnNext: 'Pular para a próxima partida', btnReset: 'Reiniciar liga', btnPng: '📷 Imagem da classificação (PNG)', resetQ: 'Reiniciar a liga e começar nova temporada?', saveN: 'A liga fica salva neste navegador. Sua fonte do OBS guarda a própria liga e joga a próxima partida sozinha.', sAny: 'Comentário', support: '@{u}: +{n} de força · {t}', joined: '@{u} → {t}', mvp: 'Craque da partida', duelA: '{t}: comente para CHUTAR!', duelD: '{t}: comente para DEFENDER!', passBy: 'passe de @{u}', fans: '{n} torcedores' },
 id: { fire: "🔥 TRIBUN MEMBARA: {t}!", gFire: "🔥 Komentar + like mengisi tribun → 6 dtk +15% tenaga", cls: 'Laga live', legendH: 'Pilih tim · komentar', any: 'Lalu tiap komentar jadi operan untuk timmu', or12: 'atau 1 / 2', gSup: "🎁 Hadiah apa pun: +3 tenaga + spanduk namamu di tribun", gStar: "⭐ {c}+: kamu striker bintang 10 dtk (+30%), golnya atas namamu (maks. 3)", gFk: '⚡ {c}+: tendangan bebas atau mode kiper (maks. 2)', fair: 'Hadiah tidak menjamin gol. Efeknya tetap.', likes: '♥ Like menambah sedikit tenaga', introH: 'Pilih timmu!', introS: 'Kick-off dalam {s}', note: 'Mode simulasi: halaman ini tidak terhubung ke siaran live. Semua peristiwa di sini adalah tes buatanmu atau demo otomatis.', obsNote: 'Tambahkan sebagai browser source 1080 × 1920. Tanpa koneksi, output memutar laga DEMO.', obsNoteNet: 'Tambahkan sebagai browser source 1080 × 1920. Laga bereaksi pada chat dan donasi aslimu.', auto: 'Demo otomatis: penonton palsu (tampil DEMO di siaran)', cfgH: 'Pengaturan game', modeL: 'Mode', mLeague: 'Liga', mDerby: 'Derby (dua tim, tanpa klasemen)', lgName: 'Nama liga (mis. sponsormu)', lgSize: 'Jumlah tim di liga', homeH: 'Timmu', oppH: 'Lawan', tName: 'Nama tim', tCode: 'Kode komentar, mis. CFC', tColor: 'Warna', oppPh: 'Satu tim per baris: Nama | KODE', oppN: 'Kosong = tim fiksi. Di mode derby baris pertama adalah lawan. Kamu yang menulis nama; jangan pakai logo atau lambang tanpa hak.', sponsorL: 'Teks papan pinggir lapangan', sponsorN: 'Jika promosi berbayar, nyalakan label promosi berbayar platformmu.', matchSec: 'Durasi laga (detik)', duelSec: 'Duel tendangan (detik)', breakSec: 'Jeda antar laga (detik)', starC: 'Koin untuk pemain bintang', fkC: 'Koin untuk tendangan bebas', btnNext: 'Lompat ke laga berikutnya', btnReset: 'Reset liga', btnPng: '📷 Gambar klasemen (PNG)', resetQ: 'Reset liga dan mulai musim baru?', saveN: 'Liga disimpan di browser ini. Source OBS-mu menyimpan ligamu sendiri dan memulai laga berikutnya otomatis.', sAny: 'Komentar', support: '@{u}: +{n} tenaga · {t}', joined: '@{u} → {t}', mvp: 'Pemain terbaik', duelA: '{t}: komentar untuk MENENDANG!', duelD: '{t}: komentar untuk MENEPIS!', passBy: 'operan @{u}', fans: '{n} suporter' }
};

// fictional clubs (no real names, crests or kits) used when the streamer leaves the opponents empty
const POOL = {
 en: ['Harbor FC', 'North Star', 'Valley United', 'Storm City', 'Iron Horses', 'Coast FC', 'Oak Rovers', 'Rock Town', 'Hill FC', 'River Athletic', 'Prairie FC', 'Thunder FC', 'Pine Wanderers', 'Lake FC', 'Bridge Town', 'Tower FC', 'Meadow FC', 'Wave FC'],
 tr: ['Liman SK', 'Kuzey Yıldızı', 'Vadi FK', 'Fırtına Spor', 'Demir Atlar', 'Sahil FK', 'Çınar SK', 'Kaya Gücü', 'Tepe Spor', 'Nehir FK', 'Bozkır SK', 'Gök Gürültüsü', 'Meşe Spor', 'Göl SK', 'Köprü FK', 'Kule Spor', 'Ova FK', 'Dalga SK'],
 es: ['Puerto FC', 'Estrella Norte', 'Valle Unido', 'Tormenta CF', 'Caballos de Hierro', 'Costa FC', 'Roble CF', 'Peña Roca', 'Colina FC', 'Río Atlético', 'Pradera FC', 'Trueno CF', 'Pinar CF', 'Lago FC', 'Puente CF', 'Torre FC', 'Vega FC', 'Ola CF'],
 pt: ['Farol FC', 'Estrela do Norte', 'Vale Unido', 'Tempestade FC', 'Cavalos de Ferro', 'Litoral FC', 'Carvalho EC', 'Pedra Alta', 'Colina FC', 'Rio Atlético', 'Campina FC', 'Trovão EC', 'Pinhal FC', 'Lagoa FC', 'Ponte EC', 'Torre FC', 'Várzea FC', 'Onda EC'],
 id: ['Pelabuhan FC', 'Bintang Utara', 'Lembah United', 'Badai FC', 'Kuda Besi', 'Pesisir FC', 'Beringin FC', 'Batu Karang', 'Bukit FC', 'Sungai FC', 'Padang FC', 'Guntur FC', 'Pinus FC', 'Danau FC', 'Jembatan FC', 'Menara FC', 'Sawah FC', 'Ombak FC']
};
const KIT = ['#2f7fe0', '#ffc93c', '#3e9e5c', '#8e44ad', '#f39c12', '#1abc9c', '#e84393', '#34495e', '#d35400', '#16a085', '#c0392b', '#2980b9', '#7f8c8d', '#27ae60', '#f1c40f', '#9b59b6', '#e67e22', '#e94f37'];
const STR = [1.08, .92, 1, .86, 1.12, .95, .9, 1.04, .88, 1.1, .97, .84, 1.06, .93, 1, .89, 1.02];

const SRC_TXT = {"en": {"demo": "DEMO", "sim": "SIMULATION", "panelH": "Creator panel", "back": "← Game", "source": "Data source", "srcSim": "Test simulator", "active": "ACTIVE", "srcTT": "TikTok LIVE (official)", "srcTTn": "WAITING FOR PARTNER ACCESS", "simH": "Simulator", "blockH": "Blocked words and users (comma separated)", "obsH": "Stream output for OBS / LIVE Studio", "copy": "Copy", "copied": "Copied!", "logH": "Event queue", "panel": "Panel", "st": {"ok": "APPLIED", "dup": "DUPLICATE", "queue": "QUEUED", "filt": "FILTERED"}, "srcN": {"tikfinity": "TikTok · via TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + other platforms · via Social Stream Ninja (beta)"}, "srcH": {"twitch": "Official Twitch chat, free, nothing to install: type your channel name and connect. Bits and subs count as gifts. (Twitch does not send follows to chat.)", "youtube": "Official YouTube API, free. One-time setup: in Google Cloud Console turn on “YouTube Data API v3”, create an API key (restrict it to pickradar.net) and paste it here with your live video link. The free daily quota lasts about 3 hours of streaming. Super Chats, Super Stickers and memberships count as gifts.", "ssn": "For Kick and any other platform: use the free Social Stream Ninja app or browser extension. In its settings under Mechanics turn on “Enable remote API control” and “Send chat messages to API server”, then paste your session ID here. Donations count as gifts. Social Stream Ninja is a third-party tool, not made by us."}, "moneyNote": "Twitch, YouTube and Kick donations are converted to coins: $1 ≈ 75 coins (100 Bits = $1, a sub ≈ $5).", "twCh": "Twitch channel name", "ytKey": "YouTube API key", "ytVid": "Live video link or ID", "ssSess": "Social Stream session ID", "anyGift": "Any gift", "errGen": "CANNOT CONNECT", "needCh": "Type your Twitch channel name first.", "needYt": "Paste your API key and live video link first.", "needSs": "Paste your Social Stream session ID first.", "ytBadKey": "YouTube rejected the key, or today’s free quota is used up.", "ytNoLive": "No active live chat on this video yet. Retrying…", "obsNoteNet": "Add as a browser source at 1080 × 1920. The class reacts to your real chat and donations.", "keyWarn": "This link contains your API key, do not share it.", "liveNote": "Real live data is connected. Simulator buttons still work for testing.", "tfSt": {"off": "OFF", "wait": "CONNECTING…", "on": "CONNECTED", "err": "TIKFINITY NOT FOUND"}, "tfUse": "Connect my LIVE", "tfStop": "Disconnect", "tfHelp": "Free and runs only on your computer: install the TikFinity desktop app, log in with your TikTok account and keep it open while you are LIVE. This page reads your stream events from it (ws://localhost:21213). No keys, nothing passes through our servers. TikFinity is a third-party tool, not made by TikTok or by us.", "tfPerm": "If Chrome asks for “local network access”, click Allow.", "obsNoteTF": "Add as a browser source at 1080 × 1920 on the same computer where TikFinity is running. The class reacts to your real comments, likes and gifts.", "sFollow": "Follow"}, "tr": {"demo": "DEMO", "sim": "SİMÜLASYON", "panelH": "Yayıncı paneli", "back": "← Oyun", "source": "Veri kaynağı", "srcSim": "Test simülatörü", "active": "AKTİF", "srcTT": "TikTok LIVE (resmî)", "srcTTn": "PARTNER ONAYI BEKLENİYOR", "simH": "Simülatör", "blockH": "Engelli kelimeler ve kullanıcılar (virgülle)", "obsH": "OBS / LIVE Studio yayın çıktısı", "copy": "Kopyala", "copied": "Kopyalandı!", "logH": "Olay kuyruğu", "panel": "Panel", "st": {"ok": "UYGULANDI", "dup": "TEKRAR", "queue": "SIRADA", "filt": "FİLTRE"}, "srcN": {"tikfinity": "TikTok · TikFinity ile (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + diğer platformlar · Social Stream Ninja ile (beta)"}, "srcH": {"twitch": "Resmî Twitch sohbeti, ücretsiz, kurulum yok: kanal adını yaz ve bağla. Bits ve abonelikler hediye sayılır. (Twitch takipleri sohbete göndermez.)", "youtube": "Resmî YouTube API’si, ücretsiz. Tek seferlik kurulum: Google Cloud Console’da “YouTube Data API v3”ü aç, bir API anahtarı oluştur (pickradar.net ile sınırla) ve canlı yayın linkinle birlikte buraya yapıştır. Ücretsiz günlük kota yaklaşık 3 saatlik yayına yeter. Süper Sohbet, Süper Çıkartma ve kanal üyelikleri hediye sayılır.", "ssn": "Kick ve diğer tüm platformlar için: ücretsiz Social Stream Ninja uygulamasını ya da tarayıcı eklentisini kullan. Ayarlarında Mechanics bölümünden “Enable remote API control” ve “Send chat messages to API server” seçeneklerini aç, sonra oturum ID’ni buraya yapıştır. Bağışlar hediye sayılır. Social Stream Ninja üçüncü taraf bir araçtır; biz yapmadık."}, "moneyNote": "Twitch, YouTube ve Kick bağışları jetona çevrilir: 1 $ ≈ 75 jeton (100 Bits = 1 $, bir abonelik ≈ 5 $).", "twCh": "Twitch kanal adı", "ytKey": "YouTube API anahtarı", "ytVid": "Canlı yayın linki veya ID", "ssSess": "Social Stream oturum ID", "anyGift": "Her hediye", "errGen": "BAĞLANAMADI", "needCh": "Önce Twitch kanal adını yaz.", "needYt": "Önce API anahtarını ve canlı yayın linkini yapıştır.", "needSs": "Önce Social Stream oturum ID’ni yapıştır.", "ytBadKey": "YouTube anahtarı kabul etmedi ya da bugünkü ücretsiz kota doldu.", "ytNoLive": "Bu videoda henüz aktif canlı sohbet yok. Tekrar deneniyor…", "obsNoteNet": "1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek sohbetine ve bağışlarına tepki verir.", "keyWarn": "Bu link API anahtarını içerir, kimseyle paylaşma.", "liveNote": "Gerçek canlı yayın verisi bağlı. Simülatör düğmeleri test için yine çalışır.", "tfSt": {"off": "KAPALI", "wait": "BAĞLANIYOR…", "on": "BAĞLANDI", "err": "TIKFINITY BULUNAMADI"}, "tfUse": "Yayınımı bağla", "tfStop": "Bağlantıyı kes", "tfHelp": "Ücretsiz ve yalnızca senin bilgisayarında çalışır: TikFinity masaüstü uygulamasını kur, TikTok hesabınla giriş yap ve yayın boyunca açık tut. Bu sayfa yayın olaylarını oradan okur (ws://localhost:21213). Anahtar yok, hiçbir veri bizim sunucumuzdan geçmez. TikFinity üçüncü taraf bir araçtır; TikTok ya da biz yapmadık.", "tfPerm": "Chrome “yerel ağ erişimi” izni sorarsa İzin ver’e bas.", "obsNoteTF": "TikFinity’nin açık olduğu aynı bilgisayarda 1080 × 1920 tarayıcı kaynağı olarak ekle. Sınıf gerçek yorumlarına, beğenilerine ve hediyelerine tepki verir.", "sFollow": "Takip"}, "es": {"demo": "DEMO", "sim": "SIMULACIÓN", "panelH": "Panel del creador", "back": "← Juego", "source": "Fuente de datos", "srcSim": "Simulador de prueba", "active": "ACTIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "ESPERANDO ACCESO DE SOCIO", "simH": "Simulador", "blockH": "Palabras y usuarios bloqueados (separados por comas)", "obsH": "Salida del directo para OBS / LIVE Studio", "copy": "Copiar", "copied": "¡Copiado!", "logH": "Cola de eventos", "panel": "Panel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "EN COLA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · con TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + otras plataformas · con Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial de Twitch, gratis, sin instalar nada: escribe el nombre de tu canal y conecta. Los Bits y las suscripciones cuentan como regalos. (Twitch no envía los follows al chat.)", "youtube": "API oficial de YouTube, gratis. Configuración única: en Google Cloud Console activa “YouTube Data API v3”, crea una clave de API (restríngela a pickradar.net) y pégala aquí con el enlace de tu directo. La cuota diaria gratuita alcanza para unas 3 horas de directo. Super Chats, Super Stickers y membresías cuentan como regalos.", "ssn": "Para Kick y cualquier otra plataforma: usa la app o extensión gratuita Social Stream Ninja. En su configuración, en Mechanics, activa “Enable remote API control” y “Send chat messages to API server” y pega aquí tu ID de sesión. Las donaciones cuentan como regalos. Social Stream Ninja es una herramienta de terceros, no la hicimos nosotros."}, "moneyNote": "Las donaciones de Twitch, YouTube y Kick se convierten en monedas: 1 $ ≈ 75 monedas (100 Bits = 1 $, una suscripción ≈ 5 $).", "twCh": "Nombre del canal de Twitch", "ytKey": "Clave de API de YouTube", "ytVid": "Enlace o ID del directo", "ssSess": "ID de sesión de Social Stream", "anyGift": "Cualquier regalo", "errGen": "NO SE PUEDE CONECTAR", "needCh": "Escribe primero el nombre de tu canal de Twitch.", "needYt": "Pega primero tu clave de API y el enlace del directo.", "needSs": "Pega primero tu ID de sesión de Social Stream.", "ytBadKey": "YouTube rechazó la clave o la cuota gratuita de hoy se agotó.", "ytNoLive": "Este vídeo aún no tiene chat en directo activo. Reintentando…", "obsNoteNet": "Añádelo como fuente de navegador de 1080 × 1920. La clase reacciona a tu chat y donaciones reales.", "keyWarn": "Este enlace contiene tu clave de API, no lo compartas.", "liveNote": "Datos reales del directo conectados. Los botones del simulador siguen funcionando para pruebas.", "tfSt": {"off": "APAGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NO ENCONTRADO"}, "tfUse": "Conectar mi LIVE", "tfStop": "Desconectar", "tfHelp": "Gratis y solo en tu ordenador: instala la app de escritorio TikFinity, inicia sesión con tu cuenta de TikTok y mantenla abierta durante el directo. Esta página lee los eventos de tu directo desde ella (ws://localhost:21213). Sin claves; nada pasa por nuestros servidores. TikFinity es una herramienta de terceros, no la hizo TikTok ni nosotros.", "tfPerm": "Si Chrome pide «acceso a la red local», pulsa Permitir.", "obsNoteTF": "Añádelo como fuente de navegador de 1080 × 1920 en el mismo ordenador donde está abierto TikFinity. La clase reacciona a tus comentarios, me gusta y regalos reales.", "sFollow": "Seguir"}, "pt": {"demo": "DEMO", "sim": "SIMULAÇÃO", "panelH": "Painel do criador", "back": "← Jogo", "source": "Fonte de dados", "srcSim": "Simulador de teste", "active": "ATIVO", "srcTT": "TikTok LIVE (oficial)", "srcTTn": "AGUARDANDO ACESSO DE PARCEIRO", "simH": "Simulador", "blockH": "Palavras e usuários bloqueados (separados por vírgula)", "obsH": "Saída da live para OBS / LIVE Studio", "copy": "Copiar", "copied": "Copiado!", "logH": "Fila de eventos", "panel": "Painel", "st": {"ok": "APLICADO", "dup": "DUPLICADO", "queue": "NA FILA", "filt": "FILTRADO"}, "srcN": {"tikfinity": "TikTok · com TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + outras plataformas · com Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat oficial da Twitch, grátis, sem instalar nada: digite o nome do seu canal e conecte. Bits e inscrições contam como presentes. (A Twitch não envia follows para o chat.)", "youtube": "API oficial do YouTube, grátis. Configuração única: no Google Cloud Console ative a “YouTube Data API v3”, crie uma chave de API (restrinja a pickradar.net) e cole aqui com o link da sua live. A cota diária grátis dá para cerca de 3 horas de live. Super Chats, Super Stickers e assinaturas de canal contam como presentes.", "ssn": "Para Kick e qualquer outra plataforma: use o app ou a extensão gratuita Social Stream Ninja. Nas configurações, em Mechanics, ative “Enable remote API control” e “Send chat messages to API server” e cole aqui o seu ID de sessão. Doações contam como presentes. Social Stream Ninja é uma ferramenta de terceiros, não foi feita por nós."}, "moneyNote": "Doações da Twitch, YouTube e Kick viram moedas: US$ 1 ≈ 75 moedas (100 Bits = US$ 1, uma inscrição ≈ US$ 5).", "twCh": "Nome do canal da Twitch", "ytKey": "Chave de API do YouTube", "ytVid": "Link ou ID da live", "ssSess": "ID de sessão do Social Stream", "anyGift": "Qualquer presente", "errGen": "NÃO FOI POSSÍVEL CONECTAR", "needCh": "Digite primeiro o nome do seu canal da Twitch.", "needYt": "Cole primeiro sua chave de API e o link da live.", "needSs": "Cole primeiro seu ID de sessão do Social Stream.", "ytBadKey": "O YouTube recusou a chave ou a cota grátis de hoje acabou.", "ytNoLive": "Este vídeo ainda não tem chat ao vivo ativo. Tentando de novo…", "obsNoteNet": "Adicione como fonte de navegador de 1080 × 1920. A turma reage ao seu chat e às doações reais.", "keyWarn": "Este link contém sua chave de API, não compartilhe.", "liveNote": "Dados reais da live conectados. Os botões do simulador continuam funcionando para testes.", "tfSt": {"off": "DESLIGADO", "wait": "CONECTANDO…", "on": "CONECTADO", "err": "TIKFINITY NÃO ENCONTRADO"}, "tfUse": "Conectar minha LIVE", "tfStop": "Desconectar", "tfHelp": "Grátis e só no seu computador: instale o app de desktop TikFinity, entre com sua conta do TikTok e deixe-o aberto durante a live. Esta página lê os eventos da sua live a partir dele (ws://localhost:21213). Sem chaves; nada passa pelos nossos servidores. TikFinity é uma ferramenta de terceiros, não foi feita pelo TikTok nem por nós.", "tfPerm": "Se o Chrome pedir “acesso à rede local”, clique em Permitir.", "obsNoteTF": "Adicione como fonte de navegador de 1080 × 1920 no mesmo computador em que o TikFinity está aberto. A turma reage aos seus comentários, curtidas e presentes reais.", "sFollow": "Seguir"}, "id": {"demo": "DEMO", "sim": "SIMULASI", "panelH": "Panel kreator", "back": "← Game", "source": "Sumber data", "srcSim": "Simulator uji", "active": "AKTIF", "srcTT": "TikTok LIVE (resmi)", "srcTTn": "MENUNGGU AKSES PARTNER", "simH": "Simulator", "blockH": "Kata dan pengguna yang diblokir (pisahkan dengan koma)", "obsH": "Output siaran untuk OBS / LIVE Studio", "copy": "Salin", "copied": "Tersalin!", "logH": "Antrean event", "panel": "Panel", "st": {"ok": "DITERAPKAN", "dup": "DUPLIKAT", "queue": "ANTRE", "filt": "DISARING"}, "srcN": {"tikfinity": "TikTok · lewat TikFinity (beta)", "twitch": "Twitch", "youtube": "YouTube Live", "ssn": "Kick + platform lain · lewat Social Stream Ninja (beta)"}, "srcH": {"twitch": "Chat Twitch resmi, gratis, tanpa instalasi: ketik nama channel-mu lalu hubungkan. Bits dan langganan dihitung sebagai hadiah. (Twitch tidak mengirim follow ke chat.)", "youtube": "API YouTube resmi, gratis. Pengaturan sekali saja: di Google Cloud Console aktifkan “YouTube Data API v3”, buat API key (batasi ke pickradar.net) lalu tempel di sini bersama link live-mu. Kuota harian gratis cukup untuk sekitar 3 jam siaran. Super Chat, Super Sticker, dan keanggotaan dihitung sebagai hadiah.", "ssn": "Untuk Kick dan platform lainnya: pakai aplikasi atau ekstensi gratis Social Stream Ninja. Di pengaturannya, bagian Mechanics, nyalakan “Enable remote API control” dan “Send chat messages to API server”, lalu tempel session ID-mu di sini. Donasi dihitung sebagai hadiah. Social Stream Ninja adalah alat pihak ketiga, bukan buatan kami."}, "moneyNote": "Donasi Twitch, YouTube, dan Kick diubah jadi koin: $1 ≈ 75 koin (100 Bits = $1, satu langganan ≈ $5).", "twCh": "Nama channel Twitch", "ytKey": "API key YouTube", "ytVid": "Link atau ID video live", "ssSess": "Session ID Social Stream", "anyGift": "Hadiah apa pun", "errGen": "TIDAK BISA TERHUBUNG", "needCh": "Ketik dulu nama channel Twitch-mu.", "needYt": "Tempel dulu API key dan link video live-mu.", "needSs": "Tempel dulu session ID Social Stream-mu.", "ytBadKey": "YouTube menolak key ini, atau kuota gratis hari ini sudah habis.", "ytNoLive": "Video ini belum punya live chat aktif. Mencoba lagi…", "obsNoteNet": "Tambahkan sebagai browser source 1080 × 1920. Kelas bereaksi pada chat dan donasi aslimu.", "keyWarn": "Link ini berisi API key-mu, jangan dibagikan.", "liveNote": "Data live asli terhubung. Tombol simulator tetap bisa dipakai untuk uji.", "tfSt": {"off": "MATI", "wait": "MENGHUBUNGKAN…", "on": "TERHUBUNG", "err": "TIKFINITY TIDAK DITEMUKAN"}, "tfUse": "Hubungkan LIVE-ku", "tfStop": "Putuskan", "tfHelp": "Gratis dan hanya berjalan di komputermu: pasang aplikasi desktop TikFinity, masuk dengan akun TikTok-mu dan biarkan terbuka selama LIVE. Halaman ini membaca event siaranmu dari sana (ws://localhost:21213). Tanpa kunci; tidak ada data yang lewat server kami. TikFinity adalah alat pihak ketiga, bukan buatan TikTok atau kami.", "tfPerm": "Jika Chrome meminta “akses jaringan lokal”, klik Izinkan.", "obsNoteTF": "Tambahkan sebagai browser source 1080 × 1920 di komputer yang sama tempat TikFinity terbuka. Kelas bereaksi pada komentar, suka, dan hadiah aslimu.", "sFollow": "Ikuti"}};

const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const hash = s => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
// pitch: 60 × 38 units (players are drawn about 1.2× real size so they read on a phone)
const HL = 30, HW = 19, GW = 2.25, GH = 1.45, BOXD = 9.4, BOXW = 11.5;
// 4-4-2 in "attacking to +x" coordinates; index 0 is the keeper
const FORM = [[-28, 0], [-18, -12], [-19.5, -4.2], [-19.5, 4.2], [-18, 12], [-7, -13], [-8.5, -4.5], [-8.5, 4.5], [-7, 13], [3.5, -5], [3.5, 5]];
const NUMS = [1, 2, 4, 5, 3, 7, 6, 8, 11, 9, 10];

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
  outer.style.cssText = 'position:fixed;inset:0;z-index:2147483000;width:auto;height:auto;margin:0;border:0;border-radius:0;box-shadow:none;background:#070c1c';
  if (!clean) { const stage = document.createElement('div'); stage.className = 'cf-stage'; outer.appendChild(stage); host = stage; }
 }
 const T3 = global.THREE;
 const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in global;
 host.classList.add('cf');
 const store = {
  get(k, d) { try { const v = localStorage.getItem('cfc.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('cfc.' + k, JSON.stringify(v)); } catch (e) { } }
 };
 const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
 const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
 const DEF_CFG = { mode: 'league', lg: '', size: 6, nH: '', kH: '', cH: '#e94f37', opp: '', sponsor: '', matchSec: 90, duelSec: 3, breakSec: 15, starC: 99, fkC: 299, block: '' };
 let CFG = Object.assign({}, DEF_CFG, live ? store.get('livecfg', {}) : {});
 try { const c = QS.get('cfg'); if (c && live) CFG = Object.assign({}, DEF_CFG, JSON.parse(decodeURIComponent(escape(atob(c.replace(/ /g, '+')))))); } catch (e) { }
 const hexOk = h => /^#[0-9a-f]{6}$/i.test(String(h || ''));
 const rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
 const shade = (h, f) => '#' + rgb(h).map(v => Math.round(clamp(v * f, 0, 255)).toString(16).padStart(2, '0')).join('');
 const lum = h => { const [r, g, b] = rgb(h).map(v => v / 255); return .2126 * r + .7152 * g + .0722 * b; };
 const cdist = (a, b) => { const x = rgb(a), y = rgb(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
 const clip = (s, n) => String(s || '').replace(/[<>|]/g, '').trim().slice(0, n || 18);
 const asciiUp = s => String(s || '').replace(/ı/g, 'i').replace(/İ/g, 'I').normalize('NFKD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z0-9]/g, '');
 const codeOf = (c, name) => asciiUp(c).slice(0, 8) || asciiUp(String(name).split(/\s+/)[0]).slice(0, 6) || 'TEAM';

 /* ---------- teams and league (saved in this browser) ---------- */
 const lgSize = () => live ? (CFG.mode === 'derby' ? 2 : [6, 10, 18].includes(+CFG.size) ? +CFG.size : 6) : 6;
 function buildTeams(n) {
  const pool = POOL[lang] || POOL.en;
  const home = { i: 0, name: clip(live ? CFG.nH : '', 18) || L.myTeam, color: live && hexOk(CFG.cH) ? CFG.cH : '#e94f37', str: 1, home: true };
  home.code = codeOf(live ? CFG.kH : '', home.name);
  const lines = live ? String(CFG.opp || '').split(/\r?\n|;/).map(s => s.trim()).filter(Boolean) : [];
  const list = [home]; let k = 0;
  for (let i = 1; i < n; i++) {
   let name = '', code = '', color = '';
   const ln = lines[i - 1];
   if (ln) { const p = ln.split('|').map(s => s.trim()); name = clip(p[0], 18); code = p[1] || ''; color = p[2] || ''; }
   if (!name) name = pool[(i - 1) % pool.length];
   if (!hexOk(color)) { do { color = KIT[k++ % KIT.length]; } while (cdist(color, home.color) < 110 && k < 40); }
   list.push({ i, name, code: codeOf(code, name), color, str: STR[(i - 1) % STR.length] });
  }
  const seen = {}; list.forEach(t => { let c = t.code, j = 2; while (seen[c]) c = t.code + (j++); seen[c] = 1; t.code = c; });
  return list;
 }
 function roundRobin(n) {
  const a = [...Array(n).keys()], weeks = [];
  for (let w = 0; w < n - 1; w++) { const pr = []; for (let i = 0; i < n / 2; i++) pr.push([a[i], a[n - 1 - i]]); weeks.push(pr); a.splice(1, 0, a.pop()); }
  // renumber so the streamer's team (0) meets the opponents in the order they were typed: week 1 → line 1, week 2 → line 2…
  const map = [0]; weeks.forEach((pr, w) => { const p = pr.find(x => x[0] === 0 || x[1] === 0); map[p[0] === 0 ? p[1] : p[0]] = w + 1; });
  return weeks.map(pr => pr.map(([x, y]) => [map[x], map[y]]));
 }
 const LKEY = live ? 'league' : 'leagueN';
 function newLeague(season) { const n = lgSize(); return { n, season: season || 1, week: 0, sched: roundRobin(n), tb: Array.from({ length: n }, () => ({ p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0 })), sc: {} }; }
 let LG = store.get(LKEY, null);
 if (!LG || LG.n !== lgSize() || !LG.sched || !LG.tb) LG = newLeague(LG && LG.season ? LG.season + 1 : 1);
 let TEAMS = buildTeams(LG.n);
 const saveLG = () => store.set(LKEY, LG);
 const pts = r => r.w * 3 + r.d;
 const order = () => TEAMS.map((t, i) => i).sort((a, b) => { const A = LG.tb[a], B = LG.tb[b]; return pts(B) - pts(A) || (B.gf - B.ga) - (A.gf - A.ga) || B.gf - A.gf || a - b; });
 function record(i, j, gi, gj) {
  const A = LG.tb[i], B = LG.tb[j];
  A.p++; B.p++; A.gf += gi; A.ga += gj; B.gf += gj; B.ga += gi;
  if (gi > gj) { A.w++; B.l++; } else if (gi < gj) { B.w++; A.l++; } else { A.d++; B.d++; }
 }
 function simGoals(sa, sb, seed) { const r = rng(seed), lam = 2.7 * sa / (sa + sb); let g = 0, p = Math.exp(-lam), s = p; const u = r(); while (u > s && g < 7) { g++; p *= lam / g; s += p; } return g; }
 const weekPairs = () => LG.sched[LG.week % LG.sched.length];
 const oppIndex = () => { const pr = weekPairs().find(p => p[0] === 0 || p[1] === 0); return pr[0] === 0 ? pr[1] : pr[0]; };
 function finishWeek(gh, ga) {
  const o = oppIndex();
  record(0, o, gh, ga);
  weekPairs().forEach(([a, b]) => { if (a === 0 || b === 0) return; const sd = hash(LG.season + ':' + LG.week + ':' + a + ':' + b); record(a, b, simGoals(TEAMS[a].str, TEAMS[b].str, sd), simGoals(TEAMS[b].str, TEAMS[a].str, sd + 7)); });
  LG.week++;
  if (live && CFG.mode === 'derby') LG.week = 0;
  saveLG();
 }
 const seasonOver = () => LG.n > 2 && LG.week >= LG.sched.length;
 function addScorer(name, team) { if (!name) return; const s = LG.sc[name] || (LG.sc[name] = { g: 0, t: team }); s.g++; s.t = team; }
 const topScorers = n => Object.entries(LG.sc).sort((a, b) => b[1].g - a[1].g).slice(0, n);

 /* ---------- styles ---------- */
 const css = document.createElement('style');
 css.textContent = `
.cf{position:relative;overflow:hidden;font-family:'Barlow Condensed','Oswald','Arial Narrow',system-ui,sans-serif;color:#fff;user-select:none;-webkit-user-select:none;touch-action:manipulation;background:#070c1c}
.cf canvas{display:block;width:100%;height:100%;outline:none}
.cf-ui,.cf-labels{position:absolute;inset:0;pointer-events:none}
.cf-np{position:absolute;transform:translate(-50%,-100%);white-space:nowrap;padding:1px 7px;border-radius:6px;font:700 12px system-ui,sans-serif;background:rgba(10,16,34,.82);color:#fff;border-left:3px solid var(--c,#ffc93c)}
.cf-nm{position:absolute;transform:translate(-50%,-100%);white-space:nowrap;padding:0 5px;border-radius:5px;font:700 10px system-ui,sans-serif;background:rgba(10,16,34,.62);color:#fff;border-bottom:2px solid var(--c,#fff)}
.cf-nm.st{background:#ffc93c;color:#10172b;font-size:11px}
.cf-np.hot{font-size:14px;background:#ffc93c;color:#10172b;border-left-color:#10172b}
.cf-bug{position:absolute;left:50%;top:10px;transform:translateX(-50%);display:flex;align-items:stretch;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.45);background:#10172b;max-width:calc(100% - 20px)}
.cf-bug .tm{display:flex;align-items:center;gap:7px;padding:6px 11px;font-weight:800;font-size:19px;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap;min-width:0}
.cf-bug .tm span{overflow:hidden;text-overflow:ellipsis;max-width:150px}
.cf-bug .tm i{flex:none;width:6px;align-self:stretch;border-radius:3px}
.cf-bug .sc{display:flex;align-items:center;white-space:nowrap;padding:0 12px;background:#fff;color:#10172b;font-weight:800;font-size:26px;letter-spacing:1px}
.cf-bug .mn{display:flex;align-items:center;padding:0 9px;background:#1f2a48;font:800 15px system-ui,sans-serif;color:#9fe870;min-width:38px;justify-content:center}
.cf-sub{position:absolute;left:50%;top:52px;transform:translateX(-50%);padding:2px 10px;border-radius:0 0 7px 7px;background:rgba(16,23,43,.82);font:700 11.5px system-ui,sans-serif;color:#c7d2ee;white-space:nowrap;letter-spacing:.3px}
.cf-att{position:absolute;left:50%;top:76px;transform:translateX(-50%);width:min(360px,calc(100% - 24px));padding:5px 8px 6px;border-radius:9px;background:rgba(16,23,43,.85)}
.cf-att .l{display:flex;justify-content:space-between;font:800 13px system-ui,sans-serif;letter-spacing:.3px;margin-bottom:4px}
.cf-att .l b{color:var(--ac,#ffc93c)}
.cf-att .d{display:grid;grid-template-columns:repeat(11,1fr);gap:3px}
.cf-att .d i{height:8px;border-radius:3px;background:#2a3555}
.cf-att .d i.on{background:var(--ac,#ffc93c)}
.cf-att .d i.g{box-shadow:0 0 0 2px #fff inset}
.cf-duel{position:absolute;left:50%;top:76px;transform:translateX(-50%);width:min(380px,calc(100% - 24px));padding:7px 9px;border-radius:10px;background:#10172b;box-shadow:0 0 0 3px #ffc93c,0 8px 24px rgba(0,0,0,.5)}
.cf-duel[hidden]{display:none}
.cf-duel .h{text-align:center;font-weight:800;font-size:20px;color:#ffc93c;letter-spacing:1px}
.cf-duel .m{display:flex;height:16px;border-radius:8px;overflow:hidden;margin:5px 0 3px}
.cf-duel .m div{transition:width .12s}
.cf-duel .r{display:flex;justify-content:space-between;font:800 12px system-ui,sans-serif}
.cf-ban{position:absolute;left:50%;top:128px;transform:translateX(-50%);max-width:calc(100% - 24px);padding:7px 14px;border-radius:9px;background:#10172b;font-weight:800;font-size:18px;text-align:center;box-shadow:0 6px 16px rgba(0,0,0,.4);transition:opacity .25s,transform .25s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cf-ban.off{opacity:0;transform:translate(-50%,-6px)}
.cf-big{position:absolute;left:0;right:0;top:38%;text-align:center;font-weight:800;font-size:80px;line-height:.9;letter-spacing:2px;text-shadow:0 6px 0 rgba(0,0,0,.45),0 0 30px rgba(0,0,0,.4);transition:opacity .2s,transform .2s}
.cf-big.off{opacity:0;transform:scale(.7)}
.cf-big small{display:block;font-size:26px;letter-spacing:.5px;margin-top:8px}
.cf-feed{position:absolute;left:10px;top:150px;display:flex;flex-direction:column;gap:4px;max-width:62%}
.cf-feed div{padding:3px 8px;border-radius:6px;background:rgba(16,23,43,.78);font:700 12px system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-left:3px solid var(--c,#ffc93c);animation:cfin .25s}
@keyframes cfin{from{opacity:0;transform:translateX(-8px)}}
.cf-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:18px;text-align:center;background:radial-gradient(ellipse at center,rgba(10,16,34,.72),rgba(5,8,20,.92));pointer-events:auto;overflow:auto}
.cf-ov[hidden]{display:none}
.cf-ov h2{margin:0;font-weight:800;font-size:64px;line-height:.85;letter-spacing:2px}
.cf-ov h2 span{display:block;font-size:.36em;letter-spacing:4px;color:#9fe870;margin-top:8px}
.cf-ov p{margin:0;max-width:460px;color:#dce4f7;font:600 15px/1.45 system-ui,sans-serif}
.cf-ov .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.cf-btn{pointer-events:auto;border:0;border-radius:10px;padding:12px 22px;font:800 20px 'Barlow Condensed','Arial Narrow',system-ui,sans-serif;letter-spacing:.5px;background:#9fe870;color:#10172b;cursor:pointer;box-shadow:0 5px 0 #4d8a2c}
.cf-btn:active{transform:translateY(3px);box-shadow:0 2px 0 #4d8a2c}
.cf-btn.g{background:#fff;box-shadow:0 5px 0 #8e99b8}
.cf-tap{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:128px;height:128px;border-radius:50%;padding:0;font-size:28px;box-shadow:0 7px 0 #4d8a2c,0 0 0 6px rgba(255,255,255,.18)}
.cf-tap.d{background:#ffc93c;box-shadow:0 7px 0 #b5861f,0 0 0 6px rgba(255,255,255,.18)}
.cf-tap.s{background:#ff6b5b;color:#fff;box-shadow:0 7px 0 #a8382c,0 0 0 8px rgba(255,201,60,.6)}
.cf-hint{position:absolute;left:0;right:0;bottom:152px;text-align:center;font:700 13px system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000}
.cf-icon{position:absolute;right:10px;bottom:10px;width:40px;height:40px;padding:0;font-size:16px;pointer-events:auto}
.cf-tb{border-collapse:collapse;width:min(440px,100%);font:700 14px system-ui,sans-serif;color:#eef1f8;background:rgba(16,23,43,.9);border-radius:10px;overflow:hidden}
.cf-tb th{font-size:11px;color:#9aa6c4;padding:6px 5px;text-align:center;background:#1a2440}
.cf-tb td{padding:5px;text-align:center;border-top:1px solid #222d4a}
.cf-tb td.n{text-align:left;white-space:nowrap;max-width:170px;overflow:hidden;text-overflow:ellipsis}
.cf-tb td.n i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.cf-tb tr.me td{background:rgba(159,232,112,.16);color:#fff}
.cf-tb td.p{font-weight:800;color:#fff}
.cf-tt{font-weight:800;font-size:30px;letter-spacing:1px}
.cf-tt small{display:block;font:700 12px system-ui,sans-serif;color:#9aa6c4;letter-spacing:.5px;margin-top:2px}
.cf-gs{font:700 13px system-ui,sans-serif;color:#dce4f7}
.cf-err{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:600 15px system-ui,sans-serif;background:#10172b;color:#fff}
`;
 document.head.appendChild(css);

 let renderer;
 try { renderer = new T3.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: !!opts.capture }); }
 catch (e) { host.appendChild(el('div', 'cf-err', esc(L.webgl))); return; }
 const quality = touch ? 0 : 1;
 renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, quality ? 1.75 : 1.4));
 renderer.outputColorSpace = T3.SRGBColorSpace;
 renderer.toneMapping = T3.NeutralToneMapping;
 renderer.toneMappingExposure = 1.05;
 host.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label', L.name + ' · ' + L.sub);
 renderer.domElement.tabIndex = 0;
 const labels = el('div', 'cf-labels'), ui = el('div', 'cf-ui');
 host.appendChild(labels); host.appendChild(ui);

 /* ---------- stadium ---------- */
 const scene = new T3.Scene();
 scene.background = new T3.Color('#0a1230');
 scene.fog = new T3.Fog('#0a1230', 90, 190);
 const camera = new T3.PerspectiveCamera(34, 1, .5, 420);
 scene.add(new T3.HemisphereLight('#dfe9ff', '#2a4a24', 1.35));
 const key = new T3.DirectionalLight('#fff6e8', 1.5); key.position.set(-20, 40, 26); scene.add(key);
 const key2 = new T3.DirectionalLight('#e8f0ff', .65); key2.position.set(26, 30, -22); scene.add(key2);
 const matCache = {};
 const M = (hex, rough, o) => { const k = hex + '|' + rough + JSON.stringify(o || {}); return matCache[k] || (matCache[k] = new T3.MeshStandardMaterial(Object.assign({ color: hex, roughness: rough == null ? .6 : rough, metalness: 0 }, o || {}))); };
 const MB = (hex, o) => new T3.MeshBasicMaterial(Object.assign({ color: hex }, o || {}));
 const G = { sph: new T3.SphereGeometry(1, 18, 12), box: new T3.BoxGeometry(1, 1, 1), cyl: new T3.CylinderGeometry(1, 1, 1, 14) };
 const capCache = {};
 const capG = (r, len) => capCache[r + '|' + len] || (capCache[r + '|' + len] = new T3.CapsuleGeometry(r, len, 4, 10));
 function mesh(geo, mat, x, y, z, sx, sy, sz, parent) {
  const m = new T3.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  if (sx != null) m.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  (parent || scene).add(m);
  return m;
 }
 function canvasTex(w, h, draw, rep, aniso) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new T3.CanvasTexture(c); t.colorSpace = T3.SRGBColorSpace; t.anisotropy = aniso || 4;
  if (rep) { t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
  t.userData = { canvas: c };
  return t;
 }
 // grass with mowing stripes and all the markings painted into one texture
 const PX = 30, PW = (HL + 4) * 2, PH = (HW + 4) * 2;
 const pitchTex = canvasTex(PW * PX, PH * PX, (c, w, h) => {
  const X = x => (x + PW / 2) * PX, Y = z => (z + PH / 2) * PX;
  c.fillStyle = '#2f7a35'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 14; i++) { c.fillStyle = i % 2 ? '#3c8f3f' : '#358639'; c.fillRect(X(-HL + i * HL / 7), Y(-HW - 4), HL / 7 * PX + 1, (HW + 4) * 2 * PX); }
  for (let i = 0; i < 9000; i++) { c.fillStyle = `rgba(${20 + (i * 7) % 50},${70 + (i * 13) % 70},30,.13)`; c.fillRect((i * 9973) % w, (i * 7919) % h, 2, 3); }
  c.strokeStyle = 'rgba(255,255,255,.92)'; c.lineWidth = .13 * PX;
  const R = (x0, z0, x1, z1) => c.strokeRect(X(x0), Y(z0), (x1 - x0) * PX, (z1 - z0) * PX);
  R(-HL, -HW, HL, HW);
  c.beginPath(); c.moveTo(X(0), Y(-HW)); c.lineTo(X(0), Y(HW)); c.stroke();
  c.beginPath(); c.arc(X(0), Y(0), 5.2 * PX, 0, TAU); c.stroke();
  for (const s of [-1, 1]) {
   const gx = s * HL;
   R(Math.min(gx, gx - s * BOXD), -BOXW, Math.max(gx, gx - s * BOXD), BOXW);
   R(Math.min(gx, gx - s * 3.1), -5.2, Math.max(gx, gx - s * 3.1), 5.2);
   c.fillStyle = '#fff'; c.beginPath(); c.arc(X(gx - s * 6.2), Y(0), .16 * PX, 0, TAU); c.fill();
   const a = Math.acos((BOXD - 6.2) / 5.2);
   c.beginPath(); if (s > 0) c.arc(X(gx - 6.2), Y(0), 5.2 * PX, Math.PI - a, Math.PI + a); else c.arc(X(gx + 6.2), Y(0), 5.2 * PX, -a, a); c.stroke();
   for (const t of [-1, 1]) { c.beginPath(); c.arc(X(gx), Y(t * HW), .7 * PX, s > 0 ? (t > 0 ? Math.PI : Math.PI / 2) : (t > 0 ? -Math.PI / 2 : 0), s > 0 ? (t > 0 ? Math.PI * 1.5 : Math.PI) : (t > 0 ? 0 : Math.PI / 2)); c.stroke(); }
  }
  c.fillStyle = '#fff'; c.beginPath(); c.arc(X(0), Y(0), .18 * PX, 0, TAU); c.fill();
 }, null, 8);
 const pitch = mesh(new T3.PlaneGeometry(PW, PH), new T3.MeshStandardMaterial({ map: pitchTex, roughness: .92 }), 0, 0, 0);
 pitch.rotation.x = -Math.PI / 2;
 const apron = mesh(new T3.PlaneGeometry(PW + 30, PH + 30), M('#244f2a', .95), 0, -.02, 0); apron.rotation.x = -Math.PI / 2;
 // goals: posts, bar and a net that bulges when the ball goes in
 const white = M('#f4f6fb', .35), nets = {};
 for (const s of [-1, 1]) {
  const gx = s * HL;
  for (const z of [-GW, GW]) mesh(G.cyl, white, gx, GH / 2, z, .07, GH, .07);
  const bar = mesh(G.cyl, white, gx, GH, 0, .07, GW * 2 + .14, .07); bar.rotation.x = Math.PI / 2;
  const net = new T3.Group(); net.position.set(gx, 0, 0); scene.add(net);
  const pts = [], D = 1.25 * s, st2 = .2;
  for (let z = -GW; z <= GW + .01; z += st2) { pts.push(D, 0, z, D, GH * .82, z, 0, GH, z, D, GH * .82, z); }
  for (let y = 0; y <= GH * .82 + .01; y += st2) pts.push(D, y, -GW, D, y, GW, 0, y + (GH - GH * .82) * (y / (GH * .82)), -GW, D, y, -GW, 0, y + (GH - GH * .82) * (y / (GH * .82)), GW, D, y, GW);
  for (let x = 0; Math.abs(x) <= Math.abs(D) + .01; x += st2 * s) { const y = lerp(GH, GH * .82, x / D); pts.push(x, y, -GW, x, y, GW); }
  const ng = new T3.BufferGeometry(); ng.setAttribute('position', new T3.Float32BufferAttribute(pts, 3));
  net.add(new T3.LineSegments(ng, new T3.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: .55 })));
  nets[s] = { g: net, t: 0 };
  // corner flags
  for (const t of [-1, 1]) { mesh(G.cyl, M('#f4f6fb', .4), gx, .5, t * HW, .03, 1, .03); mesh(G.box, M('#ffc93c', .5), gx, .9, t * HW + .14 * -t, .02, .2, .28); }
 }
 // stands with a painted crowd, roof band and the stadium lights
 function paintCrowd(c, v, w, h, cols) {
  c.fillStyle = '#151b2c'; c.fillRect(0, 0, w, h);
  for (let r = 0; r < 16; r++) { c.fillStyle = r % 2 ? '#1a2135' : '#1d253a'; c.fillRect(0, r * 16, w, 16); }
  for (let r = 0; r < 16; r++) for (let i = 0; i < 46; i++) {
   if ((i * 31 + r * 17 + v * 5) % 9 === 0) continue;
   const x = i * 11.1 + (r % 2) * 5 + ((i * r * 7) % 4), y = r * 16 + 4;
   c.fillStyle = typeof cols === 'function' ? cols(i, r, v) : cols[(i * 7 + r * 13 + v * 3) % cols.length]; c.fillRect(x, y + 5, 8, 8);
   c.fillStyle = ['#f2c7a5', '#c68b63', '#8a5a3b', '#e0ac85'][(i + r) % 4]; c.beginPath(); c.arc(x + 4, y + 3, 3.3, 0, TAU); c.fill();
  }
 }
 const CROWD0 = ['#e94f37', '#ffffff', '#2f7fe0', '#ffc93c', '#c8d0e0', '#e94f37', '#3e9e5c', '#20283c'];
 const crowdTex = [0, 1].map(v => canvasTex(512, 256, (c, w, h) => paintCrowd(c, v, w, h, CROWD0), [6, 1]));
 const standTexs = [];
 // the stands fill with the colours of the two teams' fans (LIVE): share = home fans / all fans
 function recolorCrowd(share, ca, cb) {
  crowdTex.forEach((t, v) => paintCrowd(t.userData.canvas.getContext('2d'), v, 512, 256, (i, r) => { const k = hash(i + ':' + r + ':' + v) % 1000 / 1000; return k < .22 ? ['#ffffff', '#c8d0e0', '#20283c'][(i + r) % 3] : (k - .22) / .78 < share ? ca : cb; }));
  standTexs.forEach(t => t.needsUpdate = true);
 }
 const stands = new T3.Group(); scene.add(stands);
 function stand(w, depth, x, z, ry, tex) {
  const g = new T3.Group(); g.position.set(x, 0, z); g.rotation.y = ry; stands.add(g);
  const t = tex.clone(); t.needsUpdate = true; t.repeat.set(w / 10, 3); standTexs.push(t);
  const p = mesh(new T3.PlaneGeometry(w, depth), new T3.MeshStandardMaterial({ map: t, roughness: .9 }), 0, depth * .26, -depth * .43, 1, 1, 1, g);
  p.rotation.x = -Math.PI / 2 + .52;
  mesh(G.box, M('#24314f', .8), 0, .45, .4, w, .9, .6, g);
  mesh(G.box, M('#1a2238', .7), 0, depth * .55 + 1.2, -depth * .9, w, 2.4, .8, g);
  mesh(G.box, M('#283250', .6), 0, depth * .55 + 3, -depth * .55, w + 2, .4, depth * .9, g);
  return g;
 }
 stand(PW + 14, 24, 0, -(HW + 4.5), 0, crowdTex[0]);
 stand(PW + 14, 24, 0, HW + 4.5, Math.PI, crowdTex[1]);
 stand(PH + 10, 20, -(HL + 5.5), 0, Math.PI / 2, crowdTex[1]);
 stand(PH + 10, 20, HL + 5.5, 0, -Math.PI / 2, crowdTex[0]);
 const BANNER_POS = [[HL + 5.6, 1.9, -12, -Math.PI / 2], [-20, 1.9, -(HW + 4.6), 0], [HL + 5.6, 1.9, 6, -Math.PI / 2], [8, 1.9, -(HW + 4.6), 0], [HL + 5.6, 1.9, -3, -Math.PI / 2], [-6, 1.9, -(HW + 4.6), 0], [HL + 5.6, 1.9, 14, -Math.PI / 2], [21, 1.9, -(HW + 4.6), 0]];
 const banners = []; let bannerN = 0;
 function addBanner(name, color) {
  const old = banners.filter(b => b.name === name); old.forEach(b => { scene.remove(b.m); b.m.material.map.dispose(); banners.splice(banners.indexOf(b), 1); });
  for (let k = 0; k < 2; k++) {
   const pos = BANNER_POS[(bannerN++) % BANNER_POS.length];
   const prev = banners.find(b => b.slot === pos); if (prev) { scene.remove(prev.m); banners.splice(banners.indexOf(prev), 1); }
   const tex = canvasTex(512, 150, (c, w, h) => {
    c.fillStyle = color; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(0, 0, w, 10); c.fillRect(0, h - 10, w, 10);
    c.fillStyle = lum(color) > .6 ? '#10172b' : '#ffffff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    let fs = 92; c.font = `800 ${fs}px "Barlow Condensed","Arial Narrow",system-ui,sans-serif`; const txt = '@' + name;
    while (c.measureText(txt).width > w - 40 && fs > 40) { fs -= 4; c.font = `800 ${fs}px "Barlow Condensed","Arial Narrow",system-ui,sans-serif`; }
    c.fillText(txt, w / 2, h / 2 + 4);
   });
   const m = mesh(new T3.PlaneGeometry(6.4, 1.9), new T3.MeshBasicMaterial({ map: tex, side: T3.DoubleSide }), pos[0], pos[1], pos[2]);
   m.rotation.y = pos[3]; m.rotateX(-.35);
   banners.push({ name, m, slot: pos });
  }
 }
 function clearBanners() { banners.splice(0).forEach(b => scene.remove(b.m)); }
 const glowTex = canvasTex(128, 128, (c, w) => { const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,252,235,1)'); g.addColorStop(.25, 'rgba(255,248,220,.55)'); g.addColorStop(1, 'rgba(255,248,220,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); });
 for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
  const x = sx * (HL + 16), z = sz * (HW + 18);
  mesh(G.cyl, M('#3a4258', .6), x, 15, z, .45, 30, .45);
  mesh(G.box, MB('#fffbe8'), x, 30.5, z, 4.2, 2.4, .4).lookAt(0, 0, 0);
  const sp = new T3.Sprite(new T3.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: T3.AdditiveBlending })); sp.position.set(x, 30.5, z); sp.scale.set(16, 16, 1); scene.add(sp);
 }
 // pitch-side LED boards: the streamer's sponsor text (or ours) scrolling around the field
 let boardTex = null, boardTexs = [];
 function drawBoards() {
  const txt = (clip(CFG.sponsor, 40) || 'PICKRADAR.NET').toUpperCase();
  if (!boardTex) boardTex = canvasTex(1024, 64, () => { }, [1, 1]);
  const c = boardTex.userData.canvas.getContext('2d');
  c.fillStyle = '#0b1230'; c.fillRect(0, 0, 1024, 64);
  c.font = '800 40px "Barlow Condensed","Arial Narrow",system-ui,sans-serif'; c.textBaseline = 'middle';
  let x = 14; const items = [txt, 'CHAT FC', txt, '★'];
  while (x < 1024) for (const s of items) { c.fillStyle = s === 'CHAT FC' ? '#9fe870' : s === '★' ? '#ffc93c' : '#ffffff'; c.fillText(s, x, 34); x += c.measureText(s).width + 34; }
  boardTex.needsUpdate = true; boardTexs.forEach(t => t.needsUpdate = true);
 }
 drawBoards();
 const boardTexEnd = boardTex.clone(); boardTex.repeat.set(4, 1); boardTexEnd.repeat.set(1, 1); boardTexEnd.needsUpdate = true;
 boardTexs = [boardTex, boardTexEnd];
 for (const z of [-1, 1]) { const b = mesh(new T3.PlaneGeometry(PW + 2, .62), new T3.MeshBasicMaterial({ map: boardTex }), 0, .31, z * (HW + 1.8)); b.rotation.y = z > 0 ? Math.PI : 0; }
 for (const x of [-1, 1]) for (const z of [-1, 1]) { const b = mesh(new T3.PlaneGeometry(HW - GW - 1.5, .62), new T3.MeshBasicMaterial({ map: boardTexEnd }), x * (HL + 2.6), .31, z * (GW + 1.2 + (HW - GW - 1.5) / 2)); b.rotation.y = -x * Math.PI / 2; }
 for (const z of [-1, 1]) mesh(G.box, M('#0a0f1f', .8), 0, .31, z * (HW + 1.86), PW + 2, .64, .08);

 /* ---------- players ---------- */
 const SKIN = ['#f2c7a5', '#e0ac85', '#c68b63', '#9a6440', '#6e4630', '#f6d2b8'], HAIR = ['#1e1410', '#3b2316', '#5a3a22', '#c98b4e', '#2a1a12', '#0e0e10'];
 const KM = [0, 1].map(() => ({ shirt: new T3.MeshStandardMaterial({ roughness: .62 }), shorts: new T3.MeshStandardMaterial({ roughness: .7 }), socks: new T3.MeshStandardMaterial({ roughness: .7 }), gk: new T3.MeshStandardMaterial({ roughness: .6 }) }));
 const boot = M('#15151c', .5);
 const shadowTex = canvasTex(64, 64, (c, w) => { const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); });
 const shadowMat = new T3.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
 const shadowGeo = new T3.PlaneGeometry(1, 1);
 function blob(sz) { const m = mesh(shadowGeo, shadowMat, 0, .02, 0, sz, sz, 1); m.rotation.x = -Math.PI / 2; return m; }
 const P = [[], []];
 function makePlayer(side, idx) {
  const h = hash(side * 97 + idx * 13 + 'p'), gk = idx === 0, K = KM[side];
  const skin = M(SKIN[h % SKIN.length], .55), shirt = gk ? K.gk : K.shirt;
  const root = new T3.Group(); scene.add(root);
  const body = new T3.Group(); root.add(body);
  const hips = new T3.Group(); hips.position.y = .6; body.add(hips);
  mesh(capG(.13, .2), shirt, 0, .28, 0, 1.08, 1, .72, hips);
  mesh(capG(.125, .03), K.shorts, 0, .03, 0, 1.1, 1, .82, hips);
  const head = new T3.Group(); head.position.y = .57; hips.add(head);
  mesh(capG(.045, .05), skin, 0, -.06, 0, 1, 1, 1, head);
  mesh(G.sph, skin, 0, .05, 0, .105, .118, .108, head);
  const hc = M(HAIR[(h >>> 4) % HAIR.length], .6);
  const hair = mesh(new T3.SphereGeometry(1, 14, 8, 0, TAU, 0, 1.45), hc, 0, .07, -.012, .112, .118, .114, head); hair.rotation.x = -.35;
  const arms = [];
  for (const s of [-1, 1]) {
   const sh = new T3.Group(); sh.position.set(s * .165, .42, 0); hips.add(sh);
   mesh(capG(.043, .12), shirt, 0, -.08, 0, 1, 1, 1, sh);
   const el2 = new T3.Group(); el2.position.y = -.19; sh.add(el2);
   mesh(capG(.036, .13), skin, 0, -.08, 0, 1, 1, 1, el2);
   arms.push({ sh, el: el2 });
  }
  const legs = [];
  for (const s of [-1, 1]) {
   const hp = new T3.Group(); hp.position.set(s * .075, 0, 0); hips.add(hp);
   mesh(capG(.06, .2), skin, 0, -.15, 0, 1, 1, 1, hp);
   const kn = new T3.Group(); kn.position.y = -.3; hp.add(kn);
   mesh(capG(.052, .19), K.socks, 0, -.13, 0, 1, 1, 1, kn);
   mesh(G.box, boot, 0, -.28, .035, .085, .06, .17, kn);
   legs.push({ hp, kn });
  }
  const f = FORM[idx], dir = side ? -1 : 1;
  const p = { side, idx, gk, num: NUMS[idx], root, body, hips, head, arms, legs, shadow: blob(.75),
   pos: new T3.Vector3(dir * f[0] * .9, 0, f[1]), vel: new T3.Vector3(), tgt: new T3.Vector3(), ph: (h % 100) / 100 * TAU, face: side ? -Math.PI / 2 : Math.PI / 2,
   dive: 0, diveDir: 0, cel: 0, kick: 0, tag: null, tagT: 0, sway: (h % 1000) / 1000 * TAU };
  root.position.copy(p.pos);
  P[side][idx] = p;
  return p;
 }
 for (let s = 0; s < 2; s++) for (let i = 0; i < 11; i++) makePlayer(s, i);
 // ball
 const ballTex = canvasTex(128, 64, (c, w, h) => { c.fillStyle = '#f7f7f2'; c.fillRect(0, 0, w, h); c.fillStyle = '#1b1b22'; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc((i * 37) % w + 6, (i * 23) % h + 8, 6, 0, TAU); c.fill(); } });
 const ballM = mesh(new T3.SphereGeometry(.13, 18, 12), new T3.MeshStandardMaterial({ map: ballTex, roughness: .4 }), 0, .13, 0);
 const ballSh = blob(.45);
 const ball = { pos: new T3.Vector3(0, .13, 0), mode: 'carry', car: null, from: new T3.Vector3(), to: new T3.Vector3(), t: 0, T: 1, h: 0, done: null, spin: 0 };

 /* ---------- camera ---------- */
 const camPos = new T3.Vector3(0, 30, 40), camLook = new T3.Vector3(), wantPos = new T3.Vector3(), wantLook = new T3.Vector3();
 let portrait = false, camSnap = true;
 function resize() {
  const W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; portrait = W / H < .9;
  camera.fov = portrait ? 50 : 34; camera.updateProjectionMatrix(); camSnap = true;
 }
 new ResizeObserver(resize).observe(host);
 function updCam(dt) {
  const bx = ball.pos.x, bz = ball.pos.z;
  const ch = st.phase === 'chance' || st.phase === 'shot' ? 1 : 0;
  st.zoom = lerp(st.zoom, ch, 1 - Math.exp(-dt * 2.5));
  if (st.phase === 'goal' && st.cine) {
   const s = st.cine, a = s.a + st.t * .55;
   wantLook.set(s.p.pos.x, 1, s.p.pos.z);
   wantPos.set(s.p.pos.x + Math.cos(a) * 7.5, 3.2, s.p.pos.z + Math.sin(a) * 7.5);
  } else if (portrait) {
   const tx = clamp(bx, -HL + 9, HL - 9) + 4, tz = clamp(bz * .35, -6, 6);
   const d = lerp(1, .74, st.zoom);
   wantLook.set(tx + st.zoom * 3, 0, tz);
   wantPos.set(tx - 25 * d, 20 * d, tz);
  } else {
   const tx = clamp(bx, -HL + 13, HL - 13), tz = clamp(bz * .3, -4, 4);
   const d = lerp(1, .72, st.zoom);
   wantLook.set(tx, 0, tz);
   wantPos.set(tx, 22 * d, tz + 31 * d);
  }
  const k = camSnap ? 1 : 1 - Math.exp(-dt * (st.phase === 'goal' ? 5 : 2.6));
  camPos.lerp(wantPos, k); camLook.lerp(wantLook, k); camSnap = false;
  camera.position.copy(camPos); camera.lookAt(camLook);
 }

 /* ---------- audio ---------- */
 let AC = null, muted = store.get('mute', false), noiseBuf = null;
 function ac() { AC = AC || new (global.AudioContext || global.webkitAudioContext)(); return AC; }
 function beep(type) {
  if (muted) return;
  try {
   const a = ac(), t0 = a.currentTime;
   if (type === 'roar' || type === 'ooh') {
    if (!noiseBuf) { noiseBuf = a.createBuffer(1, a.sampleRate * 2.5, a.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = type === 'roar' ? 900 : 500; f.Q.value = .7;
    const T = type === 'roar' ? 2.4 : 1.1, v = type === 'roar' ? .22 : .1;
    g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + .15); g.gain.exponentialRampToValueAtTime(.0001, t0 + T);
    s.connect(f); f.connect(g); g.connect(a.destination); s.start(t0); s.stop(t0 + T + .1); return;
   }
   const Pp = { whistle: [2400, 2300, .35, 'square', .035], whistle3: [2400, 2300, .9, 'square', .035], kick: [180, 70, .09, 'triangle', .12], pass: [420, 260, .05, 'triangle', .05], tick: [880, 880, .05, 'square', .03], gift: [990, 1480, .25, 'sine', .07], pop: [700, 1100, .07, 'sine', .05] }[type] || [600, 600, .1, 'sine', .05];
   const o = a.createOscillator(), g = a.createGain();
   o.type = Pp[3]; o.frequency.setValueAtTime(Pp[0], t0); o.frequency.exponentialRampToValueAtTime(Pp[1], t0 + Pp[2]);
   if (type.startsWith('whistle')) { const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 38; lg.gain.value = 140; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t0); lfo.stop(t0 + Pp[2] + .1); }
   g.gain.setValueAtTime(Pp[4], t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + Pp[2] + .05);
   o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0 + Pp[2] + .08);
  } catch (e) { }
 }

 /* ---------- HUD ---------- */
 const bug = el('div', 'cf-bug', '<div class="tm h"><i></i><span></span></div><div class="sc">0 - 0</div><div class="tm a"><span></span><i></i></div><div class="mn">0\'</div>');
 const sub = el('div', 'cf-sub', '');
 const att = el('div', 'cf-att', `<div class="l"><b></b><span></span></div><div class="d">${'<i></i>'.repeat(11)}</div>`);
 const duel = el('div', 'cf-duel', '<div class="h"></div><div class="m"><div class="x"></div><div class="y"></div></div><div class="r"><span class="x"></span><span class="y"></span></div>'); duel.hidden = true;
 const ban = el('div', 'cf-ban off', ''), big = el('div', 'cf-big off', ''), feed = el('div', 'cf-feed', '');
 const ov = el('div', 'cf-ov', ''); ov.hidden = true;
 [bug, sub, att, duel, ban, feed, big, ov].forEach(x => ui.appendChild(x));
 let banT = 0, bigT = 0;
 function banner(txt, color, dur) { ban.textContent = txt; ban.style.background = color || '#10172b'; ban.style.color = color && lum(color) > .6 ? '#10172b' : '#fff'; ban.className = 'cf-ban'; banT = dur || 3; }
 function bigText(txt, sub2, dur, color) { big.innerHTML = esc(txt) + (sub2 ? `<small>${esc(sub2)}</small>` : ''); big.style.color = color || '#fff'; big.className = 'cf-big'; bigT = dur || 1.5; }
 const feedL = [];
 function feedAdd(txt, color) { if (!live) return; feedL.unshift({ txt, color }); feedL.length = Math.min(feedL.length, 4); feed.innerHTML = feedL.map(f => `<div style="--c:${f.color || '#ffc93c'}">${esc(f.txt)}</div>`).join(''); }
 const TN = s => st.teams[s].name;
 const TC = s => st.kit[s];
 function renderBug() {
  const [h, a] = st.teams;
  bug.querySelector('.h span').textContent = h.name; bug.querySelector('.a span').textContent = a.name;
  bug.querySelector('.h i').style.background = st.kit[0]; bug.querySelector('.a i').style.background = st.kit[1];
  bug.querySelector('.sc').textContent = st.sc[0] + ' - ' + st.sc[1];
  bug.querySelector('.mn').textContent = Math.min(90, Math.floor(st.clock)) + "'";
  const lg = live ? clip(CFG.lg, 36) : '';
  sub.textContent = live && CFG.mode === 'derby' ? (lg || L.name) : [lg || L.name, LG.n > 2 && st.league ? fmt(L.week, { n: Math.min(LG.week + 1, LG.sched.length) }) : '', live ? '' : st.quick ? fmt(L.lv, { n: lvl }) : ''].filter(Boolean).join(' · ');
 }
 function renderAtt() {
  const s = st.poss, n = clamp(Math.floor(st.bar), 0, 11);
  att.style.setProperty('--ac', TC(s));
  att.querySelector('b').textContent = '⚽ ' + fmt(L.attack, { t: TN(s) });
  att.querySelector('.l span').textContent = fmt(L.passN, { n });
  att.querySelectorAll('.d i').forEach((d, i) => { d.className = i < n ? 'on' : ''; if (i === 10 && n >= 10) d.classList.add('g'); });
  att.style.display = st.phase === 'play' || st.phase === 'kick' ? '' : 'none';
 }

 /* ---------- match state ---------- */
 const st = { fire: [0, 0], heat: [0, 0], starBy: ['', ''], xiT: 0, phase: 'idle', t: 0, clock: 0, sc: [0, 0], poss: 0, bar: 1, passK: 1, grace: 0, R: [0, 0], acc: [0, 0], P: [0, 0], chat: [0, 0], slow: 2.2, star: [0, 0], starN: [0, 0], keeper: [0, 0], bigN: [0, 0], duel: null, zoom: 0, cine: null,
  teams: [TEAMS[0], TEAMS[1]], kit: ['#e94f37', '#2f7fe0'], lastBy: ['', ''], lastByT: [0, 0], assist: ['', ''], contrib: new Map(), mid: 0, laneZ: 0, quick: false, cpu: 3, sideT: 0, tapT: [] };
 function setKits() {
  const [a, b] = st.teams; let ca = a.color, cb = b.color;
  if (cdist(ca, cb) < 110) cb = lum(ca) > .55 ? '#1f2a48' : '#f4f6fb'; // away team wears its change kit
  st.kit = [ca, cb];
  [ca, cb].forEach((c, s) => { const K = KM[s]; K.shirt.color.set(c); K.socks.color.set(c); K.shorts.color.set(lum(c) > .6 ? '#1f2a48' : lum(c) < .12 ? '#f4f6fb' : shade(c, .32)); K.gk.color.set(s ? '#ff8a3d' : '#c6ff3d'); });
 }
 function formationPos(p, kickSide) {
  const f = FORM[p.idx], dir = p.side ? -1 : 1;
  let x = f[0] * .92, z = f[1];
  if (!p.gk) x = Math.min(x, -1.2);
  if (kickSide === p.side && (p.idx === 9 || p.idx === 10)) { x = -.4; z = p.idx === 9 ? -.6 : 1.6; }
  return [dir * x, z];
 }
 function resetPositions(kickSide, snap) {
  for (const s of [0, 1]) for (const p of P[s]) { const [x, z] = formationPos(p, kickSide); p.tgt.set(x, 0, z); if (snap) { p.pos.set(x, 0, z); p.vel.set(0, 0, 0); } p.dive = 0; p.cel = 0; p.root.rotation.set(0, p.side ? -Math.PI / 2 : Math.PI / 2, 0); }
  ball.mode = 'carry'; ball.car = P[kickSide][9]; ball.pos.set(0, .13, 0);
  st.poss = kickSide; st.bar = 1; st.passK = 1; st.grace = 1.5; st.laneZ = 0;
 }
 function startMatch(home, away) {
  st.teams = [home, away]; setKits(); st.mid++;
  st.sc = [0, 0]; st.clock = 0; st.R = [0, 0]; st.acc = [0, 0]; st.star = [0, 0]; st.starN = [0, 0]; st.keeper = [0, 0]; st.bigN = [0, 0];
  st.lastBy = ['', '']; st.assist = ['', '']; st.contrib = new Map(); st.duel = null; st.cine = null;
  st.starBy = ['', '']; st.fire = [0, 0]; st.heat = [0, 0]; st.xiT = 0;
  for (const s of [0, 1]) for (const p of P[s]) setName(p, '');
  clearBanners();
  resetPositions(0, true); camSnap = true;
  renderBug(); renderAtt(); duel.hidden = true;
  if (live) { st.phase = 'intro'; st.t = 10; resetFans(); showIntro(); } else { st.phase = 'kick'; st.t = 1.4; }
 }

 /* ---------- engine: chat → power → passes → chances. Deterministic: no dice for viewers or gifts ---------- */
 const wob = s => 1 + .22 * Math.sin(st.time * .53 + s * 2.1) + .12 * Math.sin(st.time * 1.7 + s * 4.3);
 function powers(dt) {
  for (const s of [0, 1]) { st.R[s] = st.R[s] * Math.exp(-dt / 1.6) + st.acc[s]; st.acc[s] = 0; st.chat[s] = 2.4 * Math.sqrt(st.R[s] / 1.6); }
  if (!live) {
   st.P[0] = Math.max(st.chat[0], .8);
   st.P[1] = st.cpu * wob(1);
  } else if (CFG.mode === 'derby') {
   for (const s of [0, 1]) st.P[s] = Math.max(st.chat[s], 1.3 * wob(s));
  } else {
   // the CPU fills in for the opponent: about as strong as the streamer's chat over the last seconds, times its club strength
   st.slow = lerp(st.slow, Math.max(st.chat[0], 1.6), 1 - Math.exp(-dt / 10));
   st.P[0] = Math.max(st.chat[0], 1.3 * wob(0));
   st.P[1] = Math.max(st.chat[1], st.slow * (st.teams[1].str || 1) * .95 * wob(1));
  }
  for (const s of [0, 1]) { if (st.star[s] > 0) { st.star[s] -= dt; st.P[s] *= 1.3; if (st.star[s] <= 0) st.starBy[s] = ''; } if (st.fire[s] > 0) { st.fire[s] -= dt; st.P[s] *= 1.15; } }
 }
 function addC(s, w, name) {
  if (!['play', 'chance', 'kick', 'shot', 'intro'].includes(st.phase)) return;
  st.acc[s] += w;
  if (name) {
   st.lastBy[s] = name; st.lastByT[s] = st.time;
   const c = st.contrib.get(name) || { n: 0, s }; c.n += w; c.s = s; st.contrib.set(name, c);
   if (st.phase === 'chance' && st.duel) st.duel.by[s][name] = (st.duel.by[s][name] || 0) + w;
  }
 }
 const outfield = s => P[s].filter(p => !p.gk);
 const nearest = (list, v) => list.reduce((b, p) => !b || p.pos.distanceToSquared(v) < b.pos.distanceToSquared(v) ? p : b, null);
 function kickBall(to, T, h, done) { ball.mode = 'fly'; ball.from.copy(ball.pos); ball.to.copy(to); ball.t = 0; ball.T = T; ball.h = h; ball.done = done; ball.car = null; }
 function passTo(r, back) {
  const from = ball.car; if (from) from.kick = .25;
  const to = r.tgt.clone(); to.y = .13;
  const T = clamp(ball.pos.distanceTo(to) / 24, .28, .8);
  kickBall(to, T, back ? .2 : clamp(ball.pos.distanceTo(to) * .05, .15, 1.2), () => { ball.mode = 'carry'; ball.car = r; });
  beep('pass');
  const s = r.side, nm = st.lastBy[s];
  if (live && nm && st.time - st.lastByT[s] < 4) setTag(r, fmt(LVR.passBy, { u: nm }), 1.8);
 }
 function pickReceiver(s, forward) {
  const car = ball.car, dir = s ? -1 : 1, bx = ball.pos.x * dir;
  st.laneZ = clamp(st.laneZ * -.5 + (((hash(st.mid + ':' + st.passK + ':' + st.time.toFixed(1)) % 21) - 10) * 1.1), -13, 13);
  let best = null, bs = -1e9;
  for (const p of outfield(s)) {
   if (p === car) continue;
   const px = p.tgt.x * dir, dx = px - bx;
   const sc = forward ? -Math.abs(dx - 6) - .35 * Math.abs(p.tgt.z - st.laneZ) : -Math.abs(dx + 5) - .3 * Math.abs(p.tgt.z - ball.pos.z);
   if (sc > bs) { bs = sc; best = p; }
  }
  return best;
 }
 function turnover() {
  const d = 1 - st.poss;
  const tk = nearest(outfield(d), ball.pos);
  st.poss = d; st.bar = 1.2; st.passK = 1; st.grace = 1.2; st.duel = null;
  if (tk) { tk.kick = .3; ball.mode = 'carry'; ball.car = tk; }
  banner(fmt(L.turnover, { t: TN(d) }), TC(d), 1.6); beep('kick');
  feedAdd('🔄 ' + fmt(L.turnover, { t: TN(d) }), TC(d));
 }
 function engine(dt) {
  const a = st.poss, d = 1 - a, A = st.P[a], D = st.P[d];
  st.bar = Math.min(11.2, st.bar + dt * .78 * (A - .62 * D));
  st.grace -= dt;
  if (st.bar < 0) { if (st.grace > 0 || ball.mode === 'fly') st.bar = 0; else { turnover(); return; } }
  const k = clamp(Math.floor(st.bar), 0, 11);
  if (ball.mode === 'carry' && ball.car && ball.car.side === a) {
   if (k > st.passK) { st.passK++; const r = pickReceiver(a, true); if (r) passTo(r); if (st.passK >= 11) st.assist[a] = st.lastBy[a]; }
   else if (k < st.passK) { st.passK--; const r = pickReceiver(a, false); if (r) passTo(r, true); }
   else if ((st.sideT -= dt) <= 0) { st.sideT = 2.2; if (st.bar % 1 < .55) { const r = pickReceiver(a, false); if (r && r.pos.distanceTo(ball.pos) < 14) passTo(r, true); } }
  }
  if (st.bar >= 11 && ball.mode === 'carry') startChance();
 }
 function startChance() {
  const a = st.poss;
  st.phase = 'chance'; st.t = live ? clamp(+CFG.duelSec || 3, 2, 6) : 2.6;
  st.duel = { a, SA: 0, SD: 0, by: [{}, {}], T: st.t };
  if (live && st.star[a] > 0 && st.starBy[a] && ball.mode === 'carry' && ball.car !== P[a][9]) passTo(P[a][9]);
  bigText(L.chance, '', 1.1, '#ffc93c'); beep('ooh');
  feedAdd('⚡ ' + L.chance + ' ' + TN(a), TC(a));
  duel.hidden = false;
 }
 function duelStep(dt) {
  const D = st.duel, a = D.a, d = 1 - a;
  D.SA += st.P[a] * dt; D.SD += st.P[d] * dt * (st.keeper[d] > 0 ? 1.5 : 1);
  const q = D.SA / Math.max(.001, D.SA + D.SD * 1.25);
  duel.querySelector('.h').textContent = L.chance + ' ' + Math.ceil(st.t);
  duel.querySelector('.m .x').style.cssText = `width:${(q * 100).toFixed(1)}%;background:${TC(a)}`;
  duel.querySelector('.m .y').style.cssText = `width:${(100 - q * 100).toFixed(1)}%;background:${TC(d)}`;
  duel.querySelector('.r .x').textContent = (live ? fmt(LVR.duelA, { t: TN(a) }) : a === 0 ? L.shootTap : L.shotM + ' · ' + TN(a));
  duel.querySelector('.r .y').textContent = (live ? fmt(LVR.duelD, { t: TN(d) }) : d === 0 ? L.saveTap : L.saveM + ' · ' + TN(d));
  if (st.t <= 0) shoot(D.SA > D.SD * 1.25);
 }
 function shoot(goal) {
  const a = st.duel.a, d = 1 - a, dir = a ? -1 : 1, gk = P[d][0];
  duel.hidden = true; st.keeper[d] = 0;
  const car = ball.car || nearest(outfield(a), ball.pos);
  if (car) car.kick = .35;
  const zt = (gk.pos.z > 0 ? -1 : 1) * (GW - .45), yt = .55 + (hash(st.mid + ':' + st.sc[a] + ':' + st.time) % 5) * .14;
  st.phase = 'shot'; st.t = 2;
  beep('kick');
  if (goal) {
   kickBall(new T3.Vector3(dir * (HL + .9), yt, zt), .5, .35, () => { ball.mode = 'free'; ball.vel = new T3.Vector3(dir * .5, 0, 0); scored(a, car); });
   gk.dive = .45; gk.diveDir = -Math.sign(zt) || 1;
  } else {
   const sz = gk.pos.z + (zt > gk.pos.z ? .9 : -.9);
   kickBall(new T3.Vector3(dir * (HL - .9), yt, sz), .42, .3, () => { saved(a, gk, sz); });
   gk.dive = .42; gk.diveDir = Math.sign(sz - gk.pos.z) || 1;
  }
 }
 function scorerName(a, car) {
  if (live && st.star[a] > 0 && st.starBy[a]) return st.starBy[a];
  const by = st.duel ? st.duel.by[a] : {};
  const top = Object.entries(by).sort((x, y) => y[1] - x[1])[0];
  if (top) return top[0];
  if (!live && a === 0) return L.you;
  return st.lastBy[a] && live ? st.lastBy[a] : '#' + (car ? car.num : 9);
 }
 function scored(a, car) {
  st.sc[a]++; renderBug();
  const who = scorerName(a, car), as = st.assist[a] && st.assist[a] !== who ? st.assist[a] : '';
  if (!who.startsWith('#')) addScorer(who, st.teams[a].i != null ? st.teams[a].i : -1);
  nets[a ? -1 : 1].t = 1;
  st.phase = 'goal'; st.t = 3.4; st.cine = { p: car || P[a][9], a: Math.random() * TAU };
  const cp = st.cine.p; cp.cel = 3.4; P[a].forEach(p => { if (!p.gk && p !== cp) p.cel = 3.4; });
  bigText(L.goal, '⚽ ' + (who.startsWith('#') ? TN(a) + ' ' + who : (live ? '@' : '') + who) + (as ? ' · ' + fmt(L.assist, { u: (live ? '@' : '') + as }) : ''), 3, TC(a));
  feedAdd('⚽ ' + L.goal + ' ' + TN(a) + ' ' + st.sc[0] + '-' + st.sc[1] + (who.startsWith('#') ? '' : ' · @' + who), TC(a));
  beep('roar'); beep('whistle'); st.bounce = 2.5;
  st.duel = null;
 }
 function saved(a, gk, sz) {
  const d = 1 - a, dir = a ? -1 : 1;
  st.phase = 'save'; st.t = 1.5;
  bigText(L.saved, '🧤 ' + TN(d), 1.3, TC(d)); beep('ooh');
  feedAdd('🧤 ' + L.saved + ' ' + TN(d), TC(d));
  kickBall(new T3.Vector3(dir * (HL - 3.5), .13, sz * .6), .5, .9, () => { ball.mode = 'carry'; ball.car = gk; });
  st.duel = null;
 }
 function restartAfter(kind) {
  if (kind === 'goal') { const conc = st.cine ? 1 - st.cine.p.side : 0; st.cine = null; resetPositions(conc, false); st.phase = 'kick'; st.t = 1.6; }
  else { const d = ball.car ? ball.car.side : 1 - st.poss; st.poss = d; st.bar = 1; st.passK = 1; st.grace = 1.5; st.phase = 'play'; }
  renderAtt();
 }
 function fullTime() {
  st.phase = 'ft'; st.t = 4.5; duel.hidden = true; beep('whistle3');
  const [g0, g1] = st.sc;
  const res = g0 > g1 ? (live ? '🏆 ' + TN(0) : L.win) : g0 < g1 ? (live ? '🏆 ' + TN(1) : L.lose) : L.draw;
  bigText(L.ft, res + '  ' + g0 + ' - ' + g1, 4.4, g0 === g1 ? '#fff' : TC(g0 > g1 ? 0 : 1));
  if (st.league) finishWeek(g0, g1);
  if (!live && st.quick) { if (g0 > g1) { lvl++; store.set('lv', lvl); } }
  const mvp = [...st.contrib.entries()].filter(([n]) => n !== L.you).sort((x, y) => y[1].n - x[1].n)[0];
  if (live && mvp) feedAdd('⭐ ' + LVR.mvp + ': @' + mvp[0], TC(mvp[1].s));
  renderAtt();
 }

 /* ---------- player movement and animation ---------- */
 const v1 = new T3.Vector3(), v2 = new T3.Vector3();
 function targets() {
  const a = st.poss, dirA = a ? -1 : 1, carrying = ball.mode === 'carry' && ball.car;
  const chase = st.phase === 'play' || st.phase === 'chance' || st.phase === 'shot';
  for (const s of [0, 1]) {
   const dir = s ? -1 : 1, bn = ball.pos.x * dir, attacking = s === a;
   const shift = attacking ? clamp(bn * .62 + 6, -4, 17) : clamp(bn * .6 - 1, -9, 12);
   for (const p of P[s]) {
    const f = FORM[p.idx];
    if (p.gk) {
     const gx = dir * -(HL - .9), dz = clamp(ball.pos.z * .35, -GW + .3, GW - .3);
     const close = (st.phase === 'chance' || st.phase === 'shot') && s !== a ? 1.6 : 0;
     p.tgt.set(gx + dir * close, 0, dz * (close ? 1.4 : 1));
     continue;
    }
    let x = f[0] + shift, z = f[1] * .86 + ball.pos.z * .28 + Math.sin(st.time * .4 + p.sway) * .9;
    if (!attacking) x = Math.min(x, bn + 6);
    p.tgt.set(dir * clamp(x, -HL + 2, HL - 2), 0, clamp(z, -HW + 1, HW - 1));
   }
   if (!chase) continue;
   if (!attacking) {
    // the two nearest defenders press the ball
    const near = outfield(s).sort((p, q) => p.pos.distanceToSquared(ball.pos) - q.pos.distanceToSquared(ball.pos));
    if (near[0]) near[0].tgt.set(ball.pos.x - dirA * 1.3, 0, ball.pos.z + .4);
    if (near[1]) near[1].tgt.set(ball.pos.x - dirA * 4, 0, (ball.pos.z + near[1].tgt.z) / 2);
   }
  }
  if (carrying && chase && ball.car.side === a && !ball.car.gk) {
   const c = ball.car;
   if (st.phase === 'chance') c.tgt.set(dirA * (HL - 6.5), 0, clamp(c.pos.z * .6, -4, 4));
   else { const want = dirA * lerp(-14, 21, clamp(st.bar / 11, 0, 1)); c.tgt.set(want, 0, lerp(c.pos.z, st.laneZ, .02)); }
  }
 }
 function movePlayers(dt) {
  const lookPt = ball.pos;
  for (const s of [0, 1]) for (const p of P[s]) {
   const carrier = ball.car === p && ball.mode === 'carry';
   if (p.cel > 0) {
    p.cel -= dt;
    const c = st.cine && st.cine.p;
    if (c === p) { p.tgt.set(p.pos.x + Math.sign(p.pos.x || 1) * .5, 0, p.pos.z + (p.pos.z > 0 ? .4 : -.4)); }
    else if (c) { p.tgt.set(c.pos.x - (c.side ? -1 : 1) * 1.2 + Math.sin(p.idx) * 1.2, 0, c.pos.z + Math.cos(p.idx) * 1.2); }
   }
   v1.subVectors(p.tgt, p.pos); v1.y = 0;
   const dist = v1.length();
   const maxSp = p.gk ? 6 : carrier ? 7.2 : (st.phase === 'goal' ? 6.5 : 8);
   const want = Math.min(maxSp, dist * 2.4);
   if (dist > .001) v1.multiplyScalar(want / dist); else v1.set(0, 0, 0);
   p.vel.lerp(v1, 1 - Math.exp(-dt * 4));
   p.pos.addScaledVector(p.vel, dt);
   const sp = p.vel.length();
   // facing: run direction when moving, the ball when standing
   let face = p.face;
   if (sp > .6) face = Math.atan2(p.vel.x, p.vel.z);
   else { v2.subVectors(lookPt, p.pos); face = Math.atan2(v2.x, v2.z); }
   let df = ((face - p.face + Math.PI * 3) % TAU) - Math.PI; p.face += df * (1 - Math.exp(-dt * 8));
   // animation
   const k = clamp(sp / 7, 0, 1);
   p.ph += dt * (3 + sp * 1.55);
   const sw = Math.sin(p.ph);
   p.legs[0].hp.rotation.x = sw * .85 * k; p.legs[1].hp.rotation.x = -sw * .85 * k;
   p.legs[0].kn.rotation.x = (Math.max(0, -Math.sin(p.ph - .6))) * 1.2 * k; p.legs[1].kn.rotation.x = (Math.max(0, Math.sin(p.ph - .6))) * 1.2 * k;
   p.arms[0].sh.rotation.x = -sw * .7 * k; p.arms[1].sh.rotation.x = sw * .7 * k;
   p.arms[0].el.rotation.x = p.arms[1].el.rotation.x = -.5 - .6 * k;
   p.arms[0].sh.rotation.z = p.arms[1].sh.rotation.z = 0;
   p.body.position.y = Math.abs(Math.cos(p.ph)) * .05 * k;
   p.hips.rotation.x = .16 * k;
   if (p.kick > 0) { p.kick -= dt; const kk = Math.sin((1 - p.kick / .3) * Math.PI); p.legs[1].hp.rotation.x = -1.3 * kk; p.legs[1].kn.rotation.x = .2; }
   if (p.cel > 0 && st.phase === 'goal') { // arms up
    p.arms[0].sh.rotation.z = -2.6; p.arms[1].sh.rotation.z = 2.6; p.arms[0].sh.rotation.x = p.arms[1].sh.rotation.x = 0; p.arms[0].el.rotation.x = p.arms[1].el.rotation.x = 0;
   }
   let rz = 0, ry = 0;
   if (p.dive > 0) { p.dive -= dt; const t = 1 - clamp(p.dive / .45, 0, 1); rz = -p.diveDir * 1.35 * Math.sin(Math.min(1, t * 1.6) * Math.PI / 2); p.pos.z += p.diveDir * dt * 4.5 * (1 - t); ry = .4; }
   p.root.position.copy(p.pos); p.root.position.y = p.dive > 0 ? .25 * Math.sin((1 - p.dive / .45) * Math.PI) : 0;
   p.root.rotation.set(0, p.face, 0); p.root.rotateZ(rz);
   p.shadow.position.set(p.pos.x, .02, p.pos.z);
   if (p.tagT > 0) { p.tagT -= dt; if (p.tagT <= 0 && p.tag) { p.tag.remove(); p.tag = null; } }
  }
 }
 function setTag(p, txt, dur, hot) {
  if (!p) return;
  if (!p.tag) { p.tag = el('div', 'cf-np'); labels.appendChild(p.tag); }
  p.tag.textContent = txt; p.tag.className = 'cf-np' + (hot ? ' hot' : ''); p.tag.style.setProperty('--c', TC(p.side)); p.tagT = dur;
 }
 const tagV = new T3.Vector3();
 function setName(p, name, star) {
  p.who = name || '';
  if (!name) { if (p.nm) { p.nm.remove(); p.nm = null; } return; }
  if (!p.nm) { p.nm = el('div', 'cf-nm'); labels.appendChild(p.nm); }
  const t = (star ? '⭐ ' : '') + '@' + name.slice(0, 12);
  if (p.nm.textContent !== t) p.nm.textContent = t;
  p.nm.style.setProperty('--c', TC(p.side)); p.nm.classList.toggle('st', !!star);
 }
 function placeTags() {
  const W = host.clientWidth, H = host.clientHeight;
  for (const s of [0, 1]) for (const p of P[s]) {
   if (p.nm) {
    tagV.set(p.pos.x, 1.42, p.pos.z).project(camera);
    const vis = tagV.z < 1 && !p.tag;
    p.nm.style.display = vis ? '' : 'none';
    if (vis) { p.nm.style.left = ((tagV.x + 1) / 2 * W).toFixed(1) + 'px'; p.nm.style.top = ((1 - tagV.y) / 2 * H).toFixed(1) + 'px'; }
   }
   if (!p.tag) continue;
   tagV.set(p.pos.x, 1.6, p.pos.z).project(camera);
   const vis = tagV.z < 1;
   p.tag.style.display = vis ? '' : 'none';
   if (vis) { p.tag.style.left = ((tagV.x + 1) / 2 * W).toFixed(1) + 'px'; p.tag.style.top = ((1 - tagV.y) / 2 * H).toFixed(1) + 'px'; }
  }
 }
 function moveBall(dt) {
  if (ball.mode === 'carry' && ball.car) {
   const c = ball.car, f = c.face;
   const tx = c.pos.x + Math.sin(f) * .42, tz = c.pos.z + Math.cos(f) * .42;
   ball.pos.x = lerp(ball.pos.x, tx, 1 - Math.exp(-dt * 14)); ball.pos.z = lerp(ball.pos.z, tz, 1 - Math.exp(-dt * 14)); ball.pos.y = .13;
   ball.spin += c.vel.length() * dt * 7;
  } else if (ball.mode === 'fly') {
   ball.t += dt; const t = clamp(ball.t / ball.T, 0, 1);
   ball.pos.lerpVectors(ball.from, ball.to, t); ball.pos.y = lerp(ball.from.y, ball.to.y, t) + Math.sin(t * Math.PI) * ball.h;
   ball.spin += dt * 20;
   if (t >= 1) { const d = ball.done; ball.done = null; ball.mode = 'carry'; if (d) d(); }
  } else if (ball.mode === 'free') {
   if (ball.vel) { ball.pos.addScaledVector(ball.vel, dt); ball.vel.multiplyScalar(Math.exp(-dt * 3)); }
   ball.pos.y = Math.max(.13, ball.pos.y - dt * 2);
  }
  ballM.position.copy(ball.pos); ballM.rotation.x = ball.spin; ballM.rotation.z = ball.spin * .3;
  ballSh.position.set(ball.pos.x, .02, ball.pos.z); ballSh.scale.setScalar(.45 / (1 + ball.pos.y * .4));
  for (const s of [-1, 1]) { const n = nets[s]; if (n.t > 0) { n.t = Math.max(0, n.t - dt * 1.4); n.g.scale.x = 1 + Math.sin(n.t * Math.PI) * .35; } }
 }

 /* ---------- main step ---------- */
 st.time = 0; st.bounce = 0;
 let hudT = 0;
 function step(dt) {
  st.time += dt;
  if (banT > 0 && (banT -= dt) <= 0) ban.className = 'cf-ban off';
  if (bigT > 0 && (bigT -= dt) <= 0) big.className = 'cf-big off';
  powers(dt);
  const ph = st.phase;
  if (ph === 'kick') { st.t -= dt; if (st.t <= 0) { st.phase = 'play'; beep('whistle'); bigText(L.kick, '', .8); } }
  else if (ph === 'play') {
   st.clock += dt * 90 / (live ? clamp(+CFG.matchSec || 90, 60, 300) : 90);
   engine(dt);
   if (st.clock >= 90 && st.phase === 'play') fullTime();
  } else if (ph === 'chance') { st.t -= dt; duelStep(dt); }
  else if (ph === 'shot') { st.t -= dt; if (st.t <= 0) restartAfter('save'); }
  else if (ph === 'goal') { st.t -= dt; if (st.t <= 0) { if (st.clock >= 90) fullTime(); else restartAfter('goal'); } }
  else if (ph === 'save') { st.t -= dt; if (st.t <= 0) { if (st.clock >= 90) fullTime(); else restartAfter('save'); } }
  else if (ph === 'ft') { st.t -= dt; if (st.t <= 0) afterFT(); }
  else if (ph === 'table') { st.t -= dt; if (live) { const s = Math.ceil(st.t); const e = ov.querySelector('[data-cd]'); if (e) e.textContent = s; } if (st.t <= 0) nextMatch(); }
  else if (ph === 'intro') { st.t -= dt; const e = ov.querySelector('[data-cd]'); if (e) e.textContent = Math.max(0, Math.ceil(st.t)); if (st.t <= 0) { ov.hidden = true; st.phase = 'kick'; st.t = 1; } }
  else if (ph === 'champ') { st.t -= dt; if (st.t <= 0) { LG = newLeague(LG.season + 1); saveLG(); nextMatch(); } }
  targets(); movePlayers(dt); moveBall(dt);
  if (st.bounce > 0) { st.bounce -= dt; stands.position.y = Math.abs(Math.sin(st.time * 11)) * .35 * Math.min(1, st.bounce); } else stands.position.y = 0;
  boardTexs.forEach(t => t.offset.x = (t.offset.x + dt * .035) % 1);
  updCam(dt);
  if ((hudT -= dt) <= 0) { hudT = .1; renderBug(); renderAtt(); if (!live) updTap(); else liveHud(); }
 }

 /* ---------- standings ---------- */
 function tableHTML(max) {
  const ord = order(), me = 0;
  let rows = ord.map((i, r) => ({ i, r }));
  if (max && rows.length > max) { const mine = rows.find(x => x.i === me); rows = rows.slice(0, max); if (!rows.includes(mine)) rows[rows.length - 1] = mine; }
  return `<table class="cf-tb"><tr><th>#</th><th></th>${L.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${rows.map(({ i, r }) => { const t = LG.tb[i]; return `<tr class="${i === me ? 'me' : ''}"><td>${r + 1}</td><td class="n"><i style="background:${TEAMS[i].color}"></i>${esc(TEAMS[i].name)}</td><td>${t.p}</td><td>${t.w}</td><td>${t.d}</td><td>${t.l}</td><td>${t.gf - t.ga > 0 ? '+' : ''}${t.gf - t.ga}</td><td class="p">${pts(t)}</td></tr>`; }).join('')}</table>`;
 }
 function scorersHTML(n) { const s = topScorers(n); return s.length ? `<div class="cf-gs">⚽ ${esc(L.scorers)}: ${s.map(([nm, v]) => `${esc((live ? '@' : '') + nm)} ${v.g}`).join(' · ')}</div>` : ''; }
 function standingsPNG() {
  const n = LG.n, rh = n > 10 ? 46 : 58, W = 1080, H = 1350;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#0d1a3a'); bg.addColorStop(1, '#050914'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.fillStyle = '#2f7a35'; g.fillRect(0, 0, W, 12);
  g.textBaseline = 'middle'; g.fillStyle = '#9fe870'; g.font = '800 30px system-ui,sans-serif'; g.fillText((clip(CFG.lg, 40) || L.name).toUpperCase(), 60, 70);
  g.fillStyle = '#fff'; g.font = '800 64px system-ui,sans-serif'; g.fillText(L.table, 60, 130);
  g.fillStyle = '#9aa6c4'; g.font = '700 26px system-ui,sans-serif'; g.fillText(fmt(L.season, { n: LG.season }) + ' · ' + fmt(L.week, { n: Math.min(LG.week, LG.sched.length) }), 60, 182);
  const y0 = 240, colX = [600, 670, 740, 810, 890, 990];
  g.font = '800 22px system-ui,sans-serif'; g.fillStyle = '#9aa6c4'; L.cols.forEach((t, i) => { g.textAlign = 'center'; g.fillText(t, colX[i], y0); }); g.textAlign = 'left';
  order().forEach((i, r) => {
   const y = y0 + 40 + r * rh, t = LG.tb[i];
   if (i === 0) { g.fillStyle = 'rgba(159,232,112,.16)'; g.fillRect(40, y - rh / 2 + 3, W - 80, rh - 6); }
   g.fillStyle = '#9aa6c4'; g.font = '800 26px system-ui,sans-serif'; g.fillText(String(r + 1), 60, y);
   g.fillStyle = TEAMS[i].color; g.fillRect(110, y - 13, 26, 26);
   g.fillStyle = '#fff'; g.font = '700 28px system-ui,sans-serif'; g.fillText(TEAMS[i].name.slice(0, 22), 152, y);
   [t.p, t.w, t.d, t.l, (t.gf - t.ga > 0 ? '+' : '') + (t.gf - t.ga), pts(t)].forEach((v, k) => { g.textAlign = 'center'; g.font = (k === 5 ? '800 30px' : '700 26px') + ' system-ui,sans-serif'; g.fillStyle = k === 5 ? '#fff' : '#c7d2ee'; g.fillText(String(v), colX[k], y); });
   g.textAlign = 'left';
  });
  const sc = topScorers(5);
  if (sc.length) { let y = y0 + 40 + n * rh + 30; g.fillStyle = '#ffc93c'; g.font = '800 28px system-ui,sans-serif'; g.fillText('⚽ ' + L.scorers, 60, y); g.font = '700 24px system-ui,sans-serif'; g.fillStyle = '#dce4f7'; g.fillText(sc.map(([nm, v]) => '@' + nm + ' ' + v.g).join('   ·   '), 60, y + 40); }
  g.fillStyle = '#6f7da3'; g.font = '700 22px system-ui,sans-serif'; g.fillText('Chat FC · pickradar.net', 60, H - 40);
  const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = 'chat-fc-standings.png'; document.body.appendChild(a); a.click(); a.remove();
 }

 /* ---------- normal mode: menus and the tap button ---------- */
 let lvl = store.get('lv', 1), paused = false;
 let tapBtn = null, hintEl = null;
 function showOv(html) { ov.innerHTML = html; ov.hidden = false; }
 function menu() {
  st.phase = 'idle';
  const lgTxt = LG.week > 0 && !seasonOver() ? fmt(L.cont, { n: LG.week + 1 }) : fmt(L.leagueN, { n: 6 });
  showOv(`<h2>${esc(L.name)}<span>${esc(L.sub.toUpperCase())}</span></h2><p>${esc(L.intro)}</p>
<div class="row"><button class="cf-btn" data-a="quick">▶ ${esc(L.quick)} · ${esc(fmt(L.lv, { n: lvl }))}</button><button class="cf-btn g" data-a="league">🏆 ${esc(lgTxt)}</button></div>`);
 }
 function quickMatch() {
  const pool = POOL[lang] || POOL.en;
  const opp = { i: -1, name: pool[(lvl - 1) % pool.length], color: KIT[(lvl * 5) % KIT.length], str: 1, code: '' };
  if (cdist(opp.color, TEAMS[0].color) < 110) opp.color = '#2f7fe0';
  st.quick = true; st.league = false; st.cpu = Math.min(8, 3 + .4 * (lvl - 1));
  ov.hidden = true; startMatch(TEAMS[0], opp);
 }
 function leagueMatch() {
  if (seasonOver()) { LG = newLeague(LG.season + 1); saveLG(); }
  const o = TEAMS[oppIndex()];
  st.quick = false; st.league = true; st.cpu = 3.3 * o.str + .15 * LG.week;
  ov.hidden = true; startMatch(TEAMS[0], o);
 }
 function afterFT() {
  if (live) {
   if (st.league && seasonOver()) { st.phase = 'champ'; st.t = 12; const w = order()[0]; showOv(`<div class="cf-tt">🏆 ${esc(fmt(L.champ, { t: TEAMS[w].name }))}<small>${esc(fmt(L.season, { n: LG.season }))}</small></div>${tableHTML(10)}${scorersHTML(3)}`); beep('roar'); return; }
   st.phase = 'table'; st.t = clamp(+CFG.breakSec || 15, 5, 60);
   const lgN = clip(CFG.lg, 36) || L.name;
   showOv(`<div class="cf-tt">${esc(CFG.mode === 'derby' ? lgN : L.table)}<small>${esc(lgN)}${LG.n > 2 ? ' · ' + esc(fmt(L.week, { n: LG.week })) : ''} · ${esc(L.next)}: <span data-cd>${Math.ceil(st.t)}</span></small></div>${tableHTML(10)}${scorersHTML(3)}`);
   return;
  }
  st.phase = 'over';
  const [g0, g1] = st.sc, res = g0 > g1 ? L.win : g0 < g1 ? L.lose : L.draw;
  let extra = '';
  if (st.league) extra = seasonOver() ? `<div class="cf-tt">🏆 ${esc(fmt(L.champ, { t: TEAMS[order()[0]].name }))}</div>${tableHTML()}${scorersHTML(3)}` : tableHTML() + scorersHTML(3);
  showOv(`<h2>${esc(res)}<span>${esc(TN(0))} ${g0} - ${g1} ${esc(TN(1))}</span></h2>${extra}
<div class="row"><button class="cf-btn" data-a="${st.league ? 'league' : 'quick'}">▶ ${esc(st.league ? (seasonOver() ? L.newSeason : L.next) : (g0 > g1 ? L.next : L.again))}</button><button class="cf-btn g" data-a="menu">${esc(L.menu)}</button></div>`);
 }
 function nextMatch() {
  ov.hidden = true;
  if (live && CFG.mode === 'derby') { TEAMS = buildTeams(2); startMatch(TEAMS[0], TEAMS[1]); st.league = true; return; }
  if (seasonOver()) { LG = newLeague(LG.season + 1); saveLG(); }
  TEAMS = buildTeams(LG.n);
  st.league = true; startMatch(TEAMS[0], TEAMS[oppIndex()]);
 }
 ov.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  beep('pop');
  const a = b.dataset.a;
  if (a === 'quick') quickMatch(); else if (a === 'league') leagueMatch(); else if (a === 'menu') menu(); else if (a === 'resume') { paused = false; ov.hidden = true; }
 });
 function tap() {
  if (live || paused) return;
  const now = st.time; st.tapT = st.tapT.filter(t => now - t < 1); if (st.tapT.length >= 12) return; st.tapT.push(now);
  if (st.phase === 'play' || st.phase === 'chance') { addC(0, 1, L.you); beep('tick'); if (tapBtn) { tapBtn.style.transform = 'translateX(-50%) scale(.93)'; setTimeout(() => tapBtn && (tapBtn.style.transform = ''), 70); } }
 }
 function updTap() {
  if (!tapBtn) return;
  const playing = ['play', 'chance', 'kick', 'shot'].includes(st.phase);
  tapBtn.style.display = hintEl.style.display = playing ? '' : 'none';
  const chance = st.phase === 'chance', mine = st.poss === 0;
  tapBtn.textContent = chance ? (mine ? L.shoot : L.save) : mine ? L.pass : L.press;
  tapBtn.className = 'cf-btn cf-tap' + (chance ? ' s' : mine ? '' : ' d');
  hintEl.textContent = chance ? (mine ? L.shootTap : L.saveTap) : L.hint;
 }
 function normalUI() {
  tapBtn = el('button', 'cf-btn cf-tap', L.pass); tapBtn.type = 'button'; ui.appendChild(tapBtn);
  hintEl = el('div', 'cf-hint', esc(L.hint)); ui.appendChild(hintEl);
  tapBtn.addEventListener('pointerdown', e => { e.preventDefault(); tap(); });
  renderer.domElement.addEventListener('pointerdown', () => tap());
  global.addEventListener('keydown', e => { if (e.code === 'Space' || e.code === 'Enter') { const r = host.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; e.preventDefault(); tap(); } if (e.code === 'KeyP' || e.code === 'Escape') togglePause(); });
  const mute = el('button', 'cf-btn g cf-icon', muted ? '🔇' : '🔊'); mute.type = 'button'; mute.style.right = '58px'; ui.appendChild(mute);
  mute.addEventListener('click', () => { muted = !muted; store.set('mute', muted); mute.textContent = muted ? '🔇' : '🔊'; });
  const pb = el('button', 'cf-btn g cf-icon', 'Ⅱ'); pb.type = 'button'; ui.appendChild(pb);
  pb.addEventListener('click', togglePause);
 }
 function togglePause() {
  if (live || !['play', 'chance', 'kick', 'shot', 'goal', 'save'].includes(st.phase)) return;
  paused = !paused;
  if (paused) showOv(`<h2>${esc(L.paused)}</h2><div class="row"><button class="cf-btn" data-a="resume">▶ ${esc(L.resume)}</button><button class="cf-btn g" data-a="menu">${esc(L.menu)}</button></div>`); else ov.hidden = true;
 }
 // stop the match while the page is hidden
 document.addEventListener('visibilitychange', () => { if (document.hidden && !live && !paused && ['play', 'chance'].includes(st.phase)) togglePause(); });

 /* ======================= LIVE MODE ======================= */
 const LV = Object.assign({}, SRC_TXT.en, SRC_TXT[lang]);
 const LVR = Object.assign({}, LIVE_FC.en, LIVE_FC[lang]);
 Object.assign(LV, LVR);
 const SAVED = clean ? {} : store.get('livesrc', {});
 const SRC = { kind: 'sim', on: false, ws: null, st: 'off', msg: '', retry: 0, t: null, n: 0, gen: 0,
  opt: { port: Math.round(+QS.get('port')) || 21213, ch: QS.get('ch') || SAVED.ch || '', yk: QS.get('yk') || SAVED.yk || '', yv: QS.get('yv') || SAVED.yv || '', ss: QS.get('ss') || SAVED.ss || '' } };
 const srcWant = QS.get('src') || SAVED.kind || '';
 const demoMode = QS.get('demo') === '1' && !srcWant;
 const LS = { users: new Map(), fans: [new Set(), new Set()], seen: new Set(), seenQ: [], log: [], autoT: 0, auto: demoMode, n: 0, last: null };
 const BAD_WORDS = ['fuck', 'shit', 'bitch', 'dick', 'cunt', 'nigg', 'fag', 'whore', 'slut', 'amk', 'aq', 'orospu', 'sik', 'piç', 'pic', 'yarrak', 'göt', 'got', 'ibne', 'puta', 'mierda', 'pendej', 'caralho', 'porra', 'anjing', 'bangsat', 'kontol', 'memek'];
 const blockList = () => String(CFG.block || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
 function cleanText(t, max) {
  t = String(t || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[<>]/g, '').trim().slice(0, max || 46);
  for (const w of BAD_WORDS.concat(blockList())) if (w) t = t.replace(new RegExp('(^|[^\\p{L}])(' + [...w].map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '+').join('') + ')(?=$|[^\\p{L}])', 'giu'), (m, a, b) => a + '*'.repeat(b.length));
  return t;
 }
 const cleanName = n => { const c = cleanText(String(n || '').replace(/^@/, ''), 18); return c.includes('*') ? 'viewer' : c || 'viewer'; };
 const isCoins = () => SRC.kind === 'sim' || SRC.kind === 'tikfinity';
 const norm = x => String(x || '').toLocaleLowerCase('tr').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').toLowerCase();
 function teamWord(text) {
  const words = norm(text).split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 1 && (words[0] === '1' || words[0] === '2')) return +words[0] - 1;
  const has = s => { const t = st.teams[s]; const keys = [norm(t.code)].concat(norm(t.name).split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !['fc', 'sk', 'fk', 'spor', 'cf', 'ec', 'united', 'city'].includes(w))); return keys.some(k => words.includes(k)); };
  const a = has(0), b = has(1);
  return a && !b ? 0 : b && !a ? 1 : null;
 }
 function resetFans() {
  // a new opponent every match: its fans join again; home fans stay
  for (const u of LS.users.values()) if (u.side === 1 && !(CFG.mode === 'derby')) u.side = null;
  LS.fans = [new Set(), new Set()]; for (const u of LS.users.values()) if (u.side != null) LS.fans[u.side].add(u.id);
 }
 function joinSide(u, want) {
  const now = performance.now();
  if (want != null && want !== u.side && (u.side == null || now - (u.swT || 0) > 15000)) {
   if (u.side != null) LS.fans[u.side].delete(u.id);
   u.side = want; u.swT = now; LS.fans[want].add(u.id); beep('pop');
   feedAdd(fmt(LVR.joined, { u: u.name, t: TN(want) }), TC(want));
  } else if (u.side == null) {
   const s = CFG.mode === 'derby' ? (LS.fans[0].size <= LS.fans[1].size ? 0 : 1) : 0;
   u.side = s; LS.fans[s].add(u.id);
  }
  return u.side;
 }

 /* --- overlay --- */
 let lv = null;
 function liveUI() {
  css.textContent += `
.cf-stage{position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden}
.lv-top{position:absolute;left:10px;right:10px;top:10px;display:flex;gap:6px;align-items:center;pointer-events:none}
.lv-pill{font:800 12px system-ui,sans-serif;letter-spacing:1px;padding:4px 10px;border-radius:999px;background:#ff3b5c;color:#fff}
.lv-mode:empty{display:none}.lv-mode{font:800 11px system-ui,sans-serif;letter-spacing:1px;padding:4px 9px;border-radius:999px;background:#ffc93c;color:#10172b}
.cf.lv .cf-bug{top:40px}.cf.lv .cf-bug .tm{font-size:17px;padding:5px 8px}.cf.lv .cf-bug .tm span{max-width:112px}.cf.lv .cf-bug .sc{font-size:22px;padding:0 9px}.cf.lv .cf-bug .mn{min-width:34px;font-size:13px}.cf.lv .cf-sub{top:82px}.cf.lv .cf-att,.cf.lv .cf-duel{top:104px}.cf.lv .cf-ban{top:158px}.cf.lv .cf-feed{top:196px}
.lv-leg{position:absolute;left:10px;right:10px;bottom:10px;padding:9px 10px;border-radius:12px;background:rgba(10,16,34,.88);color:#fff}
.lv-leg h4{margin:0 0 6px;text-align:center;font:800 12px system-ui,sans-serif;letter-spacing:1px;color:#9fe870;text-transform:uppercase}
.lv-leg .k{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lv-leg .k div{text-align:center;padding:5px 4px 4px;border-radius:10px;line-height:1;overflow:hidden}
.lv-leg .k b{display:block;font-size:30px;letter-spacing:1px}
.lv-leg .k span{display:block;font:700 11.5px system-ui,sans-serif;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.92}
.lv-leg .g{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;margin-top:7px;font:700 11.5px/1.25 system-ui,sans-serif;color:#dce4f7}
.lv-leg .ht{display:block;height:5px;margin:4px 6px 0;border-radius:3px;background:rgba(0,0,0,.28);overflow:hidden}.lv-leg .ht i{display:block;height:100%;width:0;background:#ffc93c}
.lv-leg .n{margin-top:5px;text-align:center;font:600 10.5px system-ui,sans-serif;color:#9aa6c4}
.lv-intro{display:flex;flex-direction:column;align-items:center;gap:10px}
.lv-intro .vs{display:flex;align-items:center;gap:14px;font-weight:800;font-size:34px;text-transform:uppercase}
.lv-intro .vs div{display:flex;flex-direction:column;align-items:center;gap:6px;max-width:42vw}
.lv-intro .vs i{display:block;width:54px;height:54px;border-radius:12px;box-shadow:0 0 0 3px rgba(255,255,255,.25)}
.lv-intro .vs span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.lv-intro .cd{font-weight:800;font-size:22px;color:#9fe870}
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
  lv.top = el('div', 'lv-top', `<span class="lv-pill">LIVE</span><span class="lv-mode"></span>`);
  lv.leg = el('div', 'lv-leg');
  ui.appendChild(lv.top); ui.appendChild(lv.leg);
  renderLegend(); modeLabel();
 }
 function modeLabel() {
  if (!lv) return;
  lv.top.querySelector('.lv-mode').textContent = SRC.on ? (SRC.st === 'on' ? '' : SHORT[SRC.kind].toUpperCase() + '…') : LS.auto ? LV.demo : LV.sim;
 }
 const coinTxt = c => isCoins() ? String(c) : '$' + (c / 75).toFixed(2);
 function renderLegend() {
  if (!lv) return;
  lv.leg.innerHTML = `<h4>${esc(LVR.legendH)}</h4><div class="k">${[0, 1].map(s => `<div style="background:${TC(s)};color:${lum(TC(s)) > .6 ? '#10172b' : '#fff'}"><b>${esc(st.teams[s].code)}</b><span>${s + 1} · ${esc(TN(s))} · ${esc(fmt(LVR.fans, { n: LS.fans[s].size }))}</span><em class="ht"><i data-h="${s}"></i></em></div>`).join('')}</div>
<div class="n" style="margin:4px 0 0">${esc(LVR.or12)} · ${esc(LVR.any)}</div>
<div class="g"><div>${esc(LVR.gSup)}</div><div>${esc(LVR.gFire)}</div><div>${esc(fmt(LVR.gStar, { c: coinTxt(CFG.starC) }))}</div><div>${esc(fmt(LVR.gFk, { c: coinTxt(CFG.fkC) }))}</div></div>
<div class="n">${esc(LVR.fair)}</div>`;
  lv.legKey = [st.teams[0].code, st.teams[1].code, LS.fans[0].size, LS.fans[1].size, st.kit.join()].join('|');
 }
 function liveHud() {
  if (!lv) return;
  const k = [st.teams[0].code, st.teams[1].code, LS.fans[0].size, LS.fans[1].size, st.kit.join()].join('|');
  if (k !== lv.legKey) renderLegend();
  lv.leg.querySelectorAll('[data-h]').forEach(i => { const s2 = +i.dataset.h; i.style.width = (st.fire[s2] > 0 ? 100 : clamp(st.heat[s2] / heatThr() * 100, 0, 100)).toFixed(0) + '%'; i.style.background = st.fire[s2] > 0 ? '#ff6b5b' : '#ffc93c'; });
  if ((st.xiT -= .1) <= 0) { st.xiT = 1.5; assignXI(); }
  const tot = LS.fans[0].size + LS.fans[1].size, share = tot ? LS.fans[0].size / tot : -1, ck = st.kit.join() + '|' + (share < 0 ? 'x' : Math.round(share * 10));
  if (ck !== LS.crowdKey && (share >= 0 || LS.crowdKey)) { LS.crowdKey = ck; if (share < 0) recolorCrowd(.5, st.kit[0], st.kit[1]); else recolorCrowd(share, st.kit[0], st.kit[1]); }
 }
 // the 11 players of each team carry the names of that team's most active viewers; a star gifter plays up front
 const XI_ORDER = [9, 10, 6, 7, 5, 8, 2, 3, 1, 4, 0];
 function assignXI() {
  const now = performance.now();
  for (const s of [0, 1]) {
   const act = [...LS.fans[s]].map(id => LS.users.get(id)).filter(u => u && now - (u.lastAct || 0) < 30000);
   const names = new Set(act.map(u => u.name));
   const star = st.star[s] > 0 ? st.starBy[s] : '';
   const keep = P[s].map(p => p.who && names.has(p.who) && p.who !== star ? p.who : '');
   if (star) { const i = keep.indexOf(star); if (i >= 0) keep[i] = ''; keep[9] && keep[9] !== star && (keep[keep.findIndex((x, j) => !x && j !== 9 && j !== 0)] = keep[9]); keep[9] = star; }
   const used = new Set(keep.filter(Boolean));
   const pool = act.filter(u => !used.has(u.name)).sort((a, b) => (b.cnt || 0) - (a.cnt || 0) || (b.lastAct || 0) - (a.lastAct || 0));
   for (const i of XI_ORDER) if (!keep[i] && pool.length) keep[i] = pool.shift().name;
   P[s].forEach((p, i) => setName(p, keep[i], !!star && i === 9));
  }
 }
 // the stand fills from comments, likes and gifts; when full the team gets a short fixed boost (6 s, +15%)
 const heatThr = () => clamp((LS.evRate || 0) * 18, 22, 400);
 function addHeat(s, w) {
  if (!['play', 'chance', 'kick', 'shot'].includes(st.phase) || st.fire[s] > 0) return;
  st.heat[s] += w;
  if (st.heat[s] >= heatThr()) {
   st.heat[s] = 0; st.fire[s] = 6; st.bounce = 3;
   banner(fmt(LVR.fire, { t: TN(s) }), TC(s), 3); feedAdd(fmt(LVR.fire, { t: TN(s) }), TC(s)); beep('roar');
  }
 }
 function showIntro() {
  const [h, a] = st.teams;
  const lgN = clip(CFG.lg, 36) || L.name;
  showOv(`<div class="lv-intro"><div class="cf-tt">${esc(lgN)}<small>${LG.n > 2 ? esc(fmt(L.season, { n: LG.season }) + ' · ' + fmt(L.week, { n: LG.week + 1 })) : ''}</small></div>
<div class="vs"><div><i style="background:${st.kit[0]}"></i><span>${esc(h.name)}</span></div><small style="font-size:22px;color:#9aa6c4">VS</small><div><i style="background:${st.kit[1]}"></i><span>${esc(a.name)}</span></div></div>
<div class="cf-tt" style="font-size:24px">${esc(LVR.introH)}</div>
<div class="cd">${esc(LVR.introS).replace('{s}', '<span data-cd>10</span>')}</div></div>`);
  renderLegend();
 }

 /* --- creator panel --- */
 let pn = null;
 function livePanel() {
  pn = el('aside', 'lv-panel');
  const sel = (k, opts2) => `<select data-k="${k}" style="padding:5px 7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:700 13px system-ui,sans-serif">${opts2.map(([v, t]) => `<option value="${v}"${String(CFG[k]) === String(v) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  pn.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><h3>${esc(LV.panelH)}</h3><a class="lv-btn g" href="${location.pathname}">${esc(LV.back)}</a></div>
<div class="note"></div>
<h5>${esc(LV.source)}</h5><div class="lv-srcs"></div>
<h5>${esc(LV.simH)}</h5>
<div class="lv-sim">
<button data-s="ch" style="background:#ff9a8a"></button><button data-s="ca" style="background:#8cc0ff"></button><button data-s="c" style="background:#eef1f8">${esc(LVR.sAny)}</button>
<button data-s="like" style="background:#ffb3a7">+100 ♥</button><button data-s="g1" style="background:#ff8fb1">🎁 1</button><button data-s="g99" style="background:#ffc93c">🎁 99</button>
<button data-s="g299" style="background:#b39ddb">🎁 299</button><button data-s="g999" style="background:#ff6b5b">🎁 999</button><button data-s="follow" style="background:#c9f2c7">${esc(LV.sFollow)}</button>
</div>
<div class="lv-row"><label><input type="checkbox" data-c="auto"${LS.auto ? ' checked' : ''}> ${esc(LVR.auto)}</label></div>
<h5>${esc(LVR.cfgH)}</h5>
<div class="lv-row"><label>${esc(LVR.modeL)}</label>${sel('mode', [['league', LVR.mLeague], ['derby', LVR.mDerby]])}</div>
<div class="lv-row"><label>${esc(LVR.lgSize)}</label>${sel('size', [[6, '6'], [10, '10'], [18, '18']])}</div>
<div class="lv-row"><input type="text" maxlength="36" data-k="lg" value="${esc(CFG.lg)}" placeholder="${esc(LVR.lgName)}"></div>
<div class="lv-team" style="margin-top:8px;padding:8px;border-radius:10px;background:#151c30"><b>${esc(LVR.homeH)}</b>
<div class="lv-row"><input type="text" maxlength="18" data-k="nH" value="${esc(CFG.nH)}" placeholder="${esc(LVR.tName)}"><input type="color" data-k="cH" value="${esc(hexOk(CFG.cH) ? CFG.cH : '#e94f37')}" title="${esc(LVR.tColor)}" style="width:44px;height:30px;padding:0;border:0;background:none;flex:none"></div>
<div class="lv-row"><input type="text" maxlength="8" data-k="kH" value="${esc(CFG.kH)}" placeholder="${esc(LVR.tCode)}"></div></div>
<div class="lv-team" style="margin-top:6px;padding:8px;border-radius:10px;background:#151c30"><b>${esc(LVR.oppH)}</b>
<textarea data-k="opp" rows="5" placeholder="${esc(LVR.oppPh)}" style="width:100%;box-sizing:border-box;margin-top:6px;padding:7px;border-radius:8px;border:1px solid #2a3555;background:#0e1628;color:#eef1f8;font:600 12.5px system-ui,sans-serif;resize:vertical">${esc(CFG.opp)}</textarea>
<div style="margin-top:4px;color:#8e99b8;font-size:11.5px">${esc(LVR.oppN)}</div></div>
<div class="lv-row" style="margin-top:8px"><input type="text" maxlength="40" data-k="sponsor" value="${esc(CFG.sponsor)}" placeholder="${esc(LVR.sponsorL)}"></div>
<div style="margin-top:4px;color:#8e99b8;font-size:11.5px">${esc(LVR.sponsorN)}</div>
<div class="lv-row"><label>${esc(LVR.matchSec)}</label><input type="number" min="60" max="300" step="10" data-k="matchSec" value="${CFG.matchSec}"></div>
<div class="lv-row"><label>${esc(LVR.duelSec)}</label><input type="number" min="2" max="6" step="1" data-k="duelSec" value="${CFG.duelSec}"></div>
<div class="lv-row"><label>${esc(LVR.breakSec)}</label><input type="number" min="5" max="60" step="5" data-k="breakSec" value="${CFG.breakSec}"></div>
<div class="lv-row"><label>${esc(LVR.starC)}</label><input type="number" min="1" step="1" data-k="starC" value="${CFG.starC}"></div>
<div class="lv-row"><label>${esc(LVR.fkC)}</label><input type="number" min="1" step="1" data-k="fkC" value="${CFG.fkC}"></div>
<div class="lv-row" style="flex-wrap:wrap;margin-top:8px"><button class="lv-btn" data-s="next">⏭ ${esc(LVR.btnNext)}</button><button class="lv-btn" data-s="png">${esc(LVR.btnPng)}</button><button class="lv-btn g" data-s="reset">${esc(LVR.btnReset)}</button></div>
<div style="margin-top:6px;color:#8e99b8;font-size:11.5px">${esc(LVR.saveN)}</div>
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
   if (s === 'next') { ov.hidden = true; nextMatch(); return; }
   if (s === 'png') { standingsPNG(); return; }
   if (s === 'reset') { if (confirm(LVR.resetQ)) { LG = newLeague(1); saveLG(); nextMatch(); } return; }
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
   const NUM = { matchSec: [60, 300], duelSec: [2, 6], breakSec: [5, 60], starC: [1, 1e6], fkC: [1, 1e6] };
   if (NUM[k]) { CFG[k] = clamp(Math.round(t.value === '' ? DEF_CFG[k] : +t.value), NUM[k][0], NUM[k][1]); t.value = CFG[k]; }
   else if (k === 'size') CFG.size = +t.value;
   else if (k === 'nH') { CFG.nH = cleanText(t.value, 18); t.value = CFG.nH; }
   else if (k === 'opp') CFG.opp = String(t.value).split(/\r?\n/).map(x => cleanText(x, 40)).join('\n').slice(0, 1200);
   else if (k === 'kH') { CFG.kH = asciiUp(t.value).slice(0, 8); t.value = CFG.kH; }
   else if (k === 'lg' || k === 'sponsor') { CFG[k] = cleanText(t.value, 40); t.value = CFG[k]; }
   else CFG[k] = t.value;
   store.set('livecfg', CFG);
   if (k === 'sponsor') drawBoards();
   if (['mode', 'size'].includes(k)) { LG = newLeague(1); saveLG(); nextMatch(); }
   else if (['nH', 'kH', 'cH', 'opp'].includes(k)) { TEAMS = buildTeams(LG.n); const o = CFG.mode === 'derby' ? 1 : oppIndex(); st.teams = [TEAMS[0], TEAMS[o]]; setKits(); renderLegend(); renderBug(); simLabels(); if (st.phase === 'intro') showIntro(); }
   renderLegend(); obsUrl();
  });
  renderSrc(); obsUrl(); renderLog(); simLabels();
 }
 function simLabels() { if (!pn) return; pn.querySelector('[data-s=ch]').textContent = LVR.sAny + ': ' + st.teams[0].code; pn.querySelector('[data-s=ca]').textContent = LVR.sAny + ': ' + st.teams[1].code; }
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
 const SIM_USERS = ['ayse_23', 'leo.plays', 'mira.k', 'tomasz', 'yuki_s', 'omar.dev', 'ella.b', 'kemal34', 'nina.r', 'sam_w', 'deniz.k', 'lina_m', 'arif07', 'joao.p', 'putri', 'carlos.m', 'zeynep.t', 'mert_34', 'ana.luz', 'budi_s', 'efe.10', 'sofia_r'];
 function simEvent(kind, who) {
  LS.n++;
  const name = who || SIM_USERS[(LS.n * 7 + kind.length * 3) % SIM_USERS.length];
  const ev = { id: 'sim_' + Date.now().toString(36) + '_' + LS.n, user: { id: name, name }, src: 'sim' };
  const code = s => [st.teams[s].code.toLowerCase(), String(s + 1), st.teams[s].code + '!!', st.teams[s].code + ' ⚽'][LS.n % 4];
  if (kind === 'ch' || kind === 'ca') Object.assign(ev, { type: 'comment', text: code(kind === 'ch' ? 0 : 1) });
  else if (kind === 'c') Object.assign(ev, { type: 'comment', text: ['goool', '💪💪', 'pas pas', 'hadi!!', 'gg', '😂', 'vamos', 'ayo'][LS.n % 8] });
  else if (kind === 'like') Object.assign(ev, { type: 'like', count: 100 });
  else if (kind === 'follow') ev.type = 'follow';
  else Object.assign(ev, { type: 'gift', gift: '🎁', coins: +kind.slice(1) });
  ingest(ev);
 }
 function autoDemo(dt) {
  if (!LS.auto) return;
  LS.autoT -= dt; if (LS.autoT > 0) return;
  LS.autoT = .18 + Math.random() * .5;
  const r = Math.random(), lean = .5 + .12 * Math.sin(st.time * .21);
  simEvent(r < .5 * lean ? 'ch' : r < .5 ? 'ca' : r < .9 ? 'c' : r < .95 ? 'like' : r < .985 ? 'g1' : r < .995 ? 'g99' : 'g299');
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
 function ingest(ev) {
  if (!ev || !ev.id || !ev.user) return;
  ev.user.name = cleanName(ev.user.name);
  if (LS.seen.has(ev.id)) { log(ev, ev.type, 'dup'); return; }
  LS.seen.add(ev.id); LS.seenQ.push(ev.id); if (LS.seenQ.length > 5000) LS.seen.delete(LS.seenQ.shift());
  LS.last = ev;
  if (blockList().includes(ev.user.name.toLowerCase())) { log(ev, ev.type, 'filt'); return; }
  const u = LS.users.get(ev.user.id) || { id: ev.user.id, name: ev.user.name, side: null, lastMsg: -1e9, coins: 0 };
  LS.users.set(u.id, u); u.name = ev.user.name;
  const now = performance.now() / 1000;
  LS.evRate = (LS.evRate || 0) * Math.exp(-(now - (LS.evT || now)) / 20) + 1 / 20; LS.evT = now;
  if (ev.type === 'comment') {
   const want = teamWord(ev.text);
   if (now - u.lastMsg < 1.2 && !(want != null && want !== u.side)) { log(ev, LVR.sAny, 'filt'); return; }
   u.lastMsg = now;
   const s = joinSide(u, want);
   u.lastAct = performance.now(); u.cnt = (u.cnt || 0) + 1;
   addC(s, 1, u.name); addHeat(s, 1);
   log(ev, TN(s) + ' · “' + cleanText(ev.text) + '”', 'ok');
  } else if (ev.type === 'like') {
   const s = u.side != null ? u.side : 0;
   addC(s, Math.min(2, .04 * Math.max(1, ev.count | 0)), null); addHeat(s, Math.min(5, .05 * Math.max(1, ev.count | 0)));
   log(ev, '+' + (ev.count | 0) + ' ♥', 'ok');
  } else if (ev.type === 'follow') { joinSide(u, null); log(ev, LV.sFollow, 'ok'); }
  else if (ev.type === 'gift') {
   const coins = Math.max(1, (ev.coins | 0) * Math.max(1, ev.repeat | 0));
   const s = joinSide(u, null); u.coins += coins;
   const sup = Math.min(15, 3 + Math.floor(coins / 20));
   addC(s, sup, u.name); addHeat(s, 5);
   u.lastAct = performance.now(); u.cnt = (u.cnt || 0) + 3;
   addBanner(u.name, TC(s));
   let what = fmt(LVR.support, { u: u.name, n: sup, t: TN(s) }), col = TC(s);
   const playing = ['play', 'chance', 'kick', 'shot'].includes(st.phase);
   if (coins >= CFG.fkC && st.bigN[s] < 2 && playing) {
    st.bigN[s]++;
    if (st.phase === 'play' && st.poss === s && ball.mode === 'carry') { st.bar = 11; st.passK = 11; st.assist[s] = u.name; what = fmt(L.fk, { t: TN(s) }) + ' @' + u.name; }
    else { st.keeper[s] = 1; what = fmt(L.keeper, { t: TN(s) }) + ' @' + u.name; }
   } else if (coins >= CFG.starC && st.starN[s] < 3 && playing) {
    st.starN[s]++; st.star[s] = 10; st.starBy[s] = u.name; what = fmt(L.star, { t: TN(s) }) + ' @' + u.name;
    st.xiT = 0; setTag(P[s][9], '⭐ @' + u.name, 2.5, true);
   }
   banner(what, col, 3); feedAdd('🎁 ' + what, col); beep('gift');
   log(ev, `${ev.gift} → ${what}`, 'ok');
  }
 }
 function startLive() {
  liveUI();
  if (!clean) livePanel();
  if (KINDS.includes(srcWant)) srcStart(srcWant);
  nextMatch();
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
 let last = performance.now(), manual = !!opts.manual;
 function frame(now) {
  if (!manual) requestAnimationFrame(frame);
  const dt = clamp((now - last) / 1000, 0, .05); last = now;
  if (!paused) { if (live) autoDemo(dt); step(dt); }
  placeTags();
  renderer.render(scene, camera);
 }
 resize();
 resetPositions(0, true);
 if (live) { ov.hidden = true; startLive(); } else { normalUI(); menu(); }
 if (!manual) requestAnimationFrame(frame);
 const adv = (ms, n) => { for (let i = 0; i < (n || 1); i++) { if (live) autoDemo(ms / 1000); step(ms / 1000); } placeTags(); renderer.render(scene, camera); };
 return { adv, st, ingest: ev => ingest(ev), simEvent, tap, quickMatch, leagueMatch, nextMatch, camera, LS: () => LS, LG: () => LG, players: P, ball, tick: ms => { last = performance.now(); if (!paused) { if (live) autoDemo(ms / 1000); step(ms / 1000); } placeTags(); renderer.render(scene, camera); }, render: () => renderer.render(scene, camera), banner, bigText, setTag, resize };
}

global.ChatFC = { mount };
})(window);
