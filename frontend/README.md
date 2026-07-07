# Interactive Event Seating Map

A React + TypeScript application that renders an interactive seating map for event arenas. Built with Vite and Tailwind CSS.

## Architecture

The app has two coordinated views:

- **3D Preview** (`PreviewViewport`) — full-screen 3D arena view with a fixed screen and seats positioned in world space. When a seat is selected, the camera smoothly transitions to that seat's perspective via CSS 3D transforms (`translateZ` + `rotateX/Y` with a 700ms ease-out transition). The screen never moves — only the camera does.

- **Seat Picker Panel** (`SeatPickerPanel`) — a floating bottom panel showing a 2D SVG seat map with section-by-section navigation. Each seat is a `<rect>` SVG element with keyboard support and ARIA labels.

State is managed through a `SelectionContext` with a `useReducer` for predictable state transitions. Selection persists to `localStorage` across page reloads.

### Key trade-offs

- **CSS 3D transforms over Three.js** — the 3D preview uses `perspective` + `preserve-3d` + CSS transitions for camera movement, avoiding the complexity of a WebGL library. This works well for the demo scale but would need WebGL for 15,000+ seats with smooth 60fps performance.
- **Separate views for picking and previewing** — the 2D SVG picker provides reliable mouse/keyboard interaction, while the 3D preview gives spatial context. Keeping them separate avoids reconciliation issues between coordinate systems.
- **`React.memo` on `Seat`** — prevents unnecessary re-renders when other seats update. For 15k seats, a virtualized SVG renderer (rendering only visible seats) would be needed.
- **`useRef` for selection validation** — `toggleSeat` uses a ref (not state) for the latest selection array, keeping the callback identity stable so `React.memo` works correctly.

## Incomplete features / TODOs

- Performance optimization for 15,000+ seats (virtualized SVG or canvas rendering)
- WebSocket live seat-status updates
- Heat-map toggle by price tier
- "Find N adjacent seats" helper
- Pinch-zoom + pan for mobile touch gestures
- End-to-end tests (Playwright/Cypress)

## Getting started

```bash
pnpm install
pnpm dev
```

The app loads `public/venue-demo.json` by default. Generate larger test data with `pnpm generate:venue`.
