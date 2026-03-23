import './Pulse.css'

function Pulse({ state }) {
  return (
    <div className="pulse">
      <div className="panel-title">Pulse</div>

      <div className="pulse-row">
        <span className="label">steps</span>
        <span className="value-bright">{state.traceEvents}/64</span>
      </div>

      <div className="pulse-row">
        <span className="label">progress</span>
        <div className="pulse-bar-wrap">
          <div className="progress-bar" style={{ width: '100%' }}>
            <div
              className="progress-fill progress-fill-coral"
              style={{ width: `${state.progress}%` }}
            />
          </div>
          <span className="value-yellow">{Math.round(state.progress)}%</span>
        </div>
      </div>

      <div className="pulse-row">
        <span className="label">tempo</span>
        <span className="value-bright">{state.stepMs}ms / frame</span>
      </div>

      <div className="pulse-row">
        <span className="label">memory heat</span>
        <div className="pulse-bar-wrap">
          <div className="progress-bar" style={{ width: '100%' }}>
            <div
              className="progress-fill progress-fill-teal"
              style={{ width: `${state.pressure}%` }}
            />
          </div>
          <span className="value-teal">{state.pressure}%</span>
        </div>
      </div>
    </div>
  )
}

export default Pulse
