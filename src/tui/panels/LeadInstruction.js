// ─── Panel: LeadInstruction ──────────────────────────────────────────────────
// LeadInstruction.js
//
// Shows the next instruction to execute and the most recently executed one.
// Two-line entry format for each trace event:
//   Line A: #025  L1  STORE  2      (instruction)
//   Line B:       pc 10→11  acc 0→1  (register delta)
//
// Props:
//   nextInstr   — human-readable next instruction string
//   viewer      — active viewer name
//   latestInstr — { num, layer, op, operand, pcFrom, pcTo, accFrom, accTo }
//   copy        — human-readable description of latest instruction
//
import { drawRowText } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawLeadInstruction(grid, b, {
  nextInstr   = 'L2 STORE 1',
  viewer      = 'Atelier',
  latestInstr = { num: 25, layer: 'L1', op: 'STORE', operand: 2, pcFrom: 10, pcTo: 11, accFrom: 0, accTo: 1 },
  copy        = 'stitching a fresh write into memory',
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'LEAD INSTRUCTION', C.pink, true)

  // Next cue
  drawRowText(grid, b.r0 + 1, b.c0 + 1, 'next cue  ' + nextInstr, C.white, true)

  // Viewer
  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'viewer  ' + viewer, C.salmon)

  // Latest instruction (single-line compact form)
  const li = latestInstr
  const liLine = 'latest  #' + li.num + '  ' + li.layer + '  ' + li.op +
    '  ' + li.operand + '  pc ' + li.pcFrom + '→' + li.pcTo +
    '  acc ' + li.accFrom + '→' + li.accTo
  drawRowText(grid, b.r0 + 3, b.c0 + 1, liLine, C.white)

  // Copy / human description
  drawRowText(grid, b.r0 + 4, b.c0 + 1, 'copy  ' + copy, C.amber)
}
