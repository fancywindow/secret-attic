# secret-attic
Restore the Sparkees' magic with adventures from the human world

**Play:** https://fancywindow.github.io/secret-attic/

On an iPad: open the link in Safari, tap Share → Add to Home Screen, then always launch it from the Secret Attic icon. It runs full-screen, and progress saves on that iPad.

## How it's made
The whole game is one self-contained file, `index.html`, built from the pieces in `src/`:

- `sprites.js` – Zoe's pixel sprites and hair styles
- `engine.js` – palette, drawing helpers, save data, music and sound effects
- `world.js` – the stage, Zoe and the Sparkees, dialog, transitions, input
- `art.js` – the hallway, stairs, forest and library paintings, chapter-one items and icons
- `art2.js` – answer and family icons, book covers, the art studio and bathroom paintings, new room items, photo-to-pixel-art
- `art3.js` – food icons, the kitchen, the Reading Tower, library construction
- `quests.js` – all quest text: reading quests, art quests, family members, routines and room presents
- `flow.js` – save upgrades, quest picking, presents, and the magic effects every room shares
- `scenes.js` – the hallway, stairs, forest and library
- `scenes2.js` – the art studio (Dot) and the bathroom (Bubbles)
- `scenes3.js` – the kitchen (Chef Noodle), the Reading Tower (Pip), and walking home
- `main.js` – overlays (mirror, quest pages, pickers, camera, sink), title screen, startup
- `main2.js` – the present picker, the quest-in-progress card, and Greg's Magic Map
- `fonts/` – Andika (reading text, made for beginning readers) and Pixelify Sans (names and signs), embedded into the page
- `template.html` – page markup and styles

## Adding quests
Reading, art, and food quests are plain text in `src/quests.js`. Add an entry to `READ_QUESTS`, `ART_QUESTS` (mark it `size: 'doodle'` or `'project'`), or `FOOD_QUESTS` (copy an existing one), rebuild, and it joins the pool. Presents live in `ITEMS` in the same file. Zoe's progress is stored on the iPad and carries over between updates.

To rebuild after editing anything in `src/`, run `python3 build.py` and commit the new `index.html`.
