// ─── Panel: StageMonitor ─────────────────────────────────────────────────────
// StageMonitor.js
//
// Top-right panel. Shows runtime metrics, progress, and proof status.
//
// What it draws:
//   Line 0: STAGE MONITOR (pink, bold)
//   Line 1: [RUNNING] Velvet  30ms
//   Line 2: dispatch  L2 STORE 1
//   Line 3: progress  ████████░░░░░░░  67%   throughput  29 steps/s
//   Line 4: memory  5 cells  —  trace  25 events
//   Line 5: proof  READY  —  press p to run replay -> prove
//
// Key technique — inline progress bar:
//   Loops from 0 to 16, writes █ for filled slots and ░ for empty.
//   The threshold (pg > 50) switches color from muted to coral.
//
import { drawRowText, drawBadge, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawStageMonitor(grid, b, {
  status      = 'RUNNING',
  theme       = 'Velvet',
  stepMs      = 30,
  nextInstr   = 'L2 STORE 1',
  progress    = 67,       // 0-100
  throughput  = 29,
  memoryCells  = 5,
  traceEvents  = 25,
  proof       = 'READY',
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'STAGE MONITOR', C.pink, true)

  // Line 1: status badge + theme + step ms
  drawBadge(grid, b.r0 + 1, b.c0 + 1, status, C.bg, C.teal)
  drawRowText(grid, b.r0 + 1, b.c0 + 10, ' ' + theme, C.amber, true)
  drawRowText(grid, b.r0 + 1, b.c0 + 18, '  ' + stepMs + 'ms', C.teal, true)

  // Line 2: next instruction
  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'dispatch  ' + nextInstr, C.white, true)

  // Line 3: progress bar (16 chars) + throughput
  const pg = Math.round(progress)
  drawRowText(grid, b.r0 + 3, b.c0 + 1, 'progress  ', C.textMuted)
  for (let i = 0; i < 16; i++) {
    const ch = i < Math.round(pg / 100 * 16) ? '█' : '░'
    setCell(grid, b.r0 + 3, b.c0 + 11 + i, ch, pg > 50 ? C.coral : C.textMuted)
  }
  drawRowText(grid, b.r0 + 3, b.c0 + 28, '  ' + pg + '%', C.white, true)
  drawRowText(grid, b.r0 + 3, b.c0 + 34, '  throughput  ' + throughput + ' steps/s', C.teal)

  // Line 4: memory + trace counts
  drawRowText(grid, b.r0 + 4, b.c0 + 1,
    'memory  ' + memoryCells + ' cells  —  trace  ' + traceEvents + ' events', C.white)

  // Line 5: proof status + hint
  drawRowText(grid, b.r0 + 5, b.c0 + 1, 'proof  ', C.coral, true)
  drawRowText(grid, b.r0 + 5, b.c0 + 8, proof, C.coral, true)
  drawRowText(grid, b.r0 + 5, b.c0 + 14, '  —  press p to run replay -> prove', C.textDim)
}
