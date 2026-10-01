import { useState } from "react";
import HomePage from "./components/HomePage";
import PokedexPage from "./components/PokedexPage";
import MyTeamPage from "./components/MyTeamPage";
import Toast from "./components/Toast";
import type { MenuKey } from "./components/SiteHeader";
import type { Pokemon } from "./data/pokemons";
import {
    MAX_TEAM_SIZE,
    type TeamMember,
    type TeamMemberChanges,
} from "./data/team";

type ToastMessage = {
    id: number;
    title: string;
    description: string;
};

const TOAST_DURATION = 2500;

function App() {
    const [currentPage, setCurrentPage] = useState<MenuKey>("pokedex");
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const addedPokemonIds = team.map((member) => member.pokemon.id);
    const isTeamFull = team.length >= MAX_TEAM_SIZE;

    function showToast(title: string, description: string) {
        const id = Date.now();
        setToast({ id, title, description });
        setTimeout(() => {
            setToast((current) => (current?.id === id ? null : current));
        }, TOAST_DURATION);
    }

    function handleAddToTeam(pokemon: Pokemon) {
        if (isTeamFull || addedPokemonIds.includes(pokemon.id)) {
            return;
        }

        setTeam((prevTeam) => {
            if (prevTeam.length >= MAX_TEAM_SIZE) {
                return prevTeam;
            }
            if (prevTeam.some((member) => member.pokemon.id === pokemon.id)) {
                return prevTeam;
            }
            return [...prevTeam, { pokemon, nickname: "", role: "attack" }];
        });

        showToast(
            "팀에 추가했어요",
            `${pokemon.name} · ${team.length + 1} / ${MAX_TEAM_SIZE}`,
        );
    }

    function handleRemoveFromTeam(pokemonId: number) {
        setTeam((prevTeam) =>
            prevTeam.filter((member) => member.pokemon.id !== pokemonId),
        );
    }

    function handleUpdateTeamMember(
        pokemonId: number,
        changes: TeamMemberChanges,
    ) {
        setTeam((prevTeam) =>
            prevTeam.map((member) =>
                member.pokemon.id === pokemonId
                    ? { ...member, ...changes }
                    : member,
            ),
        );
    }

    return (
        <>
            {currentPage === "home" && (
                <HomePage
                    teamCount={team.length}
                    maxTeamSize={MAX_TEAM_SIZE}
                    addedPokemonIds={addedPokemonIds}
                    isTeamFull={isTeamFull}
                    onNavigate={setCurrentPage}
                    onAddToTeam={handleAddToTeam}
                />
            )}
            {currentPage === "pokedex" && (
                <PokedexPage
                    teamCount={team.length}
                    maxTeamSize={MAX_TEAM_SIZE}
                    addedPokemonIds={addedPokemonIds}
                    isTeamFull={isTeamFull}
                    onNavigate={setCurrentPage}
                    onAddToTeam={handleAddToTeam}
                />
            )}
            {currentPage === "team" && (
                <MyTeamPage
                    team={team}
                    maxTeamSize={MAX_TEAM_SIZE}
                    onNavigate={setCurrentPage}
                    onRemoveFromTeam={handleRemoveFromTeam}
                    onUpdateTeamMember={handleUpdateTeamMember}
                />
            )}
            {toast !== null && (
                <Toast title={toast.title} description={toast.description} />
            )}
        </>
    );
}

export default App;
