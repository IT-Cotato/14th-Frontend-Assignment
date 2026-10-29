import { useEffect, useRef, useState } from 'react'
import {
  fetchPokemonDetailByUrl,
  fetchPokemonList,
  fetchPokemonSpeciesByUrl,
  getKoreanName,
  getPokemonIdFromUrl,
  isAbortError,
  toPokemon,
} from '../api/pokeapi.ts'
import type { NamedApiResource } from '../api/pokeapi.ts'
import type { Pokemon } from '../components/PokemonCard.tsx'

const LIST_LIMIT = 20
const LIST_OFFSET = 0

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

/** 목록 요청 상태. 목록이 성공해야 entries가 생기고, 카드별 상태는 각 entry.detail이 따로 가진다. */
export type PokemonDexState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; entries: DexEntry[] }

/*
 * 내부 state는 "몇 번째 요청의 결과인지(requestId)"와 함께 저장한다.
 * 다시 시도하면 requestId만 올리고, 결과의 requestId가 현재 값과 다르면 아직 응답이 없는 것(Loading)으로 본다.
 * 그래서 Effect 안에서 setState로 Loading을 따로 켜지 않아도 되고, 이전 목록·오류도 바로 가려진다.
 */
type ListResult =
  | { requestId: number; status: 'success'; results: NamedApiResource[] }
  | { requestId: number; status: 'error'; error: unknown }

type DetailResults = {
  requestId: number
  /** 상세 url → 끝난 요청의 결과. 키가 없으면 아직 요청 중이다. */
  byUrl: Record<string, DexEntryDetail>
}

const loadingDetail: DexEntryDetail = { status: 'loading' }

/** 카드 상세 요청 한 번(최초 또는 다시 시도). 화면 상태가 아니라 요청 관리용이라 state에 두지 않는다. */
type EntryAttempt = {
  controller: AbortController
  /** 상세 요청 결과. species 단계는 카드 성공·실패에 영향을 주지 않는다. */
  result: 'pending' | 'success' | 'error'
}

/** 지금 목록 요청 수명(Effect 한 번)에 묶인 카드 재시도 함수. cleanup되면 비워진다. */
type EntryLoader = { retryEntry: (url: string) => void }

type UsePokemonDexOptions = {
  /** false면 요청하지 않는다. (?preview 로컬 데이터 화면) */
  enabled: boolean
}

