import './ModeSelector.css'

function ModeSelector({ active, onChange, modes }) {
  return (
    <div className="mode-selector">
      <span className="mode-label">MODES</span>
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
              {mode}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ModeSelector
