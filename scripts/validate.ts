/* 스토리 그래프 검증: 노드 연결, 분기 조건, 엔딩 도달 가능성. `npm run validate` */
import { ALL_NODES, STORY, START_NODE, TRUTH_NODE } from '../src/data/story'
import { ENDINGS, ENDING_BY_ID } from '../src/data/endings'
import { DEDUCTIONS, EVIDENCE, LOCATIONS, MASKS } from '../src/data/world'
import { ROUTES } from '../src/engine/types'
import {
  applyChoice, applyNodeGrants, choiceAvailable, emptyProgress, resolveNext, type Progress,
} from '../src/engine/logic'

const errors: string[] = []
const warns: string[] = []
const err = (m: string) => errors.push(m)

// 1. 구조 검사
const ids = new Set<string>()
for (const n of ALL_NODES) {
  if (ids.has(n.id)) err(`중복 노드 id: ${n.id}`)
  ids.add(n.id)
}
const targetsOf = (n: (typeof ALL_NODES)[number]): string[] => [
  ...(n.nextNode ? [n.nextNode] : []),
  ...(n.choices?.map((c) => c.nextNode) ?? []),
  ...(n.branch?.map((b) => b.next) ?? []),
]
const maskIds = new Set(ROUTES.flatMap((r) => MASKS[r].map((m) => m.id)))
const evIds = new Set(EVIDENCE.map((e) => e.id))
for (const n of ALL_NODES) {
  for (const t of targetsOf(n)) if (!STORY[t]) err(`${n.id} → 존재하지 않는 노드 '${t}'`)
  const ev = n.event
  const isEnd = ev?.type === 'ending'
  const out = n.nextNode || n.choices?.length || n.branch?.length || ev?.type === 'routeDecide'
  if (!out && !isEnd) err(`${n.id}: 다음 노드가 없는 막다른 노드`)
  if (isEnd && out) err(`${n.id}: 엔딩 노드에 다음 노드가 있음`)
  if (isEnd && !ENDING_BY_ID[ev.id]) err(`${n.id}: 정의되지 않은 엔딩 '${ev.id}'`)
  if (ev?.type === 'unlockMask' && !maskIds.has(ev.mask)) err(`${n.id}: 알 수 없는 가면 '${ev.mask}'`)
  if (ev?.type === 'board') for (const d of ev.need) if (!DEDUCTIONS.some((x) => x.id === d)) err(`${n.id}: 알 수 없는 추리 '${d}'`)
  for (const e of n.evidence ?? []) if (!evIds.has(e)) err(`${n.id}: 알 수 없는 증거 '${e}'`)
  if (n.choices) {
    if (n.choices.length < 2) warns.push(`${n.id}: 선택지가 2개 미만`)
    if (!n.choices.some((c) => !c.requiredFlags && !c.evidenceRequired && !c.conditions)) err(`${n.id}: 조건 없는 선택지가 없어 진행 불가능해질 수 있음`)
  }
  if (!n.text && !n.event) err(`${n.id}: 빈 노드(텍스트도 이벤트도 없음)`)
}

// 2. 증거/추리 획득 가능성
const obtainable = new Set<string>([...LOCATIONS.flatMap((l) => l.objects.map((o) => o.evidence).filter(Boolean) as string[]), ...ALL_NODES.flatMap((n) => n.evidence ?? [])])
for (const d of DEDUCTIONS) for (const e of [d.a, d.b]) if (!obtainable.has(e)) err(`추리 ${d.id}: 증거 '${e}'를 얻을 방법이 없음`)

// 3. 도달 가능성 시뮬레이션 (탐색/추리는 최선의 경우로 가정)
const allEvidence = [...obtainable]
const allDeductions = DEDUCTIONS.map((d) => d.id)
const keyOf = (id: string, p: Progress) => `${id}|${p.sus}|${p.fas}|${ROUTES.map((r) => p.aff[r]).join(',')}|${[...p.flags].sort().join(',')}|${p.deductions.length}|${p.evidence.length}`

function simulate(entry: string, init: Progress, routesDone: number) {
  const seen = new Set<string>()
  const reachNodes = new Set<string>()
  const reachEndings = new Set<string>()
  const stack: [string, Progress][] = [[entry, init]]
  let steps = 0
  while (stack.length) {
    const [id, p0] = stack.pop()!
    const k = keyOf(id, p0)
    if (seen.has(k)) continue
    seen.add(k)
    if (++steps > 400000) { err('시뮬레이션 상태 폭발'); break }
    const n = STORY[id]
    if (!n) continue
    reachNodes.add(id)
    let p = applyNodeGrants(p0, n)
    if (n.event?.type === 'explore') p = { ...p, evidence: [...new Set([...p.evidence, ...allEvidence])] }
    if (n.event?.type === 'board') p = { ...p, evidence: [...new Set([...p.evidence, ...allEvidence])], deductions: [...new Set([...p.deductions, ...allDeductions])] }
    if (n.event?.type === 'ending') { reachEndings.add(n.event.id); continue }
    if (n.choices) {
      for (const c of n.choices) if (choiceAvailable(p, c, routesDone)) stack.push([c.nextNode, applyChoice(p, c)])
      continue
    }
    const next = resolveNext(p, n, routesDone)
    if (next) stack.push([next, p])
  }
  return { reachNodes, reachEndings, steps }
}

const main = simulate(START_NODE, emptyProgress(), 0)
// 진실 루트는 네 루트 클리어 후 해금되므로 모든 증거/추리를 지닌 채 시작한다.
const truthInit = { ...emptyProgress(), evidence: allEvidence, deductions: allDeductions }
const tr = simulate(TRUTH_NODE, truthInit, 4)

const reached = new Set([...main.reachNodes, ...tr.reachNodes])
const endings = new Set([...main.reachEndings, ...tr.reachEndings])
for (const n of ALL_NODES) if (!reached.has(n.id)) err(`도달 불가능한 노드: ${n.id}`)
for (const e of ENDINGS) if (!endings.has(e.id)) err(`도달 불가능한 엔딩: ${e.id}`)
if (ENDINGS.length < 9) err(`엔딩 수 부족: ${ENDINGS.length}`)

// 4. 루트별 로맨스 이벤트 3종, 가면 3종
for (const r of ROUTES) {
  const ns = ALL_NODES.filter((n) => n.route === r)
  for (const k of [1, 2, 3]) if (!ns.some((n) => n.event?.type === 'romance' && n.event.route === r && n.event.n === k)) err(`${r} 루트: 로맨스 이벤트 ${k} 없음`)
  for (const m of MASKS[r]) if (!ALL_NODES.some((n) => n.event?.type === 'unlockMask' && n.event.mask === m.id)) err(`가면 ${m.id}를 해금하는 노드가 없음`)
  const eIds = ENDINGS.filter((e) => e.route === r).map((e) => e.id)
  if (eIds.length !== 2) err(`${r}: 엔딩이 2종이 아님`)
}
// 5. 해피엔딩이 '조건부'인지(선택이 의미 있는지) 보고
console.log(`노드 ${ALL_NODES.length}개 · 엔딩 ${ENDINGS.length}종 · 시뮬레이션 상태 ${main.steps + tr.steps}개`)
console.log(`도달한 엔딩: ${[...endings].sort().join(', ')}`)
for (const w of warns) console.warn('경고:', w)
if (errors.length) {
  for (const e of errors) console.error('오류:', e)
  console.error(`\n검증 실패 (${errors.length}건)`)
  process.exit(1)
}
console.log('검증 통과')
