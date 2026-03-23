// ─── Couture Trace TUI — Main Render ─────────────────────────────────────────
// render.js
//
// Orchestrates the full terminal render. Imports all panel functions,
// computes layout, fills + borders each panel, then delegates content
// to the panel functions.
//
// How to add a new panel:
//   1. Create src/tui/panels/MyPanel.js with a drawMyPanel(grid, bounds, props)
//      function. Follow the same pattern as existing panels.
//   2. Import it here.
//   3. Call it inside render() with the appropriate bounds from L.
//   4. Register it in the LAYOUT object in layout.js so its bounds are
//      computed correctly. Add a drawPanelBorder call before the content.
//   5. Update App.jsx's INIT state and useEffect to include the new panel's
//      data in the vm prop.
//
// How to change panel visibility by mode:
//   Mode-specific panels check vm.viewer (or a visibility prop) and
//   conditionally call drawPanelBorder + content. See ModeSelector.js
//   for the active mode highlighting pattern.
//
import { makeGrid, drawPanelBorder } from './core.js'
import PALETTE from './colors.js'
import { getLayout } from './layout.js'

import { drawHeader }        from './panels/CoutureTrace.js'
import { drawStageMonitor }  from './panels/StageMonitor.js'
import { drawModeSelector }  from './panels/ModeSelector.js'
import { drawLeadInstruction } from './panels/LeadInstruction.js'
import { drawPulse }         from './panels/Pulse.js'
import { drawMemoryStory }   from './panels/MemoryStory.js'
import { drawSignalDrift }   from './panels/SignalDrift.js'
import { drawRegisters }     from './panels/Registers.js'
import { drawLayerSpotlight } from './panels/LayerSpotlight.js'
import { drawTempoTrail }    from './panels/TempoTrail.js'
import { drawLiveTrace }     from './panels/LiveTrace.js'
import { drawKeyboardBar }   from './panels/KeyboardBar.js'

const C = PALETTE

/**
 * Render the full terminal UI into a 2D character grid.
 *
 * @param {object} vm  — view model / app state (all panel data)
 * @param {number} cols — grid columns (default 140)
 * @param {number} rows — grid rows (default 50)
 * @returns {Array[]} 2D grid of { ch, fg, bg, bold } cells
 */
export function render(vm, cols = 140, rows = 50) {
  const grid = makeGrid(rows, cols)
  const L    = getLayout(cols, rows)

  // ── Outer terminal frame ──────────────────────────────────────────────────
  drawPanelBorder(grid, 0, rows, 0, cols)

  // ── Header (title + status + viewer badge) ───────────────────────────────
  drawPanelBorder(grid, L.HDR.r0, L.HDR.r1, L.HDR.c0, L.HDR.c1)
  drawHeader(grid, L.HDR, vm)

  // ── Stage Monitor (top-right metrics) ─────────────────────────────────────
  drawPanelBorder(grid, L.STG.r0, L.STG.r1, L.STG.c0, L.STG.c1)
  drawStageMonitor(grid, L.STG, vm)

  // ── Mode Selector (tab bar) ───────────────────────────────────────────────
  drawPanelBorder(grid, L.MOD.r0, L.MOD.r1, L.MOD.c0, L.MOD.c1)
  drawModeSelector(grid, L.MOD, vm)

  // ── Lead Instruction (left body) ──────────────────────────────────────────
  drawPanelBorder(grid, L.LEAD.r0, L.LEAD.r1, L.LEAD.c0, L.LEAD.c1)
  drawLeadInstruction(grid, L.LEAD, vm)

  // ── Pulse (top-right body) ────────────────────────────────────────────────
  drawPanelBorder(grid, L.PULSE.r0, L.PULSE.r1, L.PULSE.c0, L.PULSE.c1)
  drawPulse(grid, L.PULSE, vm)

  // ── Memory Story (bottom-right body) ─────────────────────────────────────
  drawPanelBorder(grid, L.STORY.r0, L.STORY.r1, L.STORY.c0, L.STORY.c1)
  drawMemoryStory(grid, L.STORY, vm)

  // ── Signal Drift (left middle chart) ─────────────────────────────────────
  drawPanelBorder(grid, L.SIG.r0, L.SIG.r1, L.SIG.c0, L.SIG.c1)
  drawSignalDrift(grid, L.SIG, vm.signalDrift?.acc, vm.signalDrift?.pc)

  // ── Registers (right middle top) ─────────────────────────────────────────
  drawPanelBorder(grid, L.REG.r0, L.REG.r1, L.REG.c0, L.REG.c1)
  drawRegisters(grid, L.REG, vm)

  // ── Layer Spotlight (right middle middle) ────────────────────────────────
  drawPanelBorder(grid, L.LYR.r0, L.LYR.r1, L.LYR.c0, L.LYR.c1)
  drawLayerSpotlight(grid, L.LYR, vm)

  // ── Tempo Trail (right middle bottom) ─────────────────────────────────────
  drawPanelBorder(grid, L.TEMP.r0, L.TEMP.r1, L.TEMP.c0, L.TEMP.c1)
  drawTempoTrail(grid, L.TEMP, vm)

  // ── Live Trace (full-width log) ──────────────────────────────────────────
  drawPanelBorder(grid, L.TRCE.r0, L.TRCE.r1, L.TRCE.c0, L.TRCE.c1)
  drawLiveTrace(grid, L.TRCE, vm)

  // ── Keyboard Bar (bottom shortcuts) ──────────────────────────────────────
  drawPanelBorder(grid, L.KB.r0, L.KB.r1, L.KB.c0, L.KB.c1)
  drawKeyboardBar(grid, L.KB, vm)

  return grid
}
