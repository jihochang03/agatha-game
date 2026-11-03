import { A, N, R, build } from './dsl'

const C3 = 'CHAPTER 03 — 미궁 속의 티타임'
const C4 = 'CHAPTER 04 — 사랑과 배신'
const C5 = 'CHAPTER 05 — 마지막 장'

export const go = build('go', C3, 'go', [
  N('지하실의 잠긴 문은 아가사가 손을 대자 열렸다. 문 뒤는 좁은 방이었다. 벽에는 분필로 그은 선이 빼곡했고, 방 한구석에서 큰 몸이 웅크린 채 아가사를 올려다보았다.', { chapter: C3, background: 'cellar', character: 'go', expression: 'sad', fx: ['horror'] }),
  R('…왔어.'),
  R('안 와도 됐는데. 왔어.', { expression: 'worry' }),
  A('당신은 여기서 얼마나 있었죠?'),
  R('몰라. 세는 걸 그만뒀어. 세면, 오래된 게 보여서.'),
  N('그가 천천히 일어섰다. 방이 갑자기 좁아졌다. 아가사의 얼굴 쪽으로 손이 올라오다 허공에서 멈추었다. 손끝이 아가사의 뺨 한 뼘 앞에서 떨렸다.', { event: { type: 'romance', route: 'go', n: 1 } }),
  R('…안 닿을게. 무서우면 말해.', { expression: 'sad' }),
  N('지도의 중심에는 이렇게 쓰여 있었다. 마지막 장. 그 옆에는 아가사의 필체로 한 문장이 있었다. 「괴물은 문 뒤에서 기다렸다. 이름을 불러 주는 사람이 오기를.」', { echo: 'm5' }),
  A('(내가 쓴 문장이다. 괴물은 이 사람이다. 내가 쓴.)'),
  {
    text: '그는 아가사의 시선을 피하지 않았다. 다만 그 눈에는 거절당할 준비가 되어 있었다.',
    speaker: 'narr',
    id: 'go.c1',
    choices: [
      { label: '"로이."라고 이름을 불러 준다.', nextNode: 'go.c1a', fascinationDelta: 2, routeAffinityDelta: { go: 2 } },
      { label: '"당신은 괴물이에요."라고 말한다.', nextNode: 'go.c1b', suspicionDelta: 2 },
    ],
  },
  R('……로이. 그거 내 이름이야. 처음 들어. 누가 불러 준 거.', { id: 'go.c1a', nextNode: 'go.m1', expression: 'blush' }),
  R('…알아. 알고 있어. 그러니까 가까이 안 가잖아.', { id: 'go.c1b', nextNode: 'go.m1', expression: 'sad' }),
  R('말만 해. 네가 원하면 뭐든지 다 해줄게.', { id: 'go.m1', fx: ['voice'] }),
  { text: '', speaker: 'narr', id: 'go.u2', event: { type: 'unlockMask', mask: 'go2' } },
  N('복도의 거울 속에서 얼굴 없는 그림자들이 걸어 나왔다. 로이는 아가사 앞으로 한 발 나서 그들을 막았다. 그의 등이 방패처럼 아가사의 시야를 가렸다.', { chapter: C4, background: 'corridor', character: 'go', expression: 'cold', fx: ['horror'] }),
  R('뒤로. 내 뒤에.'),
  N('소리는 짧았다. 몸이 벽에 부딪히는 둔한 소음. 그리고 정적. 로이가 돌아섰을 때, 손에서 붉은 잉크가 떨어지고 있었다. 피가 아니었다. 피처럼 보이는 글자였다.'),
  R('괜찮아. 안 아파. …안 아파야 해.', { expression: 'sad' }),
  A('다친 손을 보여 줘요.'),
  R('…더러워져. 가까이 오지 마.', { expression: 'sad' }),
  {
    text: '그는 뒤로 물러섰다. 아가사에게 닿지 않으려고. 손에서 떨어지는 잉크가 복도의 카펫에 이름을 쓰고 있었다.',
    speaker: 'narr',
    id: 'go.c2',
    choices: [
      { label: '손을 내민다. 다친 손을 잡는다.', nextNode: 'go.c2a', fascinationDelta: 2, routeAffinityDelta: { go: 2 }, setFlags: ['go_hand'] },
      { label: '거리를 둔 채 손수건을 던져 준다.', nextNode: 'go.c2b', suspicionDelta: 1 },
    ],
  },
  N('아가사는 그의 손을 두 손으로 잡았다. 그의 손은 아가사의 손을 감싸고도 남을 만큼 컸지만, 쥐지 못하고 있었다. 부서질 것을 두려워하는 사람처럼.', { id: 'go.c2a', nextNode: 'go.r2', event: { type: 'romance', route: 'go', n: 2 } }),
  R('따뜻해. …이상해. 이런 거 몰랐어.', { id: 'go.r2', nextNode: 'go.u3', expression: 'blush' }),
  N('그는 손수건을 받아 들고 한참 바라보았다. 그리고 그것을 가슴에 넣었다. 말없이. 그 침묵이 말보다 길었다.', { id: 'go.c2b', nextNode: 'go.u3' }),
  { text: '', speaker: 'narr', id: 'go.u3', event: { type: 'unlockMask', mask: 'go3' } },
  N('미궁의 중심. 모든 복도가 이곳을 향해 휘어 있었다. 방의 중앙에는 높은 책상이 있었고, 그 위에는 마지막 장이 펼쳐져 있었다. 어디선가 목소리가 들렸다.', { chapter: C5, background: 'center', character: 'go', expression: 'neutral', fx: ['horror'] }),
  N('"다른 길은 없어. 괴물과 싸우거나, 먹혀 죽거나. 둘 중 하나가 죽어야 끝나는 게임."', { echo: 'm6' }),
  { text: '', speaker: 'narr', id: 'go.b', event: { type: 'board', need: ['d_faces'] } },
  R('나야. 죽어야 하는 건. …그 글이 말하는 건 나야.', { id: 'go.b2', expression: 'sad' }),
  A('아니에요. 그건 내가 쓴 글이에요. 내가 쓴 글이 결정하는 게 아니라.'),
  R('나를 미궁 속에 혼자 두지 마. 더는.', { fx: ['voice'] }),
  N('그는 한 번도 무릎을 꿇은 적이 없는 사람처럼 서툴게 아가사 앞에 섰다. 그리고 아주 천천히, 이마를 아가사의 어깨에 기댔다. 숨이 닿을 만큼 가까웠다. 닿지는 않았다.', { event: { type: 'romance', route: 'go', n: 3 } }),
  R('곁에 있어 줘, 아가사.'),
  {
    text: '출구는 하나 열려 있었다. 한 사람이 지나갈 만큼의 틈. 그리고 지도에 없는 선 하나가, 책상 위에서 아직 쓰이기를 기다리고 있었다.',
    speaker: 'narr',
    id: 'go.final',
    choices: [
      { label: '그의 희생을 받아들이고 홀로 출구를 지난다.', nextNode: 'go.d', suspicionDelta: 1 },
      { label: '그의 손을 잡고, 지도에 없는 출구를 함께 쓴다.', nextNode: 'go.h', requiredFlags: ['go_hand'], hint: '그가 괴물인 채로 손을 잡았어야 한다' },
    ],
  },
  N('그는 아가사를 출구 앞까지 데려다 주었다. 그리고 문턱에서 멈췄다. 그가 가슴에서 손수건을 꺼내 아가사의 손에 쥐여 주었다.', { id: 'go.d' }),
  R('널 지킬 수 있다면, 내가 어떤 놈이 돼도 상관없어. 가.', { expression: 'sad', event: { type: 'ending', id: 'go_dark' } }),
  N('아가사는 그의 손을 놓지 않았다. 책상 위의 펜을 둘이 함께 쥐었다. 괴물의 손은 서툴게 떨렸고, 아가사의 손이 그것을 받쳐 주었다. 지도의 중심에서 선이 하나 뻗어 나갔다.', { id: 'go.h' }),
  R('이게… 길이야? 우리가 만든?', { expression: 'blush' }),
  A('네. 나는 당신을 인간으로 만들지 않을 거예요. 당신인 채로, 곁에 있을 거예요.', { event: { type: 'ending', id: 'go_happy' } }),
])
