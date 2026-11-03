import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Background } from './art'

export const pub = (s: string) => s.replace(/작로이|범로이|솧로이|고로이/g, '로이')

export function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-ivory/80" aria-label={`${label} ${value}/10`}>
      <span className="w-6 shrink-0">{label}</span>
      <div className="h-px w-24 bg-white/15"><div className="h-px" style={{ width: `${value * 10}%`, background: color }} /></div>
    </div>
  )
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <motion.div className="absolute inset-0 z-40 flex items-center justify-center bg-[#08090d]/75 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose}>
      <motion.div
        role="dialog"
        aria-label={title}
        className={`flex max-h-[88vh] w-full flex-col border border-gold/25 bg-[#0d1018]/95 shadow-[0_20px_60px_rgba(0,0,0,.6)] ${wide ? 'max-w-3xl' : 'max-w-lg'}`}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="flex items-center gap-3 font-display text-lg tracking-[.2em] text-ivory"><span className="h-px w-6 bg-gold/70" />{title}</h2>
          <button aria-label="닫기" onClick={onClose} className="text-fog hover:text-ivory"><X size={18} strokeWidth={1.4} /></button>
        </div>
        <div className="scroll-thin overflow-y-auto px-5 pb-5 pt-2">{children}</div>
      </motion.div>
    </motion.div>
  )
}

export function ScreenShell({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <Background id="study" />
      <div className="absolute inset-0 bg-[#0d1018]/86" />
      <header className="relative flex items-center justify-between px-5 py-4 sm:px-10 sm:py-6">
        <h1 className="flex items-center gap-4 font-display text-2xl tracking-[.28em] text-ivory"><span className="h-px w-10 bg-gold/70" />{title}</h1>
        <button className="menu-item !py-1 !text-base" onClick={onBack}>BACK</button>
      </header>
      <div className="scroll-thin relative min-h-0 flex-1 overflow-y-auto px-5 pb-8 sm:px-10">{children}</div>
    </div>
  )
}
