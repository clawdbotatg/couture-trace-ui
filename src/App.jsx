import { useState, useEffect, useRef } from 'react'
import './App.css'
import CoutureTrace from './components/CoutureTrace'
import StageMonitor from './components/StageMonitor'
import ModeSelector from './components/ModeSelector'
import LeadInstruction from './components/LeadInstruction'
import Pulse from './components/Pulse'
import SignalDrift from './components/SignalDrift'
import LayerSpotlight from './components/LayerSpotlight'
import LiveTrace from './components/LiveTrace'
import MemoryDressingRoom from './components/MemoryDressingRoom'
import HotCells from './components/HotCells'
import MemoryStory from './components/MemoryStory'
import Registers from './components/Registers'
import KeyboardBar from './components/KeyboardBar'
import TempoTrail from './components/TempoTrail'

const MODES = ['1:Runway', '2:Atelier', '3:Backtrace', '4:Attestation']

const INIT = {
  pc: 6, acc: 2, zero: false, carry: false, halt: false, sp: 5,
  progress: 34, throughput: 28, status: 'RUNNING', theme: 'Velvet',
  stepMs: 30, memoryCells: 5, traceEvents: 25, proof: 'READY',
  nextInstruction: 'L2 STORE 1', layersActive: 3,
  mood: 'lifting values into the spotlight', copy: 'stitching a fresh write into memory',
  viewer: 'Atelier', spotlight: 'latest write hit cell 00',
  hottest: 'cell 02 with 4 writes', pressure: 70,
  texture: 'address history rendered straight from hull-backed memory',
  registers: { pc: 6, acc: 2, sp: 5 },
  flags: { zero: false, carry: false, halt: false },
  latestInstruction: { num: 25, layer: 'L1', op: 'STORE', operand: 2, pcFrom: 10, pcTo: 11, accFrom: 0, accTo: 1 },
  memory: [
    { addr: '00', value: 3, heat: 6, writes: 4 },
    { addr: '01', value: 3, heat: 2, writes: 3 },
    { addr: '02', value: 5, heat: 4, writes: 4 },
    { addr: '03', value: 3, heat: 2, writes: 3 },
    { addr: '04', value: 7, heat: 1, writes: 0 },
  ],
  trace: [
    { num: 25, layer: 'L1', op: 'STORE', operand: 2, pcFrom: 10, pcTo: 11, accFrom: 0, accTo: 1 },
    { num: 24, layer: 'L2', op: 'STORE', operand: 3, pcFrom: 9, pcTo: 10, accFrom: 1, accTo: 0 },
    { num: 23, layer: 'L1', op: 'LOAD',  operand: 3, pcFrom: 8, pcTo: 9, accFrom: 0, accTo: 1 },
    { num: 22, layer: 'L0', op: 'JZ',    operand: 14, pcFrom: 7, pcTo: 8, accFrom: -6, accTo: -6 },
    { num: 21, layer: 'L0', op: 'SUBM',  operand: 4, pcFrom: 6, pcTo: 7, accFrom: 1, accTo: -6 },
    { num: 20, layer: 'L0', op: 'LOAD',  operand: 3, pcFrom: 5, pcTo: 6, accFrom: 1, accTo: 1 },
    { num: 19, layer: 'L2', op: 'JMP',   operand: 0, pcFrom: 13, pcTo: 5, accFrom: 1, accTo: 1 },
  ],
  signalDrift: {
    acc: [-4, -8, -12, -16, -12, -8, -4, 0, 2, 4, 6, 8, 10, 8, 6, 4, 2, 4, 6, 8],
    pc:  [ 2,  2,  4,  4,  6,  6,  8,  8, 10, 10, 12, 12, 14, 14, 16, 16, 10, 10, 12, 12],
  },
  layers: [
    { name: 'L0', value: 12, color: 'coral' },
    { name: 'L1', value:  6, color: 'amber' },
    { name: 'L2', value:  2, color: 'yellow' },
  ],
  tempo: { current: 28, peak: 29 },
}

