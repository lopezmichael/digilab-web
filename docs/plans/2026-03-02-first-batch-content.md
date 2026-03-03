# First Batch Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all 5 placeholder blog posts with 3 real posts, refresh the What's New strip to be a product changelog, and update homepage stats with real numbers.

**Architecture:** Delete existing placeholder MDX files, create 3 new MDX posts following the existing frontmatter schema, update the `whatsNew` array and stats HTML in `index.astro`. No new components or schema changes needed.

**Tech Stack:** Astro Content Collections (MDX), existing blog schema in `src/content/config.ts`

---

### Task 1: Delete placeholder blog posts

**Files:**
- Delete: `src/content/blog/deck-meta-analysis.mdx`
- Delete: `src/content/blog/store-spotlight-coolstuff.mdx`
- Delete: `src/content/blog/upload-guide.mdx`
- Delete: `src/content/blog/rating-redesign.mdx`
- Delete: `src/content/blog/welcome-to-digilab.mdx`

**Step 1: Remove all 5 placeholder posts**

```bash
rm src/content/blog/deck-meta-analysis.mdx
rm src/content/blog/store-spotlight-coolstuff.mdx
rm src/content/blog/upload-guide.mdx
rm src/content/blog/rating-redesign.mdx
rm src/content/blog/welcome-to-digilab.mdx
```

**Step 2: Verify blog directory is empty**

```bash
ls src/content/blog/
```

Expected: no `.mdx` files remain.

**Step 3: Commit**

```bash
git add -u src/content/blog/
git commit -m "chore: remove placeholder blog posts"
```

---

### Task 2: Create "Welcome to DigiLab" post

**Files:**
- Create: `src/content/blog/welcome-to-digilab.mdx`

**Step 1: Write the post**

Create `src/content/blog/welcome-to-digilab.mdx` with this content:

```mdx
---
title: "Welcome to DigiLab"
description: "DigiLab is a tournament tracker built for the Digimon TCG competitive community. Here's what it does and why we built it."
date: 2026-02-24
category: announcement
tags: [community, launch]
author: Michael Lopez
draft: false
---

DigiLab is a tournament tracking platform for the Digimon TCG competitive scene. If you play locals, this is for you.

## What DigiLab Does

DigiLab tracks tournament results across local game stores and calculates player ratings based on your performance. Everything is organized by **scene** — the regional community you actually play in.

- **Player ratings** — Elo-based ratings calculated from your tournament results
- **Tournament history** — Every event your scene has run, with full standings
- **Deck meta tracking** — See which decks are winning at your locals
- **Store directory** — Find stores running Digimon TCG events near you

## Why Scene-Based?

Most competitive trackers focus on global data. DigiLab focuses on *your* community. Your rating reflects how you perform against the players you actually face at locals — not some abstract global average.

This matters because the meta at your local store is different from the meta online. The player who wins your Saturday locals every week deserves recognition for that.

## Who Built This?

DigiLab is a community project built by [Michael Lopez](https://github.com/lopezmichael). It started as a way to track a single local scene in Florida and grew from there. It's now tracking 5 scenes with over 1100 players.

## Get Started

1. Head to [app.digilab.cards](https://app.digilab.cards)
2. Find your scene using the scene selector
3. Look up your name in the Players tab

If your scene isn't on DigiLab yet, join the [Discord](https://discord.gg/ABcjha7bHk) and let us know — we'll get you set up.
```

**Step 2: Verify the dev server picks it up without errors**

Run the dev server (`npm run dev`) and navigate to `/blog/welcome-to-digilab`. Confirm the page renders.

**Step 3: Commit**

```bash
git add src/content/blog/welcome-to-digilab.mdx
git commit -m "content: add Welcome to DigiLab post"
```

---

### Task 3: Create "New Rating System" post

**Files:**
- Create: `src/content/blog/new-rating-system.mdx`

**Step 1: Write the post**

Create `src/content/blog/new-rating-system.mdx` with this content:

