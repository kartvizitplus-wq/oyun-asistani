#!/usr/bin/env node
/* One-off helper that created data/wildrift.json and data/hok.json from compact hero lines.
   Line format: Name|role|dmg(P/M)|traits(h c b d)|strengths(comma)|archetype
   The weekly updater edits the JSON files directly; this script is kept for reference. */
const fs = require('fs'), path = require('path');
function parse(src) {
  return src.trim().split('\n').map(l => {
    const [n, r, d, t, s, b] = l.split('|').map(x => x.trim());
    return { n, r, d, t: t || '', s: s ? s.split(',') : [], b, tier: null };
  }).sort((a, b) => a.n.localeCompare(b.n));
}
const WR = `Ahri|mage|M|bd|antisquishy|mage
Akali|assassin|M|bd|antisquishy|assM
Akshan|marksman|P|d||mmC
Alistar|tank|M|c|antidash|support
Amumu|tank|M|c||tank
Annie|mage|M|bc|antisquishy|mage
Ashe|marksman|P|c||mmA
Aurelion Sol|mage|M|||mage
Blitzcrank|support|M|c|antimm|support
Brand|mage|M|b|antitank|mage
Braum|support|M|c|antimm|support
Caitlyn|marksman|P|||mmC
Camille|fighter|P|cd|antisquishy|fP
Corki|marksman|M|b||mage
Darius|fighter|P|h|antitank|fP
Diana|assassin|M|bd|antisquishy|assM
Dr. Mundo|tank|M|h||tank
Draven|marksman|P|b||mmC
Ekko|assassin|M|bd|antisquishy|assM
Evelynn|assassin|M|b|antisquishy|assM
Ezreal|marksman|P|d||mmB
Fiora|fighter|P|hd|antitank|fP
Fizz|assassin|M|bd|antisquishy|assM
Galio|tank|M|c|antiburst|tank
Garen|fighter|P|h||fP
Gragas|tank|M|cd||tank
Graves|marksman|P|b||assP
Gwen|fighter|M|h|antitank|fM
Irelia|fighter|P|hd||fP
Janna|support|M|c|antiburst,antidash|support
Jarvan IV|fighter|P|cd||fP
Jax|fighter|P|d|antimm|fP
Jayce|fighter|P|b||mmB
Jhin|marksman|P|b||mmC
Jinx|marksman|P|||mmC
Kai'Sa|marksman|P|d||mmA
Katarina|assassin|M|bd|antisquishy|assM
Kayle|marksman|M|||mage
Kennen|mage|M|c||mage
Kha'Zix|assassin|P|bd|antisquishy|assP
Lee Sin|assassin|P|cd||assP
Leona|tank|M|c||tank
Lillia|mage|M|d||mage
Lucian|marksman|P|d||mmC
Lulu|support|M|c|antiburst,antidash|support
Lux|mage|M|bc||mage
Malphite|tank|M|c|antimm|tank
Master Yi|assassin|P|hd|antitank|assP
Miss Fortune|marksman|P|b||mmC
Morgana|support|M|c|anticc|support
Nami|support|M|hc|antiburst|support
Nasus|fighter|P|h||fP
Nautilus|tank|M|c||tank
Olaf|fighter|P|hd|anticc|fP
Orianna|mage|M|c||mage
Pantheon|fighter|P|b|antisquishy|fP
Rakan|support|M|cd||support
Rammus|tank|M|c|antimm|tank
Renekton|fighter|P|h||fP
Rengar|assassin|P|b|antisquishy|assP
Riven|fighter|P|bd||fP
Senna|support|P|h||mmC
Seraphine|mage|M|hc||mage
Sett|fighter|P|c|antitank|fP
Shyvana|fighter|M|||fM
Singed|tank|M|h||tank
Sona|support|M|h|antiburst|support
Soraka|support|M|h|antiburst|support
Teemo|mage|M|||mage
Thresh|support|M|c||support
Tristana|marksman|P|d||mmC
Twisted Fate|mage|M|c||mage
Varus|marksman|P|c|antiheal|mmA
Vayne|marksman|P|d|antitank|mmA
Veigar|mage|M|bc||mage
Vex|mage|M|bc|antidash|mage
Vi|fighter|P|cd||fP
Wukong|fighter|P|cd||fP
Xayah|marksman|P|||mmC
Xin Zhao|fighter|P|hd||fP
Yasuo|fighter|P|d|antimm|fP
Yone|fighter|P|d||fP
Zed|assassin|P|bd|antisquishy|assP
Zeri|marksman|P|d||mmA
Ziggs|mage|M|b||mage
Zyra|mage|M|c||mage`;

