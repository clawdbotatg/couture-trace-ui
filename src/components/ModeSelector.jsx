import './ModeSelector.css'

function ModeSelector({ active, onChange, modes }) {
  return (
    <div className="mode-selector">
      <span className="mode-label">Modes</span>
      <div className="mode-tabs">
        {modes.map((mode) => {
          const isActive = mode === active
          const key = mode.split(':')[0]
          return (
            <button
              key={mode}
              className={`mode-tab ${isActive ? 'active' : ''}`}
              onClick={() => onChange(mode)}
            >
              <span className="mode-key">{key}</span>
              <span className="mode-name">:{mode.split(':')[1]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ModeSelector
