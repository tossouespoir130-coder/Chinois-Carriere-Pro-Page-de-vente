# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page French-language landing page (funnel) for "Chinois Carrière Pro", a Mandarin-for-business masterclass by Espoir Chinois. Three files, no build system, no package manager, no dependencies. The only external resource is Google Fonts (Outfit + Plus Jakarta Sans).

All UI copy and all code comments are in French. Keep new code and content in French.

## Running

There is no build, lint, or test step. Open `index.html` directly in a browser, or serve it to avoid file:// quirks:

```bash
python3 -m http.server 8000   # then http://localhost:8000
```

Changes are picked up on reload; there is no watcher or hot reload.

## Architecture

**`index.html`** — the whole page in document order: floating header → hero → carousel (`#impact`) → 3 pillars (`#piliers`) → before/after (`#transformation`) → instructor (`#presentateur`) → FAQ (`#faq`) → final CTA → WhatsApp modal → footer. Footer nav links point at those section ids.

**`script.js`** — seven plain functions, six of them wired from one `DOMContentLoaded` listener at the top of the file. Each `init*` guards on element presence and returns early, so sections can be removed from the HTML without breaking the rest.

**`styles.css`** — one stylesheet. Design tokens live in `:root` ([styles.css:6-56](styles.css#L6-L56)): color scale, `--font-heading`/`--font-body`, radii, shadows, and shared cubic-bezier transitions. Use the tokens rather than literal values. `/* ==== SECTION ==== */` banner comments mirror the HTML section order.

### Cross-cutting patterns worth knowing

- **CTA → modal wiring is class-based.** Any button carrying `open-modal-btn` opens the registration modal ([script.js](script.js) `initModal`). Adding a new CTA anywhere on the page needs that class and no JS change.

- **`handleFormSubmit` is intentionally global.** It is invoked from an inline `onsubmit="handleFormSubmit(event)"` on the form ([index.html:600](index.html#L600)), not from `DOMContentLoaded`. Renaming it, wrapping it in a module, or scoping it will break form submission silently.

- **The form has no backend.** It validates name/phone/email client-side, then `window.open`s `https://api.whatsapp.com/send?text=...` and replaces the form's `innerHTML` with a success block. Leads are never stored or transmitted anywhere. Two consequences: the URL carries no phone number, so it lands on WhatsApp's contact picker rather than a specific recipient; and the collected phone number is not used in the generated message (only name and email are).

- **Carousel state is manual.** Slides toggle via a `.active` class (`display: none` → `block`). Autoplay runs on a 20s interval alongside a separate 100ms interval driving the progress bar; hover sets an `isPaused` flag that makes both ticks no-op rather than clearing them. Dot buttons are hand-written in the HTML with `data-dot` indices — there are currently 4 slides but only 3 dots ([index.html:246-248](index.html#L246-L248)), so the fourth slide has no indicator. Adding a slide means adding its dot by hand.

- **FAQ accordion measures height in JS.** Opening an item sets `max-height` from `scrollHeight`; only one item stays open at a time. Answer content that changes size after opening will be clipped unless re-measured.

- **Responsive overrides are centralized, not colocated.** Both breakpoints (`max-width: 992px` and `max-width: 768px`) sit at the bottom of the stylesheet ([styles.css:1520](styles.css#L1520), [styles.css:1558](styles.css#L1558)). Mobile adjustments for a component go there, not next to the component's base rules.

- The modal locks page scroll by writing `document.body.style.overflow` directly; anything else touching body overflow will fight it.

## Known gaps

Footer legal links (`#mentions`, `#confidentialite`, `#cgv`) are placeholders that resolve to nothing.
