// ─── Panel: SignalDrift ──────────────────────────────────────────────────────
// SignalDrift.js
//
// Time-series chart showing ACC (accumulator) and PC (program counter)
// values over time. Rendered entirely with Unicode characters.
//
// Rendering pipeline:
//   1. Compute chart dimensions from panel bounds
//   2. Fill interior with bg color (clear any overdraw)
//   3. Draw horizontal grid lines (· dots at y=0, y=±max)
//   4. Bresenham-style line from ACC data points (▓ chars, salmon)
//   5. Scatter PC values as dots (●, teal)
//   6. Draw Y-axis labels (yMax, 0, yMin)
//
// Character choices:
//   · (middle dot)   → grid intersection dots
//   ▓ (full block)  → ACC line (thick, stands out)
//   ● (bullet)       → PC scatter dots
//
// Coordinate mapping:
//   xS(i) = map data index i → pixel x position
//   yS(v) = map data value v → pixel y position (inverted: yMax = top)
//
import { setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

const Y_MIN = -16
const Y_MAX = 16

/**
 * Draw the Signal Drift chart into the grid.
 *
 * @param {Array}  grid — 2D character grid
 * @param {object} b    — panel bounds { r0, r1, c0, c1 }
 * @param {number[]} acc — array of ACC values over time (20 points)
 * @param {number[]} pc  — array of PC values over time (20 points)
 */
export function drawSignalDrift(grid, b, acc = [], pc = []) {
  const PAD = 2
  const cw = (b.c1 - b.c0) - PAD * 2 - 1   // chart width in chars
  const ch = (b.r1 - b.r0) - 2             // chart height in chars
  if (cw < 5 || ch < 3 || acc.length < 2) return

  // Coordinate mapping functions
  const xS = i => PAD + Math.round((i / (acc.length - 1)) * cw)
  const yS = v => PAD + Math.round(((Y_MAX - v) / (Y_MAX - Y_MIN)) * ch)

  // 1. Clear interior
  for (let r = b.r0 + 1; r < b.r1 - 1; r++)
    for (let c = b.c0 + PAD; c < b.c1 - PAD - 1; c++)
      setCell(grid, r, c, ' ', C.text, C.bg)

  // 2. Horizontal grid lines (5 lines: top, upper-mid, center, lower-mid, bottom)
  for (let i = 0; i <= 4; i++) {
    const ry = b.r0 + 1 + Math.round((i / 4) * (ch - 1))
    for (let c = b.c0 + PAD; c < b.c1 - PAD - 1; c++)
      setCell(grid, ry, c, '·', C.border, C.bg)
  }

  // 3. PC dots (teal bullets along the chart)
  for (let i = 0; i < pc.length; i++) {
    const x = xS(i), y = yS(pc[i])
    setCell(grid, b.r0 + 1 + y, b.c0 + x, '●', C.teal, C.bg)
  }

  // 4. ACC line using Bresenham-style interpolation
  for (let i = 1; i < acc.length; i++) {
    const x1 = xS(i - 1), y1 = yS(acc[i - 1])
    const x2 = xS(i),     y2 = yS(acc[i])
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
    for (let s = 0; s <= steps; s++) {
      const t = steps === 0 ? 0 : s / steps
      const bx = Math.round(x1 + (x2 - x1) * t)
      const by = Math.round(y1 + (y2 - y1) * t)
      setCell(grid, b.r0 + 1 + by, b.c0 + PAD + bx, '▓', C.salmon, C.bg)
    }
  }

  // 5. Y-axis labels (yMax, 0, yMin)
  const labels = [[Y_MAX, 0], [0, Math.round(ch / 2)], [Y_MIN, ch - 1]]
  for (const [v, yo] of labels) {
    const s = String(v)
    for (let i = 0; i < s.length; i++)
      setCell(grid, b.r0 + 1 + yo, b.c0 + PAD - s.length + i - 1, s[i], C.textMuted, C.bg)
  }
}
