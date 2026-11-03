import type { EvidenceDef, Deduction, LocationDef, RouteId } from '../engine/types'

export const EVIDENCE: EvidenceDef[] = [
  { id: 'manuscript', name: '찢어진 원고', icon: '📜', where: '서재', desc: '「미궁 속의 티타임」. 가장자리가 그을린 원고. 아가사의 필체지만, 아가사는 이 부분을 쓴 기억이 없다.' },
  { id: 'letter', name: '오래된 편지', icon: '✉', where: '서재', desc: '"그날 하이드로 호텔에서 기다리겠습니다." 서명은 아가사. 날짜는 아직 오지 않은 날이다.' },
  { id: 'handkerchief', name: '붉은 잉크의 손수건', icon: '🩸', where: '객실', desc: '피가 아니라 잉크다. 그러나 잉크라 하기엔 너무 오래 마르지 않았다.' },
  { id: 'mirror', name: '깨진 거울', icon: '🪞', where: '복도', desc: '금박 틀 속의 거울. 조각마다 비치는 남자의 표정이 서로 다르다.' },
  { id: 'register', name: '지워진 객실 명부', icon: '📖', where: '객실', desc: '이름이 잉크로 지워진 명부. 지워진 이름의 자리만 종이가 눌려 있다.' },
  { id: 'watch', name: '멈춘 회중시계', icon: '⏱', where: '응접실', desc: '네 시 십 분에서 멈춘 시계. 뒤판에 "A.에게"라고 새겨져 있다.' },
  { id: 'rose', name: '검은 장미', icon: '🥀', where: '정원', desc: '가시마다 이름표 같은 종이 조각이 매여 있다.' },
  { id: 'cup', name: '빈 찻잔', icon: '🍵', where: '응접실', desc: '아직 따뜻한 빈 찻잔. 바닥에 쓴 향이 고여 있다. 만지면 어떤 오후가 떠오른다.' },
  { id: 'mask', name: '가면', icon: '🎭', where: '객실', desc: '눈구멍 안쪽이 닳아 있다. 오래, 자주 쓴 가면이다. 누구의 얼굴에 맞춘 것인지 알 수 없다.' },
  { id: 'map', name: '미궁의 지도', icon: '🗺', where: '지하실', desc: '호텔의 평면도처럼 보이지만 복도가 안쪽으로 계속 말려 들어간다. 중심에 "마지막 장"이라 적혀 있다.' },
  { id: 'testimony', name: '로이의 증언', icon: '💬', where: '대화', desc: '"사고는 새벽 세 시에 있었죠. 모두가 잠든 시간에."' },
]

export const DEDUCTIONS: Deduction[] = [
  { id: 'd_names', a: 'manuscript', b: 'register', title: '원고 속 이름', text: '원고 속 피해자의 이름과 지워진 투숙객의 이름이 일치한다. 아가사가 쓴 것은 상상이 아니라 기록이거나, 예고였다.' },
  { id: 'd_time', a: 'watch', b: 'testimony', title: '어긋난 시간', text: '로이는 새벽 세 시라 했다. 시계는 네 시 십 분에서 멈췄다. 사건은 한 번이 아니었거나, 로이가 거짓을 말하고 있다.' },
  { id: 'd_poison', a: 'cup', b: 'handkerchief', title: '잉크와 독', text: '찻잔의 잔류물과 손수건의 붉은 잉크는 같은 것이다. 독은 약이 아니라 글로 만들어졌다.' },
  { id: 'd_faces', a: 'mirror', b: 'mask', title: '하나의 얼굴, 네 개의 가면', text: '거울 조각 속 네 표정은 가면 안쪽의 닳은 자국과 일치한다. 로이는 한 사람이 아닌 방식으로 존재한다.' },
  { id: 'd_invite', a: 'letter', b: 'map', title: '초대장의 필체', text: '편지의 필체는 아가사 본인의 것이고, 지도의 중심이 가리키는 곳은 편지가 약속한 장소다. 이 호텔에 그녀를 부른 것은 그녀 자신이다.' },
  { id: 'd_missing', a: 'rose', b: 'register', title: '사라진 투숙객', text: '검은 장미의 이름표는 명부에서 지워진 이름들이다. 사라진 사람들은 이 정원에 "피어" 있다.' },
]

