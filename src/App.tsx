import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import PokedexPage from "./components/PokedexPage";
import MyTeamPage from "./components/MyTeamPage";
import Toast, { type Notice } from "./components/Toast";
import {
  MAX_TEAM_SIZE,
  TEAM_STORAGE_KEY,
  isSameTeam,
  loadSavedTeam,
  type ActivePage,
  type TeamMember,
  type TeamMemberChanges,
} from "./components/teamTypes";

function App() {
  const [page, setPage] = useState<ActivePage>("home");
 
  const [initialTeam] = useState(loadSavedTeam);

  const [team, setTeam] = useState<TeamMember[]>(initialTeam.team);

  const [savedTeam, setSavedTeam] = useState<TeamMember[]>(initialTeam.team);
  const [loadError, setLoadError] = useState(initialTeam.failed);
  const [notice, setNotice] = useState<Notice | null>(null);
  
  const [duplicate, setDuplicate] = useState<{ name: string } | null>(null);

  
  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(null), notice.duration);

    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!duplicate) return;

    const timer = setTimeout(() => setDuplicate(null), 3000);

    return () => clearTimeout(timer);
  }, [duplicate]);

  useEffect(() => {
    if (!loadError) return;

    try {
      localStorage.removeItem(TEAM_STORAGE_KEY);
    } catch {
      // 저장소 접근 불가 시에는 빈 팀으로만 시작
    }
  }, [loadError]);

  const hasUnsavedChanges = !isSameTeam(team, savedTeam);

  const handleAddToTeam = (member: TeamMember) => {
    if (team.some((m) => m.id === member.id)) {
      setDuplicate({ name: member.name });
      return;
    }


    if (team.length >= MAX_TEAM_SIZE) return;

   
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      if (prev.some((m) => m.id === member.id)) return prev;

      return [...prev, member];
    });

    setNotice({
      type: "success",
      text: `${member.name}을(를) 팀에 추가했어요.`,
      duration: 2500,
    });
  };

  const handleRemoveFromTeam = (id: number) => {
    setTeam((prev) => prev.filter((member) => member.id !== id));
  };

  const handleUpdateMember = (id: number, changes: TeamMemberChanges) => {
    setTeam((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...changes } : member)),
    );
  };

  const handleSaveTeam = () => {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch {
      setNotice({
        type: "info",
        text: "팀을 저장하지 못했어요.",
        duration: 2500,
      });
      return;
    }

    setSavedTeam(team);
    setNotice({
      type: "success",
      text: "팀을 저장했어요.",
      duration: 2500,
    });
  };

  const handleCancelTeam = () => {
    setTeam(savedTeam);
    setNotice({
      type: "success",
      text: "마지막으로 저장한 팀으로 되돌렸어요.",
      duration: 2500,
    });
  };

  return (
    <div className="pokedex-shell">
      {page === "home" && (
        <HomePage
          team={team}
          duplicateName={duplicate?.name ?? null}
          onNavigate={setPage}
          onAddToTeam={handleAddToTeam}
        />
      )}

      {page === "pokedex" && (
        <PokedexPage
          team={team}
          duplicateName={duplicate?.name ?? null}
          loadError={loadError}
          onNavigate={setPage}
          onAddToTeam={handleAddToTeam}
          onRemove={handleRemoveFromTeam}
          onUpdate={handleUpdateMember}
          onDismissLoadError={() => setLoadError(false)}
        />
      )}

      {page === "team" && (
        <MyTeamPage
          team={team}
          onNavigate={setPage}
          onRemove={handleRemoveFromTeam}
          onUpdate={handleUpdateMember}
          onSave={handleSaveTeam}
          onCancel={handleCancelTeam}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      )}

      <Toast notice={notice} />
    </div>
  );
}

export default App;