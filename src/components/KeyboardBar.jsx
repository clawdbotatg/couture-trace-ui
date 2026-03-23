import './KeyboardBar.css'

const SHORTCUTS = [
  { key: 'q', action: 'quit' },
  { key: 'space', action: 'pause' },
  { key: 'n', action: 'step' },
  { key: '1-4', action: 'view' },
  { key: 'p', action: 'attest' },
  { key: 'v', action: 'verify' },
  { key: '[/]', action: 'budget' },
  { key: 't', action: 'theme' },
  { key: '+/-', action: 'tempo' },
]

function KeyboardBar({ status }) {
  return (
    <div className="keyboard-bar">
      {SHORTCUTS.map(({ key, action }) => (
        <span key={key} className="kbd-item">
          <kbd className="kbd-key">{key}</kbd>
          <span className="kbd-action">{action}</span>
        </span>
      ))}
      <span className="kbd-item">
        <span className="kbd-action">status</span>
        <span className="kbd-status">{status}</span>
      </span>
    </div>
  )
}

export default KeyboardBar
