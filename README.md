# Personal website — plain HTML

No Jekyll, no Ruby, no build step. GitHub Pages serves these files exactly as they are.

## File tree

```
.
├── index.html                ← English page: "about" and "publications" (URL: /)
├── es/
│   └── index.html            ← Spanish page: "sobre mí" and "publicaciones" (URL: /es/)
├── assets/
│   ├── css/style.css         ← all styling; colors at the top
│   ├── js/site.js            ← dark-mode toggle, EN/ES switching, menu highlighting
│   ├── img/prof_pic.jpg      ← your photo
│   └── pdf/
│       ├── CV.pdf            ← English CV (every "cv" link points here)
│       └── CV-es.pdf         ← Spanish CV (the Spanish page uses it once this file exists)
├── publications/index.html   ← redirect: old /publications/ links → /#publications
├── teaching/index.html       ← redirect: old /teaching/ links → home page
├── .nojekyll                 ← tells GitHub not to run Jekyll; keep it
└── README.md                 ← this file
```

The two redirect files just keep old links (e.g. on other people's pages) from breaking. You can delete them if you don't care about that.

## English / Español

There are two pages: English at `/` (`index.html`) and Spanish at `/es/` (`es/index.html`).
The EN/ES button links to the other page and keeps you in the same section.

- **Intro text:** edit the English intro in `index.html` and the Spanish intro in `es/index.html`.
  Keep them saying the same things.
- **Papers are added only to the English page.** The Spanish page loads the list from
  `index.html` automatically and swaps "with" → "con", "and" → "y", "Submitted" → "Enviado"
  and the "journal" button → "revista". Titles and journal names are never translated.
- **Menu or header changes** (e.g. a new section) go in both pages.
- **Spanish CV:** add it as `assets/pdf/CV-es.pdf`. Until that file exists, the Spanish page's
  cv links fall back to the English CV.

## Common edits

All of these are in `index.html` (the English page) unless stated otherwise.

**Update the CV.** Replace `assets/pdf/CV.pdf` with the new file, using the same name. You don't need to edit any links.

**Add a paper.** Find the `PUBLICATIONS` section. There's a comment with a template block. Copy it and paste it at the **top** of "Preprints" or "Published" (the lists are newest first). Add as many link buttons as you like: arXiv, journal, slides, code.

**Move a preprint to Published.** Cut its `<li class="pub"> … </li>` block, paste it at the top of "Published", and update the venue.

**Edit the About text.** It's ordinary HTML paragraphs (`<p>…</p>`) in the `ABOUT` section.

**Change colors.** Edit the variables at the top of `assets/css/style.css`. The first block is light mode and the second is dark mode. `--accent` is the link and menu color.

**Add a new section** (e.g. `talks`):
1. In `index.html`, add a block before `</main>`:
   ```html
   <section id="talks">
     <h2 class="section-title">talks</h2>
     <p>…</p>
   </section>
   ```
2. Add `<a href="#talks">talks</a>` to the menu in the header.
3. Do the same in `es/index.html`, in Spanish (`charlas`).

The menu underlines whichever section is on screen automatically.

## Preview locally

```bash
cd path/to/this/folder
python3 -m http.server
```
Then open http://localhost:8000. Double-clicking `index.html` works for the English page. The Spanish page needs the server, because it loads the paper list from the English page.

## Publish

Commit and push. GitHub Pages updates within a minute or so.
