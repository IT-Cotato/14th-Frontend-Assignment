import PokemonCard from './PokemonCard';
import StatePanel from './StatePanel';
import type { Pokemon } from '../types/pokemon';
import './PokemonList.css';

interface PokemonListProps {
  title?: string;
  moreLabel?: string;
  pokemons: readonly Pokemon[];
}

function PokemonList({ title, moreLabel, pokemons }: PokemonListProps) {
  return (
    <section className="pokemon-list">
      {title && (
        <div className="pokemon-list__head">
          <h2 className="pokemon-list__title">{title}</h2>
          {moreLabel && <span className="pokemon-list__more">{moreLabel}</span>}
        </div>
      )}

      {pokemons.length === 0 ? (
        <div className="pokemon-list__empty">
          <StatePanel
            icon="0"
            title="검색 결과가 없어요"
            description="다른 이름이나 번호로 검색해 보세요."
          />
        </div>
      ) : (
        <div className="pokemon-list__grid">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              types={pokemon.types}
              imageUrl={pokemon.imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default PokemonList;