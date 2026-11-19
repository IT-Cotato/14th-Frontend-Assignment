import type { Pokemon } from './pokemon'

export interface PokemonDetails extends Pokemon {
  description: string
  heightMeters: number
  weightKg: number
  ability: string
  stats: { name: string; value: number }[]
}
