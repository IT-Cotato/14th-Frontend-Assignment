import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemonCard, getPokemonPageParams } from '../api/pokemon'
import type { PokemonCardResult } from '../api/pokemon.types'
import { pokemonPageOptions } from '../queries/pokemon'

const PAGE_SIZE = 4
const DISPLAY_LIMIT = 32

export function usePokemonPage() {
  const [params, setParams] = useSearchParams()
  const requestedPage = Number(params.get('page') ?? 1)
  const pageNumber = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= DISPLAY_LIMIT / PAGE_SIZE
    ? requestedPage : 1
  const page = { limit: PAGE_SIZE, offset: (pageNumber - 1) * PAGE_SIZE }

  function setPage(target: { limit: number; offset: number }) {
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.set('page', String(Math.floor(target.offset / target.limit) + 1))
      return next
    })
  }
  const queryClient = useQueryClient()
  const pageOptions = pokemonPageOptions(page.limit, page.offset)
  const result = useQuery({ ...pageOptions, placeholderData: keepPreviousData })
  const [retryingUrls, setRetryingUrls] = useState<string[]>([])
  const retryControllers = useRef(new Map<string, AbortController>())

  const visibleCount = Math.min(result.data?.count ?? 0, DISPLAY_LIMIT)
  const totalPages = Math.max(1, Math.ceil(visibleCount / page.limit))

  // Arrow navigation uses the server-provided URL, not a calculated offset.
  function followPageUrl(url: string | null | undefined) {
    if (!url || result.isPlaceholderData) return
    const target = getPokemonPageParams(url)
    if (target.offset >= visibleCount) return
    setPage(target)
  }

  async function retryCard(card: PokemonCardResult) {
    if (retryControllers.current.has(card.url)) return
    const controller = new AbortController()
    retryControllers.current.set(card.url, controller)
    setRetryingUrls((current) => [...current, card.url])
    try {
      const pokemon = await fetchPokemonCard(card.url, controller.signal)
      if (controller.signal.aborted) return
      // 재시도 중 페이지를 이동해도 원래 페이지의 캐시 갱신
      queryClient.setQueryData(pageOptions.queryKey, (current) => current ? {
        ...current,
        cards: current.cards.map((item) => item.url === card.url
          ? { url: card.url, failed: false, pokemon } : item),
      } : current)
    } catch {
      // 재시도 실패 시 해당 오류 카드를 유지하고 다른 카드는 변경X
    } finally {
      retryControllers.current.delete(card.url)
      if (!controller.signal.aborted) setRetryingUrls((current) => current.filter((url) => url !== card.url))
    }
  }

  useEffect(() => {
    const pendingRetries = retryControllers.current
    return () => {
      pendingRetries.forEach((request) => request.abort())
      pendingRetries.clear()
    }
  }, [])

  return {
    cards: result.data?.cards ?? [],
    currentPage: Math.floor(page.offset / page.limit) + 1,
    totalPages,
    hasPrevious: Boolean(result.data?.previous),
    hasNext: Boolean(result.data?.next),
    hasData: result.data !== undefined,
    isPending: result.isPending,
    isFetching: result.isFetching,
    isPlaceholderData: result.isPlaceholderData,
    isError: result.isError,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
    changePage: (number: number) => {
      if (result.isPlaceholderData || !Number.isInteger(number) || number < 1 || number > totalPages) return
      setPage({ limit: page.limit, offset: (number - 1) * page.limit })
    },
    previousPage: () => followPageUrl(result.data?.previous),
    nextPage: () => followPageUrl(result.data?.next),
    retryCard,
    retryingUrls,
  }
}
