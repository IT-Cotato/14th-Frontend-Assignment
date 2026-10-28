import { pokemons } from "./pokemons";
import {
    MAX_TEAM_SIZE,
    getNicknameError,
    teamRoles,
    type TeamMember,
    type TeamRole,
} from "./team";

const TEAM_STORAGE_KEY = "pokemate:team";

type StoredTeamMember = {
    pokemonId: number;
    nickname: string;
    role: TeamRole;
};

type LoadTeamResult = {
    team: TeamMember[];
    isRecovered: boolean;
};

function toStoredTeam(team: TeamMember[]): StoredTeamMember[] {
    return team.map((member) => ({
        pokemonId: member.pokemon.id,
        nickname: member.nickname,
        role: member.role,
    }));
}

function parseTeam(raw: string): TeamMember[] | null {
    let data: unknown;
    try {
        data = JSON.parse(raw);
    } catch {
        return null;
    }

    if (!Array.isArray(data) || data.length > MAX_TEAM_SIZE) {
        return null;
    }

    const team: TeamMember[] = [];
    for (const item of data) {
        if (typeof item !== "object" || item === null) {
            return null;
        }
        const { pokemonId, nickname, role } = item as Record<string, unknown>;
        const pokemon = pokemons.find((p) => p.id === pokemonId);
        const isValid =
            pokemon !== undefined &&
            typeof nickname === "string" &&
            getNicknameError(nickname) === null &&
            teamRoles.includes(role as TeamRole) &&
            !team.some((member) => member.pokemon.id === pokemon.id);
        if (!isValid) {
            return null;
        }
        team.push({ pokemon, nickname, role: role as TeamRole });
    }
    return team;
}

export function saveTeam(team: TeamMember[]) {
    try {
        localStorage.setItem(
            TEAM_STORAGE_KEY,
            JSON.stringify(toStoredTeam(team)),
        );
        return true;
    } catch {
        return false;
    }
}

export function loadTeam(): LoadTeamResult {
    let raw: string | null;
    try {
        raw = localStorage.getItem(TEAM_STORAGE_KEY);
    } catch {
        return { team: [], isRecovered: false };
    }

    if (raw === null) {
        return { team: [], isRecovered: false };
    }

    const team = parseTeam(raw);
    if (team === null) {
        saveTeam([]);
        return { team: [], isRecovered: true };
    }
    return { team, isRecovered: false };
}

export function isSameTeam(a: TeamMember[], b: TeamMember[]) {
    return JSON.stringify(toStoredTeam(a)) === JSON.stringify(toStoredTeam(b));
}
