# secret-attic
Restore the Sparkees' magic with adventures from the human world

**Play:** https://fancywindow.github.io/secret-attic/

On an iPad: open the link in Safari, tap Share → Add to Home Screen, then always launch it from the Secret Attic icon. It runs full-screen, and progress saves on that iPad.

## How it's made
The whole game is one self-contained file, `index.html`, built from the pieces in `src/`:

- `sprites.js` – Zoe's pixel sprites and hair styles
- `engine.js` – palette, drawing helpers, save data, music and sound effects
- `world.js` – the stage, Zoe and the Sparkees, dialog, transitions, input
- `art.js` – the painted scenes, items and icons
- `scenes.js` – the hallway, stairs, forest and library, and everything that happens in them
- `main.js` – overlays (mirror, quest page, pickers), title screen, startup
- `template.html` – page markup and styles

To rebuild after editing anything in `src/`, run `python3 build.py` and commit the new `index.html`.
