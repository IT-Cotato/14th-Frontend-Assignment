import PokemonHeader from './components/PokemonHeader'
import PokemonList from './components/PokemonList'

const navigationItems = [
  { label: '홈', href: '#home' },
  { label: '도감', href: '#pokedex' },
  { label: '내 팀', href: '#team' },
]

function App() {
  const activeItem = '홈'
  const teamCount = 0
  const teamLimit = 6

  return (
    <main className="app-shell" id="home">
      <header className="pokemon-header">
        <a className="pokemon-header__brand" href="#home" aria-label="PokéMate 홈">
          <span className="pokemon-header__mark" aria-hidden="true">
            PM
          </span>
          <span className="pokemon-header__wordmark">PokéMate</span>
        </a>

        <nav className="pokemon-header__navigation" aria-label="주요 메뉴">
          {navigationItems.map((item) => {
            const isActive = item.label === activeItem

            return (
              <a
                className={`pokemon-header__nav-item${isActive ? ' is-active' : ''}`}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                key={item.label}
              >
                {item.label}
              </a>
            )
          })}
          <span
            className="pokemon-header__team-count"
            aria-label={`팀 구성 ${teamCount}명, 최대 ${teamLimit}명`}
          >
            {teamCount} / {teamLimit}
          </span>
        </nav>
      </header>

      <PokemonHeader />
      <PokemonList />
    </main>
  )
}

export default App
