import { useEffect, useRef, useState } from 'react'
import PokemonHeader from './components/PokemonHeader.tsx'
import type { AppView } from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'
import PokemonTeam from './components/PokemonTeam.tsx'
import type { Pokemon } from './components/PokemonCard.tsx'
import Toast from './components/Toast.tsx'
import type { Notice, NoticeTone } from './components/Toast.tsx'
import { emptyPokemons, pokemons, teamTestPokemons } from './data/pokemons.ts'
import {
  TEAM_LIMIT,
  addTeamMember,
  getAddStatus,
  getMemberDisplayName,
  isSameTeam,
  removeTeamMember,
  updateTeamMember,
} from './data/team.ts'
import type { TeamMember, TeamMemberChanges } from './data/team.ts'
import { withParticle } from './utils/korean.ts'

const NOTICE_DURATION_MS = 3000

/**
 * 주소의 preview 쿼리값으로 화면에 쓸 데이터만 고른다.
 * ?preview=empty 이면 빈 목록, ?preview=team-test 이면 6마리 제한 확인용 9마리 목록,
 * 그 외에는 기본 목록을 쓴다.
 */
function selectPokemons(search: string) {
  const preview = new URLSearchParams(search).get('preview')
  if (preview === 'empty') return emptyPokemons
  if (preview === 'team-test') return teamTestPokemons
  return pokemons
}

function App() {
  const [view, setView] = useState<AppView>('dex')
  // 작업 중인 팀. 도감과 내 팀이 함께 쓰므로 공통 부모인 App에서 관리한다.
  const [team, setTeam] = useState<TeamMember[]>([])
  // "팀 저장"으로 확정한 팀. 상단 "취소"는 이 스냅샷으로 되돌린다. (메모리에만 보관)
  const [savedTeam, setSavedTeam] = useState<TeamMember[]>([])
  const [notice, setNotice] = useState<Notice | null>(null)
  const noticeIdRef = useRef(0)

  // 안내는 잠시 보여 준 뒤 사라진다. 새 안내가 오면 타이머를 다시 시작한다.
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), NOTICE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [notice])

  function showNotice(tone: NoticeTone, message: string) {
    noticeIdRef.current += 1
    setNotice({ id: noticeIdRef.current, tone, message })
  }

  function handleAdd(pokemon: Pokemon) {
    // 안내 문구는 이번 렌더링의 team(스냅샷)으로 고르고,
    // 실제 추가 여부는 업데이터 안에서 최신 prevTeam으로 다시 검사한다.
    const status = getAddStatus(team, pokemon.id)
    if (status === 'added') {
      showNotice(
        'warning',
        `${withParticle(pokemon.name, '은', '는')} 이미 팀에 있어요. 같은 포켓몬은 한 번만 추가할 수 있어요.`,
      )
      return
    }
    if (status === 'full') {
      showNotice(
        'warning',
        `팀이 가득 찼어요. 최대 ${TEAM_LIMIT}마리까지 추가할 수 있어요.`,
      )
      return
    }

    setTeam((prevTeam) => addTeamMember(prevTeam, pokemon))
    const nextCount = team.length + 1
    showNotice(
      'success',
      `${withParticle(pokemon.name, '을', '를')} 팀 슬롯 #${nextCount}에 추가했어요. (${nextCount} / ${TEAM_LIMIT})`,
    )
  }

  function handleRemoveMember(pokemonId: number) {
    const member = team.find((m) => m.pokemon.id === pokemonId)
    setTeam((prevTeam) => removeTeamMember(prevTeam, pokemonId))
    if (member) {
      showNotice(
        'success',
        `${withParticle(getMemberDisplayName(member), '을', '를')} 팀에서 삭제했어요.`,
      )
    }
  }

  function handleEditMember(pokemonId: number, changes: TeamMemberChanges) {
    const member = team.find((m) => m.pokemon.id === pokemonId)
    setTeam((prevTeam) => updateTeamMember(prevTeam, pokemonId, changes))
    if (member) {
      showNotice('success', `${member.pokemon.name}의 별명·역할을 저장했어요.`)
    }
  }

  function handleSaveTeam() {
    setSavedTeam(team)
    showNotice(
      'success',
      `팀을 저장했어요. (${team.length} / ${TEAM_LIMIT}) 취소를 누르면 지금 상태로 돌아와요.`,
    )
  }

  function handleRevertTeam() {
    if (isSameTeam(team, savedTeam)) {
      showNotice('info', '되돌릴 변경 사항이 없어요. 마지막으로 저장한 팀과 같아요.')
      return
    }
    setTeam(savedTeam)
    showNotice(
      'info',
      `마지막으로 저장한 팀으로 되돌렸어요. (${savedTeam.length} / ${TEAM_LIMIT})`,
    )
  }

  return (
    <div className="page">
      <PokemonHeader
        currentView={view}
        onNavigate={setView}
        teamCount={team.length}
        teamLimit={TEAM_LIMIT}
      />
      {view === 'dex' ? (
        <PokemonList
          pokemons={selectPokemons(window.location.search)}
          team={team}
          onAdd={handleAdd}
        />
      ) : (
        <PokemonTeam
          team={team}
          onEditMember={handleEditMember}
          onRemoveMember={handleRemoveMember}
          onSaveTeam={handleSaveTeam}
          onRevertTeam={handleRevertTeam}
          onGoToDex={() => setView('dex')}
        />
      )}
      <Toast notice={notice} />
    </div>
  )
}

export default App
