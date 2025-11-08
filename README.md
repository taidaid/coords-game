# google-day-mapbox

A tiny coordinates game built with Vue 3, Vite, and Mapbox GL JS.

## What this app is

An interactive map game to practice reading and matching geographic coordinates. The app generates a target pair of coordinates (longitude, latitude). You try to click that spot on the world map. The UI shows your last click, the click count, and the distance to the target. When you get close enough (meters-based threshold), celebratory fireworks appear.

## Goal

Match the target coordinates with as few clicks as possible.

## How it works

- Target coordinates
  - A small panel displays the current target `Longitude` and `Latitude`.

- Interacting with the map
  - Click on the map to place a marker at your click location.
  - Each click increments the click counter and updates the "Last Click Coords".
  - The app computes and displays the great‑circle distance (meters/kilometers) between the target and your last click.
  - When you are within the winning threshold (meters), a fireworks overlay is shown and the marker is gold; otherwise the marker is red.

- Reset
  - The "Reset" button recenters/zooms the map to a random starting view, clears prior clicks and the difference, and starts a fresh round.

## Key files and structure

- `src/composables/useGame.ts`: Encapsulates game state (`initialLocation`, `locationToGuess`, `lastClickCoords`, `clickCount`, `difference`, `isWinner`, `isReset`) and the `reset()` action.
- `src/views/CoordsGame.vue`: Composes the UI using `useGame` and wires v-model bindings to components.
- `src/components/MapboxMap.vue`: Renders the Mapbox map, handles clicks, places markers, and emits updates: `update:lastClickCoords`, `update:clickCount`, `update:difference`, `update:isReset`, `update:isWinner`. Winner is computed in meters using utilities.
- `src/components/CoordinatesDisplay.vue`: Shows the target coordinate pair.
- `src/components/LastClickedCoordinates.vue`: Shows the most recent click.
- `src/components/DifferenceDisplay.vue`: Shows distance to target in meters/kilometers.
- `src/components/FireworksDisplay.vue`: Displays fireworks when `isWinner` is true.
- `src/utils/game.ts`: Shared helpers: `getDistanceMeters`, `isWinnerByDistance`, `computeDifference`, and types.
- `src/App.vue`: Hosts the game view.
- `src/main.ts` and `src/router/index.ts`: App bootstrapping and a minimal route.

## Tech stack

- Vue 3 (Single File Components, `<script setup>`)
- Vite + TypeScript
- Mapbox GL JS

## Mapbox access token

This project reads the Mapbox token from the environment variable `VITE_MAPBOX_TOKEN`.

1. Create `.env.local` in the project root and add:

```bash
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

2. Restart the dev server after changing env files.

Security note:

- Do not commit `.env*` files. `.gitignore` should include `.env` and `.env.local`. If a token was ever committed, rotate it and rewrite history (e.g., `git filter-repo`), then force‑push.

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
- Use the on-screen target coordinates as guidance.
- Distance is computed using the Haversine formula (great‑circle distance). You can adjust the winning threshold in `src/utils/game.ts` (`isWinnerByDistance(..., thresholdMeters)`).
