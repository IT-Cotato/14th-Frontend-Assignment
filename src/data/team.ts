import type { Pokemon } from "./pokemons";

export type TeamRole = "attack" | "defense" | "support";

export type TeamMember = {
    pokemon: Pokemon;
    nickname: string;
    role: TeamRole;
};

export const roleLabels: Record<TeamRole, string> = {
    attack: "공격",
    defense: "방어",
    support: "서포트",
};

export const MAX_TEAM_SIZE = 6;

export function getDisplayName(member: TeamMember) {
    return member.nickname !== "" ? member.nickname : member.pokemon.name;
}
