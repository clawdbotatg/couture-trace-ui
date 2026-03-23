// ─── Panel: LiveTrace ────────────────────────────────────────────────────────
// LiveTrace.js
//
// Scrolling instruction log. Each entry takes 2 rows:
//   Row A: #NNN  Lx  OPCODE  arg   ← the instruction
//   Row B:       pc A→B  acc X→Y   ← register delta (indented)
//
// Color coding:
//   #NNN   — yellow (line numbers stand out)
//   L2     — teal   (higher layer = teal)
//   L0/L1  — salmon (lower layers)
//   OPCODE + arg — white
//   delta line — textDim (secondary info)
//
// Entries are drawn top-to-bottom, newest first (index 0 in the array).
// Truncates to fit within the panel bounds (maxRows = panel height - 1).
//
import { drawRowText } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawLiveTrace(grid, b, {
  trace = [],    // [{ num, layer, op, operand, pcFrom, pcTo, accFrom, accTo }, ...]
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'LIVE TRACE', C.pink, true)

  const maxRows = (b.r1 - b.r0) - 1   // rows available below title
  const maxEntries = Math.floor(maxRows / 2)   // 2 rows per entry

  for (let i = 0; i < Math.min(trace.length, maxEntries); i++) {
    const t   = trace[i]
    const row = b.r0 + 1 + i * 2
    const lc  = t.layer === 'L2' ? C.teal : C.salmon

    // ── Row A: instruction line ──
    let cx = b.c0 + 1
    drawRowText(grid, row, cx, '#' + String(t.num).padStart(3, '0'), C.yellow, true); cx += 5
    drawRowText(grid, row, cx, t.layer, lc, true); cx += 4
    drawRowText(grid, row, cx, t.op, C.white, true); cx += t.op.length + 1
    drawRowText(grid, row, cx, String(t.operand), C.white); cx += 2

    // ── Row B: register delta (indented) ──
    const deltaLine = 'pc ' + t.pcFrom + '→' + t.pcTo + '  acc ' + t.accFrom + '→' + t.accTo
    drawRowText(grid, row + 1, b.c0 + 6, deltaLine, C.textDim)
  }
}
