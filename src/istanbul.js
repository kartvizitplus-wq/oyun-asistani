/* İSTANBUL HEAT – an original 3D open-world crime story set in a stylised Istanbul, for PickRadar.
   Built on three.js (MIT). Every model, texture, sound and the radio is generated in code: no image or audio files.
   Original characters and story; not affiliated with any other game or publisher. */
(function (global) {
'use strict';

const LANG = {
 en: {
  name: 'İstanbul Heat', sub: '3D open-world crime story', tag: 'One city on two continents. One debt. One driver who never talks.',
  story: 'Start the story', cont: 'Continue · mission {n}', free: 'Free roam', missions: 'Missions', locked: 'Locked',
  soundOn: 'Sound: on', soundOff: 'Sound: off', back: '← Back', resume: 'Resume', quit: 'Main menu', paused: 'Paused',
  qHigh: 'Graphics: high', qLow: 'Graphics: fast',
  flat: 'FLATLINED', cuffed: 'CUFFED', hosp: 'Hospital bill −${n}', bail: 'Bail −${n}', passed: 'MISSION PASSED', failed: 'MISSION FAILED',
  tap: 'Click or tap to continue', getIn: 'F: get in', getInT: 'Tap 🚗 to get in', lost: 'You lost the cops',
  spray: 'Ela repainted the car. The heat is off.', noMoney: 'Not enough cash', radioOff: 'Radio off',
  pick: '{w} picked up', burning: 'The car is burning! Get out!', sinking: 'The car is sinking! Swim!', armor: 'Armor', health: 'Health',
  w: { fist: 'Fists', pistol: 'Pistol', smg: 'SMG', rifle: 'Rifle' },
  fail: { dead: 'You flatlined.', busted: 'You got cuffed.', car: 'The vehicle was destroyed.', time: 'Out of time.', lost: 'The target got away.', dmg: 'The car is too damaged.' },
  mapHelp: 'Click / tap the map to set a waypoint · M to close', wp: 'Waypoint set', end: 'THE END · İstanbul is yours. Free roam continues.',
  mission: 'Mission', hint: 'Go to the pink marker to start the next mission', allDone: 'Story complete · enjoy the city',
  keys: 'WASD move · Mouse look (click to lock) · Left click shoot · Right click aim · F vehicle · Shift sprint · Space jump / handbrake / climb · C descend · Q/E weapon · R radio · M map · P pause',
  keysT: 'Left stick move · drag right side to look · 🔫 shoot · 🚗 vehicle · ⤒ jump/climb · ⇄ weapon · 🗺 map',
  time: 'Time', cash: '+${n}', swim: 'Swimming', shop: 'Gun shop', shopHint: 'Buy: 1 pistol ammo $100 · 2 SMG $300 · 3 rifle $600 · 4 armor $200', bought: 'Bought', paidOff: 'Debt left: ${n}',
  dist: { bey: 'Beyoğlu', tar: 'Historic Peninsula', bes: 'Beşiktaş', lev: 'Levent', bal: 'Balat', usk: 'Üsküdar', kad: 'Kadıköy', bey2: 'Beylerbeyi', bog: 'Bosphorus', hal: 'Golden Horn', mar: 'Sea of Marmara' },
  ms: [
   { n: 'Out of the Cage', b: [['ela', 'Four years, Kerem. Four years, and you walk out like nothing happened.'], ['kerem', "I didn't do it, Ela. Inspector Harun set me up."], ['ela', 'Tell that to the bank. They take my garage in Kasımpaşa in thirty days unless your old debt is paid. Get over here.']],
     o: ['Grab a car: walk up to one and press F.', "Drive to Ela's garage in Kasımpaşa. Follow the purple line."], e: [['ela', 'Bad news, brother. Mercan Sarıca bought your debt. Fifty grand. She owns you now.']] },
   { n: 'Paint Job', b: [['ela', 'I need something shiny to sell. A yellow sports car is parked on the Bebek shore road.'], ['ela', 'Bring it here in one piece. Every dent comes out of your cut.']],
     o: ['Find the yellow sports car in Bebek, on the Bosphorus shore.', 'Bring it to the garage. Keep it above half health.'], e: [['ela', 'Not bad, little brother. Not bad at all.']] },
   { n: 'Saltwater', b: [['mercan', 'So this is Kerem. The driver who never talks.'], ['kerem', "I'm here to work off the debt."], ['mercan', 'My couriers threw five packages into the Bosphorus when the coast guard showed up. Take my boat at the Karaköy pier, or swim. Get them before the current does.']],
     o: ['Collect the packages floating in the Bosphorus: {n}/5.'], e: [['mercan', 'Wet but fast. Ten thousand off your tab.']] },
   { n: 'Hot Cargo', b: [['mercan', 'A van is waiting at the Haydarpaşa docks in Kadıköy. It goes to my warehouse in Levent.'], ['mercan', "The harbor police already have your plate. Don't bring them to my door."]],
     o: ['Get in the van at Haydarpaşa.', 'Lose the cops.', 'Deliver the van to the warehouse in Levent. No stars allowed.'], e: [['mercan', 'Clean work. Another fifteen off.']] },
   { n: 'Glass Jaw', b: [['mercan', 'Cem Camcı launders my money and skims off the top.'], ['mercan', "He's leaving his Levent tower in a silver sedan. Stop that car. I want his briefcase."]],
     o: ["Wreck Cem's silver car.", 'Grab the briefcase.'], e: [['kerem', "Mercan... there's a badge number in this briefcase. Inspector Harun's. They're in it together."]] },
   { n: 'Balat Wolves', b: [['ela', 'The Balat Wolves smashed up my garage! Somebody paid them. Somebody with a badge.'], ['kerem', 'Stay down. Call me if they come back.'], ['ela', "They're hiding in Balat, by the Golden Horn. Take the SMG from under the counter. Go."]],
     o: ['Take out the Balat Wolves: {n} left.'], e: [['ela', 'They were waiting for you, Kerem. Harun wants you gone.']] },
   { n: 'Ledger Run', b: [['ela', "Harun's ledger crosses to the Asian side in two minutes. Over the Bosphorus Bridge, then to Üsküdar."], ['kerem', 'Then I get there first.']],
     o: ['Hit the checkpoints before the transfer: {n}/6.'], e: [['kerem', 'Every bribe Harun ever took. And every one Mercan paid.']] },
   { n: 'İstanbul Heat', b: [['mercan', "You read my ledger, driver. Harun and I have an understanding, and you're not part of it."], ['harun', "All units: Kerem Yalçın, armed and dangerous. Bring him in. Or don't."]],
     o: ["Wreck Inspector Harun's black car.", "Take the ledger to the Maiden's Tower. Boat or swim: the press is waiting on the island."], e: [['ela', "It's on every channel. Harun's in cuffs, Mercan's boats are seized, and the debt is gone."], ['kerem', 'The Bosphorus is quiet tonight. Let it stay that way. For a while.']] }
  ]
 },
 tr: {
  name: 'İstanbul Heat', sub: '3D açık dünya suç hikâyesi', tag: 'İki kıtada bir şehir. Bir borç. Hiç konuşmayan bir şoför.',
  story: 'Hikâyeye başla', cont: 'Devam et · görev {n}', free: 'Serbest dolaş', missions: 'Görevler', locked: 'Kilitli',
  soundOn: 'Ses: açık', soundOff: 'Ses: kapalı', back: '← Geri', resume: 'Devam', quit: 'Ana menü', paused: 'Duraklatıldı',
  qHigh: 'Grafik: yüksek', qLow: 'Grafik: hızlı',
  flat: 'HASTANELİK', cuffed: 'KELEPÇELENDİN', hosp: 'Hastane faturası −${n}', bail: 'Kefalet −${n}', passed: 'GÖREV TAMAM', failed: 'GÖREV BAŞARISIZ',
  tap: 'Devam etmek için tıkla ya da dokun', getIn: 'F: araca bin', getInT: 'Binmek için 🚗', lost: 'Polisi ektin',
  spray: 'Ela arabayı boyadı. Polis izini kaybetti.', noMoney: 'Paran yetmiyor', radioOff: 'Radyo kapalı',
  pick: '{w} alındı', burning: 'Araba yanıyor! Hemen in!', sinking: 'Araba batıyor! Yüz!', armor: 'Zırh', health: 'Can',
  w: { fist: 'Yumruk', pistol: 'Tabanca', smg: 'Makineli', rifle: 'Tüfek' },
  fail: { dead: 'Hastanelik oldun.', busted: 'Kelepçelendin.', car: 'Araç yok oldu.', time: 'Süre doldu.', lost: 'Hedef kaçtı.', dmg: 'Araba çok hasarlı.' },
  mapHelp: 'Hedef koymak için haritaya tıkla / dokun · kapatmak için M', wp: 'Hedef noktası kondu', end: 'SON · İstanbul artık senin. Serbest dolaşma devam ediyor.',
  mission: 'Görev', hint: 'Sonraki görev için pembe işarete git', allDone: 'Hikâye bitti · şehrin tadını çıkar',
  keys: 'WASD hareket · Fare bakış (kilitlemek için tıkla) · Sol tık ateş · Sağ tık nişan · F araç · Shift koş · Boşluk zıpla / el freni / yüksel · C alçal · Q/E silah · R radyo · M harita · P duraklat',
  keysT: 'Sol çubuk hareket · sağ tarafı sürükle: bakış · 🔫 ateş · 🚗 araç · ⤒ zıpla/yüksel · ⇄ silah · 🗺 harita',
  time: 'Süre', cash: '+${n}', swim: 'Yüzüyorsun', shop: 'Silahçı', shopHint: 'Satın al: 1 tabanca mermisi $100 · 2 makineli $300 · 3 tüfek $600 · 4 zırh $200', bought: 'Alındı', paidOff: 'Kalan borç: ${n}',
  dist: { bey: 'Beyoğlu', tar: 'Tarihi Yarımada', bes: 'Beşiktaş', lev: 'Levent', bal: 'Balat', usk: 'Üsküdar', kad: 'Kadıköy', bey2: 'Beylerbeyi', bog: 'Boğaz', hal: 'Haliç', mar: 'Marmara' },
  ms: [
   { n: 'Kafesten Çıkış', b: [['ela', 'Dört yıl Kerem. Dört yıl, sonra hiçbir şey olmamış gibi çıkıp geliyorsun.'], ['kerem', 'Ben yapmadım Ela. Komiser Harun bana tuzak kurdu.'], ['ela', "Bunu bankaya anlat. Eski borcun ödenmezse otuz gün içinde Kasımpaşa'daki garajımı alıyorlar. Hemen buraya gel."]],
     o: ["Bir araba kap: birine yürü ve F'ye bas.", "Kasımpaşa'daki Ela'nın garajına sür. Mor çizgiyi takip et."], e: [['ela', 'Kötü haber abi. Mercan Sarıca borcunu satın aldı. Elli bin. Artık ona aitsin.']] },
   { n: 'Boya İşi', b: [['ela', 'Satacak parlak bir şey lazım. Bebek sahil yolunda sarı bir spor araba park hâlinde.'], ['ela', 'Tek parça getir. Her göçük senin payından düşer.']],
     o: ["Bebek'te, Boğaz kıyısındaki sarı spor arabayı bul.", 'Garaja getir. Sağlığı yarının altına düşmesin.'], e: [['ela', 'Fena değil abi. Hiç fena değil.']] },
   { n: 'Tuzlu Su', b: [['mercan', 'Demek Kerem bu. Hiç konuşmayan şoför.'], ['kerem', 'Borcumu çalışarak ödemeye geldim.'], ['mercan', "Sahil güvenlik gelince kuryelerim Boğaz'a beş paket attı. Karaköy iskelesindeki teknemi al ya da yüz. Akıntı almadan topla."]],
     o: ["Boğaz'da yüzen paketleri topla: {n}/5."], e: [['mercan', 'Islak ama hızlı. Borcundan on bin düştüm.']] },
   { n: 'Sıcak Kargo', b: [['mercan', "Kadıköy'de Haydarpaşa rıhtımında bir minibüs bekliyor. Levent'teki depoma gidecek."], ['mercan', 'Liman polisi plakanı biliyor. Onları kapıma getirme.']],
     o: ["Haydarpaşa'daki minibüse bin.", 'Polisi ek.', "Minibüsü Levent'teki depoya teslim et. Aranma yıldızı olmayacak."], e: [['mercan', 'Temiz iş. On beş bin daha düştü.']] },
   { n: 'Cam Çene', b: [['mercan', 'Cem Camcı paramı aklıyor ve üstünden çalıyor.'], ['mercan', "Gümüş bir sedanla Levent'teki kulesinden çıkıyor. O arabayı durdur. Çantasını istiyorum."]],
     o: ["Cem'in gümüş arabasını hurdaya çevir.", 'Çantayı al.'], e: [['kerem', "Mercan... çantada bir rozet numarası var. Komiser Harun'un. İkisi ortak."]] },
   { n: 'Balat Kurtları', b: [['ela', 'Balat Kurtları garajımı darmadağın etti! Biri onlara para verdi. Rozetli biri.'], ['kerem', 'Sen eğil. Geri gelirlerse beni ara.'], ['ela', "Haliç kıyısında, Balat'ta saklanıyorlar. Tezgâhın altındaki makineliyi al. Git."]],
     o: ["Balat Kurtları'nı temizle: {n} kaldı."], e: [['ela', 'Seni bekliyorlardı Kerem. Harun senden kurtulmak istiyor.']] },
   { n: 'Defter Koşusu', b: [['ela', "Harun'un defteri iki dakika sonra Anadolu yakasına geçiyor. Boğaz Köprüsü'nden, sonra Üsküdar'a."], ['kerem', 'O zaman ben önce varırım.']],
     o: ['Transferden önce kontrol noktalarından geç: {n}/6.'], e: [['kerem', "Harun'un aldığı her rüşvet. Ve Mercan'ın verdiği her biri."]] },
   { n: 'İstanbul Heat', b: [['mercan', "Defterimi okudun şoför. Harun'la anlaşmamız var ve sen o anlaşmada yoksun."], ['harun', 'Tüm ekipler: Kerem Yalçın silahlı ve tehlikeli. Getirin. Ya da getirmeyin.']],
     o: ["Komiser Harun'un siyah arabasını hurdaya çevir.", "Defteri Kız Kulesi'ne götür. Tekneyle ya da yüzerek: basın adada bekliyor."], e: [['ela', "Bütün kanallarda. Harun kelepçeli, Mercan'ın teknelerine el kondu ve borç bitti."], ['kerem', 'Boğaz bu gece sessiz. Bir süre böyle kalsın.']] }
  ]
 },
 es: {
  name: 'İstanbul Heat', sub: 'Historia criminal 3D de mundo abierto', tag: 'Una ciudad en dos continentes. Una deuda. Un conductor que nunca habla.',
  story: 'Empezar la historia', cont: 'Continuar · misión {n}', free: 'Modo libre', missions: 'Misiones', locked: 'Bloqueada',
  soundOn: 'Sonido: sí', soundOff: 'Sonido: no', back: '← Volver', resume: 'Seguir', quit: 'Menú principal', paused: 'Pausa',
  qHigh: 'Gráficos: altos', qLow: 'Gráficos: rápidos',
  flat: 'AL HOSPITAL', cuffed: 'ESPOSADO', hosp: 'Factura del hospital −${n}', bail: 'Fianza −${n}', passed: 'MISIÓN CUMPLIDA', failed: 'MISIÓN FALLIDA',
  tap: 'Haz clic o toca para continuar', getIn: 'F: subir', getInT: 'Toca 🚗 para subir', lost: 'Perdiste a la policía',
  spray: 'Ela pintó el coche. Ya no te buscan.', noMoney: 'No tienes dinero suficiente', radioOff: 'Radio apagada',
  pick: '{w} recogido', burning: '¡El coche arde! ¡Sal ya!', sinking: '¡El coche se hunde! ¡Nada!', armor: 'Blindaje', health: 'Salud',
  w: { fist: 'Puños', pistol: 'Pistola', smg: 'Subfusil', rifle: 'Fusil' },
  fail: { dead: 'Acabaste en el hospital.', busted: 'Te esposaron.', car: 'El vehículo quedó destruido.', time: 'Se acabó el tiempo.', lost: 'El objetivo escapó.', dmg: 'El coche está demasiado dañado.' },
  mapHelp: 'Haz clic / toca el mapa para marcar destino · M para cerrar', wp: 'Destino marcado', end: 'FIN · Estambul es tuya. El modo libre sigue.',
  mission: 'Misión', hint: 'Ve al marcador rosa para la siguiente misión', allDone: 'Historia completa · disfruta la ciudad',
  keys: 'WASD mover · Ratón mirar (clic para bloquear) · Clic izq. disparar · Clic der. apuntar · F vehículo · Shift correr · Espacio saltar / freno de mano / subir · C bajar · Q/E arma · R radio · M mapa · P pausa',
  keysT: 'Stick izquierdo mover · arrastra a la derecha para mirar · 🔫 disparar · 🚗 vehículo · ⤒ saltar/subir · ⇄ arma · 🗺 mapa',
  time: 'Tiempo', cash: '+${n}', swim: 'Nadando', shop: 'Armería', shopHint: 'Comprar: 1 balas de pistola $100 · 2 subfusil $300 · 3 fusil $600 · 4 blindaje $200', bought: 'Comprado', paidOff: 'Deuda restante: ${n}',
  dist: { bey: 'Beyoğlu', tar: 'Península Histórica', bes: 'Beşiktaş', lev: 'Levent', bal: 'Balat', usk: 'Üsküdar', kad: 'Kadıköy', bey2: 'Beylerbeyi', bog: 'Bósforo', hal: 'Cuerno de Oro', mar: 'Mar de Mármara' },
  ms: [
   { n: 'Fuera de la jaula', b: [['ela', 'Cuatro años, Kerem. Cuatro años, y sales como si nada.'], ['kerem', 'Yo no fui, Ela. El inspector Harun me tendió una trampa.'], ['ela', 'Cuéntaselo al banco. Me quitan el taller de Kasımpaşa en treinta días si nadie paga tu vieja deuda. Ven aquí.']],
     o: ['Consigue un coche: acércate a uno y pulsa F.', 'Conduce al taller de Ela en Kasımpaşa. Sigue la línea morada.'], e: [['ela', 'Malas noticias, hermano. Mercan Sarıca compró tu deuda. Cincuenta mil. Ahora le perteneces.']] },
   { n: 'Trabajo de pintura', b: [['ela', 'Necesito algo brillante para vender. Hay un deportivo amarillo aparcado en la costa de Bebek.'], ['ela', 'Tráelo entero. Cada abolladura sale de tu parte.']],
     o: ['Encuentra el deportivo amarillo en Bebek, junto al Bósforo.', 'Llévalo al taller. Que no baje de la mitad de salud.'], e: [['ela', 'Nada mal, hermano. Nada mal.']] },
   { n: 'Agua salada', b: [['mercan', 'Así que este es Kerem. El conductor que nunca habla.'], ['kerem', 'Vengo a pagar la deuda trabajando.'], ['mercan', 'Mis mensajeros tiraron cinco paquetes al Bósforo cuando llegó la guardia costera. Coge mi lancha en el muelle de Karaköy, o nada. Recógelos antes que la corriente.']],
     o: ['Recoge los paquetes que flotan en el Bósforo: {n}/5.'], e: [['mercan', 'Mojado pero rápido. Diez mil menos en tu cuenta.']] },
   { n: 'Carga caliente', b: [['mercan', 'Una furgoneta espera en los muelles de Haydarpaşa, en Kadıköy. Va a mi almacén de Levent.'], ['mercan', 'La policía del puerto ya tiene tu matrícula. No los traigas a mi puerta.']],
     o: ['Sube a la furgoneta en Haydarpaşa.', 'Pierde a la policía.', 'Entrega la furgoneta en el almacén de Levent. Sin estrellas.'], e: [['mercan', 'Trabajo limpio. Otros quince menos.']] },
   { n: 'Mandíbula de cristal', b: [['mercan', 'Cem Camcı lava mi dinero y se queda una parte.'], ['mercan', 'Sale de su torre de Levent en un sedán plateado. Detén ese coche. Quiero su maletín.']],
     o: ['Destroza el coche plateado de Cem.', 'Coge el maletín.'], e: [['kerem', 'Mercan... hay un número de placa en este maletín. El del inspector Harun. Están juntos en esto.']] },
   { n: 'Lobos de Balat', b: [['ela', '¡Los Lobos de Balat destrozaron mi taller! Alguien les pagó. Alguien con placa.'], ['kerem', 'Agáchate. Llámame si vuelven.'], ['ela', 'Se esconden en Balat, junto al Cuerno de Oro. Coge el subfusil de debajo del mostrador. Ve.']],
     o: ['Acaba con los Lobos de Balat: quedan {n}.'], e: [['ela', 'Te estaban esperando, Kerem. Harun te quiere fuera.']] },
   { n: 'Carrera del libro', b: [['ela', 'El libro de Harun cruza a la orilla asiática en dos minutos. Por el puente del Bósforo y luego a Üsküdar.'], ['kerem', 'Entonces llego yo primero.']],
     o: ['Pasa los puntos de control antes del traslado: {n}/6.'], e: [['kerem', 'Cada soborno que cobró Harun. Y cada uno que pagó Mercan.']] },
   { n: 'İstanbul Heat', b: [['mercan', 'Leíste mi libro, conductor. Harun y yo tenemos un acuerdo, y tú no estás en él.'], ['harun', 'Todas las unidades: Kerem Yalçın, armado y peligroso. Tráiganlo. O no.']],
     o: ['Destroza el coche negro del inspector Harun.', 'Lleva el libro a la Torre de la Doncella. En lancha o nadando: la prensa espera en la isla.'], e: [['ela', 'Está en todos los canales. Harun esposado, las lanchas de Mercan incautadas y la deuda, borrada.'], ['kerem', 'El Bósforo está tranquilo esta noche. Que siga así. Un tiempo.']] }
  ]
 },
 pt: {
  name: 'İstanbul Heat', sub: 'História de crime 3D em mundo aberto', tag: 'Uma cidade em dois continentes. Uma dívida. Um motorista que nunca fala.',
  story: 'Começar a história', cont: 'Continuar · missão {n}', free: 'Modo livre', missions: 'Missões', locked: 'Bloqueada',
  soundOn: 'Som: ligado', soundOff: 'Som: desligado', back: '← Voltar', resume: 'Continuar', quit: 'Menu principal', paused: 'Pausado',
  qHigh: 'Gráficos: altos', qLow: 'Gráficos: rápidos',
  flat: 'HOSPITALIZADO', cuffed: 'ALGEMADO', hosp: 'Conta do hospital −${n}', bail: 'Fiança −${n}', passed: 'MISSÃO CUMPRIDA', failed: 'MISSÃO FALHOU',
  tap: 'Clique ou toque para continuar', getIn: 'F: entrar', getInT: 'Toque 🚗 para entrar', lost: 'Você despistou a polícia',
  spray: 'Ela pintou o carro. A polícia perdeu o rastro.', noMoney: 'Dinheiro insuficiente', radioOff: 'Rádio desligado',
  pick: '{w} coletado', burning: 'O carro está pegando fogo! Saia!', sinking: 'O carro está afundando! Nade!', armor: 'Colete', health: 'Vida',
  w: { fist: 'Socos', pistol: 'Pistola', smg: 'Submetralhadora', rifle: 'Fuzil' },
  fail: { dead: 'Você foi parar no hospital.', busted: 'Você foi algemado.', car: 'O veículo foi destruído.', time: 'O tempo acabou.', lost: 'O alvo fugiu.', dmg: 'O carro está muito danificado.' },
  mapHelp: 'Clique / toque no mapa para marcar destino · M para fechar', wp: 'Destino marcado', end: 'FIM · Istambul é sua. O modo livre continua.',
  mission: 'Missão', hint: 'Vá ao marcador rosa para a próxima missão', allDone: 'História completa · aproveite a cidade',
  keys: 'WASD mover · Mouse olhar (clique para travar) · Clique esq. atirar · Clique dir. mirar · F veículo · Shift correr · Espaço pular / freio de mão / subir · C descer · Q/E arma · R rádio · M mapa · P pausa',
  keysT: 'Analógico esquerdo mover · arraste à direita para olhar · 🔫 atirar · 🚗 veículo · ⤒ pular/subir · ⇄ arma · 🗺 mapa',
  time: 'Tempo', cash: '+${n}', swim: 'Nadando', shop: 'Loja de armas', shopHint: 'Comprar: 1 munição de pistola $100 · 2 submetralhadora $300 · 3 fuzil $600 · 4 colete $200', bought: 'Comprado', paidOff: 'Dívida restante: ${n}',
  dist: { bey: 'Beyoğlu', tar: 'Península Histórica', bes: 'Beşiktaş', lev: 'Levent', bal: 'Balat', usk: 'Üsküdar', kad: 'Kadıköy', bey2: 'Beylerbeyi', bog: 'Bósforo', hal: 'Chifre de Ouro', mar: 'Mar de Mármara' },
  ms: [
   { n: 'Fora da jaula', b: [['ela', 'Quatro anos, Kerem. Quatro anos, e você sai como se nada tivesse acontecido.'], ['kerem', 'Não fui eu, Ela. O inspetor Harun armou para mim.'], ['ela', 'Conte isso ao banco. Eles tomam minha oficina em Kasımpaşa em trinta dias se ninguém pagar sua dívida antiga. Venha para cá.']],
     o: ['Pegue um carro: chegue perto de um e aperte F.', 'Dirija até a oficina da Ela em Kasımpaşa. Siga a linha roxa.'], e: [['ela', 'Má notícia, irmão. Mercan Sarıca comprou sua dívida. Cinquenta mil. Agora você pertence a ela.']] },
   { n: 'Serviço de pintura', b: [['ela', 'Preciso de algo brilhante para vender. Tem um esportivo amarelo estacionado na orla de Bebek.'], ['ela', 'Traga inteiro. Cada amassado sai da sua parte.']],
     o: ['Encontre o esportivo amarelo em Bebek, na margem do Bósforo.', 'Leve até a oficina. Não deixe a vida cair abaixo da metade.'], e: [['ela', 'Nada mal, irmão. Nada mal mesmo.']] },
   { n: 'Água salgada', b: [['mercan', 'Então este é o Kerem. O motorista que nunca fala.'], ['kerem', 'Vim pagar a dívida trabalhando.'], ['mercan', 'Meus mensageiros jogaram cinco pacotes no Bósforo quando a guarda costeira chegou. Pegue minha lancha no píer de Karaköy, ou nade. Pegue antes da correnteza.']],
     o: ['Colete os pacotes boiando no Bósforo: {n}/5.'], e: [['mercan', 'Molhado mas rápido. Dez mil a menos na sua conta.']] },
   { n: 'Carga quente', b: [['mercan', 'Uma van espera no cais de Haydarpaşa, em Kadıköy. Ela vai para o meu armazém em Levent.'], ['mercan', 'A polícia do porto já tem sua placa. Não traga eles até minha porta.']],
     o: ['Entre na van em Haydarpaşa.', 'Despiste a polícia.', 'Entregue a van no armazém de Levent. Sem estrelas.'], e: [['mercan', 'Trabalho limpo. Mais quinze a menos.']] },
   { n: 'Queixo de vidro', b: [['mercan', 'Cem Camcı lava meu dinheiro e embolsa uma parte.'], ['mercan', 'Ele está saindo da torre em Levent num sedã prateado. Pare esse carro. Quero a maleta dele.']],
     o: ['Destrua o carro prateado do Cem.', 'Pegue a maleta.'], e: [['kerem', 'Mercan... tem um número de distintivo nesta maleta. O do inspetor Harun. Eles estão juntos nisso.']] },
   { n: 'Lobos de Balat', b: [['ela', 'Os Lobos de Balat destruíram minha oficina! Alguém pagou eles. Alguém com distintivo.'], ['kerem', 'Fique abaixada. Me ligue se voltarem.'], ['ela', 'Eles se escondem em Balat, no Chifre de Ouro. Pegue a submetralhadora debaixo do balcão. Vai.']],
     o: ['Acabe com os Lobos de Balat: faltam {n}.'], e: [['ela', 'Eles estavam esperando você, Kerem. O Harun quer você fora.']] },
   { n: 'Corrida do livro', b: [['ela', 'O livro do Harun atravessa para o lado asiático em dois minutos. Pela ponte do Bósforo e depois Üsküdar.'], ['kerem', 'Então eu chego primeiro.']],
     o: ['Passe pelos pontos de controle antes da transferência: {n}/6.'], e: [['kerem', 'Cada propina que o Harun recebeu. E cada uma que a Mercan pagou.']] },
   { n: 'İstanbul Heat', b: [['mercan', 'Você leu meu livro, motorista. Eu e o Harun temos um acordo, e você não faz parte dele.'], ['harun', 'Todas as unidades: Kerem Yalçın, armado e perigoso. Tragam ele. Ou não.']],
     o: ['Destrua o carro preto do inspetor Harun.', 'Leve o livro à Torre da Donzela. De lancha ou nadando: a imprensa espera na ilha.'], e: [['ela', 'Está em todos os canais. Harun algemado, as lanchas da Mercan apreendidas e a dívida acabou.'], ['kerem', 'O Bósforo está calmo esta noite. Que continue assim. Por um tempo.']] }
  ]
 },
 id: {
  name: 'İstanbul Heat', sub: 'Kisah kriminal 3D dunia terbuka', tag: 'Satu kota di dua benua. Satu utang. Satu sopir yang tak pernah bicara.',
  story: 'Mulai cerita', cont: 'Lanjut · misi {n}', free: 'Jelajah bebas', missions: 'Misi', locked: 'Terkunci',
  soundOn: 'Suara: nyala', soundOff: 'Suara: mati', back: '← Kembali', resume: 'Lanjut', quit: 'Menu utama', paused: 'Jeda',
  qHigh: 'Grafis: tinggi', qLow: 'Grafis: cepat',
  flat: 'MASUK RUMAH SAKIT', cuffed: 'DIBORGOL', hosp: 'Tagihan rumah sakit −${n}', bail: 'Uang jaminan −${n}', passed: 'MISI BERHASIL', failed: 'MISI GAGAL',
  tap: 'Klik atau ketuk untuk lanjut', getIn: 'F: naik', getInT: 'Ketuk 🚗 untuk naik', lost: 'Kamu lolos dari polisi',
  spray: 'Ela mengecat ulang mobilnya. Polisi kehilangan jejak.', noMoney: 'Uang tidak cukup', radioOff: 'Radio mati',
  pick: '{w} diambil', burning: 'Mobil terbakar! Cepat keluar!', sinking: 'Mobil tenggelam! Berenang!', armor: 'Rompi', health: 'Darah',
  w: { fist: 'Tinju', pistol: 'Pistol', smg: 'SMG', rifle: 'Senapan' },
  fail: { dead: 'Kamu masuk rumah sakit.', busted: 'Kamu diborgol.', car: 'Kendaraannya hancur.', time: 'Waktu habis.', lost: 'Target kabur.', dmg: 'Mobil terlalu rusak.' },
  mapHelp: 'Klik / ketuk peta untuk memasang tujuan · M untuk menutup', wp: 'Tujuan dipasang', end: 'TAMAT · İstanbul milikmu. Jelajah bebas berlanjut.',
  mission: 'Misi', hint: 'Pergi ke penanda merah muda untuk misi berikutnya', allDone: 'Cerita selesai · nikmati kotanya',
  keys: 'WASD gerak · Mouse lihat (klik untuk kunci) · Klik kiri tembak · Klik kanan bidik · F kendaraan · Shift lari · Spasi lompat / rem tangan / naik · C turun · Q/E senjata · R radio · M peta · P jeda',
  keysT: 'Stik kiri gerak · geser sisi kanan untuk melihat · 🔫 tembak · 🚗 kendaraan · ⤒ lompat/naik · ⇄ senjata · 🗺 peta',
  time: 'Waktu', cash: '+${n}', swim: 'Berenang', shop: 'Toko senjata', shopHint: 'Beli: 1 peluru pistol $100 · 2 SMG $300 · 3 senapan $600 · 4 rompi $200', bought: 'Dibeli', paidOff: 'Sisa utang: ${n}',
  dist: { bey: 'Beyoğlu', tar: 'Semenanjung Bersejarah', bes: 'Beşiktaş', lev: 'Levent', bal: 'Balat', usk: 'Üsküdar', kad: 'Kadıköy', bey2: 'Beylerbeyi', bog: 'Bosporus', hal: 'Tanduk Emas', mar: 'Laut Marmara' },
  ms: [
   { n: 'Keluar dari Kandang', b: [['ela', 'Empat tahun, Kerem. Empat tahun, lalu kamu keluar seolah tak terjadi apa-apa.'], ['kerem', 'Bukan aku pelakunya, Ela. Inspektur Harun menjebakku.'], ['ela', 'Bilang saja ke bank. Bengkelku di Kasımpaşa disita dalam tiga puluh hari kalau utang lamamu tak dibayar. Cepat ke sini.']],
     o: ['Ambil mobil: dekati salah satu dan tekan F.', 'Menyetir ke bengkel Ela di Kasımpaşa. Ikuti garis ungu.'], e: [['ela', 'Kabar buruk, Kak. Mercan Sarıca membeli utangmu. Lima puluh ribu. Sekarang kamu miliknya.']] },
   { n: 'Kerja Cat', b: [['ela', 'Aku butuh sesuatu yang mengilap untuk dijual. Ada mobil sport kuning parkir di jalan pantai Bebek.'], ['ela', 'Bawa utuh ke sini. Tiap penyok dipotong dari bagianmu.']],
     o: ['Temukan mobil sport kuning di Bebek, di tepi Bosporus.', 'Bawa ke bengkel. Jangan sampai darahnya di bawah setengah.'], e: [['ela', 'Lumayan, Kak. Lumayan sekali.']] },
   { n: 'Air Asin', b: [['mercan', 'Jadi ini Kerem. Sopir yang tak pernah bicara.'], ['kerem', 'Aku datang untuk melunasi utang dengan kerja.'], ['mercan', 'Kurirku membuang lima paket ke Bosporus waktu penjaga pantai datang. Ambil perahuku di dermaga Karaköy, atau berenang. Ambil sebelum terbawa arus.']],
     o: ['Kumpulkan paket yang mengapung di Bosporus: {n}/5.'], e: [['mercan', 'Basah tapi cepat. Sepuluh ribu dipotong dari utangmu.']] },
   { n: 'Muatan Panas', b: [['mercan', 'Sebuah van menunggu di dermaga Haydarpaşa, Kadıköy. Van itu harus sampai ke gudangku di Levent.'], ['mercan', 'Polisi pelabuhan sudah tahu pelat nomormu. Jangan bawa mereka ke pintuku.']],
     o: ['Naik ke van di Haydarpaşa.', 'Lolos dari polisi.', 'Antar van ke gudang di Levent. Tanpa bintang.'], e: [['mercan', 'Kerja bersih. Lima belas ribu lagi dipotong.']] },
   { n: 'Rahang Kaca', b: [['mercan', 'Cem Camcı mencuci uangku dan mengambil sebagian.'], ['mercan', 'Dia keluar dari menaranya di Levent dengan sedan perak. Hentikan mobil itu. Aku mau kopernya.']],
     o: ['Hancurkan mobil perak milik Cem.', 'Ambil kopernya.'], e: [['kerem', 'Mercan... ada nomor lencana di koper ini. Milik Inspektur Harun. Mereka bekerja sama.']] },
   { n: 'Serigala Balat', b: [['ela', 'Serigala Balat mengobrak-abrik bengkelku! Ada yang membayar mereka. Seseorang yang punya lencana.'], ['kerem', 'Tetap tiarap. Telepon aku kalau mereka kembali.'], ['ela', 'Mereka bersembunyi di Balat, tepi Tanduk Emas. Ambil SMG di bawah meja. Pergi.']],
     o: ['Habisi Serigala Balat: sisa {n}.'], e: [['ela', 'Mereka menunggumu, Kerem. Harun ingin kamu lenyap.']] },
   { n: 'Kejar Buku Besar', b: [['ela', 'Buku Harun menyeberang ke sisi Asia dalam dua menit. Lewat Jembatan Bosporus, lalu ke Üsküdar.'], ['kerem', 'Kalau begitu aku sampai duluan.']],
     o: ['Lewati pos pemeriksaan sebelum pemindahan: {n}/6.'], e: [['kerem', 'Setiap suap yang diterima Harun. Dan setiap yang dibayar Mercan.']] },
   { n: 'İstanbul Heat', b: [['mercan', 'Kamu membaca bukuku, sopir. Aku dan Harun punya kesepakatan, dan kamu tidak termasuk.'], ['harun', 'Semua unit: Kerem Yalçın bersenjata dan berbahaya. Bawa dia. Atau jangan.']],
     o: ['Hancurkan mobil hitam Inspektur Harun.', 'Bawa buku itu ke Menara Gadis. Naik perahu atau berenang: wartawan menunggu di pulau.'], e: [['ela', 'Ada di semua saluran. Harun diborgol, perahu Mercan disita, dan utangnya lunas.'], ['kerem', 'Bosporus tenang malam ini. Biarkan begitu. Untuk sementara.']] }
  ]
 }
};

/* ---------- geography of a stylised Istanbul (metres; x east, z south) ---------- */
const TAU = Math.PI * 2, HALF = 1200, CELL = 4, NC = 600;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const bxz = z => 150 + 70 * Math.sin((z + 200) / 420);          // Bosphorus centre line
const hzx = x => 380 + 30 * Math.sin(x / 160);                   // Golden Horn centre line
const BW = 100;                                                  // half width of the Bosphorus
const KX = bxz(620) + 55, KZ = 620;                              // Maiden's Tower islet
function waterRaw(x, z) {
  if ((x - KX) ** 2 + (z - KZ) ** 2 < 100) return false;
  if (Math.abs(x) > HALF - 45 || Math.abs(z) > HALF - 45) return true;
  const b = bxz(z);
  if (Math.abs(x - b) < BW) return true;
  if (z > 760 && z > 760 + Math.max(0, x - 330) * 1.2) return true;
  if (x < b - 60 && x > -1010) { const half = 40 * clamp((x + 1010) / 250, .25, 1); if (Math.abs(z - hzx(x)) < half) return true; }
  return false;
}
function districtAt(x, z) {
  const b = bxz(z);
  if (waterRaw(x, z)) { if (Math.abs(x - b) < BW + 5 && z < 760) return 'bog'; if (z > 700) return 'mar'; return 'hal'; }
  if (x > b) return z > 720 ? 'kad' : z > 250 ? 'usk' : 'bey2';
  if (z > hzx(x)) return x < -560 ? 'bal' : 'tar';
  if (z < -480 && x < b - 260) return 'lev';
  if (z < -140) return 'bes';
  return 'bey';
}
const ROWS = [], COLS = [];
for (let k = -9; k <= 16; k++) ROWS.push(-300 + 90 * k);
for (let k = -11; k <= 14; k++) COLS.push(-120 + 90 * k);
const BRIDGES = [
  { id: 'bogaz', ax: bxz(-300) - BW - 200, az: -300, bx: bxz(-300) + BW + 200, bz: -300, w: 16, deck: 42, ramp: 200, big: true },
  { id: 'fsm', ax: bxz(-930) - BW - 200, az: -930, bx: bxz(-930) + BW + 200, bz: -930, w: 16, deck: 42, ramp: 200, big: true },
  { id: 'galata', ax: bxz(328) - 112, az: 328, bx: bxz(458) - 112, bz: 458, w: 15, deck: 3.2, ramp: 16 },
  { id: 'unkapani', ax: -390, az: 300, bx: -390, bz: 422, w: 15, deck: 3.2, ramp: 16 }
];
BRIDGES.forEach(b => { b.L = Math.hypot(b.bx - b.ax, b.bz - b.az); b.ux = (b.bx - b.ax) / b.L; b.uz = (b.bz - b.az) / b.L; });
const LANDMARKS = {
  blue: { x: -215, z: 615, r: 72 }, hagia: { x: -70, z: 560, r: 58 }, suley: { x: -430, z: 488, r: 58 }, galata: { x: 30, z: 250, r: 20 },
  dolma: { x: bxz(-80) - 134, z: -80, r: 70 }, ortakoy: { x: bxz(-345) - 142, z: -345, r: 22 }, mihri: { x: bxz(470) + 150, z: 470, r: 42 },
  haydar: { x: 395, z: 735, r: 44 }, taksim: { x: 60, z: -40, r: 36 }, prison: { x: -850, z: -700, r: 55 }, garage: { x: -250, z: 270, r: 22 },
  gunshop: { x: -75, z: -205, r: 16 }, police: { x: -20, z: 120, r: 24 }, hosp1: { x: -200, z: 30, r: 22 }, hosp2: { x: 500, z: 880, r: 22 },
  gulhane: { x: -10, z: 655, r: 55, park: true }, yildiz: { x: -40, z: -190, r: 60, park: true }, camlica: { x: 640, z: 160, r: 120, park: true },
  helipad: { x: -300, z: -120, r: 18 }, helipad2: { x: 560, z: 640, r: 18 }, ware: { x: -420, z: -700, r: 26 }, tower: { x: -310, z: -800, r: 26 }
};

function buildWorld() {
  const r = mulberry(34119);
  const water = new Uint8Array(NC * NC);
  const cx = i => -HALF + (i + .5) * CELL;
  for (let j = 0; j < NC; j++) for (let i = 0; i < NC; i++) water[j * NC + i] = waterRaw(cx(i), cx(j)) ? 1 : 0;
  const bfs = src => { const d = new Int16Array(NC * NC).fill(999), q = new Int32Array(NC * NC); let h = 0, e = 0; for (let k = 0; k < NC * NC; k++) if (src(k)) { d[k] = 0; q[e++] = k; } while (h < e) { const k = q[h++], i = k % NC, j = (k / NC) | 0, nd = d[k] + 1; if (nd > 80) continue; if (i > 0 && d[k - 1] > nd) { d[k - 1] = nd; q[e++] = k - 1; } if (i < NC - 1 && d[k + 1] > nd) { d[k + 1] = nd; q[e++] = k + 1; } if (j > 0 && d[k - NC] > nd) { d[k - NC] = nd; q[e++] = k - NC; } if (j < NC - 1 && d[k + NC] > nd) { d[k + NC] = nd; q[e++] = k + NC; } } return d; };
  const dW = bfs(k => water[k]), dL = bfs(k => !water[k]);
  const hgt = new Float32Array(NC * NC);
  for (let j = 0; j < NC; j++) for (let i = 0; i < NC; i++) {
    const k = j * NC + i, x = cx(i), z = cx(j);
    if (water[k]) { hgt[k] = -1.2 - Math.min(dL[k], 12) * .55; continue; }
    const hill = 15 * (.5 + .5 * Math.sin(x / 260 + 1) * Math.cos(z / 210 - .5)) + (Math.hypot(x - LANDMARKS.camlica.x, z - LANDMARKS.camlica.z) < 260 ? 26 * smooth(1 - Math.hypot(x - LANDMARKS.camlica.x, z - LANDMARKS.camlica.z) / 260) : 0);
    hgt[k] = 1.3 + hill * smooth(clamp((dW[k] - 4) / 22, 0, 1));
  }
  const heightRaw = (x, z) => { const fx = (x + HALF) / CELL - .5, fz = (z + HALF) / CELL - .5, i = clamp(Math.floor(fx), 0, NC - 2), j = clamp(Math.floor(fz), 0, NC - 2), tx = clamp(fx - i, 0, 1), tz = clamp(fz - j, 0, 1), k = j * NC + i; return lerp(lerp(hgt[k], hgt[k + 1], tx), lerp(hgt[k + NC], hgt[k + NC + 1], tx), tz); };
  const isWater = (x, z) => { const i = clamp(Math.floor((x + HALF) / CELL), 0, NC - 1), j = clamp(Math.floor((z + HALF) / CELL), 0, NC - 1); return water[j * NC + i] === 1; };
  /* bridges: profile height along the deck */
  for (const b of BRIDGES) { b.ha = heightRaw(b.ax, b.az); b.hb = heightRaw(b.bx, b.bz); }
  function bridgeAt(x, z) {
    for (const b of BRIDGES) {
      const dx = x - b.ax, dz = z - b.az, t = dx * b.ux + dz * b.uz, d = -dx * b.uz + dz * b.ux;
      if (t < 0 || t > b.L || Math.abs(d) > b.w / 2) continue;
      const h = t < b.ramp ? lerp(b.ha, b.deck, smooth(t / b.ramp)) : t > b.L - b.ramp ? lerp(b.hb, b.deck, smooth((b.L - t) / b.ramp)) : b.deck;
      return { b, h, t, d };
    }
    return null;
  }
  /* roads: grid streets + Bosphorus shore roads + Kennedy road on the Marmara */
  const nodes = [], hash = new Map();
  const key = (x, z) => Math.round(x / 6) + ',' + Math.round(z / 6);
  function node(x, z) {
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const k = (Math.round(x / 6) + a) + ',' + (Math.round(z / 6) + b), n = hash.get(k); if (n && Math.hypot(n.x - x, n.z - z) < 7) return n; }
    const n = { id: nodes.length, x, z, n: [] }; nodes.push(n); hash.set(key(x, z), n); return n;
  }
  const edges = [];
  const inBridgeCorr = (x, z, pad) => BRIDGES.some(b => { const dx = x - b.ax, dz = z - b.az, t = dx * b.ux + dz * b.uz, d = -dx * b.uz + dz * b.ux; return t > -2 && t < b.L + 2 && Math.abs(d) < b.w / 2 + (pad || 0); });
  function segOK(a, b, bridge) {
    const L = Math.hypot(b.x - a.x, b.z - a.z), n = Math.ceil(L / 3);
    for (let i = 0; i <= n; i++) { const x = lerp(a.x, b.x, i / n), z = lerp(a.z, b.z, i / n); if (isWater(x, z) && !(bridge && bridgeAt(x, z))) return false; }
    return true;
  }
  function link(a, b, bridge) { if (a === b || a.n.includes(b)) return; if (!segOK(a, b, bridge)) return; a.n.push(b); b.n.push(a); edges.push({ a, b, bridge: !!bridge }); }
  const shoreE = z => bxz(z) - BW - 12, shoreA = z => bxz(z) + BW + 12, KEN = 748;
  const bigBridgeRow = z => BRIDGES.find(b => b.big && Math.abs(b.az - z) < 1);
  // rows
  for (const z of ROWS) {
    const pts = [];
    for (const x of COLS) pts.push({ x, z });
    const xe = shoreE(z), xa = shoreA(z);
    if (z < 760) { pts.push({ x: xe, z }); pts.push({ x: xa, z }); }
    const bb = bigBridgeRow(z);
    let list = pts.filter(p => !isWater(p.x, p.z));
    if (bb) { list = list.filter(p => p.x < bb.ax - 1 || p.x > bb.bx + 1); list.push({ x: bb.ax, z }, { x: bb.bx, z }); }
    list.sort((a, b) => a.x - b.x);
    for (let i = 0; i + 1 < list.length; i++) { const A = node(list[i].x, z), B = node(list[i + 1].x, z); link(A, B, bb && Math.abs(list[i].x - bb.ax) < 1 && Math.abs(list[i + 1].x - bb.bx) < 1); }
  }
  // columns
  for (const x of COLS) {
    const pts = [];
    for (const z of ROWS) { const bb = bigBridgeRow(z); if (bb && x > bb.ax && x < bb.bx) continue; pts.push({ x, z }); }
    for (let z = -1150; z < 1150; z += 2) { const s1 = Math.sign(x - shoreE(z)), s2 = Math.sign(x - shoreE(z + 2)); if (s1 !== s2 && z < 760) pts.push({ x, z: z + 1 }); const a1 = Math.sign(x - shoreA(z)), a2 = Math.sign(x - shoreA(z + 2)); if (a1 !== a2 && z < 760) pts.push({ x, z: z + 1 }); }
    if (x < bxz(KEN) - BW) pts.push({ x, z: KEN });
    const list = pts.filter(p => !isWater(p.x, p.z) && !(inBridgeCorr(p.x, p.z) && !BRIDGES.some(b => !b.big && Math.abs(b.ax - x) < 1))).sort((a, b) => a.z - b.z);
    const lowB = BRIDGES.find(b => !b.big && Math.abs(b.ax - x) < 1 && Math.abs(b.bx - x) < 1);
    if (lowB) { list.push({ x, z: lowB.az }, { x, z: lowB.bz }); list.sort((a, b) => a.z - b.z); }
    for (let i = 0; i + 1 < list.length; i++) link(node(x, list[i].z), node(x, list[i + 1].z), !!lowB);
  }
  // shore roads (continuous curves) and the Kennedy road
  const shoreLine = (fx, z0, z1) => { const zs = new Set(); for (let z = z0; z <= z1; z += 30) zs.add(z); for (const z of ROWS) if (z > z0 && z < z1) zs.add(z); for (const x of COLS) for (let z = z0; z < z1; z += 2) if (Math.sign(x - fx(z)) !== Math.sign(x - fx(z + 2))) zs.add(z + 1); return [...zs].sort((a, b) => a - b).filter(z => { const bb = BRIDGES.find(b => b.big && Math.abs(b.az - z) < 9); return !bb; }).map(z => ({ x: fx(z), z })); };
  const lowGal = BRIDGES.find(b => b.id === 'galata');
  const eu = shoreLine(shoreE, -1140, KEN), as = shoreLine(shoreA, -1140, 752);
  eu.push({ x: lowGal.ax, z: lowGal.az }, { x: lowGal.bx, z: lowGal.bz }); eu.sort((a, b) => a.z - b.z);
  for (const line of [eu, as]) for (let i = 0; i + 1 < line.length; i++) { const A = node(line[i].x, line[i].z), B = node(line[i + 1].x, line[i + 1].z); link(A, B, line === eu && line[i].z >= lowGal.az - 1 && line[i + 1].z <= lowGal.bz + 1); }
  { const xs = new Set(); for (let x = -1140; x < bxz(KEN) - BW - 12; x += 30) xs.add(x); COLS.forEach(x => xs.add(x)); xs.add(shoreE(KEN)); const l = [...xs].filter(x => x <= shoreE(KEN) + .5 && !isWater(x, KEN)).sort((a, b) => a - b); for (let i = 0; i + 1 < l.length; i++) link(node(l[i], KEN), node(l[i + 1], KEN)); }
  const live = nodes.filter(n => n.n.length);
  /* road / sidewalk / building masks */
  const road = new Uint8Array(NC * NC), solidH = new Float32Array(NC * NC), bridgeM = new Uint8Array(NC * NC);
  const cellOf = (x, z) => { const i = Math.floor((x + HALF) / CELL), j = Math.floor((z + HALF) / CELL); return i < 0 || j < 0 || i >= NC || j >= NC ? -1 : j * NC + i; };
  const stamp = (x, z, rad, v, arr) => { const i0 = Math.floor((x - rad + HALF) / CELL), i1 = Math.floor((x + rad + HALF) / CELL), j0 = Math.floor((z - rad + HALF) / CELL), j1 = Math.floor((z + rad + HALF) / CELL); for (let j = Math.max(0, j0); j <= Math.min(NC - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(NC - 1, i1); i++) { const px = cx(i), pz = cx(j); if ((px - x) ** 2 + (pz - z) ** 2 <= rad * rad) { const k = j * NC + i; if (arr[k] < v) arr[k] = v; } } };
  for (const e of edges) { const L = Math.hypot(e.b.x - e.a.x, e.b.z - e.a.z), n = Math.ceil(L / 2); for (let i = 0; i <= n; i++) { const x = lerp(e.a.x, e.b.x, i / n), z = lerp(e.a.z, e.b.z, i / n); const br = bridgeAt(x, z); if (br && br.h > heightRaw(x, z) + 3.5) { stamp(x, z, 10, 1, bridgeM); continue; } stamp(x, z, 10.5, 1, road); stamp(x, z, 7, 2, road); } }
  for (const b of BRIDGES) for (let t = 0; t <= b.L; t += 2) { const x = b.ax + b.ux * t, z = b.az + b.uz * t; stamp(x, z, b.w / 2 + 6, 1, bridgeM); }
  /* buildings */
  const PAL = {
    tar: { h: [8, 18], st: [0], wall: ['#e7dcc4', '#d9c39a', '#e8d2b0', '#cfb48f', '#efe6d2', '#c9a27a'], roof: ['#a8552e', '#b5643a', '#8e4a2c', '#9a5b3c'], fill: .85, lots: 3 },
    bal: { h: [7, 13], st: [0], wall: ['#d9534f', '#f0c05a', '#5b8fc9', '#7fbf7f', '#e98a5d', '#b86ab0', '#f4e1a1'], roof: ['#7a3b2a', '#8e4a2c', '#5a4a40'], fill: .9, lots: 3 },
    bey: { h: [12, 28], st: [0, 2], wall: ['#e6e0d4', '#d8cfbf', '#c7c0b3', '#e9d8c4', '#d4b8a0', '#bfc7cf'], roof: ['#6e6a66', '#8a5a44', '#5e5a58'], fill: .9, lots: 2 },
    bes: { h: [10, 26], st: [2, 0], wall: ['#ece7df', '#d9d4cc', '#cfd8dc', '#e8dcc9', '#c8c2b8'], roof: ['#5e5a58', '#6e6a66', '#7a6a5a'], fill: .8, lots: 2 },
    lev: { h: [45, 165], st: [1], wall: ['#9fc4dc', '#7fa9c4', '#b8c7d4', '#6f8fa8', '#a8d0d6', '#c7d3dd'], roof: ['#4a5560', '#3d4752'], fill: .55, lots: 2 },
    usk: { h: [8, 20], st: [0, 2], wall: ['#efe3cc', '#e8d2b0', '#d8e0d0', '#f0d8c8', '#dccbb0'], roof: ['#a8552e', '#8e4a2c', '#6e6a66'], fill: .75, lots: 2 },
    kad: { h: [12, 30], st: [2], wall: ['#e6e0d4', '#d8cfbf', '#f0e6d6', '#cfd8dc', '#e3c7b0'], roof: ['#5e5a58', '#6e6a66'], fill: .85, lots: 2 },
    bey2: { h: [6, 12], st: [0], wall: ['#f3efe6', '#e6d3b3', '#d8c4a4', '#c9b08d', '#efe6d2'], roof: ['#7a3b2a', '#5a4a40', '#8e4a2c'], fill: .45, lots: 2 }
  };
  const blds = [], trees = [], lamps = [];
  const buildable = (x, z) => { const k = cellOf(x, z); if (k < 0 || water[k] || road[k] || bridgeM[k] || dW[k] < 3) return false; for (const L of Object.values(LANDMARKS)) if ((x - L.x) ** 2 + (z - L.z) ** 2 < L.r * L.r) return false; return true; };
  const pick = a => a[Math.floor(r() * a.length)];
  for (let ri = 0; ri + 1 < ROWS.length; ri++) for (let ci = 0; ci + 1 < COLS.length; ci++) {
    const x0 = COLS[ci] + 11, x1 = COLS[ci + 1] - 11, z0 = ROWS[ri] + 11, z1 = ROWS[ri + 1] - 11;
    const d = districtAt((x0 + x1) / 2, (z0 + z1) / 2), P = PAL[d] || PAL.bey;
    const n = P.lots + (r() < .4 ? 1 : 0), lw = (x1 - x0) / n, lz = (z1 - z0) / n;
    for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
      if (r() > P.fill) { if (r() < .5) trees.push({ x: x0 + (a + .5) * lw, z: z0 + (b + .5) * lz, k: r() < .5 ? 'cy' : 'pl', s: .8 + r() * .5 }); continue; }
      const inset = 1.5 + r() * 2.5, bx0 = x0 + a * lw + inset, bz0 = z0 + b * lz + inset, bw = lw - inset * 2, bd = lz - inset * 2;
      if (bw < 6 || bd < 6) continue;
      let ok = true; for (const [u, v] of [[0, 0], [1, 0], [0, 1], [1, 1], [.5, .5], [.5, 0], [0, .5], [1, .5], [.5, 1]]) if (!buildable(bx0 + bw * u, bz0 + bd * v)) { ok = false; break; }
      if (!ok) continue;
      let h = lerp(P.h[0], P.h[1], Math.pow(r(), d === 'lev' ? 1.6 : 1));
      if (d === 'lev' && r() < .35) h = 18 + r() * 14;
      const gy = Math.min(heightRaw(bx0, bz0), heightRaw(bx0 + bw, bz0), heightRaw(bx0, bz0 + bd), heightRaw(bx0 + bw, bz0 + bd)) - .5;
      const B = { x: bx0, z: bz0, w: bw, d: bd, y: gy, h: h + .5, st: pick(P.st), wall: pick(P.wall), roof: pick(P.roof), dist: d };
      blds.push(B);
      if (d === 'lev' && h > 60 && r() < .5) blds.push({ x: bx0 + bw * .2, z: bz0 + bd * .2, w: bw * .6, d: bd * .6, y: gy + h, h: 6 + r() * 10, st: 1, wall: B.wall, roof: B.roof, dist: d });
    }
  }
  const rects = [], rgrid = new Map();
  function addRect(x0, z0, x1, z1, top) { const id = rects.length; rects.push([x0, z0, x1, z1, top]); for (let j = Math.floor((z0 + HALF) / CELL); j <= Math.floor((z1 + HALF) / CELL); j++) for (let i = Math.floor((x0 + HALF) / CELL); i <= Math.floor((x1 + HALF) / CELL); i++) { if (i < 0 || j < 0 || i >= NC || j >= NC) continue; const k = j * NC + i; let l = rgrid.get(k); if (!l) rgrid.set(k, l = []); l.push(id); if (solidH[k] < top) solidH[k] = top; } }
  function solidTop(x, z) { const k = cellOf(x, z); if (k < 0) return 1e9; const l = rgrid.get(k); if (!l) return -1e9; let t = -1e9; for (const id of l) { const r = rects[id]; if (x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3] && r[4] > t) t = r[4]; } return t; }
  for (const B of blds) addRect(B.x, B.z, B.x + B.w, B.z + B.d, B.y + B.h);
  for (const B of []) { const i0 = Math.floor((B.x + HALF) / CELL), i1 = Math.floor((B.x + B.w + HALF) / CELL), j0 = Math.floor((B.z + HALF) / CELL), j1 = Math.floor((B.z + B.d + HALF) / CELL); for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const k = j * NC + i; if (k >= 0 && k < NC * NC) solidH[k] = Math.max(solidH[k], B.y + B.h); } }
  /* trees: parks, shore promenades, Asian hills */
  for (const L of Object.values(LANDMARKS)) if (L.park) for (let n = 0; n < (L.r > 100 ? 90 : 34); n++) { const a = r() * TAU, d2 = Math.sqrt(r()) * L.r * .95, x = L.x + Math.cos(a) * d2, z = L.z + Math.sin(a) * d2; if (!isWater(x, z) && !road[cellOf(x, z)]) trees.push({ x, z, k: r() < .45 ? 'cy' : 'pl', s: .8 + r() * .6 }); }
  for (let z = -1120; z < 740; z += 26) { for (const x of [bxz(z) - BW - 3.5, bxz(z) + BW + 3.5]) if (!isWater(x, z) && !bridgeM[cellOf(x, z)] && r() < .7) trees.push({ x, z, k: 'pl', s: .7 + r() * .4 }); }
  for (let n = 0; n < 500; n++) { const x = bxz(0) + BW + 30 + r() * 800, z = -1100 + r() * 1300, k = cellOf(x, z); if (k >= 0 && !water[k] && !road[k] && !bridgeM[k] && solidH[k] === 0 && districtAt(x, z) === 'bey2') trees.push({ x, z, k: r() < .5 ? 'cy' : 'pl', s: .8 + r() * .6 }); }
  for (const e of edges) { if (e.bridge) continue; const L = Math.hypot(e.b.x - e.a.x, e.b.z - e.a.z), ux = (e.b.x - e.a.x) / L, uz = (e.b.z - e.a.z) / L; for (let t = 15; t < L - 10; t += 34) { const x = e.a.x + ux * t - uz * 8.6, z = e.a.z + uz * t + ux * 8.6; const k = cellOf(x, z); if (k >= 0 && !water[k] && solidH[k] === 0 && !bridgeM[k]) lamps.push({ x, z }); } }
  for (const t of trees) t.y = heightRaw(t.x, t.z);
  for (const l of lamps) l.y = heightRaw(l.x, l.z);
  return { water, hgt, dW, heightRaw, isWater, bridgeAt, nodes: live, edges, road, solidH, bridgeM, blds, trees, lamps, cellOf, districtAt, addRect, solidTop };
}

