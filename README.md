# Couture Trace — TUI React Kit

A React component library that renders pixel-perfect terminal/UIs using a **canvas character-cell engine**. Instead of HTML elements, you draw Unicode characters into a 2D grid — giving you the look of a real CLI app (Ratatui, ncurses) inside a web page.

```
Live demo:  https://couture-trace-ui.vercel.app
Repo:       https://github.com/clawdbotatg/couture-trace-ui
```

---

## Architecture

```
src/
├── tui/
│   ├── colors.js        ← Palette (all color constants in one place)
│   ├── core.js         ← Grid primitives (makeCell, setCell, drawBadge, …)
│   ├── layout.js       ← Panel bounding-box calculator
│   ├── render.js       ← Assembles all panels into a full grid
│   └── panels/
│       ├── CoutureTrace.js   ← Header banner
│       ├── StageMonitor.js   ← Top-right metrics
│       ├── ModeSelector.js   ← Tab bar (Runway / Atelier / …)
│       ├── LeadInstruction.js← Next cue + latest instruction
│       ├── Pulse.js          ← Progress + memory heat bars
│       ├── MemoryStory.js    ← Narrative memory summary
│       ├── SignalDrift.js    ← Time-series chart (ACC + PC)
│       ├── Registers.js      ← CPU register badges + flags
│       ├── LayerSpotlight.js ← Layer activity bar chart
│       ├── TempoTrail.js     ← Throughput meter
│       ├── LiveTrace.js      ← Scrolling instruction log
│       └── KeyboardBar.js    ← Bottom shortcut strip
└── components/
    └── TermCanvas.jsx  ← React wrapper (grid → canvas)
```

---

## How Each Component Works

### `TermCanvas` (React Component)

The only React component. It's a thin wrapper:

1. Creates a `<canvas>` sized to `cols × charW` × `rows × charH`
2. Calls `render(vm, cols, rows)` → returns a 2D grid of `{ ch, fg, bg, bold }` cells
3. Calls `drawGrid()` to paint every cell onto the canvas
4. Re-renders whenever `vm` changes

```jsx
<TermCanvas vm={myState} cols={140} rows={50} fontSize={12} />
```

No DOM nodes for panels. No CSS for borders. Everything is drawn character-by-character.

---

### `colors.js` — Palette

Named color tokens. Swap one value here, every panel updates.

```js
export const PALETTE = {
  bg:        '#0d0d0d',  // canvas background
  panel:     '#131020',  // panel interior fill
  border:    '#3d2e4a',  // box-drawing characters
  text:      '#c8b8d8',  // primary body text
  textDim:   '#8a7a9a',  // secondary / labels
  textMuted: '#6a5a7a',  // grid dots, placeholders
  coral:     '#f87171',  // warnings, progress fill
  teal:      '#4ade80',  // active states, OK badges
  amber:     '#fbbf24',  // peak values, secondary
  yellow:    '#facc15',  // line numbers in trace
  white:     '#ffffff',  // reverse-video badges
  salmon:    '#f472b6',  // ACC line, L1 layer
  pink:      '#c080a0',  // panel titles
}
```

---

### `core.js` — Drawing Primitives

Every panel uses these six functions. They're all you need.

#### `makeCell(ch, fg, bg, bold)` → `{ ch, fg, bg, bold }`

Factory for a single character cell. All grid operations eventually call this.

```js
makeCell()                    // blank space, default text/panel colors
makeCell('█', C.coral)        // red filled block
makeCell('A', C.white, C.teal, true)  // teal bg, white text, bold
```

#### `setCell(grid, row, col, ch, fg, bg, bold)`

Write one cell into the grid. Safely ignores out-of-bounds coordinates.

```js
setCell(grid, 0, 5, 'X', C.coral)  // grid[0][5] = { ch:'X', fg:'#f87171', ... }
```

#### `drawRowText(grid, row, col0, text, fg, bold)`

Write a string one character at a time. Each character gets its own cell so colors can vary within a string.

```js
drawRowText(grid, 3, 2, 'hello world', C.white, true)
// Writes 'h','e','l','l','o',' ',… each as a separate cell
```

#### `drawBadge(grid, row, col0, text, fg, bg)`

Reverse-video label. Text color and background are swapped — creates a solid-color block with contrasting text.

```js
// Teal block with dark text: [RUNNING]
drawBadge(grid, 5, 10, 'RUNNING', C.bg, C.teal)
```

#### `drawPanelBorder(grid, r0, r1, c0, c1, color?)`

Draw Unicode box-drawing characters around a rectangle.

```
┌─────────────────────┐  ← top edge: ──────
│                     │  ← left/right: │
│                     │  ← corners: ┌┐└┘
└─────────────────────┘  ← bottom edge
```

