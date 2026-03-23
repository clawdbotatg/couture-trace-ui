// ─── Panel: Header ───────────────────────────────────────────────────────────
// CoutureTrace.js
//
// The top banner — shows the app name, runtime state, and a reverse-video
// "viewer mode" badge.
//
// What it draws:
//   Line 0: ⚡ TRANSFORMER VM (coral, bold)
//   Line 1: compiled-weight runway  ·  fibonacci.tvm (salmon)
//   Line 2: [ATELIER]  next L2 STORE 1  (white badge + white text)
//   Line 3: mood + layer count (salmon)
//   Line 4: current state — pc / acc / zero / carry (white)
//
// Props shape:
//   {
//     title:       string   — main title (default '⚡ TRANSFORMER VM')
//     subtitle:    string   — file/module line (default ...)
//     viewer:      string   — active viewer mode name
//     nextInstr:   string   — next instruction to execute
//     mood:        string   — one-liner describing current mood
//     layersActive: number  — how many layers are active
//     pc, acc, zero, carry  — current VM register state
//   }
//
// Customization:
//   - Change the emoji or title text
//   - Add/remove state fields on line 4
//   - Adjust r0 offsets if panel height changes in layout.js
//
import { drawRowText, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

export function drawHeader(grid, b, {
  title       = '⚡ TRANSFORMER VM',
  subtitle    = 'compiled-weight runway  ·  fibonacci.tvm',
  viewer      = 'Atelier',
  nextInstr   = 'L2 STORE 1',
  mood        = 'lifting values into the spotlight',
  layersActive = 3,
  pc          = 0,
  acc         = 0,
  zero        = false,
  carry       = false,
} = {}) {
  // Line 0: title
  drawRowText(grid, b.r0, b.c0 + 1, title, C.coral, true)

  // Line 1: subtitle / file name
  drawRowText(grid, b.r0 + 1, b.c0 + 1, subtitle, C.salmon)

  // Line 2: viewer badge (reverse-video) + next instruction
  const vStr = viewer.toUpperCase()
  for (let i = 0; i < vStr.length; i++)
    setCell(grid, b.r0 + 2, b.c0 + i, vStr[i], C.bg, C.white, true)
  drawRowText(grid, b.r0 + 2, b.c0 + vStr.length + 1, '  next ' + nextInstr, C.white, true)

  // Line 3: mood + layer count
  drawRowText(grid, b.r0 + 3, b.c0, 'mood ' + mood + '  ·  ' + layersActive + ' layers active', C.salmon)

  // Line 4: VM register snapshot
  const stateLine = 'current state  —  pc ' + pc + '  —  acc ' + acc +
    '  —  zero ' + String(zero) + '  —  carry ' + String(carry)
  drawRowText(grid, b.r0 + 4, b.c0, stateLine, C.white)
}