/* ---------- audio: engine, rotor, sirens, guns and two synthesized radio stations ---------- */
function makeAudio(save) {
  let ac = null, master, music, sfxG, eng, engF, engG, sir, sirG, noiseBuf, station = save.radio == null ? 0 : save.radio, nextBar = 0, bar = 0, sea, seaG;
  const STATIONS = ['Boğaz FM 101.5', 'Haliç Funk 88.1'];
  function init() {
    if (ac) return; const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC(); master = ac.createGain(); master.gain.value = save.mute ? 0 : .9; master.connect(ac.destination);
    sfxG = ac.createGain(); sfxG.gain.value = .8; sfxG.connect(master);
    music = ac.createGain(); music.gain.value = 0; music.connect(master);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    eng = ac.createOscillator(); eng.type = 'sawtooth'; engF = ac.createBiquadFilter(); engF.type = 'lowpass'; engF.frequency.value = 420; engG = ac.createGain(); engG.gain.value = 0;
    eng.connect(engF); engF.connect(engG); engG.connect(sfxG); eng.start();
    sir = ac.createOscillator(); sir.type = 'square'; const sf = ac.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 1800; sirG = ac.createGain(); sirG.gain.value = 0;
    sir.connect(sf); sf.connect(sirG); sirG.connect(sfxG); sir.start();
    sea = ac.createBufferSource(); sea.buffer = noiseBuf; sea.loop = true; const sfl = ac.createBiquadFilter(); sfl.type = 'lowpass'; sfl.frequency.value = 500; seaG = ac.createGain(); seaG.gain.value = 0; sea.connect(sfl); sfl.connect(seaG); seaG.connect(sfxG); sea.start();
    setInterval(tick, 90);
  }
  const N = () => { const s = ac.createBufferSource(); s.buffer = noiseBuf; return s; };
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function tone(type, f, t, dur, vol, dest, f2) { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur); env(g, t, .005, vol, dur); o.connect(g); g.connect(dest || sfxG); o.start(t); o.stop(t + dur + .05); }
  function noise(t, dur, vol, freq, q, dest, type) { const s = N(), f = ac.createBiquadFilter(), g = ac.createGain(); f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1; env(g, t, .003, vol, dur); s.connect(f); f.connect(g); g.connect(dest || sfxG); s.start(t, Math.random()); s.stop(t + dur + .05); }
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function tick() {
    if (!ac || station >= STATIONS.length || music.gain.value < .001) { if (ac) nextBar = Math.max(nextBar, ac.currentTime + .1); return; }
    while (nextBar < ac.currentTime + .4) { (station === 0 ? synthwave : funk)(nextBar, bar++); nextBar += station === 0 ? 4 * 60 / 104 : 4 * 60 / 96; }
  }
  function synthwave(t0, b) {
    const beat = 60 / 104, roots = [45, 41, 48, 43], root = roots[b % 4], ch = [[0, 3, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7]][b % 4];
    for (let i = 0; i < 16; i++) tone('sawtooth', mtof(root - 12 + (i % 2 ? 12 : 0)), t0 + i * beat / 4, beat / 4 * .9, .07, music);
    for (const n of ch) for (const det of [-6, 6]) { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = mtof(root + 12 + n); o.detune.value = det; f.type = 'lowpass'; f.frequency.value = 1300; g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(.022, t0 + .5); g.gain.linearRampToValueAtTime(0.0001, t0 + beat * 4); o.connect(f); f.connect(g); g.connect(music); o.start(t0); o.stop(t0 + beat * 4 + .05); }
    for (let i = 0; i < 4; i++) { const t = t0 + i * beat; tone('sine', 120, t, .3, .5, music, 40); if (i % 2) noise(t, .25, .25, 1800, .7, music); noise(t + beat / 2, .05, .08, 8000, .5, music, 'highpass'); noise(t, .05, .06, 8000, .5, music, 'highpass'); }
    if (b % 2) { const sc = [0, 1, 4, 5, 7, 8, 11, 12]; for (let i = 0; i < 4; i++) if (Math.random() < .7) tone('square', mtof(root + 24 + sc[Math.floor(Math.random() * sc.length)]), t0 + i * beat + (Math.random() < .3 ? beat / 2 : 0), beat * .8, .025, music); }
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
    radio(on) { if (!ac) return; music.gain.setTargetAtTime(on && station < STATIONS.length ? .5 : 0, ac.currentTime, .3); },
    engine(kind, v, thr) { if (!ac) return; const t = ac.currentTime; if (!kind) { engG.gain.setTargetAtTime(0, t, .08); return; } const heli = kind === 'heli', boat = kind === 'boat'; engG.gain.setTargetAtTime(.045 + Math.min(.04, Math.abs(v) / 900), t, .08); eng.frequency.setTargetAtTime(heli ? 18 + thr * 4 : (boat ? 40 : 32) + Math.abs(v) * (boat ? 2.2 : 1.6) + thr * 12, t, .06); engF.frequency.setTargetAtTime(heli ? 260 : 300 + Math.abs(v) * 14, t, .1); },
    sea(v) { if (ac) seaG.gain.setTargetAtTime(v * .08, ac.currentTime, .4); },
    siren(vol, tt) { if (!ac) return; const t = ac.currentTime; sirG.gain.setTargetAtTime(vol * .05, t, .1); sir.frequency.setTargetAtTime(Math.floor(tt / .45) % 2 ? 660 : 900, t, .02); },
    sfx(k, vol) {
      if (!ac || save.mute) return; const t = ac.currentTime, v = vol == null ? 1 : vol;
      if (k === 'pistol') { noise(t, .18, .7 * v, 900, .6); tone('square', 180, t, .06, .2 * v, null, 60); }
      else if (k === 'smg') noise(t, .09, .45 * v, 1300, .7);
      else if (k === 'rifle') { noise(t, .28, .85 * v, 700, .5); tone('sine', 120, t, .2, .4 * v, null, 50); }
      else if (k === 'punch') noise(t, .08, .5 * v, 300, 1);
      else if (k === 'crash') { noise(t, .3, .8 * v, 250, .8); noise(t, .15, .4 * v, 3000, 2); }
      else if (k === 'boom') { noise(t, 1.4, 1 * v, 160, .5, null, 'lowpass'); tone('sine', 80, t, .9, .7 * v, null, 25); }
      else if (k === 'splash') { noise(t, .5, .6 * v, 900, .4, null, 'lowpass'); noise(t, .25, .3 * v, 3000, .8); }
      else if (k === 'pick') { tone('square', 880, t, .08, .12); tone('square', 1320, t + .07, .12, .12); }
      else if (k === 'cash') { tone('triangle', 1568, t, .08, .2); tone('triangle', 2093, t + .06, .15, .2); }
      else if (k === 'pass') [0, 4, 7, 12, 16].forEach((n, i) => tone('sawtooth', mtof(60 + n), t + i * .09, .5, .09));
      else if (k === 'fail') [7, 3, 0, -5].forEach((n, i) => tone('sawtooth', mtof(55 + n), t + i * .16, .5, .08));
      else if (k === 'horn') { tone('square', 392, t, .35, .12); tone('square', 494, t, .35, .1); }
      else if (k === 'ferry') { tone('sawtooth', 98, t, 1.6, .12); tone('sawtooth', 147, t, 1.6, .08); }
      else if (k === 'door') noise(t, .1, .4, 600, 2);
      else if (k === 'hurt') tone('sawtooth', 220, t, .18, .15, null, 140);
      else if (k === 'scream') { const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.setValueAtTime(520 + Math.random() * 200, t); o.frequency.linearRampToValueAtTime(380, t + .6); f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 3; env(g, t, .02, .18 * v, .6); o.connect(f); f.connect(g); g.connect(sfxG); o.start(t); o.stop(t + .7); }
      else if (k === 'click') tone('square', 1200, t, .03, .08);
      else if (k === 'gull') { tone('sine', 1800, t, .12, .05 * v, null, 1200); tone('sine', 1700, t + .15, .12, .04 * v, null, 1100); }
    },
    setMute(m) { save.mute = m; if (master) master.gain.setTargetAtTime(m ? 0 : .9, ac.currentTime, .05); },
    suspend(s) { if (!ac) return; s ? ac.suspend() : ac.resume(); }
  };
}

