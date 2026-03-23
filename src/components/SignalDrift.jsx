import { useRef, useEffect } from 'react'
import './SignalDrift.css'

function SignalDrift({ state }) {
  const canvasRef = useRef(null)
  const wrapRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (w === 0 || h === 0) return
      canvas.width  = w
      canvas.height = h
      draw(canvas, w, h, state.signalDrift)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [state.signalDrift])

  return (
    <div className="signal-drift">
      <div className="panel-title">Signal Drift</div>
      <div ref={wrapRef} className="signal-canvas-wrap">
        <canvas ref={canvasRef} className="signal-canvas" />
      </div>
    </div>
  )
}

function draw(canvas, W, H, { acc, pc }) {
  const ctx  = canvas.getContext('2d')
  const pad  = { t: 8, b: 20, l: 28, r: 8 }
  const cW   = W - pad.l - pad.r
  const cH   = H - pad.t - pad.b
  const yMax = 16

  ctx.clearRect(0, 0, W, H)

  // Grid
  ctx.strokeStyle = '#2a1f35'
  ctx.lineWidth   = 1
  ;[0, 0.5, 1].forEach(frac => {
    const y = pad.t + cH * frac
    ctx.beginPath()
    ctx.setLineDash(frac === 0.5 ? [3, 4] : [2, 4])
    ctx.moveTo(pad.l, y)
    ctx.lineTo(W - pad.r, y)
    ctx.stroke()
  })
  ctx.setLineDash([])

  // Y labels
  ctx.fillStyle   = '#6a5a7a'
  ctx.font        = '9px JetBrains Mono'
  ctx.textAlign   = 'right'
  ;[[yMax, pad.t + 4], [0, pad.t + cH / 2 + 3], [-yMax, H - pad.b + 3]].forEach(([v, y]) => {
    ctx.fillText(String(v), pad.l - 4, y)
  })

  // X labels
  ctx.textAlign = 'center'
  ;['0', '10', '20'].forEach((label, i) => {
    ctx.fillText(label, pad.l + (cW / 2) * i, H - 4)
  })

  const sx = (i) => pad.l + (i / (acc.length - 1)) * cW
  const sy = (v) => pad.t + cH / 2 - (v / yMax) * (cH / 2)

  // ACC line (salmon/coral)
  ctx.beginPath()
  ctx.strokeStyle = '#f472b6'
  ctx.lineWidth   = 1.5
  acc.forEach((v, i) => {
    const x = sx(i)
    const y = sy(Math.max(-yMax, Math.min(yMax, v)))
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // PC dots (teal)
  ctx.fillStyle = '#4ade80'
  pc.forEach((v, i) => {
    const x = sx(i)
    const y = sy(Math.max(-yMax, Math.min(yMax, v)))
    ctx.fillRect(x - 1.5, y - 1.5, 3, 3)
  })

  // Legend
  ctx.font      = '9px JetBrains Mono'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#4ade80'
  ctx.fillText('● pc',  W - pad.r - 36, pad.t + 12)
  ctx.fillStyle = '#f472b6'
  ctx.fillText('─ acc', W - pad.r - 36, pad.t + 24)
}

export default SignalDrift
