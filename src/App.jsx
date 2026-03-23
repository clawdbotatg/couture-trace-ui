import { useState, useEffect, useRef } from 'react'
import './App.css'
import CoutureTrace from './components/CoutureTrace'
import StageMonitor from './components/StageMonitor'
import ModeSelector from './components/ModeSelector'
import LeadInstruction from './components/LeadInstruction'
import Pulse from './components/Pulse'
import Registers from './components/Registers'
import SignalDrift from './components/SignalDrift'
import LayerSpotlight from './components/LayerSpotlight'
import LiveTrace from './components/LiveTrace'
import TempoTrail from './components/TempoTrail'
import HotCells from './components/HotCells'
import MemoryDressingRoom from './components/MemoryDressingRoom'
import MemoryStory from './components/MemoryStory'
import KeyboardBar from './components/KeyboardBar'

const MODES = ['1:Runway', '2:Atelier', '3:Backtrace', '4:Attestation']

const INITIAL_STATE = {
  pc: 6,
  acc: 2,
  zero: false,
  carry: false,
  halt: false,
  sp: 5,
  progress: 31,
  throughput: 28,
  status: 'RUNNING',
  theme: 'Velvet',
  stepMs: 30,
  memoryCells: 5,
  traceEvents: 20,
  proof: 'READY',
  nextInstruction: 'L1 LOAD 1',
  latestInstruction: { num: 20, layer: 'L0', op: 'STORE', operand: 2, pcFrom: 5, pcTo: 6, accFrom: 2, accTo: 2 },
  mood: 'lifting values into the spotlight',
  layersActive: 3,
  copy: 'stitching a fresh write into memory',
  viewer: 'Runway',
  spotlight: 'latest write hit cell 00',
  hottest: 'cell 02 with 4 writes',
  pressure: 70,
  texture: 'address history rendered straight from hull-backed memory',
  registers: { pc: 6, acc: 2, sp: 5 },
  flags: { zero: false, carry: false, halt: false },
  memory: [
    { addr: '00', value: 3, heat: 6, writes: 4 },
    { addr: '01', value: 3, heat: 2, writes: 3 },
    { addr: '02', value: 5, heat: 4, writes: 4 },
    { addr: '03', value: 3, heat: 2, writes: 3 },
    { addr: '04', value: 7, heat: 1, writes: 0 },
  ],
  trace: [
    { num: 20, layer: 'L0', op: 'STORE', operand: 2, pcFrom: 5, pcTo: 6, accFrom: 2, accTo: 2 },
    { num: 19, layer: 'L0', op: 'ADDM', operand: 1, pcFrom: 4, pcTo: 5, accFrom: 1, accTo: 2 },
    { num: 18, layer: 'L0', op: 'LOAD', operand: 0, pcFrom: 3, pcTo: 4, accFrom: -6, accTo: 1 },
    { num: 17, layer: 'L0', op: 'JZ', operand: 14, pcFrom: 2, pcTo: 3, accFrom: -6, accTo: -6 },
    { num: 16, layer: 'L0', op: 'SUBM', operand: 4, pcFrom: 1, pcTo: 2, accFrom: 1, accTo: -6 },
    { num: 15, layer: 'L0', op: 'LOAD', operand: 3, pcFrom: 0, pcTo: 1, accFrom: 1, accTo: 1 },
    { num: 14, layer: 'L2', op: 'JMP', operand: 0, pcFrom: 13, pcTo: 0, accFrom: 1, accTo: 1 },
  ],
  signalDrift: {
    acc: [-4, -8, -12, -16, -12, -8, -4, 0, 2, 4, 6, 8, 10, 8, 6, 4, 2, 4, 6, 8],
    pc: [2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 12, 12, 14, 14, 16, 16, 10, 10, 12, 12],
  },
  layers: [
    { name: 'L0', value: 12, color: 'coral' },
    { name: 'L1', value: 6, color: 'amber' },
    { name: 'L2', value: 2, color: 'yellow' },
  ],
  tempo: { current: 28, peak: 29 },
}

function App() {
  const [activeMode, setActiveMode] = useState('2:Atelier')
  const [vmState, setVmState] = useState(INITIAL_STATE)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVmState(prev => {
        const newAcc = prev.acc + Math.floor(Math.random() * 3) - 1
        const newPc = (prev.pc + 1) % 20
        const newTrace = [
          { num: prev.traceEvents + 1, layer: prev.layers[Math.floor(Math.random() * 3)].name, op: ['LOAD', 'STORE', 'ADDM', 'SUBM', 'JZ'][Math.floor(Math.random() * 5)], operand: Math.floor(Math.random() * 5), pcFrom: prev.pc, pcTo: newPc, accFrom: prev.acc, accTo: newAcc },
          ...prev.trace.slice(0, 6),
        ]
        const ops = ['LOAD', 'STORE', 'ADDM', 'SUBM', 'JZ']
        const layers = ['L0', 'L1', 'L2']
        const newMemory = prev.memory.map((m, i) => {
          if (Math.random() > 0.7) return { ...m, value: m.value + Math.floor(Math.random() * 3) - 1, writes: m.writes + (Math.random() > 0.5 ? 1 : 0) }
          return m
        })
        const accWave = [...prev.signalDrift.acc.slice(1), newAcc]
        const pcWave = [...prev.signalDrift.pc.slice(1), newPc]
        return {
          ...prev,
          pc: newPc,
          acc: newAcc,
          trace: newTrace,
          traceEvents: prev.traceEvents + 1,
          progress: Math.min(100, prev.progress + 0.5),
          throughput: 27 + Math.floor(Math.random() * 3),
          nextInstruction: `${layers[Math.floor(Math.random() * 3)]} ${ops[Math.floor(Math.random() * ops.length)]} ${Math.floor(Math.random() * 5)}`,
          memory: newMemory,
          latestInstruction: newTrace[0],
          signalDrift: { acc: accWave, pc: pcWave },
          tempo: { ...prev.tempo, current: 27 + Math.floor(Math.random() * 4) },
        }
      })
    }, 500)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="app" data-mode={activeMode.split(':')[0]}>
      <div className="dashboard">
        <div className="panel header-panel">
          <CoutureTrace state={vmState} />
        </div>
        <div className="panel stage-panel">
          <StageMonitor state={vmState} />
        </div>
        <div className="panel modes-panel">
          <ModeSelector active={activeMode} onChange={setActiveMode} modes={MODES} />
        </div>
        <div className="panel lead-panel">
          <LeadInstruction state={vmState} />
        </div>
        <div className="panel pulse-panel">
          <Pulse state={vmState} />
        </div>
        <div className="panel registers-panel">
          <Registers state={vmState} />
        </div>
        <div className="panel memory-panel">
          <MemoryDressingRoom state={vmState} />
        </div>
        <div className="panel hotcells-panel">
          <HotCells state={vmState} />
        </div>
        <div className="panel signal-panel">
          <SignalDrift state={vmState} />
        </div>
        <div className="panel tempo-panel">
          <TempoTrail state={vmState} />
        </div>
        <div className="panel layer-panel">
          <LayerSpotlight state={vmState} />
        </div>
        <div className="panel story-panel">
          <MemoryStory state={vmState} />
        </div>
        <div className="panel trace-panel">
          <LiveTrace state={vmState} />
        </div>
        <div className="panel keyboard-panel">
          <KeyboardBar status={vmState.status} />
        </div>
      </div>
    </div>
  )
}

export default App
