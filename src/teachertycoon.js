/* TEACHER TYCOON – an original 3D classroom game for PickRadar.
   Built on three.js (MIT). Every model, texture and sound is generated in code: no image or audio files.
   Original characters; not affiliated with any other game or publisher. */
(function (global) {
'use strict';

const LANG = {
 en: {
  name: 'Teacher Tycoon', tag: 'Your class. Your rules. Your chaos.', play: 'Start lesson', lesson: 'Lesson {n}',
  how: 'Walk to the board to teach. Keep an eye on the class: wake sleepers, stop paper throwers, answer raised hands.',
  keys: 'WASD / arrows move · click a student to talk · E nearest student · 1 2 3 actions · P pause',
  keysT: 'Drag the stick to walk · tap a student · tap the board to teach',
  best: 'Best score: {n}', rank: 'Rank', subj: { math: 'Math', sci: 'Science', geo: 'Geometry' },
  task: { teach: 'Teach the lesson to 100%', answer: 'Answer {n} raised hands', stop: 'Stop {n} disruptions' },
  mood: 'Class mood', moods: ['Calm', 'Focused', 'Getting loud', 'CHAOS!'], calm: 'Calm', chaos: 'Chaos',
  act: { warn: 'Warn', praise: 'Praise', ask: 'Ask', wake: 'Wake up' },
  type: { brain: 'Know-it-all', clown: 'Class clown', sleepy: 'Sleepyhead', talker: 'Chatterbox', trouble: 'Troublemaker', tech: 'Tech kid' },
  st: { focus: 'Focused', talk: 'Chatting', phone: 'On the phone', sleep: 'Asleep', throw: 'Throwing paper', joke: 'Telling jokes', hand: 'Has an answer', cheat: 'Cheating', upset: 'Upset', laugh: 'Laughing' },
  b: { zzz: 'Zzz…', ha: 'Ha ha!', blah: 'bla bla', psst: 'psst!', tune: '♪ ♫', me: 'Me! Me!', ow: 'Hey!', oops: 'Oops…', yes: 'Yes!', ok: 'Okay…' },
  teachHint: 'Stand at the board to teach', teaching: 'Teaching…', noisy: 'Too noisy to teach!', progress: 'Lesson',
  stopped: 'Stopped! +{n}', praised: 'Praised +{n}', correct: 'Correct! +{n}', funny: 'Funny answer +{n}', unsure: 'Not quite… +{n}',
  unfair: 'They were behaving…', tooFar: 'Walk closer', caught: 'Cheater caught! +{n}', woke: 'Awake! +{n}',
  ev: {
   paper: 'Paper fight!', paperT: 'Max and Lulu started a paper fight. Stop them!',
   quiz: 'Pop quiz!', quizT: 'Everyone is writing. Catch the cheaters peeking sideways!', quizEnd: 'Quiz over',
   pWarn: 'Principal Hart is on the way!', pWarnT: 'Calm the class before she opens the door.',
   pIn: 'Principal Hart is watching…', pGood: 'Principal Hart is impressed! +{n}', pBad: 'Principal Hart frowns… −{n}',
   bell: 'The bell rang!'
  },
  res: { title: 'Lesson over', score: 'Score', chalk: 'Chalk earned', stats: ['Lesson taught', 'Questions answered', 'Disruptions stopped', 'Highest chaos'],
   t: { best: 'Best Teacher', perfect: 'Perfect Lesson', strict: 'Strict but Fair', survivor: 'Chaos Survivor', disaster: 'Class Disaster', fun: 'Fun Teacher' },
   again: 'Play again', next: 'Next lesson', newBest: 'New best!' },
  ranks: ['Trainee Teacher', 'Teacher', 'Senior Teacher', 'Head Teacher', 'Vice Principal', 'Principal', 'Legendary Teacher'],
  paused: 'Paused', resume: 'Resume', quit: 'End lesson', soundOn: 'Sound: on', soundOff: 'Sound: off', qHigh: 'Graphics: high', qLow: 'Graphics: fast',
  time: 'Time', score: 'Score', webgl: 'Your browser could not start 3D graphics (WebGL). Try another browser or turn on hardware acceleration.'
 },
 tr: {
  name: 'Teacher Tycoon', tag: 'Senin sınıfın. Senin kuralların. Senin kaosun.', play: 'Derse başla', lesson: '{n}. Ders',
  how: 'Ders anlatmak için tahtaya yürü. Sınıfı da gözden kaçırma: uyuyanları uyandır, kâğıt atanları durdur, parmak kaldıranlara söz ver.',
  keys: 'WASD / oklar yürü · öğrenciye tıkla · E en yakın öğrenci · 1 2 3 eylemler · P duraklat',
  keysT: 'Yürümek için çubuğu sürükle · öğrenciye dokun · ders anlatmak için tahtaya dokun',
  best: 'En iyi skor: {n}', rank: 'Unvan', subj: { math: 'Matematik', sci: 'Fen', geo: 'Geometri' },
  task: { teach: 'Dersi %100 anlat', answer: '{n} kaldırılan parmağa söz ver', stop: '{n} kargaşayı durdur' },
  mood: 'Sınıfın havası', moods: ['Sakin', 'Odaklı', 'Ses yükseliyor', 'KAOS!'], calm: 'Sakin', chaos: 'Kaos',
  act: { warn: 'Uyar', praise: 'Övgü', ask: 'Soru sor', wake: 'Uyandır' },
  type: { brain: 'Her şeyi bilen', clown: 'Sınıfın komiği', sleepy: 'Uykucu', talker: 'Geveze', trouble: 'Yaramaz', tech: 'Teknoloji meraklısı' },
  st: { focus: 'Odaklı', talk: 'Sohbet ediyor', phone: 'Telefonda', sleep: 'Uyuyor', throw: 'Kâğıt atıyor', joke: 'Şaka yapıyor', hand: 'Cevabı var', cheat: 'Kopya çekiyor', upset: 'Kızgın', laugh: 'Gülüyor' },
  b: { zzz: 'Zzz…', ha: 'Ha ha!', blah: 'bla bla', psst: 'pışt!', tune: '♪ ♫', me: 'Ben! Ben!', ow: 'Hey!', oops: 'Hıı…', yes: 'Evet!', ok: 'Tamam…' },
  teachHint: 'Ders anlatmak için tahtanın önünde dur', teaching: 'Ders anlatılıyor…', noisy: 'Çok gürültü var!', progress: 'Ders',
  stopped: 'Durdurdun! +{n}', praised: 'Övgü +{n}', correct: 'Doğru! +{n}', funny: 'Komik cevap +{n}', unsure: 'Tam değil… +{n}',
  unfair: 'Uslu duruyordu ama…', tooFar: 'Biraz yaklaş', caught: 'Kopya yakalandı! +{n}', woke: 'Uyandı! +{n}',
  ev: {
   paper: 'Kâğıt savaşı!', paperT: 'Max ve Lulu kâğıt savaşı başlattı. Durdur onları!',
   quiz: 'Sürpriz sınav!', quizT: 'Herkes yazıyor. Yana bakıp kopya çekenleri yakala!', quizEnd: 'Sınav bitti',
   pWarn: 'Müdür Hart geliyor!', pWarnT: 'Kapıyı açmadan önce sınıfı sakinleştir.',
   pIn: 'Müdür Hart sınıfı izliyor…', pGood: 'Müdür Hart çok memnun! +{n}', pBad: 'Müdür Hart kaşlarını çattı… −{n}',
   bell: 'Zil çaldı!'
  },
  res: { title: 'Ders bitti', score: 'Skor', chalk: 'Kazanılan tebeşir', stats: ['Anlatılan ders', 'Cevaplanan soru', 'Durdurulan kargaşa', 'En yüksek kaos'],
   t: { best: 'Yılın Öğretmeni', perfect: 'Kusursuz Ders', strict: 'Sert ama Adil', survivor: 'Kaostan Sağ Çıkan', disaster: 'Sınıf Felaketi', fun: 'Eğlenceli Öğretmen' },
   again: 'Tekrar oyna', next: 'Sonraki ders', newBest: 'Yeni rekor!' },
  ranks: ['Stajyer Öğretmen', 'Öğretmen', 'Deneyimli Öğretmen', 'Başöğretmen', 'Müdür Yardımcısı', 'Okul Müdürü', 'Efsane Öğretmen'],
  paused: 'Duraklatıldı', resume: 'Devam et', quit: 'Dersi bitir', soundOn: 'Ses: açık', soundOff: 'Ses: kapalı', qHigh: 'Grafik: yüksek', qLow: 'Grafik: hızlı',
  time: 'Süre', score: 'Skor', webgl: 'Tarayıcın 3D grafiği (WebGL) başlatamadı. Başka bir tarayıcı dene ya da donanım hızlandırmayı aç.'
 },
 es: {
  name: 'Teacher Tycoon', tag: 'Tu clase. Tus reglas. Tu caos.', play: 'Empezar la clase', lesson: 'Clase {n}',
  how: 'Ve a la pizarra para enseñar. Vigila la clase: despierta a los dormidos, frena a los que tiran papeles y da la palabra a quien levanta la mano.',
  keys: 'WASD / flechas para moverte · clic en un alumno · E alumno más cercano · 1 2 3 acciones · P pausa',
  keysT: 'Arrastra el joystick para caminar · toca a un alumno · toca la pizarra para enseñar',
  best: 'Mejor puntuación: {n}', rank: 'Rango', subj: { math: 'Matemáticas', sci: 'Ciencias', geo: 'Geometría' },
  task: { teach: 'Enseña la lección al 100%', answer: 'Da la palabra a {n} manos levantadas', stop: 'Detén {n} interrupciones' },
  mood: 'Ambiente de la clase', moods: ['Tranquila', 'Concentrada', 'Mucho ruido', '¡CAOS!'], calm: 'Calma', chaos: 'Caos',
  act: { warn: 'Avisar', praise: 'Elogiar', ask: 'Preguntar', wake: 'Despertar' },
  type: { brain: 'Sabelotodo', clown: 'Payaso de la clase', sleepy: 'Dormilón', talker: 'Charlatana', trouble: 'Travieso', tech: 'Fan de la tecnología' },
  st: { focus: 'Concentrado', talk: 'Charlando', phone: 'Con el móvil', sleep: 'Dormido', throw: 'Tirando papeles', joke: 'Contando chistes', hand: 'Sabe la respuesta', cheat: 'Copiando', upset: 'Enfadado', laugh: 'Riendo' },
  b: { zzz: 'Zzz…', ha: '¡Ja ja!', blah: 'bla bla', psst: '¡psst!', tune: '♪ ♫', me: '¡Yo! ¡Yo!', ow: '¡Eh!', oops: 'Uy…', yes: '¡Sí!', ok: 'Vale…' },
  teachHint: 'Ponte frente a la pizarra para enseñar', teaching: 'Enseñando…', noisy: '¡Demasiado ruido!', progress: 'Lección',
  stopped: '¡Detenido! +{n}', praised: 'Elogio +{n}', correct: '¡Correcto! +{n}', funny: 'Respuesta graciosa +{n}', unsure: 'Casi… +{n}',
  unfair: 'Se estaba portando bien…', tooFar: 'Acércate más', caught: '¡Pillado copiando! +{n}', woke: '¡Despierto! +{n}',
  ev: {
   paper: '¡Guerra de papeles!', paperT: 'Max y Lulu empezaron una guerra de papeles. ¡Detenlos!',
   quiz: '¡Examen sorpresa!', quizT: 'Todos escriben. ¡Pilla a quien mira de reojo!', quizEnd: 'Fin del examen',
   pWarn: '¡Viene la directora Hart!', pWarnT: 'Calma la clase antes de que abra la puerta.',
   pIn: 'La directora Hart observa…', pGood: '¡La directora Hart está impresionada! +{n}', pBad: 'La directora Hart frunce el ceño… −{n}',
   bell: '¡Sonó el timbre!'
  },
  res: { title: 'Fin de la clase', score: 'Puntuación', chalk: 'Tiza ganada', stats: ['Lección enseñada', 'Preguntas respondidas', 'Interrupciones detenidas', 'Caos máximo'],
   t: { best: 'Mejor Profe', perfect: 'Clase Perfecta', strict: 'Estricta pero Justa', survivor: 'Superviviente del Caos', disaster: 'Desastre de Clase', fun: 'Profe Divertida' },
   again: 'Jugar otra vez', next: 'Siguiente clase', newBest: '¡Nuevo récord!' },
  ranks: ['Profesora en prácticas', 'Profesora', 'Profesora veterana', 'Jefa de estudios', 'Subdirectora', 'Directora', 'Profe legendaria'],
  paused: 'Pausa', resume: 'Continuar', quit: 'Terminar la clase', soundOn: 'Sonido: sí', soundOff: 'Sonido: no', qHigh: 'Gráficos: altos', qLow: 'Gráficos: rápidos',
  time: 'Tiempo', score: 'Puntos', webgl: 'Tu navegador no pudo iniciar los gráficos 3D (WebGL). Prueba otro navegador o activa la aceleración por hardware.'
 },
 pt: {
  name: 'Teacher Tycoon', tag: 'Sua turma. Suas regras. Seu caos.', play: 'Começar a aula', lesson: 'Aula {n}',
  how: 'Vá até o quadro para ensinar. Fique de olho na turma: acorde quem dorme, pare quem joga papel e dê a vez a quem levanta a mão.',
  keys: 'WASD / setas para andar · clique em um aluno · E aluno mais próximo · 1 2 3 ações · P pausa',
  keysT: 'Arraste o joystick para andar · toque em um aluno · toque no quadro para ensinar',
  best: 'Melhor pontuação: {n}', rank: 'Cargo', subj: { math: 'Matemática', sci: 'Ciências', geo: 'Geometria' },
  task: { teach: 'Ensine a lição até 100%', answer: 'Dê a vez a {n} mãos levantadas', stop: 'Pare {n} bagunças' },
  mood: 'Clima da turma', moods: ['Calma', 'Focada', 'Barulhenta', 'CAOS!'], calm: 'Calma', chaos: 'Caos',
  act: { warn: 'Advertir', praise: 'Elogiar', ask: 'Perguntar', wake: 'Acordar' },
  type: { brain: 'Sabe-tudo', clown: 'Palhaço da turma', sleepy: 'Dorminhoco', talker: 'Tagarela', trouble: 'Bagunceiro', tech: 'Fã de tecnologia' },
  st: { focus: 'Focado', talk: 'Conversando', phone: 'No celular', sleep: 'Dormindo', throw: 'Jogando papel', joke: 'Contando piadas', hand: 'Sabe a resposta', cheat: 'Colando', upset: 'Bravo', laugh: 'Rindo' },
  b: { zzz: 'Zzz…', ha: 'Ha ha!', blah: 'blá blá', psst: 'psiu!', tune: '♪ ♫', me: 'Eu! Eu!', ow: 'Ei!', oops: 'Ops…', yes: 'Sim!', ok: 'Tá bom…' },
  teachHint: 'Fique na frente do quadro para ensinar', teaching: 'Ensinando…', noisy: 'Barulho demais!', progress: 'Lição',
  stopped: 'Parou! +{n}', praised: 'Elogio +{n}', correct: 'Certo! +{n}', funny: 'Resposta engraçada +{n}', unsure: 'Quase… +{n}',
  unfair: 'Estava se comportando…', tooFar: 'Chegue mais perto', caught: 'Pegou a cola! +{n}', woke: 'Acordou! +{n}',
  ev: {
   paper: 'Guerra de papel!', paperT: 'Max e Lulu começaram uma guerra de papel. Pare os dois!',
   quiz: 'Prova surpresa!', quizT: 'Todos escrevem. Pegue quem olha de lado!', quizEnd: 'Fim da prova',
   pWarn: 'A diretora Hart está vindo!', pWarnT: 'Acalme a turma antes de ela abrir a porta.',
   pIn: 'A diretora Hart está observando…', pGood: 'A diretora Hart adorou! +{n}', pBad: 'A diretora Hart franze a testa… −{n}',
   bell: 'O sinal tocou!'
  },
  res: { title: 'Fim da aula', score: 'Pontuação', chalk: 'Giz ganho', stats: ['Lição ensinada', 'Perguntas respondidas', 'Bagunças paradas', 'Caos máximo'],
   t: { best: 'Melhor Professora', perfect: 'Aula Perfeita', strict: 'Rígida mas Justa', survivor: 'Sobrevivente do Caos', disaster: 'Desastre na Sala', fun: 'Professora Divertida' },
   again: 'Jogar de novo', next: 'Próxima aula', newBest: 'Novo recorde!' },
  ranks: ['Professora estagiária', 'Professora', 'Professora experiente', 'Coordenadora', 'Vice-diretora', 'Diretora', 'Professora lendária'],
  paused: 'Pausado', resume: 'Continuar', quit: 'Encerrar aula', soundOn: 'Som: ligado', soundOff: 'Som: desligado', qHigh: 'Gráficos: altos', qLow: 'Gráficos: rápidos',
  time: 'Tempo', score: 'Pontos', webgl: 'Seu navegador não conseguiu iniciar os gráficos 3D (WebGL). Tente outro navegador ou ative a aceleração de hardware.'
 },
 id: {
  name: 'Teacher Tycoon', tag: 'Kelasmu. Aturanmu. Kekacauanmu.', play: 'Mulai pelajaran', lesson: 'Pelajaran {n}',
  how: 'Berjalanlah ke papan tulis untuk mengajar. Awasi kelas: bangunkan yang tidur, hentikan pelempar kertas, beri giliran pada tangan yang terangkat.',
  keys: 'WASD / panah untuk jalan · klik murid · E murid terdekat · 1 2 3 aksi · P jeda',
  keysT: 'Geser joystick untuk jalan · ketuk murid · ketuk papan untuk mengajar',
  best: 'Skor terbaik: {n}', rank: 'Pangkat', subj: { math: 'Matematika', sci: 'IPA', geo: 'Geometri' },
  task: { teach: 'Ajarkan pelajaran sampai 100%', answer: 'Beri giliran {n} tangan terangkat', stop: 'Hentikan {n} keributan' },
  mood: 'Suasana kelas', moods: ['Tenang', 'Fokus', 'Mulai ribut', 'KACAU!'], calm: 'Tenang', chaos: 'Kacau',
  act: { warn: 'Tegur', praise: 'Puji', ask: 'Tanya', wake: 'Bangunkan' },
  type: { brain: 'Si pintar', clown: 'Si pelawak', sleepy: 'Si tukang tidur', talker: 'Si cerewet', trouble: 'Si nakal', tech: 'Si gila teknologi' },
  st: { focus: 'Fokus', talk: 'Mengobrol', phone: 'Main HP', sleep: 'Tidur', throw: 'Melempar kertas', joke: 'Melawak', hand: 'Tahu jawabannya', cheat: 'Menyontek', upset: 'Kesal', laugh: 'Tertawa' },
  b: { zzz: 'Zzz…', ha: 'Ha ha!', blah: 'bla bla', psst: 'ssst!', tune: '♪ ♫', me: 'Saya! Saya!', ow: 'Hei!', oops: 'Ups…', yes: 'Ya!', ok: 'Oke…' },
  teachHint: 'Berdirilah di depan papan untuk mengajar', teaching: 'Mengajar…', noisy: 'Terlalu ribut!', progress: 'Pelajaran',
  stopped: 'Berhenti! +{n}', praised: 'Pujian +{n}', correct: 'Benar! +{n}', funny: 'Jawaban lucu +{n}', unsure: 'Hampir… +{n}',
  unfair: 'Dia sedang sopan…', tooFar: 'Mendekatlah', caught: 'Penyontek tertangkap! +{n}', woke: 'Bangun! +{n}',
  ev: {
   paper: 'Perang kertas!', paperT: 'Max dan Lulu memulai perang kertas. Hentikan mereka!',
   quiz: 'Kuis dadakan!', quizT: 'Semua menulis. Tangkap yang melirik ke samping!', quizEnd: 'Kuis selesai',
   pWarn: 'Kepala sekolah Hart datang!', pWarnT: 'Tenangkan kelas sebelum dia membuka pintu.',
   pIn: 'Kepala sekolah Hart sedang mengamati…', pGood: 'Kepala sekolah Hart terkesan! +{n}', pBad: 'Kepala sekolah Hart mengernyit… −{n}',
   bell: 'Bel berbunyi!'
  },
  res: { title: 'Pelajaran selesai', score: 'Skor', chalk: 'Kapur didapat', stats: ['Materi diajarkan', 'Pertanyaan dijawab', 'Keributan dihentikan', 'Kekacauan tertinggi'],
   t: { best: 'Guru Terbaik', perfect: 'Pelajaran Sempurna', strict: 'Tegas tapi Adil', survivor: 'Selamat dari Kekacauan', disaster: 'Bencana Kelas', fun: 'Guru Seru' },
   again: 'Main lagi', next: 'Pelajaran berikutnya', newBest: 'Rekor baru!' },
  ranks: ['Guru magang', 'Guru', 'Guru senior', 'Kepala guru', 'Wakil kepala sekolah', 'Kepala sekolah', 'Guru legendaris'],
  paused: 'Jeda', resume: 'Lanjut', quit: 'Akhiri pelajaran', soundOn: 'Suara: nyala', soundOff: 'Suara: mati', qHigh: 'Grafis: tinggi', qLow: 'Grafis: cepat',
  time: 'Waktu', score: 'Skor', webgl: 'Peramban tidak bisa memulai grafis 3D (WebGL). Coba peramban lain atau aktifkan akselerasi perangkat keras.'
 }
};

const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v && v[k] != null ? v[k] : '');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;

/* ---------- the six students: desk slot, look and personality ---------- */
const KIDS = [
 { id: 'ada', name: 'Ada', type: 'brain', col: 0, row: 0, skin: '#f2c7a5', shirt: '#2f4c8f', pants: '#3b4a6b', hair: 'ponytail', hairC: '#2a1a12', glasses: '#1e2235', collar: '#ffffff', chair: '#ff6b5b' },
 { id: 'bongo', name: 'Bongo', type: 'clown', col: 1, row: 0, skin: '#7a4a32', shirt: '#ffc93c', pants: '#2b3a55', hair: 'afro', hairC: '#1e1410', chair: '#ffc93c' },
 { id: 'nilo', name: 'Nilo', type: 'sleepy', col: 2, row: 0, skin: '#e8b48f', shirt: '#b39ddb', pants: '#3b4a6b', hair: 'hood', hairC: '#b39ddb', chair: '#5bc0eb' },
 { id: 'lulu', name: 'Lulu', type: 'talker', col: 0, row: 1, skin: '#d9a07a', shirt: '#ff8fb1', pants: '#3b4a6b', hair: 'buns', hairC: '#3b2316', chair: '#ffc93c' },
 { id: 'max', name: 'Max', type: 'trouble', col: 1, row: 1, skin: '#f2c7a5', shirt: '#ff8a3d', pants: '#2b3a55', hair: 'cap', hairC: '#8a4b22', hat: '#e94f37', chair: '#5bc0eb' },
 { id: 'pixel', name: 'Pixel', type: 'tech', col: 2, row: 1, skin: '#b97a55', shirt: '#2ec4b6', pants: '#2b3a55', hair: 'phones', hairC: '#1e1410', hat: '#1e2235', chair: '#ff6b5b' }
];
const COLS = [-2.5, 0, 2.5], ROWS = [0.55, -1.75];              // desk centres (x) and desk z per row
const BOARD = { x: 5.05, z: 2.0, spotX: 4.15, spotZ: 2.0 };      // chalkboard on the right wall, front of class
const DOOR = { x: 4.7, z: -2.6 };
const SUBJ = ['math', 'sci', 'geo'];

/* per-type behaviour: what they do when they misbehave, how often (per second) and how loud it is */
const BEHAV = {
 brain: { bad: 'hand', rate: 0.07 },
 clown: { bad: 'joke', rate: 0.032 },
 sleepy: { bad: 'sleep', rate: 0.045 },
 talker: { bad: 'talk', rate: 0.06 },
 trouble: { bad: 'throw', rate: 0.05 },
 tech: { bad: 'phone', rate: 0.045 }
};
const NOISE = { talk: 7, phone: 3, sleep: 2.5, throw: 11, joke: 16, laugh: 4.5, upset: 4, cheat: 0, hand: 0, focus: 0, innocent: 0, surprised: 0 };

function mount(host, opts) {
 opts = opts || {};
 const L = LANG[opts.lang] || LANG.en;
 const T3 = global.THREE;
 const touch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in global;
 host.classList.add('tt');
 const store = {
  get(k, d) { try { const v = localStorage.getItem('tt.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('tt.' + k, JSON.stringify(v)); } catch (e) { } }
 };

 /* ---------- styles + DOM ---------- */
 const css = document.createElement('style');
 css.textContent = `
.tt{position:relative;overflow:hidden;font-family:'Baloo 2','Nunito',system-ui,sans-serif;color:#1e2235;user-select:none;-webkit-user-select:none;touch-action:none;background:#bfe0f0}
.tt canvas{display:block;width:100%;height:100%;outline:none}
.tt-ui{position:absolute;inset:0;pointer-events:none}
.tt-ui>*{pointer-events:auto}
.tt-top,.tt-joy{pointer-events:auto}
.tt-card{background:#fff7e8;border-radius:18px;box-shadow:0 5px 0 rgba(30,34,53,.22)}
.tt-lesson{position:absolute;left:12px;top:12px;width:250px;overflow:hidden}
.tt-lh{display:flex;align-items:center;gap:10px;padding:9px 12px;background:#1f5e55;color:#fff7e8}
.tt-ring{position:relative;width:46px;height:46px;flex:none}
.tt-ring b{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px}
.tt-lh small{display:block;font:800 11px system-ui,sans-serif;letter-spacing:1.5px;color:#ffc93c;text-transform:uppercase}
.tt-lh strong{font-size:18px;line-height:1.05}
.tt-tasks{list-style:none;margin:0;padding:8px 12px 10px;display:flex;flex-direction:column;gap:6px;font:700 13px system-ui,sans-serif}
.tt-tasks li{display:flex;align-items:center;gap:8px}
.tt-tasks i{width:18px;height:18px;flex:none;border-radius:6px;border:2.5px solid #1f5e55;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-style:normal;color:#fff;font-size:12px}
.tt-tasks li.done{color:#6b7088;text-decoration:line-through}
.tt-tasks li.done i{background:#3e9e5c;border-color:#3e9e5c}
.tt-tasks em{margin-left:auto;font-style:normal;color:#1f5e55}
.tt-prog{height:6px;margin:0 12px 10px;border-radius:9px;background:#e6ded0;overflow:hidden}
.tt-prog div{height:100%;width:0;background:#5bc0eb;transition:width .25s}
.tt-mood{position:absolute;left:50%;top:12px;transform:translateX(-50%);width:min(380px,40%);padding:7px 14px 9px}
.tt-mood .row{display:flex;justify-content:space-between;align-items:baseline;font:800 11px system-ui,sans-serif;letter-spacing:1.5px;color:#1f5e55;text-transform:uppercase}
.tt-mood .row b{font:800 16px 'Baloo 2',system-ui,sans-serif;letter-spacing:0;text-transform:none}
.tt-bar{position:relative;margin-top:6px;height:12px;border-radius:9px;background:linear-gradient(90deg,#5bc0eb,#ffc93c 55%,#ff6b5b)}
.tt-bar span{position:absolute;top:-5px;width:7px;height:22px;margin-left:-3.5px;border-radius:4px;background:#1e2235;box-shadow:0 0 0 3px #fff7e8;transition:left .2s}
.tt-top{position:absolute;right:12px;top:12px;display:flex;gap:8px;align-items:center}
.tt-pill{display:flex;align-items:center;gap:6px;padding:6px 12px;font-size:19px;font-weight:800;border-radius:999px}
.tt-btn{font:800 15px 'Baloo 2',system-ui,sans-serif;border:0;cursor:pointer;color:#1e2235}
.tt-icon{width:42px;height:42px;border-radius:14px;background:#1f5e55;box-shadow:0 4px 0 #0e3b35;color:#fff7e8;font-size:18px;display:flex;align-items:center;justify-content:center}
.tt-labels{position:absolute;inset:0;pointer-events:none}
.tt-bub{position:absolute;transform:translate(-50%,-100%);white-space:nowrap;padding:3px 10px;border-radius:14px 14px 14px 4px;background:#fff7e8;box-shadow:0 3px 0 rgba(30,34,53,.2);font-weight:800;font-size:15px;transition:opacity .2s}
.tt-bub.warn{background:#ff6b5b}.tt-bub.hand{background:#5bc0eb}.tt-bub.joke{background:#ffc93c}.tt-bub.zz{color:#6b5aa8}
.tt-tag{position:absolute;transform:translate(-50%,-100%);text-align:center;padding:3px 10px;border-radius:12px;background:#1e2235;color:#fff7e8;line-height:1.1;font-size:15px;font-weight:800}
.tt-tag small{display:block;font:800 10px system-ui,sans-serif;letter-spacing:1px;color:#ff8a7d;text-transform:uppercase}
.tt-pop{position:absolute;transform:translate(-50%,-100%);font-weight:800;font-size:20px;color:#fff;text-shadow:0 2px 0 #1e2235,0 0 6px rgba(0,0,0,.35);white-space:nowrap;pointer-events:none}
.tt-acts{position:absolute;display:flex;gap:8px;transform:translate(-50%,0);pointer-events:auto}
.tt-act{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:0;padding:0;cursor:pointer;font:800 12px system-ui,sans-serif;color:#1e2235}
.tt-act span{width:52px;height:52px;border-radius:50%;border:4px solid #fff7e8;box-shadow:0 4px 0 rgba(30,34,53,.3);display:flex;align-items:center;justify-content:center;font:800 20px 'Baloo 2',system-ui,sans-serif}
.tt-act em{font-style:normal;background:rgba(255,247,232,.94);padding:1px 7px;border-radius:9px}
.tt-act[data-k=warn] span{background:#ff6b5b}.tt-act[data-k=praise] span{background:#ffc93c}.tt-act[data-k=ask] span{background:#5bc0eb}
.tt-act.hint span{box-shadow:0 0 0 4px #1e2235,0 4px 0 rgba(30,34,53,.3)}
.tt-toast{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);max-width:min(560px,86%);display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:18px;background:#1e2235;color:#fff7e8;box-shadow:0 5px 0 rgba(0,0,0,.3);transition:opacity .3s,transform .3s}
.tt-toast b{display:block;font-size:19px;line-height:1.1}
.tt-toast small{display:block;font:700 13px system-ui,sans-serif;color:#c2cae0}
.tt-toast .cd{font-size:24px;color:#ffc93c;margin-left:6px}
.tt-toast[hidden]{display:flex;opacity:0;transform:translate(-50%,20px);pointer-events:none}
.tt-hint{position:absolute;left:50%;bottom:82px;transform:translateX(-50%);padding:5px 14px;border-radius:999px;background:rgba(30,34,53,.78);color:#fff7e8;font:800 13px system-ui,sans-serif;pointer-events:none;transition:opacity .3s}
.tt-joy{position:absolute;left:18px;bottom:18px;width:128px;height:128px;border-radius:50%;background:rgba(255,247,232,.3);border:3px solid rgba(255,247,232,.75);touch-action:none}
.tt-joy i{position:absolute;left:34px;top:34px;width:54px;height:54px;border-radius:50%;background:#fff7e8;box-shadow:0 4px 0 rgba(30,34,53,.25)}
.tt-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(14,22,40,.55);padding:16px;z-index:5}
.tt-ov[hidden]{display:none}
.tt-panel{width:min(460px,100%);max-height:100%;overflow:auto;padding:22px 22px 20px;text-align:center}
.tt-logo{font-weight:800;line-height:.85;font-size:clamp(42px,9vw,68px);color:#fff7e8;text-shadow:0 5px 0 #1f5e55}
.tt-logo span{display:block;color:#ffc93c;text-shadow:0 5px 0 #b5461f;font-size:1.12em}
.tt-sub{margin-top:10px;font:800 12px system-ui,sans-serif;letter-spacing:2.5px;color:#ff8a7d;text-transform:uppercase}
.tt-panel p{font:600 14px/1.45 system-ui,sans-serif;color:#3b4060;margin:10px 0 0}
.tt-main{display:block;width:100%;margin-top:16px;padding:12px 18px;border-radius:18px;background:#ffc93c;box-shadow:0 6px 0 #c98b1c;font-size:24px}
.tt-sec{display:inline-block;margin:12px 4px 0;padding:8px 14px;border-radius:14px;background:#fff;box-shadow:0 4px 0 #d6cdbd;font-size:15px}
.tt-start{background:transparent;box-shadow:none}
.tt-start .tt-box{margin-top:18px;background:#fff7e8;border-radius:22px;padding:14px 16px 16px;box-shadow:0 6px 0 rgba(0,0,0,.25)}
.tt-meta{display:flex;justify-content:space-between;font:800 12px system-ui,sans-serif;color:#1f5e55;letter-spacing:1px;text-transform:uppercase}
.tt-res h3{margin:0;font-size:15px;letter-spacing:2px;color:#1f5e55;text-transform:uppercase}
.tt-res .ttl{font-size:34px;line-height:1.05;margin-top:2px}
.tt-stars{font-size:38px;letter-spacing:4px;color:#ffc93c;text-shadow:0 3px 0 #c98b1c;margin-top:4px}
.tt-stars .off{color:#e2d9c8;text-shadow:none}
.tt-big{font-size:44px;line-height:1}
.tt-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;text-align:left}
.tt-stats div{background:#fff;border-radius:12px;padding:7px 10px;font:700 12px system-ui,sans-serif;color:#4a5068}
.tt-stats b{display:block;font:800 20px 'Baloo 2',system-ui,sans-serif;color:#1e2235}
.tt-new{display:inline-block;margin-top:6px;padding:2px 10px;border-radius:999px;background:#ff6b5b;font-size:13px}
.tt-err{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font:600 15px system-ui,sans-serif;background:#1e2235;color:#fff7e8}
@media (max-width:640px){.tt-lesson{left:8px;top:8px;width:172px;border-radius:14px}.tt-lh{padding:6px 9px;gap:7px}.tt-ring{width:38px;height:38px}.tt-ring svg{width:38px;height:38px}.tt-ring b{font-size:12px}.tt-lh strong{font-size:14px}.tt-tasks{font-size:10.5px;padding:5px 8px 7px;gap:4px}.tt-tasks i{width:14px;height:14px;border-width:2px}.tt-prog{margin:0 8px 6px}.tt-mood{top:58px;left:auto;right:8px;transform:none;width:128px;padding:5px 9px 7px;border-radius:14px}.tt-mood .row span{display:none}.tt-mood .row b{font-size:13px}.tt-top{top:8px;right:8px}.tt-pill{font-size:16px;padding:4px 10px}.tt-icon{width:36px;height:36px}.tt-toast{bottom:156px;padding:8px 12px}.tt-toast b{font-size:15px}.tt-toast small{font-size:11.5px}.tt-hint{bottom:205px}.tt-act span{width:46px;height:46px}}
`;
 host.appendChild(css);
 const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
 const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

 let renderer;
 try {
  renderer = new T3.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
 } catch (e) {
  host.appendChild(el('div', 'tt-err', esc(L.webgl)));
  return;
 }
 let quality = store.get('q', touch ? 0 : 1);
 const setPR = () => renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, quality ? 1.75 : 1.15));
 setPR();
 renderer.outputColorSpace = T3.SRGBColorSpace;
 renderer.toneMapping = T3.NeutralToneMapping;
 renderer.toneMappingExposure = 1.02;
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = T3.PCFSoftShadowMap;
 host.appendChild(renderer.domElement);
 renderer.domElement.setAttribute('aria-label', L.name);
 renderer.domElement.tabIndex = 0;

 const ui = el('div', 'tt-ui');
 const labels = el('div', 'tt-labels');
 host.appendChild(labels);
 host.appendChild(ui);

 /* ---------- scene ---------- */
 const scene = new T3.Scene();
 scene.background = new T3.Color('#bfe0f0');
 const camera = new T3.PerspectiveCamera(25, 1, 0.5, 120);
 const hemi = new T3.HemisphereLight('#e8f4ff', '#c99a6a', 1.35);
 scene.add(hemi);
 const sun = new T3.DirectionalLight('#fff0d6', 2.6);
 sun.position.set(-2.5, 9, -8.5);
 sun.target.position.set(0, 0, 0.5);
 sun.castShadow = true;
 sun.shadow.camera.left = -8; sun.shadow.camera.right = 8; sun.shadow.camera.top = 8; sun.shadow.camera.bottom = -8;
 sun.shadow.camera.near = 1; sun.shadow.camera.far = 30;
 sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
 sun.shadow.radius = 3;
 const setShadowSize = () => { const s = quality ? 2048 : 1024; sun.shadow.mapSize.set(s, s); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } };
 setShadowSize();
 scene.add(sun, sun.target);
 const fill = new T3.DirectionalLight('#fff4e6', 0.55);
 fill.position.set(-6, 6, 9);
 scene.add(fill);

 const matCache = {};
 const M = (hex, rough, opt) => {
  const k = hex + '|' + (rough == null ? .6 : rough) + '|' + JSON.stringify(opt || {});
  if (!matCache[k]) {
   const o = Object.assign({ color: hex, roughness: rough == null ? .6 : rough, metalness: 0 }, opt || {});
   matCache[k] = new T3.MeshStandardMaterial(o);
  }
  return matCache[k];
 };
 const MB = hex => { const k = 'b' + hex; return matCache[k] || (matCache[k] = new T3.MeshBasicMaterial({ color: hex })); };

 // geometry cache
 const G = {
  sph: new T3.SphereGeometry(1, 28, 20), sphLo: new T3.SphereGeometry(1, 14, 10), box: new T3.BoxGeometry(1, 1, 1),
  cyl: new T3.CylinderGeometry(1, 1, 1, 24), cylLo: new T3.CylinderGeometry(1, 1, 1, 10), cone: new T3.ConeGeometry(1, 1, 18),
  cap: new T3.CapsuleGeometry(1, 1, 6, 14), band: new T3.TorusGeometry(1, .06, 8, 28, Math.PI), half: new T3.TorusGeometry(1, .22, 8, 20, Math.PI), torus: new T3.TorusGeometry(1, .12, 10, 40)
 };
 const capCache = {};
 const capG = (r, len) => capCache[r + '|' + len] || (capCache[r + '|' + len] = new T3.CapsuleGeometry(r, len, 6, 14));
 function mesh(geo, mat, x, y, z, sx, sy, sz, parent, shadow) {
  const m = new T3.Mesh(geo, mat);
  m.position.set(x || 0, y || 0, z || 0);
  if (sx != null) m.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  if (shadow !== false) { m.castShadow = true; m.receiveShadow = true; }
  (parent || scene).add(m);
  return m;
 }

 /* static meshes are merged per material at the end to keep draw calls low */
 const statics = [];
 function S(geo, mat, x, y, z, sx, sy, sz, rx, ry, rz, noShadowCast) {
  const m = new T3.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
  m.rotation.set(rx || 0, ry || 0, rz || 0);
  m.userData.noCast = !!noShadowCast;
  statics.push(m);
  return m;
 }
 function mergeStatics() {
  const buckets = new Map();
  for (const m of statics) {
   m.updateMatrix();
   const key = m.material.uuid + (m.userData.noCast ? 'n' : 'c');
   if (!buckets.has(key)) buckets.set(key, { mat: m.material, noCast: m.userData.noCast, list: [] });
   buckets.get(key).list.push(m);
  }
  for (const b of buckets.values()) {
   let n = 0;
   const geos = b.list.map(m => { const g = (m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()); g.applyMatrix4(m.matrix); n += g.attributes.position.count; return g; });
   const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
   let o = 0;
   for (const g of geos) {
    pos.set(g.attributes.position.array, o * 3);
    nor.set(g.attributes.normal.array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += g.attributes.position.count;
    g.dispose();
   }
   const geo = new T3.BufferGeometry();
   geo.setAttribute('position', new T3.BufferAttribute(pos, 3));
   geo.setAttribute('normal', new T3.BufferAttribute(nor, 3));
   geo.setAttribute('uv', new T3.BufferAttribute(uv, 2));
   const mm = new T3.Mesh(geo, b.mat);
   mm.castShadow = !b.noCast; mm.receiveShadow = true;
   scene.add(mm);
  }
  statics.length = 0;
 }

 /* ---------- textures ---------- */
 function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T3.CanvasTexture(c);
  t.colorSpace = T3.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = T3.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.userData.canvas = c;
  return t;
 }
 const floorTex = canvasTex(512, 512, (c, w, h) => {
  const tones = ['#c98e5a', '#c4874f', '#cf955f', '#bd8049', '#c88b55'];
  const rows = 8, rh = h / rows;
  for (let r = 0; r < rows; r++) {
   let x = -((r * 97) % 160);
   while (x < w) {
    const len = 150 + ((r * 31 + x) % 90);
    c.fillStyle = tones[(r * 3 + Math.abs(x)) % tones.length];
    c.fillRect(x, r * rh, len, rh);
    c.fillStyle = 'rgba(90,50,20,.55)'; c.fillRect(x, r * rh, 2, rh);
    for (let g = 0; g < 4; g++) { c.fillStyle = 'rgba(120,70,30,.07)'; c.fillRect(x + 6, r * rh + 6 + g * 13, len - 12, 2); }
    x += len;
   }
   c.fillStyle = 'rgba(90,50,20,.5)'; c.fillRect(0, r * rh, w, 2);
  }
 }, [2.4, 2.0]);
 const posterTex = (bg, fg, shape) => canvasTex(128, 160, (c, w, h) => {
  c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
  c.fillStyle = bg; c.fillRect(10, 10, w - 20, h * .62);
  c.fillStyle = fg;
  if (shape === 0) { c.beginPath(); c.arc(w / 2, h * .36, 26, 0, TAU); c.fill(); }
  else if (shape === 1) { c.beginPath(); c.moveTo(w / 2, 30); c.lineTo(w - 30, h * .58); c.lineTo(30, h * .58); c.fill(); }
  else { c.fillRect(w / 2 - 24, h * .2, 48, 48); }
  c.fillStyle = '#1e2235'; c.fillRect(24, h * .8, w - 48, 8); c.fillRect(34, h * .88, w - 68, 6);
 });
 // chalkboard: redrawn as the lesson progresses
 const boardCanvas = document.createElement('canvas'); boardCanvas.width = 1024; boardCanvas.height = 512;
 const boardTex = new T3.CanvasTexture(boardCanvas); boardTex.colorSpace = T3.SRGBColorSpace; boardTex.anisotropy = 4;
 let boardDrawn = -1;
 function drawBoard(p, subj, title) {
  const step = Math.floor(p / 4);
  if (step === boardDrawn) return;
  boardDrawn = step;
  const c = boardCanvas.getContext('2d'), w = 1024, h = 512;
  c.fillStyle = '#24443a'; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(255,255,255,${.02 + (i % 5) * .006})`; c.fillRect((i * 173) % w, (i * 97) % h, 120, 40); }
  c.fillStyle = '#f4f1e8'; c.font = '700 54px "Baloo 2", system-ui, sans-serif'; c.textBaseline = 'top';
  c.fillText(title, 50, 34);
  c.fillStyle = 'rgba(244,241,232,.5)'; c.fillRect(50, 100, Math.min(600, 50 + title.length * 26), 4);
  const lines = {
   math: ['2 × 3 = 6', '4 × 5 = 20', '6 × 7 = 42', '7 × 8 = 56', '9 × 9 = 81'],
   sci: ['H₂O = water', 'CO₂', 'O₂ + plants', '☀ → energy', 'cells ◯◯◯'],
   geo: ['△  3 sides', '□  4 sides', '⬠  5 sides', '◯  r × 2 = d', 'πr²']
  }[subj] || [];
  const shown = Math.min(lines.length, Math.floor(p / 18));
  c.font = '600 46px "Baloo 2", system-ui, sans-serif';
  for (let i = 0; i < shown; i++) { c.fillStyle = i % 2 ? '#ffe07a' : '#f4f1e8'; c.fillText(lines[i], 60 + (i % 2) * 380, 140 + Math.floor(i / 2) * 80 + (i % 2) * 40); }
  // a partly written line: chalk progress inside the current 18% slice
  if (shown < lines.length) {
   const part = (p % 18) / 18, txt = lines[shown], cut = Math.floor(txt.length * part);
   c.fillStyle = '#f4f1e8'; c.fillText(txt.slice(0, cut), 60 + (shown % 2) * 380, 140 + Math.floor(shown / 2) * 80 + (shown % 2) * 40);
  }
  // progress doodle: a star when done
  if (p >= 100) { c.strokeStyle = '#ffc93c'; c.lineWidth = 6; c.beginPath(); for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 26 : 60; c.lineTo(880 + Math.cos(a) * r, 380 + Math.sin(a) * r); } c.stroke(); }
  boardTex.needsUpdate = true;
 }

 /* ---------- room ---------- */
 (function room() {
  const wallBack = M('#f3e9d2', .9), wallRight = M('#ddede6', .9), wains = M('#5e9c93', .75), trim = M('#ffffff', .5);
  // base slab + floor
  S(G.box, M('#2f6f68', .7), 0, -.2, 0, 10.4, .36, 8.4);
  const floor = new T3.Mesh(new T3.PlaneGeometry(10.2, 8.2), new T3.MeshStandardMaterial({ map: floorTex, roughness: .5 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = 0.005; floor.receiveShadow = true; scene.add(floor);
  floor.userData.floor = true;
  // back wall (z = -4.05) with three window openings (x -3, 0, 3; width 1.7; y 1.0–2.5)
  const H = 3.1, wz = -4.05;
  S(G.box, wallBack, 0, .5, wz, 10.4, 1, .15);
  S(G.box, wallBack, 0, 2.8, wz, 10.4, .6, .15);
  [[-5.2, -3.85], [-2.15, -.85], [.85, 2.15], [3.85, 5.2]].forEach(([a, b]) => S(G.box, wallBack, (a + b) / 2, 1.75, wz, b - a, 1.5, .15));
  // right wall (x = 5.15)
  const wx = 5.15;
  S(G.box, wallRight, wx, H / 2, 0, .15, H, 8.4);
  S(G.box, wains, 0, .45, wz + .09, 10.3, .9, .04); S(G.box, wains, wx - .09, .45, 0, .04, .9, 8.3);
  S(G.box, trim, 0, .92, wz + .12, 10.3, .06, .05); S(G.box, trim, wx - .12, .92, 0, .05, .06, 8.3);
  S(G.box, M('#e7dcc2', .8), 0, H + .02, wz, 10.45, .06, .2); S(G.box, M('#d3e3dc', .8), wx, H + .02, 0, .2, .06, 8.45);
  // windows: frames + sills; outside: grass, sky and trees
  [-3, 0, 3].forEach(x => {
   [1.0, 2.5].forEach(y => S(G.box, trim, x, y, wz, 1.82, .08, .2));
   [x - .85, x + .85].forEach(xx => S(G.box, trim, xx, 1.75, wz, .1, 1.5, .18));
   S(G.box, trim, x, 1.75, wz, .07, 1.5, .1);
   S(G.box, trim, x, 1.93, wz, 1.7, .05, .1);
   S(G.box, trim, x, .97, wz + .16, 1.95, .05, .3);
  });
  S(G.box, M('#7fc77a', .9), 0, -.35, -9, 40, .1, 10, 0, 0, 0, true);
  const sky = new T3.Mesh(new T3.PlaneGeometry(40, 14), new T3.MeshBasicMaterial({ map: canvasTex(4, 64, (c) => { const g = c.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, '#7cc0ea'); g.addColorStop(1, '#d9f0fb'); c.fillStyle = g; c.fillRect(0, 0, 4, 64); }) }));
  sky.position.set(0, 5, -14); scene.add(sky);
  const leaf = [M('#4daa57', .7), M('#3e9150', .7), M('#6cc46f', .7)];
  [[-4, -6.2, 1.1], [-1.2, -7.4, 1.3], [1.6, -6, 1], [4.2, -7, 1.2], [-6.5, -7.5, 1], [6.8, -6.5, 1.1]].forEach(([x, z, s], i) => {
   S(G.cylLo, M('#8a5a3b', .8), x, .6 * s, z, .12 * s, 1.4 * s, .12 * s);
   for (let k = 0; k < 5; k++) S(G.sphLo, leaf[(i + k) % 3], x + Math.sin(i * 3 + k * 2.1) * .45 * s, (1.8 + Math.cos(k * 1.7) * .3) * s, z + Math.cos(i + k * 1.3) * .35 * s, (.55 + (k % 3) * .08) * s);
  });
  // chalkboard on the right wall, facing -x
  const fr = M('#c98b4e', .55);
  const board = new T3.Mesh(new T3.PlaneGeometry(2.9, 1.3), new T3.MeshStandardMaterial({ map: boardTex, roughness: .9 }));
  board.position.set(wx - .08, 1.62, BOARD.z); board.rotation.y = -Math.PI / 2; board.receiveShadow = true; scene.add(board);
  board.userData.board = true;
  [.97, 2.27].forEach(y => S(G.box, fr, wx - .12, y, BOARD.z, .07, .07, 3.0));
  [BOARD.z - 1.47, BOARD.z + 1.47].forEach(z => S(G.box, fr, wx - .12, 1.62, z, .07, 1.37, .07));
  S(G.box, fr, wx - .2, .95, BOARD.z, .18, .04, 2.8);
  S(G.box, M('#ffffff', .8), wx - .22, .99, BOARD.z - .8, .05, .04, .1);
  // door
  S(G.box, M('#ffffff', .5), wx - .13, 1.16, DOOR.z, .04, 2.32, 1.3);
  const door = new T3.Group(); door.position.set(wx - .14, 0, DOOR.z + .575); scene.add(door);
  mesh(G.box, M('#d58b4e', .55), 0, 1.1, -.575, .06, 2.2, 1.15, door);
  mesh(G.box, M('#bfe3f2', .15), -.035, 1.62, -.575, .02, .55, .45, door, false);
  mesh(G.sph, M('#ffc93c', .25, { metalness: .7 }), -.07, 1.05, -1.0, .045, .045, .045, door, false);
  const doorObj = door;
  // cork board with notes
  S(G.box, M('#c99a64', .95), wx - .1, 1.65, -.55, .05, .95, 1.6);
  ['#ffffff', '#ffe07a', '#a8e0f5', '#ffb3a7', '#ffffff', '#c9f2c7'].forEach((cc, i) => S(G.box, M(cc, .8), wx - .135, 1.88 - Math.floor(i / 3) * .45, -1.05 + (i % 3) * .48, .01, .3, .34, (i % 2 ? .08 : -.06), 0, 0, true));
  // clock above the middle window
  S(G.cyl, M('#ffffff', .4), 0, 2.83, wz + .1, .22, .05, .22, Math.PI / 2);
  S(G.torus, M('#ff6b5b', .4), 0, 2.83, wz + .12, .22, .22, .22);
  const hand1 = mesh(G.box, M('#1e2235', .4), 0, 2.83, wz + .16, .02, .14, .01, null, false); hand1.geometry = G.box;
  const clockHands = [hand1, mesh(G.box, M('#1e2235', .4), 0, 2.83, wz + .17, .02, .1, .01, null, false)];
  clockHands.forEach(h => { h.geometry = new T3.BoxGeometry(1, 1, 1); h.geometry.translate(0, .5, 0); });
  room.clock = clockHands;
  // pennant garland
  const pc = ['#ff6b5b', '#ffc93c', '#5bc0eb', '#3e9e5c', '#b39ddb'];
  [-4.8, -1.55, 1.55].forEach(sx => { for (let i = 0; i < 6; i++) { const t = i / 5; S(G.cone, M(pc[i % 5], .7), sx + t * 3.1, 2.56 - .18 * Math.sin(Math.PI * t), wz + .12, .11, .24, .02, Math.PI, 0, 0, true); } });
  // posters between windows
  [[-4.55, '#5bc0eb', '#ffc93c', 0], [-1.5, '#ff6b5b', '#ffffff', 1], [1.5, '#3e9e5c', '#ffe07a', 2], [4.55, '#b39ddb', '#ffffff', 0]].forEach(([x, a, b, s]) => {
   const p = new T3.Mesh(new T3.PlaneGeometry(.75, .95), new T3.MeshStandardMaterial({ map: posterTex(a, b, s), roughness: .8 }));
   p.position.set(x, 1.75, wz + .085); p.receiveShadow = true; scene.add(p);
  });
  // low shelf with books, plants, globe
  S(G.box, M('#e0ae72', .55), -3, .42, -3.75, 2.2, .84, .45);
  for (let i = 0; i < 3; i++) { S(G.box, M('#2f7f78', .65), -3.73 + i * .73, .42, -3.52, .66, .7, .02, 0, 0, 0, true); for (let j = 0; j < 5; j++) S(G.box, M(pc[(i + j) % 5], .6), -3.98 + i * .73 + j * .11, .3 + .02 * (j % 3), -3.6, .08, .3 + .04 * (j % 3), .25); }
  const plant = (x, y, z, s, pot) => { S(G.cyl, M(pot, .55), x, y + .12 * s, z, .14 * s, .24 * s, .14 * s); for (let i = 0; i < 6; i++) S(G.sphLo, leaf[i % 3], x + Math.cos(i * 2.4) * .08 * s, y + (.32 + (i % 3) * .07) * s, z + Math.sin(i * 2.4) * .08 * s, (.1 + (i % 2) * .03) * s); };
  plant(-2.3, .84, -3.75, 1, '#ff6b5b'); plant(3.6, .97, -3.82, .8, '#5bc0eb'); plant(.6, .97, -3.82, .7, '#ffc93c');
  S(G.sph, M('#5bc0eb', .45), -3.6, 1.05, -3.75, .17); S(G.sph, M('#6cc46f', .7), -3.57, 1.1, -3.7, .12, .1, .07); S(G.cyl, M('#c98b4e', .55), -3.6, .88, -3.75, .08, .04, .08);
  // reading corner: rug + bean bag
  S(G.cyl, M('#ffc93c', .95), 3.6, .012, -2.1, 1.0, .02, 1.0, 0, 0, 0, true);
  S(G.torus, M('#ff6b5b', .95), 3.6, .02, -2.1, .85, .85, .3, Math.PI / 2, 0, 0, true);
  S(G.sph, M('#5bc0eb', .8), 4.1, .22, -2.6, .45, .25, .45);
  // teacher desk front-left
  const td = M('#c98b4e', .5);
  S(G.box, td, -3.4, .78, 2.6, 1.7, .07, .8);
  S(G.box, M('#2f7f78', .65), -3.4, .4, 2.3, 1.6, .72, .1);
  [-.78, .78].forEach(dx => S(G.box, td, -3.4 + dx, .4, 2.6, .07, .74, .72));
  S(G.sph, M('#e94f37', .35), -3.9, .96, 2.65, .14);
  S(G.box, M('#3e9e5c', .55), -3.2, .84, 2.6, .38, .045, .28); S(G.box, M('#ffc93c', .55), -3.2, .89, 2.6, .38, .045, .28, 0, .2, 0);
  S(G.cyl, M('#ffffff', .35), -2.8, .88, 2.7, .07, .15, .07);
  // student desks + chairs
  KIDS.forEach(k => {
   const x = COLS[k.col], z = ROWS[k.row];
   S(G.box, M('#e0ae72', .5), x, .725, z, 1.05, .05, .62);
   S(G.box, M('#2f7f78', .55), x, .6, z - .05, .95, .03, .5);
   [-.46, .46].forEach(dx => [-.25, .25].forEach(dz => S(G.cylLo, M('#2f7f78', .4, { metalness: .3 }), x + dx, .35, z + dz, .025, .7, .025)));
   const cz = z - .62;
   S(G.box, M(k.chair, .45), x, .42, cz, .46, .05, .42);
   S(G.box, M(k.chair, .45), x, .72, cz - .23, .44, .3, .05);
   [-.19, .19].forEach(dx => { [-.17, .17].forEach(dz => S(G.cylLo, M('#2f7f78', .4, { metalness: .3 }), x + dx, .21, cz + dz, .02, .42, .02)); S(G.cylLo, M('#2f7f78', .4, { metalness: .3 }), x + dx, .56, cz - .22, .018, .3, .018); });
   // desk items
   const it = (k.col + k.row * 2) % 3;
   if (it === 0) { S(G.box, M('#ffffff', .7), x - .12, .757, z, .22, .012, .3, 0, 0, -.1, true); S(G.box, M('#ffffff', .7), x + .1, .757, z, .22, .012, .3, 0, 0, .1, true); S(G.box, M('#5bc0eb', .55), x - .01, .752, z, .46, .01, .32, 0, 0, 0, true); }
   else if (it === 1) { S(G.box, M('#ff6b5b', .55), x + .15, .757, z, .26, .02, .34, 0, .2, 0, true); }
   else { for (let i = 0; i < 3; i++) S(G.box, M(pc[i], .55), x + .25, .765 + i * .045, z - .05, .3, .04, .22, 0, i * .15, 0); }
  });
  mergeStatics();
  room.door = doorObj;
  room.board = board;
  room.floor = floor;
  scene.userData.room = room;
 })();
 const ROOM = scene.userData.room;
 const DESKS = KIDS.map(k => ({ x: COLS[k.col], z: ROWS[k.row], w: 1.12, d: .7 }));
 const OBST = DESKS.map(d => ({ x0: d.x - d.w / 2, x1: d.x + d.w / 2, z0: d.z - d.d / 2 - .82, z1: d.z + d.d / 2 }))
  .concat([{ x0: -4.3, x1: -2.5, z0: 2.15, z1: 3.05 }, { x0: -4.15, x1: -1.85, z0: -4, z1: -3.45 }, { x0: 3.6, x1: 4.6, z0: -3.1, z1: -2.1 }]);

 /* ---------- characters ---------- */
 function face(head, R, o) {
  const ink = MB('#1b1b2a'), white = M('#ffffff', .3), hl = MB('#ffffff');
  const f = { eyes: [], pupils: [], lids: [], brows: [], mouths: {} };
  const ex = .37 * R, ey = .05 * R, ez = .86 * R;
  for (const s of [-1, 1]) {
   const eye = new T3.Group(); eye.position.set(s * ex, ey, ez); head.add(eye);
   mesh(G.sph, white, 0, 0, 0, .24 * R, .3 * R, .14 * R, eye, false);
   const pup = new T3.Group(); eye.add(pup);
   mesh(G.sph, ink, 0, -.02 * R, .08 * R, .165 * R, .205 * R, .1 * R, pup, false);
   mesh(G.sphLo, hl, .06 * R, .06 * R, .17 * R, .05 * R, .05 * R, .03 * R, pup, false);
   f.eyes.push(eye); f.pupils.push(pup);
   const lid = mesh(G.half, ink, s * ex, ey - .02 * R, ez + .06 * R, .14 * R, .14 * R, .1 * R, head, false);
   lid.rotation.z = Math.PI; lid.visible = false; f.lids.push(lid);
   const br = mesh(G.cap, ink, s * ex, ey + .38 * R, ez + .03 * R, .045 * R, .12 * R, .04 * R, head, false);
   br.rotation.z = Math.PI / 2; f.brows.push(br);
   if (o.blush) mesh(G.sphLo, M('#ff8a80', .7), s * .62 * R, -.25 * R, .74 * R, .14 * R, .09 * R, .05 * R, head, false);
   mesh(G.sphLo, M(o.skin, .55), s * .97 * R, -.05 * R, 0, .1 * R, .2 * R, .2 * R, head);
  }
  mesh(G.sphLo, M(o.skin, .5), 0, -.12 * R, .99 * R, .085 * R, .07 * R, .07 * R, head, false);
  const smile = mesh(G.half, ink, 0, -.33 * R, .9 * R, .17 * R, .17 * R, .12 * R, head, false); smile.rotation.z = Math.PI;
  const open = mesh(G.sph, M('#5a1f2b', .6), 0, -.38 * R, .88 * R, .12 * R, .15 * R, .06 * R, head, false);
  const grin = new T3.Group(); grin.position.set(0, -.34 * R, .9 * R); head.add(grin);
  const gg = mesh(new T3.CircleGeometry(1, 20, Math.PI, Math.PI), MB('#7a2e3a'), 0, 0, 0, .22 * R, .2 * R, 1, grin, false);
  mesh(new T3.PlaneGeometry(1, 1), MB('#ffffff'), 0, -.03 * R, .005, .3 * R, .06 * R, 1, grin, false);
  const flat = mesh(G.cap, ink, 0, -.35 * R, .92 * R, .03 * R, .12 * R, .03 * R, head, false); flat.rotation.z = Math.PI / 2;
  const frown = mesh(G.half, ink, 0, -.42 * R, .9 * R, .14 * R, .14 * R, .1 * R, head, false);
  f.mouths = { smile, open, grin, flat, frown };
  if (o.glasses) { const gm = M(o.glasses, .3, { metalness: .2 }); for (const s of [-1, 1]) { const t = mesh(G.torus, gm, s * ex, ey, ez + .14 * R, .27 * R, .27 * R, .27 * R, head, false); } mesh(G.cap, gm, 0, ey + .02 * R, ez + .16 * R, .025 * R, .12 * R, .025 * R, head, false).rotation.z = Math.PI / 2; }
  return f;
 }
 function setFace(f, mood) {
  const m = { focus: 'smile', happy: 'grin', joke: 'grin', laugh: 'grin', talk: 'open', phone: 'flat', sleep: 'flat', throw: 'smile', upset: 'frown', surprised: 'open', hand: 'grin', cheat: 'flat', innocent: 'open', teach: 'smile', worried: 'frown', walk: 'smile' }[mood] || 'smile';
  for (const k in f.mouths) f.mouths[k].visible = k === m;
  const closed = mood === 'sleep' || mood === 'laugh';
  f.eyes.forEach(e => e.visible = !closed);
  f.lids.forEach((l, i) => { l.visible = closed; l.rotation.z = mood === 'laugh' ? 0 : Math.PI; });
  const tilt = { throw: -.35, upset: -.4, cheat: -.2, surprised: 0, worried: .35 }[mood] || 0;
  const up = mood === 'surprised' || mood === 'hand' || mood === 'innocent' ? .06 : 0;
  f.brows.forEach((b, i) => { b.rotation.z = Math.PI / 2 + (i ? -tilt : tilt); b.userData.up = up; });
  f.mood = mood;
 }
 function hair(head, R, style, color, hat) {
  const hm = M(color, .55);
  const capG = new T3.SphereGeometry(1, 30, 18, 0, TAU, 0, 1.75);
  const add = (g, m, x, y, z, sx, sy, sz, rx, ry, rz) => { const o = mesh(g, m, x, y, z, sx, sy, sz, head); o.rotation.set(rx || 0, ry || 0, rz || 0); return o; };
  if (style === 'afro') { for (let i = 0; i < 22; i++) { const th = i * 2.39996, ph = -.15 + (i % 7) / 6 * 1.35, rr = R * 1.02; const p = new T3.Vector3(Math.cos(th) * Math.cos(ph) * rr, Math.sin(ph) * rr + .08 * R, Math.sin(th) * Math.cos(ph) * rr - .05 * R); if (p.z > .45 * R && p.y < .5 * R) continue; add(G.sphLo, hm, p.x, p.y, p.z, .36 * R); } return; }
  if (style === 'hood') { add(new T3.SphereGeometry(1, 30, 18, 0, TAU, 0, 2.2), M(color, .7), 0, .02, -.08 * R, R * 1.2, R * 1.18, R * 1.15, -1.1); return; }
  add(capG, hm, 0, .02 * R, -.02 * R, R * 1.07, R * 1.07, R * 1.07, -.65);
  if (style === 'buns' || style === 'ponytail' || style === 'bob') for (const s of [-1, 1]) add(G.sph, hm, s * .86 * R, -.12 * R, -.12 * R, .24 * R, .5 * R, .5 * R);
  if (style === 'buns') { add(G.sph, hm, -.62 * R, .78 * R, -.1 * R, .34 * R); add(G.sph, hm, .62 * R, .78 * R, -.1 * R, .34 * R); }
  if (style === 'ponytail') { add(G.sph, hm, 0, .1 * R, -1.08 * R, .3 * R, .62 * R, .3 * R, .3); add(G.torus, M('#ff6b5b', .5), 0, .45 * R, -.95 * R, .16 * R, .16 * R, .16 * R, 1.2); }
  if (style === 'bun') add(G.sph, hm, 0, .95 * R, -.35 * R, .38 * R);
  if (style === 'swoop' || style === 'cap' || style === 'phones') add(G.sph, hm, -.15 * R, .62 * R, .62 * R, .62 * R, .3 * R, .36 * R, -.4, .3, 0);
  if (style === 'cap') { const c = add(new T3.SphereGeometry(1, 28, 12, 0, TAU, 0, 1.45), M(hat, .6), 0, .1 * R, 0, R * 1.12, R * 1.12, R * 1.12, -.2); add(G.cyl, M(hat, .6), 0, .45 * R, -1.0 * R, .55 * R, .06 * R, .4 * R, -.25); }
  if (style === 'phones') { add(G.band, M(hat, .45), 0, -.02 * R, 0, R * 1.13, R * 1.13, R * 1.13); for (const s of [-1, 1]) add(G.cyl, M(hat, .4), s * 1.07 * R, -.05 * R, 0, .3 * R, .2 * R, .3 * R, 0, 0, Math.PI / 2); }
  if (style === 'grey') add(G.sph, hm, 0, .55 * R, .5 * R, .7 * R, .28 * R, .3 * R, -.3);
 }

 function makeChar(o) {
  // o: {skin, shirt, pants, hair, hairC, hat, glasses, R, seated, scale, collar, badge}
  const R = o.R || .3, root = new T3.Group(), skin = M(o.skin, .55), shirt = M(o.shirt, .7), pants = M(o.pants, .7), shoe = M('#2b2b36', .45);
  const seated = !!o.seated;
  const hipY = seated ? .48 : .8;
  const c = { root, R, seated, parts: {} };
  const body = new T3.Group(); body.position.y = hipY; root.add(body);
  const torsoH = seated ? .3 : .36;
  const torso = mesh(G.sph, shirt, 0, torsoH * .9, 0, seated ? .25 : .24, torsoH, seated ? .2 : .18, body);
  if (o.collar) mesh(G.torus, M(o.collar, .6), 0, torsoH * 1.75, .02, .1, .1, .1, body).rotation.x = Math.PI / 2;
  if (o.badge) { mesh(G.box, M('#ffffff', .4), 0, torsoH * 1.05, .19, .08, .1, .012, body); mesh(G.cyl, M('#5bc0eb', .5), 0, torsoH * 1.38, .17, .006, .3, .006, body).rotation.z = .02; }
  if (!seated) mesh(G.sph, pants, 0, 0, 0, .21, .12, .16, body);
  // neck + head
  const neck = new T3.Group(); neck.position.y = torsoH * 1.85; body.add(neck);
  mesh(G.cyl, skin, 0, .02, 0, .06, .08, .06, neck);
  const head = new T3.Group(); head.position.y = R * .95; neck.add(head);
  mesh(G.sph, skin, 0, 0, 0, R, R * .96, R * .95, head);
  hair(head, R, o.hair, o.hairC, o.hat);
  const f = face(head, R, { skin: o.skin, blush: true, glasses: o.glasses });
  // arms: pivot at shoulder, arm hangs along -y
  const arms = [];
  for (const s of [-1, 1]) {
   const sh = new T3.Group(); sh.position.set(s * .23, torsoH * 1.45, 0); body.add(sh);
   mesh(capG(.065, .2), shirt, 0, -.15, 0, 1, 1, 1, sh);
   const el = new T3.Group(); el.position.y = -.3; sh.add(el);
   mesh(capG(.055, .17), o.sleeveLong ? shirt : skin, 0, -.13, 0, 1, 1, 1, el);
   const hand = mesh(G.sph, skin, 0, -.29, 0, .068, .068, .068, el);
   arms.push({ sh, el, hand });
  }
  // legs
  const legs = [];
  for (const s of [-1, 1]) {
   const hp = new T3.Group(); hp.position.set(s * .1, 0, 0); body.add(hp);
   mesh(capG(.085, .22), pants, 0, -.18, 0, 1, 1, 1, hp);
   const kn = new T3.Group(); kn.position.y = -.38; hp.add(kn);
   mesh(capG(.07, .2), pants, 0, -.15, 0, 1, 1, 1, kn);
   mesh(G.sph, shoe, 0, -.34, .05, .08, .06, .13, kn);
   legs.push({ hp, kn });
  }
  if (seated) legs.forEach(l => { l.hp.rotation.x = -Math.PI / 2; l.kn.rotation.x = Math.PI / 2; });
  else legs.forEach(l => { l.kn.position.y = -.4; });
  // props
  const phone = mesh(G.box, M('#22252f', .3), 0, -.31, .06, .1, .17, .02, arms[1].el); phone.visible = false;
  const paper = mesh(G.sphLo, M('#f4f1e8', .8), 0, -.33, .05, .07, .07, .07, arms[1].el); paper.visible = false;
  const book = o.book ? mesh(G.box, M('#e94f37', .5), .02, -.33, .1, .24, .32, .05, arms[0].el) : null;
  root.traverse(m => { if (m.isMesh) m.userData.char = c; });
  Object.assign(c, { body, torso, neck, head, face: f, arms, legs, phone, paper, book, hipY, torsoH });
  if (o.scale) root.scale.setScalar(o.scale);
  setFace(f, 'focus');
  scene.add(root);
  return c;
 }

 /* ---------- floor markers: teaching spot and selected student ---------- */
 const ringGeo = new T3.RingGeometry(.5, .62, 40);
 const ringBoard = new T3.Mesh(ringGeo, new T3.MeshBasicMaterial({ color: '#ffc93c', transparent: true, opacity: .85, depthWrite: false }));
 ringBoard.rotation.x = -Math.PI / 2; ringBoard.position.set(BOARD.spotX, .02, BOARD.spotZ); scene.add(ringBoard);
 const ringSel = new T3.Mesh(new T3.RingGeometry(.62, .74, 40), new T3.MeshBasicMaterial({ color: '#ffc93c', transparent: true, opacity: .9, depthWrite: false }));
 ringSel.rotation.x = -Math.PI / 2; ringSel.visible = false; scene.add(ringSel);

 /* ---------- students ---------- */
 const kids = KIDS.map((k, i) => {
  const c = makeChar({ skin: k.skin, shirt: k.shirt, pants: k.pants, hair: k.hair, hairC: k.hairC, hat: k.hat, glasses: k.glasses, collar: k.collar, seated: true, R: .3 });
  const x = COLS[k.col], z = ROWS[k.row] - .6;
  c.root.position.set(x, 0, z);
  // invisible pick box
  const hit = new T3.Mesh(new T3.BoxGeometry(.8, 1.6, .9), new T3.MeshBasicMaterial({ visible: false }));
  hit.position.set(x, .8, z + .1); hit.userData.kid = i; scene.add(hit);
  return Object.assign(c, { k, i, x, z, hit, state: 'focus', t: 0, dur: 0, buff: 0, cool: 3 + i * 1.3, bub: null, bubT: 0, look: null, throwT: 0, phase: Math.random() * 10, blink: 2 + Math.random() * 3, handT: 0, happy: 60 });
 });
 const teacher = makeChar({ skin: '#e8b48f', shirt: '#f2b33d', pants: '#1f5e55', hair: 'bun', hairC: '#5a3420', glasses: '#2b2b36', collar: '#ffffff', badge: true, R: .27, book: true, sleeveLong: true });
 teacher.root.position.set(1.2, 0, 2.9);
 Object.assign(teacher, { vel: new T3.Vector2(), dir: Math.PI, walk: 0, target: null, teachT: 0 });
 const principal = makeChar({ skin: '#d9a07a', shirt: '#3b4a6b', pants: '#2b2b36', hair: 'bun', hairC: '#a7adb5', glasses: '#8a5a3b', collar: '#ffffff', badge: true, R: .28, scale: 1.08, sleeveLong: true });
 principal.root.visible = false;
 Object.assign(principal, { phase: 'off', t: 0, walk: 0 });

 /* ---------- camera: fit the whole classroom for any screen shape ---------- */
 const camOff = new T3.Vector3(-9.1, 9.0, 11.1);
 const camCenter = new T3.Vector3(.2, .6, .1), camLookCur = camCenter.clone(), camLook = camCenter.clone();
 let camK = 1;
 const CORNERS = [[-5.2, 0, -4.2], [5.2, 0, -4.2], [-5.2, 0, 4.2], [5.2, 0, 4.2], [-5.2, 3.1, -4.1], [5.2, 3.1, -4.1], [5.2, 3.1, 4.2]].map(a => new T3.Vector3(a[0], a[1], a[2]));
 function fitCam() {
  camCenter.set(.2, .6, .1);
  const w = host.clientWidth || 800, h = host.clientHeight || 450, a = w / h;
  const portrait = a < 1.15;
  if (!portrait) {
   const vf = a >= 1.6 ? 25 : lerp(34, 25, clamp((a - 1.15) / .45, 0, 1));
   camera.fov = vf; camera.aspect = a; camera.updateProjectionMatrix();
   camOff.set(-9.1, 9.0, 11.1); camCenter.set(.3, .7, .2);
   camK = Math.max(1, .392 / (Math.tan(vf * Math.PI / 360) * a));
   return;
  }
  camera.fov = 38; camera.aspect = a; camera.updateProjectionMatrix();
  camOff.set(portrait ? -4.2 : -9.1, portrait ? 12.5 : 9.0, portrait ? 9.4 : 11.1);
  // top of the screen is used by the HUD, so leave more room there
  const yTop = .5, yBot = -.62, xLim = 1.1;
  let lo = .3, hi = 4;
  const v = new T3.Vector3();
  for (let i = 0; i < 22; i++) {
   const k = (lo + hi) / 2;
   camera.position.copy(camCenter).addScaledVector(camOff, k); camera.lookAt(camCenter); camera.updateMatrixWorld(); camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
   let ok = true;
   for (const c of CORNERS) { v.copy(c).project(camera); if (Math.abs(v.x) > xLim || v.y > yTop || v.y < yBot) { ok = false; break; } }
   if (ok) hi = k; else lo = k;
  }
  camK = hi;
 }
 function resize() {
  const w = host.clientWidth || 800, h = host.clientHeight || 450;
  renderer.setSize(w, h, false);
  fitCam();
 }
 global.addEventListener('resize', resize);
 if ('ResizeObserver' in global) new ResizeObserver(resize).observe(host);
 resize();

 /* ---------- audio (tiny synth, off until first click) ---------- */
 let AC = null, muted = store.get('mute', false);
 function beep(type) {
  if (muted) return;
  try {
   AC = AC || new (global.AudioContext || global.webkitAudioContext)();
   const t0 = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
   const P = { ok: [660, 990, .12, 'triangle'], warn: [520, 260, .18, 'square'], bad: [300, 180, .25, 'sawtooth'], pop: [880, 1320, .08, 'sine'], bell: [1046, 1046, .9, 'sine'], alert: [740, 520, .3, 'triangle'], chalk: [2400, 1800, .03, 'square'] }[type] || [600, 600, .1, 'sine'];
   o.type = P[3]; o.frequency.setValueAtTime(P[0], t0); o.frequency.exponentialRampToValueAtTime(P[1], t0 + P[2]);
   g.gain.setValueAtTime(type === 'chalk' ? .015 : .07, t0); g.gain.exponentialRampToValueAtTime(.0001, t0 + P[2] + .05);
   o.connect(g); g.connect(AC.destination); o.start(t0); o.stop(t0 + P[2] + .08);
  } catch (e) { }
 }

 /* ---------- HUD ---------- */
 const hud = el('div', '', '');
 hud.style.cssText = 'position:absolute;inset:0;pointer-events:none';
 ui.appendChild(hud);
 const lessonCard = el('section', 'tt-card tt-lesson');
 lessonCard.innerHTML = `<div class="tt-lh"><div class="tt-ring"><svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="19" fill="none" stroke="rgba(255,247,232,.2)" stroke-width="5"/><circle class="arc" cx="23" cy="23" r="19" fill="none" stroke="#ffc93c" stroke-width="5" stroke-linecap="round" stroke-dasharray="119.4" stroke-dashoffset="0" transform="rotate(-90 23 23)"/></svg><b class="tm">3:30</b></div><div><small class="sj"></small><strong class="ln"></strong></div></div><div class="tt-prog" title="${esc(L.progress)}"><div></div></div><ul class="tt-tasks"></ul>`;
 hud.appendChild(lessonCard);
 const moodCard = el('section', 'tt-card tt-mood', `<div class="row"><span>${esc(L.mood)}</span><b></b></div><div class="tt-bar"><span></span></div>`);
 hud.appendChild(moodCard);
 const top = el('div', 'tt-top');
 const scorePill = el('div', 'tt-card tt-pill', '<span aria-hidden="true" style="color:#ffc93c">★</span><span class="v">0</span>');
 const pauseBtn = el('button', 'tt-btn tt-icon', '❚❚'); pauseBtn.setAttribute('aria-label', L.paused);
 top.append(scorePill, pauseBtn);
 hud.appendChild(top);
 const toast = el('div', 'tt-toast', '<div><b></b><small></small></div><span class="cd"></span>'); toast.hidden = true; toast.setAttribute('role', 'status');
 hud.appendChild(toast);
 const hint = el('div', 'tt-hint'); hint.style.opacity = 0; hud.appendChild(hint);
 const acts = el('div', 'tt-acts'); acts.style.display = 'none'; labels.appendChild(acts);
 const tag = el('div', 'tt-tag'); tag.style.display = 'none'; labels.appendChild(tag);
 let joy = null;
 if (touch) {
  joy = el('div', 'tt-joy', '<i></i>'); hud.appendChild(joy);
 }
 const ov = el('div', 'tt-ov'); ui.appendChild(ov);
 hud.style.visibility = 'hidden';

 /* ---------- game state ---------- */
 let G2 = null;      // current lesson
 let paused = true, mode = 'menu';
 const best = () => store.get('best', 0);
 const lessonNo = () => store.get('lesson', 1);
 const rankIdx = () => Math.min(6, Math.floor((lessonNo() - 1) / 3));

 function newLesson() {
  const n = lessonNo();
  const subj = SUBJ[(n - 1) % SUBJ.length];
  const diff = 1 + Math.min(1.2, (n - 1) * .12);
  G2 = {
   n, subj, diff, time: 210, total: 210, progress: 0, chaos: 8, chaosMax: 8, chaosSum: 0, score: 0,
   answered: 0, stopped: 0, praised: 0, laughs: 0, caught: 0,
   tasks: [{ id: 'teach', goal: 100, cur: 0 }, { id: 'answer', goal: 3, cur: 0 }, { id: 'stop', goal: 4 + Math.min(4, n - 1), cur: 0 }],
   events: [
    { at: 175, kind: 'paper', done: false },
    { at: 120, kind: 'quiz', done: false },
    { at: 62, kind: 'principal', done: false }
   ],
   ev: null, sel: -1, pops: [], balls: [], teachMsgT: 0
  };
  kids.forEach((k, i) => { k.state = 'focus'; k.t = 0; k.dur = 0; k.buff = 0; k.cool = 3 + i * 1.5; k.target = null; setBubble(k, null); setFace(k.face, 'focus'); k.phone.visible = false; k.paper.visible = false; });
  teacher.root.position.set(1.2, 0, 2.9); teacher.dir = Math.PI; teacher.target = null;
  principal.root.visible = false; principal.phase = 'off';
  boardDrawn = -1; drawBoard(0, subj, L.subj[subj]);
  lessonCard.querySelector('.sj').textContent = fmt(L.lesson, { n });
  lessonCard.querySelector('.ln').textContent = L.subj[subj];
  renderTasks();
  setToast(null);
 }

 function taskText(t) { return t.id === 'teach' ? L.task.teach : fmt(L.task[t.id], { n: t.goal }); }
 function renderTasks() {
  const ul = lessonCard.querySelector('.tt-tasks');
  ul.innerHTML = G2.tasks.map(t => { const done = t.cur >= t.goal; return `<li class="${done ? 'done' : ''}"><i>${done ? '✓' : ''}</i><span>${esc(taskText(t))}</span>${t.id !== 'teach' && !done ? `<em>${t.cur}/${t.goal}</em>` : ''}</li>`; }).join('');
 }
 function bump(id, d) {
  const t = G2.tasks.find(x => x.id === id); if (!t) return;
  const was = t.cur >= t.goal;
  t.cur = Math.min(t.goal, t.cur + d);
  if (!was && t.cur >= t.goal) { addScore(150, teacher.root.position, '✓'); beep('bell'); }
  renderTasks();
 }
 function addScore(n, pos, txt) {
  G2.score = Math.max(0, G2.score + n);
  scorePill.querySelector('.v').textContent = G2.score.toLocaleString('en-US');
  if (pos) popText(pos, txt || ((n >= 0 ? '+' : '') + n), n < 0);
 }
 function popText(pos, txt, bad) {
  const e = el('div', 'tt-pop', esc(txt)); if (bad) e.style.color = '#ffb3a7';
  labels.appendChild(e);
  G2.pops.push({ e, p: pos.clone().add(new T3.Vector3(0, 2.0, 0)), t: 0 });
 }
 let toastT = 0, toastCd = null;
 function setToast(title, sub, cd, dur) {
  if (!title) { toast.hidden = true; return; }
  toast.querySelector('b').textContent = title; toast.querySelector('small').textContent = sub || '';
  toastCd = cd || null; toast.querySelector('.cd').textContent = '';
  toast.hidden = false; toastT = dur || 4;
 }
 function setBubble(k, txt, cls) {
  if (!txt) { if (k.bub) { k.bub.remove(); k.bub = null; } return; }
  if (!k.bub) { k.bub = el('div', 'tt-bub'); labels.appendChild(k.bub); }
  k.bub.className = 'tt-bub ' + (cls || ''); k.bub.textContent = txt;
 }

 /* ---------- student behaviour ---------- */
 function nearTeacher(k) { const p = teacher.root.position; return Math.hypot(p.x - k.x, p.z - (k.z + .2)); }
 function teacherAtBoard() { const p = teacher.root.position; return Math.hypot(p.x - BOARD.spotX, p.z - BOARD.spotZ) < .75; }
 function startState(k, s, dur) {
  k.state = s; k.t = 0; k.dur = dur || 0;
  k.phone.visible = s === 'phone';
  k.paper.visible = false;
  const B = L.b;
  const bub = { sleep: [B.zzz, 'zz'], talk: [B.blah, ''], joke: [B.ha, 'joke'], hand: [B.me, 'hand'], throw: [B.psst, 'warn'], upset: [B.ow, 'warn'], laugh: [B.ha, 'joke'], innocent: [B.tune, ''], phone: ['📱', ''], cheat: ['👀', ''] }[s];
  setBubble(k, bub ? bub[0] : null, bub ? bub[1] : '');
  setFace(k.face, s === 'focus' ? 'focus' : s);
  if (s === 'focus') k.cool = 2.5 + Math.random() * 4;
 }
 function isBad(k) { return ['talk', 'phone', 'sleep', 'throw', 'joke', 'cheat', 'innocent'].includes(k.state); }
 function neighbour(k) {
  const cands = kids.filter(o => o !== k && Math.abs(o.k.row - k.k.row) + Math.abs(o.k.col - k.k.col) === 1);
  return cands[Math.floor(Math.random() * cands.length)];
 }
 function throwBall(from, to) {
  const s = from.arms[1].hand.getWorldPosition(new T3.Vector3());
  const e = to.head.getWorldPosition(new T3.Vector3());
  const m = mesh(G.sphLo, M('#f4f1e8', .8), s.x, s.y, s.z, .07, .07, .07);
  G2.balls.push({ m, s, e, t: 0, to, from });
  beep('pop');
 }
 function updateKid(k, dt) {
  const g = G2, B = BEHAV[k.k.type];
  k.t += dt; k.phase += dt; k.buff = Math.max(0, k.buff - dt);
  const dist = nearTeacher(k), away = teacherAtBoard();
  // quiz: everyone writes, a few try to cheat
  if (g.ev && g.ev.kind === 'quiz') {
   if (k.state !== 'cheat' && k.state !== 'focus') startState(k, 'focus');
   if (k.state === 'focus' && Math.random() < dt * .09 * g.diff) startState(k, 'cheat', 3.2 + Math.random() * 2);
   if (k.state === 'cheat' && k.t > k.dur) startState(k, 'focus');
  } else if (g.ev && g.ev.kind === 'principal' && g.ev.stage === 'in') {
   // the principal is in the room: kids get quieter on their own
   if (isBad(k) && Math.random() < dt * .25) startState(k, 'focus');
  } else {
   switch (k.state) {
    case 'focus': {
     k.cool -= dt;
     if (k.cool <= 0) {
      let rate = B.rate * g.diff * (1 + g.chaos / 120);
      if (B.bad !== 'hand') rate *= away ? 1.8 : dist < 2.2 ? .25 : 1;
      if (k.buff > 0 && B.bad !== 'hand') rate *= .35;
      if (B.bad === 'hand' && g.progress < 6) rate = 0;
      if (Math.random() < rate * dt * 4) {
       const s = B.bad;
       if (s === 'talk') { const n = neighbour(k); k.target = n; startState(k, 'talk', 6 + Math.random() * 5); if (n && n.state === 'focus' && Math.random() < .55) { n.target = k; startState(n, 'talk', 5 + Math.random() * 4); } }
       else if (s === 'throw') { k.target = kids[(k.i + 1 + Math.floor(Math.random() * 5)) % 6]; startState(k, 'throw', 7 + Math.random() * 4); k.throwT = .6; }
       else if (s === 'joke') startState(k, 'joke', 3);
       else if (s === 'hand') startState(k, 'hand', 11);
       else if (s === 'sleep') startState(k, 'sleep', 30);
       else if (s === 'phone') startState(k, 'phone', 18);
      }
      k.cool = .25;
     }
     break;
    }
    case 'talk': if (k.t > k.dur || (dist < 1.3 && k.t > 1)) startState(k, 'focus'); break;
    case 'phone': if (k.t > k.dur) startState(k, 'focus'); break;
    case 'sleep': if (dist < 1.25) { k.wakeT = (k.wakeT || 0) + dt; if (k.wakeT > 1.4) { k.wakeT = 0; startState(k, 'surprised', 1.2); setBubble(k, L.b.oops); } } break;
    case 'throw': {
     if (dist < 1.7 && !away) { startState(k, 'innocent', 2.5); break; }
     k.throwT -= dt;
     if (k.throwT <= 0 && k.target) { throwBall(k, k.target); k.throwT = 2.4 + Math.random(); }
     if (k.t > k.dur) startState(k, 'focus');
     break;
    }
    case 'joke': if (k.t > k.dur) { kids.forEach(o => { if (o !== k && (o.state === 'focus' || o.state === 'talk') && Math.random() < .8) startState(o, 'laugh', 2.5 + Math.random()); }); startState(k, 'laugh', 2.5); g.laughs++; } break;
    case 'hand': if (k.t > k.dur) { startState(k, 'focus'); setFace(k.face, 'worried'); k.happy -= 10; } break;
    case 'laugh': case 'upset': case 'innocent': case 'surprised': if (k.t > k.dur) startState(k, 'focus'); break;
    case 'cheat': startState(k, 'focus'); break;
   }
  }
  animateKid(k, dt);
 }
 const tmpV = new T3.Vector3();
 function lookAt(k, wx, wy, wz, amt) {
  // turn the head (yaw) a little and move pupils toward a world point
  const hp = k.head.getWorldPosition(tmpV);
  const dx = wx - hp.x, dz = wz - hp.z, dy = wy - hp.y;
  const yaw = clamp(Math.atan2(dx, dz) - k.root.rotation.y, -.9, .9);
  k.head.rotation.y = lerp(k.head.rotation.y, yaw * .6 * amt, .12);
  const px = clamp(Math.sin(yaw) * .06 * k.R, -.05 * k.R, .05 * k.R) * 1.4, py = clamp(dy * .03, -.04, .04) * k.R * 3;
  k.face.pupils.forEach(p => { p.position.x = lerp(p.position.x, px, .2); p.position.y = lerp(p.position.y, py, .2); });
 }
 function animateKid(k, dt) {
  const s = k.state, ph = k.phase, A = k.arms;
  // defaults
  let headX = 0, headZ = 0, bodyX = 0, bodyY = 0, bodyZ = 0;
  let aL = { x: -1.15, z: .1, e: -.55 }, aR = { x: -1.15, z: .1, e: -.55 };
  const tp = teacher.root.position;
  let look = [tp.x, 1.4, tp.z], lookAmt = 1;
  if (s === 'focus') { headX = .12 + Math.sin(ph * .7) * .03; if (teacherAtBoard()) look = [BOARD.x, 1.6, BOARD.z]; aR.e = -.65 + Math.sin(ph * 6) * .05; }
  if (s === 'talk' && k.target) { look = [k.target.x, 1.3, k.target.z]; headZ = Math.sin(ph * 8) * .05; bodyZ = Math.sin(ph * 3) * .03; aL = { x: -.8, z: .6 + Math.sin(ph * 5) * .3, e: -1.2 }; }
  if (s === 'phone') { headX = .42; look = [k.x, .7, k.z + .6]; aL = { x: -1.2, z: -.25, e: -.9 }; aR = { x: -1.2, z: -.25, e: -.9 }; }
  if (s === 'sleep') { headX = .95; bodyX = .32; bodyY = -.04; aL = { x: -1.9, z: -.1, e: -1.5 }; aR = { x: -1.9, z: -.1, e: -1.5 }; lookAmt = 0; }
  if (s === 'throw') { const w = k.throwT < .5 ? Math.sin((.5 - k.throwT) / .5 * Math.PI) : 0; aR = { x: -2.6 + w * 1.6, z: .2, e: -.6 - w * .8 }; k.paper.visible = k.throwT < 1.4; if (k.target) look = [k.target.x, 1.2, k.target.z]; headX = -.05; }
  if (s === 'joke') { bodyY = Math.abs(Math.sin(ph * 9)) * .05; aL = { x: -.9, z: .9, e: -1 }; aR = { x: -.9, z: .9, e: -1 }; headZ = Math.sin(ph * 6) * .12; look = [k.x, 1.2, k.z + 3]; }
  if (s === 'laugh') { bodyY = Math.abs(Math.sin(ph * 12)) * .035; bodyX = -.08; headX = -.25 + Math.sin(ph * 12) * .05; aL = { x: -.6, z: .3, e: -1.3 }; aR = { x: -.6, z: .3, e: -1.3 }; }
  if (s === 'hand') { aR = { x: 0, z: 2.85 + Math.sin(ph * 7) * .12, e: -.1 }; bodyY = Math.abs(Math.sin(ph * 5)) * .02; headX = -.1; }
  if (s === 'upset') { headZ = Math.sin(ph * 14) * .08; aL = { x: -.7, z: .7, e: -1.4 }; }
  if (s === 'innocent') { headX = -.35; headZ = .15; look = [k.x + 1, 3, k.z]; aL = { x: 0, z: .35, e: -2.3 }; aR = { x: 0, z: .35, e: -2.3 }; }
  if (s === 'surprised') { bodyY = .05; headX = -.15; }
  if (s === 'cheat') { const n = kids[(k.i + (k.k.col < 2 ? 1 : -1))] || k; look = [n.x, .8, n.z + .5]; headX = .2; headZ = .08; bodyZ = (k.k.col < 2 ? -1 : 1) * .12; }
  k.body.position.y = lerp(k.body.position.y, k.hipY + bodyY, .3);
  k.body.rotation.x = lerp(k.body.rotation.x, bodyX, .12);
  k.body.rotation.z = lerp(k.body.rotation.z, bodyZ, .12);
  k.head.rotation.x = lerp(k.head.rotation.x, headX, .15);
  k.head.rotation.z = lerp(k.head.rotation.z, headZ, .15);
  k.neck.position.y = k.torsoH * 1.85 + (s === 'sleep' ? -.05 : 0);
  k.torso.scale.y = k.torsoH * (1 + Math.sin(ph * 2.2) * .015);
  const sa = (arm, a, f, side) => { arm.sh.rotation.x = lerp(arm.sh.rotation.x, a.x, f); arm.sh.rotation.z = lerp(arm.sh.rotation.z, side * a.z, f); arm.el.rotation.x = lerp(arm.el.rotation.x, a.e, f); };
  sa(A[0], aL, .15, -1); sa(A[1], aR, s === 'throw' ? .4 : .15, 1);
  if (lookAmt) lookAt(k, look[0], look[1], look[2], lookAmt);
  // blink
  k.blink -= dt;
  const bl = k.blink < .12 ? .12 : 1; if (k.blink < 0) k.blink = 2.5 + Math.random() * 3.5;
  k.face.eyes.forEach(e => e.scale.y = lerp(e.scale.y, bl, .5));
  k.face.brows.forEach(b => b.position.y = .05 * k.R + .38 * k.R + (b.userData.up || 0) * k.R * 1.5);
  if (s === 'talk' || s === 'joke') { const o = Math.sin(ph * 14) > 0; k.face.mouths.open.visible = o; k.face.mouths.grin.visible = s === 'joke' && !o; k.face.mouths.smile.visible = s === 'talk' && !o; }
 }

 /* ---------- teacher actions ---------- */
 function actions(k) {
  const L2 = L.act;
  return [k.state === 'sleep' ? ['warn', L2.wake, '!'] : ['warn', L2.warn, '!'], ['praise', L2.praise, '★'], ['ask', L2.ask, '?']];
 }
 function recommended(k) { return k.state === 'hand' ? 'ask' : isBad(k) ? 'warn' : k.state === 'focus' ? 'praise' : ''; }
 function doAction(kind) {
  const g = G2; if (!g || g.sel < 0) return;
  const k = kids[g.sel];
  if (nearTeacher(k) > 1.9) { popText(k.root.position, L.tooFar, true); return; }
  const pos = k.root.position;
  if (kind === 'warn') {
   if (k.state === 'cheat') { g.caught++; bump('stop', 1); addScore(60, pos, fmt(L.caught, { n: 60 })); startState(k, 'surprised', 1.4); setBubble(k, L.b.oops); beep('ok'); }
   else if (k.state === 'sleep') { g.stopped++; bump('stop', 1); addScore(40, pos, fmt(L.woke, { n: 40 })); startState(k, 'surprised', 1.4); setBubble(k, L.b.oops); beep('ok'); }
   else if (isBad(k)) {
    g.stopped++; bump('stop', 1); addScore(40, pos, fmt(L.stopped, { n: 40 })); g.chaos = Math.max(0, g.chaos - 8);
    if (k.state === 'talk' && k.target && k.target.state === 'talk') startState(k.target, 'focus');
    startState(k, 'focus'); setBubble(k, L.b.ok); k.bubT = 1.5; k.buff = 6; beep('warn');
   } else { addScore(-20, pos, L.unfair); k.happy -= 15; startState(k, 'upset', 1.6); beep('bad'); }
  } else if (kind === 'praise') {
   if (k.state === 'focus' || k.state === 'hand') { g.praised++; addScore(15, pos, fmt(L.praised, { n: 15 })); k.buff = 25; k.happy += 10; setFace(k.face, 'happy'); setBubble(k, L.b.yes, 'joke'); k.bubT = 1.4; beep('ok'); }
   else { addScore(-15, pos, '…'); g.chaos = Math.min(100, g.chaos + 6); beep('bad'); if (k.state === 'throw' || k.state === 'joke') k.dur += 3; }
  } else if (kind === 'ask') {
   if (k.state === 'hand') {
    g.answered++; bump('answer', 1);
    if (k.k.type === 'brain') { addScore(60, pos, fmt(L.correct, { n: 60 })); g.progress = Math.min(100, g.progress + 5); }
    else if (k.k.type === 'clown') { addScore(30, pos, fmt(L.funny, { n: 30 })); kids.forEach(o => { if (o !== k && o.state === 'focus' && Math.random() < .5) startState(o, 'laugh', 2); }); }
    else { const ok = Math.random() < .6; addScore(ok ? 50 : 20, pos, fmt(ok ? L.correct : L.unsure, { n: ok ? 50 : 20 })); g.progress = Math.min(100, g.progress + (ok ? 4 : 1)); }
    startState(k, 'focus'); setFace(k.face, 'happy'); setBubble(k, L.b.yes, 'hand'); k.bubT = 1.3; beep('ok');
   } else if (isBad(k)) { g.stopped++; bump('stop', 1); addScore(25, pos, fmt(L.stopped, { n: 25 })); startState(k, 'surprised', 1.5); setBubble(k, L.b.oops); beep('warn'); }
   else { const ok = k.k.type === 'brain' || Math.random() < .35; addScore(ok ? 20 : 5, pos, fmt(ok ? L.correct : L.unsure, { n: ok ? 20 : 5 })); if (!ok) { startState(k, 'surprised', 1.2); setBubble(k, L.b.oops); } beep(ok ? 'ok' : 'pop'); }
  }
  select(-1);
 }
 function select(i) {
  if (!G2) return;
  G2.sel = i;
  if (i < 0) { acts.style.display = 'none'; tag.style.display = 'none'; return; }
  const k = kids[i], rec = recommended(k);
  if (nearTeacher(k) < 2) { const p = teacher.root.position; teacher.dir = Math.atan2(k.x - p.x, k.z + .1 - p.z); }
  acts.innerHTML = actions(k).map(([key, label, ico], j) => `<button type="button" class="tt-act${key === rec ? ' hint' : ''}" data-k="${key}"><span>${ico}</span><em>${esc(label)}${touch ? '' : ' · ' + (j + 1)}</em></button>`).join('');
  acts.style.display = 'flex';
  tag.innerHTML = `${esc(k.k.name)}<small>${esc(L.type[k.k.type])} · ${esc(L.st[k.state] || L.st.focus)}</small>`;
  tag.style.display = 'block';
 }
 acts.addEventListener('pointerdown', e => { e.stopPropagation(); const b = e.target.closest('.tt-act'); if (b) doAction(b.dataset.k); });

 /* ---------- events ---------- */
 function startEvent(e) {
  const g = G2; e.done = true;
  if (e.kind === 'paper') {
   g.ev = { kind: 'paper', t: 0 };
   const max = kids[4], lulu = kids[3];
   max.target = kids[1]; startState(max, 'throw', 14); max.throwT = .4;
   lulu.target = kids[4]; startState(lulu, 'throw', 12); lulu.throwT = 1.2;
   setToast(L.ev.paper, L.ev.paperT, null, 5); beep('alert');
   g.ev = null;
  } else if (e.kind === 'quiz') {
   g.ev = { kind: 'quiz', t: 0, dur: 16 };
   kids.forEach(k => startState(k, 'focus'));
   setToast(L.ev.quiz, L.ev.quizT, 16, 16); beep('alert');
  } else if (e.kind === 'principal') {
   g.ev = { kind: 'principal', t: 0, stage: 'warn' };
   setToast(L.ev.pWarn, L.ev.pWarnT, 14, 15); beep('alert');
  }
 }
 function updateEvent(dt) {
  const g = G2, e = g.ev; if (!e) return;
  e.t += dt;
  if (e.kind === 'quiz') {
   toast.querySelector('.cd').textContent = Math.ceil(e.dur - e.t);
   if (e.t > e.dur) { kids.forEach(k => { if (k.state === 'cheat') startState(k, 'focus'); }); setToast(L.ev.quizEnd, '', null, 2); g.ev = null; }
  } else if (e.kind === 'principal') {
   if (e.stage === 'warn') {
    toast.querySelector('.cd').textContent = Math.max(0, Math.ceil(14 - e.t));
    if (e.t > 14) { e.stage = 'in'; e.t = 0; principal.root.visible = true; principal.root.position.set(DOOR.x + .3, 0, DOOR.z); principal.phase = 'enter'; kids.forEach(k => { if (!isBad(k)) { startState(k, 'surprised', 1.6); } }); setToast(L.ev.pIn, '', null, 9); e.sum = 0; e.n = 0; }
   } else if (e.stage === 'in') {
    e.sum += g.chaos * dt; e.n += dt;
    if (e.t > 9) {
     const avg = e.sum / Math.max(1, e.n);
     if (avg < 42) { addScore(200, principal.root.position, fmt(L.ev.pGood, { n: 200 })); setToast(fmt(L.ev.pGood, { n: 200 }), '', null, 3); beep('bell'); g.principalOk = true; }
     else { addScore(-100, principal.root.position, fmt(L.ev.pBad, { n: 100 })); setToast(fmt(L.ev.pBad, { n: 100 }), '', null, 3); beep('bad'); g.principalOk = false; }
     e.stage = 'leave'; principal.phase = 'leave'; e.t = 0;
    }
   } else if (e.stage === 'leave' && principal.phase === 'off') g.ev = null;
  }
 }
 function updatePrincipal(dt) {
  const p = principal; if (!p.root.visible) return;
  const pos = p.root.position;
  let tx, tz;
  if (p.phase === 'enter') { tx = 3.4; tz = -1.2; }
  else if (p.phase === 'leave') { tx = DOOR.x + .35; tz = DOOR.z; }
  else { tx = pos.x; tz = pos.z; }
  const dx = tx - pos.x, dz = tz - pos.z, d = Math.hypot(dx, dz);
  const doorOpen = (p.phase === 'enter' && pos.x > 4.0) || (p.phase === 'leave' && d < 1.2);
  ROOM.door.rotation.y = lerp(ROOM.door.rotation.y, doorOpen ? 1.4 : 0, .1);
  if (d > .05) {
   pos.x += dx / d * Math.min(d, 1.3 * dt); pos.z += dz / d * Math.min(d, 1.3 * dt);
   p.root.rotation.y = Math.atan2(dx, dz); p.walk += dt * 8; walkPose(p, p.walk, 1);
  } else {
   if (p.phase === 'enter') p.phase = 'watch';
   else if (p.phase === 'leave') { p.root.visible = false; p.phase = 'off'; ROOM.door.rotation.y = 0; }
   if (p.phase === 'watch') { p.root.rotation.y = lerp(p.root.rotation.y, -2.3, .05); walkPose(p, 0, 0); p.arms[0].sh.rotation.z = -.5; p.arms[1].sh.rotation.z = .5; p.arms[0].el.rotation.x = -1.6; p.arms[1].el.rotation.x = -1.6; p.head.rotation.y = Math.sin(G2.time * 1.3) * .5; setFace(p.face, G2.chaos < 42 ? 'focus' : 'worried'); }
  }
 }
 function walkPose(c, ph, amt) {
  const s = Math.sin(ph) * .6 * amt;
  c.legs[0].hp.rotation.x = s; c.legs[1].hp.rotation.x = -s;
  c.legs[0].kn.rotation.x = Math.max(0, -s) * .6; c.legs[1].kn.rotation.x = Math.max(0, s) * .6;
  c.arms[0].sh.rotation.x = -s * .7; c.arms[1].sh.rotation.x = s * .7;
  c.arms[0].sh.rotation.z = -.1; c.arms[1].sh.rotation.z = .1;
  c.arms[0].el.rotation.x = -.2; c.arms[1].el.rotation.x = -.2;
  c.body.position.y = c.hipY + Math.abs(Math.sin(ph)) * .03 * amt;
 }

 /* ---------- input ---------- */
 const keys = {};
 const onKey = (e, down) => {
  if (mode !== 'play') return;
  const k = e.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) { keys[k] = down; e.preventDefault(); if (down) teacher.target = null; }
  if (!down) return;
  if (k === 'p' || k === 'escape') { e.preventDefault(); pause(true); }
  if (k === 'e' || k === ' ') { e.preventDefault(); let bi = -1, bd = 2.2; kids.forEach((kk, i) => { const d = nearTeacher(kk); if (d < bd) { bd = d; bi = i; } }); select(bi); }
  if (G2 && G2.sel >= 0 && ['1', '2', '3'].includes(k)) { const a = actions(kids[G2.sel])[+k - 1]; if (a) doAction(a[0]); }
 };
 global.addEventListener('keydown', e => { if (host.isConnected && (document.activeElement === renderer.domElement || host.contains(document.activeElement) || document.activeElement === document.body)) onKey(e, true); });
 global.addEventListener('keyup', e => onKey(e, false));
 const ray = new T3.Raycaster(), ndc = new T3.Vector2();
 const pickables = () => kids.map(k => k.hit).concat([ROOM.board, ROOM.floor]);
 renderer.domElement.addEventListener('pointerdown', e => {
  if (mode !== 'play') return;
  renderer.domElement.focus();
  if (!AC && !muted) beep('chalk');
  const r = renderer.domElement.getBoundingClientRect();
  ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pickables(), false)[0];
  if (!hit) return;
  const o = hit.object;
  if (o.userData.kid != null) {
   const k = kids[o.userData.kid];
   select(k.i);
   if (nearTeacher(k) > 1.6) teacher.target = { x: k.x + (k.x > 3 ? -.75 : .75), z: ROWS[k.k.row] + .6, kid: k.i };
  } else if (o.userData.board) { teacher.target = { x: BOARD.spotX, z: BOARD.spotZ }; select(-1); }
  else { teacher.target = { x: hit.point.x, z: hit.point.z }; select(-1); }
 });
 // joystick
 const joyV = new T3.Vector2();
 if (joy) {
  let jid = null; const knob = joy.querySelector('i');
  const jmove = e => { const r = joy.getBoundingClientRect(); const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); const d = Math.min(1, Math.hypot(x, y) / 50); const a = Math.atan2(y, x); joyV.set(Math.cos(a) * d, Math.sin(a) * d); knob.style.transform = `translate(${Math.cos(a) * d * 40}px,${Math.sin(a) * d * 40}px)`; };
  joy.addEventListener('pointerdown', e => { jid = e.pointerId; joy.setPointerCapture(jid); jmove(e); teacher.target = null; e.preventDefault(); });
  joy.addEventListener('pointermove', e => { if (e.pointerId === jid) jmove(e); });
  const jend = e => { if (e.pointerId === jid) { jid = null; joyV.set(0, 0); knob.style.transform = ''; } };
  joy.addEventListener('pointerup', jend); joy.addEventListener('pointercancel', jend);
 }

 /* ---------- teacher movement ---------- */
 const camFwd = new T3.Vector3(), camRight = new T3.Vector3();
 function collide(p) {
  p.x = clamp(p.x, -4.75, 4.75); p.z = clamp(p.z, -3.6, 3.7);
  for (const o of OBST) {
   const r = .22;
   if (p.x > o.x0 - r && p.x < o.x1 + r && p.z > o.z0 - r && p.z < o.z1 + r) {
    const dl = p.x - (o.x0 - r), dr = (o.x1 + r) - p.x, du = p.z - (o.z0 - r), dd = (o.z1 + r) - p.z, m = Math.min(dl, dr, du, dd);
    if (m === dl) p.x = o.x0 - r; else if (m === dr) p.x = o.x1 + r; else if (m === du) p.z = o.z0 - r; else p.z = o.z1 + r;
   }
  }
 }
 function updateTeacher(dt) {
  const t = teacher, p = t.root.position;
  camera.getWorldDirection(camFwd); camFwd.y = 0; camFwd.normalize(); camRight.set(-camFwd.z, 0, camFwd.x);
  let mx = 0, mz = 0;
  const kx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0), ky = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0);
  let ix = kx + joyV.x, iy = ky - joyV.y;
  if (ix || iy) { mx = camRight.x * ix + camFwd.x * iy; mz = camRight.z * ix + camFwd.z * iy; const l = Math.hypot(mx, mz); if (l > 1) { mx /= l; mz /= l; } }
  else if (t.target) {
   const dx = t.target.x - p.x, dz = t.target.z - p.z, d = Math.hypot(dx, dz);
   if (d < .08) { if (t.target.kid != null) select(t.target.kid); t.target = null; }
   else { mx = dx / d; mz = dz / d; if (d < .4) { mx *= d / .4; mz *= d / .4; } }
  }
  const sp = 2.6, moving = Math.hypot(mx, mz) > .05;
  const ox = p.x, oz = p.z;
  p.x += mx * sp * dt; p.z += mz * sp * dt;
  collide(p);
  if (t.target && moving && Math.hypot(p.x - ox, p.z - oz) < sp * dt * .2) { t.stuck = (t.stuck || 0) + dt; if (t.stuck > .4) { t.target = null; t.stuck = 0; } } else t.stuck = 0;
  const atBoard = teacherAtBoard();
  if (moving) { t.dir = Math.atan2(mx, mz); t.walk += dt * 9; walkPose(t, t.walk, Math.min(1, Math.hypot(mx, mz))); setFace(t.face, 'walk'); }
  else if (atBoard) { t.dir = lerpAngle(t.dir, Math.PI / 2, .15); }
  t.root.rotation.y = lerpAngle(t.root.rotation.y, t.dir, .2);
  if (!moving) {
   walkPose(t, 0, 0);
   if (atBoard) { t.teachT += dt; const a = t.arms[1]; a.sh.rotation.x = -2.2 + Math.sin(t.teachT * 7) * .15; a.sh.rotation.z = .2 + Math.cos(t.teachT * 7) * .1; a.el.rotation.x = -.3; t.arms[0].sh.rotation.x = -.6; t.arms[0].el.rotation.x = -.9; }
   else { t.arms[0].sh.rotation.x = -.5; t.arms[0].el.rotation.x = -1.0; t.teachT = 0; }
  }
  return atBoard && !moving;
 }
 function lerpAngle(a, b, t) { let d = ((b - a + Math.PI) % TAU + TAU) % TAU - Math.PI; return a + d * t; }

 /* ---------- main loop ---------- */
 let last = performance.now(), visible = true, chalkT = 0;
 if ('IntersectionObserver' in global) new IntersectionObserver(es => es.forEach(e => visible = e.isIntersecting)).observe(host);
 const proj = new T3.Vector3();
 function toScreen(v, out) { proj.copy(v).project(camera); out.x = (proj.x * .5 + .5) * host.clientWidth; out.y = (-proj.y * .5 + .5) * host.clientHeight; out.z = proj.z; return out; }
 const sp2 = { x: 0, y: 0, z: 0 };
 function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!visible) return;
  const g = G2;
  if (g && mode === 'play' && !paused) step(dt);
  else if (mode === 'menu') idleMenu(dt);
  // camera
  const tp = teacher.root.position;
  camLook.set(camCenter.x + (tp.x - camCenter.x) * .06, camCenter.y, camCenter.z + (tp.z - camCenter.z) * .06);
  camLookCur.lerp(camLook, Math.min(1, dt * 3));
  camera.position.copy(camLookCur).addScaledVector(camOff, camK);
  camera.lookAt(camLookCur);
  // clock hands
  const d = new Date();
  ROOM.clock[0].rotation.z = -(d.getMinutes() / 60) * TAU; ROOM.clock[1].rotation.z = -((d.getHours() % 12) / 12) * TAU;
  renderer.render(scene, camera);
  placeLabels(dt);
 }
 let menuT = 0;
 function idleMenu(dt) {
  menuT += dt;
  // a living classroom behind the menu: kids idle, teacher at the board
  kids.forEach(k => { k.phase += dt; animateKid(k, dt); });
  const a = teacher.arms[1]; teacher.teachT += dt;
  a.sh.rotation.x = -2.2 + Math.sin(teacher.teachT * 7) * .15; a.sh.rotation.z = .2 + Math.cos(teacher.teachT * 7) * .1; a.el.rotation.x = -.3;
  teacher.arms[0].sh.rotation.x = -.6; teacher.arms[0].el.rotation.x = -.9;
 }
 function step(dt) {
  const g = G2;
  g.time -= dt;
  // events by time left
  for (const e of g.events) if (!e.done && !g.ev && g.time <= e.at) startEvent(e);
  updateEvent(dt);
  kids.forEach(k => updateKid(k, dt));
  updatePrincipal(dt);
  const teaching = updateTeacher(dt);
  const pulse = 1 + Math.sin(performance.now() / 260) * .08;
  ringBoard.scale.setScalar(teaching ? 1 : pulse); ringBoard.material.color.set(teaching ? '#3e9e5c' : '#ffc93c'); ringBoard.material.opacity = g.progress >= 100 ? .25 : .85;
  if (g.sel >= 0) { const k = kids[g.sel]; ringSel.visible = true; ringSel.position.set(k.x, .02, k.z + .15); ringSel.scale.setScalar(pulse); } else ringSel.visible = false;
  // paper balls
  for (let i = g.balls.length - 1; i >= 0; i--) {
   const b = g.balls[i]; b.t += dt / .7;
   const tt = Math.min(1, b.t);
   b.m.position.lerpVectors(b.s, b.e, tt); b.m.position.y += Math.sin(tt * Math.PI) * .9; b.m.rotation.x += dt * 9;
   if (b.t >= 1) {
    scene.remove(b.m); g.balls.splice(i, 1);
    const k = b.to; if (k.state === 'focus' || k.state === 'hand') startState(k, 'upset', 1.8);
    g.chaos = Math.min(100, g.chaos + 4);
    // a paper ball on the floor for a while
    const f = mesh(G.sphLo, M('#f4f1e8', .8), b.e.x + (Math.random() - .5) * .8, .06, b.e.z + .5 + Math.random() * .4, .06, .06, .06);
    setTimeout(() => scene.remove(f), 12000);
   }
  }
  // noise -> chaos
  let noise = 0; kids.forEach(k => noise += NOISE[k.state] || 0);
  const target = clamp(noise * 2.3, 0, 100);
  g.chaos += (target > g.chaos ? (target - g.chaos) * .35 : (target - g.chaos) * .22) * dt;
  g.chaos = clamp(g.chaos, 0, 100);
  g.chaosMax = Math.max(g.chaosMax, g.chaos); g.chaosSum += g.chaos * dt;
  // teaching
  if (teaching) {
   const rate = (100 / 95) * (g.chaos > 72 ? .25 : 1 - g.chaos / 160);
   g.progress = Math.min(100, g.progress + rate * dt);
   chalkT -= dt; if (chalkT < 0) { beep('chalk'); chalkT = .18 + Math.random() * .2; }
   if (g.chaos > 72) { g.teachMsgT -= dt; if (g.teachMsgT < 0) { showHint(L.noisy); g.teachMsgT = 3; } }
   else showHint(L.teaching, .3);
  } else if (g.progress < 100 && g.time < 200 && !teacher.target && Math.floor(g.time) % 25 === 0) showHint(L.teachHint, 1.5);
  const tk = g.tasks[0]; if (Math.floor(g.progress) !== tk.cur) { tk.cur = Math.floor(g.progress); if (tk.cur >= 100) bump('teach', 0); else if (tk.cur % 5 === 0) renderTasks(); }
  drawBoard(g.progress, g.subj, L.subj[g.subj]);
  // HUD
  const m = Math.max(0, Math.ceil(g.time)), mm = Math.floor(m / 60), ss = m % 60;
  lessonCard.querySelector('.tm').textContent = `${mm}:${String(ss).padStart(2, '0')}`;
  lessonCard.querySelector('.arc').setAttribute('stroke-dashoffset', (119.4 * (1 - g.time / g.total)).toFixed(1));
  lessonCard.querySelector('.tt-prog div').style.width = g.progress.toFixed(1) + '%';
  moodCard.querySelector('.tt-bar span').style.left = g.chaos.toFixed(1) + '%';
  const mi = g.chaos < 22 ? 0 : g.chaos < 45 ? 1 : g.chaos < 72 ? 2 : 3;
  const mb = moodCard.querySelector('b'); mb.textContent = L.moods[mi]; mb.style.color = ['#1f5e55', '#1f5e55', '#c27a00', '#c7392b'][mi];
  if (g.sel >= 0 && !(teacher.target && teacher.target.kid === g.sel) && nearTeacher(kids[g.sel]) > 2.8) select(-1);
  if (g.sel >= 0) { const k = kids[g.sel]; tag.querySelector('small').textContent = `${L.type[k.k.type]} · ${L.st[k.state] || L.st.focus}`; const rec = recommended(k); acts.querySelectorAll('.tt-act').forEach(b => b.classList.toggle('hint', b.dataset.k === rec)); }
  toastT -= dt; if (toastT < 0 && !toast.hidden && !(g.ev && (g.ev.kind === 'quiz' || g.ev.stage === 'warn'))) toast.hidden = true;
  hintT -= dt; if (hintT < 0) hint.style.opacity = 0;
  if (g.time <= 0) endLesson();
 }
 let hintT = 0;
 function showHint(t, d) { hint.textContent = t; hint.style.opacity = 1; hintT = d || 2; }
 function placeLabels(dt) {
  const W = host.clientWidth;
  kids.forEach(k => {
   if (!k.bub) return;
   if (k.bubT > 0) { k.bubT -= dt; if (k.bubT <= 0) { const keep = { sleep: 1, talk: 1, joke: 1, hand: 1, throw: 1, phone: 1, laugh: 1, cheat: 1 }[k.state]; if (!keep) setBubble(k, null); else startState(k, k.state, k.dur - k.t > 0 ? k.dur - k.t : 1); } }
   if (!k.bub) return;
   const v = k.head.getWorldPosition(tmpV); v.y += .42;
   toScreen(v, sp2); k.bub.style.left = sp2.x + 'px'; k.bub.style.top = sp2.y + 'px';
  });
  if (G2 && G2.sel >= 0) {
   const k = kids[G2.sel], v = tmpV.set(k.x, 2.05, k.z);
   toScreen(v, sp2);
   const off = k.bub ? 34 : 0;
   tag.style.left = sp2.x + 'px'; tag.style.top = (sp2.y - off) + 'px';
   let ay = sp2.y - off - 118;
   if (ay < 120) { toScreen(tmpV.set(k.x, 0, k.z + 1.0), sp2); ay = Math.min(sp2.y + 6, host.clientHeight - 90); }
   acts.style.left = clamp(sp2.x, 110, W - 110) + 'px'; acts.style.top = ay + 'px';
  }
  if (G2) for (let i = G2.pops.length - 1; i >= 0; i--) {
   const p = G2.pops[i]; p.t += dt; p.p.y += dt * .5;
   toScreen(p.p, sp2); p.e.style.left = sp2.x + 'px'; p.e.style.top = sp2.y + 'px'; p.e.style.opacity = Math.max(0, 1.6 - p.t);
   if (p.t > 1.6) { p.e.remove(); G2.pops.splice(i, 1); }
  }
 }

 /* ---------- screens ---------- */
 function menu() {
  ringSel.visible = false;
  mode = 'menu'; paused = true; hud.style.visibility = 'hidden'; select(-1);
  kids.forEach((k, i) => startState(k, ['hand', 'laugh', 'sleep', 'talk', 'innocent', 'phone'][i], 999));
  kids[3].target = kids[0];
  setBubble(kids[2], L.b.zzz, 'zz');
  teacher.root.position.set(BOARD.spotX, 0, BOARD.spotZ); teacher.dir = Math.PI / 2; teacher.root.rotation.y = Math.PI / 2;
  boardDrawn = -1; drawBoard(40, 'math', L.subj.math);
  ov.hidden = false;
  ov.style.background = 'linear-gradient(90deg,rgba(14,22,40,.82),rgba(14,22,40,.35))';
  const n = lessonNo();
  ov.innerHTML = `<div class="tt-panel tt-start"><div class="tt-logo">TEACHER<span>TYCOON</span></div><div class="tt-sub">${esc(L.tag)}</div>
<div class="tt-box"><div class="tt-meta"><span>${esc(L.rank)}: ${esc(L.ranks[rankIdx()])}</span><span>${esc(fmt(L.best, { n: best().toLocaleString('en-US') }))}</span></div>
<button type="button" class="tt-btn tt-main" data-a="play">▶ ${esc(L.play)} · ${esc(fmt(L.lesson, { n }))}</button>
<p>${esc(L.how)}</p><p style="font-size:12.5px;color:#5b6178">${esc(touch ? L.keysT : L.keys)}</p>
<button type="button" class="tt-btn tt-sec" data-a="snd">${esc(muted ? L.soundOff : L.soundOn)}</button><button type="button" class="tt-btn tt-sec" data-a="q">${esc(quality ? L.qHigh : L.qLow)}</button></div></div>`;
 }
 function start() {
  newLesson();
  kids.forEach(k => { setBubble(k, null); startState(k, 'focus'); });
  ov.hidden = true; ov.innerHTML = ''; ov.style.background = '';
  hud.style.visibility = 'visible';
  mode = 'play'; paused = false; last = performance.now();
  addScore(0);
  beep('bell');
  setToast(fmt(L.lesson, { n: G2.n }) + ' · ' + L.subj[G2.subj], L.teachHint, null, 4);
  renderer.domElement.focus();
 }
 function pause(on) {
  if (mode !== 'play') return;
  paused = on;
  if (on) {
   ov.hidden = false;
   ov.innerHTML = `<div class="tt-card tt-panel"><div class="tt-big">${esc(L.paused)}</div><button type="button" class="tt-btn tt-main" data-a="resume">${esc(L.resume)}</button><button type="button" class="tt-btn tt-sec" data-a="snd">${esc(muted ? L.soundOff : L.soundOn)}</button><button type="button" class="tt-btn tt-sec" data-a="q">${esc(quality ? L.qHigh : L.qLow)}</button><button type="button" class="tt-btn tt-sec" data-a="quit">${esc(L.quit)}</button></div>`;
  } else { ov.hidden = true; ov.innerHTML = ''; last = performance.now(); renderer.domElement.focus(); }
 }
 pauseBtn.addEventListener('click', () => pause(true));
 function endLesson() {
  const g = G2; mode = 'result'; paused = true; select(-1); beep('bell');
  kids.forEach(k => setBubble(k, null));
  g.balls.forEach(b => scene.remove(b.m)); g.balls.length = 0;
  g.pops.forEach(p => p.e.remove()); g.pops.length = 0;
  const done = g.tasks.filter(t => t.cur >= t.goal).length;
  const avg = g.chaosSum / Math.max(1, g.total - Math.max(0, g.time));
  const bonus = Math.round(g.progress * 4) + done * 100 + Math.round(Math.max(0, 60 - avg) * 4);
  g.score += bonus;
  const stars = done;
  const title = avg > 55 ? 'disaster' : done === 3 && avg < 25 ? 'best' : done === 3 ? 'perfect' : g.stopped >= 6 && avg < 40 ? 'strict' : g.laughs >= 3 ? 'fun' : 'survivor';
  const oldBest = best(), isBest = g.score > oldBest;
  if (isBest) store.set('best', g.score);
  if (stars >= 2) store.set('lesson', g.n + 1);
  store.set('chalk', store.get('chalk', 0) + Math.round(g.score / 10));
  hud.style.visibility = 'hidden';
  ov.hidden = false;
  const st = [Math.round(g.progress) + '%', g.answered, g.stopped, Math.round(g.chaosMax) + '%'];
  ov.innerHTML = `<div class="tt-card tt-panel tt-res"><h3>${esc(L.res.title)} · ${esc(fmt(L.lesson, { n: g.n }))}</h3><div class="ttl">${esc(L.res.t[title])}</div>
<div class="tt-stars" aria-label="${stars}/3">${[0, 1, 2].map(i => `<span class="${i < stars ? '' : 'off'}">★</span>`).join('')}</div>
<div class="tt-meta" style="justify-content:center;margin-top:6px">${esc(L.res.score)}</div><div class="tt-big">${g.score.toLocaleString('en-US')}</div>${isBest ? `<span class="tt-new">${esc(L.res.newBest)}</span>` : ''}
<div class="tt-stats">${L.res.stats.map((s, i) => `<div><b>${st[i]}</b>${esc(s)}</div>`).join('')}<div><b>+${Math.round(g.score / 10)}</b>${esc(L.res.chalk)}</div><div><b>${esc(L.ranks[rankIdx()])}</b>${esc(L.rank)}</div></div>
<button type="button" class="tt-btn tt-main" data-a="play">${esc(stars >= 2 ? L.res.next : L.res.again)}</button></div>`;
 }
 ov.addEventListener('click', e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a;
  if (a === 'play') start();
  else if (a === 'resume') pause(false);
  else if (a === 'quit') { paused = false; G2.time = 0; endLesson(); }
  else if (a === 'snd') { muted = !muted; store.set('mute', muted); b.textContent = muted ? L.soundOff : L.soundOn; if (!muted) beep('ok'); }
  else if (a === 'q') { quality = quality ? 0 : 1; store.set('q', quality); setPR(); setShadowSize(); resize(); b.textContent = quality ? L.qHigh : L.qLow; }
 });
 document.addEventListener('visibilitychange', () => { if (document.hidden && mode === 'play' && !paused) pause(true); });

 menu();
 requestAnimationFrame(frame);
 return { start, pause, sim(sec) { for (let i = 0; i < sec * 30; i++) if (mode === 'play' && !paused) step(1 / 30); }, state: () => G2, kids, teacher, camera };
}

global.TeacherTycoon = { mount };
})(window);
