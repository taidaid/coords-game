# google-day-mapbox

A tiny coordinates game built with Vue 3, Vite, and Mapbox GL JS.

## What this app is

An interactive map game to practice reading and matching geographic coordinates. The app generates a target pair of coordinates (longitude, latitude). You try to click that exact spot on the world map. The UI shows your last click, the click count, and the difference between the target and your click. When you get close enough, celebratory fireworks appear.

## Goal

Match the target coordinates with as few clicks as possible.

## How it works

- Target coordinates
  - A small panel displays the current target `Longitude` and `Latitude`.
  - Click "Generate Coords" to get a new random target anywhere on Earth.

- Interacting with the map
  - Click on the map to place a marker at your click location.
  - Each click increments the click counter and updates the "Last Click Coords".
  - The app computes and displays the difference (delta) between the target and your last click.
  - When you are sufficiently close, a fireworks overlay is shown.

- Reset
  - The "Reset" button recenters/zooms the map to a random starting view, clears prior clicks and the difference, and starts a fresh round.

## Key files and structure

- `src/views/CoordsGame.vue`: Orchestrates the game UI and holds reactive state (`location`, `clickCount`, `difference`, `initialLocation`).
- `src/components/MapboxMap.vue`: Renders the Mapbox map, handles click events, places markers, and emits updates for `modelValue` (clicked coords), `clickCount`, and `difference`.
- `src/components/CoordsGenerator.vue`: Simple utility to generate new random target coordinates and emit them back to the parent.
- `src/App.vue`: Hosts the game view.
- `src/main.ts` and `src/router/index.ts`: App bootstrapping and a minimal route.

## Tech stack

- Vue 3 (Single File Components, `<script setup>` and Options API mix)
- Vite + TypeScript
- Mapbox GL JS

## Mapbox access token

This project reads the Mapbox token from the environment variable `VITE_MAPBOX_TOKEN`.

1. Create `.env.local` in the project root and add:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

2. Restart the dev server after changing env files.

## Project setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with ESLint

```sh
npm run lint
```

## Tips for playing

- Zoom into the region before clicking for better precision.
- Use the on-screen target coordinates as guidance and match both longitude and latitude.
- Click "Generate Coords" any time you want a new challenge.
