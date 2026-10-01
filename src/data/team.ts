import type { Pokemon } from "./pokemons";

export type TeamRole = "attack" | "defense" | "support";

export type TeamMember = {
    pokemon: Pokemon;
    nickname: string;
    role: TeamRole;
};

export type TeamMemberChanges = Pick<TeamMember, "nickname" | "role">;

export const teamRoles: TeamRole[] = ["attack", "defense", "support"];

export const roleLabels: Record<TeamRole, string> = {
    attack: "공격",
    defense: "방어",
    support: "서포트",
};

export const MAX_TEAM_SIZE = 6;

export const NICKNAME_MAX_LENGTH = 10;

export function getDisplayName(member: TeamMember) {
    return member.nickname !== "" ? member.nickname : member.pokemon.name;
}

export function getNicknameError(nickname: string) {
    if (nickname.length > 0 && nickname.trim() === "") {
        return "공백만으로는 별명을 만들 수 없어요.";
    }
    if (nickname.trim().length > NICKNAME_MAX_LENGTH) {
        return `별명은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`;
    }
    return null;
}
