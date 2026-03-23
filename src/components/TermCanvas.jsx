import { useRef, useEffect } from 'react'
import './TermCanvas.css'

// ─── PALETTE ───
const C = {
  bg:          '#0d0d0d',
  panel:       '#131020',
  border:      '#3d2e4a',
  text:        '#c8b8d8',
  textDim:     '#8a7a9a',
  textMuted:   '#6a5a7a',
  coral:       '#f87171',
  teal:        '#4ade80',
  amber:       '#fbbf24',
  yellow:      '#facc15',
  white:       '#ffffff',
  salmon:      '#f472b6',
  pink:        '#c080a0',
}

function makeCell(ch = ' ', fg = C.text, bg, bold = false) {
  return { ch, fg, bg: bg || C.panel, bold }
}
function makeRow(cols) {
  return Array.from({ length: cols }, () => makeCell())
}

// ─── HELPERS ───
function setCell(grid, r, c, ch, fg, bg, bold) {
  if (r >= 0 && r < grid.length && c >= 0 && c < grid[r].length) {
    grid[r][c] = makeCell(ch, fg, bg, bold)
  }
}

function blockBar(value, max, width, fgChar) {
  const filled = Math.round(Math.min(1, Math.max(0, value / max)) * width)
  return { filled, total: width, fg: fgChar || C.coral }
}

function drawRowText(grid, row, col0, text, fg, bold) {
  for (let i = 0; i < text.length; i++) {
    setCell(grid, row, col0 + i, text[i], fg, undefined, bold)
  }
}

function drawBadge(grid, row, col0, text, fg, bg) {
  for (let i = 0; i < text.length; i++) {
    setCell(grid, row, col0 + i, text[i], bg, fg, true)
  }
}

function drawPanelBox(grid, r0, r1, c0, c1) {
  for (let r = r0; r < r1; r++) {
    for (let c = c0; c < c1; c++) {
      if (r < grid.length && c < grid[r].length) {
        grid[r][c] = makeCell(' ', C.text, C.panel)
      }
    }
  }
}

function drawPanelBorder(grid, r0, r1, c0, c1) {
  // top
  for (let c = c0; c < c1; c++) setCell(grid, r0, c, '─', C.border, C.panel)
  // bottom
  for (let c = c0; c < c1; c++) setCell(grid, r1 - 1, c, '─', C.border, C.panel)
  // left
  for (let r = r0; r < r1; r++) setCell(grid, r, c0, '│', C.border, C.panel)
  // right
  for (let r = r0; r < r1; r++) setCell(grid, r, c1 - 1, '│', C.border, C.panel)
  // corners
  setCell(grid, r0, c0, '┌', C.border, C.panel)
  setCell(grid, r0, c1 - 1, '┐', C.border, C.panel)
  setCell(grid, r1 - 1, c0, '└', C.border, C.panel)
  setCell(grid, r1 - 1, c1 - 1, '┘', C.border, C.panel)
}

// ─── LAYOUT ───
function getLayout(cols, rows) {
  const PAD = 1 // left/right padding
  const w = Math.floor((cols - PAD * 2) * 0.60)
  const innerCols = cols - PAD * 2
  return {
    HDR:  { r0: 0,  r1: 6,  c0: PAD, c1: PAD + w },
    STG:  { r0: 0,  r1: 6,  c0: PAD + w, c1: PAD + innerCols },
    MOD:  { r0: 7,  r1: 8,  c0: PAD, c1: PAD + innerCols },
    LEAD: { r0: 9,  r1: 17, c0: PAD, c1: PAD + w },
    PULSE:{ r0: 9,  r1: 13, c0: PAD + w, c1: PAD + innerCols },
    STORY:{ r0: 13, r1: 17, c0: PAD + w, c1: PAD + innerCols },
    SIG:  { r0: 18, r1: 34, c0: PAD, c1: PAD + w },
    REG:  { r0: 18, r1: 23, c0: PAD + w, c1: PAD + innerCols },
    LYR:  { r0: 23, r1: 29, c0: PAD + w, c1: PAD + innerCols },
    TEMP: { r0: 29, r1: 34, c0: PAD + w, c1: PAD + innerCols },
    TRCE: { r0: 35, r1: 46, c0: PAD, c1: PAD + innerCols },
    KB:   { r0: 47, r1: 48, c0: PAD, c1: PAD + innerCols },
  }
}

