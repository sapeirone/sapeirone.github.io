# CLAUDE.md

Personal academic website for Simone Alberto Peirone. Successor to the al-folio
Jekyll site at https://sapeirone.github.io/.

## Ground rules

- **No build step, no dependencies, no framework.** Plain HTML, one CSS file, one
  JS file. Do not introduce npm, a bundler, Jekyll, or a CSS framework.
- **Content lives in `data/*.json`, never in markup.** If a change means editing
  text inside an `.html` or `.js` file, it is probably in the wrong place —
  the point of this site is that the owner can update it by editing JSON alone.
- **The owner's taste runs to less.** Across a long round of iteration the
  consistent direction has been: fewer boxes, fewer borders, no rounded pills,
  no animations, no scroll-reveal effects, no light/dark toggle, no redundant
  labels. Adding decoration is usually the wrong instinct. Coloured/filled
  buttons were tried and explicitly rejected — link chips stay neutral.
- **Do not invent facts.** Publication metadata, Scholar IDs, dates and awards
  must come from the owner, the old site, or a verified source. When unsure of
  something like a co-author's Scholar profile, leave it blank and ask.
- **The bio stays short.** An attempt to make it "explicit about impact" by
  adding challenge placements, compute grants, supervised-thesis counts and
  reviewer awards was cut back to a single sentence naming CVPR / ICCV / TPAMI /
  IJCV. Achievements belong on the CV page; the bio names the venues and stops.

## Layout

```
index.html            About / home
publications.html     Full publication list
cv.html               CV
assets/css/style.css  All styling; design tokens in :root (+ dark override)
assets/js/site.js     Whole renderer: fetches JSON and builds every page
assets/img/           profile.jpg + pubs/<id>.jpg teasers, sized to display size
assets/fonts/         self-hosted Jost woff2 + OFL licence
data/*.json           All content
cv.pdf                Authoritative CV, linked from the site
404.html              GitHub Pages error page; uses root-absolute asset paths
robots.txt            Allows everything, points at the sitemap
sitemap.xml           Three URLs; bump <lastmod> when content changes
.nojekyll             Stops GitHub Pages running Jekyll over this
```

Each page is a shell: a nav, empty `<section>` mount points, and
`Site.init("<page>")`. `assets/js/site.js` fills them in.

| Page | mount points |
|---|---|
| `index.html` | `#hero`, `#news`, `#selected` |
| `publications.html` | `#pub-list` |
| `cv.html` | `#cv-nav`, `#cv-body` |

`404.html` has no mount points — it calls `Site.init("404")` only so dark mode is
applied; there is no `404` renderer, and `init` skips the render step. Each page's
`<title>` is static markup and is never set from JS.

All three also have `#nav-social` and `#footer`, filled from `profile.json`.

## Data files

- **`profile.json`** — name, aliases, role, affiliation, photo, bio paragraphs,
  `now` entries, and `links` (email, scholar, github, linkedin). `nameAliases`
  is what makes the owner's name render bold in author lists, so any new spelling
  used in `publications.json` must be added there too.
- **`publications.json`** — one object per paper. `selected: true` puts it on the
  home page. `image` is optional and **only shown on the home page** — the full
  list is deliberately text-only. `type` is `conference` / `journal` /
  `preprint` / `report`; conference and journal venues get the year appended to
  the badge ("ICCV 2025"), the others do not, because the year heading above the
  group already says it. `links` keys are rendered in a fixed order: `page`,
  `paper`, `arxiv`, `code`, `hf`, `video`, `poster`, `slides`.
- **`authors.json`** — `"Full Name": "<Google Scholar URL>"`. Names must match
  `publications.json` exactly. An empty string or a missing name renders as plain
  text, which is the correct handling for co-authors with no profile. Keys
  starting with `_` are comments. The file is loaded optionally: if it is broken
  or absent the pages still render, just without author links.
