import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useGame } from '../engine/store'
import { ENDINGS } from '../data/endings'
import { CGS } from '../data/world'
import { ScreenShell, pub } from './kit'
import { Portrait } from './art'

export function Gallery() {
  const { meta, setScreen } = useGame()
  const [tab, setTab] = useState<'end' | 'cg'>('end')
  return (
    <ScreenShell title="GALLERY" onBack={() => setScreen('title')}>
      <div className="mb-5 flex gap-6">
        {([['end', `ENDINGS ${meta.endings.length}/${ENDINGS.length}`], ['cg', `SCENES ${meta.cgs.length}/${CGS.length}`]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`relative pb-1 font-display text-sm tracking-[.22em] ${tab === k ? 'text-ivory' : 'text-fog hover:text-ivory'}`}>
            {l}<span className={`absolute inset-x-0 -bottom-px h-px bg-gold ${tab === k ? '' : 'opacity-0'}`} />
          </button>
        ))}
      </div>
      {tab === 'end' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {ENDINGS.map((e) => {
            const on = meta.endings.includes(e.id)
            return (
              <article key={e.id} className="gold-frame bg-black/40 p-4">
                <div className="mb-3 flex h-32 items-end justify-center overflow-hidden bg-gradient-to-b from-[#0d1018] to-burgundy/50">
                  <div className="h-[110%]" style={{ filter: on ? 'none' : 'brightness(0) opacity(.55)' }}><Portrait who="roy" expr={e.kind === 'true' ? 'smile' : 'blush'} /></div>
                </div>
                {on ? (
                  <>
                    <h3 className="font-display text-lg tracking-widest text-ivory">{e.title}</h3>
                    <p className="text-xs text-gold">{pub(e.sub)}</p>
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-ivory/70">{e.epilogue[0]}</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-fog"><Lock size={14} /> <span className="text-sm">??? — 미해금 엔딩</span></div>
                )}
              </article>
            )
          })}
        </div>
      )}
      {tab === 'cg' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CGS.map((c, i) => {
            const on = meta.cgs.includes(c.id)
            return (
              <article key={c.id} className="gold-frame bg-black/40">
                <div className="flex h-32 items-end justify-center" style={{ background: on ? 'radial-gradient(circle at 50% 70%, rgba(185,160,120,.28), #0d1018)' : '#0b0b10' }}>
                  <div className="h-full" style={{ filter: on ? 'none' : 'brightness(0) opacity(.5)' }}><Portrait who={i % 2 ? 'agatha' : 'roy'} expr="blush" /></div>
                </div>
                <div className="p-3 text-sm">
                  <p className="font-display text-[10px] tracking-[.3em] text-gold">SCENE {String(i + 1).padStart(2, '0')}</p>
                  {on ? (<><b className="font-normal text-ivory">{c.title}</b><p className="mt-1 text-xs leading-5 text-fog">{c.note}</p></>) : <span className="text-fog"><Lock size={12} className="mr-1 inline" />미해금</span>}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </ScreenShell>
  )
}

export function Records() {
  const { meta, setScreen } = useGame()
  const stats: [string, string][] = [
    ['플레이 횟수', String(meta.plays)],
    ['도달한 엔딩', `${meta.endings.length} / ${ENDINGS.length}`],
    ['수집한 장면', `${meta.cgs.length} / ${CGS.length}`],
  ]
  return (
    <ScreenShell title="RECORDS" onBack={() => setScreen('title')}>
      <dl className="mx-auto grid max-w-2xl grid-cols-2 gap-4">
        {stats.map(([k, v]) => (
          <div key={k} className="gold-frame bg-black/40 p-4"><dt className="text-xs text-fog">{k}</dt><dd className="font-display text-2xl text-gold">{v}</dd></div>
        ))}
      </dl>
    </ScreenShell>
  )
}
