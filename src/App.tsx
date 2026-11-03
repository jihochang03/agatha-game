import { useGame } from './engine/store'
import { Title } from './ui/Title'
import { Story } from './ui/Story'
import { Ending } from './ui/Ending'
import { Gallery, Records } from './ui/Gallery'
import { SavesScreen, SettingsScreen } from './ui/Panels'

export default function App() {
  const screen = useGame((s) => s.screen)
  return (
    <main className="relative h-full w-full overflow-hidden bg-ink">
      {screen === 'title' && <Title />}
      {screen === 'story' && <Story />}
      {screen === 'ending' && <Ending />}
      {screen === 'gallery' && <Gallery />}
      {screen === 'records' && <Records />}
      {screen === 'settings' && <SettingsScreen />}
      {screen === 'saves' && <SavesScreen />}
    </main>
  )
}
