// 도감 번호를 #0006 형식으로
export function formatPokemonNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}