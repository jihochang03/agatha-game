import { A, N, R, build } from './dsl'

const P = '프롤로그 — 눈을 뜨면'
const C1 = 'CHAPTER 01 — 하이드로 호텔'
const C2 = 'CHAPTER 02 — 가면 속의 남자'

export const prologue = build('p', P, 'common', [
  N('비가 오는 소리가 들렸다. 정확히는, 비가 내렸던 소리의 잔향이었다. 아가사는 깊은 벨벳 소파 위에서 눈을 떴다.', { background: 'lobby', character: null, fx: ['horror'] }),
  N('샹들리에는 꺼져 있는데도 어디선가 촛농 냄새가 났다. 벽시계는 네 시 십 분을 가리킨 채, 숨을 죽이고 있었다.'),
  N('맞은편 안락의자에는 한 남자가 앉아 있었다. 찻잔을 두 손으로 감싼 채, 오래 기다린 사람처럼.', { character: 'roy', expression: 'smile' }),
  R('깨셨군요. 걱정했어요. 아니… 걱정하는 척을 하기엔, 당신이 너무 오래 잠들어 있었죠.'),
  A('여기가 어디죠.', { expression: 'neutral' }),
  R('하이드로 호텔. 당신이 나를 부른 곳이에요.'),
  A('나는 당신을 부른 적이 없어요.'),
  R('그렇게 말할 줄 알았어요. 그래서 이걸 가져왔죠.'),
  N('남자가 탁자 위로 낡은 원고 한 장을 밀었다. 가장자리가 불에 그을린 종이 위에, 아가사의 필체가 있었다.', { evidence: ['manuscript'] }),
  N('「미궁 속의 티타임」.'),
  A('(그 원고는 서랍 가장 깊은 곳에 있어야 한다. 아무도 읽은 적이 없다. 아무도.)', { echo: 'm1' }),
  {
    text: '아가사는 숨을 고르며 입을 열었다. 혹은 입을 열지 않았다.',
    speaker: 'narr',
    id: 'p.c',
    choices: [
      { label: '"당신은 누구죠?"', nextNode: 'p.r1', suspicionDelta: 1, routeAffinityDelta: { jak: 1 } },
      { label: '"내가 왜 여기 있는 거죠?"', nextNode: 'p.r2', fascinationDelta: 1, routeAffinityDelta: { sot: 1 } },
      { label: '"그 원고를 어디서 찾았어요?"', nextNode: 'p.r3', suspicionDelta: 2, routeAffinityDelta: { bum: 1 } },
      { label: '아무 말 없이 그를 관찰한다.', nextNode: 'p.r4', suspicionDelta: 1, routeAffinityDelta: { go: 1 } },
    ],
  },
  R('로이라고 불러요. 이름이란 불리기 전까지는 아무것도 아니니까요. 당신이 불러 주기 전까지는, 나도 그랬죠.', { id: 'p.r1', nextNode: 'p.m', expression: 'smile' }),
  R('쉬어요. 그 질문은 답을 구하려는 게 아니라, 아직 겁이 난다는 뜻이잖아요. 천천히 해요. 시간은… 이 호텔에서는 아주 넉넉하니까.', { id: 'p.r2', nextNode: 'p.m', expression: 'worry' }),
  R('찾은 게 아니에요. 놓여 있었죠. 마치 누가, 읽어 주기를 기다린 것처럼. …기억 안 나요?', { id: 'p.r3', nextNode: 'p.m', expression: 'neutral' }),
  N('남자는 시선을 피하지 않았다. 아가사가 눈을 떼지 않는 만큼, 그도 가만히 있었다. 먼저 눈을 돌린 쪽은 아가사였다.', { id: 'p.r4', nextNode: 'p.m', expression: 'cold' }),
  A('(익숙하다. 그가 아니라, 이 상황이. 마치 내가 써 본 장면처럼.)', { id: 'p.m', echo: 'm1' }),
  R('호텔을 둘러보세요. 어느 문도 잠겨 있지 않아요. 다만, 돌아오는 길이 같다는 보장은 없죠.', { expression: 'smile' }),
  N('남자는 찻잔을 내려놓았다. 소리가 나지 않았다. 탁자 위에는 이미 찻잔이 하나 더 있었다. 아가사의 것이었다.', { nextNode: 'ch1' }),
])