// ─── SIGNAL DRIFT ───
function drawSignalDrift(grid, r0, r1, c0, c1, acc, pc) {
  const pad = 2
  const cw = (c1 - c0) - pad * 2 - 1
  const ch = (r1 - r0) - 2
  if (cw < 5 || ch < 3) return

  const yMin = -16, yMax = 16
  const xS = i => pad + Math.round((i / (acc.length - 1)) * cw)
  const yS = v => pad + Math.round(((yMax - v) / (yMax - yMin)) * ch)

  // Background
  for (let r = r0 + 1; r < r1 - 1; r++)
    for (let c = c0 + pad; c < c1 - pad - 1; c++)
      setCell(grid, r, c, ' ', C.text, C.bg)

  // Grid
  for (let i = 0; i <= 4; i++) {
    const ry = r0 + 1 + Math.round((i / 4) * (ch - 1))
    for (let c = c0 + pad; c < c1 - pad - 1; c++)
      setCell(grid, ry, c, '·', C.border, C.bg)
  }

  // PC dots
  for (let i = 0; i < pc.length; i++) {
    const x = xS(i), y = yS(pc[i])
    setCell(grid, r0 + 1 + y, c0 + x, '●', C.teal, C.bg)
  }

  // ACC line
  for (let i = 1; i < acc.length; i++) {
    const x1 = xS(i - 1), y1 = yS(acc[i - 1])
    const x2 = xS(i),     y2 = yS(acc[i])
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
    for (let s = 0; s <= steps; s++) {
      const t = steps === 0 ? 0 : s / steps
      const bx = Math.round(x1 + (x2 - x1) * t)
      const by = Math.round(y1 + (y2 - y1) * t)
      setCell(grid, r0 + 1 + by, c0 + xS(0) + bx, '▓', C.salmon, C.bg)
    }
  }

  // Y labels
  const pairs = [[yMax, 0], [0, Math.round(ch / 2)], [-yMax, ch - 1]]
  for (const [v, yo] of pairs) {
    const s = String(v), r = r0 + 1 + yo
    for (let i = 0; i < s.length; i++)
      setCell(grid, r, c0 + pad - s.length + i - 1, s[i], C.textMuted, C.bg)
  }
}

