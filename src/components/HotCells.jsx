import './HotCells.css'

function HotCells({ state }) {
  const maxWrites = Math.max(...state.memory.map(m => m.writes), 1)

  return (
    <div className="hot-cells">
      <div className="panel-title">Hot Cells</div>
      <div className="hotcells-bars">
        {state.memory.map((cell) => {
          const heightPct = (cell.writes / maxWrites) * 100
          const isZero = cell.writes === 0
          return (
            <div key={cell.addr} className="hotcell-col">
              <span className="hotcell-val">{cell.writes}</span>
              <div className="hotcell-bar-bg">
                <div
                  className="hotcell-bar"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    background: isZero ? '#F2A65A' : '#5BC9A0',
                  }}
                />
              </div>
              <span className="hotcell-addr">{cell.addr}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HotCells
