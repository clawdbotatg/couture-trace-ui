import './Registers.css'

function Registers({ state }) {
  const { registers, flags } = state
  return (
    <div className="registers">
      <div className="panel-title">Registers</div>

      <div className="reg-badges">
        <span className="badge badge-teal">PC {registers.pc}</span>
        <span className="badge badge-amber">ACC {registers.acc}</span>
        <span className="badge badge-teal">SP {registers.sp}</span>
      </div>

      <div className="flag-badges">
        <span className={`badge ${flags.zero ? 'badge-coral' : 'badge-dim'}`}>
          ZERO {flags.zero ? 'ON' : 'OFF'}
        </span>
        <span className={`badge ${flags.carry ? 'badge-coral' : 'badge-dim'}`}>
          CARRY {flags.carry ? 'ON' : 'OFF'}
        </span>
        <span className={`badge ${flags.halt ? 'badge-coral' : 'badge-dim'}`}>
          HALT {flags.halt ? 'ON' : 'OFF'}
        </span>
      </div>

      <div className="reg-summary">
        <span className="label">memory cells</span>
        <span className="value-bright">{state.memoryCells}</span>
        <span className="sep">•</span>
        <span className="label">events</span>
        <span className="value-bright">{state.traceEvents}</span>
      </div>
    </div>
  )
}

export default Registers
