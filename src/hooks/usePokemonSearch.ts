import { useEffect, useRef, useState } from 'react'
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

/** 제출한 검색 한 번. 같은 검색어를 다시 제출하거나 다시 시도해도 id가 새로 붙어 다시 요청한다. */
type Submission = { id: number; keyword: string }

/** 끝난 검색 요청의 결과. 어느 제출(submissionId)의 결과인지 함께 저장한다. */
type SearchResult =
  | { submissionId: number; status: 'success'; pokemon: Pokemon }
  | { submissionId: number; status: 'not-found' }
  | { submissionId: number; status: 'error'; error: unknown }

/** 화면용 검색 상태. idle이면 검색 중이 아니므로 기본 목록을 보여 준다. */
export type PokemonSearchState =
  | { status: 'idle' }
  | { status: 'loading'; keyword: string }
  | { status: 'success'; keyword: string; pokemon: Pokemon }
  | { status: 'not-found'; keyword: string }
  | { status: 'error'; keyword: string; error: unknown }

type UsePokemonSearchOptions = {
  /** false면 요청하지 않는다. (?preview 로컬 데이터 화면) */
  enabled: boolean
}

/**
 * 도감 번호·영문 이름 상세 검색. 입력창의 원본 값은 다루지 않고, 제출한 검색어만 가진다.
 * - submit(query): 정리한 값이 비어 있으면 검색을 끝내고 기본 목록으로 돌아간다.
 * - retry(): 마지막으로 제출한 검색어를 다시 요청한다. (입력창의 미제출 값은 쓰지 않는다)
 */
export function usePokemonSearch({ enabled }: UsePokemonSearchOptions) {
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [result, setResult] = useState<SearchResult | null>(null)
  // 제출 번호. 기본 목록으로 돌아갔다가 다시 검색해도 번호가 겹치지 않아 이전 결과가 다시 보이지 않는다.
  const submissionSeqRef = useRef(0)

  useEffect(() => {
    if (!enabled || submission === null) return

    // 이 제출의 상세·species 요청은 모두 이 signal로 취소된다. (새 제출·기본 목록 복귀·화면 정리)
    const controller = new AbortController()
    const { signal } = controller
    // abort 전에 이미 끝난 응답의 후속 처리도 막는다.
    let active = true
    const submissionId = submission.id

    async function search(keyword: string) {
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
            ? { submissionId, status: 'not-found' }
            : { submissionId, status: 'error', error },
        )
        return
      }
      if (!active) return
      // 한국어 이름을 기다리지 않고 영문 이름으로 먼저 보여 준다.
      setResult({ submissionId, status: 'success', pokemon })

      try {
        const koreanName = getKoreanName(await fetchPokemonSpeciesByUrl(speciesUrl, { signal }))
        if (!active || koreanName === null) return
        setResult((prev) =>
          prev?.submissionId === submissionId && prev.status === 'success'
            ? { ...prev, pokemon: { ...prev.pokemon, name: koreanName } }
            : prev,
        )
      } catch {
        // species 실패·취소는 검색 실패가 아니다. 영문 이름 결과를 그대로 둔다.
      }
    }

    void search(submission.keyword)

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, submission])

  // 화면용 상태는 렌더링할 때 계산한다. 결과의 제출 번호가 지금 제출과 다르면 아직 응답 전(Loading)이다.
  let state: PokemonSearchState
  if (submission === null) {
    state = { status: 'idle' }
  } else if (result === null || result.submissionId !== submission.id) {
    state = { status: 'loading', keyword: submission.keyword }
  } else if (result.status === 'success') {
    state = { status: 'success', keyword: submission.keyword, pokemon: result.pokemon }
  } else if (result.status === 'not-found') {
    state = { status: 'not-found', keyword: submission.keyword }
  } else {
    state = { status: 'error', keyword: submission.keyword, error: result.error }
  }

  function submit(query: string) {
    const keyword = normalizePokemonQuery(query)
    if (keyword === '') {
      // 빈 검색어는 요청하지 않고 기본 목록으로 돌아간다. (진행 중인 검색은 cleanup에서 취소된다)
      setSubmission(null)
      return
    }
    submissionSeqRef.current += 1
    setSubmission({ id: submissionSeqRef.current, keyword })
  }

  function retry() {
    if (submission === null) return
    submissionSeqRef.current += 1
    setSubmission({ id: submissionSeqRef.current, keyword: submission.keyword })
  }

  /**
   * 제출한 검색을 끝내고 기본 목록 상태로 돌린다. (도감을 떠날 때)
   * 진행 중인 상세·species 요청은 Effect cleanup에서 취소되고, 다음 제출은 새 번호를 받으므로
   * 이전 검색의 결과가 다시 보이지 않는다. 입력창의 원본 값은 이 훅이 다루지 않으므로 그대로다.
   */
  function reset() {
    setSubmission(null)
  }

  return { state, submit, retry, reset }
}
