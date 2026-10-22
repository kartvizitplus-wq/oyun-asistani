/* Browser UI for the game tools. Expects window.APP = {lang, game, kind, t, data, itemsTr}, window.Engine and window.Icons. */
(function () {
  const A = window.APP, E = window.Engine, I = window.Icons;
  if (!A || !A.kind || !E || !I) return;
  const T = A.t;
  const $ = id => document.getElementById(id);
  const t = (k, v) => { let s = T[k] || k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  const itemName = i => i.startsWith('#') ? t(i.slice(1)) : ((A.lang === 'tr' && A.itemsTr && A.itemsTr[i]) || i);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const el = (tag, attrs, html) => { const x = document.createElement(tag); for (const k in attrs || {}) x.setAttribute(k, attrs[k]); if (html != null) x.innerHTML = html; return x; };
  const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';
  const KEY = 'pick-' + A.game;
  const speak = text => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = T.speechLang; u.rate = 1.05;
      const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith(T.speechLang.slice(0, 2)));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  const load = def => { try { return Object.assign(def, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return def; } };
  const save = st => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  function teamBlock(title, names, showWarn) {
    const tm = E.mlTeam(A.data, names);
    const tot = tm.P + tm.M || 1, pp = Math.round(tm.P / tot * 100);
    const roles = E.ROLES.map(r => '<span class="rolechip' + (tm.roles[r] ? ' on' : '') + '" title="' + esc(t('role_' + r)) + '">' + I.talent(r.charAt(0).toUpperCase() + r.slice(1), 22) + '<small>' + esc(t('role_' + r)) + (tm.roles[r] > 1 ? ' ×' + tm.roles[r] : '') + '</small></span>').join('');
    return '<div class="team"><b>' + esc(title) + '</b>' +
      '<div class="dmgbar" role="img" aria-label="' + esc(t('dmgPhys')) + ' ' + pp + '%, ' + esc(t('dmgMag')) + ' ' + (100 - pp) + '%"><span class="p" style="width:' + (names.length ? pp : 50) + '%"></span><span class="m" style="width:' + (names.length ? 100 - pp : 50) + '%"></span></div>' +
      '<div class="dmglabels"><span>' + esc(t('dmgPhys')) + ' ' + (names.length ? pp + '%' : '–') + '</span><span>' + esc(t('dmgMag')) + ' ' + (names.length ? (100 - pp) + '%' : '–') + '</span></div>' +
      '<div class="roles">' + roles + '</div>' +
      (showWarn && tm.warn.length ? '<ul class="warn">' + tm.warn.map(k => '<li class="' + (k === 'wa_ok' ? 'ok' : '') + '">' + esc(t(k)) + '</li>').join('') + '</ul>' : '') + '</div>';
  }
  const chipOf = (n, role, cls) => el('button', { class: 'chip ' + (cls || ''), type: 'button' }, I.hero(n, role, 18) + '<span>' + esc(n) + '</span>');
  if (A.kind === 'draft') return draftTool();
  if (A.kind === 'ff') return ffTool();

  /* ---------- MOBA and Brawl Stars tools ---------- */
  const isMoba = A.kind === 'moba';
  const list = isMoba ? A.data.heroes : A.data.brawlers;
  const all = list.map(h => h.n);
  const roleOf = Object.fromEntries(list.map(h => [h.n, isMoba ? h.r : h.c]));
  const wrOf = Object.fromEntries(list.filter(h => h.wr).map(h => [h.n, h.wr]));
  const maxEnemy = isMoba ? 5 : 3;
  const st = load({ e: [], a: [], side: 'e', pool: [], hero: null, mode: 'gem', rf: '', lane: '' });
  const lanesOf = Object.fromEntries(list.map(h => [h.n, h.lanes || []]));
  const LANES = A.data.lanes || [];
  if (st.lane && !LANES.includes(st.lane)) st.lane = '';
  st.e = (st.e || []).filter(n => all.includes(n));
  st.a = isMoba ? (st.a || []).filter(n => all.includes(n)) : [];
  if (!isMoba) st.side = 'e';
  const maxAlly = 4;
  st.pool = (st.pool || []).filter(n => all.includes(n));
  const qp = new URLSearchParams(location.search).get('e');
  if (qp && all.includes(qp)) st.e = [qp];
  let example = false;
  if (!st.e.length && !qp && A.example) { st.e = A.example.filter(n => all.includes(n)); example = true; }
  const chip = (n, cls) => el('button', { class: 'chip ' + (cls || ''), type: 'button' }, I.hero(n, roleOf[n], 18) + '<span>' + esc(n) + '</span>');

  function slotRow(id, arr, max, cls) {
    const sl = $(id); if (!sl) return; sl.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const n = arr[i];
      const b = el('button', { class: 'slot' + (n ? ' ' + cls : ''), type: 'button' }, n ? I.hero(n, roleOf[n], 26) + '<span>' + esc(n) + '</span>' : esc(t('emptySlot')));
      if (n) b.onclick = () => { arr.splice(i, 1); example = false; update(); };
      sl.appendChild(b);
    }
  }
  function renderSlots() {
    slotRow('slots', st.e, maxEnemy, 'on');
    slotRow('aslots', st.a, maxAlly, 'ally');
    const se = $('sideE'), sa = $('sideA');
    if (se) { se.setAttribute('aria-pressed', st.side === 'e'); sa.setAttribute('aria-pressed', st.side === 'a'); }
  }
  const target = () => st.side === 'a' ? st.a : st.e;
  const targetMax = () => st.side === 'a' ? maxAlly : maxEnemy;
  function renderRoleFilter() {
    const box = $('rf'); if (!box) return;
    const roles = [...new Set(list.map(h => isMoba ? h.r : h.c))];
    box.innerHTML = '';
    [['', t('rfAll')], ...roles.map(r => [r, isMoba ? t('role_' + r) : t('cl_' + r)])].forEach(([k, label]) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(st.rf === k) }, (k ? I.talent(k.charAt(0).toUpperCase() + k.slice(1), 16) : '') + '<span>' + esc(label) + '</span>');
      b.onclick = () => { st.rf = k; save(st); renderRoleFilter(); renderPool(); };
      box.appendChild(b);
    });
  }
  function renderLanes() {
    const box = $('laneSeg'); if (!box || !LANES.length) return;
    box.innerHTML = '';
    [['', t('laneAll')], ...LANES.map(l => [l, t('ln_' + l)])].forEach(([k, label]) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(st.lane === k) }, esc(label));
      b.onclick = () => { st.lane = k; update(); };
      box.appendChild(b);
    });
  }
  function renderPool() {
    const q = $('q').value.trim().toLowerCase(), p = $('pool'); p.innerHTML = '';
    all.filter(n => (!q || n.toLowerCase().includes(q)) && (!st.rf || roleOf[n] === st.rf)).forEach(n => {
      const b = chip(n);
      b.disabled = st.e.includes(n) || st.a.includes(n) || target().length >= targetMax();
      b.onclick = () => { target().push(n); $('q').value = ''; example = false; update(); };
      p.appendChild(b);
    });
  }
  let poolOpen = false;
  function renderMyPool() {
    const n = st.pool.length;
    $('poolHint').textContent = n ? t('poolCount', { n }) : t('poolEmpty');
    $('poolcard').classList.toggle('empty', !n);
    const sel = $('poolSel'); sel.innerHTML = '';
    st.pool.forEach(x => sel.appendChild(el('span', { class: 'tierlink' }, I.hero(x, roleOf[x], 20) + '<span>' + esc(x) + '</span>')));
    const pm = $('poolMode'); pm.innerHTML = ''; pm.hidden = !n;
    [[true, t('poolOnly')], [false, t('poolAll')]].forEach(([k, label]) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(st.poolOnly !== false ? k : !k) }, esc(label));
      b.onclick = () => { st.poolOnly = k; update(); };
      pm.appendChild(b);
    });
    $('poolPicker').hidden = !poolOpen;
    $('poolEdit').textContent = poolOpen ? t('poolDone') : t('poolEdit');
    if (!poolOpen) return;
    const q = $('pq').value.trim().toLowerCase(), p = $('mypool'); p.innerHTML = '';
    all.filter(x => !q || x.toLowerCase().includes(q)).forEach(x => {
      const on = st.pool.includes(x), b = chip(x, on ? 'mine' : '');
      b.setAttribute('aria-pressed', on);
      b.onclick = () => { st.pool = on ? st.pool.filter(y => y !== x) : [...st.pool, x]; update(); };
      p.appendChild(b);
    });
  }
  const activePool = () => st.poolOnly === false ? [] : st.pool;
  function whyText(w) {
    if (typeof w === 'string') return t(w);
    if (w.k === 'bw_counter') return t('bw_counter', { cls: t('cl_' + w.cls) });
    if (w.k === 'bw_mode') return t('bw_mode', { mode: t('m_' + w.mode) });
    if (w.k === 'w_countered') return t('w_countered', { x: w.x });
    return t(w.k);
  }
  let lastPicks = [];
  function renderPicks() {
    const pk = $('picks'); pk.innerHTML = '';
    if (!st.e.length) { pk.innerHTML = '<p class="note">' + esc(t('noEnemy')) + '</p>'; lastPicks = []; return; }
    let res = isMoba ? E.mlScore(A.data, st.e, activePool(), st.a) : E.bsScore(A.data, st.e, st.mode, activePool());
    if (st.lane) res = res.filter(r => (lanesOf[r.n] || []).includes(st.lane));
    lastPicks = res.slice(0, 6);
    lastPicks.forEach((r, i) => {
      const d = el('div', { class: 'pick' });
      const role = isMoba ? t('role_' + r.r) : t('cl_' + r.c);
      const why = r.why.length ? [...new Set(r.why.map(whyText))].join(' · ') : t('neutral');
      d.innerHTML = I.hero(r.n, roleOf[r.n], 36) + '<span class="pmain"><span><span class="score ' + scoreCls(r.s) + '">' + r.s.toFixed(1) + '</span> <b>' + esc(r.n) + '</b> <span class="role">' + esc(role) + (i === 0 ? ' · ' + esc(t('bestChoice')) : '') + '</span>' + (wrOf[r.n] ? ' <span class="wr" title="' + esc(A.data.wrSource ? A.data.wrSource.name + ' · ' + A.data.wrSource.date : '') + '">' + esc(t('srcShort', { p: wrOf[r.n].toFixed(1) })) + '</span>' : '') + '</span><span class="why">' + esc(why) + '</span></span>' +
        (isMoba ? '<button class="use" type="button">' + esc(t('buildTitle')) + '</button>' : '');
      if (isMoba) d.querySelector('button').onclick = () => { st.hero = r.n; update(); $('buildsec').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pk.appendChild(d);
    });
  }
  function renderBans() {
    const box = $('bans'); if (!box) return;
    const mine = [...new Set([...st.a, ...st.pool])];
    const bans = E.mlBans(A.data, mine, [...st.e, ...st.a]);
    box.innerHTML = (mine.length ? '' : '<p class="note">' + esc(t('banHint')) + '</p>') + bans.map(b => {
      const why = [b.hits.length ? t('ban_vs', { x: b.hits.join(', ') }) : '', b.meta ? t('ban_meta') : '', !b.hits.length && !b.meta ? t('ban_gen') : ''].filter(Boolean).join(' · ');
      return '<div class="pick">' + I.hero(b.n, roleOf[b.n], 36) + '<span class="pmain"><span><b>' + esc(b.n) + '</b> <span class="role">' + esc(t('role_' + b.r)) + '</span></span><span class="why">' + esc(why) + '</span></span><span class="banx" aria-hidden="true">✕</span></div>';
    }).join('');
  }
  function renderReport() {
    const box = $('report'); if (!box || A.kind !== 'moba') return;
    const hero = currentHero();
    $('reportHint').textContent = t('reportHint', { h: hero });
    $('reportMsg').textContent = '';
    renderBadge();
  }
  const RKEY = 'reports-' + A.game;
  const reportCount = () => { try { return +localStorage.getItem(RKEY) || 0; } catch (e) { return 0; } };
  let lastReported = '';
  function renderBadge() {
    const box = $('badge'); if (!box) return;
    const n = reportCount();
    if (!n) { box.textContent = ''; return; }
    const tiers = [[50, 'b50'], [20, 'b20'], [5, 'b5'], [1, 'b1']], cur = tiers.find(([k]) => n >= k), next = [1, 5, 20, 50].find(k => k > n);
    box.innerHTML = '<b>' + esc(t(cur[1])) + '</b> · ' + esc(t('badgeCount', { n })) + (next ? ' ' + esc(t('badgeNext', { n: next })) : '');
  }
  async function sendReport(result) {
    const msg = $('reportMsg'), key = currentHero() + '|' + st.e.join(',');
    if (key === lastReported) { msg.textContent = t('reportSent'); return; }
    try {
      const r = await fetch('/api/vote', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ game: A.game, hero: currentHero(), enemy: st.e, result }) });
      if (r.ok) { lastReported = key; try { localStorage.setItem(RKEY, String(reportCount() + 1)); } catch (e) {} renderBadge(); }
      msg.textContent = r.ok ? t('thanks') : t('reportFail');
    } catch (e) { msg.textContent = t('reportFail'); }
  }
  function renderTeam() {
    const box = $('team'); if (!box) return;
    box.innerHTML = teamBlock(t('allySide'), st.a, true) + teamBlock(t('enemySide'), st.e, false);
  }
  const emblemText = em => em.set ? t('emblemTitle') + ': ' + [em.set, em.t1, em.t2, em.core].filter(Boolean).join(' · ') + (em.coreAdapt ? ' (' + t('adapted') + ')' : '')
    : t('runeTitle') + ': ' + em.core;
  function renderEmblem(em) {
    const box = $('emblem'), head = $('emblemHead');
    if (!box) return;
    box.innerHTML = '';
    head.hidden = box.hidden = !em;
    if (!em) return;
    head.textContent = em.arcana ? t('arcanaTitle') : em.set ? t('emblemTitle') : t('runeTitle');
    const parts = em.arcana ? em.arcana.map(a => ['arcanaSlot', a]) : em.set ? [['em_set', em.set], ['em_t1', em.t1], ['em_t2', em.t2], ['em_core', em.core, em.coreAdapt]] : [['runeTitle', em.core]];
    parts.filter(p => p[1]).forEach(([k, v, ad]) => {
      const li = el('li', { class: ad ? 'adapt' : '' }, I.talent(v, 32) + '<span class="iname">' + esc(v) + '<small class="why">' + esc(ad ? t('adapted') : t(k)) + '</small></span>');
      box.appendChild(li);
    });
  }
  const currentHero = () => (st.hero && all.includes(st.hero)) ? st.hero : (lastPicks[0] ? lastPicks[0].n : all[0]);
  function renderBuild() {
    const hero = currentHero(), sel = $('heroSel');
    if (!sel.options.length) all.forEach(n => sel.appendChild(el('option', { value: n }, esc(n))));
    sel.value = hero;
    $('heroIcon').innerHTML = I.hero(hero, roleOf[hero], 44);
    const mbox = $('myMatch');
    if (mbox) {
      if (!st.e.length) mbox.innerHTML = '<p class="note" style="margin:0">' + esc(t('mm_none')) + '</p>';
      else {
        const m = E.mlMatchup(A.data, hero, st.e);
        const lines = [...m.bad.map(p => '<li class="bad">' + esc(t('mm_bad', { x: p.n })) + (p.bad.length ? ': ' + esc([...new Set(p.bad.map(k => t(k)))].join(' · ')) : '') + '</li>'),
          ...m.good.map(p => '<li class="good">' + esc(t('mm_good', { x: p.n })) + (p.good.length ? ': ' + esc([...new Set(p.good.map(k => t(k)))].join(' · ')) : '') + '</li>')];
        mbox.innerHTML = '<div class="score-row"><span><b>' + esc(t('myMatch')) + '</b> <span class="big ' + scoreCls(m.s) + '">' + m.s.toFixed(1) + '</span></span></div>' + (lines.length ? '<ul class="mm">' + lines.join('') + '</ul>' : '<p class="note">' + esc(t('neutral')) + '</p>');
      }
    }
    const b = E.mlBuild(A.data, hero, st.e), bl = $('build'); bl.innerHTML = '';
    b.items.forEach(x => {
      const li = el('li', { class: x.adapt ? 'adapt' : '' });
      const name = itemName(x.item);
      const label = x.adapt ? t(x.reason || 'adapted') : (x.slot === 'boots' ? t('boots') : t('core'));
      li.innerHTML = I.item(x.item, 30) + '<span class="iname">' + esc(name) + (name !== x.item && !x.item.startsWith('#') ? '<small class="en">' + esc(x.item) + '</small>' : '') + '<small class="why">' + esc(label) + '</small></span>';
      bl.appendChild(li);
    });
    $('partial').hidden = !b.partial;
    const tl = $('tips'); tl.innerHTML = '';
    const sp = itemName(b.spell);
    renderEmblem(b.emblem);
    [t('spell') + ': ' + sp + (sp !== b.spell ? ' (' + b.spell + ')' : ''), ...(st.e.length ? E.mlTips(A.data, st.e).map(k => t(k)) : [])]
      .forEach(s => tl.appendChild(el('li', {}, esc(s))));
  }
  function renderBsTips() {
    const tl = $('tips'); tl.innerHTML = '';
    const top = lastPicks[0];
    if (top) tl.appendChild(el('li', {}, '<b>' + esc(t('bp_tip', { cls: t('cl_' + top.c) })) + ':</b> ' + esc(t('bt_' + top.c))));
    const gear = top && A.data.gears && A.data.gears[top.c];
    if (gear) tl.appendChild(el('li', {}, '<b>' + esc(t('gearTitle')) + ' (' + esc(top.n) + '):</b> ' + esc(gear.join(' + '))));
  }
  function renderModes() {
    const m = $('modes');
    if (!m.children.length) Object.keys(E.BS_MODES).forEach(k => {
      const b = el('button', { type: 'button', 'data-m': k }, esc(t('m_' + k)));
      b.onclick = () => { st.mode = k; update(); };
      m.appendChild(b);
    });
    [...m.children].forEach(b => b.setAttribute('aria-pressed', b.dataset.m === st.mode));
  }
  function update() {
    renderSlots(); renderRoleFilter(); renderLanes(); renderPool(); renderMyPool();
    if (!isMoba) renderModes();
    renderPicks();
    if (isMoba) { renderTeam(); renderBans(); renderBuild(); renderReport(); } else renderBsTips();
    $('example').hidden = !example;
    save(st);
  }
  function speechText() {
    if (!st.e.length) return t('noEnemy');
    const parts = [];
    if (lastPicks[0]) parts.push(t('say_best', { x: lastPicks[0].n }));
    if (isMoba) {
      const hero = currentHero(), b = E.mlBuild(A.data, hero, st.e);
      if (b.items.length) parts.push(t('say_build', { h: hero, items: b.items.map(x => itemName(x.item)).join(', ') }));
      if (b.emblem) parts.push(t('say_emblem', { e: (b.emblem.arcana || [b.emblem.set, b.emblem.t1, b.emblem.t2, b.emblem.core]).filter(Boolean).join(', ') }));
      parts.push(t('say_spell', { s: itemName(b.spell) }));
      parts.push(t(E.mlTips(A.data, st.e)[0]));
    } else if (lastPicks[0]) { parts.push(t('bt_' + lastPicks[0].c)); const g = A.data.gears && A.data.gears[lastPicks[0].c]; if (g) parts.push(t('gearTitle') + ': ' + g.join(', ') + '.'); }
    return parts.join(' ');
  }
  /* Voice input: say hero names, matched against the hero list (Web Speech API, runs in the browser). */
  const norm = x => x.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  function matchNames(text) {
    const words = text.toLowerCase().split(/[\s,.;]+/).filter(Boolean), found = [];
    const names = all.map(n => [n, norm(n), n.split(/[\s-]+/).length]);
    for (let i = 0; i < words.length; i++) {
      let best = null;
      for (const [n, nn, k] of names) for (let w = Math.min(k + 1, 3); w >= 1; w--) {
        const chunk = norm(words.slice(i, i + w).join(''));
        if (!chunk) continue;
        const dist = chunk === nn ? 0 : (nn.length >= 4 ? lev(chunk, nn) : 9);
        const ok = dist === 0 || (dist <= 1 && nn.length >= 4) || (dist <= 2 && nn.length >= 7);
        if (ok && (!best || dist < best.d || (dist === best.d && w > best.w))) best = { n, d: dist, w };
      }
      if (best) { if (!found.includes(best.n)) found.push(best.n); i += best.w - 1; }
    }
    return found;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const mic = $('micBtn');
  if (mic && SR) {
    mic.hidden = false;
    mic.onclick = () => {
      const msg = $('voiceMsg'), rec = new SR();
      rec.lang = T.speechLang; rec.interimResults = false; rec.maxAlternatives = 3;
      msg.textContent = t('voiceListening'); mic.classList.add('rec');
      rec.onresult = ev => {
        const alts = [...ev.results[0]].map(r => r.transcript);
        let found = [];
        for (const a of alts) { const f = matchNames(a); if (f.length > found.length) found = f; }
        const room = targetMax() - target().length;
        const add = found.filter(n => !st.e.includes(n) && !st.a.includes(n)).slice(0, Math.max(0, room));
        add.forEach(n => target().push(n));
        example = false; update();
        msg.textContent = t('voiceHeard', { t: alts[0] }) + ' · ' + (add.length ? t('voiceAdded', { x: add.join(', ') }) : t('voiceNone'));
      };
      rec.onerror = () => { msg.textContent = t('voiceErr'); };
      rec.onend = () => mic.classList.remove('rec');
      try { rec.start(); } catch (e) { msg.textContent = t('voiceErr'); mic.classList.remove('rec'); }
    };
  }
  $('speak').onclick = () => speak(speechText());
  $('clear').onclick = () => { st.e = []; st.a = []; example = false; update(); };
  if ($('winBtn')) { $('winBtn').onclick = () => sendReport('win'); $('lossBtn').onclick = () => sendReport('loss'); }
  if ($('sideE')) { $('sideE').onclick = () => { st.side = 'e'; update(); }; $('sideA').onclick = () => { st.side = 'a'; update(); }; }
  $('q').oninput = renderPool;
  $('pq').oninput = renderMyPool;
  $('poolEdit').onclick = () => { poolOpen = !poolOpen; renderMyPool(); if (poolOpen) $('pq').focus(); };
  if (isMoba) $('heroSel').onchange = e => { st.hero = e.target.value; update(); };
  update();

  /* ---------- Draft practice vs AI ---------- */
  function draftTool() {
    const D = A.data, heroes = D.heroes, all = heroes.map(h => h.n), roleOf = Object.fromEntries(heroes.map(h => [h.n, h.r]));
    const ORDER = ['B', 'R', 'R', 'B', 'B', 'R', 'R', 'B', 'B', 'R'];
    const OPTS = E.itemOptions(D), EM = D.emblemOptions || null;
    const cfg = load({ dmode: 'ranked', bans: 3 });
    let me, bot, myBans, botBans, phase, step, log, pending, prep;
    const banned = () => [...myBans, ...botBans];
    /* Ranked: nobody can take a banned hero or one already picked by either side. Classic: only your own picks are blocked. */
    const blockedFor = side => cfg.dmode === 'ranked' ? [...banned(), ...me, ...bot] : (side === 'B' ? me : bot);
    function reset() {
      me = []; bot = []; myBans = []; botBans = []; step = 0; log = []; pending = false; prep = null;
      phase = cfg.dmode === 'ranked' ? 'ban' : 'pick';
      save(cfg); render();
    }
    const banOrder = () => Array.from({ length: cfg.bans * 2 }, (_, i) => i % 2 ? 'R' : 'B');
    function slots(id, arr, n, cls) {
      const box = $(id); box.innerHTML = '';
      for (let i = 0; i < n; i++) { const x = arr[i]; box.appendChild(el('div', { class: 'slot' + (x ? ' ' + cls : '') }, x ? I.hero(x, roleOf[x], 26) + '<span>' + esc(x) + '</span>' : esc(t('emptySlot')))); }
    }
    function seg(id, items, cur, on) {
      const box = $(id); box.innerHTML = '';
      items.forEach(([k, label]) => { const b = el('button', { type: 'button', 'aria-pressed': String(k) === String(cur) }, esc(label)); b.onclick = () => on(k); box.appendChild(b); });
    }
    function botAct() {
      if (pending) return; pending = true;
      $('status').textContent = phase === 'ban' ? t('botBanning') : t('draftTurnBot');
      setTimeout(() => {
        pending = false;
        if (phase === 'ban') {
          const b = E.botBan(D, [...banned(), ...me, ...bot]);
          botBans.push(b.n); log.unshift(t('botBanned', { x: b.n }));
        } else {
          const p = E.mlBotPick(D, me, bot, blockedFor('R'));
          bot.push(p.n); log.unshift(t('botPicked', { x: p.n }) + (p.why.filter(k => typeof k === 'string').length ? ': ' + [...new Set(p.why.filter(k => typeof k === 'string').map(k => t(k)))].slice(0, 2).join(' · ') : ''));
        }
        advance();
      }, 600);
    }
    function advance() {
      step++;
      if (phase === 'ban' && step >= banOrder().length) { phase = 'pick'; step = 0; }
      else if (phase === 'pick' && step >= ORDER.length) { phase = 'done'; prep = null; }
      render();
    }
    function userChoose(n) {
      if (phase === 'ban') myBans.push(n); else me.push(n);
      $('q').value = ''; advance();
    }
    function render() {
      seg('dmodeSeg', [['ranked', t('dRanked')], ['classic', t('dClassic')]], cfg.dmode, k => { cfg.dmode = k; reset(); });
      seg('banSeg', [[3, '3'], [5, '5']], cfg.bans, k => { cfg.bans = k; reset(); });
      $('banRow').hidden = cfg.dmode !== 'ranked';
      $('classicNote').hidden = cfg.dmode === 'ranked';
      $('banBox').hidden = cfg.dmode !== 'ranked';
      slots('dmeBan', myBans, cfg.bans, 'banned'); slots('dbotBan', botBans, cfg.bans, 'banned');
      slots('dme', me, 5, 'ally'); slots('dbot', bot, 5, 'on');
      $('dlog').innerHTML = log.slice(0, 4).map(l => '<li>' + esc(l) + '</li>').join('');
      const order = phase === 'ban' ? banOrder() : ORDER;
      const done = phase === 'done', myTurn = !done && order[step] === 'B';
      $('status').textContent = done ? t('draftDone') : myTurn ? (phase === 'ban' ? t('phaseBan') : t('draftTurnYou')) : (phase === 'ban' ? t('botBanning') : t('draftTurnBot'));
      $('pickbox').hidden = done;
      /* While it is the AI's turn, keep the list readable: only taken/banned heroes are greyed out. */
      const blocked = phase === 'ban' ? [...banned(), ...me, ...bot] : blockedFor('B');
      const q = $('q').value.trim().toLowerCase(), pool = $('pool'); pool.innerHTML = '';
      all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
        const tag = banned().includes(n) ? 'isbanned' : me.includes(n) ? 'ismine' : bot.includes(n) ? 'isbot' : '';
        const b = chipOf(n, roleOf[n], tag); b.disabled = blocked.includes(n) || !myTurn;
        if (!myTurn && !blocked.includes(n)) b.classList.add('wait');
        if (tag) b.insertAdjacentHTML('beforeend', '<span class="ctag">' + esc(tag === 'isbanned' ? 'BAN' : tag === 'ismine' ? t('draftYou') : t('draftBot')) + '</span>');
        if (blocked.includes(n)) b.title = tag === 'isbanned' ? 'BAN' : t('draftBot');
        b.onclick = () => userChoose(n); pool.appendChild(b);
      });
      $('suggHead').textContent = phase === 'ban' ? t('banSugg') : t('suggestForYou');
      const sg = $('sugg'); sg.innerHTML = '';
      if (myTurn) {
        const list = phase === 'ban'
          ? (me.length ? E.mlBans(D, me, blocked).map(x => x.n) : []).concat(E.banRank(D, blocked).map(x => x.n))
          : E.mlScore(D, bot, null, me).map(x => x.n);
        [...new Set(list)].filter(n => !blocked.includes(n)).slice(0, 3).forEach(n => {
          const b = chipOf(n, roleOf[n], 'mine'); b.onclick = () => userChoose(n); sg.appendChild(b);
        });
      }
      renderResult(done);
      if (!done && !myTurn) botAct();
    }
    /* ----- match prep: items and emblem ----- */
    function initPrep(hero) {
      const rec = E.mlBuild(D, hero, bot);
      prep = { hero, items: rec.items.map(x => x.item).concat(Array(6).fill(null)).slice(0, 6), emblem: Object.assign({}, rec.emblem || {}), slot: null };
    }
    function renderPrep() {
      if (!prep || !me.includes(prep.hero)) initPrep(me[0]);
      const box = $('prep');
      const sel = '<select class="lang" id="prepHero" aria-label="' + esc(t('prepHero')) + '">' + me.map(n => '<option' + (n === prep.hero ? ' selected' : '') + '>' + esc(n) + '</option>').join('') + '</select>';
      const items = prep.items.map((it, i) => '<li class="' + (prep.slot === i ? 'adapt' : '') + '"><button type="button" class="slotbtn" data-i="' + i + '">' + (it ? I.item(it, 30) + '<span class="iname">' + esc(itemName(it)) + '<small class="why">' + esc(E.itemReasons(D, it).map(r => t(r)).join(' · ') || t('core')) + '</small></span>' : '<span class="iname">+ ' + esc(t('pickItemFor', { n: i + 1 })) + '</span>') + '</button></li>').join('');
      let emHtml = '';
      if (EM) {
        const keys = Object.keys(EM);
        emHtml = '<h2 style="margin:16px 0 10px">' + esc(EM.set ? t('emblemTitle') : t('runeTitle')) + '</h2><div class="emsel">' + keys.map(k =>
          '<label><span class="note">' + esc(k === 'core' && !EM.set ? t('runeTitle') : t('em_' + k)) + '</span><span class="emrow">' + I.talent(prep.emblem[k] || '', 26) + '<select class="lang" data-k="' + k + '">' + EM[k].map(o => '<option' + (o === prep.emblem[k] ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select></span></label>').join('') + '</div>';
      }
      const sc = E.buildScore(D, prep.hero, bot, prep.items, EM ? prep.emblem : null);
      const fit = '<div class="score-row" style="margin-top:14px"><span><b>' + esc(t('buildFit')) + '</b> <span class="big ' + (sc.score >= 70 ? 'good' : sc.score >= 45 ? 'mid' : 'bad') + '">' + sc.score + '</span></span></div>' +
        (sc.missing.length ? '<ul class="warn">' + sc.missing.map(r => '<li>' + esc(t('missing', { x: t(r) })) + '</li>').join('') + '</ul>' : '<ul class="warn"><li class="ok">' + esc(t('buildGood')) + '</li></ul>');
      const picker = prep.slot != null ? '<div class="card" style="margin-top:10px"><p class="note" style="margin:0 0 8px">' + esc(t('pickItemFor', { n: prep.slot + 1 })) + '</p><div class="pool" style="max-height:240px">' +
        OPTS.map(o => '<button type="button" class="chip itemopt" data-o="' + esc(o) + '">' + I.item(o, 18) + '<span>' + esc(itemName(o)) + '</span></button>').join('') + '</div><button class="btn ghost" type="button" id="pickCancel" style="margin-top:8px">' + esc(t('cancel')) + '</button></div>' : '';
      box.innerHTML = '<h2>' + esc(t('prepTitle')) + '</h2><p class="note">' + esc(t('prepHint')) + '</p><div class="heroline" style="margin-bottom:12px">' + I.hero(prep.hero, roleOf[prep.hero], 40) + sel +
        '<button class="btn ghost" type="button" id="autoFill">' + esc(t('autoFill')) + '</button></div><ol class="build">' + items + '</ol>' + picker + emHtml + fit;
      $('prepHero').onchange = e => { initPrep(e.target.value); renderResult(true); };
      $('autoFill').onclick = () => { initPrep(prep.hero); renderResult(true); };
      box.querySelectorAll('.slotbtn').forEach(b => b.onclick = () => { prep.slot = +b.dataset.i; renderResult(true); });
      box.querySelectorAll('.itemopt').forEach(b => b.onclick = () => { prep.items[prep.slot] = b.dataset.o; prep.slot = null; renderResult(true); });
      if ($('pickCancel')) $('pickCancel').onclick = () => { prep.slot = null; renderResult(true); };
      box.querySelectorAll('.emsel select').forEach(s => s.onchange = () => { prep.emblem[s.dataset.k] = s.value; renderResult(true); });
      return sc.score;
    }
    function renderResult(done) {
      const res = $('result'), prepBox = $('prep'), botB = $('botBuilds');
      res.hidden = prepBox.hidden = botB.hidden = !done;
      if (!done) return;
      const myBuild = renderPrep();
      botB.innerHTML = '<h2>' + esc(t('botBuilds')) + '</h2>' + bot.map(n => {
        const b = E.mlBuild(D, n, me);
        return '<div class="botbuild">' + I.hero(n, roleOf[n], 28) + '<b>' + esc(n) + '</b><span class="icons">' + b.items.map(x => '<span title="' + esc(itemName(x.item)) + '">' + I.item(x.item, 24) + '</span>').join('') + '</span></div>';
      }).join('');
      const a = E.mlDraftRating(D, me, bot), b = E.mlDraftRating(D, bot, me);
      const botBuild = Math.round(bot.reduce((s, n) => { const r = E.mlBuild(D, n, me); return s + E.buildScore(D, n, me, r.items.map(x => x.item), r.emblem).score; }, 0) / bot.length);
      const ta = Math.round(a * 0.75 + myBuild * 0.25), tb = Math.round(b * 0.75 + botBuild * 0.25);
      const verdict = Math.abs(ta - tb) <= 2 ? t('draftDraw') : ta > tb ? t('draftWin') : t('draftLose');
      res.innerHTML = '<h2>' + esc(t('draftRating')) + '</h2><div class="score-row"><span><b>' + esc(t('draftYou')) + '</b> <span class="big good">' + a + '</span></span><span><b>' + esc(t('draftBot')) + '</b> <span class="big bad">' + b + '</span></span></div>' +
        '<h2 style="margin-top:14px">' + esc(t('total')) + '</h2><div class="score-row"><span><b>' + esc(t('draftYou')) + '</b> <span class="big good">' + ta + '</span></span><span><b>' + esc(t('draftBot')) + '</b> <span class="big bad">' + tb + '</span></span></div>' +
        '<p class="lead" style="margin:6px 0 14px">' + esc(verdict) + '</p><div class="teams">' + teamBlock(t('allySide'), me, true) + teamBlock(t('enemySide'), bot, false) + '</div>';
    }
    $('q').oninput = render;
    $('again').onclick = reset;
    reset();
  }

  /* ---------- Free Fire tool ---------- */
  function ffTool() {
    const st = load({ style: 'rush', mode: 'br', threats: [] });
    const qp = new URLSearchParams(location.search).get('c');
    const force = qp && A.data.characters.some(c => c.n === qp) ? qp : null;
    const seg = (id, keys, prefix, getter, setter, multi) => {
      const box = $(id);
      if (!box.children.length) keys.forEach(k => {
        const b = el('button', { type: 'button', 'data-k': k }, esc(t(prefix + k)));
        b.onclick = () => { setter(k); render(); };
        box.appendChild(b);
      });
      [...box.children].forEach(b => b.setAttribute('aria-pressed', multi ? getter().includes(b.dataset.k) : getter() === b.dataset.k));
    };
    function card(c, label) {
      return '<div class="pick">' + I.hero(c.n, c.type, 40) + '<span class="pmain"><span><b>' + esc(c.n) + '</b> <span class="role">' + esc(label) + '</span></span><span class="why">' + esc(c.why.map(k => t(k)).join(' · ') || '') + '</span></span><span></span></div>';
    }
    let combo;
    function render() {
      seg('styles', Object.keys(E.FF_STYLE), 'ps_', () => st.style, k => st.style = k);
      seg('ffmodes', Object.keys(E.FF_MODE), 'ff_', () => st.mode, k => st.mode = k);
      seg('threats', Object.keys(E.FF_THREAT), 'th_', () => st.threats, k => st.threats = st.threats.includes(k) ? st.threats.filter(x => x !== k) : [...st.threats, k], true);
      combo = E.ffCombo(A.data, st.style, st.mode, st.threats, force);
      $('combo').innerHTML = card(combo.active, t('activeSkill')) + combo.passives.map(p => card(p, t('passiveSkill'))).join('');
      save(st);
    }
    $('speak').onclick = () => speak(t('say_ff', { a: combo.active.n, p: combo.passives.map(p => p.n).join(', ') }));
    render();
  }
})();

