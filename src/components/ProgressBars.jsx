// Reusable terminal-style block character progress bar
export function BlockBar({ value, max = 100, color = 'coral' }) {
  const WIDTH = 20
  const filled = Math.round((value / max) * WIDTH)
  const empty  = WIDTH - filled
  const fg = color === 'heat'
    ? 'coral'  // simulate thermal: red->green->yellow gradient via chars
    : color === 'teal' ? 'teal' : 'coral'

  // Use block chars: █ for filled, ░ for empty
  // For "heat" gradient we use ▓▒░ at different positions
  let blocks
  if (color === 'heat') {
    blocks = Array.from({ length: WIDTH }, (_, i) => {
      if (i < filled) {
        const pct = i / WIDTH
        if (pct < 0.4) return { char: '▓', c: '#3b82f6' }
        if (pct < 0.7) return { char: '▓', c: 'teal' }
        return { char: '▓', c: 'yellow' }
      }
      return { char: '░', c: 'dim' }
    })
  } else {
    blocks = Array.from({ length: WIDTH }, (_, i) => ({
      char: i < filled ? '█' : '░',
      c:    i < filled ? fg  : 'dim',
    }))
  }

  return (
    <span className="block-bar" style={{ fontFamily: 'var(--font)', fontSize: '11px', letterSpacing: '-0.5px' }}>
      {blocks.map((b, i) => (
        <span key={i} style={{ color: `var(--${b.c})` }}>{b.char}</span>
      ))}
    </span>
  )
}
