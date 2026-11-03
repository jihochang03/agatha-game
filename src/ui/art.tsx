import { useEffect, useRef, useState } from 'react'
import type { Expr, RouteId } from '../engine/types'

/**
 * 에셋 규칙
 *  - 캐릭터: public/assets/char/{agatha|roy}_{expr}.png  (700x940 투명 PNG, 발 기준선 통일 — 전처리 완료)
 *  - 배경:   public/assets/bg/{id}.jpg|png 를 BG_IMAGES 에 등록하면 절차적 배경 대신 사용된다.
 */
export const BG_IMAGES: Record<string, string> = {}
const EXPRS: Expr[] = ['neutral', 'smile', 'blush', 'cold', 'shock', 'worry', 'sad']
export const charSrc = (who: 'agatha' | 'roy', expr: Expr) => `${import.meta.env.BASE_URL}assets/char/${who}_${EXPRS.includes(expr) ? expr : 'neutral'}.png`

export const ROY_GLOW: Record<'roy' | RouteId, string> = { roy: '#9aa3b5', jak: '#8a63b5', bum: '#4aa0b0', sot: '#d9b463', go: '#b23a48' }

/** 표정이 바뀔 때 이전 이미지 위로 새 이미지가 짧게 크로스페이드된다. */
export function Figure({ who, expr, tint = '#9aa3b5', lit, warm }: { who: 'agatha' | 'roy'; expr: Expr; tint?: string; lit: number; warm?: boolean }) {
  const src = charSrc(who, expr)
  const [layers, setLayers] = useState<{ src: string; k: number }[]>([{ src, k: 0 }])
  const k = useRef(0)
  useEffect(() => {
    setLayers((l) => (l[l.length - 1].src === src ? l : [...l.slice(-1), { src, k: ++k.current }]))
    const t = setTimeout(() => setLayers((l) => l.slice(-1)), 380)
    return () => clearTimeout(t)
  }, [src])
  return (
    <div className="relative h-full w-full" style={{ filter: `brightness(${lit}) saturate(${0.78 + lit * 0.2}) ${warm ? 'sepia(.18)' : ''}`, transition: 'filter .5s' }}>
      {/* 바닥 그림자 */}
      <div className="absolute bottom-[3.5%] left-1/2 h-[3%] w-[46%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-md" />
      <div className="absolute inset-x-[8%] bottom-[18%] top-[8%] rounded-full opacity-25 blur-3xl" style={{ background: tint }} />
      {layers.map((l, i) => (
        <img key={l.k} src={l.src} alt="" draggable={false}
          className={`absolute inset-0 h-full w-full object-contain object-bottom ${i === layers.length - 1 && layers.length > 1 ? 'fig-in' : ''}`} />
      ))}
    </div>
  )
}

/* ───────────── 절차적 배경 ───────────── */

type Rect = [number, number, number, number]
interface RoomCfg { back: Rect; wall: string; wall2: string; floor: string; ceil: string; trim: string }

