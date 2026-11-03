import { create } from 'zustand'
import type { StoryNode } from './types'
import { STORY, START_NODE } from '../data/story'
import { ENDING_BY_ID } from '../data/endings'
import { applyChoice, applyNodeGrants, choiceAvailable, emptyProgress, resolveNext, type Progress } from './logic'
import { audio } from './audio'

export type Screen = 'title' | 'story' | 'ending' | 'gallery' | 'records' | 'settings' | 'saves'
export interface LogLine { speaker: string; text: string; node: string }
export interface Meta { endings: string[]; cgs: string[]; plays: number }
export interface Settings { volume: number; muted: boolean; textSpeed: 'slow' | 'normal' | 'instant'; auto: boolean }
export interface SaveData { nodeId: string; progress: Progress; log: LogLine[]; chapter: string; time: number }

const K = { meta: 'labyrinth.meta.v2', settings: 'labyrinth.settings.v1', saves: 'labyrinth.saves.v2' }
function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? { ...fallback, ...JSON.parse(s) } : fallback } catch { return fallback }
}
function store(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* 저장 불가 환경 */ } }

const defaultMeta: Meta = { endings: [], cgs: [], plays: 0 }
const defaultSettings: Settings = { volume: 0.5, muted: false, textSpeed: 'normal', auto: false }
type SaveBook = { auto: SaveData | null; slots: (SaveData | null)[] }
const defaultSaves: SaveBook = { auto: null, slots: [null, null, null] }

/** 존재하지 않는 노드를 가리키는 세이브(이전 버전)는 버린다. */
function sanitize(b: SaveBook): SaveBook {
  const ok = (d: SaveData | null) => (d && STORY[d.nodeId] ? d : null)
  return { auto: ok(b.auto), slots: [0, 1, 2].map((i) => ok(b.slots?.[i] ?? null)) }
}

export interface GameState {
  screen: Screen
  nodeId: string
  progress: Progress
  log: LogLine[]
  endingId: string | null
  meta: Meta
  settings: Settings
  saves: SaveBook
  toast: string | null
  overlay: null | 'log' | 'menu' | 'manuscript'
  setScreen: (s: Screen) => void
  setOverlay: (o: GameState['overlay']) => void
  newGame: () => void
  continueGame: () => boolean
  advance: () => void
  choose: (i: number) => void
  saveSlot: (i: number) => void
  loadSlot: (i: number | 'auto') => boolean
  setSettings: (s: Partial<Settings>) => void
  showToast: (t: string) => void
  resetAll: () => void
}

export const useGame = create<GameState>((set, get) => {
  /** 노드에 진입: 보상 적용, 이벤트 처리, 필요한 자동 진행. */
  function enter(id: string, restore = false) {
    const n: StoryNode | undefined = STORY[id]
    if (!n) { console.error('존재하지 않는 노드', id); set({ screen: 'title' }); return }
    const st = get()
    const progress = restore ? st.progress : applyNodeGrants(st.progress, n)
    let meta = st.meta
    let toast: string | null = null
    const ev = n.event
    if (!restore && ev) {
      if (ev.type === 'cg' && !meta.cgs.includes(ev.id)) {
        meta = { ...meta, cgs: [...meta.cgs, ev.id] }
        toast = '갤러리에 새 장면이 기록되었다'
      }
      if (ev.type === 'ending' && ENDING_BY_ID[ev.id] && !meta.endings.includes(ev.id)) meta = { ...meta, endings: [...meta.endings, ev.id] }
    }
    if (meta !== st.meta) store(K.meta, meta)
    const log = restore || !n.text ? st.log : [...st.log, { speaker: n.speaker === 'roy' ? '로이' : n.speaker === 'agatha' ? '아가사' : '', text: n.text, node: n.id }].slice(-200)
    set({ nodeId: id, progress, meta, log, screen: 'story', toast: toast ?? st.toast })
    if (toast) setTimeout(() => get().toast === toast && set({ toast: null }), 3000)
    audio.setMode(n.fx?.includes('horror') ? 'horror' : n.fx?.includes('warm') ? 'warm' : 'normal')
    if (!restore) autosave()
    // 화면에 보일 내용이 없는 노드는 즉시 다음으로
    if (!n.text) {
      if (ev?.type === 'ending') { set({ endingId: ev.id, screen: 'ending' }); return }
      const next = resolveNext(get().progress, n)
      if (next) enter(next)
    }
  }

  function snapshot(): SaveData {
    const s = get()
    return { nodeId: s.nodeId, progress: s.progress, log: s.log.slice(-60), chapter: STORY[s.nodeId]?.chapter ?? '', time: Date.now() }
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
    endingId: null,
    meta: load(K.meta, defaultMeta),
    settings: load(K.settings, defaultSettings),
    saves: sanitize(load(K.saves, defaultSaves)),
    toast: null,
    overlay: null,

    setScreen: (screen) => set({ screen, overlay: null }),
    setOverlay: (overlay) => set({ overlay }),
    showToast: (toast) => { set({ toast }); setTimeout(() => get().toast === toast && set({ toast: null }), 3000) },

    newGame: () => {
      const meta = { ...get().meta, plays: get().meta.plays + 1 }
      store(K.meta, meta)
      set({ progress: emptyProgress(), log: [], endingId: null, meta, overlay: null })
      enter(START_NODE)
    },
    continueGame: () => get().loadSlot('auto'),

    advance: () => {
      const s = get()
      const n = STORY[s.nodeId]
      if (!n || n.choices) return
      if (n.event?.type === 'ending') { set({ endingId: n.event.id, screen: 'ending' }); return }
      const next = resolveNext(s.progress, n)
      if (next) enter(next)
    },
    choose: (i) => {
      const s = get()
      const n = STORY[s.nodeId]
      const ch = n?.choices?.[i]
      if (!ch || !choiceAvailable(s.progress, ch)) return
      set({ progress: applyChoice(s.progress, ch), log: [...s.log, { speaker: '선택', text: ch.label, node: n.id }].slice(-200) })
      enter(ch.nextNode)
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
      set({ progress: d.progress, log: d.log, endingId: null, overlay: null })
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