export default function App() {
  const [activeMode, setActiveMode] = useState('2:Atelier')
  const [vm, setVm] = useState(INIT)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVm(prev => {
        const newAcc = Math.max(-16, Math.min(16, prev.acc + Math.floor(Math.random() * 3) - 1))
        const newPc  = (prev.pc + 1) % 20
        const ops    = ['LOAD', 'STORE', 'ADDM', 'SUBM', 'JZ']
        const layrs  = ['L0', 'L1', 'L2']
        const op     = ops[Math.floor(Math.random() * ops.length)]
        const layer  = layrs[Math.floor(Math.random() * layrs.length)]
        const newEntry = {
          num: prev.traceEvents + 1, layer, op,
          operand: Math.floor(Math.random() * 5),
          pcFrom: prev.pc, pcTo: newPc,
          accFrom: prev.acc, accTo: newAcc,
        }
        return {
          ...prev,
          pc: newPc, acc: newAcc,
          trace: [newEntry, ...prev.trace.slice(0, 6)],
          traceEvents: prev.traceEvents + 1,
          progress: Math.min(100, prev.progress + 0.3),
          throughput: 27 + Math.floor(Math.random() * 4),
          nextInstruction: `${layer} ${ops[Math.floor(Math.random() * ops.length)]} ${Math.floor(Math.random() * 5)}`,
          latestInstruction: newEntry,
          memory: prev.memory.map(m =>
            Math.random() > 0.7
              ? { ...m, value: Math.max(-99, Math.min(99, m.value + Math.floor(Math.random() * 5) - 2)), writes: m.writes + (Math.random() > 0.6 ? 1 : 0) }
              : m
          ),
          signalDrift: {
            acc: [...prev.signalDrift.acc.slice(1), newAcc],
            pc:  [...prev.signalDrift.pc.slice(1), newPc],
          },
          tempo: { ...prev.tempo, current: 27 + Math.floor(Math.random() * 4) },
        }
      })
    }, 600)
    return () => clearInterval(timerRef.current)
  }, [])

  const modeNum  = activeMode.split(':')[0]
  const viewer   = modeNum === '1' ? 'Runway' : modeNum === '2' ? 'Atelier' : modeNum === '3' ? 'Backtrace' : 'Attestation'
  const headerState = { ...vm, viewer }

  return (
    <div className="terminal-window">
      {/* Title bar */}
      <div className="titlebar">
        <div className="traffic-lights">
          <div className="traffic-light red" />
          <div className="traffic-light yellow" />
          <div className="traffic-light green" />
        </div>
        <div className="titlebar-title">couture-trace — transformer vm</div>
        <div className="titlebar-dots" />
      </div>

      {/* Terminal body */}
      <div className="terminal-body">
        <div className="app" data-mode={modeNum}>
          <div className="dashboard">

            {/* ROW 1: header + stage */}
            <div className="row1">
              <div className="row1-left  panel"><CoutureTrace state={headerState} /></div>
              <div className="row1-right panel"><StageMonitor state={vm} /></div>
            </div>

            {/* ROW 2: modes */}
            <div className="row2 panel">
              <ModeSelector active={activeMode} onChange={setActiveMode} modes={MODES} />
            </div>

            {/* ROW 3: lead + right column */}
            <div className="row3">
              <div className="row3-left  panel"><LeadInstruction state={headerState} /></div>
              <div className="row3-right">
                <div className="panel"><Pulse state={vm} /></div>
                <div className="panel story-panel"><MemoryStory state={vm} /></div>
              </div>
            </div>

            {/* ROW 4: signal/memory + registers/layer/tempo */}
            <div className="row4">
              <div className="row4-left">
                <div className="panel signal-panel"><SignalDrift state={vm} /></div>
                <div className="panel memory-panel"><MemoryDressingRoom state={vm} /></div>
                <div className="panel hotcells-panel"><HotCells state={vm} /></div>
              </div>
              <div className="row4-right">
                <div className="panel registers-panel"><Registers state={vm} /></div>
                <div className="panel layer-panel"><LayerSpotlight state={vm} /></div>
                <div className="panel tempo-panel"><TempoTrail state={vm} /></div>
              </div>
            </div>

            {/* ROW 5: live trace */}
            <div className="row5 panel"><LiveTrace state={vm} /></div>

            {/* ROW 6: keyboard */}
            <div className="row6 panel"><KeyboardBar status={vm.status} /></div>

          </div>
        </div>
      </div>
    </div>
  )
}