```mdx
---
title: "New Rating System: What's Changing and Why"
description: "We're revamping how DigiLab calculates player ratings. Here's what's changing, why, and how it affects your score."
date: 2026-03-02
category: announcement
tags: [ratings, methodology]
author: Michael Lopez
draft: false
---

We're rolling out a new rating system for DigiLab. If your number changes — this post explains why. More importantly, it explains why the new system is better.

## What's Changing

The current system has a few issues that we've identified since launch:

- **Recency bias** — Recent tournaments count more than older ones, which penalizes players who take breaks
- **Rating spread** — The gap between players is artificially wide, making small differences look bigger than they are
- **Tie handling** — Draws in swiss rounds were being counted as losses for both players

The new system fixes all three.

## How the New System Works

DigiLab uses an Elo-based rating system. Every player starts at 1500. When you play in a tournament, your rating adjusts based on:

1. **Your placement** relative to other players in the event
2. **The ratings of the players you faced** — beating higher-rated players earns more points
3. **Your experience level** — new players' ratings move faster (higher K-factor) until they have enough events for a stable rating

### Key differences from the old system

| | Old System | New System |
|---|-----------|------------|
| Time weighting | Recent events count more | All events count equally |
| Processing | Multi-pass recalculation | Single-pass chronological |
| Ties | Treated as losses | Treated as draws |
| Breaks | Rating decays over time | No decay — pick up where you left off |

## How This Affects You

Most players will see their raw rating number change, but **your relative position on the leaderboard is what matters**. Here's what to expect:

- **If you play regularly:** Your position likely stays similar. The numbers compress but the ordering is consistent.
- **If you took a break:** You'll probably move *up*. The old system was penalizing you unfairly for not playing.
- **If you're new:** Your rating will stabilize faster and more accurately reflect your skill level.

## What Your Rating Means

| Rating Range | What It Means |
|-------------|---------------|
| 1550+ | Consistently placing well above average |
| 1500–1550 | Solid competitive player |
| 1450–1500 | Active player, developing |
| Below 1450 | New or still building tournament history |

These ranges are approximate. What matters most is your rank within your scene.

## The Bottom Line

The new system measures skill more accurately by treating all your results equally. No more bonus points for just showing up recently, no more penalty for taking time off.

Your rating reflects your results — not when you played.

---

Questions about your rating? Come talk to us on [Discord](https://discord.gg/ABcjha7bHk).
```

**Step 2: Verify the dev server picks it up**

Navigate to `/blog/new-rating-system`. Confirm the page renders.

**Step 3: Commit**

```bash
git add src/content/blog/new-rating-system.mdx
git commit -m "content: add New Rating System post"
```

---

### Task 4: Create "One Week In" post

**Files:**
- Create: `src/content/blog/one-week-in.mdx`

**Step 1: Write the post**

Create `src/content/blog/one-week-in.mdx` with this content:

```mdx
---
title: "One Week In: DigiLab's First Scenes"
description: "A look back at DigiLab's first week since public launch — the scenes that joined, the numbers, and what's next."
date: 2026-03-01
category: devlog
tags: [community, milestones]
author: Michael Lopez
draft: false
---

DigiLab has been publicly available for a week. Here's where things stand.

## The Numbers

In the first week since opening up beyond the initial Florida test scene:

- **5 scenes** are now actively tracking tournaments
- **1100+ players** in the system across all scenes
- **350+ tournaments** tracked with full standings and ratings
- **20+ stores** hosting events that feed into DigiLab

These are real tournaments at real stores with real players. Every result was uploaded by a community member.

## The Scenes

DigiLab launched with a single scene in Florida. In the first week, four more communities started tracking:

Each scene has its own leaderboard, its own meta breakdown, and its own tournament history. That's the whole point — your data reflects *your* community.

## What Surprised Us

**Upload velocity.** We expected a slow trickle of historical data. Instead, communities uploaded months of backlogged tournament results within days of getting access. Some scenes have 50+ tournaments already loaded.

**Community ownership.** Each scene has organizers who took responsibility for uploading and maintaining their data. This wasn't something we had to push — people wanted their results tracked.

**Rating conversations.** Players care about their ratings. We've seen Discord threads debating matchups, analyzing rating changes after events, and discussing what it takes to climb the leaderboard. That's exactly what we hoped for.

## What's Next

- **Rating system revamp** — A new calculation method that's fairer and more stable. Details coming soon.
- **More scenes** — We're onboarding new communities every week. If your scene isn't on DigiLab yet, reach out.
- **Deck meta tools** — Better ways to explore what's winning in your local meta.

If you want to get your scene on DigiLab, join the [Discord](https://discord.gg/ABcjha7bHk) and let us know.
```

