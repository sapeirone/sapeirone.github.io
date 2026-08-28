# sapeirone.github.io

Personal academic website. Static HTML + CSS + a bit of vanilla JS — **no build step, no dependencies**.
All the content lives in JSON files under [`data/`](data/), so updating the site means editing JSON, never HTML.

## Editing content

| File | What it holds |
| --- | --- |
| [`data/profile.json`](data/profile.json) | Name, role, bio paragraphs, "Currently" card, social links (header + footer) |
| [`data/news.json`](data/news.json) | News timeline on the homepage. Newest first. |
| [`data/publications.json`](data/publications.json) | Every paper, preprint and technical report |
| [`data/authors.json`](data/authors.json) | Co-author name → Google Scholar URL |
| [`data/cv.json`](data/cv.json) | Education, awards & grants, teaching, supervised students, academic service |

### Adding a publication

Append an entry to `data/publications.json`. Only `title`, `authors`, `year`, `type` and `venue` are required:

```json
{
  "id": "short-slug",
  "title": "Paper title",
  "authors": ["Simone Alberto Peirone", "Co Author"],
  "equalContribution": ["Simone Alberto Peirone", "Co Author"],
  "year": 2026,
  "type": "conference",
  "venue": "CVPR",
  "venueLong": "IEEE/CVF Conference on Computer Vision and Pattern Recognition",
  "selected": true,
  "tldr": "One sentence that explains the idea.",
  "image": "assets/img/pubs/slug.jpg",
  "award": "Best paper",
  "links": { "page": "", "arxiv": "", "code": "", "hf": "", "video": "" }
}
```

- `type` — one of `conference`, `journal`, `preprint`, `report`. `conference` and `journal` get the year appended
  to the badge ("ICCV 2025"); the others don't, since the year heading above the group already says it.
- `selected: true` — promotes the paper to the homepage "Selected publications" block.
- `equalContribution` — names listed here get a `*`; a footnote badge appears automatically.
- `links` — any of `page`, `paper`, `arxiv`, `code`, `hf`, `video`, `poster`, `slides`, rendered in that order.
  `arxiv`, `code`, `hf` and `video` render with an icon. Omit what you don't have; the first one present also
  becomes the title link.
- `image` — optional teaser, **shown on the homepage only**. The full publications list is deliberately
  text-only, so an `image` there is simply ignored. Drop files in `assets/img/pubs/`.

Your own name is bolded automatically — the match list is `nameAliases` in `profile.json`.

### Linking co-authors

`data/authors.json` maps an author name to their Google Scholar profile:

```json
{ "Co Author": "https://scholar.google.com/citations?user=XXXXXXXX" }
```

Names must match `publications.json` **exactly**. A name that's missing — or present with an empty string —
renders as plain text, which is the right outcome for co-authors without a profile. Keys starting with `_`
are treated as comments. The file is loaded optionally: if it's absent or malformed, the pages still render,
just without author links.

### Adding a news item

```json
{
  "date": "2026-09-01",
  "emoji": "🎉",
  "text": "Something <strong>happened</strong>.",
  "image": "assets/img/news-teaser.webp",
  "links": [{ "label": "Paper", "url": "https://…" }]
}
```

`date` is `YYYY-MM-DD` (or `YYYY-MM`), but only the **month and year** are displayed. The homepage renders only
the newest 3 — older entries stay in the file but are not shown, so nothing is lost by keeping them. Change the
`slice(0, 3)` in `renderHome` to show more. `emoji` is optional and renders before the text. `image` is optional
too — a teaser shown under the text, capped at 420px wide.
`text` allows inline HTML (`<strong>`, `<em>`, `<a>`) — it is intentionally *not* escaped, so only put your own content there.

## Things to fill in

- **`data/authors.json`** — no Google Scholar profile found for **Andrea Zenotto**; his name renders as plain
  text until a URL is added.
- **Social links** — icons for `orcid`, `semanticscholar` and `bluesky` are still built into `site.js`, so
  re-adding any of them is a one-line entry in `profile.json` → `links`.

## Images

The portrait (`assets/img/profile.jpg`) and the six paper teasers (`assets/img/pubs/`) were carried over from the
old al-folio site and sized to what the layout actually displays: 560px wide for the portrait (shown at 264px, so
560 covers a 2× screen) and 520px for the teasers (118px on desktop, full-width on mobile). Progressive JPEG,
quality ~80, metadata stripped — 232 KB in total.

If you replace one, resize it too; dropping in a 4000px original would undo most of the page weight. The command
used was:

```sh
magick in.jpg -resize '520x>' -strip -interlace Plane -quality 74 -sampling-factor 4:2:0 out.jpg
```

Teasers are wired up via the `image` key in `publications.json`, and they appear on the homepage only.

## Typography

The whole site is set in a geometric sans: real **Century Gothic** where the visitor has it installed, with
**Jost** as the fallback everywhere else. Both come from the same Futura lineage, so the layout holds either way.
The stack lives in one place — `--font-geometric` in `assets/css/style.css`.

Jost is **self-hosted** from `assets/fonts/` rather than loaded from Google Fonts, which keeps it on one origin
and off the critical path: four variable-weight `woff2` files (roman and italic × latin and latin-ext), declared
with `@font-face` at the top of `style.css`. The cyrillic subsets Google serves are not included. `unicode-range`
means latin-ext is only downloaded if a character in that range actually appears, so the typical visit fetches
one 26 KB file, preloaded in each page's `<head>`.

Jost is under the SIL Open Font License 1.1 — [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt). Keep that file
alongside the fonts if you redistribute them.

To change or add a weight, re-download from Google Fonts with a modern browser user-agent (older ones get `ttf`
instead of `woff2`) and update the `@font-face` blocks:

```sh
curl -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0" \
  "https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300..700;1,300..600&display=swap"
```

## Running locally

The pages `fetch()` the JSON files, so opening `index.html` from the filesystem won't work — serve the folder:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

Push to the `main` branch of `sapeirone/sapeirone.github.io`. GitHub Pages serves it as-is;
`.nojekyll` disables Jekyll processing. Bump `<lastmod>` in `sitemap.xml` when the content changes.

## Structure

```
index.html            About + news + selected publications
publications.html     Full list, grouped by year (text only)
cv.html               CV with sticky section nav
404.html              Error page; uses root-absolute asset paths
cv.pdf                The authoritative CV
robots.txt            Allows everything, points at the sitemap
sitemap.xml           The three real pages
assets/css/style.css  Design tokens (light/dark) + all layout
assets/js/site.js     Fetches the JSON and renders each page
data/*.json           All content
CLAUDE.md             Working notes for Claude Code
```

Dark mode follows the visitor's system setting automatically; there is no toggle.
The accent colour is ink blue, defined once as `--accent` (plus `--accent-hover` / `--accent-soft` / `--accent-line`)
in `:root` and again in `:root[data-theme="dark"]` — change those two blocks to recolour the whole site.
