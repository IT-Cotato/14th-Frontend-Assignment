import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { Pokemon, PokemonType } from '../pokemon'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Array<{ name: string; url: string }>
}

interface PokemonDetailResponse {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
  types: Array<{ type: { name: string } }>
  abilities: Array<{ ability: { name: string } }>
  stats: Array<{ base_stat: number; stat: { name: string } }>
}

interface PokemonSpeciesResponse {
  names: Array<{ name: string; language: { name: string } }>
  flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>
}

export interface PokemonDetailModel extends Pokemon {
  height: number
  weight: number
  types: string[]
  abilities: string[]
  stats: Array<{ name: string; value: number }>
  description: string
}

export type PokemonCardModel =
  | { status: 'success'; key: string; pokemon: Pokemon }
  | { status: 'error'; key: string; name: string; url: string; id: number }

export interface PokemonPageModel {
  cards: PokemonCardModel[]
  count: number
  nextUrl: string | null
  previousUrl: string | null
}

export interface PokemonPageParams {
  limit: number
  offset: number
}

const toPokemon = (detail: PokemonDetailResponse): Pokemon => ({
  id: detail.id,
  number: String(detail.id).padStart(4, '0'),
  name: detail.name.replaceAll('-', ' '),
  type: (detail.types[0]?.type.name.toUpperCase() ?? 'NORMAL') as PokemonType,
  imageUrl:
    detail.sprites.other?.['official-artwork']?.front_default ??
    detail.sprites.front_default ??
    '',
})

const getIdFromUrl = (url: string) => Number(url.split('/').filter(Boolean).at(-1))

const fetchPokemonDetail = async (url: string, signal: AbortSignal) => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`상세 요청 실패: ${response.status}`)
  return toPokemon(await response.json() as PokemonDetailResponse)
}

const fetchPokemonPage = async ({ limit, offset }: PokemonPageParams, signal: AbortSignal) => {
  const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`, { signal })
  if (!response.ok) throw new Error(`목록 요청 실패: ${response.status}`)

  const list = await response.json() as PokemonListResponse
  const cards = await Promise.all(
    list.results.map(async (item): Promise<PokemonCardModel> => {
      try {
        const pokemon = await fetchPokemonDetail(item.url, signal)
        return { status: 'success', key: item.url, pokemon }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error
        return {
          status: 'error',
          key: item.url,
          name: item.name,
          url: item.url,
          id: getIdFromUrl(item.url),
        }
      }
    }),
  )

  return {
    cards,
    count: list.count,
    nextUrl: list.next,
    previousUrl: list.previous,
  } satisfies PokemonPageModel
}

export const getPageParamsFromUrl = (url: string): PokemonPageParams => {
  const parsedUrl = new URL(url)
  return {
    limit: Number(parsedUrl.searchParams.get('limit')) || 20,
    offset: Number(parsedUrl.searchParams.get('offset')) || 0,
  }
}

export const usePokemonPage = ({ limit, offset }: PokemonPageParams, enabled = true) =>
  useQuery({
    queryKey: ['pokemon', 'list', { limit, offset }],
    queryFn: ({ signal }) => fetchPokemonPage({ limit, offset }, signal),
    placeholderData: keepPreviousData,
    enabled,
  })

export const usePokemonSearch = (query: string, enabled = true) => {
  const normalizedQuery = query.trim().toLowerCase()

  return useQuery({
    queryKey: ['pokemon', 'search', normalizedQuery],
    enabled: enabled && normalizedQuery.length > 0,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${API_URL}/${encodeURIComponent(normalizedQuery)}`, { signal })
      if (response.status === 404) return null
      if (!response.ok) throw new Error(`검색 요청 실패: ${response.status}`)
      return toPokemon(await response.json() as PokemonDetailResponse)
    },
  })
}

const cleanFlavorText = (value: string) => value.replace(/[\n\f]/g, ' ').replace(/\s+/g, ' ').trim()

export const usePokemonDetail = (pokemonId: string | undefined) => {
  const normalizedId = pokemonId?.trim().toLowerCase() ?? ''

  return useQuery({
    queryKey: ['pokemon', 'detail', normalizedId],
    enabled: normalizedId.length > 0,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === 'POKEMON_NOT_FOUND') return false
      return failureCount < 1
    },
    queryFn: async ({ signal }) => {
      const detailResponse = await fetch(
        `${API_URL}/${encodeURIComponent(normalizedId)}`,
        { signal },
      )
      if (detailResponse.status === 404) throw new Error('POKEMON_NOT_FOUND')
      if (!detailResponse.ok) throw new Error(`상세 요청 실패: ${detailResponse.status}`)

      const detail = await detailResponse.json() as PokemonDetailResponse
      let species: PokemonSpeciesResponse | null = null

      try {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${detail.id}`,
          { signal },
        )
        if (speciesResponse.ok) species = await speciesResponse.json() as PokemonSpeciesResponse
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') throw error
      }

      const koreanName = species?.names.find((entry) => entry.language.name === 'ko')?.name
      const koreanDescription = species?.flavor_text_entries.find(
        (entry) => entry.language.name === 'ko',
      )?.flavor_text
      const englishDescription = species?.flavor_text_entries.find(
        (entry) => entry.language.name === 'en',
      )?.flavor_text

      return {
        ...toPokemon(detail),
        name: koreanName ?? detail.name.replaceAll('-', ' '),
        height: detail.height / 10,
        weight: detail.weight / 10,
        types: detail.types.map((entry) => entry.type.name.toUpperCase()),
        abilities: detail.abilities.map((entry) => entry.ability.name.replaceAll('-', ' ')),
        stats: detail.stats.map((entry) => ({
          name: entry.stat.name,
          value: entry.base_stat,
        })),
        description: cleanFlavorText(koreanDescription ?? englishDescription ?? '설명이 없어요.'),
      } satisfies PokemonDetailModel
    },
  })
}
