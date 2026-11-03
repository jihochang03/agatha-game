/* 스토리 그래프 검증: 노드 연결, 막다른 길, 도달 가능성, 선택지 분기. `npm run validate` */
import { ALL_NODES, STORY, START_NODE } from '../src/data/story'
import { ENDINGS, ENDING_BY_ID } from '../src/data/endings'
import { CGS, MANUSCRIPT } from '../src/data/world'
import { applyChoice, applyNodeGrants, choiceAvailable, emptyProgress, resolveNext, type Progress } from '../src/engine/logic'

const errors: string[] = []
const err = (m: string) => errors.push(m)

// 1. 구조 검사
const ids = new Set<string>()
for (const n of ALL_NODES) {
  if (ids.has(n.id)) err(`중복 노드 id: ${n.id}`)
  ids.add(n.id)
}
const cgIds = new Set(CGS.map((c) => c.id))
const echoIds = new Set(MANUSCRIPT.map((m) => m.id))
for (const n of ALL_NODES) {
  const targets = [...(n.nextNode ? [n.nextNode] : []), ...(n.choices?.map((c) => c.nextNode) ?? []), ...(n.branch?.map((b) => b.next) ?? [])]
  for (const t of targets) if (!STORY[t]) err(`${n.id} → 존재하지 않는 노드 '${t}'`)
  const ev = n.event
  const isEnd = ev?.type === 'ending'
  const out = n.nextNode || n.choices?.length
  if (!out && !isEnd) err(`${n.id}: 다음 노드가 없는 막다른 노드`)
  if (isEnd && out) err(`${n.id}: 엔딩 노드에 다음 노드가 있음`)
  if (isEnd && !ENDING_BY_ID[ev.id]) err(`${n.id}: 정의되지 않은 엔딩 '${ev.id}'`)
  if (ev?.type === 'cg' && !cgIds.has(ev.id)) err(`${n.id}: 정의되지 않은 장면 '${ev.id}'`)
  if (n.echo && !echoIds.has(n.echo)) err(`${n.id}: 알 수 없는 원고 문장 '${n.echo}'`)
  if (!n.text) err(`${n.id}: 빈 대사`)
  if (n.choices) {
    if (n.choices.length < 2) err(`${n.id}: 선택지가 2개 미만`)
    if (!n.choices.some((c) => !c.requiredFlags && !c.evidenceRequired && !c.conditions)) err(`${n.id}: 조건 없는 선택지가 없어 진행 불가능해질 수 있음`)
  }
}

// 2. 도달 가능성 (모든 선택지 조합을 따라 탐색)
const key = (id: string, p: Progress) => `${id}|${p.sus}|${p.fas}|${[...p.flags].sort().join(',')}`
const seen = new Set<string>()
const reachNodes = new Set<string>()
const reachEndings = new Set<string>()
const reachCgs = new Set<string>()
const stack: [string, Progress][] = [[START_NODE, emptyProgress()]]
while (stack.length) {
  const [id, p0] = stack.pop()!
  const k = key(id, p0)
  if (seen.has(k)) continue
  seen.add(k)
  const n = STORY[id]
  if (!n) continue
  reachNodes.add(id)
  const p = applyNodeGrants(p0, n)
  if (n.event?.type === 'cg') reachCgs.add(n.event.id)
  if (n.event?.type === 'ending') { reachEndings.add(n.event.id); continue }
  if (n.choices) {
    for (const c of n.choices) if (choiceAvailable(p, c)) stack.push([c.nextNode, applyChoice(p, c)])
    continue
  }
  const next = resolveNext(p, n)
  if (next) stack.push([next, p])
}
for (const n of ALL_NODES) if (!reachNodes.has(n.id)) err(`도달 불가능한 노드: ${n.id}`)
for (const e of ENDINGS) if (!reachEndings.has(e.id)) err(`도달 불가능한 엔딩: ${e.id}`)
for (const c of CGS) if (!reachCgs.has(c.id)) err(`도달 불가능한 장면: ${c.id}`)

// 3. 모든 선택지가 실제로 서로 다른 결과를 만드는지 (이후 노드, 수치, 플래그 중 하나라도 달라야 함)
for (const n of ALL_NODES) {
  if (!n.choices) continue
  const sig = n.choices.map((c) => `${c.nextNode}|${c.suspicionDelta ?? 0}|${c.fascinationDelta ?? 0}|${(c.setFlags ?? []).join(',')}`)
  if (new Set(sig).size !== sig.length) err(`${n.id}: 결과가 같은 선택지가 있음`)
}

console.log(`노드 ${ALL_NODES.length}개 · 선택지 ${ALL_NODES.filter((n) => n.choices).length}곳 · 엔딩 ${ENDINGS.length}종 · 장면 ${CGS.length}종 · 탐색 상태 ${seen.size}개`)
console.log(`도달한 엔딩: ${[...reachEndings].sort().join(', ')}`)
if (errors.length) {
  for (const e of errors) console.error('오류:', e)
  console.error(`\n검증 실패 (${errors.length}건)`)
  process.exit(1)
}
console.log('검증 통과')