const ROOMS: Record<string, RoomCfg> = {
  lobby: { back: [520, 260, 1080, 660], wall: '#1d2438', wall2: '#141a29', floor: '#2b1520', ceil: '#0f1320', trim: '#8c7650' },
  study: { back: [440, 220, 1160, 690], wall: '#2a1b1c', wall2: '#1a1214', floor: '#2a1812', ceil: '#120d0e', trim: '#8c7650' },
  parlor: { back: [480, 240, 1120, 670], wall: '#3a1822', wall2: '#24101a', floor: '#2f1219', ceil: '#150b11', trim: '#9a8258' },
  corridor: { back: [660, 340, 940, 560], wall: '#1a2236', wall2: '#101626', floor: '#2d1621', ceil: '#0d111c', trim: '#8c7650' },
  hall: { back: [600, 300, 1000, 600], wall: '#18203a', wall2: '#0f1526', floor: '#3a121e', ceil: '#0a0e1a', trim: '#8c7650' },
  room: { back: [430, 240, 1170, 690], wall: '#26222f', wall2: '#181620', floor: '#2b1a20', ceil: '#100e16', trim: '#8c7650' },
  cellar: { back: [610, 330, 990, 620], wall: '#1b1d24', wall2: '#101218', floor: '#16151a', ceil: '#0b0c10', trim: '#4a4a52' },
  center: { back: [560, 300, 1040, 620], wall: '#2a1424', wall2: '#180c18', floor: '#1c1020', ceil: '#0b0912', trim: '#9a8258' },
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
/** 왼쪽 벽면 위의 점 (t: 0=앞 1=뒤, h: 0=천장 1=바닥) */
const leftPt = (c: RoomCfg, t: number, h: number): [number, number] => {
  const [x0, y0, , y1] = c.back
  const top = lerp(0, y0, t), bot = lerp(900, y1, t)
  return [lerp(0, x0, t), lerp(top, bot, h)]
}
const rightPt = (c: RoomCfg, t: number, h: number): [number, number] => {
  const [, y0, x1, y1] = c.back
  const top = lerp(0, y0, t), bot = lerp(900, y1, t)
  return [lerp(1600, x1, t), lerp(top, bot, h)]
}
const poly = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ')

function archWindow(side: 'l' | 'r', c: RoomCfg, t0: number, t1: number, h0: number, h1: number) {
  const f = side === 'l' ? leftPt : rightPt
  const pts: [number, number][] = [f(c, t0, h1), f(c, t0, lerp(h0, h1, 0.35))]
  const N = 8
  for (let i = 0; i <= N; i++) {
    const t = lerp(t0, t1, i / N)
    const rise = Math.sin((i / N) * Math.PI) * 0.16
    pts.push(f(c, t, lerp(h0, h1, 0.35) - rise * (h1 - h0) * 1.4))
  }
  pts.push(f(c, t1, lerp(h0, h1, 0.35)), f(c, t1, h1))
  return pts
}

function Candle({ x, y, s = 1, id }: { x: number; y: number; s?: number; id: number }) {
  return (
    <g style={{ animation: `candle ${2.4 + (id % 5) * 0.37}s ease-in-out ${id * 0.2}s infinite` }}>
      <circle cx={x} cy={y - 14 * s} r={90 * s} fill="url(#glowW)" />
      <rect x={x - 3 * s} y={y} width={6 * s} height={26 * s} fill="#e8dcc4" opacity=".9" />
      <ellipse cx={x} cy={y - 7 * s} rx={3.4 * s} ry={9 * s} fill="#ffd89a" />
      <ellipse cx={x} cy={y - 5 * s} rx={1.6 * s} ry={4.6 * s} fill="#fff4d6" />
    </g>
  )
}

function Chandelier({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={y} stroke="#6b5a3c" strokeWidth="3" />
      <circle cx={x} cy={y + 30 * s} r={150 * s} fill="url(#glowW)" opacity=".55" />
      <path d={`M${x - 70 * s} ${y + 26 * s} Q${x} ${y + 60 * s} ${x + 70 * s} ${y + 26 * s}`} fill="none" stroke="#8c7650" strokeWidth="4" />
      <path d={`M${x - 40 * s} ${y + 30 * s} l${-6 * s} ${34 * s} M${x} ${y + 40 * s} v${40 * s} M${x + 40 * s} ${y + 30 * s} l${6 * s} ${34 * s}`} stroke="#b9a078" strokeWidth="2" opacity=".6" />
      {[-62, -31, 0, 31, 62].map((dx, i) => <g key={dx}><rect x={x + dx * s - 2} y={y + 6 * s + Math.abs(dx) * 0.12 * s} width="4" height={14 * s} fill="#e8dcc4" /><ellipse cx={x + dx * s} cy={y + 2 * s + Math.abs(dx) * 0.12 * s} rx="3" ry="7" fill="#ffd89a" style={{ animation: `candle ${2 + i * 0.3}s ease-in-out infinite` }} /></g>)}
    </g>
  )
}

function Shell({ c, id, corridor }: { c: RoomCfg; id: string; corridor: number }) {
  const [x0, y0, x1, y1] = c.back
  const vp: [number, number] = [800, (y0 + y1) / 2]
  const planks: React.ReactNode[] = []
  for (let i = -8; i <= 8; i++) planks.push(<line key={i} x1={800 + i * 220} y1={900} x2={lerp(x0, x1, 0.5 + i * 0.06)} y2={y1} stroke="#000" strokeOpacity=".28" strokeWidth="1.5" />)
  for (let j = 1; j < 7; j++) { const t = Math.pow(j / 7, 1.6); const y = lerp(y1, 900, t); const xl = lerp(x0, 0, t), xr = lerp(x1, 1600, t); planks.push(<line key={'h' + j} x1={xl} y1={y} x2={xr} y2={y} stroke="#000" strokeOpacity=".22" strokeWidth="1.2" />) }
  const runner = id !== 'cellar'
  return (
    <g filter="url(#wash)">
      <polygon points={poly([[0, 0], [1600, 0], [x1, y0], [x0, y0]])} fill={c.ceil} />
      <polygon points={poly([[0, 0], [x0, y0], [x0, y1], [0, 900]])} fill="url(#wallL)" />
      <polygon points={poly([[1600, 0], [x1, y0], [x1, y1], [1600, 900]])} fill="url(#wallR)" />
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={c.wall2} />
      <polygon points={poly([[0, 900], [1600, 900], [x1, y1], [x0, y1]])} fill="url(#floor)" />
      {id !== 'cellar' && (
        <>
          <polygon points={poly([[0, 0], [x0, y0], [x0, y1], [0, 900]])} fill="url(#damask)" opacity=".5" />
          <polygon points={poly([[1600, 0], [x1, y0], [x1, y1], [1600, 900]])} fill="url(#damask)" opacity=".5" />
          <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="url(#damask)" opacity=".45" />
        </>
      )}
      {/* 징두리 판벽 + 몰딩 */}
      <polygon points={poly([leftPt(c, 0, 0.7), leftPt(c, 1, 0.7), leftPt(c, 1, 1), leftPt(c, 0, 1)])} fill="#000" opacity=".32" />
      <polygon points={poly([rightPt(c, 0, 0.7), rightPt(c, 1, 0.7), rightPt(c, 1, 1), rightPt(c, 0, 1)])} fill="#000" opacity=".32" />
      <rect x={x0} y={lerp(y0, y1, 0.7)} width={x1 - x0} height={y1 - lerp(y0, y1, 0.7)} fill="#000" opacity=".3" />
      <polyline points={poly([leftPt(c, 0, 0.7), leftPt(c, 1, 0.7)])} stroke={c.trim} strokeWidth="2" opacity=".55" fill="none" />
      <polyline points={poly([rightPt(c, 0, 0.7), rightPt(c, 1, 0.7)])} stroke={c.trim} strokeWidth="2" opacity=".55" fill="none" />
      <line x1={x0} y1={lerp(y0, y1, 0.7)} x2={x1} y2={lerp(y0, y1, 0.7)} stroke={c.trim} strokeWidth="2" opacity=".5" />
      <polyline points={poly([leftPt(c, 0, 0.04), leftPt(c, 1, 0.04)])} stroke={c.trim} strokeWidth="3" opacity=".4" fill="none" />
      <polyline points={poly([rightPt(c, 0, 0.04), rightPt(c, 1, 0.04)])} stroke={c.trim} strokeWidth="3" opacity=".4" fill="none" />
      {planks}
      {runner && <polygon points={poly([[560, 900], [1040, 900], [lerp(x0, x1, 0.62), y1], [lerp(x0, x1, 0.38), y1]])} fill="#4b202c" opacity=".78" />}
      {runner && <polygon points={poly([[600, 900], [1000, 900], [lerp(x0, x1, 0.6), y1], [lerp(x0, x1, 0.4), y1]])} fill="none" stroke="#b9a078" strokeOpacity=".28" strokeWidth="2" />}
      <circle cx={vp[0]} cy={vp[1]} r="1" fill="none" />
      {corridor >= 3 && <rect x={x0 + 20} y={y0 + 40} width={(x1 - x0) / 5} height={(y1 - y0) * 0.6} fill="#000" opacity=".15" />}
    </g>
  )
}

function Moon({ c, side, t0, t1, hue }: { c: RoomCfg; side: 'l' | 'r'; t0: number; t1: number; hue?: string }) {
  const w = archWindow(side, c, t0, t1, 0.14, 0.62)
  const f = side === 'l' ? leftPt : rightPt
  const base = [f(c, t0, 0.62), f(c, t1, 0.62)]
  const floorA = side === 'l' ? [lerp(base[0][0], 760, 0.1), 900] : [lerp(base[0][0], 840, 0.1), 900]
  const beam: [number, number][] = [base[0], base[1], [lerp(base[1][0], 800, side === 'l' ? 0.85 : 0.85), lerp(base[1][1], 900, 0.98)], [floorA[0], 900]]
  return (
    <g>
      <polygon points={poly(w)} fill={hue ?? '#7f95c9'} opacity=".55" />
      <polygon points={poly(w)} fill="none" stroke="#b9a078" strokeWidth="3" opacity=".55" />
      <polyline points={poly([f(c, (t0 + t1) / 2, 0.14), f(c, (t0 + t1) / 2, 0.62)])} stroke="#b9a078" strokeWidth="2" opacity=".5" fill="none" />
      <polyline points={poly([f(c, t0, 0.36), f(c, t1, 0.36)])} stroke="#b9a078" strokeWidth="2" opacity=".5" fill="none" />
      <polygon points={poly(beam)} fill="url(#beam)" style={{ mixBlendMode: 'screen' }} opacity=".7" />
    </g>
  )
}

function Hot({ x, y, w, h, label, on }: { x: number; y: number; w: number; h: number; label: string; on?: () => void }) {
  if (!on) return null
  return <rect x={x} y={y} width={w} height={h} fill="transparent" className="hot" style={{ cursor: 'pointer' }} aria-label={label} role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); on() }} onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); on() } }} />
}

