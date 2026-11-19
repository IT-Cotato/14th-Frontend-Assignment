import { queryOptions } from '@tanstack/react-query'
import {
  POKEAPI_BASE_URL,
  fetchPokemonAbilityByUrl,
  fetchPokemonDetailByUrl,
  fetchPokemonSpeciesByUrl,
} from './pokeapi.ts'

/**
 * 도감 카드·상세 화면이 함께 쓰는 쿼리. 응답 원본을 주소별로 한 번만 캐시하고, 화면에 맞는 값은 렌더링할 때 꺼낸다.
 * 도감 번호별 상세·종·특성은 바뀌지 않으므로 성공한 결과는 다시 요청하지 않는다(staleTime: Infinity).
 * 실패한 쿼리는 데이터가 없어 그 화면이 다시 보일 때 새로 요청된다.
 */

/** 목록 results의 상세 주소와 같은 형식(…/pokemon/6/). 상세 화면과 도감 카드가 같은 캐시를 쓴다. */
export function getPokemonDetailUrl(id: number) {
  return `${POKEAPI_BASE_URL}/pokemon/${id}/`
}

export function pokemonDetailQuery(url: string) {
  return queryOptions({
    queryKey: ['pokemon', 'detail', url],
    queryFn: ({ signal }) => fetchPokemonDetailByUrl(url, { signal }),
    staleTime: Infinity,
  })
}

export function pokemonSpeciesQuery(url: string) {
  return queryOptions({
    queryKey: ['pokemon', 'species', url],
    queryFn: ({ signal }) => fetchPokemonSpeciesByUrl(url, { signal }),
    staleTime: Infinity,
  })
}

export function pokemonAbilityQuery(url: string) {
  return queryOptions({
    queryKey: ['pokemon', 'ability', url],
    queryFn: ({ signal }) => fetchPokemonAbilityByUrl(url, { signal }),
    staleTime: Infinity,
  })
}
