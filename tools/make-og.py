#!/usr/bin/env python3
"""Generates the social share images (1200x630) in static/og/. Run: python3 tools/make-og.py"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = os.path.join(os.path.dirname(__file__), '..', 'static', 'og')
B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
R = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
GOLD, RED, BG, FG, MUTED = (232, 180, 74), (226, 89, 91), (12, 16, 24), (233, 237, 245), (150, 160, 180)
GAMES = {
    'default': ('MLBB · HoK · Wild Rift · Free Fire · Brawl Stars', 'Counter picks, builds and tier lists'),
    'mlbb': ('Mobile Legends: Bang Bang', 'Counters, builds, emblems and tier list'),
    'hok': ('Honor of Kings', 'Counters, builds, Arcana and tier list'),
    'wildrift': ('League of Legends: Wild Rift', 'Counters, builds, runes and tier list'),
    'freefire': ('Free Fire', 'Character combos and tier list'),
    'brawlstars': ('Brawl Stars', 'Counter brawlers by mode and tier list'),
}
def fit(d, text, path, size, maxw):
    while size > 18:
        f = ImageFont.truetype(path, size)
        if d.textlength(text, font=f) <= maxw: return f
        size -= 2
    return ImageFont.truetype(path, size)
os.makedirs(OUT, exist_ok=True)
for key, (game, sub) in GAMES.items():
    im = Image.new('RGB', (1200, 630), BG); d = ImageDraw.Draw(im)
    for i in range(0, 1200, 40): d.line([(i, 0), (i, 630)], fill=(18, 24, 36))
    for j in range(0, 630, 40): d.line([(0, j), (1200, j)], fill=(18, 24, 36))
    cx, cy = 980, 315  # radar mark
    for r, w in ((220, 6), (150, 4), (80, 3)): d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=w)
    d.line([(cx, cy - 250), (cx, cy + 250)], fill=GOLD, width=4); d.line([(cx - 222, cy), (cx + 250, cy)], fill=GOLD, width=4)
    d.ellipse([cx - 28, cy - 28, cx + 28, cy + 28], fill=RED)
    d.text((70, 120), 'Pick', font=ImageFont.truetype(B, 110), fill=FG)
    d.text((70 + d.textlength('Pick', font=ImageFont.truetype(B, 110)), 120), 'Radar', font=ImageFont.truetype(B, 110), fill=GOLD)
    d.text((72, 290), game, font=fit(d, game, B, 46, 640), fill=FG)
    d.text((72, 360), sub, font=fit(d, sub, R, 34, 640), fill=MUTED)
    d.rounded_rectangle([70, 470, 420, 540], 14, fill=GOLD)
    d.text((95, 485), 'pickradar.net', font=ImageFont.truetype(B, 34), fill=BG)
    im.save(os.path.join(OUT, key + '.png'), optimize=True)
print('ok')
