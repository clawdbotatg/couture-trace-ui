import './LeadInstruction.css'

function LeadInstruction({ state }) {
  const { latestInstruction } = state
  return (
    <div className="lead-instruction">
      <div className="panel-title">Lead Instruction</div>

      <div className="lead-row">
        <span className="label">next cue</span>
        <span className="value-bright">{state.nextInstruction}</span>
      </div>
      <div className="lead-row">
        <span className="label">viewer</span>
        <span className="value-salmon">{state.viewer}</span>
      </div>
      <div className="lead-row">
        <span className="label">latest</span>
        <span className="value-coral">#{latestInstruction.num}</span>
        <span className="value-amber">{latestInstruction.layer}</span>
        <span className="value-bright">{latestInstruction.op}</span>
        <span className="value-bright">{latestInstruction.operand}</span>
        <span className="value-dim">pc {latestInstruction.pcFrom}→{latestInstruction.pcTo}</span>
        <span className="value-dim">acc {latestInstruction.accFrom}→{latestInstruction.accTo}</span>
      </div>
      <div className="lead-row">
        <span className="label">copy</span>
        <span className="value-amber">{state.copy}</span>
      </div>
    </div>
  )
}

export default LeadInstruction
