import { useEffect, useState } from 'react'
import Button from './components/Button/Button'
import PokemonList from './components/PokemonList/PokemonList'
import PokemonSearch from './components/PokemonSearch/PokemonSearch'
import TeamPage from './components/TeamPage/TeamPage'
import PokedexTeam from './components/PokedexTeam/PokedexTeam'
import TeamEditor from './components/TeamEditor/TeamEditor'
import { restoreTeam, TEAM_STORAGE_KEY, updateTeamMember } from './utils/teamStorage'
import { pokemonList } from './data/pokemon'
import type { Pokemon } from './types/pokemon'
import { filterPokemon } from './utils/filterPokemon'
import './App.css'

const previewTeam = pokemonList.slice(0, 3)

function loadTeam() {
  try {
    return restoreTeam(localStorage.getItem(TEAM_STORAGE_KEY), pokemonList, previewTeam)
  } catch {
    return previewTeam
  }
}

function App() {
  const [activeNavigation, setActiveNavigation] = useState('홈')
  const [team, setTeam] = useState<Pokemon[]>(loadTeam)
  const [editingNumber, setEditingNumber] = useState<number | null>(null)
  const editingPokemon = team.find((pokemon) => pokemon.number === editingNumber)
  const [teamMessage, setTeamMessage] = useState('')
  const [query, setQuery] = useState('')
  const filteredPokemon = filterPokemon(pokemonList, query, '')
  const searchProps = {
    query,
    onQueryChange: setQuery,
  }

  function addToTeam(pokemon: Pokemon) {
    setTeam((currentTeam) => {
      if (currentTeam.length >= 6 || currentTeam.some((item) => item.number === pokemon.number)) {
        return currentTeam
      }
      return [...currentTeam, pokemon]
    })
    setTeamMessage('')
  }

  function removeFromTeam(number: number) {
    setTeam((currentTeam) => currentTeam.filter((pokemon) => pokemon.number !== number))
    setTeamMessage('')
  }

  useEffect(() => {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team))
    } catch {
      window.alert('팀을 저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요.')
    }
  }, [team])

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
          <span className="app-header__team-count">{team.length} / 6</span>
        </nav>
      </header>
      {activeNavigation === '도감' && (
        <>
          <div className="pokedex-heading">
            <div>
              <h1 className="pokedex-title">포켓몬을 찾고 팀을 완성하세요</h1>
              <p className="pokedex-description">도감과 나의 팀을 한 화면에서 관리할 수 있어요</p>
            </div>
            <span className="pokedex-count-badge">내 팀 {team.length} / 6</span>
          </div>
          <PokemonSearch {...searchProps} />
          <div className="pokedex-layout">
            <section className="pokedex-results" aria-labelledby="pokedex-results-title">
              <h2 id="pokedex-results-title" className="pokedex-results__title">도감</h2>
              <PokemonList pokemon={filteredPokemon.slice(0, 3)} onAdd={addToTeam} />
            </section>
            <PokedexTeam team={team} onDelete={removeFromTeam} onEdit={setEditingNumber}
              message={teamMessage} />
          </div>
        </>
      )}
      {activeNavigation === '내 팀' && (
        <TeamPage
          team={team}
          onDelete={removeFromTeam}
          onEdit={setEditingNumber}
          message={teamMessage}
        />
      )}
      {activeNavigation === '홈' && (
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
                <Button variant="secondary" onClick={() => setActiveNavigation('내 팀')}>내 팀</Button>
              </div>
            </div>
            <div className="daily-pokemon-card__art">
              <img src="/0025.svg" alt="" />
            </div>
          </section>
          <PokemonSearch className="home-pokemon-search" {...searchProps} />
          <div className="recommended-pokemon-header">
            <h2 className="recommended-pokemon-title">추천 포켓몬</h2>
            <a className="recommended-pokemon-link" href="/pokedex">
              전체 보기
            </a>
          </div>
          <PokemonList pokemon={filteredPokemon} onAdd={addToTeam} />
          <div className="app__content" />
        </>
      )}
      {editingPokemon && (
        <TeamEditor
          key={editingPokemon.number}
          pokemon={editingPokemon}
          onClose={() => setEditingNumber(null)}
          onApply={(number, nickname, role) => {
            setTeam((currentTeam) => updateTeamMember(currentTeam, number, nickname, role))
            setEditingNumber(null)
            setTeamMessage('수정한 내용을 적용했어요.')
          }}
        />
      )}
    </main>
  )
}

export default App
