import { useEffect, useReducer, useRef, useState } from 'react'
import PokemonHeader from './components/PokemonHeader.tsx'
import type { ApiStatus, AppView } from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'
import PokemonTeam from './components/PokemonTeam.tsx'
import type { Pokemon, PokemonType } from './components/PokemonCard.tsx'
import StorageNotice from './components/StorageNotice.tsx'
import type { StorageIssue } from './components/StorageNotice.tsx'
import TeamPanel from './components/TeamPanel.tsx'
import Toast from './components/Toast.tsx'
import type { NoticeTone } from './components/Toast.tsx'
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
  getMemberDisplayName,
  isSameTeam,
  removeTeamMember,
  updateTeamMember,
} from './data/team.ts'
import type { TeamMember, TeamMemberChanges } from './data/team.ts'
import { teamReducer } from './data/teamReducer.ts'
import { usePokemonDex } from './hooks/usePokemonDex.ts'
import type { PokemonDexState } from './hooks/usePokemonDex.ts'
import { usePokemonSearch } from './hooks/usePokemonSearch.ts'
import type { PokemonSearchState } from './hooks/usePokemonSearch.ts'
import { withParticle } from './utils/korean.ts'
import { loadTeam, saveTeam } from './utils/teamStorage.ts'

const NOTICE_DURATION_MS = 3000

/**
 * 주소의 preview 쿼리값으로 로컬 확인용 데이터를 고른다.
 * ?preview=empty 이면 빈 목록, ?preview=team-test 이면 6마리 제한 확인용 9마리 목록,
 * ?preview=local 이면 W04까지 쓰던 로컬 예시 목록이다. 그 외(null)에는 PokéAPI 목록을 쓴다.
 */
function selectPreviewPokemons(search: string) {
  const preview = new URLSearchParams(search).get('preview')
  if (preview === 'empty') return emptyPokemons
  if (preview === 'team-test') return teamTestPokemons
  if (preview === 'local') return pokemons
  return null
}

/**
 * 도감 배지에 쓸 PokéAPI 연결 상태. 별도 확인 요청 없이 지금 보이는 목록·검색 요청 상태에서 계산한다.
 * - 검색 결과·검색 404는 서버가 응답한 것이므로 온라인이다.
 * - 검색 요청 중이거나 검색 중이 아니면 기본 목록 요청 상태를 따른다. (카드 하나의 상세 실패는 반영하지 않는다)
 */
function getApiStatus(
  dexState: PokemonDexState,
  searchState: PokemonSearchState,
): ApiStatus {
  if (searchState.status === 'success' || searchState.status === 'not-found') return 'online'
  if (searchState.status === 'error') return 'error'
  if (dexState.status === 'loading') return 'checking'
  return dexState.status === 'error' ? 'error' : 'online'
}

