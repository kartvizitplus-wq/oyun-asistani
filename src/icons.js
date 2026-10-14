/* Original, generated icons for heroes and items. No game artwork is used or imitated:
   items get a drawing of their generic object type, heroes get a role emblem with initials. */
(function (root) {
  const ROLE = {
    tank: ['#3f6fd1', '#1d3870'], fighter: ['#d1793f', '#6e3514'], assassin: ['#9b4fd1', '#45216b'], mage: ['#3fb3d1', '#17566a'],
    marksman: ['#d1b23f', '#665512'], support: ['#4fc28a', '#1b5a39'], artillery: ['#c95a5a', '#632222'], controller: ['#5ac9b0', '#1d5c52'],
    damage: ['#d15a8a', '#652040'], a: ['#e8b44a', '#74510f'], p: ['#7a8bd1', '#2e3a75']
  };
  /* Each glyph is drawn in a 24x24 box; C = main color, D = detail color. */
  const G = {
    sword: '<path d="M20.5 1.5l2 2L10 16l-2-2z" fill="C"/><path d="M19 3l1.5 1.5L10 15" stroke="D" stroke-width=".8" fill="none"/><path d="M5 12.5l6.5 6.5-1.6 1.6L3.4 14z" fill="C"/><path d="M5.3 17.3l1.4 1.4-3.6 3.6-1.4-1.4z" fill="C"/><circle cx="2.4" cy="21.6" r="1.4" fill="C"/>',
    axe: '<path d="M4 22.5L16.5 10l1.5 1.5L5.5 24z" fill="D"/><path d="M13 3.5c4.5-1.8 9 1 9.5 6.5l-3.5 1.5-7.5-7.5z" fill="C"/><path d="M12.5 4.5l7 7-2 2-7-7z" fill="C"/>',
    scythe: '<path d="M5 23L15.5 3.5l1.6.8L6.6 23.8z" fill="D"/><path d="M15.8 3.8C11 0.5 4 1.5 1 7c4-2.2 9-2.4 13.8-.4z" fill="C"/>',
    halberd: '<path d="M11 23V8h2v15z" fill="D"/><path d="M12 .5L15.5 8h-7z" fill="C"/><path d="M13 9.5h6c0 3-2.5 5-6 5z" fill="C"/><path d="M11 9.5H8.5v3H11z" fill="C"/>',
    bow: '<path d="M6 1.5c9 3.5 9 17.5 0 21" stroke="C" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M6 2.5v19" stroke="D" stroke-width=".9"/><path d="M3 12h17" stroke="D" stroke-width="1.4"/><path d="M22.5 12l-4-2.5v5z" fill="C"/><path d="M3 12l-1.5-2M3 12l-1.5 2" stroke="D" stroke-width="1"/>',
    staff: '<path d="M11 9h2v14.5h-2z" fill="D"/><circle cx="12" cy="6" r="4.5" fill="C"/><circle cx="12" cy="6" r="2" fill="D" opacity=".6"/><path d="M7 4c-1-2 0-3.5 1.5-3.5M17 4c1-2 0-3.5-1.5-3.5" stroke="C" stroke-width="1.2" fill="none"/>',
    book: '<path d="M3 3.5c3-1.5 6-1.5 8.5.5v18c-2.5-2-5.5-2-8.5-.5z" fill="C"/><path d="M21 3.5c-3-1.5-6-1.5-8.5.5v18c2.5-2 5.5-2 8.5-.5z" fill="C"/><path d="M5 7.5h4.5M5 10.5h4.5M14.5 7.5H19M14.5 10.5H19" stroke="D" stroke-width="1"/>',
    orb: '<circle cx="12" cy="12" r="7" fill="C"/><ellipse cx="12" cy="12" rx="11" ry="3.5" stroke="D" stroke-width="1.2" fill="none" transform="rotate(-25 12 12)"/><circle cx="9.5" cy="9.5" r="2" fill="D" opacity=".7"/>',
    crystal: '<path d="M12 .5l7.5 8L12 23.5 4.5 8.5z" fill="C"/><path d="M4.5 8.5h15M12 .5L9 8.5l3 15 3-15z" stroke="D" stroke-width=".9" fill="none"/>',
    helmet: '<path d="M3.5 15c0-7 3.8-12 8.5-12s8.5 5 8.5 12v4h-6v-5h-5v5h-6z" fill="C"/><path d="M12 3v8M8 11h8" stroke="D" stroke-width="1.2"/>',
    armor: '<path d="M7 2.5l5 2.5 5-2.5 5 3.5-2.5 5.5V22H4.5V11.5L2 6z" fill="C"/><path d="M12 5v17M7 11h10M7 15.5h10" stroke="D" stroke-width="1"/>',
    shield: '<path d="M12 1.5l9 3.2v7c0 5.5-4 9.3-9 11-5-1.7-9-5.5-9-11v-7z" fill="C"/><path d="M12 4.5v16M6 9.5h12" stroke="D" stroke-width="1.3"/>',
    boots: '<path d="M7 1.5h6v10.5l6.5 3.5c1.5.8 2.5 2 2.5 3.5V21H3.5v-3.5L7 15.5z" fill="C"/><path d="M7 6h6M3.5 18.5h18.5" stroke="D" stroke-width="1.1"/><path d="M13 4c3-.5 5.5-2.2 7-3.5-1 3-3.5 5-7 5.5" fill="D"/>',
    wings: '<path d="M12 9C9 3.5 4 2 .5 3c.6 5.5 4 9 9 9.5" fill="C"/><path d="M12 9c3-5.5 8-7 11.5-6-.6 5.5-4 9-9 9.5" fill="C"/><path d="M12 8v15M9 14.5L12 23l3-8.5" stroke="D" stroke-width="1.3" fill="none"/>',
    crown: '<path d="M2 7l5 5 5-8.5 5 8.5 5-5-2 13H4z" fill="C"/><path d="M4 17h16" stroke="D" stroke-width="1.4"/><circle cx="12" cy="12" r="1.6" fill="D"/>',
    hourglass: '<path d="M5 1.5h14v2c0 4-4 6.5-5.5 8.5 1.5 2 5.5 4.5 5.5 8.5v2H5v-2c0-4 4-6.5 5.5-8.5C9 10 5 7.5 5 3.5z" fill="C"/><path d="M8.5 20.5h7l-3.5-4z" fill="D"/><path d="M3.5 1.5h17M3.5 22.5h17" stroke="D" stroke-width="1.4"/>',
    necklace: '<path d="M3 2c1 8 5 11 9 11s8-3 9-11" stroke="D" stroke-width="1.4" fill="none"/><path d="M12 12l4.5 4.5L12 23l-4.5-6.5z" fill="C"/>',
    dagger: '<path d="M18.5 1L21 3.5 11.5 13 9 12z" fill="C"/><path d="M6 9.5l8.5 8.5-1.6 1.6L4.4 11.1z" fill="C"/><path d="M6.5 15l2.5 2.5-5 5L1.5 20z" fill="D"/>',
    snowflake: '<path d="M12 1v22M2.5 6.5l19 11M2.5 17.5l19-11" stroke="C" stroke-width="2" stroke-linecap="round"/><path d="M9 3l3 2.5L15 3M9 21l3-2.5 3 2.5" stroke="C" stroke-width="1.4" fill="none"/><circle cx="12" cy="12" r="2.2" fill="D"/>',
    heart: '<path d="M12 22S1.5 15.5 1.5 8.5C1.5 4.5 4.5 2 7.5 2c2 0 3.5 1 4.5 2.5C13 3 14.5 2 16.5 2c3 0 6 2.5 6 6.5C22.5 15.5 12 22 12 22z" fill="C"/><path d="M12 8v8M8 12h8" stroke="D" stroke-width="1.8"/>',
    bolt: '<path d="M14 .5L3 13.5h7.5L9 23.5l12-14h-7.5z" fill="C"/>',
    bomb: '<circle cx="11" cy="14" r="8" fill="C"/><path d="M15.5 7.5L18 5" stroke="D" stroke-width="2"/><path d="M18 5c1-2 3-2.5 4.5-1.5" stroke="C" stroke-width="1.2" fill="none"/><circle cx="8" cy="11" r="2" fill="D" opacity=".6"/>',
    star: '<path d="M12 1l3.2 7 7.6.8-5.7 5.1 1.6 7.6L12 17.6 5.3 21.5l1.6-7.6L1.2 8.8l7.6-.8z" fill="C"/>',
    tag: '<path d="M2 2h10l10 10-10 10L2 12z" fill="C"/><circle cx="7" cy="7" r="2" fill="D"/>'
  };
  const COLOR = {
    sword: '#e8606a', axe: '#e8606a', scythe: '#c96ae8', halberd: '#e8806a', bow: '#e8b44a', staff: '#a57bf0', book: '#8f7bf0', orb: '#a57bf0',
    crystal: '#6fd0e8', helmet: '#5a9bea', armor: '#4a8be0', shield: '#4a9bea', boots: '#9aa6bd', wings: '#e8c75a', crown: '#e8b44a',
    hourglass: '#d9a85a', necklace: '#e88fb4', dagger: '#e8606a', snowflake: '#7fd8f0', heart: '#4fc28a', bolt: '#e8b44a', bomb: '#e07a5a', star: '#e8b44a', tag: '#4fc28a'
  };
  const KIND = [
    [/^#cat_antiheal/, 'heart'], [/^#cat_(magicdef|armor|antiatk)/, 'shield'], [/^#cat_(pen|mpen)/, 'dagger'], [/^#cat_lifesave/, 'wings'], [/^#cat_ccboots/, 'boots'], [/^#cat_/, 'tag'],
    [/boot|shoe|greave|tread|steelcap|lucidity/i, 'boots'],
    [/hourglass|clock|time|zhonya/i, 'hourglass'],
    [/crown/i, 'crown'],
    [/ice|frozen|winter|frost|glacial/i, 'snowflake'],
    [/wing|immortal|angel|phoenix/i, 'wings'],
    [/redemption|censer|heal/i, 'heart'],
    [/hurricane|bow|wind of|windtalker|firecannon/i, 'bow'],
    [/helmet|helm|mask/i, 'helmet'],
    [/shield|buckler|targe|aegis|veil|guardian/i, 'shield'],
    [/armor|armour|cuirass|plate|mail|omen|thorn|visage|nature|heart|cape|cloak|sanctuary|jerkin|belt|breastplate/i, 'armor'],
    [/necklace|amulet|pendant|grail|locket|talisman/i, 'necklace'],
    [/scythe|reaper/i, 'scythe'],
    [/axe|cleaver/i, 'axe'],
    [/halberd|lance|glaive|spear|pike/i, 'halberd'],
    [/dagger|claw|knife|ripper|fury|duskblade|ghostblade|machete/i, 'dagger'],
    [/staff|wand|truncheon|rod|scepter|sceptre|cane/i, 'staff'],
    [/tome|book|codex|grimoire|page|deathcap|morello|torment/i, 'book'],
    [/crystal|gem|agate|stone|echo|orb|riftmaker|bane/i, 'crystal'],
    [/sword|blade|edge|roar|reminder|grudge|regards|sunderer|thirster|dancer|strike|punisher|malmortius|rageblade|starbreaker|doomsday|destiny|sterak|force|might/i, 'sword'],
    [/^(flash|flicker|petrify|vengeance|purify|retribution|punish|execute|ignite|exhaust|smite|barrier|sprint|inspire)/i, 'bolt']
  ];
  const EMBLEM = { tank: 'shield', fighter: 'sword', assassin: 'dagger', mage: 'staff', marksman: 'bow', support: 'heart', artillery: 'bomb', controller: 'snowflake', damage: 'bolt', a: 'bolt', p: 'star' };
  const hash = s => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
  const initials = n => { const w = n.replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/); return (w.length > 1 ? w[0][0] + w[1][0] : n.replace(/[^A-Za-z0-9]/g, '').slice(0, 2)).toUpperCase(); };
  const ea = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const paint = (k, c, d) => G[k].replace(/"C"/g, '"' + c + '"').replace(/"D"/g, '"' + d + '"');
  function hero(name, role, size) {
    const s = size || 40, [c1, c2] = ROLE[role] || ['#5a6b8a', '#2a3346'], h = hash(name), id = 'g' + h.toString(36) + (role || '');
    const em = EMBLEM[role] || 'star', rot = (h % 5) * 8 - 16;
    return `<svg class="ico hero" width="${s}" height="${s}" viewBox="0 0 40 40" role="img" aria-label="${ea(name)}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="40" height="40" rx="9" fill="url(#${id})"/><g opacity=".3" transform="translate(13 11) rotate(${rot} 12 12) scale(1.15)">${paint(em, '#fff', '#fff')}</g><rect x="1" y="1" width="38" height="38" rx="8" fill="none" stroke="#fff" stroke-opacity=".18"/><text x="20" y="25.5" text-anchor="middle" font-family="Chakra Petch,system-ui,sans-serif" font-weight="700" font-size="14" fill="#fff" style="paint-order:stroke" stroke="${c2}" stroke-width="2">${initials(name)}</text></svg>`;
  }
  function itemKind(name) { for (const [re, k] of KIND) if (re.test(name)) return k; return 'orb'; }
  function item(name, size) {
    const s = size || 30, k = itemKind(name), c = COLOR[k];
    return `<svg class="ico item" width="${s}" height="${s}" viewBox="0 0 30 30" role="img" aria-label="${ea(name.replace(/^#/, ''))}"><rect width="30" height="30" rx="8" fill="${c}" opacity=".15"/><rect x=".5" y=".5" width="29" height="29" rx="7.5" fill="none" stroke="${c}" opacity=".5"/><g transform="translate(4 4) scale(.92)">${paint(k, c, '#0c1018')}</g></svg>`;
  }
  const Icons = { hero, item, itemKind };
  if (typeof module !== 'undefined' && module.exports) module.exports = Icons; else root.Icons = Icons;
})(typeof window !== 'undefined' ? window : globalThis);