- **`news.json`** — newest first. Only the **first three** appear on the home
  page. `date` is ISO but only month + year are displayed. `emoji` is shown
  before the text. `text` allows inline HTML (`<strong>`).
- **`cv.json`** — `education`, `awards`, `teaching`, `students`, `service`.
  Skills and publications sections were deliberately removed from the CV page;
  do not add them back. This is where achievements live — awards, grants,
  supervised students, reviewer recognition — rather than in the bio.

## Conventions in `site.js`

- `esc()` everything that comes from JSON, **except** fields documented above as
  allowing inline HTML (`news[].text`, `cv.education[].details`).
- Icons are inline SVG in the `ICONS` map; `icon(name)` renders one. No icon
  fonts, no external icon CDN.
- Dark mode follows `prefers-color-scheme` only, applied by `applyTheme()`.
  There is no toggle and the owner does not want one.
- **Do not undo the load-order work.** The `<script>` sits *before* the
  stylesheet links on purpose: a script after a stylesheet cannot execute until
  that stylesheet arrives, which used to stall the JSON prefetch. `Site.init()`
  starts its page's fetches immediately (see `PAGE_DATA`) and the renderer
  awaits the cached promises. Fonts are self-hosted for the same reason — no
  external origin on the critical path. Images are sized to what the layout
  displays; do not commit an unresized original.
- `loadJSON(name)` is required data; `loadJSONOptional(name, fallback)` is for
  files whose absence must not break a page.

## Running and verifying

The site uses `fetch()`, so **it must be served** — opening `index.html` over
`file://` shows "Could not load".

```sh
python3 -m http.server 8765     # then http://localhost:8765/
```

There is no `node` on this machine. Verify with:

```sh
# 1. JSON is valid
python3 -c "import json,glob; [json.load(open(f)) for f in glob.glob('data/*.json')]"

# 2. Pages actually render (0 matches = good)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless --disable-gpu --virtual-time-budget=4000 \
  --dump-dom http://localhost:8765/index.html | grep -c 'Loading…\|Could not load'

# 3. Eyeball it
"$CHROME" --headless --disable-gpu --virtual-time-budget=4000 \
  --window-size=1100,1400 --screenshot=/tmp/shot.png http://localhost:8765/
```

Always check all three pages — a renderer change usually touches more than one.

**Headless Chrome clamps its viewport to a 500px minimum.** A `--window-size`
below that yields a *cropped* screenshot of a 500px-wide layout, not a narrow
viewport, and the crop looks exactly like a horizontal-overflow bug. Do not
diagnose mobile layout from those screenshots; measure
`document.documentElement.scrollWidth` instead.

## Deployment

Static; GitHub Pages serves the folder as-is. Nothing to build.

## Context

The owner is a final-year PhD candidate **on the job market** (as of August 2026).
That raises the stakes on: getting the site actually deployed, an `og:image` so
shared links don't unfurl as bare text, and which papers carry `selected: true`.
Suggestions that were raised and are still open, in case they come up again:
an availability line in `profile.json` → `now`; `egopack` (CVPR 2024, the
most-cited paper) currently has `"selected": false` and so is missing from the
homepage; the email address appears only as a nav icon, never as plain text; and
six of the nine `news.json` entries never render anywhere.

## Open items

- `authors.json` has no Scholar URL for **Andrea Zenotto** — none could be
  found. Ask the owner before guessing.
- **Nothing is committed and there is no remote.** `main` has zero commits and
  every file is untracked; the site is not deployed. What `sapeirone.github.io`
  currently serves is the old al-folio site.
- No `og:image` on any page, so links unfurl as bare text cards.
- The pages are JS-rendered, so link unfurlers and non-JS crawlers see empty
  sections. A full fix needs a build step, which the design rules forbid; the
  cheap mitigation would be static JSON-LD in the HTML head.
- `cv.html` still has a `<p class="eyebrow">Curriculum Vitae</p>` directly above
  its identical `<h1>`. Flagged to the owner, not yet decided.
