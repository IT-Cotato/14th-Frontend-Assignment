import { useEffect, useState } from 'react'
import Header from './components/Header'
import PokemonHeader from './components/PokemonHeader'
import SearchBar from './components/SearchBar'
import PokemonList from './components/PokemonList'
import MyTeam from './components/MyTeam'
import FlashMessage from './components/FlashMessage'
import { pokemonList } from './data/pokemons'
import { MAX_TEAM_SIZE } from './data/team'
import type { TeamMember, TeamRole } from './data/team'

function App() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [savedTeam, setSavedTeam] = useState<TeamMember[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [duplicateName, setDuplicateName] = useState<string | null>(null)

  
  const [activeView, setActiveView] = useState<'home' | 'team'>('home')

  const teamIds = team.map((member) => member.pokemonId)
  const isTeamFull = team.length >= MAX_TEAM_SIZE

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 2500)
    return () => clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    if (!duplicateName) return
    const timer = setTimeout(() => setDuplicateName(null), 3000)
    return () => clearTimeout(timer)
  }, [duplicateName])

  function handleAddToTeam(pokemonId: number) {
    const pokemon = pokemonList.find((item) => item.id === pokemonId)
    if (!pokemon) return

    if (teamIds.includes(pokemonId)) {
      setDuplicateName(pokemon.name)
      return
    }

    if (team.length >= MAX_TEAM_SIZE) return

    setTeam((prevTeam) => [...prevTeam, { pokemonId, nickname: '', role: '공격' }])
    setToastMessage(`${pokemon.name}을(를) 팀에 추가했어요.`)
  }

  function handleRemoveFromTeam(pokemonId: number) {
    setTeam((prevTeam) => prevTeam.filter((member) => member.pokemonId !== pokemonId))
  }

  function handleUpdateMember(pokemonId: number, nickname: string, role: TeamRole) {
    setTeam((prevTeam) =>
      prevTeam.map((member) =>
        member.pokemonId === pokemonId ? { ...member, nickname, role } : member,
      ),
    )
  }

  function handleSaveTeam() {
    setSavedTeam(team)
    setToastMessage('팀을 저장했어요.')
  }

  function handleCancelTeam() {
    setTeam(savedTeam)
  }

  return (
    <div className="page">
      <Header
        teamCount={team.length}
        teamMax={MAX_TEAM_SIZE}
        activeView={activeView}
        onHomeClick={() => setActiveView('home')}
        onTeamClick={() => setActiveView('team')}
      />
      {activeView === 'home' && (
        <>
          <PokemonHeader
            badge="오늘의 추천"
            title="포켓몬과 함께하는 하루"
            description="좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요."
            onTeamClick={() => setActiveView('team')}
          />
          <SearchBar />
          <PokemonList
            teamIds={teamIds}
            isTeamFull={isTeamFull}
            duplicateName={duplicateName}
            onAddToTeam={handleAddToTeam}
          />
        </>
      )}
      {activeView === 'team' && (
        <MyTeam
          team={team}
          onRemoveFromTeam={handleRemoveFromTeam}
          onUpdateMember={handleUpdateMember}
          onSaveTeam={handleSaveTeam}
          onCancelTeam={handleCancelTeam}
        />
      )}
      {toastMessage && <FlashMessage message={toastMessage} />}
    </div>
  )
}

export default App
