import './Couture.css'

function CoutureTrace({ state }) {
  const tagClass = state.viewer === 'Atelier' ? 'badge-teal' : state.viewer === 'Runway' ? 'badge-coral' : 'badge-amber'

  return (
    <div className="couture-header">
      <div className="couture-title">
        <span className="couture-brand">⚡</span>
        <span className="couture-trans">TRANSFORMER</span>
        <span className="couture-vm">VM</span>
      </div>

      <div className="couture-meta">
        <span className="value-salmon">compiled-weight runway</span>
        <span className="sep-bullet">·</span>
        <span className="value-amber">fibonacci.tvm</span>
      </div>

      <div className="couture-state-row">
        <span className={`badge ${tagClass}`}>{state.viewer.toUpperCase()}</span>
        <span className="label">next</span>
        <span className="value-bright">{state.nextInstruction}</span>
      </div>

      <div className="couture-mood">
        <span className="label">mood</span>
        <span className="value-salmon value-italic">{state.mood}</span>
        <span className="sep-bullet">·</span>
        <span className="value-bright">{state.layersActive} layers active</span>
      </div>

      <div className="couture-vars">
        <span className="label">current state</span>
        <span className="sep">—</span>
        <span className="value-bright">pc</span>
        <span className="value-coral">{state.pc}</span>
        <span className="sep">—</span>
        <span className="value-bright">acc</span>
        <span className="value-coral">{state.acc}</span>
        <span className="sep">—</span>
        <span className="value-bright">zero</span>
        <span className={state.zero ? 'value-coral' : 'value-teal'}>{String(state.zero)}</span>
        <span className="sep">—</span>
        <span className="value-bright">carry</span>
        <span className={state.carry ? 'value-coral' : 'value-teal'}>{String(state.carry)}</span>
      </div>
    </div>
  )
}

export default CoutureTrace
