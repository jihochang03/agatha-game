import type { StoryNode } from '../../engine/types'
import { main } from './main'

export const ALL_NODES: StoryNode[] = [...main]
export const STORY: Record<string, StoryNode> = Object.fromEntries(ALL_NODES.map((n) => [n.id, n]))
export const START_NODE = 's'
