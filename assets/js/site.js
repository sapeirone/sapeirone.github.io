/* =========================================================
   Site renderer — reads data/*.json and builds each page.
   No build step, no dependencies. Just serve the folder.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Icons (inline SVG, 24x24 viewBox) ---------- */
  const ICONS = {
    email: '<path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m3 6 9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    github: '<path fill="currentColor" d="M12 1.5A10.5 10.5 0 0 0 1.5 12c0 4.64 3 8.57 7.18 9.96.53.1.72-.23.72-.5v-1.9c-2.92.64-3.54-1.24-3.54-1.24-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.08 1.61 1.09 1.61 1.09.94 1.6 2.47 1.14 3.07.87.1-.68.37-1.15.67-1.41-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.07a10 10 0 0 1 5.24 0c2-1.35 2.88-1.07 2.88-1.07.57 1.45.21 2.52.1 2.79.67.74 1.08 1.67 1.08 2.82 0 4.03-2.46 4.92-4.8 5.18.38.33.72.97.72 1.96v2.9c0 .28.19.61.73.5A10.5 10.5 0 0 0 22.5 12 10.5 10.5 0 0 0 12 1.5Z"/>',
    linkedin: '<path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.7c0-1.36-.03-3.11-2-3.11-2 0-2.3 1.48-2.3 3.01V21H9V9Z"/>',
    scholar: '<path fill="currentColor" d="M12 2 1 8.4l11 6.4 9-5.24V16h2V8.4L12 2Z"/><path fill="currentColor" d="M5.5 12.6v3.3c0 2.3 2.9 4.1 6.5 4.1s6.5-1.8 6.5-4.1v-3.3L12 16.3l-6.5-3.7Z"/>',
    orcid: '<path fill="currentColor" d="M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21ZM8.2 17.4H6.6V8.9h1.6v8.5Zm-.8-9.6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm4.3 9.6h-1.6V8.9h3.3c3 0 4.5 1.9 4.5 4.2 0 2.4-1.7 4.3-4.6 4.3h-1.6Zm0-1.5h1.5c2 0 3-1.3 3-2.8s-.9-2.7-3-2.7h-1.5v5.5Z"/>',
    semanticscholar: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Zm4.6 6.3c-1.9 3.2-4.6 5.3-8 6.9-.4.2-.6.1-.8-.3-.3-.7-.7-1.3-1-2 2.9-.7 5.4-2 7.6-4 .9-.8 1.6-1.7 2.2-2.7.2.7.2 1.4 0 2.1Zm-1 4.2c-1.4 2-3.3 3.4-5.5 4.4-.5.2-.7.1-.9-.4l-.6-1.5c2.6-.8 4.8-2.2 6.6-4.3.2.6.3 1.2.4 1.8Z"/>',
    bluesky: '<path fill="currentColor" d="M12 10.8C10.9 8.7 7.9 4.7 5.1 2.7 2.4.8 1.4 1.1.8 1.4.1 1.7 0 2.9 0 3.6c0 .7.4 5.7.6 6.5.8 2.8 3.7 3.7 6.4 3.4h.4-.4c-4 .6-7.5 2-2.9 7.2 5 5.2 6.9-1.1 7.9-4.3 1 3.2 2.1 9.3 7.8 4.3 4.3-4.3 1.2-6.6-2.8-7.2h-.4.4c2.7.3 5.6-.6 6.4-3.4.2-.8.6-5.8.6-6.5 0-.7-.1-1.9-.8-2.2-.6-.3-1.6-.6-4.3 1.3-2.8 2-5.8 6-6.9 8.1Z"/>',
    website: '<circle cx="12" cy="12" r="9.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 12h18M12 2.8c2.4 2.5 3.6 5.6 3.6 9.2S14.4 18.7 12 21.2c-2.4-2.5-3.6-5.6-3.6-9.2S9.6 5.3 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    file: '<path d="M14 3H7a1.8 1.8 0 0 0-1.8 1.8v14.4A1.8 1.8 0 0 0 7 21h10a1.8 1.8 0 0 0 1.8-1.8V8L14 3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.8 3.2V8.2h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    arxiv: '<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M7.8 8h8.4M7.8 12h8.4M7.8 16h5.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    hf: '<circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="9.3" cy="10.3" r="1.05" fill="currentColor"/><circle cx="14.7" cy="10.3" r="1.05" fill="currentColor"/><path d="M8.6 14c.8 1.2 2 1.9 3.4 1.9s2.6-.7 3.4-1.9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    video: '<rect x="2.6" y="4.8" width="18.8" height="14.4" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.4 9.2 15.2 12l-4.8 2.8V9.2Z" fill="currentColor"/>',
  };

  const icon = (name, cls) =>
    ICONS[name]
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"${cls ? ` class="${cls}"` : ""}>${ICONS[name]}</svg>`
      : "";

  /* ---------- Small helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // News shows month + year; any day component in the data is ignored.
  function formatDate(iso) {
    const m = /^(\d{4})-(\d{2})/.exec(String(iso).trim());
    if (!m) return esc(iso);
    return `${MONTHS[parseInt(m[2], 10) - 1] || ""} ${m[1]}`;
  }

  async function loadJSON(name) {
    const res = await fetch(`data/${name}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`Could not load data/${name}.json (${res.status})`);
    return res.json();
  }

  // Optional data file: a missing or malformed one must not break the page.
  async function loadJSONOptional(name, fallback) {
    try {
      return await loadJSON(name);
    } catch (err) {
      console.warn(err);
      return fallback;
    }
  }

  function fail(el, err) {
    if (!el) return;
    el.innerHTML = `<p class="loading">Could not load this section. ${esc(err.message || err)}<br>
      <span class="mono">If you opened the file directly, serve the folder instead: <b>python3 -m http.server</b></span></p>`;
    console.error(err);
  }

  /* ---------- Author formatting ---------- */
  function makeAuthorFormatter(profile, scholar) {
    const aliases = (profile.nameAliases || [profile.name]).map((a) => a.toLowerCase());
    // data/authors.json is a plain name -> Google Scholar URL map; keys starting
    // with "_" are comments, and an empty value means "no profile known".
    const links = {};
    Object.keys(scholar || {}).forEach((k) => {
      if (k.charAt(0) !== "_" && scholar[k]) links[k.toLowerCase()] = scholar[k];
    });

    return function (authors, equal) {
      const equalSet = new Set((equal || []).map((n) => n.toLowerCase()));
      return (authors || [])
        .map((a) => {
          const isMe = aliases.indexOf(a.toLowerCase()) !== -1;
          const star = equalSet.has(a.toLowerCase()) ? "<sup>*</sup>" : "";
          const url = links[a.toLowerCase()];
          const cls = isMe ? "author me" : "author";
          return url
            ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener" title="Google Scholar">${esc(a)}${star}</a>`
            : `<span class="${cls}">${esc(a)}${star}</span>`;
        })
        .join(", ");
    };
  }

  /* ---------- Chrome: theme + nav ---------- */
  function applyTheme() {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // mark current page
    const here = location.pathname.split("/").pop() || "index.html";
    $$(".nav__links a").forEach((a) => {
      const target = a.getAttribute("href");
      if (target === here || (here === "" && target === "index.html")) a.setAttribute("aria-current", "page");
    });
  }

  /* ---------- Shared blocks ---------- */
  function socialHTML(links) {
    return (links || [])
      .map(
        (l) =>
          `<a href="${esc(l.url)}" title="${esc(l.label)}" aria-label="${esc(l.label)}"${
            l.url.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"'
          }>${icon(l.type) || icon("website")}</a>`
      )
      .join("");
  }

  function renderFooter(profile) {
    const el = $("#footer");
    if (!el) return;
    el.innerHTML = `
      <div class="wrap footer__inner">
        <p><strong>${esc(profile.name)}</strong> · ${esc(profile.affiliation)} · ${esc(profile.location)}</p>
        <div class="social">${socialHTML(profile.links)}</div>
      </div>`;
  }

  function renderNavBrand(profile) {
    const brand = $(".nav__brand");
    if (brand) brand.innerHTML = `<span>${esc(profile.shortName || profile.name)}</span>`;
    const navSocial = $("#nav-social");
    if (navSocial) navSocial.innerHTML = socialHTML(profile.links);
  }

  /* ---------- Publication card ---------- */
  const LINK_LABELS = { page: "Project page", paper: "Paper", arxiv: "arXiv", code: "Code", hf: "Hugging Face", video: "Video", poster: "Poster", slides: "Slides" };
  const LINK_ORDER = ["page", "paper", "arxiv", "code", "hf", "video", "poster", "slides"];
  const LINK_ICONS = { arxiv: "arxiv", code: "github", hf: "hf", video: "video" };

  function pubHTML(pub, fmtAuthors, opts) {
    opts = opts || {};
    const links = pub.links || {};
    const primary = links.page || links.paper || links.arxiv || links.code || null;

    const hasThumb = opts.thumb && pub.image;
    const thumb = hasThumb
      ? `<div class="pub__thumb"><img src="${esc(pub.image)}" alt="" loading="lazy" onerror="this.parentNode.remove()"></div>`
      : "";

    const linkChips = LINK_ORDER.filter((k) => links[k])
      .map(
        (k) =>
          `<a href="${esc(links[k])}" target="_blank" rel="noopener">${icon(LINK_ICONS[k])}${LINK_LABELS[k]}</a>`
      )
      .join("");

    // Named venues read well as "ICCV 2025"; generic ones stand alone, since the
    // year heading above the group already states the year.
    const named = pub.type === "conference" || pub.type === "journal";
    const badges = [
      `<span class="badge" title="${esc(pub.venueLong || pub.venue)}">${esc(pub.venue)}${named ? " " + esc(pub.year) : ""}</span>`,
      pub.award ? `<span class="badge badge--warm">${esc(pub.award)}</span>` : "",
      pub.equalContribution ? `<span class="badge badge--muted">* equal contribution</span>` : ""
    ].join("");

    const title = primary
      ? `<a href="${esc(primary)}" target="_blank" rel="noopener">${esc(pub.title)}</a>`
      : esc(pub.title);

    return `
      <article class="pub"${hasThumb ? "" : ' style="grid-template-columns:1fr"'}>
        ${thumb}
        <div>
          <h3 class="pub__title">${title}</h3>
          <p class="pub__authors">${fmtAuthors(pub.authors, pub.equalContribution)}</p>
          ${pub.tldr ? `<p class="pub__tldr">${esc(pub.tldr)}</p>` : ""}
          <div class="pub__meta">${badges}${linkChips ? `<div class="pub__links">${linkChips}</div>` : ""}</div>
        </div>
      </article>`;
  }

  /* ---------- Page: home ---------- */
  async function renderHome() {
    const [profile, news, pubs, authors] = await Promise.all([
      loadJSON("profile"), loadJSON("news"), loadJSON("publications"), loadJSONOptional("authors", {})
    ]);
    const fmtAuthors = makeAuthorFormatter(profile, authors);

    renderNavBrand(profile);

    // Hero
    const nameParts = profile.name.split(" ");
    const last = nameParts.pop();
    const initials = (nameParts[0] || "")[0] + last[0];

    $("#hero").innerHTML = `
      <div class="wrap hero__grid">
        <div>
          <h1 class="hero__name"><span class="light">${esc(nameParts.join(" "))}</span>${esc(last)}</h1>
          ${profile.tagline ? `<p class="hero__tagline">${esc(profile.tagline)}</p>` : ""}
          <div class="hero__bio">${(profile.bio || []).map((p) => `<p>${p}</p>`).join("")}</div>
          <div class="hero__actions">
            <a class="btn" href="publications.html">Publications ${icon("arrow")}</a>
            <a class="btn" href="${esc(profile.cv)}" target="_blank" rel="noopener">${icon("file")} Curriculum Vitae</a>
          </div>
        </div>
        <aside class="hero__aside">
          <div class="portrait">
            <div class="portrait__fallback">${esc(initials)}</div>
            ${
              profile.photo
                ? `<img src="${esc(profile.photo)}" alt="${esc(profile.name)}" onerror="this.remove()">`
                : ""
            }
          </div>
          <div class="now-card">
            <h3>Currently</h3>
            <ul class="now-list">
              ${(profile.now || [])
                .map(
                  (n) => `<li><b>${esc(n.label)}</b><span>${esc(n.detail || "")}</span>${
                    n.since ? `<time>${esc(n.since)}</time>` : ""
                  }</li>`
                )
                .join("")}
            </ul>
          </div>
          ${
            (profile.interests || []).length
              ? `<div class="now-card">
                   <h3>Interests</h3>
                   <p class="now-card__text">${profile.interests.map(esc).join(" &middot; ")}</p>
                 </div>`
              : ""
          }
        </aside>
      </div>`;

    // News
    const newsItem = (n) => `<li>
      <time datetime="${esc(n.date)}">${formatDate(n.date)}</time>
      <div class="news__body">
        <p>${n.emoji ? `<span class="news__emoji">${esc(n.emoji)}</span>` : ""}${n.text}${
          (n.links || []).length
            ? `<span class="news__links">${n.links
                .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`)
                .join("")}</span>`
            : ""
        }</p>
        ${n.image ? `<img class="news__media" src="${esc(n.image)}" alt="" loading="lazy" onerror="this.remove()">` : ""}
      </div>
    </li>`;

    $("#news").innerHTML = `
      <div class="wrap">
        <div class="section-head"><h2>News</h2></div>
        <ul class="news">${news.slice(0, 3).map(newsItem).join("")}</ul>
      </div>`;

    // Selected publications
    const selected = pubs.filter((p) => p.selected);
    $("#selected").innerHTML = `
      <div class="wrap">
        <div class="section-head">
          <h2>Selected publications</h2>
          <a class="more" href="publications.html">All publications</a>
        </div>
        <div class="pub-list">${selected.map((p) => pubHTML(p, fmtAuthors, { thumb: true })).join("")}</div>
      </div>`;

    renderFooter(profile);
  }

  /* ---------- Page: publications ---------- */
  async function renderPublications() {
    const [profile, pubs, authors] = await Promise.all([
      loadJSON("profile"), loadJSON("publications"), loadJSONOptional("authors", {})
    ]);
    const fmtAuthors = makeAuthorFormatter(profile, authors);
    renderNavBrand(profile);

    const years = Array.from(new Set(pubs.map((p) => p.year))).sort((a, b) => b - a);
    $("#pub-list").innerHTML = years
      .map(
        (y) => `<div class="pub-group">
          <h2 class="pub-group__year">${y}</h2>
          <div class="pub-list">${pubs
            .filter((p) => p.year === y)
            .map((p) => pubHTML(p, fmtAuthors))
            .join("")}</div>
        </div>`
      )
      .join("");

    renderFooter(profile);
  }

  /* ---------- Page: CV ---------- */
  async function renderCV() {
    const [profile, cv] = await Promise.all([loadJSON("profile"), loadJSON("cv")]);
    renderNavBrand(profile);

    const sections = [];

    // Education & experience
    sections.push({
      id: "education",
      label: "Education",
      html: `<div class="timeline">${(cv.education || [])
        .map(
          (e) => `<div class="tl ${e.current ? "tl--current" : ""}">
            <div class="tl__head">
              <div class="tl__inst">${esc(e.institution)}</div>
              <div class="tl__period">${esc(e.period)}</div>
              <div class="tl__degree">${esc(e.degree)}</div>
              <div class="tl__loc">${esc(e.location || "")}</div>
            </div>
            ${
              (e.details || []).length
                ? `<ul class="tl__details">${e.details.map((d) => `<li>${d}</li>`).join("")}</ul>`
                : ""
            }
            ${
              (e.keywords || []).length
                ? `<div class="tags" style="margin-top:.8rem">${e.keywords.map((k) => `<span class="tag">${esc(k)}</span>`).join("")}</div>`
                : ""
            }
          </div>`
        )
        .join("")}</div>`
    });

    // Awards
    sections.push({
      id: "awards",
      label: "Awards & grants",
      html: `<div class="rows">${(cv.awards || [])
        .map(
          (a) => `<div class="row ${a.highlight ? "row--highlight" : ""}">
            <div class="row__period">${esc(a.year)}</div>
            <div>
              <div class="row__title">${esc(a.title)}</div>
              <div class="row__detail">${esc(a.detail || "")}</div>
            </div>
          </div>`
        )
        .join("")}</div>`
    });

    // Teaching
    sections.push({
      id: "teaching",
      label: "Teaching",
      html: `<div class="rows">${(cv.teaching || [])
        .map(
          (t) => `<div class="row">
            <div class="row__period">${esc(t.period)}</div>
            <div>
              <div class="row__title">${esc(t.title)}</div>
              <div class="row__detail">${esc(t.role)}${t.detail ? ` · ${esc(t.detail)}` : ""}</div>
            </div>
          </div>`
        )
        .join("")}</div>`
    });

    // Students
    sections.push({
      id: "students",
      label: "Students",
      html: `<p class="note">Co-supervised M.Sc. theses at Politecnico di Torino.</p>
        <div class="rows">${(cv.students || [])
          .map(
            (s) => `<div class="row">
              <div class="row__period">${esc(s.period)}</div>
              <div>
                <div class="row__title">${esc(s.name)}</div>
                <div class="row__detail">${esc(s.topic)}</div>
              </div>
            </div>`
          )
          .join("")}</div>`
    });

    // Service
    const svc = cv.service || {};
    sections.push({
      id: "service",
      label: "Academic service",
      html: `
        <div class="rows" style="margin-bottom:1.4rem">${(svc.roles || [])
          .map(
            (r) => `<div class="row">
              <div class="row__period">${esc(r.detail)}</div>
              <div><div class="row__title">${esc(r.title)}</div></div>
            </div>`
          )
          .join("")}</div>
        <h3 style="font-family:var(--font-sans);font-size:.8rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:.7rem">Reviewer for</h3>
        <div class="pill-list">${(svc.reviewing || []).map((v) => `<span class="pill">${esc(v)}</span>`).join("")}</div>`
    });

    $("#cv-nav").innerHTML = sections.map((s) => `<a href="#${s.id}">${s.label}</a>`).join("");
    $("#cv-body").innerHTML = sections
      .map((s) => `<section class="cv-section" id="${s.id}"><h2>${s.label}</h2>${s.html}</section>`)
      .join("");

    // Scroll spy
    if ("IntersectionObserver" in window) {
      const links = $$("#cv-nav a");
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
          });
        },
        { rootMargin: "-90px 0px -70% 0px" }
      );
      $$(".cv-section").forEach((s) => spy.observe(s));
    }

    renderFooter(profile);
  }

  /* ---------- Boot ---------- */
  const PAGES = { home: renderHome, publications: renderPublications, cv: renderCV };

  window.Site = {
    init: function (page) {
      applyTheme();
      document.addEventListener("DOMContentLoaded", function () {
        initNav();
        const render = PAGES[page];
        if (render) {
          render().catch((err) => fail($("main"), err));
        }
      });
    }
  };
})();
