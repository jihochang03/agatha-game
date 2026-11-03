import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../engine/store'
import { STORY } from '../data/story'
import { DEDUCTIONS, EVIDENCE, LOCATIONS } from '../data/world'
import { eventGateOk } from '../engine/logic'
import { Background } from './art'
import { MasksPanel } from './Masks'
import { Modal } from './kit'

type Tab = 'map' | 'board' | 'masks'

const FAIL = [
  '두 단서는 서로 아무 말도 하지 않는다. 같은 사건의 다른 조각이 아닌 듯하다.',
  '억지로 맞추면 맞출 수는 있다. 그러나 그것은 추리가 아니라 소망이다.',
  '아가사는 고개를 저었다. 둘 사이에는 연결할 만한 모순도, 일치도 없다.',
  '잠깐, 이 둘을 이으면 이야기는 재미있어진다. 하지만 증거는 그렇게 말하지 않는다.',
]
const TAB_LABEL: Record<Tab, string> = { map: 'FLOOR PLAN', board: 'EVIDENCE', masks: 'MASKS' }

export function Gate() {
  const g = useGame()
  const node = STORY[g.nodeId]
  const ev = node?.event
  const [tab, setTab] = useState<Tab>(ev?.type === 'board' ? 'board' : 'map')
  const [loc, setLoc] = useState<string | null>(null)
  if (!node || !ev) return null
  const ok = eventGateOk(g.progress, node)
  const goal =
    ev.type === 'explore'
      ? `단서 ${Math.min(g.progress.evidence.length, ev.need)} / ${ev.need}`
      : `추리 ${ev.type === 'board' ? ev.need.filter((d) => g.progress.deductions.includes(d)).length : 0} / ${ev.type === 'board' ? ev.need.length : 0}`
  const hint = ev.type === 'explore' ? '호텔을 조사해 단서를 모으세요' : '증거판에서 단서를 연결해 추리를 완성하세요'

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0d1018]">
      <header className="relative z-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-gold/15 px-5 pb-3 pt-4 sm:px-10">
        <div>
          <p className="font-display text-xs tracking-[.3em] text-fog">{node.chapter.split(' — ')[0]} · INVESTIGATION</p>
          <p className="mt-1 text-sm text-ivory/90" role="status">{hint} <span className="ml-2 font-display text-gold">{goal}</span></p>
        </div>
        <nav className="flex items-center gap-5">
          {(['map', 'board', 'masks'] as Tab[]).map((t) => (
            <button key={t} aria-label={t === 'map' ? '호텔 지도' : t === 'board' ? '증거판' : '로이의 가면'} onClick={() => { setTab(t); setLoc(null) }}
              className={`relative pb-1 font-display text-sm tracking-[.22em] transition-colors ${tab === t ? 'text-ivory' : 'text-fog hover:text-ivory'}`}>
              {TAB_LABEL[t]}
              <span className={`absolute inset-x-0 -bottom-px h-px bg-gold transition-opacity ${tab === t ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
          <button className="btn !px-4 !py-1 font-display tracking-[.2em]" disabled={!ok} onClick={g.leaveGate}>{ok ? 'CONTINUE ▸' : 'LOCKED'}</button>
        </nav>
      </header>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {tab === 'map' && (loc ? <Place id={loc} back={() => setLoc(null)} /> : <HotelMap open={setLoc} />)}
        {tab === 'board' && <Board need={ev.type === 'board' ? ev.need : []} />}
        {tab === 'masks' && <div className="scroll-thin h-full overflow-y-auto p-5 sm:p-10"><MasksPanel /></div>}
      </div>
    </div>
  )
}

/* ───── 호텔 도면 ───── */
const PLAN: Record<string, { x: number; y: number; w: number; h: number }> = {
  study: { x: 60, y: 60, w: 210, h: 150 },
  parlor: { x: 290, y: 60, w: 250, h: 150 },
  corridor: { x: 60, y: 230, w: 480, h: 70 },
  room: { x: 560, y: 60, w: 180, h: 240 },
  garden: { x: 60, y: 320, w: 250, h: 130 },
  cellar: { x: 330, y: 320, w: 410, h: 130 },
}

function HotelMap({ open }: { open: (id: string) => void }) {
  const ev = useGame((s) => s.progress.evidence)
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0b1624] p-3"
      style={{ backgroundImage: 'linear-gradient(rgba(120,160,200,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(120,160,200,.07) 1px,transparent 1px)', backgroundSize: '28px 28px' }}>
      <svg viewBox="0 0 800 510" className="h-full max-h-[86vh] w-full max-w-[1100px]" role="group" aria-label="하이드로 호텔 평면도">
        <rect x="30" y="30" width="740" height="450" fill="none" stroke="#7fa0c4" strokeWidth="2.5" opacity=".7" />
        <rect x="38" y="38" width="724" height="434" fill="none" stroke="#7fa0c4" strokeWidth=".8" opacity=".5" />
        {LOCATIONS.map((l) => {
          const r = PLAN[l.id]
          const got = l.objects.filter((o) => o.evidence && ev.includes(o.evidence)).length
          const total = l.objects.filter((o) => o.evidence).length
          const on = hover === l.id
          return (
            <g key={l.id} tabIndex={0} role="button" aria-label={`${l.name} ${got}/${total}`} className="cursor-pointer outline-none"
              onMouseEnter={() => setHover(l.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(l.id)} onBlur={() => setHover(null)}
              onClick={() => open(l.id)} onKeyDown={(e) => e.key === 'Enter' && open(l.id)}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={on ? 'rgba(185,160,120,.16)' : 'rgba(127,160,196,.05)'} stroke={on ? '#b9a078' : '#7fa0c4'} strokeWidth={on ? 2.5 : 1.6} style={{ transition: 'all .25s' }} />
              <rect x={r.x + 6} y={r.y + 6} width={r.w - 12} height={r.h - 12} fill="none" stroke="#7fa0c4" strokeWidth=".6" opacity=".5" strokeDasharray="3 4" />
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 - 4} textAnchor="middle" fill={on ? '#ede4d8' : '#b8cde3'} fontSize="20" fontFamily="Noto Serif KR, serif">{l.name}</text>
              <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} textAnchor="middle" fill="#b9a078" fontSize="13" fontFamily="Cormorant Garamond, serif" letterSpacing="3">{got === total ? '✓ ' : ''}{got} / {total}</text>
              {l.id === 'corridor' && <path d={`M${r.x + 20} ${r.y + 56} H${r.x + r.w - 20}`} stroke="#7fa0c4" strokeWidth=".6" opacity=".5" />}
            </g>
          )
        })}
        {/* 문 */}
        {[[270, 135], [540, 135], [160, 210], [415, 210], [650, 300], [185, 300], [535, 300]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#0b1624" stroke="#7fa0c4" />)}
        <text x="770" y="498" textAnchor="end" fill="#7fa0c4" fontSize="12" fontFamily="Cormorant Garamond, serif" letterSpacing="4" opacity=".8">HYDRO HOTEL — GROUND PLAN</text>
        <path d="M60 475 H140" stroke="#7fa0c4" strokeWidth="1" opacity=".7" /><text x="60" y="490" fill="#7fa0c4" fontSize="11" opacity=".7">0 ─ 10 ft</text>
      </svg>
    </div>
  )
}

/* ───── 장소 조사: 과도한 표시 없이 호버/터치로 발견 ───── */
function Place({ id, back }: { id: string; back: () => void }) {
  const g = useGame()
  const l = LOCATIONS.find((x) => x.id === id)!
  const [msg, setMsg] = useState<{ label: string; text: string; ev?: string } | null>(null)
  const [near, setNear] = useState<string | null>(null)
  const click = (o: (typeof l.objects)[number]) => {
    const isNew = o.evidence && !g.progress.evidence.includes(o.evidence)
    if (o.evidence) g.investigate(o.evidence)
    setMsg({ label: o.label, text: o.text, ev: isNew ? o.evidence : undefined })
    if (id === 'corridor' && o.id === 'o_window') useGame.setState((s) => ({ corridor: s.corridor + 1 }))
  }
  const found = l.objects.filter((o) => o.evidence && g.progress.evidence.includes(o.evidence)).length
  const total = l.objects.filter((o) => o.evidence).length
  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <Background id={l.bg} corridor={g.corridor} />
      <button className="menu-item absolute left-3 top-2 z-10 !text-base" onClick={back}>PLAN</button>
      <p className="absolute right-5 top-3 z-10 font-display text-sm tracking-[.25em] text-fog">{l.name} · {found}/{total}</p>
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#08090d] to-transparent px-6 pb-5 pt-12 text-center text-sm leading-7 text-ivory/80 sm:text-base">{l.intro}</div>
      {l.objects.map((o) => {
        const got = o.evidence && g.progress.evidence.includes(o.evidence)
        const show = near === o.id
        return (
          <button key={o.id} aria-label={o.label} onClick={() => click(o)} onMouseEnter={() => setNear(o.id)} onMouseLeave={() => setNear(null)} onFocus={() => setNear(o.id)} onBlur={() => setNear(null)}
            className="group absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full" style={{ left: `${o.x}%`, top: `${o.y}%` }}>
            <span className={`block h-2 w-2 rounded-full transition-all duration-500 ${got ? 'bg-gold/40' : 'bg-gold/0 group-hover:bg-gold group-hover:shadow-[0_0_18px_6px_rgba(185,160,120,.5)]'} ${show ? 'scale-150' : ''}`} />
            <span className={`pointer-events-none absolute -bottom-3 whitespace-nowrap bg-[#08090d]/85 px-2 py-0.5 text-xs text-ivory transition-opacity ${show ? 'opacity-100' : 'opacity-0'}`}>{got ? '✓ ' : ''}{o.label}</span>
          </button>
        )
      })}
      <AnimatePresence>
        {msg && (
          <Modal title={msg.label} onClose={() => setMsg(null)}>
            <p className="leading-8 text-ivory/90">{msg.text}</p>
            {msg.ev && <p className="mt-3 text-sm text-gold">단서 획득 — {EVIDENCE.find((e) => e.id === msg.ev)?.name}</p>}
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ───── 증거판: 낡은 종이, 금속 핀, 붉은 실 ───── */
const TILT = [-2.2, 1.6, -1.1, 2.4, -1.8, 1.2, -2.6, 0.9, 2, -1.4, 1.7]

function Board({ need }: { need: string[] }) {
  const g = useGame()
  const [sel, setSel] = useState<string[]>([])
  const [res, setRes] = useState<{ ok: boolean; text: string; title?: string } | null>(null)
  const [line, setLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const toggle = (id: string) => { setRes(null); setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 2 ? [s[1], id] : [...s, id])) }

  useLayoutEffect(() => {
    if (sel.length < 2 || !wrap.current) { setLine(null); return }
    const w = wrap.current.getBoundingClientRect()
    const pt = (id: string) => { const el = wrap.current!.querySelector(`[data-ev="${id}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left - w.left + r.width / 2 + wrap.current!.scrollLeft, y: r.top - w.top + 14 + wrap.current!.scrollTop } }
    const a = pt(sel[0]), b = pt(sel[1])
    setLine(a && b ? { x1: a.x, y1: a.y, x2: b.x, y2: b.y } : null)
  }, [sel])

  const combine = () => {
    if (sel.length < 2) return
    const r = g.combine(sel[0], sel[1])
    if (r.ok && r.id) {
      const d = DEDUCTIONS.find((x) => x.id === r.id)!
      setRes({ ok: true, title: d.title, text: r.already ? `이미 발견한 추리다. ${d.text}` : d.text })
    } else {
      const h = (sel[0] + sel[1]).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
      setRes({ ok: false, text: FAIL[h % FAIL.length] })
    }
    setTimeout(() => setSel([]), 900)
  }
  const focus = EVIDENCE.find((e) => e.id === sel[sel.length - 1])

  return (
    <div className="absolute inset-0 grid grid-rows-[1fr_auto] bg-[#14100f] sm:grid-cols-[1fr_320px] sm:grid-rows-1"
      style={{ backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(90,60,40,.35), transparent 70%), repeating-linear-gradient(90deg, rgba(255,255,255,.015) 0 2px, transparent 2px 7px)' }}>
      <div ref={wrap} className="scroll-thin relative overflow-auto p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {EVIDENCE.map((e, i) => {
            const has = g.progress.evidence.includes(e.id)
            const on = sel.includes(e.id)
            return (
              <button key={e.id} data-ev={e.id} disabled={!has} onClick={() => toggle(e.id)} aria-pressed={on} aria-label={has ? e.name : '미발견 단서'}
                className={`relative px-3 pb-3 pt-6 text-left transition-all duration-300 ${has ? 'cursor-pointer hover:-translate-y-1 hover:rotate-0' : 'opacity-30'} ${on ? '-translate-y-1.5 !rotate-0' : ''}`}
                style={{ transform: on ? undefined : `rotate(${TILT[i % TILT.length]}deg)`, background: has ? 'linear-gradient(160deg,#d9ccb0,#c2b190)' : '#3a332b', color: '#2a2018', boxShadow: on ? '0 0 0 2px #8a2f3a, 0 14px 24px rgba(0,0,0,.55)' : '0 6px 14px rgba(0,0,0,.5)' }}>
                <span className="absolute left-1/2 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#d8d8d8,#6a6a6a)] shadow-[0_2px_3px_rgba(0,0,0,.6)]" />
                <span className="text-2xl [filter:grayscale(1)_sepia(.7)_contrast(.9)]">{has ? e.icon : '▒'}</span>
                <b className="mt-1 block text-[13px] font-bold leading-tight">{has ? e.name : '???'}</b>
                <span className="mt-1 block text-[11px] italic leading-snug opacity-70">{has ? e.where : '어딘가에서 발견할 수 있을지도 모른다'}</span>
              </button>
            )
          })}
        </div>
        {line && (
          <svg className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible" aria-hidden>
            <motion.line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#a8323f" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.6))' }} />
          </svg>
        )}
      </div>
      <aside className="scroll-thin flex flex-col gap-4 overflow-y-auto border-t border-gold/15 bg-[#0d1018]/85 p-5 sm:border-l sm:border-t-0">
        <div className="min-h-[7rem]">
          <h3 className="font-display text-xs tracking-[.3em] text-gold">READING</h3>
          {focus ? <p className="mt-2 text-sm leading-7 text-ivory/90">{focus.desc}</p> : <p className="mt-2 text-sm text-fog">단서를 눌러 읽고, 두 장을 골라 붉은 실로 잇습니다.</p>}
        </div>
        <div className="flex items-center gap-3">
          <button className="btn !py-1.5" disabled={sel.length < 2} onClick={combine}>연결하기 {sel.length}/2</button>
          {sel.length > 0 && <button className="text-xs text-fog underline" onClick={() => setSel([])}>해제</button>}
        </div>
        <AnimatePresence mode="wait">
          {res && (
            <motion.div key={res.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`border-l-2 pl-3 text-sm leading-7 ${res.ok ? 'border-gold text-ivory' : 'border-fog/50 text-fog'}`} role="status">
              <b className={`mb-0.5 block font-normal ${res.ok ? 'text-gold' : ''}`}>{res.ok ? `추리 — ${res.title}` : '추리 실패'}</b>
              {res.text}
            </motion.div>
          )}
        </AnimatePresence>
        <div>
          <h3 className="mb-2 font-display text-xs tracking-[.3em] text-gold">DEDUCTIONS</h3>
          <ul className="flex flex-col gap-2">
            {DEDUCTIONS.map((d) => {
              const has = g.progress.deductions.includes(d.id)
              return (
                <li key={d.id} className={`text-sm leading-6 ${has ? 'text-ivory/90' : 'text-fog/50'}`}>
                  <span className="mr-2 text-gold/70">{has ? '◆' : '◇'}</span>{has ? d.title : '미발견 추리'}{need.includes(d.id) && !has ? ' ★' : ''}
                  {has && <p className="ml-5 text-xs leading-6 text-fog">{d.text}</p>}
                </li>
              )
            })}
          </ul>
          {need.length > 0 && <p className="mt-2 text-xs text-fog">★ 이 장면을 넘기기 위해 필요한 추리</p>}
        </div>
      </aside>
    </div>
  )
}
