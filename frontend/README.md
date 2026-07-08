# Interactive Event Seating Map

A React + TypeScript application that renders an interactive seating map for event arenas. Built with Vite, Tailwind CSS, and pure CSS 3D transforms.

## Architecture

The app has two coordinated views:

- **3D Preview** (`PreviewViewport`) — full-screen CSS 3D arena view with a fixed screen image and surrounding walls. When a seat is selected from the SVG picker, the camera smoothly transitions to that seat's perspective via CSS 3D transforms (`perspective` + `rotateX/Y` + `translateZ`) at 1000ms ease-in-out. The screen never moves — only the camera does. Walls are children of the screen div with `transformOrigin` at the shared edge to stay structurally locked.

- **Seat Picker Panel** (`SeatPickerPanel`) — a floating bottom panel showing a 2D SVG seat map with section-by-section navigation. Each seat is a `<rect>` SVG element with keyboard support, ARIA labels, and `React.memo` for render performance.

- **State Management** — `SelectionContext` + `useReducer` drives selection state. `localStorage` persists selected seat IDs across page reloads (max 8 seats). Seat world positions are computed once via `buildArenaLayout()` and never recomputed at click time, keeping preview transforms and panel coordinates in sync.

## Key trade-offs

- **CSS 3D transforms over Three.js** — the 3D preview uses `perspective: 3000px` + `preserve-3d` + CSS transitions for camera movement, avoiding a WebGL bundling dependency. This works well for the current scale (~5000 seats) but would need WebGL for 15,000+ seats with smooth 60fps.
- **Separate views for picking and previewing** — the 2D SVG picker provides reliable mouse/keyboard/touch interaction, while the 3D preview gives spatial context. Keeping them separate avoids coordinate-system reconciliation issues.
- **`React.memo` on `Seat`** — prevents unnecessary re-renders when other seats update. For 15k+ seats, a virtualized SVG renderer (rendering only visible seats) would be needed.
- **Walls as children of the screen** — using `right-full`/`left-full` with `transformOrigin` at the shared edge keeps walls structurally locked to the screen without manual pixel offsets.

## Getting started

inside frontend:

```bash
pnpm install
pnpm dev
```

The app loads `public/venue-demo.json` by default. Generate larger test data with `pnpm generate:venue`.

## Tests

```bash
pnpm test          # run once
pnpm test:watch    # watch mode
```

Uses Vitest + jsdom. Tests cover arena layout computation, selection reducer, and price tier lookups.
