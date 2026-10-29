import type { Pokemon, PokemonType } from '../components/PokemonCard.tsx'

export type SortOrder = 'asc' | 'desc'

/** 번호 정렬을 고르지 않은 기본 상태(null)에서는 도감 데이터의 원래 순서로 보여 준다. */
export const DEFAULT_SORT_ORDER: SortOrder | null = null

export const SORT_OPTIONS: {
  value: SortOrder
  label: string
  description: string
}[] = [
  { value: 'asc', label: '번호 ↑', description: '도감 번호 오름차순' },
  { value: 'desc', label: '번호 ↓', description: '도감 번호 내림차순' },
]

export interface DexFilter {
  query: string
  /** 선택한 타입들. 비어 있으면 타입 조건 없음(전체) */
  types: PokemonType[]
  /** null이면 정렬하지 않고 원래 순서를 유지한다 */
  sortOrder: SortOrder | null
}

/**
 * 검색어가 이름 일부 또는 도감 번호와 맞는지 본다.
 * 비교할 때만 앞뒤 공백을 떼고 영문 대소문자를 무시한다. (입력값 자체는 바꾸지 않는다)
 * 숫자만 입력하면 번호 앞부분과 비교한다. 예: 25, 025, #0025 → 피카츄(#0025)
 */
export function matchesQuery(pokemon: Pokemon, query: string) {
  const keyword = query.trim().toLowerCase()
  if (keyword === '') return true
  if (pokemon.name.toLowerCase().includes(keyword)) return true

  const digits = /^#?(\d+)$/.exec(keyword)?.[1]
  if (digits === undefined) return false
  const number = String(pokemon.id)
  return number.startsWith(digits) || number.padStart(4, '0').startsWith(digits)
}

/**
 * 화면에 그릴 도감 목록을 계산한다. 원본 → 이름/번호 검색 → 타입 필터 → (선택 시) 번호 정렬 순서다.
 * 선택한 타입끼리는 OR(하나라도 가지면 통과), 검색어와 타입 조건은 AND로 적용한다.
 * 포켓몬마다 통과 여부만 판단하므로 복합 타입 포켓몬이 두 번 나오지 않는다.
 * filter와 toSorted는 새 배열을 돌려주므로 원본 도감 배열의 순서는 바뀌지 않는다.
 */
export function getVisiblePokemons(
  pokemons: Pokemon[],
  { query, types, sortOrder }: DexFilter,
) {
  const filtered = pokemons
    .filter((pokemon) => matchesQuery(pokemon, query))
    .filter(
      (pokemon) =>
        types.length === 0 ||
        pokemon.types.some((type) => types.includes(type)),
    )
  if (sortOrder === null) return filtered
  return filtered.toSorted((a, b) =>
    sortOrder === 'asc' ? a.id - b.id : b.id - a.id,
  )
}

/**
 * 타입 선택지와 타입별 개수. 검색·타입 필터를 적용하기 전의 전체 목록 기준이며,
 * 복합 타입 포켓몬은 가진 타입마다 한 번씩 센다. 순서는 데이터에 처음 나온 순서다.
 */
export function getTypeOptions(pokemons: Pokemon[]) {
  const counts = new Map<PokemonType, number>()
  for (const pokemon of pokemons) {
    for (const type of pokemon.types) {
      counts.set(type, (counts.get(type) ?? 0) + 1)
    }
  }
  return Array.from(counts, ([type, count]) => ({ type, count }))
}
