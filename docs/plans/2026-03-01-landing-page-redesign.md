# Landing Page Redesign - Design Document

**Date:** 2026-03-01
**Status:** Ready for implementation

## Overview

Redesign the DigiLab landing page with a playful, nostalgic Digimon aesthetic while showcasing data-forward content. The page should feel like you're inside the Digital World - immersive, alive, and fun for card game players.

## Design Principles

1. **Playful/Nostalgic** - Lean into Digimon aesthetic, mascots, retro digital vibes
2. **Data-forward** - Showcase visualizations and stats prominently
3. **Tactile** - Interactions should feel like handling cards - fluid, physical
4. **Immersive** - The entire page is one digital space, not segmented sections

## Component Specifications

### 1. Circuit Background System

The circuit background is the soul of the page - a living data stream.

#### Density & Activity
- 3-4x more circuits than current implementation
- Varied spawn rates (some areas burst with activity, others steady flow)
- Random spacing between lines (break the uniform grid feel)
- Multiple circuit "layers" at different speeds for depth
- Circuits spawn from all edges and can cross the entire viewport
- Short bursts mixed with long traversals

#### Mouse Reactivity
- Circuits near cursor bend toward or away (magnetic attraction/repulsion)
- Mouse movement leaves a brief "wake" spawning extra circuit fragments
- Hovering in one spot creates a node cluster that circuits flow through

#### Glitch Effects
- Random circuits occasionally "glitch" - stutter, pixelate, or spark at nodes
- Very occasional screen-wide subtle flicker (CRT monitor feel)
- Circuits sometimes "corrupt" with orange accent color flash

#### Full Bleed Coverage
- Circuits cover the entire page, not contained to hero
- Slightly more intense/cyan-tinted in hero area
- Return to higher intensity at footer (bookend effect)
- Content panels use subtle backdrop-blur or dark treatment for readability

#### Technical Notes
- Use `requestAnimationFrame` for smooth animation
- Respect `prefers-reduced-motion` - disable or significantly reduce animation
- Pause animation when tab is not visible
- Canvas-based rendering for performance with many elements

### 2. Agumon Guide System

Agumon appears throughout the page as a helpful guide character using the existing line-art SVG (`public/brand/agumon.svg`) with CSS animations.

#### Placements & Poses

| Location | Pose/Mood | Animation |
|----------|-----------|-----------|
| Hero section | Waving at visitors | Idle bob, arm wave, occasional blink |
| What's New | Pointing at content | Head tilt, curious expression |
| Recent Posts | Peeking from side | Subtle bounce, looking at cards |
| Footer | Sleeping/sitting | Slow breathing pulse, wakes on hover |

#### Animation Approach
- Inline SVG to animate individual parts (arm, eyes, etc.)
- CSS keyframe animations for idle states
- Hover triggers enhanced animations (faster wave, wake up, etc.)
- Each instance sized appropriately (larger in hero, smaller as accents)
- Responsive positioning that doesn't break layouts

#### Future Expansion
When commissioned art is available (see `digilab-app/docs/digimon-mascots.md`):
- Swap in different mood variants per location
- Add other characters (Gabumon, Koromon, etc.) for variety
- Maintain same animation patterns

### 3. Fluid Content Showcase

Both Recent Posts and What's New use horizontal scroll carousels with tactile, card-game feel.

#### Recent Posts Carousel

**Layout:**
- Full-width horizontal scroll area
- Cards float side-by-side with consistent gaps
- CSS `scroll-snap-type: x mandatory` for satisfying stops
- No prev/next buttons - pure scroll/drag/swipe

**Card Contents:**
- Preview area: embedded interactive chart, image, or stylized quote
- Title (prominent)
- Date and category pill
- Dark semi-transparent panel treatment (pops against circuits)

**Interaction:**
- Mouse wheel horizontal scroll
- Click-and-drag scrolling
- Touch swipe on mobile
- Smooth momentum/inertia
- Optional: very slow auto-drift that pauses on hover/touch

**Agumon Integration:**
- Agumon peeking from left side, pointing into the scroll area

#### What's New Carousel

**Layout:**
- Same horizontal scroll behavior
- Smaller, more compact cards

**Card Contents:**
- Digimon-themed icon (digivice for features, card stack for meta, etc.)
- Short text description
- "New" badge with holographic shimmer effect

### 4. Icon System

