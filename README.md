# Elephant Hawk — website

The marketing site for **Elephant Hawk LLC** (www.elephanthawk.com).

> *Where innovators meet operational conviction.*

## What's here

A small, hand-built multi-page site. Plain HTML, CSS, and a tiny bit of
JavaScript — **no build step, no frameworks, no dependencies**. You can open
any `.html` file straight in a browser.

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, key stats, what-we-do teaser |
| `about.html` | About — the problem, what we do, the long view |
| `approach.html` | Approach — the four partnership models |
| `styles.css` | One shared stylesheet for every page (design tokens at the top) |
| `script.js` | Mobile menu toggle + auto-updating footer year |

## Editing the content

All the words live directly in the `.html` files — just open one and change
the text between the tags. The colors, fonts, and spacing are controlled by the
"design tokens" (the `--name: value` lines) at the top of `styles.css`; change a
token once and it updates everywhere.

The header and footer are repeated in each page. If you change one (e.g. add a
nav link), make the same change in all three files.

## Previewing locally

From this folder, run a simple local web server and open the address it prints:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publishing (GitHub Pages)

This repo is set up to be served as a static site. In the GitHub repo settings,
under **Pages**, choose the `main` branch / root folder, and GitHub will host it.
Point the `www.elephanthawk.com` domain at it via a `CNAME` record + the
**Custom domain** field in Pages settings.

---

© Elephant Hawk LLC · Cheyenne, WY
