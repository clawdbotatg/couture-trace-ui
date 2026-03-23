// ─── Panel: Pulse ────────────────────────────────────────────────────────────
// Pulse.js
//
// Runtime metrics panel: step count, progress bar, tempo, memory heat bar.
//
// Progress bar technique (inline, no helper):
//   We loop from 0 to BAR_WIDTH (16) and write █ or ░ per cell.
//   This is more flexible than a helper function because the color
//   can change per-cell based on the threshold (pg > 50).
//
// Memory heat bar: same technique, uses teal color when above 50%.
//
import { drawRowText, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

const BAR_W = 16

export function drawPulse(grid, b, {
  traceEvents = 25,
  progress    = 67,    // 0-100
  stepMs      = 30,
  pressure    = 70,   // memory heat 0-100
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'PULSE', C.pink, true)

  // Steps counter
  drawRowText(grid, b.r0 + 1, b.c0 + 1, 'steps  ' + traceEvents + '/64', C.white)

  // Progress bar + percentage
  const pg = Math.round(progress)
  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'progress  ', C.textMuted)
  for (let i = 0; i < BAR_W; i++) {
    const filled = i < Math.round(pg / 100 * BAR_W)
    setCell(grid, b.r0 + 2, b.c0 + 11 + i,
      filled ? '█' : '░', filled ? (pg > 50 ? C.coral : C.textMuted) : C.textMuted)
  }
  drawRowText(grid, b.r0 + 2, b.c0 + 28, '  ' + pg + '%', C.white, true)

  // Tempo
  drawRowText(grid, b.r0 + 3, b.c0 + 1, 'tempo  ' + stepMs + 'ms / frame', C.white)

  // Memory heat bar
  const mh = Math.round(pressure)
  drawRowText(grid, b.r0 + 4, b.c0 + 1, 'memory heat  ', C.textMuted)
  for (let i = 0; i < BAR_W; i++) {
    const filled = i < Math.round(mh / 100 * BAR_W)
    setCell(grid, b.r0 + 4, b.c0 + 15 + i,
      filled ? '█' : '░', filled ? (mh > 50 ? C.teal : C.textMuted) : C.textMuted)
  }
  drawRowText(grid, b.r0 + 4, b.c0 + 32, mh + '%', C.white, true)
}
