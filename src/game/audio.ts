// All sound is synthesized with the Web Audio API — no audio files ship with the game.
let ctx: AudioContext | null = null
let master: GainNode | null = null
let muted = false
let drone: { stop: () => void } | null = null

function ac() {
  if (!ctx) {
    try {
      const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new C()
      master = ctx.createGain()
      master.gain.value = muted ? 0 : 0.5
      master.connect(ctx.destination)
    } catch {
      return null
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.2, when = 0, slideTo?: number) {
  const c = ac()
  if (!c || !master) return
  const t = c.currentTime + when
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(master)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function noise(dur: number, vol = 0.08, hp = 1200) {
  const c = ac()
  if (!c || !master) return
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'highpass'
  f.frequency.value = hp
  const g = c.createGain()
  g.gain.value = vol
  src.connect(f).connect(g).connect(master)
  src.start()
}

export const sfx = {
  unlock: () => ac(),
  setMuted(m: boolean) {
    muted = m
    if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.5, ctx.currentTime, 0.05)
  },
  click: () => noise(0.03, 0.12, 2400),
  key: () => noise(0.02, 0.05 + Math.random() * 0.04, 3000),
  open: () => { tone(520, 0.08, 'triangle', 0.12); tone(780, 0.1, 'triangle', 0.08, 0.05) },
  close: () => tone(600, 0.12, 'triangle', 0.1, 0, 300),
  notify: () => { tone(880, 0.12, 'sine', 0.15); tone(1320, 0.18, 'sine', 0.1, 0.09) },
  error: () => { tone(160, 0.18, 'square', 0.07); tone(120, 0.22, 'square', 0.07, 0.1) },
  success: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, 'triangle', 0.12, i * 0.08)),
  glitch: () => { noise(0.25, 0.14, 400); tone(90, 0.3, 'sawtooth', 0.05, 0, 40) },
  boot: () => { tone(110, 1.2, 'sawtooth', 0.04, 0, 220); tone(220, 0.9, 'sine', 0.08, 0.6); tone(330, 1.2, 'sine', 0.06, 0.9) },
  startDrone() {
    const c = ac()
    if (!c || !master || drone) return
    const g = c.createGain()
    g.gain.value = 0.0001
    g.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 3)
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 380
    const oscs = [55, 55.4, 82.6].map((f) => {
      const o = c.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = f
      o.connect(lp)
      o.start()
      return o
    })
    const lfo = c.createOscillator()
    const lfoG = c.createGain()
    lfo.frequency.value = 0.07
    lfoG.gain.value = 160
    lfo.connect(lfoG).connect(lp.frequency)
    lfo.start()
    lp.connect(g).connect(master)
    drone = {
      stop() {
        g.gain.setTargetAtTime(0.0001, c.currentTime, 0.4)
        setTimeout(() => { oscs.forEach((o) => o.stop()); lfo.stop() }, 1500)
      },
    }
  },
  stopDrone() {
    drone?.stop()
    drone = null
  },
}
