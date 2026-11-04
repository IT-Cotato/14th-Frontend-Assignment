import { pokemonTypes, type Pokemon } from "./pokemons";
import {
    MAX_TEAM_SIZE,
    getNicknameError,
    teamRoles,
    type TeamMember,
    type TeamRole,
} from "./team";

const TEAM_STORAGE_KEY = "pokemate:team";

type StoredTeamMember = {
    pokemon: Pokemon;
    nickname: string;
    role: TeamRole;
};

type LoadTeamResult = {
    team: TeamMember[];
    isRecovered: boolean;
};

function toStoredTeam(team: TeamMember[]): StoredTeamMember[] {
    return team.map((member) => ({
        pokemon: {
            id: member.pokemon.id,
            name: member.pokemon.name,
            types: member.pokemon.types,
            imageUrl: member.pokemon.imageUrl,
        },
        nickname: member.nickname,
        role: member.role,
    }));
}

function isStoredPokemon(value: unknown): value is Pokemon {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const { id, name, types, imageUrl } = value as Record<string, unknown>;
    return (
        Number.isInteger(id) &&
        typeof name === "string" &&
        name !== "" &&
        Array.isArray(types) &&
        types.every((type) => pokemonTypes.includes(type)) &&
        typeof imageUrl === "string"
    );
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
        const { pokemon, nickname, role } = item as Record<string, unknown>;
        const isValid =
            isStoredPokemon(pokemon) &&
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
