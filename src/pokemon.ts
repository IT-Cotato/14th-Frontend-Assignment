import dragoniteArtwork from './assets/dragonite.png'
import eeveeArtwork from './assets/eevee.png'
import gengarArtwork from './assets/gengar.png'
import pikachuArtwork from './assets/pikachu.png'

export type PokemonType = 'DRAGON' | 'GHOST' | 'NORMAL' | 'ELECTRIC'

export interface Pokemon {
  id: number
  number: string
  name: string
  type: PokemonType
  imageUrl: string
}

export const POKEMON: Pokemon[] = [
  { id: 149, number: '0149', name: '망나뇽', type: 'DRAGON', imageUrl: dragoniteArtwork },
  { id: 94, number: '0094', name: '팬텀', type: 'GHOST', imageUrl: gengarArtwork },
  { id: 133, number: '0133', name: '이브이', type: 'NORMAL', imageUrl: eeveeArtwork },
  { id: 25, number: '0025', name: '피카츄', type: 'ELECTRIC', imageUrl: pikachuArtwork },
]
