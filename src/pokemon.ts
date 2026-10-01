import dragoniteArtwork from './assets/dragonite.png'
import bulbasaurArtwork from './assets/bulbasaur.png'
import charizardArtwork from './assets/charizard.png'
import eeveeArtwork from './assets/eevee.png'
import gengarArtwork from './assets/gengar.png'
import pikachuArtwork from './assets/pikachu.png'

export type PokemonType = 'DRAGON' | 'GHOST' | 'NORMAL' | 'ELECTRIC' | 'FIRE' | 'GRASS'

export interface Pokemon {
  id: number
  number: string
  name: string
  type: PokemonType
  imageUrl: string
}

export const POKEMON: Pokemon[] = [
  { id: 1, number: '0001', name: '이상해씨', type: 'GRASS', imageUrl: bulbasaurArtwork },
  { id: 6, number: '0006', name: '리자몽', type: 'FIRE', imageUrl: charizardArtwork },
  { id: 25, number: '0025', name: '피카츄', type: 'ELECTRIC', imageUrl: pikachuArtwork },
  { id: 149, number: '0149', name: '망나뇽', type: 'DRAGON', imageUrl: dragoniteArtwork },
  { id: 94, number: '0094', name: '팬텀', type: 'GHOST', imageUrl: gengarArtwork },
  { id: 133, number: '0133', name: '이브이', type: 'NORMAL', imageUrl: eeveeArtwork },
]
