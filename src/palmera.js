/* PALMERA HEAT – an original top-down open-world crime story for PickRadar.
   Everything (city, cars, people, radio, sirens) is drawn and synthesized in code: no image or audio files.
   Original characters and city; not affiliated with any other game or publisher. */
(function (global) {
'use strict';

const LANG = {
 en: {
  name: 'Palmera Heat', sub: 'Open-world crime story', tag: 'One city. One debt. One driver who never talks.',
  story: 'Start the story', cont: 'Continue · mission {n}', free: 'Free roam', missions: 'Missions', locked: 'Locked',
  soundOn: 'Sound: on', soundOff: 'Sound: off', back: '← Back', resume: 'Resume', quit: 'Main menu', paused: 'Paused',
  flat: 'FLATLINED', cuffed: 'CUFFED', hosp: 'Hospital bill −${n}', bail: 'Bail −${n}', passed: 'MISSION PASSED', failed: 'MISSION FAILED',
  tap: 'Click or tap to continue', getIn: 'F: get in', getInT: 'Tap 🚗 to get in', lost: 'You lost the cops',
  spray: 'Ines repainted the car. The heat is off.', sprayCost: 'Repaint ${n}', noMoney: 'Not enough cash', radioOff: 'Radio off',
  pick: '{w} picked up', burning: 'The car is burning! Get out!', shop: 'Bullet Bay Guns', armor: 'Armor', health: 'Health',
  w: { fist: 'Fists', pistol: 'Pistol', smg: 'SMG', shotgun: 'Shotgun' },
  fail: { dead: 'You flatlined.', busted: 'You got cuffed.', car: 'The car was destroyed.', time: 'Out of time.', lost: 'The target got away.', dmg: 'The car is too damaged.' },
  mapHelp: 'Click / tap the map to set a waypoint · M to close', wp: 'Waypoint set', end: 'THE END · Palmera is yours. Free roam continues.',
  mission: 'Mission', hint: 'Walk or drive into the pink marker to start the next mission', allDone: 'Story complete · enjoy the city',
  keys: 'WASD drive/walk · Mouse aim + click shoot · F car · Shift sprint · Space handbrake · Q/E weapon · R radio · M map · P pause',
  keysT: 'Left stick move/steer · 🔫 shoot (auto-aim) · 🚗 car · ⇄ weapon · 🗺 map · 📻 radio',
  time: 'Time', cash: '+${n}', dist: { lp: 'Little Palmera', gh: 'Glass Heights', os: 'Ocean Strip', gf: 'Gator Flats', pm: 'Port Mangrove', cn: 'Canal District', ns: 'North Shore' },
  shopHint: 'Buy: 1 pistol ammo $100 · 2 SMG $300 · 3 shotgun $500 · 4 armor $200', bought: 'Bought', paidOff: 'Debt left: ${n}',
  ms: [
   { n: 'Out of the Cage', b: [['ines', 'Four years, Rook. Four years, and you walk out like nothing happened.'], ['rook', "I didn't do it, Ines. Harlan set me up."], ['ines', 'Tell that to the bank. They take my garage in thirty days unless your old debt gets paid. Get over here.']],
     o: ['Grab a car: walk up to one and press F.', "Drive to Ines' garage in Gator Flats. Follow the purple line."], e: [['ines', 'Bad news, brother. Coral Vasquez bought your debt. Fifty grand. She owns you now.']] },
   { n: 'Paint Job', b: [['ines', 'I need something shiny to sell. A yellow Vesper GT is parked on Ocean Strip.'], ['ines', 'Bring it here in one piece. Every dent comes out of your cut.']],
     o: ['Find the yellow Vesper GT on Ocean Strip.', 'Bring the Vesper to the garage. Keep it above half health.'], e: [['ines', 'Not bad, little brother. Not bad at all.']] },
   { n: 'Saltwater', b: [['coral', 'So this is Rook Navarro. The driver who never talks.'], ['rook', "I'm here to work off the debt."], ['coral', 'My couriers dumped five packages along the canal when the harbor patrol showed up. Get them before the tide does.']],
     o: ['Collect the packages along the canal: {n}/5.'], e: [['coral', 'Fast hands. Ten thousand off your tab.']] },
   { n: 'Hot Cargo', b: [['coral', 'This van goes to a warehouse in Glass Heights.'], ['coral', "Harbor cops already have your plate. Don't bring them to my door."]],
     o: ['Get in the van.', 'Lose the cops.', 'Deliver the van to the warehouse downtown. No stars allowed.'], e: [['coral', 'Clean work. Another fifteen off.']] },
   { n: 'Glass Jaw', b: [['coral', 'Vinnie Glass washes my money and skims off the top.'], ['coral', "He's leaving his tower in a silver Phantom. Stop that car. I want his briefcase."]],
     o: ["Wreck Vinnie's silver Phantom.", 'Grab the briefcase.'], e: [['rook', "Coral... there's a badge number in this briefcase. Harlan's. They're in it together."]] },
   { n: 'Swamp Rats', b: [['ines', 'The Gator Boys trashed my garage! Somebody paid them. Somebody with a badge.'], ['rook', 'Stay down. Call me if they come back.'], ['ines', 'Take the SMG from under the counter. Go.']],
     o: ['Take out the Gator Boys: {n} left.'], e: [['ines', 'They were waiting for you, Rook. Harlan wants you gone.']] },
   { n: 'Ledger Run', b: [['ines', "Harlan's ledger moves from the station to the evidence dock in two minutes."], ['rook', 'Then I get there first.']],
     o: ['Hit the checkpoints before the transfer: {n}/6.'], e: [['rook', 'Every bribe Harlan ever took. And every one Coral paid.']] },
   { n: 'Palmera Heat', b: [['coral', "You read my ledger, driver. Harlan and I have an understanding, and you're not part of it."], ['harlan', "All units: Rook Navarro, armed and dangerous. Bring him in. Or don't."]],
     o: ["Wreck Harlan's black interceptor.", 'Get the ledger to the south pier. The press is waiting.'], e: [['ines', "It's on every channel. Harlan's in cuffs, Coral's boats are seized, and the debt is gone."], ['rook', "Palmera's quiet tonight. Let's keep it that way. For a while."]] }
  ]
 },
 tr: {
  name: 'Palmera Heat', sub: 'Açık dünya suç hikâyesi', tag: 'Bir şehir. Bir borç. Hiç konuşmayan bir şoför.',
  story: 'Hikâyeye başla', cont: 'Devam et · görev {n}', free: 'Serbest dolaş', missions: 'Görevler', locked: 'Kilitli',
  soundOn: 'Ses: açık', soundOff: 'Ses: kapalı', back: '← Geri', resume: 'Devam', quit: 'Ana menü', paused: 'Duraklatıldı',
  flat: 'HASTANELİK', cuffed: 'KELEPÇELENDİN', hosp: 'Hastane faturası −${n}', bail: 'Kefalet −${n}', passed: 'GÖREV TAMAM', failed: 'GÖREV BAŞARISIZ',
  tap: 'Devam etmek için tıkla ya da dokun', getIn: 'F: arabaya bin', getInT: 'Binmek için 🚗', lost: 'Polisi ektin',
  spray: 'Ines arabayı boyadı. Polis izini kaybetti.', sprayCost: 'Boya ${n}', noMoney: 'Paran yetmiyor', radioOff: 'Radyo kapalı',
  pick: '{w} alındı', burning: 'Araba yanıyor! Hemen in!', shop: 'Bullet Bay Silah', armor: 'Zırh', health: 'Can',
  w: { fist: 'Yumruk', pistol: 'Tabanca', smg: 'Makineli', shotgun: 'Pompalı' },
  fail: { dead: 'Hastanelik oldun.', busted: 'Kelepçelendin.', car: 'Araba yok oldu.', time: 'Süre doldu.', lost: 'Hedef kaçtı.', dmg: 'Araba çok hasarlı.' },
  mapHelp: 'Hedef koymak için haritaya tıkla / dokun · kapatmak için M', wp: 'Hedef noktası kondu', end: 'SON · Palmera artık senin. Serbest dolaşma devam ediyor.',
  mission: 'Görev', hint: 'Sonraki görev için pembe işarete yürü ya da sür', allDone: 'Hikâye bitti · şehrin tadını çıkar',
  keys: 'WASD sür/yürü · Fare nişan + tık ateş · F araba · Shift koş · Boşluk el freni · Q/E silah · R radyo · M harita · P duraklat',
  keysT: 'Sol çubuk yürü/sür · 🔫 ateş (otomatik nişan) · 🚗 araba · ⇄ silah · 🗺 harita · 📻 radyo',
  time: 'Süre', cash: '+${n}', dist: { lp: 'Küçük Palmera', gh: 'Glass Heights', os: 'Ocean Strip', gf: 'Gator Flats', pm: 'Port Mangrove', cn: 'Kanal Bölgesi', ns: 'Kuzey Sahili' },
  shopHint: 'Satın al: 1 tabanca mermisi $100 · 2 makineli $300 · 3 pompalı $500 · 4 zırh $200', bought: 'Alındı', paidOff: 'Kalan borç: ${n}',
  ms: [
   { n: 'Kafesten Çıkış', b: [['ines', 'Dört yıl Rook. Dört yıl, sonra hiçbir şey olmamış gibi çıkıp geliyorsun.'], ['rook', 'Ben yapmadım Ines. Harlan bana tuzak kurdu.'], ['ines', 'Bunu bankaya anlat. Eski borcun ödenmezse otuz gün içinde garajımı alıyorlar. Hemen buraya gel.']],
     o: ["Bir araba kap: birine yürü ve F'ye bas.", "Gator Flats'teki Ines'in garajına sür. Mor çizgiyi takip et."], e: [['ines', 'Kötü haber kardeşim. Coral Vasquez borcunu satın aldı. Elli bin. Artık ona aitsin.']] },
   { n: 'Boya İşi', b: [['ines', "Satacak parlak bir şey lazım. Ocean Strip'te sarı bir Vesper GT park hâlinde."], ['ines', 'Tek parça getir. Her göçük senin payından düşer.']],
     o: ["Ocean Strip'teki sarı Vesper GT'yi bul.", "Vesper'ı garaja getir. Sağlığı yarının altına düşmesin."], e: [['ines', 'Fena değil küçük kardeş. Hiç fena değil.']] },
   { n: 'Tuzlu Su', b: [['coral', 'Demek Rook Navarro bu. Hiç konuşmayan şoför.'], ['rook', 'Borcumu çalışarak ödemeye geldim.'], ['coral', 'Liman devriyesi gelince kuryelerim kanal boyuna beş paket attı. Gelgit almadan topla.']],
     o: ['Kanal boyundaki paketleri topla: {n}/5.'], e: [['coral', 'Elin çabuk. Borcundan on bin düştüm.']] },
   { n: 'Sıcak Kargo', b: [['coral', "Bu minibüs Glass Heights'taki depoya gidecek."], ['coral', 'Liman polisi plakanı biliyor. Onları kapıma getirme.']],
     o: ['Minibüse bin.', 'Polisi ek.', 'Minibüsü merkezdeki depoya teslim et. Aranma yıldızı olmayacak.'], e: [['coral', 'Temiz iş. On beş bin daha düştü.']] },
   { n: 'Cam Çene', b: [['coral', 'Vinnie Glass paramı aklıyor ve üstünden çalıyor.'], ['coral', "Gümüş bir Phantom'la kulesinden çıkıyor. O arabayı durdur. Çantasını istiyorum."]],
     o: ["Vinnie'nin gümüş Phantom'unu hurdaya çevir.", 'Çantayı al.'], e: [['rook', "Coral... çantada bir rozet numarası var. Harlan'ın. İkisi ortak."]] },
   { n: 'Bataklık Fareleri', b: [['ines', 'Gator Boys garajımı darmadağın etti! Biri onlara para verdi. Rozetli biri.'], ['rook', 'Sen eğil. Geri gelirlerse beni ara.'], ['ines', 'Tezgâhın altındaki makineliyi al. Git.']],
     o: ["Gator Boys'u temizle: {n} kaldı."], e: [['ines', 'Seni bekliyorlardı Rook. Harlan senden kurtulmak istiyor.']] },
   { n: 'Defter Koşusu', b: [['ines', "Harlan'ın defteri iki dakika sonra karakoldan delil iskelesine taşınıyor."], ['rook', 'O zaman ben önce varırım.']],
     o: ['Transferden önce kontrol noktalarından geç: {n}/6.'], e: [['rook', "Harlan'ın aldığı her rüşvet. Ve Coral'ın verdiği her biri."]] },
   { n: 'Palmera Ateşi', b: [['coral', "Defterimi okudun şoför. Harlan'la anlaşmamız var ve sen o anlaşmada yoksun."], ['harlan', 'Tüm birimler: Rook Navarro silahlı ve tehlikeli. Getirin. Ya da getirmeyin.']],
     o: ["Harlan'ın siyah takip aracını hurdaya çevir.", 'Defteri güney iskelesine götür. Basın bekliyor.'], e: [['ines', "Bütün kanallarda. Harlan kelepçeli, Coral'ın teknelerine el kondu ve borç bitti."], ['rook', 'Palmera bu gece sessiz. Bir süre böyle kalsın.']] }
  ]
 },
 es: {
  name: 'Palmera Heat', sub: 'Historia criminal de mundo abierto', tag: 'Una ciudad. Una deuda. Un conductor que nunca habla.',
  story: 'Empezar la historia', cont: 'Continuar · misión {n}', free: 'Modo libre', missions: 'Misiones', locked: 'Bloqueada',
  soundOn: 'Sonido: sí', soundOff: 'Sonido: no', back: '← Volver', resume: 'Seguir', quit: 'Menú principal', paused: 'Pausa',
  flat: 'AL HOSPITAL', cuffed: 'ESPOSADO', hosp: 'Factura del hospital −${n}', bail: 'Fianza −${n}', passed: 'MISIÓN CUMPLIDA', failed: 'MISIÓN FALLIDA',
  tap: 'Haz clic o toca para continuar', getIn: 'F: subir', getInT: 'Toca 🚗 para subir', lost: 'Perdiste a la policía',
  spray: 'Ines pintó el coche. Ya no te buscan.', sprayCost: 'Pintura ${n}', noMoney: 'No tienes dinero suficiente', radioOff: 'Radio apagada',
  pick: '{w} recogido', burning: '¡El coche arde! ¡Sal ya!', shop: 'Bullet Bay Armas', armor: 'Blindaje', health: 'Salud',
  w: { fist: 'Puños', pistol: 'Pistola', smg: 'Subfusil', shotgun: 'Escopeta' },
  fail: { dead: 'Acabaste en el hospital.', busted: 'Te esposaron.', car: 'El coche quedó destruido.', time: 'Se acabó el tiempo.', lost: 'El objetivo escapó.', dmg: 'El coche está demasiado dañado.' },
  mapHelp: 'Haz clic / toca el mapa para marcar destino · M para cerrar', wp: 'Destino marcado', end: 'FIN · Palmera es tuya. El modo libre sigue.',
  mission: 'Misión', hint: 'Entra en el marcador rosa para la siguiente misión', allDone: 'Historia completa · disfruta la ciudad',
  keys: 'WASD conducir/andar · Ratón apuntar + clic disparar · F coche · Shift correr · Espacio freno de mano · Q/E arma · R radio · M mapa · P pausa',
  keysT: 'Stick izquierdo mover/girar · 🔫 disparar (auto) · 🚗 coche · ⇄ arma · 🗺 mapa · 📻 radio',
  time: 'Tiempo', cash: '+${n}', dist: { lp: 'Little Palmera', gh: 'Glass Heights', os: 'Ocean Strip', gf: 'Gator Flats', pm: 'Port Mangrove', cn: 'Distrito del Canal', ns: 'Costa Norte' },
  shopHint: 'Comprar: 1 balas de pistola $100 · 2 subfusil $300 · 3 escopeta $500 · 4 blindaje $200', bought: 'Comprado', paidOff: 'Deuda restante: ${n}',
  ms: [
   { n: 'Fuera de la jaula', b: [['ines', 'Cuatro años, Rook. Cuatro años, y sales como si nada.'], ['rook', 'Yo no fui, Ines. Harlan me tendió una trampa.'], ['ines', 'Cuéntaselo al banco. Me quitan el taller en treinta días si nadie paga tu vieja deuda. Ven aquí.']],
     o: ['Consigue un coche: acércate a uno y pulsa F.', 'Conduce al taller de Ines en Gator Flats. Sigue la línea morada.'], e: [['ines', 'Malas noticias, hermano. Coral Vasquez compró tu deuda. Cincuenta mil. Ahora le perteneces.']] },
   { n: 'Trabajo de pintura', b: [['ines', 'Necesito algo brillante para vender. Hay un Vesper GT amarillo aparcado en Ocean Strip.'], ['ines', 'Tráelo entero. Cada abolladura sale de tu parte.']],
     o: ['Encuentra el Vesper GT amarillo en Ocean Strip.', 'Lleva el Vesper al taller. Que no baje de la mitad de salud.'], e: [['ines', 'Nada mal, hermanito. Nada mal.']] },
   { n: 'Agua salada', b: [['coral', 'Así que este es Rook Navarro. El conductor que nunca habla.'], ['rook', 'Vengo a pagar la deuda trabajando.'], ['coral', 'Mis mensajeros tiraron cinco paquetes en el canal cuando llegó la patrulla. Recógelos antes que la marea.']],
     o: ['Recoge los paquetes del canal: {n}/5.'], e: [['coral', 'Manos rápidas. Diez mil menos en tu cuenta.']] },
   { n: 'Carga caliente', b: [['coral', 'Esta furgoneta va a un almacén en Glass Heights.'], ['coral', 'La policía del puerto ya tiene tu matrícula. No los traigas a mi puerta.']],
     o: ['Sube a la furgoneta.', 'Pierde a la policía.', 'Entrega la furgoneta en el almacén del centro. Sin estrellas.'], e: [['coral', 'Trabajo limpio. Otros quince menos.']] },
   { n: 'Mandíbula de cristal', b: [['coral', 'Vinnie Glass lava mi dinero y se queda una parte.'], ['coral', 'Sale de su torre en un Phantom plateado. Detén ese coche. Quiero su maletín.']],
     o: ['Destroza el Phantom plateado de Vinnie.', 'Coge el maletín.'], e: [['rook', 'Coral... hay un número de placa en este maletín. El de Harlan. Están juntos en esto.']] },
   { n: 'Ratas del pantano', b: [['ines', '¡Los Gator Boys destrozaron mi taller! Alguien les pagó. Alguien con placa.'], ['rook', 'Agáchate. Llámame si vuelven.'], ['ines', 'Coge el subfusil de debajo del mostrador. Ve.']],
     o: ['Acaba con los Gator Boys: quedan {n}.'], e: [['ines', 'Te estaban esperando, Rook. Harlan te quiere fuera.']] },
   { n: 'Carrera del libro', b: [['ines', 'El libro de cuentas de Harlan pasa de la comisaría al muelle de pruebas en dos minutos.'], ['rook', 'Entonces llego yo primero.']],
     o: ['Pasa los puntos de control antes del traslado: {n}/6.'], e: [['rook', 'Cada soborno que cobró Harlan. Y cada uno que pagó Coral.']] },
   { n: 'Palmera Heat', b: [['coral', 'Leíste mi libro, conductor. Harlan y yo tenemos un acuerdo, y tú no estás en él.'], ['harlan', 'Todas las unidades: Rook Navarro, armado y peligroso. Tráiganlo. O no.']],
     o: ['Destroza el interceptor negro de Harlan.', 'Lleva el libro al muelle sur. La prensa espera.'], e: [['ines', 'Está en todos los canales. Harlan esposado, los barcos de Coral incautados y la deuda, borrada.'], ['rook', 'Palmera está tranquila esta noche. Que siga así. Un tiempo.']] }
  ]
 },
 pt: {
  name: 'Palmera Heat', sub: 'História de crime em mundo aberto', tag: 'Uma cidade. Uma dívida. Um motorista que nunca fala.',
  story: 'Começar a história', cont: 'Continuar · missão {n}', free: 'Modo livre', missions: 'Missões', locked: 'Bloqueada',
  soundOn: 'Som: ligado', soundOff: 'Som: desligado', back: '← Voltar', resume: 'Continuar', quit: 'Menu principal', paused: 'Pausado',
  flat: 'HOSPITALIZADO', cuffed: 'ALGEMADO', hosp: 'Conta do hospital −${n}', bail: 'Fiança −${n}', passed: 'MISSÃO CUMPRIDA', failed: 'MISSÃO FALHOU',
  tap: 'Clique ou toque para continuar', getIn: 'F: entrar', getInT: 'Toque 🚗 para entrar', lost: 'Você despistou a polícia',
  spray: 'Ines pintou o carro. A polícia perdeu o rastro.', sprayCost: 'Pintura ${n}', noMoney: 'Dinheiro insuficiente', radioOff: 'Rádio desligado',
  pick: '{w} coletado', burning: 'O carro está pegando fogo! Saia!', shop: 'Bullet Bay Armas', armor: 'Colete', health: 'Vida',
  w: { fist: 'Socos', pistol: 'Pistola', smg: 'Submetralhadora', shotgun: 'Escopeta' },
  fail: { dead: 'Você foi parar no hospital.', busted: 'Você foi algemado.', car: 'O carro foi destruído.', time: 'O tempo acabou.', lost: 'O alvo fugiu.', dmg: 'O carro está muito danificado.' },
  mapHelp: 'Clique / toque no mapa para marcar destino · M para fechar', wp: 'Destino marcado', end: 'FIM · Palmera é sua. O modo livre continua.',
  mission: 'Missão', hint: 'Entre no marcador rosa para a próxima missão', allDone: 'História completa · aproveite a cidade',
  keys: 'WASD dirigir/andar · Mouse mirar + clique atirar · F carro · Shift correr · Espaço freio de mão · Q/E arma · R rádio · M mapa · P pausa',
  keysT: 'Analógico esquerdo mover/dirigir · 🔫 atirar (mira automática) · 🚗 carro · ⇄ arma · 🗺 mapa · 📻 rádio',
  time: 'Tempo', cash: '+${n}', dist: { lp: 'Little Palmera', gh: 'Glass Heights', os: 'Ocean Strip', gf: 'Gator Flats', pm: 'Port Mangrove', cn: 'Distrito do Canal', ns: 'Costa Norte' },
  shopHint: 'Comprar: 1 munição de pistola $100 · 2 submetralhadora $300 · 3 escopeta $500 · 4 colete $200', bought: 'Comprado', paidOff: 'Dívida restante: ${n}',
  ms: [
   { n: 'Fora da jaula', b: [['ines', 'Quatro anos, Rook. Quatro anos, e você sai como se nada tivesse acontecido.'], ['rook', 'Não fui eu, Ines. O Harlan armou para mim.'], ['ines', 'Conte isso ao banco. Eles tomam minha oficina em trinta dias se ninguém pagar sua dívida antiga. Venha para cá.']],
     o: ['Pegue um carro: chegue perto de um e aperte F.', 'Dirija até a oficina da Ines em Gator Flats. Siga a linha roxa.'], e: [['ines', 'Má notícia, irmão. Coral Vasquez comprou sua dívida. Cinquenta mil. Agora você pertence a ela.']] },
   { n: 'Serviço de pintura', b: [['ines', 'Preciso de algo brilhante para vender. Tem um Vesper GT amarelo estacionado na Ocean Strip.'], ['ines', 'Traga inteiro. Cada amassado sai da sua parte.']],
     o: ['Encontre o Vesper GT amarelo na Ocean Strip.', 'Leve o Vesper até a oficina. Não deixe a vida cair abaixo da metade.'], e: [['ines', 'Nada mal, irmãozinho. Nada mal mesmo.']] },
   { n: 'Água salgada', b: [['coral', 'Então este é o Rook Navarro. O motorista que nunca fala.'], ['rook', 'Vim pagar a dívida trabalhando.'], ['coral', 'Meus mensageiros largaram cinco pacotes no canal quando a patrulha chegou. Pegue antes da maré.']],
     o: ['Colete os pacotes ao longo do canal: {n}/5.'], e: [['coral', 'Mãos rápidas. Dez mil a menos na sua conta.']] },
   { n: 'Carga quente', b: [['coral', 'Esta van vai para um armazém em Glass Heights.'], ['coral', 'A polícia do porto já tem sua placa. Não traga eles até minha porta.']],
     o: ['Entre na van.', 'Despiste a polícia.', 'Entregue a van no armazém do centro. Sem estrelas.'], e: [['coral', 'Trabalho limpo. Mais quinze a menos.']] },
   { n: 'Queixo de vidro', b: [['coral', 'Vinnie Glass lava meu dinheiro e embolsa uma parte.'], ['coral', 'Ele está saindo da torre num Phantom prateado. Pare esse carro. Quero a maleta dele.']],
     o: ['Destrua o Phantom prateado do Vinnie.', 'Pegue a maleta.'], e: [['rook', 'Coral... tem um número de distintivo nesta maleta. O do Harlan. Eles estão juntos nisso.']] },
   { n: 'Ratos do pântano', b: [['ines', 'Os Gator Boys destruíram minha oficina! Alguém pagou eles. Alguém com distintivo.'], ['rook', 'Fique abaixada. Me ligue se voltarem.'], ['ines', 'Pegue a submetralhadora debaixo do balcão. Vai.']],
     o: ['Acabe com os Gator Boys: faltam {n}.'], e: [['ines', 'Eles estavam esperando você, Rook. O Harlan quer você fora.']] },
   { n: 'Corrida do livro', b: [['ines', 'O livro-caixa do Harlan sai da delegacia para o cais de provas em dois minutos.'], ['rook', 'Então eu chego primeiro.']],
     o: ['Passe pelos pontos de controle antes da transferência: {n}/6.'], e: [['rook', 'Cada propina que o Harlan recebeu. E cada uma que a Coral pagou.']] },
   { n: 'Palmera Heat', b: [['coral', 'Você leu meu livro, motorista. Eu e o Harlan temos um acordo, e você não faz parte dele.'], ['harlan', 'Todas as unidades: Rook Navarro, armado e perigoso. Tragam ele. Ou não.']],
     o: ['Destrua o interceptador preto do Harlan.', 'Leve o livro até o píer sul. A imprensa está esperando.'], e: [['ines', 'Está em todos os canais. Harlan algemado, os barcos da Coral apreendidos e a dívida acabou.'], ['rook', 'Palmera está calma esta noite. Que continue assim. Por um tempo.']] }
  ]
 },
 id: {
  name: 'Palmera Heat', sub: 'Kisah kriminal dunia terbuka', tag: 'Satu kota. Satu utang. Satu sopir yang tak pernah bicara.',
  story: 'Mulai cerita', cont: 'Lanjut · misi {n}', free: 'Jelajah bebas', missions: 'Misi', locked: 'Terkunci',
  soundOn: 'Suara: nyala', soundOff: 'Suara: mati', back: '← Kembali', resume: 'Lanjut', quit: 'Menu utama', paused: 'Jeda',
  flat: 'MASUK RUMAH SAKIT', cuffed: 'DIBORGOL', hosp: 'Tagihan rumah sakit −${n}', bail: 'Uang jaminan −${n}', passed: 'MISI BERHASIL', failed: 'MISI GAGAL',
  tap: 'Klik atau ketuk untuk lanjut', getIn: 'F: naik', getInT: 'Ketuk 🚗 untuk naik', lost: 'Kamu lolos dari polisi',
  spray: 'Ines mengecat ulang mobilnya. Polisi kehilangan jejak.', sprayCost: 'Cat ulang ${n}', noMoney: 'Uang tidak cukup', radioOff: 'Radio mati',
  pick: '{w} diambil', burning: 'Mobil terbakar! Cepat keluar!', shop: 'Bullet Bay Senjata', armor: 'Rompi', health: 'Darah',
  w: { fist: 'Tinju', pistol: 'Pistol', smg: 'SMG', shotgun: 'Senapan gentel' },
  fail: { dead: 'Kamu masuk rumah sakit.', busted: 'Kamu diborgol.', car: 'Mobilnya hancur.', time: 'Waktu habis.', lost: 'Target kabur.', dmg: 'Mobil terlalu rusak.' },
  mapHelp: 'Klik / ketuk peta untuk memasang tujuan · M untuk menutup', wp: 'Tujuan dipasang', end: 'TAMAT · Palmera milikmu. Jelajah bebas berlanjut.',
  mission: 'Misi', hint: 'Masuk ke penanda merah muda untuk misi berikutnya', allDone: 'Cerita selesai · nikmati kotanya',
  keys: 'WASD menyetir/jalan · Mouse bidik + klik tembak · F mobil · Shift lari · Spasi rem tangan · Q/E senjata · R radio · M peta · P jeda',
  keysT: 'Stik kiri jalan/setir · 🔫 tembak (bidik otomatis) · 🚗 mobil · ⇄ senjata · 🗺 peta · 📻 radio',
  time: 'Waktu', cash: '+${n}', dist: { lp: 'Little Palmera', gh: 'Glass Heights', os: 'Ocean Strip', gf: 'Gator Flats', pm: 'Port Mangrove', cn: 'Distrik Kanal', ns: 'Pantai Utara' },
  shopHint: 'Beli: 1 peluru pistol $100 · 2 SMG $300 · 3 senapan $500 · 4 rompi $200', bought: 'Dibeli', paidOff: 'Sisa utang: ${n}',
  ms: [
   { n: 'Keluar dari Kandang', b: [['ines', 'Empat tahun, Rook. Empat tahun, lalu kamu keluar seolah tak terjadi apa-apa.'], ['rook', 'Bukan aku pelakunya, Ines. Harlan menjebakku.'], ['ines', 'Bilang saja ke bank. Bengkelku disita dalam tiga puluh hari kalau utang lamamu tak dibayar. Cepat ke sini.']],
     o: ['Ambil mobil: dekati salah satu dan tekan F.', 'Menyetir ke bengkel Ines di Gator Flats. Ikuti garis ungu.'], e: [['ines', 'Kabar buruk, Kak. Coral Vasquez membeli utangmu. Lima puluh ribu. Sekarang kamu miliknya.']] },
   { n: 'Kerja Cat', b: [['ines', 'Aku butuh sesuatu yang mengilap untuk dijual. Ada Vesper GT kuning parkir di Ocean Strip.'], ['ines', 'Bawa utuh ke sini. Tiap penyok dipotong dari bagianmu.']],
     o: ['Temukan Vesper GT kuning di Ocean Strip.', 'Bawa Vesper ke bengkel. Jangan sampai darahnya di bawah setengah.'], e: [['ines', 'Lumayan, Kak. Lumayan sekali.']] },
   { n: 'Air Asin', b: [['coral', 'Jadi ini Rook Navarro. Sopir yang tak pernah bicara.'], ['rook', 'Aku datang untuk melunasi utang dengan kerja.'], ['coral', 'Kurirku membuang lima paket di sepanjang kanal waktu patroli pelabuhan datang. Ambil sebelum terbawa pasang.']],
     o: ['Kumpulkan paket di sepanjang kanal: {n}/5.'], e: [['coral', 'Tanganmu cepat. Sepuluh ribu dipotong dari utangmu.']] },
   { n: 'Muatan Panas', b: [['coral', 'Van ini harus sampai ke gudang di Glass Heights.'], ['coral', 'Polisi pelabuhan sudah tahu pelat nomormu. Jangan bawa mereka ke pintuku.']],
     o: ['Naik ke van.', 'Lolos dari polisi.', 'Antar van ke gudang di pusat kota. Tanpa bintang.'], e: [['coral', 'Kerja bersih. Lima belas ribu lagi dipotong.']] },
   { n: 'Rahang Kaca', b: [['coral', 'Vinnie Glass mencuci uangku dan mengambil sebagian.'], ['coral', 'Dia keluar dari menaranya dengan Phantom perak. Hentikan mobil itu. Aku mau kopernya.']],
     o: ['Hancurkan Phantom perak milik Vinnie.', 'Ambil kopernya.'], e: [['rook', 'Coral... ada nomor lencana di koper ini. Milik Harlan. Mereka bekerja sama.']] },
   { n: 'Tikus Rawa', b: [['ines', 'Gator Boys mengobrak-abrik bengkelku! Ada yang membayar mereka. Seseorang yang punya lencana.'], ['rook', 'Tetap tiarap. Telepon aku kalau mereka kembali.'], ['ines', 'Ambil SMG di bawah meja. Pergi.']],
     o: ['Habisi Gator Boys: sisa {n}.'], e: [['ines', 'Mereka menunggumu, Rook. Harlan ingin kamu lenyap.']] },
   { n: 'Kejar Buku Besar', b: [['ines', 'Buku besar Harlan dipindahkan dari kantor polisi ke dermaga barang bukti dalam dua menit.'], ['rook', 'Kalau begitu aku sampai duluan.']],
     o: ['Lewati pos pemeriksaan sebelum pemindahan: {n}/6.'], e: [['rook', 'Setiap suap yang diterima Harlan. Dan setiap yang dibayar Coral.']] },
   { n: 'Palmera Heat', b: [['coral', 'Kamu membaca bukuku, sopir. Aku dan Harlan punya kesepakatan, dan kamu tidak termasuk.'], ['harlan', 'Semua unit: Rook Navarro bersenjata dan berbahaya. Bawa dia. Atau jangan.']],
     o: ['Hancurkan mobil pengejar hitam milik Harlan.', 'Bawa buku itu ke dermaga selatan. Wartawan menunggu.'], e: [['ines', 'Ada di semua saluran. Harlan diborgol, kapal Coral disita, dan utangnya lunas.'], ['rook', 'Palmera tenang malam ini. Biarkan begitu. Untuk sementara.']] }
  ]
 }
};

/* ---------- world constants ---------- */
const TS = 48, MW = 96, MH = 96, TAU = Math.PI * 2;
const WATER = 0, SAND = 1, GRASS = 2, ROAD = 3, WALK = 4, BLD = 5, PARK = 6, LOT = 7, BRIDGE = 8, MARSH = 9, DOCK = 10, POOL = 11;
const SOLID = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
const PEDOK = [0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0];
const RD = k => 6 + 12 * k;
const BRIDGES = [1, 3, 6];
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

const CARS = {
  sedan: { L: 46, W: 22, maxV: 340, acc: 270, turn: 2.6, grip: 7, hp: 100 },
  taxi: { L: 46, W: 22, maxV: 340, acc: 270, turn: 2.6, grip: 7, hp: 100 },
  sports: { L: 46, W: 21, maxV: 480, acc: 430, turn: 3.0, grip: 7.5, hp: 80 },
  muscle: { L: 50, W: 23, maxV: 430, acc: 380, turn: 2.5, grip: 5.2, hp: 110 },
  van: { L: 56, W: 25, maxV: 280, acc: 210, turn: 2.1, grip: 7, hp: 160 },
  pickup: { L: 52, W: 24, maxV: 330, acc: 270, turn: 2.3, grip: 6.5, hp: 130 },
  police: { L: 48, W: 23, maxV: 440, acc: 390, turn: 2.8, grip: 7.5, hp: 140 },
  interceptor: { L: 50, W: 23, maxV: 470, acc: 430, turn: 3.0, grip: 8, hp: 230 },
  phantom: { L: 48, W: 23, maxV: 470, acc: 440, turn: 3.0, grip: 8, hp: 170 }
};
const CAR_COLS = ['#c8ccd4', '#2b2f3a', '#a3222b', '#1f5fa8', '#e8e2d0', '#3c7d4f', '#d97a2b', '#6b3fa0', '#f2c230', '#8a8f99', '#1aa7a0', '#e45b8f'];
const WEAP = {
  fist: { dmg: 14, cd: .35, range: 30, spread: 0 },
  pistol: { dmg: 22, cd: .32, range: 520, spread: .035, snd: 'pistol' },
  smg: { dmg: 12, cd: .085, range: 460, spread: .09, snd: 'smg' },
  shotgun: { dmg: 13, cd: .8, range: 300, spread: .2, pellets: 6, snd: 'shotgun' }
};
const WORDER = ['fist', 'pistol', 'smg', 'shotgun'];

/* ---------- city generation (fixed seed: Palmera is the same city every visit) ---------- */
function genCity() {
  const r = mulberry(19112026);
  const t = new Uint8Array(MW * MH).fill(GRASS);
  const S = (x, y, v) => { if (x >= 0 && y >= 0 && x < MW && y < MH) t[y * MW + x] = v; };
  const G = (x, y) => (x < 0 || y < 0 || x >= MW || y >= MH) ? WATER : t[y * MW + x];
  const blds = [], trees = [], lamps = [], spots = [], deco = [];
  const pick = a => a[Math.floor(r() * a.length)];
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    let v = GRASS;
    if (y <= 2 || y >= 92 || x <= 1 || x >= 86) v = WATER;
    else if (y <= 5 || x >= 80) v = SAND;
    else if (x <= 5) v = MARSH;
    t[y * MW + x] = v;
  }
  for (let k = 0; k <= 7; k++) for (const y of [RD(k), RD(k) + 1]) for (let x = 6; x <= 79; x++) S(x, y, ROAD);
  for (let k = 0; k <= 6; k++) for (const x of [RD(k), RD(k) + 1]) for (let y = 6; y <= 91; y++) S(x, y, ROAD);
  const addB = (x, y, w, h, ht, o) => { const b = Object.assign({ x, y, w, h, ht }, o); blds.push(b); for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) S(i, j, BLD); return b; };
  const ring = (x0, y0) => { for (let i = 0; i < 10; i++) { S(x0 + i, y0, WALK); S(x0 + i, y0 + 9, WALK); S(x0, y0 + i, WALK); S(x0 + 9, y0 + i, WALK); } for (const [lx, ly] of [[0, 0], [9, 0], [0, 9], [9, 9], [4, 0], [4, 9], [0, 4], [9, 4]]) lamps.push({ x: (x0 + lx + .5) * TS, y: (y0 + ly + .5) * TS }); };
  const fill = (x0, y0, w, h, v) => { for (let j = y0; j < y0 + h; j++) for (let i = x0; i < x0 + w; i++) S(i, j, v); };
  const palm = (tx, ty, s) => trees.push({ x: (tx + .5) * TS + (r() - .5) * 18, y: (ty + .5) * TS + (r() - .5) * 18, s: s || .8 + r() * .5, k: 'palm', a: r() * TAU });
  const district = (i, j) => j === 3 ? 'cn' : i === 5 ? 'os' : j <= 2 ? (i <= 1 ? 'lp' : 'gh') : (i <= 1 ? 'gf' : 'pm');
  const special = { '0,0': 'prison', '1,2': 'park', '3,1': 'hospital', '4,1': 'park', '4,2': 'police', '2,2': 'gunshop', '3,0': 'tower', '1,5': 'garage', '0,4': 'clinic', '4,6': 'coral', '2,1': 'warehouse' };
  for (let j = 0; j <= 6; j++) for (let i = 0; i <= 5; i++) {
    const x0 = RD(i) + 2, y0 = RD(j) + 2, ix = x0 + 1, iy = y0 + 1, d = district(i, j), sp = special[i + ',' + j];
    if (d === 'cn') continue;
    ring(x0, y0);
    if (sp === 'prison') { fill(ix, iy, 8, 8, LOT); addB(ix + 1, iy, 6, 5, .24, { roof: '#6d7378', wall: '#868c91', kind: 'prison' }); spots.push({ x: (ix + 2) * TS, y: (iy + 6.6) * TS, a: 0 }, { x: (ix + 5.5) * TS, y: (iy + 6.6) * TS, a: 0, type: 'muscle' }); continue; }
    if (sp === 'park') { fill(ix, iy, 8, 8, PARK); deco.push({ k: 'fountain', x: (ix + 4) * TS, y: (iy + 4) * TS }); for (let n = 0; n < 9; n++) palm(ix + Math.floor(r() * 8), iy + Math.floor(r() * 8)); continue; }
    if (sp === 'hospital') { fill(ix, iy, 8, 8, LOT); addB(ix, iy, 8, 5, .42, { roof: '#eef2f4', wall: '#cfd8dc', kind: 'hospital' }); for (let n = 0; n < 3; n++) spots.push({ x: (ix + 1.5 + n * 2.4) * TS, y: (iy + 6.5) * TS, a: Math.PI / 2 }); continue; }
    if (sp === 'police') { fill(ix, iy, 8, 8, LOT); addB(ix, iy, 8, 4, .38, { roof: '#2c4a7c', wall: '#3d5f96', kind: 'police' }); for (let n = 0; n < 4; n++) spots.push({ x: (ix + .8 + n * 2) * TS, y: (iy + 6) * TS, a: -Math.PI / 2, type: 'police' }); continue; }
    if (sp === 'gunshop') { fill(ix, iy, 8, 8, LOT); addB(ix, iy, 5, 4, .2, { roof: '#3a3532', wall: '#4d4642', kind: 'gunshop', sign: 'GUNS', sc: '#ff8a1e' }); addB(ix + 5, iy, 3, 8, .55, { roof: '#2e4258', wall: '#3c556f', kind: 'glass' }); addB(ix, iy + 5, 4, 3, .5, { roof: '#34506b', wall: '#456684', kind: 'glass' }); continue; }
    if (sp === 'tower') { fill(ix, iy, 8, 8, LOT); addB(ix + 1, iy + 1, 6, 6, 1.05, { roof: '#9fb4c8', wall: '#6c8aa6', kind: 'tower', sign: 'GLASS', sc: '#d9f1ff' }); continue; }
    if (sp === 'warehouse') { fill(ix, iy, 8, 8, LOT); addB(ix, iy, 8, 5, .2, { roof: '#5d6168', wall: '#6f747c', kind: 'warehouse' }); continue; }
    if (sp === 'garage') { fill(ix, iy, 8, 8, LOT); addB(ix + 1, iy, 6, 4, .16, { roof: '#5b3a2a', wall: '#7a4e36', kind: 'garage', sign: 'INES', sc: '#ff4fa0' }); addB(ix, iy + 6, 2, 2, .1, { roof: '#5a5f45', wall: '#6e6a50', kind: 'shack' }); palm(ix + 7, iy + 7); continue; }
    if (sp === 'clinic') { fill(ix, iy, 8, 8, MARSH); fill(ix + 1, iy + 1, 6, 6, LOT); addB(ix + 1, iy + 1, 6, 3, .18, { roof: '#e8eef0', wall: '#c4cdd1', kind: 'hospital' }); continue; }
    if (sp === 'coral') { fill(ix, iy, 8, 8, LOT); addB(ix, iy, 8, 5, .26, { roof: '#3b2f3a', wall: '#523f4f', kind: 'coral', sign: 'CORAL', sc: '#ff5f7a' }); continue; }
    if (d === 'gh') {
      fill(ix, iy, 8, 8, LOT);
      for (const [qx, qy] of [[0, 0], [4, 0], [0, 4], [4, 4]]) {
        if (r() < .22) { palm(ix + qx + 1, iy + qy + 1); palm(ix + qx + 2, iy + qy + 2); continue; }
        const g = pick([['#2c3e57', '#3d5675'], ['#2f4f5f', '#3f6a7c'], ['#3b4a5e', '#55657c'], ['#24364a', '#355070'], ['#4a4e5c', '#5d6375']]);
        addB(ix + qx + (r() < .5 ? 0 : 1), iy + qy + (r() < .5 ? 0 : 1), 3, 3, .45 + r() * .45, { roof: g[0], wall: g[1], kind: 'glass', heli: r() < .25 });
      }
    } else if (d === 'os') {
      fill(ix, iy, 8, 8, LOT);
      const pc = ['#f7a8c4', '#9fe3d1', '#c8b6ff', '#ffd59e', '#a8d8ff', '#ffb3a1'];
      const neon = ['#ff3fa4', '#39f3ff', '#ffe23a', '#7dff6a', '#ff7a3a'];
      const signs = ['FLAMINGO', 'SUNSET', 'CORAL INN', 'PALMS', 'NEPTUNE', 'LA MAREA', 'STARLITE', 'DELUXE'];
      addB(ix, iy, 8, 3, .28 + r() * .14, { roof: '#f4efe6', wall: pick(pc), kind: 'hotel', sign: pick(signs), sc: pick(neon) });
      fill(ix + 2, iy + 4, 4, 2, POOL); palm(ix, iy + 4); palm(ix + 7, iy + 5);
      for (let n = 0; n < 3; n++) spots.push({ x: (ix + 1 + n * 2.6) * TS, y: (iy + 7) * TS, a: 0 });
    } else if (d === 'lp') {
      for (const [qx, qy] of [[0, 0], [4, 0], [0, 4], [4, 4]]) {
        const hx = ix + qx + (r() < .5 ? 0 : 1), hy = iy + qy;
        addB(hx, hy, 3, 2, .11 + r() * .05, { roof: pick(['#b5543a', '#9b3f2c', '#c96b45', '#8a4a3a', '#6f6a8f']), wall: pick(['#efe3cc', '#f3d9c4', '#d8e6d2', '#f0eadb']), kind: 'house' });
        if (r() < .6) { S(ix + qx + 1, iy + qy + 3, POOL); S(ix + qx + 2, iy + qy + 3, POOL); } else palm(ix + qx + 1, iy + qy + 3);
        if (r() < .5) spots.push({ x: (ix + qx + 3.4) * TS, y: (iy + qy + 3) * TS, a: Math.PI / 2 });
      }
    } else if (d === 'gf') {
      fill(ix, iy, 8, 8, MARSH);
      for (let n = 0; n < 2; n++) addB(ix + 1 + n * 4, iy + 1 + Math.floor(r() * 4), 2, 2, .08 + r() * .05, { roof: pick(['#5a5f45', '#6b5a3a', '#4f5a52']), wall: '#6e5a40', kind: 'shack' });
      for (let n = 0; n < 6; n++) trees.push({ x: (ix + r() * 8) * TS, y: (iy + r() * 8) * TS, s: .8 + r() * .6, k: 'cypress', a: r() * TAU });
      spots.push({ x: (ix + 4) * TS, y: (iy + 6.5) * TS, a: r() * TAU, type: 'pickup' });
    } else if (d === 'pm') {
      fill(ix, iy, 8, 8, LOT);
      if (r() < .4) addB(ix, iy, 8, 4, .2, { roof: '#5d6168', wall: '#6f747c', kind: 'warehouse' });
      const cc = ['#b0392b', '#2e76b1', '#d6762a', '#2f8f57', '#7d4aa0', '#c9a20f'];
      for (let row = 0; row < 8; row += 2) for (let col = 0; col < 8; col += 3) {
        if (G(ix + col, iy + row) !== LOT || G(ix + col + 1, iy + row) !== LOT || r() < .35) continue;
        addB(ix + col, iy + row, 2, 1, .08 + Math.floor(r() * 3) * .05, { roof: pick(cc), wall: '#3a3d44', kind: 'container' });
      }
      spots.push({ x: (ix + 7) * TS, y: (iy + 7) * TS, a: 0, type: 'van' });
    }
  }
  /* canal between the 4th and 5th avenues */
  for (let x = 0; x < MW; x++) for (let y = 44; y <= 53; y++) {
    const onRoadCol = x <= 79 && x >= 6 && ((x - 6) % 12 === 0 || (x - 7) % 12 === 0);
    const k = Math.floor((x - 6) / 12);
    if (y >= 46 && y <= 51) { S(x, y, onRoadCol && BRIDGES.includes(k) ? BRIDGE : WATER); continue; }
    if (onRoadCol && BRIDGES.includes(k)) { S(x, y, ROAD); continue; }
    if (x >= 2 && x <= 85) S(x, y, WALK);
    else S(x, y, WATER);
  }
  for (let x = 8; x < 80; x += 5) if (G(x, 44) === WALK) { palm(x, 44, .7); lamps.push({ x: (x + .5) * TS, y: 45.5 * TS }); }
  /* south pier and beach palms */
  for (let y = 92; y <= 94; y++) for (let x = 70; x <= 73; x++) S(x, y, DOCK);
  for (let y = 7; y < 90; y += 3) palm(82 + Math.floor(r() * 3), y);
  for (let x = 6; x < 80; x += 4) palm(x, 4, .7);
  for (let y = 7; y < 90; y += 5) trees.push({ x: (2.5 + r() * 3) * TS, y: y * TS, s: 1, k: 'cypress', a: 0 });
  for (let y = 10; y < 90; y += 9) deco.push({ k: 'umbrella', x: 84.5 * TS, y: y * TS, c: pick(['#ff5f7a', '#39c6ff', '#ffd23a']) });
  /* road graph: intersections and the lanes between them */
  const node = (k, l) => ({ k, l, x: (RD(k) + 1) * TS, y: (RD(l) + 1) * TS, n: [] });
  const N = [];
  for (let k = 0; k <= 6; k++) { N[k] = []; for (let l = 0; l <= 7; l++) N[k][l] = node(k, l); }
  const isRoadT = (x, y) => { const v = G(x, y); return v === ROAD || v === BRIDGE; };
  for (let k = 0; k <= 6; k++) for (let l = 0; l <= 7; l++) {
    if (k < 6) { let ok = true; for (let x = RD(k) + 2; x < RD(k + 1); x++) if (!isRoadT(x, RD(l)) || !isRoadT(x, RD(l) + 1)) ok = false; if (ok) { N[k][l].n.push(N[k + 1][l]); N[k + 1][l].n.push(N[k][l]); } }
    if (l < 7) { let ok = true; for (let y = RD(l) + 2; y < RD(l + 1); y++) if (!isRoadT(RD(k), y) || !isRoadT(RD(k) + 1, y)) ok = false; if (ok) { N[k][l].n.push(N[k][l + 1]); N[k][l + 1].n.push(N[k][l]); } }
  }
  const nodes = N.flat().filter(n => n.n.length);
  return { t, G, blds, trees, lamps, spots, deco, N, nodes, district };
}

