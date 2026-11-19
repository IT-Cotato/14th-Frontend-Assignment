export const MAX_TEAM_SIZE = 6;

export const TEAM_ROLES = ["공격", "방어", "서포트"] as const;

export type TeamRole = (typeof TEAM_ROLES)[number];

export const DEFAULT_ROLE: TeamRole = "공격";

export type ActivePage = "home" | "pokedex" | "team";

export interface TeamPokemon {
  id: number;
  name: string;
  type: string; 
  role: TeamRole;
  nickname: string; 
  image: string;
  memo?: string;
}

export interface TeamMember extends TeamPokemon {
  teamPokemonId: string;
}

export interface TeamMemberChanges {
  nickname: string;
  role: TeamRole;
  memo: string;
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
      member.teamPokemonId === b[i].teamPokemonId &&
      member.role === b[i].role &&
      member.nickname === b[i].nickname &&
      (member.memo ?? "") === (b[i].memo ?? ""),
  );
}


export function withTopicParticle(word: string): string {
  const lastChar = word.charCodeAt(word.length - 1);


  if (lastChar < 0xac00 || lastChar > 0xd7a3) return `${word}는`;

  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  return `${word}${hasBatchim ? "은" : "는"}`;
}

export const TEAM_STORAGE_KEY = "pokemate-team";

export type SortOrder = "asc" | "desc";

function isTeamPokemon(value: unknown): value is TeamPokemon & { teamPokemonId?: string } {
  if (typeof value !== "object" || value === null) return false;

  const member = value as Record<string, unknown>;

  return (
    typeof member.id === "number" &&
    Number.isSafeInteger(member.id) && member.id > 0 &&
    (member.teamPokemonId === undefined ||
      (typeof member.teamPokemonId === "string" && /^tp_[a-z0-9_-]+$/i.test(member.teamPokemonId))) &&
    typeof member.name === "string" &&
    typeof member.type === "string" &&
    typeof member.nickname === "string" &&
    typeof member.image === "string" &&
    (member.memo === undefined || typeof member.memo === "string") &&
    typeof member.role === "string" &&
    (TEAM_ROLES as readonly string[]).includes(member.role)
  );
}

export function loadSavedTeam(): { team: TeamMember[]; failed: boolean; needsMigration?: boolean } {
  try {
    const raw = localStorage.getItem(TEAM_STORAGE_KEY);
    if (raw === null) return { team: [], failed: false };

    const parsed: unknown = JSON.parse(raw);

    if (
      !Array.isArray(parsed) ||
      parsed.length > MAX_TEAM_SIZE ||
      !parsed.every(isTeamPokemon)
    ) {
      throw new Error("invalid team data");
    }

    const ids = new Set(parsed.flatMap(({ teamPokemonId }) => teamPokemonId ? [teamPokemonId] : []));
    const team = parsed.map((member, index) => {
      if (member.teamPokemonId) return { ...member, teamPokemonId: member.teamPokemonId };
      let number = index + 1;
      let teamPokemonId = `tp_${String(number).padStart(2, "0")}`;
      while (ids.has(teamPokemonId)) {
        number += 1;
        teamPokemonId = `tp_${String(number).padStart(2, "0")}`;
      }
      ids.add(teamPokemonId);
      return { ...member, teamPokemonId, memo: member.memo ?? "" };
    });
    return { team, failed: false, needsMigration: parsed.some((member) => !member.teamPokemonId) };
  } catch {
    return { team: [], failed: true };
  }
}
