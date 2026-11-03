import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Gauge, History, Menu as MenuIcon } from 'lucide-react'
import { useGame } from '../engine/store'
import { STORY } from '../data/story'
import { choiceAvailable } from '../engine/logic'
import { MANUSCRIPT } from '../data/world'
import { Background, Figure, ROY_GLOW } from './art'
import { Modal } from './kit'
import { SavePanel, SettingsPanel } from './Panels'
import type { Expr } from '../engine/types'

const GLITCH = ['루이', '로ㅇ', 'R○Y', '…이', '노이', '로이']
const SUB_EN: Record<string, string> = {
  '폭우의 밤': 'THE STORM', '하이드로 호텔': 'HYDRO HOTEL', '독의 원고': 'THE POISON MANUSCRIPT',
  '함께 쓰는 이야기': 'WRITTEN TOGETHER', '와인과 밤': 'WINE AND NIGHT', '아침': 'MORNING',
}
function chapterLabel(ch: string): [string, string] {
  const [a, b = ''] = ch.split(' — ')
  const head = a.startsWith('프롤로그') ? 'PROLOGUE' : a
  const sub = a.startsWith('프롤로그') ? SUB_EN[b] : SUB_EN[b]
  return [head, sub ?? b]
}

function useTypewriter(text: string, speed: 'slow' | 'normal' | 'instant', key: string) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (speed === 'instant' || !text) { setN(text.length); return }
    const ms = speed === 'slow' ? 55 : 26
    const t = setInterval(() => setN((v) => { if (v >= text.length) { clearInterval(t); return v } return v + 1 }), ms)
    return () => clearInterval(t)
  }, [key, text, speed])
  return { shown: text.slice(0, n), done: n >= text.length, finish: () => setN(text.length) }
}