// ─── RENDER ───
function render(vm, cols, rows) {
  const grid = []
  for (let r = 0; r < rows; r++) grid.push(makeRow(cols))
  const L = getLayout(cols, rows)

  // ── HEADER ──
  drawRowText(grid, 0, 1, '⚡ TRANSFORMER VM', C.coral, true)
  drawRowText(grid, 1, 1, 'compiled-weight runway  ·  fibonacci.tvm', C.salmon)

  // ATELIER badge (reverse video)
  const viewerStr = vm.viewer.toUpperCase()
  for (let i = 0; i < viewerStr.length; i++)
    setCell(grid, 2, i, viewerStr[i], C.bg, C.white, true)
  drawRowText(grid, 2, viewerStr.length + 1, '  next ' + vm.nextInstruction, C.white, true)

  drawRowText(grid, 3, 0, 'mood ' + vm.mood + '  ·  ' + vm.layersActive + ' layers active', C.salmon)
  drawRowText(grid, 4, 0, 'current state  —  pc ' + vm.pc + '  —  acc ' + vm.acc + '  —  zero ' + String(vm.zero) + '  —  carry ' + String(vm.carry), C.white)

  // ── STAGE MONITOR ──
  const s = L.STG
  drawRowText(grid, s.r0, s.c0 + 1, 'STAGE MONITOR', C.pink, true)
  drawBadge(grid, s.r0 + 1, s.c0 + 1, 'RUNNING', C.bg, C.teal)
  drawRowText(grid, s.r0 + 1, s.c0 + 10, ' ' + vm.theme, C.amber, true)
  drawRowText(grid, s.r0 + 1, s.c0 + 18, '  ' + vm.stepMs + 'ms', C.teal, true)
  drawRowText(grid, s.r0 + 2, s.c0 + 1, 'dispatch  ' + vm.nextInstruction, C.white, true)
  drawRowText(grid, s.r0 + 3, s.c0 + 1, 'progress  ' + Math.round(vm.progress) + '%', C.white)
  drawRowText(grid, s.r0 + 3, s.c0 + 20, '  throughput  ' + vm.throughput + ' steps/s', C.teal)
  drawRowText(grid, s.r0 + 4, s.c0 + 1, 'memory  ' + vm.memoryCells + ' cells  —  trace  ' + vm.traceEvents + ' events', C.white)
  drawRowText(grid, s.r0 + 5, s.c0 + 1, 'proof  ', C.coral, true)
  drawRowText(grid, s.r0 + 5, s.c0 + 8, vm.proof, C.coral, true)
  drawRowText(grid, s.r0 + 5, s.c0 + 14, '  —  press p to run replay -> prove', C.textDim)

  // ── MODES ──
  const mNum = vm.viewer === 'Runway' ? 1 : vm.viewer === 'Atelier' ? 2 : vm.viewer === 'Backtrace' ? 3 : 4
  const modes = ['1:Runway', '2:Atelier', '3:Backtrace', '4:Attestation']
  let mx = L.MOD.c0
  drawRowText(grid, L.MOD.r0, mx, 'MODES  ', C.pink, true); mx += 7
  for (let i = 0; i < modes.length; i++) {
    const m = modes[i], active = (i + 1) === mNum
    for (let j = 0; j < m.length; j++) {
      setCell(grid, L.MOD.r0, mx + j, m[j], active ? C.bg : (j === 0 ? C.coral : C.textDim), active ? C.teal : C.panel, active)
    }
    mx += m.length + 1
  }

  // ── LEAD INSTRUCTION ──
  const ld = L.LEAD
  drawRowText(grid, ld.r0, ld.c0 + 1, 'LEAD INSTRUCTION', C.pink, true)
  drawRowText(grid, ld.r0 + 1, ld.c0 + 1, 'next cue  ' + vm.nextInstruction, C.white, true)
  drawRowText(grid, ld.r0 + 2, ld.c0 + 1, 'viewer  ' + vm.viewer, C.salmon)
  const li = vm.latestInstruction
  drawRowText(grid, ld.r0 + 3, ld.c0 + 1, 'latest  #' + li.num + '  ' + li.layer + '  ' + li.op + '  ' + li.operand + '  pc ' + li.pcFrom + '→' + li.pcTo + '  acc ' + li.accFrom + '→' + li.accTo, C.white)
  drawRowText(grid, ld.r0 + 4, ld.c0 + 1, 'copy  ' + vm.copy, C.amber)

  // ── PULSE ──
  const p2 = L.PULSE
  drawRowText(grid, p2.r0, p2.c0 + 1, 'PULSE', C.pink, true)
  drawRowText(grid, p2.r0 + 1, p2.c0 + 1, 'steps  ' + vm.traceEvents + '/64', C.white)
  const pg = Math.round(vm.progress)
  drawRowText(grid, p2.r0 + 2, p2.c0 + 1, 'progress  ', C.textMuted)
  for (let i = 0; i < 16; i++) {
    const ch2 = i < Math.round(pg / 100 * 16) ? '█' : '░'
    setCell(grid, p2.r0 + 2, p2.c0 + 11 + i, ch2, pg > 50 ? C.coral : C.textMuted)
  }
  drawRowText(grid, p2.r0 + 2, p2.c0 + 28, '  ' + pg + '%', C.white, true)
  drawRowText(grid, p2.r0 + 3, p2.c0 + 1, 'tempo  ' + vm.stepMs + 'ms / frame', C.white)
  const mh = vm.pressure
  drawRowText(grid, p2.r0 + 4, p2.c0 + 1, 'memory heat  ', C.textMuted)
  for (let i = 0; i < 16; i++) {
    const ch2 = i < Math.round(mh / 100 * 16) ? '█' : '░'
    setCell(grid, p2.r0 + 4, p2.c0 + 15 + i, ch2, mh > 50 ? C.teal : C.textMuted)
  }
  drawRowText(grid, p2.r0 + 4, p2.c0 + 32, mh + '%', C.white, true)

  // ── MEMORY STORY ──
  const m2 = L.STORY
  drawRowText(grid, m2.r0, m2.c0 + 1, 'MEMORY STORY', C.pink, true)
  drawRowText(grid, m2.r0 + 1, m2.c0 + 1, 'spotlight  ' + vm.spotlight, C.white, true)
  drawRowText(grid, m2.r0 + 2, m2.c0 + 1, 'hottest  ' + vm.hottest, C.teal)
  drawRowText(grid, m2.r0 + 3, m2.c0 + 1, 'pressure  ' + vm.pressure + '%', C.amber)

  // ── SIGNAL DRIFT ──
  drawRowText(grid, L.SIG.r0, L.SIG.c0 + 1, 'SIGNAL DRIFT', C.pink, true)
  drawSignalDrift(grid, L.SIG.r0, L.SIG.r1, L.SIG.c0, L.SIG.c1, vm.signalDrift.acc, vm.signalDrift.pc)

  // ── REGISTERS ──
  const r2 = L.REG
  drawRowText(grid, r2.r0, r2.c0 + 1, 'REGISTERS', C.pink, true)
  drawBadge(grid, r2.r0 + 1, r2.c0 + 1, 'PC ' + vm.registers.pc, C.bg, C.teal)
  drawBadge(grid, r2.r0 + 1, r2.c0 + 11, 'ACC ' + vm.registers.acc, C.bg, C.amber)
  drawBadge(grid, r2.r0 + 1, r2.c0 + 21, 'SP ' + vm.registers.sp, C.bg, C.teal)
  const zFlag = vm.flags.zero ? 'ON' : 'OFF', cFlag = vm.flags.carry ? 'ON' : 'OFF', hFlag = vm.flags.halt ? 'ON' : 'OFF'
  drawRowText(grid, r2.r0 + 2, r2.c0 + 1, 'ZERO  ' + zFlag + '  CARRY ' + cFlag + '  HALT  ' + hFlag, zFlag === 'ON' ? C.bg : C.textDim)
  drawRowText(grid, r2.r0 + 3, r2.c0 + 1, 'memory cells ' + vm.memoryCells + '  ·  events ' + vm.traceEvents, C.white)

  // ── LAYER SPOTLIGHT ──
  const ls = L.LYR
  drawRowText(grid, ls.r0, ls.c0 + 1, 'LAYER SPOTLIGHT', C.pink, true)
  const maxVal = Math.max(...vm.layers.map(l => l.value))
  const lc = [C.coral, C.amber, C.teal]
  for (let i2 = 0; i2 < vm.layers.length; i2++) {
    const layer = vm.layers[i2]
    const bar = blockBar(layer.value, maxVal, 14)
    const row = ls.r0 + 1 + i2
    drawRowText(grid, row, ls.c0 + 1, layer.name, C.textDim, true)
    for (let j = 0; j < 14; j++) {
      const ch2 = j < bar.filled ? '█' : '░'
      setCell(grid, row, ls.c0 + 4 + j, ch2, lc[i2])
    }
    drawBadge(grid, row, ls.c0 + 19, ' ' + layer.value, C.bg, C.teal)
  }

  // ── TEMPO TRAIL ──
  const t2 = L.TEMP
  drawRowText(grid, t2.r0, t2.c0 + 1, 'TEMPO TRAIL', C.pink, true)
  drawRowText(grid, t2.r0 + 1, t2.c0 + 1, 'current  ' + vm.tempo.current + ' steps/s', C.white)
  drawRowText(grid, t2.r0 + 2, t2.c0 + 1, 'peak  ' + vm.tempo.peak, C.amber)
  const tBar = blockBar(vm.tempo.current, vm.tempo.peak, 14, C.teal)
  drawRowText(grid, t2.r0 + 3, t2.c0 + 1, '  ', C.text)
  for (let i = 0; i < 14; i++) {
    const ch2 = i < tBar.filled ? '█' : '░'
    setCell(grid, t2.r0 + 3, t2.c0 + 3 + i, ch2, tBar.fg)
  }

  // ── LIVE TRACE ──
  drawRowText(grid, L.TRCE.r0, L.TRCE.c0 + 1, 'LIVE TRACE', C.pink, true)
  for (let i = 0; i < Math.min(vm.trace.length, 10); i++) {
    const t = vm.trace[i]
    const row = L.TRCE.r0 + 1 + i * 2
    const lColor = t.layer === 'L2' ? C.teal : C.salmon
    let cx = L.TRCE.c0 + 1
    drawRowText(grid, row, cx, '#' + String(t.num).padStart(3, '0'), C.yellow, true); cx += 5
    drawRowText(grid, row, cx, t.layer, lColor, true); cx += 4
    drawRowText(grid, row, cx, t.op, C.white, true); cx += t.op.length + 1
    drawRowText(grid, row, cx, String(t.operand), C.white); cx += 2
    drawRowText(grid, row + 1, L.TRCE.c0 + 6, 'pc ' + t.pcFrom + '→' + t.pcTo + '  acc ' + t.accFrom + '→' + t.accTo, C.textDim)
  }

  // ── KEYBOARD BAR ──
  const kbRow = L.KB.r0
  drawRowText(grid, kbRow, L.KB.c0, '───', C.border)
  const shortcuts = [['q','quit'],['space','pause'],['n','step'],['1-4','view'],['p','attest'],['v','verify'],['[/]','budget'],['t','theme'],['+/-','tempo']]
  let kx = L.KB.c0 + 4
  for (const [k, a] of shortcuts) {
    drawBadge(grid, kbRow, kx, k, C.bg, '#166534'); kx += k.length
    setCell(grid, kbRow, kx, ' ', C.textDim); kx++
    drawRowText(grid, kbRow, kx, a, C.textDim); kx += a.length
    setCell(grid, kbRow, kx, ' ', C.textDim); kx++
  }
  drawRowText(grid, kbRow, kx, 'status  ', C.textDim); kx += 8
  drawBadge(grid, kbRow, kx, 'RUNNING', C.bg, C.teal); kx += 7
  drawRowText(grid, kbRow, kx + 1, '  ───', C.border)

  return grid
}

