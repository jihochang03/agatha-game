import { A, N, R, build } from './dsl'

const T = 'TRUE — 다섯 번째 문'

export const truth = build('truth', T, 'truth', [
  N('네 개의 문을 모두 지나온 사람의 앞에만 나타나는 문이 있었다. 다섯 번째 문. 문고리는 펜대의 모양을 하고 있었다.', { chapter: T, background: 'void', character: null, fx: ['horror'] }),
  N('문 너머는 방이 아니라, 아직 쓰이지 않은 페이지였다. 그 한가운데 네 개의 의자가 놓여 있었다. 네 명의 로이가, 같은 얼굴로 앉아 있었다.'),
  R('나는 당신의 그림자예요, 아가사. 당신이 말하지 못한 분노가 얻은 목소리죠.', { character: 'jak', expression: 'smile', fx: ['nameGlitch'] }),
  R('다음 장을 써요. 혼자 말고, 나와 함께. 난 아무것도 하지 않았어요. 다만 기다렸을 뿐이죠.', { character: 'bum', expression: 'smile' }),
  R('이거… 꿈은 아니겠죠. 나는 당신의 온기에서 태어난 것 같아요.', { character: 'sot', expression: 'blush' }),
  R('곁에 있어 줘. 괴물은, 네가 쓴 거야.', { character: 'go', expression: 'sad' }),
  A('당신들은… 내가 쓴 것들인가요. 분노, 집착, 구원받고 싶은 마음, 살아남으려는 본능.', { character: 'roy', expression: 'neutral' }),
  R('그럴 수도 있어요. 그 해석이 가장 편하죠. 당신이 쓴 이야기니까, 당신이 책임지면 되니까.', { character: 'jak', expression: 'smile', echo: 'm3' }),
  R('하지만 그렇지 않을 수도 있어요. 증명할 수 없잖아요. 당신이 쓰지 않은 것을 내가 아는 이유를.', { character: 'bum', expression: 'neutral' }),
  A('예를 들면?'),
  R('당신은 컵을 왼손으로 잡아요. 겁이 날 때는 오른손으로 옮기고. 원고 어디에도, 그런 문장은 없었죠.', { character: 'sot', expression: 'worry' }),
  A('(없다. 그런 문장은 어디에도 없다. 그는 나의 일부인가, 나를 오래 지켜본 사람인가. 둘 다 사실일 수도 있고, 어느 쪽도 사실이 아닐 수도 있다.)', { character: 'roy', echo: 'm1' }),
  N('그 질문은 끝내 풀리지 않을 것이다. 그가 나를 사랑한 걸까, 아니면 내가 그를 사랑하도록 만든 걸까. 아가사는 이 질문 앞에서, 처음으로 답을 정하지 않기로 했다.'),
  R('아가사. 마지막 장이에요. 둘 중 하나는 죽어야 끝나는 이야기. 당신은 누구를 죽일 건가요?', { character: 'roy', expression: 'neutral', fx: ['voice'] }),
  A('아무도.'),
  R('그건 규칙에 없는데요.', { character: 'bum', expression: 'smile' }),
  A('규칙을 쓴 사람이 나예요. 고칠 수 있어요.'),
  N('네 개의 의자가 동시에 가만히 숨을 죽였다. 백지 위에 펜이 놓여 있었다. 아가사는 그 펜이 하나의 손이 아니라 다섯 개의 손 사이에 놓여 있다는 것을 알았다.'),
  R('쓸게요.', { character: 'jak' }),
  R('쓸게요.', { character: 'bum' }),
  R('써요.', { character: 'sot' }),
  R('쓸게.', { character: 'go' }),
  {
    text: '펜은 하나다. 누가 마지막 장을 쓸 것인가.',
    speaker: 'narr',
    id: 'truth.final',
    character: 'roy',
    choices: [
      { label: '펜을 쥔다. "이 이야기의 마지막 문장은, 내가 쓴다."', nextNode: 'truth.t', conditions: { deductions: ['d_faces'] }, hint: '네 개의 얼굴을 연결한 추리가 필요하다' },
      { label: '펜을 내려놓는다. 그들이 쓰도록 맡긴다.', nextNode: 'truth.x', fascinationDelta: 2 },
    ],
  },
  N('아가사는 펜을 쥐었다. 네 개의 로이가 한 명씩 일어나, 아가사의 손 위에 자신의 손을 얹었다가 — 거두었다. 압박이 아니라 인정이었다.', { id: 'truth.t' }),
  A('분노는 내 문장이에요. 집착도, 구원받고 싶은 마음도, 살아남으려는 본능도. 당신들은 나를 사랑했을 수도, 내가 만든 것일 수도 있어요. 하지만 이제 그건, 내가 쓰는 이야기예요.', { character: 'roy', expression: 'neutral' }),
  R('…그렇군요. 처음 만났을 때와 같은 눈을 하고 있어요, 아가사. 다만 이번에는 당신이 먼저 나를 봐 주네요.', { expression: 'smile', event: { type: 'ending', id: 'true' } }),
  N('아가사는 펜을 내려놓았다. 편안했다. 아주 오래 쥐고 있던 것을 내려놓은 느낌이었다. 네 개의 목소리가 동시에 일어나 마지막 장을 쓰기 시작했다.', { id: 'truth.x' }),
  R('걱정 말아요. 아름답게 써 줄게요.', { event: { type: 'ending', id: 'tragic' } }),
])
