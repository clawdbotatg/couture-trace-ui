import './TempoTrail.css'
import { BlockBar } from './ProgressBars'

function TempoTrail({ state }) {
  const { tempo } = state
  const W = 16
  const filled = Math.round((tempo.current / tempo.peak) * W)
  const bar = '█'.repeat(filled) + '░'.repeat(W - filled)
  return (
    <div className="tempo-trail">
      <div className="panel-title">Tempo Trail</div>
      <div className="tempo-rows">
        <div className="tempo-row">
          <span className="label">current</span>
          <span className="value-bright">{tempo.current} steps/s</span>
        </div>
        <div className="tempo-row">
          <span className="label">peak</span>
          <span className="value-amber">{tempo.peak}</span>
        </div>
        <div className="tempo-row tempo-bar-row">
          <span style={{ fontFamily: 'var(--font)', color: 'var(--teal)', fontSize: '11px', letterSpacing: '-0.5px' }}>
            {bar}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TempoTrail
