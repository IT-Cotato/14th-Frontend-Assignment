import { useEffect, useReducer, useRef, useState } from 'react'
import { Route, Routes, useLocation, useSearchParams } from 'react-router'
import { normalizePokemonQuery } from './api/pokeapi.ts'
import HomePage from './components/HomePage.tsx'
import NotFoundPage from './components/NotFoundPage.tsx'
import PokemonDetailPage from './components/PokemonDetailPage.tsx'
import PokemonHeader from './components/PokemonHeader.tsx'
import type { DexIntro } from './components/PokemonHeader.tsx'
import PokemonList from './components/PokemonList.tsx'
import TeamEditPage from './components/TeamEditPage.tsx'
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
  createTeamMemberId,
  getMemberDisplayName,
  isSameTeam,
  removeTeamMember,
} from './data/team.ts'
import type { TeamMember } from './data/team.ts'
import { teamReducer } from './data/teamReducer.ts'
import { parseDexPage, usePokemonDex } from './hooks/usePokemonDex.ts'
import type { DexFetchStatus } from './hooks/usePokemonDex.ts'
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
 * 도감 배지(갱신 표시)에 쓸 요청 상태. 지금 화면에 보이는 쪽의 요청을 따른다.
 * - 검색 중이면 검색 요청 상태를, 아니면 지금 페이지의 목록 요청 상태를 쓴다.
 * - 검색 404는 서버가 응답한 결과이므로 실패로 보지 않는다.
 */
function getFetchStatus(
  dexFetchStatus: DexFetchStatus,
  searchState: PokemonSearchState,
): DexFetchStatus {
  if (searchState.status === 'idle') return dexFetchStatus
  if (searchState.status === 'loading') return 'loading'
  return searchState.status === 'error' ? 'failed' : 'fresh'
}

