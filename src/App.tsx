import { useState } from "react";
import Navbar, { type NavKey } from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PokedexPage from "./pages/PokedexPage";
import TeamPage from "./pages/TeamPage";
import { MAX_TEAM_SIZE, type TeamMember } from "./types/pokemon";

const STORAGE_KEY = "pokemon-team";

const loadTeam = (): TeamMember[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

function App() {
  const [page, setPage] = useState<NavKey>("home");
  const [team, setTeam] = useState<TeamMember[]>(loadTeam);

  const saveTeam = () =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team)); // 팀 저장 버튼 클릭 시 동작
  const resetTeam = () => setTeam(loadTeam()); // 취소 버튼 클릭 시 동작

  const addToTeam = (id: string) =>
    setTeam((prev) =>
      prev.length < MAX_TEAM_SIZE && !prev.some((m) => m.id === id)
        ? [...prev, { id }]
        : prev,
    );
  const removeFromTeam = (id: string) =>
    setTeam((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="flex flex-col gap-6 px-20 py-9 bg-neutral-canvas">
      <Navbar activeTab={page} onNavigate={setPage} teamCount={team.length} />
      {page === "home" && (
        <HomePage team={team} addToTeam={addToTeam} onNavigate={setPage} />
      )}
      {page === "dex" && (
        <PokedexPage
          team={team}
          addToTeam={addToTeam}
          removeFromTeam={removeFromTeam}
        />
      )}
      {page === "team" && (
        <TeamPage
          team={team}
          removeFromTeam={removeFromTeam}
          onSave={saveTeam}
          onCancel={resetTeam}
        />
      )}
    </div>
  );
}

export default App;
