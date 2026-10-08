import { useEffect, useRef, useState } from 'react'
import PokemonHeader from './components/PokemonHeader.tsx'
import type { AppView } from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'
import PokemonTeam from './components/PokemonTeam.tsx'
import type { Pokemon, PokemonType } from './components/PokemonCard.tsx'
import StorageNotice from './components/StorageNotice.tsx'
import type { StorageIssue } from './components/StorageNotice.tsx'
import TeamPanel from './components/TeamPanel.tsx'
import Toast from './components/Toast.tsx'
import type { Notice, NoticeTone } from './components/Toast.tsx'
import { DEFAULT_SORT_ORDER } from './data/dex.ts'
import type { SortOrder } from './data/dex.ts'
import {
  emptyPokemons,
  pokemonCatalog,
  pokemons,
  teamTestPokemons,
} from './data/pokemons.ts'
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
import { loadTeam, saveTeam } from './utils/teamStorage.ts'

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
  // 마지막으로 "팀 저장"한 팀을 처음 한 번만 읽는다. 읽기만 하므로 StrictMode에서 두 번 불려도 안전하다.
  // 표시 중인 도감 목록이 아니라 전체 카탈로그에서 찾아야 team-test에서 저장한 팀원도 복원된다.
  const [initialLoad] = useState(() => loadTeam(pokemonCatalog))
  // 작업 중인 팀. 도감·팀 패널·내 팀이 함께 쓰므로 공통 부모인 App에서 관리한다.
  const [team, setTeam] = useState<TeamMember[]>(initialLoad.team)
  // "팀 저장"으로 확정해 localStorage에 넣은 팀의 스냅샷. 상단 "취소"가 되돌아갈 과거 값이라
  // 현재 team에서 계산해 낼 수 없으므로(파생 값이 아니므로) 별도 state로 둔다.
  const [savedTeam, setSavedTeam] = useState<TeamMember[]>(initialLoad.team)
  // 저장 데이터 문제 안내. 불러오기 결과로 초기화하므로 effect 없이 한 번만 나타난다.
  const [storageIssue, setStorageIssue] = useState<StorageIssue | null>(
    initialLoad.issue,
  )
  // 도감 ↔ 내 팀을 오가도 유지되도록 검색 조건도 App에 둔다. 걸러진 목록은 저장하지 않고 렌더링 때 계산한다.
  const [query, setQuery] = useState('')
  // 필터 창에서 "적용"으로 확정한 타입(복수 선택)과 정렬. 창 안의 임시 선택은 FilterDialog가 따로 가진다.
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(DEFAULT_SORT_ORDER)
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
      showNotice(
        'success',
        `${member.pokemon.name}의 별명·역할을 팀에 반영했어요. ‘팀 저장’을 눌러야 새로고침 후에도 유지돼요.`,
      )
    }
  }

  function handleSaveTeam() {
    // localStorage 쓰기는 이벤트 핸들러에서 한다. 실패하면 저장된 것처럼 보이지 않게 스냅샷을 그대로 둔다.
    if (!saveTeam(team)) {
      setStorageIssue('save-failed')
      showNotice(
        'warning',
        '팀을 저장하지 못했어요. 잠시 후 ‘팀 저장’을 다시 눌러 주세요.',
      )
      return
    }
    setSavedTeam(team)
    setStorageIssue(null)
    showNotice(
      'success',
      `팀을 이 브라우저에 저장했어요. (${team.length} / ${TEAM_LIMIT}) 새로고침해도 유지되고, 취소를 누르면 이 상태로 돌아와요.`,
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

  function handleApplyFilter(
    types: PokemonType[],
    nextSortOrder: SortOrder | null,
  ) {
    setSelectedTypes(types)
    setSortOrder(nextSortOrder)
  }

  function handleResetFilters() {
    setQuery('')
    setSelectedTypes([])
  }

  return (
    <div className="page">
      <PokemonHeader
        currentView={view}
        onNavigate={setView}
        teamCount={team.length}
        teamLimit={TEAM_LIMIT}
      />
      {storageIssue && (
        <StorageNotice
          issue={storageIssue}
          onDismiss={() => setStorageIssue(null)}
        />
      )}
      {view === 'dex' ? (
        <PokemonList
          pokemons={selectPokemons(window.location.search)}
          team={team}
          onAdd={handleAdd}
          query={query}
          selectedTypes={selectedTypes}
          sortOrder={sortOrder}
          onQueryChange={setQuery}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
          teamPanel={
            <TeamPanel
              team={team}
              onEditMember={handleEditMember}
              onRemoveMember={handleRemoveMember}
            />
          }
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
