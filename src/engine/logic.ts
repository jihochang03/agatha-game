import type { Aff, Choice, Cond, Effects, RouteId, StoryNode } from './types'
import { ROUTES } from './types'
import { DEDUCTIONS } from '../data/world'

/** 게임 진행 상태 중 분기 판정에 필요한 부분. UI/스토어와 검증 스크립트가 공유한다. */
export interface Progress {
  sus: number
  fas: number
  aff: Record<RouteId, number>
  flags: string[]
  evidence: string[]
  deductions: string[]
}

export const emptyProgress = (): Progress => ({ sus: 0, fas: 0, aff: { jak: 0, bum: 0, sot: 0, go: 0 }, flags: [], evidence: [], deductions: [] })
export const clamp = (n: number) => Math.max(0, Math.min(10, n))

export function checkCond(p: Progress, c: Cond | undefined, routesDone = 0): boolean {
  if (!c) return true
  if (c.flags && !c.flags.every((f) => p.flags.includes(f))) return false
  if (c.notFlags && c.notFlags.some((f) => p.flags.includes(f))) return false
  if (c.evidence && !c.evidence.every((e) => p.evidence.includes(e))) return false
  if (c.deductions && !c.deductions.every((d) => p.deductions.includes(d))) return false
  if (c.minSus !== undefined && p.sus < c.minSus) return false
  if (c.minFas !== undefined && p.fas < c.minFas) return false
  if (c.minAff) for (const r of ROUTES) if ((c.minAff[r] ?? 0) > p.aff[r]) return false
  if (c.routesDone !== undefined && routesDone < c.routesDone) return false
  return true
}

export function choiceAvailable(p: Progress, ch: Choice, routesDone = 0): boolean {
  if (ch.requiredFlags && !ch.requiredFlags.every((f) => p.flags.includes(f))) return false
  if (ch.evidenceRequired && !ch.evidenceRequired.every((e) => p.evidence.includes(e))) return false
  return checkCond(p, ch.conditions, routesDone)
}

export function applyEffects(p: Progress, e: Effects | undefined, affDelta?: Aff, sus = 0, fas = 0, flags: string[] = []): Progress {
  const q: Progress = { ...p, aff: { ...p.aff }, flags: [...p.flags] }
  q.sus = clamp(q.sus + (e?.sus ?? 0) + sus)
  q.fas = clamp(q.fas + (e?.fas ?? 0) + fas)
  for (const src of [e?.aff, affDelta]) if (src) for (const r of ROUTES) q.aff[r] = clamp(q.aff[r] + (src[r] ?? 0))
  for (const f of [...(e?.setFlags ?? []), ...flags]) if (!q.flags.includes(f)) q.flags.push(f)
  return q
}

export function applyChoice(p: Progress, ch: Choice): Progress {
  return applyEffects(p, undefined, ch.routeAffinityDelta, ch.suspicionDelta ?? 0, ch.fascinationDelta ?? 0, ch.setFlags ?? [])
}

export function applyNodeGrants(p: Progress, n: StoryNode): Progress {
  const q: Progress = { ...applyEffects(p, n.effects, undefined, 0, 0, n.flags ?? []), evidence: [...p.evidence] }
  for (const e of n.evidence ?? []) if (!q.evidence.includes(e)) q.evidence.push(e)
  return q
}

export function topRoute(p: Progress): RouteId {
  let best: RouteId = 'jak'
  for (const r of ROUTES) if (p.aff[r] > p.aff[best]) best = r
  return best
}

export function tryCombine(p: Progress, a: string, b: string): { ok: boolean; id?: string } {
  const d = DEDUCTIONS.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a))
  if (!d) return { ok: false }
  if (!p.evidence.includes(a) || !p.evidence.includes(b)) return { ok: false }
  return { ok: true, id: d.id }
}

/** 노드를 지나고 난 뒤 다음 노드 id를 결정한다. 선택지가 있는 노드는 null. */
export function resolveNext(p: Progress, n: StoryNode, routesDone = 0): string | null {
  if (n.branch) for (const b of n.branch) if (checkCond(p, b.cond, routesDone)) return b.next
  if (n.event?.type === 'routeDecide') return topRoute(p)
  return n.nextNode ?? null
}

export function eventGateOk(p: Progress, n: StoryNode): boolean {
  const ev = n.event
  if (!ev) return true
  if (ev.type === 'explore') return p.evidence.length >= ev.need
  if (ev.type === 'board') return ev.need.every((d) => p.deductions.includes(d))
  return true
}
