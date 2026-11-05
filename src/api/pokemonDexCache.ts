import {
  fetchPokemonDetailByUrl,
  fetchPokemonList,
  fetchPokemonSpeciesByUrl,
  getKoreanName,
  isAbortError,
  toPokemon,
} from './pokeapi.ts'
import type { PokemonListResponse } from './pokeapi.ts'
import type { Pokemon } from '../components/PokemonCard.tsx'

/** 목록 페이지 요청 조건. offset = (page - 1) × limit */
export type DexPageParams = { limit: number; offset: number }

/** 페이지 캐시 키. 요청 조건(limit·offset)을 모두 담아, 페이지 크기가 다르면 다른 데이터로 본다. */
export function getDexPageKey({ limit, offset }: DexPageParams) {
  return `pokemon-list?limit=${limit}&offset=${offset}`
}

/**
 * 성공한 목록 응답에서 화면에 쓰는 값. 실패한 응답은 캐시에 저장하지 않는다.
 * 페이지 범위는 기본 도감 범위로 정하므로 count·next·previous는 보관하지 않는다.
 */
export type DexPageData = Pick<PokemonListResponse, 'results'>

/** 페이지의 지금(또는 마지막) 요청 상태. 성공하면 idle로 돌아간다. */
export type DexPageRequest =
  | { status: 'idle' }
  | { status: 'fetching' }
  | { status: 'error'; error: unknown }

export interface DexPageQuery {
  /** 마지막으로 성공한 응답. 다시 요청하는 동안에도, 다시 요청이 실패해도 지우지 않는다. */
  data: DexPageData | null
  request: DexPageRequest
}

/** 카드 한 장의 상세 요청 상태. 실패 항목도 목록에서 빼지 않고 이 상태로 자리를 지킨다. */
export type DexEntryDetail =
  | { status: 'loading' }
  | { status: 'success'; pokemon: Pokemon }
  | { status: 'error'; error: unknown }

export interface DexCacheSnapshot {
  /** 페이지 키 → 페이지 요청 상태와 마지막 성공 응답 */
  pages: Readonly<Record<string, DexPageQuery>>
  /** 목록 results의 상세 url → 카드 상세. 성공한 상세는 페이지를 오가도 다시 요청하지 않는다. */
  details: Readonly<Record<string, DexEntryDetail>>
}

export const emptyPageQuery: DexPageQuery = { data: null, request: { status: 'idle' } }

const idleRequest: DexPageRequest = { status: 'idle' }
const fetchingRequest: DexPageRequest = { status: 'fetching' }
const loadingDetail: DexEntryDetail = { status: 'loading' }

/** 카드 한 장의 상세 → 한국어 이름 요청. 같은 카드를 기다리는 페이지 요청들이 이 promise를 함께 쓴다. */
type EntryRequest = { promise: Promise<void> }

/**
 * 도감 목록 페이지와 카드 상세를 앱 메모리에 보관하는 캐시. (브라우저 HTTP 캐시와 별개다)
 * - 페이지 요청은 목록 → 카드 상세 → 한국어 이름까지 끝난 뒤 한 번에 반영한다.
 *   그래서 새 페이지의 카드가 빈 상태로 보였다가 채워지지 않고, 반영 전까지는 지금 보이는 카드가 그대로 남는다.
 * - 카드 상세는 url별로 성공 결과만 재사용한다. 실패한 카드는 다시 시도하거나 그 페이지를 다시 요청할 때 새로 받는다.
 * - 같은 페이지·같은 카드의 요청이 진행 중이면 새로 보내지 않고 그 요청을 기다린다.
 * - 응답은 자기 키에만 쓴다. 늦게 도착한 다른 페이지의 응답이 지금 화면의 페이지를 덮어쓰지 않는다.
 * 화면은 useSyncExternalStore로 snapshot을 읽는다. snapshot은 고치지 않고 바뀔 때마다 새 객체로 바꾼다.
 */
