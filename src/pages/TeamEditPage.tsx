import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Button from '../components/Button';
import StatePanel from '../components/StatePanel';
import { TEAM_ROLES } from '../data/team';
import type { TeamMember, TeamMemberEdit } from '../types/pokemon';
import '../components/EditDialog.css';

interface TeamEditPageProps {
  team: readonly TeamMember[];
  onSave: (teamPokemonId: string, values: TeamMemberEdit) => Promise<boolean>;
}

function TeamEditPage({ team, onSave }: TeamEditPageProps) {
  const { teamPokemonId = '' } = useParams();
  const member = team.find((item) => item.teamPokemonId === teamPokemonId);

  if (!member) {
    return (
      <StatePanel
        tone="error"
        icon="!"
        title="팀 항목을 찾을 수 없어요"
        description="삭제되었거나 없는 항목이에요. 내 팀으로 돌아가세요."
        action={{ label: '내 팀으로', to: '/my-team' }}
      />
    );
  }

  return <TeamEditForm key={member.teamPokemonId} member={member} onSave={onSave} />;
}

interface TeamEditFormProps {
  member: TeamMember;
  onSave: TeamEditPageProps['onSave'];
}

type SaveStatus = 'idle' | 'saving' | 'failed';

function TeamEditForm({ member, onSave }: TeamEditFormProps) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(member.nickname);
  const [role, setRole] = useState(member.role);
  const [memo, setMemo] = useState(member.memo);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const isBlankOnly = nickname.length > 0 && nickname.trim().length === 0;
  const values: TeamMemberEdit = { nickname: nickname.trim(), role, memo: memo.trim() };
  const isChanged =
    values.nickname !== member.nickname || values.role !== member.role || values.memo !== member.memo;
  const isSaving = saveStatus === 'saving';

  let saveLabel = '저장';
  if (isSaving) saveLabel = '저장 중';
  else if (saveStatus === 'failed') saveLabel = '다시 시도';

  async function handleSave() {
    setSaveStatus('saving');
    const saved = await onSave(member.teamPokemonId, values);
    if (saved) navigate('/my-team');
    else setSaveStatus('failed');
  }

  return (
    <section className="edit-panel" aria-labelledby="team-edit-title">
      <h1 id="team-edit-title" className="edit-panel__title">
        {member.pokemon.name} 편집
      </h1>
      <p className="edit-dialog__slot">/my-team/{member.teamPokemonId}/edit · 고유 팀 항목</p>

      <label className="edit-dialog__label" htmlFor="team-edit-nickname">
        별명 (선택)
      </label>
      <input
        id="team-edit-nickname"
        className={`edit-dialog__input${isBlankOnly ? ' edit-dialog__input--invalid' : ''}`}
        type="text"
        value={nickname}
        aria-invalid={isBlankOnly}
        aria-describedby={isBlankOnly ? 'team-edit-nickname-error' : undefined}
        onChange={(event) => setNickname(event.target.value)}
      />
      {isBlankOnly && (
        <p id="team-edit-nickname-error" className="edit-dialog__error">
          공백만으로는 별명을 만들 수 없어요.
        </p>
      )}

      <p className="edit-dialog__label edit-dialog__label--role">역할</p>
      <div className="edit-dialog__roles">
        {TEAM_ROLES.map((item) => (
          <button
            key={item}
            type="button"
            className={`edit-dialog__role${item === role ? ' edit-dialog__role--active' : ''}`}
            aria-pressed={item === role}
            onClick={() => setRole(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="edit-dialog__label edit-dialog__label--memo" htmlFor="team-edit-memo">
        메모
      </label>
      <input
        id="team-edit-memo"
        className="edit-dialog__input"
        type="text"
        value={memo}
        onChange={(event) => setMemo(event.target.value)}
      />

      {saveStatus === 'failed' && (
        <p className="edit-dialog__error" role="alert">
          저장하지 못했어요. 다시 시도해 주세요.
        </p>
      )}

      <div className="edit-panel__actions">
        <Button variant="secondary" to="/my-team" disabled={isSaving}>
          취소
        </Button>
        <Button
          variant="primary"
          disabled={isBlankOnly || !isChanged || isSaving}
          onClick={() => void handleSave()}
        >
          {saveLabel}
        </Button>
      </div>
    </section>
  );
}

export default TeamEditPage;