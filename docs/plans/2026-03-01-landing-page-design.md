# DigiLab Home Page Design

**Date:** 2026-03-01
**Status:** Ready for Implementation

## Overview

Redesign of the DigiLab home page. Moving away from heavy "SaaS marketing" aesthetic toward a lean, functional hub. Most users already know what Digimon TCG is — they found us through Discord/Reddit/word of mouth. They want to *use* the site, not be *sold* on it.

This is a **home page** (hub with navigation), not a **landing page** (single conversion goal).

## Design Philosophy

**"Functional hub with Digimon soul"**

- Lean and useful, not marketing-heavy
- Get users to the app quickly
- Surface recent content (posts, updates)
- Clean and premium like official Digimon TCG materials
- Deep blue as primary brand color (not dark/black)
- Light backgrounds for content readability
- Subtle digital textures (generative circuits) — not glowing/neon
- Pixel art touches for nostalgic charm (Agumon companion)
- Orange accent for warmth and CTAs

## Reference Materials

Design references collected in `docs/design-references/`:
- Official Digimon TCG card back (blue polygonal Digi-Egg, clean white background, subtle circuits)
- TCG playmat aesthetic (deep blue with cyan circuit patterns)
- Pixel art sprites (virtual pet, Game Boy style, Digivice crests)
- Premium card presentations (holographic, vibrant)

## Color System

### Light Mode (Primary)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | #F8FAFC | Page background |
| `--color-surface` | #FFFFFF | Cards, content areas |
| `--color-primary` | #0F4C81 | Headers, hero, primary UI |
| `--color-primary-dark` | #0A3055 | Darker blue accents |
| `--color-accent` | #F7941D | CTAs, highlights, interactive |
| `--color-accent-hover` | #E8842C | Accent hover state |
| `--color-digital` | #00C8FF | Circuit nodes, digital accents (cyan) |
| `--color-text` | #1A202C | Body text |
| `--color-text-muted` | #64748B | Secondary text |
| `--color-border` | #E2E8F0 | Borders, dividers |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background` | #1A202C | Page background |
| `--color-surface` | #2D3748 | Cards, content areas |
| `--color-primary` | #0F4C81 | Still blue, but on dark |
| `--color-primary-dark` | #0A3055 | Deeper accents |
| `--color-accent` | #F7941D | Same orange |
| `--color-digital` | #00C8FF | Cyan pops more on dark |
| `--color-text` | #E2E8F0 | Light text |
| `--color-text-muted` | #A0AEC0 | Secondary text |
| `--color-border` | #4A5568 | Borders |

## Typography

From `_brand.yml` (keep consistent with app):

| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Headings | Poppins | 600-700 | Friendly, rounded, readable |
| Body | Inter | 400-500 | Clean, professional |
| Mono/Code | Fira Code | 400 | For technical content |

## Digital Texture Patterns

### Grid Overlay (on blue surfaces)
```css
background-image:
  repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 30px),
  repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, transparent 1px, transparent 30px);
```

### Circuit Node
```css
.circuit-node {
  width: 6px;
  height: 6px;
  background: rgba(0, 200, 255, 0.4);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 200, 255, 0.6);
}
```

### Circuit Line
```css
.circuit-line {
  width: 30px;
  height: 1px;
  background: linear-gradient(90deg, rgba(0, 200, 255, 0.5), transparent);
}
```

Use sparingly — 1-2 circuit accents per section max. They should feel like subtle details, not the main attraction.

## Page Structure

### Overview

Lean, functional layout. No marketing fluff.

```
┌─────────────────────────────────────────────────┐
│ [Logo] DigiLab          Blog | Roadmap | About  │  ← Header
├─────────────────────────────────────────────────┤
│                                                 │
│  Track your local Digimon TCG scene             │
│  Player ratings, deck meta, tournament history  │  ← Hero (compact)
│                                                 │
│  [Launch App →]                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Recent Posts              What's New           │
│  ─────────────             ───────────          │  ← Content (useful)
│  • Rating System v2.0      • 5 regions live     │
│  • Post title here         • New deck tracking  │
│  • Another post            • Bug fixes          │
│                                                 │
│  [View all posts →]        [View roadmap →]     │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer: Links, socials, copyright              │  ← Footer
├─────────────────────────────────────────────────┤
│                           [Pixel Agumon]  🦖    │  ← Companion (corner)
└─────────────────────────────────────────────────┘

   ~~~ Generative circuit lines in background ~~~
```

