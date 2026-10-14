/* Original, generated icons for heroes and items (no game artwork is used). Shared by the browser and the page generator. */
(function (root) {
  const ROLE = {
    tank: ['#3f6fd1', '#22407e'], fighter: ['#d1793f', '#7a3f1a'], assassin: ['#9b4fd1', '#4f2a75'], mage: ['#3fb3d1', '#1f5f72'],
    marksman: ['#d1b23f', '#6e5c18'], support: ['#4fc28a', '#20603f'], artillery: ['#c95a5a', '#6b2626'], controller: ['#5ac9b0', '#22645a'],
    damage: ['#d15a8a', '#6e2645'], a: ['#e8b44a', '#7a5618'], p: ['#7a8bd1', '#333f7a']
  };
  const GLYPH = {
    boots: 'M7 3h5v9l6 3v5H5v-4l2-1z',
    blade: 'M19 2l3 3-12 12-4 1 1-4zM4 16l4 4-2 2-4-4z',
    shield: 'M12 2l8 3v7c0 5-4 8.5-8 10-4-1.5-8-5-8-10V5z',
    wings: 'M12 13C9 6 4 4 1 5c1 6 5 9 11 9s10-3 11-9c-3-1-8 1-11 8z',
    crystal: 'M12 1l7 11-7 11-7-11z',
    orb: 'M12 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM11 15h2v7h-2z',
    bolt: 'M13 1L3 14h7l-1 9 10-13h-7z',
    tag: 'M3 3h9l9 9-9 9-9-9z'
  };
  const COLOR = { boots: '#9aa6bd', blade: '#e2595b', shield: '#4a9bea', wings: '#e8b44a', crystal: '#6fd0e8', orb: '#a57bf0', bolt: '#e8b44a', tag: '#4fc28a' };
  const KIND = [
    [/boot|shoe|greave|tread|steelcap|lucidity/i, 'boots'],
    [/wing|immortal|angel|redemption|phoenix|guardian/i, 'wings'],
    [/ice|crown|frozen|winter|frost|hourglass|zhonya|glacial/i, 'crystal'],
    [/armor|armour|cuirass|helmet|shield|plate|mail|aegis|omen|thorn|visage|nature|heart|targe|buckler|cape|cloak|sanctuary|stoneplate|jerkin|belt/i, 'shield'],
    [/sword|blade|axe|scythe|halberd|edge|cleaver|roar|reminder|hurricane|rageblade|ghostblade|grudge|regards|sunderer|thirster|dancer|strike|punisher|malmortius|lance|knife|dagger|machete|claw|fury|talker|starbreaker|doomsday|ripper/i, 'blade'],
    [/^(flash|flicker|petrify|vengeance|purify|retribution|punish|execute|ignite|exhaust|heal|smite|barrier|sprint|inspire|aegis)/i, 'bolt'],
    [/^#cat_/, 'tag']
  ];
  const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const initials = n => { const w = n.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)).toUpperCase(); };
  function hero(name, role, size) {
    const s = size || 40, [c1, c2] = ROLE[role] || ['#5a6b8a', '#2a3346'], h = hash(name), id = 'g' + h.toString(36);
    const ang = h % 4, x = 8 + (h % 24), r = 10 + (h % 9);
    const accent = ang === 0 ? `<circle cx="${x}" cy="8" r="${r}" fill="#fff" opacity=".13"/>` :
      ang === 1 ? `<path d="M0 ${26 + (h % 10)}L40 ${10 + (h % 12)}V40H0z" fill="#000" opacity=".18"/>` :
      ang === 2 ? `<path d="M${x} 0l14 0-22 40h-14z" fill="#fff" opacity=".1"/>` :
      `<circle cx="34" cy="${x}" r="${r}" fill="#000" opacity=".15"/>`;
    return `<svg class="ico hero" width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="40" height="40" rx="9" fill="url(#${id})"/>${accent}<text x="20" y="25.5" text-anchor="middle" font-family="Chakra Petch,system-ui,sans-serif" font-weight="700" font-size="14" fill="#fff">${initials(name)}</text></svg>`;
  }
  function itemKind(name) { for (const [re, k] of KIND) if (re.test(name)) return k; return 'orb'; }
  function item(name, size) {
    const s = size || 30, k = itemKind(name), c = COLOR[k];
    return `<svg class="ico item" width="${s}" height="${s}" viewBox="0 0 30 30" aria-hidden="true"><rect width="30" height="30" rx="8" fill="${c}" opacity=".16"/><rect x=".5" y=".5" width="29" height="29" rx="7.5" fill="none" stroke="${c}" opacity=".55"/><g transform="translate(4 4) scale(.9)"><path d="${GLYPH[k]}" fill="${c}"/></g></svg>`;
  }
  const Icons = { hero, item, itemKind };
  if (typeof module !== 'undefined' && module.exports) module.exports = Icons; else root.Icons = Icons;
})(typeof window !== 'undefined' ? window : globalThis);
