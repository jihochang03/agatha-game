import type { EndingDef } from '../engine/types'

export const ENDINGS: EndingDef[] = [
  { id: 'stay', route: 'jak', kind: 'happy', title: '곁에 있는 사람', sub: 'ENDING A',
    epilogue: ['아가사는 부끄럽게 얼굴을 돌렸다. 그러면서도 입가에 번지는 미소는 끝내 감추지 못했다.', '창밖에는 비가 그친 아침이 있었다. 원고의 마지막 장은 아직 비어 있었지만, 이제 그 빈칸을 함께 채울 사람이 곁에 있었다.'],
    last: '"이제 도망치지 마세요." 그녀는 도망치지 않았다. 도망칠 이유가 없어졌을 뿐이다.' },
  { id: 'free', route: 'jak', kind: 'true', title: '고쳐 쓴 문장', sub: 'ENDING B',
    epilogue: ['"있어야 한다"가 "있어 줬으면 좋겠다"로 바뀌는 데는 한 번의 숨이면 충분했다.', '명령이 부탁이 되자, 같은 말이 전혀 다른 문장이 되었다. 아가사는 웃으며 그의 손을 잡았다. 이번에는 누구도 대신 열어 주지 않은 문이었다.'],
    last: '곁에 있기로 한 것은 그녀의 선택이었다. 그 이야기의 마지막 문장은, 그녀가 쓴다.' },
]

export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map((e) => [e.id, e])) as Record<string, (typeof ENDINGS)[number]>
