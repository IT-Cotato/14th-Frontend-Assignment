import { useRef, useState, useTransition, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PokemonHeader from "./PokemonHeader";
import StatePanel from "./StatePanel";
import {
  TEAM_ROLES,
  type TeamMember,
  type TeamMemberChanges,
  type TeamRole,
} from "./teamTypes";

const NICKNAME_MAX_LENGTH = 10;
const MEMO_MAX_LENGTH = 200;

type TeamEditPageProps = {
  team: TeamMember[];
  onSave: (id: string, changes: TeamMemberChanges) => void;
};

type TeamEditFormProps = {
  member: TeamMember;
  onSave: (changes: TeamMemberChanges) => void;
};

function TeamEditForm({ member, onSave }: TeamEditFormProps) {
  const [nickname, setNickname] = useState(member.nickname);
  const [role, setRole] = useState<TeamRole>(member.role);
  const [memo, setMemo] = useState(member.memo ?? "");
  const [saveFailed, setSaveFailed] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const saveInProgress = useRef(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isBlankOnly = nickname.length > 0 && nickname.trim() === "";
  const hasChanges = nickname.trim() !== member.nickname ||
    role !== member.role || memo.trim() !== (member.memo ?? "");

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBlankOnly || !hasChanges || saveInProgress.current) return;

    saveInProgress.current = true;
    setSaveFailed(false);
    startSaving(() => {
      try {
        onSave({ nickname: nickname.trim(), role, memo: memo.trim() });
      } catch {
        saveInProgress.current = false;
        setSaveFailed(true);
        return;
      }
      void navigate("/my-team", { replace: true });
    });
  };

  return (
    <form className="team-edit" onSubmit={handleSave} aria-busy={isSaving}>
      <h1 className="dialog__title">
        {member.name} 편집
      </h1>
      <p className="dialog__desc">
        {pathname} · 고유 팀 항목
      </p>

      <label className="field">
        <span className="field__label">별명 (선택)</span>
        <input
          className={`field__input${isBlankOnly ? " field__input--error" : ""}`}
          value={nickname}
          maxLength={NICKNAME_MAX_LENGTH}
          placeholder="예: 번개"
          aria-invalid={isBlankOnly}
          aria-describedby={isBlankOnly ? "nickname-error" : undefined}
          onChange={(e) => setNickname(e.target.value)}
          disabled={isSaving}
        />
        {isBlankOnly && (
          <span id="nickname-error" className="field__error" role="alert">
            공백만 입력할 수 없어요. 별명을 입력하거나 비워 주세요.
          </span>
        )}
      </label>

      <div className="field">
        <span className="field__label">역할</span>
        <div className="role-group" role="group" aria-label="역할">
          {TEAM_ROLES.map((item) => (
            <button
              key={item}
              type="button"
              className={`role-pill${role === item ? " role-pill--active" : ""}`}
              aria-pressed={role === item}
              disabled={isSaving}
              onClick={() => setRole(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field__label">메모</span>
        <input
          className="field__input"
          value={memo}
          maxLength={MEMO_MAX_LENGTH}
          disabled={isSaving}
          onChange={(event) => setMemo(event.target.value)}
        />
      </label>

      {saveFailed && (
        <p className="field__error" role="alert">
          저장하지 못했어요. 입력한 내용을 유지했으니 다시 시도해 주세요.
        </p>
      )}

      <div className="dialog__actions">
        <Link className="team-btn team-btn--secondary" to="/my-team">
          취소
        </Link>
        <button
          type="submit"
          className="team-btn team-btn--primary"
          disabled={isBlankOnly || !hasChanges || isSaving}
        >
          {isSaving ? "저장 중…" : saveFailed ? "다시 시도" : "저장"}
        </button>
      </div>
    </form>
  );
}

function TeamEditPage({ team, onSave }: TeamEditPageProps) {
  const { teamPokemonId } = useParams();
  const member = team.find((item) => item.teamPokemonId === teamPokemonId);

  return (
    <>
      <PokemonHeader activePage="team" teamCount={team.length} />
      <main className="route-page">
        {member ? (
          <TeamEditForm
            key={member.teamPokemonId}
            member={member}
            onSave={(changes) => onSave(member.teamPokemonId, changes)}
          />
        ) : (
          <>
            <StatePanel
              variant="error"
              symbol="!"
              title="팀 항목을 찾을 수 없어요"
              description="내 팀으로 돌아가 편집할 포켓몬을 선택해 주세요."
            />
            <Link className="team-btn team-btn--secondary" to="/my-team">내 팀으로</Link>
          </>
        )}
      </main>
    </>
  );
}

export default TeamEditPage;
