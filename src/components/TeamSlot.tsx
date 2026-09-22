import type { Pokemon, PokemonType } from '../types/pokemon';
import './TeamSlot.css';

interface TeamSlotProps {
  pokemon?: Pokemon;
}

const TYPE_LABELS: Record<PokemonType, string> = {
  NORMAL: '노말',
  FIRE: '불꽃',
  WATER: '물',
  ELECTRIC: '전기',
  GRASS: '풀',
  ICE: '얼음',
  FIGHTING: '격투',
  POISON: '독',
  GROUND: '땅',
  FLYING: '비행',
  PSYCHIC: '에스퍼',
  BUG: '벌레',
  ROCK: '바위',
  GHOST: '고스트',
  DRAGON: '드래곤',
  DARK: '악',
  STEEL: '강철',
  FAIRY: '페어리',
};

function TeamSlot({ pokemon }: TeamSlotProps) {
  if (!pokemon) {
    return (
      <div className="team-slot team-slot--empty">
        <div className="team-slot__text">
          <p className="team-slot__name">빈 슬롯</p>
          <p className="team-slot__sub">포켓몬을 추가해 보세요</p>
        </div>
        <span className="team-slot__handle" aria-hidden="true">
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path d="M1 1h14M1 6h14M1 11h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <div className="team-slot">
      <div className="team-slot__artwork">
        <img src={pokemon.imageUrl} alt={`${pokemon.name} 일러스트`} />
      </div>
      <div className="team-slot__text">
        <p className="team-slot__name" title={pokemon.name}>
          {pokemon.name}
        </p>
        <p className="team-slot__sub">
          {pokemon.types.map((type) => TYPE_LABELS[type]).join(' · ')}
        </p>
      </div>
    </div>
  );
}

export default TeamSlot;