/* ---------- audio: engine, sirens, guns and two synthesized radio stations ---------- */
function makeAudio(save) {
  let ac = null, master, music, sfxG, eng, engF, engG, sir, sirG, noiseBuf, sched = null, station = save.radio == null ? 0 : save.radio, nextBar = 0, bar = 0;
  const STATIONS = ['Palmera Wave 101.5', 'Gator Funk 88.1'];
  function init() {
    if (ac) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC(); master = ac.createGain(); master.gain.value = save.mute ? 0 : .9; master.connect(ac.destination);
    sfxG = ac.createGain(); sfxG.gain.value = .8; sfxG.connect(master);
    music = ac.createGain(); music.gain.value = 0; music.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    eng = ac.createOscillator(); eng.type = 'sawtooth'; engF = ac.createBiquadFilter(); engF.type = 'lowpass'; engF.frequency.value = 420; engG = ac.createGain(); engG.gain.value = 0;
    eng.connect(engF); engF.connect(engG); engG.connect(sfxG); eng.start();
    sir = ac.createOscillator(); sir.type = 'square'; const sf = ac.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 1800; sirG = ac.createGain(); sirG.gain.value = 0;
    sir.connect(sf); sf.connect(sirG); sirG.connect(sfxG); sir.start();
    sched = setInterval(tick, 90);
  }
  const N = () => { const s = ac.createBufferSource(); s.buffer = noiseBuf; return s; };
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function tone(type, f, t, dur, vol, dest, f2) { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur); env(g, t, .005, vol, dur); o.connect(g); g.connect(dest || sfxG); o.start(t); o.stop(t + dur + .05); }
  function noise(t, dur, vol, freq, q, dest, type) { const s = N(), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1; env(g, t, .003, vol, dur); s.connect(f); f.connect(g); g.connect(dest || sfxG); s.start(t, Math.random() * .5); s.stop(t + dur + .05); }
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function tick() {
    if (!ac || station >= STATIONS.length || music.gain.value < .001) { if (ac) nextBar = Math.max(nextBar, ac.currentTime + .1); return; }
    while (nextBar < ac.currentTime + .4) { (station === 0 ? synthwave : funk)(nextBar, bar++); nextBar += station === 0 ? 4 * 60 / 104 : 4 * 60 / 96; }
  }
  function synthwave(t0, b) {
    const beat = 60 / 104, roots = [45, 41, 48, 43], root = roots[b % 4], ch = [[0, 3, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7]][b % 4];
    for (let i = 0; i < 16; i++) { const t = t0 + i * beat / 4; tone('sawtooth', mtof(root - 12 + (i % 2 ? 12 : 0)), t, beat / 4 * .9, .07, music); }
    for (const n of ch) for (const det of [-6, 6]) { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = mtof(root + 12 + n); o.detune.value = det; f.type = 'lowpass'; f.frequency.value = 1300; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(.022, t0 + .5); g.gain.linearRampToValueAtTime(0.0001, t0 + beat * 4); o.connect(f); f.connect(g); g.connect(music); o.start(t0); o.stop(t0 + beat * 4 + .05); }
    for (let i = 0; i < 4; i++) { const t = t0 + i * beat; tone('sine', 120, t, .3, .5, music, 40); if (i % 2) { noise(t, .25, .25, 1800, .7, music); } noise(t + beat / 2, .05, .08, 8000, .5, music, 'highpass'); noise(t, .05, .06, 8000, .5, music, 'highpass'); }
    if (b % 2) { const sc = [0, 3, 5, 7, 10, 12]; for (let i = 0; i < 4; i++) if (Math.random() < .7) tone('square', mtof(root + 24 + sc[Math.floor(Math.random() * sc.length)]), t0 + i * beat + (Math.random() < .3 ? beat / 2 : 0), beat * .8, .025, music); }
  }
  function funk(t0, b) {
    const beat = 60 / 96, root = [28, 28, 33, 31][b % 4], pat = [0, null, 12, 0, null, 7, null, 10, 0, null, 12, null, 3, 5, null, 7];
    pat.forEach((p, i) => { if (p == null) return; const t = t0 + i * beat / 4; const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'square'; o.frequency.value = mtof(root + 12 + p); f.type = 'lowpass'; f.frequency.setValueAtTime(1600, t); f.frequency.exponentialRampToValueAtTime(220, t + .15); env(g, t, .004, .09, .16); o.connect(f); f.connect(g); g.connect(music); o.start(t); o.stop(t + .25); });
    for (const i of [2, 6, 10, 14]) for (const n of [10, 14, 19]) tone('square', mtof(root + 36 + n), t0 + i * beat / 4, .09, .018, music);
    for (const i of [0, 3, 8, 10]) tone('sine', 110, t0 + i * beat / 4, .25, .5, music, 45);
    for (const i of [4, 12]) noise(t0 + i * beat / 4, .18, .28, 2000, .8, music);
    for (let i = 0; i < 16; i++) noise(t0 + i * beat / 4, .03, i % 2 ? .04 : .07, 9000, .5, music, 'highpass');
  }
  return {
    init, STATIONS,
    get station() { return station; },
    setStation(s) { station = s; save.radio = s; if (ac) nextBar = ac.currentTime + .05; },
    radio(on) { if (!ac) return; music.gain.setTargetAtTime(on && station < STATIONS.length ? .55 : 0, ac.currentTime, .3); },
    engine(on, v, thr) { if (!ac) return; const t = ac.currentTime; engG.gain.setTargetAtTime(on ? .045 + Math.min(.04, Math.abs(v) / 9000) : 0, t, .08); eng.frequency.setTargetAtTime(32 + Math.abs(v) * .16 + thr * 12, t, .06); engF.frequency.setTargetAtTime(300 + Math.abs(v) * 1.4, t, .1); },
    siren(vol, tt) { if (!ac) return; const t = ac.currentTime; sirG.gain.setTargetAtTime(vol * .05, t, .1); sir.frequency.setTargetAtTime(Math.floor(tt / .45) % 2 ? 660 : 900, t, .02); },
    sfx(k, vol) {
      if (!ac || save.mute) return; const t = ac.currentTime, v = vol == null ? 1 : vol;
      if (k === 'pistol') { noise(t, .18, .7 * v, 900, .6); tone('square', 180, t, .06, .2 * v, null, 60); }
      else if (k === 'smg') { noise(t, .09, .45 * v, 1300, .7); }
      else if (k === 'shotgun') { noise(t, .35, .9 * v, 500, .5); tone('sine', 90, t, .25, .5 * v, null, 40); }
      else if (k === 'punch') { noise(t, .08, .5 * v, 300, 1); }
      else if (k === 'crash') { noise(t, .3, .8 * v, 250, .8); noise(t, .15, .4 * v, 3000, 2); }
      else if (k === 'boom') { noise(t, 1.4, 1 * v, 160, .5, null, 'lowpass'); tone('sine', 80, t, .9, .7 * v, null, 25); }
      else if (k === 'pick') { tone('square', 880, t, .08, .12); tone('square', 1320, t + .07, .12, .12); }
      else if (k === 'cash') { tone('triangle', 1568, t, .08, .2); tone('triangle', 2093, t + .06, .15, .2); }
      else if (k === 'pass') { [0, 4, 7, 12, 16].forEach((n, i) => tone('sawtooth', mtof(60 + n), t + i * .09, .5, .09)); }
      else if (k === 'fail') { [7, 3, 0, -5].forEach((n, i) => tone('sawtooth', mtof(55 + n), t + i * .16, .5, .08)); }
      else if (k === 'horn') { tone('square', 392, t, .35, .12); tone('square', 494, t, .35, .1); }
      else if (k === 'door') { noise(t, .1, .4, 600, 2); }
      else if (k === 'hurt') { tone('sawtooth', 220, t, .18, .15, null, 140); }
      else if (k === 'scream') { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(520 + Math.random() * 200, t); o.frequency.linearRampToValueAtTime(380, t + .6); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 3; env(g, t, .02, .18 * v, .6); o.connect(f); f.connect(g); g.connect(sfxG); o.start(t); o.stop(t + .7); }
      else if (k === 'click') { tone('square', 1200, t, .03, .08); }
    },
    setMute(m) { save.mute = m; if (master) master.gain.setTargetAtTime(m ? 0 : .9, ac.currentTime, .05); },
    suspend(s) { if (!ac) return; s ? ac.suspend() : ac.resume(); }
  };
}

