# Digimon Mascot SVGs - Asset Tracking

This document tracks all Digimon SVG mascot assets used throughout DigiLab (web and app), their locations, states/moods, and plans for future commissioned artwork.

## Current Assets

| Asset | Source | File | License |
|-------|--------|------|---------|
| Digivice | [copyicon.com](https://copyicon.com/icons?keyword=digimon) | `public/brand/digivice.svg` | copyicon.com free icons |
| Agumon | [copyicon.com](https://copyicon.com/icons?keyword=digimon) | `public/brand/agumon.svg` | copyicon.com free icons |

Both are line-art style SVGs (stroke only, no fill). They use `currentColor` for stroke.

---

## DigiLab Web - AgumonGuide Component

The `AgumonGuide.astro` component provides animated Agumon poses for different contexts.

### Available Poses

| Pose | Animation | Duration | Best For | Notes |
|------|-----------|----------|----------|-------|
| `idle` | Subtle body bob | 3s | Backgrounds, headers | Very minimal, non-distracting |
| `curious` | Head tilt + "?" indicator | 4s | Searching, thinking | Tilts from left side, pulsing "?" with thought dots |
| `sleeping` | Gentle breathing + floating "zzz" | 3s | Empty states | Faded eye (opacity), staggered zzz animation |
| `excited` | Gentle bounce | 1.5s | CTAs, celebrations | Subtle scale + lift |
| `jumping` | Jump with dust particles | 2s | Hero sections | Squash/stretch + wobble + dust puffs |
| `waving` | Arm wave | 0.6s | Greetings, welcomes | Currently has blink (needs cleanup) |
| `pointing` | Arm extended + head look | 2s | Directing attention | Currently has blink (needs cleanup) |
| `walking` | Walks offscreen and back | 6s | Unused | Was too busy, removed from use |

### Current Placements (digilab-web)

| Location | Asset | Size | Notes |
|----------|-------|------|-------|
| Home hero | `jumping` Agumon | 120px | Main landing page mascot with dust particles |
| Home CTA row | `excited` Agumon | 32px | "Want to track your scene?" section |
| Blog hero | Digivice | 56px | Static digivice with cyan glow pulse effect |
| Blog empty state | `sleeping` Agumon | 64px | Shows when filter has no results (with zzz) |
| Blog no posts | `sleeping` Agumon | 64px | Shows when zero posts exist (with zzz) |
| Header logo | Digivice SVG | 28px | Inline SVG, not AgumonGuide |
| Footer logo | Digivice SVG | 24px | Static image reference |

### Poses Banked (Available but not currently used)

| Pose | Best For | Notes |
|------|----------|-------|
| `curious` | Search pages, thinking states | Has "?" thought indicator, good for FAQ or help pages |
| `idle` | Background decoration | Very subtle, non-distracting |

### Props

```astro
<AgumonGuide
  pose="idle"      // Pose name (see table above)
  size="64px"      // CSS size value
  class="custom"   // Additional CSS classes
  flipX={false}    // Mirror horizontally
/>
```

### Animation Guidelines

When adding new poses:
1. **Disable default animations** - Add `animation: none` for `.agumon-eye`, `.agumon-arm-left`, `.agumon-body` unless the pose specifically needs them
2. **Keep it subtle** - Most contexts need non-distracting animations
3. **Respect reduced motion** - All animations are disabled when `prefers-reduced-motion: reduce`
4. **Use transform-origin wisely** - `center bottom` for bounces, `center center` for rotations

---

## DigiLab App - Current Placements

| Location | Asset | Mood/State | Color | Notes |
|----------|-------|-----------|-------|-------|
| Header navbar icon | Digivice | Static | white | 26x26, glows with header animation |
| Loading screen | Agumon | Jumping (bounce) | `#F7941D` | 64x64, squash-and-stretch keyframe |
| Onboarding modal | Agumon | Hero unit | `#F7941D` | 72x72, via `agumon_svg()` |
| About page hero | Agumon | Walking | `#F7941D` | 64x64, 8s walk cycle |
| Empty states | Agumon | Waiting | `#F7941D` | 56x56, via `digital_empty_state()` |

---

## Poses Needed (Not Yet Implemented)

| Pose | Animation Idea | Use Case | Priority |
|------|----------------|----------|----------|
| `worried` | Sweat drop, nervous fidget | Error states, warnings | Medium |
| `searching` | Looking around, hand over eyes | 404, not found | Medium |
| `celebrating` | Arms up, confetti? | Achievements, success | Low |
| `sitting` | Seated, relaxed | Long-form content, reading | Low |
| `thinking` | Hand on chin, thought bubble | Loading with context | Low |
| `waving-clean` | Arm wave without blink | Greetings (fix current) | High |

---

## Future: Commissioned Custom SVGs

When commissioning a custom artist, here's the full wishlist:

### Characters to Commission

| Character | Where | Mood/Pose | Notes |
|-----------|-------|-----------|-------|
| **Agumon** | Throughout | All poses above | Primary mascot - needs ~8-10 mood variants |
| **Gabumon** | Player vs Player | Friendly rival | Pair with Agumon for versus screens |
| **Koromon** | New user / onboarding | Cute/welcoming | Baby stage = new users |
| **Greymon** | Top-ranked player | Powerful/confident | Evolution = achievement |
| **MetalGreymon** | Leaderboard champion | Dominant | Higher evolution = higher rank |
| **WarGreymon** | #1 player / season winner | Ultimate form | Reserved for the best |
| **Tentomon** | Loading states | Busy/working | Tech-themed for data processing |
| **Palmon** | Store/community pages | Friendly | Nature = growth, community |
| **Patamon** | Help/FAQ pages | Helpful/guiding | Angel theme = guiding light |
| **Gatomon** | Error states | Sassy/unimpressed | Cat attitude for errors |

### Art Style Guidelines

- **Style:** Clean line art (stroke-based, no fill) to match current aesthetic
- **Format:** SVG with `currentColor` strokes for easy theming
- **Sizes:** Design at 24x24 viewBox, should look good from 16px to 128px
- **Moods:** Each character needs 2-4 mood variants minimum
- **Colors:** Must work on both light and dark backgrounds
- **Consistency:** All characters should feel like they belong to the same set

### SVG Requirements for Animation

For animated poses, the SVG structure should include named groups:
- `.agumon-body` - Main body wrapper (for bounce/bob)
- `.agumon-head` - Head group (for tilt/nod)
- `.agumon-eye` - Eye(s) for blink animation
- `.agumon-arm-left` - Left arm for wave/point
- `.agumon-arm-right` - Right arm (if needed)

This allows CSS animations to target specific body parts.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-03-02 | Replaced blog hero curious Agumon with static Digivice + cyan glow |
| 2026-03-02 | Added floating "zzz" animation to sleeping pose |
| 2026-03-02 | Added "?" thought indicator to curious pose |
| 2026-03-02 | Updated curious pose to tilt from left side (head-tilt vs bow) |
| 2026-03-02 | Changed sleeping pose to use opacity-based eye closure |
| 2026-03-02 | Banked curious pose for future use |
| 2026-03-02 | Added jumping pose with dust particles for home hero |
| 2026-03-02 | Added excited pose (cleaned) for CTA sections |
| 2026-03-02 | Added curious pose (cleaned) for blog header |
| 2026-03-02 | Fixed sleeping pose for empty states |
| 2026-03-02 | Removed walking pose from use (too busy) |
| 2026-03-02 | Disabled blink/bob on jumping, excited, curious, sleeping poses |
| 2026-03-02 | Created AgumonGuide.astro component with 8 poses |
