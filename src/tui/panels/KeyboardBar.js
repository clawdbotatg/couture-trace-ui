// ─── Panel: KeyboardBar ──────────────────────────────────────────────────────
// KeyboardBar.js
//
// Bottom shortcut strip. Shows keyboard shortcuts as [key] label pairs
// followed by a status badge.
//
// Structure:
//   ─── [q] quit [space] pause [n] step [1-4] view ... status  [RUNNING] ───
//
// Key technique — alternating key badges + text labels:
//   Each shortcut renders as: [KEY] label [spacer] [KEY] label ...
//   Keys use drawBadge with dark green (#166534) background.
//   The strip starts and ends with border-dash decorations (───).
//
// Adding a shortcut:
//   Add a [key, label] pair to the shortcuts array below.
//   The layout auto-wraps if you add too many (check kx against b.c1).
//
import { drawRowText, drawBadge, setCell } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

// Keyboard shortcut definitions: [key, description]
// The key string is drawn as a badge; description is plain text.
const DEFAULT_SHORTCUTS = [
  ['q',     'quit'],
  ['space', 'pause'],
  ['n',     'step'],
  ['1-4',   'view'],
  ['p',     'attest'],
  ['v',     'verify'],
  ['[/]',   'budget'],
  ['t',     'theme'],
  ['+/-',   'tempo'],
]

export function drawKeyboardBar(grid, b, {
  shortcuts = DEFAULT_SHORTCUTS,
  status    = 'RUNNING',
} = {}) {
  // Left decoration
  drawRowText(grid, b.r0, b.c0, '───', C.border)

  // Shortcuts
  let kx = b.c0 + 4
  for (const [key, desc] of shortcuts) {
    if (kx + key.length + 1 + desc.length > b.c1 - 2) break  // overflow guard
    drawBadge(grid, b.r0, kx, key, C.bg, '#166534')   // forest green key badge
    kx += key.length
    setCell(grid, b.r0, kx, ' ', C.textDim); kx++
    drawRowText(grid, b.r0, kx, desc, C.textDim); kx += desc.length
    setCell(grid, b.r0, kx, ' ', C.textDim); kx++
  }

  // Status label + badge
  drawRowText(grid, b.r0, kx, 'status  ', C.textDim); kx += 8
  drawBadge(grid, b.r0, kx, status, C.bg, C.teal); kx += status.length

  // Right decoration
  drawRowText(grid, b.r0, kx + 1, '  ───', C.border)
}
