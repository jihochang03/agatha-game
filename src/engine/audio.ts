/* WebAudio로 합성하는 분위기 사운드. 외부 음원 없이 동작한다. 사용자 제스처 이후에만 시작. */
type Mode = 'normal' | 'warm' | 'horror'

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private pad: GainNode | null = null
  private oscs: OscillatorNode[] = []
  private mode: Mode = 'normal'
  private volume = 0.5
  private muted = false

  configure(volume: number, muted: boolean) {
    this.volume = volume
    this.muted = muted
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(muted ? 0 : volume * 0.5, this.ctx.currentTime, 0.1)
  }

  start() {
    if (this.ctx) { void this.ctx.resume(); return }
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
    } catch { return }
    const ctx = this.ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : this.volume * 0.5
    this.master.connect(ctx.destination)
    this.pad = ctx.createGain()
    this.pad.gain.value = 0.35
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 420
    this.pad.connect(lp).connect(this.master)
    for (const f of [55, 82.4, 110.3, 164.8]) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = 0.18
      o.connect(g).connect(this.pad)
      o.start()
      this.oscs.push(o)
    }
    window.setInterval(() => this.tick(), 1000)
    this.setMode(this.mode)
  }

  private tick() {
    if (!this.ctx || !this.master) return
    const ctx = this.ctx
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'square'
    o.frequency.value = this.mode === 'horror' ? 1400 : 900
    g.gain.setValueAtTime(this.mode === 'horror' ? 0.35 : 0.06, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06)
    o.connect(g).connect(this.master)
    o.start()
    o.stop(ctx.currentTime + 0.08)
  }

  /** horror: 배경음을 지우고 시계 소리만 남긴다. warm: 화음이 따뜻해진다. */
  setMode(mode: Mode) {
    this.mode = mode
    if (!this.ctx || !this.pad) return
    const t = this.ctx.currentTime
    this.pad.gain.setTargetAtTime(mode === 'horror' ? 0 : mode === 'warm' ? 0.5 : 0.35, t, 0.6)
    const base = mode === 'warm' ? [65.4, 98, 130.8, 196] : [55, 82.4, 110.3, 164.8]
    this.oscs.forEach((o, i) => o.frequency.setTargetAtTime(base[i], t, 1.2))
  }
}

export const audio = new AudioEngine()