```js
drawPanelBorder(grid, 0, 6, 1, 83)  // border around rows 0-5, cols 1-82
```

#### `drawProgressBar(grid, row, col0, value, max, width, fgOn, fgOff)`

Inline bar using block characters. Returns nothing — writes directly to the grid.

```js
// ████████░░░░░░  67%
drawProgressBar(grid, 5, 10, 67, 100, 16, C.coral, C.textMuted)
```

---

### `layout.js` — Panel Layout

Defines bounding boxes for every panel. All values are in **character cells** (not pixels).

```js
getLayout(cols = 140, rows = 50)
// Returns:
//   HDR:   { r0: 0,  r1: 6,  c0: 1, c1: 83 }   ← header (left+right)
//   STG:   { r0: 0,  r1: 6,  c0: 83, c1: 138 }  ← stage monitor (right header)
//   MOD:   { r0: 7,  r1: 8,  c0: 1, c1: 138 }   ← mode tabs
//   LEAD:  { r0: 9,  r1: 17, c0: 1, c1: 83 }     ← lead instruction (left)
//   PULSE: { r0: 9,  r1: 13, c0: 83, c1: 138 }   ← pulse (right top)
//   ...
```

**To change column split:** Edit the `0.60` constant. That's the left-column width ratio.

**To resize a panel:** Change its `r0`/`r1` (row range) or `c0`/`c1` (col range).

---

### Panel Files (one per panel)

Each panel file exports a single function:

```js
export function drawXxxPanel(grid, bounds, props) { ... }
```

- `grid` — the 2D character grid
- `bounds` — `{ r0, r1, c0, c1 }` from `getLayout()`
- `props` — the data to render (colors, strings, numbers)

Panels are intentionally **dumb** — they just draw what they're given. All data shaping happens in `App.jsx` or wherever `vm` is assembled.

---

### `SignalDrift` — How the Chart Works

The most complex panel. Rendering pipeline:

```
raw data arrays        →  Bresenham line   →  dot scatter   →  grid overlay
(acc: [-4,-8,...],  →  ▓▓▓ chars (salmon) →  ● dots (teal)  →  · grid lines
 pc: [2,2,4,...])
```

1. **Clear** the chart interior with bg color
2. **Grid lines** — horizontal `·` dots at y=0, ±8, ±16
3. **ACC line** — Bresenham interpolation between consecutive points, `▓` chars
4. **PC dots** — simple scatter plot, `●` chars in teal
5. **Y-axis labels** — `-16`, `0`, `+16` written in muted text on the left

No canvas drawing API used — it's all character cells.

---

## Building Your Own Panel

1. **Create** `src/tui/panels/MyPanel.js`
2. **Import** primitives and palette:
   ```js
   import { drawRowText, drawBadge, setCell, drawPanelBorder } from '../core.js'
   import PALETTE from '../colors.js'
   const C = PALETTE
   ```
3. **Export** the draw function:
   ```js
   export function drawMyPanel(grid, b, { label, value } = {}) {
     drawPanelBorder(grid, b.r0, b.r1, b.c0, b.c1)
     drawRowText(grid, b.r0, b.c0 + 1, label, C.pink, true)
     drawBadge(grid, b.r0 + 1, b.c0 + 1, String(value), C.bg, C.teal)
   }
   ```
4. **Add** to `render.js`:
   ```js
   import { drawMyPanel } from './panels/MyPanel.js'
   // inside render():
   drawMyPanel(grid, L.MYPANEL, vm)
   ```
5. **Register bounds** in `layout.js`:
   ```js
   MYPANEL: { r0: 40, r1: 46, c0: 1, c1: 138 },
   ```

---

## Deploying

```bash
npm run build
npx vercel --prod --force --token <VERCEL_TOKEN>
```

The `--force` flag bypasses Vercel's build cache — always use it when pushing live.

---

## Color Theming

To retheme the whole UI, edit `src/tui/colors.js`. Every panel reads from `PALETTE` — a single change propagates everywhere.

To theme just one panel, import `PALETTE` with an alias inside that panel file:
```js
import PALETTE from '../colors.js'
const MYPANEL_COLORS = { ...PALETTE, teal: '#00ff00' }  // green teal override
```

---

## Performance

- Grid size: 140 cols × 50 rows = 7,000 cells
- Canvas redraws on every `vm` change (~600ms interval = ~1.7 redraws/sec)
- At 12px JetBrains Mono, canvas is ~1120×600px
- No DOM nodes for panels — maximum rendering speed
- `image-rendering: pixelated` prevents antialiasing blur on the block characters
