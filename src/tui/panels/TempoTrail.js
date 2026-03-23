// ─── Panel: TempoTrail ───────────────────────────────────────────────────────
// TempoTrail.js
//
// Shows current and peak throughput (steps/second) with a block bar.
//
// The bar is relative to PEAK — current fills a fraction of the bar
// based on current/peak. This gives a "vs. record" feel rather than
// an absolute 0-100% meter.
//
import { drawRowText, drawProgressBar } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawTempoTrail(grid, b, {
  current = 28,
  peak    = 29,
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'TEMPO TRAIL', C.pink, true)
  drawRowText(grid, b.r0 + 1, b.c0 + 1, 'current  ' + current + ' steps/s', C.white)
  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'peak  ' + peak, C.amber)

  // Relative bar: current vs peak
  drawProgressBar(grid, b.r0 + 3, b.c0 + 1, current, peak, 14, C.teal, C.textMuted)
}
