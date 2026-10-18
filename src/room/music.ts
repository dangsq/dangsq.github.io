// Original 8-bit dreamcore theme with a 16-bar arc: arrival, pulse, lift, release.
// No audio context is created until the visitor clicks the speaker.
export const MUSIC_BEAT_SECONDS = 60 / 112
export const MUSIC_BAR_SECONDS = MUSIC_BEAT_SECONDS * 4

export async function startBackgroundMusic(): Promise<{ stop: () => void }> {
  const context = new AudioContext()
  try {
    await context.resume()
  } catch (error) {
    void context.close()
    throw error
  }

  const limiter = context.createDynamicsCompressor()
  limiter.threshold.value = -12
  limiter.ratio.value = 3
  limiter.connect(context.destination)
  const master = context.createGain()
  master.gain.value = 0.34
  master.connect(limiter)

  const leadFilter = context.createBiquadFilter()
  leadFilter.type = 'lowpass'
  leadFilter.frequency.value = 2200
  leadFilter.connect(master)

  const padFilter = context.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = 1150
  padFilter.connect(master)

  const echo = context.createDelay(0.6)
  echo.delayTime.value = MUSIC_BEAT_SECONDS * 0.75
  const echoGain = context.createGain()
  echoGain.gain.value = 0.2
  echo.connect(echoGain)
  echoGain.connect(master)

  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.22), context.sampleRate)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1

  const chords = [
    [185.00, 220.00, 277.18, 329.63], // F#m7
    [146.83, 185.00, 220.00, 277.18], // Dmaj7
    [164.81, 220.00, 246.94, 329.63], // Aadd9
    [164.81, 207.65, 246.94, 311.13], // Emaj7
  ]
  // Each section tells the same small motif with a different intensity.
  const motifs = [
    [[2, -1, -1, 3, -1, -1, 1, -1], [2, -1, 1, -1, 3, -1, -1, -1],
      [1, -1, -1, 2, -1, 3, -1, -1], [2, -1, 1, -1, 0, -1, -1, -1]],
    [[2, -1, 3, 2, -1, 1, 2, -1], [2, 1, -1, 2, 3, -1, 2, 1],
      [1, -1, 2, 3, -1, 2, 1, -1], [2, -1, 3, 2, 1, -1, 0, -1]],
    [[2, 3, 2, 1, 3, 2, 1, 0], [2, 1, 2, 3, 2, 1, 0, 1],
      [1, 2, 3, 2, 1, 3, 2, 1], [2, 3, 2, 1, 0, 1, 2, -1]],
    [[3, -1, 2, -1, 1, -1, 0, -1], [2, -1, 1, -1, 0, -1, -1, -1],
      [2, -1, -1, 1, -1, -1, 0, -1], [1, -1, -1, 0, -1, -1, -1, -1]],
  ]

  const oscillatorNote = (
    frequency: number, at: number, duration: number, volume: number,
    type: OscillatorType, destination: AudioNode, attack = 0.012,
  ) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, at)
    envelope.gain.setValueAtTime(0.0001, at)
    envelope.gain.exponentialRampToValueAtTime(volume, at + attack)
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    oscillator.connect(envelope)
    envelope.connect(destination)
    oscillator.start(at)
    oscillator.stop(at + duration + 0.02)
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect() }
  }

  const kick = (at: number, volume: number) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(135, at)
    oscillator.frequency.exponentialRampToValueAtTime(48, at + 0.16)
    envelope.gain.setValueAtTime(volume, at)
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + 0.21)
    oscillator.connect(envelope)
    envelope.connect(master)
    oscillator.start(at)
    oscillator.stop(at + 0.22)
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect() }
  }

  const noiseHit = (at: number, volume: number, cutoff: number, duration: number) => {
    const source = context.createBufferSource()
    source.buffer = noise
    const filter = context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = cutoff
    const envelope = context.createGain()
    envelope.gain.setValueAtTime(volume, at)
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    source.connect(filter)
    filter.connect(envelope)
    envelope.connect(master)
    source.start(at)
    source.stop(at + duration + 0.01)
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect() }
  }

  const halfBeat = MUSIC_BEAT_SECONDS / 2
  let nextTime = context.currentTime + 0.06
  let step = 0
  let stopped = false

  const schedule = () => {
    while (nextTime < context.currentTime + 0.35) {
      const bar = Math.floor(step / 8) % 16
      const section = Math.floor(bar / 4)
      const chordIndex = bar % 4
      const slot = step % 8
      const chord = chords[chordIndex]

      if (slot === 0) {
        chord.forEach((frequency) =>
          oscillatorNote(frequency, nextTime, MUSIC_BAR_SECONDS * 0.94, section === 2 ? 0.033 : 0.026, 'triangle', padFilter, 0.3))
      }
      if (slot === 0 || (section >= 1 && slot === 4)) {
        oscillatorNote(chord[0] / 2, nextTime, MUSIC_BEAT_SECONDS * 1.6, section === 2 ? 0.15 : 0.1, 'triangle', master, 0.025)
      }
      if (section >= 1) {
        if (slot === 0 || slot === 4 || (section === 2 && slot === 6)) kick(nextTime, section === 2 ? 0.24 : 0.18)
        if (slot === 2 || slot === 6) noiseHit(nextTime, section === 2 ? 0.12 : 0.075, 1200, 0.11)
        if (section === 2 || slot % 2 === 1) noiseHit(nextTime, 0.03, 5500, 0.045)
      }

      const note = motifs[section][chordIndex][slot]
      if (note >= 0) {
        const frequency = chord[note] * (section === 2 ? 4 : 2)
        oscillatorNote(frequency, nextTime, halfBeat * (section === 2 ? 0.85 : 1.3),
          section === 2 ? 0.095 : section === 1 ? 0.082 : 0.065, 'square', leadFilter)
        oscillatorNote(frequency / 2, nextTime, halfBeat * 1.4, 0.028, 'sine', echo)
      }
      nextTime += halfBeat
      step++
    }
  }

  schedule()
  const timer = window.setInterval(schedule, 80)
  return {
    stop: () => {
      if (stopped) return
      stopped = true
      window.clearInterval(timer)
      master.gain.setTargetAtTime(0.0001, context.currentTime, 0.13)
      window.setTimeout(() => { void context.close() }, 650)
    },
  }
}