// ─── CANVAS DRAW ───
function drawGrid(canvas, grid, fontSize, charW, charH) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  ctx.font = `${fontSize}px "JetBrains Mono", "Fira Code", monospace`
  ctx.textBaseline = 'top'

  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, H)

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const cell = grid[r][c]
      const x = c * charW, y = r * charH
      if (cell.bg && cell.bg !== C.bg) {
        ctx.fillStyle = cell.bg
        ctx.fillRect(x, y, charW, charH)
      }
      ctx.fillStyle = cell.fg
      ctx.font = (cell.bold ? 'bold ' : '') + `${fontSize}px "JetBrains Mono", "Fira Code", monospace`
      ctx.fillText(cell.ch, x, y)
    }
  }

  // Subtle scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.03)'
  for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1)
}

// ─── COMPONENT ───
const COLS = 160, ROWS = 50, FONT = 12

export default function TermCanvas({ vm }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.font = `${FONT}px "JetBrains Mono", "Fira Code", monospace`
    const charW = Math.ceil(ctx.measureText('M').width)
    const charH = FONT

    // Use 140 columns for wider display (140 * 8 = 1120px)
    const W = 140 * charW
    canvas.width  = W
    canvas.height = ROWS * charH
    canvas.style.display = 'block'
    canvas.style.imageRendering = 'pixelated'

    const grid = render(vm, 140, ROWS)
    drawGrid(canvas, grid, FONT, charW, charH)
  }, [vm])

  return (
    <div className="term-canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  )
}
