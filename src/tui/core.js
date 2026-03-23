// ─── Couture Trace TUI — Core Primitives ─────────────────────────────────────
//
// Every drawing function operates on a 2D "grid" — an array of rows,
// where each cell is a { ch, fg, bg, bold } object.
//
// Grid coordinate system:
//   grid[row][col] — row 0 is the top, col 0 is the left
//   All coordinates are in character cells, not pixels.
//
// Core concept:
//   Rather than drawing DOM elements or CSS, you call draw* functions that
//   write character objects into grid cells. The grid is then rendered to
//   a <canvas> in one pass. This gives pixel-perfect TUI fidelity.
//
import PALETTE from './colors.js'

const C = PALETTE

// ─── Cell Factory ────────────────────────────────────────────────────────────

/**
 * Create a single cell.
 * @param {string} ch   — character to display (default: space = blank)
 * @param {string} fg   — foreground color key from PALETTE
 * @param {string} [bg] — background color key from PALETTE (default: panel)
 * @param {boolean} [bold] — render in bold
 */
export function makeCell(ch = ' ', fg = C.text, bg, bold = false) {
  return { ch, fg, bg: bg || C.panel, bold }
}

/** Create a row of blank cells of given length. */
export function makeRow(cols) {
  return Array.from({ length: cols }, () => makeCell())
}

/** Create an empty grid with `rows` rows and `cols` columns. */
export function makeGrid(rows, cols) {
  return Array.from({ length: rows }, () => makeRow(cols))
}

// ─── Cell Writers ────────────────────────────────────────────────────────────

/**
 * Write a single character into a grid cell.
 * Safely ignores out-of-bounds coordinates.
 */
export function setCell(grid, r, c, ch, fg, bg, bold) {
  if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
    grid[r][c] = makeCell(ch, fg, bg, bold)
  }
}

/**
 * Write a string starting at (row, col0).
 * Each character goes into its own cell — preserves per-char coloring.
 */
export function drawRowText(grid, row, col0, text, fg, bold) {
  for (let i = 0; i < text.length; i++) {
    setCell(grid, row, col0 + i, text[i], fg, undefined, bold)
  }
}

// ─── Badge / Reverse-Video ───────────────────────────────────────────────────

/**
 * Draw a "badge" — a label with fg/bg colors swapped (reverse video).
 * The text characters use fg as background and bg as foreground,
 * giving a solid-color block with contrasting text.
 *
 * @param {Array}   grid  — the 2D grid
 * @param {number}  row   — row to draw on
 * @param {number}  col0  — starting column
 * @param {string}  text  — badge label
 * @param {string}  fg    — foreground color (text color)
 * @param {string}  bg    — background color (block color)
 */
export function drawBadge(grid, row, col0, text, fg, bg) {
  for (let i = 0; i < text.length; i++) {
    setCell(grid, row, col0 + i, text[i], bg, fg, true)
  }
}

// ─── Panel ──────────────────────────────────────────────────────────────────

/**
 * Fill a rectangular region with the panel background color.
 * Call this before drawing border + content to ensure the interior
 * has the correct background.
 */
export function fillPanel(grid, r0, r1, c0, c1, bg) {
  const fillBg = bg || C.panel
  for (let r = r0; r < r1; r++)
    for (let c = c0; c < c1; c++)
      setCell(grid, r, c, ' ', C.text, fillBg)
}

/**
 * Draw a box-drawing border around a rectangular region.
 *
 * Uses Unicode box-drawing characters:
 *   ┌ ─ top-left corner      ─ top edge
 *   ┐ ─ top-right corner     ┐ right edge
 *   └ ─ bottom-left corner  ┘ bottom-right corner
 *   │ ─ left/right edges
 *
 * The border is drawn ON the boundary cells (r0, c0, r1-1, c1-1).
 * Interior cells are untouched — call fillPanel() first.
 */
export function drawPanelBorder(grid, r0, r1, c0, c1, color) {
  const bc = color || C.border
  const w = c1 - c0
  const h = r1 - r0
  if (w < 2 || h < 2) return

  // top edge (including corners)
  for (let c = c0; c < c1; c++) setCell(grid, r0,     c, '─', bc, C.panel)
  // bottom edge
  for (let c = c0; c < c1; c++) setCell(grid, r1 - 1, c, '─', bc, C.panel)
  // left edge
  for (let r = r0; r < r1; r++) setCell(grid, r, c0,     '│', bc, C.panel)
  // right edge
  for (let r = r0; r < r1; r++) setCell(grid, r, c1 - 1, '│', bc, C.panel)
  // corners
  setCell(grid, r0,     c0,     '┌', bc, C.panel)
  setCell(grid, r0,     c1 - 1, '┐', bc, C.panel)
  setCell(grid, r1 - 1, c0,     '└', bc, C.panel)
  setCell(grid, r1 - 1, c1 - 1, '┘', bc, C.panel)
}