### Header
- **Position:** Sticky top
- **Background:** White/light (or blue, TBD)
- **Style:** Clean, minimal

**Navigation:**
```
[Logo] DigiLab    Blog | Roadmap | About    [Discord] [🌙] [Launch App]
```

**Elements:**
- Logo + wordmark (links to home)
- Blog, Roadmap, About links
- **Discord link** — icon link to community
- **Dark mode toggle** — sun/moon icon, syncs with system preference
- **Launch App button** — primary CTA to app.digilab.cards

**Future:** When multiple tools exist, add "Tools" dropdown to nav.

### Hero Section (Compact)
- **Background:** Blue gradient with generative circuit animation
- **Content:**
  - Headline: "Track your local Digimon TCG scene"
  - Subtitle: "Player ratings, deck meta, tournament history"
  - Primary CTA: "Launch App →"
  - Secondary: Discord icon/link (community)
- **Size:** Compact — not full viewport height, just enough
- **Transition:** Gradient fade to white below

### Content Section
- **Background:** White/light
- **Layout:** Two columns (or stacked on mobile)

**Left: Recent Posts**
- 3-5 recent blog post titles as links
- "View all posts →" link

**Right: What's New**
- Recent updates/changelog items
- Could pull from roadmap or manual list
- "View roadmap →" link

