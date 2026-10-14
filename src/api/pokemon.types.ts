import type { Pokemon } from '../types/pokemon'

export interface PokemonCardResult {
  pokemon: Pokemon
  url: string
  failed: boolean
}

// PokéAPI 응답 중 목록과 카드 구성에 사용하는 필드입니다.
export interface PokemonResource {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonResource[]
}

export interface PokemonDetailResponse {
  id: number
  name: string
  species: PokemonResource
  types: {
    slot: number
    type: PokemonResource
  }[]
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
}

export interface PokemonSpeciesResponse {
  names: { name: string; language: PokemonResource }[]
}
