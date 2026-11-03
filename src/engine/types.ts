export type RouteId = 'jak' | 'bum' | 'sot' | 'go'
export const ROUTES: RouteId[] = ['jak', 'bum', 'sot', 'go']
export type Speaker = 'agatha' | 'roy' | 'narr'
export type Expr = 'neutral' | 'smile' | 'worry' | 'cold' | 'sad' | 'blush' | 'shock'
export type Fx = 'erase' | 'nameGlitch' | 'reverseClock' | 'warm' | 'horror' | 'voice'
export type Aff = Partial<Record<RouteId, number>>

export interface Cond {
  flags?: string[]
  notFlags?: string[]
  evidence?: string[]
  deductions?: string[]
  minSus?: number
  minFas?: number
  minAff?: Aff
  routesDone?: number
}

export interface Effects {
  sus?: number
  fas?: number
  aff?: Aff
  setFlags?: string[]
}

export interface Choice {
  label: string
  nextNode: string
  requiredFlags?: string[]
  evidenceRequired?: string[]
  conditions?: Cond
  suspicionDelta?: number
  fascinationDelta?: number
  routeAffinityDelta?: Aff
  setFlags?: string[]
  hint?: string
}

export type GameEvent =
  | { type: 'ending'; id: string }
  | { type: 'cg'; id: string }

export interface StoryNode {
  id: string
  chapter: string
  route?: RouteId | 'truth' | 'common'
  speaker?: Speaker
  text: string
  background?: string
  character?: 'roy' | RouteId | null
  expression?: Expr
  choices?: Choice[]
  conditions?: Cond
  branch?: { cond: Cond; next: string }[]
  effects?: Effects
  nextNode?: string
  event?: GameEvent
  evidence?: string[]
  flags?: string[]
  fx?: Fx[]
  echo?: string
  /** true 이면 아가사 스프라이트를 숨긴다(쓰러져 있는 장면 등). 이후 노드로 이어진다. */
  hideA?: boolean
}

export interface EvidenceDef {
  id: string
  name: string
  icon: string
  desc: string
  where: string
}
export interface Deduction {
  id: string
  a: string
  b: string
  title: string
  text: string
}
export interface LocationDef {
  id: string
  name: string
  bg: string
  x: number
  y: number
  intro: string
  objects: { id: string; label: string; text: string; evidence?: string; x: number; y: number }[]
}
export interface EndingDef {
  id: string
  route: RouteId | 'truth' | 'hidden'
  kind: 'happy' | 'dark' | 'true' | 'tragic'
  title: string
  sub: string
  epilogue: string[]
  last: string
}
