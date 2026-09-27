# Justin | Web Developer & Designer

My personal portfolio: a single, fast, mobile-first page with my projects, what I do, the tools I use, and a contact form. The design is urban and professional: charcoal and concrete tones, a city-grid backdrop, and a Chicago-flag blue accent with a touch of red.

**Live:** https://t3rminal-cmd.github.io/Portfolio-Bootstrap/

![Portfolio home page in dark mode](screenshots/desktop-dark.jpg)

![Recent work section: every project shown in the same floating browser window over a gray backdrop](screenshots/projects-dark.jpg)

## Features
- **Mobile-first layout.** Phones get a compact photo at the top, a drop-down menu and full-width buttons. Tablets and desktops add columns.
- **Urban, professional style:**
  - numbered section labels (`01 / About`) and clean, bold headings;
  - a framed studio portrait over a faint city-grid backdrop;
  - a terminal window for the skills list.
- **Dark / light theme.** Dark by default. It follows a light device setting, switches with one tap, and remembers your choice.
- **Hero** with a typing animation (web developer, web designer, photographer, runner, snowboarder, foodie).
- **Projects:** a featured project plus a grid of cards, with live-site and code links. Every screenshot uses the same frame (a floating browser window with a soft shadow over a gray backdrop, 1440 × 990), so the cards line up evenly. The featured project also shows its phone layout.
- **Online résumé** (`/resume/`): a sample résumé for a fictional running back turned web developer. It is a single letter-size page (8.5 × 11 in) that looks the same on screen and on paper, so Print / Save PDF always gives exactly one page. It has a career-stats scoreboard and a QR code that opens the live version. On phones the same content stacks into one column.
- **Contact form:** it checks the fields, then sends through [FormSubmit](https://formsubmit.co) without leaving the page. A hidden honeypot field catches spam bots.
- **Navigation:** a sticky bar that highlights the section you're reading, smooth scrolling, sections that fade in, and a back-to-top button.
- **Fast and private:** no frameworks and no CDNs. The fonts and icons are hosted in this repo, so the page makes no requests to other sites (apart from the contact form).
- **Accessible:**
  - a skip link, visible keyboard focus and labeled icon buttons;
  - alt text on every image, and text colors that meet WCAG AA contrast;
  - reduced-motion support, which turns off the animations.
- **Favicon and iPhone home-screen icon:** a `>_` terminal prompt.

## Project layout
```
index.html              The whole site, including the icon sprite
assets/css/styles.css   Theme colors, layout, animations
assets/js/main.js       Theme toggle, phone menu, typing, nav highlight, reveal, back-to-top, contact form
assets/fonts/           Space Grotesk and JetBrains Mono (licenses inside)
assets/img/             Hero photo, link-preview image and project screenshots
assets/icons/           Favicon and Apple touch icon
resume/                 The sample one-page résumé: page, styles, print button and QR code
screenshots/            Images used in this README
tools/                  Mockup frame for project screenshots (not published)
```

## Run locally
```bash
git clone https://github.com/t3rminal-cmd/Portfolio-Bootstrap.git
cd Portfolio-Bootstrap
python3 -m http.server 8000
# open http://localhost:8000
```

No build step and nothing to install.

## Editing
| To change… | Edit |
|---|---|
| Intro, About text, projects, skills | `index.html` |
| Hero photo | `assets/img/justin.webp` (square, 800 × 800). To change it, add a new image to `assets/img/` and update the hero `<img>` in `index.html`. |
| Link preview (shown when the site is shared) | `assets/img/og-image.png`, 1200 × 630 |
| Résumé content | `resume/index.html`. The social links point to each platform's home page because the person is fictional; replace them with real profile URLs. The sheet is a fixed 8.5 × 11 in page, so if you add content, check that it still fits (anything past the bottom margin is cut off rather than spilling onto a second page). |
| Résumé QR code | Regenerate `resume/qr.svg` if the résumé moves: `pip install segno`, then `python3 -c "import segno; segno.make_qr('NEW-URL', error='q').save('resume/qr.svg', scale=8, border=2, dark='#161a20')"` |
| Typing animation words | `words` in `assets/js/main.js` |
| Colors (dark and light) | The variables at the top of `assets/css/styles.css`. `--accent` is the blue and `--red` the red. |
| Contact form destination | The FormSubmit URL in the form's `action` in `index.html` |
| Add a project | Copy an `<article class="card project">` block in `index.html`, and add a screenshot to `assets/img/` made with the mockup tool below so it matches the others. |
| Project screenshots | With Playwright installed (`npm i -D playwright && npx playwright install chromium`), run `node tools/mockup.js <page-url> shot.png "address bar text"` (add `--phone` for the featured layout with a phone). Convert to WebP, e.g. `cwebp -q 82 shot.png -o assets/img/NAME.webp`, and set `width="1440" height="990"` on the `<img>`. |
| Add an icon | Copy the SVG from [Bootstrap Icons](https://icons.getbootstrap.com) into the sprite at the top of `index.html` as a `<symbol id="i-NAME">`, then use `<svg class="i"><use href="#i-NAME"/></svg>` |

## Deploying
Hosted on **GitHub Pages**. Every push to `main` runs **Deploy Site** (`.github/workflows/pages.yml`), which publishes `index.html`, `assets/` and `resume/` (not `tools/` or `screenshots/`). The site updates in about 20 seconds.

One-time setup: Settings → Pages → Build and deployment → Source: **GitHub Actions**.

## Built with
HTML5 · CSS3 · JavaScript · [Bootstrap Icons](https://icons.getbootstrap.com) (MIT) · [FormSubmit](https://formsubmit.co)

The repo keeps its original name from when the site was built on Bootstrap; the current design no longer uses the Bootstrap framework.
