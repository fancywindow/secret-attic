"""Build index.html (the playable game) from src/. Run: python3 build.py"""
import pathlib

root = pathlib.Path(__file__).parent
src = root / 'src'
js = '\n'.join((src / f).read_text() for f in ['sprites.js', 'engine.js', 'world.js', 'art.js', 'scenes.js', 'main.js'])
page = (src / 'template.html').read_text().replace('/*__JS__*/', js)
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
