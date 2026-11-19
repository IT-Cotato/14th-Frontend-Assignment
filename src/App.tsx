import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import PokemonDetailPage from './pages/PokemonDetailPage'
import TeamEditPage from './pages/TeamEditPage'
import NotFoundPage from './pages/NotFoundPage'
import PokemonList from './components/PokemonList/PokemonList'
import PokemonSearch from './components/PokemonSearch/PokemonSearch'
import TeamPage from './components/TeamPage/TeamPage'
import PokedexPage from './components/PokedexPage/PokedexPage'
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
  const { pathname } = useLocation()
  const activeNavigation = pathname.startsWith('/my-team') ? '내 팀' : pathname.startsWith('/pokemon') ? '도감' : '홈'
  const [team, setTeam] = useState<Pokemon[]>(loadTeam)
  const [teamCheckpoint, setTeamCheckpoint] = useState<Pokemon[]>(() => team)
  const [teamMessage, setTeamMessage] = useState('')
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const availableTypes = [...new Set(pokemonList.flatMap((pokemon) => pokemon.types))]
  const filteredPokemon = filterPokemon(pokemonList, query, '')
  const searchProps = {
    query,
    types: availableTypes,
    selectedType,
    onTypeChange: setSelectedType,
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

  function saveTeam() {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team))
      setTeamCheckpoint([...team])
      setTeamMessage('팀을 저장했어요.')
    } catch {
      setTeamMessage('팀을 저장하지 못했어요. 브라우저 저장 공간 설정을 확인해 주세요.')
    }
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
            <Link
              className={`app-header__navigation-button ${
                activeNavigation === navigation ? 'app-header__navigation-button--active' : ''
              }`}
              key={navigation}
              to={navigation === '홈' ? '/' : navigation === '도감' ? '/pokemon' : '/my-team'}
              onClick={() => {
                if (navigation === '내 팀' && activeNavigation !== '내 팀') {
                  setTeamCheckpoint([...team])
                  setTeamMessage('')
                }
              }}
            >
              {navigation}
            </Link>
          ))}
          <span className="app-header__team-count">{team.length} / 6</span>
        </nav>
      </header>
      <Routes>
      <Route path="/pokemon" element={<PokedexPage onAdd={addToTeam} />} />
      <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage onAdd={addToTeam} />} />
      <Route path="/my-team" element={
        <TeamPage
          team={team}
          onDelete={removeFromTeam}
          onSave={saveTeam}
          onCancel={() => {
            setTeam([...teamCheckpoint])
            setTeamMessage('변경을 취소했어요.')
          }}
          message={teamMessage}
        />
      } />
      <Route path="/" element={
        <>
          <section className="daily-pokemon-card" aria-label="포켓몬과 함께하는 하루">
            <div className="daily-pokemon-card__content">
              <span className="daily-pokemon-card__badge">오늘의 추천</span>
              <h1 className="daily-pokemon-card__title">포켓몬과 함께하는 하루</h1>
              <p className="daily-pokemon-card__description">
                좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요
              </p>
              <div className="daily-pokemon-card__actions">
                <Link className="button" to="/pokemon">도감 보기</Link>
                <Link className="button button--secondary" to="/my-team">내 팀</Link>
              </div>
            </div>
            <div className="daily-pokemon-card__art">
              <img src="/0025.svg" alt="" />
            </div>
          </section>
          <PokemonSearch className="home-pokemon-search" {...searchProps} />
          <div className="recommended-pokemon-header">
            <h2 className="recommended-pokemon-title">추천 포켓몬</h2>
            <Link className="recommended-pokemon-link" to="/pokemon">
              전체 보기
            </Link>
          </div>
          <PokemonList pokemon={filteredPokemon} onAdd={addToTeam} />
          <div className="app__content" />
        </>
      } />
      <Route path="/my-team/:teamPokemonId/edit" element={
        <TeamEditPage team={team} onApply={(number, nickname, role) => {
          setTeam((current) => updateTeamMember(current, number, nickname, role))
          setTeamMessage('수정한 내용을 적용했어요.')
        }} />
      } />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  )
}

export default App
