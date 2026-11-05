import { useEffect, useState, useSyncExternalStore } from 'react'
import { getPokemonIdFromUrl } from '../api/pokeapi.ts'
import { createDexCache, emptyPageQuery, getDexPageKey } from '../api/pokemonDexCache.ts'
import type { DexEntryDetail, DexPageData, DexPageParams } from '../api/pokemonDexCache.ts'

export type { DexEntryDetail }

/** 한 페이지에 보이는 카드 수. W06 시안: PC 4열 한 줄, 모바일 2열 두 줄 */
export const DEX_PAGE_SIZE = 4
/** 기본 도감에 보이는 포켓몬 수. 목록 순서대로 처음 16마리만 보인다. (검색에는 적용하지 않는다) */
export const DEX_POKEMON_LIMIT = 16
/** 기본 도감의 페이지 수. 숫자 버튼은 1~4로 고정된다. */
export const DEX_PAGE_COUNT = Math.ceil(DEX_POKEMON_LIMIT / DEX_PAGE_SIZE)

/** 기본 도감 범위 안의 페이지인지. API의 count·next와 무관하게 이 범위 밖으로는 이동·요청하지 않는다. */
function isDexPage(page: number) {
  return Number.isInteger(page) && page >= 1 && page <= DEX_PAGE_COUNT
}

/** 페이지의 목록 요청 조건. 마지막 페이지도 처음 16마리를 넘지 않도록 limit을 줄인다. */
function getPageParams(page: number): DexPageParams {
  const offset = (page - 1) * DEX_PAGE_SIZE
  return { limit: Math.min(DEX_PAGE_SIZE, DEX_POKEMON_LIMIT - offset), offset }
}

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
      /** 지금 보이는 카드가 실제로 온 페이지. 새 페이지를 받는 동안에는 이전 페이지 번호다. */
      sourcePage: number
      entries: DexEntry[]
      /** true면 고른 페이지를 받는 동안 이전 페이지의 카드를 대신 보여 주는 중이다. */
      isPlaceholder: boolean
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

/** 화면에 그리는 페이지 데이터와 그 출처(페이지 번호) */
type DisplayedPage = { page: number; data: DexPageData }

type PageState = {
  page: number
  /** 이동하기 직전에 보이던 페이지. 고른 페이지의 캐시가 없을 때 받는 동안 대신 보여 준다. */
  placeholder: DisplayedPage | null
}

const loadingDetail: DexEntryDetail = { status: 'loading' }

type UsePokemonDexOptions = {
  /** false면 요청하지 않는다. (?preview 로컬 데이터 화면) */
  enabled: boolean
}

/**
 * PokéAPI 기본 도감(처음 16마리)을 페이지 단위로 요청하고 앱 메모리에 캐시한다.
 * 페이지에 들어올 때마다 요청하되, 캐시가 있으면 그 카드를 먼저 보여 주고 뒤에서 새로 받는다. (stale-while-revalidate)
 * 캐시는 App이 살아 있는 동안 유지된다. 도감 ↔ 내 팀, 검색 ↔ 목록을 오가도 비워지지 않는다.
 */
export function usePokemonDex({ enabled }: UsePokemonDexOptions) {
  const [cache] = useState(createDexCache)
  const snapshot = useSyncExternalStore(cache.subscribe, cache.getSnapshot)
  const [pageState, setPageState] = useState<PageState>({ page: 1, placeholder: null })
  // 저장된 페이지가 범위 밖이면 1페이지로 돌린다. 범위 밖 페이지는 그리지도 요청하지도 않는다.
  const isPageInRange = isDexPage(pageState.page)
  const page = isPageInRange ? pageState.page : 1
  const placeholder = isPageInRange ? pageState.placeholder : null

  // 화면이 정리되면 진행 중인 요청을 모두 취소한다. StrictMode 재실행이면 아래 Effect가 다시 요청한다.
  useEffect(() => () => cache.abortAll(), [cache])

  useEffect(() => {
    if (!enabled) return
    cache.fetchPage(getPageParams(page))
  }, [cache, enabled, page])

  // 화면용 상태는 저장하지 않고 렌더링할 때 계산한다.
  const query = snapshot.pages[getDexPageKey(getPageParams(page))] ?? emptyPageQuery
  // 고른 페이지의 캐시가 있으면 그것을, 없으면 받는 동안 이전 페이지를 보여 준다.
  // 고른 페이지 요청이 실패했으면 이전 페이지를 숨기고 오류를 보여 준다.
  let displayed: DisplayedPage | null = null
  if (query.data) {
    displayed = { page, data: query.data }
  } else if (query.request.status !== 'error') {
    displayed = placeholder
  }

  let state: PokemonDexState
  if (displayed) {
    state = {
      status: 'success',
      sourcePage: displayed.page,
      entries: displayed.data.results.map(({ name, url }) => ({
        url,
        name,
        id: getPokemonIdFromUrl(url),
        detail: snapshot.details[url] ?? loadingDetail,
      })),
      isPlaceholder: query.data === null,
    }
  } else if (query.request.status === 'error') {
    state = { status: 'error', error: query.request.error }
  } else {
    state = { status: 'loading' }
  }

  // 데이터가 없는 페이지의 idle은 곧 Effect가 요청할 상태이므로 요청 중으로 본다.
  const isFetching =
    query.request.status === 'fetching' ||
    (query.request.status === 'idle' && query.data === null) ||
    (state.status === 'success' &&
      state.entries.some((entry) => entry.detail.status === 'loading'))
  let fetchStatus: DexFetchStatus
  if (isFetching) {
    fetchStatus = state.status === 'success' ? 'refreshing' : 'loading'
  } else if (query.request.status === 'error') {
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
  const pokemons =
    state.status === 'success'
      ? state.entries.flatMap((entry) =>
          entry.detail.status === 'success' ? [entry.detail.pokemon] : [],
        )
      : []

  /** 페이지 이동. 범위 밖이거나 지금 페이지면 무시한다. (버튼 disabled와 별개로 한 번 더 막는다) */
  function goToPage(nextPage: number) {
    if (!isDexPage(nextPage) || nextPage === page) return
    // 새 페이지가 준비될 때까지 지금 보이는 카드를 그대로 둔다. 캐시가 있는 페이지면 바로 그 캐시가 보인다.
    setPageState({ page: nextPage, placeholder: displayed })
  }

  /** 지금 페이지 목록 다시 시도. 같은 페이지 요청이 진행 중이면 그 요청을 기다린다. */
  function retry() {
    if (!enabled) return
    cache.fetchPage(getPageParams(page))
  }

  /** 카드 한 장 다시 시도: 그 카드의 상세만 다시 받는다. */
  function retryEntry(url: string) {
    cache.retryEntry(url)
  }

  return { state, pokemons, pagination, fetchStatus, goToPage, retry, retryEntry }
}
