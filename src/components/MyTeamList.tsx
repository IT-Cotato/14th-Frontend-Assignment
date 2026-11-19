import { Link } from 'react-router';
import type { Pokemon } from '../App';
import { toPokemonId } from '../utils/pokemonId';

interface MyTeamGridProps {
  team: Pokemon[];
  onRemove: (number: string) => void;
}

const typeKorMap: { [key: string]: string } = {
  NORMAL: '노말',
  FIGHTING: '격투',
  FLYING: '비행',
  POISON: '독',
  GROUND: '땅',
  ROCK: '바위',
  BUG: '벌레',
  GHOST: '고스트',
  STEEL: '강철',
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
  PSYCHIC: '에스퍼',
  ICE: '얼음',
  DRAGON: '드래곤',
  DARK: '악',
  FAIRY: '페어리',
};

function MyTeamList({
  team,
  onRemove,
}: MyTeamGridProps) {
  const slots = Array.from(
    { length: 6 },
    (_, index) => team[index] || null
  );

  return (
    <section className="my-team-container">
      <div className="slot-grid">
        {slots.map((pokemon, index) => (
          <div key={index} className="slot-card">
            {pokemon ? (
              <div className="slot-content">
                <div className="pokemon-info">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="slot-image"
                  />

                  <div>
                    <h4>
                      {pokemon.nickname || pokemon.name}
                    </h4>

                    <span className="slot-desc">
                      {typeKorMap[pokemon.type] || pokemon.type}
                    </span>

                    <span className="slot-desc"> · </span>

                    <span className="slot-desc">
                      {pokemon.role}
                    </span>
                  </div>
                </div>

                <div className="slot-actions">
                  <Link
                    className="edit-btn"
                    to={`/my-team/${toPokemonId(pokemon.number)}/edit`}
                  >
                    편집
                  </Link>

                  <button
                    className="red-del-shadow-button"
                    onClick={() => onRemove(pokemon.number)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ) : (
              <div className="slot-content empty-slot">
                <div>
                  <h3>빈 슬롯</h3>
                  <p>포켓몬을 추가해 보세요.</p>
                </div>

                <span className="menu-icon">≡</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyTeamList;