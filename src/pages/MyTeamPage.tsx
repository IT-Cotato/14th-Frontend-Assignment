import type { Pokemon } from '../App';
import MyTeamList from '../components/MyTeamList';

interface MyTeamPageProps {
  team: Pokemon[];
  onRemove: (number: string) => void;
}

function MyTeamPage({ team, onRemove }: MyTeamPageProps) {
  return (
    <section className="page-section">
      <div className="popup_content page-heading">
        <h1>내 팀</h1>
        <p>최대 6마리까지 팀을 꾸릴 수 있어요.</p>
      </div>

      <div className="teamlist team-page-list">
        <MyTeamList team={team} onRemove={onRemove} />
      </div>
    </section>
  );
}

export default MyTeamPage;