export const chapter1 = build('ch1', C1, 'common', [
  N('호텔은 아름다웠다. 낡은 벨벳과 금박, 짙은 와인빛 카펫. 그리고 모든 곳에, 사람이 막 떠난 듯한 온기가 남아 있었다.', { chapter: C1, background: 'corridor', character: null }),
  N('조사할 곳을 고른다. 단서가 될 만한 것은 무엇이든 손으로 확인한다. 논리가 아가사의 가장 오래된 무기였다.'),
  { text: '', speaker: 'narr', id: 'ch1.g', event: { type: 'explore', need: 6 }, nextNode: 'ch1.a' },
  N('복도 끝에서 아가사는 문패를 읽었다. 1313. 호텔 안내도에는 열두 층까지밖에 없었다.', { id: 'ch1.a', background: 'corridor' }),
  R('그 문은 열리지 않을 거예요. …아직은요.', { character: 'roy', expression: 'neutral' }),
  A('당신은 이 호텔에 대해 너무 많이 알고 있어요.'),
  R('사고는 새벽 세 시에 있었죠. 모두가 잠든 시간에. 그날부터 이곳의 시계는 아무도 믿지 않아요.', { evidence: ['testimony'], expression: 'worry' }),
  A('(사고. 그는 사고라고 했다. 나는 아직 어떤 사고인지 묻지 않았는데.)', { fx: ['reverseClock'] }),
  N('아가사는 수첩이 아닌 기억 속에서 단서들을 펼쳐 놓았다. 각각은 말이 없다. 연결할 때에만 말을 한다.'),
  { text: '', speaker: 'narr', id: 'ch1.b', event: { type: 'board', need: ['d_names', 'd_time'] }, nextNode: 'ch1.c' },
  A('원고 속 피해자의 이름이… 이 명부의 이름과 같아요. 그리고 시계가 가리키는 시간은 당신의 증언과 다르죠.', { id: 'ch1.c', character: 'roy', expression: 'neutral' }),
  R('역시. 당신은 내가 기억하는 당신이네요.', { expression: 'smile' }),
  N('로이는 처음으로 아주 조금 웃었다. 그 웃음이 어느 얼굴의 웃음이었는지 — 아가사는 나중에야 의문을 가졌다.', { nextNode: 'ch2' }),
])

