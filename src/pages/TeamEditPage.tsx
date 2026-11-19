import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import type { Pokemon } from '../App';
import { toPokemonId } from '../utils/pokemonId';

interface TeamEditPageProps {
  team: Pokemon[];
  onEdit: (number: string, nickname: string, role: string) => void;
}

function TeamEditPage({ team, onEdit }: TeamEditPageProps) {
  // /my-team/:teamPokemonId/edit 의 teamPokemonId (예: "6")
  const { teamPokemonId = '' } = useParams();
  const pokemon = team.find(
    (member) => toPokemonId(member.number) === teamPokemonId
  );

  if (!pokemon) {
    return (
      <section className="empty-result-card">
        <div className="empty-icon">?</div>
        <h2 className="empty-title">팀에 없는 포켓몬이에요</h2>
        <p className="empty-description">
          내 팀에서 편집할 포켓몬을 다시 골라 주세요.
        </p>
        <Link className="red-shadow-button empty-action" to="/my-team">
          내 팀으로 돌아가기
        </Link>
      </section>
    );
  }

  // key로 포켓몬이 바뀌면 입력값을 새로 채웁니다.
  return <TeamEditForm key={pokemon.number} pokemon={pokemon} onEdit={onEdit} />;
}

interface TeamEditFormProps {
  pokemon: Pokemon;
  onEdit: TeamEditPageProps['onEdit'];
}

function TeamEditForm({ pokemon, onEdit }: TeamEditFormProps) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(pokemon.nickname || pokemon.name);
  const [role, setRole] = useState(pokemon.role);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEdit(pokemon.number, nickname.trim() || pokemon.name, role.trim());
    // 저장이 끝나면 코드에서 이동을 결정하므로 useNavigate를 사용합니다.
    navigate('/my-team');
  };

  return (
    <section className="page-section">
      <nav className="breadcrumb" aria-label="현재 위치">
        <Link to="/my-team">내 팀</Link>
        <span> / </span>
        <span>{pokemon.number} 편집</span>
      </nav>

      <form className="team-edit-form" onSubmit={handleSubmit}>
        <div className="pokemon-info">
          <img src={pokemon.image} alt={pokemon.name} className="slot-image" />
          <div>
            <h2>{pokemon.nickname || pokemon.name}</h2>
            <span className="slot-desc">{pokemon.number}</span>
          </div>
        </div>

        <label>
          별명
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별명"
          />
        </label>

        <label>
          역할
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="역할"
          />
        </label>

        <div className="slot-actions">
          <button className="red-shadow-button" type="submit">
            저장
          </button>
          <Link className="white-button" to="/my-team">
            취소
          </Link>
        </div>
      </form>
    </section>
  );
}

export default TeamEditPage;
