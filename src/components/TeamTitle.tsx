import Button from './Button';
import './TeamTitle.css';

interface TeamTitleProps {
  teamCount: number;
  teamLimit: number;
  onSave: () => void;
  onCancel: () => void;
}

function TeamTitle({ teamCount, teamLimit, onSave, onCancel }: TeamTitleProps) {
  return (
    <section className="team-title">
      <div className="team-title__text">
        <h1 className="team-title__heading">나의 팀</h1>
        <p className="team-title__description">
          최대 {teamLimit}마리의 포켓몬으로 나만의 팀을 완성하세요.
        </p>
      </div>

      <span className="team-title__badge">
        {teamCount} / {teamLimit}
      </span>

      <div className="team-title__actions">
        <Button variant="primary" onClick={onSave}>
          팀 저장
        </Button>
        <span className="team-title__cancel">
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
        </span>
      </div>
    </section>
  );
}

export default TeamTitle;