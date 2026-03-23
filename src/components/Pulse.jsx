import { BlockBar } from './ProgressBars'
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
        <BlockBar value={state.progress} color="coral" />
        <span className="value-bright" style={{ minWidth: '28px' }}>{Math.round(state.progress)}%</span>
      </div>

      <div className="pulse-row">
        <span className="label">tempo</span>
        <span className="value-bright">{state.stepMs}ms / frame</span>
      </div>

      <div className="pulse-row">
        <span className="label">memory heat</span>
        <BlockBar value={state.pressure} color="heat" />
        <span className="value-bright" style={{ minWidth: '28px' }}>{state.pressure}%</span>
      </div>
    </div>
  )
}

export default Pulse
