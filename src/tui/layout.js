// ─── Couture Trace TUI — Layout Engine ───────────────────────────────────────
//
// Computes panel bounding boxes (in character cells) given total grid dimensions.
//
// Layout philosophy:
//   The grid is divided into a LEFT column (60% wide) and RIGHT column (40%).
//   Each panel occupies a fixed row range within its column.
//   All sizes are in CHARACTER CELLS, not pixels — this is what makes it
//   look like a real terminal rather than a web app.
//
// Column layout (140 total columns):
//   PAD = 1 (left/right padding inside outer frame)
//   LEFT  = PAD → PAD + floor((cols - PAD*2) * 0.60)   ≈ 83 cols
//   RIGHT = PAD + LEFT_WIDTH → PAD + (cols - PAD*2)     ≈ 55 cols
//
// Row layout (50 total rows):
//   Outer frame: row 0 and row 49 (border chars)
//   HEADER: rows 1-5  (title + status + viewer badge)
//   MODES:  row  7   (mode selector tabs)
//   BODY:    rows 9-16 (LeadInstruction left | Pulse+Story right)
//   MID:     rows 18-33 (SignalDrift left | Registers+Layers+Temp right)
//   TRACE:   rows 35-45 (LiveTrace full width)
//   KB:      rows 47    (keyboard shortcut bar)
//
// Adjusting the layout:
//   - Change COLS to make it narrower/wider (default 140 = ~1120px at 8px char)
//   - Change individual r0/r1 values to resize panels
//   - Change the 0.60 constant to rebalance left/right column widths
//

/**
 * Given total grid dimensions, return panel bounds.
 * All values are in character cells: { r0, r1, c0, c1 }
 * r1/c1 are exclusive (one past the last row/col).
 *
 * @param {number} cols — total columns (default 140)
 * @param {number} rows — total rows (default 50)
 * @returns {Record<string, {r0:number, r1:number, c0:number, c1:number}>}
 */
export function getLayout(cols = 140, rows = 50) {
  const PAD = 1
  const leftW  = Math.floor((cols - PAD * 2) * 0.60)
  const innerCols = cols - PAD * 2
  const rightC0 = PAD + leftW
  const rightC1 = PAD + innerCols

  return {
    // ── Header (top bar, spans left + right) ──────────────────────────────
    HDR: { r0: 0, r1: 6,  c0: PAD, c1: PAD + innerCols },

    // ── Stage Monitor (right side of header) ─────────────────────────────────
    STG: { r0: 0, r1: 6,  c0: rightC0, c1: rightC1 },

    // ── Mode Selector (single row tab bar) ──────────────────────────────────
    MOD: { r0: 7, r1: 8,  c0: PAD, c1: PAD + innerCols },

    // ── Lead Instruction (left body panel) ──────────────────────────────────
    LEAD: { r0: 9, r1: 17, c0: PAD, c1: PAD + leftW },

    // ── Pulse (top right body) ───────────────────────────────────────────────
    PULSE: { r0: 9, r1: 13, c0: rightC0, c1: rightC1 },

    // ── Memory Story (bottom right body) ────────────────────────────────────
    STORY: { r0: 13, r1: 17, c0: rightC0, c1: rightC1 },

    // ── Signal Drift (left middle, large chart) ─────────────────────────────
    SIG: { r0: 18, r1: 34, c0: PAD, c1: PAD + leftW },

    // ── Registers (right middle top) ─────────────────────────────────────────
    REG: { r0: 18, r1: 23, c0: rightC0, c1: rightC1 },

    // ── Layer Spotlight (right middle middle) ────────────────────────────────
    LYR: { r0: 23, r1: 29, c0: rightC0, c1: rightC1 },

    // ── Tempo Trail (right middle bottom) ───────────────────────────────────
    TEMP: { r0: 29, r1: 34, c0: rightC0, c1: rightC1 },

    // ── Live Trace (full-width log) ──────────────────────────────────────────
    TRCE: { r0: 35, r1: 46, c0: PAD, c1: PAD + innerCols },

    // ── Keyboard Bar (bottom shortcut strip) ─────────────────────────────────
    KB: { r0: 47, r1: 48, c0: PAD, c1: PAD + innerCols },
  }
}

export default getLayout