export function createDexCache() {
  let snapshot: DexCacheSnapshot = { pages: {}, details: {} }
  const listeners = new Set<() => void>()

  // 아래는 요청 관리용 값이라 화면에 그리지 않으므로 snapshot에 넣지 않는다.
  // 진행 중인 모든 요청이 이 controller의 signal을 쓴다. abortAll()이 abort하고 새로 만든다.
  let controller = new AbortController()
  /** 페이지 키 → 진행 중인 요청의 표식. 응답이 왔을 때 표식이 그대로일 때만 결과를 반영한다. */
  const pageRequests = new Map<string, object>()
  /** 카드 url → 진행 중인 상세·한국어 이름 요청 */
  const entryRequests = new Map<string, EntryRequest>()
  /** 상세가 성공한 카드의 species 주소. 한국어 이름만 다시 받을 때 쓴다. */
  const speciesUrls = new Map<string, string>()
  /** 한국어 이름 조회가 끝난 카드 (한국어 이름이 없던 경우 포함). 조회가 실패한 카드는 다음 페이지 요청 때 다시 받는다. */
  const namedUrls = new Set<string>()

  function emit() {
    for (const listener of listeners) listener()
  }

  function updatePage(key: string, update: (prev: DexPageQuery) => DexPageQuery) {
    const next = update(snapshot.pages[key] ?? emptyPageQuery)
    snapshot = { ...snapshot, pages: { ...snapshot.pages, [key]: next } }
    emit()
  }

  function setDetail(url: string, detail: DexEntryDetail) {
    if (snapshot.details[url] === detail) return
    snapshot = { ...snapshot, details: { ...snapshot.details, [url]: detail } }
    emit()
  }

  // 상세 → (성공 시) 한국어 이름. 상세가 이미 성공한 카드는 한국어 이름만 다시 받는다.
  async function loadEntry(url: string, request: EntryRequest, signal: AbortSignal) {
    // abortAll()로 정리됐으면 이 요청의 결과는 버린다.
    const isCurrent = () => entryRequests.get(url) === request

    const cached = snapshot.details[url]
    let pokemon: Pokemon
    let speciesUrl = speciesUrls.get(url)
    if (cached?.status === 'success' && speciesUrl !== undefined) {
      pokemon = cached.pokemon
    } else {
      setDetail(url, loadingDetail)
      try {
        const detail = await fetchPokemonDetailByUrl(url, { signal })
        pokemon = toPokemon(detail)
        speciesUrl = detail.species.url
      } catch (error) {
        if (!isCurrent() || isAbortError(error, signal)) return
        // 404도 여기서는 이 카드의 상세 실패다. (검색 결과 없음은 검색 단계에서 다룬다)
        setDetail(url, { status: 'error', error })
        return
      }
      if (!isCurrent()) return
      speciesUrls.set(url, speciesUrl)
      // 한국어 이름을 기다리지 않고 영문 이름으로 먼저 반영한다. (카드 다시 시도처럼 이미 보이는 카드일 때)
      setDetail(url, { status: 'success', pokemon })
    }

    try {
      const koreanName = getKoreanName(
        await fetchPokemonSpeciesByUrl(speciesUrl, { signal }),
      )
      if (!isCurrent()) return
      namedUrls.add(url)
      if (koreanName !== null) {
        setDetail(url, { status: 'success', pokemon: { ...pokemon, name: koreanName } })
      }
    } catch {
      // species 실패·취소는 카드 실패가 아니다. 영문 이름을 그대로 둔다.
    }
  }

  /** 카드 한 장이 준비되도록 한다. 끝난 카드는 바로, 진행 중인 카드는 그 요청이 끝날 때 resolve된다. (reject하지 않는다) */
  function ensureEntry(url: string): Promise<void> {
    const running = entryRequests.get(url)
    if (running) return running.promise
    if (snapshot.details[url]?.status === 'success' && namedUrls.has(url)) {
      return Promise.resolve()
    }

    const request: EntryRequest = { promise: Promise.resolve() }
    entryRequests.set(url, request)
    request.promise = loadEntry(url, request, controller.signal).finally(() => {
      if (entryRequests.get(url) === request) entryRequests.delete(url)
    })
    return request.promise
  }

  async function loadPage(
    key: string,
    params: DexPageParams,
    request: object,
    signal: AbortSignal,
  ) {
    const isCurrent = () => pageRequests.get(key) === request

    let list: PokemonListResponse
    try {
      list = await fetchPokemonList(params, { signal })
    } catch (error) {
      // 취소는 오류로 보여 주지 않는다. (화면 정리·StrictMode 재실행)
      if (!isCurrent() || isAbortError(error, signal)) return
      pageRequests.delete(key)
      // 마지막 성공 응답(data)은 지우지 않고 요청 상태만 실패로 바꾼다.
      updatePage(key, (prev) => ({ ...prev, request: { status: 'error', error } }))
      return
    }
    if (!isCurrent()) return

    // 응답이 요청한 limit보다 많아도 limit까지만 쓴다. 그 밖의 항목은 상세도 요청하지 않는다.
    const results = list.results.slice(0, params.limit)
    // 카드별 상세 실패는 페이지 실패가 아니다. 모든 카드가 성공 또는 실패로 끝나면 페이지를 반영한다.
    await Promise.all(results.map(({ url }) => ensureEntry(url)))
    if (!isCurrent()) return

    pageRequests.delete(key)
    updatePage(key, () => ({ data: { results }, request: idleRequest }))
  }

  /** 페이지를 요청한다. 같은 페이지 요청이 진행 중이면 새로 보내지 않고 그 결과를 기다린다. */
  function fetchPage(params: DexPageParams) {
    const key = getDexPageKey(params)
    if (pageRequests.has(key)) return

    const request = {}
    pageRequests.set(key, request)
    updatePage(key, (prev) => ({ ...prev, request: fetchingRequest }))
    void loadPage(key, params, request, controller.signal)
  }

  /** 실패한 카드 하나만 다시 요청한다. 요청 중이거나 성공한 카드는 무시해 중복 요청을 막는다. */
  function retryEntry(url: string) {
    if (snapshot.details[url]?.status !== 'error' || entryRequests.has(url)) return
    void ensureEntry(url)
  }

  /**
   * 진행 중인 요청을 모두 취소한다. (화면 정리)
   * 요청 표식도 바로 지워, StrictMode처럼 다시 마운트되면 같은 페이지를 새로 요청할 수 있게 한다.
   * 이미 받은 성공 데이터는 그대로 둔다.
   */
  function abortAll() {
    controller.abort()
    controller = new AbortController()

    const pages = { ...snapshot.pages }
    for (const key of pageRequests.keys()) {
      const page = pages[key]
      if (page?.request.status === 'fetching') pages[key] = { ...page, request: idleRequest }
    }
    const details = { ...snapshot.details }
    for (const url of entryRequests.keys()) {
      if (details[url]?.status === 'loading') delete details[url]
    }
    pageRequests.clear()
    entryRequests.clear()
    snapshot = { ...snapshot, pages, details }
    emit()
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }

  function getSnapshot() {
    return snapshot
  }

  return { subscribe, getSnapshot, fetchPage, retryEntry, abortAll }
}
