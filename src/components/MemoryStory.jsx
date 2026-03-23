import './MemoryStory.css'

function MemoryStory({ state }) {
  return (
    <div className="memory-story">
      <div className="panel-title">Memory Story</div>
      <div className="story-rows">
        <div className="story-row">
          <span className="label">spotlight</span>
          <span className="value-bright">{state.spotlight}</span>
        </div>
        <div className="story-row">
          <span className="label">hottest</span>
          <span className="value-teal">{state.hottest}</span>
        </div>
        <div className="story-row">
          <span className="label">pressure</span>
          <span className="value-yellow">{state.pressure}%</span>
        </div>
        <div className="story-row">
          <span className="label">texture</span>
          <span className="value-dim" style={{ fontSize: '11px' }}>{state.texture}</span>
        </div>
      </div>
    </div>
  )
}

export default MemoryStory
