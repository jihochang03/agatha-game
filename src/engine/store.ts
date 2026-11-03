import { create } from 'zustand'
import type { RouteId, StoryNode } from './types'
import { ROUTES } from './types'
import { STORY, START_NODE, TRUTH_NODE } from '../data/story'
import { ENDING_BY_ID } from '../data/endings'
import { DEDUCTIONS, LOCATIONS, MASKS } from '../data/world'
import {
  applyChoice, applyNodeGrants, choiceAvailable, emptyProgress, eventGateOk, resolveNext, tryCombine, type Progress,
} from './logic'
import { audio } from './audio'

export type Screen = 'title' | 'story' | 'gate' | 'ending' | 'gallery' | 'records' | 'settings' | 'saves'
export interface LogLine { speaker: string; text: string; node: string }
export interface Meta { endings: string[]; routesDone: RouteId[]; masks: string[]; romance: string[]; plays: number; truthPlays: number }
export interface Settings { volume: number; muted: boolean; textSpeed: 'slow' | 'normal' | 'instant'; auto: boolean }
export interface SaveData { nodeId: string; progress: Progress; log: LogLine[]; corridor: number; truth: boolean; chapter: string; time: number }

const K = { meta: 'labyrinth.meta.v1', settings: 'labyrinth.settings.v1', saves: 'labyrinth.saves.v1' }
function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? { ...fallback, ...JSON.parse(s) } : fallback } catch { return fallback }
}
function store(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* 저장 불가 환경 */ } }

const defaultMeta: Meta = { endings: [], routesDone: [], masks: [], romance: [], plays: 0, truthPlays: 0 }
const defaultSettings: Settings = { volume: 0.5, muted: false, textSpeed: 'normal', auto: false }
type SaveBook = { auto: SaveData | null; slots: (SaveData | null)[] }
const defaultSaves: SaveBook = { auto: null, slots: [null, null, null] }

export interface GameState {
  screen: Screen
  nodeId: string
  progress: Progress
  log: LogLine[]
  corridor: number
  truth: boolean
  endingId: string | null
  meta: Meta
  settings: Settings
  saves: SaveBook
  toast: string | null
  overlay: null | 'log' | 'menu' | 'manuscript' | 'masks' | 'board'
  prevBg: string | undefined

  setScreen: (s: Screen) => void
  setOverlay: (o: GameState['overlay']) => void
  newGame: () => void
  startTruth: () => void
  continueGame: () => boolean
  advance: () => void
  choose: (i: number) => void
  investigate: (evidence?: string) => void
  combine: (a: string, b: string) => { ok: boolean; id?: string; already?: boolean }
  leaveGate: () => void
  saveSlot: (i: number) => void
  loadSlot: (i: number | 'auto') => boolean
  setSettings: (s: Partial<Settings>) => void
  showToast: (t: string) => void
  truthUnlocked: () => boolean
  routeOfNode: () => RouteId | null
  resetAll: () => void
}

