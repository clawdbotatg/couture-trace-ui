// ─── TermCanvas — React Component ────────────────────────────────────────────
// TermCanvas.jsx
//
// Thin React wrapper around the TUI render engine.
// Measures character dimensions, renders the grid to canvas, handles resize.
//
// Usage:
//   <TermCanvas vm={myVmState} cols={140} rows={50} fontSize={12} />
//
// Props:
//   vm        — view model object (all panel data, see render.js docs)
//   cols      — character columns (default 140)
//   rows      — character rows (default 50)
//   fontSize  — px font size (default 12)
//
// The canvas uses image-rendering: pixelated to avoid antialiasing blur.
// At fontSize=12 and charW≈7px, 140 cols = ~980px wide.
//
import { useRef, useEffect } from 'react'
import { render } from '../tui/render.js'
import { drawGrid } from '../tui/core.js'
import PALETTE from '../tui/colors.js'
import './TermCanvas.css'

const C = PALETTE
const FONT = '12px "JetBrains Mono", "Fira Code", monospace'

function measureCharSize(ctx) {
  ctx.font = FONT
  const charW = Math.ceil(ctx.measureText('M').width)
  const charH = parseInt(FONT, 10)
  return { charW, charH }
}

export default function TermCanvas({
  vm      = {},
  cols    = 140,
  rows    = 50,
  fontSize = 12,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.font = FONT
    const { charW, charH } = measureCharSize(ctx)

    // Size canvas to exactly fit the character grid
    canvas.width  = cols * charW
    canvas.height = rows * charH
    canvas.style.display    = 'block'
    canvas.style.imageRendering = 'pixelated'

    // Render the grid
    const grid = render(vm, cols, rows)
    drawGrid(canvas, grid, fontSize, charW, charH)
  }, [vm, cols, rows, fontSize])

  return (
    <div className="term-canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  )
}