export const LOCATIONS: LocationDef[] = [
  { id: 'study', name: '서재', bg: 'study', x: 24, y: 24, intro: '촛불이 일렁이는 서재. 책등마다 아가사의 이름이 있지만, 그녀가 쓴 적 없는 제목들이다.',
    objects: [
      { id: 'o_desk', label: '불에 그을린 원고', x: 30, y: 62, evidence: 'manuscript', text: '책상 위에 찢어진 원고가 놓여 있다. 「미궁 속의 티타임」. 낯익은 필체가 마지막 문단에서 낯설게 흔들린다.' },
      { id: 'o_drawer', label: '잠긴 서랍', x: 68, y: 70, evidence: 'letter', text: '서랍은 열쇠도 없이 열렸다. 아가사의 서명이 있는 편지가 한 통. 날짜는 아직 오지 않았다.' },
      { id: 'o_book', label: '빈 책장', x: 50, y: 40, text: '한 칸만 비어 있다. 먼지의 모양이 책 한 권의 크기와 같다. 아가사의 손바닥보다 작다.' },
    ] },
  { id: 'parlor', name: '응접실', bg: 'parlor', x: 55, y: 30, intro: '짙은 벨벳과 와인빛 카펫. 탁자에는 방금 누군가 앉았다 일어난 듯 찻잔이 놓여 있다.',
    objects: [
      { id: 'o_cup', label: '빈 찻잔', x: 40, y: 66, evidence: 'cup', text: '찻잔은 아직 따뜻하다. 바닥에 고인 향이 누군가의 오후를 불러온다.' },
      { id: 'o_watch', label: '벽난로 위 시계', x: 72, y: 40, evidence: 'watch', text: '회중시계는 네 시 십 분. 초침만이 거꾸로 돌고 있다.' },
      { id: 'o_fire', label: '꺼진 벽난로', x: 20, y: 60, text: '재 속에서 종이 한 귀퉁이가 타다 말았다. "……누가 죽어야 이야기가 끝나는가."' },
    ] },
  { id: 'corridor', name: '복도', bg: 'corridor', x: 40, y: 52, intro: '끝없이 이어지는 달빛 복도. 같은 액자, 같은 창, 같은 발소리.',
    objects: [
      { id: 'o_mirror', label: '금박 거울', x: 50, y: 48, evidence: 'mirror', text: '거울은 한쪽 모서리가 깨져 있다. 파편마다 다른 표정의 남자가 서 있다. 돌아보면 아무도 없다.' },
      { id: 'o_window', label: '아치형 창', x: 82, y: 40, text: '창밖은 달이 아니라 어떤 장면 같다. 같은 복도를 지나올 때마다 창밖의 그림이 조금씩 달라진다.' },
    ] },
  { id: 'room', name: '객실', bg: 'room', x: 70, y: 56, intro: '문패가 없는 객실. 번호는 1, 3, 1, 3… 어느 문을 열어도 같은 방이다.',
    objects: [
      { id: 'o_bed', label: '침대 위의 가면', x: 40, y: 64, evidence: 'mask', text: '베개 위에 가면이 얹혀 있다. 눈구멍 안쪽의 닳은 자국이, 몇 개의 서로 다른 눈 모양을 하고 있다.' },
      { id: 'o_hk', label: '붉은 손수건', x: 70, y: 74, evidence: 'handkerchief', text: '화장대 위의 손수건. 붉은 잉크가 아직 젖어 있다.' },
      { id: 'o_reg', label: '객실 명부', x: 22, y: 50, evidence: 'register', text: '명부는 이름이 잉크로 지워져 있다. 지워진 자리만 종이가 눌려 있어, 손끝으로 읽을 수 있다.' },
    ] },
  { id: 'garden', name: '정원', bg: 'garden', x: 25, y: 70, intro: '안개가 낮게 깔린 온실 정원. 철제 아치 아래 검은 장미가 피어 있다.',
    objects: [
      { id: 'o_rose', label: '검은 장미', x: 50, y: 62, evidence: 'rose', text: '장미 가시마다 이름표 같은 종이가 매여 있다. 이름은 읽히기 직전에 번진다.' },
      { id: 'o_bench', label: '젖은 벤치', x: 78, y: 70, text: '벤치 위에 찻잔 두 개의 자국. 하나는 마른 지 오래고, 하나는 이제 막 놓였다.' },
    ] },
  { id: 'cellar', name: '지하실', bg: 'cellar', x: 75, y: 82, intro: '계단은 내려갈수록 길어진다. 벽에는 분필로 그은 미로의 선들이 있다.',
    objects: [
      { id: 'o_map', label: '벽의 지도', x: 50, y: 50, evidence: 'map', text: '호텔의 평면도 같지만 복도가 안쪽으로 말려 들어간다. 중심에 적힌 말: 「마지막 장」.' },
      { id: 'o_door', label: '잠긴 문', x: 80, y: 62, text: '문 너머에서 누가 낮게 숨을 고른다. 아가사가 한 걸음 다가서면, 숨소리가 멎는다.' },
    ] },
]

