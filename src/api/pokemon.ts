import type { Pokemon } from '../types/pokemon'
import type { PokemonCardResult, PokemonDetailResponse, PokemonListResponse, PokemonResource, PokemonSpeciesResponse } from './pokemon.types'

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/'
const detailCache = new Map<string, PokemonDetailResponse>()
const speciesCache = new Map<string, PokemonSpeciesResponse>()
let listCache: PokemonResource[] | undefined

export class PokemonApiError extends Error {
  status: number

  constructor(status: number) {
    super(`포켓몬 정보를 불러오지 못했습니다. (HTTP ${status})`)
    this.name = 'PokemonApiError'
    this.status = status
  }
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  signal?.throwIfAborted()
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new PokemonApiError(response.status)
  }
  return response.json() as Promise<T>
}

// 전체 수를 먼저 확인하므로 151마리 등 고정된 개수에 의존하지 않습니다.
// API 내부의 페이지 처리는 화면의 페이지네이션과 별개입니다.
export async function fetchPokemonList(signal?: AbortSignal): Promise<PokemonResource[]> {
  signal?.throwIfAborted()
  if (listCache) return [...listCache]

  const first = await requestJson<PokemonListResponse>(`${POKEMON_URL}?limit=1`, signal)
  if (!first.next) {
    listCache = first.results
    return [...listCache]
  }

  const results: PokemonResource[] = []
  let next: string | null = `${POKEMON_URL}?limit=${first.count}&offset=0`
  while (next) {
    const page: PokemonListResponse = await requestJson<PokemonListResponse>(next, signal)
    results.push(...page.results)
    next = page.next
  }
  listCache = results
  return [...results]
}

// 목록 응답의 url을 그대로 전달합니다.
export async function fetchPokemonDetail(url: string, signal?: AbortSignal): Promise<PokemonDetailResponse> {
  signal?.throwIfAborted()
  const cached = detailCache.get(url)
  if (cached) return cached
  const detail = await requestJson<PokemonDetailResponse>(url, signal)
  detailCache.set(url, detail)
  return detail
}

export function toPokemon(detail: PokemonDetailResponse): Pokemon {
  return {
    number: detail.id,
    name: detail.name,
    englishName: detail.name,
    types: [...detail.types].sort((a, b) => a.slot - b.slot)
      .map(({ type }) => type.name.toUpperCase()),
    imageSrc: detail.sprites.other?.['official-artwork']?.front_default
      ?? detail.sprites.front_default
      ?? '',
  }
}

export async function fetchPokemonSpecies(url: string, signal?: AbortSignal): Promise<PokemonSpeciesResponse> {
  signal?.throwIfAborted()
  const cached = speciesCache.get(url)
  if (cached) return cached
  const species = await requestJson<PokemonSpeciesResponse>(url, signal)
  speciesCache.set(url, species)
  return species
}

// 목록, 검색, 개별 재시도에 같은 한국어 이름 변환을 적용합니다.
export async function fetchPokemonCard(url: string, signal?: AbortSignal): Promise<Pokemon> {
  const detail = await fetchPokemonDetail(url, signal)
  const pokemon = toPokemon(detail)
  try {
    const species = await fetchPokemonSpecies(detail.species.url, signal)
    signal?.throwIfAborted()
    const koreanName = species.names.find(({ language }) => language.name === 'ko')?.name
    return { ...pokemon, name: koreanName || pokemon.name }
  } catch {
    // 취소는 전파하되 번역 요청 실패만 영어 이름으로 대체합니다.
    signal?.throwIfAborted()
    return pokemon
  }
}

// 번호(25, 0025, #0025) 또는 정확한 영문 이름(pikachu)으로 상세 검색합니다.
// 404만 빈 결과로 처리하고 네트워크/서버 오류는 호출한 화면에서 처리합니다.
export async function searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon | null> {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return null
  const identifier = /^#?\d+$/.test(normalized)
    ? String(Number(normalized.replace(/^#/, '')))
    : normalized
  try {
    return await fetchPokemonCard(`${POKEMON_URL}${encodeURIComponent(identifier)}/`, signal)
  } catch (error) {
    if (error instanceof PokemonApiError && error.status === 404) return null
    throw error
  }
}

// 스크롤에서 필요한 목록 구간을 전달할 수 있습니다.
// 전체 목록을 전달해도 상세 요청은 최대 6개씩만 동시에 실행합니다.
export async function fetchPokemonCards(
  resources: PokemonResource[],
  signal?: AbortSignal,
): Promise<Pokemon[]> {
  signal?.throwIfAborted()
  const cards: Pokemon[] = []
  for (let offset = 0; offset < resources.length; offset += 6) {
    const batch = resources.slice(offset, offset + 6)
    const batchCards = await Promise.all(batch.map((resource) => fetchPokemonCard(resource.url, signal)))
    cards.push(...batchCards)
  }
  return cards
}

export async function fetchPokemonCardResults(
  resources: PokemonResource[], signal?: AbortSignal,
): Promise<PokemonCardResult[]> {
  signal?.throwIfAborted()
  const cards: PokemonCardResult[] = []
  for (let offset = 0; offset < resources.length; offset += 6) {
    const batch = resources.slice(offset, offset + 6)
    const results = await Promise.allSettled(batch.map((resource) => fetchPokemonCard(resource.url, signal)))
    signal?.throwIfAborted()
    cards.push(...results.map((result, index) => {
      const resource = batch[index]
      const number = Number(new URL(resource.url).pathname.split('/').filter(Boolean).at(-1))
      return {
        url: resource.url,
        failed: result.status === 'rejected',
        pokemon: result.status === 'fulfilled' ? result.value : {
          number,
          name: resource.name,
          types: [],
          imageSrc: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`,
        },
      }
    }))
  }
  return cards
}
