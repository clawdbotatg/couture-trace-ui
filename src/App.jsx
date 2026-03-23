import { useState, useEffect } from 'react'
import './App.css'
import TermCanvas from './components/TermCanvas'

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
    { num: 20, layer: 'L0', op: 'LOAD',   operand: 3, pcFrom: 5, pcTo: 6, accFrom: 1, accTo: 1 },
    { num: 19, layer: 'L2', op: 'JMP',    operand: 0, pcFrom: 13, pcTo: 5, accFrom: 1, accTo: 1 },
    { num: 18, layer: 'L0', op: 'ADDM',   operand: 1, pcFrom: 4, pcTo: 5, accFrom: 0, accTo: 1 },
    { num: 17, layer: 'L1', op: 'STORE',  operand: 2, pcFrom: 3, pcTo: 4, accFrom: -1, accTo: 0 },
    { num: 16, layer: 'L0', op: 'LOAD',   operand: 1, pcFrom: 2, pcTo: 3, accFrom: -1, accTo: -1 },
  ],
  signalDrift: {
    acc: [-4, -8, -12, -16, -12, -8, -4, 0, 2, 4, 6, 8, 10, 8, 6, 4, 2, 4, 6, 8],
    pc:  [ 2,  2,  4,  4,  6,  6,  8,  8, 10, 10, 12, 12, 14, 14, 16, 16, 10, 10, 12, 12],
  },
  layers: [
    { name: 'L0', value: 12, color: 'coral' },
    { name: 'L1', value:  6, color: 'amber' },
    { name: 'L2', value:  2, color: 'teal' },
  ],
  tempo: { current: 28, peak: 29 },
}

const VIEWERS = { 1: 'Runway', 2: 'Atelier', 3: 'Backtrace', 4: 'Attestation' }

export default function App() {
  const [vm, setVm] = useState(INIT)

  useEffect(() => {
    const id = setInterval(() => {
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
        const viewer = VIEWERS[prev.viewer === 'Atelier' ? 2 : prev.viewer === 'Runway' ? 1 : prev.viewer === 'Backtrace' ? 3 : 4] || 'Atelier'
        return {
          ...prev,
          pc: newPc, acc: newAcc,
          trace: [newEntry, ...prev.trace.slice(0, 9)],
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
    return () => clearInterval(id)
  }, [])

  return (
    <div className="term-app">
      <div className="term-window">
        <div className="term-titlebar">
          <div className="tl-dots"><span className="tl-dot red" /><span className="tl-dot yellow" /><span className="tl-dot green" /></div>
          <div className="tl-title">couture-trace — transformer vm</div>
        </div>
        <div className="term-body">
          <TermCanvas vm={vm} />
        </div>
      </div>
    </div>
  )
}
