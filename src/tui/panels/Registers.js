// ─── Panel: Registers ────────────────────────────────────────────────────────
// Registers.js
//
// Shows CPU register values as colored badges and flag states as text.
//
// Badges: PC (teal), ACC (amber), SP (teal)
// Flags:  ZERO, CARRY, HALT — shown as OFF (dim) or ON (reverse-video)
//
// The reverse-video trick for ON flags:
//   Sets cell fg=bg (solid color fill) and bg=teal — same technique
//   as the viewer badge in CoutureTrace. The text color and background
//   swap, creating a solid-color block with barely-visible text.
//   When the flag is OFF, we just use textDim for a muted appearance.
//
import { drawRowText, drawBadge, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawRegisters(grid, b, {
  registers = { pc: 0, acc: 0, sp: 5 },
  flags     = { zero: false, carry: false, halt: false },
  memoryCells = 5,
  traceEvents  = 25,
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'REGISTERS', C.pink, true)

  // Register badges (colored reverse-video blocks)
  drawBadge(grid, b.r0 + 1, b.c0 + 1,  'PC ' + registers.pc,  C.bg, C.teal)
  drawBadge(grid, b.r0 + 1, b.c0 + 11, 'ACC ' + registers.acc, C.bg, C.amber)
  drawBadge(grid, b.r0 + 1, b.c0 + 21, 'SP ' + registers.sp,  C.bg, C.teal)

  // Flag indicators — ON = reverse-video teal, OFF = dim text
  const zOn = flags.zero  ? C.teal : C.textDim
  const cOn = flags.carry ? C.teal : C.textDim
  const hOn = flags.halt  ? C.teal : C.textDim
  const zStr = flags.zero  ? 'ON' : 'OFF'
  const cStr = flags.carry ? 'ON' : 'OFF'
  const hStr = flags.halt  ? 'ON' : 'OFF'

  if (flags.zero)  // reverse-video for ON
    for (let i = 0; i < zStr.length; i++) setCell(grid, b.r0 + 2, b.c0 + 6 + i, zStr[i], C.teal, C.teal)
  else
    drawRowText(grid, b.r0 + 2, b.c0 + 6, zStr, C.textDim)

  drawRowText(grid, b.r0 + 2, b.c0 + 1, 'ZERO  ', C.pink, true)
  drawRowText(grid, b.r0 + 2, b.c0 + 9, '  CARRY ', C.pink, true)
  if (flags.carry)
    for (let i = 0; i < cStr.length; i++) setCell(grid, b.r0 + 2, b.c0 + 17 + i, cStr[i], C.teal, C.teal)
  else
    drawRowText(grid, b.r0 + 2, b.c0 + 17, cStr, C.textDim)
  drawRowText(grid, b.r0 + 2, b.c0 + 21, '  HALT  ', C.pink, true)
  if (flags.halt)
    for (let i = 0; i < hStr.length; i++) setCell(grid, b.r0 + 2, b.c0 + 29 + i, hStr[i], C.teal, C.teal)
  else
    drawRowText(grid, b.r0 + 2, b.c0 + 29, hStr, C.textDim)

  // Memory + event summary
  drawRowText(grid, b.r0 + 3, b.c0 + 1,
    'memory cells ' + memoryCells + '  ·  events ' + traceEvents, C.white)
}
