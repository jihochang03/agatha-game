import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../engine/store'
import { audio } from '../engine/audio'
import { Background } from './art'

export function Title() {
  const { setScreen, newGame, continueGame, saves, settings } = useGame()
  const [pos, setPos] = useState({ x: 62, y: 55 })
  const [opening, setOpening] = useState(false)

  useEffect(() => { audio.configure(settings.volume, settings.muted) }, [settings.volume, settings.muted])

  const start = () => {
    audio.start()
    setOpening(true)
    setTimeout(() => newGame(), 1700)
  }
  const hasSave = !!saves.auto || saves.slots.some(Boolean)
  const menu: { label: string; on: () => void; disabled?: boolean }[] = [
    { label: 'NEW GAME', on: () => start() },
    { label: 'CONTINUE', on: () => { audio.start(); continueGame() }, disabled: !saves.auto },
    { label: 'LOAD', on: () => setScreen('saves'), disabled: !hasSave },
    { label: 'RECORDS', on: () => setScreen('records') },
    { label: 'GALLERY', on: () => setScreen('gallery') },
    { label: 'SETTINGS', on: () => setScreen('settings') },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden" onPointerMove={(e) => setPos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })}>
      <Background id="hall" />
      {/* 촛불 조명: 마우스 쪽으로 천천히 기운다 */}
      <div className="pointer-events-none absolute inset-0 flicker transition-[background] duration-700" style={{ background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(255,184,110,.16), transparent 30%)`, mixBlendMode: 'screen' }} />
      {/* 좌측 가독성 확보 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,13,.88),rgba(8,9,13,.45)_42%,transparent_70%)] portrait:bg-[linear-gradient(180deg,rgba(8,9,13,.78),rgba(8,9,13,.3)_55%,rgba(8,9,13,.85))]" />
      <motion.div className="pointer-events-none absolute inset-0 bg-[#ff3a4a]" animate={{ opacity: opening ? 0.18 : 0 }} transition={{ duration: 1.4 }} />

      <motion.div className="relative z-10 flex h-full flex-col justify-between px-[7vw] py-[6vh] portrait:px-8" animate={{ opacity: opening ? 0 : 1 }} transition={{ delay: opening ? 0.7 : 0, duration: 0.9 }}>
        <header>
          <p className="font-display text-xs tracking-[.5em] text-gold/90 sm:text-sm">A GOTHIC ROMANCE</p>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,8vw,6.5rem)] font-medium leading-[.95] tracking-[.04em] text-ivory [text-shadow:0_4px_30px_rgba(0,0,0,.7)]">The<br />Labyrinth</h1>
          <div className="mt-6 flex items-center gap-4"><span className="h-px w-14 bg-gold/70" /><p className="text-lg text-ivory/90 sm:text-2xl">미궁 속의 티타임</p></div>
          <p className="mt-3 pl-[4.5rem] font-display text-sm italic text-fog">당신이 쓰지 못한 마지막 장</p>
        </header>
        <nav aria-label="메인 메뉴" className="flex flex-col">
          {menu.map((m) => (
            <button key={m.label} className={`menu-item`} disabled={m.disabled} onClick={m.on}>{m.label}</button>
          ))}
        </nav>
      </motion.div>
      <p className="pointer-events-none absolute bottom-[3vh] right-[4vw] z-10 font-display text-xs italic text-fog/80 portrait:hidden">“둘 중 하나가 죽어야 끝나는 게임.”</p>
    </div>
  )
}
