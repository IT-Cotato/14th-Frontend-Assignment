export const MAX_TEAM_SIZE = 6;

export const TEAM_ROLES = ["공격", "방어", "서포트"] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export const DEFAULT_ROLE: TeamRole = "공격";

export type ActivePage = "home" | "pokedex" | "team";

export interface TeamMember {
  id: number;
  name: string;
  type: string; 
  role: TeamRole;
  nickname: string; 
  image: string;
}

export interface TeamMemberChanges {
  nickname: string;
  role: TeamRole;
}

export const TYPE_LABEL: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};

export function isSameTeam(a: TeamMember[], b: TeamMember[]): boolean {
  if (a.length !== b.length) return false;

  return a.every(
    (member, i) =>
      member.id === b[i].id &&
      member.role === b[i].role &&
      member.nickname === b[i].nickname,
  );
}


export function withTopicParticle(word: string): string {
  const lastChar = word.charCodeAt(word.length - 1);


  if (lastChar < 0xac00 || lastChar > 0xd7a3) return `${word}는`;

  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  return `${word}${hasBatchim ? "은" : "는"}`;
}