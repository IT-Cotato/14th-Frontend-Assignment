import pikachuImage from '../assets/pokemon/pikachu.png'
import charizardImage from '../assets/pokemon/charizard.png'
import bulbasaurImage from '../assets/pokemon/bulbasaur.png'
import blastoiseImage from '../assets/pokemon/blastoise.png'
import type { Pokemon } from '../components/PokemonCard.tsx'

/** 화면에 그리는 로컬 예시 데이터. 헤더 배지의 도감 전체 수(151)와는 별개다. */
export const pokemons: Pokemon[] = [
  { id: 25, name: '피카츄', types: ['ELECTRIC'], imageUrl: pikachuImage },
  { id: 6, name: '리자몽', types: ['FIRE'], imageUrl: charizardImage },
  { id: 1, name: '이상해씨', types: ['GRASS'], imageUrl: bulbasaurImage },
  { id: 9, name: '거북왕', types: ['WATER'], imageUrl: blastoiseImage },
]

/** Empty UI 확인용 빈 목록. 원본 배열을 비우지 않고 별도의 배열을 쓴다. */
export const emptyPokemons: Pokemon[] = []
