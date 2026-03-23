// ─── Panel: ModeSelector ─────────────────────────────────────────────────────
// ModeSelector.js
//
// Single-row tab bar showing the four viewer modes.
// The active mode is rendered in teal reverse-video;
// inactive modes show their number key in coral and label in muted.
//
// What it draws (one row):
//   MODES  [1:Runway]  [2:Atelier]  [3:Backtrace]  [4:Attestation]
//            ↑ inactive     ↑ active (teal fill)
//
// Key technique — per-character color:
//   Each character in a mode string gets its own color.
//   The number + colon use the coral key indicator;
//   the label uses textDim (inactive) or teal (active).
//   The active mode additionally uses setCell's bg parameter
//   for teal reverse-video fill.
//
import { drawRowText, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

const MODES = ['1:Runway', '2:Atelier', '3:Backtrace', '4:Attestation']

export function drawModeSelector(grid, b, { activeMode = 'Atelier' } = {}) {
  const activeIdx = MODES.findIndex(m =>
    m.replace('1:','').replace('2:','').replace('3:','').replace('4:','') === activeMode.replace('1:','').replace('2:','').replace('3:','').replace('4:','')
  )
  // Also check raw number index
  const byNum = { Runway: 0, Atelier: 1, Backtrace: 2, Attestation: 3 }[activeMode]
  const mNum = byNum !== undefined ? byNum : activeIdx

  let cx = b.c0
  drawRowText(grid, b.r0, cx, 'MODES  ', C.pink, true); cx += 7

  for (let i = 0; i < MODES.length; i++) {
    const m = MODES[i], active = i === mNum
    const label = m  // e.g. "1:Runway"
    for (let j = 0; j < label.length; j++) {
      const isNum = j === 0 || label[j - 1] === ':' // first char of each segment
      if (active) {
        setCell(grid, b.r0, cx + j, label[j], C.bg, C.teal, true)
      } else {
        setCell(grid, b.r0, cx + j, label[j],
          isNum ? C.coral : C.textDim, C.panel, false)
      }
    }
    cx += label.length + 1
  }
}
