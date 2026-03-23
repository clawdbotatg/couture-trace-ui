// ─── Panel: MemoryStory ──────────────────────────────────────────────────────
// MemoryStory.js
//
// Narrative panel that summarizes memory state in plain English.
// Designed to read like a human wrote it — not a data dump.
//
// Props:
//   spotlight — one-liner about the most recent memory event
//   hottest   — which cell had the most writes
//   pressure  — memory pressure percentage (0-100)
//
import { drawRowText } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawMemoryStory(grid, b, {
  spotlight = 'latest write hit cell 00',
  hottest   = 'cell 02 with 4 writes',
  pressure  = 70,
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'MEMORY STORY', C.pink, true)
  drawRowText(grid, b.r0 + 1, b.c0 + 1, 'spotlight  ' + spotlight, C.white, true)
  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'hottest  ' + hottest, C.teal)
  drawRowText(grid, b.r0 + 3, b.c0 + 1, 'pressure  ' + pressure + '%', C.amber)
}
