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

/**
 * 6마리 정원과 7번째 추가 차단 확인용 목록(?preview=team-test).
 * 기본 4마리에 서로 다른 포켓몬 5마리를 더한다. 이미지 자산이 없는 포켓몬은
 * imageUrl을 비워 두고 이름 대체 UI로 표시한다.
 */
export const teamTestPokemons: Pokemon[] = [
  ...pokemons,
  { id: 4, name: '파이리', types: ['FIRE'] },
  { id: 7, name: '꼬부기', types: ['WATER'] },
  { id: 2, name: '이상해풀', types: ['GRASS', 'POISON'] },
  { id: 26, name: '라이츄', types: ['ELECTRIC'] },
  { id: 130, name: '갸라도스', types: ['WATER', 'FLYING'] },
]
