import { useGame } from '../engine/store'
import { ROUTES } from '../engine/types'
import { MASKS, ROUTE_COLOR, ROUTE_TITLE } from '../data/world'

const NUM = ['I', 'II', 'III', 'IV']

/** 게임 속에서 네 로이는 모두 '로이'. 가면 번호와 단서로만 구분된다. */
export function MasksPanel() {
  const masks = useGame((s) => s.meta.masks)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {ROUTES.map((r, i) => {
        const got = MASKS[r].filter((m) => masks.includes(m.id)).length
        return (
          <section key={r} className="gold-frame rounded bg-black/40 p-3" style={{ borderColor: ROUTE_COLOR[r] }}>
            <h3 className="font-display text-sm tracking-[.25em] text-gold">가면 {NUM[i]} <span className="ml-1 text-xs text-fog">{got}/3</span></h3>
            <p className="mb-2 mt-1 text-sm italic text-rose">{got > 0 ? `“${ROUTE_TITLE[r]}”` : '— 아직 알 수 없다 —'}</p>
            <ul className="flex flex-col gap-1.5">
              {MASKS[r].map((m) => {
                const on = masks.includes(m.id)
                return (
                  <li key={m.id} className={`text-sm leading-6 ${on ? 'text-ivory/90' : 'text-fog/50'}`}>
                    <b className="mr-1 text-gold/80">{on ? m.label : '???'}</b>
                    {on ? m.text : '이 가면의 단서는 잠겨 있다.'}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