export const chapter2 = build('ch2', C2, 'common', [
  N('그날 밤부터였다. 로이의 얼굴이 조금씩, 서로 다르게 느껴지기 시작한 것은.', { chapter: C2, background: 'study', character: 'roy', expression: 'neutral' }),
  N('서재의 촛불이 한 번 흔들렸다. 아가사가 눈을 깜빡였을 때, 로이는 이미 소파 앞에 한쪽 무릎을 꿇고 있었다. 아가사의 손이 어느새 그의 두 손 안에 있었다.', { character: 'jak', expression: 'smile', fx: ['warm'] }),
  R('당신의 글은 틀리지 않았어요. 다만 아무도 그것을 읽어 줄 용기가 없었을 뿐이죠.', { echo: 'm3' }),
  A('…누가 당신에게 읽으라고 했죠.'),
  R('그건 당신이 감히 말로 꺼내지 못한 모든 진심이었어요.', { fx: ['voice'] }),
  {
    text: '그는 아래에서 위로 시선을 올렸다. 두려워하면 기다리겠다는 듯, 한 번도 눈을 피하지 않았다.',
    speaker: 'narr',
    id: 'ch2.c1',
    choices: [
      { label: '그의 말을 더 듣는다.', nextNode: 'ch2.g1a', fascinationDelta: 2, routeAffinityDelta: { jak: 2 }, setFlags: ['g1_listen'] },
      { label: '손을 거둔다.', nextNode: 'ch2.g1b', suspicionDelta: 1 },
    ],
  },
  R('좋아요. 그 목소리, 계속 들려줘요. 우리 둘 말고는 아무도 없으니까요.', { id: 'ch2.g1a', nextNode: 'ch2.g2', event: { type: 'unlockMask', mask: 'jak1' } }),
  R('물러서는 모습도 당신답네요. 서두르지 않을게요. 나는 오래 기다리는 데 익숙하니까요.', { id: 'ch2.g1b', nextNode: 'ch2.g2', event: { type: 'unlockMask', mask: 'jak1' } }),
  N('응접실의 문을 열자, 찻잔이 이미 놓여 있었다. 아가사가 앉기도 전에. 설탕은 두 개, 우유는 없이. 정확히 아가사의 취향이었다.', { id: 'ch2.g2', background: 'parlor', character: 'bum', expression: 'smile', fx: [] }),
  R('식기 전에 드세요. 이 온도를 좋아하잖아요, 당신.'),
  A('그걸 어떻게 알죠?'),
  R('…글쎄요. 제가 알고 있던가요? 당신, 기억 안 나요? 이건 우리가 정한 건데.', { echo: 'm3' }),
  {
    text: '문을 열려고 손을 뻗었을 때, 로이가 먼저 문을 열어 주었다. 이미 그 자리에 서 있었다는 듯이.',
    speaker: 'narr',
    id: 'ch2.c2',
    choices: [
      { label: '"누가 이걸 준비했죠?" 따져 묻는다.', nextNode: 'ch2.g2a', suspicionDelta: 2, routeAffinityDelta: { bum: 2 } },
      { label: '말없이 차를 마신다.', nextNode: 'ch2.g2b', fascinationDelta: 1, routeAffinityDelta: { bum: 1 }, setFlags: ['g2_drink'] },
    ],
  },
  R('난 아무것도 하지 않았어요. 다만 당신이 원하기 전에, 이미 있었을 뿐이에요.', { id: 'ch2.g2a', nextNode: 'ch2.g3', event: { type: 'unlockMask', mask: 'bum1' } }),
  R('잘 마시네요. 다음에도 같은 온도로 둘게요.', { id: 'ch2.g2b', nextNode: 'ch2.g3', event: { type: 'unlockMask', mask: 'bum1' } }),
  N('이마에 서늘한 손이 닿았다. 아가사는 자신에게 열이 있는 줄도 몰랐다. 누군가의 걱정이 먼저 그것을 알아차렸다.', { id: 'ch2.g3', background: 'room', character: 'sot', expression: 'worry' }),
  R('아직 열이 있으신데요. 조금만 더 쉬어야 해요. 자, 이리 와요.', { echo: 'm4' }),
  R('…죄송해요. 갑자기 만져서. 그냥, 걱정이 돼서요.', { expression: 'blush' }),
  {
    text: '그는 숨을 멈추고 아가사의 대답을 기다렸다. 어린 짐승이 손을 기다리듯이.',
    speaker: 'narr',
    id: 'ch2.c3',
    choices: [
      { label: '그의 손을 잡는다.', nextNode: 'ch2.g3a', fascinationDelta: 2, routeAffinityDelta: { sot: 2 }, setFlags: ['sot_hand'] },
      { label: '"열은 없어요." 손을 밀어낸다.', nextNode: 'ch2.g3b', suspicionDelta: 1 },
    ],
  },
  R('아… 고마워요. 이거… 꿈은 아니겠죠.', { id: 'ch2.g3a', nextNode: 'ch2.g4', expression: 'blush', event: { type: 'unlockMask', mask: 'sot1' } }),
  R('네… 네, 알겠어요. 그래도 조금은… 곁에 있어도 될까요.', { id: 'ch2.g3b', nextNode: 'ch2.g4', expression: 'sad', event: { type: 'unlockMask', mask: 'sot1' } }),
  N('복도의 끝. 그림자가 문틀을 가득 채우고 있었다. 시계 소리만 남고, 모든 소리가 사라졌다.', { id: 'ch2.g4', background: 'corridor', character: 'go', expression: 'cold', fx: ['horror'] }),
  R('…가까이 오지 마.'),
  R('다치게 해. 너를.', { expression: 'sad' }),
  N('거대한 몸이 아가사에게 한 걸음 다가왔다가, 닿기 직전에 멈췄다. 그의 주먹이 떨리고 있었다. 분노가 아니라 두려움으로.'),
  {
    text: '그는 자신을 막고 있었다. 아가사를 향한 것이 아니라, 자기 자신을 향해.',
    speaker: 'narr',
    id: 'ch2.c4',
    choices: [
      { label: '손을 내민다.', nextNode: 'ch2.g4a', fascinationDelta: 1, routeAffinityDelta: { go: 2 }, setFlags: ['go_hand'] },
      { label: '한 걸음 뒤로 물러난다.', nextNode: 'ch2.g4b', suspicionDelta: 1 },
    ],
  },
  R('……말만 해. 뭐든지.', { id: 'ch2.g4a', nextNode: 'ch2.m', expression: 'sad', event: { type: 'unlockMask', mask: 'go1' } }),
  R('…그래. 그게 맞아. 도망쳐.', { id: 'ch2.g4b', nextNode: 'ch2.m', expression: 'sad', event: { type: 'unlockMask', mask: 'go1' } }),
  N('복도의 거울이 깨져 있었다. 아가사는 네 개의 서로 다른 얼굴이 하나의 거울 속에서 겹쳤다 갈라지는 것을 보았다.', { id: 'ch2.m', background: 'corridor', character: 'roy', expression: 'neutral', fx: ['nameGlitch'] }),
  { text: '', speaker: 'narr', id: 'ch2.board', event: { type: 'board', need: ['d_faces'] }, nextNode: 'ch2.n' },
  A('당신은 한 사람이 아니군요. 한 사람인 척하는, 여러 개의 얼굴.', { id: 'ch2.n', expression: 'neutral' }),
  R('어느 얼굴이 마음에 들죠, 아가사. 화려한 가면 속에 숨긴 마음, 화려한 가면 속에 숨긴 상처. 당신이 고르는 얼굴이, 이 이야기의 다음 장이 될 거예요.', { fx: ['voice'] }),
  {
    text: '아가사는 거울 속의 얼굴들을 하나씩 바라보았다. 어느 것을 따라갈 것인가. 이 선택이 다음 장을 정한다.',
    speaker: 'narr',
    id: 'ch2.pick',
    choices: [
      { label: '서재에서 무릎 꿇은, 정중한 얼굴.', nextNode: 'ch2.go', routeAffinityDelta: { jak: 3 }, fascinationDelta: 1 },
      { label: '찻잔을 미리 놓아 둔, 차분한 얼굴.', nextNode: 'ch2.go', routeAffinityDelta: { bum: 3 }, suspicionDelta: 1 },
      { label: '열을 재 주던, 다정한 얼굴.', nextNode: 'ch2.go', routeAffinityDelta: { sot: 3 }, fascinationDelta: 1 },
      { label: '문 앞에서 멈춘, 거친 얼굴.', nextNode: 'ch2.go', routeAffinityDelta: { go: 3 }, fascinationDelta: 1 },
    ],
  },
  { text: '', speaker: 'narr', id: 'ch2.go', event: { type: 'routeDecide' } },
])