export const useGame = create<GameState>((set, get) => {
  /** 노드에 진입: 보상 적용, 이벤트 처리, 필요한 자동 진행. */
  function enter(id: string, restore = false) {
    const n: StoryNode | undefined = STORY[id]
    if (!n) { console.error('존재하지 않는 노드', id); set({ screen: 'title' }); return }
    const st = get()
    let progress = restore ? st.progress : applyNodeGrants(st.progress, n)
    let meta = st.meta
    let toast: string | null = null
    const ev = n.event
    if (!restore && ev) {
      if (ev.type === 'unlockMask' && !meta.masks.includes(ev.mask)) {
        meta = { ...meta, masks: [...meta.masks, ev.mask] }
        toast = '「로이의 가면」에 새 단서가 기록되었다'
      }
      if (ev.type === 'romance') {
        const key = `${ev.route}${ev.n}`
        if (!meta.romance.includes(key)) meta = { ...meta, romance: [...meta.romance, key] }
      }
      if (ev.type === 'ending') {
        const e = ENDING_BY_ID[ev.id]
        const endings = meta.endings.includes(ev.id) ? meta.endings : [...meta.endings, ev.id]
        const routesDone = e.route !== 'truth' && e.route !== 'hidden' && !meta.routesDone.includes(e.route) ? [...meta.routesDone, e.route] : meta.routesDone
        meta = { ...meta, endings, routesDone }
        if (routesDone.length === 4 && meta.routesDone.length < 4) toast = '다섯 번째 문이 열렸다 — 타이틀에서 확인하세요'
      }
    }
    if (meta !== st.meta) store(K.meta, meta)
    const bg = n.background
    const corridor = !restore && bg === 'corridor' && st.prevBg !== 'corridor' ? st.corridor + 1 : st.corridor
    const log = restore || !n.text ? st.log : [...st.log, { speaker: n.speaker === 'roy' ? '로이' : n.speaker === 'agatha' ? '아가사' : '', text: n.text, node: n.id }].slice(-200)
    const gate = ev?.type === 'explore' || ev?.type === 'board'
    set({ nodeId: id, progress, meta, corridor, log, prevBg: bg ?? st.prevBg, screen: gate ? 'gate' : 'story', toast: toast ?? st.toast })
    if (toast) setTimeout(() => get().toast === toast && set({ toast: null }), 3500)
    audio.setMode(n.fx?.includes('horror') ? 'horror' : n.fx?.includes('warm') ? 'warm' : 'normal')
    if (!restore) autosave()
    // 화면에 보일 내용이 없는 노드는 즉시 다음으로
    if (!gate && !n.text) {
      if (ev?.type === 'ending') { set({ endingId: ev.id, screen: 'ending' }); return }
      progress = get().progress
      const next = resolveNext(progress, n, get().meta.routesDone.length)
      if (next) enter(next)
    }
  }

  function snapshot(): SaveData {
    const s = get()
    return { nodeId: s.nodeId, progress: s.progress, log: s.log.slice(-60), corridor: s.corridor, truth: s.truth, chapter: STORY[s.nodeId]?.chapter ?? '', time: Date.now() }
  }
  function autosave() {
    const s = get()
    if (s.screen === 'ending') return
    const saves = { ...s.saves, auto: snapshot() }
    set({ saves })
    store(K.saves, saves)
  }

  return {
    screen: 'title',
    nodeId: START_NODE,
    progress: emptyProgress(),
    log: [],
    corridor: 0,
    truth: false,
    endingId: null,
    meta: load(K.meta, defaultMeta),
    settings: load(K.settings, defaultSettings),
    saves: load(K.saves, defaultSaves),
    toast: null,
    overlay: null,
    prevBg: undefined,

    setScreen: (screen) => set({ screen, overlay: null }),
    setOverlay: (overlay) => set({ overlay }),
    showToast: (toast) => { set({ toast }); setTimeout(() => get().toast === toast && set({ toast: null }), 3000) },
    truthUnlocked: () => get().meta.routesDone.length >= ROUTES.length,
    routeOfNode: () => { const r = STORY[get().nodeId]?.route; return r && r !== 'common' && r !== 'truth' ? r : null },

    newGame: () => {
      const meta = { ...get().meta, plays: get().meta.plays + 1 }
      store(K.meta, meta)
      set({ progress: emptyProgress(), log: [], corridor: 0, truth: false, endingId: null, meta, prevBg: undefined, overlay: null })
      enter(START_NODE)
    },
    startTruth: () => {
      if (!get().truthUnlocked()) return
      const all = emptyProgress()
      all.evidence = LOCATIONS.flatMap((l) => l.objects.map((o) => o.evidence).filter(Boolean) as string[]).concat('testimony')
      all.deductions = DEDUCTIONS.map((d) => d.id)
      all.sus = 5; all.fas = 5
      const meta = { ...get().meta, truthPlays: get().meta.truthPlays + 1 }
      store(K.meta, meta)
      set({ progress: all, log: [], corridor: 0, truth: true, endingId: null, meta, prevBg: undefined, overlay: null })
      enter(TRUTH_NODE)
    },
    continueGame: () => get().loadSlot('auto'),

    advance: () => {
      const s = get()
      const n = STORY[s.nodeId]
      if (!n || n.choices) return
      if (n.event?.type === 'ending') { set({ endingId: n.event.id, screen: 'ending' }); return }
      const next = resolveNext(s.progress, n, s.meta.routesDone.length)
      if (next) enter(next)
    },
    choose: (i) => {
      const s = get()
      const n = STORY[s.nodeId]
      const ch = n?.choices?.[i]
      if (!ch || !choiceAvailable(s.progress, ch, s.meta.routesDone.length)) return
      set({ progress: applyChoice(s.progress, ch), log: [...s.log, { speaker: '선택', text: ch.label, node: n.id }].slice(-200) })
      enter(ch.nextNode)
    },

    investigate: (evidence) => {
      if (!evidence) return
      const s = get()
      if (s.progress.evidence.includes(evidence)) return
      set({ progress: { ...s.progress, evidence: [...s.progress.evidence, evidence] } })
      autosave()
    },
    combine: (a, b) => {
      const s = get()
      const r = tryCombine(s.progress, a, b)
      if (!r.ok || !r.id) return { ok: false }
      if (s.progress.deductions.includes(r.id)) return { ok: true, id: r.id, already: true }
      set({ progress: { ...s.progress, deductions: [...s.progress.deductions, r.id], sus: Math.min(10, s.progress.sus + 1) } })
      autosave()
      return { ok: true, id: r.id }
    },
    leaveGate: () => {
      const s = get()
      const n = STORY[s.nodeId]
      if (!n || !eventGateOk(s.progress, n)) return
      const next = resolveNext(s.progress, n, s.meta.routesDone.length)
      if (next) enter(next)
    },

    saveSlot: (i) => {
      const s = get()
      if (s.screen === 'ending') return
      const slots = [...s.saves.slots]
      slots[i] = snapshot()
      const saves = { ...s.saves, slots }
      set({ saves })
      store(K.saves, saves)
      get().showToast(`슬롯 ${i + 1}에 저장했습니다`)
    },
    loadSlot: (i) => {
      const s = get()
      const d = i === 'auto' ? s.saves.auto : s.saves.slots[i]
      if (!d || !STORY[d.nodeId]) return false
      set({ progress: d.progress, log: d.log, corridor: d.corridor, truth: d.truth, endingId: null, overlay: null, prevBg: STORY[d.nodeId].background })
      enter(d.nodeId, true)
      return true
    },
    setSettings: (p) => {
      const settings = { ...get().settings, ...p }
      store(K.settings, settings)
      set({ settings })
      audio.configure(settings.volume, settings.muted)
    },
    resetAll: () => {
      for (const k of Object.values(K)) { try { localStorage.removeItem(k) } catch { /* noop */ } }
      set({ meta: defaultMeta, saves: defaultSaves, screen: 'title' })
    },
  }
})

export const maskCount = () => ROUTES.reduce((a, r) => a + MASKS[r].length, 0)
