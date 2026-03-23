import './LayerSpotlight.css'

const LAYER_COLORS = {
  coral: '#FF6B6B',
  amber: '#F2A65A',
  yellow: '#F0D060',
}

function LayerSpotlight({ state }) {
  const maxVal = Math.max(...state.layers.map((l) => l.value))

  return (
    <div className="layer-spotlight">
      <div className="panel-title">Layer Spotlight</div>

      <div className="layer-bars">
        {state.layers.map((layer) => {
          const heightPct = (layer.value / maxVal) * 100
          const color = LAYER_COLORS[layer.color]
          return (
            <div key={layer.name} className="layer-col">
              <span className="badge badge-teal" style={{ fontSize: '11px', marginBottom: '4px' }}>
                {layer.value}
              </span>
              <div className="layer-bar-bg">
                <div
                  className="layer-bar"
                  style={{ height: `${heightPct}%`, background: color }}
                />
              </div>
              <span className="layer-name">{layer.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LayerSpotlight