export function usePokemonDex({ enabled }: UsePokemonDexOptions) {
  const [requestId, setRequestId] = useState(0)
  const [listResult, setListResult] = useState<ListResult | null>(null)
  const [detailResults, setDetailResults] = useState<DetailResults>({
    requestId: -1,
    byUrl: {},
  })
  // 이벤트 핸들러(카드 다시 시도)가 현재 Effect 실행의 요청 수명에 접근하는 통로. 렌더링 중에는 읽지 않는다.
  const loaderRef = useRef<EntryLoader | null>(null)

  useEffect(() => {
    if (!enabled) return

    // 목록 요청용 controller. 카드 요청은 아래 시도(attempt)마다 controller를 따로 둔다.
    const controller = new AbortController()
    const { signal } = controller
    // abort 전에 이미 끝난 응답의 후속 처리(then, species 갱신 등)도 막기 위한 플래그.
    let active = true
    // 카드(url)별 최신 시도. 같은 카드를 다시 시도하면 이전 시도는 abort하고, 이 값이 바뀌어 늦은 응답도 버려진다.
    const attempts = new Map<string, EntryAttempt>()

    function setDetail(
      url: string,
      update: (prev: DexEntryDetail | undefined) => DexEntryDetail | undefined,
    ) {
      setDetailResults((prev) => {
        if (prev.requestId !== requestId) return prev
        const next = update(prev.byUrl[url])
        if (next === undefined || next === prev.byUrl[url]) return prev
        return { requestId, byUrl: { ...prev.byUrl, [url]: next } }
      })
    }

    // 상세 → (성공 시) 한국어 이름. 카드마다 독립적으로 진행해 먼저 끝난 카드부터 보인다.
    async function loadEntry(url: string) {
      attempts.get(url)?.controller.abort()
      const attempt: EntryAttempt = { controller: new AbortController(), result: 'pending' }
      attempts.set(url, attempt)
      const entrySignal = attempt.controller.signal
      // 목록 요청이 바뀌었거나(active) 같은 카드의 더 새 시도가 시작됐으면 이 시도의 결과는 버린다.
      const isCurrent = () => active && attempts.get(url) === attempt

      let pokemon: Pokemon
      let speciesUrl: string
      try {
        const detail = await fetchPokemonDetailByUrl(url, { signal: entrySignal })
        pokemon = toPokemon(detail)
        speciesUrl = detail.species.url
      } catch (error) {
        if (!isCurrent() || isAbortError(error, entrySignal)) return
        attempt.result = 'error'
        // 404도 여기서는 이 카드의 상세 실패다. (검색 결과 없음은 검색 단계에서 다룬다)
        setDetail(url, () => ({ status: 'error', error }))
        return
      }
      if (!isCurrent()) return
      attempt.result = 'success'
      // 한국어 이름을 기다리지 않고 영문 이름으로 먼저 표시한다.
      setDetail(url, () => ({ status: 'success', pokemon }))

      try {
        const koreanName = getKoreanName(
          await fetchPokemonSpeciesByUrl(speciesUrl, { signal: entrySignal }),
        )
        if (!isCurrent() || koreanName === null) return
        setDetail(url, (prev) =>
          prev?.status === 'success'
            ? { status: 'success', pokemon: { ...prev.pokemon, name: koreanName } }
            : prev,
        )
      } catch {
        // species 실패·취소는 카드 실패가 아니다. 영문 이름을 그대로 둔다.
      }
    }

    // 실패한 카드 하나만 다시 요청한다. 목록·다른 카드의 요청과 결과는 건드리지 않는다.
    function retryEntry(url: string) {
      // 실패한 카드만 다시 시도할 수 있다. 요청 중(pending)이거나 성공한 카드는 무시해 중복 요청을 막는다.
      if (!active || attempts.get(url)?.result !== 'error') return
      setDetail(url, () => loadingDetail)
      void loadEntry(url)
    }
    const loader: EntryLoader = { retryEntry }
    loaderRef.current = loader

    fetchPokemonList({ limit: LIST_LIMIT, offset: LIST_OFFSET }, { signal }).then(
      (list) => {
        if (!active) return
        setListResult({ requestId, status: 'success', results: list.results })
        setDetailResults({ requestId, byUrl: {} })
        for (const { url } of list.results) {
          void loadEntry(url)
        }
      },
      (error: unknown) => {
        // 취소는 오류로 보여 주지 않는다. (cleanup·StrictMode 재실행·다시 시도)
        if (!active || isAbortError(error, signal)) return
        setListResult({ requestId, status: 'error', error })
      },
    )

    return () => {
      active = false
      controller.abort()
      for (const attempt of attempts.values()) attempt.controller.abort()
      if (loaderRef.current === loader) loaderRef.current = null
    }
  }, [enabled, requestId])

  // 화면용 상태는 저장하지 않고 렌더링할 때 계산한다.
  let state: PokemonDexState
  if (listResult === null || listResult.requestId !== requestId) {
    state = { status: 'loading' }
  } else if (listResult.status === 'error') {
    state = { status: 'error', error: listResult.error }
  } else {
    const byUrl = detailResults.requestId === requestId ? detailResults.byUrl : {}
    state = {
      status: 'success',
      entries: listResult.results.map(({ name, url }) => ({
        url,
        name,
        id: getPokemonIdFromUrl(url),
        detail: byUrl[url] ?? loadingDetail,
      })),
    }
  }

  /** 상세까지 성공한 포켓몬. 기존 검색·필터 계산(getVisiblePokemons)에 그대로 넘길 수 있다. */
  const pokemons =
    state.status === 'success'
      ? state.entries.flatMap((entry) =>
          entry.detail.status === 'success' ? [entry.detail.pokemon] : [],
        )
      : []

  /** 목록 전체 다시 시도: 요청 번호를 올려 목록과 모든 카드 결과를 새로 받는다. */
  function retry() {
    setRequestId((id) => id + 1)
  }

  /** 카드 한 장 다시 시도: 지금 목록 요청 수명 안에서 그 카드의 상세만 다시 받는다. */
  function retryEntry(url: string) {
    loaderRef.current?.retryEntry(url)
  }

  return { state, pokemons, retry, retryEntry }
}