/* ---------- game ---------- */
function mount(host, opts) {
  const THREE = global.THREE;
  opts = opts || {};
  const lang = LANG[opts.lang] ? opts.lang : 'en', L = LANG[lang];
  const fmt = (s, v) => String(s).replace(/\{(\w+)\}/g, (_, k) => v[k]);
  const money$ = n => '$' + Math.round(n).toLocaleString('en-US');
  const touch = matchMedia('(pointer:coarse)').matches;
  const SAVE_KEY = 'ih-save';
  let save; try { save = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { save = {}; }
  save = Object.assign({ m: 0, money: 300, ammo: { pistol: 48, smg: 0, rifle: 0 }, mute: false, radio: 0, debt: 50000, q: touch ? 'low' : 'high' }, save);
  const store = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} };
  host.innerHTML = '';
  if (!THREE) { host.textContent = 'three.js failed to load.'; return; }
  const wrap = document.createElement('div'); wrap.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none'; host.appendChild(wrap);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: save.q === 'high', powerPreference: 'high-performance' }); }
  catch (e) { wrap.innerHTML = '<p style="color:#fff;padding:20px;font:16px system-ui">WebGL is not available in this browser.</p>'; return; }
  const glc = renderer.domElement; glc.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;outline:none'; glc.tabIndex = 0; wrap.appendChild(glc);
  const hud = document.createElement('canvas'); hud.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'; wrap.appendChild(hud);
  const c = hud.getContext('2d');
  const HIGH = () => save.q === 'high';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, HIGH() ? 1.5 : 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = HIGH(); renderer.shadowMap.type = THREE.PCFShadowMap;
  let W = 800, H = 600, DPR = 1;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, .3, 3200);
  function resize() { const r = wrap.getBoundingClientRect(); W = Math.max(300, r.width); H = Math.max(260, r.height); DPR = Math.min(2, window.devicePixelRatio || 1); renderer.setSize(W, H, false); hud.width = W * DPR; hud.height = H * DPR; camera.aspect = W / H; camera.updateProjectionMatrix(); }
  const ro = window.ResizeObserver ? new ResizeObserver(resize) : null; ro ? ro.observe(wrap) : addEventListener('resize', resize); resize();

  const Wd = buildWorld();
  const groundAt = (x, z, y) => { const br = Wd.bridgeAt(x, z); if (br && (y == null || y > br.h - 4.5)) return { h: br.h, br }; return { h: Wd.heightRaw(x, z), br: null }; };
  const cellK = (x, z) => Wd.cellOf(x, z);
  const solidAt = (x, z, y) => Wd.solidTop(x, z) > y + .45;
  const audio = makeAudio(save);

  /* ---------- textures made in code ---------- */
  const canvasTex = (w, h, draw, repeat) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h); const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; } t.anisotropy = 4; return t; };
  function facade(style, lit) {
    return canvasTex(256, 256, (g, w, h) => {
      const rr = mulberry(style * 31 + (lit ? 7 : 1));
      g.fillStyle = lit ? '#000' : (style === 1 ? '#dfe9f2' : '#f4f1ea'); g.fillRect(0, 0, w, h);
      for (let fy = 0; fy < 4; fy++) for (let fx = 0; fx < 4; fx++) {
        const x = fx * 64, y = fy * 64 + 8;
        if (style === 1) { const on = rr() < .45; g.fillStyle = lit ? (on ? '#ffe7a8' : '#000') : (rr() < .5 ? '#6d8ea8' : '#88a8c0'); g.fillRect(x + 2, y - 6, 60, 56); if (!lit) { g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 4, y - 4, 20, 50); } }
        else if (style === 0) { const on = rr() < .35; if (!lit) { g.fillStyle = '#3c3a3a'; g.beginPath(); g.moveTo(x + 18, y + 48); g.lineTo(x + 18, y + 14); g.arc(x + 32, y + 14, 14, Math.PI, 0); g.lineTo(x + 46, y + 48); g.fill(); g.fillStyle = '#5a6f5a'; g.fillRect(x + 10, y + 12, 7, 36); g.fillRect(x + 47, y + 12, 7, 36); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x, y + 52, 64, 3); } else { g.fillStyle = on ? '#ffd27a' : '#000'; g.beginPath(); g.moveTo(x + 18, y + 48); g.lineTo(x + 18, y + 14); g.arc(x + 32, y + 14, 14, Math.PI, 0); g.lineTo(x + 46, y + 48); g.fill(); } }
        else { const on = rr() < .4; if (!lit) { g.fillStyle = '#41464d'; g.fillRect(x + 12, y + 6, 40, 34); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x + 4, y + 42, 56, 6); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 4, y + 40, 56, 2); } else { g.fillStyle = on ? '#fff0c4' : '#000'; g.fillRect(x + 12, y + 6, 40, 34); } }
      }
      g.fillStyle = lit ? '#000' : '#ffffff'; g.fillRect(0, 0, w, 6);
    }, true);
  }
  const groundTex = canvasTex(2048, 2048, (g, w) => {
    const s = w / (HALF * 2), small = document.createElement('canvas'); small.width = small.height = NC; const sg = small.getContext('2d'), img = sg.createImageData(NC, NC);
    const base = { lev: [138, 140, 146], tar: [184, 172, 150], bal: [170, 160, 140], bey: [168, 163, 154], bes: [164, 160, 152], usk: [178, 170, 152], kad: [166, 163, 156], bey2: [104, 138, 86], bog: [40, 80, 90], hal: [40, 80, 90], mar: [40, 80, 90] };
    for (let j = 0; j < NC; j++) for (let i = 0; i < NC; i++) {
      const k = j * NC + i, x = -HALF + (i + .5) * CELL, z = -HALF + (j + .5) * CELL; let col;
      if (Wd.water[k]) { const d = clamp(-Wd.hgt[k] / 8, 0, 1); col = [lerp(70, 18, d), lerp(110, 50, d), lerp(100, 62, d)]; }
      else {
        col = (base[Wd.districtAt(x, z)] || base.bey).slice();
        const hh = Wd.hgt[k]; col = col.map(v => v + (hh - 6) * 1.2);
        if (Wd.dW[k] < 3) col = [196, 188, 172];
        for (const Lm of Object.values(LANDMARKS)) if (Lm.park && (x - Lm.x) ** 2 + (z - Lm.z) ** 2 < Lm.r * Lm.r) col = [92, 138, 74];
        const n = ((i * 73856093 ^ j * 19349663) >>> 0) % 13; col = col.map(v => v + n - 6);
      }
      img.data[k * 4] = col[0]; img.data[k * 4 + 1] = col[1]; img.data[k * 4 + 2] = col[2]; img.data[k * 4 + 3] = 255;
    }
    sg.putImageData(img, 0, 0); g.imageSmoothingEnabled = true; g.drawImage(small, 0, 0, w, w);
    const P = (x, z) => [(x + HALF) * s, (z + HALF) * s];
    const groundEdges = Wd.edges.filter(e => { const mx = (e.a.x + e.b.x) / 2, mz = (e.a.z + e.b.z) / 2, br = Wd.bridgeAt(mx, mz); return !(br && br.b.big) && !(br && Wd.isWater(mx, mz)); });
    const stroke = (wd, col, dash) => { g.strokeStyle = col; g.lineWidth = wd * s; g.lineCap = 'round'; g.setLineDash(dash || []); g.beginPath(); for (const e of groundEdges) { const [x1, y1] = P(e.a.x, e.a.z), [x2, y2] = P(e.b.x, e.b.z); g.moveTo(x1, y1); g.lineTo(x2, y2); } g.stroke(); g.setLineDash([]); };
    stroke(21, '#c9c2b4'); stroke(14.5, '#3b3d42'); stroke(14, '#404248');
    for (const Lm of [LANDMARKS.taksim, LANDMARKS.blue, LANDMARKS.hagia]) { const [x, y] = P(Lm.x, Lm.z); g.fillStyle = '#d7cfbf'; g.beginPath(); g.arc(x, y, Lm.r * s * .95, 0, TAU); g.fill(); g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1; for (let r2 = 6; r2 < Lm.r * s; r2 += 6) { g.beginPath(); g.arc(x, y, r2, 0, TAU); g.stroke(); } }
    // centre and edge markings, kept away from junctions
    g.strokeStyle = 'rgba(240,240,235,.85)'; g.lineWidth = .35 * s;
    for (const e of groundEdges) {
      const L2 = Math.hypot(e.b.x - e.a.x, e.b.z - e.a.z); if (L2 < 22) continue; const ux = (e.b.x - e.a.x) / L2, uz = (e.b.z - e.a.z) / L2;
      g.setLineDash([3 * s, 4 * s]); g.beginPath(); const [x1, y1] = P(e.a.x + ux * 10, e.a.z + uz * 10), [x2, y2] = P(e.b.x - ux * 10, e.b.z - uz * 10); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.setLineDash([]);
      for (const sd of [-6.3, 6.3]) { g.beginPath(); const [a1, b1] = P(e.a.x + ux * 10 - uz * sd, e.a.z + uz * 10 + ux * sd), [a2, b2] = P(e.b.x - ux * 10 - uz * sd, e.b.z - uz * 10 + ux * sd); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); }
      for (const end of [0, 1]) { const ex = end ? e.b.x - ux * 9 : e.a.x + ux * 9, ez = end ? e.b.z - uz * 9 : e.a.z + uz * 9; for (let q = -5.5; q <= 5.5; q += 1.6) { const [zx, zy] = P(ex - uz * q, ez + ux * q); g.fillStyle = 'rgba(240,240,235,.75)'; g.save(); g.translate(zx, zy); g.rotate(Math.atan2(uz, ux)); g.fillRect(-1.6 * s, -.4 * s, 3.2 * s, .8 * s); g.restore(); } }
    }
  });
  groundTex.anisotropy = 8;
  const waterNorm = canvasTex(256, 256, (g, w, h) => {
    const img = g.createImageData(w, h), rr = mulberry(9), hm = new Float32Array(w * h);
    for (let n = 0; n < 60; n++) { const cx2 = rr() * w, cy = rr() * h, rad = 8 + rr() * 30, amp = rr() - .5; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let dx = Math.abs(x - cx2), dy = Math.abs(y - cy); dx = Math.min(dx, w - dx); dy = Math.min(dy, h - dy); const d = Math.hypot(dx, dy); if (d < rad) hm[y * w + x] += amp * Math.cos(d / rad * Math.PI / 2); } }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const l = hm[y * w + (x + w - 1) % w], r2 = hm[y * w + (x + 1) % w], u = hm[((y + h - 1) % h) * w + x], d = hm[((y + 1) % h) * w + x]; const nx = (l - r2) * 2, ny = (u - d) * 2, i = (y * w + x) * 4; img.data[i] = clamp(128 + nx * 127, 0, 255); img.data[i + 1] = clamp(128 + ny * 127, 0, 255); img.data[i + 2] = 255; img.data[i + 3] = 255; }
    g.putImageData(img, 0, 0);
  }, true);
  waterNorm.colorSpace = THREE.NoColorSpace;
  const asphaltTex = canvasTex(64, 256, (g, w, h) => { g.fillStyle = '#404248'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(240,240,235,.9)'; g.fillRect(31, 0, 2, 120); g.fillRect(3, 0, 1.5, h); g.fillRect(w - 4.5, 0, 1.5, h); }, true);
  const flagTex = canvasTex(192, 128, (g, w, h) => { g.fillStyle = '#e30a17'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 32, 0, TAU); g.fill(); g.fillStyle = '#e30a17'; g.beginPath(); g.arc(72, 64, 25.6, 0, TAU); g.fill(); g.fillStyle = '#fff'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5 + Math.PI / 2 * 0, rad = i % 2 ? 6.4 : 16, px = 108 + Math.cos(a - Math.PI / 2 + Math.PI / 2) * rad, py = 64 + Math.sin(a) * rad; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.fill(); });
  const signTex = (text, bg, fg) => canvasTex(512, 128, (g, w, h) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = '900 64px system-ui,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, w / 2, h / 2 + 4); });

  /* ---------- lights, sky, water, ground ---------- */
  const hemi = new THREE.HemisphereLight(0xcfe6ff, 0x6a5a48, 1.1); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.castShadow = HIGH(); sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -80, right: 80, top: 80, bottom: -80, near: 1, far: 600 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .4; scene.add(sun); scene.add(sun.target);
  const skyU = { top: { value: new THREE.Color('#5f9fe0') }, hor: { value: new THREE.Color('#d4e7f5') }, sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color('#fff2d0') }, night: { value: 0 } };
  const skyMat = new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 hor; uniform vec3 sunDir; uniform vec3 sunCol; uniform float night; varying vec3 vP; float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);} void main(){ float y = max(vP.y, 0.0); vec3 col = mix(hor, top, pow(y, 0.55)); float s = max(dot(vP, normalize(sunDir)), 0.0); col += sunCol * (pow(s, 900.0) * 3.0 + pow(s, 12.0) * 0.35); if (vP.y < 0.0) col = hor * 0.85; if (night > 0.3 && vP.y > 0.05) { vec2 g = floor(vP.xz / max(vP.y,0.15) * 220.0); if (h(g) > 0.9975) col += vec3(night); } gl_FragColor = vec4(col, 1.0); }' });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(2800, 32, 16), skyMat); sky.renderOrder = -1; sky.frustumCulled = false; scene.add(sky);
  scene.fog = new THREE.Fog(0xd4e7f5, 300, 1900);
  const pmrem = new THREE.PMREMGenerator(renderer); const envScene = new THREE.Scene(); const envSky = new THREE.Mesh(new THREE.SphereGeometry(100, 16, 8), skyMat); envScene.add(envSky); let envRT = null;
  function refreshEnv() { if (envRT) envRT.dispose(); envRT = pmrem.fromScene(envScene, 0, .1, 300); scene.environment = envRT.texture; }
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x1d5d74, roughness: .08, metalness: .3, transparent: true, opacity: .9, normalMap: waterNorm, normalScale: new THREE.Vector2(.55, .55) });
  waterNorm.repeat.set(900, 900);
  const waterMesh = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000), waterMat); waterMesh.rotation.x = -Math.PI / 2; waterMesh.position.y = 0; waterMesh.receiveShadow = HIGH(); scene.add(waterMesh);
  {
    const seg = HIGH() ? 220 : 150, gg = new THREE.PlaneGeometry(HALF * 2, HALF * 2, seg, seg); gg.rotateX(-Math.PI / 2);
    const pa = gg.attributes.position; for (let i = 0; i < pa.count; i++) pa.setY(i, Wd.heightRaw(pa.getX(i), pa.getZ(i)) - .02);
    gg.computeVertexNormals();
    const gm = new THREE.MeshStandardMaterial({ map: groundTex, roughness: .95 });
    const detail = canvasTex(128, 128, (g, w) => { const rr = mulberry(5); g.fillStyle = '#808080'; g.fillRect(0, 0, w, w); for (let i = 0; i < 900; i++) { const v = 100 + rr() * 60 | 0; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(rr() * w, rr() * w, 1 + rr() * 2, 1 + rr() * 2); } g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < w; i += 16) { g.fillRect(i, 0, 1, w); g.fillRect(0, i, w, 1); } }, true);
    detail.colorSpace = THREE.NoColorSpace;
    gm.onBeforeCompile = sh => { sh.uniforms.detailMap = { value: detail }; sh.fragmentShader = 'uniform sampler2D detailMap;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb *= mix(vec3(1.0), texture2D(detailMap, vMapUv * 600.0).rgb * 1.55, 0.55);'); };
    const ground = new THREE.Mesh(gg, gm); ground.receiveShadow = HIGH(); scene.add(ground);
  }

  /* ---------- buildings: three merged meshes, one per facade style ---------- */
  const facTex = [0, 1, 2].map(s => facade(s, false)), litTex = [0, 1, 2].map(s => facade(s, true));
  const bMats = [0, 1, 2].map(s => new THREE.MeshStandardMaterial({ map: facTex[s], emissiveMap: litTex[s], emissive: 0xffffff, emissiveIntensity: 0, vertexColors: true, roughness: s === 1 ? .18 : .85, metalness: s === 1 ? .55 : 0, envMapIntensity: s === 1 ? 1.2 : .4 }));
  {
    const A = [0, 1, 2].map(() => ({ p: [], n: [], u: [], c: [], i: [] }));
    const col = new THREE.Color(), rcol = new THREE.Color();
    const quad = (a, ps, nrm, uvs, cl) => { const b = a.p.length / 3; for (let k = 0; k < 4; k++) { a.p.push(...ps[k]); a.n.push(...nrm); a.u.push(...uvs[k]); a.c.push(cl.r, cl.g, cl.b); } a.i.push(b, b + 1, b + 2, b, b + 2, b + 3); };
    const box = (a, x, y, z, w, h, d, wc, rc) => {
      const x1 = x + w, y1 = y + h, z1 = z + d, U = 12, V = 12.8, ru = [.5, .985];
      quad(a, [[x, y, z1], [x1, y, z1], [x1, y1, z1], [x, y1, z1]], [0, 0, 1], [[0, 0], [w / U, 0], [w / U, h / V], [0, h / V]], wc);
      quad(a, [[x1, y, z], [x, y, z], [x, y1, z], [x1, y1, z]], [0, 0, -1], [[0, 0], [w / U, 0], [w / U, h / V], [0, h / V]], wc);
      quad(a, [[x1, y, z1], [x1, y, z], [x1, y1, z], [x1, y1, z1]], [1, 0, 0], [[0, 0], [d / U, 0], [d / U, h / V], [0, h / V]], wc);
      quad(a, [[x, y, z], [x, y, z1], [x, y1, z1], [x, y1, z]], [-1, 0, 0], [[0, 0], [d / U, 0], [d / U, h / V], [0, h / V]], wc);
      quad(a, [[x, y1, z1], [x1, y1, z1], [x1, y1, z], [x, y1, z]], [0, 1, 0], [ru, ru, ru, ru], rc);
    };
    const rr = mulberry(77);
    for (const B of Wd.blds) {
      col.set(B.wall); rcol.set(B.roof); const a = A[B.st];
      box(a, B.x, B.y, B.z, B.w, B.h, B.d, col, rcol);
      if (B.st !== 1 && rr() < .5) { const s2 = 2 + rr() * 2; box(a, B.x + rr() * (B.w - s2), B.y + B.h, B.z + rr() * (B.d - s2), s2, 1.5 + rr() * 2, s2, rcol, rcol); }
      if (B.st === 0 && B.h < 22 && rr() < .6) { const c2 = rcol.clone().multiplyScalar(.8); box(a, B.x - .4, B.y + B.h - .6, B.z - .4, B.w + .8, .6, B.d + .8, c2, c2); }
    }
    A.forEach((a, s) => {
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(a.p, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(a.n, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(a.u, 2)); geo.setAttribute('color', new THREE.Float32BufferAttribute(a.c, 3)); geo.setIndex(a.i); geo.computeBoundingSphere();
      const m = new THREE.Mesh(geo, bMats[s]); m.castShadow = HIGH(); m.receiveShadow = HIGH(); scene.add(m);
    });
  }

  /* ---------- landmarks ---------- */
  const M = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: .8 }, o || {}));
  const stone = M('#ddd4c2'), lead = M('#8f9aa8', { roughness: .45, metalness: .5 }), gold = M('#d9b24a', { metalness: .9, roughness: .3 }), concrete = M('#9a9a96'), white = M('#f2f0ea'), dark = M('#2a2c30');
  const add = (geo, mat, x, y, z, o) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (o) { if (o.ry) m.rotation.y = o.ry; if (o.rx) m.rotation.x = o.rx; if (o.rz) m.rotation.z = o.rz; if (o.s) m.scale.set(...o.s); } m.castShadow = HIGH(); m.receiveShadow = HIGH(); scene.add(m); return m; };
  const markSolid = (x, z, w, d, top) => Wd.addRect(x, z, x + w, z + d, top);
  function minaret(x, z, y, h) {
    add(new THREE.CylinderGeometry(.9, 1.1, h, 10), stone, x, y + h / 2, z);
    for (const f of [.55, .78]) add(new THREE.CylinderGeometry(1.6, 1.4, .5, 12), stone, x, y + h * f, z);
    add(new THREE.ConeGeometry(1.05, h * .22, 10), lead, x, y + h + h * .11, z);
    add(new THREE.SphereGeometry(.3, 6, 4), gold, x, y + h + h * .23, z);
    markSolid(x - 1.5, z - 1.5, 3, 3, y + h);
  }
  function mosque(Lm, s, nMin, wallMat) {
    const x = Lm.x, z = Lm.z, y = Wd.heightRaw(x, z) - .3, w = 34 * s;
    add(new THREE.BoxGeometry(w, 14 * s, w), wallMat || stone, x, y + 7 * s, z); markSolid(x - w / 2, z - w / 2, w, w, y + 30 * s);
    add(new THREE.CylinderGeometry(13 * s, 13 * s, 4 * s, 24), wallMat || stone, x, y + 16 * s, z);
    const dome = new THREE.SphereGeometry(13 * s, 28, 14, 0, TAU, 0, Math.PI / 2); add(dome, lead, x, y + 18 * s, z);
    add(new THREE.SphereGeometry(.8 * s, 8, 6), gold, x, y + 31.5 * s, z);
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { add(new THREE.SphereGeometry(8 * s, 18, 9, 0, TAU, 0, Math.PI / 2), lead, x + dx * 13 * s, y + 14 * s, z + dz * 13 * s); }
    for (const [dx, dz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { add(new THREE.CylinderGeometry(3 * s, 3 * s, 4 * s, 10), wallMat || stone, x + dx * 13 * s, y + 15 * s, z + dz * 13 * s); add(new THREE.SphereGeometry(3.2 * s, 12, 6, 0, TAU, 0, Math.PI / 2), lead, x + dx * 13 * s, y + 17 * s, z + dz * 13 * s); }
    const mpos = nMin === 6 ? [[-1, -1], [1, -1], [-1, 1], [1, 1], [-1.9, 0], [1.9, 0]] : nMin === 4 ? [[-1, -1], [1, -1], [-1, 1], [1, 1]] : [[-1, -1], [1, -1]];
    for (const [dx, dz] of mpos) minaret(x + dx * (w / 2 + 3), z + dz * (w / 2 + 3), y, 44 * s);
    add(new THREE.BoxGeometry(w * .9, 6 * s, w * .7), wallMat || stone, x + w * .8, y + 3 * s, z);
  }
  mosque(LANDMARKS.blue, 1.15, 6);
  mosque(LANDMARKS.hagia, 1.15, 4, M('#d7a98c'));
  mosque(LANDMARKS.suley, 1.05, 4);
  mosque(LANDMARKS.mihri, .75, 2);
  mosque(LANDMARKS.ortakoy, .42, 2, white);
  { const G = LANDMARKS.galata, y = Wd.heightRaw(G.x, G.z); add(new THREE.CylinderGeometry(6, 6.8, 48, 20), M('#cdbfa6'), G.x, y + 24, G.z); add(new THREE.CylinderGeometry(7.3, 7.3, 3, 20), stone, G.x, y + 46, G.z); add(new THREE.ConeGeometry(7, 15, 20), M('#3f4a58', { roughness: .5, metalness: .4 }), G.x, y + 55, G.z); markSolid(G.x - 7, G.z - 7, 14, 14, y + 62); }
  { const x = KX, z = KZ; add(new THREE.CylinderGeometry(10, 12, 3, 16), M('#7c7368'), x, 0, z); add(new THREE.BoxGeometry(12, 6, 9), white, x - 2, 4.4, z); add(new THREE.CylinderGeometry(2.4, 2.6, 16, 14), white, x + 3, 9, z); add(new THREE.ConeGeometry(2.8, 5, 14), lead, x + 3, 19.5, z); markSolid(x - 7, z - 6, 12, 12, 7); }
  { const D = LANDMARKS.dolma, y = Wd.heightRaw(D.x, D.z); add(new THREE.BoxGeometry(22, 14, 120), white, D.x, y + 7, D.z); add(new THREE.BoxGeometry(24, 2, 122), M('#e8e3d6'), D.x, y + 14.5, D.z); for (let k = -5; k <= 5; k++) add(new THREE.CylinderGeometry(.6, .6, 12, 8), stone, D.x + 11.5, y + 6, D.z + k * 10); markSolid(D.x - 11, D.z - 60, 22, 120, y + 16); }
  { const Hp = LANDMARKS.haydar, y = Wd.heightRaw(Hp.x, Hp.z); add(new THREE.BoxGeometry(60, 18, 26), M('#cbb08a'), Hp.x, y + 9, Hp.z); for (const dx of [-30, 30]) { add(new THREE.CylinderGeometry(5, 5, 26, 14), M('#cbb08a'), Hp.x + dx, y + 13, Hp.z); add(new THREE.ConeGeometry(5.6, 10, 14), M('#4a5866'), Hp.x + dx, y + 31, Hp.z); } markSolid(Hp.x - 35, Hp.z - 13, 70, 26, y + 36); }
  { const Pr = LANDMARKS.prison, y = Wd.heightRaw(Pr.x, Pr.z); for (const [dx, dz, w, d] of [[-40, -40, 80, 2], [-40, 38, 80, 2], [-40, -40, 2, 80], [38, -40, 2, 80]]) { add(new THREE.BoxGeometry(w, 7, d), concrete, Pr.x + dx + w / 2, y + 3.5, Pr.z + dz + d / 2); markSolid(Pr.x + dx, Pr.z + dz, w, d, y + 7); } add(new THREE.BoxGeometry(40, 14, 30), M('#8d9196'), Pr.x, y + 7, Pr.z - 5); markSolid(Pr.x - 20, Pr.z - 20, 40, 30, y + 14); for (const [dx, dz] of [[-40, -40], [40, -40], [-40, 40], [40, 40]]) add(new THREE.BoxGeometry(4, 12, 4), concrete, Pr.x + dx, y + 6, Pr.z + dz); }
  function signBox(Lm, w, d, h, wall, text, bg, fg) { const y = Wd.heightRaw(Lm.x, Lm.z); add(new THREE.BoxGeometry(w, h, d), wall, Lm.x, y + h / 2, Lm.z); markSolid(Lm.x - w / 2, Lm.z - d / 2, w, d, y + h); const sg = new THREE.Mesh(new THREE.PlaneGeometry(w * .8, w * .2), new THREE.MeshBasicMaterial({ map: signTex(text, bg, fg) })); sg.position.set(Lm.x, y + h + w * .1 + .5, Lm.z + d / 2 + .2); scene.add(sg); const sg2 = sg.clone(); sg2.rotation.y = Math.PI; sg2.position.z = Lm.z - d / 2 - .2; scene.add(sg2); return y; }
  signBox(LANDMARKS.garage, 18, 14, 7, M('#7a5040'), 'ELA OTO BOYA', '#141018', '#ff4fa0');
  signBox(LANDMARKS.gunshop, 14, 12, 6, M('#4a4542'), 'SİLAHÇI', '#1a1410', '#ff8a1e');
  signBox(LANDMARKS.police, 28, 22, 16, M('#3d5f96'), 'EMNİYET', '#0d1b3a', '#ffffff');
  signBox(LANDMARKS.hosp1, 24, 20, 18, white, 'HASTANE', '#ffffff', '#e30a17');
  signBox(LANDMARKS.hosp2, 24, 20, 18, white, 'HASTANE', '#ffffff', '#e30a17');
  signBox(LANDMARKS.ware, 34, 24, 10, M('#6f747c'), 'DEPO', '#222', '#ffd23a');
  { const T = LANDMARKS.tower, y = Wd.heightRaw(T.x, T.z); add(new THREE.BoxGeometry(26, 150, 26), bMats[1], T.x, y + 75, T.z); markSolid(T.x - 13, T.z - 13, 26, 26, y + 150); }
  for (const Hp of [LANDMARKS.helipad, LANDMARKS.helipad2]) { const y = Wd.heightRaw(Hp.x, Hp.z); const pad = add(new THREE.CylinderGeometry(9, 9, .3, 24), M('#3a3d44'), Hp.x, y + .1, Hp.z); const hm = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ map: signTex('H', '#3a3d44', '#ffd23a'), transparent: true })); hm.rotation.x = -Math.PI / 2; hm.position.set(Hp.x, y + .3, Hp.z); scene.add(hm); void pad; }
  function flag(x, z, h) { const y = Wd.heightRaw(x, z); add(new THREE.CylinderGeometry(.18, .22, h, 8), white, x, y + h / 2, z); const f = new THREE.Mesh(new THREE.PlaneGeometry(9, 6, 8, 1), new THREE.MeshStandardMaterial({ map: flagTex, side: THREE.DoubleSide, roughness: .9 })); f.position.set(x + 4.5, y + h - 3.2, z); scene.add(f); flags.push(f); }
  const flags = [];
  flag(LANDMARKS.taksim.x, LANDMARKS.taksim.z, 22); flag(LANDMARKS.camlica.x, LANDMARKS.camlica.z, 34); flag(KX - 6, KZ + 2, 12);
  { const T = LANDMARKS.taksim, y = Wd.heightRaw(T.x, T.z); add(new THREE.BoxGeometry(6, 9, 6), M('#b8b2a4'), T.x + 14, y + 4.5, T.z); markSolid(T.x + 11, T.z - 3, 6, 6, y + 9); }

  /* bridges: decks with ramps, towers, cables and the coloured lights of the Bosphorus bridges */
  const bridgeLights = [];
  for (const b of BRIDGES) {
    const n = Math.ceil(b.L / 4), top = [], side = [], idx = [], sidx = [], uv = [];
    const prof = t => t < b.ramp ? lerp(b.ha, b.deck, smooth(t / b.ramp)) : t > b.L - b.ramp ? lerp(b.hb, b.deck, smooth((b.L - t) / b.ramp)) : b.deck;
    const nx = -b.uz, nz = b.ux, hw = b.w / 2;
    for (let i = 0; i <= n; i++) {
      const t = b.L * i / n, x = b.ax + b.ux * t, z = b.az + b.uz * t, y = prof(t) + .05;
      top.push(x - nx * hw, y, z - nz * hw, x + nx * hw, y, z + nz * hw); uv.push(0, t / 16, 1, t / 16);
      if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3);
      for (const sd of [-1, 1]) side.push(x + nx * hw * sd, y + 1.1, z + nz * hw * sd, x + nx * hw * sd, y - 1.6, z + nz * hw * sd);
    }
    const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(top, 3)); tg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); tg.setIndex(idx); tg.computeVertexNormals();
    const at = asphaltTex.clone(); at.needsUpdate = true; at.wrapS = at.wrapT = THREE.RepeatWrapping;
    const deck = new THREE.Mesh(tg, new THREE.MeshStandardMaterial({ map: at, roughness: .9, side: THREE.DoubleSide })); deck.receiveShadow = HIGH(); scene.add(deck);
    for (const sd of [0, 1]) { const pos = []; const id2 = []; for (let i = 0; i <= n; i++) { const o = i * 4 + sd * 2; pos.push(side[o * 3], side[o * 3 + 1], side[o * 3 + 2], side[o * 3 + 3], side[o * 3 + 4], side[o * 3 + 5]); if (i < n) id2.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); } const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); sg.setIndex(id2); sg.computeVertexNormals(); const sm = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: b.big ? 0xb9bcc2 : 0x8a8d92, side: THREE.DoubleSide, roughness: .7 })); sm.castShadow = HIGH(); scene.add(sm); }
    if (!b.big) continue;
    const bz = b.az, bcx = bxz(bz), towers = [bcx - BW + 3, bcx + BW - 3], th = b.deck + 52;
    for (const tx of towers) { for (const sd of [-1, 1]) { add(new THREE.BoxGeometry(3, th, 3), M('#c9ccd2'), tx, th / 2 - 2, bz + sd * (hw + 1.8)); markSolid(tx - 2, bz + sd * (hw + 1.8) - 2, 4, 4, th); } for (const yy of [b.deck - 4, th - 8, th - 2]) add(new THREE.BoxGeometry(2.4, 2.2, b.w + 6), M('#c9ccd2'), tx, yy, bz); }
    for (const sd of [-1, 1]) {
      const zz = bz + sd * (hw + .6), pts = [];
      const aX = b.ax + 70, bX = b.bx - 70, t0 = towers[0], t1 = towers[1];
      pts.push(new THREE.Vector3(aX, prof(70) + 1, zz));
      for (let k = 1; k <= 6; k++) { const x = lerp(aX, t0, k / 6); pts.push(new THREE.Vector3(x, lerp(prof(70) + 1, th - 1, Math.pow(k / 6, 1.5)), zz)); }
      for (let k = 1; k < 20; k++) { const x = lerp(t0, t1, k / 20), u = k / 20; pts.push(new THREE.Vector3(x, th - 1 - (1 - Math.pow(2 * u - 1, 2)) * (th - b.deck - 4), zz)); }
      for (let k = 0; k <= 6; k++) { const x = lerp(t1, bX, k / 6); pts.push(new THREE.Vector3(x, lerp(th - 1, prof(b.L - 70) + 1, Math.pow(k / 6, .67)), zz)); }
      const curve = new THREE.CatmullRomCurve3(pts); const cab = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, .45, 6), M('#d0d3d8', { metalness: .6, roughness: .4 })); scene.add(cab);
      const segs = []; for (let x = t0 + 6; x < t1 - 4; x += 6) { const u = (x - t0) / (t1 - t0), cy = th - 1 - (1 - Math.pow(2 * u - 1, 2)) * (th - b.deck - 4); segs.push(x, cy, zz, x, b.deck + 1, zz); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3)); scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xc8ccd2 })));
      for (let k = 0; k <= 60; k++) bridgeLights.push(curve.getPoint(k / 60));
    }
  }
  const bulbGeo = new THREE.SphereGeometry(.7, 6, 4), bulbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  const bLights = new THREE.InstancedMesh(bulbGeo, bulbMat, bridgeLights.length); bridgeLights.forEach((p, i) => { bLights.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, p.y + .6, p.z)); bLights.setColorAt(i, new THREE.Color(0, 0, 0)); }); scene.add(bLights);

  /* trees (Istanbul cypresses and plane trees) and street lamps */
  {
    const cy = Wd.trees.filter(t => t.k === 'cy'), pl = Wd.trees.filter(t => t.k !== 'cy'), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), cl = new THREE.Color();
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(.18, .32, 1, 5), M('#5a4632'), Wd.trees.length);
    Wd.trees.forEach((t, i) => { const hh = t.k === 'cy' ? 2.5 : 3.6; m4.compose(ps.set(t.x, t.y + hh / 2 * t.s, t.z), q, sc.set(t.s, hh * t.s, t.s)); trunk.setMatrixAt(i, m4); });
    const cyM = new THREE.InstancedMesh(new THREE.ConeGeometry(1.4, 1, 7), M('#2c4a2a'), cy.length);
    cy.forEach((t, i) => { m4.compose(ps.set(t.x, t.y + 2 * t.s + 5 * t.s, t.z), q, sc.set(t.s, 11 * t.s, t.s)); cyM.setMatrixAt(i, m4); cyM.setColorAt(i, cl.setHSL(.3 + Math.random() * .05, .35, .2 + Math.random() * .08)); });
    const plM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), M('#4f7f3a'), pl.length);
    pl.forEach((t, i) => { m4.compose(ps.set(t.x, t.y + 5.4 * t.s, t.z), q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * 6), sc.set(3.6 * t.s, 2.8 * t.s, 3.6 * t.s)); plM.setMatrixAt(i, m4); plM.setColorAt(i, cl.setHSL(.24 + Math.random() * .07, .45, .26 + Math.random() * .1)); });
    q.identity();
    for (const m of [trunk, cyM, plM]) { m.castShadow = HIGH(); m.receiveShadow = HIGH(); scene.add(m); }
  }
  const lampBulbMat = new THREE.MeshStandardMaterial({ color: 0x333333, emissive: 0xffd9a0, emissiveIntensity: 0 });
  {
    const pole = new THREE.InstancedMesh(new THREE.CylinderGeometry(.08, .12, 7, 5), M('#3a3d44'), Wd.lamps.length), bulb = new THREE.InstancedMesh(new THREE.SphereGeometry(.35, 6, 4), lampBulbMat, Wd.lamps.length), m4 = new THREE.Matrix4();
    Wd.lamps.forEach((l, i) => { pole.setMatrixAt(i, m4.makeTranslation(l.x, l.y + 3.5, l.z)); bulb.setMatrixAt(i, m4.makeTranslation(l.x, l.y + 7, l.z)); });
    scene.add(pole); scene.add(bulb);
  }

  /* ---------- models ---------- */
  const matCache = new Map();
  const mat = (col, o) => { const k = col + (o ? JSON.stringify(o) : ''); if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial(Object.assign({ color: col, roughness: .75 }, o || {}))); return matCache.get(k); };
  const G = { leg: new THREE.BoxGeometry(.2, .9, .22), torso: new THREE.BoxGeometry(.3, .64, .52), head: new THREE.SphereGeometry(.17, 12, 10), arm: new THREE.BoxGeometry(.15, .64, .15), hand: new THREE.SphereGeometry(.075, 6, 5), hair: new THREE.SphereGeometry(.18, 10, 8, 0, TAU, 0, Math.PI / 2), cap: new THREE.CylinderGeometry(.19, .19, .1, 12), brim: new THREE.BoxGeometry(.18, .03, .3), gun: new THREE.BoxGeometry(.32, .1, .07), shoe: new THREE.BoxGeometry(.3, .1, .22) };
  function makeHuman(look) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const part = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = HIGH(); (parent || body).add(o); return o; };
    const legs = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(0, .95, sd * .13); body.add(p); part(G.leg, mat(look.pants), 0, -.45, 0, p); part(G.shoe, mat('#1b1b1f'), .05, -.92, 0, p); return p; });
    part(G.torso, mat(look.shirt), 0, 1.28, 0);
    const arms = [-1, 1].map(sd => { const p = new THREE.Group(); p.position.set(0, 1.55, sd * .34); body.add(p); part(G.arm, mat(look.shirt), 0, -.3, 0, p); part(G.hand, mat(look.skin), 0, -.64, 0, p); return p; });
    const head = part(G.head, mat(look.skin), 0, 1.8, 0); head.scale.set(1, 1.12, .95);
    if (look.hat === 'cap' || look.hat === 'cop') { part(G.cap, mat(look.hat === 'cop' ? '#1d2b4a' : '#1a1a1a'), 0, 1.92, 0); part(G.brim, mat(look.hat === 'cop' ? '#111a30' : '#1a1a1a'), .15, 1.9, 0); }
    else part(G.hair, mat(look.hair), -.01, 1.84, 0);
    if (look.vest) part(new THREE.BoxGeometry(.32, .4, .54), mat(look.vest), 0, 1.3, 0);
    const gun = part(G.gun, mat('#1a1a1d', { metalness: .6, roughness: .4 }), .12, -.62, 0, arms[1]); gun.rotation.z = Math.PI / 2; gun.visible = false;
    root.userData = { legs, arms, body, gun, head };
    scene.add(root); return root;
  }
  function poseHuman(m, p, dt) {
    const u = m.userData, s = Math.sin(p.walk || 0), sp = p.anim || 0;
    u.body.rotation.set(0, 0, 0); u.body.position.y = 0;
    if (p.dead) { u.body.rotation.z = Math.PI / 2; u.body.position.y = .2; u.legs.forEach(l => l.rotation.z = 0); u.arms.forEach((a, i) => a.rotation.set(i ? .6 : -.6, 0, 0)); return; }
    if (p.swim) { u.body.rotation.z = -1.3; u.body.position.y = -.2; u.legs.forEach((l, i) => l.rotation.z = Math.sin(p.walk * 2 + i * 3) * .4); u.arms.forEach((a, i) => { a.rotation.z = (p.walk + i * Math.PI) % TAU - Math.PI; a.rotation.x = 0; }); u.gun.visible = false; return; }
    u.legs.forEach((l, i) => l.rotation.z = s * .7 * sp * (i ? -1 : 1));
    const armed = p.weapon && p.weapon !== 'fist';
    u.gun.visible = !!armed;
    if (armed && p.aiming) { u.arms[1].rotation.set(0, 0, Math.PI / 2 - (p.aimPitch || 0)); u.arms[0].rotation.set(-.4, 0, Math.PI / 2.4 - (p.aimPitch || 0)); }
    else u.arms.forEach((a, i) => a.rotation.set(i ? .08 : -.08, 0, -s * .6 * sp * (i ? -1 : 1)));
    if (p.punchT > 0) u.arms[1].rotation.set(0, 0, Math.PI / 2);
    if (!p.onGround && !p.swim && p.kind === 'player') { u.legs.forEach((l, i) => l.rotation.z = i ? .5 : -.3); u.arms.forEach(a => a.rotation.x = 0); }
    void dt;
  }
  const looks = () => ({ skin: ['#f1c9a5', '#d9a477', '#c48a5c', '#a5714b', '#e8b98f', '#f5d3b3'][Math.floor(Math.random() * 6)], shirt: ['#3f6fb0', '#f2f2f2', '#b84a3e', '#5b8e7d', '#2b2d42', '#d9a441', '#7a4f9a', '#e07070', '#4a4a4a', '#8fb3d9', '#c9c2b0'][Math.floor(Math.random() * 11)], pants: ['#2b2d42', '#3a4a6a', '#5a5550', '#1f2a3a', '#7a6a55', '#222'][Math.floor(Math.random() * 6)], hair: ['#15110f', '#3b2a1e', '#5a3d25', '#8a6a4a', '#888'][Math.floor(Math.random() * 5)], hat: Math.random() < .12 ? 'cap' : null });

  const VSPEC = {
    sedan: { L: 4.6, W: 1.85, H: .7, maxV: 34, acc: 11, turn: 1.8, grip: 7, hp: 100, kind: 'car' },
    taxi: { L: 4.6, W: 1.85, H: .7, maxV: 34, acc: 11, turn: 1.8, grip: 7, hp: 100, kind: 'car' },
    sports: { L: 4.5, W: 1.95, H: .55, maxV: 52, acc: 19, turn: 2.1, grip: 7.5, hp: 80, kind: 'car' },
    van: { L: 5.4, W: 2.1, H: 1.5, maxV: 28, acc: 8, turn: 1.6, grip: 7, hp: 160, kind: 'car' },
    police: { L: 4.8, W: 1.9, H: .7, maxV: 46, acc: 17, turn: 2, grip: 7.5, hp: 140, kind: 'car' },
    harun: { L: 4.9, W: 1.95, H: .65, maxV: 48, acc: 18, turn: 2, grip: 8, hp: 260, kind: 'car' },
    boat: { L: 7, W: 2.4, maxV: 30, acc: 9, turn: 1.3, grip: 1.6, hp: 120, kind: 'boat' },
    pboat: { L: 7.5, W: 2.6, maxV: 30, acc: 9, turn: 1.3, grip: 1.6, hp: 150, kind: 'boat' },
    heli: { L: 9, W: 2.4, maxV: 45, acc: 10, turn: 1.4, grip: 1, hp: 140, kind: 'heli' }
  };
  const CAR_COLS = ['#c8ccd4', '#2b2f3a', '#a3222b', '#1f5fa8', '#e8e2d0', '#3c7d4f', '#d97a2b', '#6b3fa0', '#8a8f99', '#1aa7a0', '#f0f0f0', '#5a5a5a'];
  const glassM = new THREE.MeshStandardMaterial({ color: 0x1a2a38, roughness: .1, metalness: .6, envMapIntensity: 1.4 });
  const headM = new THREE.MeshStandardMaterial({ color: 0xfff6d8, emissive: 0xfff2c0, emissiveIntensity: .6 }), tailM = new THREE.MeshStandardMaterial({ color: 0x7a0a0a, emissive: 0xff1a1a, emissiveIntensity: .4 });
  const sirenR = new THREE.MeshStandardMaterial({ color: 0x550000, emissive: 0xff1020, emissiveIntensity: 0 }), sirenB = new THREE.MeshStandardMaterial({ color: 0x000a55, emissive: 0x1040ff, emissiveIntensity: 0 });
  const wheelGeo = new THREE.CylinderGeometry(.36, .36, .26, 12); wheelGeo.rotateX(Math.PI / 2);
  function makeVehicle(type, col) {
    const sp = VSPEC[type], g = new THREE.Group(), body = new THREE.Group(); g.add(body);
    const bm = mat(col, { roughness: .3, metalness: .5, envMapIntensity: 1 });
    const part = (geo, m, x, y, z, parent) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = HIGH(); (parent || body).add(o); return o; };
    const wheels = [];
    if (sp.kind === 'car') {
      const L2 = sp.L, W2 = sp.W, base = .45;
      part(new THREE.BoxGeometry(L2, sp.H, W2), bm, 0, base + sp.H / 2, 0);
      if (type === 'van') part(new THREE.BoxGeometry(L2 * .25, .4, W2 * .9), glassM, L2 * .38, base + sp.H - .35, 0);
      else {
        const cab = new THREE.Mesh(new THREE.BoxGeometry(L2 * .48, .52, W2 * .86), [glassM, glassM, bm, bm, glassM, glassM]); cab.position.set(-L2 * .06, base + sp.H + .26, 0); cab.castShadow = HIGH(); body.add(cab);
        part(new THREE.BoxGeometry(L2 * .5, .05, W2 * .88), bm, -L2 * .06, base + sp.H + .54, 0);
      }
      for (const sd of [-1, 1]) { part(new THREE.BoxGeometry(.06, .16, .4), headM, L2 / 2, base + sp.H * .65, sd * W2 * .32); part(new THREE.BoxGeometry(.06, .16, .4), tailM, -L2 / 2, base + sp.H * .65, sd * W2 * .32); }
      for (const [x, z] of [[L2 * .32, -W2 / 2 + .05], [L2 * .32, W2 / 2 - .05], [-L2 * .32, -W2 / 2 + .05], [-L2 * .32, W2 / 2 - .05]]) { const w = new THREE.Mesh(wheelGeo, mat('#151515', { roughness: .9 })); w.position.set(x, .36, z); g.add(w); wheels.push(w); }
      if (type === 'taxi') { part(new THREE.BoxGeometry(.5, .22, .3), mat('#1a1a1a'), -L2 * .06, base + sp.H + .66, 0); part(new THREE.BoxGeometry(.52, .14, .32), new THREE.MeshStandardMaterial({ color: 0xffe36b, emissive: 0xffd040, emissiveIntensity: .5 }), -L2 * .06, base + sp.H + .66, 0); }
      if (type === 'police') { for (const sd of [-1, 1]) part(new THREE.BoxGeometry(L2 * .9, .14, .04), mat('#1f4bb0'), 0, base + sp.H * .5, sd * (W2 / 2 + .01)); part(new THREE.BoxGeometry(.3, .14, .45), sirenR, -L2 * .06, base + sp.H + .64, -.28); part(new THREE.BoxGeometry(.3, .14, .45), sirenB, -L2 * .06, base + sp.H + .64, .28); }
      if (type === 'sports') part(new THREE.BoxGeometry(.25, .06, W2), bm, -L2 / 2 + .15, base + sp.H + .25, 0);
    } else if (sp.kind === 'boat') {
      const sh = new THREE.Shape(); sh.moveTo(-sp.L / 2, -sp.W / 2); sh.lineTo(sp.L / 2 - 2, -sp.W / 2); sh.quadraticCurveTo(sp.L / 2, -sp.W / 4, sp.L / 2 + .3, 0); sh.quadraticCurveTo(sp.L / 2, sp.W / 4, sp.L / 2 - 2, sp.W / 2); sh.lineTo(-sp.L / 2, sp.W / 2); sh.closePath();
      const hull = new THREE.ExtrudeGeometry(sh, { depth: 1.1, bevelEnabled: false }); hull.rotateX(Math.PI / 2); hull.translate(0, .8, 0);
      part(hull, mat(type === 'pboat' ? '#1f3f8a' : col, { roughness: .4 }), 0, 0, 0);
      part(new THREE.BoxGeometry(sp.L * .75, .05, sp.W * .9), mat('#8a6a48'), -.4, .82, 0);
      part(new THREE.BoxGeometry(.1, .6, sp.W * .8), glassM, .9, 1.1, 0);
      part(new THREE.BoxGeometry(.9, .6, .7), mat('#222'), -sp.L / 2 + .3, .9, 0);
      if (type === 'pboat') { part(new THREE.BoxGeometry(.3, .15, .4), sirenR, 0, 1.6, -.25); part(new THREE.BoxGeometry(.3, .15, .4), sirenB, 0, 1.6, .25); part(new THREE.BoxGeometry(1.8, .7, 1.6), mat('#f2f2f2'), -.6, 1.2, 0); }
    } else {
      part(new THREE.SphereGeometry(1, 16, 12), bm, 0, 1.6, 0).scale.set(2.1, 1.25, 1.2);
      part(new THREE.SphereGeometry(.9, 12, 10), glassM, 1.2, 1.75, 0).scale.set(1.1, .9, 1.05);
      part(new THREE.CylinderGeometry(.18, .32, 5, 8), bm, -4, 1.9, 0).rotation.z = Math.PI / 2;
      part(new THREE.BoxGeometry(.8, 1, .1), bm, -6.4, 2.3, 0);
      for (const sd of [-1, 1]) { part(new THREE.BoxGeometry(3.6, .1, .1), mat('#222'), 0, .1, sd * 1); for (const x of [-.9, .9]) part(new THREE.BoxGeometry(.08, .8, .08), mat('#222'), x, .5, sd * .95); }
      const rotor = new THREE.Group(); rotor.position.set(0, 3, 0); g.add(rotor); for (const r of [0, Math.PI / 2]) { const bl = new THREE.Mesh(new THREE.BoxGeometry(11, .05, .35), mat('#1a1a1a')); bl.rotation.y = r; rotor.add(bl); }
      const tr = new THREE.Group(); tr.position.set(-6.4, 2.4, .12); g.add(tr); tr.add(new THREE.Mesh(new THREE.BoxGeometry(.06, 1.8, .2), mat('#1a1a1a')));
      g.userData.rotor = rotor; g.userData.tail = tr;
    }
    g.userData.body = body; g.userData.wheels = wheels;
    scene.add(g); return g;
  }
  function ferryModel() {
    const g = new THREE.Group();
    const p = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = HIGH(); g.add(o); return o; };
    p(new THREE.BoxGeometry(34, 2.4, 9), mat('#1c1c20'), 0, .6, 0); p(new THREE.BoxGeometry(34, 2.2, 9.2), white, 0, 2.6, 0); p(new THREE.BoxGeometry(26, 2.2, 8), white, 0, 4.8, 0);
    p(new THREE.BoxGeometry(26.2, .9, 8.2), glassM, 0, 4.9, 0); p(new THREE.BoxGeometry(34.2, .7, 9.4), glassM, 0, 2.9, 0);
    p(new THREE.CylinderGeometry(1, 1.1, 3.4, 12), mat('#f2c230'), 0, 7.4, 0); p(new THREE.CylinderGeometry(1.05, 1.05, .6, 12), mat('#1a1a1a'), 0, 9.2, 0);
    scene.add(g); return g;
  }

  /* ---------- particles, decals, tracers, markers ---------- */
  const dotTex = canvasTex(64, 64, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(255,255,255,.6)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
  function makePoints(max, size, blending) {
    const geo = new THREE.BufferGeometry(), pos = new Float32Array(max * 3), col = new Float32Array(max * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.Points(geo, new THREE.PointsMaterial({ size, map: dotTex, vertexColors: true, transparent: true, depthWrite: false, blending: blending || THREE.NormalBlending, sizeAttenuation: true }));
    m.frustumCulled = false; scene.add(m); return { m, pos, col, list: [], max };
  }
  const fxS = makePoints(700, .35), fxB = makePoints(260, 3.2), fxG = makePoints(200, 2.4, THREE.AdditiveBlending);
  function emit(sys, x, y, z, vx, vy, vz, life, r, g, b, grav) { if (sys.list.length >= sys.max) sys.list.shift(); sys.list.push({ x, y, z, vx, vy, vz, t: life, max: life, r, g, b, grav: grav == null ? 9 : grav }); }
  function stepPoints(sys, dt) {
    let n = 0;
    for (const p of sys.list) { p.t -= dt; p.vy -= p.grav * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; }
    sys.list = sys.list.filter(p => p.t > 0);
    for (const p of sys.list) { const a = p.t / p.max; sys.pos[n * 3] = p.x; sys.pos[n * 3 + 1] = p.y; sys.pos[n * 3 + 2] = p.z; sys.col[n * 3] = p.r * a; sys.col[n * 3 + 1] = p.g * a; sys.col[n * 3 + 2] = p.b * a; n++; }
    sys.m.geometry.setDrawRange(0, n); sys.m.geometry.attributes.position.needsUpdate = true; sys.m.geometry.attributes.color.needsUpdate = true;
  }
  const decalMax = 140, decals = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x5a0008, transparent: true, opacity: .8, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }), decalMax);
  decals.instanceMatrix.setUsage(THREE.DynamicDrawUsage); let decalI = 0; { const z0 = new THREE.Matrix4().makeScale(0, 0, 0); for (let i = 0; i < decalMax; i++) decals.setMatrixAt(i, z0); } scene.add(decals);
  const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
  function decal(x, z, r, col) { const g = groundAt(x, z, 999).h; _m4.compose(_v.set(x, Math.max(g, 0) + .04, z), _q.identity(), _s.set(r, 1, r)); decals.setMatrixAt(decalI, _m4); decals.setColorAt(decalI, new THREE.Color(col || 0x5a0008)); decalI = (decalI + 1) % decalMax; decals.instanceMatrix.needsUpdate = true; if (decals.instanceColor) decals.instanceColor.needsUpdate = true; }
  const trGeo = new THREE.BufferGeometry(), trPos = new Float32Array(60 * 6); trGeo.setAttribute('position', new THREE.BufferAttribute(trPos, 3));
  const tracerMesh = new THREE.LineSegments(trGeo, new THREE.LineBasicMaterial({ color: 0xffe9a0, transparent: true, opacity: .9 })); tracerMesh.frustumCulled = false; scene.add(tracerMesh);
  let tracers = [];
  const flash = new THREE.PointLight(0xffc070, 0, 14, 2); scene.add(flash);
  const markerGeo = new THREE.CylinderGeometry(1, 1, 3, 32, 1, true), arrowGeo = new THREE.ConeGeometry(.7, 1.4, 4); arrowGeo.rotateX(Math.PI);
  const markers = [];
  function marker(i, x, z, col, size, yOver) {
    let mk = markers[i];
    if (!mk) { mk = new THREE.Group(); const cyl = new THREE.Mesh(markerGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })); const ar = new THREE.Mesh(arrowGeo, new THREE.MeshBasicMaterial({ color: 0xffffff })); mk.add(cyl); mk.add(ar); mk.userData = { cyl, ar }; scene.add(mk); markers[i] = mk; }
    const y = yOver != null ? yOver : Math.max(0, groundAt(x, z, 999).h);
    mk.visible = true; mk.position.set(x, y, z); mk.userData.cyl.material.color.set(col); mk.userData.ar.material.color.set(col);
    mk.userData.cyl.scale.set(size, 1, size); mk.userData.cyl.position.y = 1.5; mk.userData.ar.position.y = 4.5 + Math.sin(S.t * 3) * .4; mk.userData.ar.rotation.y = S.t * 2;
  }
  const hideMarkers = from => { for (let i = from; i < markers.length; i++) if (markers[i]) markers[i].visible = false; };

  /* ---------- state ---------- */
  const nn = (x, z) => Wd.nodes.reduce((b, n) => (n.x - x) ** 2 + (n.z - z) ** 2 < (b.x - x) ** 2 + (b.z - z) ** 2 ? n : b, Wd.nodes[0]);
  const P2 = n => ({ x: n.x, z: n.z });
  const shoreE = z => bxz(z) - BW - 12, shoreA = z => bxz(z) + BW + 12;
  const PL = {
    prison: P2(nn(-850, -640)), garage: P2(nn(-210, 240)), garageWalk: { x: -250, z: 282 }, bebek: { x: bxz(-650) - 105.5, z: -650 }, karakoy: { x: bxz(300) - 104.5, z: 300 },
    boat1: { x: bxz(300) - 90, z: 296 }, boat2: { x: bxz(520) + 90, z: 520 }, boat3: { x: bxz(-640) - 90, z: -640 },
    packages: [[-120, 0], [60, 40], [180, -50], [520, 30], [-420, -35]].map(([z, dx]) => ({ x: bxz(z) + dx, z })),
    hayd: P2(nn(395, 690)), ware: P2(nn(-420, -660)), tower: P2(nn(-310, -760)), towerWalk: { x: -310, z: -782 }, police: P2(nn(-20, 150)),
    race: [P2(nn(60, -80)), { x: bxz(-300), z: -300, y: 42 }, P2(nn(433, -300)), P2(nn(shoreA(-80), -80)), P2(nn(shoreA(380), 380)), P2(nn(420, 800))],
    uskWalk: { x: bxz(460) + 104.5, z: 460 }, kiz: { x: KX, z: KZ }, hospitals: [{ x: -200, z: 44 }, { x: 500, z: 894 }], gunshop: { x: -75, z: -195 }, helipads: [LANDMARKS.helipad, LANDMARKS.helipad2]
  };
  const S = { mode: 'menu', t: 0, clock: 18.5 * 60, wanted: 0, hidden: 0, camYaw: -.6, camPitch: .22, lastLook: -9, mission: null, wp: null, banner: null, endT: 0, free: false, district: '', distT: 0, deadT: 0, deadKind: '', sprayCD: 0, copT: 0, gps: [], gpsT: 0, gpsKey: '', envT: -99, started: false, lockWanted: false };
  const P = { kind: 'player', x: PL.prison.x, y: 2, z: PL.prison.z + 12, vy: 0, a: 0, hp: 100, armor: 0, weapon: 'fist', cool: 0, walk: 0, anim: 0, onGround: true, swim: false, veh: null, aiming: false, punchT: 0, look: { skin: '#c99068', shirt: '#5a3a26', pants: '#2a3550', hair: '#141010', vest: '#3a2418' } };
  P.mesh = makeHuman(P.look);
  let V = [], peds = [], pickups = [], toasts = [];
  let uid = 1;
  const heli = { on: false, x: 0, y: 60, z: 0, a: 0, cool: 2, mesh: null, beam: null };
  function toast(s, col, dur) { toasts.push({ s, col: col || '#fff', t: dur || 2.6 }); if (toasts.length > 4) toasts.shift(); }
  const WEAP = { fist: { dmg: 16, cd: .4, range: 2 }, pistol: { dmg: 24, cd: .3, range: 110, spread: .012, snd: 'pistol' }, smg: { dmg: 13, cd: .085, range: 90, spread: .03, snd: 'smg' }, rifle: { dmg: 34, cd: .16, range: 180, spread: .008, snd: 'rifle' } };
  const WORDER = ['fist', 'pistol', 'smg', 'rifle'];

  function mkVeh(type, x, z, a, o) {
    const sp = VSPEC[type]; o = o || {};
    const col = o.col || (type === 'taxi' ? '#f6c90e' : type === 'police' ? '#f4f6f8' : type === 'harun' ? '#121418' : type === 'heli' ? '#2a3d5c' : type === 'boat' ? '#f4f4f4' : CAR_COLS[Math.floor(Math.random() * CAR_COLS.length)]);
    const v = Object.assign({ id: uid++, type, kind: sp.kind, x, z, y: sp.kind === 'boat' ? 0 : groundAt(x, z, o.y).h, vx: 0, vz: 0, vy: 0, a, steer: 0, thr: 0, hb: false, up: 0, hp: sp.hp, maxHp: sp.hp, driver: null, ai: 'idle', from: null, to: null, col, fire: 0, dead: false, deadT: 0, sink: 0, stuck: 0, rev: 0, cruise: 9 + Math.random() * 5, block: 0, honk: 0, siren: false, crew: 0, pitch: 0, roll: 0, rotor: 0 }, o);
    v.col = col; v.mesh = makeVehicle(type === 'harun' ? 'sedan' : type, col); v.mesh.rotation.order = 'YZX';
    V.push(v); return v;
  }
  function mkPed(x, z, kind, o) {
    const lk = looks();
    if (kind === 'cop') Object.assign(lk, { shirt: '#25406e', pants: '#1a2440', hat: 'cop', vest: '#1a1d22' });
    if (kind === 'gang') Object.assign(lk, { shirt: '#2a2a2a', pants: '#1e1e22', hat: 'cap', vest: '#7a1f1f' });
    const p = Object.assign({ id: uid++, kind, x, z, y: groundAt(x, z).h, a: Math.random() * TAU, vx: 0, vz: 0, hp: kind === 'cop' ? 70 : kind === 'gang' ? 60 : 40, walk: Math.random() * 9, anim: 1, dir: Math.floor(Math.random() * 4), flee: 0, cool: 1 + Math.random(), weapon: kind === 'civ' ? 'fist' : 'pistol', look: lk, dead: false, deadT: 0, cuff: 0, aiming: false }, o || {});
    p.mesh = makeHuman(p.look); peds.push(p); return p;
  }
  function removeMesh(m) { scene.remove(m); }

  /* ---------- traffic, pedestrians, parked vehicles ---------- */
  const laneT = v => { const dx = v.to.x - v.from.x, dz = v.to.z - v.from.z, len = Math.hypot(dx, dz) || 1, ux = dx / len, uz = dz / len, nx = -uz, nz = ux, ox = v.from.x + nx * 3.4, oz = v.from.z + nz * 3.4; const s0 = (v.x - ox) * ux + (v.z - oz) * uz, s = clamp(s0 + 11, 0, len); return { x: ox + ux * s, z: oz + uz * s, rem: len - s0 }; };
  let copField = null, copFieldT = 0;
  function nodeField(tx, tz) { const start = nn(tx, tz), d = new Map([[start, 0]]), q = [start]; while (q.length) { const n = q.shift(), dn = d.get(n); for (const m of n.n) { const w = dn + Math.hypot(m.x - n.x, m.z - n.z); if (!d.has(m) || d.get(m) > w + 1) { d.set(m, w); q.push(m); } } } return d; }
  function nextNode(v, mode) {
    const opts = v.to.n.filter(n => n !== v.from), list = opts.length ? opts : v.to.n; let nx;
    const tgt = P.veh || P;
    if (mode === 'flee') nx = list.map(n => ({ n, s: Math.hypot(n.x - tgt.x, n.z - tgt.z) + Math.random() * 200 })).sort((a, b) => b.s - a.s)[0].n;
    else if (mode === 'cop' && copField) nx = list.slice().sort((a, b) => (copField.get(a) ?? 1e9) - (copField.get(b) ?? 1e9))[0];
    else nx = list[Math.floor(Math.random() * list.length)];
    v.from = v.to; v.to = nx;
  }
  const CAP = () => HIGH() ? { cars: 22, peds: 26 } : { cars: 12, peds: 12 };
  function spawnTraffic() {
    if (V.filter(v => v.ai === 'traffic').length >= CAP().cars) return;
    const ref = P.veh || P;
    const near = Wd.nodes.filter(n => { const d = Math.hypot(n.x - ref.x, n.z - ref.z); return d > 60 && d < 320; }); if (!near.length) return;
    for (let k = 0; k < 6; k++) {
      const a = near[Math.floor(Math.random() * near.length)], b = a.n[Math.floor(Math.random() * a.n.length)];
      const s = .2 + Math.random() * .6, dx = b.x - a.x, dz = b.z - a.z, len = Math.hypot(dx, dz), x = lerp(a.x, b.x, s) - dz / len * 3.4, z = lerp(a.z, b.z, s) + dx / len * 3.4, d = Math.hypot(x - ref.x, z - ref.z);
      if (d < 90 || d > 300) continue;
      if (V.some(o => Math.hypot(o.x - x, o.z - z) < 12)) continue;
      const g = groundAt(x, z); if (g.br && g.br.b.big && g.h > 10 && Math.random() < .5) continue;
      const rr = Math.random(), type = rr < .45 ? 'sedan' : rr < .7 ? 'taxi' : rr < .82 ? 'van' : rr < .95 ? 'sports' : 'police';
      const v = mkVeh(type, x, z, Math.atan2(dz, dx), { ai: 'traffic', driver: type === 'police' ? 'cop' : 'npc', from: a, to: b, crew: type === 'police' ? 2 : 0 });
      v.y = groundAt(x, z, g.h).h; v.vx = Math.cos(v.a) * 6; v.vz = Math.sin(v.a) * 6; return;
    }
  }
  const parked = [{ ...PL.boat1, type: 'boat', a: -Math.PI / 2 }, { ...PL.boat2, type: 'boat', a: Math.PI / 2 }, { ...PL.boat3, type: 'boat', a: -Math.PI / 2 }, { x: LANDMARKS.helipad.x, z: LANDMARKS.helipad.z, type: 'heli', a: 0 }, { x: LANDMARKS.helipad2.x, z: LANDMARKS.helipad2.z, type: 'heli', a: Math.PI }, { x: PL.prison.x + 9, z: PL.prison.z - 9, type: 'sedan', a: 0 }];
  function spawnParked() {
    const ref = P.veh || P;
    for (const sp of parked) {
      if (sp.v && (sp.v.dead || !V.includes(sp.v) || sp.v.driver)) sp.v = null;
      const d = Math.hypot(sp.x - ref.x, sp.z - ref.z);
      if (!sp.v && d < 400 && !sp.cool) { sp.v = mkVeh(sp.type, sp.x, sp.z, sp.a, { ai: 'parked' }); sp.cool = 1; }
      if (d > 600) { if (sp.v && sp.v.ai === 'parked') { killVeh(sp.v); sp.v = null; } sp.cool = 0; }
    }
  }
  function spawnPeds() {
    if (peds.filter(p => p.kind === 'civ' && !p.dead).length >= CAP().peds) return;
    const ref = P.veh || P;
    for (let k = 0; k < 14; k++) {
      const ang = Math.random() * TAU, d = 45 + Math.random() * 110, x = ref.x + Math.cos(ang) * d, z = ref.z + Math.sin(ang) * d, kk = cellK(x, z);
      if (kk < 0 || Wd.road[kk] !== 1 || Wd.water[kk] || Wd.solidH[kk] > 0 || Wd.bridgeM[kk]) continue;
      mkPed(x, z, 'civ'); return;
    }
  }
  function killVeh(v) { removeMesh(v.mesh); V = V.filter(o => o !== v); }
  function despawn() {
    const ref = P.veh || P;
    for (const v of V.slice()) { if (v.tag || v === P.veh || v.ai === 'parked') continue; const d = Math.hypot(v.x - ref.x, v.z - ref.z); if (d > 380 || (v.dead && v.deadT > 30) || v.sink > 6) killVeh(v); }
    for (const p of peds.slice()) { if (p.tag) continue; const d = Math.hypot(p.x - ref.x, p.z - ref.z); if (d > 240 || (p.dead && p.deadT > 25) || p.gone) { removeMesh(p.mesh); peds = peds.filter(o => o !== p); } }
  }

  /* ---------- ferries and gulls ---------- */
  const FERRY_ROUTES = [[{ x: bxz(320) - 92, z: 320 }, { x: bxz(700) + 92, z: 700 }], [{ x: bxz(-90) - 92, z: -90 }, { x: bxz(360) + 92, z: 360 }], [{ x: bxz(-640) - 92, z: -640 }, { x: bxz(-560) + 92, z: -560 }]];
  const ferries = FERRY_ROUTES.map((r, i) => ({ r, t: i * .3, dir: 1, wait: 0, mesh: ferryModel(), x: r[0].x, z: r[0].z, a: 0 }));
  const gulls = []; { const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, -.3, 0, -.9, .25, .05, 0, 0, 0, 0, -.3, 0, .9, .25, .05, 0], 3)); gg.computeVertexNormals(); for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(gg, new THREE.MeshBasicMaterial({ color: 0xf4f4f4, side: THREE.DoubleSide })); scene.add(m); gulls.push({ m, ph: Math.random() * TAU, r: 20 + Math.random() * 40, h: 18 + Math.random() * 20, cx: bxz(200), cz: 200 + Math.random() * 300 }); } }
  function stepFerries(dt) {
    for (const f of ferries) {
      const A = f.r[0], B = f.r[1], L2 = Math.hypot(B.x - A.x, B.z - A.z);
      if (f.wait > 0) { f.wait -= dt; if (f.wait <= 0 && Math.hypot(f.x - (P.veh || P).x, f.z - (P.veh || P).z) < 260) audio.sfx('ferry', .6); }
      else { f.t += f.dir * dt * 9 / L2; if (f.t >= 1 || f.t <= 0) { f.t = clamp(f.t, 0, 1); f.dir *= -1; f.wait = 10; } }
      const e = smooth(f.t); f.x = lerp(A.x, B.x, e); f.z = lerp(A.z, B.z, e); const ta = Math.atan2(B.z - A.z, B.x - A.x); f.a = ta;
      f.mesh.position.set(f.x, .2 + Math.sin(S.t + f.t * 9) * .08, f.z); f.mesh.rotation.y = -f.a;
      for (const o of [P].concat(V)) { if ((o === P && P.veh) || (o.kind && o.kind !== 'boat' && o !== P)) continue; const dx = o.x - f.x, dz = o.z - f.z, lx = dx * Math.cos(-f.a) - dz * Math.sin(-f.a), lz = dx * Math.sin(-f.a) + dz * Math.cos(-f.a); if (Math.abs(lx) < 18 && Math.abs(lz) < 5.5 && (o.y || 0) < 5) { const push = Math.sign(lz || 1) * (5.5 - Math.abs(lz)); o.x += -Math.sin(f.a) * push * .5 * 0 + Math.cos(f.a + Math.PI / 2) * push * .6; o.z += Math.sin(f.a + Math.PI / 2) * push * .6; if (o.kind === 'boat' && Math.hypot(o.vx, o.vz) > 6) { hurtVeh(o, 4); o.vx *= -.3; o.vz *= -.3; } } }
    }
    const ref = P.veh || P;
    for (const g of gulls) { g.ph += dt * .5; if (Math.hypot(g.cx - ref.x, g.cz - ref.z) > 400) { g.cx = ref.x + (Math.random() - .5) * 200; g.cz = ref.z + (Math.random() - .5) * 200; } const x = g.cx + Math.cos(g.ph) * g.r, z = g.cz + Math.sin(g.ph) * g.r; g.m.position.set(x, g.h + Math.sin(g.ph * 3) * 2, z); g.m.rotation.y = -g.ph - Math.PI / 2; g.m.scale.y = 1 + Math.sin(S.t * 8 + g.ph * 5) * .6; }
    if (Math.random() < dt * .08 && Wd.isWater(ref.x + 30, ref.z)) audio.sfx('gull', .5);
  }

  /* ---------- damage, explosions, crime ---------- */
  function blood(x, y, z, n, big) { for (let i = 0; i < n; i++) emit(fxS, x, y, z, (Math.random() - .5) * 5, Math.random() * 4, (Math.random() - .5) * 5, .7, .55, .02, .04); if (big !== false) decal(x + (Math.random() - .5) * .6, z + (Math.random() - .5) * .6, big ? 1 + Math.random() * .6 : .35 + Math.random() * .3); }
  function crime(level, force) {
    const ref = P.veh || P;
    const near = peds.some(p => p.kind === 'cop' && !p.dead && Math.hypot(p.x - ref.x, p.z - ref.z) < 80) || V.some(v => (v.type === 'police' || v.type === 'pboat') && v.driver && Math.hypot(v.x - ref.x, v.z - ref.z) < 90);
    if (!force && !near && Math.random() < .55) return;
    if (level > S.wanted) S.wanted = Math.min(5, level); S.hidden = 0;
  }
  function setWanted(n) { S.wanted = n; S.hidden = 0; if (!n) { heli.on = false; for (const v of V) if (v.ai === 'cop') { v.ai = v.kind === 'boat' ? 'idle' : 'traffic'; v.siren = false; v.to = null; } } }
  function hurtPed(p, dmg, src, ax, az) {
    if (p.dead) return;
    if (p === P && P.armor > 0) { const ab = Math.min(P.armor, dmg * .7); P.armor -= ab; dmg -= ab; }
    p.hp -= dmg; blood(p.x, p.y + 1.2, p.z, 4 + dmg / 5, false);
    if (ax != null) { p.vx += ax * dmg * .12; p.vz += az * dmg * .12; }
    if (p === P) { audio.sfx('hurt', .6); S.shake = Math.max(S.shake || 0, .3); if (P.hp <= 0) die('flat'); return; }
    p.flee = 6; p.fleeFrom = src ? { x: src.x, z: src.z } : null;
    if (p.hp <= 0) {
      p.dead = true; p.deadT = 0; blood(p.x, p.y + .4, p.z, 10, true); if (Math.random() < .5) audio.sfx('scream', .4);
      if (src === P || src === P.veh) {
        if (p.kind === 'cop') crime(Math.min(5, S.wanted + 1), true); else if (p.kind === 'civ') crime(Math.max(1, Math.min(2, S.wanted + (Math.random() < .3 ? 1 : 0))));
        if (p.kind !== 'cop' || Math.random() < .5) addPickup(p.x + .8, p.z, 'cash', p.kind === 'gang' ? 60 + Math.floor(Math.random() * 80) : 5 + Math.floor(Math.random() * 40), 30);
        if (p.kind === 'gang' && Math.random() < .5) addPickup(p.x - .8, p.z, 'pistol', 12, 30);
      }
    } else if (src === P && p.kind === 'cop') crime(Math.max(2, S.wanted), true);
  }
  function hurtVeh(v, dmg, src) {
    if (v.dead) return;
    if (v.boss && src === P) dmg *= 2.4;
    v.hp -= dmg;
    if (src === P && v.ai === 'cop') crime(Math.max(2, S.wanted), true);
    if (v.hp <= 0 && !v.fire) { v.fire = 3.5; if (v === P.veh) toast(L.burning, '#ff7a3a', 3); }
  }
  function explode(x, y, z, src) {
    audio.sfx('boom'); S.shake = Math.max(S.shake || 0, 1.2);
    for (let i = 0; i < 60; i++) { const a = Math.random() * TAU, s = 4 + Math.random() * 14; emit(i % 3 ? fxG : fxB, x, y + 1, z, Math.cos(a) * s, 3 + Math.random() * 8, Math.sin(a) * s, .7 + Math.random() * .8, i % 3 ? 1 : .25, i % 3 ? .55 + Math.random() * .3 : .25, i % 3 ? .15 : .26, i % 3 ? 2 : -1); }
    decal(x, z, 4, 0x111111); flash.position.set(x, y + 3, z); flash.intensity = 60; flash.distance = 60;
    for (const p of peds.concat([P])) { if (p === P && P.veh) continue; const d = Math.hypot(p.x - x, p.z - z); if (d < 12) hurtPed(p, 90 * (1 - d / 12) + 10, src, (p.x - x) / (d || 1), (p.z - z) / (d || 1)); }
    for (const v of V) { if (v.dead) continue; const d = Math.hypot(v.x - x, v.z - z); if (d < 11 && d > .1) { hurtVeh(v, 60 * (1 - d / 11), src); v.vx += (v.x - x) / d * 8; v.vz += (v.z - z) / d * 8; v.vy += 4; } }
    if (P.veh && Math.hypot(P.veh.x - x, P.veh.z - z) < 11 && P.veh.dead) { exitVeh(true); hurtPed(P, 100, null); }
  }

  /* ---------- line of sight and shooting ---------- */
  function los(x1, y1, z1, x2, y2, z2) { const d = Math.hypot(x2 - x1, z2 - z1), n = Math.ceil(d / 3); for (let i = 1; i < n; i++) { const t = i / n, x = lerp(x1, x2, t), z = lerp(z1, z2, t), y = lerp(y1, y2, t), k = cellK(x, z); if (Wd.solidTop(x, z) > y) return false; } return true; }
  function rayHit(ox, oy, oz, dx, dy, dz, range, skip) {
    let best = range, hitP = null, hitV = null;
    const dd = dx * dx + dz * dz || 1e-6;
    for (const p of peds.concat(P.veh ? [] : [P])) {
      if (p === skip || p.dead) continue;
      const t = ((p.x - ox) * dx + (p.z - oz) * dz) / dd; if (t <= 0 || t > best) continue;
      const cx = ox + dx * t - p.x, cz = oz + dz * t - p.z, y = oy + dy * t, top = p.swim ? .4 : 1.9, bot = p.swim ? -.6 : 0;
      if (cx * cx + cz * cz < .5 * .5 && y > p.y + bot && y < p.y + top) { best = t; hitP = p; hitV = null; }
    }
    for (const v of V) {
      if (v === skip || v === (skip && skip.veh) || v.dead) continue;
      const sp = VSPEC[v.type], ca = Math.cos(-v.a), sa = Math.sin(-v.a), lx = (ox - v.x) * ca - (oz - v.z) * sa, lz = (ox - v.x) * sa + (oz - v.z) * ca, ldx = dx * ca - dz * sa, ldz = dx * sa + dz * ca;
      let t0 = 0, t1 = best;
      for (const [o, d, h] of [[lx, ldx, sp.L / 2], [lz, ldz, sp.W / 2]]) { if (Math.abs(d) < 1e-6) { if (Math.abs(o) > h) { t0 = 1; t1 = 0; } continue; } let a = (-h - o) / d, b = (h - o) / d; if (a > b) [a, b] = [b, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, b); }
      if (t0 < t1 && t0 > 0) { const y = oy + dy * t0, top = v.kind === 'heli' ? 3.2 : v.type === 'van' ? 2.4 : 1.8; if (y > v.y - .3 && y < v.y + top) { best = t0; hitV = v; hitP = null; } }
    }
    let wall = false;
    for (let t = 1; t < best; t += 1) { const x = ox + dx * t, y = oy + dy * t, z = oz + dz * t, k = cellK(x, z); if (k < 0) break; if (Wd.solidTop(x, z) > y || y < groundAt(x, z, y).h - .1) { best = t; hitP = hitV = null; wall = true; break; } }
    return { t: best, p: hitP, v: hitV, wall, x: ox + dx * best, y: oy + dy * best, z: oz + dz * best };
  }
  function tracer(x1, y1, z1, x2, y2, z2) { tracers.push({ a: [x1, y1, z1], b: [x2, y2, z2], t: .06 }); if (tracers.length > 60) tracers.shift(); }
  function shootFrom(sh, ox, oy, oz, dx, dy, dz, wk) {
    const w = WEAP[wk];
    if (wk !== 'fist') { audio.sfx(w.snd, sh === P ? 1 : .5); events.push({ x: sh.x, z: sh.z, t: 1 }); if (sh === P) crime(1); }
    if (wk === 'fist') {
      audio.sfx('punch', .5); if (sh === P) P.punchT = .25;
      for (const p of peds.concat([P])) { if (p === sh || p.dead) continue; const d = Math.hypot(p.x - sh.x, p.z - sh.z); if (d < 1.8 && Math.abs(angDiff(sh.a, Math.atan2(p.z - sh.z, p.x - sh.x))) < 1) { hurtPed(p, w.dmg, sh, Math.cos(sh.a), Math.sin(sh.a)); if (sh === P && p.kind === 'cop') crime(Math.max(1, S.wanted), true); return; } }
      return;
    }
    const sp2 = w.spread; dx += (Math.random() - .5) * sp2 * 2; dy += (Math.random() - .5) * sp2 * 2; dz += (Math.random() - .5) * sp2 * 2;
    const n = Math.hypot(dx, dy, dz); dx /= n; dy /= n; dz /= n;
    const h = rayHit(ox, oy, oz, dx, dy, dz, w.range, sh);
    if (h.p) hurtPed(h.p, w.dmg, sh, dx, dz);
    else if (h.v) { hurtVeh(h.v, w.dmg * .45, sh); for (let i = 0; i < 4; i++) emit(fxS, h.x, h.y, h.z, (Math.random() - .5) * 6, Math.random() * 4, (Math.random() - .5) * 6, .25, 1, .85, .4); if (h.v === P.veh) hurtPed(P, w.dmg * .15, sh); }
    else if (h.wall || h.t < w.range) { for (let i = 0; i < 3; i++) emit(fxS, h.x, h.y, h.z, (Math.random() - .5) * 4, Math.random() * 3, (Math.random() - .5) * 4, .2, .9, .85, .7); }
    const mx = sh === P ? P.x + Math.cos(P.a) * .5 : ox, mz = sh === P ? P.z + Math.sin(P.a) * .5 : oz, my = sh === P ? P.y + 1.45 : oy;
    tracer(mx, my, mz, h.x, h.y, h.z);
    if (sh === P) { flash.position.set(mx, my, mz); flash.intensity = 8; flash.distance = 14; }
  }
  let events = [];

  /* ---------- vehicles ---------- */
  function vehHits(v, x, z) {
    const sp = VSPEC[v.type], ca = Math.cos(v.a), sa = Math.sin(v.a), hl = sp.L / 2 - .2, hw = sp.W / 2 - .15;
    for (const [u, w] of [[hl, hw], [hl, -hw], [-hl, hw], [-hl, -hw], [0, hw], [0, -hw], [hl, 0], [-hl, 0]]) {
      const px = x + u * ca - w * sa, pz = z + u * sa + w * ca, k = cellK(px, pz);
      if (k < 0) return true;
      if (v.kind === 'boat') { if (Wd.solidTop(px, pz) > .5) return true; const g = Wd.heightRaw(px, pz); if (g > -.35) return true; continue; }
      if (v.kind === 'heli') { if (Wd.solidTop(px, pz) > v.y + .3) return true; continue; }
      if (Wd.solidTop(px, pz) > v.y + .6) return true;
      const g = groundAt(px, pz, v.y); if (g.h - v.y > 1.4) return true;
    }
    return false;
  }
  function physVeh(v, dt) {
    const sp = VSPEC[v.type];
    if (v.kind === 'heli') return physHeli(v, dt, sp);
    if (v.sink > 0) { v.sink += dt; v.y = -v.sink * .7; v.vx *= .95; v.vz *= .95; v.x += v.vx * dt; v.z += v.vz * dt; if (Math.random() < dt * 20) emit(fxS, v.x, .1, v.z, (Math.random() - .5) * 2, 2, (Math.random() - .5) * 2, .6, .8, .9, 1); return; }
    if (v.dead) { v.vx *= Math.max(0, 1 - 3 * dt); v.vz *= Math.max(0, 1 - 3 * dt); v.thr = 0; }
    const ca = Math.cos(v.a), sa = Math.sin(v.a);
    let vf = v.vx * ca + v.vz * sa, vs = -v.vx * sa + v.vz * ca;
    const thr = v.dead ? 0 : v.thr, maxV = sp.maxV * (v.hp < sp.hp * .3 ? .75 : 1);
    const airborne = v.kind === 'car' && v.y > groundAt(v.x, v.z, v.y).h + .35;
    if (!airborne) {
      if (thr > 0) { vf += sp.acc * thr * dt * (vf < 0 ? 2.2 : 1); if (vf > maxV) vf = maxV; }
      else if (thr < 0) { if (vf > 1) vf -= sp.acc * 2 * -thr * dt; else { vf -= sp.acc * .6 * -thr * dt; if (vf < -maxV * .3) vf = -maxV * .3; } }
      else vf *= Math.max(0, 1 - (v.kind === 'boat' ? .5 : .7) * dt);
      if (v.hb) vf *= Math.max(0, 1 - 1.2 * dt);
      const grip = v.hb ? sp.grip * .2 : sp.grip; vs *= Math.max(0, 1 - grip * dt);
      v.a += v.steer * sp.turn * dt * clamp(vf / 7, -1, 1) * (v.hb ? 1.35 : 1);
    }
    const nca = Math.cos(v.a), nsa = Math.sin(v.a);
    v.vx = vf * nca - vs * nsa; v.vz = vf * nsa + vs * nca;
    let nx = v.x + v.vx * dt, nz = v.z + v.vz * dt, hit = 0;
    if (vehHits(v, nx, v.z)) { hit = Math.abs(v.vx); v.vx *= -.3; nx = v.x; }
    if (vehHits(v, nx, nz)) { hit = Math.max(hit, Math.abs(v.vz)); v.vz *= -.3; nz = v.z; }
    v.x = nx; v.z = nz;
    if (hit > 7) { hurtVeh(v, (hit - 7) * 2.2); audio.sfx('crash', clamp(hit / 30, .1, .9) * (v === P.veh ? 1 : .35)); if (v === P.veh) S.shake = Math.max(S.shake || 0, hit / 40); for (let i = 0; i < 6; i++) emit(fxS, v.x + nca * sp.L / 2, v.y + .6, v.z + nsa * sp.L / 2, (Math.random() - .5) * 6, Math.random() * 4, (Math.random() - .5) * 6, .3, 1, .8, .4); }
    if (v.kind === 'boat') {
      v.y = .05 + Math.sin(S.t * 2.2 + v.x * .1) * .1; v.pitch = clamp(vf / 60, -.05, .18) + Math.sin(S.t * 1.7 + v.z) * .03; v.roll = -v.steer * clamp(vf / 30, 0, 1) * .15;
      if (Math.abs(vf) > 6 && Math.random() < dt * 30) emit(fxS, v.x - nca * sp.L / 2, .3, v.z - nsa * sp.L / 2, (Math.random() - .5) * 3 - nca * 2, 1.5 + Math.random(), (Math.random() - .5) * 3 - nsa * 2, .6, .9, .95, 1);
    } else {
      const g = groundAt(v.x, v.z, v.y);
      if (v.y > g.h + .35) { v.vy -= 22 * dt; v.y += v.vy * dt; if (v.y <= g.h) { if (v.vy < -11) { hurtVeh(v, -v.vy * 2); audio.sfx('crash', .6); } v.y = g.h; v.vy = 0; } }
      else { const prev = v.y; v.y = g.h; v.vy = clamp((g.h - prev) / Math.max(dt, .001), -30, 30) * .4; }
      if (g.br) { const lim = g.br.b.w / 2 - 1.2; if (Math.abs(g.br.d) > lim) { const over = (Math.abs(g.br.d) - lim) * Math.sign(g.br.d), nX = -g.br.b.uz, nZ = g.br.b.ux; v.x -= nX * over; v.z -= nZ * over; const lat = v.vx * nX + v.vz * nZ; if (lat * Math.sign(g.br.d) > 0) { v.vx -= nX * lat * 1.4; v.vz -= nZ * lat * 1.4; if (Math.abs(lat) > 6) { hurtVeh(v, Math.abs(lat)); audio.sfx('crash', .4); } } } }
      const fh = groundAt(v.x + nca * sp.L * .4, v.z + nsa * sp.L * .4, v.y).h, bh = groundAt(v.x - nca * sp.L * .4, v.z - nsa * sp.L * .4, v.y).h;
      v.pitch = lerp(v.pitch, airborne ? v.pitch : Math.atan2(fh - bh, sp.L * .8), .3); v.roll = lerp(v.roll, -v.steer * clamp(vf / 30, 0, 1) * .05, .2);
      if (!g.br && Wd.heightRaw(v.x, v.z) < -.4 && v.y < .4) { v.sink = .01; audio.sfx('splash', v === P.veh ? 1 : .4); for (let i = 0; i < 30; i++) emit(fxS, v.x, .2, v.z, (Math.random() - .5) * 8, 4 + Math.random() * 5, (Math.random() - .5) * 8, .9, .85, .92, 1); if (v === P.veh) { toast(L.sinking, '#6bd0ff', 2.5); exitVeh(true); } v.driver = null; v.ai = 'idle'; }
      if (v.hb && Math.abs(vs) > 4 && Math.random() < .4 && !airborne) decal(v.x - nca * sp.L * .35, v.z - nsa * sp.L * .35, .25, 0x111111);
    }
    if (v.hp < sp.hp * .35 && Math.random() < dt * (v.hp < sp.hp * .15 ? 18 : 7)) emit(v.fire ? fxG : fxB, v.x + nca * sp.L * .35, v.y + 1.2, v.z + nsa * sp.L * .35, (Math.random() - .5), 1.5 + Math.random(), (Math.random() - .5), 1.4, v.fire ? 1 : .3, v.fire ? .5 : .3, v.fire ? .1 : .3, -1);
    if (v.fire > 0) { v.fire -= dt; if (v.fire <= 0 && !v.dead) { v.dead = true; v.deadT = 0; const d = v.driver; v.driver = null; if (v.kind === 'boat') v.sink = .01; explode(v.x, v.y, v.z, v.lastHit || null); void d; } }
    if (v.dead) v.deadT += dt;
  }
  function physHeli(v, dt, sp) {
    const on = v.driver === 'player' || v.driver === 'cop';
    v.rotor = clamp(v.rotor + (on ? dt * .6 : -dt * .3), 0, 1);
    const ca = Math.cos(v.a), sa = Math.sin(v.a), lift = v.rotor > .8;
    if (lift && !v.dead) { v.vx += ca * v.thr * sp.acc * dt; v.vz += sa * v.thr * sp.acc * dt; v.a += v.steer * sp.turn * dt; v.vy += (v.up * 12 - v.vy * 2) * dt; }
    else v.vy -= 12 * dt;
    v.vx *= Math.max(0, 1 - .55 * dt); v.vz *= Math.max(0, 1 - .55 * dt);
    const spd = Math.hypot(v.vx, v.vz); if (spd > sp.maxV) { v.vx *= sp.maxV / spd; v.vz *= sp.maxV / spd; }
    let nx = v.x + v.vx * dt, nz = v.z + v.vz * dt;
    if (vehHits(v, nx, nz)) { const s2 = Math.hypot(v.vx, v.vz); if (s2 > 8) { hurtVeh(v, s2 * 1.5); audio.sfx('crash', .7); } v.vx *= -.4; v.vz *= -.4; nx = v.x; nz = v.z; }
    v.x = clamp(nx, -HALF * 1.6, HALF * 1.6); v.z = clamp(nz, -HALF * 1.6, HALF * 1.6);
    const floor = Math.max(groundAt(v.x, v.z, v.y).h, Wd.solidTop(v.x, v.z), 0);
    v.y += v.vy * dt; if (v.y < floor) { if (v.vy < -9) { hurtVeh(v, -v.vy * 3); audio.sfx('crash', .8); } v.y = floor; v.vy = 0; v.vx *= .8; v.vz *= .8; }
    v.y = Math.min(v.y, 320);
    v.pitch = lerp(v.pitch, -v.thr * .22, .1); v.roll = lerp(v.roll, -v.steer * .18, .1);
    if (v.fire > 0) { v.fire -= dt; emit(fxG, v.x, v.y + 2, v.z, 0, 2, 0, .6, 1, .5, .1, -1); if (v.fire <= 0 && !v.dead) { v.dead = true; v.driver = null; explode(v.x, v.y, v.z, null); } }
    if (v.dead) { v.deadT += dt; v.rotor = 0; }
  }
  function vehCollisions() {
    const list = V.filter(v => v.kind !== 'heli' && Math.hypot(v.x - camera.position.x, v.z - camera.position.z) < 250);
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const A = list[i], B = list[j]; if (A.kind !== B.kind || Math.abs(A.y - B.y) > 2.5) continue;
      const sa = VSPEC[A.type], sb = VSPEC[B.type]; if (Math.abs(A.x - B.x) > 8 || Math.abs(A.z - B.z) > 8) continue;
      for (const fa of [-.27, .27]) for (const fb of [-.27, .27]) {
        const ax = A.x + Math.cos(A.a) * sa.L * fa, az = A.z + Math.sin(A.a) * sa.L * fa, bx = B.x + Math.cos(B.a) * sb.L * fb, bz = B.z + Math.sin(B.a) * sb.L * fb;
        const rr = sa.W * .55 + sb.W * .55, dx = bx - ax, dz = bz - az, d = Math.hypot(dx, dz); if (d >= rr || d < .01) continue;
        const nx = dx / d, nz = dz / d, ov = rr - d, ta = sb.hp / (sa.hp + sb.hp), tb = 1 - ta;
        A.x -= nx * ov * ta; A.z -= nz * ov * ta; B.x += nx * ov * tb; B.z += nz * ov * tb;
        const rv = (B.vx - A.vx) * nx + (B.vz - A.vz) * nz;
        if (rv < 0) { const imp = -rv * 1.3; A.vx -= nx * imp * ta; A.vz -= nz * imp * ta; B.vx += nx * imp * tb; B.vz += nz * imp * tb;
          if (imp > 6) { const dmg = (imp - 6) * 1.6; hurtVeh(A, dmg * ta * 2, B === P.veh ? P : null); hurtVeh(B, dmg * tb * 2, A === P.veh ? P : null); if (A === P.veh || B === P.veh) { audio.sfx('crash', clamp(imp / 30, .2, 1)); S.shake = Math.max(S.shake || 0, imp / 50); const o = A === P.veh ? B : A; if (o.ai === 'cop' && imp > 12) crime(Math.max(1, S.wanted), true); if (o.ai === 'traffic') o.angry = 4; } } }
      }
    }
  }
  function vehVsPeds(v) {
    const sp = VSPEC[v.type], spd = Math.hypot(v.vx, v.vz); if (spd < 2 || v.kind === 'heli') return;
    for (const p of peds.concat(P.veh ? [] : [P])) {
      if (p.dead || Math.abs(p.x - v.x) > 5 || Math.abs(p.z - v.z) > 5 || Math.abs(p.y - v.y) > 2) continue;
      const ca = Math.cos(-v.a), sa = Math.sin(-v.a), lx = (p.x - v.x) * ca - (p.z - v.z) * sa, lz = (p.x - v.x) * sa + (p.z - v.z) * ca;
      if (Math.abs(lx) > sp.L / 2 + .4 || Math.abs(lz) > sp.W / 2 + .4) continue;
      if (spd > 6) { hurtPed(p, spd * 2.4, v.driver === 'player' ? P : null, v.vx / spd, v.vz / spd); p.vx += v.vx * .7; p.vz += v.vz * .7; p.vy = (p.vy || 0) + spd * .25; if (v === P.veh) { audio.sfx('punch', .8); v.vx *= .93; v.vz *= .93; } }
      else { const d = Math.hypot(p.x - v.x, p.z - v.z) || 1; p.x += (p.x - v.x) / d * .12; p.z += (p.z - v.z) / d * .12; }
    }
  }
  function steerTo(v, tx, tz, speed, dt) {
    const want = Math.atan2(tz - v.z, tx - v.x), diff = angDiff(v.a, want), vf = v.vx * Math.cos(v.a) + v.vz * Math.sin(v.a);
    if (v.rev > 0) { v.rev -= dt; v.thr = -1; v.steer = -Math.sign(diff || 1); v.hb = false; return; }
    v.steer = clamp(diff * 2.2, -1, 1);
    const target = speed * (Math.abs(diff) > 1 ? .4 : Math.abs(diff) > .4 ? .7 : 1);
    v.thr = vf < target - 1 ? 1 : vf > target + 3 ? -.6 : 0; v.hb = false;
    if (v.thr > 0 && Math.abs(vf) < 1.5) { v.stuck += dt; if (v.stuck > 1.2) { v.stuck = 0; v.rev = 1; } } else v.stuck = 0;
  }
  function aiTraffic(v, dt, mode) {
    if (!v.to) { const n = nn(v.x, v.z); v.from = n; v.to = n.n[Math.floor(Math.random() * n.n.length)] || n; if (v.to === n) return; }
    const lt = laneT(v);
    if (lt.rem < 5) nextNode(v, mode);
    let speed = mode === 'flee' ? VSPEC[v.type].maxV * .8 : mode === 'cop' ? VSPEC[v.type].maxV * (.75 + S.wanted * .04) : v.angry > 0 ? v.cruise * 1.6 : v.cruise;
    if (mode === 'traffic') {
      const ca = Math.cos(v.a), sa = Math.sin(v.a); let blocked = false;
      for (const o of V) { if (o === v || o.kind !== 'car' || Math.abs(o.y - v.y) > 3) continue; const dx = o.x - v.x, dz = o.z - v.z, f = dx * ca + dz * sa, s = Math.abs(-dx * sa + dz * ca); if (f > 1 && f < 10 && s < 2.2) { blocked = true; if (o === P.veh) v.block += dt; break; } }
      if (!blocked) for (const p of peds.concat(P.veh ? [] : [P])) { if (p.dead) continue; const dx = p.x - v.x, dz = p.z - v.z, f = dx * ca + dz * sa, s = Math.abs(-dx * sa + dz * ca); if (f > 1 && f < 8 && s < 1.8 && Math.abs(p.y - v.y) < 2) { blocked = true; if (p === P) v.block += dt; break; } }
      if (blocked) { speed = 0; if (v.block > 1.6 && v.honk <= 0) { v.honk = 3; if (Math.hypot(v.x - P.x, v.z - P.z) < 60) audio.sfx('horn', .3); } } else v.block = 0;
      v.honk -= dt; v.angry = (v.angry || 0) - dt;
    }
    if (speed === 0) { v.thr = (v.vx * Math.cos(v.a) + v.vz * Math.sin(v.a)) > .5 ? -1 : 0; v.steer = 0; v.stuck = 0; return; }
    steerTo(v, lt.x, lt.z, speed, dt);
  }
  function aiCop(v, dt) {
    const tgt = P.veh || P, d = Math.hypot(tgt.x - v.x, tgt.z - v.z);
    if (!S.wanted) { v.ai = 'traffic'; v.siren = false; v.to = null; return; }
    if (v.kind === 'boat') { if (!(P.swim || (P.veh && P.veh.kind === 'boat'))) { v.thr = 0; return; } steerTo(v, tgt.x, tgt.z, 24, dt); if (d < 30 && v.cool <= 0 && S.wanted >= 2) { v.cool = .9; npcShoot({ x: v.x, y: v.y + 1.6, z: v.z, a: v.a }, 'smg'); } v.cool = (v.cool || 0) - dt; return; }
    if (!P.veh && d < 22 && v.crew > 0) { v.thr = -1; v.steer = 0; if (Math.hypot(v.vx, v.vz) < 2) { for (let i = 0; i < v.crew; i++) { const s = i ? 1 : -1; mkPed(v.x - Math.sin(v.a) * 2 * s, v.z + Math.cos(v.a) * 2 * s, 'cop', { myCar: v }); } v.crew = 0; v.driver = null; v.ai = 'idle'; } return; }
    if (d < 140 && los(v.x, v.y + 1, v.z, tgt.x, (tgt.y || 0) + 1, tgt.z) && Math.abs((tgt.y || 0) - v.y) < 6) steerTo(v, tgt.x + (tgt.vx || 0) * .5, tgt.z + (tgt.vz || 0) * .5, VSPEC[v.type].maxV * (.75 + S.wanted * .04), dt);
    else aiTraffic(v, dt, 'cop');
    if (d < 14 && P.veh) v.thr = 1;
  }

  /* ---------- people ---------- */
  function walkable(x, z, y, swimOK) { const k = cellK(x, z); if (k < 0) return false; if (Wd.solidTop(x, z) > y + .5) return false; const g = groundAt(x, z, y); if (g.h - y > (swimOK ? 1.6 : .9)) return false; return true; }
  function moveP(p, dx, dz) { if (walkable(p.x + dx, p.z, p.y, p.swim)) p.x += dx; else p.blocked = 1; if (walkable(p.x, p.z + dz, p.y, p.swim)) p.z += dz; else p.blocked = 1; }
  function vertical(p, dt) {
    const g = groundAt(p.x, p.z, p.y + .5), raw = Wd.heightRaw(p.x, p.z);
    const inWater = !g.br && raw < -.3;
    p.vy = (p.vy || 0) - 20 * dt; p.y += p.vy * dt;
    if (inWater && p.y < .1) { if (!p.swim) { p.swim = true; audio.sfx('splash', p === P ? .8 : .3); for (let i = 0; i < 14; i++) emit(fxS, p.x, .1, p.z, (Math.random() - .5) * 4, 2 + Math.random() * 3, (Math.random() - .5) * 4, .7, .85, .92, 1); } p.y = lerp(p.y, -.55, .2); p.vy = 0; p.onGround = false; return; }
    p.swim = false;
    if (p.y <= g.h) { if (p.vy < -15 && p === P) hurtPed(P, (-p.vy - 15) * 6, null); p.y = g.h; p.vy = 0; p.onGround = true; }
    else p.onGround = p.y - g.h < .05;
  }
  const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  function pedUpdate(p, dt) {
    if (p.dead) { p.deadT += dt; p.x += p.vx * dt; p.z += p.vz * dt; p.vx *= .9; p.vz *= .9; vertical(p, dt); return; }
    p.cool -= dt;
    if (p.vx || p.vz) { moveP(p, p.vx * dt, p.vz * dt); p.vx *= Math.max(0, 1 - 6 * dt); p.vz *= Math.max(0, 1 - 6 * dt); if (Math.abs(p.vx) + Math.abs(p.vz) < .1) p.vx = p.vz = 0; }
    vertical(p, dt);
    const tgt = P.veh || P, dP = Math.hypot(tgt.x - p.x, tgt.z - p.z);
    p.anim = 0;
    if (p.kind === 'cop' || p.kind === 'gang') {
      const hostile = p.kind === 'gang' || S.wanted > 0;
      if (!hostile) { if (p.myCar && !p.myCar.dead) { const d = Math.hypot(p.myCar.x - p.x, p.myCar.z - p.z); if (d < 2.5) { p.myCar.crew = (p.myCar.crew || 0) + 1; p.myCar.driver = 'cop'; p.myCar.ai = 'traffic'; p.myCar.to = null; p.gone = true; return; } walkTo(p, p.myCar.x, p.myCar.z, 4, dt); } else wander(p, dt); return; }
      if (p.kind === 'gang' && dP > 70) { wander(p, dt); return; }
      const see = dP < 90 && los(p.x, p.y + 1.6, p.z, tgt.x, (tgt.y || 0) + 1, tgt.z);
      p.a = Math.atan2(tgt.z - p.z, tgt.x - p.x); p.aiming = see;
      const armed = p.kind === 'gang' || S.wanted >= 2;
      if (dP > (armed ? 14 : 1.2) || !see) walkTo(p, tgt.x, tgt.z, p.kind === 'cop' ? 5.2 : 4.6, dt);
      if (armed && see && p.cool <= 0) { p.cool = p.kind === 'gang' ? .9 + Math.random() * .7 : 1.1 + Math.random() * .8; npcShoot(p, 'pistol'); }
      if (p.kind === 'cop' && !P.veh && !P.swim && dP < 1.7 && !P.dead) { p.cuff += dt; if (p.cuff > (S.wanted >= 3 ? 2.2 : 1.2)) busted(); } else p.cuff = Math.max(0, p.cuff - dt);
      if (p.kind === 'cop' && P.veh && P.veh.kind === 'car' && dP < 3.5 && Math.hypot(P.veh.vx, P.veh.vz) < 2) { p.cuff += dt; if (p.cuff > 1.6) busted(); }
      return;
    }
    for (const e of events) if (Math.hypot(e.x - p.x, e.z - p.z) < 45 && p.flee <= 0) { p.flee = 5 + Math.random() * 3; p.fleeFrom = { x: e.x, z: e.z }; if (Math.random() < .25) audio.sfx('scream', .2); }
    if (P.veh && P.veh.kind === 'car' && dP < 12) { const v = P.veh, sp = Math.hypot(v.vx, v.vz); if (sp > 12 && p.flee <= 0) { const ca = Math.cos(v.a), sa = Math.sin(v.a), dx = p.x - v.x, dz = p.z - v.z; if (dx * ca + dz * sa > 0 && Math.abs(-dx * sa + dz * ca) < 3) { const s = (-dx * sa + dz * ca) >= 0 ? 1 : -1; p.vx += -sa * s * 9; p.vz += ca * s * 9; } } }
    if (p.flee > 0) { p.flee -= dt; const f = p.fleeFrom || tgt, a = Math.atan2(p.z - f.z, p.x - f.x) + Math.sin(S.t * 2 + p.id) * .4; p.a = a; moveP(p, Math.cos(a) * 5.5 * dt, Math.sin(a) * 5.5 * dt); p.walk += dt * 12; p.anim = 1.3; if (p.blocked) { p.fleeFrom = { x: p.x + (Math.random() - .5) * 20, z: p.z + (Math.random() - .5) * 20 }; p.blocked = 0; } return; }
    wander(p, dt);
  }
  function wander(p, dt) {
    if (p.swim) { const s = nn(p.x, p.z); walkTo(p, s.x, s.z, 1.5, dt); return; }
    const [dx, dz] = DIRS[p.dir], ahead = cellK(p.x + dx * 2, p.z + dz * 2);
    const ok = k => k >= 0 && Wd.road[k] === 1 && !Wd.water[k] && Wd.solidH[k] === 0;
    if (!ok(ahead) || Math.random() < dt * .05) { const o = [0, 1, 2, 3].filter(d => d !== (p.dir + 2) % 4 && ok(cellK(p.x + DIRS[d][0] * 2, p.z + DIRS[d][1] * 2))); p.dir = o.length ? o[Math.floor(Math.random() * o.length)] : (p.dir + 2) % 4; if (!ok(ahead)) return; }
    p.a = Math.atan2(dz, dx); moveP(p, dx * 1.4 * dt, dz * 1.4 * dt); p.walk += dt * 5; p.anim = .7;
  }
  function walkTo(p, tx, tz, sp, dt) { const a = Math.atan2(tz - p.z, tx - p.x); p.a = a; moveP(p, Math.cos(a) * sp * dt, Math.sin(a) * sp * dt); p.walk += dt * sp * 2.2; p.anim = 1; }
  function npcShoot(p, wk) {
    const tgt = P.veh || P, ty = (tgt.y || 0) + (P.veh ? .9 : 1.2), oy = p.y + 1.5;
    let dx = tgt.x - p.x, dy = ty - oy, dz = tgt.z - p.z; const d = Math.hypot(dx, dy, dz);
    const miss = (1 - clamp(1 - d / 90, 0, 1) * .7) * (P.anim > .5 ? 1.6 : 1) * .06 + (P.swim ? .03 : 0);
    dx /= d; dy /= d; dz /= d; dx += (Math.random() - .5) * miss * 2; dy += (Math.random() - .5) * miss; dz += (Math.random() - .5) * miss * 2;
    const tmp = WEAP[wk].spread; WEAP[wk].spread = 0; shootFrom(p, p.x + dx * .6, oy, p.z + dz * .6, dx, dy, dz, wk); WEAP[wk].spread = tmp;
  }

  /* ---------- entering and leaving vehicles ---------- */
  function enterVeh() {
    let best = null, bd = 1e9;
    for (const v of V) { if (v.dead || v.fire || v.sink) continue; const sp = VSPEC[v.type], d = Math.hypot(v.x - P.x, v.z - P.z), r = sp.L / 2 + 2.2; if (d < r && Math.abs(v.y - P.y) < 3 && d < bd) { bd = d; best = v; } }
    if (!best) return;
    if (best.driver && best.driver !== 'player') {
      const s = Math.sign(Math.sin(best.a) * (P.x - best.x) - Math.cos(best.a) * (P.z - best.z)) || 1;
      if (best.kind === 'car') { const dp = mkPed(best.x - Math.sin(best.a) * 2.2 * -s, best.z + Math.cos(best.a) * 2.2 * -s, best.driver === 'cop' ? 'cop' : 'civ'); dp.flee = best.driver === 'cop' ? 0 : 8; dp.fleeFrom = { x: P.x, z: P.z }; }
      if (best.driver === 'cop') { best.crew = 0; crime(Math.max(2, S.wanted), true); } else crime(1);
      audio.sfx('scream', .35);
    }
    if (best.ai === 'parked' && best.kind === 'car' && Math.random() < .3) crime(1);
    best.driver = 'player'; best.ai = 'player'; best.siren = false; P.veh = best; P.swim = false; P.mesh.visible = false; audio.sfx('door');
    for (const sp of parked) if (sp.v === best) sp.v = null;
    if (best.kind === 'car') { audio.radio(true); toast('📻 ' + (audio.station < audio.STATIONS.length ? audio.STATIONS[audio.station] : L.radioOff), '#ff9ad5', 2); }
  }
  function exitVeh(force) {
    const v = P.veh; if (!v) return;
    if (!force && Math.hypot(v.vx, v.vz) > 6 && v.kind !== 'heli') return;
    const sp = VSPEC[v.type]; let placed = false;
    for (const s of [1, -1]) { const x = v.x - Math.sin(v.a) * (sp.W / 2 + .9) * s, z = v.z + Math.cos(v.a) * (sp.W / 2 + .9) * s; if (walkable(x, z, v.y + .5, true)) { P.x = x; P.z = z; placed = true; break; } }
    if (!placed) { P.x = v.x; P.z = v.z; }
    P.y = v.y + .3; P.vy = 0; v.driver = null; v.ai = 'idle'; v.thr = 0; v.steer = 0; v.up = 0; P.veh = null; P.mesh.visible = true; audio.sfx('door'); audio.radio(false); audio.engine(null);
  }

  /* ---------- death and arrest ---------- */
  function die(kind) {
    if (S.mode !== 'play') return;
    if (P.veh) exitVeh(true);
    P.dead = true; S.mode = 'dead'; S.deadKind = kind; S.deadT = 0; audio.sfx(kind === 'flat' ? 'scream' : 'fail'); audio.radio(false); audio.engine(null);
    if (document.pointerLockElement) document.exitPointerLock();
    if (S.mission) failMission(kind === 'flat' ? L.fail.dead : L.fail.busted, true);
  }
  function busted() { if (S.mode === 'play') die('cuffed'); }
  function respawn() {
    const kind = S.deadKind;
    const spot = kind === 'flat' ? PL.hospitals.reduce((b, h) => Math.hypot(h.x - P.x, h.z - P.z) < Math.hypot(b.x - P.x, b.z - P.z) ? h : b) : { x: -20, z: 140 };
    const fee = Math.min(save.money, kind === 'flat' ? 100 + Math.floor(save.money * .05) : 150 + Math.floor(save.money * .08));
    save.money -= fee; toast(fmt(kind === 'flat' ? L.hosp : L.bail, { n: fee }), '#ff8a8a', 3);
    if (kind === 'cuffed') { save.ammo = { pistol: 0, smg: 0, rifle: 0 }; P.weapon = 'fist'; }
    P.x = spot.x; P.z = spot.z; P.y = groundAt(spot.x, spot.z).h; P.hp = 100; P.dead = false; P.vy = 0; P.swim = false; P.mesh.visible = true; setWanted(0);
    for (const v of V.filter(v => v.ai === 'cop')) killVeh(v); for (const p of peds.filter(p => p.kind === 'cop')) { removeMesh(p.mesh); } peds = peds.filter(p => p.kind !== 'cop');
    store(); S.mode = 'play';
  }

  /* ---------- pickups ---------- */
  const pickGeo = { cash: new THREE.BoxGeometry(.5, .25, .3), weapon: new THREE.BoxGeometry(.7, .18, .18), health: new THREE.BoxGeometry(.5, .5, .5), armor: new THREE.CylinderGeometry(.35, .3, .5, 8), package: new THREE.BoxGeometry(.8, .6, .8), briefcase: new THREE.BoxGeometry(.6, .45, .18) };
  const pickCol = { cash: '#3fd16a', pistol: '#ffd23a', smg: '#ffd23a', rifle: '#ffd23a', health: '#ff4f5e', armor: '#4fa3ff', package: '#c58bff', briefcase: '#ffcf3f' };
  function addPickup(x, z, k, v, life, fixed) {
    const geo = pickGeo[k] || pickGeo.weapon, m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: pickCol[k], emissive: pickCol[k], emissiveIntensity: .45, roughness: .4 }));
    scene.add(m); const pk = { x, z, k, v, t: life || 30, fixed: !!fixed, mesh: m, gone: false }; pickups.push(pk); return pk;
  }
  [[-260, 30, 'pistol', 24], [-700, 560, 'smg', 90], [480, 420, 'rifle', 30], [-200, 50, 'health', 50], [500, 905, 'health', 50], [-30, 150, 'armor', 50], [-60, -40, 'armor', 50], [bxz(-50) + 105, -50, 'cash', 300], [-900, 600, 'cash', 400], [600, 120, 'cash', 500]]
    .forEach(([x, z, k, v]) => addPickup(x, z, k, v, 0, true));
  function takePickup(pk) {
    if (pk.k === 'cash') { save.money += pk.v; toast(fmt(L.cash, { n: pk.v }), '#7dff8a', 1.6); audio.sfx('cash'); }
    else if (pk.k === 'health') { if (P.hp >= 100) return false; P.hp = Math.min(100, P.hp + pk.v); toast('+ ' + L.health, '#ff6b6b'); audio.sfx('pick'); }
    else if (pk.k === 'armor') { if (P.armor >= 100) return false; P.armor = Math.min(100, P.armor + pk.v); toast('+ ' + L.armor, '#6bb8ff'); audio.sfx('pick'); }
    else if (WEAP[pk.k]) { save.ammo[pk.k] = (save.ammo[pk.k] || 0) + pk.v; P.weapon = pk.k; toast(fmt(L.pick, { w: L.w[pk.k] }), '#ffd23a'); audio.sfx('pick'); }
    return true;
  }

  /* ---------- missions ---------- */
  const MS = [
    { start: { x: PL.prison.x, z: PL.prison.z + 12 }, steps: [{ t: 'say', k: 'b' }, { t: 'enterAny', o: 0 }, { t: 'goto', at: PL.garage, inCar: true, o: 1, r: 9 }, { t: 'say', k: 'e' }], pay: 500 },
    { start: PL.garageWalk, steps: [{ t: 'say', k: 'b' }, { t: 'spawn', tag: 'sport', type: 'sports', at: PL.bebek, a: -Math.PI / 2, col: '#f6c90e' }, { t: 'enter', tag: 'sport', o: 0, alarm: 1 }, { t: 'deliver', tag: 'sport', at: PL.garage, minHp: .5, o: 1 }, { t: 'say', k: 'e' }], pay: 1500 },
    { start: PL.karakoy, steps: [{ t: 'say', k: 'b' }, { t: 'collect', pts: PL.packages, time: 240, o: 0 }, { t: 'say', k: 'e' }], pay: 2000, debt: 10000 },
    { start: PL.karakoy, steps: [{ t: 'say', k: 'b' }, { t: 'spawn', tag: 'van', type: 'van', at: PL.hayd, a: 0, col: '#e8e2d0' }, { t: 'enter', tag: 'van', o: 0, wanted: 2 }, { t: 'lose', o: 1, tag: 'van' }, { t: 'deliver', tag: 'van', at: PL.ware, clean: true, o: 2 }, { t: 'say', k: 'e' }], pay: 3000, debt: 15000 },
    { start: PL.towerWalk, steps: [{ t: 'say', k: 'b' }, { t: 'spawn', tag: 'cem', type: 'sedan', at: PL.tower, a: 0, ai: 'chase', col: '#cfd6df', hp: 170 }, { t: 'chase', tag: 'cem', o: 0 }, { t: 'grab', o: 1 }, { t: 'say', k: 'e' }], pay: 4000 },
    { start: PL.garageWalk, steps: [{ t: 'say', k: 'b' }, { t: 'give', w: 'smg', n: 180 }, { t: 'gang', n: 6 }, { t: 'kill', o: 0 }, { t: 'say', k: 'e' }], pay: 4000 },
    { start: { x: -20, z: 140 }, steps: [{ t: 'say', k: 'b' }, { t: 'race', pts: PL.race, time: 150, o: 0 }, { t: 'say', k: 'e' }], pay: 5000, debt: 10000 },
    { start: PL.uskWalk, steps: [{ t: 'say', k: 'b' }, { t: 'wanted', n: 3 }, { t: 'spawn', tag: 'harun', type: 'harun', near: true, ai: 'chase', col: '#121418', hp: 260 }, { t: 'chase', tag: 'harun', o: 0 }, { t: 'wanted', n: 4 }, { t: 'goto', at: PL.kiz, o: 1, r: 14 }, { t: 'clear' }, { t: 'say', k: 'e' }], pay: 10000, debt: 15000 }
  ];
  function startMission(i) { const m = MS[i]; if (!m) return; S.mission = { i, si: -1, m, tags: {}, timer: null }; S.free = false; nextStep(); }
  function nextStep() {
    const MI = S.mission; if (!MI) return;
    MI.si++; MI.timer = null;
    const st = MI.m.steps[MI.si];
    if (!st) return passMission();
    const tx = L.ms[MI.i];
    if (st.t === 'say') { S.say = { lines: tx[st.k] || [], i: 0, t: 0 }; S.mode = 'say'; if (P.veh) P.veh.thr = 0; if (document.pointerLockElement) document.exitPointerLock(); return; }
    if (st.t === 'spawn') {
      let at = st.at, a = st.a || 0;
      if (st.near) { const ref = P.veh || P; const c = Wd.nodes.filter(n => { const d = Math.hypot(n.x - ref.x, n.z - ref.z); return d > 60 && d < 140 && Wd.heightRaw(n.x, n.z) > 0; }); const n = c[Math.floor(Math.random() * c.length)] || Wd.nodes[0]; at = n; a = Math.atan2(ref.z - n.z, ref.x - n.x); }
      const v = mkVeh(st.type, at.x, at.z, a, { tag: st.tag, ai: st.ai ? 'chase' : 'parked', driver: st.ai ? 'npc' : null, col: st.col });
      if (st.hp) v.hp = v.maxHp = st.hp;
      if (st.ai) { v.from = nn(at.x, at.z); v.to = v.from.n[0]; v.boss = true; }
      MI.tags[st.tag] = v; return nextStep();
    }
    if (st.t === 'wanted') { S.wanted = Math.max(S.wanted, st.n); S.hidden = 0; return nextStep(); }
    if (st.t === 'clear') { setWanted(0); for (const v of V.filter(v => v.ai === 'cop')) killVeh(v); return nextStep(); }
    if (st.t === 'give') { save.ammo[st.w] = (save.ammo[st.w] || 0) + st.n; P.weapon = st.w; toast(fmt(L.pick, { w: L.w[st.w] }), '#ffd23a'); return nextStep(); }
    if (st.t === 'gang') { MI.gang = []; let k = 0; while (MI.gang.length < st.n && k++ < 400) { const x = -700 + (Math.random() - .5) * 90, z = 500 + (Math.random() - .5) * 70; if (walkable(x, z, groundAt(x, z).h) && !Wd.isWater(x, z)) MI.gang.push(mkPed(x, z, 'gang', { tag: 'gang' })); } return nextStep(); }
    if (st.t === 'collect') { MI.items = st.pts.map(p => ({ x: p.x, z: p.z, got: false, mesh: addPickup(p.x, p.z, 'package', 0, 9999).mesh })); pickups = pickups.filter(pk => !MI.items.some(it => it.mesh === pk.mesh)); MI.timer = st.time; }
    if (st.t === 'race') { MI.cp = 0; MI.timer = st.time; }
    if (st.t === 'grab') { const v = MI.tags.cem; MI.brief = { x: v.x + 2, z: v.z + 1 }; MI.briefMesh = addPickup(MI.brief.x, MI.brief.z, 'briefcase', 0, 9999).mesh; pickups = pickups.filter(pk => pk.mesh !== MI.briefMesh); }
    S.mode = 'play';
  }
  function stepTarget() {
    const MI = S.mission; if (!MI) return null; const st = MI.m.steps[MI.si]; if (!st) return null;
    if (st.t === 'goto' || st.t === 'deliver') { if (st.t === 'deliver' && P.veh !== MI.tags[st.tag]) return MI.tags[st.tag]; return st.at; }
    if (st.t === 'enter' || st.t === 'chase') return MI.tags[st.tag];
    if (st.t === 'collect') { const ref = P.veh || P; return MI.items.filter(i => !i.got).sort((a, b) => Math.hypot(a.x - ref.x, a.z - ref.z) - Math.hypot(b.x - ref.x, b.z - ref.z))[0]; }
    if (st.t === 'race') return st.pts[MI.cp];
    if (st.t === 'grab') return MI.brief;
    if (st.t === 'kill') return MI.gang.filter(g => !g.dead)[0];
    return null;
  }
  function objText() {
    const MI = S.mission; if (!MI) return ''; const st = MI.m.steps[MI.si]; if (!st || st.o == null) return '';
    let s = L.ms[MI.i].o[st.o] || '';
    if (st.t === 'collect') s = fmt(s, { n: MI.items.filter(i => i.got).length });
    if (st.t === 'race') s = fmt(s, { n: MI.cp });
    if (st.t === 'kill') s = fmt(s, { n: MI.gang.filter(g => !g.dead).length });
    if (st.t === 'deliver' && st.clean && S.wanted) s = L.ms[MI.i].o[1];
    return s;
  }
  function missionTick(dt) {
    const MI = S.mission; if (!MI || S.mode !== 'play') return;
    const st = MI.m.steps[MI.si]; if (!st) return;
    const ref = P.veh || P, d2 = p => Math.hypot(ref.x - p.x, ref.z - p.z);
    if (MI.timer != null) { MI.timer -= dt; if (MI.timer <= 0) return failMission(L.fail.time); }
    const tv = st.tag && MI.tags[st.tag];
    if (tv && (st.t === 'enter' || st.t === 'deliver' || st.t === 'lose') && (tv.dead || tv.fire > 0 || tv.sink > 0)) return failMission(L.fail.car);
    switch (st.t) {
      case 'enterAny': if (P.veh) nextStep(); break;
      case 'goto': if (d2(st.at) < (st.r || 10) && (!st.inCar || P.veh)) nextStep(); break;
      case 'enter': if (P.veh === tv) { if (st.alarm) crime(1, true); if (st.wanted) { S.wanted = Math.max(S.wanted, st.wanted); S.hidden = 0; } nextStep(); } break;
      case 'deliver':
        if (st.minHp && tv.hp < tv.maxHp * st.minHp) return failMission(L.fail.dmg);
        if (P.veh === tv && Math.hypot(tv.x - st.at.x, tv.z - st.at.z) < 11 && (!st.clean || !S.wanted) && Math.hypot(tv.vx, tv.vz) < 14) { exitVeh(true); tv.tag = null; tv.ai = 'parked'; nextStep(); }
        break;
      case 'lose': if (!S.wanted) nextStep(); break;
      case 'collect':
        for (const it of MI.items) if (!it.got && Math.hypot(ref.x - it.x, ref.z - it.z) < 5) { it.got = true; removeMesh(it.mesh); audio.sfx('pick'); toast(fmt(L.ms[MI.i].o[0], { n: MI.items.filter(i => i.got).length }), '#c58bff', 1.6); }
        if (MI.items.every(i => i.got)) nextStep(); break;
      case 'race': { const cp = st.pts[MI.cp]; if (d2(cp) < 16 && (cp.y == null || Math.abs((ref.y || 0) - cp.y) < 8)) { MI.cp++; audio.sfx('pick'); if (MI.cp >= st.pts.length) nextStep(); } break; }
      case 'chase': {
        if (tv.hp <= tv.maxHp * .12 || tv.dead || tv.fire > 0 || tv.sink > 0) {
          tv.ai = 'idle'; tv.thr = 0; tv.driver = null; tv.tag = null; tv.boss = false;
          const dp = mkPed(tv.x - Math.sin(tv.a) * 2.4, tv.z + Math.cos(tv.a) * 2.4, st.tag === 'harun' ? 'cop' : 'civ', st.tag === 'harun' ? { hp: 30 } : { flee: 30 }); dp.fleeFrom = { x: ref.x, z: ref.z }; if (st.tag === 'harun') dp.look.shirt = '#111';
          nextStep(); break;
        }
        if (Math.hypot(tv.x - ref.x, tv.z - ref.z) > 330) { MI.far = (MI.far || 0) + dt; if (MI.far > 6) return failMission(L.fail.lost); } else MI.far = 0;
        break;
      }
      case 'grab': if (d2(MI.brief) < 2.5) { removeMesh(MI.briefMesh); audio.sfx('pick'); nextStep(); } break;
      case 'kill': if (MI.gang.every(g => g.dead)) nextStep(); break;
    }
  }
  function passMission() {
    const MI = S.mission; S.mission = null;
    save.money += MI.m.pay; if (MI.m.debt) save.debt = Math.max(0, save.debt - MI.m.debt);
    if (save.m <= MI.i) save.m = MI.i + 1;
    if (MI.i === MS.length - 1) { save.debt = 0; S.endT = 7; }
    store(); audio.sfx('pass');
    S.banner = { s: L.passed, sub: fmt(L.cash, { n: MI.m.pay }) + (MI.m.debt ? '   ·   ' + fmt(L.paidOff, { n: save.debt.toLocaleString('en-US') }) : ''), col: '#ffcf3f', t: 4 };
    for (const k in MI.tags) if (MI.tags[k]) { MI.tags[k].tag = null; MI.tags[k].boss = false; }
    S.mode = 'play';
  }
  function failMission(reason, silent) {
    const MI = S.mission; if (!MI) return; S.mission = null;
    for (const k in MI.tags) { const v = MI.tags[k]; if (v) { v.tag = null; v.boss = false; if (v.ai === 'chase') v.ai = 'traffic'; } }
    if (MI.gang) MI.gang.forEach(g => g.tag = null);
    if (MI.items) MI.items.forEach(it => removeMesh(it.mesh));
    if (MI.briefMesh) removeMesh(MI.briefMesh);
    if (!silent) audio.sfx('fail');
    S.banner = { s: L.failed, sub: reason, col: '#ff4f5e', t: 4 };
  }

  /* ---------- input ---------- */
  const keys = {}; let mouse = { x: 0, y: 0, l: false, r: false, has: false, drag: null }, stick = { on: false, id: null, ox: 0, oy: 0, x: 0, y: 0 }, look = { id: null, x: 0, y: 0 }, tbtn = {}, uiHits = [];
  const KM = { KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right', ShiftLeft: 'sprint', ShiftRight: 'sprint', Space: 'space', KeyC: 'desc', ControlLeft: 'desc' };
  function onKey(e, down) {
    if (!wrap.isConnected) return;
    const k = KM[e.code]; if (k) { keys[k] = down; if (S.mode === 'play' || S.mode === 'say') e.preventDefault(); }
    if (!down || e.repeat) return;
    if (S.mode === 'menu' || S.mode === 'list') return;
    if (e.code === 'KeyP' || e.code === 'Escape') { if (e.code === 'Escape' && document.pointerLockElement) return; togglePause(); e.preventDefault(); return; }
    if (S.mode === 'say' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyF')) { advanceSay(); e.preventDefault(); return; }
    if (S.mode === 'map') { if (e.code === 'KeyM') S.mode = 'play'; return; }
    if (S.mode === 'dead' && S.deadT > 1.2) { respawn(); return; }
    if (S.mode !== 'play') return;
    if (e.code === 'KeyF' || e.code === 'Enter') { P.veh ? exitVeh() : enterVeh(); e.preventDefault(); }
    if (e.code === 'KeyQ') cycleWeapon(-1);
    if (e.code === 'KeyE') cycleWeapon(1);
    if (e.code === 'KeyR') cycleRadio();
    if (e.code === 'KeyM') { S.mode = 'map'; if (document.pointerLockElement) document.exitPointerLock(); }
    if (e.code === 'KeyH' && P.veh) audio.sfx('horn');
    if (e.code === 'Space' && !P.veh) jump();
    if (S.shopOpen && /Digit[1-4]/.test(e.code)) buy(+e.code.slice(5));
  }
  const kd = e => onKey(e, true), ku = e => onKey(e, false);
  addEventListener('keydown', kd); addEventListener('keyup', ku);
  function jump() { if (P.onGround && !P.swim) { P.vy = 6.4; P.onGround = false; } else if (P.swim) { const g = Wd.heightRaw(P.x + Math.cos(P.a) * 1.5, P.z + Math.sin(P.a) * 1.5); if (g > -.3 && g < 2.2) { P.x += Math.cos(P.a) * 1.6; P.z += Math.sin(P.a) * 1.6; P.y = g + .1; P.swim = false; } } }
  function cycleWeapon(d) { const have = WORDER.filter(w => w === 'fist' || save.ammo[w] > 0); let i = have.indexOf(P.weapon); i = (i + d + have.length) % have.length; P.weapon = have[i]; audio.sfx('click'); }
  function cycleRadio() { const n = (audio.station + 1) % (audio.STATIONS.length + 1); audio.setStation(n); if (P.veh && P.veh.kind === 'car') audio.radio(true); store(); toast('📻 ' + (n < audio.STATIONS.length ? audio.STATIONS[n] : L.radioOff), '#ff9ad5', 2); }
  function togglePause() { if (S.mode === 'pause') { S.mode = S.prev || 'play'; audio.suspend(false); } else if (S.mode === 'play' || S.mode === 'say' || S.mode === 'map') { S.prev = S.mode; S.mode = 'pause'; audio.suspend(true); if (document.pointerLockElement) document.exitPointerLock(); } }
  function advanceSay() { const s = S.say; if (!s || s.t < .25) return; s.i++; s.t = 0; if (s.i >= s.lines.length) { S.say = null; S.mode = 'play'; nextStep(); } }
  function buy(n) {
    const it = [['pistol', 100, 48], ['smg', 300, 120], ['rifle', 600, 60], ['armor', 200, 100]][n - 1]; if (!it) return;
    if (save.money < it[1]) { toast(L.noMoney, '#ff8a8a'); return; }
    save.money -= it[1]; if (it[0] === 'armor') P.armor = 100; else { save.ammo[it[0]] = (save.ammo[it[0]] || 0) + it[2]; P.weapon = it[0]; }
    audio.sfx('cash'); toast(L.bought + ': ' + (it[0] === 'armor' ? L.armor : L.w[it[0]]), '#7dff8a'); store();
  }
  const pos = e => { const r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitUI(x, y) { for (let i = uiHits.length - 1; i >= 0; i--) { const h = uiHits[i]; if (x >= h.x && y >= h.y && x <= h.x + h.w && y <= h.y + h.h) { h.f(); return true; } } return false; }
  const TB = () => { const s = clamp(W * .13, 54, 76), m = 14; return [
    { k: 'fire', x: W - s - m, y: H - s - m, r: s / 2, lab: P.veh ? (P.veh.kind === 'heli' ? '▲' : 'HB') : '🔫' },
    { k: 'car', x: W - s * 2 - m * 2, y: H - s * .8 - m, r: s * .4, lab: '🚗' },
    { k: 'jump', x: W - s * 1.8 - m * 2, y: H - s * 1.9 - m, r: s * .36, lab: P.veh && P.veh.kind === 'heli' ? '▼' : '⤒' },
    { k: 'wpn', x: W - s - m, y: H - s * 2 - m * 2, r: s * .34, lab: '⇄' },
    { k: 'map', x: W - s * .62 - m, y: 150, r: s * .3, lab: '🗺' }, { k: 'radio', x: W - s * .62 - m, y: 150 + s * .72, r: s * .3, lab: '📻' }, { k: 'pause', x: W - s * .62 - m, y: 150 + s * 1.44, r: s * .3, lab: 'II' }]; };
  glc.addEventListener('pointerdown', e => {
    audio.init(); glc.focus();
    const p = pos(e);
    if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.has = true; }
    if (hitUI(p.x, p.y)) { e.preventDefault(); return; }
    if (S.mode === 'say') { advanceSay(); return; }
    if (S.mode === 'dead' && S.deadT > 1.2) { respawn(); return; }
    if (S.mode === 'map') { const mr = S.mapRect; if (mr && p.x > mr.x && p.y > mr.y && p.x < mr.x + mr.s && p.y < mr.y + mr.s) { S.wp = { x: (p.x - mr.x) / mr.s * HALF * 2 - HALF, z: (p.y - mr.y) / mr.s * HALF * 2 - HALF }; toast(L.wp, '#ff9ad5'); S.gpsKey = ''; } S.mode = 'play'; return; }
    if (S.mode !== 'play') return;
    if (e.pointerType !== 'mouse') {
      for (const b of TB()) if (Math.hypot(p.x - b.x - b.r, p.y - b.y - b.r) < b.r + 10) {
        if (b.k === 'fire') tbtn.fire = e.pointerId; if (b.k === 'jump') { tbtn.jump = e.pointerId; if (!P.veh) jump(); }
        if (b.k === 'car') P.veh ? exitVeh() : enterVeh(); if (b.k === 'wpn') cycleWeapon(1); if (b.k === 'map') S.mode = 'map'; if (b.k === 'radio') cycleRadio(); if (b.k === 'pause') togglePause();
        return;
      }
      if (p.x < W * .45 && !stick.on) { stick = { on: true, id: e.pointerId, ox: p.x, oy: p.y, x: 0, y: 0 }; }
      else if (look.id == null) look = { id: e.pointerId, x: p.x, y: p.y };
      try { glc.setPointerCapture(e.pointerId); } catch (er) {}
      return;
    }
    if (!document.pointerLockElement && glc.requestPointerLock) { try { const r = glc.requestPointerLock(); if (r && r.catch) r.catch(() => {}); } catch (er) {} }
    if (e.button === 0) mouse.l = true; if (e.button === 2) mouse.r = true;
    mouse.drag = p;
  });
  glc.addEventListener('pointermove', e => {
    const p = pos(e);
    if (e.pointerType === 'mouse') { mouse.x = p.x; mouse.y = p.y; mouse.has = true; if (document.pointerLockElement === glc && S.mode === 'play') { S.camYaw += e.movementX * .0024; S.camPitch = clamp(S.camPitch + e.movementY * .0022, -.5, 1.15); S.lastLook = S.t; } else if (mouse.drag) { S.camYaw += (p.x - mouse.drag.x) * .005; S.camPitch = clamp(S.camPitch + (p.y - mouse.drag.y) * .004, -.5, 1.15); mouse.drag = p; S.lastLook = S.t; } return; }
    if (stick.on && e.pointerId === stick.id) { let dx = p.x - stick.ox, dy = p.y - stick.oy; const d = Math.hypot(dx, dy), m = 60; if (d > m) { dx *= m / d; dy *= m / d; } stick.x = dx / m; stick.y = dy / m; }
    if (e.pointerId === look.id) { S.camYaw += (p.x - look.x) * .006; S.camPitch = clamp(S.camPitch + (p.y - look.y) * .005, -.5, 1.15); look.x = p.x; look.y = p.y; S.lastLook = S.t; }
  });
  const up = e => { if (e.pointerId === stick.id) stick = { on: false, id: null, x: 0, y: 0 }; if (e.pointerId === look.id) look.id = null; if (e.pointerType === 'mouse') { if (e.button === 0) mouse.l = false; if (e.button === 2) mouse.r = false; mouse.drag = null; } for (const k in tbtn) if (tbtn[k] === e.pointerId) tbtn[k] = null; };
  glc.addEventListener('pointerup', up); glc.addEventListener('pointercancel', up);
  glc.addEventListener('contextmenu', e => e.preventDefault());
  glc.addEventListener('wheel', e => { if (S.mode === 'play') { cycleWeapon(e.deltaY > 0 ? 1 : -1); e.preventDefault(); } }, { passive: false });
  const vis = () => { if (document.hidden && (S.mode === 'play' || S.mode === 'say')) togglePause(); };
  document.addEventListener('visibilitychange', vis);

  /* ---------- update ---------- */
  function camFwd() { return [Math.cos(S.camYaw) * Math.cos(S.camPitch), -Math.sin(S.camPitch), Math.sin(S.camYaw) * Math.cos(S.camPitch)]; }
  function autoAim() {
    let best = null, bs = 1e9;
    for (const p of peds) { if (p.dead) continue; const d = Math.hypot(p.x - P.x, p.z - P.z); if (d > 70) continue; const pri = p.kind === 'gang' || (p.kind === 'cop' && S.wanted) ? 0 : 60; const ad = Math.abs(angDiff(S.camYaw, Math.atan2(p.z - P.z, p.x - P.x))); if (ad > 1.1 || !los(P.x, P.y + 1.5, P.z, p.x, p.y + 1.4, p.z)) continue; const sc = d + pri + ad * 40; if (sc < bs) { bs = sc; best = p; } }
    if (!best) for (const v of V) { if (v.dead || !v.tag) continue; const d = Math.hypot(v.x - P.x, v.z - P.z); if (d < 70 && d < bs) { bs = d; best = v; } }
    return best;
  }
  function update(dt) {
    S.t += dt;
    for (const t of toasts) t.t -= dt; toasts = toasts.filter(t => t.t > 0);
    if (S.banner) { S.banner.t -= dt; if (S.banner.t <= 0) S.banner = null; }
    if (S.mode === 'say') { S.say.t += dt; return; }
    if (S.mode === 'dead') { S.deadT += dt; if (S.deadT > 4.5) respawn(); stepWorld(dt * .35); return; }
    if (S.mode !== 'play') return;
    S.clock = (S.clock + dt * 4) % 1440; if (S.endT > 0) S.endT -= dt;
    const ix = (keys.right ? 1 : 0) - (keys.left ? 1 : 0) + stick.x, iy = (keys.up ? 1 : 0) - (keys.down ? 1 : 0) - stick.y;
    const fx = Math.cos(S.camYaw), fz = Math.sin(S.camYaw), rx = -fz, rz = fx;
    if (P.veh) {
      const v = P.veh;
      if (v.kind === 'heli') {
        v.thr = clamp(iy, -1, 1); v.steer = clamp(ix, -1, 1); v.up = (keys.space || tbtn.fire ? 1 : 0) - (keys.desc || tbtn.jump ? 1 : 0);
        if (stick.on && Math.hypot(stick.x, stick.y) > .2) { const want = Math.atan2(fz * -stick.y + rz * stick.x, fx * -stick.y + rx * stick.x), d = angDiff(v.a, want); v.steer = clamp(d * 2, -1, 1); v.thr = Math.min(1, Math.hypot(stick.x, stick.y)) * (Math.cos(d) > 0 ? 1 : .2); }
      } else if (stick.on && Math.hypot(stick.x, stick.y) > .15) {
        const want = Math.atan2(fz * -stick.y + rz * stick.x, fx * -stick.y + rx * stick.x), diff = angDiff(v.a, want), mag = Math.min(1, Math.hypot(stick.x, stick.y));
        if (Math.cos(diff) > -.35) { v.thr = mag; v.steer = clamp(diff * 2.4, -1, 1); } else { v.thr = -mag; v.steer = 0; }
        v.hb = !!tbtn.fire;
      } else { v.thr = keys.up ? 1 : keys.down ? -1 : 0; v.steer = (keys.right ? 1 : 0) - (keys.left ? 1 : 0); v.hb = !!(keys.space || tbtn.fire); }
      P.x = v.x; P.y = v.y; P.z = v.z; P.a = v.a;
      const vf = v.vx * Math.cos(v.a) + v.vz * Math.sin(v.a);
      audio.engine(v.kind === 'heli' ? 'heli' : v.kind === 'boat' ? 'boat' : 'car', v.kind === 'heli' ? Math.hypot(v.vx, v.vz) : vf, v.kind === 'heli' ? v.rotor * 6 + Math.abs(v.up) * 3 : v.thr);
      if (v.dead || v.sink) exitVeh(true);
    } else {
      const m = Math.hypot(ix, iy), sprint = keys.sprint || (stick.on && Math.hypot(stick.x, stick.y) > .92);
      const sp = P.swim ? (sprint ? 4.2 : 2.6) : (sprint ? 7.6 : 4.4);
      P.aiming = !P.swim && P.weapon !== 'fist' && (mouse.r || (touch && tbtn.fire));
      if (m > .1) { const mx = (fx * iy + rx * ix) / Math.max(1, m), mz = (fz * iy + rz * ix) / Math.max(1, m); moveP(P, mx * sp * dt * (P.aiming ? .6 : 1), mz * sp * dt * (P.aiming ? .6 : 1)); if (!P.aiming) P.a = P.a + angDiff(P.a, Math.atan2(mz, mx)) * Math.min(1, dt * 12); P.walk += dt * sp * 2; P.anim = clamp(sp / 5, .6, 1.4); }
      else P.anim = P.swim ? .4 : 0;
      if (P.swim) P.walk += dt * 3;
      if (P.vx || P.vz) { moveP(P, P.vx * dt, P.vz * dt); P.vx *= Math.max(0, 1 - 7 * dt); P.vz *= Math.max(0, 1 - 7 * dt); if (Math.abs(P.vx) + Math.abs(P.vz) < .1) P.vx = P.vz = 0; }
      vertical(P, dt);
      if (P.aiming || mouse.l) P.a = S.camYaw;
      P.aimPitch = clamp(-S.camPitch + .15, -.8, .8);
      P.cool -= dt; P.punchT -= dt;
      const firing = (mouse.l && document.pointerLockElement === glc) || (mouse.l && S.lockFail) || tbtn.fire;
      if (firing && P.cool <= 0 && !P.swim) {
        if (P.weapon !== 'fist' && !(save.ammo[P.weapon] > 0)) P.weapon = 'fist';
        const cam = camera.position; let [dx, dy, dz] = camFwd();
        if (touch) { const t = autoAim(); if (t) { const ty = (t.y || 0) + (t.kind === 'car' || t.kind === 'boat' ? .9 : 1.3); dx = t.x - P.x; dz = t.z - P.z; dy = ty - (P.y + 1.45); const n = Math.hypot(dx, dy, dz); dx /= n; dy /= n; dz /= n; P.a = Math.atan2(dz, dx); shootFrom(P, P.x, P.y + 1.45, P.z, dx, dy, dz, P.weapon); } else shootFrom(P, cam.x, cam.y, cam.z, dx, dy, dz, P.weapon); }
        else shootFrom(P, cam.x, cam.y, cam.z, dx, dy, dz, P.weapon);
        P.cool = WEAP[P.weapon].cd; if (P.weapon !== 'fist') save.ammo[P.weapon]--;
      }
      audio.engine(null);
    }
    stepWorld(dt);
    const ref = P.veh || P;
    // pickups
    for (const pk of pickups) {
      if (pk.gone) { if (pk.fixed && (pk.t -= dt) <= 0) { pk.gone = false; pk.mesh.visible = true; } continue; }
      if (!pk.fixed) { pk.t -= dt; if (pk.t <= 0) { pk.dead = true; removeMesh(pk.mesh); continue; } }
      if (Math.hypot(pk.x - ref.x, pk.z - ref.z) < 2.2 && Math.abs((ref.y || 0) - groundAt(pk.x, pk.z, ref.y).h) < 3 && (!P.veh || pk.k === 'cash')) { if (takePickup(pk) !== false) { if (pk.fixed) { pk.gone = true; pk.t = 60; pk.mesh.visible = false; } else { pk.dead = true; removeMesh(pk.mesh); } } }
    }
    pickups = pickups.filter(p => !p.dead);
    // paint shop at Ela's garage
    S.sprayCD -= dt;
    if (P.veh && P.veh.kind === 'car' && !S.mission && Math.hypot(P.veh.x - PL.garage.x, P.veh.z - PL.garage.z) < 10 && S.sprayCD <= 0 && (S.wanted > 0 || P.veh.hp < P.veh.maxHp)) {
      const cost = S.wanted ? 250 : 100;
      if (save.money >= cost) { save.money -= cost; P.veh.hp = P.veh.maxHp; P.veh.fire = 0; if (S.wanted) setWanted(0); const nc = CAR_COLS[Math.floor(Math.random() * CAR_COLS.length)]; P.veh.col = nc; P.veh.mesh.userData.body.traverse(o => { if (o.material && o.material.metalness === .5) o.material = mat(nc, { roughness: .3, metalness: .5, envMapIntensity: 1 }); }); toast(L.spray + '  −$' + cost, '#ff9ad5', 3); audio.sfx('cash'); store(); }
      else toast(L.noMoney, '#ff8a8a');
      S.sprayCD = 8;
    }
    S.shopOpen = !P.veh && Math.hypot(P.x - PL.gunshop.x, P.z - PL.gunshop.z) < 7;
    // wanted
    if (S.wanted) { if (copSees()) S.hidden = 0; else { S.hidden += dt; if (S.hidden > 4 + S.wanted * 2.5) { setWanted(0); toast(L.lost, '#7dff8a'); } } copFieldT -= dt; if (copFieldT <= 0) { copFieldT = 1; copField = nodeField(ref.x, ref.z); } }
    spawnCops(dt);
    if (!S.mission && save.m < MS.length) { const st = MS[save.m].start; if (Math.hypot(ref.x - st.x, ref.z - st.z) < 5 && !S.wanted) { if (P.veh) { P.veh.vx *= .2; P.veh.vz *= .2; } startMission(save.m); } }
    missionTick(dt);
    const tgt = stepTarget() || (!S.mission && save.m < MS.length && !S.free ? MS[save.m].start : null) || S.wp;
    if (S.wp && Math.hypot(ref.x - S.wp.x, ref.z - S.wp.z) < 15) S.wp = null;
    S.gpsT -= dt; if (tgt && (S.gpsT <= 0 || S.gpsKey !== Math.round(tgt.x) + ',' + Math.round(tgt.z))) { S.gpsT = 1.2; S.gpsKey = Math.round(tgt.x) + ',' + Math.round(tgt.z); S.gps = gpsPath(ref, tgt); } if (!tgt) S.gps = [];
    const dk = Wd.districtAt(ref.x, ref.z); if (dk !== S.district) { S.district = dk; S.distT = 3; } S.distT -= dt;
    S.spawnT = (S.spawnT || 0) - dt; if (S.spawnT <= 0) { S.spawnT = .3; spawnTraffic(); spawnPeds(); spawnParked(); despawn(); }
    audio.sea(Wd.isWater(ref.x + 25, ref.z) || Wd.isWater(ref.x - 25, ref.z) || P.swim ? 1 : 0);
  }
  function gpsPath(from, to) {
    const a = nn(from.x, from.z), b = nn(to.x, to.z); if (Math.hypot(to.x - b.x, to.z - b.z) > 60 || (P.veh && P.veh.kind !== 'car') || P.swim) return [{ x: from.x, z: from.z }, { x: to.x, z: to.z }];
    const prev = new Map([[a, null]]), q = [a]; while (q.length) { const n = q.shift(); if (n === b) break; for (const m of n.n) if (!prev.has(m)) { prev.set(m, n); q.push(m); } }
    const out = [{ x: to.x, z: to.z }]; let n = b; while (n) { out.push({ x: n.x, z: n.z }); n = prev.get(n); } out.push({ x: from.x, z: from.z }); return out.reverse();
  }
  function copSees() {
    const ref = P.veh || P, ry = (ref.y || 0) + 1;
    if (heli.on && Math.hypot(heli.x - ref.x, heli.z - ref.z) < 25) return true;
    for (const p of peds) if (p.kind === 'cop' && !p.dead && Math.hypot(p.x - ref.x, p.z - ref.z) < 90 && los(p.x, p.y + 1.6, p.z, ref.x, ry, ref.z)) return true;
    for (const v of V) if (v.ai === 'cop' && v.driver && !v.dead && Math.hypot(v.x - ref.x, v.z - ref.z) < 120 && los(v.x, v.y + 1.2, v.z, ref.x, ry, ref.z)) return true;
    return false;
  }
  function spawnCops(dt) {
    if (!S.wanted) return;
    const ref = P.veh || P, want = [0, 1, 2, 3, 4, 5][S.wanted];
    S.copT -= dt;
    if (S.copT <= 0) {
      S.copT = 2.4;
      const cand = Wd.nodes.filter(n => { const d = Math.hypot(n.x - ref.x, n.z - ref.z); return d > 110 && d < 260 && Wd.heightRaw(n.x, n.z) > 0; }); if (cand.length && V.filter(v => v.ai === 'cop' && v.kind === 'car' && !v.dead).length < want) for (let k = 0; k < 4; k++) { const a = cand[Math.floor(Math.random() * cand.length)]; const v = mkVeh('police', a.x, a.z, Math.atan2(ref.z - a.z, ref.x - a.x), { ai: 'cop', driver: 'cop', siren: true, crew: 2 }); v.to = a.n[0]; v.from = a; break; }
      const wet = P.swim || (P.veh && P.veh.kind === 'boat');
      if (wet && S.wanted >= 1 && V.filter(v => v.type === 'pboat' && !v.dead).length < Math.min(2, S.wanted)) for (let k = 0; k < 20; k++) { const a = Math.random() * TAU, d = 90 + Math.random() * 80, x = ref.x + Math.cos(a) * d, z = ref.z + Math.sin(a) * d; if (Wd.heightRaw(x, z) < -2) { mkVeh('pboat', x, z, a + Math.PI, { ai: 'cop', driver: 'cop', siren: true }); break; } }
    }
    if (S.wanted >= 4 && !heli.on) { heli.on = true; heli.x = ref.x - 200; heli.z = ref.z - 150; heli.y = 70; }
  }
  function stepWorld(dt) {
    for (const v of V) {
      if (!v.dead && !v.sink) {
        if (v.driver === 'npc') { if (v.ai === 'traffic') aiTraffic(v, dt, 'traffic'); else if (v.ai === 'chase') aiTraffic(v, dt, 'flee'); }
        else if (v.driver === 'cop') { if (v.ai === 'cop') aiCop(v, dt); else if (v.kind === 'car') aiTraffic(v, dt, 'traffic'); }
        else if (v.driver !== 'player') { v.thr = 0; v.steer = 0; v.hb = v.kind === 'car'; v.up = 0; }
      }
      physVeh(v, dt); vehVsPeds(v);
    }
    if (S.wanted) for (const v of V) if (v.ai === 'traffic' && v.driver === 'cop' && !v.dead) { v.ai = 'cop'; v.siren = true; }
    vehCollisions();
    for (const p of peds) pedUpdate(p, dt);
    if (!P.veh) for (const v of V) { if (v.kind === 'heli' && v.y > P.y + 2) continue; const sp = VSPEC[v.type], ca = Math.cos(-v.a), sa = Math.sin(-v.a), lx = (P.x - v.x) * ca - (P.z - v.z) * sa, lz = (P.x - v.x) * sa + (P.z - v.z) * ca; if (Math.abs(lx) < sp.L / 2 + .35 && Math.abs(lz) < sp.W / 2 + .35 && Math.abs(P.y - v.y) < 1.6) { const d = Math.hypot(P.x - v.x, P.z - v.z) || 1; moveP(P, (P.x - v.x) / d * .15, (P.z - v.z) / d * .15); } }
    if (heli.on) {
      const ref = P.veh || P, a = Math.atan2(ref.z - heli.z, ref.x - heli.x), d = Math.hypot(ref.x - heli.x, ref.z - heli.z), sp = d > 40 ? 26 : d > 10 ? 10 : 0;
      heli.x += Math.cos(a) * sp * dt; heli.z += Math.sin(a) * sp * dt; heli.a = a; heli.y = lerp(heli.y, Math.max(45, (ref.y || 0) + 40), dt * .5);
      heli.cool -= dt; if (S.wanted >= 5 && d < 80 && heli.cool <= 0) { heli.cool = .3; if (Math.random() < .3) npcShoot({ x: heli.x, y: heli.y - 2, z: heli.z, a: heli.a }, 'smg'); }
      if (S.wanted < 4) { heli.x -= 30 * dt; heli.z -= 30 * dt; if (d > 300) heli.on = false; }
    }
    let nearCop = 1e9; for (const v of V) if (v.siren && !v.dead) nearCop = Math.min(nearCop, Math.hypot(v.x - camera.position.x, v.z - camera.position.z)); audio.siren(clamp(1 - nearCop / 160, 0, 1), S.t);
    stepFerries(dt);
    for (const e of events) e.t -= dt; events = events.filter(e => e.t > 0);
    for (const tr of tracers) tr.t -= dt; tracers = tracers.filter(t => t.t > 0);
    S.shake = Math.max(0, (S.shake || 0) - dt * 2);
  }

  /* ---------- time of day ---------- */
  const cTop = new THREE.Color(), cHor = new THREE.Color(), tmp1 = new THREE.Color(), tmp2 = new THREE.Color();
  const SKY = [[0, '#050a1a', '#141c33'], [5, '#0b1430', '#2a2a48'], [6.5, '#3a5a9a', '#f0a070'], [8, '#5f9fe0', '#cfe3f2'], [16.5, '#5a96d8', '#d6e6f0'], [18.6, '#3a4a8a', '#ff9a5a'], [20, '#151a3a', '#4a3a5a'], [21.5, '#050a1a', '#141c33'], [24, '#050a1a', '#141c33']];
  function lightUpdate() {
    const h = S.clock / 60; let i = 0; while (i < SKY.length - 2 && SKY[i + 1][0] <= h) i++;
    const t = (h - SKY[i][0]) / (SKY[i + 1][0] - SKY[i][0]);
    cTop.copy(tmp1.set(SKY[i][1])).lerp(tmp2.set(SKY[i + 1][1]), t); cHor.copy(tmp1.set(SKY[i][2])).lerp(tmp2.set(SKY[i + 1][2]), t);
    skyU.top.value.copy(cTop); skyU.hor.value.copy(cHor); scene.fog.color.copy(cHor);
    const el = Math.sin((h - 6) / 12 * Math.PI), az = (h - 6) / 12 * Math.PI, day = clamp(el * 3, 0, 1), night = clamp(-el * 3 + .3, 0, 1);
    const sd = new THREE.Vector3(Math.cos(az) * Math.cos(Math.max(el, .08)), Math.max(el, .08), .35).normalize();
    skyU.sunDir.value.copy(sd); skyU.sunCol.value.set(el < .25 ? '#ff9a50' : '#fff2d0').multiplyScalar(day); skyU.night.value = night;
    sun.intensity = lerp(.3, 2.1, day); sun.color.set(el < .2 && el > -.1 ? '#ffb070' : el <= -.1 ? '#8aa0ff' : '#fff4e0');
    hemi.intensity = lerp(.3, .85, day); hemi.color.copy(cTop).lerp(tmp1.set('#ffffff'), .5);
    const ref = P.veh || P, cx2 = S.mode === 'menu' || S.mode === 'list' ? camera.position.x : ref.x, cz2 = S.mode === 'menu' || S.mode === 'list' ? camera.position.z : ref.z;
    sun.position.set(cx2 + sd.x * 300 * (el > 0 ? 1 : -1), Math.abs(sd.y) * 300 + 50, cz2 + sd.z * 300); sun.target.position.set(cx2, 0, cz2);
    bMats.forEach(m => m.emissiveIntensity = night * 1.4); lampBulbMat.emissiveIntensity = night * 3; headM.emissiveIntensity = .6 + night * 2.5; tailM.emissiveIntensity = .4 + night * 1.5;
    waterMat.color.set(day > .2 ? '#1d5d74' : '#0d2a3a'); renderer.toneMappingExposure = lerp(.85, .95, day);
    if (Math.abs(h - S.envH) > .5 || S.envH == null) { S.envH = h; refreshEnv(); }
    if (night > .2) { const c2 = new THREE.Color(); bridgeLights.forEach((p, k) => { c2.setHSL((k / 30 + S.t * .05) % 1, .9, .55 * night); bLights.setColorAt(k, c2); }); if (bLights.instanceColor) bLights.instanceColor.needsUpdate = true; }
    else if (!S.bOff) { S.bOff = 1; }
    S.night = night;
  }

  /* ---------- render sync ---------- */
  let headSpot = null;
  function sync(dt) {
    P.mesh.visible = !P.veh && (S.camD || 5) > 1.5;
    if (!P.veh) { P.mesh.position.set(P.x, P.y, P.z); P.mesh.rotation.y = -P.a; poseHuman(P.mesh, P, dt); }
    for (const p of peds) { const show = Math.hypot(p.x - camera.position.x, p.z - camera.position.z) < 200; p.mesh.visible = show; if (!show) continue; p.mesh.position.set(p.x, p.y, p.z); p.mesh.rotation.y = -p.a; poseHuman(p.mesh, p, dt); }
    const sirenOn = Math.floor(S.t * 7) % 2;
    sirenR.emissiveIntensity = sirenOn ? 3 : .2; sirenB.emissiveIntensity = sirenOn ? .2 : 3;
    for (const v of V) {
      const g = v.mesh; g.position.set(v.x, v.y, v.z); g.rotation.set(v.roll, -v.a, v.pitch);
      const vf = v.vx * Math.cos(v.a) + v.vz * Math.sin(v.a);
      g.userData.wheels.forEach((w, i) => { w.rotation.z -= vf * dt / .36; if (i < 2) w.rotation.y = -v.steer * .45; });
      if (g.userData.rotor) { g.userData.rotor.rotation.y += v.rotor * dt * 28; g.userData.tail.rotation.z += v.rotor * dt * 40; }
      if (v.dead && !v.burnt) { v.burnt = 1; g.traverse(o => { if (o.material && !Array.isArray(o.material)) o.material = mat('#1c1a18', { roughness: 1 }); }); }
    }
    if (heli.on && !heli.mesh) { heli.mesh = makeVehicle('heli', '#1f3f8a'); heli.mesh.rotation.order = 'YZX'; const bm = new THREE.Mesh(new THREE.ConeGeometry(12, 1, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: .12, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })); bm.position.y = -.5; scene.add(bm); heli.beam = bm; }
    if (heli.mesh) { heli.mesh.visible = heli.on; heli.beam.visible = heli.on; if (heli.on) { heli.mesh.position.set(heli.x, heli.y, heli.z); heli.mesh.rotation.set(0, -heli.a, -.1); heli.mesh.userData.rotor.rotation.y += dt * 30; const ref = P.veh || P, gy = Math.max(0, (ref.y || 0)); heli.beam.position.set((heli.x + ref.x) / 2, (heli.y + gy) / 2, (heli.z + ref.z) / 2); heli.beam.scale.set(.6, heli.y - gy, .6); } }
    for (const pk of pickups) if (!pk.gone) { pk.mesh.position.set(pk.x, Math.max(groundAt(pk.x, pk.z, 99).h, 0) + .9 + Math.sin(S.t * 3 + pk.x) * .15, pk.z); pk.mesh.rotation.y += dt * 2; }
    const MI = S.mission; if (MI && MI.items) for (const it of MI.items) if (!it.got) { it.mesh.position.set(it.x, .25 + Math.sin(S.t * 2 + it.x) * .15, it.z); it.mesh.rotation.y += dt; }
    if (MI && MI.briefMesh) MI.briefMesh.position.set(MI.brief.x, groundAt(MI.brief.x, MI.brief.z).h + .5 + Math.sin(S.t * 3) * .1, MI.brief.z);
    // markers
    let mi = 0; const st = MI && MI.m.steps[MI.si];
    if (S.mode !== 'menu' && S.mode !== 'list') {
      if (!MI && save.m < MS.length) marker(mi++, MS[save.m].start.x, MS[save.m].start.z, '#ff4fa0', 1.6);
      if (st && (st.t === 'goto' || (st.t === 'deliver' && P.veh === MI.tags[st.tag]))) marker(mi++, st.at.x, st.at.z, '#ffd23a', st.r ? Math.min(st.r * .5, 5) : 3.5, st.at === PL.kiz ? 1.6 : null);
      if (st && st.t === 'race') { const cp = st.pts[MI.cp]; marker(mi++, cp.x, cp.z, '#39f3ff', 7, cp.y != null ? cp.y : null); }
      if (st && (st.t === 'enter' || st.t === 'chase')) { const tv = MI.tags[st.tag]; if (tv && P.veh !== tv) { marker(mi, tv.x, tv.z, st.t === 'chase' ? '#ff3b3b' : '#4fa3ff', .01, tv.y + 1.2); mi++; } }
      if (st && st.t === 'kill') for (const gg of MI.gang) if (!gg.dead && mi < 10) { marker(mi++, gg.x, gg.z, '#ff3b3b', .01, gg.y); }
      if (S.wp) marker(mi++, S.wp.x, S.wp.z, '#c58bff', 3);
      if (!P.veh) marker(mi++, PL.gunshop.x, PL.gunshop.z, '#ff8a1e', 1.2);
      if (P.veh && P.veh.kind === 'car' && !MI) marker(mi++, PL.garage.x, PL.garage.z, '#ff4fa0', 4);
    }
    hideMarkers(mi);
    // tracers
    let n = 0; for (const tr of tracers) { trPos.set(tr.a, n * 6); trPos.set(tr.b, n * 6 + 3); n++; } trGeo.setDrawRange(0, n * 2); trGeo.attributes.position.needsUpdate = true;
    flash.intensity = Math.max(0, flash.intensity - dt * (flash.intensity > 20 ? 120 : 160));
    stepPoints(fxS, dt); stepPoints(fxB, dt); stepPoints(fxG, dt);
    waterNorm.offset.x = (S.t * .012) % 1; waterNorm.offset.y = (S.t * .007) % 1;
    for (const f of flags) { const pa = f.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i); pa.setZ(i, Math.sin(S.t * 4 + x * .9) * .35 * (x + 4.5) / 9); } pa.needsUpdate = true; }
    // headlight of the player's car at night
    if (S.night > .3 && P.veh && P.veh.kind === 'car') { if (!headSpot) { headSpot = new THREE.SpotLight(0xfff2d0, 0, 70, .5, .5, 1.2); scene.add(headSpot); scene.add(headSpot.target); } headSpot.intensity = 120 * S.night; const v = P.veh; headSpot.position.set(v.x + Math.cos(v.a) * 2.4, v.y + .9, v.z + Math.sin(v.a) * 2.4); headSpot.target.position.set(v.x + Math.cos(v.a) * 20, v.y - 1, v.z + Math.sin(v.a) * 20); }
    else if (headSpot) headSpot.intensity = 0;
  }
  function placeCamera(dt) {
    if (S.mode === 'menu' || S.mode === 'list') { const a = S.t * .05; camera.position.set(bxz(-300) + Math.cos(a) * 260, 70 + Math.sin(S.t * .1) * 10, -300 + Math.sin(a) * 260); camera.lookAt(bxz(-300), 30, -300); return; }
    const v = P.veh, ref = v || P;
    if (v && S.t - S.lastLook > 1.4) { const sp = Math.hypot(v.vx, v.vz), vf = v.vx * Math.cos(v.a) + v.vz * Math.sin(v.a); if (sp > 2 && vf > -1) { S.camYaw += angDiff(S.camYaw, v.a) * Math.min(1, dt * 2.2); S.camPitch = lerp(S.camPitch, v.kind === 'heli' ? .35 : .2, dt * 1.5); } }
    const dist = v ? (v.kind === 'heli' ? 22 : v.kind === 'boat' ? 12 : v.type === 'van' ? 10 : 8.5) : (P.aiming ? 2.6 : 5.2);
    const [fx, fy, fz] = camFwd(), rx = -Math.sin(S.camYaw), rz = Math.cos(S.camYaw);
    const tx = ref.x + (P.aiming ? rx * .75 : 0), ty = (ref.y || 0) + (v ? (v.kind === 'heli' ? 3 : 2.2) : (P.swim ? 1.3 : 1.65)), tz = ref.z + (P.aiming ? rz * .75 : 0);
    let d = dist;
    for (let s = .5; s <= dist; s += .5) { const x = tx - fx * s, y = ty - fy * s, z = tz - fz * s, k = cellK(x, z); if (k >= 0 && Wd.solidTop(x, z) > y - .2) { d = Math.max(.9, s - .6); break; } }
    const sh = S.shake || 0, ox = (Math.random() - .5) * sh * .4, oy = (Math.random() - .5) * sh * .4;
    let cyy = ty - fy * d + oy; const gch = groundAt(tx - fx * d, tz - fz * d, cyy).h; if (cyy < Math.max(gch, .2) + .35) cyy = Math.max(gch, .2) + .35; camera.position.set(tx - fx * d + ox, cyy, tz - fz * d); S.camD = d;
    camera.lookAt(camera.position.x + fx, camera.position.y + fy, camera.position.z + fz);
    const spd = v ? Math.hypot(v.vx, v.vz) : 0; camera.fov = lerp(camera.fov, (P.aiming ? 48 : 62) + Math.min(14, spd * .3), .08); camera.updateProjectionMatrix();
  }

  /* ---------- HUD (2D canvas over the 3D view) ---------- */
  function txt(s, x, y, size, col, align, weight, shadow) { c.font = `${weight || 800} ${size}px system-ui,-apple-system,Segoe UI,sans-serif`; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic'; if (shadow !== false) { c.fillStyle = 'rgba(0,0,0,.75)'; c.fillText(s, x + 2, y + 2); } c.fillStyle = col; c.fillText(s, x, y); }
  function roundRect(x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function star(x, y, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); }
  function wrapT(s, maxW) { const words = String(s).split(' '), out = []; let line = ''; for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }
  let mapImg = null;
  function mapImage() { if (mapImg) return mapImg; mapImg = document.createElement('canvas'); mapImg.width = mapImg.height = 1024; const g = mapImg.getContext('2d'); g.drawImage(groundTex.image, 0, 0, 1024, 1024); g.fillStyle = 'rgba(30,32,38,.85)'; for (const B of Wd.blds) { const s = 1024 / (HALF * 2); g.fillRect((B.x + HALF) * s, (B.z + HALF) * s, B.w * s, B.d * s); } g.strokeStyle = '#c9ccd2'; g.lineWidth = 4; for (const b of BRIDGES) { const s = 1024 / (HALF * 2); g.beginPath(); g.moveTo((b.ax + HALF) * s, (b.az + HALF) * s); g.lineTo((b.bx + HALF) * s, (b.bz + HALF) * s); g.stroke(); } return mapImg; }
  function drawHUD() {
    uiHits = [];
    const sm = W < 600, ms = sm ? 120 : 170, mx = 12, my = H - ms - (touch ? 150 : 14);
    const ref = P.veh || P, img = mapImage(), sc = 1024 / (HALF * 2), zoom = (P.veh ? (P.veh.kind === 'heli' ? 1.1 : 1.6) : 2.6);
    c.save(); c.beginPath(); c.arc(mx + ms / 2, my + ms / 2, ms / 2, 0, TAU); c.fillStyle = 'rgba(10,14,20,.8)'; c.fill(); c.clip();
    c.translate(mx + ms / 2, my + ms / 2); c.rotate(-Math.PI / 2 - S.camYaw); c.scale(zoom, zoom);
    c.drawImage(img, -(ref.x + HALF) * sc, -(ref.z + HALF) * sc);
    const mp = (x, z) => [(x - ref.x) * sc, (z - ref.z) * sc];
    if (S.gps.length > 1) { c.strokeStyle = '#c55bff'; c.lineWidth = 3 / zoom * 1.4; c.lineJoin = 'round'; c.beginPath(); S.gps.forEach((p, i) => { const [a, b] = mp(p.x, p.z); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.stroke(); }
    const R = ms / 2 / zoom - 4 / zoom;
    const blip = (x, z, col, r, edge) => { let [a, b] = mp(x, z); const d = Math.hypot(a, b); if (d > R) { if (!edge) return; a *= R / d; b *= R / d; } c.fillStyle = col; c.beginPath(); c.arc(a, b, (r || 4) / zoom, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1 / zoom; c.stroke(); };
    for (const v of V) if (v.siren) blip(v.x, v.z, Math.floor(S.t * 6) % 2 ? '#ff2a3a' : '#2a6bff', 3.5);
    for (const p of peds) if (!p.dead && (p.kind === 'gang' || (p.kind === 'cop' && S.wanted))) blip(p.x, p.z, p.kind === 'gang' ? '#ff3b3b' : '#4fa3ff', 2.6);
    if (heli.on) blip(heli.x, heli.z, '#fff', 4);
    blip(PL.gunshop.x, PL.gunshop.z, '#ff8a1e', 3.5, true); blip(PL.garage.x, PL.garage.z, '#ff4fa0', 3.5, true);
    const tg = stepTarget() || (!S.mission && save.m < MS.length ? MS[save.m].start : null);
    if (tg) blip(tg.x, tg.z, S.mission ? '#ffd23a' : '#ff4fa0', 5.5, true);
    if (S.wp) blip(S.wp.x, S.wp.z, '#c58bff', 5, true);
    c.restore();
    c.save(); c.translate(mx + ms / 2, my + ms / 2); c.rotate((P.veh ? P.veh.a : P.a) - S.camYaw - Math.PI / 2); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -8); c.lineTo(6, 6); c.lineTo(0, 3); c.lineTo(-6, 6); c.closePath(); c.fill(); c.restore();
    c.strokeStyle = 'rgba(255,79,160,.75)'; c.lineWidth = 2.5; c.beginPath(); c.arc(mx + ms / 2, my + ms / 2, ms / 2, 0, TAU); c.stroke();
    { const na = -Math.PI / 2 - S.camYaw - Math.PI / 2, nx = mx + ms / 2 + Math.cos(na) * (ms / 2 - 9), ny = my + ms / 2 + Math.sin(na) * (ms / 2 - 9); c.fillStyle = '#fff'; c.font = '900 11px system-ui'; c.textAlign = 'center'; c.fillText('N', nx, ny + 4); }
    const hh = Math.floor(S.clock / 60), mi = Math.floor(S.clock % 60);
    txt(String(hh).padStart(2, '0') + ':' + String(mi).padStart(2, '0'), mx + ms + 10, my + ms - 4, 15, '#fff');
    if (S.distT > 0) { c.globalAlpha = clamp(S.distT, 0, 1); txt(L.dist[S.district] || '', W - 16, H - (touch ? 230 : 22), sm ? 18 : 26, '#ffd23a', 'right', 900); c.globalAlpha = 1; }
    const rx = W - 14;
    txt(money$(save.money), rx, 34, sm ? 22 : 28, '#7dff8a', 'right', 900);
    for (let i = 0; i < 5; i++) { const on = i < S.wanted, fl = on && S.hidden > .5 && Math.floor(S.t * 4) % 2; c.fillStyle = on ? (fl ? 'rgba(255,255,255,.35)' : '#ffd23a') : 'rgba(255,255,255,.18)'; star(rx - 12 - (4 - i) * 26, 56, 10); }
    const w = P.weapon; txt(L.w[w] + (w !== 'fist' ? '  ' + (save.ammo[w] || 0) : '') + (P.swim ? '  ·  ' + L.swim : ''), rx, 88, 15, '#fff', 'right');
    const bw = sm ? 110 : 150;
    c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 96, bw, 8); c.fillStyle = P.hp > 30 ? '#ff4f5e' : (Math.floor(S.t * 4) % 2 ? '#ff4f5e' : '#7a1f28'); c.fillRect(rx - bw, 96, bw * clamp(P.hp / 100, 0, 1), 8);
    if (P.armor > 0) { c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 107, bw, 6); c.fillStyle = '#4fa3ff'; c.fillRect(rx - bw, 107, bw * P.armor / 100, 6); }
    if (P.veh) { const v = P.veh; c.fillStyle = 'rgba(0,0,0,.5)'; c.fillRect(rx - bw, 117, bw, 5); c.fillStyle = '#d6d6d6'; c.fillRect(rx - bw, 117, bw * clamp(v.hp / v.maxHp, 0, 1), 5); txt(Math.round(Math.hypot(v.vx, v.vz) * 3.6) + ' km/h' + (v.kind === 'heli' ? '  ·  ' + Math.round(v.y) + ' m' : ''), rx, 140, 14, '#fff', 'right'); }
    const MI = S.mission;
    if (MI && MI.timer != null) { const ts = Math.max(0, Math.ceil(MI.timer)); txt(L.time + ' ' + Math.floor(ts / 60) + ':' + String(ts % 60).padStart(2, '0'), W / 2, 36, 22, ts < 15 ? '#ff4f5e' : '#fff', 'center', 900); }
    if (MI) { const st = MI.m.steps[MI.si]; if (st && st.t === 'chase') { const tv = MI.tags[st.tag]; if (tv) { const b2 = Math.min(240, W * .4); c.fillStyle = 'rgba(0,0,0,.6)'; c.fillRect(W / 2 - b2 / 2, 46, b2, 9); c.fillStyle = '#ff3b3b'; c.fillRect(W / 2 - b2 / 2, 46, b2 * clamp((tv.hp - tv.maxHp * .12) / (tv.maxHp * .88), 0, 1), 9); } } }
    let ob = objText();
    if (!MI && save.m < MS.length && !S.free) ob = L.hint; else if (!MI && save.m >= MS.length && S.t < 8) ob = L.allDone;
    if (S.shopOpen) ob = L.shopHint;
    if (!P.veh && !S.shopOpen) for (const v of V) if (!v.dead && !v.fire && !v.sink && Math.hypot(v.x - P.x, v.z - P.z) < VSPEC[v.type].L / 2 + 2.2 && Math.abs(v.y - P.y) < 3) { ob = touch ? L.getInT : L.getIn; break; }
    if (ob) { c.font = `700 ${sm ? 14 : 17}px system-ui`; const bw2 = Math.min(W - 30, 660), lines = wrapT(ob, bw2 - 30), bh = lines.length * (sm ? 19 : 23) + 14, by = sm ? 150 : 12; c.fillStyle = 'rgba(0,0,0,.62)'; roundRect(W / 2 - bw2 / 2, by + (MI && MI.timer != null && !sm ? 50 : 0), bw2, bh, 10); c.fill(); lines.forEach((l, i) => txt(l, W / 2, by + (MI && MI.timer != null && !sm ? 50 : 0) + 22 + i * (sm ? 19 : 23), sm ? 14 : 17, '#fff', 'center', 700, false)); }
    if (S.shopOpen) { const items = [[1, L.w.pistol, 100], [2, L.w.smg, 300], [3, L.w.rifle, 600], [4, L.armor, 200]], b3 = Math.min(150, (W - 40) / 4 - 8); items.forEach(([n, name, cost], i) => { const x = W / 2 - (b3 + 8) * 2 + i * (b3 + 8), y = H * .62; c.fillStyle = 'rgba(30,20,10,.88)'; roundRect(x, y, b3, 54, 8); c.fill(); c.strokeStyle = '#ff8a1e'; c.lineWidth = 2; c.stroke(); txt(name, x + b3 / 2, y + 22, 14, '#fff', 'center'); txt('$' + cost, x + b3 / 2, y + 42, 14, '#7dff8a', 'center'); uiHits.push({ x, y, w: b3, h: 54, f: () => buy(n) }); }); }
    toasts.forEach((t, i) => { c.globalAlpha = clamp(t.t, 0, 1); txt(t.s, W / 2, H * .3 + i * 26, sm ? 15 : 18, t.col, 'center', 800); c.globalAlpha = 1; });
    if (S.banner) { const b = S.banner; c.globalAlpha = clamp(b.t, 0, 1); c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, H * .38, W, 96); txt(b.s, W / 2, H * .38 + 50, sm ? 30 : 44, b.col, 'center', 900); if (b.sub) txt(b.sub, W / 2, H * .38 + 80, sm ? 14 : 18, '#fff', 'center', 700); c.globalAlpha = 1; }
    if (S.endT > 0) { c.globalAlpha = clamp(S.endT, 0, 1); txt(L.end, W / 2, H * .38 + 130, sm ? 15 : 20, '#ff9ad5', 'center', 800); c.globalAlpha = 1; }
    if (!P.veh && !P.swim && S.mode === 'play' && (P.weapon !== 'fist' || P.aiming) && !touch) { const cx2 = W / 2, cy2 = H / 2, r = P.aiming ? 6 : 10; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx2 - r - 6, cy2); c.lineTo(cx2 - r, cy2); c.moveTo(cx2 + r, cy2); c.lineTo(cx2 + r + 6, cy2); c.moveTo(cx2, cy2 - r - 6); c.lineTo(cx2, cy2 - r); c.moveTo(cx2, cy2 + r); c.lineTo(cx2, cy2 + r + 6); c.stroke(); c.fillStyle = '#fff'; c.fillRect(cx2 - 1, cy2 - 1, 2, 2); }
    if (touch && S.mode === 'play') {
      if (stick.on) { c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(stick.ox, stick.oy, 60, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.arc(stick.ox + stick.x * 60, stick.oy + stick.y * 60, 26, 0, TAU); c.fill(); }
      for (const b of TB()) { c.fillStyle = b.k === 'fire' ? (tbtn.fire ? 'rgba(255,79,94,.6)' : 'rgba(255,79,94,.32)') : 'rgba(0,0,0,.45)'; c.beginPath(); c.arc(b.x + b.r, b.y + b.r, b.r, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; c.stroke(); txt(b.lab, b.x + b.r, b.y + b.r + b.r * .35, b.r * .8, '#fff', 'center', 800, false); }
    } else if (!touch && S.mode === 'play' && S.t < 16) { c.globalAlpha = clamp(16 - S.t, 0, 1) * .9; c.font = '600 12px system-ui'; wrapT(L.keys, W - 40).forEach((l, i, a) => txt(l, W / 2, H - 10 - (a.length - 1 - i) * 15, 12, '#eee', 'center', 600)); c.globalAlpha = 1; }
    if (!touch && S.mode === 'play' && document.pointerLockElement !== glc && !S.lockFail) { c.globalAlpha = .8 + Math.sin(S.t * 3) * .2; txt('🖱 ⟲', W / 2, H * .82, 18, '#fff', 'center', 800); c.globalAlpha = 1; }
  }
  function button(label, x, y, w, h, f, primary, disabled) {
    c.fillStyle = disabled ? 'rgba(255,255,255,.08)' : primary ? '#e30a17' : 'rgba(0,0,0,.45)'; roundRect(x, y, w, h, 12); c.fill();
    c.strokeStyle = primary ? '#ff6b75' : 'rgba(255,255,255,.35)'; c.lineWidth = 1.5; c.stroke();
    txt(label, x + w / 2, y + h / 2 + 6, Math.min(18, h * .4), disabled ? '#888' : '#fff', 'center', 800, false);
    if (!disabled) uiHits.push({ x, y, w, h, f: () => { audio.init(); audio.sfx('click'); f(); } });
  }
  function drawMenu() {
    uiHits = []; const sm = W < 600, cx2 = W / 2;
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(5,8,20,.55)'); g.addColorStop(.5, 'rgba(5,8,20,.15)'); g.addColorStop(1, 'rgba(5,8,20,.75)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.textAlign = 'center'; c.font = `900 italic ${sm ? 44 : 86}px system-ui,Impact,sans-serif`; c.lineWidth = sm ? 5 : 8; c.strokeStyle = '#120408'; c.strokeText('İSTANBUL', cx2, H * .19); const tg = c.createLinearGradient(0, H * .19 - 70, 0, H * .19); tg.addColorStop(0, '#ffffff'); tg.addColorStop(1, '#ff4f5e'); c.fillStyle = tg; c.fillText('İSTANBUL', cx2, H * .19);
    c.font = `900 italic ${sm ? 36 : 64}px "Brush Script MT",cursive,system-ui`; c.shadowColor = '#e30a17'; c.shadowBlur = 18; c.fillStyle = '#ffe36b'; c.fillText('Heat', cx2 + (sm ? 70 : 140), H * .19 + (sm ? 38 : 60)); c.restore();
    c.font = `700 ${sm ? 12 : 15}px system-ui`; wrapT(L.sub + ' · ' + L.tag, W - 30).forEach((l, i) => txt(l, cx2, H * .19 + (sm ? 64 : 100) + i * 17, sm ? 12 : 15, '#ffe9ec', 'center', 700));
    if (S.mode === 'list') { drawList(); return; }
    const bw = Math.min(340, W - 40), bh = sm ? 44 : 50, x = cx2 - bw / 2; let y = H * .19 + (sm ? 104 : 130);
    if (save.m > 0 && save.m < MS.length) { button(fmt(L.cont, { n: save.m + 1 }) + ' · ' + L.ms[save.m].n, x, y, bw, bh, () => play(false), true); y += bh + 10; }
    else if (save.m === 0) { button(L.story, x, y, bw, bh, () => play(false), true); y += bh + 10; }
    button(L.free, x, y, bw, bh, () => play(true), save.m >= MS.length); y += bh + 10;
    button(L.missions, x, y, bw, bh, () => { S.mode = 'list'; }); y += bh + 10;
    const hw = (bw - 10) / 2;
    button(save.mute ? L.soundOff : L.soundOn, x, y, hw, bh * .8, () => { audio.setMute(!save.mute); store(); });
    button(save.q === 'high' ? L.qHigh : L.qLow, x + hw + 10, y, hw, bh * .8, () => { save.q = save.q === 'high' ? 'low' : 'high'; store(); location.reload(); }); y += bh * .8 + 16;
    txt(money$(save.money) + '   ·   ' + fmt(L.paidOff, { n: save.debt.toLocaleString('en-US') }), cx2, y + 6, sm ? 13 : 15, '#7dff8a', 'center', 800);
    c.font = `600 ${sm ? 11 : 13}px system-ui`; const kl = wrapT(touch ? L.keysT : L.keys, W - 40); kl.forEach((l, i) => txt(l, cx2, H - 14 - (kl.length - 1 - i) * 16, sm ? 11 : 13, '#f2e6ff', 'center', 600));
  }
  function drawList() {
    const sm = W < 600, bw = Math.min(420, W - 40), bh = sm ? 40 : 46, x = W / 2 - bw / 2; let y = H * .19 + (sm ? 96 : 124);
    MS.forEach((m, i) => { const open = i <= save.m; button((i + 1) + '. ' + L.ms[i].n + (open ? '' : ' · ' + L.locked), x, y, bw, bh - 6, () => { play(true); teleport(m.start.x, m.start.z + 6); startMission(i); }, false, !open); y += bh; });
    button(L.back, x, y + 6, bw, bh - 6, () => { S.mode = 'menu'; });
  }
  function teleport(x, z) { if (P.veh) exitVeh(true); P.x = x; P.z = z; P.y = groundAt(x, z).h; P.vy = 0; const n = nn(x, z); S.camYaw = Math.hypot(n.x - x, n.z - z) > 2 ? Math.atan2(n.z - z, n.x - x) : 0; P.a = S.camYaw; }
  function play(free) {
    audio.init(); S.mode = 'play'; S.free = free; S.t = 0;
    if (!S.started) { S.started = true; S.clock = 9.5 * 60; if (save.m > 0) { const st = MS[Math.min(save.m, MS.length - 1)].start; teleport(st.x, st.z + 8); } else if (free) teleport(LANDMARKS.taksim.x - 30, LANDMARKS.taksim.z + 30); else teleport(P.x, P.z); }
    if (!free && save.m === 0 && !S.mission) { S.camYaw = P.a = Math.PI / 2; startMission(0); }
    glc.focus();
  }
  function portrait(x, y, s, who) {
    c.save(); roundRect(x, y, s, s, 10); c.fillStyle = { kerem: '#2a1a12', ela: '#3a1032', mercan: '#0c2a36', harun: '#2c2410' }[who]; c.fill(); c.clip();
    const cx2 = x + s / 2, cy = y + s * .58, k = s / 84, skin = { kerem: '#c99068', ela: '#d9a477', mercan: '#e0b48c', harun: '#e8b98f' }[who];
    c.fillStyle = { kerem: '#3a2418', ela: '#2b2d42', mercan: '#f4f4f4', harun: '#4a3a22' }[who]; c.beginPath(); c.ellipse(cx2, y + s * 1.05, s * .42, s * .32, 0, 0, TAU); c.fill();
    c.fillStyle = skin; c.fillRect(cx2 - 7 * k, cy + 10 * k, 14 * k, 14 * k); c.beginPath(); c.ellipse(cx2, cy, 17 * k, 21 * k, 0, 0, TAU); c.fill();
    if (who === 'kerem') { c.fillStyle = '#141010'; c.beginPath(); c.ellipse(cx2, cy - 15 * k, 18 * k, 9 * k, 0, Math.PI, TAU); c.fill(); c.fillStyle = 'rgba(30,20,10,.55)'; c.fillRect(cx2 - 12 * k, cy + 8 * k, 24 * k, 5 * k); }
    else if (who === 'ela') { c.fillStyle = '#2a1712'; c.beginPath(); c.ellipse(cx2, cy - 6 * k, 21 * k, 24 * k, 0, Math.PI * .95, TAU * 1.02); c.fill(); c.fillRect(cx2 - 21 * k, cy - 6 * k, 8 * k, 34 * k); c.fillRect(cx2 + 13 * k, cy - 6 * k, 8 * k, 34 * k); c.fillStyle = '#e30a17'; c.fillRect(cx2 - 20 * k, cy - 18 * k, 40 * k, 4 * k); }
    else if (who === 'mercan') { c.fillStyle = '#7a1a2a'; c.beginPath(); c.ellipse(cx2, cy - 10 * k, 22 * k, 16 * k, 0, Math.PI, TAU); c.fill(); c.fillRect(cx2 - 22 * k, cy - 10 * k, 6 * k, 30 * k); c.fillRect(cx2 + 16 * k, cy - 10 * k, 6 * k, 30 * k); c.fillStyle = '#111'; c.fillRect(cx2 - 15 * k, cy - 4 * k, 30 * k, 7 * k); c.fillStyle = '#ff5f7a'; c.beginPath(); c.arc(cx2 + 18 * k, cy + 6 * k, 3 * k, 0, TAU); c.fill(); }
    else { c.fillStyle = '#5a5a5a'; c.beginPath(); c.ellipse(cx2, cy - 15 * k, 18 * k, 8 * k, 0, Math.PI, TAU); c.fill(); c.fillStyle = '#3a2a1a'; c.fillRect(cx2 - 11 * k, cy + 7 * k, 22 * k, 5 * k); }
    c.fillStyle = '#111'; if (who !== 'mercan') { c.fillRect(cx2 - 9 * k, cy - 2 * k, 5 * k, 3 * k); c.fillRect(cx2 + 4 * k, cy - 2 * k, 5 * k, 3 * k); }
    c.restore();
  }
  function drawSay() {
    const s = S.say, ln = s.lines[s.i]; if (!ln) return; uiHits = [];
    const [who, text] = ln, sm = W < 600, NAMES = { kerem: 'Kerem Yalçın', ela: 'Ela Yalçın', mercan: 'Mercan Sarıca', harun: 'Komiser Harun Demir' }, COLS = { kerem: '#ff6b5e', ela: '#ff9ad5', mercan: '#39f3ff', harun: '#ffd23a' };
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, 0, W, H); c.fillStyle = '#000'; c.fillRect(0, 0, W, H * .08); c.fillRect(0, H * .92, W, H * .08);
    const bw = Math.min(W - 24, 760), bx = W / 2 - bw / 2, bh = sm ? 150 : 170, by = H - bh - H * .1;
    c.fillStyle = 'rgba(12,8,20,.9)'; roundRect(bx, by, bw, bh, 14); c.fill(); c.strokeStyle = COLS[who]; c.lineWidth = 2; c.stroke();
    portrait(bx + 16, by + 16, sm ? 64 : 84, who);
    const tx0 = bx + 16 + (sm ? 64 : 84) + 16;
    txt(NAMES[who], tx0, by + 34, sm ? 16 : 20, COLS[who], 'left', 900);
    c.font = `600 ${sm ? 14 : 17}px system-ui`; wrapT(text, bw - (tx0 - bx) - 16).forEach((l, i) => txt(l, tx0, by + 62 + i * (sm ? 20 : 24), sm ? 14 : 17, '#fff', 'left', 600, false));
    txt(L.ms[S.mission ? S.mission.i : 0].n.toUpperCase(), W / 2, H * .08 - 12, sm ? 14 : 18, '#ffd23a', 'center', 900, false);
    txt(L.tap + ' ▸', bx + bw - 14, by + bh - 12, 12, 'rgba(255,255,255,.6)', 'right', 600, false);
  }
  function drawDead() { const a = clamp(S.deadT, 0, 1); c.fillStyle = `rgba(${S.deadKind === 'flat' ? '90,0,10' : '0,10,60'},${a * .5})`; c.fillRect(0, 0, W, H); txt(S.deadKind === 'flat' ? L.flat : L.cuffed, W / 2, H * .45, W < 600 ? 38 : 72, S.deadKind === 'flat' ? '#ff4f5e' : '#6bb8ff', 'center', 900); if (S.deadT > 1.2) txt(L.tap, W / 2, H * .45 + 44, 15, '#fff', 'center', 700); }
  function drawMap() {
    uiHits = []; c.fillStyle = 'rgba(0,0,0,.85)'; c.fillRect(0, 0, W, H);
    const s = Math.min(W, H) - 70, x = (W - s) / 2, y = (H - s) / 2 + 12; S.mapRect = { x, y, s };
    c.drawImage(mapImage(), x, y, s, s);
    const k = s / (HALF * 2), pt = (p, col, r) => { c.fillStyle = col; c.beginPath(); c.arc(x + (p.x + HALF) * k, y + (p.z + HALF) * k, r, 0, TAU); c.fill(); c.strokeStyle = '#000'; c.lineWidth = 1; c.stroke(); };
    const ref = P.veh || P; pt(ref, '#fff', 6);
    if (!S.mission && save.m < MS.length) pt(MS[save.m].start, '#ff4fa0', 7);
    const tg = stepTarget(); if (tg) pt(tg, '#ffd23a', 7); if (S.wp) pt(S.wp, '#c58bff', 6);
    pt(PL.gunshop, '#ff8a1e', 5); pt(PL.garage, '#ff4fa0', 5); PL.hospitals.forEach(h => pt(h, '#ff4f5e', 5)); pt({ x: -20, z: 120 }, '#4fa3ff', 5); PL.helipads.forEach(h => pt(h, '#ffd23a', 4));
    const lab = (key, px, pz) => txt(L.dist[key], x + (px + HALF) * k, y + (pz + HALF) * k, 13, '#ffd23a', 'center', 800);
    lab('lev', -500, -800); lab('bes', -150, -450); lab('bey', -250, 100); lab('tar', -250, 640); lab('bal', -800, 560); lab('bey2', 600, -400); lab('usk', 550, 450); lab('kad', 600, 900); lab('bog', bxz(-100), -100); lab('hal', -600, 400); lab('mar', -300, 950);
    txt(L.mapHelp, W / 2, y - 12, 14, '#fff', 'center', 700);
  }
  function drawPause() {
    uiHits = []; c.fillStyle = 'rgba(0,0,0,.7)'; c.fillRect(0, 0, W, H); txt(L.paused, W / 2, H * .3, 40, '#ff9ad5', 'center', 900);
    const bw = Math.min(300, W - 40), x = W / 2 - bw / 2; let y = H * .3 + 30;
    button(L.resume, x, y, bw, 48, togglePause, true); y += 58;
    button(save.mute ? L.soundOff : L.soundOn, x, y, bw, 44, () => { audio.setMute(!save.mute); store(); }); y += 54;
    button(save.q === 'high' ? L.qHigh : L.qLow, x, y, bw, 44, () => { save.q = save.q === 'high' ? 'low' : 'high'; store(); location.reload(); }); y += 54;
    button(L.quit, x, y, bw, 44, () => { audio.suspend(false); if (S.mission) failMission('', true); S.banner = null; if (P.veh) exitVeh(true); audio.radio(false); store(); S.mode = 'menu'; });
  }

  /* ---------- loop ---------- */
  document.addEventListener('pointerlockerror', () => { S.lockFail = true; });
  let last = performance.now(), raf = 0, saveT = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!wrap.isConnected) { destroy(); return; }
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (S.mode === 'menu' || S.mode === 'list') { S.t += dt; stepFerries(dt); }
    else { const n = dt > .03 ? 2 : 1; for (let i = 0; i < n; i++) update(dt / n); }
    saveT += dt; if (saveT > 6 && S.mode === 'play') { saveT = 0; store(); }
    try {
      lightUpdate(); placeCamera(dt); sync(dt);
      sky.position.copy(camera.position);
      if (!S.noRender) renderer.render(scene, camera);
      c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, W, H);
      if (S.mode === 'menu' || S.mode === 'list') drawMenu();
      else { drawHUD(); if (S.mode === 'map') drawMap(); if (S.mode === 'say') drawSay(); if (S.mode === 'dead') drawDead(); if (S.mode === 'pause') drawPause(); }
    } catch (e) { if (!S.err) { S.err = 1; console.error(e); } }
  }
  raf = requestAnimationFrame(frame);
  function destroy() { cancelAnimationFrame(raf); removeEventListener('keydown', kd); removeEventListener('keyup', ku); document.removeEventListener('visibilitychange', vis); if (ro) ro.disconnect(); renderer.dispose(); }
  return {
    S, P, get V() { return V; }, get peds() { return peds; }, Wd, PL, MS, save, scene, camera, renderer,
    play, startMission, advanceSay, nextStep, setWanted: n => { S.wanted = n; S.hidden = 0; }, enterVeh, exitVeh, teleport, update, keys, mkVeh, mkPed, destroy,
    probe: () => { const cam = camera.position, [dx, dy, dz] = camFwd(); return rayHit(cam.x, cam.y, cam.z, dx, dy, dz, 110, P); },
    shoot: () => { const cam = camera.position, [dx, dy, dz] = camFwd(); shootFrom(P, cam.x, cam.y, cam.z, dx, dy, dz, P.weapon); }
  };
}

global.IstanbulHeat = { mount };
})(window);
