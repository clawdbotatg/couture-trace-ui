import './TempoTrail.css'

function TempoTrail({ state }) {
  const { tempo } = state
  const ratio = tempo.current / tempo.peak

  return (
    <div className="tempo-trail">
      <div className="panel-title">Tempo Trail</div>
      <div className="tempo-metrics">
        <div className="tempo-row">
          <span className="label">current</span>
          <span className="value-teal">{tempo.current} steps/s</span>
        </div>
        <div className="tempo-row">
          <span className="label">peak</span>
          <span className="value-amber">{tempo.peak}</span>
        </div>
      </div>
      <div className="tempo-spark">
        <div className="progress-bar" style={{ width: '100%' }}>
          <div
            className="progress-fill progress-fill-teal"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default TempoTrail
