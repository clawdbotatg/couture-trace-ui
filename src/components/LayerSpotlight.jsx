import './LayerSpotlight.css'

const LAYER_CHARS = {
  coral:  { bar: '▓', num: '░', color: '#f87171' },
  amber:  { bar: '▓', num: '░', color: '#fbbf24' },
  yellow: { bar: '▒', num: '░', color: '#facc15' },
}

function LayerSpotlight({ state }) {
  const maxVal = Math.max(...state.layers.map(l => l.value))

  return (
    <div className="layer-spotlight">
      <div className="panel-title">Layer Spotlight</div>

      <div className="layer-rows">
        {state.layers.map((layer) => {
          const heightPct = (layer.value / maxVal)
          const W = 16
          const filled = Math.round(heightPct * W)
          const cfg = LAYER_CHARS[layer.color]
          const barStr = cfg.bar.repeat(filled) + cfg.num.repeat(W - filled)
          return (
            <div key={layer.name} className="layer-row">
              <span className="layer-name">{layer.name}</span>
              <span className="layer-bar-chars" style={{ color: cfg.color, letterSpacing: '-0.5px' }}>
                {barStr}
              </span>
              <span className="badge badge-teal">{layer.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LayerSpotlight
