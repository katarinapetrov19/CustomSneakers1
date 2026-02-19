# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all regression tests (Chromium + Firefox)
npm test

# Run a single test file
npx playwright test tests/regression.spec.js

# Run a single test by name
npx playwright test -g "Fabrik project has no .MOV source"

# Run tests in a specific browser only
npx playwright test --project=chromium

# Open the HTML test report
npm run test:report

# Serve the site locally (used automatically by Playwright)
python3 -m http.server 3000
```

## Architecture

This is a **vanilla HTML/CSS/JS static site** with no build step, deployed via GitHub Pages from the `main` branch.

### Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, projects carousel, mail club teaser, contact |
| `projects.html` | Mail Club subscription page (plan selector, quantity, FAQ) |
| `gallery.html` | Infinite-scroll gallery with sticky project info panel |
| `project.html` / `project2–4.html` | Individual project detail pages |

One shared `style.css` covers all pages.

### Key interactive systems in `index.html`

**Projects carousel** — A scroll-hijacking section (`#projects`) that cycles through 3 projects (`FABRIK`, `Urban Street`, `Nature Series`) on wheel events. It uses two alternating background `div`s (A/B) for crossfade transitions and dynamically swaps `<source>` elements on the `<video>` tag. Scrolling up from project 0 goes to `#home`; scrolling down from the last project goes to `#contact`.

**Spray canvas** — A `<canvas>` is injected over the full page. Mouse movement draws a fading pink trail using quadratic Bézier curves with `destination-out` compositing for the fade effect.

**Hero letter parallax** — The `#parallaxText` element's text is split into individual `<span class="letter">` elements. Mouse position repels letters. Clicking triggers an explosion animation that then scrolls to `#gallery`.

**Mail club section** — `#homeSubscribeBtn` is hardcoded to show `Subscribe — 15€ / month`. The `#homePlanSelect` element (if present) drives price and image updates, but the current markup has no select — only the button.

### Key interactive systems in `projects.html`

Plan prices are defined in a `planPrices` object (`mini: 8€`, `midi: 11€`, `maxi: 15€`). The subscribe button text updates on plan change. A `?plan=` URL param preselects the plan on load (used by the homepage subscribe button).

### Key interactive systems in `gallery.html`

Projects are duplicated (cloned) twice by JS for seamless infinite scroll. An `IntersectionObserver` on the scroll container updates the sticky title/description panel as projects scroll into view.

### Assets

- `img/` — all images and videos. Videos for the projects carousel: `img/fabrik.mp4` (Fabrik), `img/game.mp4` / `img/game1.mp4` (Urban Street). `.MOV` files are not used and should not be committed (too large for GitHub).
- `font/Playpen_Sans/` — locally served font used for headings.

### Testing

Playwright tests live in `tests/regression.spec.js`. The `webServer` config in `playwright.config.js` starts `python3 -m http.server 3000` automatically before each test run. Tests cover Chromium and Firefox.
