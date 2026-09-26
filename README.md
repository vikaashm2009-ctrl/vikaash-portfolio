# Vikaash M — Portfolio

## Folder structure
```
vikaash-portfolio/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── profile.jpg              ← add your real photo here (see below)
    └── profile-placeholder.svg  (shown automatically until you add profile.jpg)
```

## Adding your photo
1. Pick a casual, well-lit photo of yourself (portrait orientation works best — roughly 4:5).
2. Rename it exactly to `profile.jpg` (or `profile.png` — if you use `.png`, open
   `index.html` and change `src="assets/profile.jpg"` to `src="assets/profile.png"`,
   in the two places it appears).
3. Drop it into the `assets/` folder, replacing nothing else.
4. Refresh the page — the placeholder graphic will be replaced automatically.

## Running it locally
No build tools, no npm install — it's plain HTML/CSS/JS.

**Option A — just open it:**
Double-click `index.html` and it will open in your browser. (The Google Fonts
will still load online; everything else works offline.)

**Option B — local server (recommended, avoids any browser file-path quirks):**
```bash
# from inside the vikaash-portfolio folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

## How the main pieces work
- **Hero (`#hero`)** — full-height intro. A `<canvas>` draws a faint, slowly
  drifting grid in the background (`script.js`); the name and tagline animate
  in with a staggered reveal on load.
- **Nav** — fixed header; `IntersectionObserver` in `script.js` watches which
  section is on screen and underlines the matching nav link. Collapses into a
  full-screen mobile menu under 980px.
- **Chapters 01–06** (`#origin` → `#next`) — each is a `<section>` with a
  numbered `section__head`. Content fades/rises into view once as you scroll
  to it (`.reveal-up` class, also driven by `IntersectionObserver`).
- **Foundation (`#foundation`)** — skills are grouped into honest labels
  (Building foundations / Currently learning / Exploring / Interested in)
  as pill tags, not fake progress bars.
- **Exposure (`#exposure`)** — the FOSS Club workshop, styled as a single
  timeline checkpoint.
- **The Lab (`#lab`)** — three clearly-labelled "future exploration" cards,
  not completed projects.
- **Contact (`#next`)** — direct `mailto:` link plus GitHub/LinkedIn, styled
  as a simple stacked list.

Respects `prefers-reduced-motion`: all animations are skipped/instant for
users who have that OS setting enabled.
