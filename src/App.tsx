import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import PokedexPage from "./components/PokedexPage";
import MyTeamPage from "./components/MyTeamPage";
import PokemonDetailPage from "./components/PokemonDetailPage";
import TeamEditPage from "./components/TeamEditPage";
import PokemonHeader from "./components/PokemonHeader";
import StatePanel from "./components/StatePanel";
import "./Routes.css";
import Toast, { type Notice } from "./components/Toast";
import {
  MAX_TEAM_SIZE,
  TEAM_STORAGE_KEY,
  isSameTeam,
  loadSavedTeam,
  type TeamMember,
  type TeamMemberChanges,
  type TeamPokemon,
} from "./components/teamTypes";

function App() {
 
  const [initialTeam] = useState(loadSavedTeam);

  const [team, setTeam] = useState<TeamMember[]>(initialTeam.team);

  const [savedTeam, setSavedTeam] = useState<TeamMember[]>(initialTeam.team);
  const [loadError, setLoadError] = useState(initialTeam.failed);
  const [notice, setNotice] = useState<Notice | null>(null);
  
  const [duplicate, setDuplicate] = useState<{ name: string } | null>(null);

  useEffect(() => {
    if (!initialTeam.needsMigration) return;
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(initialTeam.team));
    } catch {
      // 저장소 쓰기에 실패해도 변환한 팀으로 계속 사용한다.
    }
  }, [initialTeam]);
  
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

  const handleAddToTeam = (member: TeamPokemon) => {
    if (team.some((m) => m.id === member.id)) {
      setDuplicate({ name: member.name });
      return;
    }


    if (team.length >= MAX_TEAM_SIZE) return;

   
    const teamPokemonId = `tp_${crypto.randomUUID()}`;
    setTeam((prev) => {
      if (prev.length >= MAX_TEAM_SIZE) return prev;
      if (prev.some((m) => m.id === member.id)) return prev;

      return [...prev, { ...member, teamPokemonId, memo: "" }];
    });

    setNotice({
      type: "success",
      text: `${member.name}을(를) 팀에 추가했어요.`,
      duration: 2500,
    });
  };

  const handleRemoveFromTeam = (id: string) => {
    setTeam((prev) => prev.filter((member) => member.teamPokemonId !== id));
  };

  const persistTeam = (nextTeam: TeamMember[]) => {
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(nextTeam));
    setTeam(nextTeam);
    setSavedTeam(nextTeam);
    setNotice({
      type: "success",
      text: "팀을 저장했어요.",
      duration: 2500,
    });
  };

  const handleSaveTeam = () => {
    try {
      persistTeam(team);
    } catch {
      setNotice({
        type: "info",
        text: "팀을 저장하지 못했어요.",
        duration: 2500,
      });
    }
  };

  const handleSaveMember = (id: string, changes: TeamMemberChanges) => {
    persistTeam(team.map((member) =>
      member.teamPokemonId === id ? { ...member, ...changes } : member,
    ));
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
      <Routes>
        <Route path="/" element={
          <HomePage
            team={team}
            duplicateName={duplicate?.name ?? null}
            onAddToTeam={handleAddToTeam}
          />
        } />
        <Route path="/pokemon" element={
          <PokedexPage
            team={team}
            duplicateName={duplicate?.name ?? null}
            loadError={loadError}
            onAddToTeam={handleAddToTeam}
            onDismissLoadError={() => setLoadError(false)}
          />
        } />
        <Route path="/pokemon/:pokemonId" element={
          <PokemonDetailPage
            team={team}
            duplicateName={duplicate?.name ?? null}
            onAddToTeam={handleAddToTeam}
          />
        } />
        <Route path="/my-team" element={
          <MyTeamPage
            team={team}
            onRemove={handleRemoveFromTeam}
            onSave={handleSaveTeam}
            onCancel={handleCancelTeam}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        } />
        <Route path="/my-team/:teamPokemonId/edit" element={
          <TeamEditPage team={team} onSave={handleSaveMember} />
        } />
        <Route path="*" element={
          <>
            <PokemonHeader teamCount={team.length} />
            <main className="route-page route-error-page">
              <StatePanel
                variant="error"
                symbol="!"
                title="페이지를 찾을 수 없어요"
                description="주소를 확인하거나 홈으로 돌아가 주세요."
              />
              <Link className="team-btn team-btn--secondary" to="/">홈으로</Link>
            </main>
          </>
        } />
      </Routes>

      <Toast notice={notice} />
    </div>
  );
}

export default App;
