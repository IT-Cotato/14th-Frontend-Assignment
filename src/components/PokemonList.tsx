import PokemonCard from './PokemonCard';
import type { Pokemon } from '../types/pokemon';
import './PokemonList.css';

interface PokemonListProps {
  title: string;
  moreLabel: string;
  pokemons: Pokemon[];
}

function PokemonList({ title, moreLabel, pokemons }: PokemonListProps) {
  return (
    <section className="pokemon-list">
      <div className="pokemon-list__head">
        <h2 className="pokemon-list__title">{title}</h2>
        <span className="pokemon-list__more">{moreLabel}</span>
      </div>

      <div className="pokemon-list__grid">
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            type={pokemon.type}
            imageUrl={pokemon.imageUrl}
          />
        ))}
      </div>
    </section>
  );
}

export default PokemonList;
