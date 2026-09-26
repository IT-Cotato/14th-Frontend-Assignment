import { useState } from 'react'
import Button from './components/Button/Button'
import PokemonList from './components/PokemonList/PokemonList'
import PokemonSearch from './components/PokemonSearch/PokemonSearch'
import { pokemonList } from './data/pokemon'
import './App.css'

function App() {
  const [activeNavigation, setActiveNavigation] = useState('홈')

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo" aria-label="PokéMate">
            <span>PM</span>
          </div>
          <span className="app-header__name">PokéMate</span>
        </div>
        <nav className="app-header__navigation" aria-label="주요 메뉴">
          {['홈', '도감', '내 팀'].map((navigation) => (
            <button
              className={`app-header__navigation-button ${
                activeNavigation === navigation ? 'app-header__navigation-button--active' : ''
              }`}
              key={navigation}
              type="button"
              onClick={() => setActiveNavigation(navigation)}
            >
              {navigation}
            </button>
          ))}
          <span className="app-header__team-count">0 / 0</span>
        </nav>
      </header>
      {activeNavigation === '도감' && (
        <>
          <div className="pokedex-heading">
            <div>
              <h1 className="pokedex-title">포켓몬 도감</h1>
              <p className="pokedex-description">다양한 포켓몬을 만나고 팀에 추가해보세요</p>
            </div>
            <span className="pokedex-count-badge">전체 151마리</span>
          </div>
          <PokemonSearch />
          <PokemonList pokemon={pokemonList} />
        </>
      )}
      {activeNavigation !== '도감' && (
        <>
          <section className="daily-pokemon-card" aria-label="포켓몬과 함께하는 하루">
            <div className="daily-pokemon-card__content">
              <span className="daily-pokemon-card__badge">오늘의 추천</span>
              <h1 className="daily-pokemon-card__title">포켓몬과 함께하는 하루</h1>
              <p className="daily-pokemon-card__description">
                좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요
              </p>
              <div className="daily-pokemon-card__actions">
                <Button>도감 보기</Button>
                <Button variant="secondary">내 팀</Button>
              </div>
            </div>
            <div className="daily-pokemon-card__art">
              <img src="/0025.svg" alt="" />
            </div>
          </section>
          <PokemonSearch className="home-pokemon-search" />
          <div className="recommended-pokemon-header">
            <h2 className="recommended-pokemon-title">추천 포켓몬</h2>
            <a className="recommended-pokemon-link" href="/pokedex">
              전체 보기
            </a>
          </div>
          <PokemonList pokemon={pokemonList} />
          <div className="app__content" />
        </>
      )}
    </main>
  )
}

export default App