/**
 * Draw a labeled panel: fill + border + title.
 * Convenience wrapper around fillPanel + drawPanelBorder + drawRowText.
 *
 * @param {Array}   grid  — the 2D grid
 * @param {object}  b     — bounds { r0, r1, c0, c1 }
 * @param {string}  title — panel title (printed top-left, inside border)
 * @param {string}  titleColor — color key for the title
 */
export function drawPanel(grid, b, title, titleColor) {
  fillPanel(grid, b.r0, b.r1, b.c0, b.c1)
  drawPanelBorder(grid, b.r0, b.r1, b.c0, b.c1)
  if (title) drawRowText(grid, b.r0, b.c0 + 1, title, titleColor || C.pink, true)
}

// ─── Progress Bar (Block Characters) ────────────────────────────────────────

/**
 * Draw a Unicode block-character progress bar inline into the grid.
 *
 * Uses: █ (filled) ▓ (heavy) ▒ (medium) ░ (light) for fill levels,
 * and the same characters at muted brightness for empty segments.
 *
 * @param {Array}  grid   — the 2D grid
 * @param {number} row    — row to draw on
 * @param {number} col0   — starting column
 * @param {number} value  — current value (0 to max)
 * @param {number} max    — maximum value
 * @param {number} width  — bar width in characters
 * @param {string} fgOn  — color for filled segments
 * @param {string} fgOff — color for empty segments
 * @param {string} [fillChar] — character for filled part (default █)
 */
export function drawProgressBar(grid, row, col0, value, max, width, fgOn, fgOff, fillChar = '█') {
  const pct   = Math.min(1, Math.max(0, value / (max || 1)))
  const filled = Math.round(pct * width)
  for (let i = 0; i < width; i++) {
    const ch = i < filled ? fillChar : '░'
    setCell(grid, row, col0 + i, ch, i < filled ? fgOn : fgOff)
  }
}

// ─── Block Bar (for charts) ─────────────────────────────────────────────────

/**
 * Compute fill fraction for a block-character bar chart.
 * Returns { filled, total } where filled = number of filled characters.
 *
 * @param {number} value — current value
 * @param {number} max   — reference maximum (peak)
 * @param {number} width — total characters wide
 * @returns {{ filled: number, total: number }}
 */
export function blockBar(value, max, width) {
  const filled = Math.round(Math.min(1, Math.max(0, value / (max || 1))) * width)
  return { filled, total: width }
}

// ─── Canvas Renderer ─────────────────────────────────────────────────────────

/**
 * Render a completed grid to a <canvas> element.
 *
 * Call this inside a useEffect when [grid] changes.
 * Uses image-rendering: pixelated so no antialiasing blur.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {Array}   grid     — 2D array of { ch, fg, bg, bold }
 * @param {number}  fontSize — px size (should match the charW/charH values)
 * @param {number}  charW    — measured character width in px
 * @param {number}  charH    — measured character height in px
 */
export function drawGrid(canvas, grid, fontSize, charW, charH) {
  const ctx = canvas.getContext('2d')
  ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`
  ctx.textBaseline = 'top'

  // Background
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Cells
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c]
      const x = c * charW
      const y = r * charH

      // Background (only if different from canvas bg)
      if (cell.bg && cell.bg !== C.bg) {
        ctx.fillStyle = cell.bg
        ctx.fillRect(x, y, charW, charH)
      }

      // Character
      ctx.fillStyle = cell.fg
      ctx.font = (cell.bold ? 'bold ' : '') + `${fontSize}px "JetBrains Mono", "Fira Code", monospace`
      ctx.fillText(cell.ch, x, y)
    }
  }

  // CRT scanline overlay (very subtle)
  ctx.fillStyle = 'rgba(0,0,0,0.03)'
  for (let y = 0; y < canvas.height; y += 3) {
    ctx.fillRect(0, y, canvas.width, 1)
  }
}