function Props({ id, c, corridor, onMirror, onCup, hits }: { id: string; c: RoomCfg; corridor: number; onMirror?: () => void; onCup?: () => void; hits?: Record<string, () => void> }) {
  const [x0, y0, x1, y1] = c.back
  const hp = (k: string) => (hits?.[k] ? { className: 'hit', role: 'button' as const, 'aria-label': k, onClick: (e: React.MouseEvent) => { e.stopPropagation(); hits[k]() } } : {})
  const cx = (x0 + x1) / 2
  const frame = '#8c7650'
  switch (id) {
    case 'lobby':
      return <>
        <Moon c={c} side="l" t0={0.2} t1={0.62} /><Moon c={c} side="r" t0={0.2} t1={0.62} />
        <Chandelier x={800} y={120} />
        <rect x={cx - 40} y={y0 + 60} width="80" height={y1 - y0 - 60} fill="#1a1013" stroke={frame} strokeWidth="3" />
        <circle cx={cx} cy={y0 + 110} r="26" fill="#d9cfb8" opacity=".85" /><path d={`M${cx} ${y0 + 110} V${y0 + 94} M${cx} ${y0 + 110} l12 8`} stroke="#222" strokeWidth="3" />
        <g transform="translate(0,-62)">
        <path d="M610 700 Q610 640 670 640 H930 Q990 640 990 700 V744 H610Z" fill="#4b202c" stroke="#2a0f18" strokeWidth="3" />
        <rect x="630" y="618" width="340" height="40" rx="20" fill="#5a2635" />
        <ellipse cx="800" cy="770" rx="70" ry="14" fill="#2a1812" stroke="#8c7650" strokeWidth="2" /><rect x="793" y="770" width="14" height="40" fill="#2a1812" />
        <ellipse cx="800" cy="754" rx="22" ry="6" fill="#efe6d3" /><rect x="778" y="736" width="44" height="20" rx="7" fill="#efe6d3" opacity=".9" />
        <Hot x={740} y={720} w={120} h={70} label="찻잔" on={onCup} />
        </g>
        <Candle x={1280} y={760} id={1} />
      </>
    case 'study':
      return <>
        <Moon c={c} side="l" t0={0.25} t1={0.6} />
        {[0, 1, 2].map((i) => <g key={i}><rect x={x0 + 30 + i * 230} y={y0 + 30} width="190" height={y1 - y0 - 40} fill="#25140f" stroke={frame} strokeWidth="2" />{[0, 1, 2, 3, 4].map((r) => <g key={r}><line x1={x0 + 30 + i * 230} x2={x0 + 220 + i * 230} y1={y0 + 70 + r * 70} y2={y0 + 70 + r * 70} stroke={frame} opacity=".6" />{Array.from({ length: 9 }).map((_, b) => <rect key={b} x={x0 + 38 + i * 230 + b * 20} y={y0 + 74 + r * 70 - 40 + (b % 3) * 4} width="15" height={36 - (b % 3) * 4} fill={['#4b202c', '#1f2b3c', '#3a2a1a', '#2a3a2e'][(b + r + i) % 4]} />)}</g>)}</g>)}
        <g {...hp('o_desk')}><rect x="520" y="640" width="560" height="110" fill="transparent" /></g><rect x="540" y="690" width="520" height="40" fill="#2a1710" stroke={frame} strokeWidth="2" /><rect x="570" y="730" width="30" height="130" fill="#2a1710" /><rect x="1000" y="730" width="30" height="130" fill="#2a1710" />
        <path d="M700 690 l60 -18 l60 18 z" fill="#d9cfb8" opacity=".85" />
        <Candle x={620} y={664} id={2} s={1.3} /><Candle x={980} y={668} id={3} s={1.1} />
        <Chandelier x={800} y={70} s={0.8} />
      </>
    case 'parlor':
      return <>
        <Moon c={c} side="l" t0={0.3} t1={0.65} hue="#6a7bb0" />
        <rect x={cx - 130} y={y0 + 110} width="260" height={y1 - y0 - 110} fill="#1a0f12" stroke={frame} strokeWidth="4" />
        <rect x={cx - 100} y={y0 + 190} width="200" height={y1 - y0 - 190} fill="#06060a" />
        <ellipse cx={cx} cy={y1 - 20} rx="90" ry="40" fill="url(#glowW)" style={{ animation: 'candle 3s infinite' }} />
        <path d={`M${cx - 40} ${y1 - 8} q10 -56 24 -8 q12 -50 22 -4 q10 -40 18 12z`} fill="#ff9a4a" style={{ animation: 'candle 1.6s infinite' }} />
        <rect x={cx - 150} y={y0 + 40} width="300" height="60" fill="#241418" stroke={frame} /><circle cx={cx} cy={y0 + 70} r="22" fill="#11141c" stroke={frame} strokeWidth="2" />
        <path d="M120 700 Q120 620 220 620 H380 Q470 620 470 700 V820 H120Z" fill="#5a2635" stroke="#2a0f18" strokeWidth="3" />
        <path d="M1130 700 Q1130 620 1230 620 H1390 Q1480 620 1480 700 V820 H1130Z" fill="#5a2635" stroke="#2a0f18" strokeWidth="3" />
        <ellipse cx="800" cy="760" rx="150" ry="22" fill="#2a1812" stroke={frame} strokeWidth="2" /><rect x="790" y="760" width="20" height="90" fill="#2a1812" />
        <ellipse cx="800" cy="744" rx="26" ry="8" fill="#efe6d3" /><rect x="774" y="722" width="52" height="24" rx="8" fill="#efe6d3" opacity=".9" />
        <path d="M826 730 q18 0 18 12 q0 10 -18 10" fill="none" stroke="#efe6d3" strokeWidth="3" />
        <Hot x={730} y={690} w={140} h={80} label="찻잔" on={onCup} />
        <Candle x={720} y={738} id={4} s={0.9} />
      </>
    case 'corridor':
    case 'hall': {
      const door = id === 'hall'
      return <>
        <Moon c={c} side="l" t0={0.15} t1={0.42} /><Moon c={c} side="l" t0={0.5} t1={0.7} /><Moon c={c} side="r" t0={0.3} t1={0.52} />
        {[0.28, 0.58, 0.78].map((t, i) => { const a = leftPt(c, t, 0.12), b = leftPt(c, t + 0.1, 0.12), d = leftPt(c, t + 0.1, 1), e = leftPt(c, t, 1); return <polygon key={i} points={poly([a, b, d, e])} fill="#1a0f12" stroke={frame} strokeWidth="2.5" /> })}
        {[0.2, 0.52, 0.74].map((t, i) => { const a = rightPt(c, t, 0.12), b = rightPt(c, t + 0.09, 0.12), d = rightPt(c, t + 0.09, 1), e = rightPt(c, t, 1); return <polygon key={i} points={poly([a, b, d, e])} fill="#1a0f12" stroke={frame} strokeWidth="2.5" /> })}
        {corridor >= 2 && <polygon points={poly([rightPt(c, 0.84, 0.3), rightPt(c, 0.9, 0.3), rightPt(c, 0.9, 1), rightPt(c, 0.84, 1)])} fill="#06060a" stroke="#6b1d2c" strokeWidth="2" />}
        {door ? (
          <g>
            <rect x={cx - 52} y={y0 + 30} width="104" height={y1 - y0 - 30} rx="52" ry="52" fill="#2a0f18" stroke={frame} strokeWidth="3" />
            <rect x={cx - 52} y={y0 + 82} width="104" height={y1 - y0 - 82} fill="#2a0f18" />
            <rect x={cx - 60} y={y1 - 6} width="120" height="12" fill="#ff3a4a" opacity=".9" filter="url(#blur6)" />
            <polygon points={poly([[cx - 60, y1], [cx + 60, y1], [cx + 300, 900], [cx - 300, 900]])} fill="url(#redlight)" style={{ mixBlendMode: 'screen' }} />
            <circle cx={cx + 30} cy={y1 - 60} r="5" fill="#b9a078" />
          </g>
        ) : (
          <g>
            <rect x={cx - 90} y={y0 + 20} width="180" height="170" fill="#0d1018" stroke={frame} strokeWidth="5" />
            <rect x={cx - 78} y={y0 + 32} width="156" height="146" fill="url(#mirror)" />
            <path d={`M${cx - 20} ${y0 + 40} l30 70 l-14 60`} stroke="#0d1018" strokeWidth="2" opacity=".7" fill="none" />
            <Hot x={cx - 90} y={y0 + 20} w={180} h={170} label="거울" on={onMirror} />
          </g>
        )}
        <Candle x={cx - 250} y={y1 + 50} id={5} s={0.9} /><Candle x={cx + 250} y={y1 + 50} id={6} s={0.9} />
        <Chandelier x={800} y={60} s={0.7} />
      </>
    }
    case 'room':
      return <>
        <Moon c={c} side="r" t0={0.3} t1={0.65} hue="#6a7bb0" />
        <g {...hp('o_bed')}><rect x="460" y="400" width="440" height="270" fill="transparent" /></g><rect x="470" y="470" width="420" height="190" rx="10" fill="#3a1c2a" stroke={frame} strokeWidth="3" />
        <rect x="470" y="410" width="60" height="250" fill="#2a1420" stroke={frame} strokeWidth="2" /><rect x="470" y="440" width="420" height="40" fill="#5a2635" />
        <rect x="1010" y="270" width="110" height="390" fill="#2a1710" stroke={frame} strokeWidth="3" />
        <rect x="940" y="520" width="60" height="140" fill="#2a1710" stroke={frame} />
        <ellipse cx="970" cy="516" rx="20" ry="7" fill="#efe6d3" opacity=".8" />
        <rect x="620" y="260" width="140" height="170" fill="#0d1018" stroke={frame} strokeWidth="4" /><rect x="630" y="270" width="120" height="150" fill="url(#mirror)" />
                <Candle x={950} y={510} id={7} s={0.9} />
      </>
    case 'garden':
      return <>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${100 + i * 220} 900 V${300 + (i % 2) * 40} Q${100 + i * 220} 120 ${210 + i * 220} 120`} fill="none" stroke="#2a3a3a" strokeWidth="7" opacity=".7" />)}
        <path d="M0 140 Q800 -30 1600 140" fill="none" stroke="#2a3a3a" strokeWidth="8" opacity=".7" />
        {[120, 300, 520, 760, 980, 1180, 1400].map((x, i) => <g key={x} {...hp('o_rose')}><circle cx={x} cy={650 - (i % 3) * 50} r="70" fill="transparent" /><path d={`M${x} 900 q${i % 2 ? -30 : 30} -${130 + (i % 3) * 50} 0 -${220 + (i % 3) * 60}`} stroke="#142a22" strokeWidth="9" fill="none" /><circle cx={x} cy={680 - (i % 3) * 55} r="20" fill="#16101a" stroke="#6b1d2c" strokeWidth="3" /><circle cx={x + 28} cy={730 - (i % 3) * 40} r="14" fill="#16101a" stroke="#6b1d2c" strokeWidth="2" /></g>)}
        <circle cx="1220" cy="150" r="70" fill="#cfd8f0" opacity=".5" filter="url(#blur6)" /><circle cx="1220" cy="150" r="46" fill="#e6ebfa" opacity=".8" />
        <g {...hp('o_bench')}><rect x="1060" y="730" width="340" height="120" fill="transparent" /><rect x="1080" y="770" width="300" height="16" fill="#2a2a2e" /></g><rect x="1100" y="786" width="14" height="60" fill="#2a2a2e" /><rect x="1350" y="786" width="14" height="60" fill="#2a2a2e" />
      </>
    case 'cellar':
      return <>
        {[0.2, 0.45, 0.7].map((t, i) => <g key={i}><polyline points={poly([leftPt(c, t, 0.9), leftPt(c, t, 0.2), leftPt(c, t + 0.1, 0.2), leftPt(c, t + 0.1, 0.9)])} fill="none" stroke="#d8d2c0" strokeWidth="2" opacity=".3" /><polyline points={poly([rightPt(c, t, 0.9), rightPt(c, t, 0.2), rightPt(c, t + 0.1, 0.2), rightPt(c, t + 0.1, 0.9)])} fill="none" stroke="#d8d2c0" strokeWidth="2" opacity=".3" /></g>)}
        <rect x={cx - 50} y={y0 + 50} width="100" height={y1 - y0 - 50} fill="#0b0b10" stroke="#6b1d2c" strokeWidth="4" />
        <path d={`M${cx - 50} ${y1} H${cx + 50}`} stroke="#ff4a5a" strokeWidth="5" opacity=".8" filter="url(#blur6)" />
        <Candle x={cx - 260} y={y1 + 60} id={8} s={0.8} />
      </>
    case 'center':
      return <>
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx="800" cy="360" rx={150 + i * 120} ry={110 + i * 80} fill="none" stroke={frame} strokeWidth="1.5" opacity={0.4 - i * 0.07} strokeDasharray="6 10" />)}
        <polygon points={poly([[650, 0], [950, 0], [1180, 900], [420, 900]])} fill="url(#beam)" style={{ mixBlendMode: 'screen' }} opacity=".55" />
        <rect x="620" y="560" width="360" height="30" fill="#2a1710" stroke={frame} strokeWidth="2" /><rect x="650" y="590" width="26" height="170" fill="#2a1710" /><rect x="924" y="590" width="26" height="170" fill="#2a1710" />
        <rect x="690" y="528" width="150" height="34" fill="#efe6d3" opacity=".8" transform="rotate(-3 765 545)" />
        <Candle x={880} y={534} id={9} s={1.2} />
      </>
    default:
      return null
  }
}

function Void() {
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx="800" cy="420" rx={90 + i * 130} ry={70 + i * 100} fill="none" stroke="#b9a078" strokeWidth="1.5" opacity={0.4 - i * 0.07} />)}
      <rect x="745" y="470" width="110" height="260" rx="55" fill="#07080c" stroke="#b9a078" strokeWidth="3" />
      <circle cx="830" cy="610" r="5" fill="#b9a078" />
    </g>
  )
}

export function Background({ id = 'lobby', corridor = 0, warm = false, horror = false, onMirror, onCup, hits, still }: { id?: string; corridor?: number; warm?: boolean; horror?: boolean; onMirror?: () => void; onCup?: () => void; hits?: Record<string, () => void>; still?: boolean }) {
  const img = BG_IMAGES[id]
  const c = ROOMS[id]
  const hue = id === 'corridor' ? Math.min(corridor, 6) * 8 : 0
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08090d]">
      <div className={`absolute ${still ? "inset-0" : "inset-[-4%] cam-drift"}`} style={{ filter: hue ? `hue-rotate(${hue}deg)` : undefined, transition: 'filter 1.4s' }}>
        {img ? (
          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <Defs warm={warm} />
            {id === 'storm' ? (
              <Storm />
            ) : id === 'garden' ? (
              <>
                <rect width="1600" height="900" fill="url(#night)" />
                <rect y="700" width="1600" height="200" fill="#0b1815" />
                <Props id={id} c={ROOMS.lobby} corridor={corridor} hits={hits} />
                <rect y="560" width="1600" height="340" fill="url(#mist)" className="mist" />
              </>
            ) : id === 'void' ? (
              <><rect width="1600" height="900" fill="#07080c" /><Void /></>
            ) : c ? (
              <>
                <rect width="1600" height="900" fill={c.ceil} />
                <Shell c={c} id={id} corridor={corridor} />
                <Props id={id} c={c} corridor={corridor} onMirror={onMirror ?? hits?.o_mirror} onCup={onCup ?? hits?.o_cup} hits={hits} />
              </>
            ) : null}
          </svg>
        )}
      </div>
      {id === 'storm' && <><div className="rain pointer-events-none absolute inset-0" /><div className="rain rain2 pointer-events-none absolute inset-0" /></>}
      {/* 먼지 입자 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {DUST.map((d, i) => <span key={i} className="dust" style={{ left: `${d[0]}%`, top: `${d[1]}%`, width: d[2], height: d[2], animationDuration: `${d[3]}s`, animationDelay: `-${d[4]}s` }} />)}
      </div>
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000" style={{ opacity: warm ? 1 : 0, background: 'radial-gradient(ellipse at 50% 75%, rgba(255,170,90,.30), transparent 62%)', mixBlendMode: 'screen' }} />
      <div className="pointer-events-none absolute inset-0 vignette" />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="pointer-events-none absolute inset-0 bg-[#08090d] transition-opacity duration-1000" style={{ opacity: horror ? 0.5 : 0 }} />
    </div>
  )
}

const DUST: [number, number, number, number, number][] = Array.from({ length: 26 }, (_, i) => [((i * 37) % 100), ((i * 53) % 100), 1.5 + (i % 3), 14 + (i % 7) * 3, (i * 3) % 20])

function Defs({ warm }: { warm: boolean }) {
  return (
    <defs>
      <radialGradient id="glowW"><stop offset="0" stopColor="#ffc47a" stopOpacity={warm ? 0.7 : 0.5} /><stop offset="1" stopColor="#ff9a4a" stopOpacity="0" /></radialGradient>
      <linearGradient id="wallL" x1="0" x2="1"><stop offset="0" stopColor="#07080c" /><stop offset="1" stopColor="#1d2438" /></linearGradient>
      <linearGradient id="wallR" x1="1" x2="0"><stop offset="0" stopColor="#07080c" /><stop offset="1" stopColor="#1d2438" /></linearGradient>
      <linearGradient id="floor" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#0a0a0f" /><stop offset=".5" stopColor="#2a1420" /><stop offset="1" stopColor="#1c0f17" /></linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb4e6" stopOpacity=".38" /><stop offset="1" stopColor="#9fb4e6" stopOpacity="0" /></linearGradient>
      <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d1424" /><stop offset=".6" stopColor="#16222e" /><stop offset="1" stopColor="#0b1815" /></linearGradient>
      <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb0c8" stopOpacity="0" /><stop offset=".6" stopColor="#9fb0c8" stopOpacity=".22" /><stop offset="1" stopColor="#9fb0c8" stopOpacity=".05" /></linearGradient>
      <radialGradient id="mirror" cx=".4" cy=".3"><stop offset="0" stopColor="#566783" /><stop offset="1" stopColor="#1a2233" /></radialGradient>
      <radialGradient id="redlight" cx=".5" cy="0"><stop offset="0" stopColor="#ff4a5a" stopOpacity=".55" /><stop offset="1" stopColor="#ff4a5a" stopOpacity="0" /></radialGradient>
      <pattern id="damask" width="70" height="90" patternUnits="userSpaceOnUse">
        <path d="M35 8 q10 14 0 28 q-10 -14 0 -28 M35 44 q10 14 0 28 q-10 -14 0 -28 M8 40 q14 -10 28 0 M0 76 q10 -8 20 0 M50 76 q10 -8 20 0" fill="none" stroke="#b9a078" strokeOpacity=".16" strokeWidth="2" />
      </pattern>
      <filter id="wash" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="2" seed="4" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="9" /></filter>
      <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
  )
}

/** 갤러리 등에서 쓰는 단순 PNG 초상 (route 는 로이로 매핑) */
export function Portrait({ who, expr = 'neutral' }: { who: 'agatha' | 'roy' | RouteId; expr?: Expr }) {
  return <img src={charSrc(who === 'agatha' ? 'agatha' : 'roy', expr)} alt="" draggable={false} className="h-full w-auto object-contain object-bottom" />
}

function Storm() {
  return (
    <g>
      <rect width="1600" height="900" fill="url(#night)" />
      <rect width="1600" height="900" fill="#0a0d16" opacity=".35" />
      <g opacity=".9">
        <rect x="120" y="330" width="300" height="360" fill="#10141f" /><path d="M100 330 L270 250 L440 330Z" fill="#0c0f18" />
        {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={145 + c * 68} y={365 + r * 90} width="34" height="48" fill="#ffc47a" opacity={(r + c) % 3 === 0 ? 0.25 : 0.8} />))}
        <circle cx="270" cy="520" r="210" fill="url(#glowW)" opacity=".5" />
      </g>
      <path d="M1500 900 V420 Q1500 340 1460 280 M1500 520 Q1580 450 1630 360 M1500 600 Q1410 520 1370 440" stroke="#0a0f0d" strokeWidth="38" fill="none" strokeLinecap="round" />
      <ellipse cx="1460" cy="250" rx="170" ry="120" fill="#0a100e" />
      <g transform="translate(1040 600) rotate(-7)">
        <path d="M0 80 L40 20 Q70 -6 150 -6 H300 Q350 0 390 40 L420 80Z" fill="#14161d" stroke="#2a2d38" strokeWidth="3" />
        <circle cx="90" cy="82" r="30" fill="#0a0b10" stroke="#2a2d38" strokeWidth="4" /><circle cx="330" cy="82" r="30" fill="#0a0b10" stroke="#2a2d38" strokeWidth="4" />
        <circle cx="-4" cy="52" r="46" fill="url(#glowW)" opacity=".6" />
      </g>
      <rect y="760" width="1600" height="140" fill="#0a0e14" />
      <rect y="760" width="1600" height="140" fill="url(#mist)" className="mist" />
      <ellipse cx="900" cy="830" rx="520" ry="26" fill="#6f86a8" opacity=".12" />
    </g>
  )
}
