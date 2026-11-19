import { Link, useLocation } from 'react-router';
import { toPokemonId } from '../utils/pokemonId';

interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  types?: string[];
  role: string
  image: string;
  onAdd: () => void;
}

function PokemonCard({
  number,
  name,
  type,
  types = [type],
  // role,
  image,
  onAdd,
}: PokemonCardProps) {
  // 상세에서 돌아올 때 보던 검색어·페이지를 유지하려고 현재 쿼리를 넘깁니다.
  const { search } = useLocation();

  return (
    <div className="pokemon-card">
      <Link
        className="pokemon-image"
        to={`/pokemon/${toPokemonId(number)}`}
        state={{ listSearch: search }}
        aria-label={`${name} 상세 보기`}
      >
        <img src={image} alt={name} />
      </Link>

      <span className="pokemon-number">{number}</span>
      <h2>{name}</h2>
      <div className="pokemon-types">
        {types.map((pokemonType) => (
          <span
            className={`type ${pokemonType.toLowerCase()}`}
            key={pokemonType}
          >
            {pokemonType}
          </span>
        ))}
      </div>

      <button className="red-shadow-button" onClick={onAdd}>팀에 추가</button>
    </div>
  );
}

export default PokemonCard;