function App() {
  const [view, setView] = useState<AppView>('dex')
  // 마지막으로 "팀 저장"한 팀을 처음 한 번만 읽는다. 읽기만 하므로 StrictMode에서 두 번 불려도 안전하다.
  // v2는 저장된 포켓몬 정보로 바로 복원한다. 카탈로그는 v2가 없을 때 v1(번호만 저장)을 복원하는 데만 쓴다.
  const [initialLoad] = useState(() => loadTeam(pokemonCatalog))
  // 작업 중인 팀과 화면 아래 안내. 도감·팀 패널·내 팀이 함께 쓰므로 공통 부모인 App에서 관리한다.
  // 팀 추가의 성공·거절과 그 안내가 같은 최신 팀을 기준으로 정해지도록 하나의 reducer로 묶었다.
  const [{ team, notice }, dispatchTeam] = useReducer(teamReducer, {
    team: initialLoad.team,
    notice: null,
  })
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
  const noticeIdRef = useRef(0)
  // preview 화면은 로컬 데이터만 쓰고 API를 요청하지 않는다.
  const previewPokemons = selectPreviewPokemons(window.location.search)
  // 도감 ↔ 내 팀을 오가도 다시 요청하지 않도록 App에서 요청한다.
  const dex = usePokemonDex({ enabled: previewPokemons === null })
  // 제출한 검색어의 상세 검색. 입력창의 원본 값(query)과 따로 관리한다.
  const search = usePokemonSearch({ enabled: previewPokemons === null })

  // 안내는 잠시 보여 준 뒤 사라진다. 새 안내가 오면 타이머를 다시 시작한다.
  useEffect(() => {
    if (!notice) return
    const noticeId = notice.id
    const timer = window.setTimeout(
      () => dispatchTeam({ type: 'dismissNotice', noticeId }),
      NOTICE_DURATION_MS,
    )
    return () => window.clearTimeout(timer)
  }, [notice])

  /** 안내 번호는 이벤트 핸들러에서 정한다. reducer는 받은 번호를 그대로 쓴다. */
  function nextNoticeId() {
    noticeIdRef.current += 1
    return noticeIdRef.current
  }

  function showNotice(tone: NoticeTone, message: string) {
    dispatchTeam({ type: 'notify', notice: { id: nextNoticeId(), tone, message } })
  }

  function handleAdd(pokemon: Pokemon) {
    // 추가 여부(중복·정원)와 안내는 reducer가 최신 팀을 기준으로 함께 정한다.
    // 이번 렌더링의 team 스냅샷으로 미리 판단하지 않으므로, 연속 호출에도 거절된 추가에 성공 안내가 붙지 않는다.
    dispatchTeam({ type: 'add', pokemon, noticeId: nextNoticeId() })
  }

  function handleRemoveMember(pokemonId: number) {
    const member = team.find((m) => m.pokemon.id === pokemonId)
    dispatchTeam({
      type: 'updateTeam',
      update: (prevTeam) => removeTeamMember(prevTeam, pokemonId),
    })
    if (member) {
      showNotice(
        'success',
        `${withParticle(getMemberDisplayName(member), '을', '를')} 팀에서 삭제했어요.`,
      )
    }
  }

  function handleEditMember(pokemonId: number, changes: TeamMemberChanges) {
    const member = team.find((m) => m.pokemon.id === pokemonId)
    dispatchTeam({
      type: 'updateTeam',
      update: (prevTeam) => updateTeamMember(prevTeam, pokemonId, changes),
    })
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
    dispatchTeam({ type: 'updateTeam', update: () => savedTeam })
    showNotice(
      'info',
      `마지막으로 저장한 팀으로 되돌렸어요. (${savedTeam.length} / ${TEAM_LIMIT})`,
    )
  }

  function handleNavigate(nextView: AppView) {
    // 내 팀으로 가면 제출한 검색을 끝낸다. 진행 중인 검색 요청은 취소되고, 도감으로 돌아오면 기본 목록이 보인다.
    // 입력창의 원본 query는 그대로 두며, 다시 제출해야 검색한다.
    if (nextView === 'team') search.reset()
    setView(nextView)
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

  // W05 시안은 PokéAPI 도감 화면에만 적용한다. 내 팀 화면·로컬 preview는 기존 스타일을 유지한다.
  const isApiDex = previewPokemons === null && view === 'dex'

  return (
    <div className={`page${isApiDex ? ' page--api-dex' : ''}`}>
      <PokemonHeader
        currentView={view}
        onNavigate={handleNavigate}
        teamCount={team.length}
        teamLimit={TEAM_LIMIT}
        apiStatus={isApiDex ? getApiStatus(dex.state, search.state) : undefined}
      />
      {storageIssue && (
        <StorageNotice
          issue={storageIssue}
          onDismiss={() => setStorageIssue(null)}
        />
      )}
      {view === 'dex' ? (
        <PokemonList
          pokemons={previewPokemons ?? dex.pokemons}
          api={previewPokemons === null ? { dex, search } : undefined}
          team={team}
          onAdd={handleAdd}
          query={query}
          selectedTypes={selectedTypes}
          sortOrder={sortOrder}
          onQueryChange={setQuery}
          onApplyFilter={handleApplyFilter}
          onResetFilters={handleResetFilters}
          // W05 시안의 PokéAPI 도감에는 팀 패널이 없다. 팀은 ‘내 팀’ 화면에서 관리한다.
          teamPanel={
            previewPokemons === null ? null : (
              <TeamPanel
                team={team}
                onEditMember={handleEditMember}
                onRemoveMember={handleRemoveMember}
              />
            )
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
