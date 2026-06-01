---
name: Workspace Guidelines & Rules
description: Enforces codebase conventions including Bun usage, Astro v6 architecture, client-side event binding for view transitions, design system/tokens, layout wrapping, and static asset handling.
activation: always_on
---

# Workspace Guidelines & Rules

This document details development guidelines, architectural conventions, and code patterns for this repository. All agents must read and follow these rules strictly.

---

## 1. Package Manager & Script Commands

> [!IMPORTANT]
> This project uses **Bun** as its package manager instead of NPM, Yarn, or pnpm. Do not run `npm`, `yarn`, or `pnpm` commands.

Always run commands via Bun:
- **Development Server:** `bun run dev`
- **Build Website:** `bun run build` (Generates static output in `/dist`)
- **Preview Production Build:** `bun run preview`
- **Dependencies Management:** `bun install` or `bun add <package>`

---

## 2. Architecture & Directory Layout

The application is built using **Astro v6** configured for static generation.

- **`/src/pages/`**: File-based routing for all views (`index.astro`, `bio.astro`, `cv.astro`, `softwares.astro`, `hardwares.astro`, `musicas.astro`, `tcc.astro`, `imagens.astro`, `videos.astro`).
- **`/src/components/`**: Modular components.
- **`/src/layouts/`**: Page layout containers:
  - `BaseLayout.astro`: Outer frame (Header, Footer/SocialMedia, fonts, viewport). Used for landing (`index.astro`) and `bio.astro`.
  - `ArticleLayout.astro`: Wraps `BaseLayout` and imports `article.css` (applies left-aligned padding and tag styles for article pages). Used for CV, softwares, hardwares, musicas, and tcc.
- **`/src/styles/`**: Vanilla CSS files containing typography and styling layers:
  - `styles.css`: Global styles, layout grid, transitions, and main typography.
  - `article.css`: Specialized styling for text-heavy article layouts, including list layouts and tag blocks.
- **`/src/data/`**: Static TypeScript/JSON datasets (e.g., `albums.ts`) that feed pages and components.
- **`/src/assets/`**: Images, PDFs, and local binary resources imported via ESM.

---

## 3. Design System & CSS Rules

- **Frameworks:** Do **NOT** use external CSS frameworks like Tailwind CSS. Write clean vanilla CSS.
- **Color Palette & Typography:** Standardize on CSS variables defined in `/src/styles/styles.css`:
  - Background: `var(--bg-color)` (`#050505`)
  - Typography: Primary is `var(--font-family-main)` (`'Special Elite', system-ui`); secondary body paragraphs use `var(--font-family-secondary)` (`'Cormorant', serif`).
  - Fluid Sizes: Use clamp variables for fonts (e.g., `var(--text-base)`, `var(--text-lg)`, `var(--text-xl)`).
- **Glassmorphism:** Apply the standard frosted dark styling for card borders and sticky menus:
  ```css
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    inset 0 0 22px 11px rgba(255, 255, 255, 0.05);
  ```

---

## 4. Client-Side JavaScript & View Transitions

> [!WARNING]
> The site uses Astro's View Transitions (`ClientRouter`). Standard page lifecycle events like `window.onload` or simple `<script>` tag executions will fail to re-initialize UI interactions when navigating between pages.

Always bind event listeners and setup page script logic using transition hooks:
- For setup tasks, bind to `astro:page-load` or `astro:after-swap` events.
- **Example pattern:**
  ```javascript
  function initComponentLogic() {
    // Setup event listeners on target DOM elements here
  }

  // Initial load
  initComponentLogic();

  // Re-run on navigation swaps
  document.addEventListener("astro:after-swap", initComponentLogic);
  ```

---

## 5. Specific Component Behaviors

### `AlbumCard.astro`
- Implements a 3D-perspective hover card that flips 180 degrees (`.active`) on click.
- Front face: Displays album cover (`astro:assets` optimized image), title, year, and tracks list.
- Back face: **Dynamically creates and mounts** a SoundCloud iframe player on card activation, and **destroys/empties** it 800ms after the close button is clicked (to conserve resources and prevent audio from playing in the background).
- Ensure client-side interactions guard against pointer-events blocking iframe clicks when the front card is rotated.

### `ArticleSection.astro`
- Receives a title, optional id, and a `tags` array parameter.
- Automatically handles tag list rendering inside a container with glassmorphic tags.

---

## 6. Verification Checklist for Agents

Before completing any task:
1. **Lint & Build check:** Always run `bun run build` to verify there are no Astro compilation or TypeScript type-checking errors.
2. **HTML Semantics:** Follow correct heading hierarchies (e.g. single `<h1>` for page titles and sequential nested tags).
3. **Responsive Design:** Verify layouts fit nicely under both landscape and mobile portrait layouts.
