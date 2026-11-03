import { A, N, R, build } from './dsl'

const C3 = 'CHAPTER 03 — 미궁 속의 티타임'
const C4 = 'CHAPTER 04 — 사랑과 배신'
const C5 = 'CHAPTER 05 — 마지막 장'

export const bum = build('bum', C3, 'bum', [
  N('응접실에는 두 개의 찻잔이 놓여 있었다. 하나는 김이 오르고 있었고, 하나는 이미 식어 있었다. 어느 쪽이 아가사의 것인지, 로이는 묻지 않고도 알았다.', { chapter: C3, background: 'parlor', character: 'bum', expression: 'smile' }),
  R('당신, 기억 안 나요?'),
  R('우리가 여기 오기로 한 거. 당신이 나를 부른 거.', { fx: ['voice'] }),
  A('내가 나도 모르게 한 약속을, 어떻게 당신이 알고 있죠?', { expression: 'cold' }),
  R('질문이 좋네요. 그런데 그 질문에는 이미 답이 있어요. 당신이 먼저 알아차릴 거라고, 나는 생각했거든요.'),
  N('아가사는 서재의 서랍에서 꺼낸 편지를 펼쳤다. "그날 하이드로 호텔에서 기다리겠습니다." 서명은 아가사. 그러나 그날의 날짜는 아직 오지 않았다.', { echo: 'm3' }),
  A('이 편지는 내 필체예요. 그런데 날짜가 이상해요. 아직 오지 않은 날이죠.'),
  R('그 날짜가 언제라고 생각하죠?'),
  {
    text: '그는 대답 대신 질문을 되돌렸다. 아가사는 알았다. 이 사람은 언제나 질문 속에 답을 숨겨 둔다는 것을.',
    speaker: 'narr',
    id: 'bum.c1',
    choices: [
      { label: '편지를 그에게 내민다. 그의 해석을 듣는다.', nextNode: 'bum.c1a', fascinationDelta: 1, routeAffinityDelta: { bum: 1 } },
      { label: '편지를 주머니에 숨긴다.', nextNode: 'bum.c1b', suspicionDelta: 2, setFlags: ['bum_hid_letter'] },
      { label: '"누가 나에게 이 글을 쓰게 했죠?"', nextNode: 'bum.c1c', suspicionDelta: 1 },
    ],
  },
  R('고마워요, 보여 줘서. 나는 이걸 본 적이 있어요. 당신이 쓰는 동안에요.', { id: 'bum.c1a', nextNode: 'bum.m1' }),
  R('좋은 선택이에요. 숨겨야 할 것이 있다는 건, 지켜야 할 것이 있다는 뜻이니까요.', { id: 'bum.c1b', nextNode: 'bum.m1', expression: 'smile' }),
  R('난 아무것도 하지 않았어요. …그렇게 믿고 싶나요, 아니면 아니라고 믿고 싶나요?', { id: 'bum.c1c', nextNode: 'bum.m1', expression: 'neutral' }),
  N('차를 마시려 손을 뻗자 이미 찻잔이 가까이 와 있었다. 문을 열려고 하면 로이가 먼저 문을 열어 두었다. 불편은 없었다. 그것이 가장 이상했다.', { id: 'bum.m1' }),
  R('손이 시린가요? 벽난로를 켜 둘게요. …아, 이미 켜져 있었네요.', { event: { type: 'romance', route: 'bum', n: 1 }, expression: 'smile' }),
  N('찻잔을 쥔 아가사의 손가락에 로이의 손가락이 닿았다. 우연이라 하기엔 너무 정확한 위치였다.'),
  A('(세심하다. 다정하다. 그런데 이 다정함은 내가 필요로 하기 전에 이미 완성되어 있다.)'),
  { text: '', speaker: 'narr', id: 'bum.u2', event: { type: 'unlockMask', mask: 'bum2' } },
  N('호텔의 어느 문도 이제는 아가사 앞에서 닫혀 있지 않았다. 열려 있는 문마다 그녀가 좋아하는 것이 놓여 있었다. 아주 오래전부터 준비된 것처럼.', { chapter: C4, background: 'room', character: 'bum', expression: 'neutral' }),
  A('이 모든 것을, 얼마나 오래 준비한 거죠?'),
  R('오래요. 얼마나 오래인지는… 지금은 말하지 않는 편이 좋을 것 같아요.', { expression: 'worry' }),
  R('눈을 감아요. 그리고 노랠 들어요. 표정이 보이지 않게.', { fx: ['voice'] }),
  N('로이가 낮게 흥얼거리기 시작했다. 아가사가 어린 시절 좋아한 곡이었다. 이 노래를 아는 사람은 이 세상에 한 사람뿐이어야 했다.', { echo: 'm5' }),
  {
    text: '눈을 감으면 그의 표정은 보이지 않는다. 눈을 뜨면 그가 감추는 것이 보일지도 모른다.',
    speaker: 'narr',
    id: 'bum.c2',
    choices: [
      { label: '눈을 감고 노래를 듣는다.', nextNode: 'bum.c2a', fascinationDelta: 2, routeAffinityDelta: { bum: 2 }, setFlags: ['bum_closed'] },
      { label: '몰래 눈을 뜬다.', nextNode: 'bum.c2b', suspicionDelta: 2, setFlags: ['bum_peeked'] },
    ],
  },
  N('따뜻한 소리 속에서 시간이 천천히 풀렸다. 눈을 뜨자, 로이는 이미 노래를 멈추고 가만히 아가사를 바라보고 있었다. 그가 무슨 표정이었는지는, 끝내 알 수 없었다.', { id: 'bum.c2a', nextNode: 'bum.r2' }),
  N('틈새로 보였다. 로이의 손에 장부 한 권이 있었다. 아가사의 하루가 분 단위로 적혀 있었다. 오늘의 날짜 이후의 칸까지 이미 채워져 있었다. 아가사가 눈을 뜨자 그는 장부를 덮고 웃었다.', { id: 'bum.c2b', nextNode: 'bum.r2' }),
  R('난 당신을 가두지 않아요. 문은 언제든 열려 있으니까요. 다만 당신이 열기 전에, 내가 먼저 열어 둘 뿐이에요.', { id: 'bum.r2', expression: 'smile', event: { type: 'romance', route: 'bum', n: 2 } }),
  { text: '', speaker: 'narr', id: 'bum.u3', event: { type: 'unlockMask', mask: 'bum3' } },
  N('호텔의 가장 깊은 곳에서, 두 사람은 지도의 중심에 도착했다. 낯익은 방이었다. 그가 이 방에 처음 오는 것이라면, 이 방에 놓인 모든 것을 알 수는 없었을 것이다.', { chapter: C5, background: 'center', character: 'bum', expression: 'neutral' }),
  { text: '', speaker: 'narr', id: 'bum.b', event: { type: 'board', need: ['d_invite'] } },
  A('초대장의 필체는 내 것이에요. 그리고 지도의 중심이 가리키는 곳이 이 방이에요. 이 호텔에 나를 부른 건 나 자신이었죠. 하지만 날짜를 쓴 건…', { id: 'bum.b2' }),
  R('내가 쓰라고 한 날짜였죠. 아주 오래전에, 당신이 잠든 사이에. 나는 당신이 꿈속에서 쓰는 글자를 불러 주었어요.', { expression: 'sad' }),
  A('그건 설계예요. 사랑이 아니라.'),
  R('설계가 사랑이 될 수는 없나요? 나는 한 번도 당신에게 거짓을 말하지 않았어요. 다만, 말하지 않은 것이 많았을 뿐이죠.'),
  R('다음 장을 써요. 혼자 말고, 나와 함께.', { fx: ['voice'], event: { type: 'romance', route: 'bum', n: 3 } }),
  {
    text: '식은 찻잔과 김이 오르는 찻잔. 그 사이에, 초대장의 날짜 칸이 비어 있었다.',
    speaker: 'narr',
    id: 'bum.final',
    choices: [
      { label: '설계를 알면서도 그의 곁에 남는다.', nextNode: 'bum.d', fascinationDelta: 2 },
      { label: '초대장의 날짜를 내 손으로 고쳐 쓴다.', nextNode: 'bum.h', conditions: { deductions: ['d_invite'] }, hint: '초대장과 지도를 연결한 추리가 필요하다 (증거 조합: 초대장의 필체)' },
    ],
  },
  N('아가사는 날짜를 고치지 않았다. 이미 놓여 있는 찻잔을 들었다. 그것은 따뜻했다. 선택이라고, 그녀는 스스로에게 말했다.', { id: 'bum.d' }),
  R('고마워요. 난 아무것도 하지 않았어요. 당신이 스스로 선택한 거예요.', { expression: 'smile', event: { type: 'ending', id: 'bum_dark' } }),
  N('아가사는 펜을 들어 초대장의 날짜 위에 선을 그었다. 하나는 그녀가 지운 날짜였고, 다른 하나는 그가 불러 준 날짜였다. 그리고 그 위에, 오늘을 적었다.', { id: 'bum.h' }),
  A('설계는 훌륭했어요. 하지만 마지막 문장은 설계자가 쓰는 게 아니죠.'),
  R('…그렇군요. 처음이에요. 이걸 예상하지 못한 건.', { expression: 'shock', event: { type: 'ending', id: 'bum_happy' } }),
])
