import type { Pokemon } from '../types/pokemon';

// 검색어가 포켓몬과 맞는지 확인
// - 숫자만 입력하면도감 번호가 정확히 같은 포켓몬: "25", "#0025" → 피카츄
// - 그 외에는 이름 일부가 포함된 포켓몬: "피카" → 피카츄
// - 빈 검색어는 전체
export function matchesKeyword(pokemon: Pokemon, keyword: string): boolean {
  const query = keyword.trim();
  if (query === '') return true;

  const numberText = query.replace(/^#/, '');
  if (/^\d+$/.test(numberText)) {
    return pokemon.id === Number(numberText);
  }

  return pokemon.name.includes(query);
}