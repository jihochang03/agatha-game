import type { StoryNode, Expr, Cond } from '../../engine/types'

export type Item = Partial<Omit<StoryNode, 'chapter' | 'route'>> & { text: string }

export const A = (text: string, o: Partial<StoryNode> = {}): Item => ({ speaker: 'agatha', text, ...o })
export const R = (text: string, o: Partial<StoryNode> = {}): Item => ({ speaker: 'roy', text, ...o })
export const N = (text: string, o: Partial<StoryNode> = {}): Item => ({ speaker: 'narr', text, ...o })
export const sc = (id: string, next: string): Item => ({ id, text: '', speaker: 'narr', nextNode: next })
export const when = (cond: Cond, next: string) => ({ cond, next })

/** Build a linear node list. Item 0 gets id=prefix, others prefix.i unless id given. bg/char/expr/chapter inherit forward. */
export function build(prefix: string, chapter: string, route: StoryNode['route'], items: Item[]): StoryNode[] {
  const ids = items.map((it, i) => it.id ?? (i === 0 ? prefix : `${prefix}.${i}`))
  let bg: string | undefined
  let ch: StoryNode['character']
  // 표정은 화자(아가사 / 그 외)별로 따로 이어진다. 아가사의 표정이 로이 대사로 새어 나가지 않게 한다.
  let exA: Expr | undefined
  let exR: Expr | undefined
  let chap = chapter
  let hide: boolean | undefined
  return items.map((it, i) => {
    if (it.background !== undefined) bg = it.background
    if (it.character !== undefined) ch = it.character
    if (it.hideA !== undefined) hide = it.hideA
    const isA = it.speaker === 'agatha'
    if (it.expression !== undefined) { if (isA) exA = it.expression; else exR = it.expression }
    const ex = isA ? exA : exR
    const itAny = it as Item & { chapter?: string }
    if (itAny.chapter) chap = itAny.chapter
    const terminal = it.event?.type === 'ending'
    const hasOut = it.choices || it.branch
    const next = it.nextNode !== undefined ? it.nextNode : terminal || hasOut ? undefined : ids[i + 1]
    const node: StoryNode = {
      ...it,
      id: ids[i],
      chapter: chap,
      route,
      background: bg,
      character: ch,
      expression: ex,
      hideA: hide,
      nextNode: next,
    }
    return node
  })
}