export function Story() {
  const g = useGame()
  const node = STORY[g.nodeId]
  const [glitch, setGlitch] = useState<string | null>(null)
  const [erased, setErased] = useState(false)
  const [clock, setClock] = useState(false)
  const [stat, setStat] = useState(false)
  const lastA = useRef<Expr>('neutral')
  const lastR = useRef<Expr>('neutral')
  const text = node?.text ?? ''
  const { shown, done, finish } = useTypewriter(text, g.settings.textSpeed, node?.id ?? '')
  const hasChoices = !!node?.choices?.length
  const fx = node?.fx ?? []
  const warm = fx.includes('warm') || (fx.includes('voice') && done)
  const horror = fx.includes('horror')

  useEffect(() => {
    setErased(false)
    setClock(fx.includes('reverseClock'))
    if (!fx.includes('nameGlitch')) { setGlitch(null); return }
    let i = 0
    const t = setInterval(() => { setGlitch(GLITCH[i % GLITCH.length]); i++; if (i > 9) { clearInterval(t); setGlitch(null) } }, 140)
    return () => clearInterval(t)
  }, [node?.id])

  useEffect(() => {
    if (!done || !fx.includes('erase')) return
    const t = setTimeout(() => setErased(true), 1400)
    return () => clearTimeout(t)
  }, [done, node?.id])

  const onNext = useCallback(() => {
    if (!node || g.overlay) return
    if (stat) { setStat(false); return }
    if (!done) { finish(); return }
    if (!hasChoices) g.advance()
  }, [node, g.overlay, done, hasChoices, g.nodeId, stat])

  useEffect(() => {
    if (!g.settings.auto || !done || hasChoices || g.overlay || !node) return
    const t = setTimeout(() => g.advance(), 1400 + text.length * 45)
    return () => clearTimeout(t)
  }, [g.settings.auto, done, hasChoices, g.overlay, node?.id])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { g.setOverlay(g.overlay ? null : 'menu'); return }
      if (g.overlay) return
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNext() }
      else if (/^[1-4]$/.test(e.key) && hasChoices && done) g.choose(Number(e.key) - 1)
      else if (e.key.toLowerCase() === 'l') g.setOverlay('log')
      else if (e.key.toLowerCase() === 'a') g.setSettings({ auto: !g.settings.auto })
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onNext, hasChoices, done, g.overlay, g.settings.auto, g.nodeId])

  const speakerName = useMemo(() => {
    if (node?.speaker === 'agatha') return '아가사'
    if (node?.speaker === 'roy') return glitch ?? '로이'
    return ''
  }, [node, glitch])

  if (!node) return null
  const who = node.character
  const isA = node.speaker === 'agatha'
  if (isA) lastA.current = node.expression ?? 'neutral'
  else lastR.current = node.expression ?? 'neutral'
  const exprA: Expr = lastA.current
  const exprR: Expr = lastR.current
  const lit = (side: 'agatha' | 'roy') => (node.speaker === 'narr' ? 0.84 : (side === 'agatha') === isA ? 1.04 : 0.6)
  const royVoice = node.speaker === 'roy' ? `voice-${who === 'roy' || !who ? 'roy' : who}` : ''
  const [chHead, chSub] = chapterLabel(node.chapter)
  const tint = ROY_GLOW[(who ?? 'roy') as keyof typeof ROY_GLOW]
  const choicesNow = hasChoices && done

  return (
    <div className="absolute inset-0 select-none overflow-hidden" onClick={onNext}>
      <Background id={node.background} warm={warm} horror={horror} />
      <div key={node.background} className="scene-fade pointer-events-none absolute inset-0 z-30" />

      {/* 무대: 아가사는 왼쪽, 로이는 오른쪽. 같은 크기, 같은 기준선. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[21vh] z-10 h-[min(64vh,92vw)] portrait:bottom-[26vh]">
        <AnimatePresence>
          {(!node.hideA || isA) && (
            <motion.div key="agatha" className="absolute bottom-0 left-[9%] h-full aspect-[700/940] portrait:left-[-14vw]" style={{ zIndex: isA ? 12 : 11 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <Figure who="agatha" expr={exprA} lit={lit('agatha')} warm={warm} tint="#b68b94" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {who && (
            <motion.div key="roy" className="absolute bottom-0 right-[9%] h-full aspect-[700/940] portrait:right-[-14vw]" style={{ zIndex: isA ? 11 : 12 }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <Figure who="roy" expr={exprR} lit={lit('roy')} warm={warm} tint={tint} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HUD — 최소한의 정보만 */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3 sm:p-5" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-none max-w-[52%] sm:max-w-none">
          <p className="font-display text-[13px] tracking-[.32em] text-ivory/80 sm:text-sm">{chHead}</p>
          <div className="mt-1 flex items-center gap-2"><span className="h-px w-6 bg-gold/70" /><p className="font-display text-[11px] tracking-[.28em] text-fog sm:text-xs">{chSub}</p></div>
        </div>
        <div className="relative flex items-center gap-0.5 text-fog">
          {clock && <span className="mr-2 text-base text-gold/80" style={{ display: 'inline-block', animation: 'spinrev 4s linear infinite' }} aria-label="거꾸로 가는 시계">◷</span>}
          <HudBtn label="상태" on={() => setStat((v) => !v)} active={stat}><Gauge size={17} strokeWidth={1.4} /></HudBtn>
          <HudBtn label="원고" on={() => g.setOverlay('manuscript')} glow={!!node.echo}><BookOpen size={17} strokeWidth={1.4} /></HudBtn>
          <HudBtn label="기록 (L)" on={() => g.setOverlay('log')}><History size={17} strokeWidth={1.4} /></HudBtn>
          <HudBtn label="메뉴 (Esc)" on={() => g.setOverlay('menu')}><MenuIcon size={17} strokeWidth={1.4} /></HudBtn>
          <AnimatePresence>
            {stat && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="panel gold-frame absolute right-0 top-10 w-44 p-3 text-xs">
                <Stat label="의심" v={g.progress.sus} c="#9fb3d9" />
                <Stat label="매혹" v={g.progress.fas} c="#c0788a" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 선택지 — 화면 중앙 오버레이 */}
      <AnimatePresence>
        {choicesNow && (
          <motion.div className="absolute inset-0 z-20 flex items-center justify-center bg-[#08090d]/50 px-4 pb-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div role="group" aria-label="선택지" className="flex w-full max-w-[760px] flex-col gap-2.5">
              {node.choices!.map((c, i) => {
                const ok = choiceAvailable(g.progress, c)
                return (
                  <motion.button key={i} className="choice" disabled={!ok} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.09 }} onClick={() => g.choose(i)}>
                    <span className="mr-2 font-display text-gold/80">{i + 1}</span>{c.label}
                    {!ok && c.hint && <span className="mt-1 block text-xs text-fog">— {c.hint}</span>}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 대화창 — 하단 고정, 내용에 맞춰 높이 유동, 전체 문장 크기를 미리 확보해 흔들림 없음 */}
      <div className="absolute inset-x-0 bottom-0 z-[15] flex justify-center px-3 pb-[2.2vh] sm:px-0" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-[92%] max-w-[1100px] cursor-pointer border border-[rgba(185,160,120,.2)] bg-[rgba(12,14,22,.82)] px-5 pb-3 pt-5 shadow-[0_-12px_40px_rgba(0,0,0,.35)] sm:w-[86%] sm:px-9 sm:pb-4 sm:pt-6" onClick={onNext}>
          {speakerName && (
            <div className={`absolute -top-3 left-5 flex items-center gap-2 bg-[#0d1018] px-3 py-0.5 sm:left-9 ${glitch ? 'tremble' : ''}`}>
              <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" /><span className="text-[13px] text-ivory/90 sm:text-[15px]">{speakerName}</span>
            </div>
          )}
          <div className="scroll-thin relative max-h-[22vh] min-h-[3.6em] overflow-y-auto sm:min-h-[3.7em] portrait:max-h-[24vh]">
            <p aria-hidden className="invisible whitespace-pre-wrap text-[16px] leading-[1.75] sm:text-[clamp(17px,1.45vw,21px)] sm:leading-[1.7]">{text || ' '}</p>
            <p className={`absolute inset-0 whitespace-pre-wrap text-[16px] leading-[1.75] sm:text-[clamp(17px,1.45vw,21px)] sm:leading-[1.7] ${node.speaker === 'narr' ? 'text-ivory/80' : 'text-[#f1e8dc]'} ${royVoice} ${fx.includes('voice') && done ? 'text-[#f4dcab] [text-shadow:0_0_14px_rgba(185,160,120,.55)]' : ''} ${erased ? 'erase' : ''}`}>{shown}</p>
          </div>
          {done && !hasChoices && <span className="absolute bottom-2 right-4 animate-pulse text-xs text-gold/80">▼</span>}
        </div>
      </div>

      <AnimatePresence>
        {g.toast && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="panel gold-frame absolute left-1/2 top-16 z-50 max-w-[90%] -translate-x-1/2 px-4 py-2 text-center text-sm text-gold" role="status">{g.toast}</motion.div>
        )}
      </AnimatePresence>

      {g.overlay === 'log' && <LogPanel onClose={() => g.setOverlay(null)} />}
      {g.overlay === 'manuscript' && <ManuscriptPanel echo={node.echo} onClose={() => g.setOverlay(null)} />}
      {g.overlay === 'menu' && <MenuPanel />}
    </div>
  )
}

function Stat({ label, v, c }: { label: string; v: number; c: string }) {
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="mb-1 flex justify-between text-fog"><span>{label}</span><span className="font-display">{v}/10</span></div>
      <div className="h-px w-full bg-white/10"><div className="h-px" style={{ width: `${v * 10}%`, background: c, boxShadow: `0 0 6px ${c}` }} /></div>
    </div>
  )
}

function HudBtn({ children, label, on, active, glow }: { children: React.ReactNode; label: string; on: () => void; active?: boolean; glow?: boolean }) {
  return (
    <button aria-label={label} title={label} onClick={on}
      className={`flex h-9 w-9 items-center justify-center transition-colors hover:text-ivory ${active ? 'text-ivory' : ''} ${glow ? 'flicker !text-gold' : ''}`}>
      {children}
    </button>
  )
}

function LogPanel({ onClose }: { onClose: () => void }) {
  const log = useGame((s) => s.log)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView() }, [])
  return (
    <Modal title="대화 기록" wide onClose={onClose}>
      <div className="flex flex-col gap-3">
        {log.length === 0 && <p className="text-fog">아직 기록이 없습니다.</p>}
        {log.map((l, i) => (
          <p key={i} className={`text-sm leading-7 ${l.speaker === '선택' ? 'text-gold' : 'text-ivory/85'}`}>
            {l.speaker && <b className="mr-2 font-normal text-rose">{l.speaker === '선택' ? '▸ 선택' : l.speaker}</b>}{l.text}
          </p>
        ))}
        <div ref={end} />
      </div>
    </Modal>
  )
}

