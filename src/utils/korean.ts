/**
 * 단어의 마지막 글자 받침에 맞춰 조사를 붙인다. (예: 리자몽을, 피카츄를)
 * 한글로 끝나지 않으면 "을(를)"처럼 둘 다 표시한다.
 */
export function withParticle(
  word: string,
  afterConsonant: string,
  afterVowel: string,
) {
  const lastCode = word.charCodeAt(word.length - 1)
  if (Number.isNaN(lastCode) || lastCode < 0xac00 || lastCode > 0xd7a3) {
    return `${word}${afterConsonant}(${afterVowel})`
  }
  const hasFinalConsonant = (lastCode - 0xac00) % 28 !== 0
  return `${word}${hasFinalConsonant ? afterConsonant : afterVowel}`
}
