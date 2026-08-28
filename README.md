# sapeirone.github.io

Personal academic website. Static HTML + CSS + a bit of vanilla JS — **no build step, no dependencies**.
All the content lives in JSON files under [`data/`](data/), so updating the site means editing JSON, never HTML.

## Editing content

| File | What it holds |
| --- | --- |
| [`data/profile.json`](data/profile.json) | Name, role, bio paragraphs, "Currently" card, social links (header + footer) |
| [`data/news.json`](data/news.json) | News timeline on the homepage. Newest first. |
| [`data/publications.json`](data/publications.json) | Every paper, preprint and technical report |
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
  "links": { "page": "", "paper": "", "code": "", "video": "" }
}
```

- `type` — one of `conference`, `journal`, `preprint`, `report`. It sets the badge and the teaser fallback label.
- `selected: true` — promotes the paper to the homepage "Selected publications" block.
- `equalContribution` — names listed here get a `*`; a footnote badge appears automatically.
- `links` — any of `page`, `paper`, `arxiv`, `code`, `video`, `poster`, `slides`, `bibtex`.
  `arxiv`, `code` and `video` render with an icon. Omit what you don't have; the first one present also becomes the title link.
- `image` — optional teaser. Entries without one render as a full-width text card. Drop files in `assets/img/pubs/`.

Your own name is bolded automatically — the match list is `nameAliases` in `profile.json`.

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

`date` is `YYYY-MM-DD` (or `YYYY-MM`). The homepage renders only the newest 3 — older entries stay in the file
but are not shown, so nothing is lost by keeping them. Change the `slice(0, 3)` in `renderHome` to show more.
`emoji` is optional and renders before the text. `image` is optional too — a teaser shown under the text,
capped at 420px wide.
`text` allows inline HTML (`<strong>`, `<em>`, `<a>`) — it is intentionally *not* escaped, so only put your own content there.

## Things to fill in

A few placeholders are waiting for you:

- **`profile.json` → `links`** — the Google Scholar URL is still a placeholder.
  Icons for `orcid`, `semanticscholar` and `bluesky` are still built in, so re-adding any of them is a one-line
  entry in that array.
- **`publications.json`** — DOIs/links for the PRL, IJCV and under-review papers are empty.

## Images

The portrait (`assets/img/profile.jpg`) and the five paper teasers (`assets/img/pubs/`) were carried over from the
old al-folio site and resized for the web (900px wide for the portrait, 520px for the teasers; ~640 KB in total).
To swap one, drop a new file in place — teasers are wired up via the `image` key in `publications.json`, and an
entry without an image just renders as a full-width text card.

## Typography

The whole site is set in a geometric sans: real **Century Gothic** where the visitor has it installed, with
**Jost** (loaded from Google Fonts) as the fallback everywhere else. Both come from the same Futura lineage,
so the layout holds either way. The stack lives in one place — `--font-geometric` in `assets/css/style.css`.

## Running locally

The pages `fetch()` the JSON files, so opening `index.html` from the filesystem won't work — serve the folder:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

Push to the `main` branch of `sapeirone/sapeirone.github.io`. GitHub Pages serves it as-is;
`.nojekyll` disables Jekyll processing.

## Structure

```
index.html            About + news + selected publications
publications.html     Full list, grouped by year
cv.html               CV with sticky section nav
cv.pdf                The authoritative CV
assets/css/style.css  Design tokens (light/dark) + all layout
assets/js/site.js     Fetches the JSON and renders each page
data/*.json           All content
```

Dark mode follows the visitor's system setting automatically; there is no toggle.
The accent colour is ink blue, defined once as `--accent` (plus `--accent-hover` / `--accent-soft` / `--accent-line`)
in `:root` and again in `:root[data-theme="dark"]` — change those two blocks to recolour the whole site.