/* Community win rates on hero pages */
(function () {
  const box = document.getElementById('community');
  if (!box) return;
  const T = JSON.parse(box.dataset.t || '{}');
  const f = (s, v) => { for (const k in v) s = s.split('{' + k + '}').join(v[k]); return s; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  fetch('/api/stats?game=' + encodeURIComponent(box.dataset.game) + '&hero=' + encodeURIComponent(box.dataset.hero)).then(r => r.ok ? r.json() : null).then(d => {
    if (!d || !d.ok) return;
    const n = d.wins + d.losses;
    let html = '<h2>' + esc(T.commTitle) + '</h2>';
    if (n < 20) html += '<p class="note">' + esc(T.commFew) + '</p>';
    else {
      html += '<p style="margin:0">' + esc(f(T.commRate, { n, p: Math.round(d.wins / n * 100) })) + '</p>';
      const vs = d.vs.map(v => ({ n: v.n, t: v.wins + v.losses, p: Math.round(v.wins / (v.wins + v.losses) * 100) })).sort((a, b) => b.p - a.p);
      if (vs.length) html += '<ul class="tips">' + vs.slice(0, 6).map(v => '<li>' + esc(f(T.commVs, { x: v.n, p: v.p, n: v.t })) + '</li>').join('') + '</ul>';
    }
    box.innerHTML = html; box.hidden = false;
  }).catch(() => {});
})();

/* Role filter above hero card grids: shown only when this script runs, so the buttons always work. */
(function () {
  document.querySelectorAll('.rolefilter').forEach(box => {
    const grid = box.nextElementSibling;
    if (!grid || !grid.classList.contains('hgrid')) return;
    box.hidden = false;
    box.addEventListener('click', e => {
      const b = e.target.closest('button[data-rf]');
      if (!b) return;
      const r = b.dataset.rf;
      box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      grid.querySelectorAll('.hcard').forEach(c => { c.hidden = !!r && c.dataset.r !== r; });
    });
  });
})();

/* Language picker (all pages) */
(function () {
  const s = document.getElementById('langSel');
  if (s) s.onchange = () => { try { localStorage.setItem('lang', s.value); } catch (e) {} location.href = s.options[s.selectedIndex].dataset.href; };
})();

/* Installable app: register the service worker. */
(function () { try { if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); } catch (e) {} })();
