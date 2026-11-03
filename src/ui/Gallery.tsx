import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useGame } from '../engine/store'
import { ENDINGS, QUOTE_REGISTRY } from '../data/endings'
import { MASKS, ROMANCE_TITLES, ROUTE_COLOR } from '../data/world'
import { ROUTES } from '../engine/types'
import { ScreenShell, pub } from './kit'
import { MasksPanel } from './Masks'
import { Portrait } from './art'

export function Gallery() {
  const { meta, setScreen } = useGame()
  const [tab, setTab] = useState<'end' | 'cg' | 'mask'>('end')
  return (
    <ScreenShell title="GALLERY" onBack={() => setScreen('title')}>
      <div className="mb-4 flex gap-2">
        {([['end', `엔딩 ${meta.endings.length}/${ENDINGS.length}`], ['cg', `특별 일러스트 ${meta.romance.length}/12`], ['mask', '로이의 가면']] as const).map(([k, l]) => (
          <button key={k} className={`btn !px-3 !py-1 text-sm ${tab === k ? '!border-gold !bg-burgundy' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === 'end' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ENDINGS.map((e) => {
            const on = meta.endings.includes(e.id)
            return (
              <article key={e.id} className={`gold-frame relative overflow-hidden rounded p-4 ${on ? 'bg-black/50' : 'bg-black/30'}`}>
                <div className="mb-3 flex h-28 items-end justify-center overflow-hidden rounded bg-gradient-to-b from-navy to-burgundy/60">
                  <div className="h-[110%]" style={{ filter: on ? 'none' : 'brightness(0) opacity(.55)' }}>
                    <Portrait who={e.route === 'truth' || e.route === 'hidden' ? 'roy' : e.route} expr={e.kind === 'dark' || e.kind === 'tragic' ? 'sad' : 'smile'} />
                  </div>
                </div>
                {on ? (
                  <>
                    <h3 className="font-display tracking-widest text-ivory">{e.title}</h3>
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.flatMap((r) => ROMANCE_TITLES[r].map((t, i) => ({ r, t, key: `${r}${i + 1}`, n: i + 1 }))).map((c) => {
            const on = meta.romance.includes(c.key)
            return (
              <article key={c.key} className="gold-frame overflow-hidden rounded bg-black/40">
                <div className="flex h-32 items-end justify-center" style={{ background: on ? `radial-gradient(circle at 50% 70%, ${ROUTE_COLOR[c.r]}88, #101014)` : '#0b0b10' }}>
                  <div className="h-[100%]" style={{ filter: on ? 'none' : 'brightness(0) opacity(.5)' }}><Portrait who={c.r} expr="blush" /></div>
                </div>
                <div className="p-2 text-sm">
                  <p className="text-[10px] tracking-widest text-gold">ROMANCE EVENT {c.n}</p>
                  {on ? <b className="text-ivory">{c.t}</b> : <span className="text-fog"><Lock size={12} className="mr-1 inline" />미해금</span>}
                </div>
              </article>
            )
          })}
        </div>
      )}
      {tab === 'mask' && <MasksPanel />}
    </ScreenShell>
  )
}

export function Records() {
  const { meta, setScreen } = useGame()
  const maskTotal = ROUTES.reduce((a, r) => a + MASKS[r].length, 0)
  const stats: [string, string][] = [
    ['플레이 횟수', String(meta.plays)],
    ['진실 루트 플레이', String(meta.truthPlays)],
    ['도달한 엔딩', `${meta.endings.length} / ${ENDINGS.length}`],
    ['완료한 가면의 길', `${meta.routesDone.length} / 4`],
    ['로이의 가면 단서', `${meta.masks.length} / ${maskTotal}`],
    ['로맨스 이벤트', `${meta.romance.length} / 12`],
    ['다섯 번째 문', meta.routesDone.length >= 4 ? '열림' : '잠김'],
  ]
  return (
    <ScreenShell title="RECORDS" onBack={() => setScreen('title')}>
      <div className="mx-auto max-w-2xl">
        <dl className="grid grid-cols-2 gap-3">
          {stats.map(([k, v]) => (
            <div key={k} className="gold-frame rounded bg-black/40 p-3"><dt className="text-xs text-fog">{k}</dt><dd className="font-display text-xl text-gold">{v}</dd></div>
          ))}
        </dl>
        <details className="mt-8 text-xs text-fog">
          <summary className="cursor-pointer text-sm text-ivory/80">사용 문구 권리 확인 목록 (배포 전 점검)</summary>
          <p className="my-2">원작 대사일 가능성이 있는 문구입니다. 공개 배포 전 사용 권한을 확인하세요. (소스: src/data/endings.ts의 QUOTE_REGISTRY)</p>
          <ul className="list-disc pl-5 leading-6">{QUOTE_REGISTRY.map((q) => <li key={q.text}>“{q.text}” — {q.usedIn}</li>)}</ul>
        </details>
      </div>
    </ScreenShell>
  )
}
