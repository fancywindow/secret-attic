"""Build index.html (the playable game) from src/. Run: python3 build.py"""
import pathlib

root = pathlib.Path(__file__).parent
src = root / 'src'
import base64
FILES = ['sprites.js', 'engine.js', 'world.js', 'art.js', 'art2.js', 'art3.js', 'quests.js', 'flow.js', 'scenes.js', 'scenes2.js', 'scenes3.js', 'main.js', 'main2.js']
js = '\n'.join((src / f).read_text() for f in FILES if (src / f).exists())
# fonts are embedded so the game works offline and never waits on a font server
def face(family, file, weight):
    b64 = base64.b64encode((src / 'fonts' / file).read_bytes()).decode()
    return f"@font-face {{ font-family: '{family}'; src: url(data:font/woff2;base64,{b64}) format('woff2'); font-weight: {weight}; font-display: block; }}"
fonts = '\n'.join([face('Andika', 'Andika-Regular.woff2', 400), face('Andika', 'Andika-Bold.woff2', 700), face('Pixelify Sans', 'Pixelify.woff2', '400 700')])
page = (src / 'template.html').read_text().replace('/*__JS__*/', js).replace('/*__FONTS__*/', fonts)
icon = (src / 'icon.txt').read_text().strip()

head = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Secret Attic">
<meta name="theme-color" content="#1E0F14">
<link rel="apple-touch-icon" href="{icon}">
<link rel="icon" href="{icon}">
'''
end_style = page.index('</style>') + len('</style>')
html = head + page[:end_style] + '\n</head>\n<body>\n' + page[end_style:] + '\n</body>\n</html>\n'
(root / 'index.html').write_text(html)
print(f'index.html: {len(html):,} bytes')
