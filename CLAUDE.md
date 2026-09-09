# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Two independent static pages for "Chinois Carrière Pro", a Mandarin-for-business programme by Espoir Chinois. No build system, no package manager, no dependencies. The only external resources are Google Fonts (Outfit + Plus Jakarta Sans) and, after a click, a YouTube embed.

All UI copy and all code comments are in French. Keep new code and content in French.

## The two pages

| File | Role | Stylesheet |
|---|---|---|
| `index.html` | **Paid sales page** — the site root, what visitors get on the bare domain | `vente.css` |
| `masterclass.html` | Older landing page for the free WhatsApp masterclass | `styles.css` |

Both load `script.js`. The names are historical: `index.html` was renamed from `vente.html` so hosts (Vercel) serve the sales page at `/`, and the former `index.html` became `masterclass.html`. Hence the sales page uses `vente.css` — that mismatch is deliberate, not a leftover.

`assets/` holds the web-optimised images (banner in two widths, logo plus its light-on-dark variant, video poster). The full-resolution originals sit at the repo root.

## Running

No build, lint, or test step. Open a page directly, or serve the folder:

```bash
python3 -m http.server 8000   # http://localhost:8000
```

## Architecture

**`vente.css`** — design tokens in `:root`: the palette is deliberately restricted to `#025EE7` / `#000000` / `#FFFFFF`. Greys are blacks at low opacity, not new hues; `--color-bar` and `--color-footer` are the two exceptions, and `--color-red` exists only for button hover. Use the tokens, not literals. `/* ==== SECTION ==== */` banners mirror the HTML order.

**`script.js`** — plain functions, all wired from one `DOMContentLoaded` listener at the top. Each `init*` guards on element presence and returns early, which is why one file can serve two pages with different markup.

### Cross-cutting patterns worth knowing

- **`handleFormSubmit` is intentionally global.** It is called from an inline `onsubmit` on the registration form, not from `DOMContentLoaded`. Renaming or scoping it breaks submission silently.

- **Checkout is external.** Both price buttons are plain links to Chariow (`/chinoiscarriere/checkout` for the one-off, `/chinoiscarriere1/checkout` for the two-instalment plan). `payment.js` still holds a provider-agnostic Mobile Money adapter (PawaPay / CinetPay / Moneroo) but **is not loaded by any page** — it binds to `[data-plan]` buttons that no longer exist. Keep it only if a direct integration is planned.

- **The registration modal in `index.html` is unreachable.** Nothing opens it since the switch to Chariow links. Its markup and close handlers still work; it just has no trigger.

- **The video is a facade, not an embed.** `.video-facade` shows `assets/video-poster.jpg` with a blue play button; `initVideo` swaps in the YouTube iframe on first click. This is what allows a blue play button instead of YouTube's red one, and keeps the page light until the visitor asks for it.

- **Offer animations replay on scroll.** `initIncludes` toggles `.in-view` on each `.include-item` via IntersectionObserver, on enter *and* leave, so the animation runs again on every pass. The check is drawn and visible at rest, so nothing disappears if the script fails.

- **The sticky CTA is fixed at every screen size.** `.site-footer` carries `padding-bottom: 104px` to clear it. That clearance must live on the footer's own `padding` shorthand — an earlier separate `padding-bottom` rule was silently overridden by it.

- **Responsive overrides are centralized** at the bottom of each stylesheet, not next to the components.

- `masterclass.html` has 4 carousel slides but only 3 dots; its footer legal links (`#mentions`, `#confidentialite`, `#cgv`) resolve to nothing.