const HOK = `Agudo|assassin|P|bd|antisquishy|assP
Allain|fighter|P|h||fP
Angela|mage|M|bc|antisquishy|mage
Ao'yin|marksman|P|||mmC
Arke|assassin|P|bd|antisquishy|assP
Arli|marksman|P|d||mmA
Arthur|fighter|P|c||fP
Ata|fighter|P|c||fP
Athena|assassin|P|bd||assP
Augran|fighter|P|h||fP
Bai Qi|tank|M|c||tank
Biron|fighter|P|h|antitank|fP
Butterfly|assassin|P|bd|antisquishy|assP
Cai Yan|support|M|h|antiburst|support
Chano|marksman|P|||mmA
Charlotte|fighter|P|d||fP
Cirrus|assassin|P|bd||assP
Consort Yu|marksman|M|b|antidash|mage
Da Qiao|support|M|c||support
Daji|mage|M|bc|antisquishy|mage
Devara|fighter|P|||fP
Dharma|fighter|P|c||fP
Di Renjie|marksman|P|c|anticc|mmA
Dian Wei|fighter|P|h|antitank|fP
Diaochan|mage|M|hd||mage
Dolia|support|M|h||support
Donghuang|tank|M|c|antidash|tank
Dr Bian|mage|M|c||mage
Dun|tank|P|ch|anticc|tank
Dyadia|support|M|h|antiburst|support
Erin|marksman|P|||mmA
Fang|marksman|P|||mmC
Fatih|fighter|P|||fP
Feyd|assassin|P|bd||assP
Florentino|fighter|P|d||fP
Fuzi|fighter|P|c||fP
Gan & Mo|mage|M|b|antisquishy|mage
Gao|mage|M|b|antisquishy|mage
Gao Changgong|assassin|P|b|antisquishy,antimm|assP
Garo|marksman|P||antitank|mmC
Guan Yu|fighter|P|cd||fP
Guiguzi|support|M|c||support
Han Xin|assassin|P|d||assP
Hou Yi|marksman|P|c||mmA
Huang Zhong|marksman|P|||mmC
Jing|assassin|P|bd|antisquishy|assP
Kaizer|fighter|P|c||fP
Kongming|mage|M|bd|antisquishy|mage
Kui|tank|P|c||tank
Lady Sun|marksman|P|d||mmC
Lady Zhen|mage|M|c||mage
Lam|assassin|P|bd|antisquishy|assP
Li Bai|assassin|P|bd|antisquishy|assP
Li Xin|fighter|P|||fP
Lian Po|tank|M|c||tank
Liang|mage|M|c||mage
Liu Bang|tank|M|c||tank
Liu Bei|assassin|P|d||assP
Liu Shan|support|M|c||support
Lu Bu|fighter|P|h|antitank|fP
Luban No.7|marksman|P|||mmC
Luna|assassin|M|bd|antisquishy|assM
Mai Shiranui|mage|M|bd|antisquishy|mage
Marco Polo|marksman|P|d|antitank|mmA
Mayene|fighter|P|c||fP
Meng Ya|marksman|P|||mmA
Mi Yue|fighter|M|h|antitank|fM
Milady|mage|M|||mage
Ming|support|M|h|antiburst|support
Mozi|mage|M|c||mage
Mulan|fighter|P|bd||fP
Musashi|fighter|P|d||fP
Nakoruru|assassin|P|bd|antisquishy|assP
Nezha|fighter|P|h||fP
Nuwa|mage|M|b||mage
Pei|assassin|P|bd||assP
Sakeer|tank|M|c||tank
Shangguan|mage|M|bd|antisquishy|mage
Shouyue|marksman|P|b||mmB
Sima Yi|assassin|M|bd|antisquishy|assM
Sun Bin|support|M|h||support
Sun Ce|fighter|P|c||fP
Ukyo Tachibana|assassin|P|bd||assP
Wang Zhaojun|mage|M|c||mage
Wukong|assassin|P|b||assP
Xiang Yu|tank|P|c||tank
Xiao Qiao|mage|M|b|antisquishy|mage
Yang Jian|fighter|P|c||fP
Yao|fighter|P|h||fP
Yaria|support|M|h|antiburst|support
Ying|assassin|P|bd||assP
Yixing|mage|M|c||mage
Yuhuan|mage|M|h||mage
Zhang Fei|tank|P|c|antiburst|tank
Zhou Yu|mage|M|||mage
Zhuangzi|tank|M|h|anticc|tank
Zilong|assassin|P|d||assP
Ziya|mage|M|c||mage`;

