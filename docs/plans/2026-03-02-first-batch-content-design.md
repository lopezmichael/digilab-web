# First Batch Content Design

**Date:** 2026-03-02
**Status:** Approved

## Overview

Replace all 5 placeholder blog posts with 3 real posts, refresh the What's New homepage strip to be a product changelog (distinct from Recent Posts), and update the stats row with real numbers.

## Design Decisions

- **What's New vs Recent Posts:** These are now distinct. What's New is a short-form product changelog (versions, milestones, features). Recent Posts shows long-form blog articles. No overlap.
- **3 posts for launch:** Covers announcement, technical/announcement hybrid, and devlog categories. Lean but balanced across goals (credibility, education, growth).
- **Rating system post:** Combines "how ratings work" explainer with the upcoming revamp announcement. Serves as both timely news and evergreen reference.

## Blog Posts

### Post 1: Welcome to DigiLab

- **Slug:** `welcome-to-digilab`
- **Category:** `announcement`
- **Tags:** `community`, `launch`
- **Purpose:** Canonical intro post. What DigiLab is, why it exists, who it's for.
- **Tone:** Welcoming, clear, not overly technical.

### Post 2: New Rating System: What's Changing and Why

- **Slug:** `new-rating-system`
- **Category:** `announcement`
- **Tags:** `ratings`, `methodology`
- **Purpose:** Announce the rating revamp, explain the new methodology, show how player scores are affected. Doubles as the "how ratings work" reference.
- **Tone:** Transparent, educational. Acknowledge that scores will change and explain why the new system is better.

### Post 3: One Week In: DigiLab's First Scenes

- **Slug:** `one-week-in`
- **Category:** `devlog`
- **Tags:** `community`, `milestones`
- **Purpose:** Recap the first week since public launch. How many scenes joined, player counts, community response. Real numbers, real momentum.
- **Tone:** Excited but grounded. Let the numbers speak.

## What's New Items (Homepage)

Product changelog strip — short-form updates, not blog post links.

| Text | Icon | isNew | Link |
|------|------|-------|------|
| v1.1 now live | `box-arrow-up` | yes | — |
| New rating system coming soon | `graph-up-arrow` | yes | — |
| 5 scenes now tracking | `globe` | no | — |
| 1100+ players tracked | `people` | no | — |
| 350+ tournaments tracked | `trophy` | no | — |
| v1.0 public launch | `rocket-takeoff` | no | — |

## Stats Row Update (Homepage)

| Stat | Old Value | New Value |
|------|-----------|-----------|
| Players Tracked | 500+ | 1100+ |
| Tournaments | 100+ | 350+ |
| Active Scenes | 5 | 5 (unchanged) |
| Stores | 20+ | 20+ (unchanged) |

## Content Lifecycle

- What's New items rotate: newest at front with `isNew` badge, older items drop off as new ones are added.
- Blog posts are evergreen unless explicitly dated (the rating system post can be updated when the revamp ships).
