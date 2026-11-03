import { useGame } from '../engine/store'
import { STORY } from '../data/story'
import { ScreenShell } from './kit'

function fmt(t: number) {
  return new Date(t).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function SavePanel({ canSave }: { canSave?: boolean }) {
  const g = useGame()
  const row = (label: string, d: (typeof g.saves)['auto'], idx: number | 'auto') => (
    <div key={String(idx)} className="gold-frame flex items-center justify-between gap-2 rounded bg-black/40 p-3">
      <div className="min-w-0 text-sm">
        <b className="text-gold">{label}</b>
        {d ? <p className="truncate text-ivory/80">{d.chapter}</p> : <p className="text-fog">비어 있음</p>}
        {d && <p className="text-xs text-fog">{fmt(d.time)}{d.truth ? ' · 진실 루트' : ''}</p>}
      </div>
      <div className="flex shrink-0 gap-1.5">
        {canSave && idx !== 'auto' && <button className="btn !px-3 !py-1 text-sm" onClick={() => g.saveSlot(idx)}>저장</button>}
        <button className="btn !px-3 !py-1 text-sm" disabled={!d || !STORY[d.nodeId]} onClick={() => g.loadSlot(idx)}>불러오기</button>
      </div>
    </div>
  )
  return (
    <div className="flex flex-col gap-2">
      {row('자동 저장', g.saves.auto, 'auto')}
      {g.saves.slots.map((s, i) => row(`슬롯 ${i + 1}`, s, i))}
    </div>
  )
}

export function SavesScreen() {
  const setScreen = useGame((s) => s.setScreen)
  return (
    <ScreenShell title="LOAD" onBack={() => setScreen('title')}>
      <div className="mx-auto max-w-xl"><SavePanel /></div>
    </ScreenShell>
  )
}

export function SettingsPanel() {
  const { settings, setSettings, resetAll } = useGame()
  return (
    <div className="flex flex-col gap-5 text-sm">
      <label className="flex flex-col gap-1.5">
        <span className="text-gold">사운드 볼륨 {Math.round(settings.volume * 100)}%</span>
        <input type="range" min={0} max={1} step={0.05} value={settings.volume} onChange={(e) => setSettings({ volume: Number(e.target.value) })} className="accent-[#b99a63]" />
      </label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={settings.muted} onChange={(e) => setSettings({ muted: e.target.checked })} className="accent-[#b99a63]" /> 음소거</label>
      <div>
        <span className="text-gold">텍스트 속도</span>
        <div className="mt-1.5 flex gap-2">
          {(['slow', 'normal', 'instant'] as const).map((s) => (
            <button key={s} className={`btn !px-3 !py-1 ${settings.textSpeed === s ? '!border-gold !bg-burgundy' : ''}`} onClick={() => setSettings({ textSpeed: s })}>{s === 'slow' ? '느리게' : s === 'normal' ? '보통' : '즉시'}</button>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" checked={settings.auto} onChange={(e) => setSettings({ auto: e.target.checked })} className="accent-[#b99a63]" /> 자동 진행</label>
      <button className="btn !border-red-800/70 text-red-300" onClick={() => { if (confirm('모든 진행 기록과 저장 데이터를 삭제할까요?')) resetAll() }}>데이터 초기화</button>
    </div>
  )
}

export function SettingsScreen() {
  const setScreen = useGame((s) => s.setScreen)
  return (
    <ScreenShell title="SETTINGS" onBack={() => setScreen('title')}>
      <div className="mx-auto max-w-md"><SettingsPanel /></div>
    </ScreenShell>
  )
}