### Footer
- **Background:** Dark blue (#0A3055)
- **Style:** Compact, functional

**Content:**
```
DigiLab                     Tools                   Community
Track your local scene      App                     Discord
                            Insights (coming soon)  GitHub
Pages                       Admin (coming soon)     Ko-fi
Blog
Roadmap                     © 2026 DigiLab
About
```

**Future tools** listed here with "coming soon" — placeholder for when they launch.

## Component Specifications

### Buttons

**Primary (Orange):**
```css
.btn-primary {
  background: linear-gradient(135deg, #F7941D 0%, #E8842C 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(247, 148, 29, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(247, 148, 29, 0.4);
}
```

**Secondary (Outline):**
```css
.btn-secondary {
  background: transparent;
  border: 2px solid #0F4C81;
  color: #0F4C81;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
}
.btn-secondary:hover {
  background: #0F4C81;
  color: white;
}
```

**Ghost (on dark backgrounds):**
```css
.btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}
```

### Cards

```css
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  transition: all 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### Feature Icons (Pixel Style Option)

If using pixel-style icons:
- 32x32 or 48x48 base size
- Crisp edges (image-rendering: pixelated)
- Colors from brand palette
- Optional: subtle "scanline" overlay for retro effect

Alternative: Clean SVG icons from Lucide or similar, styled with brand colors.

## Special Features

### 1. Generative Circuit Background

Animated SVG circuit lines that slowly draw themselves, branch, and fade. Creates a unique "Digital World data flow" effect on every page load.

**Behavior:**
- Lines originate from random edge points
- Draw slowly (2-4 seconds per line)
- Branch occasionally at 90° angles
- Fade out after reaching a certain length or time
- New lines spawn periodically
- Subtle — sits behind content at low opacity

**Technical approach:**
```javascript
// Canvas or SVG-based
// Properties per line:
// - start point (random edge)
// - direction (cardinal)
// - speed (slow, variable)
// - color (cyan with low opacity)
// - branch probability (~10%)
// - max length before fade
```

**Colors:**
- Lines: `rgba(0, 200, 255, 0.15)` — very subtle cyan
- Nodes (branch points): `rgba(0, 200, 255, 0.3)` — slightly brighter dots
- On dark mode: Slightly higher opacity

**Performance:**
- Limit active lines (max 10-15 at once)
- Use requestAnimationFrame
- Pause when tab not visible
- Respect `prefers-reduced-motion` (disable or slow way down)

### 2. Pixel Agumon Companion

Small pixel art Agumon sprite in the corner of the page. Has idle animations and personality.

**Position:** Bottom-right corner, fixed position

**States/Animations:**
- **Idle:** Breathing/bobbing animation
- **Looking around:** Occasionally glances left/right
- **Sleeping:** After 30s of no interaction, closes eyes (zzz)
- **Wave:** On hover, waves at user
- **Excited:** When user scrolls to certain sections

**Sprite specs:**
- Size: 32x32 or 48x48 pixels
- Style: Virtual pet / Game Boy aesthetic
- Colors: Orange (#F7941D), with brand colors
- `image-rendering: pixelated` for crisp edges

**Easter egg (optional):**
- Click Agumon multiple times → evolves (Koromon → Agumon → Greymon)
- Resets on page reload
- Small visual celebration on evolution

**Mobile:**
- Hide or make smaller on mobile to save space
- Or move to a less intrusive position

## Pixel Art Style Guide

**Where to use:**
- Agumon companion (primary use)
- Loading states
- 404 page
- Small decorative accents

**Where NOT to use:**
- Main UI elements
- Typography
- Icons (use clean SVG instead for clarity)

**Style guidelines:**
- Virtual pet / Game Boy aesthetic
- Brand colors (blue, orange, cyan)
- Crisp pixel edges (`image-rendering: pixelated`)
- Small and charming, not dominant

## Animations

**Hero entrance:**
- Staggered fade-in-up for text elements
- Agumon subtle float animation (existing)
- Grid pattern subtle pulse (optional, very subtle)

**Scroll reveals:**
- Cards fade-in-up on scroll into view
- Stats numbers count up (optional)

**Interactions:**
- Button hover lift + shadow
- Card hover lift
- Nav link underline slide

**Performance:**
- Prefer CSS animations over JS
- Use `will-change` sparingly
- Respect `prefers-reduced-motion`

## Dark Mode Implementation

Use CSS custom properties with `[data-theme="dark"]` selector:

```css
:root {
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text: #1A202C;
  /* ... */
}

[data-theme="dark"] {
  --color-background: #1A202C;
  --color-surface: #2D3748;
  --color-text: #E2E8F0;
  /* ... */
}
```

Toggle via:
- System preference detection (`prefers-color-scheme`)
- Manual toggle in header (sync with app if possible)

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile | < 640px | Single column, stacked layout |
| Tablet | 640-1024px | 2-column features, adjusted spacing |
| Desktop | > 1024px | Full layout, max-width container |

## SEO & Social Sharing

### Open Graph Meta Tags

For nice previews when shared on Discord, Twitter, etc.

```html
<meta property="og:title" content="DigiLab — Track Your Local Digimon TCG Scene">
<meta property="og:description" content="Player ratings, deck meta, and tournament history for competitive Digimon TCG players.">
<meta property="og:image" content="https://digilab.cards/og-image.png">
<meta property="og:url" content="https://digilab.cards">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

**OG Image:** Create a 1200x630px image with:
- DigiLab logo
- Tagline
- Maybe Agumon
- Brand colors (blue/orange)

## Additional Pages

### 404 Page

Custom not-found page matching the new design.

**Content:**
- Confused/lost pixel Agumon sprite
- "Page not found" message
- "Looks like this page got lost in the Digital World"
- Links back to home, app, blog

**Style:** Same layout as home, just different content. Keep circuit background.

## Files to Create/Modify

### New Files
1. `src/components/CircuitBackground.astro` — Generative circuit animation (canvas or SVG)
2. `src/components/PixelAgumon.astro` — Pixel companion component with sprite animations
3. `src/components/ThemeToggle.astro` — Dark mode toggle button
4. `src/pages/404.astro` — Custom 404 page
5. `public/sprites/agumon-sprite.png` — Sprite sheet for Agumon animations
6. `public/og-image.png` — Open Graph social sharing image

### Modify
7. `src/styles/tokens.css` — Update color variables, add new tokens
8. `src/styles/global.css` — Base styles, dark mode support
9. `src/components/Header.astro` — Dark mode toggle, Discord link, cleaner
10. `src/components/Footer.astro` — Match new color system, future tools links, compact
11. `src/pages/index.astro` — Complete rebuild with lean structure
12. `src/layouts/BaseLayout.astro` — Update fonts, Open Graph tags, include circuit bg

## Success Criteria

- [ ] **Functional over flashy** — users can quickly get to the app or find content
- [ ] **Lean layout** — no marketing fluff, no giant feature cards
- [ ] **Feels like Digimon** — blue/orange brand, digital textures, nostalgic touches
- [ ] **Generative circuits work** — subtle, unique each load, performant
- [ ] **Pixel Agumon is delightful** — charming companion, not annoying
- [ ] **Light mode polished** — default experience
- [ ] **Dark mode works** — toggle in header, respects system preference
- [ ] **Future tools in footer** — Insights, Admin listed as "coming soon"
- [ ] **Discord link visible** — easy to find community
- [ ] **Social sharing works** — Open Graph tags show nice preview on Discord/Twitter
- [ ] **404 page matches** — custom design with lost Agumon
- [ ] **Responsive** — works well on mobile
- [ ] **Fast** — animations don't hurt performance
- [ ] **Consistent with digilab-app brand** — same colors, typography, feel
