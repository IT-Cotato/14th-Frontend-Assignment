import { useState } from 'react'
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import {
  fetchPokemonDetailByUrl,
  fetchPokemonList,
  fetchPokemonSpeciesByUrl,
  getKoreanName,
  getPokemonIdFromUrl,
  toPokemon,
} from '../api/pokeapi.ts'
import type { Pokemon } from '../components/PokemonCard.tsx'

/** 한 페이지에 보이는 카드 수. W06 시안: PC 4열 한 줄, 모바일 2열 두 줄 */
export const DEX_PAGE_SIZE = 4
/** 기본 도감에 보이는 포켓몬 수. 목록 순서대로 처음 16마리만 보인다. (검색에는 적용하지 않는다) */
export const DEX_POKEMON_LIMIT = 16
/** 기본 도감의 페이지 수. 숫자 버튼은 1~4로 고정된다. */
export const DEX_PAGE_COUNT = Math.ceil(DEX_POKEMON_LIMIT / DEX_PAGE_SIZE)

/** 목록 페이지 요청 조건. offset = (page - 1) × limit */
type DexPageParams = { limit: number; offset: number }

/** 기본 도감 범위 안의 페이지인지. API의 count·next와 무관하게 이 범위 밖으로는 이동·요청하지 않는다. */
function isDexPage(page: number) {
  return Number.isInteger(page) && page >= 1 && page <= DEX_PAGE_COUNT
}

/** 페이지의 목록 요청 조건. 마지막 페이지도 처음 16마리를 넘지 않도록 limit을 줄인다. */
function getPageParams(page: number): DexPageParams {
  const offset = (page - 1) * DEX_PAGE_SIZE
  return { limit: Math.min(DEX_PAGE_SIZE, DEX_POKEMON_LIMIT - offset), offset }
}

/**
 * 쿼리 키. 요청 조건을 모두 키에 넣어, 목록은 limit·offset별로, 카드 상세·한국어 이름은 주소별로 따로 캐시된다.
 * 검색(usePokemonSearch)은 이 캐시를 쓰지 않으므로 목록과 검색 결과가 서로 덮어쓰지 않는다.
 */
const dexQueryKeys = {
  list: (params: DexPageParams) => ['pokemon', 'list', params] as const,
  detail: (url: string) => ['pokemon', 'detail', url] as const,
  species: (speciesUrl: string) => ['pokemon', 'species', speciesUrl] as const,
}

/** 카드 상세. 한국어 이름을 받을 species 주소를 함께 둔다. */
async function fetchDexDetail(url: string, signal: AbortSignal) {
  const detail = await fetchPokemonDetailByUrl(url, { signal })
  return { pokemon: toPokemon(detail), speciesUrl: detail.species.url }
}

/** 카드 한 장의 상세 요청 상태. 실패 항목도 목록에서 빼지 않고 이 상태로 자리를 지킨다. */
export type DexEntryDetail =
  | { status: 'loading' }
  | { status: 'success'; pokemon: Pokemon }
  | { status: 'error'; error: unknown }

/** 목록 응답의 한 항목. name·url은 목록 응답 그대로이고 id는 url에서 꺼낸 값이다. */
export interface DexEntry {
  url: string
  /** 목록 응답의 영문 이름. 상세가 없을 때(로딩·실패) 카드에 표시한다. */
  name: string
  id: number | null
  detail: DexEntryDetail
}

/** 화면에 보이는 목록 상태. 카드별 상태는 각 entry.detail이 따로 가진다. */
export type PokemonDexState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | {
      status: 'success'
      entries: DexEntry[]
      /** true면 고른 페이지를 받는 동안 이전 페이지의 카드를 대신 보여 주는 중이다. */
      isPlaceholder: boolean
      /** true면 캐시된 목록을 다시 받다가 실패했다. 카드는 마지막으로 받은 목록 그대로다. */
      refreshFailed: boolean
    }

