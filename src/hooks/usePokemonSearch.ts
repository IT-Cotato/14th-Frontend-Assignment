import { useEffect, useState } from 'react'
import {
  fetchPokemonDetail,
  fetchPokemonSpeciesByUrl,
  getKoreanName,
  isAbortError,
  isNotFoundError,
  normalizePokemonQuery,
  toPokemon,
} from '../api/pokeapi.ts'
import type { Pokemon } from '../components/PokemonCard.tsx'

/** 끝난 검색 요청의 결과. 어느 요청(requestKey: 검색어 + 다시 시도 횟수)의 결과인지 함께 저장한다. */
type SearchResult =
  | { requestKey: string; status: 'success'; pokemon: Pokemon }
  | { requestKey: string; status: 'not-found' }
  | { requestKey: string; status: 'error'; error: unknown }

/** 화면용 검색 상태. idle이면 검색 중이 아니므로 기본 목록을 보여 준다. */
export type PokemonSearchState =
  | { status: 'idle' }
  | { status: 'loading'; keyword: string }
  | { status: 'success'; keyword: string; pokemon: Pokemon }
  | { status: 'not-found'; keyword: string }
  | { status: 'error'; keyword: string; error: unknown }

type UsePokemonSearchOptions = {
  /** false면 요청하지 않는다. (?preview 로컬 데이터 화면·도감이 아닌 화면) */
  enabled: boolean
  /** 주소의 q 값. 정리한 값이 비어 있으면 검색하지 않고 기본 목록을 보여 준다. */
  query: string
}

/**
 * 도감 번호·영문 이름 상세 검색. 검색어는 주소(q)가 정하므로 새로고침·뒤로 가기에도 같은 검색이 복원된다.
 * - retry(): 지금 검색어를 다시 요청한다.
 */
export function usePokemonSearch({ enabled, query }: UsePokemonSearchOptions) {
  const keyword = normalizePokemonQuery(query)
  // 같은 검색어를 다시 시도할 때마다 올린다. 이전 시도의 결과가 다시 보이지 않게 요청 키에 넣는다.
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<SearchResult | null>(null)
  const requestKey = `${keyword}#${attempt}`

  useEffect(() => {
    if (!enabled || keyword === '') return

    // 이 검색의 상세·species 요청은 모두 이 signal로 취소된다. (새 검색어·검색 종료·화면 정리)
    const controller = new AbortController()
    const { signal } = controller
    // abort 전에 이미 끝난 응답의 후속 처리도 막는다.
    let active = true
    const key = `${keyword}#${attempt}`

    async function search() {
      let pokemon: Pokemon
      let speciesUrl: string
      try {
        const detail = await fetchPokemonDetail(keyword, { signal })
        pokemon = toPokemon(detail)
        speciesUrl = detail.species.url
      } catch (error) {
        if (!active || isAbortError(error, signal)) return
        // 검색에서의 404는 오류가 아니라 '검색 결과 없음'이다.
        setResult(
          isNotFoundError(error)
            ? { requestKey: key, status: 'not-found' }
            : { requestKey: key, status: 'error', error },
        )
        return
      }
      if (!active) return
      // 한국어 이름을 기다리지 않고 영문 이름으로 먼저 보여 준다.
      setResult({ requestKey: key, status: 'success', pokemon })

      try {
        const koreanName = getKoreanName(await fetchPokemonSpeciesByUrl(speciesUrl, { signal }))
        if (!active || koreanName === null) return
        setResult((prev) =>
          prev?.requestKey === key && prev.status === 'success'
            ? { ...prev, pokemon: { ...prev.pokemon, name: koreanName } }
            : prev,
        )
      } catch {
        // species 실패·취소는 검색 실패가 아니다. 영문 이름 결과를 그대로 둔다.
      }
    }

    void search()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, keyword, attempt])

  // 화면용 상태는 렌더링할 때 계산한다. 결과의 요청 키가 지금 검색과 다르면 아직 응답 전(Loading)이다.
  let state: PokemonSearchState
  if (keyword === '') {
    state = { status: 'idle' }
  } else if (result === null || result.requestKey !== requestKey) {
    state = { status: 'loading', keyword }
  } else if (result.status === 'success') {
    state = { status: 'success', keyword, pokemon: result.pokemon }
  } else if (result.status === 'not-found') {
    state = { status: 'not-found', keyword }
  } else {
    state = { status: 'error', keyword, error: result.error }
  }

  function retry() {
    if (keyword === '') return
    setAttempt((value) => value + 1)
  }

  return { state, retry }
}
