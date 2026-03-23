// ─── Panel: LayerSpotlight ───────────────────────────────────────────────────
// LayerSpotlight.js
//
// Horizontal bar chart showing activity per layer (L0, L1, L2).
// Each layer gets a label, a 14-char block bar, and a value badge.
//
// Bar technique (blockBar helper):
//   blockBar(value, max, width) → { filled, total }
//   Then loop 0..width: filled chars → █ in layer color, rest → ░ muted
//
// The max is the peak layer value (not a fixed number),
// so bars are relative — the hottest layer always fills its bar completely.
//
import { drawRowText, drawBadge, setCell, blockBar } from '../core.js'
import PALETTE from '../colors.js'
const C = PALETTE

const BAR_W = 14
const LAYER_COLORS = [C.coral, C.amber, C.teal]

export function drawLayerSpotlight(grid, b, {
  layers = [
    { name: 'L0', value: 12 },
    { name: 'L1', value:  6 },
    { name: 'L2', value:  2 },
  ],
} = {}) {
  drawRowText(grid, b.r0, b.c0 + 1, 'LAYER SPOTLIGHT', C.pink, true)

  const maxVal = Math.max(...layers.map(l => l.value), 1)

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    const bar = blockBar(layer.value, maxVal, BAR_W)
    const row  = b.r0 + 1 + i
    const lc   = LAYER_COLORS[i] || C.coral

    // Layer name (L0, L1, L2)
    drawRowText(grid, row, b.c0 + 1, layer.name, C.textDim, true)

    // Block bar
    for (let j = 0; j < BAR_W; j++) {
      setCell(grid, row, b.c0 + 4 + j,
        j < bar.filled ? '█' : '░',
        j < bar.filled ? lc : C.textMuted)
    }

    // Value badge
    drawBadge(grid, row, b.c0 + 19, ' ' + layer.value, C.bg, C.teal)
  }
}
