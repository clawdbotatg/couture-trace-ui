import './MemoryDressingRoom.css'

function MemoryDressingRoom({ state }) {
  const maxHeat = Math.max(...state.memory.map(m => m.heat), 1)
  const maxWrites = Math.max(...state.memory.map(m => m.writes), 1)

  return (
    <div className="memory-dressing-room">
      <div className="panel-title">Memory Dressing Room</div>

      <div className="mem-header">
        <span className="mem-col addr">addr</span>
        <span className="mem-col value-h">value</span>
        <span className="mem-col heat">heat</span>
        <span className="mem-col writes">writes</span>
      </div>

      <div className="mem-rows">
        {state.memory.map((cell) => {
          const heatPct = (cell.heat / maxHeat) * 100
          return (
            <div key={cell.addr} className="mem-row">
              <span className="mem-col addr value-amber">{cell.addr}</span>
              <span className="mem-col value-h value-bright">{cell.value}</span>
              <span className="mem-col heat">
                <div className="heat-bar">
                  <div
                    className="heat-fill"
                    style={{ width: `${heatPct}%` }}
                  />
                </div>
              </span>
              <span className="mem-col writes value-amber">{cell.writes}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MemoryDressingRoom
