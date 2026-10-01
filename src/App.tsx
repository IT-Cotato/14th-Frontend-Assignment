import { useState } from "react";
import HomePage from "./components/HomePage";
import PokedexPage from "./components/PokedexPage";
import MyTeamPage from "./components/MyTeamPage";
import type { MenuKey } from "./components/SiteHeader";
import type { Pokemon } from "./data/pokemons";
import { MAX_TEAM_SIZE, type TeamMember } from "./data/team";

function App() {
    const [currentPage, setCurrentPage] = useState<MenuKey>("pokedex");
    const [team, setTeam] = useState<TeamMember[]>([]);

    function handleAddToTeam(pokemon: Pokemon) {
        setTeam((prevTeam) => {
            if (prevTeam.length >= MAX_TEAM_SIZE) {
                return prevTeam;
            }
            if (prevTeam.some((member) => member.pokemon.id === pokemon.id)) {
                return prevTeam;
            }
            return [...prevTeam, { pokemon, nickname: "", role: "attack" }];
        });
    }

    if (currentPage === "home") {
        return (
            <HomePage
                teamCount={team.length}
                maxTeamSize={MAX_TEAM_SIZE}
                onNavigate={setCurrentPage}
                onAddToTeam={handleAddToTeam}
            />
        );
    }

    if (currentPage === "team") {
        return (
            <MyTeamPage
                team={team}
                maxTeamSize={MAX_TEAM_SIZE}
                onNavigate={setCurrentPage}
            />
        );
    }

    return (
        <PokedexPage
            teamCount={team.length}
            maxTeamSize={MAX_TEAM_SIZE}
            onNavigate={setCurrentPage}
            onAddToTeam={handleAddToTeam}
        />
    );
}

export default App;