/**
 * 도감 소개 배지(갱신 표시)에 쓸 요청 상태.
 * loading: 보여 줄 카드 없이 요청 중, refreshing: 카드를 보여 주며 요청 중,
 * failed: 마지막 요청 실패, fresh: 마지막 요청 성공
 */
export type DexFetchStatus = 'loading' | 'refreshing' | 'failed' | 'fresh'

export interface DexPagination {
  /** 사용자가 고른 페이지. 실제로 요청하는 페이지이며, 페이지 버튼에 현재 위치로 표시한다. */
  page: number
  /** 기본 도감의 페이지 수 (DEX_PAGE_COUNT) */
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

const loadingDetail: DexEntryDetail = { status: 'loading' }

type UsePokemonDexOptions = {
  /** false면 요청하지 않는다. (?preview 로컬 데이터 화면) */
  enabled: boolean
}

/**
 * PokéAPI 기본 도감(처음 16마리)을 페이지 단위로 요청한다. 캐시와 요청 상태는 TanStack Query가 관리한다.
 * - 목록: 페이지에 들어올 때마다 다시 요청한다. 캐시가 있으면 그 카드를 먼저 보여 주고 뒤에서 갱신한다.
 *   캐시가 없는 페이지는 목록을 받는 동안 이전 페이지 카드를 그대로 두고, 목록이 오면 카드별로 상세를 받는다.
 * - 카드 상세·한국어 이름: 주소별 쿼리로 한 번 받은 결과를 다시 쓴다. 실패한 카드만 다시 시도하거나 다시 들어올 때 새로 받는다.
 */
export function usePokemonDex({ enabled }: UsePokemonDexOptions) {
  const [pageState, setPageState] = useState(1)
  // 저장된 페이지가 범위 밖이면 1페이지로 돌린다. 범위 밖 페이지는 그리지도 요청하지도 않는다.
  const page = isDexPage(pageState) ? pageState : 1
  const params = getPageParams(page)

  const listQuery = useQuery({
    queryKey: dexQueryKeys.list(params),
    // TanStack Query가 주는 signal을 넘겨, 페이지를 떠나 쓰이지 않게 된 요청은 취소된다.
    queryFn: ({ signal }) => fetchPokemonList(params, { signal }),
    enabled,
    // 캐시가 없는 페이지를 받는 동안 직전 페이지의 목록을 그대로 보여 준다. (isPlaceholderData)
    placeholderData: keepPreviousData,
  })
  // 응답이 요청한 limit보다 많아도 limit까지만 쓴다. 그 밖의 항목은 상세도 요청하지 않는다.
  const results = listQuery.data?.results.slice(0, params.limit) ?? []

  // 상세·한국어 이름은 도감 번호별로 바뀌지 않으므로 성공한 결과는 다시 요청하지 않는다(staleTime: Infinity).
  // 실패한 쿼리는 데이터가 없어 그 카드가 다시 보일 때 새로 요청된다.
  const detailQueries = useQueries({
    queries: results.map(({ url }) => ({
      queryKey: dexQueryKeys.detail(url),
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchDexDetail(url, signal),
      enabled,
      staleTime: Infinity,
    })),
  })
  // 상세가 성공한 카드만 한국어 이름을 받는다. species 조회가 실패해도 카드는 영문 이름으로 성공 상태다.
  const speciesUrls = [
    ...new Set(detailQueries.flatMap((query) => (query.data ? [query.data.speciesUrl] : []))),
  ]
  const speciesQueries = useQueries({
    queries: speciesUrls.map((speciesUrl) => ({
      queryKey: dexQueryKeys.species(speciesUrl),
      queryFn: async ({ signal }: { signal: AbortSignal }) =>
        getKoreanName(await fetchPokemonSpeciesByUrl(speciesUrl, { signal })),
      enabled,
      staleTime: Infinity,
    })),
  })
  const koreanNames = new Map(speciesUrls.map((url, index) => [url, speciesQueries[index]?.data]))

  // 화면용 상태는 저장하지 않고 쿼리 상태에서 렌더링할 때 계산한다.
  const entries: DexEntry[] = results.map(({ name, url }, index) => {
    const query = detailQueries[index]
    let detail: DexEntryDetail = loadingDetail
    if (query?.data) {
      // 한국어 이름을 받기 전이거나 species 조회가 실패하면 영문 이름을 쓴다.
      const koreanName = koreanNames.get(query.data.speciesUrl)
      detail = {
        status: 'success',
        pokemon: koreanName ? { ...query.data.pokemon, name: koreanName } : query.data.pokemon,
      }
    } else if (query?.isError && !query.isFetching) {
      // 404도 여기서는 이 카드의 상세 실패다. (검색 결과 없음은 검색 단계에서 다룬다)
      detail = { status: 'error', error: query.error }
    }
    return { url, name, id: getPokemonIdFromUrl(url), detail }
  })

  // 목록 데이터가 있으면 카드를 보여 준다. 다시 받다 실패해도(isError) 마지막으로 받은 목록은 그대로다.
  // 데이터 없이 실패했으면(첫 방문 실패) 오류를, 그 밖에는 첫 로딩을 보여 준다.
  let state: PokemonDexState
  if (listQuery.data) {
    state = {
      status: 'success',
      entries,
      isPlaceholder: listQuery.isPlaceholderData,
      refreshFailed: listQuery.isError && !listQuery.isFetching,
    }
  } else if (listQuery.isError && !listQuery.isFetching) {
    state = { status: 'error', error: listQuery.error }
  } else {
    state = { status: 'loading' }
  }

  // 목록·카드 상세·한국어 이름 중 하나라도 요청 중이면 갱신 중이다.
  const isFetching =
    listQuery.isFetching ||
    detailQueries.some((query) => query.isFetching) ||
    speciesQueries.some((query) => query.isFetching)
  let fetchStatus: DexFetchStatus
  if (isFetching) {
    fetchStatus = state.status === 'success' ? 'refreshing' : 'loading'
  } else if (listQuery.isError) {
    fetchStatus = 'failed'
  } else {
    fetchStatus = 'fresh'
  }

  // 이동 가능 범위는 기본 도감 범위(1~4페이지)로 고정한다. 응답의 count·next·previous는 쓰지 않는다.
  const pagination: DexPagination = {
    page,
    totalPages: DEX_PAGE_COUNT,
    hasPrevious: page > 1,
    hasNext: page < DEX_PAGE_COUNT,
  }

  /** 상세까지 성공한 포켓몬. 기존 검색·필터 계산(getVisiblePokemons)에 그대로 넘길 수 있다. */
  const pokemons = entries.flatMap((entry) =>
    entry.detail.status === 'success' ? [entry.detail.pokemon] : [],
  )

  /** 페이지 이동. 범위 밖이거나 지금 페이지면 무시한다. (버튼 disabled와 별개로 한 번 더 막는다) */
  function goToPage(nextPage: number) {
    if (!isDexPage(nextPage) || nextPage === page) return
    setPageState(nextPage)
  }

  /** 지금 페이지 목록 다시 시도. 같은 페이지 요청이 진행 중이면 새로 보내지 않고 그 요청을 기다린다. */
  function retry() {
    if (!enabled) return
    void listQuery.refetch({ cancelRefetch: false })
  }

  /** 카드 한 장 다시 시도: 실패한 그 카드의 상세만 다시 받는다. 요청 중이거나 성공한 카드는 무시한다. */
  function retryEntry(url: string) {
    const query = detailQueries[results.findIndex((result) => result.url === url)]
    if (!query?.isError || query.isFetching) return
    void query.refetch()
  }

  return { state, pokemons, pagination, fetchStatus, goToPage, retry, retryEntry }
}