#### Primary Library
Use **Bootstrap Icons** (`bootstrap-icons` npm package) for consistency with digilab-app Shiny application.

Common icons from the app:
- `trophy` - rankings, achievements
- `graph-up-arrow` - stats, trends
- `people` - players, community
- `collection` - decks, cards
- `calendar-event` - tournaments, dates
- `bar-chart-line` - analytics
- `fire` - hot/trending

#### Custom Digimon Icons
For Digimon-specific elements, use custom SVGs in same line-art style:
- Digivice (`public/brand/digivice.svg`) - app/tools links
- Agumon (`public/brand/agumon.svg`) - mascot appearances
- Card-back pattern - decorative texture (to be created)
- Card stack silhouette - deck/meta content (to be created)

#### Icon Component
Create `DigiIcon.astro` wrapper that:
- Renders Bootstrap Icons by name
- Falls back to custom SVGs for Digimon-specific icons
- Supports size and color props
- Uses `currentColor` for theme compatibility

### 5. Decorative Card Elements

Subtle card game theming throughout:

- **Card-back pattern:** Very faded watermark texture in content panels
- **Card silhouettes:** Background accents in content area
- **"New" badges:** Styled like holographic card corners (rainbow shimmer on hover)
- **Section dividers:** Edge-of-card or deck-edge aesthetic
- **Category pills:** Include relevant icons, card-like rounded corners

### 6. Content Model Updates

#### Blog Post Frontmatter Additions
```yaml
---
title: "Post Title"
description: "Brief description"
date: 2026-03-01
category: analysis
tags: [ratings, methodology]
author: Michael Lopez
image: /images/blog/cover.png      # Hero image (optional)
chartEmbed: /charts/ratings.html   # Interactive chart (optional)
featured: true                      # Show in featured position (optional)
---
```

#### What's New Data Structure
```typescript
interface WhatsNewItem {
  text: string;
  icon: string;        // Bootstrap icon name or 'digivice', 'agumon', etc.
  isNew: boolean;
  link?: string;
}
```

### 7. Dark Mode Considerations

- Circuits more vibrant/saturated on dark backgrounds (already in tokens)
- Content panels use darker backdrop-blur treatment
- Agumon SVG uses `currentColor` - automatically adapts
- Glitch effects more visible on dark (adjust opacity)
- Card panels: darker semi-transparent backgrounds

## Component File Structure

| Component | Path | Description |
|-----------|------|-------------|
| `CircuitBackground.astro` | `src/components/` | Rewrite - dense, reactive, glitchy, full-bleed |
| `AgumonGuide.astro` | `src/components/` | Animated SVG mascot with pose prop |
| `ContentCarousel.astro` | `src/components/` | Reusable fluid horizontal scroll |
| `PostCard.astro` | `src/components/` | Card for carousel with preview support |
| `WhatsNewCard.astro` | `src/components/` | Compact card with icon |
| `DigiIcon.astro` | `src/components/` | Bootstrap + custom icon wrapper |
| `GlitchText.astro` | `src/components/` | Optional glitch effect for headings |

## Dependencies to Add

```json
{
  "dependencies": {
    "bootstrap-icons": "^1.11.0"
  }
}
```

## Accessibility

- All animations respect `prefers-reduced-motion`
- Agumon and decorative elements use `aria-hidden="true"`
- Carousels are keyboard navigable (arrow keys)
- Sufficient color contrast maintained on all text
- Interactive elements have visible focus states
- Screen reader announcements for carousel position (optional)

## Performance

- Circuit canvas pauses when tab not visible
- Lazy load carousel items off-screen
- Chart embeds use loading="lazy" on iframes
- Debounce mouse position tracking
- Use CSS transforms for animations (GPU accelerated)

## References

- Brand colors: `digilab-app/_brand.yml`
- Mascot guidelines: `digilab-app/docs/digimon-mascots.md`
- Icon library: Bootstrap Icons (match digilab-app usage)
- Current tokens: `src/styles/tokens.css`

## Open Questions

1. **Auto-scroll speed:** How slow should the carousel auto-drift be? Or skip it entirely?
2. **Glitch frequency:** How often should glitch effects trigger? Every few seconds? Random?
3. **Chart embed sizing:** What aspect ratio works best for embedded charts in cards?

---

## Approval

- [ ] Design reviewed and approved
- [ ] Ready for implementation planning