function ManuscriptPanel({ echo, onClose }: { echo?: string; onClose: () => void }) {
  return (
    <Modal title="미궁 속의 티타임 — 원고" onClose={onClose}>
      <p className="mb-3 text-xs text-fog">{echo ? '지금의 대사와 겹치는 문장이 희미하게 빛난다.' : '아가사가 쓰지 않았다고 믿는 원고.'}</p>
      <div className="flex flex-col gap-3 leading-8">
        {MANUSCRIPT.map((m) => (
          <p key={m.id} className={m.id === echo ? 'bg-burgundy/50 px-2 py-1 text-[#f4dcab] [text-shadow:0_0_10px_rgba(185,160,120,.7)]' : 'text-ivory/65'}>{m.text}</p>
        ))}
      </div>
    </Modal>
  )
}

function MenuPanel() {
  const g = useGame()
  const [sub, setSub] = useState<null | 'save' | 'settings'>(null)
  if (sub === 'save') return <Modal title="저장 / 불러오기" onClose={() => setSub(null)}><SavePanel canSave /></Modal>
  if (sub === 'settings') return <Modal title="설정" onClose={() => setSub(null)}><SettingsPanel /></Modal>
  const item = (label: string, on: () => void) => <button className="menu-item !text-lg !tracking-[.14em]" onClick={on}>{label}</button>
  return (
    <Modal title="메뉴" onClose={() => g.setOverlay(null)}>
      <div className="flex flex-col">
        {item('계속하기', () => g.setOverlay(null))}
        {item('저장 / 불러오기', () => setSub('save'))}
        {item(g.settings.auto ? '자동 진행 끄기' : '자동 진행 켜기', () => g.setSettings({ auto: !g.settings.auto }))}
        {item('설정', () => setSub('settings'))}
        {item('타이틀로', () => g.setScreen('title'))}
        <p className="mt-3 text-xs text-fog">Enter/Space 진행 · 1–4 선택 · L 기록 · A 자동 · Esc 메뉴</p>
      </div>
    </Modal>
  )
}
