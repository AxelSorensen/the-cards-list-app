# 🃏 The Cards List

A card-draw tool for running a "music night": deal out a playing-card deck to assign song slots, with support for surplus/volunteer cards and swaps.

## Features

- 🎴 **Deck-based slot assignment** — maps a red-card deck (♥/♦ 2–A) to numbered song slots, one card per spot
- ➕ **Surplus & volunteer handling** — extra players get black surplus cards (Joker, ♣2, ♣3…) that share a red card's slot, with a separate volunteer path for people who want an early, single-song turn
- 🔀 **Swap log** — tracks card swaps between players so the night's assignments stay auditable
- 🃏 **Card-face rendering** — dedicated `PlayingCard`/`CardFace`/`SurplusCard` components render suits/ranks visually rather than as plain text

## Installation

```bash
git clone <this repo>
cd the-cards-list-app
npm install
```

## Usage

```bash
npm run dev
```

Then open the local dev server URL printed in the terminal.

## Built with

- [Nuxt 4](https://nuxt.com/) / Vue 3
- Tailwind CSS
- TypeScript

## Status

🚧 Nuxt rewrite of an earlier HTML prototype (see the sibling `the-cards-list` repo) — core dealing/swap logic is implemented via the `useNight` composable, no deployment or persistence layer yet.
