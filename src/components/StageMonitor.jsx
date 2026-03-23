import './StageMonitor.css'

function StageMonitor({ state }) {
  return (
    <div className="stage-monitor">
      <div className="panel-title">Stage Monitor</div>

      <div className="stage-badges">
        <span className="badge badge-coral">{state.status}</span>
        <span className="badge badge-amber">{state.theme}</span>
        <span className="badge badge-teal">{state.stepMs}ms</span>
      </div>

      <div className="stage-details">
        <div className="stage-line">
          <span className="label">dispatch</span>
          <span className="value-bright">{state.nextInstruction}</span>
        </div>
        <div className="stage-line">
          <span className="label">progress</span>
          <span className="value-yellow">{Math.round(state.progress)}%</span>
          <span className="sep">—</span>
          <span className="label">throughput</span>
          <span className="value-teal">{state.throughput} steps/s</span>
        </div>
        <div className="stage-line">
          <span className="label">memory</span>
          <span className="value-bright">{state.memoryCells} cells</span>
          <span className="sep">—</span>
          <span className="label">trace</span>
          <span className="value-bright">{state.traceEvents} events</span>
        </div>
        <div className="stage-line">
          <span className="label">proof</span>
          <span className="value-coral">{state.proof}</span>
          <span className="sep">—</span>
          <span className="value-dim" style={{ fontSize: '11px' }}>press p to run replay {'->'} prove</span>
        </div>
      </div>
    </div>
  )
}

export default StageMonitor
