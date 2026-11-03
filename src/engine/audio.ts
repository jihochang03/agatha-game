/* 장면 BGM(퍼블릭 도메인/CC0 녹음, public/assets/bgm) + WebAudio로 합성한 빗소리.
 * 브라우저 정책상 사용자 제스처(start) 이후에만 재생된다. */
export type TrackId = 'storm' | 'hotel' | 'ink' | 'night' | 'morning'

const SRC = (id: TrackId) => `${import.meta.env.BASE_URL}assets/bgm/${id}.mp3`
/** 배경 → 곡. 대사의 분위기(폭우, 호텔, 원고, 와인, 아침)에 맞춘다. */
const BG_TRACK: Record<string, TrackId> = { storm: 'storm', room: 'hotel', hall: 'hotel', study: 'ink', wine: 'night', morning: 'morning' }

class AudioEngine {
  private volume = 0.5
  private muted = false
  private duck = 1
  private started = false
  private wanted: TrackId | null = null
  private cur: { id: TrackId; el: HTMLAudioElement } | null = null
  private ctx: AudioContext | null = null
  private rainGain: GainNode | null = null
  private rainWanted = false
  private timer: number | null = null

  private target() { return this.muted ? 0 : this.volume * 0.7 * this.duck }

  configure(volume: number, muted: boolean) {
    this.volume = volume
    this.muted = muted
    this.apply()
  }

  private apply() {
    if (this.cur) this.cur.el.volume = Math.min(1, this.target())
    if (this.ctx && this.rainGain) this.rainGain.gain.setTargetAtTime(this.rainWanted && !this.muted ? this.volume * 0.5 : 0, this.ctx.currentTime, 0.8)
  }

  start() {
    if (this.started) { void this.ctx?.resume(); return }
    this.started = true
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
      const ctx = this.ctx
      const len = ctx.sampleRate * 3
      const buf = ctx.createBuffer(2, len, ctx.sampleRate)
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.06 * w) / 1.06; d[i] = w * 0.55 + last * 3 } }
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000
      this.rainGain = ctx.createGain(); this.rainGain.gain.value = 0
      src.connect(hp).connect(lp).connect(this.rainGain).connect(ctx.destination)
      src.start()
    } catch { /* 오디오 컨텍스트를 만들 수 없는 환경 */ }
    if (this.wanted) this.play(this.wanted)
    this.apply()
  }

  /** 노드 진입 시 호출: 배경에 맞는 곡으로 크로스페이드, 폭우면 빗소리, horror 면 음악을 낮춘다. */
  scene(bg: string | undefined, fx: string[] | undefined) {
    this.duck = fx?.includes('horror') ? 0.4 : 1
    this.rainWanted = bg === 'storm'
    const t = bg ? BG_TRACK[bg] : undefined
    if (t) this.wanted = t
    if (this.started && this.wanted && this.wanted !== this.cur?.id) this.play(this.wanted)
    this.apply()
  }

  private play(id: TrackId) {
    const old = this.cur
    const el = new Audio(SRC(id))
    el.loop = true
    el.volume = 0
    this.cur = { id, el }
    void el.play().catch(() => { /* 자동재생 차단 시 다음 제스처에서 재시도 */ })
    const t0 = performance.now()
    if (this.timer) window.clearInterval(this.timer)
    this.timer = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / 2200)
      el.volume = Math.min(1, this.target() * k)
      if (old) old.el.volume = Math.max(0, old.el.volume * (1 - k))
      if (k >= 1) { old?.el.pause(); if (this.timer) window.clearInterval(this.timer); this.timer = null }
    }, 60)
  }
}

export const audio = new AudioEngine()
