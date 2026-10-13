import PokemonCard from './PokemonCard';
import StatePanel from './StatePanel';
import { withTopicParticle } from '../utils/josa';
import type { Pokemon } from '../types/pokemon';
import './PokemonList.css';

interface PokemonListProps {
  title?: string;
  moreLabel?: string;
  pokemons: readonly Pokemon[];
  teamIds: readonly number[];
  teamLimit: number;
  duplicateName?: string | null;
  onAdd: (pokemon: Pokemon) => void;
  onMoreClick?: () => void;
  onReset?: () => void;
}

function PokemonList({
  title,
  moreLabel,
  pokemons,
  teamIds,
  teamLimit,
  duplicateName = null,
  onAdd,
  onMoreClick,
  onReset,
}: PokemonListProps) {
  const isTeamFull = teamIds.length >= teamLimit;

  return (
    <section className="pokemon-list">
      {title && (
        <div className="pokemon-list__head">
          <h2 className="pokemon-list__title">{title}</h2>
          {moreLabel && (
            <button type="button" className="pokemon-list__more" onClick={onMoreClick}>
              {moreLabel}
            </button>
          )}
        </div>
      )}

      {duplicateName && (
        <div className="pokemon-list__notice">
          <StatePanel
            icon="!"
            title="이미 팀에 있는 포켓몬이에요"
            description={`${withTopicParticle(duplicateName)} 이미 내 팀에 있어요. 같은 포켓몬은 한 번만 추가할 수 있어요.`}
          />
        </div>
      )}

      {isTeamFull && (
        <div className="pokemon-list__notice">
          <StatePanel
            icon={String(teamLimit)}
            title="팀이 가득 찼어요"
            description={`팀은 최대 ${teamLimit}마리까지 만들 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.`}
          />
        </div>
      )}

      {pokemons.length === 0 ? (
        <div className="pokemon-list__empty">
          <StatePanel
            icon="0"
            title="검색 결과가 없어요"
            description="다른 이름이나 번호로 검색해 보세요."
            action={onReset && { label: '조건 초기화', onClick: onReset }}
          />
        </div>
      ) : (
        <div className="pokemon-list__grid">
          {pokemons.map((pokemon) => {
            const addStatus = teamIds.includes(pokemon.id)
              ? 'added'
              : isTeamFull
                ? 'full'
                : 'available';

            return (
              <PokemonCard
                key={pokemon.id}
                id={pokemon.id}
                name={pokemon.name}
                types={pokemon.types}
                imageUrl={pokemon.imageUrl}
                addStatus={addStatus}
                onAdd={() => onAdd(pokemon)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default PokemonList;