/* ---------- the game ---------- */
function mount(host, opts) {
  opts = opts || {};
  const lang = LANG[opts.lang] ? opts.lang : 'en', L = LANG[lang];
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k]);
  const money$ = n => '$' + Math.round(n).toLocaleString('en-US');
  const SAVE_KEY = 'ph-save';
  let save; try { save = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { save = {}; }
  save = Object.assign({ m: 0, money: 200, ammo: { pistol: 36, smg: 0, shotgun: 0 }, mute: false, radio: 0, debt: 50000 }, save);
  const store = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} };

  host.innerHTML = '';
  const cv = document.createElement('canvas'); cv.style.cssText = 'width:100%;height:100%;display:block;touch-action:none;outline:none'; cv.tabIndex = 0; host.appendChild(cv);
  const c = cv.getContext('2d');
  const lc = document.createElement('canvas'), lx = lc.getContext('2d');
  let W = 800, H = 600, DPR = 1;
  function resize() { const r = host.getBoundingClientRect(); DPR = Math.min(2, window.devicePixelRatio || 1); W = Math.max(320, r.width); H = Math.max(300, r.height); cv.width = W * DPR; cv.height = H * DPR; lc.width = cv.width; lc.height = cv.height; }
  resize(); const ro = window.ResizeObserver ? new ResizeObserver(resize) : null; ro ? ro.observe(host) : addEventListener('resize', resize);

  const city = genCity(), T = city.t;
  const tileAt = (x, y) => city.G(Math.floor(x / TS), Math.floor(y / TS));
  const solidPx = (x, y) => SOLID[tileAt(x, y)] === 1;
  const audio = makeAudio(save);
  const touch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;

  /* key places */
  const front = (i, j) => ({ x: (RD(i) + 7) * TS, y: (RD(j + 1) - .5) * TS });
  const road = (i, j) => ({ x: (RD(i) + 7) * TS, y: (RD(j + 1) + 1) * TS });
  const PL = {
    prison: front(0, 0), garage: road(1, 5), garageWalk: front(1, 5), vesper: { x: (RD(5) + 9.5) * TS, y: (RD(1) + 7.5) * TS }, dock: front(4, 6), coralRoad: road(4, 6),
    van: { x: (RD(3) + 9) * TS, y: (RD(6) + .5) * TS }, warehouse: road(2, 1), tower: road(3, 0), towerWalk: front(3, 0), police: road(4, 2), gunshop: front(2, 2),
    hospitals: [front(3, 1), front(0, 4)], pier: { x: 72 * TS, y: 93.5 * TS }, bridge: { x: (RD(3) + 1) * TS, y: 49 * TS },
    packages: [[11, 45], [27, 52], [36, 44.5], [50, 52.5], [61, 45]].map(([x, y]) => ({ x: x * TS, y: y * TS })),
    race: [[6, 1], [3, 0], [1, 2], [1, 'b'], [3, 6]].map(([k, l]) => ({ x: (RD(k) + 1) * TS, y: l === 'b' ? 49 * TS : (RD(l) + 1) * TS })).concat([{ x: 72 * TS, y: 93.5 * TS }])
  };

  /* ---------- entities ---------- */
  let cars = [], peds = [], parts = [], tracers = [], pickups = [], marks = [], toasts = [], events = [], decals = [];
  let uid = 1;
  const P = { id: 0, x: PL.prison.x, y: PL.prison.y, a: Math.PI / 2, vx: 0, vy: 0, hp: 100, armor: 0, kind: 'player', walk: 0, car: null, weapon: 'fist', cool: 0, look: { skin: '#c68a5a', shirt: '#d8343b', pants: '#2a2c36', hair: '#15110f', hat: 'cap', flower: true } };
  const S = { mode: 'menu', t: 0, clock: 10 * 60, wanted: 0, hidden: 0, seenT: 0, shake: 0, cam: { x: P.x, y: P.y, z: 1 }, mission: null, wp: null, gps: null, gpsTarget: null, district: '', distT: 0, menuSel: 0, deadT: 0, deadKind: '', field: null, fieldT: 0, sprayCD: 0, banner: null, free: false, heliT: 0, lastFire: -9, shopCD: 0, endT: 0 };
  const heli = { on: false, x: 0, y: 0, a: 0, cool: 2 };

  function toast(s, col, dur) { toasts.push({ s, col: col || '#fff', t: dur || 2.6 }); if (toasts.length > 4) toasts.shift(); }
  const looks = () => ({ skin: ['#f1c9a5', '#d9a477', '#b97a50', '#8d5a3b', '#5e3b26', '#e8b98f'][Math.floor(Math.random() * 6)], shirt: ['#3fa7d6', '#f2f2f2', '#f4a259', '#5b8e7d', '#bc4b51', '#8cb369', '#e07be0', '#f4e285', '#2b2d42', '#ef767a'][Math.floor(Math.random() * 10)], pants: ['#2b2d42', '#4a4e69', '#8d99ae', '#3d405b', '#d6c7a1'][Math.floor(Math.random() * 5)], hair: ['#15110f', '#4b3621', '#a0522d', '#d6b370', '#777'][Math.floor(Math.random() * 5)], hat: Math.random() < .15 ? 'cap' : Math.random() < .1 ? 'straw' : null });
  function mkPed(x, y, kind, o) {
    const p = Object.assign({ id: uid++, x, y, a: Math.random() * TAU, vx: 0, vy: 0, hp: kind === 'cop' ? 60 : kind === 'gang' ? 55 : 35, kind, walk: Math.random() * 9, dir: Math.floor(Math.random() * 4), t: 0, flee: 0, cool: 1 + Math.random(), weapon: kind === 'cop' || kind === 'gang' ? 'pistol' : 'fist', look: looks(), dead: false, deadT: 0, cuff: 0 }, o || {});
    if (kind === 'cop') p.look = { skin: p.look.skin, shirt: '#1e3a6e', pants: '#14213d', hair: '#111', hat: 'cop' };
    if (kind === 'gang') p.look = { skin: p.look.skin, shirt: '#3a7d2c', pants: '#2b2b22', hair: '#111', hat: 'bandana' };
    peds.push(p); return p;
  }
  function mkCar(type, x, y, a, o) {
    const sp = CARS[type];
    const car = Object.assign({ id: uid++, type, x, y, a, vx: 0, vy: 0, steer: 0, thr: 0, hb: false, hp: sp.hp, maxHp: sp.hp, driver: null, ai: 'idle', from: null, to: null, col: type === 'taxi' ? '#f2c230' : type === 'police' ? '#f3f5f8' : type === 'interceptor' ? '#15171c' : type === 'phantom' ? '#cfd6df' : CAR_COLS[Math.floor(Math.random() * CAR_COLS.length)], fire: 0, dead: false, deadT: 0, stuck: 0, rev: 0, cruise: 150 + Math.random() * 70, honk: 0, siren: false, crew: 0, block: 0 }, o || {});
    cars.push(car); return car;
  }
  const carSpec = car => CARS[car.type];
  const carSpeed = car => Math.hypot(car.vx, car.vy);
  const fwdV = car => car.vx * Math.cos(car.a) + car.vy * Math.sin(car.a);

  /* ---------- traffic ---------- */
  function laneTarget(car) {
    const dx = car.to.x - car.from.x, dy = car.to.y - car.from.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const nx = -uy, ny = ux, ox = car.from.x + nx * 24, oy = car.from.y + ny * 24;
    let s = (car.x - ox) * ux + (car.y - oy) * uy; s = clamp(s + 70, 0, len);
    return { x: ox + ux * s, y: oy + uy * s, rem: len - ((car.x - ox) * ux + (car.y - oy) * uy), ux, uy };
  }
  function nextNode(car, mode) {
    const opts = car.to.n.filter(n => n !== car.from);
    const list = opts.length ? opts : car.to.n;
    let nx;
    if (mode === 'flee') { const tgt = P.car || P; nx = list.map(n => ({ n, s: Math.hypot(n.x - tgt.x, n.y - tgt.y) + Math.random() * 500 })).sort((a, b) => b.s - a.s)[0].n; }
    else nx = list[Math.floor(Math.random() * list.length)];
    car.from = car.to; car.to = nx;
  }
  function spawnTraffic() {
    const live = cars.filter(c => c.ai === 'traffic').length;
    const want = touch ? 14 : 20;
    if (live >= want) return;
    const ref = P.car || P;
    for (let tries = 0; tries < 6; tries++) {
      const a = city.nodes[Math.floor(Math.random() * city.nodes.length)];
      const b = a.n[Math.floor(Math.random() * a.n.length)];
      const s = .2 + Math.random() * .6, x0 = lerp(a.x, b.x, s), y0 = lerp(a.y, b.y, s);
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
      const x = x0 + nx * 24, y = y0 + ny * 24, d = Math.hypot(x - ref.x, y - ref.y);
      const vw = Math.max(W, H) / S.cam.z / 2;
      if (d < vw + 120 || d > vw + 900) continue;
      if (cars.some(o => Math.hypot(o.x - x, o.y - y) < 90)) continue;
      const rr = Math.random(), dd = city.district(Math.min(5, Math.floor((x / TS - 8) / 12)), Math.floor((y / TS - 8) / 12));
      const type = rr < .38 ? 'sedan' : rr < .5 ? 'taxi' : rr < .6 ? 'pickup' : rr < .7 ? (dd === 'pm' ? 'van' : 'sedan') : rr < .78 ? 'van' : rr < .9 ? (dd === 'os' || dd === 'gh' ? 'sports' : 'muscle') : rr < .97 ? 'muscle' : 'phantom';
      const car = mkCar(type, x, y, Math.atan2(dy, dx), { ai: 'traffic', driver: 'npc', from: a, to: b });
      car.vx = Math.cos(car.a) * car.cruise * .6; car.vy = Math.sin(car.a) * car.cruise * .6;
      return;
    }
  }
  function spawnParked() {
    const ref = P.car || P;
    for (const sp of city.spots) {
      const d = Math.hypot(sp.x - ref.x, sp.y - ref.y);
      if (sp.car && (sp.car.dead || !cars.includes(sp.car) || sp.car.driver)) sp.car = null;
      if (!sp.car && d < 1300 && !sp.cool) {
        const type = sp.type || (Math.random() < .2 ? 'sports' : Math.random() < .3 ? 'pickup' : 'sedan');
        sp.car = mkCar(type, sp.x, sp.y, sp.a, { ai: 'parked' }); sp.cool = 1;
      }
      if (d > 1800) { if (sp.car && sp.car.ai === 'parked') { cars.splice(cars.indexOf(sp.car), 1); sp.car = null; } sp.cool = 0; }
    }
  }
  function spawnPeds() {
    const live = peds.filter(p => p.kind === 'civ' && !p.dead).length, want = touch ? 18 : 26;
    if (live >= want) return;
    const ref = P.car || P, vw = Math.max(W, H) / S.cam.z / 2;
    for (let tries = 0; tries < 12; tries++) {
      const ang = Math.random() * TAU, d = vw + 60 + Math.random() * 500, x = ref.x + Math.cos(ang) * d, y = ref.y + Math.sin(ang) * d;
      const tt = tileAt(x, y);
      if (!PEDOK[tt] || tt === MARSH && Math.random() < .7) continue;
      const tx = Math.floor(x / TS), ty = Math.floor(y / TS);
      mkPed((tx + .5) * TS, (ty + .5) * TS, 'civ'); return;
    }
  }
  function despawn() {
    const ref = P.car || P;
    const keep = o => o.tag || o === P.car;
    cars = cars.filter(c => keep(c) || c.ai === 'parked' || Math.hypot(c.x - ref.x, c.y - ref.y) < 2100 && !(c.dead && c.deadT > 40));
    peds = peds.filter(p => p.tag || Math.hypot(p.x - ref.x, p.y - ref.y) < 1700 && !(p.dead && p.deadT > 25));
    decals = decals.filter(d => (d.t -= 0) > -1 && Math.hypot(d.x - ref.x, d.y - ref.y) < 2200).slice(-160);
  }

  /* ---------- BFS distance fields (cops, GPS) ---------- */
  function bfs(tx, ty) {
    const d = new Int16Array(MW * MH).fill(-1), q = new Int32Array(MW * MH); let h = 0, e = 0;
    tx = clamp(tx, 0, MW - 1); ty = clamp(ty, 0, MH - 1);
    d[ty * MW + tx] = 0; q[e++] = ty * MW + tx;
    while (h < e) { const i = q[h++], x = i % MW, y = (i / MW) | 0, nd = d[i] + 1; for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + ax, ny = y + ay; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const j = ny * MW + nx; if (d[j] >= 0 || SOLID[T[j]]) continue; d[j] = nd; q[e++] = j; } }
    return d;
  }
  function fieldStep(field, x, y, look) {
    let tx = Math.floor(x / TS), ty = Math.floor(y / TS);
    for (let s = 0; s < (look || 2); s++) {
      let best = field[ty * MW + tx], bx = tx, by = ty;
      for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = tx + ax, ny = ty + ay; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const v = field[ny * MW + nx]; if (v >= 0 && (best < 0 || v < best)) { best = v; bx = nx; by = ny; } }
      tx = bx; ty = by;
    }
    return { x: (tx + .5) * TS, y: (ty + .5) * TS };
  }
  function setGps(target) {
    if (!target) { S.gps = null; S.gpsTarget = null; return; }
    if (S.gpsTarget && S.gpsTarget.x === target.x && S.gpsTarget.y === target.y) return;
    S.gpsTarget = { x: target.x, y: target.y }; S.gps = bfs(Math.floor(target.x / TS), Math.floor(target.y / TS));
  }
  function gpsPath(max) {
    if (!S.gps) return [];
    const ref = P.car || P; let tx = Math.floor(ref.x / TS), ty = Math.floor(ref.y / TS);
    const out = [{ x: (tx + .5) * TS, y: (ty + .5) * TS }];
    for (let i = 0; i < max; i++) {
      let best = S.gps[ty * MW + tx], bx = tx, by = ty;
      if (best === 0) break;
      for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = tx + ax, ny = ty + ay; if (nx < 0 || ny < 0 || nx >= MW || ny >= MH) continue; const v = S.gps[ny * MW + nx]; if (v >= 0 && (best < 0 || v < best)) { best = v; bx = nx; by = ny; } }
      if (bx === tx && by === ty) break; tx = bx; ty = by; out.push({ x: (tx + .5) * TS, y: (ty + .5) * TS });
    }
    return out;
  }

  /* ---------- line of sight ---------- */
  function los(x1, y1, x2, y2) {
    const d = Math.hypot(x2 - x1, y2 - y1), n = Math.ceil(d / 16);
    for (let i = 1; i < n; i++) { const tt = tileAt(lerp(x1, x2, i / n), lerp(y1, y2, i / n)); if (tt === BLD) return false; }
    return true;
  }

  /* ---------- crime and police ---------- */
  function crime(level, force) {
    const near = peds.some(p => p.kind === 'cop' && !p.dead && Math.hypot(p.x - P.x, p.y - P.y) < 600) || cars.some(c => (c.type === 'police' || c.type === 'interceptor') && c.driver && Math.hypot(c.x - (P.car || P).x, c.y - (P.car || P).y) < 600);
    if (!force && !near && Math.random() < .55) return;
    if (level > S.wanted) S.wanted = Math.min(5, level);
    S.hidden = 0;
  }
  function setWanted(n) { S.wanted = n; S.hidden = 0; if (!n) { heli.on = false; for (const c of cars) if (c.ai === 'cop') { c.ai = 'traffic-ish'; c.siren = false; } } }
  function spawnCops(dt) {
    if (!S.wanted) return;
    const ref = P.car || P;
    const want = [0, 1, 2, 3, 4, 5][S.wanted], have = cars.filter(c => c.ai === 'cop' && !c.dead).length;
    S.copT = (S.copT || 0) - dt;
    if (have < want && S.copT <= 0) {
      S.copT = 2.2;
      const vw = Math.max(W, H) / S.cam.z / 2;
      for (let tries = 0; tries < 10; tries++) {
        const a = city.nodes[Math.floor(Math.random() * city.nodes.length)], d = Math.hypot(a.x - ref.x, a.y - ref.y);
        if (d < vw + 80 || d > vw + 700) continue;
        const type = S.wanted >= 4 && Math.random() < .5 ? 'interceptor' : 'police';
        const car = mkCar(type, a.x, a.y, Math.atan2(ref.y - a.y, ref.x - a.x), { ai: 'cop', driver: 'cop', siren: true, crew: 2 });
        if (type === 'interceptor') car.col = '#15171c';
        break;
      }
    }
    if (S.wanted >= 4 && !heli.on) { heli.on = true; heli.x = ref.x - 900; heli.y = ref.y - 700; }
  }
  function copSees() {
    const ref = P.car || P;
    if (heli.on && Math.hypot(heli.x - ref.x, heli.y - ref.y) < 140) return true;
    for (const p of peds) if (p.kind === 'cop' && !p.dead && Math.hypot(p.x - ref.x, p.y - ref.y) < 520 && los(p.x, p.y, ref.x, ref.y)) return true;
    for (const c of cars) if (c.ai === 'cop' && c.driver && !c.dead && Math.hypot(c.x - ref.x, c.y - ref.y) < 620 && los(c.x, c.y, ref.x, ref.y)) return true;
    return false;
  }

  /* ---------- damage ---------- */
  function blood(x, y, n, big) { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 220, vy: (Math.random() - .5) * 220, t: .5 + Math.random() * .4, max: .9, k: 'blood', r: 2 + Math.random() * 2.5 }); decals.push({ x: x + (Math.random() - .5) * 10, y: y + (Math.random() - .5) * 10, r: big ? 16 + Math.random() * 10 : 5 + Math.random() * 6, k: 'blood', t: 0 }); }
  function hurtPed(p, dmg, src, ang) {
    if (p.dead) return;
    if (p === P && P.armor > 0) { const ab = Math.min(P.armor, dmg * .7); P.armor -= ab; dmg -= ab; }
    p.hp -= dmg; blood(p.x, p.y, 4 + dmg / 6);
    if (ang != null) { p.vx += Math.cos(ang) * dmg * 6; p.vy += Math.sin(ang) * dmg * 6; }
    if (p === P) { audio.sfx('hurt', .6); S.shake = Math.max(S.shake, 4); if (P.hp <= 0) die('flat'); return; }
    p.flee = 6; p.fleeFrom = src ? { x: src.x, y: src.y } : null;
    if (p.hp <= 0) {
      p.dead = true; p.deadT = 0; p.a = ang != null ? ang : p.a; blood(p.x, p.y, 10, true); if (Math.random() < .5) audio.sfx('scream', .5);
      if (src === P || src === P.car) {
        if (p.kind === 'cop') crime(Math.min(5, S.wanted + 1), true);
        else if (p.kind === 'civ') crime(Math.max(1, Math.min(2, S.wanted + (Math.random() < .3 ? 1 : 0))));
        if (p.kind !== 'cop' || Math.random() < .5) pickups.push({ x: p.x + 8, y: p.y + 4, k: 'cash', v: p.kind === 'gang' ? 60 + Math.floor(Math.random() * 80) : 5 + Math.floor(Math.random() * 40), t: 30 });
        if (p.kind === 'gang' && Math.random() < .5) pickups.push({ x: p.x - 8, y: p.y, k: 'pistol', v: 12, t: 30 });
      }
    } else if (src === P && p.kind === 'cop') crime(Math.max(2, S.wanted), true);
  }
  function hurtCar(car, dmg, src) {
    if (car.dead) return;
    if (car.boss && src === P) dmg *= 2.6;
    car.hp -= dmg;
    if (src === P && (car.ai === 'cop')) crime(Math.max(2, S.wanted), true);
    if (car.hp <= 0 && !car.fire) { car.fire = 3.2; if (car === P.car) toast(L.burning, '#ff7a3a', 3); }
  }
  function explode(x, y, src) {
    audio.sfx('boom'); S.shake = Math.max(S.shake, 14);
    for (let i = 0; i < 40; i++) { const a = Math.random() * TAU, s = 60 + Math.random() * 320; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: .6 + Math.random() * .7, max: 1.3, k: i % 3 ? 'fire' : 'smoke', r: 6 + Math.random() * 12 }); }
    decals.push({ x, y, r: 46, k: 'scorch', t: 0 });
    for (const p of peds.concat([P])) { if (p === P && P.car) continue; const d = Math.hypot(p.x - x, p.y - y); if (d < 130) hurtPed(p, 90 * (1 - d / 130) + 10, src, Math.atan2(p.y - y, p.x - x)); }
    for (const c2 of cars) { if (c2.dead) continue; const d = Math.hypot(c2.x - x, c2.y - y); if (d < 120 && d > 1) { hurtCar(c2, 60 * (1 - d / 120), src); c2.vx += (c2.x - x) / d * 200; c2.vy += (c2.y - y) / d * 200; } }
    if (P.car && Math.hypot(P.car.x - x, P.car.y - y) < 5) { const pc = P.car; exitCar(true); hurtPed(P, 100, null); pc.driver = null; }
    else if (P.car && Math.hypot(P.car.x - x, P.car.y - y) < 120) hurtPed(P, 25, src);
  }

  /* ---------- shooting ---------- */
  function shoot(sh, ang, wkey) {
    const w = WEAP[wkey];
    if (wkey !== 'fist') { audio.sfx(w.snd, sh === P ? 1 : .55); events.push({ x: sh.x, y: sh.y, t: 1, k: 'shot' }); }
    if (sh === P) { S.lastFire = S.t; if (wkey !== 'fist') { crime(1); } }
    if (wkey === 'fist') {
      audio.sfx('punch', .5);
      for (const p of peds.concat([P])) { if (p === sh || p.dead) continue; const d = Math.hypot(p.x - sh.x, p.y - sh.y); if (d < 34 && Math.abs(angDiff(ang, Math.atan2(p.y - sh.y, p.x - sh.x))) < 1) { hurtPed(p, w.dmg, sh, ang); if (sh === P && p.kind === 'cop') crime(Math.max(1, S.wanted), true); return; } }
      return;
    }
    const n = w.pellets || 1;
    for (let k = 0; k < n; k++) {
      const a = ang + (Math.random() - .5) * w.spread * 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      let hx = sh.x + ca * w.range, hy = sh.y + sa * w.range, hit = null, hitCar = null;
      for (let s = 14; s < w.range; s += 8) {
        const x = sh.x + ca * s, y = sh.y + sa * s;
        if (solidPx(x, y) && tileAt(x, y) === BLD) { hx = x; hy = y; for (let i = 0; i < 3; i++) parts.push({ x, y, vx: (Math.random() - .5) * 120, vy: (Math.random() - .5) * 120, t: .2, max: .2, k: 'spark', r: 2 }); break; }
        let found = false;
        for (const p of (sh === P ? peds : peds.concat([P]))) { if (p === sh || p.dead || (p === P && P.car)) continue; if ((p.x - x) ** 2 + (p.y - y) ** 2 < 144) { hit = p; found = true; break; } }
        if (!found) for (const c2 of cars) { if (c2 === sh.car || c2.dead || c2 === sh.myCar) continue; if (inCar(c2, x, y, 0)) { hitCar = c2; found = true; break; } }
        if (found) { hx = x; hy = y; break; }
      }
      if (hit) hurtPed(hit, w.dmg, sh, a);
      if (hitCar) { hurtCar(hitCar, w.dmg * .45, sh); parts.push({ x: hx, y: hy, vx: 0, vy: 0, t: .15, max: .15, k: 'spark', r: 3 }); if (hitCar === P.car) hurtPed(P, w.dmg * .15, sh); }
      tracers.push({ x1: sh.x + ca * 14, y1: sh.y + sa * 14, x2: hx, y2: hy, t: .07 });
    }
    parts.push({ x: sh.x + Math.cos(ang) * 18, y: sh.y + Math.sin(ang) * 18, vx: 0, vy: 0, t: .05, max: .05, k: 'flash', r: 10 });
  }
  function inCar(car, x, y, pad) {
    const sp = carSpec(car), dx = x - car.x, dy = y - car.y, ca = Math.cos(-car.a), sa = Math.sin(-car.a);
    const lx2 = dx * ca - dy * sa, ly2 = dx * sa + dy * ca;
    return Math.abs(lx2) < sp.L / 2 + pad && Math.abs(ly2) < sp.W / 2 + pad;
  }

  /* ---------- player in and out of cars ---------- */
  function enterCar() {
    let best = null, bd = 60;
    for (const car of cars) { if (car.dead || car.fire) continue; const d = Math.hypot(car.x - P.x, car.y - P.y); if (d < bd) { bd = d; best = car; } }
    if (!best) return;
    if (best.driver && best.driver !== 'player') {
      const dp = mkPed(best.x - Math.sin(best.a) * 22, best.y + Math.cos(best.a) * 22, best.driver === 'cop' ? 'cop' : 'civ');
      dp.flee = best.driver === 'cop' ? 0 : 8; dp.fleeFrom = { x: P.x, y: P.y };
      if (best.driver === 'cop') { best.crew = 0; crime(Math.max(2, S.wanted), true); } else crime(1);
      audio.sfx('scream', .4);
    }
    if (best.ai === 'parked' && Math.random() < .35) crime(1);
    best.driver = 'player'; best.ai = 'player'; best.siren = false; P.car = best; audio.sfx('door');
    const st = city.spots.find(s => s.car === best); if (st) st.car = null;
    audio.radio(true); toast('📻 ' + (audio.station < audio.STATIONS.length ? audio.STATIONS[audio.station] : L.radioOff), '#ff9ad5', 2);
  }
  function exitCar(force) {
    const car = P.car; if (!car) return;
    if (!force && carSpeed(car) > 80) return;
    const sides = [[-Math.sin(car.a), Math.cos(car.a)], [Math.sin(car.a), -Math.cos(car.a)]];
    let placed = false;
    for (const [sx, sy] of sides) { const x = car.x + sx * 26, y = car.y + sy * 26; if (!solidPx(x, y)) { P.x = x; P.y = y; placed = true; break; } }
    if (!placed) { P.x = car.x; P.y = car.y; }
    car.driver = null; car.ai = 'idle'; car.thr = 0; car.steer = 0; P.car = null; audio.sfx('door'); audio.radio(false); audio.engine(false, 0, 0);
  }

  /* ---------- car physics ---------- */
  function carPoints(car, x, y, a) {
    const sp = carSpec(car), ca = Math.cos(a), sa = Math.sin(a), hl = sp.L / 2 - 2, hw = sp.W / 2 - 2, out = [];
    for (const [u, v] of [[hl, hw], [hl, -hw], [-hl, hw], [-hl, -hw], [0, hw], [0, -hw], [hl, 0], [-hl, 0]]) out.push([x + u * ca - v * sa, y + u * sa + v * ca]);
    return out;
  }
  const carHits = (car, x, y, a) => carPoints(car, x, y, a).some(([px, py]) => solidPx(px, py));
  function physCar(car, dt) {
    const sp = carSpec(car);
    if (car.dead) { car.vx *= Math.max(0, 1 - 3 * dt); car.vy *= Math.max(0, 1 - 3 * dt); }
    const ca = Math.cos(car.a), sa = Math.sin(car.a);
    let vf = car.vx * ca + car.vy * sa, vs = -car.vx * sa + car.vy * ca;
    const thr = car.dead ? 0 : car.thr, maxV = sp.maxV * (car.hp < sp.hp * .3 ? .75 : 1);
    if (thr > 0) { vf += sp.acc * thr * dt * (vf < 0 ? 2 : 1); if (vf > maxV) vf = maxV; }
    else if (thr < 0) { if (vf > 15) vf -= sp.acc * 1.8 * -thr * dt; else { vf -= sp.acc * .55 * -thr * dt; if (vf < -maxV * .35) vf = -maxV * .35; } }
    else vf *= Math.max(0, 1 - .9 * dt);
    if (car.hb) vf *= Math.max(0, 1 - 1.4 * dt);
    const tt = tileAt(car.x, car.y), slow = tt === SAND || tt === MARSH || tt === GRASS || tt === PARK ? .55 : 1;
    if (Math.abs(vf) > maxV * slow) vf *= 1 - 2 * dt;
    const grip = car.hb ? sp.grip * .18 : sp.grip;
    vs *= Math.max(0, 1 - grip * dt);
    const turnK = clamp(vf / 140, -1, 1);
    car.a += car.steer * sp.turn * dt * turnK * (car.hb ? 1.35 : 1);
    if (car.hb && Math.abs(vs) > 60 && Math.random() < .5) decals.push({ x: car.x - ca * sp.L * .35, y: car.y - sa * sp.L * .35, r: 3, k: 'skid', t: 0 });
    const na = car.a, nca = Math.cos(na), nsa = Math.sin(na);
    car.vx = vf * nca - vs * nsa; car.vy = vf * nsa + vs * nca;
    let nx = car.x + car.vx * dt, ny = car.y + car.vy * dt, hit = 0;
    if (carHits(car, nx, car.y, car.a)) { hit = Math.abs(car.vx); car.vx *= -.25; nx = car.x; }
    if (carHits(car, nx, ny, car.a)) { hit = Math.max(hit, Math.abs(car.vy)); car.vy *= -.25; ny = car.y; }
    if (carHits(car, nx, ny, car.a)) { for (const [ox, oy] of [[6, 0], [-6, 0], [0, 6], [0, -6], [8, 8], [-8, -8], [8, -8], [-8, 8]]) if (!carHits(car, nx + ox, ny + oy, car.a)) { nx += ox; ny += oy; break; } }
    car.x = nx; car.y = ny;
    if (hit > 90) { hurtCar(car, (hit - 90) * .07, null); audio.sfx('crash', clamp(hit / 400, .1, .9) * (car === P.car ? 1 : .4)); if (car === P.car) S.shake = Math.max(S.shake, hit / 50); for (let i = 0; i < 5; i++) parts.push({ x: car.x + nca * sp.L / 2, y: car.y + nsa * sp.L / 2, vx: (Math.random() - .5) * 160, vy: (Math.random() - .5) * 160, t: .25, max: .25, k: 'spark', r: 2 }); }
    if (car.hp < sp.hp * .35 && Math.random() < dt * (car.hp < sp.hp * .15 ? 20 : 8)) parts.push({ x: car.x + nca * sp.L * .35, y: car.y + nsa * sp.L * .35, vx: (Math.random() - .5) * 20, vy: (Math.random() - .5) * 20 - 10, t: 1.2, max: 1.2, k: car.fire ? 'fire' : 'smoke', r: 6 + Math.random() * 6 });
    if (car.fire > 0) { car.fire -= dt; if (Math.random() < dt * 25) parts.push({ x: car.x + (Math.random() - .5) * 20, y: car.y + (Math.random() - .5) * 14, vx: (Math.random() - .5) * 30, vy: -30, t: .6, max: .6, k: 'fire', r: 7 + Math.random() * 6 }); if (car.fire <= 0 && !car.dead) { car.dead = true; car.deadT = 0; const drv = car.driver; car.driver = null; explode(car.x, car.y, car.lastHit || null); if (drv === 'player') { } } }
    if (car.dead) car.deadT += dt;
  }
  function carCollisions() {
    const list = cars.filter(c => Math.hypot(c.x - S.cam.x, c.y - S.cam.y) < 1500);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const A = list[i], B = list[j], sa = carSpec(A), sb = carSpec(B);
      if (Math.abs(A.x - B.x) > 70 || Math.abs(A.y - B.y) > 70) continue;
      for (const fa of [-.27, .27]) for (const fb of [-.27, .27]) {
        const ax = A.x + Math.cos(A.a) * sa.L * fa, ay = A.y + Math.sin(A.a) * sa.L * fa, bx = B.x + Math.cos(B.a) * sb.L * fb, by = B.y + Math.sin(B.a) * sb.L * fb;
        const rr = sa.W * .55 + sb.W * .55, dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
        if (d >= rr || d < .01) continue;
        const nx = dx / d, ny = dy / d, ov = rr - d, ma = sa.hp, mb = sb.hp, ta = mb / (ma + mb), tb = ma / (ma + mb);
        A.x -= nx * ov * ta; A.y -= ny * ov * ta; B.x += nx * ov * tb; B.y += ny * ov * tb;
        const rv = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
        if (rv < 0) {
          const imp = -rv * 1.3; A.vx -= nx * imp * ta; A.vy -= ny * imp * ta; B.vx += nx * imp * tb; B.vy += ny * imp * tb;
          if (imp > 70) { const dmg = (imp - 70) * .06; hurtCar(A, dmg * ta * 2, B === P.car ? P : null); hurtCar(B, dmg * tb * 2, A === P.car ? P : null); if (A === P.car || B === P.car) { audio.sfx('crash', clamp(imp / 400, .2, 1)); S.shake = Math.max(S.shake, imp / 40); const other = A === P.car ? B : A; if (other.ai === 'cop' && imp > 140) crime(Math.max(1, S.wanted), true); if (other.ai === 'traffic') other.angry = 4; } }
        }
      }
    }
  }
  function carVsPeds(car) {
    const sp = carSpec(car), v = carSpeed(car);
    for (const p of peds.concat(P.car ? [] : [P])) {
      if (p.dead || Math.abs(p.x - car.x) > 50 || Math.abs(p.y - car.y) > 50) continue;
      if (!inCar(car, p.x, p.y, 8)) continue;
      if (v > 75) {
        const ang = Math.atan2(car.vy, car.vx);
        hurtPed(p, v * .2, car.driver === 'player' ? P : null, ang + (Math.random() - .5));
        p.vx += car.vx * .6; p.vy += car.vy * .6;
        if (car.driver === 'player') { audio.sfx('punch', .8); car.vx *= .92; car.vy *= .92; }
      } else {
        const dx = p.x - car.x, dy = p.y - car.y, d = Math.hypot(dx, dy) || 1;
        const nx = p.x + dx / d * 3, ny = p.y + dy / d * 3; if (!solidPx(nx, ny)) { p.x = nx; p.y = ny; }
      }
    }
  }

  /* ---------- AI drivers ---------- */
  function steerTo(car, tx, ty, speed, dt) {
    const want = Math.atan2(ty - car.y, tx - car.x), diff = angDiff(car.a, want), vf = fwdV(car);
    if (car.rev > 0) { car.rev -= dt; car.thr = -1; car.steer = -Math.sign(diff || 1); car.hb = false; return; }
    car.steer = clamp(diff * 2.2, -1, 1);
    const target = speed * (Math.abs(diff) > 1 ? .45 : Math.abs(diff) > .4 ? .75 : 1);
    car.thr = vf < target - 10 ? 1 : vf > target + 25 ? -.6 : 0;
    car.hb = false;
    if (car.thr > 0 && Math.abs(vf) < 18) { car.stuck += dt; if (car.stuck > 1.1) { car.stuck = 0; car.rev = .9; } } else car.stuck = 0;
  }
  function aiTraffic(car, dt, fleeing) {
    if (!car.to) { const n = city.nodes.reduce((b, n) => Math.hypot(n.x - car.x, n.y - car.y) < Math.hypot(b.x - car.x, b.y - car.y) ? n : b, city.nodes[0]); car.from = n; car.to = n.n[0]; }
    const lt = laneTarget(car);
    if (lt.rem < 36) nextNode(car, fleeing ? 'flee' : 'random');
    let speed = fleeing ? CARS[car.type].maxV * .8 : car.angry > 0 ? car.cruise * 1.6 : car.cruise;
    if (!fleeing) {
      const ca = Math.cos(car.a), sa = Math.sin(car.a);
      let blocked = false;
      for (const o of cars) { if (o === car) continue; const dx = o.x - car.x, dy = o.y - car.y, f = dx * ca + dy * sa, s = Math.abs(-dx * sa + dy * ca); if (f > 10 && f < 78 && s < 22) { blocked = true; if (o === P.car) car.block += dt; break; } }
      const pr = P.car ? null : P;
      if (!blocked) for (const p of pr ? peds.concat([pr]) : peds) { if (p.dead) continue; const dx = p.x - car.x, dy = p.y - car.y, f = dx * ca + dy * sa, s = Math.abs(-dx * sa + dy * ca); if (f > 8 && f < 64 && s < 18) { blocked = true; if (p === P) car.block += dt; break; } }
      if (blocked) { speed = 0; if (car.block > 1.6 && car.honk <= 0) { car.honk = 3; if (Math.hypot(car.x - P.x, car.y - P.y) < 400) audio.sfx('horn', .35); } }
      else car.block = 0;
      car.honk -= dt; car.angry = (car.angry || 0) - dt;
    }
    if (speed === 0) { car.thr = fwdV(car) > 5 ? -1 : 0; car.steer = 0; car.stuck = 0; return; }
    steerTo(car, lt.x, lt.y, speed, dt);
  }
  function aiCop(car, dt) {
    const tgt = P.car || P, d = Math.hypot(tgt.x - car.x, tgt.y - car.y);
    if (!S.wanted) { car.ai = 'traffic'; car.siren = false; car.to = null; return; }
    if (!P.car && d < 150 && carSpeed(car) < 120 && car.crew > 0) {
      car.thr = -1; car.steer = 0;
      if (carSpeed(car) < 40) { for (let i = 0; i < car.crew; i++) mkPed(car.x + Math.cos(car.a + Math.PI / 2 * (i ? 1 : -1)) * 24, car.y + Math.sin(car.a + Math.PI / 2 * (i ? 1 : -1)) * 24, 'cop', { myCar: car }); car.crew = 0; car.driver = null; car.ai = 'idle'; }
      return;
    }
    let tx, ty;
    if (d < 700 && los(car.x, car.y, tgt.x, tgt.y)) { tx = tgt.x + (tgt.vx || 0) * .35; ty = tgt.y + (tgt.vy || 0) * .35; }
    else if (S.field) { const s = fieldStep(S.field, car.x, car.y, 3); tx = s.x; ty = s.y; }
    else { tx = tgt.x; ty = tgt.y; }
    steerTo(car, tx, ty, CARS[car.type].maxV * (.72 + S.wanted * .05), dt);
    if (d < 120 && P.car) car.thr = 1;
  }
  function aiChase(car, dt) { aiTraffic(car, dt, true); }

  /* ---------- people ---------- */
  function moveP(p, dx, dy) {
    const r = 8, ok = (x, y) => !SOLID[tileAt(x - r, y - r)] && !SOLID[tileAt(x + r, y - r)] && !SOLID[tileAt(x - r, y + r)] && !SOLID[tileAt(x + r, y + r)];
    if (ok(p.x + dx, p.y)) p.x += dx; else if (p !== P) p.blocked = 1;
    if (ok(p.x, p.y + dy)) p.y += dy; else if (p !== P) p.blocked = 1;
  }
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  function pedUpdate(p, dt) {
    if (p.dead) { p.deadT += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .9; p.vy *= .9; return; }
    p.t += dt; p.cool -= dt;
    const kv = p.vx || p.vy; if (kv) { moveP(p, p.vx * dt, p.vy * dt); p.vx *= Math.max(0, 1 - 8 * dt); p.vy *= Math.max(0, 1 - 8 * dt); if (Math.abs(p.vx) + Math.abs(p.vy) < 4) p.vx = p.vy = 0; }
    const tgt = P.car || P, dP = Math.hypot(tgt.x - p.x, tgt.y - p.y);
    if (p.kind === 'cop' || p.kind === 'gang') {
      const hostile = p.kind === 'gang' || S.wanted > 0;
      if (!hostile) { if (p.myCar && !p.myCar.dead) { const d = Math.hypot(p.myCar.x - p.x, p.myCar.y - p.y); if (d < 30) { p.myCar.crew = (p.myCar.crew || 0) + 1; p.myCar.driver = 'cop'; p.myCar.ai = 'traffic'; p.myCar.to = null; p.gone = true; return; } walkTo(p, p.myCar.x, p.myCar.y, 110, dt); } else wander(p, dt); return; }
      if (p.kind === 'gang' && dP > 650) { wander(p, dt); return; }
      const see = dP < 480 && los(p.x, p.y, tgt.x, tgt.y);
      p.a = Math.atan2(tgt.y - p.y, tgt.x - p.x);
      const armed = p.kind === 'gang' || S.wanted >= 2;
      const keep = armed ? 170 : 0;
      if (dP > keep + 20 || !see) {
        if (see || !S.field) walkTo(p, tgt.x, tgt.y, p.kind === 'cop' ? 150 : 135, dt);
        else { const s = fieldStep(S.field, p.x, p.y, 1); walkTo(p, s.x, s.y, 150, dt); }
      } else p.walk += 0;
      if (armed && see && p.cool <= 0) { p.cool = p.kind === 'gang' ? .85 + Math.random() * .6 : 1 + Math.random() * .7; shoot(p, p.a + (Math.random() - .5) * .22, 'pistol'); }
      if (p.kind === 'cop' && !P.car && dP < 30 && !P.dead) { p.cuff += dt; if (p.cuff > (S.wanted >= 3 ? 2.2 : 1.2)) busted(); } else p.cuff = Math.max(0, p.cuff - dt);
      if (p.kind === 'cop' && P.car && dP < 46 && carSpeed(P.car) < 30) { p.cuff += dt; if (p.cuff > 1.6) busted(); }
      return;
    }
    // civilians
    for (const e of events) if (e.k === 'shot' && Math.hypot(e.x - p.x, e.y - p.y) < 380 && p.flee <= 0) { p.flee = 5 + Math.random() * 3; p.fleeFrom = { x: e.x, y: e.y }; if (Math.random() < .25) audio.sfx('scream', .25); }
    if (P.car && dP < 110 && carSpeed(P.car) > 160 && p.flee <= 0) { const ca = Math.cos(P.car.a), sa = Math.sin(P.car.a), dx = p.x - P.car.x, dy = p.y - P.car.y; if (dx * ca + dy * sa > 0 && Math.abs(-dx * sa + dy * ca) < 40) { const side = (-dx * sa + dy * ca) >= 0 ? 1 : -1; p.vx += -sa * side * 260; p.vy += ca * side * 260; } }
    if (p.flee > 0) {
      p.flee -= dt; const f = p.fleeFrom || tgt; const a = Math.atan2(p.y - f.y, p.x - f.x) + Math.sin(p.t * 2) * .4;
      p.a = a; moveP(p, Math.cos(a) * 165 * dt, Math.sin(a) * 165 * dt); p.walk += dt * 14; if (p.blocked) { p.fleeFrom = { x: p.x + (Math.random() - .5) * 200, y: p.y + (Math.random() - .5) * 200 }; p.blocked = 0; }
      return;
    }
    wander(p, dt);
  }
  function wander(p, dt) {
    const [dx, dy] = DIRS[p.dir], sp = 46, nx = p.x + dx * sp * dt, ny = p.y + dy * sp * dt;
    const ahead = tileAt(p.x + dx * 18, p.y + dy * 18);
    const tx = Math.floor(p.x / TS), ty = Math.floor(p.y / TS), cx = (tx + .5) * TS, cy = (ty + .5) * TS;
    if (!PEDOK[ahead] || Math.random() < dt * .08) {
      const near = Math.abs(p.x - cx) < 6 && Math.abs(p.y - cy) < 6;
      if (near || !PEDOK[ahead]) { const opts = [0, 1, 2, 3].filter(d => PEDOK[city.G(tx + DIRS[d][0], ty + DIRS[d][1])] && d !== (p.dir + 2) % 4); p.dir = opts.length ? opts[Math.floor(Math.random() * opts.length)] : (p.dir + 2) % 4; if (!PEDOK[ahead]) { p.x = lerp(p.x, cx, .3); p.y = lerp(p.y, cy, .3); } }
      return;
    }
    p.a = Math.atan2(dy, dx); moveP(p, nx - p.x, ny - p.y); p.walk += dt * 6;
  }
  function walkTo(p, tx, ty, sp, dt) { const a = Math.atan2(ty - p.y, tx - p.x); p.a = a; moveP(p, Math.cos(a) * sp * dt, Math.sin(a) * sp * dt); p.walk += dt * 10; }

  /* ---------- death and arrest ---------- */
  function die(kind) {
    if (S.mode !== 'play') return;
    if (P.car) exitCar(true);
    P.dead = true; S.mode = 'dead'; S.deadKind = kind; S.deadT = 0; audio.sfx(kind === 'flat' ? 'scream' : 'fail'); audio.radio(false); audio.engine(false, 0, 0);
    if (S.mission) failMission(kind === 'flat' ? L.fail.dead : L.fail.busted, true);
  }
  function busted() { if (S.mode === 'play') die('cuffed'); }
  function respawn() {
    const kind = S.deadKind;
    const spot = kind === 'flat' ? PL.hospitals.reduce((b, h) => Math.hypot(h.x - P.x, h.y - P.y) < Math.hypot(b.x - P.x, b.y - P.y) ? h : b) : { x: PL.police.x, y: PL.police.y - TS * 1.5 };
    const fee = Math.min(save.money, kind === 'flat' ? 100 + Math.floor(save.money * .05) : 150 + Math.floor(save.money * .08));
    save.money -= fee; toast(fmt(kind === 'flat' ? L.hosp : L.bail, { n: fee }), '#ff8a8a', 3);
    if (kind === 'cuffed') { save.ammo = { pistol: 0, smg: 0, shotgun: 0 }; P.weapon = 'fist'; }
    P.x = spot.x; P.y = spot.y; P.hp = 100; P.dead = false; P.vx = P.vy = 0; setWanted(0);
    cars = cars.filter(c => c.ai !== 'cop'); peds = peds.filter(p => p.kind !== 'cop');
    S.cam.x = P.x; S.cam.y = P.y; store(); S.mode = 'play';
  }

  /* ---------- pickups ---------- */
  const FIXED = [
    { x: front(1, 2).x - TS * 3, y: front(1, 2).y - TS * 3, k: 'pistol', v: 24 }, { x: (RD(3) + 4) * TS, y: (RD(5) + 4) * TS, k: 'smg', v: 90 }, { x: (RD(0) + 5) * TS, y: (RD(6) + 5) * TS, k: 'shotgun', v: 16 },
    { x: PL.hospitals[0].x + TS * 2, y: PL.hospitals[0].y, k: 'health', v: 50 }, { x: PL.hospitals[1].x, y: PL.hospitals[1].y, k: 'health', v: 50 }, { x: PL.police.x - TS * 3, y: PL.police.y - TS * 1.5, k: 'armor', v: 50 },
    { x: 83 * TS, y: 30 * TS, k: 'cash', v: 250 }, { x: 72 * TS, y: 93 * TS, k: 'cash', v: 300 }, { x: 4 * TS, y: 70 * TS, k: 'cash', v: 400 }, { x: (RD(3) + 5) * TS, y: (RD(0) + 2.5) * TS, k: 'armor', v: 50 }
  ];
  FIXED.forEach(f => pickups.push(Object.assign({ fixed: true, t: 0 }, f)));
  function takePickup(pk) {
    if (pk.k === 'cash') { save.money += pk.v; toast(fmt(L.cash, { n: pk.v }), '#7dff8a', 1.6); audio.sfx('cash'); }
    else if (pk.k === 'health') { if (P.hp >= 100) return false; P.hp = Math.min(100, P.hp + pk.v); toast('+ ' + L.health, '#ff6b6b'); audio.sfx('pick'); }
    else if (pk.k === 'armor') { if (P.armor >= 100) return false; P.armor = Math.min(100, P.armor + pk.v); toast('+ ' + L.armor, '#6bb8ff'); audio.sfx('pick'); }
    else if (WEAP[pk.k]) { save.ammo[pk.k] = (save.ammo[pk.k] || 0) + pk.v; P.weapon = pk.k; toast(fmt(L.pick, { w: L.w[pk.k] }), '#ffd23a'); audio.sfx('pick'); }
    else if (pk.k === 'package' || pk.k === 'briefcase') { audio.sfx('pick'); }
    return true;
  }

  /* ---------- missions ---------- */
  function MISSIONS() {
    const g = PL;
    return [
      { start: g.prison, steps: [{ t: 'say', k: 'b' }, { t: 'enterAny', o: 0 }, { t: 'goto', at: g.garage, inCar: true, o: 1 }, { t: 'say', k: 'e' }], pay: 500 },
      { start: g.garageWalk, steps: [{ t: 'say', k: 'b' }, { t: 'spawnCar', tag: 'vesper', type: 'sports', at: g.vesper, a: Math.PI / 2, col: '#f6c90e' }, { t: 'enter', tag: 'vesper', o: 0, alarm: 1 }, { t: 'deliver', tag: 'vesper', at: g.garage, minHp: .5, o: 1 }, { t: 'say', k: 'e' }], pay: 1500 },
      { start: g.dock, steps: [{ t: 'say', k: 'b' }, { t: 'collect', pts: g.packages, time: 170, o: 0 }, { t: 'say', k: 'e' }], pay: 2000, debt: 10000 },
      { start: g.coralRoad, steps: [{ t: 'say', k: 'b' }, { t: 'spawnCar', tag: 'van', type: 'van', at: g.van, a: Math.PI, col: '#e8e2d0' }, { t: 'enter', tag: 'van', o: 0, wanted: 2 }, { t: 'lose', o: 1, tag: 'van' }, { t: 'deliver', tag: 'van', at: g.warehouse, clean: true, o: 2 }, { t: 'say', k: 'e' }], pay: 3000, debt: 15000 },
      { start: g.towerWalk, steps: [{ t: 'say', k: 'b' }, { t: 'spawnCar', tag: 'vinnie', type: 'phantom', at: g.tower, a: 0, ai: 'chase', col: '#cfd6df', hp: 170 }, { t: 'chase', tag: 'vinnie', o: 0 }, { t: 'grab', o: 1 }, { t: 'say', k: 'e' }], pay: 4000 },
      { start: g.garageWalk, steps: [{ t: 'say', k: 'b' }, { t: 'give', w: 'smg', n: 150 }, { t: 'gang', n: 6 }, { t: 'kill', o: 0 }, { t: 'say', k: 'e' }], pay: 4000 },
      { start: g.police, steps: [{ t: 'say', k: 'b' }, { t: 'race', pts: g.race, time: 115, o: 0 }, { t: 'say', k: 'e' }], pay: 5000, debt: 10000 },
      { start: g.bridge, steps: [{ t: 'say', k: 'b' }, { t: 'wanted', n: 3 }, { t: 'spawnCar', tag: 'harlan', type: 'interceptor', near: true, ai: 'chase', col: '#15171c', hp: 260 }, { t: 'chase', tag: 'harlan', o: 0 }, { t: 'wanted', n: 4 }, { t: 'goto', at: g.pier, o: 1 }, { t: 'clear' }, { t: 'say', k: 'e' }], pay: 10000, debt: 15000 }
    ];
  }
  const MS = MISSIONS();
  function startMission(i) {
    const m = MS[i]; if (!m) return;
    S.mission = { i, si: -1, m, tags: {}, data: {}, timer: null };
    S.free = false; nextStep();
  }
  function nextStep() {
    const M = S.mission; if (!M) return;
    M.si++; M.timer = null; M.data = {};
    const st = M.m.steps[M.si];
    if (!st) return passMission();
    const tx = L.ms[M.i];
    if (st.t === 'say') { S.say = { lines: tx[st.k] || [], i: 0, t: 0 }; S.mode = 'say'; if (P.car) P.car.thr = 0; return; }
    if (st.t === 'spawnCar') {
      let at = st.at, a = st.a || 0;
      if (st.near) { const ref = P.car || P; const n = city.nodes.filter(n => { const d = Math.hypot(n.x - ref.x, n.y - ref.y); return d > 300 && d < 700; }).sort(() => Math.random() - .5)[0] || city.nodes[0]; at = n; a = Math.atan2(ref.y - n.y, ref.x - n.x); }
      const o = { tag: st.tag, ai: st.ai ? 'chase' : 'parked', driver: st.ai ? 'npc' : null }; if (st.col) o.col = st.col; const car = mkCar(st.type, at.x, at.y, a, o);
      if (st.hp) car.hp = car.maxHp = st.hp;
      if (st.ai) { car.from = city.nodes.reduce((b, n) => Math.hypot(n.x - at.x, n.y - at.y) < Math.hypot(b.x - at.x, b.y - at.y) ? n : b, city.nodes[0]); car.to = car.from.n[0]; car.boss = true; }
      M.tags[st.tag] = car; return nextStep();
    }
    if (st.t === 'wanted') { S.wanted = Math.max(S.wanted, st.n); S.hidden = 0; return nextStep(); }
    if (st.t === 'clear') { setWanted(0); cars = cars.filter(c => c.ai !== 'cop'); peds = peds.filter(p => p.kind !== 'cop'); return nextStep(); }
    if (st.t === 'give') { save.ammo[st.w] = (save.ammo[st.w] || 0) + st.n; P.weapon = st.w; toast(fmt(L.pick, { w: L.w[st.w] }), '#ffd23a'); return nextStep(); }
    if (st.t === 'gang') {
      const base = PL.garageWalk;
      const pts = [[-6, -7], [-2, -9], [3, -8], [-9, -2], [5, -3], [-4, 3]];
      M.gang = pts.slice(0, st.n).map(([dx, dy]) => { let x = base.x + dx * TS, y = base.y + dy * TS; let tries = 0; while (SOLID[tileAt(x, y)] && tries++ < 20) { x += TS * (Math.random() - .5) * 2; y += TS * (Math.random() - .5) * 2; } return mkPed(x, y, 'gang', { tag: 'gang', hp: 60 }); });
      return nextStep();
    }
    if (st.t === 'collect') { M.items = st.pts.map(p => ({ x: p.x, y: p.y, got: false })); M.timer = st.time; }
    if (st.t === 'race') { M.cp = 0; M.timer = st.time; }
    if (st.t === 'grab') { const v = M.tags.vinnie; M.brief = { x: v.x + 30, y: v.y + 10 }; let k = 0; while (SOLID[tileAt(M.brief.x, M.brief.y)] && k++ < 30) { M.brief.x = v.x + (Math.random() - .5) * 120; M.brief.y = v.y + (Math.random() - .5) * 120; } }
    S.mode = 'play';
  }
  function stepTarget() {
    const M = S.mission; if (!M) return null;
    const st = M.m.steps[M.si]; if (!st) return null;
    if (st.t === 'goto' || st.t === 'deliver') { if (st.t === 'deliver' && P.car !== M.tags[st.tag]) return M.tags[st.tag]; return st.at; }
    if (st.t === 'enter' || st.t === 'chase') return M.tags[st.tag];
    if (st.t === 'lose') return null;
    if (st.t === 'collect') { const ref = P.car || P; return M.items.filter(i => !i.got).sort((a, b) => Math.hypot(a.x - ref.x, a.y - ref.y) - Math.hypot(b.x - ref.x, b.y - ref.y))[0]; }
    if (st.t === 'race') return st.pts[M.cp];
    if (st.t === 'grab') return M.brief;
    if (st.t === 'kill') return M.gang.filter(g => !g.dead)[0];
    return null;
  }
  function objText() {
    const M = S.mission; if (!M) return '';
    const st = M.m.steps[M.si]; if (!st || st.o == null) return '';
    let s = L.ms[M.i].o[st.o] || '';
    if (st.t === 'collect') s = fmt(s, { n: M.items.filter(i => i.got).length });
    if (st.t === 'race') s = fmt(s, { n: M.cp });
    if (st.t === 'kill') s = fmt(s, { n: M.gang.filter(g => !g.dead).length });
    if (st.t === 'deliver' && st.clean && S.wanted) s = L.ms[M.i].o[1];
    return s;
  }
  function missionTick(dt) {
    const M = S.mission; if (!M || S.mode !== 'play') return;
    const st = M.m.steps[M.si]; if (!st) return;
    const ref = P.car || P;
    if (M.timer != null) { M.timer -= dt; if (M.timer <= 0) return failMission(L.fail.time); }
    const tagCar = st.tag && M.tags[st.tag];
    if (tagCar && (st.t === 'enter' || st.t === 'deliver' || st.t === 'lose') && (tagCar.dead || tagCar.fire > 0)) return failMission(L.fail.car);
    switch (st.t) {
      case 'enterAny': if (P.car) nextStep(); break;
      case 'goto': if (Math.hypot(ref.x - st.at.x, ref.y - st.at.y) < 70 && (!st.inCar || P.car)) nextStep(); break;
      case 'enter': if (P.car === tagCar) { if (st.alarm) { crime(1, true); } if (st.wanted) { S.wanted = Math.max(S.wanted, st.wanted); S.hidden = 0; } nextStep(); } break;
      case 'deliver':
        if (st.minHp && tagCar.hp < tagCar.maxHp * st.minHp) return failMission(L.fail.dmg);
        if (P.car === tagCar && Math.hypot(tagCar.x - st.at.x, tagCar.y - st.at.y) < 80 && (!st.clean || !S.wanted) && carSpeed(tagCar) < 160) { exitCar(true); tagCar.tag = null; tagCar.ai = 'parked'; nextStep(); }
        break;
      case 'lose': if (!S.wanted) nextStep(); break;
      case 'collect':
        for (const it of M.items) if (!it.got && Math.hypot(ref.x - it.x, ref.y - it.y) < 46) { it.got = true; audio.sfx('pick'); toast(fmt(L.ms[M.i].o[0], { n: M.items.filter(i => i.got).length }), '#c58bff', 1.6); }
        if (M.items.every(i => i.got)) nextStep(); break;
      case 'race':
        if (Math.hypot(ref.x - st.pts[M.cp].x, ref.y - st.pts[M.cp].y) < 90) { M.cp++; audio.sfx('pick'); if (M.cp >= st.pts.length) nextStep(); }
        break;
      case 'chase': {
        const tc = tagCar;
        if (tc.hp <= tc.maxHp * .12 || tc.dead || tc.fire > 0) {
          tc.ai = 'idle'; tc.thr = 0; tc.driver = null; tc.tag = null;
          if (st.tag === 'vinnie') { const v = mkPed(tc.x - Math.sin(tc.a) * 26, tc.y + Math.cos(tc.a) * 26, 'civ', { look: { skin: '#e8b98f', shirt: '#e9e9f2', pants: '#2b2d42', hair: '#c9a25e', hat: null }, flee: 30 }); v.fleeFrom = { x: ref.x, y: ref.y }; }
          if (st.tag === 'harlan') { const h = mkPed(tc.x - Math.sin(tc.a) * 26, tc.y + Math.cos(tc.a) * 26, 'cop', { hp: 30 }); h.look.shirt = '#111'; }
          nextStep(); break;
        }
        if (Math.hypot(tc.x - ref.x, tc.y - ref.y) > 1900) { M.far = (M.far || 0) + dt; if (M.far > 6) return failMission(L.fail.lost); } else M.far = 0;
        break;
      }
      case 'grab': if (Math.hypot(ref.x - M.brief.x, ref.y - M.brief.y) < 40) { audio.sfx('pick'); nextStep(); } break;
      case 'kill': if (M.gang.every(g => g.dead)) nextStep(); break;
    }
  }
  function passMission() {
    const M = S.mission; S.mission = null;
    save.money += M.m.pay; if (M.m.debt) save.debt = Math.max(0, save.debt - M.m.debt);
    if (save.m <= M.i) save.m = M.i + 1;
    if (M.i === MS.length - 1) { save.debt = 0; S.endT = 6; }
    store(); audio.sfx('pass');
    S.banner = { s: L.passed, sub: fmt(L.cash, { n: M.m.pay }) + (M.m.debt ? '   ·   ' + fmt(L.paidOff, { n: save.debt.toLocaleString('en-US') }) : ''), col: '#ffcf3f', t: 4 };
    for (const k in M.tags) if (M.tags[k]) { M.tags[k].tag = null; M.tags[k].boss = false; }
    S.mode = 'play';
  }
  function failMission(reason, silent) {
    const M = S.mission; if (!M) return; S.mission = null;
    for (const k in M.tags) { const c2 = M.tags[k]; if (c2 && c2 !== P.car) { c2.tag = null; if (c2.ai === 'chase') c2.ai = 'traffic'; } }
    if (M.gang) M.gang.forEach(g => g.tag = null);
    if (!silent) audio.sfx('fail');
    S.banner = { s: L.failed, sub: reason, col: '#ff4f5e', t: 4 };
  }

  /* ---------- input ---------- */
  const keys = {}; let mouse = { x: 0, y: 0, down: false, has: false }, stick = { on: false, id: null, ox: 0, oy: 0, x: 0, y: 0 }, tbtn = {}, uiHits = [];
  const KMAP = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', ShiftLeft: 'sprint', ShiftRight: 'sprint', Space: 'hb' };
  function onKey(e, down) {
    if (!host.isConnected) return;
    const k = KMAP[e.code];
    if (k) { keys[k] = down; if (S.mode === 'play' || S.mode === 'say') e.preventDefault(); }
    if (!down) return;
    if (S.mode === 'menu' || S.mode === 'list') return;
    if (e.code === 'KeyP' || e.code === 'Escape') { togglePause(); e.preventDefault(); return; }
    if (S.mode === 'say' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyF')) { advanceSay(); e.preventDefault(); return; }
    if (S.mode === 'map') { if (e.code === 'KeyM' || e.code === 'Escape') S.mode = 'play'; return; }
    if (S.mode === 'dead' && S.deadT > 1.2) { respawn(); return; }
    if (S.mode !== 'play') return;
    if (e.code === 'KeyF' || e.code === 'Enter') { P.car ? exitCar() : enterCar(); e.preventDefault(); }
    if (e.code === 'KeyQ') cycleWeapon(-1);
    if (e.code === 'KeyE') cycleWeapon(1);
    if (e.code === 'KeyR') cycleRadio();
    if (e.code === 'KeyM') S.mode = 'map';
    if (e.code === 'KeyH' && P.car) { audio.sfx('horn'); for (const p of peds) if (!p.dead && p.kind === 'civ' && Math.hypot(p.x - P.car.x, p.y - P.car.y) < 160) { p.flee = 2; p.fleeFrom = { x: P.car.x, y: P.car.y }; } }
    if (S.shopOpen && /Digit[1-4]/.test(e.code)) buy(+e.code.slice(5));
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  function cycleWeapon(d) { const have = WORDER.filter(w => w === 'fist' || save.ammo[w] > 0); let i = have.indexOf(P.weapon); i = (i + d + have.length) % have.length; P.weapon = have[i]; audio.sfx('click'); }
  function cycleRadio() { const n = (audio.station + 1) % (audio.STATIONS.length + 1); audio.setStation(n); if (P.car) audio.radio(true); store(); toast('📻 ' + (n < audio.STATIONS.length ? audio.STATIONS[n] : L.radioOff), '#ff9ad5', 2); }
  function togglePause() { if (S.mode === 'pause') { S.mode = S.prevMode || 'play'; audio.suspend(false); } else if (S.mode === 'play' || S.mode === 'say' || S.mode === 'map') { S.prevMode = S.mode; S.mode = 'pause'; audio.suspend(true); } }
  function advanceSay() { const s = S.say; if (!s) return; if (s.t < .25) return; s.i++; s.t = 0; if (s.i >= s.lines.length) { S.say = null; S.mode = 'play'; nextStep(); } }
  function buy(n) {
    const it = [['pistol', 100, 48], ['smg', 300, 120], ['shotgun', 500, 30], ['armor', 200, 100]][n - 1]; if (!it) return;
    if (save.money < it[1]) { toast(L.noMoney, '#ff8a8a'); return; }
    save.money -= it[1]; if (it[0] === 'armor') P.armor = 100; else { save.ammo[it[0]] = (save.ammo[it[0]] || 0) + it[2]; P.weapon = it[0]; }
    audio.sfx('cash'); toast(L.bought + ': ' + (it[0] === 'armor' ? L.armor : L.w[it[0]]), '#7dff8a'); store();
  }
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitUI(x, y) { for (let i = uiHits.length - 1; i >= 0; i--) { const h = uiHits[i]; if (x >= h.x && y >= h.y && x <= h.x + h.w && y <= h.y + h.h) { h.f(); return true; } } return false; }
  cv.addEventListener('pointerdown', e => {
    audio.init(); cv.focus();
    const p = pos(e);
    if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.has = true; }
    if (hitUI(p.x, p.y)) { e.preventDefault(); return; }
    if (S.mode === 'say') { advanceSay(); return; }
    if (S.mode === 'dead' && S.deadT > 1.2) { respawn(); return; }
    if (S.mode === 'map') { const m = S.mapRect; if (m && p.x > m.x && p.y > m.y && p.x < m.x + m.s && p.y < m.y + m.s) { S.wp = { x: (p.x - m.x) / m.s * MW * TS, y: (p.y - m.y) / m.s * MH * TS }; toast(L.wp, '#ff9ad5'); S.mode = 'play'; } else S.mode = 'play'; return; }
    if (S.mode !== 'play') return;
    if (e.pointerType !== 'mouse') {
      if (p.x < W * .5 && !stick.on) { stick = { on: true, id: e.pointerId, ox: p.x, oy: p.y, x: 0, y: 0 }; cv.setPointerCapture(e.pointerId); }
      return;
    }
    mouse.down = true;
  });
  cv.addEventListener('pointermove', e => { const p = pos(e); if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.has = true; } if (stick.on && e.pointerId === stick.id) { let dx = p.x - stick.ox, dy = p.y - stick.oy; const d = Math.hypot(dx, dy), m = 60; if (d > m) { dx *= m / d; dy *= m / d; } stick.x = dx / m; stick.y = dy / m; } });
  const up = e => { if (e.pointerId === stick.id) stick = { on: false, id: null, x: 0, y: 0 }; if (e.pointerType === 'mouse') mouse.down = false; for (const k in tbtn) if (tbtn[k] === e.pointerId) tbtn[k] = null; };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { if (S.mode === 'play') { cycleWeapon(e.deltaY > 0 ? 1 : -1); e.preventDefault(); } }, { passive: false });
  cv.addEventListener('contextmenu', e => e.preventDefault());
  const vis = () => { if (document.hidden && (S.mode === 'play' || S.mode === 'say')) togglePause(); };
  document.addEventListener('visibilitychange', vis);
  /* touch buttons: hold detection */
  const TB = () => {
    const s = Math.min(78, Math.max(56, W * .13)), m = 14, out = [];
    out.push({ k: 'fire', x: W - s - m, y: H - s - m, r: s / 2, lab: P.car ? 'HB' : '🔫' });
    out.push({ k: 'car', x: W - s * 2 - m * 2, y: H - s * .8 - m, r: s * .4, lab: '🚗' });
    out.push({ k: 'wpn', x: W - s - m, y: H - s * 2 - m * 2, r: s * .36, lab: '⇄' });
    out.push({ k: 'map', x: W - s * .7 - m, y: 70 + 120, r: s * .3, lab: '🗺' });
    out.push({ k: 'radio', x: W - s * .7 - m, y: 70 + 120 + s * .75, r: s * .3, lab: '📻' });
    out.push({ k: 'pause', x: W - s * .7 - m, y: 70 + 120 + s * 1.5, r: s * .3, lab: 'II' });
    return out;
  };
  cv.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || S.mode !== 'play') return;
    const p = pos(e);
    for (const b of TB()) if (Math.hypot(p.x - b.x - b.r, p.y - b.y - b.r) < b.r + 10) {
      if (stick.id === e.pointerId) stick = { on: false, id: null, x: 0, y: 0 };
      if (b.k === 'fire') tbtn.fire = e.pointerId;
      if (b.k === 'car') P.car ? exitCar() : enterCar();
      if (b.k === 'wpn') cycleWeapon(1);
      if (b.k === 'map') S.mode = 'map';
      if (b.k === 'radio') cycleRadio();
      if (b.k === 'pause') togglePause();
      if (S.shopOpen && b.k === 'x') {}
    }
  });

  /* ---------- update ---------- */
  function autoAim() {
    let best = null, bs = 1e9;
    for (const p of peds) { if (p.dead) continue; const d = Math.hypot(p.x - P.x, p.y - P.y); if (d > 420) continue; const pri = p.kind === 'gang' || (p.kind === 'cop' && S.wanted) ? 0 : 400; if (!los(P.x, P.y, p.x, p.y)) continue; const sc = d + pri + Math.abs(angDiff(P.a, Math.atan2(p.y - P.y, p.x - P.x))) * 120; if (sc < bs) { bs = sc; best = p; } }
    if (!best) for (const c2 of cars) { if (c2.dead || !c2.tag) continue; const d = Math.hypot(c2.x - P.x, c2.y - P.y); if (d < 420 && d < bs) { bs = d; best = c2; } }
    return best ? Math.atan2(best.y - P.y, best.x - P.x) : P.a;
  }
  function update(dt) {
    S.t += dt;
    for (const t of toasts) t.t -= dt; toasts = toasts.filter(t => t.t > 0);
    if (S.banner) { S.banner.t -= dt; if (S.banner.t <= 0) S.banner = null; }
    if (S.mode === 'say') { S.say.t += dt; return; }
    if (S.mode === 'dead') { S.deadT += dt; if (S.deadT > 4) respawn(); stepWorld(dt * .3); return; }
    if (S.mode !== 'play') return;
    S.clock = (S.clock + dt * 4) % 1440;
    if (S.endT > 0) { S.endT -= dt; }
    // player control
    const sx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + stick.x, sy = (keys.down ? 1 : 0) - (keys.up ? 1 : 0) + stick.y;
    if (P.car) {
      const car = P.car;
      if (stick.on && Math.hypot(stick.x, stick.y) > .15) {
        const want = Math.atan2(stick.y, stick.x), diff = angDiff(car.a, want), mag = Math.min(1, Math.hypot(stick.x, stick.y));
        if (Math.cos(diff) > -.35) { car.thr = mag; car.steer = clamp(diff * 2.4, -1, 1); }
        else { car.thr = -mag; car.steer = clamp(-diff * 1.5, -1, 1) * (fwdV(car) < 0 ? 1 : 0); }
      } else { car.thr = keys.up ? 1 : keys.down ? -1 : 0; car.steer = (keys.right ? 1 : 0) - (keys.left ? 1 : 0); if (fwdV(car) < -5 && keys.down) car.steer *= 1; }
      car.hb = !!(keys.hb || tbtn.fire);
      P.x = car.x; P.y = car.y; P.a = car.a; P.vx = car.vx; P.vy = car.vy;
      audio.engine(true, fwdV(car), car.thr);
      if (car.fire > 0 && !P.dead) { /* stay until it blows: the explosion handles damage */ }
      if (car.dead) { exitCar(true); }
    } else {
      const m = Math.hypot(sx, sy);
      const sp = keys.sprint || (stick.on && Math.hypot(stick.x, stick.y) > .92) ? 230 : 150;
      if (m > .1) { moveP(P, sx / Math.max(1, m) * sp * dt, sy / Math.max(1, m) * sp * dt); P.walk += dt * (sp > 160 ? 15 : 10); P.moving = true; } else P.moving = false;
      if (P.vx || P.vy) { moveP(P, P.vx * dt, P.vy * dt); P.vx *= Math.max(0, 1 - 7 * dt); P.vy *= Math.max(0, 1 - 7 * dt); if (Math.abs(P.vx) + Math.abs(P.vy) < 3) P.vx = P.vy = 0; }
      if (mouse.has && !touch) { const wx = (mouse.x - W / 2) / S.cam.z + S.cam.x, wy = (mouse.y - H / 2) / S.cam.z + S.cam.y; P.a = Math.atan2(wy - P.y, wx - P.x); }
      else if (m > .1) P.a = Math.atan2(sy, sx);
      P.cool -= dt;
      const firing = mouse.down || tbtn.fire;
      if (firing && P.cool <= 0) {
        if (P.weapon !== 'fist' && !(save.ammo[P.weapon] > 0)) { P.weapon = 'fist'; }
        const a = touch || !mouse.has ? autoAim() : P.a; if (touch) P.a = a;
        shoot(P, a, P.weapon); P.cool = WEAP[P.weapon].cd; if (P.weapon !== 'fist') save.ammo[P.weapon]--;
      }
      audio.engine(false, 0, 0);
    }
    stepWorld(dt);
    // pickups
    const ref = P.car || P;
    for (const pk of pickups) { if (pk.gone) { if (pk.fixed && (pk.t -= dt) <= 0) pk.gone = false; continue; } if (!pk.fixed) { pk.t -= dt; if (pk.t <= 0) { pk.dead = true; continue; } } if (Math.hypot(pk.x - ref.x, pk.y - ref.y) < 34 && (!P.car || pk.k === 'cash')) { if (takePickup(pk) !== false) { if (pk.fixed) { pk.gone = true; pk.t = 60; } else pk.dead = true; } } }
    pickups = pickups.filter(p => !p.dead);
    // spray garage
    S.sprayCD -= dt;
    if (P.car && !S.mission && Math.hypot(P.car.x - PL.garage.x, P.car.y - PL.garage.y) < 75 && S.sprayCD <= 0 && (S.wanted > 0 || P.car.hp < P.car.maxHp) && !(S.mission && MS[S.mission.i].steps[S.mission.si].t === 'lose' && false)) {
      const cost = S.wanted ? 250 : 100;
      if (save.money >= cost) { save.money -= cost; P.car.hp = P.car.maxHp; P.car.fire = 0; P.car.col = CAR_COLS[Math.floor(Math.random() * CAR_COLS.length)]; if (S.wanted) setWanted(0); toast(L.spray + '  −$' + cost, '#ff9ad5', 3); audio.sfx('cash'); store(); }
      else toast(L.noMoney, '#ff8a8a');
      S.sprayCD = 8;
    }
    // gun shop
    S.shopOpen = !P.car && Math.hypot(P.x - PL.gunshop.x, P.y - PL.gunshop.y) < 60;
    // wanted logic
    if (S.wanted) {
      if (copSees()) { S.hidden = 0; S.seenT = .5; }
      else { S.hidden += dt; if (S.hidden > 3 + S.wanted * 2.2) { setWanted(0); toast(L.lost, '#7dff8a'); } }
      S.fieldT -= dt; if (S.fieldT <= 0) { S.fieldT = .45; S.field = bfs(Math.floor(ref.x / TS), Math.floor(ref.y / TS)); }
    } else S.field = null;
    spawnCops(dt);
    // contact markers / mission start
    if (!S.mission && save.m < MS.length) { const st = MS[save.m].start; if (Math.hypot(ref.x - st.x, ref.y - st.y) < 50 && !S.wanted) { if (P.car) { P.car.vx *= .2; P.car.vy *= .2; } startMission(save.m); } }
    missionTick(dt);
    // gps
    const tgt = stepTarget() || (!S.mission && save.m < MS.length && !S.free ? MS[save.m].start : null) || S.wp;
    if (S.wp && Math.hypot(ref.x - S.wp.x, ref.y - S.wp.y) < 90) S.wp = null;
    setGps(tgt ? { x: Math.round(tgt.x / TS) * TS, y: Math.round(tgt.y / TS) * TS } : null);
    // district label
    const tx = Math.floor(ref.x / TS), ty = Math.floor(ref.y / TS);
    let dk = ty <= 5 ? 'ns' : ty >= 44 && ty <= 53 ? 'cn' : tx >= 66 ? 'os' : ty <= 42 ? (tx < 30 ? 'lp' : 'gh') : (tx < 30 ? 'gf' : 'pm');
    if (dk !== S.district) { S.district = dk; S.distT = 3; } S.distT -= dt;
    // spawning
    S.spawnT = (S.spawnT || 0) - dt;
    if (S.spawnT <= 0) { S.spawnT = .25; spawnTraffic(); spawnPeds(); spawnParked(); despawn(); }
  }
  function stepWorld(dt) {
    for (const car of cars) {
      if (car.driver === 'npc' && !car.dead) { if (car.ai === 'traffic' || car.ai === 'traffic-ish') aiTraffic(car, dt, false); else if (car.ai === 'chase') aiChase(car, dt); }
      else if (car.driver === 'cop' && !car.dead) { if (car.ai === 'cop') aiCop(car, dt); else aiTraffic(car, dt, false); }
      else if (car.driver !== 'player') { car.thr = 0; car.steer = 0; car.hb = true; }
      if (car.ai === 'traffic-ish') car.ai = car.driver === 'cop' ? 'traffic' : 'traffic';
      physCar(car, dt);
      if (carSpeed(car) > 20) carVsPeds(car);
    }
    if (S.wanted) for (const car of cars) if (car.ai === 'traffic' && car.driver === 'cop' && !car.dead) { car.ai = 'cop'; car.siren = true; }
    carCollisions();
    for (const p of peds) pedUpdate(p, dt);
    peds = peds.filter(p => !p.gone);
    if (!P.car) { for (const car of cars) { if (inCar(car, P.x, P.y, 9)) { const dx = P.x - car.x, dy = P.y - car.y, d = Math.hypot(dx, dy) || 1; moveP(P, dx / d * 4, dy / d * 4); } } }
    // helicopter
    if (heli.on) {
      const ref = P.car || P; const a = Math.atan2(ref.y - heli.y, ref.x - heli.x), d = Math.hypot(ref.x - heli.x, ref.y - heli.y);
      const sp = d > 200 ? 330 : d > 60 ? 160 : 0; heli.x += Math.cos(a) * sp * dt; heli.y += Math.sin(a) * sp * dt; heli.a = a;
      heli.cool -= dt; if (S.wanted >= 4 && d < 260 && heli.cool <= 0) { heli.cool = .25; const src = { x: heli.x, y: heli.y, car: null }; if (Math.random() < .25) { shoot(src, a + (Math.random() - .5) * .3, 'smg'); } }
      if (S.wanted < 4) { heli.x -= 400 * dt; heli.y -= 300 * dt; if (Math.hypot(ref.x - heli.x, ref.y - heli.y) > 1500) heli.on = false; }
    }
    // sirens
    let nearCop = 1e9; for (const c2 of cars) if (c2.siren && !c2.dead) nearCop = Math.min(nearCop, Math.hypot(c2.x - S.cam.x, c2.y - S.cam.y));
    audio.siren(clamp(1 - nearCop / 900, 0, 1), S.t);
    for (const p of parts) { p.t -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .92; p.vy *= .92; if (p.k === 'blood' && p.t <= 0) decals.push({ x: p.x, y: p.y, r: p.r, k: 'blood', t: 0 }); }
    parts = parts.filter(p => p.t > 0); if (parts.length > 500) parts.splice(0, parts.length - 500);
    for (const tr of tracers) tr.t -= dt; tracers = tracers.filter(t => t.t > 0);
    for (const e of events) e.t -= dt; events = events.filter(e => e.t > 0);
    S.shake = Math.max(0, S.shake - dt * 30);
  }

  /* ---------- drawing helpers ---------- */
  const chunks = new Map(), CH = 8;
  function chunk(cx, cy) {
    const key = cx + ',' + cy; let ch = chunks.get(key);
    if (ch) { chunks.delete(key); chunks.set(key, ch); return ch; }
    ch = document.createElement('canvas'); ch.width = ch.height = CH * TS; const g = ch.getContext('2d');
    const rr = mulberry(cx * 7919 + cy * 104729);
    for (let ty = 0; ty < CH; ty++) for (let tx = 0; tx < CH; tx++) drawTile(g, cx * CH + tx, cy * CH + ty, tx * TS, ty * TS, rr);
    chunks.set(key, ch); if (chunks.size > 60) chunks.delete(chunks.keys().next().value);
    return ch;
  }
  const isHRoad = y => (y - 6) % 12 === 0 || (y - 7) % 12 === 0;
  const isVRoad = x => x >= 6 && x <= 79 && ((x - 6) % 12 === 0 || (x - 7) % 12 === 0);
  function drawTile(g, X, Y, x, y, rr) {
    const v = city.G(X, Y), Gt = (a, b) => city.G(a, b);
    const land = t2 => t2 !== WATER && t2 !== POOL;
    switch (v) {
      case WATER: {
        g.fillStyle = '#0d5470'; g.fillRect(x, y, TS, TS);
        const shore = [[0, -1], [1, 0], [0, 1], [-1, 0]].filter(([a, b]) => land(Gt(X + a, Y + b)));
        g.fillStyle = 'rgba(64,190,210,.35)'; for (const [a, b] of shore) { if (b === -1) g.fillRect(x, y, TS, 10); if (b === 1) g.fillRect(x, y + TS - 10, TS, 10); if (a === -1) g.fillRect(x, y, 10, TS); if (a === 1) g.fillRect(x + TS - 10, y, 10, TS); }
        g.fillStyle = 'rgba(255,255,255,.06)'; for (let i = 0; i < 3; i++) g.fillRect(x + rr() * TS, y + rr() * TS, 10 + rr() * 10, 2);
        break;
      }
      case SAND: g.fillStyle = '#e2c98c'; g.fillRect(x, y, TS, TS); g.fillStyle = 'rgba(150,110,50,.18)'; for (let i = 0; i < 7; i++) g.fillRect(x + rr() * TS, y + rr() * TS, 2, 2); break;
      case GRASS: case PARK: g.fillStyle = v === PARK ? ((X + Y) % 2 ? '#4f9146' : '#4a8a42') : '#3e7a3a'; g.fillRect(x, y, TS, TS); g.fillStyle = 'rgba(20,60,20,.35)'; for (let i = 0; i < 6; i++) g.fillRect(x + rr() * TS, y + rr() * TS, 2, 4); break;
      case MARSH: g.fillStyle = '#3b5636'; g.fillRect(x, y, TS, TS); g.fillStyle = '#2b4741'; for (let i = 0; i < 2; i++) { g.beginPath(); g.ellipse(x + rr() * TS, y + rr() * TS, 6 + rr() * 9, 4 + rr() * 6, rr() * 3, 0, TAU); g.fill(); } g.fillStyle = 'rgba(120,150,60,.4)'; for (let i = 0; i < 5; i++) g.fillRect(x + rr() * TS, y + rr() * TS, 1.5, 6); break;
      case LOT: case BLD: g.fillStyle = v === BLD ? '#1c1d22' : '#44464d'; g.fillRect(x, y, TS, TS); if (v === LOT) { g.fillStyle = 'rgba(255,255,255,.05)'; g.fillRect(x, y, TS, 1); g.fillRect(x, y, 1, TS); if (rr() < .3) { g.fillStyle = 'rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(x + rr() * TS, y + rr() * TS, 8, 5, 0, 0, TAU); g.fill(); } } break;
      case DOCK: g.fillStyle = '#7a5d3d'; g.fillRect(x, y, TS, TS); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < TS; i += 8) g.fillRect(x, y + i, TS, 1); break;
      case POOL: g.fillStyle = '#e8eef0'; g.fillRect(x, y, TS, TS); g.fillStyle = '#3fc4df'; g.fillRect(x + 3, y + 3, TS - 6, TS - 6); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 8, y + 12, 14, 2); break;
      case WALK: {
        g.fillStyle = '#8e8a82'; g.fillRect(x, y, TS, TS); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + TS / 2, y, 1, TS); g.fillRect(x, y + TS / 2, TS, 1);
        g.fillStyle = '#c4beb2'; const nb = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        for (const [a, b] of nb) { const n2 = Gt(X + a, Y + b); if (n2 === ROAD || n2 === BRIDGE) { if (b === -1) g.fillRect(x, y, TS, 3); if (b === 1) g.fillRect(x, y + TS - 3, TS, 3); if (a === -1) g.fillRect(x, y, 3, TS); if (a === 1) g.fillRect(x + TS - 3, y, 3, TS); } if (n2 === WATER) { g.fillStyle = '#5c5a55'; if (b === 1) g.fillRect(x, y + TS - 4, TS, 4); if (b === -1) g.fillRect(x, y, TS, 4); g.fillStyle = '#c4beb2'; } }
        break;
      }
      case ROAD: case BRIDGE: {
        g.fillStyle = v === BRIDGE ? '#34322f' : '#2a2c31'; g.fillRect(x, y, TS, TS);
        g.fillStyle = 'rgba(255,255,255,.025)'; for (let i = 0; i < 6; i++) g.fillRect(x + rr() * TS, y + rr() * TS, 3, 2);
        const h = isHRoad(Y) && Gt(X - 1, Y) !== WALK && Gt(X + 1, Y) !== WALK || isHRoad(Y) && !isVRoad(X), vv = isVRoad(X) && !isHRoad(Y);
        const inter = isHRoad(Y) && isVRoad(X);
        if (!inter && isHRoad(Y)) {
          if ((Y - 6) % 12 === 0) { g.fillStyle = '#e8b83a'; for (let i = 4; i < TS; i += 24) g.fillRect(x + i, y + TS - 2, 14, 3); }
          g.fillStyle = 'rgba(255,255,255,.55)'; if ((Y - 6) % 12 === 0) g.fillRect(x, y + 2, TS, 2); else g.fillRect(x, y + TS - 4, TS, 2);
          if (isVRoad(X - 1) || isVRoad(X + 1)) { g.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 4; i < TS; i += 10) g.fillRect(x + (isVRoad(X - 1) ? 6 : TS - 16), y + i, 10, 5); }
        } else if (!inter && vv) {
          if ((X - 6) % 12 === 0) { g.fillStyle = '#e8b83a'; for (let i = 4; i < TS; i += 24) g.fillRect(x + TS - 2, y + i, 3, 14); }
          g.fillStyle = 'rgba(255,255,255,.55)'; if ((X - 6) % 12 === 0) g.fillRect(x + 2, y, 2, TS); else g.fillRect(x + TS - 4, y, 2, TS);
          if (isHRoad(Y - 1) || isHRoad(Y + 1)) { g.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 4; i < TS; i += 10) g.fillRect(x + i, y + (isHRoad(Y - 1) ? 6 : TS - 16), 5, 10); }
          if (v === BRIDGE) { g.fillStyle = '#8b8780'; if ((X - 6) % 12 === 0) g.fillRect(x, y, 4, TS); else g.fillRect(x + TS - 4, y, 4, TS); }
        }
        void h;
        break;
      }
    }
  }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function shade(hex, f) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g2 = n >> 8 & 255, b = n & 255; if (f < 0) { r *= 1 + f; g2 *= 1 + f; b *= 1 + f; } else { r += (255 - r) * f; g2 += (255 - g2) * f; b += (255 - b) * f; } return `rgb(${r | 0},${g2 | 0},${b | 0})`; }

  function drawCar(g, car) {
    const sp = carSpec(car), L2 = sp.L, W2 = sp.W;
    g.save(); g.translate(car.x, car.y); g.rotate(car.a);
    g.fillStyle = 'rgba(0,0,0,.35)'; roundRect(g, -L2 / 2 + 3, -W2 / 2 + 4, L2, W2, 7); g.fill();
    g.fillStyle = '#111'; for (const [u, v] of [[L2 * .3, -W2 / 2 - 1], [L2 * .3, W2 / 2 - 3], [-L2 * .3, -W2 / 2 - 1], [-L2 * .3, W2 / 2 - 3]]) g.fillRect(u - 5, v, 10, 4);
    const col = car.dead ? '#2a2522' : car.col;
    const grd = g.createLinearGradient(0, -W2 / 2, 0, W2 / 2); grd.addColorStop(0, shade(col, .25)); grd.addColorStop(.5, col); grd.addColorStop(1, shade(col, -.35));
    g.fillStyle = grd; roundRect(g, -L2 / 2, -W2 / 2, L2, W2, car.type === 'van' ? 4 : 7); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 1.2; g.stroke();
    if (car.type === 'sports' || car.type === 'muscle' || car.type === 'interceptor') { g.fillStyle = car.type === 'muscle' ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.35)'; g.fillRect(-L2 / 2 + 2, -3, L2 - 4, 2.2); g.fillRect(-L2 / 2 + 2, 1, L2 - 4, 2.2); }
    if (car.type === 'pickup') { g.fillStyle = shade(col, -.45); g.fillRect(-L2 / 2 + 3, -W2 / 2 + 3, L2 * .42, W2 - 6); }
    const roofL = car.type === 'van' ? L2 * .62 : car.type === 'pickup' ? L2 * .26 : L2 * .38, roofX = car.type === 'van' ? -L2 * .38 : car.type === 'pickup' ? -L2 * .02 : -L2 * .2;
    g.fillStyle = '#14202b'; g.beginPath(); g.moveTo(roofX + roofL, -W2 / 2 + 3); g.lineTo(roofX + roofL + L2 * .14, -W2 / 2 + 5); g.lineTo(roofX + roofL + L2 * .14, W2 / 2 - 5); g.lineTo(roofX + roofL, W2 / 2 - 3); g.closePath(); g.fill();
    g.fillStyle = 'rgba(140,200,240,.35)'; g.fillRect(roofX + roofL + 3, -W2 / 2 + 6, 2, W2 * .3);
    g.fillStyle = '#14202b'; g.fillRect(roofX - (car.type === 'van' ? 0 : L2 * .1), -W2 / 2 + 4, car.type === 'van' ? 2 : L2 * .1, W2 - 8);
    g.fillStyle = shade(col, car.dead ? 0 : .12); roundRect(g, roofX, -W2 / 2 + 3, roofL, W2 - 6, 4); g.fill();
    if (car.type === 'police' || car.type === 'interceptor') {
      if (car.type === 'police') { g.fillStyle = '#1b2d55'; g.fillRect(-L2 / 2 + 2, -W2 / 2, L2 * .25, W2); g.fillRect(L2 * .25, -W2 / 2, L2 * .25 - 2, W2); }
      const on = car.siren && Math.floor(S.t * 8) % 2;
      g.fillStyle = on ? '#ff2a3a' : '#5a1a20'; g.fillRect(roofX + roofL * .35, -W2 / 2 + 3, 5, W2 / 2 - 3);
      g.fillStyle = !on && car.siren ? '#2a6bff' : '#1a2a5a'; g.fillRect(roofX + roofL * .35, 0, 5, W2 / 2 - 3);
    }
    if (car.type === 'taxi') { g.fillStyle = '#222'; g.fillRect(roofX + roofL * .35, -4, 6, 8); g.fillStyle = '#ffe36b'; g.fillRect(roofX + roofL * .35 + 1, -3, 4, 6); }
    g.fillStyle = car.dead ? '#333' : '#fff6c8'; g.fillRect(L2 / 2 - 3, -W2 / 2 + 2, 3, 5); g.fillRect(L2 / 2 - 3, W2 / 2 - 7, 3, 5);
    const brake = car.thr < 0 && !car.dead;
    g.fillStyle = brake ? '#ff3030' : '#8a1a1a'; g.fillRect(-L2 / 2, -W2 / 2 + 2, 3, 5); g.fillRect(-L2 / 2, W2 / 2 - 7, 3, 5);
    if (car.hp < car.maxHp * .5 && !car.dead) { g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(L2 * .3, -W2 * .2, 5, 3, .4, 0, TAU); g.ellipse(-L2 * .25, W2 * .2, 6, 3, -.3, 0, TAU); g.fill(); }
    g.restore();
  }
  function drawPerson(g, p, t) {
    const lk = p.look, isP = p === P;
    g.save(); g.translate(p.x, p.y);
    if (p.dead) {
      g.rotate(p.a || 0);
      g.fillStyle = lk.pants; g.fillRect(-16, -6, 10, 4); g.fillRect(-16, 2, 10, 4);
      g.fillStyle = lk.shirt; g.beginPath(); g.ellipse(-2, 0, 9, 7, 0, 0, TAU); g.fill();
      g.fillStyle = lk.skin; g.fillRect(-4, -12, 8, 3); g.fillRect(-4, 9, 8, 3);
      g.beginPath(); g.arc(10, 1, 5, 0, TAU); g.fill(); g.fillStyle = lk.hair; g.beginPath(); g.arc(11, 1, 4, 0, TAU); g.fill();
      g.restore(); return;
    }
    const sc = isP ? 1.5 : 1.32; g.scale(sc, sc);
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(2, 3, 11, 9, 0, 0, TAU); g.fill();
    g.rotate(p.a);
    const ph = Math.sin(p.walk || 0) * ((isP ? P.moving : true) ? 5 : 0);
    g.fillStyle = lk.pants; g.beginPath(); g.ellipse(ph, -4, 4.5, 3, 0, 0, TAU); g.ellipse(-ph, 4, 4.5, 3, 0, 0, TAU); g.fill();
    g.fillStyle = '#1b1b1f'; g.beginPath(); g.arc(ph + 3.5, -4, 2, 0, TAU); g.arc(-ph + 3.5, 4, 2, 0, TAU); g.fill();
    const armed = p.weapon && p.weapon !== 'fist';
    g.fillStyle = lk.skin;
    if (armed) { g.fillStyle = lk.shirt; g.beginPath(); g.ellipse(6, -6, 6, 2.6, .35, 0, TAU); g.ellipse(6, 6, 6, 2.6, -.35, 0, TAU); g.fill(); g.fillStyle = lk.skin; g.beginPath(); g.arc(11, -2, 2.5, 0, TAU); g.arc(11, 2, 2.5, 0, TAU); g.fill(); g.fillStyle = '#1a1a1d'; const gl = p.weapon === 'shotgun' ? 16 : p.weapon === 'smg' ? 12 : 8; g.fillRect(10, -1.6, gl, 3.2); }
    else { g.fillStyle = lk.shirt; g.beginPath(); g.ellipse(-ph * .7, -9, 3.5, 2.6, 0, 0, TAU); g.ellipse(ph * .7, 9, 3.5, 2.6, 0, 0, TAU); g.fill(); g.fillStyle = lk.skin; g.beginPath(); g.arc(-ph * .7 + 3, -9.5, 2.2, 0, TAU); g.arc(ph * .7 + 3, 9.5, 2.2, 0, TAU); g.fill(); }
    g.fillStyle = lk.shirt; g.beginPath(); g.ellipse(0, 0, 6.5, 10, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; g.stroke();
    if (lk.flower) { g.fillStyle = '#ffd6e0'; for (const [u, v] of [[-2, -5], [2, 4], [-3, 6], [3, -3]]) { g.beginPath(); g.arc(u, v, 1.4, 0, TAU); g.fill(); } g.fillStyle = '#f2c230'; g.fillRect(4, -1, 1.5, 2); }
    if (lk.hat === 'cop') { g.fillStyle = '#c9a227'; g.fillRect(-2, -8, 3, 2); }
    g.fillStyle = lk.skin; g.beginPath(); g.arc(1, 0, 5.4, 0, TAU); g.fill();
    if (lk.hat === 'cap') { g.fillStyle = isP ? '#111' : '#2a5db0'; g.beginPath(); g.arc(0, 0, 5.6, 0, TAU); g.fill(); g.beginPath(); g.ellipse(5.5, 0, 3.5, 4.5, 0, -Math.PI / 2, Math.PI / 2); g.fill(); }
    else if (lk.hat === 'cop') { g.fillStyle = '#16264a'; g.beginPath(); g.arc(0, 0, 6, 0, TAU); g.fill(); g.fillStyle = '#0d1630'; g.beginPath(); g.ellipse(5, 0, 3, 5, 0, -Math.PI / 2, Math.PI / 2); g.fill(); g.fillStyle = '#c9a227'; g.fillRect(2, -1, 2, 2); }
    else if (lk.hat === 'straw') { g.fillStyle = '#e3c27a'; g.beginPath(); g.arc(0, 0, 8, 0, TAU); g.fill(); g.fillStyle = '#b23a3a'; g.beginPath(); g.arc(0, 0, 4.5, 0, TAU); g.fill(); }
    else if (lk.hat === 'bandana') { g.fillStyle = lk.hair; g.beginPath(); g.arc(-.5, 0, 5, Math.PI * .5, Math.PI * 1.5); g.fill(); g.fillStyle = '#c0392b'; g.beginPath(); g.arc(0, 0, 5.6, Math.PI * .6, Math.PI * 1.4); g.fill(); g.fillRect(-9, -1.5, 4, 3); }
    else { g.fillStyle = lk.hair; g.beginPath(); g.arc(-.5, 0, 5.3, Math.PI * .45, Math.PI * 1.55); g.fill(); }
    g.restore();
    if (isP) { g.strokeStyle = 'rgba(255,90,170,.55)'; g.lineWidth = 2; g.beginPath(); g.arc(p.x, p.y, 20, 0, TAU); g.stroke(); }
  }
  function drawBuilding(g, b, cam) {
    const x0 = b.x * TS, y0 = b.y * TS, x1 = (b.x + b.w) * TS, y1 = (b.y + b.h) * TS, K = b.ht * .55;
    const up = (x, y) => [x + (x - cam.x) * K, y + (y - cam.y) * K];
    const base = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], top = base.map(([x, y]) => up(x, y));
    const night = S.dark;
    const faces = [[0, 1, -.35], [1, 2, -.12], [2, 3, .05], [3, 0, -.22]];
    for (const [i, j, f] of faces) {
      const A = base[i], B = base[j], C = top[j], D = top[i];
      g.fillStyle = shade(b.wall, f); g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(C[0], C[1]); g.lineTo(D[0], D[1]); g.closePath(); g.fill();
      if (b.kind !== 'container' && b.kind !== 'shack') {
        const rows = Math.max(1, Math.round(b.ht * 14));
        g.strokeStyle = night > .3 ? (b.kind === 'glass' || b.kind === 'tower' ? 'rgba(160,220,255,.55)' : 'rgba(255,214,140,.55)') : (b.kind === 'glass' || b.kind === 'tower' ? 'rgba(200,235,255,.35)' : 'rgba(0,0,0,.18)');
        g.lineWidth = 1.5;
        g.beginPath();
        for (let r = 1; r <= rows; r++) { const tt = (r - .5) / (rows + .5); g.moveTo(lerp(A[0], D[0], tt), lerp(A[1], D[1], tt)); g.lineTo(lerp(B[0], C[0], tt), lerp(B[1], C[1], tt)); }
        g.stroke();
      }
    }
    g.fillStyle = b.roof; g.beginPath(); top.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill();
    g.strokeStyle = shade(b.roof, .2); g.lineWidth = 2; g.stroke();
    const [tx0, ty0] = top[0], [tx1, ty1] = top[2], tw = tx1 - tx0, th = ty1 - ty0;
    if (b.kind === 'house') { g.strokeStyle = shade(b.roof, -.3); g.lineWidth = 2; g.beginPath(); if (tw > th) { g.moveTo(tx0 + 4, ty0 + th / 2); g.lineTo(tx1 - 4, ty0 + th / 2); } else { g.moveTo(tx0 + tw / 2, ty0 + 4); g.lineTo(tx0 + tw / 2, ty1 - 4); } g.stroke(); }
    else if (b.kind === 'container') { g.strokeStyle = shade(b.roof, -.3); g.lineWidth = 1; g.beginPath(); for (let i = 1; i < 8; i++) { g.moveTo(tx0 + tw * i / 8, ty0 + 2); g.lineTo(tx0 + tw * i / 8, ty1 - 2); } g.stroke(); }
    else if (b.kind === 'hospital') { g.fillStyle = '#e33'; const cx = tx0 + tw / 2, cy = ty0 + th / 2, s = Math.min(tw, th) * .18; g.fillRect(cx - s, cy - s * 3, s * 2, s * 6); g.fillRect(cx - s * 3, cy - s, s * 6, s * 2); }
    else if (b.kind === 'police') { g.fillStyle = '#c9a227'; star(g, tx0 + tw / 2, ty0 + th / 2, Math.min(tw, th) * .25); g.fillStyle = '#fff'; g.font = 'bold 14px system-ui'; g.textAlign = 'center'; g.fillText('PCPD', tx0 + tw / 2, ty1 - 8); }
    else if (b.kind === 'prison') { g.strokeStyle = '#4b5055'; g.lineWidth = 3; g.strokeRect(tx0 + 10, ty0 + 10, tw - 20, th - 20); g.fillStyle = '#ffd23a'; g.font = 'bold 13px system-ui'; g.textAlign = 'center'; g.fillText('COUNTY LOCKUP', tx0 + tw / 2, ty0 + th / 2); }
    else if (b.kind === 'glass' || b.kind === 'tower') { g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(tx0 + tw * .2, ty0 + th * .2, tw * .25, th * .2); g.fillRect(tx0 + tw * .6, ty0 + th * .55, tw * .2, th * .25); if (b.heli) { g.strokeStyle = '#f2c230'; g.lineWidth = 2; g.beginPath(); g.arc(tx0 + tw / 2, ty0 + th / 2, Math.min(tw, th) * .3, 0, TAU); g.stroke(); g.fillStyle = '#f2c230'; g.font = 'bold 18px system-ui'; g.textAlign = 'center'; g.fillText('H', tx0 + tw / 2, ty0 + th / 2 + 6); } }
    else if (b.kind === 'hotel') { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(tx0 + 6, ty0 + 6, tw - 12, th - 12); }
    if (b.sign) {
      g.save(); g.font = `900 ${Math.max(12, Math.min(26, tw / b.sign.length * 1.3))}px system-ui`; g.textAlign = 'center'; g.textBaseline = 'middle';
      if (night > .25) { g.shadowColor = b.sc; g.shadowBlur = 14; }
      g.fillStyle = night > .25 ? b.sc : shade(b.sc, -.25); g.fillText(b.sign, tx0 + tw / 2, ty0 + th / 2 + (b.kind === 'hotel' ? 0 : th * .25)); g.restore();
    }
  }
  function star(g, x, y, r) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); }
  function drawTree(g, tr, cam) {
    const K = tr.k === 'palm' ? .16 : .1, hx = tr.x + (tr.x - cam.x) * K, hy = tr.y + (tr.y - cam.y) * K, s = tr.s;
    g.strokeStyle = '#6b4f2f'; g.lineWidth = 4 * s; g.beginPath(); g.moveTo(tr.x, tr.y); g.lineTo(hx, hy); g.stroke();
    if (tr.k === 'palm') {
      g.fillStyle = '#2f7a3a'; for (let i = 0; i < 7; i++) { const a = tr.a + i * TAU / 7 + Math.sin(S.t * 1.2 + tr.x) * .06; g.save(); g.translate(hx, hy); g.rotate(a); g.beginPath(); g.ellipse(13 * s, 0, 14 * s, 4 * s, 0, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = '#3d9a48'; for (let i = 0; i < 7; i++) { const a = tr.a + .4 + i * TAU / 7; g.save(); g.translate(hx, hy); g.rotate(a); g.beginPath(); g.ellipse(9 * s, 0, 9 * s, 2.5 * s, 0, 0, TAU); g.fill(); g.restore(); }
      g.fillStyle = '#5a3f22'; g.beginPath(); g.arc(hx, hy, 3 * s, 0, TAU); g.fill();
    } else { g.fillStyle = '#2b4a2c'; g.beginPath(); g.arc(hx, hy, 14 * s, 0, TAU); g.fill(); g.fillStyle = '#3a5f37'; g.beginPath(); g.arc(hx - 3, hy - 3, 9 * s, 0, TAU); g.fill(); g.strokeStyle = 'rgba(160,170,140,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(hx - 6, hy); g.lineTo(hx - 8, hy + 12); g.moveTo(hx + 5, hy - 2); g.lineTo(hx + 6, hy + 10); g.stroke(); }
  }
  function marker(g, x, y, col, label, big) {
    const pulse = 1 + Math.sin(S.t * 4) * .08, r = (big ? 30 : 22) * pulse;
    g.save(); g.globalAlpha = .9;
    const gr = g.createRadialGradient(x, y, 2, x, y, r); gr.addColorStop(0, col + '00'); gr.addColorStop(.7, col + '55'); gr.addColorStop(1, col + 'cc');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
    const by = y - 34 - Math.sin(S.t * 3) * 5; g.fillStyle = col; g.beginPath(); g.moveTo(x - 9, by - 10); g.lineTo(x + 9, by - 10); g.lineTo(x, by + 2); g.closePath(); g.fill();
    if (label) { g.font = '900 13px system-ui'; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(label, x, by - 16); }
    g.restore();
  }

  /* ---------- main draw ---------- */
  function hour() { return S.clock / 60; }
  function darkness() { const h = hour(); if (h >= 21 || h < 5) return .62; if (h >= 19) return (h - 19) / 2 * .62; if (h < 7) return (7 - h) / 2 * .62; return 0; }
  function draw() {
    c.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (S.mode === 'menu' || S.mode === 'list') { drawMenu(); return; }
    const ref = P.car || P, spd = P.car ? carSpeed(P.car) : 0;
    const baseZ = clamp(Math.sqrt(W * H) / 900, .58, 1.12), wantZ = baseZ * (1 - Math.min(.3, spd / 1500));
    const cam = S.cam; cam.z = lerp(cam.z, wantZ, .04);
    const lead = P.car ? .35 : 0;
    cam.x = lerp(cam.x, ref.x + (P.car ? P.car.vx * lead : 0), .12); cam.y = lerp(cam.y, ref.y + (P.car ? P.car.vy * lead : 0), .12);
    const shx = (Math.random() - .5) * S.shake, shy = (Math.random() - .5) * S.shake;
    S.dark = darkness();
    c.fillStyle = '#0d5470'; c.fillRect(0, 0, W, H);
    c.save(); c.translate(W / 2 + shx, H / 2 + shy); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y);
    const vx0 = cam.x - W / 2 / cam.z - 60, vy0 = cam.y - H / 2 / cam.z - 60, vx1 = cam.x + W / 2 / cam.z + 60, vy1 = cam.y + H / 2 / cam.z + 60;
    const C = CH * TS;
    for (let cy = Math.max(0, Math.floor(vy0 / C)); cy <= Math.min(MH / CH - 1, Math.floor(vy1 / C)); cy++) for (let cx = Math.max(0, Math.floor(vx0 / C)); cx <= Math.min(MW / CH - 1, Math.floor(vx1 / C)); cx++) c.drawImage(chunk(cx, cy), cx * C, cy * C);
    // water shimmer
    c.strokeStyle = 'rgba(180,240,255,.12)'; c.lineWidth = 2;
    for (let y = Math.floor(vy0 / 40) * 40; y < vy1; y += 40) for (let x = Math.floor(vx0 / 70) * 70; x < vx1; x += 70) { if (tileAt(x, y) !== WATER) continue; const o = Math.sin(S.t * 1.5 + x * .05 + y * .03) * 8; c.beginPath(); c.moveTo(x + o, y); c.lineTo(x + o + 16, y); c.stroke(); }
    for (const d of decals) { if (d.x < vx0 || d.x > vx1 || d.y < vy0 || d.y > vy1) continue; c.fillStyle = d.k === 'blood' ? 'rgba(120,0,10,.75)' : d.k === 'skid' ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.55)'; c.beginPath(); c.arc(d.x, d.y, d.r, 0, TAU); c.fill(); }
    // GPS line
    const path = gpsPath(140);
    if (path.length > 1) { c.strokeStyle = 'rgba(200,90,255,.55)'; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round'; c.setLineDash([2, 14]); c.beginPath(); path.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); c.setLineDash([]); }
    for (const dc of city.deco) { if (dc.x < vx0 - 80 || dc.x > vx1 + 80 || dc.y < vy0 - 80 || dc.y > vy1 + 80) continue; if (dc.k === 'fountain') { c.fillStyle = '#cfd8dc'; c.beginPath(); c.arc(dc.x, dc.y, 30, 0, TAU); c.fill(); c.fillStyle = '#41c9e2'; c.beginPath(); c.arc(dc.x, dc.y, 24, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 6; i++) { const a = S.t * 2 + i; c.beginPath(); c.arc(dc.x + Math.cos(a) * 10, dc.y + Math.sin(a) * 10, 2, 0, TAU); c.fill(); } } else if (dc.k === 'umbrella') { c.fillStyle = dc.c; c.beginPath(); c.arc(dc.x, dc.y, 16, 0, TAU); c.fill(); c.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(dc.x, dc.y); c.arc(dc.x, dc.y, 16, i * Math.PI / 2, i * Math.PI / 2 + .5); c.fill(); } c.fillStyle = 'rgba(255,255,255,.85)'; c.fillRect(dc.x + 18, dc.y - 6, 10, 20); } }
    // pickups & markers
    for (const pk of pickups) { if (pk.gone) continue; const bob = Math.sin(S.t * 3 + pk.x) * 3; drawPickup(c, pk.x, pk.y + bob, pk.k); }
    const M = S.mission, st = M && M.m.steps[M.si];
    if (!M && save.m < MS.length) marker(c, MS[save.m].start.x, MS[save.m].start.y, '#ff4fa0', L.mission + ' ' + (save.m + 1), true);
    if (st && (st.t === 'goto' || st.t === 'deliver') && (st.t === 'goto' || P.car === M.tags[st.tag])) marker(c, st.at.x, st.at.y, '#ffd23a');
    if (st && st.t === 'collect') for (const it of M.items) if (!it.got) drawPickup(c, it.x, it.y + Math.sin(S.t * 3 + it.x) * 3, 'package');
    if (st && st.t === 'race') { const p = st.pts[M.cp]; marker(c, p.x, p.y, '#39f3ff', (M.cp + 1) + '/' + st.pts.length, true); }
    if (st && st.t === 'grab') drawPickup(c, M.brief.x, M.brief.y, 'briefcase');
    if (st && st.t === 'kill') for (const gg of M.gang) if (!gg.dead) { c.fillStyle = '#ff3b3b'; c.beginPath(); c.moveTo(gg.x - 6, gg.y - 28); c.lineTo(gg.x + 6, gg.y - 28); c.lineTo(gg.x, gg.y - 20); c.fill(); }
    if (st && (st.t === 'enter' || st.t === 'chase')) { const tc = M.tags[st.tag]; if (tc && P.car !== tc) { c.fillStyle = st.t === 'chase' ? '#ff3b3b' : '#4fa3ff'; c.beginPath(); c.moveTo(tc.x - 9, tc.y - 40); c.lineTo(tc.x + 9, tc.y - 40); c.lineTo(tc.x, tc.y - 28); c.fill(); } }
    if (S.wp) marker(c, S.wp.x, S.wp.y, '#c58bff');
    if (!S.mission) { const gs = PL.gunshop; c.fillStyle = 'rgba(255,138,30,.85)'; c.beginPath(); c.arc(gs.x, gs.y, 14, 0, TAU); c.fill(); c.fillStyle = '#111'; c.font = '900 14px system-ui'; c.textAlign = 'center'; c.fillText('$', gs.x, gs.y + 5); const gr = PL.garage; c.strokeStyle = 'rgba(255,79,160,.6)'; c.setLineDash([6, 6]); c.lineWidth = 2; c.beginPath(); c.arc(gr.x, gr.y, 40, 0, TAU); c.stroke(); c.setLineDash([]); }
    // dead bodies, then cars, then living people
    for (const p of peds) if (p.dead && inView(p, vx0, vy0, vx1, vy1)) drawPerson(c, p);
    for (const car of cars) if (inView(car, vx0, vy0, vx1, vy1)) drawCar(c, car);
    for (const p of peds) if (!p.dead && inView(p, vx0, vy0, vx1, vy1)) drawPerson(c, p);
    if (!P.car && !P.dead) drawPerson(c, P);
    for (const tr of tracers) { c.strokeStyle = `rgba(255,230,150,${tr.t / .07})`; c.lineWidth = 2; c.beginPath(); c.moveTo(tr.x1, tr.y1); c.lineTo(tr.x2, tr.y2); c.stroke(); }
    for (const p of parts) { if (p.x < vx0 || p.x > vx1 || p.y < vy0 || p.y > vy1) continue; const a = clamp(p.t / p.max, 0, 1); if (p.k === 'blood') { c.fillStyle = `rgba(160,0,15,${a})`; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); } else if (p.k === 'smoke') { c.fillStyle = `rgba(60,60,64,${a * .5})`; c.beginPath(); c.arc(p.x, p.y, p.r * (2 - a), 0, TAU); c.fill(); } else if (p.k === 'fire') { c.fillStyle = `rgba(255,${120 + a * 100 | 0},40,${a})`; c.beginPath(); c.arc(p.x, p.y, p.r * a + 2, 0, TAU); c.fill(); } else if (p.k === 'spark') { c.fillStyle = `rgba(255,220,120,${a})`; c.fillRect(p.x, p.y, 2, 2); } else if (p.k === 'flash') { c.fillStyle = 'rgba(255,240,180,.9)'; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); } }
    // trees and buildings (tall things last, far ones first)
    for (const tr of city.trees) if (tr.x > vx0 - 40 && tr.x < vx1 + 40 && tr.y > vy0 - 40 && tr.y < vy1 + 40) drawTree(c, tr, cam);
    const vis = city.blds.filter(b => { const pad = 60 + b.ht * 500; return (b.x + b.w) * TS > vx0 - pad && b.x * TS < vx1 + pad && (b.y + b.h) * TS > vy0 - pad && b.y * TS < vy1 + pad; });
    vis.sort((a, b) => Math.hypot((b.x + b.w / 2) * TS - cam.x, (b.y + b.h / 2) * TS - cam.y) - Math.hypot((a.x + a.w / 2) * TS - cam.x, (a.y + a.h / 2) * TS - cam.y));
    for (const b of vis) drawBuilding(c, b, cam);
    // helicopter
    if (heli.on) { const hx = heli.x, hy = heli.y; c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(hx + 40, hy + 50, 26, 12, heli.a, 0, TAU); c.fill(); c.save(); c.translate(hx, hy); c.rotate(heli.a); c.fillStyle = '#1f2a44'; c.beginPath(); c.ellipse(0, 0, 24, 11, 0, 0, TAU); c.fill(); c.fillRect(-46, -3, 26, 6); c.fillStyle = '#9fd0ff'; c.beginPath(); c.ellipse(12, 0, 9, 8, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(200,200,210,.7)'; c.lineWidth = 3; const ra = S.t * 30; c.beginPath(); c.moveTo(Math.cos(ra) * 40, Math.sin(ra) * 40); c.lineTo(-Math.cos(ra) * 40, -Math.sin(ra) * 40); c.moveTo(Math.cos(ra + 1.57) * 40, Math.sin(ra + 1.57) * 40); c.lineTo(-Math.cos(ra + 1.57) * 40, -Math.sin(ra + 1.57) * 40); c.stroke(); c.restore(); }
    c.restore();
    drawLights(cam, vx0, vy0, vx1, vy1);
    if (S.dark < .05) { const h = hour(); if (h > 16.5 && h < 19.5) { c.fillStyle = `rgba(255,120,60,${.12 * Math.sin((h - 16.5) / 3 * Math.PI)})`; c.fillRect(0, 0, W, H); } }
    drawHUD(path);
    if (S.mode === 'map') drawMap();
    if (S.mode === 'say') drawSay();
    if (S.mode === 'dead') drawDead();
    if (S.mode === 'pause') drawPause();
  }
  const inView = (o, a, b, c2, d) => o.x > a - 60 && o.x < c2 + 60 && o.y > b - 60 && o.y < d + 60;
  function drawPickup(g, x, y, k) {
    const col = { cash: '#46d160', pistol: '#ffd23a', smg: '#ffd23a', shotgun: '#ffd23a', health: '#ff4f5e', armor: '#4fa3ff', package: '#c58bff', briefcase: '#ffcf3f' }[k] || '#fff';
    g.save(); g.shadowColor = col; g.shadowBlur = 14; g.fillStyle = col + '44'; g.beginPath(); g.arc(x, y, 15, 0, TAU); g.fill(); g.shadowBlur = 0;
    g.fillStyle = col;
    if (k === 'cash') { g.fillRect(x - 8, y - 5, 16, 10); g.fillStyle = '#1d6b2b'; g.font = '900 10px system-ui'; g.textAlign = 'center'; g.fillText('$', x, y + 4); }
    else if (k === 'health') { g.fillRect(x - 2.5, y - 8, 5, 16); g.fillRect(x - 8, y - 2.5, 16, 5); }
    else if (k === 'armor') { g.beginPath(); g.moveTo(x - 8, y - 8); g.lineTo(x + 8, y - 8); g.lineTo(x + 7, y + 3); g.lineTo(x, y + 9); g.lineTo(x - 7, y + 3); g.closePath(); g.fill(); }
    else if (k === 'package') { g.fillRect(x - 8, y - 8, 16, 16); g.strokeStyle = '#5d2a8a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - 8); g.lineTo(x, y + 8); g.moveTo(x - 8, y); g.lineTo(x + 8, y); g.stroke(); }
    else if (k === 'briefcase') { g.fillStyle = '#5a3a1f'; g.fillRect(x - 10, y - 6, 20, 13); g.strokeStyle = col; g.lineWidth = 2; g.strokeRect(x - 4, y - 10, 8, 5); }
    else { g.fillStyle = '#1a1a1d'; g.fillRect(x - 9, y - 2, k === 'shotgun' ? 20 : 15, 4); g.fillRect(x - 9, y, 4, 7); g.strokeStyle = col; g.lineWidth = 1.5; g.strokeRect(x - 11, y - 4, k === 'shotgun' ? 24 : 19, 13); }
    g.restore();
  }
  function drawLights(cam, vx0, vy0, vx1, vy1) {
    const dk = S.dark; if (dk < .03) return;
    lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over'; lx.clearRect(0, 0, lc.width, lc.height);
    lx.fillStyle = `rgba(8,10,40,${dk})`; lx.fillRect(0, 0, lc.width, lc.height);
    lx.setTransform(DPR * cam.z, 0, 0, DPR * cam.z, DPR * (W / 2 - cam.x * cam.z), DPR * (H / 2 - cam.y * cam.z));
    lx.globalCompositeOperation = 'destination-out';
    const glow = (x, y, r, a) => { const g = lx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)'); lx.fillStyle = g; lx.beginPath(); lx.arc(x, y, r, 0, TAU); lx.fill(); };
    for (const l of city.lamps) if (inView(l, vx0, vy0, vx1, vy1)) glow(l.x, l.y, 95, .8);
    for (const car of cars) {
      if (car.dead || !inView(car, vx0, vy0, vx1, vy1)) continue;
      const ca = Math.cos(car.a), sa = Math.sin(car.a), sp = carSpec(car);
      lx.save(); lx.translate(car.x + ca * sp.L / 2, car.y + sa * sp.L / 2); lx.rotate(car.a);
      const g = lx.createRadialGradient(0, 0, 4, 60, 0, 200); g.addColorStop(0, 'rgba(0,0,0,.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); lx.fillStyle = g;
      lx.beginPath(); lx.moveTo(0, -8); lx.lineTo(200, -70); lx.lineTo(200, 70); lx.lineTo(0, 8); lx.closePath(); lx.fill(); lx.restore();
      if (car.siren) glow(car.x, car.y, 90, .9);
    }
    for (const b of city.blds) if (b.sign && inView({ x: (b.x + b.w / 2) * TS, y: (b.y + b.h / 2) * TS }, vx0 - 200, vy0 - 200, vx1 + 200, vy1 + 200)) glow((b.x + b.w / 2) * TS, (b.y + b.h / 2) * TS, 160, .6);
    glow(P.x, P.y, 70, .5);
    for (const p of parts) if (p.k === 'fire' || p.k === 'flash') glow(p.x, p.y, 50, .5);
    if (heli.on) glow(heli.x + 30, heli.y + 40, 130, 1);
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(lc, 0, 0); c.setTransform(DPR, 0, 0, DPR, 0, 0);
    // coloured glows on top
    c.save(); c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y); c.globalCompositeOperation = 'lighter';
    for (const car of cars) { if (!car.siren || car.dead || !inView(car, vx0, vy0, vx1, vy1)) continue; const on = Math.floor(S.t * 8) % 2; const g = c.createRadialGradient(car.x, car.y, 0, car.x, car.y, 80); g.addColorStop(0, on ? `rgba(255,40,60,${.5 * dk})` : `rgba(40,90,255,${.5 * dk})`); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(car.x, car.y, 80, 0, TAU); c.fill(); }
    if (heli.on) { const g = c.createRadialGradient(heli.x + 30, heli.y + 40, 0, heli.x + 30, heli.y + 40, 130); g.addColorStop(0, 'rgba(255,255,220,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(heli.x + 30, heli.y + 40, 130, 0, TAU); c.fill(); }
    c.restore();
  }

  /* ---------- HUD ---------- */
  function txt(s, x, y, size, col, align, weight, shadow) { c.font = `${weight || 800} ${size}px system-ui,-apple-system,Segoe UI,sans-serif`; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic'; if (shadow !== false) { c.fillStyle = 'rgba(0,0,0,.75)'; c.fillText(s, x + 2, y + 2); } c.fillStyle = col; c.fillText(s, x, y); }
  let mmCanvas = null;
  function minimapImg() {
    if (mmCanvas) return mmCanvas;
    mmCanvas = document.createElement('canvas'); mmCanvas.width = MW * 3; mmCanvas.height = MH * 3; const g = mmCanvas.getContext('2d');
    const col = ['#0f4a64', '#c9b37c', '#355e32', '#9aa0a8', '#6f6c66', '#2a2b30', '#3f7a3a', '#4a4c52', '#a7a39c', '#2f4a2f', '#6b5236', '#38b6d6'];
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { g.fillStyle = col[T[y * MW + x]]; g.fillRect(x * 3, y * 3, 3, 3); }
    return mmCanvas;
  }
  function drawHUD(path) {
    uiHits = [];
    const sm = W < 600, ms = sm ? 112 : 160, mx = 12, my = 12;
    // minimap
    const ref = P.car || P, img = minimapImg();
    c.save(); roundRect(c, mx, my, ms, ms, 12); c.fillStyle = 'rgba(0,0,0,.6)'; c.fill(); c.clip();
    const scl = 1.15, sx = ref.x / TS * 3 - ms / 2 / scl, sy = ref.y / TS * 3 - ms / 2 / scl;
    c.imageSmoothingEnabled = false; c.drawImage(img, sx, sy, ms / scl, ms / scl, mx, my, ms, ms); c.imageSmoothingEnabled = true;
    const mm = (x, y) => [mx + (x / TS * 3 - sx) * scl, my + (y / TS * 3 - sy) * scl];
    if (path.length > 1) { c.strokeStyle = '#c55bff'; c.lineWidth = 3; c.beginPath(); path.forEach((p, i) => { const [a, b] = mm(p.x, p.y); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke(); }
    const blip = (x, y, col, r, edge) => { let [a, b] = mm(x, y); if (edge) { a = clamp(a, mx + 6, mx + ms - 6); b = clamp(b, my + 6, my + ms - 6); } c.fillStyle = col; c.beginPath(); c.arc(a, b, r || 4, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1; c.stroke(); };
    for (const car of cars) if (car.siren) blip(car.x, car.y, Math.floor(S.t * 6) % 2 ? '#ff2a3a' : '#2a6bff', 3.5);
    for (const p of peds) if (!p.dead && (p.kind === 'gang' || (p.kind === 'cop' && S.wanted))) blip(p.x, p.y, p.kind === 'gang' ? '#ff3b3b' : '#4fa3ff', 2.5);
    if (heli.on) blip(heli.x, heli.y, '#fff', 4);
    blip(PL.gunshop.x, PL.gunshop.y, '#ff8a1e', 3.5, true); blip(PL.garage.x, PL.garage.y, '#ff4fa0', 3.5, true);
    const tg = stepTarget() || (!S.mission && save.m < MS.length ? MS[save.m].start : null);
    if (tg) blip(tg.x, tg.y, S.mission ? '#ffd23a' : '#ff4fa0', 5, true);
    if (S.wp) blip(S.wp.x, S.wp.y, '#c58bff', 4.5, true);
    const [pxm, pym] = mm(ref.x, ref.y); c.save(); c.translate(pxm, pym); c.rotate(P.car ? P.car.a : P.a); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(7, 0); c.lineTo(-5, -5); c.lineTo(-2, 0); c.lineTo(-5, 5); c.closePath(); c.fill(); c.restore();
    c.restore();
    c.strokeStyle = 'rgba(255,79,160,.7)'; c.lineWidth = 2; roundRect(c, mx, my, ms, ms, 12); c.stroke();
    const hh = Math.floor(hour()), mi = Math.floor(S.clock % 60);
    txt(String(hh).padStart(2, '0') + ':' + String(mi).padStart(2, '0'), mx + 4, my + ms + 20, 15, '#fff');
    if (S.distT > 0) { c.globalAlpha = clamp(S.distT, 0, 1); txt(L.dist[S.district] || '', mx + 64, my + ms + 20, 15, '#ffd23a'); c.globalAlpha = 1; }
    // money, stars, weapon, bars
    const rx = W - 14;
    txt(money$(save.money), rx, 34, sm ? 22 : 28, '#7dff8a', 'right', 900);
    for (let i = 0; i < 5; i++) { const on = i < S.wanted, fl = on && S.hidden > .5 && Math.floor(S.t * 4) % 2; c.fillStyle = on ? (fl ? 'rgba(255,255,255,.35)' : '#ffd23a') : 'rgba(255,255,255,.18)'; star(c, rx - 12 - (4 - i) * 26, 56, 10); }
    const w = P.weapon; txt(L.w[w] + (w !== 'fist' ? '  ' + (save.ammo[w] || 0) : ''), rx, 88, 15, '#fff', 'right');
    const bw = sm ? 110 : 150;
    c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 96, bw, 8); c.fillStyle = P.hp > 30 ? '#ff4f5e' : (Math.floor(S.t * 4) % 2 ? '#ff4f5e' : '#7a1f28'); c.fillRect(rx - bw, 96, bw * clamp(P.hp / 100, 0, 1), 8);
    if (P.armor > 0) { c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 107, bw, 6); c.fillStyle = '#4fa3ff'; c.fillRect(rx - bw, 107, bw * P.armor / 100, 6); }
    if (P.car) { const pc = P.car; c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 117, bw, 5); c.fillStyle = '#d6d6d6'; c.fillRect(rx - bw, 117, bw * clamp(pc.hp / pc.maxHp, 0, 1), 5); txt(Math.round(Math.abs(fwdV(pc)) * .45) + ' km/h', rx, 140, 14, '#fff', 'right'); }
    // timer & objective
    const M = S.mission;
    if (M && M.timer != null) { const tsec = Math.max(0, Math.ceil(M.timer)); txt(L.time + ' ' + Math.floor(tsec / 60) + ':' + String(tsec % 60).padStart(2, '0'), W / 2, 36, 22, tsec < 15 ? '#ff4f5e' : '#fff', 'center', 900); }
    if (M) { const st = M.m.steps[M.si]; if (st && st.t === 'chase') { const tc = M.tags[st.tag]; if (tc) { const bw2 = Math.min(240, W * .4); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(W / 2 - bw2 / 2, 46, bw2, 9); c.fillStyle = '#ff3b3b'; c.fillRect(W / 2 - bw2 / 2, 46, bw2 * clamp((tc.hp - tc.maxHp * .12) / (tc.maxHp * .88), 0, 1), 9); } } }
    let ob = objText();
    if (!M && save.m < MS.length && !S.free) ob = L.hint; else if (!M && save.m >= MS.length && S.t < 8) ob = L.allDone;
    if (S.shopOpen) ob = L.shopHint;
    if (!P.car && !M && !S.shopOpen) { for (const car of cars) if (!car.dead && !car.fire && Math.hypot(car.x - P.x, car.y - P.y) < 60) { ob = touch ? L.getInT : L.getIn; break; } }
    if (ob) { c.font = `700 ${sm ? 14 : 17}px system-ui`; const lines = wrap(ob, Math.min(W - 40, 640)); const bh = lines.length * (sm ? 19 : 23) + 14, by = H - (touch ? 150 : 24) - bh; c.fillStyle = 'rgba(0,0,0,.62)'; roundRect(c, W / 2 - Math.min(W - 30, 660) / 2, by, Math.min(W - 30, 660), bh, 10); c.fill(); lines.forEach((l, i) => txt(l, W / 2, by + 22 + i * (sm ? 19 : 23), sm ? 14 : 17, '#fff', 'center', 700, false)); }
    if (S.shopOpen) { const items = [[1, L.w.pistol, 100], [2, L.w.smg, 300], [3, L.w.shotgun, 500], [4, L.armor, 200]]; const bw3 = Math.min(150, (W - 40) / 4 - 8); items.forEach(([n, name, cost], i) => { const x = W / 2 - (bw3 + 8) * 2 + i * (bw3 + 8), y = H - (touch ? 150 : 24) - 120; c.fillStyle = 'rgba(30,20,10,.85)'; roundRect(c, x, y, bw3, 54, 8); c.fill(); c.strokeStyle = '#ff8a1e'; c.lineWidth = 2; c.stroke(); txt(name, x + bw3 / 2, y + 22, 14, '#fff', 'center'); txt('$' + cost, x + bw3 / 2, y + 42, 14, '#7dff8a', 'center'); uiHits.push({ x, y, w: bw3, h: 54, f: () => buy(n) }); }); }
    // toasts and banner
    toasts.forEach((t, i) => { c.globalAlpha = clamp(t.t, 0, 1); txt(t.s, W / 2, (M && M.timer != null ? 84 : 70) + i * 26, sm ? 15 : 18, t.col, 'center', 800); c.globalAlpha = 1; });
    if (S.banner) { const b = S.banner, a = clamp(b.t, 0, 1); c.globalAlpha = a; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, H * .3, W, 96); txt(b.s, W / 2, H * .3 + 50, sm ? 30 : 44, b.col, 'center', 900); if (b.sub) txt(b.sub, W / 2, H * .3 + 80, sm ? 14 : 18, '#fff', 'center', 700); c.globalAlpha = 1; }
    if (S.endT > 0) { c.globalAlpha = clamp(S.endT, 0, 1); txt(L.end, W / 2, H * .3 + 130, sm ? 15 : 20, '#ff9ad5', 'center', 800); c.globalAlpha = 1; }
    // touch controls
    if (touch && S.mode === 'play') {
      if (stick.on) { c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(stick.ox, stick.oy, 60, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(stick.ox + stick.x * 60, stick.oy + stick.y * 60, 26, 0, TAU); c.fill(); }
      else { c.fillStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.arc(90, H - 100, 56, 0, TAU); c.fill(); txt('◀ ▶', 90, H - 94, 14, 'rgba(255,255,255,.5)', 'center', 700, false); }
      for (const b of TB()) { c.fillStyle = b.k === 'fire' ? (tbtn.fire ? 'rgba(255,79,94,.6)' : 'rgba(255,79,94,.32)') : 'rgba(0,0,0,.45)'; c.beginPath(); c.arc(b.x + b.r, b.y + b.r, b.r, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.stroke(); txt(b.lab, b.x + b.r, b.y + b.r + b.r * .35, b.r * .8, '#fff', 'center', 800, false); }
    } else if (!touch && S.mode === 'play' && S.t < 14) { c.globalAlpha = clamp(14 - S.t, 0, 1) * .85; txt(L.keys, W / 2, H - 8, 12, '#ddd', 'center', 600); c.globalAlpha = 1; }
    if (!touch && S.mode === 'play' && !P.car && mouse.has) { c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1.5; c.beginPath(); c.arc(mouse.x, mouse.y, 8, 0, TAU); c.moveTo(mouse.x - 13, mouse.y); c.lineTo(mouse.x - 4, mouse.y); c.moveTo(mouse.x + 4, mouse.y); c.lineTo(mouse.x + 13, mouse.y); c.moveTo(mouse.x, mouse.y - 13); c.lineTo(mouse.x, mouse.y - 4); c.moveTo(mouse.x, mouse.y + 4); c.lineTo(mouse.x, mouse.y + 13); c.stroke(); }
  }
  function wrap(s, maxW) { const words = String(s).split(' '), out = []; let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  function button(label, x, y, w, h, f, primary, disabled) {
    c.fillStyle = disabled ? 'rgba(255,255,255,.08)' : primary ? '#ff4fa0' : 'rgba(255,255,255,.12)'; roundRect(c, x, y, w, h, 12); c.fill();
    if (!primary) { c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1.5; c.stroke(); }
    txt(label, x + w / 2, y + h / 2 + 6, Math.min(18, h * .4), disabled ? '#888' : '#fff', 'center', 800, false);
    if (!disabled) uiHits.push({ x, y, w, h, f: () => { audio.init(); audio.sfx('click'); f(); } });
  }
  function drawSunset(t) {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0b3b'); g.addColorStop(.45, '#7a1f6a'); g.addColorStop(.62, '#ff6a4d'); g.addColorStop(.63, '#2a0d3a'); g.addColorStop(1, '#090616');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const sx = W * .5, sy = H * .62, sr = Math.min(W, H) * .22;
    c.save(); c.beginPath(); c.rect(0, 0, W, sy); c.clip();
    const sg = c.createLinearGradient(0, sy - sr, 0, sy); sg.addColorStop(0, '#ffe36b'); sg.addColorStop(1, '#ff3f8e'); c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill();
    c.fillStyle = '#7a1f6a'; for (let i = 0; i < 6; i++) c.fillRect(sx - sr, sy - sr * .5 + i * sr * .1 + i * i * 1.5, sr * 2, 2 + i * 1.3);
    c.restore();
    // skyline
    const rr = mulberry(7); c.fillStyle = '#12061f'; let x = 0; while (x < W) { const bw = 20 + rr() * 50, bh = 30 + rr() * H * .22; c.fillRect(x, sy - bh, bw, bh); x += bw + 2; }
    c.fillStyle = 'rgba(255,200,120,.5)'; x = 0; const r2 = mulberry(9); while (x < W) { x += 6 + r2() * 30; c.fillRect(x, sy - 10 - r2() * H * .18, 2, 2); }
    // grid sea
    c.strokeStyle = 'rgba(255,79,160,.45)'; c.lineWidth = 1.2;
    for (let i = 0; i < 14; i++) { const yy = sy + Math.pow(i / 14, 1.8) * (H - sy) + ((t * 18) % 1) * 0; c.beginPath(); c.moveTo(0, yy); c.lineTo(W, yy); c.stroke(); }
    for (let i = -12; i <= 12; i++) { c.beginPath(); c.moveTo(sx + i * 20, sy); c.lineTo(sx + i * 160, H); c.stroke(); }
    // palms
    const palmS = (px, s, flip) => { c.save(); c.translate(px, H * .99); c.scale(flip ? -s : s, s); c.fillStyle = '#09040f'; c.beginPath(); c.moveTo(-6, 0); c.quadraticCurveTo(10, -150, 40, -300); c.lineTo(48, -298); c.quadraticCurveTo(20, -150, 8, 0); c.fill(); for (let i = 0; i < 7; i++) { c.save(); c.translate(44, -300); c.rotate(-2.6 + i * .75 + Math.sin(t + i) * .03); c.beginPath(); c.ellipse(60, 0, 64, 9, .25, 0, TAU); c.fill(); c.restore(); } c.restore(); };
    palmS(W * .06, Math.min(1, H / 700), false); palmS(W * .95, Math.min(.85, H / 800), true);
  }
  function drawMenu() {
    uiHits = []; drawSunset(S.t);
    const sm = W < 600, cx = W / 2;
    c.save(); c.textAlign = 'center'; c.font = `900 italic ${sm ? 46 : 84}px system-ui,Impact,sans-serif`; c.lineWidth = sm ? 5 : 8; c.strokeStyle = '#2a0d3a'; c.strokeText('PALMERA', cx, H * .2); const tg = c.createLinearGradient(0, H * .2 - 70, 0, H * .2); tg.addColorStop(0, '#9ff3ff'); tg.addColorStop(1, '#ff4fa0'); c.fillStyle = tg; c.fillText('PALMERA', cx, H * .2);
    c.font = `900 italic ${sm ? 38 : 66}px "Brush Script MT",cursive,system-ui`; c.shadowColor = '#ff4fa0'; c.shadowBlur = 18; c.fillStyle = '#ffe36b'; c.fillText('Heat', cx + (sm ? 60 : 120), H * .2 + (sm ? 40 : 62)); c.restore();
    c.font = `700 ${sm ? 12 : 15}px system-ui`; wrap(L.sub + ' · ' + L.tag, W - 30).forEach((l, i) => txt(l, cx, H * .2 + (sm ? 66 : 104) + i * 16, sm ? 12 : 15, '#ffd6ec', 'center', 700));
    if (S.mode === 'list') { drawList(); return; }
    const bw = Math.min(340, W - 40), bh = sm ? 46 : 52, x = cx - bw / 2; let y = H * .2 + (sm ? 104 : 130);
    if (save.m > 0 && save.m < MS.length) { button(fmt(L.cont, { n: save.m + 1 }) + ' · ' + L.ms[save.m].n, x, y, bw, bh, () => play(false), true); y += bh + 10; }
    else if (save.m === 0) { button(L.story, x, y, bw, bh, () => play(false), true); y += bh + 10; }
    button(L.free, x, y, bw, bh, () => play(true), save.m >= MS.length); y += bh + 10;
    button(L.missions, x, y, bw, bh, () => { S.mode = 'list'; }); y += bh + 10;
    button(save.mute ? L.soundOff : L.soundOn, x, y, bw, bh * .8, () => { audio.setMute(!save.mute); store(); }); y += bh * .8 + 14;
    txt(money$(save.money) + '   ·   ' + fmt(L.paidOff, { n: save.debt.toLocaleString('en-US') }), cx, y + 10, sm ? 13 : 15, '#7dff8a', 'center', 800);
    c.font = `600 ${sm ? 11 : 13}px system-ui`; wrap(touch ? L.keysT : L.keys, W - 40).forEach((l, i) => txt(l, cx, H - 40 + i * 16 - (touch ? 16 : 0), sm ? 11 : 13, '#e9d7ff', 'center', 600));
  }
  function drawList() {
    const sm = W < 600, bw = Math.min(420, W - 40), bh = sm ? 40 : 46, x = W / 2 - bw / 2; let y = H * .2 + (sm ? 90 : 128);
    MS.forEach((m, i) => { const open = i <= save.m; button((i + 1) + '. ' + L.ms[i].n + (open ? '' : ' · ' + L.locked), x, y, bw, bh - 6, () => { play(true); P.x = m.start.x; P.y = m.start.y + TS; S.cam.x = P.x; S.cam.y = P.y; startMission(i); }, false, !open); y += bh; });
    button(L.back, x, y + 6, bw, bh - 6, () => { S.mode = 'menu'; });
  }
  function play(free) {
    audio.init(); S.mode = 'play'; S.free = free; S.t = 0;
    if (!S.started) { S.started = true; if (save.m > 0) { const st = MS[Math.min(save.m, MS.length - 1)].start; const sp = save.m >= MS.length ? PL.garageWalk : st; P.x = sp.x; P.y = sp.y + TS * 1.5; } S.cam.x = P.x; S.cam.y = P.y; }
    if (!free && save.m === 0 && !S.mission) startMission(0);
    cv.focus();
  }
  function drawSay() {
    const s = S.say, ln = s.lines[s.i]; if (!ln) return;
    uiHits = [];
    const [who, text] = ln, sm = W < 600;
    const NAMES = { rook: 'Rook Navarro', ines: 'Ines Navarro', coral: 'Coral Vasquez', harlan: 'Det. Wade Harlan' };
    const COLS = { rook: '#ff4f5e', ines: '#ff9ad5', coral: '#39f3ff', harlan: '#ffd23a' };
    c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, 0, W, H);
    c.fillStyle = '#000'; c.fillRect(0, 0, W, H * .08); c.fillRect(0, H * .92, W, H * .08);
    const bw = Math.min(W - 24, 760), bx = W / 2 - bw / 2, bh = sm ? 150 : 170, by = H - bh - H * .1;
    c.fillStyle = 'rgba(12,6,24,.92)'; roundRect(c, bx, by, bw, bh, 14); c.fill(); c.strokeStyle = COLS[who]; c.lineWidth = 2; c.stroke();
    portrait(bx + 16, by + 16, sm ? 64 : 84, who);
    const tx0 = bx + 16 + (sm ? 64 : 84) + 16;
    txt(NAMES[who], tx0, by + 34, sm ? 16 : 20, COLS[who], 'left', 900);
    c.font = `600 ${sm ? 14 : 17}px system-ui`; wrap(text, bw - (tx0 - bx) - 16).forEach((l, i) => txt(l, tx0, by + 62 + i * (sm ? 20 : 24), sm ? 14 : 17, '#fff', 'left', 600, false));
    txt(L.ms[S.mission ? S.mission.i : 0].n.toUpperCase(), W / 2, H * .08 - 12, sm ? 14 : 18, '#ffd23a', 'center', 900, false);
    txt(L.tap + ' ▸', bx + bw - 14, by + bh - 12, 12, 'rgba(255,255,255,.6)', 'right', 600, false);
  }
  function portrait(x, y, s, who) {
    c.save(); roundRect(c, x, y, s, s, 10); c.fillStyle = { rook: '#3a1020', ines: '#3a1032', coral: '#0c2a36', harlan: '#2c2410' }[who]; c.fill(); c.clip();
    const cx = x + s / 2, cy = y + s * .58, k = s / 84;
    const skin = { rook: '#c68a5a', ines: '#d9a477', coral: '#b97a50', harlan: '#e8b98f' }[who];
    c.fillStyle = { rook: '#d8343b', ines: '#2b2d42', coral: '#f4f4f4', harlan: '#4a3a22' }[who]; c.beginPath(); c.ellipse(cx, y + s * 1.05, s * .42, s * .32, 0, 0, TAU); c.fill();
    if (who === 'rook') { c.fillStyle = '#ffd6e0'; for (const [u, v] of [[-14, 6], [10, 12], [0, 20], [-20, 22]]) { c.beginPath(); c.arc(cx + u * k, y + s * .82 + v * k, 3 * k, 0, TAU); c.fill(); } }
    c.fillStyle = skin; c.fillRect(cx - 7 * k, cy + 10 * k, 14 * k, 14 * k); c.beginPath(); c.ellipse(cx, cy, 17 * k, 21 * k, 0, 0, TAU); c.fill();
    c.fillStyle = '#111';
    if (who === 'rook') { c.beginPath(); c.ellipse(cx, cy - 16 * k, 19 * k, 9 * k, 0, Math.PI, TAU); c.fill(); c.fillRect(cx - 2 * k, cy - 18 * k, 26 * k, 5 * k); c.fillStyle = 'rgba(30,20,10,.5)'; c.fillRect(cx - 12 * k, cy + 8 * k, 24 * k, 4 * k); }
    else if (who === 'ines') { c.fillStyle = '#2a1712'; c.beginPath(); c.ellipse(cx, cy - 6 * k, 21 * k, 24 * k, 0, Math.PI * .95, TAU * 1.02); c.fill(); c.fillRect(cx - 21 * k, cy - 6 * k, 8 * k, 34 * k); c.fillRect(cx + 13 * k, cy - 6 * k, 8 * k, 34 * k); c.fillStyle = '#ff4fa0'; c.fillRect(cx - 20 * k, cy - 18 * k, 40 * k, 4 * k); }
    else if (who === 'coral') { c.fillStyle = '#e8e8e8'; c.beginPath(); c.ellipse(cx, cy - 12 * k, 20 * k, 14 * k, 0, Math.PI, TAU); c.fill(); c.fillStyle = '#111'; c.fillRect(cx - 15 * k, cy - 4 * k, 30 * k, 7 * k); c.fillStyle = '#ff5f7a'; c.beginPath(); c.arc(cx + 18 * k, cy + 6 * k, 3 * k, 0, TAU); c.fill(); }
    else { c.fillStyle = '#6b5a3a'; c.fillRect(cx - 18 * k, cy - 22 * k, 36 * k, 8 * k); c.fillStyle = '#7a6a4a'; c.fillRect(cx - 26 * k, cy - 16 * k, 52 * k, 4 * k); c.fillStyle = '#5a4630'; c.fillRect(cx - 10 * k, cy + 8 * k, 20 * k, 4 * k); }
    c.fillStyle = '#111'; if (who !== 'coral') { c.fillRect(cx - 9 * k, cy - 2 * k, 5 * k, 3 * k); c.fillRect(cx + 4 * k, cy - 2 * k, 5 * k, 3 * k); }
    c.restore();
  }
  function drawDead() {
    const a = clamp(S.deadT / 1, 0, 1); c.fillStyle = `rgba(${S.deadKind === 'flat' ? '90,0,10' : '0,10,60'},${a * .55})`; c.fillRect(0, 0, W, H);
    txt(S.deadKind === 'flat' ? L.flat : L.cuffed, W / 2, H * .45, W < 600 ? 40 : 72, S.deadKind === 'flat' ? '#ff4f5e' : '#6bb8ff', 'center', 900);
    if (S.deadT > 1.2) txt(L.tap, W / 2, H * .45 + 44, 15, '#fff', 'center', 700);
  }
  function drawMap() {
    uiHits = [];
    c.fillStyle = 'rgba(0,0,0,.82)'; c.fillRect(0, 0, W, H);
    const s = Math.min(W, H) - 70, x = (W - s) / 2, y = (H - s) / 2 + 12; S.mapRect = { x, y, s };
    c.imageSmoothingEnabled = false; c.drawImage(minimapImg(), x, y, s, s); c.imageSmoothingEnabled = true;
    const k = s / (MW * TS), pt = (p, col, r) => { c.fillStyle = col; c.beginPath(); c.arc(x + p.x * k, y + p.y * k, r, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1; c.stroke(); };
    const ref = P.car || P; pt(ref, '#fff', 6);
    if (!S.mission && save.m < MS.length) pt(MS[save.m].start, '#ff4fa0', 7);
    const tg = stepTarget(); if (tg) pt(tg, '#ffd23a', 7);
    if (S.wp) pt(S.wp, '#c58bff', 6);
    pt(PL.gunshop, '#ff8a1e', 5); pt(PL.garage, '#ff4fa0', 5); PL.hospitals.forEach(h => pt(h, '#ff4f5e', 5)); pt(PL.police, '#4fa3ff', 5);
    const lab = (k2, tx, ty) => txt(L.dist[k2], x + tx * TS * k, y + ty * TS * k, 13, '#ffd23a', 'center', 800);
    lab('lp', 18, 20); lab('gh', 48, 20); lab('os', 74, 30); lab('gf', 16, 72); lab('pm', 48, 72); lab('cn', 40, 49.5); lab('ns', 40, 4.5);
    txt(L.mapHelp, W / 2, y - 12, 14, '#fff', 'center', 700);
  }
  function drawPause() {
    uiHits = []; c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(0, 0, W, H);
    txt(L.paused, W / 2, H * .3, 40, '#ff9ad5', 'center', 900);
    const bw = Math.min(300, W - 40), x = W / 2 - bw / 2; let y = H * .3 + 30;
    button(L.resume, x, y, bw, 48, togglePause, true); y += 58;
    button(save.mute ? L.soundOff : L.soundOn, x, y, bw, 44, () => { audio.setMute(!save.mute); store(); }); y += 54;
    button(L.quit, x, y, bw, 44, () => { audio.suspend(false); if (S.mission) failMission('', true); S.banner = null; if (P.car) exitCar(true); audio.radio(false); store(); S.mode = 'menu'; });
  }

  /* ---------- loop ---------- */
  let last = performance.now(), raf = 0, saveT = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!host.isConnected) { destroy(); return; }
    let dt = Math.min(.05, (now - last) / 1000); last = now;
    if (S.mode === 'menu' || S.mode === 'list') S.t += dt;
    else { const n = dt > .025 ? 2 : 1; for (let i = 0; i < n; i++) update(dt / n); }
    saveT += dt; if (saveT > 5 && S.mode === 'play') { saveT = 0; store(); }
    try { draw(); } catch (e) { if (!S.errLogged) { S.errLogged = 1; console.error(e); } }
  }
  raf = requestAnimationFrame(frame);
  function destroy() { cancelAnimationFrame(raf); removeEventListener('keydown', kd); removeEventListener('keyup', ku); document.removeEventListener('visibilitychange', vis); if (ro) ro.disconnect(); }

  return {
    get S() { return S; }, P, get cars() { return cars; }, get peds() { return peds; }, city, PL, MS, save,
    play, startMission, setWanted: n => { S.wanted = n; S.hidden = 0; }, enterCar, exitCar, update, draw, destroy, keys, mkCar, mkPed,
    teleport: (x, y) => { if (P.car) { P.car.x = x; P.car.y = y; } P.x = x; P.y = y; S.cam.x = x; S.cam.y = y; },
    shoot: a => shoot(P, a, P.weapon), advanceSay, nextStep
  };
}

global.PalmeraHeat = { mount };
})(window);
