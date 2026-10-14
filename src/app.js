/* Browser UI for the MLBB and Brawl Stars tools. Expects window.APP = {lang, game, t, data, itemsTr} and window.Engine. */
(function () {
  const A = window.APP, E = window.Engine;
  if (!A || !A.game || !E) return;
  const T = A.t;
  const $ = id => document.getElementById(id);
  const t = (k, v) => { let s = T[k] || k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  const itemName = i => (A.lang === 'tr' && A.itemsTr && A.itemsTr[i]) || i;
  const KEY = 'pick-' + A.game;
  const isML = A.game === 'mlbb';
  const all = isML ? A.data.heroes.map(h => h.n) : A.data.brawlers.map(b => b.n);
  const maxEnemy = isML ? 5 : 3;

  let st = { e: [], pool: [], hero: null, mode: 'gem' };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  st.e = (st.e || []).filter(n => all.includes(n));
  st.pool = (st.pool || []).filter(n => all.includes(n));
  const qp = new URLSearchParams(location.search).get('e');
  if (qp && all.includes(qp)) st.e = [qp];
  let example = false;
  if (!st.e.length && !qp) { st.e = isML ? ['Ling', 'Estes', 'Tigreal', 'Pharsa', 'Claude'] : ['Mortis', 'Piper', 'Bull']; example = true; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  function el(tag, attrs, html) { const x = document.createElement(tag); for (const k in attrs || {}) x.setAttribute(k, attrs[k]); if (html != null) x.innerHTML = html; return x; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  const scoreCls = s => s >= 7 ? 'good' : s >= 5 ? 'mid' : 'bad';

  function renderSlots() {
    const sl = $('slots'); sl.innerHTML = '';
    for (let i = 0; i < maxEnemy; i++) {
      const n = st.e[i];
      const b = el('button', { class: 'slot' + (n ? ' on' : ''), type: 'button', id: 'slot' + i }, esc(n || t('emptySlot')));
      if (n) b.onclick = () => { st.e.splice(i, 1); example = false; update(); };
      sl.appendChild(b);
    }
  }
  function renderPool() {
    const q = $('q').value.trim().toLowerCase(), p = $('pool'); p.innerHTML = '';
    all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
      const b = el('button', { class: 'chip', type: 'button' }, esc(n));
      b.disabled = st.e.includes(n) || st.e.length >= maxEnemy;
      b.onclick = () => { st.e.push(n); $('q').value = ''; example = false; update(); };
      p.appendChild(b);
    });
  }
  function renderMyPool() {
    const q = $('pq').value.trim().toLowerCase(), p = $('mypool'); p.innerHTML = '';
    all.filter(n => !q || n.toLowerCase().includes(q)).forEach(n => {
      const b = el('button', { class: 'chip' + (st.pool.includes(n) ? ' mine' : ''), type: 'button', 'aria-pressed': st.pool.includes(n) }, esc(n));
      b.onclick = () => { st.pool = st.pool.includes(n) ? st.pool.filter(x => x !== n) : [...st.pool, n]; update(); };
      p.appendChild(b);
    });
    $('poolcount').textContent = st.pool.length ? ' (' + st.pool.length + ')' : '';
  }
  function whyText(w) {
    if (typeof w === 'string') return t(w);
    if (w.k === 'bw_counter') return t('bw_counter', { cls: t('cl_' + w.cls) });
    if (w.k === 'bw_mode') return t('bw_mode', { mode: t('m_' + w.mode) });
    return t(w.k);
  }
  let lastPicks = [];
  function renderPicks() {
    const pk = $('picks'); pk.innerHTML = '';
    if (!st.e.length) { pk.innerHTML = '<p class="note">' + esc(t('noEnemy')) + '</p>'; lastPicks = []; return; }
    const list = isML ? E.mlScore(A.data, st.e, st.pool) : E.bsScore(A.data, st.e, st.mode, st.pool);
    lastPicks = list.slice(0, 6);
    lastPicks.forEach((r, i) => {
      const d = el('div', { class: 'pick' });
      const role = isML ? t('role_' + r.r) : t('cl_' + r.c);
      const why = r.why.length ? r.why.map(whyText).filter((v, j, a) => a.indexOf(v) === j).join(' · ') : t('neutral');
      d.innerHTML = '<span class="score ' + scoreCls(r.s) + '">' + r.s.toFixed(1) + '</span><span><b>' + esc(r.n) + '</b> <span class="role">' + esc(role) + (i === 0 ? ' · ' + esc(t('bestChoice')) : '') + '</span></span>' +
        (isML ? '<button class="use" type="button">' + esc(t('buildTitle')) + '</button>' : '<span></span>') +
        '<span class="why">' + esc(why) + '</span>';
      if (isML) d.querySelector('button').onclick = () => { st.hero = r.n; update(); $('buildsec').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      pk.appendChild(d);
    });
  }
  function currentHero() {
    if (st.hero && all.includes(st.hero)) return st.hero;
    if (lastPicks[0]) return lastPicks[0].n;
    return all[0];
  }
  function renderBuild() {
    const hero = currentHero();
    const sel = $('heroSel');
    if (!sel.options.length) all.forEach(n => sel.appendChild(el('option', { value: n }, esc(n))));
    sel.value = hero;
    const b = E.mlBuild(A.data, hero, st.e), bl = $('build'); bl.innerHTML = '';
    b.items.forEach(x => {
      const li = el('li', { class: x.adapt ? 'adapt' : '' });
      const tr = itemName(x.item);
      const label = x.adapt ? t(x.reason || 'adapted') : (x.slot === 'boots' ? t('boots') : t('core'));
      li.innerHTML = esc(tr) + (tr !== x.item ? '<small class="en">' + esc(x.item) + '</small>' : '') + '<small class="why">' + esc(label) + '</small>';
      bl.appendChild(li);
    });
    const tl = $('tips'); tl.innerHTML = '';
    const sp = itemName(b.spell);
    [t('spell') + ': ' + sp + (sp !== b.spell ? ' (' + b.spell + ')' : ''), ...(st.e.length ? E.mlTips(A.data, st.e).map(k => t(k)) : [])]
      .forEach(s => tl.appendChild(el('li', {}, esc(s))));
    return { hero, b };
  }
  function renderBsTips() {
    const tl = $('tips'); tl.innerHTML = '';
    const top = lastPicks[0];
    if (top) tl.appendChild(el('li', {}, '<b>' + esc(t('bp_tip', { cls: t('cl_' + top.c) })) + ':</b> ' + esc(t('bt_' + top.c))));
  }
  function renderModes() {
    const m = $('modes'); if (m.children.length) { [...m.children].forEach(b => b.setAttribute('aria-pressed', b.dataset.m === st.mode)); return; }
    Object.keys(E.BS_MODES).forEach(k => {
      const b = el('button', { type: 'button', 'data-m': k, 'aria-pressed': k === st.mode }, esc(t('m_' + k)));
      b.onclick = () => { st.mode = k; update(); };
      m.appendChild(b);
    });
  }
  function update() {
    renderSlots(); renderPool(); renderMyPool();
    if (!isML) renderModes();
    renderPicks();
    if (isML) renderBuild(); else renderBsTips();
    $('example').hidden = !example;
    save();
  }
  function speechText() {
    if (!st.e.length) return t('noEnemy');
    const parts = [];
    if (lastPicks[0]) parts.push(t('say_best', { x: lastPicks[0].n }));
    if (isML) {
      const hero = currentHero(), b = E.mlBuild(A.data, hero, st.e);
      parts.push(t('say_build', { h: hero, items: b.items.map(x => itemName(x.item)).join(', ') }));
      parts.push(t('say_spell', { s: itemName(b.spell) }));
      parts.push(t(E.mlTips(A.data, st.e)[0]));
    } else if (lastPicks[0]) parts.push(t('bt_' + lastPicks[0].c));
    return parts.join(' ');
  }
  $('speak').onclick = () => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(speechText());
      u.lang = T.speechLang; u.rate = 1.05;
      const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith(T.speechLang.slice(0, 2)));
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    } catch (e) {}
  };
  $('clear').onclick = () => { st.e = []; example = false; update(); };
  $('q').oninput = renderPool;
  $('pq').oninput = renderMyPool;
  if (isML) $('heroSel').onchange = e => { st.hero = e.target.value; update(); };
  update();
})();

/* Language picker (all pages) */
(function () {
  const s = document.getElementById('langSel');
  if (s) s.onchange = () => { try { localStorage.setItem('lang', s.value); } catch (e) {} location.href = s.options[s.selectedIndex].dataset.href; };
})();
