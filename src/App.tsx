import { useState } from "react";
import HomePage from "./components/HomePage";
import PokedexPage from "./components/PokedexPage";
import MyTeamPage from "./components/MyTeamPage";
import Toast, { type ToastVariant } from "./components/Toast";
import type { MenuKey } from "./components/SiteHeader";
import type { Pokemon } from "./data/pokemons";
import {
    MAX_TEAM_SIZE,
    type TeamMember,
    type TeamMemberChanges,
} from "./data/team";
import { isSameTeam, loadTeam, saveTeam } from "./data/teamStorage";

type ToastMessage = {
    id: number;
    variant: ToastVariant;
    title: string;
    description: string;
};

const TOAST_DURATION = 2500;

const initialTeamLoad = loadTeam();

function App() {
    const [currentPage, setCurrentPage] = useState<MenuKey>("pokedex");
    const [team, setTeam] = useState<TeamMember[]>(initialTeamLoad.team);
    const [savedTeam, setSavedTeam] = useState<TeamMember[]>(
        initialTeamLoad.team,
    );
    const [isRestoreNoticeOpen, setIsRestoreNoticeOpen] = useState(
        initialTeamLoad.isRecovered,
    );
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const addedPokemonIds = team.map((member) => member.pokemon.id);
    const isTeamFull = team.length >= MAX_TEAM_SIZE;
    const hasUnsavedChanges = !isSameTeam(team, savedTeam);

    function showToast(
        variant: ToastVariant,
        title: string,
        description: string,
    ) {
        const id = Date.now();
        setToast({ id, variant, title, description });
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
            "success",
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

    function handleSaveTeam() {
        if (!saveTeam(team)) {
            showToast(
                "error",
                "팀을 저장하지 못했어요",
                "브라우저 저장 공간을 확인하고 다시 시도해 주세요.",
            );
            return;
        }
        setSavedTeam(team);
        showToast(
            "success",
            "팀을 저장했어요",
            "새로고침해도 지금 팀이 유지돼요.",
        );
    }

    function handleCancelChanges() {
        setTeam(savedTeam);
    }

    return (
        <>
            {currentPage === "home" && (
                <HomePage
                    teamCount={team.length}
                    maxTeamSize={MAX_TEAM_SIZE}
                    addedPokemonIds={addedPokemonIds}
                    isTeamFull={isTeamFull}
                    isRestoreNoticeOpen={isRestoreNoticeOpen}
                    onNavigate={setCurrentPage}
                    onAddToTeam={handleAddToTeam}
                    onDismissRestoreNotice={() => setIsRestoreNoticeOpen(false)}
                />
            )}
            {currentPage === "pokedex" && (
                <PokedexPage
                    team={team}
                    maxTeamSize={MAX_TEAM_SIZE}
                    addedPokemonIds={addedPokemonIds}
                    isTeamFull={isTeamFull}
                    isRestoreNoticeOpen={isRestoreNoticeOpen}
                    onNavigate={setCurrentPage}
                    onAddToTeam={handleAddToTeam}
                    onRemoveFromTeam={handleRemoveFromTeam}
                    onUpdateTeamMember={handleUpdateTeamMember}
                    onDismissRestoreNotice={() => setIsRestoreNoticeOpen(false)}
                />
            )}
            {currentPage === "team" && (
                <MyTeamPage
                    team={team}
                    maxTeamSize={MAX_TEAM_SIZE}
                    hasUnsavedChanges={hasUnsavedChanges}
                    onNavigate={setCurrentPage}
                    onRemoveFromTeam={handleRemoveFromTeam}
                    onUpdateTeamMember={handleUpdateTeamMember}
                    onSaveTeam={handleSaveTeam}
                    onCancelChanges={handleCancelChanges}
                />
            )}
            {toast !== null && (
                <Toast
                    key={toast.id}
                    variant={toast.variant}
                    title={toast.title}
                    description={toast.description}
                />
            )}
        </>
    );
}

export default App;
