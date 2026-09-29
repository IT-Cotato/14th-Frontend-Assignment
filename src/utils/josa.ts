// 마지막 글자에 받침이 있는지 보고 조사를 고름 
function hasFinalConsonant(word: string): boolean {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
}

export function withObjectParticle(word: string): string {
  return `${word}${hasFinalConsonant(word) ? '을' : '를'}`;
}

export function withTopicParticle(word: string): string {
  return `${word}${hasFinalConsonant(word) ? '은' : '는'}`;
}