export const MANUSCRIPT: { id: string; text: string }[] = [
  { id: 'm1', text: '그녀는 오래된 호텔의 소파에서 눈을 떴다. 맞은편에는 이름을 모르는 남자가 앉아 있었다.' },
  { id: 'm2', text: '찻잔에 독을 넣는 손은 떨리지 않았다. 떨린 것은 그것을 지켜보던 마음이었다.' },
  { id: 'm3', text: '그는 모든 것을 알고 있었다. 그녀가 쓰지 않은 문장까지도.' },
  { id: 'm4', text: '사랑이 배신으로 변하는 순간을 그녀는 정확히 안다. 소리가 없기 때문이다.' },
  { id: 'm5', text: '괴물은 문 뒤에서 기다렸다. 이름을 불러 주는 사람이 오기를.' },
  { id: 'm6', text: '마지막 장에서 둘 중 하나는 죽어야 했다. 그녀는 아직 누구인지 쓰지 못했다.' },
]

export const ROUTE_NAME: Record<RouteId, string> = { jak: '작로이', bum: '범로이', sot: '솧로이', go: '고로이' }
export const ROUTE_TITLE: Record<RouteId, string> = { jak: '당신의 그림자', bum: '오래 기다린 남자', sot: '당신에게만 빛을 구하는 남자', go: '미궁의 괴물' }
export const ROUTE_COLOR: Record<RouteId, string> = { jak: '#7a5a9a', bum: '#3f6f7a', sot: '#c9a96a', go: '#8a2f3a' }

export const MASKS: Record<RouteId, { id: string; label: string; text: string }[]> = {
  jak: [
    { id: 'jak1', label: '말투', text: '항상 정중한 존댓말. 낮고 부드럽다. 몰아붙이지 않고, 스스로 선택했다고 믿게 만든다.' },
    { id: 'jak2', label: '사랑의 방식', text: '당신의 어둠을 긍정함으로써 사랑한다. 그것이 다정함인지 부추김인지는, 듣는 사람이 판단해야 한다.' },
    { id: 'jak3', label: '그의 정체', text: '아가사가 억압한 분노와 복수의 욕망이 얻은 목소리. 혹은, 그 글을 처음부터 지켜본 독자.' },
  ],
  bum: [
    { id: 'bum1', label: '말투', text: '차분한 존댓말, 그리고 질문. 기억나지 않는 일을 이미 아는 사람처럼 묻는다.' },
    { id: 'bum2', label: '사랑의 방식', text: '원하기 전에 준비해 둔다. 배려와 감시의 경계는 언제나 한 걸음이다.' },
    { id: 'bum3', label: '그의 정체', text: '통제와 집착의 욕망이 얻은 형상. 혹은, 아가사가 직접 부른 오래된 약속.' },
  ],
  sot: [
    { id: 'sot1', label: '말투', text: '부드럽고 솔직한 존댓말. 말끝에 망설임과 숨 고르기가 많다.' },
    { id: 'sot2', label: '사랑의 방식', text: '곁에 있는 것만으로 구원받는다고 믿는다. 구원받고 싶은 마음이 누구의 것인지는 모호하다.' },
    { id: 'sot3', label: '그의 정체', text: '구원받고 싶은 욕망이 입은 사람의 모습. 혹은, 시간이 멈추기를 바란 아가사의 마음.' },
  ],
  go: [
    { id: 'go1', label: '말투', text: '짧고 직접적인 반말. 감정이 고조될수록 문장이 짧아진다.' },
    { id: 'go2', label: '사랑의 방식', text: '가까이 다가왔다가 마지막 순간에 멈춘다. 상처 입힐까 두려워하는 괴물.' },
    { id: 'go3', label: '그의 정체', text: '파괴와 생존의 본능이 얻은 몸. 혹은, 아가사가 쓴 괴물이 그녀 곁에 남기로 한 모습.' },
  ],
}

export const ROMANCE_TITLES: Record<RouteId, [string, string, string]> = {
  jak: ['무릎 꿇은 그림자', '지워지는 문장', '마지막 원고의 약속'],
  bum: ['이미 놓여 있던 찻잔', '열려 있던 문', '다음 장을 함께'],
  sot: ['열을 재는 손', '뺨을 기대는 온기', '꿈이 아니기를'],
  go: ['멈춘 손끝', '내민 손', '미궁에 혼자 두지 마'],
}
