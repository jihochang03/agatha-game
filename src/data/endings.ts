import type { EndingDef } from '../engine/types'

export const ENDINGS: EndingDef[] = [
  { id: 'jak_dark', route: 'jak', kind: 'dark', title: '그림자의 연인', sub: '작로이 — 다크 엔딩',
    epilogue: ['아가사는 그의 손을 잡고 마지막 장을 함께 썼다. 잉크는 붉었고, 필체는 어느새 두 사람의 것이 구분되지 않았다.', '호텔의 시계가 다시 움직이기 시작했을 때, 복도에는 두 개의 그림자가 하나의 불빛 아래 겹쳐 있었다. 한 쪽 그림자만이 웃고 있었다.'],
    last: '"설령 그 끝이 지옥일지라도." — 그것이 사랑의 문장이었는지, 복종의 문장이었는지, 이제 아무도 읽지 못한다.' },
  { id: 'jak_happy', route: 'jak', kind: 'happy', title: '마지막 원고', sub: '작로이 — 해피 엔딩',
    epilogue: ['아가사는 펜을 빼앗지 않았다. 다만 자신의 손에 다시 쥐었다. 그는 한 걸음 물러섰고, 처음으로 그가 아가사의 허락을 기다렸다.', '그녀가 쓴 결말에는 복수도, 파멸도 없었다. 분노는 문장으로 남았고, 문장은 그녀의 것으로 남았다.'],
    last: '그림자는 사라지지 않았다. 다만 이제, 빛을 쥔 사람이 누구인지 알고 있을 뿐이다.' },
  { id: 'bum_dark', route: 'bum', kind: 'dark', title: '예정된 사랑', sub: '범로이 — 다크 엔딩',
    epilogue: ['아가사는 모든 것이 설계되었음을 알면서도 남았다. 이미 놓여 있는 찻잔을 들고, 그가 열어 둔 문으로 걸어 들어갔다.', '선택이었다고 그녀는 믿는다. 그가 먼저 준비해 둔 선택지 가운데 하나였다는 사실을 제외하면.'],
    last: '"난 아무것도 하지 않았어요." 그 말은 이제 사실이다. 그가 할 일은 이미 끝났으니까.' },
  { id: 'bum_happy', route: 'bum', kind: 'happy', title: '설계자의 실수', sub: '범로이 — 해피 엔딩',
    epilogue: ['설계는 완벽했다. 단 하나, 아가사가 설계의 마지막 장을 읽었다는 점만 제외하면.', '그녀는 초대장의 날짜를 고쳐 쓰고, 그가 준비한 문으로 되돌아 나왔다. 그가 처음으로 먼저 열어 주지 않은 문이었다.'],
    last: '문밖에서 그가 웃었다. 졌다는 듯이, 혹은 이것조차 예상했다는 듯이.' },
  { id: 'sot_dark', route: 'sot', kind: 'dark', title: '영원한 오후', sub: '솧로이 — 다크 엔딩',
    epilogue: ['호텔의 시계는 네 시 십 분에서 영원히 멈췄다. 찻잔은 식지 않았고, 창밖의 비는 그치지 않았다.', '두 사람은 평온했다. 아주 평온해서, 아무도 더 이상 나가고 싶다고 말하지 않았다.'],
    last: '"이거… 꿈은 아니겠죠." 아가사는 대답하지 않았다. 대답하면 깨어날 것을 알았으므로.' },
  { id: 'sot_happy', route: 'sot', kind: 'happy', title: '한 줌의 빛', sub: '솧로이 — 해피 엔딩',
    epilogue: ['두 사람은 서로의 손을 놓았다. 그리고 놓은 손으로 문을 밀었다. 소유하지 않는 법은, 가장 어려운 다정함이었다.', '문밖에는 오후가 아닌 아침이 있었다. 그의 어둠은 옅어진 것이 아니라, 처음으로 이름을 얻었다.'],
    last: '그가 말했다. "이제 열이 없어요." 아가사는 웃었다. 열이 있었던 것은 처음부터 그쪽이었다고.' },
  { id: 'go_dark', route: 'go', kind: 'dark', title: '마지막 문지기', sub: '고로이 — 다크 엔딩',
    epilogue: ['그는 아가사를 출구까지 데려다 주었다. 그리고 문턱에서 멈췄다. 이번에는 그가 손을 내밀지 않았다.', '문이 닫히는 소리와 함께, 미궁은 다시 호흡을 시작했다. 안쪽에서, 아주 낮게, 이름을 부르는 소리가 들렸다.'],
    last: '"널 지킬 수 있다면 내가 어떤 놈이 돼도 상관없어." — 그는 약속을 지켰다. 아가사만이 약속을 용서하지 못했다.' },
  { id: 'go_happy', route: 'go', kind: 'happy', title: '미궁의 심장', sub: '고로이 — 해피 엔딩',
    epilogue: ['아가사는 괴물을 인간으로 만들려 하지 않았다. 괴물인 채로, 그의 손을 잡았다.', '지도에는 없는 출구가 두 사람 앞에 열렸다. 길을 아는 사람이 아니라, 함께 길을 쓰는 사람만이 찾을 수 있는 문이었다.'],
    last: '"곁에 있어 줘, 아가사." 그녀가 답했다. "내가 쓴 이야기니까, 내가 곁에 있을게."' },
  { id: 'true', route: 'truth', kind: 'true', title: '마지막 문장은 내가 쓴다', sub: 'TRUE ENDING',
    epilogue: ['아가사는 네 개의 가면을 모두 불러 세워 놓고 말했다. 당신들은 나의 일부일 수도, 나를 사랑한 타인일 수도 있다고.', '그녀는 어느 쪽도 확정하지 않았다. 다만 펜을 쥐었다. 분노도, 집착도, 구원받고 싶은 마음도, 살아남으려는 본능도 모두 자신의 문장 안에 거두었다.'],
    last: '이 이야기의 마지막 문장은, 이제 내가 쓴다.' },
  { id: 'tragic', route: 'hidden', kind: 'tragic', title: '그가 쓴 마지막 장', sub: '숨겨진 비극 엔딩',
    epilogue: ['아가사는 펜을 내려놓았다. 네 개의 목소리가 동시에 말했다. "쓸게요", "쓸게", "써요", "쓸게요."', '마지막 장은 아름다웠다. 그리고 그 결말에는 아가사라는 이름이 없었다. 이야기는 끝났고, 이야기를 쓴 사람만 남지 않았다.'],
    last: '둘 중 하나는 죽어야 끝나는 이야기였다. 죽은 쪽은, 쓰기를 포기한 쪽이었다.' },
]

