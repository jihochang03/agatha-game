import { A, N, R, build } from './dsl'

const C3 = 'CHAPTER 03 — 미궁 속의 티타임'
const C4 = 'CHAPTER 04 — 사랑과 배신'
const C5 = 'CHAPTER 05 — 마지막 장'

export const sot = build('sot', C3, 'sot', [
  N('눈을 뜨자 객실의 천장이었다. 이마 위에는 젖은 수건이 얹혀 있었고, 침대 곁 의자에 로이가 앉아 있었다. 그는 잠들지 않았고, 아가사가 깨어난 것을 알아차리자 허둥지둥 몸을 일으켰다.', { chapter: C3, background: 'room', character: 'sot', expression: 'worry' }),
  R('아, 깨셨네요. 아직 열이 있으신데요.'),
  R('조금만 더 쉬어야 해요. 자, 이리 와요.', { id: 'sot.r1', expression: 'smile' }),
  N('그의 손이 아가사의 이마에 조심스럽게 얹혔다. 손바닥이 아주 약간 떨렸다. 열을 재는 사람이 아니라, 열이 사라지기를 비는 사람의 손이었다.', { event: { type: 'romance', route: 'sot', n: 1 }, fx: ['warm'] }),
  A('당신은… 얼마나 여기 있었죠?'),
  R('글쎄요. 하루인지, 백 일인지. 여기서는 오후가 끝나지 않아서요. 하지만 나쁘진 않아요. 아프지도 않고, 외롭지도 않고.', { expression: 'sad' }),
  N('창밖의 빛은 처음 눈을 떴을 때와 같았다. 시계는 네 시 십 분. 그러나 그의 얼굴에는 어렴풋한 피곤이 있었다. 아주 긴 오후를 보낸 사람처럼.', { echo: 'm4' }),
  {
    text: '그는 가만히 컵에 물을 따라 주었다. 아가사는 이 사람이 거짓을 말하는 법을 모른다는 것을, 이미 알고 있었다. 그럼에도, 무언가를 숨기고 있다는 것을.',
    speaker: 'narr',
    id: 'sot.c1',
    choices: [
      { label: '더 쉬겠다고 말한다. 그의 곁에서.', nextNode: 'sot.c1a', fascinationDelta: 2, routeAffinityDelta: { sot: 1 } },
      { label: '"이 시계는 왜 멈춰 있죠?"', nextNode: 'sot.c1b', suspicionDelta: 2, setFlags: ['sot_asked_time'] },
    ],
  },
  R('네. 그렇게 해요. 내가 지킬게요. 아무것도 당신을 아프게 하지 못하게.', { id: 'sot.c1a', nextNode: 'sot.m1', expression: 'smile' }),
  R('…그건, 나도 몰라요. 정말이에요. 다만 이 시계가 움직이는 날, 당신이 떠날 것 같아서… 만지지 못했어요.', { id: 'sot.c1b', nextNode: 'sot.m1', expression: 'sad' }),
  R('당신이 곁에 있으면, 내 안의 어둠이 조금은 옅어지는 것 같아요.', { id: 'sot.m1', expression: 'blush' }),
  { text: '', speaker: 'narr', id: 'sot.u2', event: { type: 'unlockMask', mask: 'sot2' } },
  N('안개가 낮게 깔린 정원. 로이는 검은 장미 앞에 쪼그려 앉아 물을 주고 있었다. 한 송이마다 이름표가 매여 있었다.', { chapter: C4, background: 'garden', character: 'sot', expression: 'sad' }),
  { text: '', speaker: 'narr', id: 'sot.b', event: { type: 'board', need: ['d_missing'] } },
  A('이 이름들은… 명부에서 지워진 투숙객들이에요. 사라진 사람들은, 이곳에 있었군요.', { id: 'sot.b2' }),
  R('…미안해요. 말하지 못했어요. 모두가 떠난 게 아니에요. 떠나려는 사람들을, 내가… 붙잡았어요. 오후가 끝나지 않기를 바랐으니까요.', { expression: 'sad' }),
  N('그의 어깨가 아주 조금 떨렸다. 어린 짐승이 자신의 이빨이 누군가를 다치게 한 사실을 알아차렸을 때처럼.'),
  A('나도 붙잡을 건가요?', { expression: 'cold' }),
  R('아니요. …아니, 모르겠어요. 하고 싶어요. 하지 않아야 하는데, 하고 싶어요. 그게 제일 무서워요.'),
  N('아가사는 손을 뻗어 그의 뺨에 닿았다. 로이는 움찔했다가, 이내 그 손에 조심스럽게 얼굴을 기댔다. 눈을 감고. 숨을 멈추고.', { event: { type: 'romance', route: 'sot', n: 2 }, fx: ['warm'], expression: 'blush' }),
  {
    text: '그의 사랑은 구원이었을까, 아니면 서로가 없으면 살아갈 수 없다는 두려움이었을까.',
    speaker: 'narr',
    id: 'sot.c2',
    choices: [
      { label: '"당신을 붙잡지 않을게요. 나도 붙잡히지 않을 거예요."', nextNode: 'sot.c2a', fascinationDelta: 1, routeAffinityDelta: { sot: 1 }, setFlags: ['sot_let_go'] },
      { label: '"곁에 있을게요. 어디도 가지 않을게요."', nextNode: 'sot.c2b', fascinationDelta: 2, routeAffinityDelta: { sot: 2 }, setFlags: ['sot_hold'] },
    ],
  },
  R('…그렇게 말해 줘서 고마워요. 조금 슬프지만, 이상하게 숨이 쉬어져요.', { id: 'sot.c2a', nextNode: 'sot.u3', expression: 'sad' }),
  R('정말요? 정말이죠? …이거 꿈은 아니겠죠.', { id: 'sot.c2b', nextNode: 'sot.u3', expression: 'blush' }),
  { text: '', speaker: 'narr', id: 'sot.u3', event: { type: 'unlockMask', mask: 'sot3' } },
  N('정원의 장미들이 일제히 고개를 돌렸다. 호텔의 중심에서, 시계가 아주 조금씩 움직이기 시작했다. 한 칸, 또 한 칸.', { chapter: C5, background: 'center', character: 'sot', expression: 'worry', fx: ['reverseClock'] }),
  R('시계가… 움직여요. 아, 안 돼요. 이러면 당신이 가버릴 것 같아서…', { expression: 'shock' }),
  A('나는 아직 여기 있어요.'),
  N('로이가 아가사의 손을 두 손으로 감싸 쥐었다. 두려움과 애틋함과 어린 소망이, 그의 손바닥 안에서 같은 온도로 섞여 있었다.', { event: { type: 'romance', route: 'sot', n: 3 } }),
  R('이거… 꿈은 아니겠죠. 당신이 곁에 있는 게. 꿈이라면, 깨고 싶지 않아요.', { expression: 'sad' }),
  {
    text: '오후는 끝나려 하고 있었다. 이곳에 머물면 평온이 있고, 나가면 아침이 있다.',
    speaker: 'narr',
    id: 'sot.final',
    choices: [
      { label: '호텔의 평온한 오후에 함께 머문다.', nextNode: 'sot.d', fascinationDelta: 2 },
      { label: '서로의 손을 놓고, 함께 문을 연다.', nextNode: 'sot.h', requiredFlags: ['sot_let_go'], hint: '그를 붙잡지 않겠다고 말했어야 한다' },
    ],
  },
  N('아가사는 시계의 뒤판을 손으로 덮었다. 초침이 멈췄다. 로이가 안도의 숨을 내쉬었다. 창밖의 비가 그쳤다가, 다시 내렸다. 같은 소리로.', { id: 'sot.d' }),
  R('고마워요. 영원히 곁에 있어 줄 거죠?', { expression: 'smile', event: { type: 'ending', id: 'sot_dark' } }),
  N('아가사는 그의 손을 놓았다. 그가 놀라 숨을 멈췄다. 그리고 놓은 손으로 문손잡이를 쥐었다. 둘이 함께, 하나의 문을 밀었다.', { id: 'sot.h' }),
  R('…손을 놓았는데, 따뜻해요. 이상하죠.', { expression: 'blush' }),
  A('놓아야 잡을 수 있는 게 있어요. 그건 서로의 얼굴이에요.', { event: { type: 'ending', id: 'sot_happy' } }),
])
