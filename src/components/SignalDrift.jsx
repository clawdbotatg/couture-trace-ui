import { useRef, useEffect } from 'react'
import './SignalDrift.css'

function SignalDrift({ state }) {
  const canvasRef = useRef(null)
  const { acc, pc } = state.signalDrift

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const pad = 24
    const chartW = W - pad * 2
    const chartH = H - pad * 2

    ctx.clearRect(0, 0, W, H)

    // Background
    ctx.fillStyle = '#1E1423'
    ctx.fillRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = '#2A1F30'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad + (chartH / 4) * i
      ctx.beginPath()
      ctx.setLineDash(i === 2 ? [4, 4] : [2, 4])
      ctx.moveTo(pad, y)
      ctx.lineTo(W - pad, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // Y axis labels
    ctx.fillStyle = '#6B4D5E'
    ctx.font = '10px JetBrains Mono'
    ctx.textAlign = 'right'
    const yMax = 16
    ;[[yMax, pad], [0, pad + chartH / 2], [-yMax, pad + chartH]].forEach(([label, y]) => {
      ctx.fillText(String(label), pad - 4, y + 4)
    })

    // X axis labels
    ctx.textAlign = 'center'
    ;['0', '10', '20'].forEach((label, i) => {
      ctx.fillText(label, pad + (chartW / 2) * i, H - 4)
    })

    // Scale helper
    const scaleY = (v) => pad + chartH / 2 - (v / yMax) * (chartH / 2)
    const scaleX = (i, len) => pad + (i / (len - 1)) * chartW

    // Draw ACC line (coral)
    ctx.beginPath()
    ctx.strokeStyle = '#E07A5F'
    ctx.lineWidth = 2
    for (let i = 0; i < acc.length; i++) {
      const x = scaleX(i, acc.length)
      const y = scaleY(Math.max(-yMax, Math.min(yMax, acc[i])))
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Draw PC dots (teal)
    ctx.fillStyle = '#5BC9A0'
    for (let i = 0; i < pc.length; i++) {
      const x = scaleX(i, pc.length)
      const y = scaleY(Math.max(-yMax, Math.min(yMax, pc[i])))
      ctx.fillRect(x - 2, y - 2, 4, 4)
    }

    // Legend
    ctx.font = '10px JetBrains Mono'
    ctx.textAlign = 'left'
    ctx.fillStyle = '#5BC9A0'
    ctx.fillText('● pc', W - pad - 40, pad + 12)
    ctx.fillStyle = '#E07A5F'
    ctx.fillText('─ acc', W - pad - 40, pad + 26)
  }, [acc, pc])

  return (
    <div className="signal-drift">
      <div className="panel-title">Signal Drift</div>
      <canvas
        ref={canvasRef}
        width={560}
        height={160}
        className="signal-canvas"
      />
    </div>
  )
}

export default SignalDrift