const WR_ARCH = {
  fP: { group: 'front', type: 'P', spell: 'Flash + Ignite', items: ['Plated Steelcaps', 'Trinity Force', "Sterak's Gage", 'Black Cleaver', "Death's Dance", 'Guardian Angel'] },
  fM: { group: 'front', type: 'M', spell: 'Flash + Ignite', items: ["Mercury's Treads", 'Riftmaker', "Liandry's Torment", 'Void Staff', "Zhonya's Hourglass", "Rabadon's Deathcap"] },
  tank: { group: 'front', type: 'T', spell: 'Flash + Ignite', items: ['Plated Steelcaps', 'Sunfire Aegis', 'Thornmail', 'Force of Nature', "Randuin's Omen", 'Gargoyle Stoneplate'] },
  support: { group: 'front', type: 'T', spell: 'Flash + Exhaust', items: ['Boots of Mana', 'Ardent Censer', 'Harmonic Echo', "Athene's Unholy Grail", 'Force of Nature', "Zhonya's Hourglass"] },
  mmC: { group: 'back', type: 'P', spell: 'Flash + Heal', items: ['Gluttonous Greaves', 'Infinity Edge', 'Phantom Dancer', 'Bloodthirster', "Lord Dominik's Regards", 'Guardian Angel'] },
  mmA: { group: 'back', type: 'P', spell: 'Flash + Heal', items: ['Gluttonous Greaves', 'Blade of the Ruined King', "Guinsoo's Rageblade", "Runaan's Hurricane", "Lord Dominik's Regards", 'Guardian Angel'] },
  mmB: { group: 'back', type: 'P', spell: 'Flash + Heal', items: ['Ionian Boots of Lucidity', 'Trinity Force', 'Black Cleaver', "Serylda's Grudge", 'Bloodthirster', 'Guardian Angel'] },
  mage: { group: 'back', type: 'M', spell: 'Flash + Ignite', items: ['Boots of Mana', "Luden's Echo", "Rabadon's Deathcap", 'Void Staff', "Zhonya's Hourglass", 'Infinity Orb'] },
  assP: { group: 'back', type: 'P', spell: 'Flash + Smite', items: ['Plated Steelcaps', 'Duskblade of Draktharr', "Youmuu's Ghostblade", "Serylda's Grudge", "Death's Dance", 'Guardian Angel'] },
  assM: { group: 'back', type: 'M', spell: 'Flash + Smite', items: ['Boots of Mana', 'Lich Bane', "Rabadon's Deathcap", 'Void Staff', "Zhonya's Hourglass", "Banshee's Veil"] }
};
const WR_COUNTERS = {
  antiheal: { P: 'Mortal Reminder', M: 'Morellonomicon', T: 'Thornmail' },
  magic: { front: 'Force of Nature', backP: 'Maw of Malmortius', backM: "Banshee's Veil" },
  magicHeavy: { front: 'Spirit Visage' },
  basic: { front: "Randuin's Omen", backP: 'Guardian Angel', backM: "Zhonya's Hourglass" },
  phys: { front: "Dead Man's Plate", backP: 'Guardian Angel', backM: "Zhonya's Hourglass" },
  pen: { frontP: 'Black Cleaver', backP: "Lord Dominik's Regards", M: 'Void Staff' },
  burst: { frontP: "Sterak's Gage", front: 'Gargoyle Stoneplate', backP: 'Guardian Angel', backM: "Zhonya's Hourglass" },
  ccBoots: "Mercury's Treads", purify: null
};
// Honor of Kings: item names on the global server change often; until the weekly updater confirms
// exact builds, archetypes carry no fixed items and counters use item categories (#cat_* keys).
const HOK_ARCH = {};
for (const [k, g, ty, sp] of [['fP', 'front', 'P', 'Flicker'], ['fM', 'front', 'M', 'Flicker'], ['tank', 'front', 'T', 'Flicker'], ['support', 'front', 'T', 'Flicker'],
  ['mmC', 'back', 'P', 'Flicker'], ['mmA', 'back', 'P', 'Flicker'], ['mmB', 'back', 'P', 'Flicker'], ['mage', 'back', 'M', 'Flicker'], ['assP', 'back', 'P', 'Punish'], ['assM', 'back', 'M', 'Punish']])
  HOK_ARCH[k] = { group: g, type: ty, spell: sp, items: [] };
const HOK_COUNTERS = {
  antiheal: { any: '#cat_antiheal' }, magic: { any: '#cat_magicdef' }, magicHeavy: {},
  basic: { front: '#cat_antiatk', back: '#cat_lifesave' }, phys: { front: '#cat_armor', back: '#cat_lifesave' },
  pen: { P: '#cat_pen', M: '#cat_mpen' }, burst: { any: '#cat_lifesave' }, ccBoots: '#cat_ccboots', purify: 'Purify'
};
const today = new Date().toISOString().slice(0, 10);
const notes = 'Same schema as mlbb.json. tier=S/A/B/C or null (weekly updater). Item names starting with # are category keys translated in src/i18n.json.';
fs.writeFileSync(path.join(__dirname, '../data/wildrift.json'), JSON.stringify({ game: 'wildrift', patch: '', updated: today, notes, archetypes: WR_ARCH, counters: WR_COUNTERS, heroes: parse(WR) }, null, 2));
fs.writeFileSync(path.join(__dirname, '../data/hok.json'), JSON.stringify({ game: 'hok', patch: '', updated: today, notes, archetypes: HOK_ARCH, counters: HOK_COUNTERS, heroes: parse(HOK) }, null, 2));
console.log('ok', parse(WR).length, parse(HOK).length);
