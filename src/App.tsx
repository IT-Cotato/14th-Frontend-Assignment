import { useState } from 'react'
import Button from './components/Button/Button'
import PokemonCard from './components/PokemonCard/PokemonCard'
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
      <div className="pokemon-search-row">
        <div className="pokemon-search">
          <img className="pokemon-search__icon" src="/search.svg" alt="" />
          <input
            aria-label="포켓몬 검색"
            className="pokemon-search__input"
            placeholder="이름 또는 번호"
            type="search"
          />
        </div>
        <Button>검색</Button>
      </div>
      <div className="recommended-pokemon-header">
        <h2 className="recommended-pokemon-title">추천 포켓몬</h2>
        <a className="recommended-pokemon-link" href="/pokedex">
          전체 보기
        </a>
      </div>
      <div className="pokemon-card-list">
        <PokemonCard
          imageAlt="피카츄"
          imageSrc="/0025.svg"
          name="피카츄"
          number="#0025"
          type="ELECTRIC"
        />
        <PokemonCard
          imageAlt="리자몽"
          imageSrc="/0006.svg"
          name="리자몽"
          number="#0006"
          type="FIRE"
        />
        <PokemonCard
          imageAlt="이상해씨"
          imageSrc="/0001.svg"
          name="이상해씨"
          number="#0001"
          type="GRASS"
        />
        <PokemonCard
          imageAlt="거북왕"
          imageSrc="/0009.svg"
          name="거북왕"
          number="#0009"
          type="WATER"
        />
      </div>
      <div className="app__content" />
    </main>
  )
}

export default App