**Step 2: Verify the dev server picks it up**

Navigate to `/blog/one-week-in`. Confirm the page renders.

**Step 3: Commit**

```bash
git add src/content/blog/one-week-in.mdx
git commit -m "content: add One Week In post"
```

---

### Task 5: Update What's New items and stats on homepage

**Files:**
- Modify: `src/pages/index.astro:19-26` (whatsNew array)
- Modify: `src/pages/index.astro:142-158` (stats row)

**Step 1: Replace the whatsNew array**

In `src/pages/index.astro`, replace lines 19-26:

```javascript
// Old:
const whatsNew = [
  { text: '5 regions now tracking', icon: 'globe', isNew: true, link: '/about' },
  { text: 'Rating system v2.0', icon: 'graph-up-arrow', isNew: true, link: '/blog/rating-redesign' },
  { text: 'Deck meta analysis', icon: 'pie-chart', isNew: false, link: '/blog' },
  { text: 'Store directory', icon: 'shop', isNew: false, link: '/about' },
  { text: 'Tournament history', icon: 'trophy', isNew: false, link: '/blog' },
  { text: 'Player profiles', icon: 'person-badge', isNew: false, link: '/blog' },
];
```

```javascript
// New:
const whatsNew = [
  { text: 'v1.1 now live', icon: 'box-arrow-up', isNew: true },
  { text: 'New rating system coming soon', icon: 'graph-up-arrow', isNew: true },
  { text: '5 scenes now tracking', icon: 'globe', isNew: false },
  { text: '1100+ players tracked', icon: 'people', isNew: false },
  { text: '350+ tournaments tracked', icon: 'trophy', isNew: false },
  { text: 'v1.0 public launch', icon: 'rocket-takeoff', isNew: false },
];
```

Note: The `link` property is removed from items that don't link anywhere. Check that `WhatsNewCard` handles missing `link` gracefully (it does — the component uses `const Tag = link ? 'a' : 'div'`).

**Step 2: Update the stats row**

In `src/pages/index.astro`, update the stats values:

- Change `500+` to `1100+` (Players Tracked)
- Change `100+` to `350+` (Tournaments)

**Step 3: Verify on dev server**

Navigate to `/` and confirm:
- What's New shows 6 updated items with correct icons
- Items without links render as `<div>` not `<a>`
- Stats row shows `5`, `20+`, `1100+`, `350+`

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "content: update What's New items and stats with real numbers"
```

---

### Task 6: Delete stale chart asset

**Files:**
- Delete: `public/charts/rating-distribution.html` (if it exists — referenced by the old rating-redesign post)

**Step 1: Check if the file exists and remove it**

```bash
ls public/charts/ 2>/dev/null
```

If `rating-distribution.html` exists, delete it. If the `charts/` directory is now empty, leave it (it may be used later for new chart embeds).

**Step 2: Commit (if anything was deleted)**

```bash
git add -u public/charts/
git commit -m "chore: remove stale chart asset from placeholder post"
```

---

### Task 7: Final verification and push

**Step 1: Run a production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. Confirm 3 blog posts are generated (check build output for `/blog/welcome-to-digilab`, `/blog/new-rating-system`, `/blog/one-week-in`).

**Step 2: Preview the build**

```bash
npm run preview
```

Spot-check:
- Homepage: What's New items, Recent Posts cards, stats row
- `/blog`: Shows 3 posts
- Each post page renders correctly
- No broken links (especially old blog slugs like `/blog/rating-redesign` should 404 cleanly)

**Step 3: Push**

```bash
git push
```
