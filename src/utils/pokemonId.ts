// "#0006" 같은 도감 번호를 URL에 쓰는 "6" 형태로 바꿉니다.
export function toPokemonId(number: string): string {
  return String(Number(number.replace('#', '')));
}
