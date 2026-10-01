import pikachu from '../assets/pikachu.png'
import charizard from '../assets/charizard.png'
import bulbasaur from '../assets/bulbasaur.png'
import blastoise from '../assets/blastoise.png'
import dragonite from '../assets/dragonite.png'
import eevee from '../assets/eevee.png'
import gengar from '../assets/gengar.png'


export type PokemonType =
  | 'electric'
  | 'fire'
  | 'grass'
  | 'water'
  | 'dragon'
  | 'normal'
  | 'ghost'

export interface Pokemon {
  id: number
  name: string
  type: PokemonType
  image: string
}


export const pokemonList: Pokemon[] = [
  { id: 25, name: '피카츄', type: 'electric', image: pikachu },
  { id: 6, name: '리자몽', type: 'fire', image: charizard },
  { id: 1, name: '이상해씨', type: 'grass', image: bulbasaur },
  { id: 9, name: '거북왕', type: 'water', image: blastoise },
  { id: 149, name: '망나뇽', type: 'dragon', image: dragonite },
  { id: 133, name: '이브이', type: 'normal', image: eevee },
  { id: 94, name: '팬텀', type: 'ghost', image: gengar },
]

export const POKEMON_TYPE_LABELS: Record<PokemonType, string> = {
  electric: '전기',
  fire: '불꽃',
  grass: '풀',
  water: '물',
  dragon: '드래곤',
  normal: '노말',
  ghost: '고스트',
}
