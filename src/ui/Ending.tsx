import { useRef } from 'react'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { useGame } from '../engine/store'
import { ENDING_BY_ID, ENDINGS } from '../data/endings'
import { pub } from './kit'

const KIND: Record<string, string> = { happy: 'HAPPY END', dark: 'DARK END', true: 'TRUE END', tragic: 'HIDDEN TRAGEDY' }

export function Ending() {
  const { endingId, setScreen, meta, truthUnlocked, startTruth } = useGame()
  const card = useRef<HTMLDivElement>(null)
  const e = endingId ? ENDING_BY_ID[endingId] : null
  if (!e) return null
  const save = async () => {
    if (!card.current) return
    try {
      const url = await toPng(card.current, { pixelRatio: 2, backgroundColor: '#101014' })
      const a = document.createElement('a')
      a.href = url
      a.download = `labyrinth-${e.id}.png`
      a.click()
    } catch { /* 캡처 실패는 무시 */ }
  }
  const tone = e.kind === 'dark' ? '#4a1725' : e.kind === 'tragic' ? '#101014' : e.kind === 'true' ? '#2a2540' : '#2a1d2a'
  return (
    <div className="scroll-thin absolute inset-0 overflow-y-auto bg-[#08090d]">
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div ref={card} className="gold-frame w-full max-w-xl p-6 text-center sm:p-10" style={{ background: `radial-gradient(ellipse at top, ${tone}, #101014 80%)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }}>
          <p className="font-display text-xs tracking-[.5em] text-gold">{KIND[e.kind]}</p>
          <h1 className="mt-3 font-display text-2xl tracking-[.15em] text-ivory sm:text-4xl">{e.title}</h1>
          <p className="mt-1 text-xs text-fog">{pub(e.sub)}</p>
          <div className="mx-auto my-5 h-px w-24 bg-gold/60" />
          {e.epilogue.map((p, i) => (
            <motion.p key={i} className="mb-3 text-sm leading-8 text-ivory/85 sm:text-base" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 1.4, duration: 1 }}>{p}</motion.p>
          ))}
          <motion.p className={`mt-5 italic text-gold ${e.kind === 'true' ? 'text-lg sm:text-2xl' : 'text-sm'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 + e.epilogue.length * 1.4 + 0.5, duration: 1.6 }}>
            {e.last}
          </motion.p>
          <p className="mt-6 text-[11px] text-fog">엔딩 {meta.endings.length}/{ENDINGS.length}</p>
        </motion.div>
      </div>
      <motion.div className="sticky bottom-0 flex flex-wrap justify-center gap-2 bg-gradient-to-t from-black to-transparent p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}>
        <button className="btn" onClick={() => setScreen('title')}>타이틀로</button>
        <button className="btn" onClick={() => setScreen('gallery')}>갤러리</button>
        <button className="btn" onClick={save}>엔딩 카드 저장</button>
        {truthUnlocked() && !endingId?.startsWith('true') && endingId !== 'tragic' && <button className="btn !border-rose !text-rose" onClick={startTruth}>다섯 번째 문을 연다</button>}
      </motion.div>
    </div>
  )
}
