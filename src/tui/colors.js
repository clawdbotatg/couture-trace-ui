// ─── Couture Trace TUI — Color Palette ───────────────────────────────────────
//
// All colors used by the UI kit. Import this in any file that needs colors.
// Swap values here to retheme the entire terminal at once.
//
// Style guide:
//   pink   → panel titles / section headers
//   teal   → active/positive states, badges
//   coral  → warnings, highlights, progress fill
//   amber  → secondary highlights, peak values
//   salmon → layer colors, ACC values, accents
//   text   → primary body text
//   textDim/textMuted → secondary / labels
//   border → box-drawing characters, grid lines
//   bg     → canvas background
//   panel  → default cell background inside panels
//
export const PALETTE = {
  bg:        '#0d0d0d',  // canvas / outer background
  panel:     '#131020',  // default panel interior
  border:    '#3d2e4a',  // box-drawing chars (┌─┐│└─┘)
  text:      '#c8b8d8',  // primary text
  textDim:   '#8a7a9a',  // secondary text
  textMuted: '#6a5a7a',  // tertiary / grid dots
  coral:     '#f87171',  // coral red — warnings, progress fill
  teal:      '#4ade80',  // teal green — active, OK, PC dots
  amber:     '#fbbf24',  // amber — peak, secondary badges
  yellow:    '#facc15',  // bright yellow — trace line numbers
  white:     '#ffffff',  // pure white — reverse-video badges
  salmon:    '#f472b6',  // salmon/pink — ACC line, L1 layer
  pink:      '#c080a0',  // dusty rose — panel titles
}

export default PALETTE
