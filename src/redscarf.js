/* =====================================================================================
   RED SCARF: SILENT STEPS
   A stealth game in a dark, seeded labyrinth. Ink-painted (sumi-e) look, red accents.
   ─ Sneak up from behind or the side → silent takedown cinematic (tanto, wire, iai, kunai drop)
   ─ Meet a guard face to face → duel: read his stance, pick the right weapon before time runs out
   ─ Guards: patrol → pause → look around; hear noise; find bodies; raise the alarm and call others
   ─ Eight traps, persistent upgrades bought with mon, best gate saved, seed for every run
   Usage: RedScarf.mount(element, { lang: 'tr' })   — everything (CSS, DOM, canvas) is created inside.
   ===================================================================================== */
(function (global) {
  'use strict';
  const TAU = Math.PI * 2, TS = 64;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hashStr(s) { let h = 2166136261; for (const ch of String(s)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }

  /* ───────────────────────────── TEXTS (5 languages) ───────────────────────────── */
  const I18N = {
    tr: { title: 'RED SCARF', sub: 'Sessiz Adımlar', play: 'OYNA', upgrades: 'YÜKSELTMELER', seed: 'Seed', seedPh: 'rastgele', back: 'Geri', resume: 'DEVAM', restart: '1. kapıdan başla', menu: 'Menü', paused: 'DURAKLATILDI', door: 'Kapı', best: 'En iyi kapı', mon: 'Mon', lives: 'Can', smoke: 'Sis', dash: 'Atıl', sneaking: 'Sessiz', running: 'KOŞUYORSUN – gürültü', locked: 'Kapı kilitli – anahtar kaptanda', gotKey: 'Kaptanın anahtarı sende!', alarm: 'ALARM! Muhafızlar geliyor', alarmOff: 'Alarm söndü', levelStart: '{n}. kapı', clear: '{n}. kapı geçildi', clearInfo: 'Etkisiz: {k} · Kazanılan: {m} mon', next: 'SONRAKİ KAPI', dead: 'KURENAİ DÜŞTÜ', reached: 'Ulaştığın kapı: {n} · Bu koşuda {m} mon', reset: 'Labirent seni unuttu – 1. kapıya dönüyorsun.', revive: 'Ekstra can – ayağa kalkıyorsun!', newBest: 'YENİ REKOR!', sound: 'Ses', duel: 'DÜELLO', duelHint: 'Duruşu oku, silahını seç!', captainDuel: 'Kaptan: iki duruşu da kır!', tooSlow: 'Geç kaldın',
      causes: { spikes: 'Yükselen dikenler.', darts: 'Basınç plakasının okları.', pendulum: 'Sallanan bıçak.', fire: 'Ateş püskürtücü.', saw: 'Raylı testere.', pit: 'Çöken zemin.', gas: 'Zehirli gaz.', duel: 'Düelloyu kaybettin.' },
      stances: { jodan: ['YÜKSEK DURUŞ', 'kılıç başın üstünde'], chudan: ['ORTA DURUŞ', 'kılıç ileri uzanmış'], iai: ['IAI DURUŞU', 'el kabzada, çekmeye hazır'] },
      weapons: { katana: 'KATANA RISE', kusari: 'KUSARIGAMA', shuriken: 'SHURIKEN', smoke: 'SİS BOMBASI' },
      rule: 'Yüksek → Katana · Orta → Kusarigama · Iai → Shuriken',
      kills: { tanto: 'TANTO', wire: 'TEL', iai: 'IAI', drop: 'KUNAI DÜŞÜŞÜ' },
      upTitle: 'YÜKSELTMELER', buy: 'AL', maxed: 'MAKS', monHave: 'Monun: {m}',
      up: { silence: ['Sessizlik', 'Koşarken çıkan ses daha az duyulur.'], shadow: ['Gölge', 'Muhafızlar seni daha yavaş fark eder.'], life: ['Ekstra can', 'Her koşuda ölümden bir kez döner.'], bombs: ['Sis bombası', 'Her koşuda bir sis bombası daha.'], focus: ['Odak', 'Düelloda karar süren uzar.'] },
      keys: 'WASD yürü · Shift koş · Boşluk atıl · Q sis · Esc duraklat',
      duelKeys: '1 Katana · 2 Kusarigama · 3 Shuriken · 4 Sis',
      story: 'Demir Şogun, Kage klanının son parşömenini her gece yeniden dizilen Bin Kapılı Labirent\'e kilitledi. Kurenai, ustasının kırmızı atkısını bağlayıp tek başına içeri giriyor. Arkadan yaklaş, gölgede kal; yüz yüze gelirsen duruşu oku.' },
    en: { title: 'RED SCARF', sub: 'Silent Steps', play: 'PLAY', upgrades: 'UPGRADES', seed: 'Seed', seedPh: 'random', back: 'Back', resume: 'RESUME', restart: 'Restart from gate 1', menu: 'Menu', paused: 'PAUSED', door: 'Gate', best: 'Best gate', mon: 'Mon', lives: 'Lives', smoke: 'Smoke', dash: 'Dash', sneaking: 'Sneaking', running: 'RUNNING – noisy', locked: 'The gate is locked – the captain has the key', gotKey: 'You have the captain\'s key!', alarm: 'ALARM! Guards are coming', alarmOff: 'The alarm fades', levelStart: 'Gate {n}', clear: 'Gate {n} cleared', clearInfo: 'Takedowns: {k} · Earned: {m} mon', next: 'NEXT GATE', dead: 'KURENAI HAS FALLEN', reached: 'Gate reached: {n} · {m} mon this run', reset: 'The labyrinth forgets you – back to gate 1.', revive: 'Extra life – you rise again!', newBest: 'NEW RECORD!', sound: 'Sound', duel: 'DUEL', duelHint: 'Read the stance, pick your weapon!', captainDuel: 'Captain: break both stances!', tooSlow: 'Too slow',
      causes: { spikes: 'Rising spikes.', darts: 'Darts from a pressure plate.', pendulum: 'The swinging blade.', fire: 'A fire jet.', saw: 'The rail saw.', pit: 'A collapsing floor.', gas: 'Poison gas.', duel: 'You lost the duel.' },
      stances: { jodan: ['HIGH STANCE', 'blade above his head'], chudan: ['MIDDLE STANCE', 'blade pointed forward'], iai: ['IAI STANCE', 'hand on the hilt, ready to draw'] },
      weapons: { katana: 'KATANA RISE', kusari: 'KUSARIGAMA', shuriken: 'SHURIKEN', smoke: 'SMOKE BOMB' },
      rule: 'High → Katana · Middle → Kusarigama · Iai → Shuriken',
      kills: { tanto: 'TANTO', wire: 'WIRE', iai: 'IAI', drop: 'KUNAI DROP' },
      upTitle: 'UPGRADES', buy: 'BUY', maxed: 'MAX', monHave: 'Your mon: {m}',
      up: { silence: ['Silence', 'Running makes less noise.'], shadow: ['Shadow', 'Guards notice you more slowly.'], life: ['Extra life', 'Come back from death once per run.'], bombs: ['Smoke bomb', 'One more smoke bomb per run.'], focus: ['Focus', 'More time to decide in duels.'] },
      keys: 'WASD move · Shift run · Space dash · Q smoke · Esc pause',
      duelKeys: '1 Katana · 2 Kusarigama · 3 Shuriken · 4 Smoke',
      story: 'The Iron Shogun locked the last scroll of the Kage clan inside the Labyrinth of a Thousand Gates, whose halls rearrange every night. Kurenai ties on her master\'s red scarf and goes in alone. Come from behind, stay in the shadows – and if you meet a guard face to face, read his stance.' },
    id: { title: 'RED SCARF', sub: 'Langkah Sunyi', play: 'MAIN', upgrades: 'PENINGKATAN', seed: 'Seed', seedPh: 'acak', back: 'Kembali', resume: 'LANJUT', restart: 'Mulai dari gerbang 1', menu: 'Menu', paused: 'JEDA', door: 'Gerbang', best: 'Gerbang terbaik', mon: 'Mon', lives: 'Nyawa', smoke: 'Asap', dash: 'Dash', sneaking: 'Mengendap', running: 'BERLARI – berisik', locked: 'Gerbang terkunci – kunci ada pada kapten', gotKey: 'Kunci kapten ada padamu!', alarm: 'ALARM! Penjaga datang', alarmOff: 'Alarm mereda', levelStart: 'Gerbang {n}', clear: 'Gerbang {n} terlewati', clearInfo: 'Lumpuhan: {k} · Didapat: {m} mon', next: 'GERBANG BERIKUTNYA', dead: 'KURENAI GUGUR', reached: 'Gerbang dicapai: {n} · {m} mon di putaran ini', reset: 'Labirin melupakanmu – kembali ke gerbang 1.', revive: 'Nyawa tambahan – kamu bangkit!', newBest: 'REKOR BARU!', sound: 'Suara', duel: 'DUEL', duelHint: 'Baca kuda-kudanya, pilih senjatamu!', captainDuel: 'Kapten: patahkan dua kuda-kuda!', tooSlow: 'Terlambat',
      causes: { spikes: 'Duri yang naik.', darts: 'Panah dari pelat tekanan.', pendulum: 'Bilah berayun.', fire: 'Semburan api.', saw: 'Gergaji rel.', pit: 'Lantai runtuh.', gas: 'Gas beracun.', duel: 'Kamu kalah duel.' },
      stances: { jodan: ['KUDA-KUDA TINGGI', 'pedang di atas kepala'], chudan: ['KUDA-KUDA TENGAH', 'pedang mengarah ke depan'], iai: ['KUDA-KUDA IAI', 'tangan di gagang, siap mencabut'] },
      weapons: { katana: 'KATANA RISE', kusari: 'KUSARIGAMA', shuriken: 'SHURIKEN', smoke: 'BOM ASAP' },
      rule: 'Tinggi → Katana · Tengah → Kusarigama · Iai → Shuriken',
      kills: { tanto: 'TANTO', wire: 'KAWAT', iai: 'IAI', drop: 'TERJANG KUNAI' },
      upTitle: 'PENINGKATAN', buy: 'BELI', maxed: 'MAKS', monHave: 'Mon-mu: {m}',
      up: { silence: ['Sunyi', 'Berlari lebih tidak berisik.'], shadow: ['Bayangan', 'Penjaga lebih lambat menyadarimu.'], life: ['Nyawa tambahan', 'Bangkit dari kematian sekali per putaran.'], bombs: ['Bom asap', 'Satu bom asap lagi per putaran.'], focus: ['Fokus', 'Waktu memilih lebih lama saat duel.'] },
      keys: 'WASD gerak · Shift lari · Spasi dash · Q asap · Esc jeda',
      duelKeys: '1 Katana · 2 Kusarigama · 3 Shuriken · 4 Asap',
      story: 'Shogun Besi mengunci gulungan terakhir klan Kage di Labirin Seribu Gerbang yang lorongnya berubah setiap malam. Kurenai mengikat syal merah gurunya dan masuk sendirian. Datang dari belakang, tetap di bayangan – dan jika bertatap muka, baca kuda-kudanya.' },
    es: { title: 'RED SCARF', sub: 'Pasos Silenciosos', play: 'JUGAR', upgrades: 'MEJORAS', seed: 'Semilla', seedPh: 'aleatoria', back: 'Volver', resume: 'CONTINUAR', restart: 'Empezar en la puerta 1', menu: 'Menú', paused: 'PAUSA', door: 'Puerta', best: 'Mejor puerta', mon: 'Mon', lives: 'Vidas', smoke: 'Humo', dash: 'Impulso', sneaking: 'Sigilo', running: 'CORRIENDO – ruido', locked: 'La puerta está cerrada: el capitán tiene la llave', gotKey: '¡Tienes la llave del capitán!', alarm: '¡ALARMA! Vienen los guardias', alarmOff: 'La alarma se apaga', levelStart: 'Puerta {n}', clear: 'Puerta {n} superada', clearInfo: 'Eliminaciones: {k} · Ganado: {m} mon', next: 'SIGUIENTE PUERTA', dead: 'KURENAI HA CAÍDO', reached: 'Puerta alcanzada: {n} · {m} mon en esta partida', reset: 'El laberinto te olvida: vuelves a la puerta 1.', revive: 'Vida extra: ¡te levantas!', newBest: '¡NUEVO RÉCORD!', sound: 'Sonido', duel: 'DUELO', duelHint: '¡Lee la guardia y elige tu arma!', captainDuel: 'Capitán: ¡rompe las dos guardias!', tooSlow: 'Demasiado lento',
      causes: { spikes: 'Pinchos que suben.', darts: 'Dardos de una placa de presión.', pendulum: 'La cuchilla oscilante.', fire: 'Un chorro de fuego.', saw: 'La sierra del raíl.', pit: 'Un suelo que se hunde.', gas: 'Gas venenoso.', duel: 'Perdiste el duelo.' },
      stances: { jodan: ['GUARDIA ALTA', 'espada sobre la cabeza'], chudan: ['GUARDIA MEDIA', 'espada apuntando al frente'], iai: ['GUARDIA IAI', 'mano en la empuñadura, listo para desenvainar'] },
      weapons: { katana: 'KATANA RISE', kusari: 'KUSARIGAMA', shuriken: 'SHURIKEN', smoke: 'BOMBA DE HUMO' },
      rule: 'Alta → Katana · Media → Kusarigama · Iai → Shuriken',
      kills: { tanto: 'TANTO', wire: 'ALAMBRE', iai: 'IAI', drop: 'CAÍDA KUNAI' },
      upTitle: 'MEJORAS', buy: 'COMPRAR', maxed: 'MÁX', monHave: 'Tus mon: {m}',
      up: { silence: ['Silencio', 'Correr hace menos ruido.'], shadow: ['Sombra', 'Los guardias tardan más en verte.'], life: ['Vida extra', 'Vuelve de la muerte una vez por partida.'], bombs: ['Bomba de humo', 'Una bomba de humo más por partida.'], focus: ['Concentración', 'Más tiempo para decidir en los duelos.'] },
      keys: 'WASD mover · Shift correr · Espacio impulso · Q humo · Esc pausa',
      duelKeys: '1 Katana · 2 Kusarigama · 3 Shuriken · 4 Humo',
      story: 'El Shogun de Hierro encerró el último pergamino del clan Kage en el Laberinto de las Mil Puertas, cuyos pasillos cambian cada noche. Kurenai se ata la bufanda roja de su maestro y entra sola. Llega por la espalda, quédate en la sombra y, si te cruzas cara a cara con un guardia, lee su guardia.' },
    pt: { title: 'RED SCARF', sub: 'Passos Silenciosos', play: 'JOGAR', upgrades: 'MELHORIAS', seed: 'Semente', seedPh: 'aleatória', back: 'Voltar', resume: 'CONTINUAR', restart: 'Recomeçar no portão 1', menu: 'Menu', paused: 'PAUSADO', door: 'Portão', best: 'Melhor portão', mon: 'Mon', lives: 'Vidas', smoke: 'Fumaça', dash: 'Investida', sneaking: 'Furtivo', running: 'CORRENDO – barulho', locked: 'O portão está trancado – a chave está com o capitão', gotKey: 'A chave do capitão está com você!', alarm: 'ALARME! Os guardas estão vindo', alarmOff: 'O alarme passou', levelStart: 'Portão {n}', clear: 'Portão {n} vencido', clearInfo: 'Derrubadas: {k} · Ganho: {m} mon', next: 'PRÓXIMO PORTÃO', dead: 'KURENAI CAIU', reached: 'Portão alcançado: {n} · {m} mon nesta partida', reset: 'O labirinto te esquece – de volta ao portão 1.', revive: 'Vida extra – você se levanta!', newBest: 'NOVO RECORDE!', sound: 'Som', duel: 'DUELO', duelHint: 'Leia a postura, escolha a arma!', captainDuel: 'Capitão: quebre as duas posturas!', tooSlow: 'Lento demais',
      causes: { spikes: 'Espinhos subindo.', darts: 'Dardos de uma placa de pressão.', pendulum: 'A lâmina pendular.', fire: 'Um jato de fogo.', saw: 'A serra do trilho.', pit: 'Um piso que desabou.', gas: 'Gás venenoso.', duel: 'Você perdeu o duelo.' },
      stances: { jodan: ['POSTURA ALTA', 'espada acima da cabeça'], chudan: ['POSTURA MÉDIA', 'espada apontada para a frente'], iai: ['POSTURA IAI', 'mão no cabo, pronto para sacar'] },
      weapons: { katana: 'KATANA RISE', kusari: 'KUSARIGAMA', shuriken: 'SHURIKEN', smoke: 'BOMBA DE FUMAÇA' },
      rule: 'Alta → Katana · Média → Kusarigama · Iai → Shuriken',
      kills: { tanto: 'TANTO', wire: 'ARAME', iai: 'IAI', drop: 'QUEDA KUNAI' },
      upTitle: 'MELHORIAS', buy: 'COMPRAR', maxed: 'MÁX', monHave: 'Seus mon: {m}',
      up: { silence: ['Silêncio', 'Correr faz menos barulho.'], shadow: ['Sombra', 'Os guardas demoram mais para te notar.'], life: ['Vida extra', 'Volte da morte uma vez por partida.'], bombs: ['Bomba de fumaça', 'Mais uma bomba de fumaça por partida.'], focus: ['Foco', 'Mais tempo para decidir nos duelos.'] },
      keys: 'WASD andar · Shift correr · Espaço investida · Q fumaça · Esc pausa',
      duelKeys: '1 Katana · 2 Kusarigama · 3 Shuriken · 4 Fumaça',
      story: 'O Xogum de Ferro trancou o último pergaminho do clã Kage no Labirinto dos Mil Portões, cujos corredores mudam toda noite. Kurenai amarra o cachecol vermelho do mestre e entra sozinha. Chegue por trás, fique nas sombras – e se encontrar um guarda cara a cara, leia a postura dele.' }
  };
  /* additions: hearts, stamina, continue, new takedowns, new trap */
  const MORE = {
    tr: { cont: 'BU KAPIDAN DEVAM ET', contMenu: 'DEVAM ET · {n}. kapı', fromStart: '1. kapıdan başla', hp: 'Can', stam: 'Nefes', tired: 'Nefes nefese!', wound: '−1 CAN', resetNew: 'İstersen bu kapıdan devam et, istersen baştan başla.', crusher: 'Taş pres.',
      kills: { tanto: 'TANTO', wire: 'TEL', iai: 'IAI', drop: 'KUNAI DÜŞÜŞÜ', behead: 'KELLE', limbs: 'İKİ KOL', legs: 'DİZ ALTI', triple: 'ÜÇLÜ KESİM' } },
    en: { cont: 'CONTINUE FROM THIS GATE', contMenu: 'CONTINUE · gate {n}', fromStart: 'Start from gate 1', hp: 'Health', stam: 'Breath', tired: 'Out of breath!', wound: '−1 HEART', resetNew: 'Continue from this gate, or start over – your choice.', crusher: 'The stone crusher.',
      kills: { tanto: 'TANTO', wire: 'WIRE', iai: 'IAI', drop: 'KUNAI DROP', behead: 'BEHEAD', limbs: 'BOTH ARMS', legs: 'LOW CUT', triple: 'TRIPLE CUT' } },
    id: { cont: 'LANJUT DARI GERBANG INI', contMenu: 'LANJUT · gerbang {n}', fromStart: 'Mulai dari gerbang 1', hp: 'Darah', stam: 'Napas', tired: 'Terengah-engah!', wound: '−1 NYAWA', resetNew: 'Lanjutkan dari gerbang ini atau mulai lagi – pilihanmu.', crusher: 'Penghancur batu.',
      kills: { tanto: 'TANTO', wire: 'KAWAT', iai: 'IAI', drop: 'TERJANG KUNAI', behead: 'PENGGAL', limbs: 'DUA LENGAN', legs: 'TEBAS BAWAH', triple: 'TIGA TEBASAN' } },
    es: { cont: 'CONTINUAR EN ESTA PUERTA', contMenu: 'CONTINUAR · puerta {n}', fromStart: 'Empezar en la puerta 1', hp: 'Vida', stam: 'Aliento', tired: '¡Sin aliento!', wound: '−1 VIDA', resetNew: 'Continúa en esta puerta o empieza de nuevo: tú eliges.', crusher: 'La prensa de piedra.',
      kills: { tanto: 'TANTO', wire: 'ALAMBRE', iai: 'IAI', drop: 'CAÍDA KUNAI', behead: 'DECAPITAR', limbs: 'SIN BRAZOS', legs: 'CORTE BAJO', triple: 'TRIPLE CORTE' } },
    pt: { cont: 'CONTINUAR DESTE PORTÃO', contMenu: 'CONTINUAR · portão {n}', fromStart: 'Recomeçar no portão 1', hp: 'Vida', stam: 'Fôlego', tired: 'Sem fôlego!', wound: '−1 VIDA', resetNew: 'Continue deste portão ou comece de novo – você escolhe.', crusher: 'A prensa de pedra.',
      kills: { tanto: 'TANTO', wire: 'ARAME', iai: 'IAI', drop: 'QUEDA KUNAI', behead: 'DEGOLAR', limbs: 'SEM BRAÇOS', legs: 'CORTE BAIXO', triple: 'CORTE TRIPLO' } }
  };
  for (const l in MORE) { const m = MORE[l]; Object.assign(I18N[l], m); I18N[l].causes.crusher = m.crusher; }
  const fmt = (s, v) => { for (const k in v) s = s.split('{' + k + '}').join(v[k]); return s; };

  /* ───────────────────────────── STYLE ───────────────────────────── */
  const CSS = `
.rsg{position:relative;width:100%;height:100%;overflow:hidden;background:#07060a;font-family:"Chakra Petch","Segoe UI",system-ui,sans-serif;color:#f1e9dc;touch-action:none;user-select:none;-webkit-user-select:none}
.rsg canvas{display:block;width:100%;height:100%;touch-action:none}
.rsg .scr{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;padding:20px;background:radial-gradient(circle at 50% 35%,rgba(70,6,14,.55),rgba(4,3,6,.92));overflow:auto}
.rsg .scr.clear{background:transparent;pointer-events:none}.rsg .scr.clear *{pointer-events:auto}
.rsg .scr[hidden],.rsg [hidden]{display:none!important}
.rsg h2{font-size:clamp(2rem,6vw,3.4rem);letter-spacing:.08em;color:#e8192f;text-shadow:0 0 30px rgba(232,25,47,.5);margin:0;line-height:1}
.rsg h3{font-size:1.5rem;margin:0;color:#f1e9dc;letter-spacing:.06em}
.rsg .sub{letter-spacing:.4em;color:#d8c9b0;margin:0 0 8px;font-size:.9rem}
.rsg p{margin:0;max-width:56ch;color:#cfc4b4;line-height:1.5}
.rsg .b{font:700 1rem "Chakra Petch",system-ui;letter-spacing:.06em;background:linear-gradient(180deg,#ff2b43,#a50d20);color:#fff;border:0;border-radius:6px;padding:13px 30px;cursor:pointer;box-shadow:0 10px 30px -12px #ff2b43;min-width:200px}
.rsg .b.g{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.2);box-shadow:none}
.rsg .b:active{transform:scale(.97)}
.rsg .row{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;align-items:center}
.rsg input{font:600 .95rem "Chakra Petch",system-ui;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:6px;padding:9px 12px;width:150px;text-align:center}
.rsg .small{font-size:.8rem;color:#a99c8a}
.rsg .ups{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;width:min(820px,100%)}
.rsg .up{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:6px;text-align:left}
.rsg .up b{font-size:1.05rem;color:#fff}.rsg .up span{font-size:.82rem;color:#b8ab98}
.rsg .pips{display:flex;gap:4px}.rsg .pips i{width:18px;height:6px;border-radius:3px;background:rgba(255,255,255,.15)}.rsg .pips i.on{background:#e8192f}
.rsg .up button{align-self:flex-start;font:700 .85rem "Chakra Petch";background:#e8192f;border:0;color:#fff;border-radius:5px;padding:6px 12px;cursor:pointer}
.rsg .up button:disabled{background:#3a3436;color:#8a7f80;cursor:default}
.rsg .duel{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 10px 16px}
.rsg .duel .ws{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.rsg .duel button{width:clamp(70px,19vw,118px);height:clamp(58px,13vh,96px);border-radius:10px;border:2px solid #120d0e;background:#efe3cc;color:#120d0e;font:800 .78rem "Chakra Petch";display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;box-shadow:0 8px 0 #120d0e}
.rsg .duel button i{font-style:normal;font-size:1.7rem;line-height:1}
.rsg .duel button:disabled{opacity:.35}
.rsg .duel button:active{transform:translateY(4px);box-shadow:0 4px 0 #120d0e}
.rsg .pad{position:absolute;right:14px;bottom:14px;display:flex;flex-direction:column;gap:12px;align-items:center}
.rsg .pad button{width:74px;height:74px;border-radius:50%;border:2px solid rgba(232,25,47,.8);background:rgba(120,8,22,.55);color:#fff;font:800 .75rem "Chakra Petch";touch-action:none}
.rsg .pad button.s{width:58px;height:58px;border-color:rgba(220,220,230,.6);background:rgba(60,60,70,.55)}
.rsg .top{position:absolute;right:10px;top:10px;display:flex;gap:8px}
.rsg .top button{width:40px;height:40px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:rgba(10,8,12,.6);color:#fff;font-size:1rem;cursor:pointer}
`;

  /* ───────────────────────────── SAVE ───────────────────────────── */
  const SAVE_KEY = 'rs2-save';
  const UPS = { silence: { max: 3, cost: [60, 140, 260] }, shadow: { max: 3, cost: [80, 180, 320] }, life: { max: 2, cost: [150, 400] }, bombs: { max: 3, cost: [50, 120, 220] }, focus: { max: 3, cost: [70, 160, 300] } };
  function loadSave() { try { return Object.assign({ best: 1, mon: 0, up: { silence: 0, shadow: 0, life: 0, bombs: 0, focus: 0 }, mute: false }, JSON.parse(localStorage.getItem(SAVE_KEY) || '{}')); } catch (e) { return { best: 1, mon: 0, up: { silence: 0, shadow: 0, life: 0, bombs: 0, focus: 0 }, mute: false }; } }
  function storeSave(s) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) {} }

  /* ───────────────────────────── AUDIO (synthesised, no files) ───────────────────────────── */
  function makeAudio(save) {
    let ac = null, master = null, music = null;
    function ctx() {
      if (!ac) { try { ac = new (global.AudioContext || global.webkitAudioContext)(); } catch (e) { return null; } }
      if (ac.state === 'suspended') ac.resume();
      if (!master) { master = ac.createGain(); master.gain.value = save.mute ? 0 : 1; master.connect(ac.destination); music = makeMusic(ac, master); }
      return ac;
    }
    function tone(f, d, type, vol, slide) { const a = ctx(); if (!a) return; const o = a.createOscillator(), g = a.createGain(); o.type = type || 'sine'; o.frequency.value = f; if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + d); g.gain.setValueAtTime(vol || .2, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + d); o.connect(g); g.connect(master); o.start(); o.stop(a.currentTime + d); }
    function noise(d, vol, hp) { const a = ctx(); if (!a) return; const b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length); const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = hp || 1500; g.gain.value = vol || .3; s.buffer = b; s.connect(f); f.connect(g); g.connect(master); s.start(); }
    return {
      unlock: ctx,
      setMute(m) { if (master) master.gain.setTargetAtTime(m ? 0 : 1, ac.currentTime, .05); },
      scene(sc) { if (music) music.scene(sc); },
      tension(t) { if (music) music.tension(t); },
      suspend(on) { if (ac) { if (on) ac.suspend(); else ac.resume(); } },
      slash() { noise(.22, .35, 2500); tone(1400, .15, 'sawtooth', .05, 300); },
      hit() { tone(90, .25, 'sine', .4, 40); noise(.1, .2, 400); },
      bell() { tone(880, 1.4, 'sine', .18); tone(1320, 1, 'sine', .08); },
      alarm() { tone(620, .18, 'square', .08); setTimeout(() => tone(440, .22, 'square', .08), 200); },
      key() { [660, 880, 1320].forEach((f, i) => setTimeout(() => tone(f, .25, 'triangle', .15), i * 90)); },
      dash() { noise(.12, .15, 800); },
      death() { tone(220, .9, 'sawtooth', .15, 55); },
      tick() { tone(1200, .05, 'square', .04); },
      gong() { tone(110, 1.6, 'sine', .35, 90); tone(220, 1.2, 'sine', .12); },
      /* a voiced scream: sawtooth through vowel formants, with vibrato, rasp and a falling pitch */
      scream(base, dur, vol) {
        const a = ctx(); if (!a) return; const t = a.currentTime;
        const o = a.createOscillator(), vib = a.createOscillator(), vg = a.createGain(), shaper = a.createWaveShaper(), g = a.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(base * .9, t); o.frequency.linearRampToValueAtTime(base * 1.18, t + dur * .2); o.frequency.exponentialRampToValueAtTime(base * .62, t + dur);
        vib.frequency.value = 7; vg.gain.value = base * .045; vib.connect(vg); vg.connect(o.frequency);
        const curve = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 128 - 1; curve[i] = Math.tanh(x * 3); } shaper.curve = curve;
        o.connect(shaper);
        const mix = a.createGain(); mix.gain.value = 1;
        [[850, 7, 1], [1300, 9, .7], [2600, 11, .35]].forEach(([f, q, v]) => { const bp = a.createBiquadFilter(), bg = a.createGain(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(f, t); bp.frequency.linearRampToValueAtTime(f * .85, t + dur); bp.Q.value = q; bg.gain.value = v; shaper.connect(bp); bp.connect(bg); bg.connect(mix); });
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol || .5, t + .04); g.gain.setValueAtTime(vol || .5, t + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        mix.connect(g); g.connect(master); [o, vib].forEach(x => { x.start(t); x.stop(t + dur + .05); });
        noise(dur * .6, (vol || .5) * .12, 1800);
      },
      grunt() { this.scream(260, .28, .35); },
      pant(inhale) { const a = ctx(); if (!a) return; const t = a.currentTime, d = inhale ? .32 : .26, b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), ch = b.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = b; f.type = 'bandpass'; f.frequency.value = inhale ? 1500 : 1000; f.Q.value = 1.2; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(inhale ? .12 : .16, t + d * .35); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(f); f.connect(g); g.connect(master); s.start(t); }
    };
  }

  /* Generative score: drone + wind, shakuhachi-like flute and koto plucks in the Japanese "in" scale,
     taiko drums that speed up with the tension (0 calm … 1 alarm/duel). No audio files. */
  function makeMusic(ac, out) {
    const bus = ac.createGain(); bus.gain.value = 0; bus.connect(out);
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.connect(bus);
    /* a little room: feedback delay */
    const dl = ac.createDelay(1), fb = ac.createGain(), wet = ac.createGain(), lp = ac.createBiquadFilter();
    dl.delayTime.value = .33; fb.gain.value = .32; wet.gain.value = .35; lp.type = 'lowpass'; lp.frequency.value = 2200;
    dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(comp);
    const dry = ac.createGain(); dry.connect(comp); dry.connect(dl);
    /* drone */
    const dG = ac.createGain(); dG.gain.value = .05; const dF = ac.createBiquadFilter(); dF.type = 'lowpass'; dF.frequency.value = 260; dF.Q.value = 4; dF.connect(dG); dG.connect(comp);
    [[73.42, 'sine', .9], [73.9, 'sawtooth', .35], [110, 'sine', .25]].forEach(([f, t, v]) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = t; o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(dF); o.start(); });
    const lfo = ac.createOscillator(), lfoG = ac.createGain(); lfo.frequency.value = .06; lfoG.gain.value = 120; lfo.connect(lfoG); lfoG.connect(dF.frequency); lfo.start();
    /* wind */
    const nb = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const wind = ac.createBufferSource(); wind.buffer = nb; wind.loop = true;
    const wF = ac.createBiquadFilter(); wF.type = 'bandpass'; wF.frequency.value = 500; wF.Q.value = .8; const wG = ac.createGain(); wG.gain.value = .025;
    wind.connect(wF); wF.connect(wG); wG.connect(comp); wind.start();
    const wl = ac.createOscillator(), wlG = ac.createGain(); wl.frequency.value = .045; wlG.gain.value = 320; wl.connect(wlG); wlG.connect(wF.frequency); wl.start();
    const SCALE = [293.66, 311.13, 392, 440, 466.16, 587.33, 622.25, 783.99];
    let tension = 0, target = 0, sc = 'menu', next = ac.currentTime + .1, step = 0, flutePos = 3, fluteBusy = 0;
    const env = (g, t, a, peak, rel) => { g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + rel); };
    function taiko(t, vol, pitch) {
      const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(pitch || 130, t); o.frequency.exponentialRampToValueAtTime(42, t + .35); env(g, t, .005, vol, .5); o.connect(g); g.connect(dry); o.start(t); o.stop(t + .6);
      const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g2 = ac.createGain(); s.buffer = nb; f.type = 'lowpass'; f.frequency.value = 900; env(g2, t, .002, vol * .5, .09); s.connect(f); f.connect(g2); g2.connect(dry); s.start(t, Math.random() * 2, .12);
    }
    function shime(t, vol) { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = nb; f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 3; env(g, t, .002, vol, .06); s.connect(f); f.connect(g); g.connect(dry); s.start(t, Math.random() * 2, .08); }
    function pluck(t, f, vol) { const o = ac.createOscillator(), fl = ac.createBiquadFilter(), g = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.setValueAtTime(3200, t); fl.frequency.exponentialRampToValueAtTime(350, t + .35); env(g, t, .004, vol, .8); o.connect(fl); fl.connect(g); g.connect(dry); o.start(t); o.stop(t + 1); }
    function flute(t, f, dur, vol) {
      const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), vib = ac.createOscillator(), vg = ac.createGain();
      o.type = 'sine'; o2.type = 'triangle'; o.frequency.setValueAtTime(f * .96, t); o.frequency.exponentialRampToValueAtTime(f, t + .22); o2.frequency.value = f * 2;
      vib.frequency.value = 5.2; vg.gain.setValueAtTime(0, t); vg.gain.linearRampToValueAtTime(f * .012, t + dur * .6); vib.connect(vg); vg.connect(o.frequency);
      const g2 = ac.createGain(); g2.gain.value = .08; o2.connect(g2); g2.connect(g); o.connect(g);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .18); g.gain.setValueAtTime(vol, t + dur - .3); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .25);
      const s = ac.createBufferSource(), bf = ac.createBiquadFilter(), bg = ac.createGain(); s.buffer = nb; bf.type = 'bandpass'; bf.frequency.value = f * 2.2; bf.Q.value = 1.5; bg.gain.setValueAtTime(.0001, t); bg.gain.exponentialRampToValueAtTime(vol * .35, t + .1); bg.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(bf); bf.connect(bg); bg.connect(dry); s.start(t, Math.random(), dur + .3);
      g.connect(dry); [o, o2, vib].forEach(x => { x.start(t); x.stop(t + dur + .4); });
    }
    function schedule() {
      tension += (target - tension) * .08;
      const T = tension, bpm = 58 + T * 74, beat = 60 / bpm / 2;
      while (next < ac.currentTime + .15) {
        const t = next, s = step % 16, calm = sc === 'menu' || sc === 'over';
        if (!calm) {
          if (s === 0 || s === 8) taiko(t, .32 + T * .3, 120);
          if (T > .25 && (s === 1 || s === 9)) taiko(t, .2 + T * .2, 150);
          if (T > .5 && (s === 4 || s === 12)) taiko(t, .25, 110);
          if (T > .7 && s % 2 === 1) shime(t, .06 + T * .06);
          if (T > .85 && (s === 14 || s === 15)) taiko(t, .3, 170);
        } else if (s === 0 && step % 32 === 0) taiko(t, .18, 100);
        if (Math.random() < (sc === 'duel' ? .35 : .07 + T * .12)) pluck(t, SCALE[Math.floor(Math.random() * 5)] / 2, .06 + T * .04);
        if (fluteBusy <= t && sc !== 'duel' && Math.random() < (calm ? .1 : .06 * (1 - T * .6))) {
          let tt = t; const n = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < n; i++) { flutePos = Math.max(0, Math.min(SCALE.length - 1, flutePos + Math.floor(Math.random() * 5) - 2)); const d = .7 + Math.random() * 1.3; flute(tt, SCALE[flutePos], d, .05); tt += d + .1; }
          fluteBusy = tt + 1.5;
        }
        next += beat; step++;
      }
    }
    setInterval(() => { if (ac.state === 'running') schedule(); }, 50);
    const LEVEL = { menu: .55, play: .7, duel: .85, cine: .75, over: .35, pause: .2 };
    return {
      scene(s) { if (s === sc) return; sc = s; bus.gain.setTargetAtTime(LEVEL[s] == null ? .6 : LEVEL[s], ac.currentTime, .6); dG.gain.setTargetAtTime(s === 'duel' ? .08 : .05, ac.currentTime, .5); },
      tension(t) { target = clamp(t, 0, 1); wG.gain.setTargetAtTime(.02 + target * .03, ac.currentTime, .5); }
    };
  }

  /* ───────────────────────────── INK PAINTING (cinematic figures) ───────────────────────────── */
  /* A standing figure in sumi-e style. Feet at (x, y). Units: ~210 tall at s = 1. */
  /* Geometry shared by the figure painter and the cut/blood effects (local units, feet at 0). */
  const figGeo = P => { const cr = P.crouch || 0, hipY = -88 + cr * 26, shY = -150 + cr * 30; return { cr, hipY, shY, headY: shY - 22 }; };
  /* World position of a local point of a figure drawn at (x, y) with scale s. */
  function figPt(x, y, s, P, lx, ly) { const a = P.lean || 0, f = P.face || 1, rx = lx * Math.cos(a) - ly * Math.sin(a), ry = lx * Math.sin(a) + ly * Math.cos(a); return { x: x + rx * s * f, y: y + ry * s }; }
  /* P.cut = { head, armF, armB, legs } leaves those parts off (stumps); P.only = 'head' | 'armF' | 'armB' | 'legs' draws just that part,
     centred on its joint, so a severed part can be thrown around on its own. */
  function inkFigure(c, x, y, s, P) {
    const R = mulberry32(P.seed || 7), jit = Array.from({ length: 40 }, () => R());
    const ink = P.ink || '#0d0b0c', skin = P.skin === undefined ? '#e6cfaa' : P.skin;
    const { cr, hipY, shY, headY } = figGeo(P), cut = P.cut || {}, only = P.only;
    const show = part => only ? only === part : !cut[part];
    c.save(); c.translate(x, y); c.scale(s * (P.face || 1), s); c.rotate(P.lean || 0);
    c.globalAlpha = P.alpha == null ? 1 : P.alpha;
    if (only === 'head') c.translate(-4, -headY); else if (only === 'armF') c.translate(-18, -(shY + 4)); else if (only === 'armB') c.translate(16, -(shY + 4)); else if (only === 'legs') c.translate(0, -hipY);
    c.lineCap = 'round'; c.lineJoin = 'round';
    /* scarf (behind) */
    if (P.scarf && !only && !cut.head) {
      const t = P.t || 0;
      for (const [w, o] of [[13, 0], [9, 1.3]]) {
        c.strokeStyle = P.scarfCol || '#0d0b0c'; c.lineWidth = w; c.beginPath(); c.moveTo(-4, shY - 6);
        for (let k = 1; k <= 6; k++) c.lineTo(-4 - k * 22, shY - 6 + k * 6 + Math.sin(t * 7 - k * .9 + o) * k * 3.2 + o * 10);
        c.stroke();
      }
    }
    const spread = 18 + cr * 40, hem = -24 + cr * 14;
    /* legs (and the lower robe when the legs fly off on their own) */
    if (show('legs')) {
      c.strokeStyle = ink; c.lineWidth = 15;
      c.beginPath(); c.moveTo(-6, hipY); c.lineTo(-spread * .6, hipY + (0 - hipY) * .55 - cr * 6); c.lineTo(-spread, 0); c.stroke();
      c.beginPath(); c.moveTo(6, hipY); c.lineTo(spread * .7, hipY + (0 - hipY) * .5); c.lineTo(spread + 6, 0); c.stroke();
      if (only === 'legs') { c.fillStyle = '#7a0414'; c.beginPath(); c.ellipse(0, hipY, 16, 6, 0, 0, TAU); c.fill(); }
    }
    /* robe with ragged brush hem */
    if (!only) {
      c.save(); if (cut.legs) { c.beginPath(); c.rect(-200, -400, 400, 400 + hipY + 6); c.clip(); }
      c.fillStyle = P.robe || ink;
      c.beginPath(); c.moveTo(-26, shY); c.lineTo(26, shY); c.lineTo(22, hipY - 4);
      c.lineTo(46 + cr * 10, hem);
      const n = 12; for (let i = 0; i <= n; i++) { const k = i / n, hx = lerp(46 + cr * 10, -52 - cr * 12, k); c.lineTo(hx, hem + (i % 2 ? -14 - jit[i] * 20 : 6 + jit[i] * 14)); }
      c.lineTo(-22, hipY - 4); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.06)'; c.lineWidth = 2;
      for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(-18 + i * 6, shY + 8); c.lineTo(-30 + i * 10 + jit[i + 10] * 8, hem - 10); c.stroke(); }
      if (P.sash) { c.fillStyle = P.sash; c.fillRect(-24, hipY - 18, 48, 9); }
      if (P.inner) { c.fillStyle = P.inner; c.beginPath(); c.moveTo(-6, shY); c.lineTo(6, shY); c.lineTo(0, shY + 26); c.closePath(); c.fill(); }
      c.restore();
      /* stumps */
      c.fillStyle = '#8a0418';
      if (cut.head) { c.beginPath(); c.ellipse(4, shY - 4, 11, 5, 0, 0, TAU); c.fill(); }
      if (cut.armF) { c.beginPath(); c.arc(20, shY + 6, 8, 0, TAU); c.fill(); }
      if (cut.armB) { c.beginPath(); c.arc(-16, shY + 6, 8, 0, TAU); c.fill(); }
      if (cut.legs) { c.beginPath(); c.ellipse(0, hipY + 4, 22, 7, 0, 0, TAU); c.fill(); }
    }
    /* arms: back arm first */
    const arm = (sx, a1, a2, len, back) => {
      const ex = sx + Math.sin(a1) * len, ey = shY + 4 + Math.cos(a1) * len, hx = ex + Math.sin(a2) * len * .95, hy = ey + Math.cos(a2) * len * .95;
      c.strokeStyle = back ? (P.robe2 || P.robe || ink) : (P.robe || ink); c.lineWidth = 15; c.beginPath(); c.moveTo(sx, shY + 4); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
      if (skin) { c.fillStyle = skin; c.beginPath(); c.arc(hx, hy, 6, 0, TAU); c.fill(); }
      if (only === (back ? 'armB' : 'armF')) { c.fillStyle = '#8a0418'; c.beginPath(); c.arc(sx, shY + 4, 8, 0, TAU); c.fill(); }
      return { x: hx, y: hy };
    };
    const sword = (h, a, len, sheathed) => {
      if (!a && a !== 0) return;
      c.save(); c.translate(h.x, h.y); c.rotate(a);
      c.strokeStyle = '#1a1416'; c.lineWidth = 5; c.beginPath(); c.moveTo(0, 10); c.lineTo(0, -16); c.stroke();
      c.fillStyle = '#b08a3a'; c.fillRect(-7, -18, 14, 4);
      if (!sheathed) { c.strokeStyle = '#0d0b0c'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -20); c.quadraticCurveTo(4, -len * .55, 9, -len); c.stroke(); c.strokeStyle = P.bloodySword ? '#c3081f' : '#e8ecf3'; c.lineWidth = 2.5; c.stroke(); }
      else { c.strokeStyle = '#0d0b0c'; c.lineWidth = 7; c.beginPath(); c.moveTo(0, -20); c.lineTo(4, -len * .8); c.stroke(); }
      c.restore();
    };
    if (show('armB')) { const hb = arm(-16, P.armB != null ? P.armB : .3, P.armB2 != null ? P.armB2 : .1, 36, true); if (P.swordB != null) sword(hb, P.swordB, P.swordLen2 || 120, false); }
    if (show('armF')) { const hf = arm(18, P.armF != null ? P.armF : -.2, P.armF2 != null ? P.armF2 : -.4, 36, false); if (P.swordF != null) sword(hf, P.swordF, P.swordLen || 150, P.sheathed); }
    if (P.saya && !only) { c.strokeStyle = ink; c.lineWidth = 7; c.beginPath(); c.moveTo(-30, hipY - 6); c.lineTo(46, hipY - 30); c.stroke(); }
    /* head */
    if (show('head')) {
      c.fillStyle = skin && P.hat !== 'hood' ? skin : ink; c.beginPath(); c.arc(4, headY, 15, 0, TAU); c.fill();
      if (only === 'head') { c.fillStyle = '#8a0418'; c.beginPath(); c.ellipse(4, headY + 14, 9, 4, 0, 0, TAU); c.fill(); }
      if (P.hat === 'hood' || P.mask) { c.fillStyle = ink; c.beginPath(); c.arc(4, headY, 16, 0, TAU); c.fill(); c.fillStyle = '#efe3cc'; c.beginPath(); c.moveTo(6, headY - 4); c.lineTo(20, headY - 6); c.lineTo(18, headY + 1); c.lineTo(6, headY + 1); c.closePath(); c.fill(); c.fillStyle = '#0d0b0c'; c.fillRect(13, headY - 4, 3, 3); }
      if (P.hat === 'straw' || P.hat === 'hood') {
        const tilt = P.hatTilt || .12;
        c.save(); c.translate(4, headY - 6); c.rotate(tilt);
        c.fillStyle = '#c9b48a'; c.beginPath(); c.moveTo(-62, 6); c.lineTo(0, -34); c.lineTo(64, 6); c.quadraticCurveTo(0, 14, -62, 6); c.fill();
        c.strokeStyle = 'rgba(40,28,20,.55)'; c.lineWidth = 1.6; for (let i = -5; i <= 5; i++) { c.beginPath(); c.moveTo(0, -34); c.lineTo(i * 12, 8); c.stroke(); }
        c.strokeStyle = ink; c.lineWidth = 4; c.beginPath(); c.moveTo(-64, 7); c.quadraticCurveTo(0, 15, 66, 7); c.stroke();
        c.restore();
      } else if (P.hat === 'topknot') {
        c.fillStyle = ink; c.beginPath(); c.arc(4, headY - 3, 15, Math.PI * 1.05, Math.PI * 2.05); c.fill(); c.fillRect(-4, headY - 26, 8, 12); c.beginPath(); c.ellipse(-2, headY - 27, 10, 4, -.3, 0, TAU); c.fill();
        c.fillStyle = '#0d0b0c'; c.fillRect(10, headY - 2, 5, 2); c.fillRect(10, headY + 6, 6, 1.5);
      } else if (P.hat === 'kabuto') {
        c.fillStyle = '#2a1a14'; c.beginPath(); c.arc(4, headY - 2, 18, Math.PI, TAU); c.fill(); c.fillStyle = '#d6a93a'; c.beginPath(); c.moveTo(4, headY - 18); c.quadraticCurveTo(-16, headY - 46, -26, headY - 40); c.quadraticCurveTo(-8, headY - 30, 4, headY - 14); c.quadraticCurveTo(16, headY - 30, 34, headY - 40); c.quadraticCurveTo(24, headY - 46, 4, headY - 18); c.fill();
        c.fillStyle = '#0d0b0c'; c.fillRect(10, headY - 1, 6, 2);
      }
    }
    c.restore();
  }
  /* A gushing stream of blood: droplets are born over time at (x, y) and fly along a parabola. k = seconds since it started. */
  function fountain(c, x, y, ang, k, power, seed, sc, emit) {
    if (k <= 0) return;
    const R = mulberry32(seed || 11), n = 70, E = emit || 1.1;
    c.fillStyle = '#b3061c';
    for (let i = 0; i < n; i++) {
      const born = i / n * Math.min(k, E), age = k - born; if (age > 1.1) continue;
      const sp = (260 + R() * 220) * (power || 1) * sc * (1 - born / E * .5), a = ang + (R() - .5) * .45;
      const px = x + Math.cos(a) * sp * age, py = y + Math.sin(a) * sp * age + 620 * sc * age * age;
      const r = (2.5 + R() * 6) * sc * Math.max(.35, 1 - age * .7);
      c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill();
    }
  }
  /* A blood pool that spreads on the ground */
  function pool(c, x, y, k, max, sc) { const r = Math.min(1, k) * max * sc; if (r <= 0) return; c.fillStyle = '#8a0418'; c.beginPath(); c.ellipse(x, y, r, r * .22, 0, 0, TAU); c.fill(); c.fillStyle = '#b3061c'; c.beginPath(); c.ellipse(x - r * .2, y - 2, r * .6, r * .12, 0, 0, TAU); c.fill(); }
  /* Paper with red sun and ink stains */
  function paper(c, w, h, t, sunX, sunY, sunR, dark) {
    if (dark) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0b1230'); g.addColorStop(1, '#03040c'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(230,230,250,.9)'; c.beginPath(); c.arc(sunX, sunY, sunR, 0, TAU); c.fill(); c.fillStyle = 'rgba(11,18,48,.25)'; c.beginPath(); c.arc(sunX - sunR * .3, sunY - sunR * .1, sunR * .25, 0, TAU); c.fill(); return; }
    c.fillStyle = '#e8dcc3'; c.fillRect(0, 0, w, h);
    const R = mulberry32(99);
    for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(${R() < .4 ? '170,30,25' : '110,80,50'},${.025 + R() * .035})`; c.beginPath(); c.arc(R() * w, R() * h, 10 + R() * 50, 0, TAU); c.fill(); }
    c.strokeStyle = 'rgba(60,40,25,.08)'; c.lineWidth = 1; for (let i = 0; i < 40; i++) { const y = R() * h; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + (R() - .5) * 30); c.stroke(); }
    c.fillStyle = '#c8202a'; c.beginPath(); c.arc(sunX, sunY, sunR, 0, TAU); c.fill();
    c.fillStyle = 'rgba(200,32,42,.25)'; for (let i = 0; i < 18; i++) { const a = R() * TAU, r = sunR * (1 + R() * .25); c.beginPath(); c.arc(sunX + Math.cos(a) * r, sunY + Math.sin(a) * r, 4 + R() * 14, 0, TAU); c.fill(); }
    const g = c.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .3, w / 2, h / 2, Math.max(w, h) * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,20,10,.55)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  }
  function inkGround(c, w, y) { c.fillStyle = '#0d0b0c'; c.beginPath(); c.moveTo(0, y); const R = mulberry32(5); for (let x = 0; x <= w; x += 30) c.lineTo(x, y + Math.sin(x * .02) * 4 + R() * 6); c.lineTo(w, y + 30); c.lineTo(0, y + 30); c.fill(); }
  function splatter(c, x, y, n, r, seed, k) {
    const R = mulberry32(seed || 3); c.fillStyle = '#b3061c';
    for (let i = 0; i < n; i++) { const a = R() * TAU, d = R() * r * (k == null ? 1 : k); c.beginPath(); c.arc(x + Math.cos(a) * d, y + Math.sin(a) * d * .7, 2 + R() * 9 * (1 - d / r / 1.2), 0, TAU); c.fill(); }
  }
  function brushTitle(c, text, x, y, size, k, col) {
    c.save(); c.translate(x, y); c.rotate(-.05);
    const w = c.measureText ? (c.font = `900 ${size}px "Chakra Petch",system-ui`, c.measureText(text).width) : 300;
    c.fillStyle = col || '#0d0b0c'; c.beginPath(); c.moveTo(-w / 2 - 24, -size * .55); c.lineTo(-w / 2 - 24 + (w + 48) * Math.min(1, k * 2.5), -size * .62); c.lineTo(-w / 2 - 24 + (w + 48) * Math.min(1, k * 2.5), size * .38); c.lineTo(-w / 2 - 30, size * .45); c.fill();
    c.fillStyle = '#f4ecdc'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.globalAlpha = clamp((k - .15) * 4, 0, 1); c.fillText(text, 0, 2); c.restore(); c.globalAlpha = 1;
  }
  function slashStroke(c, x1, y1, x2, y2, k, wid, col) {
    const p = clamp(k, 0, 1); if (p <= 0) return;
    c.strokeStyle = col || '#0d0b0c'; c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.lineWidth = (wid || 18) * (1 - i * .3); c.globalAlpha = 1 - i * .25; c.beginPath(); c.moveTo(x1, y1 + i * 3); c.lineTo(lerp(x1, x2, p), lerp(y1, y2, p) + i * 3); c.stroke(); }
    c.globalAlpha = 1;
  }

  /* =====================================================================================
     GAME
     ===================================================================================== */
  function mount(host, opts) {
    opts = opts || {};
    const L = I18N[opts.lang] || I18N[(document.documentElement.lang || 'en').slice(0, 2)] || I18N.en;
    if (!document.getElementById('rsg-css')) { const st = document.createElement('style'); st.id = 'rsg-css'; st.textContent = CSS; document.head.appendChild(st); }
    host.innerHTML = '';
    const root = document.createElement('div'); root.className = 'rsg'; host.appendChild(root);
    const cv = document.createElement('canvas'); root.appendChild(cv);
    const ctx = cv.getContext('2d');
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; root.appendChild(e); return e; };
    const save = loadSave(), sfx = makeAudio(save);

    /* DOM layers */
    const topBar = el('div', 'top', `<button data-a="mute" aria-label="${L.sound}">${save.mute ? '🔇' : '🔊'}</button><button data-a="pause" aria-label="${L.paused}">❚❚</button><button data-a="full" aria-label="Full screen">⛶</button>`);
    const pad = el('div', 'pad', `<button class="s" data-a="smoke">${L.smoke}<br><b data-v="bombs">1</b></button><button data-a="dash">${L.dash}</button>`); pad.hidden = true;
    const duelUI = el('div', 'duel', `<div class="ws"><button data-w="katana"><i>🗡</i>${L.weapons.katana}</button><button data-w="kusari"><i>⛓</i>${L.weapons.kusari}</button><button data-w="shuriken"><i>✴</i>${L.weapons.shuriken}</button><button data-w="smoke"><i>💨</i>${L.weapons.smoke}</button></div><div class="small">${L.duelKeys}</div>`); duelUI.hidden = true;
    const scr = el('div', 'scr');

    /* ───── state ───── */
    let W = 0, H = 0, DPR = 1;
    let mode = 'menu';         // menu | play | pause | duel | cine | over | clear | upgrades
    let run = null;            // current run: { seed, door, mon, kills, lives, bombs }
    let map, MW, MH, seen, guards, traps, lanterns, decals, corpses, exitT, player, alarmT = 0, time = 0, msg = null;
    let parts = [], mist = [];
    let duel = null, cine = null, smokeClouds = [];
    let G = {};                // per-level guard stats
    const cam = { x: 0, y: 0, z: 1, shake: 0 };
    const input = { keys: {}, stick: null, touch: false };
    let rng = Math.random;

    /* ───────── level generation (seeded) ───────── */
    const wall = (tx, ty) => tx < 0 || ty < 0 || tx >= MW || ty >= MH || map[ty * MW + tx] === 1;
    const wallAt = (x, y) => wall(Math.floor(x / TS), Math.floor(y / TS));
    const center = (tx, ty) => ({ x: tx * TS + TS / 2, y: ty * TS + TS / 2 });
    const pick = a => a[Math.floor(rng() * a.length)];
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

    function buildLevel(door) {
      rng = mulberry32(hashStr(run.seed + ':' + door));
      const C = Math.min(7 + Math.floor(door * 1.4), 22);
      MW = MH = C * 2 + 1;
      map = new Uint8Array(MW * MH).fill(1);
      /* maze: depth-first carve */
      const vis = new Uint8Array(C * C), stack = [[0, 0]]; vis[0] = 1; map[MW + 1] = 0;
      while (stack.length) {
        const [cx, cy] = stack[stack.length - 1];
        const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => { const nx = cx + dx, ny = cy + dy; return nx >= 0 && ny >= 0 && nx < C && ny < C && !vis[ny * C + nx]; });
        if (!nb.length) { stack.pop(); continue; }
        const [dx, dy] = pick(nb), nx = cx + dx, ny = cy + dy;
        vis[ny * C + nx] = 1; map[(cy * 2 + 1 + dy) * MW + cx * 2 + 1 + dx] = 0; map[(ny * 2 + 1) * MW + nx * 2 + 1] = 0; stack.push([nx, ny]);
      }
      /* loops */
      for (let i = 0; i < C * C * .14; i++) {
        const tx = 1 + Math.floor(rng() * (MW - 2)), ty = 1 + Math.floor(rng() * (MH - 2));
        if (map[ty * MW + tx] !== 1) continue;
        if ((!wall(tx - 1, ty) && !wall(tx + 1, ty) && wall(tx, ty - 1) && wall(tx, ty + 1)) || (!wall(tx, ty - 1) && !wall(tx, ty + 1) && wall(tx - 1, ty) && wall(tx + 1, ty))) map[ty * MW + tx] = 0;
      }
      /* courtyards (rooms) */
      const rooms = [];
      for (let i = 0; i < 2 + door / 2; i++) { const rw = 3 + 2 * Math.floor(rng() * 2), rh = 3 + 2 * Math.floor(rng() * 2), rx = 1 + 2 * Math.floor(rng() * Math.max(1, (MW - rw - 1) / 2)), ry = 1 + 2 * Math.floor(rng() * Math.max(1, (MH - rh - 1) / 2)); for (let y = ry; y < Math.min(MH - 1, ry + rh); y++) for (let x = rx; x < Math.min(MW - 1, rx + rw); x++) map[y * MW + x] = 0; rooms.push({ x: rx, y: ry, w: rw, h: rh }); }
      seen = new Uint8Array(MW * MH);
      /* distances from start */
      const dist = new Int32Array(MW * MH).fill(-1), q = [MW + 1]; dist[MW + 1] = 0;
      for (let h = 0; h < q.length; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = (y + dy) * MW + x + dx; if (!wall(x + dx, y + dy) && dist[j] < 0) { dist[j] = dist[i] + 1; q.push(j); } } }
      let far = MW + 1; for (const i of q) if (dist[i] > dist[far]) far = i;
      exitT = { tx: far % MW, ty: (far / MW) | 0 };
      const corridor = i => { const x = i % MW, y = (i / MW) | 0; if (!wall(x - 1, y) && !wall(x + 1, y) && wall(x, y - 1) && wall(x, y + 1)) return 'h'; if (!wall(x, y - 1) && !wall(x, y + 1) && wall(x - 1, y) && wall(x + 1, y)) return 'v'; return null; };
      /* traps: unlocked one type per gate, more of them deeper */
      const KINDS = ['spikes', 'plate', 'pendulum', 'fire', 'saw', 'collapse', 'wire', 'gas'];
      const kinds = KINDS.slice(0, Math.min(8, door + 1)), nT = Math.min(5 + door * 3, 48), used = new Set();
      traps = [];
      for (const i of shuffle(q.slice())) {
        if (traps.length >= nT) break;
        const ax = corridor(i); if (!ax || dist[i] < 4 || i === far) continue;
        const x = i % MW, y = (i / MW) | 0;
        if ([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => used.has((y + dy) * MW + x + dx))) continue;
        used.add(i); traps.push({ type: pick(kinds), tx: x, ty: y, ax, ph: rng() * 10, armed: true });
      }
      lanterns = q.filter(i => !corridor(i) && rng() < .1).map(i => ({ ...center(i % MW, (i / MW) | 0), f: rng() * 6 }));
      /* guards */
      G = { cone: Math.min(.48 + door * .06, 1.0), range: Math.min(150 + door * 18, 360), detect: Math.max(.3, 1.05 - door * .06), speed: 62 + Math.min(door, 12) * 4, duelTime: Math.max(1.05, 2.6 - door * .11) + save.up.focus * .3 };
      guards = [];
      const spots = shuffle(q.filter(i => dist[i] > 8 && !used.has(i)));
      const nG = Math.min(2 + door, 16);
      for (let k = 0; k < nG && k < spots.length; k++) {
        const p = center(spots[k] % MW, (spots[k] / MW) | 0);
        guards.push({ id: k, x: p.x, y: p.y, hx: p.x, hy: p.y, ang: rng() * TAU, look0: 0, state: 'patrol', path: [], wait: rng() * 2, lookT: 0, det: 0, spotted: false, alive: true, stun: 0, captain: k === 0, walk: 0, mem: null, lost: 0, stance: null });
      }
      decals = []; corpses = []; smokeClouds = []; parts = []; alarmT = 0;
      const st = center(1, 1);
      player = { x: st.x, y: st.y, ang: 0, walk: 0, run: false, noise: 0, stam: 100, pantT: 0, pantIn: false, dashT: 0, dashCd: 0, inv: 0, hasKey: false, scarf: Array.from({ length: 8 }, () => ({ x: st.x, y: st.y })), alive: true, hidden: 0, trail: [] };
      cam.x = player.x; cam.y = player.y;
      mist = Array.from({ length: 24 }, () => ({ x: rng() * MW * TS, y: rng() * MH * TS, r: 80 + rng() * 140, v: 6 + rng() * 10 }));
      run.levelKills = 0; run.levelMon = 0;
      time = 0;
      rng = Math.random; /* gameplay randomness after generation does not need the seed */
    }

    /* ───────── sight helpers ───────── */
    function los(x1, y1, x2, y2) { const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / 10); for (let i = 1; i < n; i++) if (wallAt(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n)) return false; return true; }
    const inSmoke = (x, y) => smokeClouds.some(s => Math.hypot(x - s.x, y - s.y) < s.r);
    const coneRange = () => G.range * (alarmT > 0 ? 1.25 : 1), coneAng = () => G.cone * (alarmT > 0 ? 1.15 : 1);
    function sees(g, x, y) {
      const d = Math.hypot(x - g.x, y - g.y);
      if (d < 26) return true;
      if (d > coneRange()) return false;
      if (Math.abs(angDiff(g.ang, Math.atan2(y - g.y, x - g.x))) > coneAng()) return false;
      if (inSmoke(x, y) || inSmoke(g.x, g.y)) return false;
      return los(g.x, g.y, x, y);
    }

    /* ───────── path finding (BFS on tiles, guards avoid traps) ───────── */
    function bfs(fx, fy, tx, ty, allowTraps) {
      const s = fy * MW + fx, t = ty * MW + tx; if (s === t) return [];
      const prev = new Int32Array(MW * MH).fill(-1), q = [s]; prev[s] = s;
      const block = allowTraps ? null : new Set(traps.map(r => r.ty * MW + r.tx));
      for (let h = 0; h < q.length && prev[t] < 0; h++) { const i = q[h], x = i % MW, y = (i / MW) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const j = (y + dy) * MW + x + dx; if (!wall(x + dx, y + dy) && prev[j] < 0 && (!block || !block.has(j) || j === t)) { prev[j] = i; q.push(j); } } }
      if (prev[t] < 0) return allowTraps ? [] : bfs(fx, fy, tx, ty, true);
      const p = []; for (let i = t; i !== s; i = prev[i]) p.push(center(i % MW, (i / MW) | 0)); return p.reverse();
    }
    const tileOf = (x, y) => [Math.floor(x / TS), Math.floor(y / TS)];
    function pathTo(g, x, y) { const [a, b] = tileOf(g.x, g.y), [c, d] = tileOf(x, y); g.path = bfs(a, b, c, d); }

    /* ───────── alarm ───────── */
    function raiseAlarm(x, y, src) {
      if (alarmT <= 0) { say(L.alarm, 2); sfx.alarm(); }
      alarmT = 14;
      for (const g of guards) if (g.alive && g !== src && Math.hypot(g.x - x, g.y - y) < 900) { g.state = 'alarm'; g.mem = { x, y }; pathTo(g, x, y); }
      fx('ring', x, y, { col: '#ff2b43' });
    }

    /* ───────── guard brain ───────── */
    function guardUpdate(g, dt) {
      if (!g.alive) return;
      if (g.stun > 0) { g.stun -= dt; g.ang += dt * 4; return; }
      const p = player, dp = Math.hypot(p.x - g.x, p.y - g.y);
      /* perception */
      const vis = p.alive && p.hidden <= 0 && sees(g, p.x, p.y);
      if (vis) {
        const rate = (1 / G.detect) * (1 + (1 - dp / coneRange()) * 1.4) * (p.run ? 1.3 : 1) * (1 - save.up.shadow * .15) * (alarmT > 0 ? 1.6 : 1);
        g.det = Math.min(1, g.det + dt * rate); g.mem = { x: p.x, y: p.y }; g.lost = 0;
        if (g.state === 'patrol' || g.state === 'pause' || g.state === 'look') { g.state = 'suspicious'; g.wait = .4; }
        if (g.det >= 1 && !g.spotted) { g.spotted = true; g.state = 'hunt'; raiseAlarm(p.x, p.y, g); }
      } else g.det = Math.max(0, g.det - dt * (g.spotted ? .15 : .35));
      /* hearing */
      if (p.noise > 0 && dp < p.noise && (g.state === 'patrol' || g.state === 'pause' || g.state === 'look')) { g.state = 'investigate'; g.mem = { x: p.x, y: p.y }; pathTo(g, p.x, p.y); fx('q', g.x, g.y - 46, { g }); }
      /* bodies */
      for (const c of corpses) if (!c.found && Math.hypot(c.x - g.x, c.y - g.y) < coneRange() && Math.abs(angDiff(g.ang, Math.atan2(c.y - g.y, c.x - g.x))) < coneAng() && los(g.x, g.y, c.x, c.y)) { c.found = true; raiseAlarm(c.x, c.y, null); g.state = 'alarm'; g.mem = { x: c.x, y: c.y }; pathTo(g, c.x, c.y); }
      /* movement per state */
      const walkTo = (sp) => {
        if (!g.path.length) return true;
        const n = g.path[0], dx = n.x - g.x, dy = n.y - g.y, d = Math.hypot(dx, dy);
        if (d < 4) { g.path.shift(); return !g.path.length; }
        const st = Math.min(d, sp * dt); g.x += dx / d * st; g.y += dy / d * st; g.walk += st * .12;
        g.ang += angDiff(g.ang, Math.atan2(dy, dx)) * Math.min(1, dt * 7);
        return false;
      };
      switch (g.state) {
        case 'patrol':
          if (!g.path.length) { const [gx, gy] = tileOf(g.hx, g.hy); for (let k = 0; k < 12; k++) { const tx = clamp(gx + Math.floor(rng() * 13) - 6, 1, MW - 2), ty = clamp(gy + Math.floor(rng() * 13) - 6, 1, MH - 2); if (!wall(tx, ty)) { pathTo(g, center(tx, ty).x, center(tx, ty).y); if (g.path.length > 1) break; } } if (!g.path.length) { g.state = 'look'; g.lookT = 2; g.look0 = g.ang; } }
          else if (walkTo(G.speed)) { g.state = 'pause'; g.wait = .6 + rng(); }
          break;
        case 'pause': g.wait -= dt; if (g.wait <= 0) { g.state = 'look'; g.lookT = 2.2; g.look0 = g.ang; } break;
        case 'look': g.lookT -= dt; g.ang = g.look0 + Math.sin((2.2 - g.lookT) * 2.4) * 1.1; if (g.lookT <= 0) { g.ang = g.look0 + Math.PI * (rng() < .5 ? .5 : -.5); g.state = 'patrol'; } break;
        case 'suspicious':
          if (g.mem) g.ang += angDiff(g.ang, Math.atan2(g.mem.y - g.y, g.mem.x - g.x)) * Math.min(1, dt * 5);
          g.wait -= dt; if (!vis && g.wait <= -1.2) { g.state = 'investigate'; pathTo(g, g.mem.x, g.mem.y); }
          if (g.det <= 0 && !vis) { g.state = 'look'; g.lookT = 1.6; g.look0 = g.ang; }
          break;
        case 'investigate': if (walkTo(G.speed * 1.1)) { g.state = 'look'; g.lookT = 2.6; g.look0 = g.ang; } break;
        case 'alarm':
          if (vis) { g.state = 'hunt'; break; }
          if (walkTo(G.speed * 1.9)) { g.state = 'look'; g.lookT = 3; g.look0 = g.ang; }
          break;
        case 'hunt':
          if (vis) { const dx = p.x - g.x, dy = p.y - g.y, d = Math.hypot(dx, dy) || 1, sp = G.speed * 2.1 * dt; if (los(g.x, g.y, p.x, p.y)) { const nx = g.x + dx / d * sp, ny = g.y + dy / d * sp; if (!wallAt(nx, ny)) { g.x = nx; g.y = ny; } g.walk += sp * .12; g.path = []; } g.ang = Math.atan2(dy, dx); }
          else { g.lost += dt; if (!g.path.length && g.mem) pathTo(g, g.mem.x, g.mem.y); walkTo(G.speed * 1.9); if (g.lost > 5) { g.state = 'look'; g.lookT = 3; g.look0 = g.ang; g.spotted = false; g.det = .4; } }
          if (vis && dp < 40 && mode === 'play') startDuel(g);
          break;
      }
    }

    /* ───────── player actions ───────── */
    function dash() { if (!player.alive || player.dashCd > 0 || mode !== 'play') return; player.dashCd = 2.2; player.dashT = .22; player.inv = .3; sfx.dash(); for (let i = 0; i < 10; i++) part('dust', player.x, player.y + 10, { vx: -Math.cos(player.ang) * 80 + (Math.random() - .5) * 60, vy: -Math.sin(player.ang) * 80 + (Math.random() - .5) * 60 }); }
    function smoke() {
      if (!player.alive || run.bombs <= 0 || mode !== 'play') return;
      run.bombs--; smokeClouds.push({ x: player.x, y: player.y, r: 0, max: 110, t: 4.5 }); player.hidden = 1.5;
      for (const g of guards) if (g.alive && Math.hypot(g.x - player.x, g.y - player.y) < 150) { g.stun = 2.2; g.det = 0; }
      for (let i = 0; i < 30; i++) part('smoke', player.x, player.y, { vx: (Math.random() - .5) * 140, vy: (Math.random() - .5) * 140 });
      sfx.dash();
    }
    function tryTakedown() {
      if (player.noTake > 0) return;
      for (const g of guards) {
        if (!g.alive || g.stun > 0 && false) continue;
        const d = Math.hypot(player.x - g.x, player.y - g.y); if (d > 40) continue;
        const rel = Math.abs(angDiff(g.ang, Math.atan2(player.y - g.y, player.x - g.x)));
        if (g.stun > 0 || rel > 1.75) return stealthKill(g, player.dashT > 0 ? pick(['drop', 'triple']) : pick(['tanto', 'wire', 'behead', 'behead']));
        if (rel > .95) return stealthKill(g, player.dashT > 0 ? pick(['drop', 'triple']) : pick(['iai', 'limbs', 'legs']));
        return startDuel(g);
      }
    }
    function killGuard(g, kind) {
      g.alive = false; corpses.push({ x: g.x, y: g.y, ang: g.ang, found: false, captain: g.captain, kind });
      bleed(g.x, g.y, 80, 340);
      decals.push({ x: g.x, y: g.y, r: 0, max: 30 + Math.random() * 16, seed: Math.random() * 1e9 });
      run.kills++; run.levelKills++; addMon(g.captain ? 30 : 10);
      if (g.captain) { player.hasKey = true; say(L.gotKey, 2.4); sfx.key(); }
    }
    function addMon(m) { run.mon += m; run.levelMon += m; save.mon += m; storeSave(save); }

    /* ───────── stealth kill cinematic ───────── */
    function stealthKill(g, kind) {
      mode = 'cine'; sfx.slash(); pad.hidden = true; input.stick = null;
      setTimeout(() => sfx.scream(170 + Math.random() * 40, .7, .45), 280);
      cine = { kind: 'kill', move: kind, g, t: 0, dur: 2.1, seed: Math.random() * 1e9, done: () => { killGuard(g, kind); player.inv = .6; mode = 'play'; } };
    }

    /* ───────── duel ───────── */
    const STANCES = ['jodan', 'chudan', 'iai'];
    const COUNTER = { jodan: 'katana', chudan: 'kusari', iai: 'shuriken' };
    function startDuel(g) {
      if (mode !== 'play') return;
      mode = 'duel'; sfx.gong(); pad.hidden = true; input.stick = null;
      duel = { g, wound: false, round: 1, rounds: g.captain ? 2 : 1, stance: pick(STANCES), t: 0, max: G.duelTime * (g.captain ? .9 : 1), phase: 'intro', pt: 0, choice: null, seed: Math.random() * 1e9 };
      updateDuelButtons();
    }
    function updateDuelButtons() {
      duelUI.hidden = !(duel && duel.phase === 'choose');
      duelUI.querySelector('[data-w=smoke]').disabled = run.bombs <= 0;
    }
    function duelChoose(w) {
      if (!duel || duel.phase !== 'choose') return;
      duel.choice = w; duel.phase = 'resolve'; duel.pt = 0; updateDuelButtons();
      if (w === 'smoke') { run.bombs--; sfx.dash(); return; }
      if (COUNTER[duel.stance] === w) { sfx.slash(); if (duel.round >= duel.rounds) setTimeout(() => sfx.scream(170, .8, .45), 300); } else { duel.wound = run.hp > 1; sfx.hit(); setTimeout(() => duel && duel.wound ? sfx.grunt() : sfx.scream(560, 1.4, .55), 250); }
    }
    function duelUpdate(dt) {
      duel.pt += dt;
      if (duel.phase === 'intro' && duel.pt > .75) { duel.phase = 'choose'; duel.pt = 0; duel.t = 0; updateDuelButtons(); }
      else if (duel.phase === 'choose') { duel.t += dt; if (duel.t >= duel.max) { duel.choice = null; duel.phase = 'resolve'; duel.pt = 0; duel.wound = run.hp > 1; updateDuelButtons(); sfx.hit(); setTimeout(() => duel && duel.wound ? sfx.grunt() : sfx.scream(560, 1.4, .55), 250); } }
      else if (duel.phase === 'resolve' && duel.pt > (duel.wound ? 1.25 : 1.9)) {
        const g = duel.g, ok = duel.choice && COUNTER[duel.stance] === duel.choice;
        if (duel.choice === 'smoke') { const a = Math.atan2(player.y - g.y, player.x - g.x); player.x += Math.cos(a) * 30; player.y += Math.sin(a) * 30; g.stun = 3; g.det = 0; g.spotted = false; g.state = 'look'; player.hidden = 2.5; player.noTake = 1.2; smokeClouds.push({ x: player.x, y: player.y, r: 0, max: 110, t: 4 }); duel = null; mode = 'play'; return; }
        if (ok && duel.round < duel.rounds) { duel.round++; duel.stance = pick(STANCES.filter(s => s !== duel.stance)); duel.phase = 'choose'; duel.t = 0; duel.choice = null; duel.pt = 0; updateDuelButtons(); sfx.gong(); return; }
        if (ok) { killGuard(g, duel.choice); duel = null; mode = 'play'; player.inv = 1; player.noTake = 1; alarmT = Math.max(alarmT, 6); return; }
        if (duel.wound) { run.hp--; cam.shake = .3; duel.wound = false; duel.stance = pick(STANCES.filter(s => s !== duel.stance)); duel.phase = 'choose'; duel.t = 0; duel.choice = null; duel.pt = 0; duel.max *= .92; updateDuelButtons(); sfx.gong(); return; }
        run.hp = 0; duel = null; player.inv = 0; mode = 'play'; die('duel');
      }
    }

    /* ───────── traps ───────── */
    /* every trap runs on its own clock – nothing waits for you to step on it */
    function trapPhase(tr) {
      const t = time + tr.ph;
      switch (tr.type) {
        case 'spikes': { const c = t % 2.6; return { on: c < 1, warn: c > 2.2 }; }
        case 'fire': { const c = t % 3.2; return { on: c > .15 && c < 1.3, warn: c < .15 || c > 2.85 }; }
        case 'gas': { const c = t % 5; return { on: c < 2.2, warn: c > 4.4 }; }
        case 'plate': { const c = t % 3; return { on: c < .28, warn: c > 2.4, k: c / .28 }; }
        case 'collapse': { const c = t % 6; return { on: c > 4.3, warn: c > 3.5 && c <= 4.3 }; }
        case 'wire': { const c = t % 2.8; let e = 0; if (c > 1.6 && c < 1.9) e = .06 + Math.sin(c * 90) * .03; else if (c >= 1.9 && c < 2.05) e = (c - 1.9) / .15; else if (c >= 2.05 && c < 2.4) e = 1; else if (c >= 2.4) e = 1 - (c - 2.4) / .4; return { on: e > .7, warn: c > 1.6 && c < 1.9, e }; }
      }
      return {};
    }
    function trapsUpdate(dt) {
      const [tx, ty] = tileOf(player.x, player.y), air = player.dashT > 0;
      let inGas = false;
      for (const tr of traps) {
        const here = tr.tx === tx && tr.ty === ty, c = center(tr.tx, tr.ty), st = trapPhase(tr);
        const along = tr.ax === 'h' ? player.x - c.x : player.y - c.y, across = tr.ax === 'h' ? player.y - c.y : player.x - c.x;
        switch (tr.type) {
          case 'spikes': if (here && st.on && !air) hurt('spikes'); break;
          case 'fire': if (st.on && rng() < .4) part('fire', c.x + (tr.ax === 'h' ? (rng() - .5) * 10 : -28 + rng() * 56), c.y + (tr.ax === 'h' ? -28 + rng() * 56 : (rng() - .5) * 10), {}); if (here && st.on) hurt('fire'); break;
          case 'gas': if (st.on && Math.hypot(player.x - c.x, player.y - c.y) < TS * .9) { inGas = true; player.gas = (player.gas || 0) + dt; if (player.gas > .9) { player.gas = 0; hurt('gas'); } } if (st.on && rng() < .3) part('gas', c.x, c.y, {}); break;
          case 'plate': if (here && st.on && Math.abs(along) < 20 && !air) hurt('darts'); break;
          case 'pendulum': tr.sw = Math.sin(time * 2.4 + tr.ph); if (here && Math.abs(along) < 14 && Math.abs(across - tr.sw * TS * .42) < 16) hurt('pendulum'); break;
          case 'saw': { tr.p = Math.sin(time * 1.7 + tr.ph) * TS * .38; const sx = tr.ax === 'h' ? c.x : c.x + tr.p, sy = tr.ax === 'h' ? c.y + tr.p : c.y; if (rng() < .3) part('spark', sx, sy, {}); if (Math.hypot(player.x - sx, player.y - sy) < 24) hurt('saw'); break; }
          case 'collapse': if (st.warn && rng() < .3) part('dust', c.x + (rng() - .5) * 40, c.y + (rng() - .5) * 40, {}); if (here && st.on && !air) hurt('pit'); break;
          case 'wire': if (here && st.on) hurt('crusher'); if (st.e > .95 && !tr.boom) { tr.boom = 1; for (let i = 0; i < 6; i++) part('dust', c.x + (rng() - .5) * 50, c.y + (rng() - .5) * 50, {}); } if (st.e < .5) tr.boom = 0; break;
        }
      }
      if (!inGas) player.gas = Math.max(0, (player.gas || 0) - dt);
    }
    /* traps and duel hits cost a heart; only the last heart kills */
    function hurt(cause) {
      if (player.inv > 0 || !player.alive || mode !== 'play') return;
      run.hp--; player.inv = 1.4; cam.shake = .35; sfx.grunt();
      bleed(player.x, player.y, 26, 260);
      decals.push({ x: player.x, y: player.y, r: 0, max: 18, seed: Math.random() * 1e9 });
      const a = player.ang + Math.PI; player.x += Math.cos(a) * 8; player.y += Math.sin(a) * 8;
      if (run.hp <= 0) die(cause);
    }
    function bleed(x, y, n, sp) { for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = (.3 + Math.random()) * sp; part('blood', x, y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v }); } }

    /* ───────── death / progress ───────── */
    function die(cause) {
      if (!player.alive || mode === 'over') return;
      sfx.scream(560, 1.5, .55); sfx.death(); cam.shake = .6;
      bleed(player.x, player.y, 60, 320);
      decals.push({ x: player.x, y: player.y, r: 0, max: 34, seed: Math.random() * 1e9 });
      if (run.lives > 0) {
        run.lives--; run.hp = run.maxHp; player.inv = 2.5; player.hidden = 2; player.noTake = 2.5; say(L.revive, 2.4);
        for (const g of guards) if (g.alive && Math.hypot(g.x - player.x, g.y - player.y) < 260) { g.stun = 2; g.det = 0; g.spotted = false; }
        mode = 'play'; return;
      }
      player.alive = false; player.deathCause = cause; mode = 'cine';
      cine = { kind: 'death', cause, t: 0, dur: 2, done: gameOver };
    }
    function gameOver() {
      mode = 'over'; duelUI.hidden = true;
      const best = save.best, newBest = run.door > best; if (newBest) { save.best = run.door; storeSave(save); }
      showScreen(`<h2>${L.dead}</h2><p>${L.causes[player.deathCause] || ''}</p><h3>${fmt(L.reached, { n: run.door, m: run.mon })}</h3>${newBest ? `<p style="color:#ffd23d;font-weight:800">${L.newBest}</p>` : `<p class="small">${L.best}: ${save.best}</p>`}<p style="color:#ff8a98">${L.resetNew}</p><div class="row"><button class="b" data-a="cont">${L.cont}</button></div><div class="row"><button class="b g" data-a="start">${L.fromStart}</button><button class="b g" data-a="ups">${L.upgrades}</button><button class="b g" data-a="menu">${L.menu}</button></div><p class="small">${L.seed}: ${run.seed}</p>`);
    }
    /* checkpoint: every gate is saved, so a run can go on from where it fell */
    function continueRun() {
      const c = save.cont || { seed: run && run.seed, door: run ? run.door : 1 };
      run = { seed: c.seed || 'A', door: c.door || 1, mon: 0, kills: 0, lives: save.up.life, bombs: 1 + save.up.bombs, hp: 3, maxHp: 3 };
      startDoor();
    }
    function levelClear() {
      mode = 'clear'; sfx.key(); addMon(25 + run.door * 5); run.hp = Math.min(run.maxHp, run.hp + 1);
      if (run.door + 1 > save.best) { save.best = run.door + 1; storeSave(save); }
      showScreen(`<h2>${fmt(L.clear, { n: run.door })}</h2><p>${fmt(L.clearInfo, { k: run.levelKills, m: run.levelMon })}</p><p class="small">${L.mon}: ${save.mon}</p><div class="row"><button class="b" data-a="next">${L.next}</button><button class="b g" data-a="ups">${L.upgrades}</button></div>`);
    }
    function newRun(seedStr) {
      run = { seed: seedStr || String(Math.floor(Math.random() * 1e9).toString(36)).toUpperCase(), door: 1, mon: 0, kills: 0, lives: save.up.life, bombs: 1 + save.up.bombs, hp: 3, maxHp: 3 };
      startDoor();
    }
    function startDoor() { save.cont = { seed: run.seed, door: run.door }; storeSave(save); buildLevel(run.door); mode = 'play'; hideScreen(); say(fmt(L.levelStart, { n: run.door }), 2.2); pad.hidden = !input.touch; }

    /* ───────── particles & fx ───────── */
    function part(type, x, y, o) {
      if (parts.length > 500) parts.shift();
      const base = { type, x, y, vx: o.vx || 0, vy: o.vy || 0, t: 0, life: 1 };
      if (type === 'blood') Object.assign(base, { life: .7 + Math.random() * .6, r: 2 + Math.random() * 3.5, stain: Math.random() < .35 });
      if (type === 'dust') Object.assign(base, { life: .6, r: 3 + Math.random() * 4, vx: base.vx || (Math.random() - .5) * 30, vy: base.vy || -10 - Math.random() * 20 });
      if (type === 'smoke') Object.assign(base, { life: 2.5 + Math.random(), r: 20 + Math.random() * 20 });
      if (type === 'fire') Object.assign(base, { life: .35, r: 6 + Math.random() * 7, vy: -20 });
      if (type === 'gas') Object.assign(base, { life: 1.6, r: 14 + Math.random() * 16, vx: (Math.random() - .5) * 40, vy: (Math.random() - .5) * 40 });
      if (type === 'breath') Object.assign(base, { life: .7, r: 4 });
      if (type === 'spark') Object.assign(base, { life: .25, r: 1.5, vx: (Math.random() - .5) * 300, vy: (Math.random() - .5) * 300 });
      parts.push(base);
    }
    const fxs = [];
    function fx(type, x, y, o) { fxs.push(Object.assign({ type, x, y, t: 0 }, o)); }
    function say(text, t) { msg = { text, t }; }

    /* ───────── update ───────── */
    function update(dt) {
      time += dt;
      if (mode === 'play' && input.touch && pad.hidden && scr.hidden) pad.hidden = false;
      if (mode === 'duel') { duelUpdate(dt); return; }
      if (mode === 'cine') { cine.t += dt; if (cine.t >= cine.dur) { const d = cine.done; cine = null; d(); } return; }
      if (mode !== 'play') return;
      const p = player;
      /* movement */
      let mx = (input.keys.KeyD || input.keys.ArrowRight ? 1 : 0) - (input.keys.KeyA || input.keys.ArrowLeft ? 1 : 0);
      let my = (input.keys.KeyS || input.keys.ArrowDown ? 1 : 0) - (input.keys.KeyW || input.keys.ArrowUp ? 1 : 0);
      let running = !!(input.keys.ShiftLeft || input.keys.ShiftRight);
      if (input.stick) { const dx = input.stick.x - input.stick.ox, dy = input.stick.y - input.stick.oy, d = Math.hypot(dx, dy); if (d > 6) { mx = dx / Math.max(d, 60); my = dy / Math.max(d, 60); running = d > 54; } }
      const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
      /* breath: running drains it fast, long walks drain it slowly, standing still refills it */
      const tired = p.stam < 30;
      if (p.stam <= 1) running = false;
      p.run = running && ml > .1;
      if (p.run) p.stam -= 22 * dt; else if (ml > .1) p.stam -= 4 * dt; else p.stam += 20 * dt;
      p.stam = clamp(p.stam, 0, 100);
      if (tired) { p.pantT -= dt; if (p.pantT <= 0) { p.pantIn = !p.pantIn; p.pantT = p.pantIn ? .42 : .36; sfx.pant(p.pantIn); if (!p.pantIn) part('breath', p.x + Math.cos(p.ang) * 16, p.y + Math.sin(p.ang) * 16, { vx: Math.cos(p.ang) * 30, vy: Math.sin(p.ang) * 30 }); } if (!p.saidTired) { p.saidTired = true; say(L.tired, 1.6); } } else if (p.stam > 60) p.saidTired = false;
      const sp = p.dashT > 0 ? 680 : p.run ? 240 : tired ? 115 : 140;
      if (ml > .1 || p.dashT > 0) {
        const ang = ml > .1 ? Math.atan2(my, mx) : p.ang; p.ang = ang;
        const vx = Math.cos(ang) * sp * dt * (p.dashT > 0 ? 1 : Math.min(1, ml)), vy = Math.sin(ang) * sp * dt * (p.dashT > 0 ? 1 : Math.min(1, ml));
        const r = 13;
        if (!wallAt(p.x + vx + Math.sign(vx) * r, p.y - r * .7) && !wallAt(p.x + vx + Math.sign(vx) * r, p.y + r * .7)) p.x += vx;
        if (!wallAt(p.x - r * .7, p.y + vy + Math.sign(vy) * r) && !wallAt(p.x + r * .7, p.y + vy + Math.sign(vy) * r)) p.y += vy;
        p.walk += Math.hypot(vx, vy) * .12;
        if (p.run && rng() < .25) part('dust', p.x, p.y + 12, {});
      }
      p.noise = p.run ? 230 * (1 - save.up.silence * .22) : tired ? 95 : 0;
      p.dashT = Math.max(0, p.dashT - dt); p.dashCd = Math.max(0, p.dashCd - dt); p.inv = Math.max(0, p.inv - dt); p.hidden = Math.max(0, p.hidden - dt); p.noTake = Math.max(0, (p.noTake || 0) - dt);
      /* scarf: a little rope that trails behind the neck */
      const sc = p.scarf; sc[0].x = p.x - Math.cos(p.ang) * 6; sc[0].y = p.y - Math.sin(p.ang) * 6;
      for (let i = 1; i < sc.length; i++) {
        const a = sc[i - 1], b = sc[i]; b.x += Math.sin(time * 6 + i) * .6; b.y += Math.cos(time * 5 + i * 1.3) * .6;
        b.x -= .35; b.y += .55;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, L0 = 7; b.x = a.x + dx / d * L0; b.y = a.y + dy / d * L0;
      }
      /* the rest */
      tryTakedown();
      if (mode !== 'play') return;
      trapsUpdate(dt);
      for (const g of guards) guardUpdate(g, dt);
      if (alarmT > 0) { alarmT -= dt; if (alarmT <= 0) { say(L.alarmOff, 1.6); for (const g of guards) if (g.alive && g.state === 'alarm') g.state = 'look'; } }
      for (const s of smokeClouds) { s.t -= dt; s.r = Math.min(s.max, s.r + dt * 300); }
      smokeClouds = smokeClouds.filter(s => s.t > 0);
      const [tx, ty] = tileOf(p.x, p.y);
      if (tx === exitT.tx && ty === exitT.ty) { if (p.hasKey) levelClear(); else if (!msg) say(L.locked, 1.8); }
    }
    function stepParticles(dt) {
      for (const q of parts) { q.t += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= .92; q.vy *= .92; }
      for (const q of parts) if (q.type === 'blood' && q.stain && q.t + dt >= q.life && decals.length < 400) decals.push({ x: q.x, y: q.y, r: q.r * 1.6, max: q.r * 1.6, dot: true });
      parts = parts.filter(q => q.t < q.life);
      for (const dcl of decals) if (dcl.max && dcl.r < dcl.max) dcl.r = Math.min(dcl.max, dcl.r + dt * 22);
      for (const f of fxs) f.t += dt;
      for (let i = fxs.length - 1; i >= 0; i--) if (fxs[i].t > 1.5) fxs.splice(i, 1);
      for (const m of mist) { m.x += m.v * dt; if (m.x > MW * TS + 200) m.x = -200; }
      if (msg && (msg.t -= dt) <= 0) msg = null;
      if (cam.shake > 0) cam.shake -= dt;
    }

    /* =================================================================================
       RENDER
       ================================================================================= */
    function resize() {
      const r = root.getBoundingClientRect(); DPR = Math.min(2, global.devicePixelRatio || 1);
      W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    const VIEW = 330;
    function viewPoly() {
      const pts = [], N = 220;
      for (let i = 0; i < N; i++) {
        const a = i / N * TAU, dx = Math.cos(a), dy = Math.sin(a); let r = 0;
        while (r < VIEW) { r += 4; const x = player.x + dx * r, y = player.y + dy * r; const tx = Math.floor(x / TS), ty = Math.floor(y / TS); if (tx >= 0 && ty >= 0 && tx < MW && ty < MH) seen[ty * MW + tx] = 1; if (wall(tx, ty)) { r += 12; break; } }
        pts.push(player.x + dx * Math.min(r, VIEW), player.y + dy * Math.min(r, VIEW));
      }
      return pts;
    }
    function drawFloor(x0, y0, x1, y1) {
      const a = Math.max(0, Math.floor(x0 / TS)), b = Math.max(0, Math.floor(y0 / TS)), c2 = Math.min(MW - 1, Math.ceil(x1 / TS)), d = Math.min(MH - 1, Math.ceil(y1 / TS));
      for (let ty = b; ty <= d; ty++) for (let tx = a; tx <= c2; tx++) {
        if (wall(tx, ty)) continue;
        const x = tx * TS, y = ty * TS, n = (tx * 7 + ty * 13) % 6;
        ctx.fillStyle = n === 0 ? '#1f1b1a' : '#1b1817'; ctx.fillRect(x, y, TS, TS);
        ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, TS - 1, TS - 1);
        ctx.fillStyle = 'rgba(255,240,220,.025)'; ctx.fillRect(x + 3, y + 3, TS / 2 - 4, TS / 2 - 4); ctx.fillRect(x + TS / 2 + 1, y + TS / 2 + 1, TS / 2 - 4, TS / 2 - 4);
        if (n === 4) { ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.moveTo(x + 8, y + 40); ctx.lineTo(x + 22, y + 32); ctx.lineTo(x + 30, y + 46); ctx.stroke(); }
      }
      /* exit torii */
      const e = center(exitT.tx, exitT.ty);
      if (e.x > x0 - TS && e.x < x1 + TS && e.y > y0 - TS && e.y < y1 + TS) {
        ctx.save(); ctx.translate(e.x, e.y);
        ctx.globalCompositeOperation = 'lighter'; const gl = ctx.createRadialGradient(0, 0, 4, 0, 0, 80); gl.addColorStop(0, player.hasKey ? 'rgba(255,40,60,.55)' : 'rgba(150,140,170,.22)'); gl.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gl; ctx.fillRect(-80, -80, 160, 160); ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#b30f22'; ctx.fillRect(-24, -26, 7, 44); ctx.fillRect(17, -26, 7, 44); ctx.fillRect(-32, -32, 64, 7); ctx.fillRect(-27, -20, 54, 5);
        ctx.fillStyle = '#0d0b0c'; ctx.fillRect(-34, -36, 68, 4);
        if (!player.hasKey) { ctx.fillStyle = '#d6a93a'; ctx.font = '700 16px system-ui'; ctx.textAlign = 'center'; ctx.fillText('🔒', 0, 10); }
        ctx.restore();
      }
      /* blood decals */
      for (const dcl of decals) { if (dcl.x < x0 - 60 || dcl.x > x1 + 60 || dcl.y < y0 - 60 || dcl.y > y1 + 60) continue; if (dcl.dot) { ctx.fillStyle = 'rgba(120,4,20,.85)'; ctx.beginPath(); ctx.arc(dcl.x, dcl.y, dcl.r, 0, TAU); ctx.fill(); continue; } if (dcl.r < 1) continue; ctx.globalAlpha = .9; splatter(ctx, dcl.x, dcl.y, 18, dcl.r * 1.3, dcl.seed, 1); ctx.fillStyle = '#6a0312'; ctx.beginPath(); ctx.ellipse(dcl.x, dcl.y, dcl.r, dcl.r * .7, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#8a0418'; ctx.beginPath(); ctx.ellipse(dcl.x - dcl.r * .2, dcl.y - dcl.r * .1, dcl.r * .55, dcl.r * .35, 0, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    }
    function drawWallRow(ty, x0, x1) {
      if (ty < 0 || ty >= MH) return;
      const a = Math.max(0, Math.floor(x0 / TS)), b = Math.min(MW - 1, Math.ceil(x1 / TS)), Hh = 20;
      for (let tx = a; tx <= b; tx++) {
        if (!wall(tx, ty)) continue;
        const x = tx * TS, y = ty * TS;
        if (!wall(tx, ty + 1)) { ctx.fillStyle = '#100e10'; ctx.fillRect(x, y + TS - Hh, TS, Hh); ctx.fillStyle = '#3a1210'; ctx.fillRect(x, y + TS - Hh, TS, 3); ctx.fillStyle = 'rgba(255,255,255,.03)'; ctx.fillRect(x + 6, y + TS - Hh + 8, TS - 12, 2); }
        /* roof tiles seen from above: ridges along the wall */
        ctx.fillStyle = '#2a2730'; ctx.fillRect(x, y - Hh, TS, TS);
        const horiz = !wall(tx, ty - 1) || !wall(tx, ty + 1);
        ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = 2; ctx.beginPath();
        if (horiz) for (let k = 4; k < TS; k += 8) { ctx.moveTo(x + k, y - Hh + 2); ctx.lineTo(x + k, y - Hh + TS - 2); } else for (let k = 4; k < TS; k += 8) { ctx.moveTo(x + 2, y - Hh + k); ctx.lineTo(x + TS - 2, y - Hh + k); }
        ctx.stroke();
        ctx.fillStyle = 'rgba(200,190,230,.07)'; ctx.fillRect(x, y - Hh, TS, 3);
        ctx.strokeStyle = '#0a090b'; ctx.lineWidth = 1.5; ctx.strokeRect(x + .5, y - Hh + .5, TS - 1, TS - 1);
      }
    }
    function drawTrap(tr) {
      const c = center(tr.tx, tr.ty), st = trapPhase(tr), h = tr.ax === 'h';
      ctx.save(); ctx.translate(c.x, c.y);
      switch (tr.type) {
        case 'spikes':
          ctx.fillStyle = '#100e0f'; ctx.fillRect(-26, -26, 52, 52); ctx.strokeStyle = st.warn ? '#ff2b43' : '#2b2729'; ctx.lineWidth = 2; ctx.strokeRect(-26, -26, 52, 52);
          for (let i = 0; i < 9; i++) { const x = -17 + (i % 3) * 17, y = -17 + Math.floor(i / 3) * 17; if (st.on) { ctx.fillStyle = '#c9ced8'; ctx.beginPath(); ctx.moveTo(x - 5, y + 6); ctx.lineTo(x, y - 10); ctx.lineTo(x + 5, y + 6); ctx.fill(); ctx.fillStyle = '#9b0b1d'; ctx.fillRect(x - 1, y - 10, 2, 4); } else { ctx.fillStyle = st.warn ? '#ff2b43' : '#2b2729'; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill(); } }
          break;
        case 'plate': {
          /* dart wall: holes on both walls glow, then a volley crosses the corridor */
          ctx.fillStyle = '#3a3438';
          const holes = [-14, 0, 14];
          for (const o of holes) { if (h) { ctx.fillRect(o - 3, -32, 6, 6); ctx.fillRect(o - 3, 26, 6, 6); } else { ctx.fillRect(-32, o - 3, 6, 6); ctx.fillRect(26, o - 3, 6, 6); } }
          if (st.warn) { ctx.fillStyle = '#ff2b43'; for (const o of holes) { ctx.beginPath(); if (h) ctx.arc(o, -29, 2.5, 0, TAU); else ctx.arc(-29, o, 2.5, 0, TAU); ctx.fill(); } }
          if (st.on) { const k = st.k; ctx.strokeStyle = '#e5e8ee'; ctx.lineWidth = 2; for (const o of holes) { ctx.beginPath(); if (h) { ctx.moveTo(o, -30 + k * 60); ctx.lineTo(o, -18 + k * 60); } else { ctx.moveTo(-30 + k * 60, o); ctx.lineTo(-18 + k * 60, o); } ctx.stroke(); } }
          break; }
        case 'pendulum': {
          const off = (tr.sw || 0) * TS * .42;
          ctx.strokeStyle = '#4a4448'; ctx.lineWidth = 2; ctx.beginPath(); if (h) { ctx.moveTo(0, -40); ctx.lineTo(0, off); } else { ctx.moveTo(-40, 0); ctx.lineTo(off, 0); } ctx.stroke();
          ctx.translate(h ? 0 : off, h ? off : 0); ctx.rotate(h ? 0 : Math.PI / 2);
          ctx.fillStyle = '#d4d9e2'; ctx.beginPath(); ctx.moveTo(-27, 0); ctx.quadraticCurveTo(0, 15, 27, 0); ctx.lineTo(0, -4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#9b0b1d'; ctx.lineWidth = 2; ctx.stroke();
          break; }
        case 'fire': { const nz = h ? [0, -30] : [-30, 0]; ctx.fillStyle = '#3a3438'; ctx.fillRect(nz[0] - 7, nz[1] - 7, 14, 14); if (st.warn) { ctx.fillStyle = 'rgba(255,120,40,.6)'; ctx.beginPath(); ctx.arc(nz[0], nz[1], 4, 0, TAU); ctx.fill(); } break; }
        case 'saw': {
          ctx.strokeStyle = '#3a3438'; ctx.lineWidth = 5; ctx.beginPath(); if (h) { ctx.moveTo(0, -28); ctx.lineTo(0, 28); } else { ctx.moveTo(-28, 0); ctx.lineTo(28, 0); } ctx.stroke();
          ctx.translate(h ? 0 : (tr.p || 0), h ? (tr.p || 0) : 0); ctx.rotate(time * 14);
          ctx.fillStyle = '#c9ced8'; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 13 : 19; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.fillStyle = '#9b0b1d'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, TAU); ctx.fill();
          break; }
        case 'collapse':
          if (st.on) { ctx.fillStyle = '#000'; ctx.fillRect(-31, -31, 62, 62); ctx.strokeStyle = '#3a0a10'; ctx.lineWidth = 3; ctx.strokeRect(-31, -31, 62, 62); }
          else { ctx.strokeStyle = st.warn ? '#ff2b43' : 'rgba(0,0,0,.65)'; ctx.lineWidth = st.warn ? 2.5 : 1.6; ctx.beginPath(); ctx.moveTo(-22, -10); ctx.lineTo(-4, -2); ctx.lineTo(4, 14); ctx.moveTo(-4, -2); ctx.lineTo(18, -16); ctx.moveTo(4, 14); ctx.lineTo(22, 20); ctx.stroke(); }
          break;
        case 'wire': {
          /* stone crusher: a block slams out of the wall across the corridor */
          const e = st.e || 0, len = 58 * e + 6;
          ctx.save(); if (!h) ctx.rotate(-Math.PI / 2);
          ctx.fillStyle = '#121014'; ctx.fillRect(-28, -34, 56, 6);
          ctx.fillStyle = st.warn ? '#5a2a2a' : '#4a4450'; ctx.fillRect(-26, -32, 52, len);
          ctx.strokeStyle = '#0d0b0c'; ctx.lineWidth = 2; ctx.strokeRect(-26, -32, 52, len);
          ctx.strokeStyle = 'rgba(0,0,0,.35)'; for (let k = 8; k < len; k += 12) { ctx.beginPath(); ctx.moveTo(-26, -32 + k); ctx.lineTo(26, -32 + k); ctx.stroke(); }
          ctx.fillStyle = '#9b0b1d'; ctx.fillRect(-26, -32 + len - 4, 52, 4);
          ctx.restore();
          break; }
        case 'gas':
          ctx.fillStyle = '#1e2219'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = st.warn ? '#9be04a' : '#3a4a2a'; ctx.lineWidth = 1.5; for (let i = -6; i <= 6; i += 4) { ctx.beginPath(); ctx.moveTo(i, -7); ctx.lineTo(i, 7); ctx.stroke(); }
          break;
      }
      ctx.restore();
    }
    /* top-down ninja: straw hat, black robe, katana on the back, the red scarf */
    function drawNinja(p) {
      const sc = p.scarf;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (const [w, col] of [[11, '#3a3640'], [7.5, '#08070a']]) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(sc[0].x, sc[0].y); for (let i = 1; i < sc.length; i++) ctx.lineTo(sc[i].x, sc[i].y); ctx.stroke(); }
      ctx.strokeStyle = '#1a181e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sc[1].x, sc[1].y); for (let i = 2; i < sc.length - 1; i++) ctx.lineTo(sc[i].x + Math.sin(time * 8 + i) * 3, sc[i].y + Math.cos(time * 8 + i) * 3); ctx.stroke();
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.ang);
      const sw = Math.sin(p.walk) * 5;
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(3, 4, 20, 16, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#0d0b0c'; ctx.beginPath(); ctx.ellipse(-2 + sw, -9, 7, 4.5, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-2 - sw, 9, 7, 4.5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#121014'; ctx.beginPath(); ctx.ellipse(-1, 0, 11, 17, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#2a2426'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(10, 14); ctx.stroke();
      ctx.strokeStyle = '#121014'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(2, -13); ctx.lineTo(13, -6); ctx.moveTo(2, 13); ctx.lineTo(13, 6); ctx.stroke();
      ctx.strokeStyle = '#e8ecf3'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(13, 4); ctx.lineTo(32, 6); ctx.stroke();
      /* straw hat from above */
      ctx.fillStyle = '#b9a276'; ctx.beginPath(); ctx.arc(1, 0, 15.5, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(40,28,18,.55)'; ctx.lineWidth = 1; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(1, 0); ctx.lineTo(1 + Math.cos(a) * 15, Math.sin(a) * 15); ctx.stroke(); }
      ctx.strokeStyle = '#0d0b0c'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(1, 0, 15.5, 0, TAU); ctx.stroke();
      ctx.fillStyle = '#6a5636'; ctx.beginPath(); ctx.arc(1, 0, 3, 0, TAU); ctx.fill();
      ctx.restore();
      if (p.inv > 0 && Math.floor(time * 12) % 2) { ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, TAU); ctx.stroke(); }
    }
    function drawGuard(g) {
      ctx.save(); ctx.translate(g.x, g.y); ctx.rotate(g.ang);
      const sw = Math.sin(g.walk) * 5, robe = g.captain ? '#5a1a24' : '#2e3646', robe2 = g.captain ? '#3a0f16' : '#1e2430';
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(3, 4, 20, 16, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#16141a'; ctx.beginPath(); ctx.ellipse(-2 + sw, -9, 7, 4.5, 0, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.ellipse(-2 - sw, 9, 7, 4.5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = robe; ctx.beginPath(); ctx.ellipse(-1, 0, 12, 19, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = robe2; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = robe2; ctx.fillRect(-12, -3, 8, 6);
      ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, 12); ctx.lineTo(40, 10); ctx.stroke();
      ctx.fillStyle = '#d4d9e2'; ctx.beginPath(); ctx.moveTo(40, 6); ctx.lineTo(52, 10); ctx.lineTo(40, 14); ctx.fill();
      ctx.strokeStyle = robe; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(2, 14); ctx.lineTo(12, 11); ctx.moveTo(2, -12); ctx.lineTo(10, 6); ctx.stroke();
      if (g.captain) { ctx.fillStyle = '#2a1a14'; ctx.beginPath(); ctx.arc(1, 0, 11, 0, TAU); ctx.fill(); ctx.strokeStyle = '#d6a93a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(4, 0); ctx.quadraticCurveTo(14, -12, 8, -18); ctx.moveTo(4, 0); ctx.quadraticCurveTo(14, 12, 8, 18); ctx.stroke(); }
      else { ctx.fillStyle = '#e1c8a0'; ctx.beginPath(); ctx.arc(1, 0, 9.5, 0, TAU); ctx.fill(); ctx.fillStyle = '#121014'; ctx.beginPath(); ctx.arc(0, 0, 9.5, Math.PI * .55, Math.PI * 1.45); ctx.fill(); ctx.fillRect(-12, -2, 6, 4); }
      ctx.restore();
      if (g.stun > 0) { ctx.fillStyle = '#ffd23d'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText('✦ ✦', g.x, g.y - 30); }
      if (g.det > .02 || g.state === 'hunt') {
        const k = g.state === 'hunt' ? 1 : g.det;
        ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(g.x - 17, g.y - 40, 34, 6);
        ctx.fillStyle = k > .65 ? '#ff2b43' : '#ffc23d'; ctx.fillRect(g.x - 17, g.y - 40, 34 * k, 6);
        ctx.font = '900 18px "Chakra Petch",system-ui'; ctx.textAlign = 'center'; ctx.fillText(k >= 1 ? '!' : '?', g.x, g.y - 45);
      }
    }
    function drawCorpse(c) {
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.ang + .9);
      ctx.fillStyle = c.captain ? '#4a1620' : '#262c38'; ctx.beginPath(); ctx.ellipse(0, 0, 10, 20, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#121014'; ctx.beginPath(); ctx.arc(0, -20, 8, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#5a3a1e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(14, -16); ctx.lineTo(30, 26); ctx.stroke();
      ctx.restore();
    }
    function drawCone(g) {
      if (!g.alive || g.stun > 0) return;
      const N = 26, R0 = coneRange(), A = coneAng();
      ctx.beginPath(); ctx.moveTo(g.x, g.y);
      for (let i = 0; i <= N; i++) { const a = g.ang - A + i / N * A * 2; let r = 0; while (r < R0) { r += 8; if (wallAt(g.x + Math.cos(a) * r, g.y + Math.sin(a) * r)) break; } ctx.lineTo(g.x + Math.cos(a) * r, g.y + Math.sin(a) * r); }
      ctx.closePath();
      const hot = g.state === 'hunt' || g.det > .5, warm = g.det > .02 || g.state === 'investigate' || g.state === 'alarm' || g.state === 'suspicious';
      const col = hot ? '255,43,67' : warm ? '255,194,61' : '235,225,205';
      const gr = ctx.createRadialGradient(g.x, g.y, 8, g.x, g.y, R0); gr.addColorStop(0, `rgba(${col},${hot ? .38 : .22})`); gr.addColorStop(1, `rgba(${col},.02)`);
      ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = `rgba(${col},${hot ? .7 : .3})`; ctx.lineWidth = 1.4; ctx.stroke();
    }
    function drawParticles(front) {
      for (const q of parts) {
        const k = q.t / q.life;
        if (q.type === 'blood') { ctx.fillStyle = `rgba(190,8,30,${1 - k})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, TAU); ctx.fill(); }
        else if (q.type === 'dust') { ctx.fillStyle = `rgba(160,150,140,${.35 * (1 - k)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + k), 0, TAU); ctx.fill(); }
        else if (q.type === 'smoke') { ctx.fillStyle = `rgba(140,138,150,${.3 * (1 - k)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + k * 1.5), 0, TAU); ctx.fill(); }
        else if (q.type === 'gas') { ctx.fillStyle = `rgba(140,210,70,${.25 * (1 - k)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + k), 0, TAU); ctx.fill(); }
        else if (q.type === 'fire') { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(255,${140 - k * 80},40,${.7 * (1 - k)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 - k * .5), 0, TAU); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; }
        else if (q.type === 'breath') { ctx.fillStyle = `rgba(220,225,235,${.35 * (1 - k)})`; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + k * 2), 0, TAU); ctx.fill(); }
        else if (q.type === 'spark') { ctx.fillStyle = `rgba(255,220,150,${1 - k})`; ctx.fillRect(q.x, q.y, 2, 2); }
      }
      for (const s of smokeClouds) { const a = Math.min(1, s.t / 1.5); for (let i = 0; i < 8; i++) { const an = i / 8 * TAU + time * .3; ctx.fillStyle = `rgba(120,118,130,${.09 * a})`; ctx.beginPath(); ctx.arc(s.x + Math.cos(an) * s.r * .45, s.y + Math.sin(an) * s.r * .45, s.r * .55, 0, TAU); ctx.fill(); } }
    }
    function drawWorld() {
      const z = cam.z, tx = player.x, ty = player.y;
      cam.x += (tx - cam.x) * .14; cam.y += (ty - cam.y) * .14;
      const s = clamp(Math.sqrt(W * H) / 600, .7, 1.45) * z;
      const shx = cam.shake > 0 ? (Math.random() - .5) * 14 * cam.shake : 0, shy = cam.shake > 0 ? (Math.random() - .5) * 14 * cam.shake : 0;
      ctx.save(); ctx.translate(W / 2 + shx, H / 2 + shy); ctx.scale(s, s); ctx.translate(-cam.x, -cam.y);
      const x0 = cam.x - W / 2 / s, y0 = cam.y - H / 2 / s, x1 = cam.x + W / 2 / s, y1 = cam.y + H / 2 / s;
      ctx.fillStyle = '#07060a'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      drawFloor(x0, y0, x1, y1);
      const poly = viewPoly();
      const visible = (x, y) => Math.hypot(x - player.x, y - player.y) < VIEW + 10 && los(player.x, player.y, x, y);
      for (const tr of traps) { const c = center(tr.tx, tr.ty); if (Math.hypot(c.x - player.x, c.y - player.y) < VIEW + 40) drawTrap(tr); }
      /* lantern light */
      ctx.globalCompositeOperation = 'lighter';
      for (const l of lanterns) { if (l.x < x0 - 200 || l.x > x1 + 200 || l.y < y0 - 200 || l.y > y1 + 200) continue; const f = .85 + Math.sin(time * 6 + l.f) * .08; const g = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, 140); g.addColorStop(0, `rgba(255,140,60,${.24 * f})`); g.addColorStop(1, 'rgba(255,140,60,0)'); ctx.fillStyle = g; ctx.fillRect(l.x - 140, l.y - 140, 280, 280); }
      ctx.globalCompositeOperation = 'source-over';
      for (const g of guards) if (g.alive && visible(g.x, g.y)) drawCone(g);
      /* depth-sorted figures and wall rows */
      const figs = [];
      for (const c of corpses) if (seen[Math.floor(c.y / TS) * MW + Math.floor(c.x / TS)]) figs.push({ y: c.y - 10, f: () => drawCorpse(c) });
      for (const g of guards) if (g.alive && visible(g.x, g.y)) figs.push({ y: g.y, f: () => drawGuard(g) });
      if (player.alive) figs.push({ y: player.y + .1, f: () => drawNinja(player) });
      for (const l of lanterns) if (l.x > x0 - 40 && l.x < x1 + 40 && l.y > y0 - 40 && l.y < y1 + 40) figs.push({ y: l.y - 20, f: () => { ctx.fillStyle = '#121014'; ctx.fillRect(l.x - 2, l.y - 34, 4, 34); ctx.fillStyle = `rgba(220,60,40,${.85 + Math.sin(time * 6 + l.f) * .1})`; ctx.beginPath(); ctx.ellipse(l.x, l.y - 38, 9, 12, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#121014'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = '#121014'; ctx.fillRect(l.x - 6, l.y - 51, 12, 3); } });
      figs.sort((a, b) => a.y - b.y);
      const r0 = Math.max(0, Math.floor(y0 / TS) - 1), r1 = Math.min(MH - 1, Math.ceil(y1 / TS) + 1); let fi = 0;
      for (let ry = r0; ry <= r1; ry++) { while (fi < figs.length && figs[fi].y < ry * TS + TS * .2) figs[fi++].f(); drawWallRow(ry, x0, x1); }
      while (fi < figs.length) figs[fi++].f();
      drawParticles();
      for (const f of fxs) {
        if (f.type === 'q' && f.g.alive && visible(f.g.x, f.g.y) && f.t < 1) { ctx.fillStyle = '#ffc23d'; ctx.font = '900 20px "Chakra Petch"'; ctx.textAlign = 'center'; ctx.fillText('?', f.g.x, f.g.y - 50 - f.t * 10); }
        else if (f.type === 'ring' && f.t < 1) { ctx.strokeStyle = `rgba(255,43,67,${1 - f.t})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 20 + f.t * 220, 0, TAU); ctx.stroke(); }
        else if (f.type === 'bell' && f.t < 1.4) { ctx.strokeStyle = `rgba(255,210,60,${1 - f.t / 1.4})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 30 + f.t * 160, 0, TAU); ctx.stroke(); }
      }
      if (player.run) { ctx.strokeStyle = 'rgba(255,194,61,.22)'; ctx.setLineDash([6, 9]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(player.x, player.y, player.noise, 0, TAU); ctx.stroke(); ctx.setLineDash([]); }
      /* darkness outside the line of sight */
      ctx.beginPath(); ctx.rect(x0 - 50, y0 - 50, x1 - x0 + 100, y1 - y0 + 100); ctx.moveTo(poly[0], poly[1]); for (let i = 2; i < poly.length; i += 2) ctx.lineTo(poly[i], poly[i + 1]); ctx.closePath();
      ctx.fillStyle = 'rgba(3,2,6,.82)'; ctx.fill('evenodd');
      const vg = ctx.createRadialGradient(player.x, player.y, VIEW * .45, player.x, player.y, VIEW); vg.addColorStop(0, 'rgba(3,2,6,0)'); vg.addColorStop(1, 'rgba(3,2,6,.7)'); ctx.fillStyle = vg; ctx.fillRect(player.x - VIEW, player.y - VIEW, VIEW * 2, VIEW * 2);
      for (const m of mist) { if (m.x < x0 - m.r || m.x > x1 + m.r || m.y < y0 - m.r || m.y > y1 + m.r) continue; const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r); g.addColorStop(0, 'rgba(120,120,150,.07)'); g.addColorStop(1, 'rgba(120,120,150,0)'); ctx.fillStyle = g; ctx.fillRect(m.x - m.r, m.y - m.r, m.r * 2, m.r * 2); }
      ctx.restore();
    }
    function drawHUD() {
      const pill = (x, y, t, col) => { ctx.font = '700 14px "Chakra Petch",system-ui'; const w = ctx.measureText(t).width + 18; ctx.fillStyle = 'rgba(8,6,9,.82)'; ctx.fillRect(x, y, w, 26); ctx.fillStyle = col || '#f1e9dc'; ctx.textAlign = 'left'; ctx.fillText(t, x + 9, y + 18); return w + 6; };
      let x = 10;
      x += pill(x, 10, `${L.door} ${run.door}`, '#ff4d63');
      x += pill(x, 10, `${L.mon} ${save.mon}`, '#ffd23d');
      x += pill(x, 10, player.hasKey ? '🗝 ✓' : '🗝 —', player.hasKey ? '#ffd23d' : '#7a7078');
      let y2 = 42, x2 = 10;
      x2 += pill(x2, y2, Array.from({ length: run.maxHp }, (_, i) => i < run.hp ? '♥' : '♡').join(' '), '#ff4d63');
      x2 += pill(x2, y2, `💨 ${run.bombs}`);
      if (run.lives > 0) x2 += pill(x2, y2, `♥ ${run.lives}`, '#ff4d63');
      if (alarmT > 0) { const w = pill(x2, y2, `⚠ ${Math.ceil(alarmT)}`, '#ff2b43'); x2 += w; }
      /* explored map */
      const S = Math.min(120, W * .22, H * .28), mx = W - S - 10, my = 58, k = S / (MW * TS);
      ctx.fillStyle = 'rgba(8,6,9,.85)'; ctx.fillRect(mx, my, S, S);
      for (let ty = 0; ty < MH; ty++) for (let tx = 0; tx < MW; tx++) { if (!seen[ty * MW + tx]) continue; ctx.fillStyle = wall(tx, ty) ? '#4a4450' : '#1c191c'; ctx.fillRect(mx + tx * TS * k, my + ty * TS * k, TS * k + .5, TS * k + .5); }
      if (seen[exitT.ty * MW + exitT.tx]) { ctx.fillStyle = '#ff2b43'; ctx.fillRect(mx + exitT.tx * TS * k - 1, my + exitT.ty * TS * k - 1, TS * k + 2, TS * k + 2); }
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx + player.x * k, my + player.y * k, 2.5, 0, TAU); ctx.fill();
      ctx.font = '600 11px "Chakra Petch"'; ctx.fillStyle = '#9a8f98'; ctx.textAlign = 'right'; ctx.fillText(`${L.best}: ${save.best} · ${L.seed} ${run.seed}`, W - 10, my + S + 14);
      /* bottom: stealth state + dash */
      ctx.textAlign = 'center'; ctx.font = '700 13px "Chakra Petch"';
      const by = H - (input.touch ? 20 : 26);
      ctx.fillStyle = 'rgba(8,6,9,.82)'; ctx.fillRect(W / 2 - 110, by - 30, 220, 39);
      ctx.fillStyle = '#2a2428'; ctx.fillRect(W / 2 - 100, by - 26, 200, 5); ctx.fillStyle = player.stam < 30 ? '#ff8a3d' : '#a8d4ff'; ctx.fillRect(W / 2 - 100, by - 26, 2 * player.stam, 5);
      ctx.fillStyle = player.run ? '#ffc23d' : '#a8d4ff'; ctx.fillText(player.run ? L.running : L.sneaking, W / 2 - 46, by);
      ctx.fillStyle = player.dashCd > 0 ? '#5a5258' : '#ff4d63'; ctx.fillText(`${L.dash} ${player.dashCd > 0 ? Math.ceil(player.dashCd) + 's' : '✓'}`, W / 2 + 60, by);
      if (!input.touch) { ctx.font = '600 11px "Chakra Petch"'; ctx.fillStyle = '#6e6670'; ctx.textAlign = 'left'; ctx.fillText(L.keys, 10, H - 8); }
      /* danger vignette */
      const danger = Math.max(0, ...guards.filter(g => g.alive).map(g => g.state === 'hunt' ? 1 : g.det));
      if (danger > .05) { const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .7); g.addColorStop(0, 'rgba(180,0,20,0)'); g.addColorStop(1, `rgba(180,0,20,${danger * .45})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      if ((player.gas || 0) > 0) { ctx.fillStyle = `rgba(120,200,60,${player.gas * .4})`; ctx.fillRect(0, 0, W, H); }
      if (msg) { ctx.font = '800 22px "Chakra Petch"'; ctx.textAlign = 'center'; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.strokeText(msg.text, W / 2, H * .3); ctx.fillStyle = '#fff'; ctx.fillText(msg.text, W / 2, H * .3); }
      if (input.stick) { const s = input.stick; ctx.beginPath(); ctx.arc(s.ox, s.oy, 60, 0, TAU); ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke(); let dx = s.x - s.ox, dy = s.y - s.oy; const d = Math.hypot(dx, dy); if (d > 60) { dx *= 60 / d; dy *= 60 / d; } ctx.beginPath(); ctx.arc(s.ox + dx, s.oy + dy, 22, 0, TAU); ctx.fillStyle = d > 54 ? 'rgba(255,194,61,.5)' : 'rgba(255,255,255,.3)'; ctx.fill(); }
    }

    /* ───────── cinematic: silent takedown (shadow play at night) ───────── */
    /* Silent takedowns: shadow play under the moon, red blood. Eight finishes. */
    function drawKillCine(cn) {
      const T0 = cn.t, k = cn.t / cn.dur, w = W, h = H, gy = h * .82, sc = Math.min(w / 900, h / 520) * 1.25, sd = cn.seed;
      const nx = w * .38, gx = w * .58, mv = cn.move;
      paper(ctx, w, h, T0, w * .72, h * .3, Math.min(w, h) * .2, true);
      ctx.fillStyle = '#03040c'; ctx.fillRect(0, gy, w, h - gy);
      const SIL = { ink: '#020206', skin: null, robe: '#020206', robe2: '#020206' };
      const G0 = Object.assign({}, SIL, { hat: 'topknot', face: -1, seed: 4, saya: true });
      const N0 = Object.assign({}, SIL, { hat: 'straw', scarf: true, scarfCol: '#020206', t: T0, seed: 9, bloodySword: k > .3 });
      const after = t0 => Math.max(0, T0 - t0);
      const fall = (t0, d) => ease(clamp((T0 - t0) / d, 0, 1));
      const flyPart = (P, part, ox, oy, t0, vx, vy, spin) => { const tt = after(t0); if (tt <= 0) return; const land = Math.min(tt, .9); const x = ox + vx * sc * land, y = Math.min(gy - 12 * sc, oy + vy * sc * land + 900 * sc * land * land); inkFigure(ctx, x, y, sc, Object.assign({}, P, { only: part, lean: spin * land })); };
      const flash = (x1, y1, x2, y2, t0, life) => slashStroke(ctx, x1, y1, x2, y2, clamp((T0 - t0) / .1, 0, 1) * (T0 < t0 + (life || .4) ? 1 : 0), 8 * sc, 'rgba(240,240,255,.92)');
      if (mv === 'behead') {
        /* from behind: one stroke, the head flies, the neck fountains, the body kneels and falls */
        const cutT = .45, gP = Object.assign({}, G0, { cut: after(cutT) > 0 ? { head: true } : null, crouch: fall(1.0, .4) * .9, lean: fall(1.4, .5) * 1.3, armF: .3, armB: .4 });
        const geo = figGeo(gP), neck = figPt(gx, gy, sc, gP, 4, geo.shY - 4), head0 = figPt(gx, gy, sc, G0, 4, figGeo(G0).headY);
        if (after(cutT) > 0) pool(ctx, gx, gy + 4 * sc, after(cutT) * .7, 120, sc);
        inkFigure(ctx, gx, gy, sc, gP);
        fountain(ctx, neck.x, neck.y, -Math.PI / 2 - .25 - fall(1.4, .5) * 1.2, after(cutT), 1.15, sd, sc, 1.4);
        flyPart(G0, 'head', head0.x, head0.y, cutT, -260, -520, -7);
        const step = ease(clamp(T0 / .4, 0, 1)), cut = after(cutT) > 0;
        inkFigure(ctx, lerp(nx - 120 * sc, gx - 110 * sc, step), gy, sc, Object.assign({}, N0, { crouch: .2, armF: cut ? -2.6 : -1.2, armF2: cut ? -2.9 : -1.4, swordF: cut ? -.3 : 1.2, armB: .5 }));
        flash(gx - 140 * sc, gy - 190 * sc, gx + 120 * sc, gy - 150 * sc, .35);
      } else if (mv === 'limbs') {
        /* from the side: two strokes, both arms fly, two fountains */
        const c1 = .4, c2 = .7;
        const gP = Object.assign({}, G0, { cut: { armF: after(c1) > 0, armB: after(c2) > 0 }, armF: -.9, armF2: -1.2, swordF: -.4, armB: .2, lean: fall(1.3, .5) * -1.35, crouch: fall(1.0, .3) * .3 });
        const geo = figGeo(gP), shF = figPt(gx, gy, sc, gP, 18, geo.shY + 4), shB = figPt(gx, gy, sc, gP, -16, geo.shY + 4);
        if (after(c1) > 0) pool(ctx, gx, gy + 4 * sc, after(c1) * .6, 130, sc);
        inkFigure(ctx, gx, gy, sc, gP);
        fountain(ctx, shF.x, shF.y, -Math.PI * .8, after(c1), 1, sd, sc, 1.3);
        fountain(ctx, shB.x, shB.y, -Math.PI * .25, after(c2), 1, sd + 1, sc, 1.2);
        flyPart(G0, 'armF', shF.x, shF.y, c1, -280, -380, 6);
        flyPart(G0, 'armB', shB.x, shB.y, c2, 220, -420, -5);
        const dashK = ease(clamp((T0 - .25) / .3, 0, 1));
        inkFigure(ctx, lerp(nx - 60 * sc, gx + 170 * sc, dashK), gy, sc, Object.assign({}, N0, { crouch: .55, lean: .3, armF: -1.7, armF2: -1.7, swordF: T0 > .55 ? -2.4 : 1.5, armB: .8 }));
        flash(gx - 150 * sc, gy - 170 * sc, gx + 150 * sc, gy - 150 * sc, .32);
        flash(gx + 150 * sc, gy - 200 * sc, gx - 150 * sc, gy - 120 * sc, .62);
      } else if (mv === 'legs') {
        /* low cut: the legs stay, the body drops and topples */
        const cutT = .42, cut = after(cutT) > 0, drop = fall(.5, .35);
        const gP = Object.assign({}, G0, { cut: cut ? { legs: true } : null, lean: fall(.9, .6) * .55, armF: -1.5 + fall(.9, .5) * 1.8, armF2: -1.8, armB: -1.2 });
        const hipY = figGeo(G0).hipY;
        if (cut) { inkFigure(ctx, gx, gy + hipY * sc, sc, Object.assign({}, G0, { only: 'legs', lean: 0 })); pool(ctx, gx, gy + 4 * sc, after(cutT) * .5, 140, sc); }
        inkFigure(ctx, gx - drop * 40 * sc, gy + (cut ? drop * (-hipY - 16) * sc : 0), sc, gP);
        if (cut) { const hp = figPt(gx, gy, sc, G0, 0, hipY); fountain(ctx, hp.x, hp.y, -Math.PI / 2 + .3, after(cutT), .9, sd, sc, 1.2); fountain(ctx, hp.x, hp.y, -Math.PI / 2 - .4, after(cutT) - .1, .8, sd + 3, sc, 1); }
        const dashK = ease(clamp((T0 - .2) / .3, 0, 1));
        inkFigure(ctx, lerp(nx - 80 * sc, gx + 160 * sc, dashK), gy, sc, Object.assign({}, N0, { crouch: .95, lean: .15, armF: -1.2, armF2: -1.0, swordF: 1.75, armB: .9 }));
        flash(gx - 180 * sc, gy - 70 * sc, gx + 180 * sc, gy - 80 * sc, .3);
      } else if (mv === 'triple') {
        /* three cuts in a heartbeat: the body comes apart in pieces */
        const cuts = [.35, .5, .65], ys = [gy - 175 * sc, gy - 120 * sc, gy - 60 * sc];
        cuts.forEach((c0, i) => flash(gx - 170 * sc, ys[i] + (i - 1) * 20 * sc, gx + 170 * sc, ys[i] - (i - 1) * 20 * sc, c0, .4));
        const split = after(.8);
        if (split > 0) pool(ctx, gx, gy + 4 * sc, split * .6, 150, sc);
        const bands = [[0, ys[0]], [ys[0], ys[1]], [ys[1], ys[2]], [ys[2], h]];
        bands.forEach(([t0, t1], i) => {
          ctx.save(); ctx.beginPath(); ctx.rect(0, t0, w, t1 - t0); ctx.clip();
          const dir = i % 2 ? 1 : -1, sl = Math.min(split, .8), pivotY = Math.min(t1, gy);
          ctx.translate(dir * sl * (30 + i * 12) * sc, i < 3 ? sl * sl * (220 - i * 60) * sc : 0);
          ctx.translate(gx, pivotY); ctx.rotate(dir * sl * .35 * (3 - i) / 3); ctx.translate(-gx, -pivotY);
          inkFigure(ctx, gx, gy, sc, Object.assign({}, G0, { armF: -.6, armB: .3 })); ctx.restore();
        });
        if (split > 0) ys.forEach((y, i) => fountain(ctx, gx + (i - 1) * 10 * sc, y, -Math.PI / 2 + (i - 1) * .5, split, .9, sd + i, sc, 1.1));
        const jump = Math.sin(clamp(T0 / .35, 0, 1) * Math.PI) * 120 * sc;
        inkFigure(ctx, lerp(nx - 180 * sc, gx + 190 * sc, ease(clamp(T0 / .7, 0, 1))), gy - jump, sc, Object.assign({}, N0, { crouch: .5, lean: .35, armF: -1.9, armF2: -1.6, swordF: T0 > .7 ? -2.5 : 1.6, armB: .6 }));
      } else if (mv === 'tanto' || mv === 'wire') {
        const step = ease(clamp(T0 / .5, 0, 1)), lift = mv === 'wire' ? Math.sin(clamp((T0 - .5) / .8, 0, 1) * Math.PI) * 30 : 0;
        const gP = Object.assign({}, G0, { lean: fall(1.3, .5) * (mv === 'wire' ? -1.3 : 1.35), armF: T0 > .5 ? -1.2 : .2, armB: T0 > .5 ? .9 : .2 });
        if (after(.6) > 0) pool(ctx, gx, gy + 4 * sc, after(.6) * .5, 110, sc);
        inkFigure(ctx, gx, gy - lift * sc, sc, gP);
        const neck = figPt(gx, gy - lift * sc, sc, gP, 4, figGeo(gP).shY - 2);
        fountain(ctx, neck.x, neck.y, mv === 'wire' ? -Math.PI * .85 : -Math.PI * .2, after(.6), .8, sd, sc, 1.3);
        inkFigure(ctx, lerp(nx - 120 * sc, gx - 70 * sc, step), gy, sc, Object.assign({}, N0, { crouch: .25, armF: -1.6, armF2: -1.4, armB: -1.1, swordF: mv === 'tanto' ? -1.2 : null, swordLen: 60 }));
        if (mv === 'wire' && T0 > .45 && T0 < 1.3) { ctx.strokeStyle = 'rgba(220,220,240,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx - 60 * sc, gy - 170 * sc); ctx.lineTo(gx - 10 * sc, gy - 168 * sc - lift * sc); ctx.stroke(); }
      } else if (mv === 'iai') {
        const draw_ = clamp((T0 - .3) / .2, 0, 1), split = fall(.65, .6), cutY = gy - 120 * sc;
        if (after(.6) > 0) pool(ctx, gx, gy + 4 * sc, after(.6) * .6, 140, sc);
        for (const half of [0, 1]) {
          ctx.save(); ctx.beginPath(); if (half) { ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, cutY - 40 * sc); ctx.lineTo(0, cutY + 40 * sc); } else { ctx.moveTo(0, cutY + 40 * sc); ctx.lineTo(w, cutY - 40 * sc); ctx.lineTo(w, h); ctx.lineTo(0, h); } ctx.closePath(); ctx.clip();
          if (half) { ctx.translate(split * 40 * sc, split * split * 160 * sc); ctx.translate(gx, cutY); ctx.rotate(split * .9); ctx.translate(-gx, -cutY); }
          inkFigure(ctx, gx, gy, sc, Object.assign({}, G0, { swordF: -.6, armF: -.8 })); ctx.restore();
        }
        if (after(.6) > 0) { fountain(ctx, gx, cutY, -Math.PI / 2 - .2, after(.6), 1.2, sd, sc, 1.4); fountain(ctx, gx + 20 * sc, cutY - 10 * sc, -.5, after(.7), .9, sd + 2, sc, 1); }
        inkFigure(ctx, lerp(nx, gx + 150 * sc, ease(draw_)), gy, sc, Object.assign({}, N0, { crouch: .55, lean: .25, armF: -1.7, armF2: -1.7, swordF: 1.5, armB: .8 }));
        slashStroke(ctx, gx - 200 * sc, cutY + 60 * sc, gx + 220 * sc, cutY - 60 * sc, clamp((T0 - .4) / .12, 0, 1) * (T0 < 1 ? 1 : 0), 10 * sc, 'rgba(240,240,255,.9)');
      } else {
        /* kunai drop from above */
        const land = T0 > .7, jump = clamp(T0 / .7, 0, 1);
        const gP = Object.assign({}, G0, { crouch: land ? fall(.7, .2) * .9 : 0, lean: fall(1.0, .5) * .9 });
        if (land) pool(ctx, gx, gy + 4 * sc, after(.7) * .6, 150, sc);
        inkFigure(ctx, gx, gy, sc, gP);
        const neck = figPt(gx, gy, sc, gP, 4, figGeo(gP).shY);
        if (land) { fountain(ctx, neck.x, neck.y, -Math.PI / 2 - .5, after(.7), 1.1, sd, sc, 1.3); fountain(ctx, neck.x, neck.y, -Math.PI / 2 + .6, after(.75), .9, sd + 1, sc, 1.1); }
        inkFigure(ctx, land ? gx - 40 * sc : lerp(nx - 200 * sc, gx - 40 * sc, jump), land ? gy : gy - Math.sin(jump * Math.PI) * 300 * sc, sc, Object.assign({}, N0, { crouch: .6, armF: -2.6, armF2: -2.8, swordF: 2.9, swordLen: 70 }));
      }
      ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(0, 0, w, h * .1); ctx.fillRect(0, h * .9, w, h * .1);
      brushTitle(ctx, L.kills[mv], w * .5, h * .18, Math.max(30, Math.min(64, w * .07)), k * 1.3, '#b30f22');
    }
    function guardPose(st, tension) {
      if (st === 'jodan') return { armF: -2.9, armF2: -2.6, armB: -2.6, armB2: -2.4, swordF: -.1, lean: -.05 - tension * .05 };
      if (st === 'chudan') return { armF: -1.3, armF2: -1.5, armB: -1.0, armB2: -1.4, swordF: 1.35, lean: .05 + tension * .05, crouch: .2 };
      return { armF: -.4, armF2: -1.2, armB: .1, armB2: -.6, swordF: null, saya: true, crouch: .45 + tension * .1, lean: .15 };
    }
    function drawDuel(d) {
      const w = W, h = H, btnH = Math.min(96, Math.max(58, h * .13)) + 40, gy = h - btnH - 8, top = h * .155 + 64, sc = Math.min(w / 820 * 1.25, (gy - top) / 250);
      paper(ctx, w, h, time, w * .62, h * .36, Math.min(w, h) * .27, false);
      inkGround(ctx, w, gy);
      const g = d.g, intro = d.phase === 'intro' ? ease(clamp(d.pt / .7, 0, 1)) : 1;
      const robe = g.captain ? '#4a1620' : '#2a3040';
      const gp = Object.assign({ hat: g.captain ? 'kabuto' : 'topknot', face: -1, robe, robe2: robe, sash: '#0d0b0c', seed: 21, skin: '#e2c79c' }, guardPose(d.stance, d.phase === 'choose' ? d.t / d.max : 0));
      const np = { hat: 'straw', scarf: true, t: time, seed: 9, robe: '#0d0b0c', crouch: .5, armF: -1.2, armF2: -.9, armB: .6, swordF: 1.1, mask: true, skin: '#e2c79c' };
      let gx = lerp(w + 200, w * .66, intro), nx = lerp(-200, w * .3, intro);
      const res = d.phase === 'resolve', ok = res && d.choice && COUNTER[d.stance] === d.choice, rk = res ? clamp(d.pt / 1.3, 0, 1) : 0;
      if (res && d.choice === 'smoke') {
        inkFigure(ctx, gx, gy, sc, gp);
        for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = rk * 220 * sc; ctx.fillStyle = `rgba(230,230,235,${.9 - rk * .5})`; ctx.beginPath(); ctx.arc(nx + Math.cos(a) * r * .6, gy - 110 * sc + Math.sin(a) * r * .4, (40 + rk * 60) * sc, 0, TAU); ctx.fill(); }
        brushTitle(ctx, L.weapons.smoke, w * .5, h * .16, Math.max(30, Math.min(64, w * .07)), rk);
      } else if (res && ok) {
        const pt = d.pt, strike = ease(clamp(rk / .3, 0, 1)), fallK = clamp((rk - .45) / .35, 0, 1), final = d.round >= d.rounds;
        const cutArm = d.choice === 'katana' && pt > .35, cutHead = d.choice === 'kusari' && pt > .7 && final;
        if (pt > .4 && final) pool(ctx, gx, gy + 4 * sc, (pt - .4) * .6, 150, sc);
        if (d.choice === 'shuriken') {
          for (let i = 0; i < 3; i++) { const s0 = clamp((rk - i * .08) / .25, 0, 1); if (s0 <= 0 || s0 >= 1) continue; const sx = lerp(nx + 60 * sc, gx, s0), sy = lerp(gy - 150 * sc, gy - (150 - i * 20) * sc, s0); ctx.save(); ctx.translate(sx, sy); ctx.rotate(time * 30); ctx.fillStyle = '#0d0b0c'; ctx.beginPath(); for (let j = 0; j < 8; j++) { const a = j / 8 * TAU, r = (j % 2 ? 6 : 18) * sc; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill(); ctx.restore(); }
          inkFigure(ctx, nx, gy, sc, Object.assign({}, np, { armF: -2.2, armF2: -1.6, swordF: null, lean: -.1, crouch: .3 }));
        } else if (d.choice === 'kusari') {
          const cx = lerp(nx, gx, Math.min(1, strike * 1.2));
          ctx.strokeStyle = '#0d0b0c'; ctx.lineWidth = 3 * sc; ctx.setLineDash([8 * sc, 5 * sc]); ctx.beginPath(); ctx.moveTo(nx + 30 * sc, gy - 150 * sc); ctx.quadraticCurveTo((nx + cx) / 2, gy - 220 * sc, cx, gy - (cutHead ? 230 : 180) * sc); ctx.stroke(); ctx.setLineDash([]);
          if (strike > .9 && !cutHead) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(gx, gy - (170 + i * 12) * sc, 22 * sc, 7 * sc, 0, 0, TAU); ctx.stroke(); }
          inkFigure(ctx, nx, gy, sc, Object.assign({}, np, { armF: -2, armF2: -2.2, swordF: null, armB: -1.2, lean: cutHead ? -.2 : 0 }));
        } else {
          nx = lerp(nx, gx + 150 * sc, strike);
          inkFigure(ctx, nx, gy, sc, Object.assign({}, np, { crouch: .2, armF: -3, armF2: -3.1, swordF: -.2, armB: -2.6, lean: -.15, bloodySword: pt > .4 }));
          slashStroke(ctx, gx - 120 * sc, gy - 30 * sc, gx + 60 * sc, gy - 320 * sc, clamp(rk / .25, 0, 1) * (pt < 1 ? 1 : 0), 14 * sc, '#0d0b0c');
        }
        const gP = Object.assign({}, gp, { cut: { armF: cutArm, head: cutHead }, swordF: fallK > .2 || cutArm ? null : gp.swordF, armF: fallK > .2 ? .4 : gp.armF, lean: final ? -fallK * 1.4 : -.1, crouch: final ? fallK * .4 : 0 });
        inkFigure(ctx, gx, gy, sc, gP);
        const g2 = figGeo(gP), g0 = figGeo(gp);
        if (cutArm) {
          const sh = figPt(gx, gy, sc, gP, 18, g2.shY + 4); fountain(ctx, sh.x, sh.y, -Math.PI * .6, pt - .35, 1.1, d.seed, sc, 1.5);
          const ap = figPt(gx, gy, sc, gp, 18, g0.shY + 4), tt = Math.min(pt - .35, .9);
          inkFigure(ctx, ap.x - 260 * sc * tt, Math.min(gy - 14 * sc, ap.y - 560 * sc * tt + 900 * sc * tt * tt), sc, Object.assign({}, gp, { only: 'armF', lean: -6 * tt, swordF: 1.2 }));
        }
        if (cutHead) {
          const nk = figPt(gx, gy, sc, gP, 4, g2.shY - 4); fountain(ctx, nk.x, nk.y, -Math.PI / 2 - .3, pt - .7, 1.2, d.seed + 5, sc, 1.3);
          const tt = Math.min(pt - .7, .9), hp0 = figPt(gx, gy, sc, gp, 4, g0.headY);
          inkFigure(ctx, lerp(hp0.x, nx + 80 * sc, Math.min(1, tt * 2)), Math.min(gy - 14 * sc, hp0.y - 300 * sc * tt + 700 * sc * tt * tt), sc, Object.assign({}, gp, { only: 'head', lean: -8 * tt }));
        }
        if (d.choice === 'shuriken' && pt > .35) [0, 1, 2].forEach(i => { const p0 = figPt(gx, gy, sc, gP, 0, g2.shY + 20 + i * 22); fountain(ctx, p0.x, p0.y, -Math.PI * .3 - i * .3, pt - .35 - i * .08, .6, d.seed + i, sc, .8); });
        if (rk > .3) splatter(ctx, gx, gy - 140 * sc, 40, 170 * sc, d.seed, clamp((rk - .3) * 3, 0, 1));
        brushTitle(ctx, L.weapons[d.choice], w * .5, h * .14, Math.max(30, Math.min(70, w * .08)), rk);
      } else if (res) {
        /* a hit on Kurenai: a wound if hearts are left, otherwise the end */
        const pt = d.pt, strike = ease(clamp(pt / .35, 0, 1));
        inkFigure(ctx, lerp(gx, nx + 80 * sc, strike * (d.wound ? .6 : 1)), gy, sc, Object.assign({}, gp, { armF: .9, armF2: 1.2, swordF: 1.9, saya: false, lean: .2, bloodySword: pt > .35 }));
        if (d.wound) {
          const st = clamp((pt - .3) / .3, 0, 1), bx = nx - 40 * sc * st;
          inkFigure(ctx, bx, gy, sc, Object.assign({}, np, { lean: -.25 * st, crouch: .6, armF: -.6 }));
          const sh = figPt(bx, gy, sc, np, 18, figGeo(np).shY + 10); fountain(ctx, sh.x, sh.y, -Math.PI * .8, pt - .35, .6, d.seed, sc, .5);
          slashStroke(ctx, nx - 60 * sc, gy - 220 * sc, nx + 70 * sc, gy - 90 * sc, clamp((pt - .25) / .15, 0, 1) * (pt < .9 ? 1 : 0), 10 * sc, '#b30f22');
          brushTitle(ctx, L.wound, w * .5, h * .14, Math.max(28, Math.min(58, w * .065)), clamp(pt * 2, 0, 1), '#0d0b0c');
        } else {
          const fl = clamp((pt - .45) / .5, 0, 1);
          if (pt > .4) pool(ctx, nx, gy + 4 * sc, (pt - .4) * .6, 150, sc);
          ctx.save(); ctx.translate(nx, gy); ctx.rotate(fl * -1.4); ctx.translate(-nx, -gy); inkFigure(ctx, nx, gy, sc, Object.assign({}, np, { swordF: null, armF: .2 })); ctx.restore();
          const ch = figPt(nx, gy, sc, Object.assign({}, np, { lean: -fl * 1.4 }), 0, figGeo(np).shY + 30); fountain(ctx, ch.x, ch.y, -Math.PI * .6, pt - .4, 1, d.seed, sc, 1.4);
          slashStroke(ctx, nx - 80 * sc, gy - 260 * sc, nx + 90 * sc, gy - 40 * sc, clamp((pt - .2) / .2, 0, 1), 14 * sc, '#b30f22');
          brushTitle(ctx, d.choice ? '✗' : L.tooSlow, w * .5, h * .14, Math.max(30, Math.min(64, w * .07)), rk, '#0d0b0c');
        }
      } else {
        inkFigure(ctx, gx, gy, sc, gp);
        inkFigure(ctx, nx, gy, sc, np);
        brushTitle(ctx, L.duel, w * .5, h * .07, Math.max(22, Math.min(54, w * .06, h * .09)), intro);
        if (d.phase === 'choose') {
          const S = L.stances[d.stance], ty = h * .155;
          const bw = Math.min(420, w * .6), k = 1 - d.t / d.max;
          ctx.fillStyle = 'rgba(13,11,12,.85)'; ctx.fillRect(w / 2 - bw / 2, ty, bw, 10); ctx.fillStyle = k < .3 ? '#ff2b43' : '#e8dcc3'; ctx.fillRect(w / 2 - bw / 2 + 2, ty + 2, (bw - 4) * k, 6);
          ctx.textAlign = 'center'; ctx.lineWidth = 5; ctx.strokeStyle = '#e8dcc3';
          ctx.font = `900 ${Math.max(16, Math.min(28, w * .035, h * .05))}px "Chakra Petch"`; const t1 = `${S[0]} — ${S[1]}`; ctx.strokeText(t1, w / 2, ty + 34); ctx.fillStyle = '#0d0b0c'; ctx.fillText(t1, w / 2, ty + 34);
          ctx.font = '700 12px "Chakra Petch"'; let ly = ty + 52;
          const line = (txt, col) => { ctx.strokeText(txt, w / 2, ly); ctx.fillStyle = col; ctx.fillText(txt, w / 2, ly); ly += 15; };
          if (d.rounds > 1) line(`${L.captainDuel} (${d.round}/${d.rounds})`, '#3a2a22');
          if (run.door <= 3) line(L.rule, '#7a1020');
        }
      }
    }
    function drawDeathCine(cn) {
      const k = cn.t / cn.dur;
      ctx.fillStyle = `rgba(120,0,15,${Math.min(.7, k)})`; ctx.fillRect(0, 0, W, H);
      slashStroke(ctx, W * .1, H * .25, W * .9, H * .7, clamp(k / .25, 0, 1), 26, '#0d0b0c');
      fountain(ctx, W * .5, H * .48, -Math.PI / 2 - .3, cn.t - .2, 1.6, 31, Math.min(W, H) / 500, 1.6); fountain(ctx, W * .5, H * .48, -Math.PI / 2 + .4, cn.t - .3, 1.4, 32, Math.min(W, H) / 500, 1.4);
      brushTitle(ctx, L.dead, W / 2, H / 2, Math.max(30, Math.min(64, W * .07)), clamp((k - .2) * 1.5, 0, 1), '#0d0b0c');
    }
    function drawMenuArt() {
      paper(ctx, W, H, time, W * .5, H * .38, Math.min(W, H) * .28, false);
      const sc = Math.min(W / 700, H / 640) * 1.25;
      inkFigure(ctx, W * .5, H * .86, sc, { hat: 'straw', scarf: true, t: time, robe: '#0d0b0c', seed: 9, crouch: .1, armF: .5, armF2: .7, swordF: 2.6, swordLen: 170, armB: -.3, armB2: .2, swordB: 2.9, swordLen2: 150, mask: true, skin: '#e2c79c', hatTilt: .05 });
      splatter(ctx, W * .5, H * .86, 50, Math.min(W, H) * .35, 77, 1);
      ctx.fillStyle = 'rgba(8,6,9,.55)'; ctx.fillRect(0, 0, W, H);
    }

    /* ───────── main render ───────── */
    function render() {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (mode === 'menu' || mode === 'upgrades' && !run) { drawMenuArt(); return; }
      if (!map) { ctx.fillStyle = '#07060a'; ctx.fillRect(0, 0, W, H); return; }
      if (mode === 'duel' && duel) { drawDuel(duel); return; }
      if (mode === 'cine' && cine && cine.kind === 'kill') { drawKillCine(cine); return; }
      drawWorld(); drawHUD();
      if (mode === 'cine' && cine && cine.kind === 'death') drawDeathCine(cine);
    }

    /* ───────── screens ───────── */
    function showScreen(html, clear) { scr.innerHTML = html; scr.hidden = false; scr.classList.toggle('clear', !!clear); pad.hidden = true; duelUI.hidden = true; }
    function hideScreen() { scr.hidden = true; }
    function showMenu() {
      mode = 'menu'; run = null; map = null;
      showScreen(`<h2>${L.title}</h2><div class="sub">${L.sub.toUpperCase()}</div><p>${L.story}</p><div class="row">${save.cont && save.cont.door > 1 ? `<button class="b" data-a="cont">${fmt(L.contMenu, { n: save.cont.door })}</button><button class="b g" data-a="start">${L.fromStart}</button>` : `<button class="b" data-a="start">${L.play}</button>`}<button class="b g" data-a="ups">${L.upgrades}</button></div><div class="row"><span class="small">${L.seed}</span><input data-v="seed" placeholder="${L.seedPh}" maxlength="12"></div><p class="small">${L.best}: ${save.best} · ${L.mon}: ${save.mon}</p><p class="small">${L.keys}</p>`);
    }
    let upReturn = 'menu';
    function showUpgrades(ret) {
      upReturn = ret || upReturn; mode = 'upgrades';
      const card = id => { const lv = save.up[id], U = UPS[id], cost = U.cost[lv]; return `<div class="up"><b>${L.up[id][0]}</b><span>${L.up[id][1]}</span><div class="pips">${Array.from({ length: U.max }, (_, i) => `<i class="${i < lv ? 'on' : ''}"></i>`).join('')}</div><button data-buy="${id}" ${lv >= U.max || save.mon < cost ? 'disabled' : ''}>${lv >= U.max ? L.maxed : `${L.buy} · ${cost} ${L.mon}`}</button></div>`; };
      showScreen(`<h2 style="font-size:2rem">${L.upTitle}</h2><p class="small">${fmt(L.monHave, { m: save.mon })}</p><div class="ups">${Object.keys(UPS).map(card).join('')}</div><button class="b g" data-a="upback">${L.back}</button>`);
    }
    function pause() { if (mode !== 'play') return; mode = 'pause'; showScreen(`<h2>${L.paused}</h2><p class="small">${L.door} ${run.door} · ${L.seed} ${run.seed}</p><div class="row"><button class="b" data-a="resume">${L.resume}</button></div><div class="row"><button class="b g" data-a="start">${L.restart}</button><button class="b g" data-a="menu">${L.menu}</button></div><p class="small">${L.rule}</p>`); }
    function resume() { if (mode !== 'pause') return; mode = 'play'; hideScreen(); pad.hidden = !input.touch; }

    root.addEventListener('click', e => {
      sfx.unlock();
      const b = e.target.closest('[data-a],[data-buy],[data-w]'); if (!b) return;
      if (b.dataset.w) { duelChoose(b.dataset.w); return; }
      if (b.dataset.buy) { const id = b.dataset.buy, cost = UPS[id].cost[save.up[id]]; if (save.mon >= cost && save.up[id] < UPS[id].max) { save.mon -= cost; save.up[id]++; storeSave(save); sfx.key(); } showUpgrades(); return; }
      const a = b.dataset.a;
      if (a === 'start') { const inp = scr.querySelector('[data-v=seed]'); const seed = inp && inp.value.trim() ? inp.value.trim().toUpperCase() : null; newRun(seed); goFull(); }
      else if (a === 'next') { run.door++; startDoor(); }
      else if (a === 'cont') { continueRun(); goFull(); }
      else if (a === 'ups') showUpgrades(mode === 'menu' ? 'menu' : mode === 'clear' ? 'clear' : 'over');
      else if (a === 'upback') { if (upReturn === 'menu') showMenu(); else if (upReturn === 'clear') { mode = 'clear'; showScreen(`<h2>${fmt(L.clear, { n: run.door })}</h2><p class="small">${L.mon}: ${save.mon}</p><div class="row"><button class="b" data-a="next">${L.next}</button><button class="b g" data-a="ups">${L.upgrades}</button></div>`); } else gameOver(); }
      else if (a === 'menu') showMenu();
      else if (a === 'pause') { if (mode === 'pause') resume(); else pause(); }
      else if (a === 'resume') resume();
      else if (a === 'mute') { save.mute = !save.mute; storeSave(save); sfx.setMute(save.mute); b.textContent = save.mute ? '🔇' : '🔊'; }
      else if (a === 'full') toggleFull();
    });
    function toggleFull() { try { if (document.fullscreenElement) document.exitFullscreen(); else (host.requestFullscreen ? host : root).requestFullscreen().catch(() => {}); } catch (e) {} }
    function goFull() { try { if (global.matchMedia && matchMedia('(pointer:coarse)').matches && !document.fullscreenElement && host.requestFullscreen) host.requestFullscreen().then(() => { try { screen.orientation.lock('landscape').catch(() => {}); } catch (e) {} }).catch(() => {}); } catch (e) {} }

    /* ───────── input ───────── */
    const isMine = () => root.isConnected && (document.fullscreenElement === host || root.getBoundingClientRect().bottom > 0);
    global.addEventListener('keydown', e => {
      if (!isMine()) return;
      const c = e.code;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(c) && (mode === 'play' || mode === 'duel')) e.preventDefault();
      input.keys[c] = true; sfx.unlock();
      if (mode === 'play') { if (c === 'Space') dash(); if (c === 'KeyQ') smoke(); if (c === 'Escape' || c === 'KeyP') pause(); }
      else if (mode === 'pause' && (c === 'Escape' || c === 'KeyP')) resume();
      else if (mode === 'duel') { const w = { Digit1: 'katana', Digit2: 'kusari', Digit3: 'shuriken', Digit4: 'smoke', KeyJ: 'katana', KeyK: 'kusari', KeyL: 'shuriken' }[c]; if (w && !(w === 'smoke' && run.bombs <= 0)) duelChoose(w); }
    });
    global.addEventListener('keyup', e => { input.keys[e.code] = false; });
    const local = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }; };
    cv.addEventListener('pointerdown', e => {
      sfx.unlock();
      if (e.pointerType === 'mouse' || mode !== 'play') return;
      e.preventDefault(); if (!input.touch) { input.touch = true; pad.hidden = false; }
      const p = local(e);
      if (!input.stick && p.x < p.w * .62) { cv.setPointerCapture(e.pointerId); input.stick = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y }; }
    });
    cv.addEventListener('pointermove', e => { if (input.stick && input.stick.id === e.pointerId) { const p = local(e); input.stick.x = p.x; input.stick.y = p.y; } });
    const up = e => { if (input.stick && input.stick.id === e.pointerId) input.stick = null; };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('contextmenu', e => e.preventDefault());
    pad.addEventListener('pointerdown', e => { const b = e.target.closest('button'); if (!b) return; e.preventDefault(); sfx.unlock(); if (b.dataset.a === 'dash') dash(); if (b.dataset.a === 'smoke') smoke(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); sfx.suspend(document.hidden); });

    /* ───────── loop ───────── */
    let last = 0;
    function frame(ts) {
      const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
      if (mode === 'play' || mode === 'duel' || mode === 'cine') { update(dt); stepParticles(dt); } else time += dt;
      if (run && pad) { const bb = pad.querySelector('[data-v=bombs]'); if (bb) bb.textContent = run.bombs; }
      /* music follows the action */
      const mscene = mode === 'menu' || mode === 'upgrades' ? 'menu' : mode === 'over' ? 'over' : mode === 'pause' ? 'pause' : mode === 'duel' ? 'duel' : mode === 'cine' ? 'cine' : 'play';
      sfx.scene(mscene);
      let ten = .1;
      if (mode === 'duel') ten = 1; else if (mode === 'play' && guards) { ten = .15; for (const g of guards) if (g.alive) ten = Math.max(ten, g.state === 'hunt' ? 1 : g.det * .9, g.state === 'investigate' || g.state === 'suspicious' ? .45 : 0); if (alarmT > 0) ten = 1; }
      sfx.tension(ten);
      render();
      requestAnimationFrame(frame);
    }
    new ResizeObserver(resize).observe(root);
    resize(); showMenu(); requestAnimationFrame(frame);
    return { get mode() { return mode; }, get player() { return player; }, get guards() { return guards; }, get traps() { return traps; }, get run() { return run; }, get exit() { return exitT; }, newRun, startDuel: g => startDuel(g || guards.find(x => x.alive)), stealthKill, duelChoose, get duel() { return duel; }, step: update, get map() { return { MW, MH }; } };
  }

  global.RedScarf = { mount };
})(window);
