import './LiveTrace.css'

function LiveTrace({ state }) {
  return (
    <div className="live-trace">
      <div className="panel-title">Live Trace</div>
      <div className="trace-list">
        {state.trace.map((entry) => (
          <div key={entry.num} className="trace-entry">
            <div className="trace-instr-line">
              <span className="trace-num">#{String(entry.num).padStart(3, '0')}</span>
              <span className={`trace-layer trace-layer-${entry.layer.toLowerCase()}`}>{entry.layer}</span>
              <span className="trace-op">{entry.op}</span>
              <span className="trace-operand">{entry.operand}</span>
            </div>
            <div className="trace-state-line">
              <span className="trace-indent" />
              <span className="trace-dim">pc {entry.pcFrom}→{entry.pcTo}</span>
              <span className="trace-dot">·</span>
              <span className="trace-dim">acc {entry.accFrom}→{entry.accTo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LiveTrace