function App() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const isDexRoute = location.pathname === '/pokemon'
  const isDetailRoute = location.pathname.startsWith('/pokemon/')
  // 도감 목록 조건은 주소에 둔다. 새로고침·뒤로/앞으로 가기·직접 접근에서 같은 목록이 복원된다.
  const rawPage = searchParams.get('page')
  const page = parseDexPage(rawPage)
  const q = searchParams.get('q') ?? ''
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
  // 검색창에 보이는 원본 값. 제출하면 주소의 q가 되고, 주소의 q가 바뀌면(뒤로 가기 등) 입력값도 따라간다.
  const [query, setQuery] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)
  if (syncedQ !== q) {
    setSyncedQ(q)
    setQuery(q)
  }
  // 필터 창에서 "적용"으로 확정한 타입(복수 선택)과 정렬. 창 안의 임시 선택은 FilterDialog가 따로 가진다.
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([])
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(DEFAULT_SORT_ORDER)
  const noticeIdRef = useRef(0)
  // preview 화면(/pokemon?preview=…)은 로컬 데이터만 쓰고 API를 요청하지 않는다.
  const previewPokemons = isDexRoute ? selectPreviewPokemons(location.search) : null
  const isApiDex = isDexRoute && previewPokemons === null
  // 목록·검색 캐시는 TanStack Query와 컴포넌트 state에 있어 다른 화면에 다녀와도 유지된다.
  const dex = usePokemonDex({
    enabled: isApiDex,
    page,
    onPageChange: (nextPage) => updateDexParams({ page: nextPage }),
  })
  const search = usePokemonSearch({ enabled: isApiDex, query: q })

  // 잘못된 page는 1, 4를 넘으면 4로 주소를 고친다. 보정은 기록을 남기지 않는다(replace).
  useEffect(() => {
    if (!isApiDex || rawPage === null || rawPage === String(page)) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('page', String(page))
        return next
      },
      { replace: true },
    )
  }, [isApiDex, rawPage, page, setSearchParams])

  /** 도감 주소의 page·q를 바꾼다. 이동마다 기록이 남아 뒤로/앞으로 가기로 오갈 수 있다. */
  function updateDexParams(changes: { page?: number; q?: string }) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (changes.page !== undefined) next.set('page', String(changes.page))
      if (changes.q !== undefined) {
        if (changes.q === '') next.delete('q')
        else next.set('q', changes.q)
      }
      return next
    })
  }

  /** 검색 제출: 정리한 값이 비어 있으면 검색을 끝내고 기본 목록으로 돌아간다. */
  function submitSearch(value: string) {
    updateDexParams({ q: normalizePokemonQuery(value) === '' ? '' : value.trim() })
  }

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
    // 팀 항목 ID는 이벤트 핸들러에서 정한다. reducer는 받은 ID를 그대로 쓴다.
    dispatchTeam({ type: 'add', pokemon, memberId: createTeamMemberId(), noticeId: nextNoticeId() })
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

  /** 편집 화면에서 저장에 성공한 팀. 저장된 팀이므로 작업 중인 팀과 마지막 저장 팀을 함께 맞춘다. */
  function handleMemberSaved(nextTeam: TeamMember[], member: TeamMember) {
    dispatchTeam({ type: 'updateTeam', update: () => nextTeam })
    setSavedTeam(nextTeam)
    setStorageIssue(null)
    showNotice('success', `${member.pokemon.name}의 별명·역할·메모를 저장했어요.`)
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

  // W05~W07 시안은 PokéAPI 도감·상세 화면에만 적용한다. 홈·내 팀·편집·로컬 preview는 기존 스타일을 유지한다.
  let dexIntro: DexIntro = null
  if (isDexRoute) dexIntro = isApiDex ? 'api' : 'local'

  return (
    <div className={`page${isApiDex || isDetailRoute ? ' page--api-dex' : ''}`}>
      <PokemonHeader
        dexIntro={dexIntro}
        teamCount={team.length}
        teamLimit={TEAM_LIMIT}
        fetchStatus={isApiDex ? getFetchStatus(dex.fetchStatus, search.state) : undefined}
        // 캐시된 목록의 갱신이 실패했을 때만 배지에서 다시 시도한다. (첫 방문 실패는 Error 패널이 맡는다)
        onRetryRefresh={
          isApiDex &&
          search.state.status === 'idle' &&
          dex.state.status === 'success' &&
          dex.state.refreshFailed
            ? dex.retry
            : undefined
        }
      />
      {storageIssue && (
        <StorageNotice
          issue={storageIssue}
          onDismiss={() => setStorageIssue(null)}
        />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/pokemon"
          element={
            <PokemonList
              pokemons={previewPokemons ?? dex.pokemons}
              api={previewPokemons === null ? { dex, search: { ...search, submit: submitSearch } } : undefined}
              team={team}
              onAdd={handleAdd}
              query={query}
              selectedTypes={selectedTypes}
              sortOrder={sortOrder}
              onQueryChange={setQuery}
              onApplyFilter={handleApplyFilter}
              onResetFilters={handleResetFilters}
              dexSearch={location.search}
              // W05~W07 시안의 PokéAPI 도감에는 팀 패널이 없다. 팀은 ‘내 팀’ 화면에서 관리한다.
              teamPanel={
                previewPokemons === null ? null : (
                  <TeamPanel team={team} onRemoveMember={handleRemoveMember} />
                )
              }
            />
          }
        />
        <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage team={team} onAdd={handleAdd} />} />
        <Route
          path="/my-team"
          element={
            <PokemonTeam
              team={team}
              onRemoveMember={handleRemoveMember}
              onSaveTeam={handleSaveTeam}
              onRevertTeam={handleRevertTeam}
            />
          }
        />
        <Route
          path="/my-team/:teamPokemonId/edit"
          element={
            <TeamEditPage team={team} onSaved={handleMemberSaved} onRemoveMember={handleRemoveMember} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toast notice={notice} />
    </div>
  )
}

export default App
