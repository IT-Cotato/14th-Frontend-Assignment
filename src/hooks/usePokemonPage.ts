import { useEffect, useRef, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPokemonCard, getPokemonPageParams } from '../api/pokemon'
import type { PokemonCardResult } from '../api/pokemon.types'
import { pokemonPageOptions } from '../queries/pokemon'

const PAGE_SIZE = 4

export function usePokemonPage() {
  const [page, setPage] = useState({ limit: PAGE_SIZE, offset: 0 })
  const queryClient = useQueryClient()
  const pageOptions = pokemonPageOptions(page.limit, page.offset)
  const result = useQuery({ ...pageOptions, placeholderData: keepPreviousData })
  const [retryingUrls, setRetryingUrls] = useState<string[]>([])
  const retryControllers = useRef(new Map<string, AbortController>())

  // Arrow navigation uses the server-provided URL, not a calculated offset.
  function followPageUrl(url: string | null | undefined) {
    if (!url || result.isPlaceholderData) return
    setPage(getPokemonPageParams(url))
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
    totalPages: Math.max(1, Math.ceil((result.data?.count ?? 0) / page.limit)),
    hasPrevious: Boolean(result.data?.previous),
    hasNext: Boolean(result.data?.next),
    hasData: result.data !== undefined,
    isPending: result.isPending,
    isFetching: result.isFetching,
    isPlaceholderData: result.isPlaceholderData,
    isError: result.isError,
    isSuccess: result.isSuccess,
    refetch: result.refetch,
    changePage: (number: number) => setPage((current) => ({
      ...current, offset: (number - 1) * current.limit,
    })),
    previousPage: () => followPageUrl(result.data?.previous),
    nextPage: () => followPageUrl(result.data?.next),
    retryCard,
    retryingUrls,
  }
}