export const ENDING_BY_ID = Object.fromEntries(ENDINGS.map((e) => [e.id, e])) as Record<string, (typeof ENDINGS)[number]>
export const ROUTE_ENDINGS: Record<string, string[]> = {
  jak: ['jak_dark', 'jak_happy'],
  bum: ['bum_dark', 'bum_happy'],
  sot: ['sot_dark', 'sot_happy'],
  go: ['go_dark', 'go_happy'],
}

/** 원작 대사일 가능성이 있는 문구. 공개 배포 전 사용 권한 확인용. */
export const QUOTE_REGISTRY: { text: string; status: 'needs-clearance'; usedIn: string }[] = [
  { text: '다른 길은 없어. 괴물과 싸우거나, 먹혀 죽거나.', status: 'needs-clearance', usedIn: 'title/copy' },
  { text: '둘 중 하나가 죽어야 끝나는 게임.', status: 'needs-clearance', usedIn: 'title/copy' },
  { text: '당신이 진짜 쓰고 싶었던 건 처절하고 잔혹한 복수극이었잖아.', status: 'needs-clearance', usedIn: 'jak' },
  { text: '당신이 쓸 수 없다면 내가 쓸게.', status: 'needs-clearance', usedIn: 'jak/tragic' },
  { text: '눈을 감아. 그리고 노랠 들어. 표정이 보이지 않게.', status: 'needs-clearance', usedIn: 'bum' },
  { text: '아름답지 않아요? 사람들이 독에 빠져드는 모습.', status: 'needs-clearance', usedIn: 'jak' },
  { text: '살인을 무슨 사랑 이야기처럼 하네요. / 뭐가 다르죠? / 비슷하죠. 사랑이 배신으로 변하면.', status: 'needs-clearance', usedIn: 'ch4' },
  { text: '화려한 가면 속에 숨긴 마음. 화려한 가면 속에 숨긴 상처.', status: 'needs-clearance', usedIn: 'ch2' },
]
