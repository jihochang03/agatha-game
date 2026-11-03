import type { StoryNode } from '../../engine/types'
import { prologue, chapter1, chapter2 } from './common'
import { jak } from './jak'
import { bum } from './bum'
import { sot } from './sot'
import { go } from './go'
import { truth } from './truth'

export const ALL_NODES: StoryNode[] = [...prologue, ...chapter1, ...chapter2, ...jak, ...bum, ...sot, ...go, ...truth]
export const STORY: Record<string, StoryNode> = Object.fromEntries(ALL_NODES.map((n) => [n.id, n]))
export const START_NODE = 'p'
export const TRUTH_NODE = 'truth'
