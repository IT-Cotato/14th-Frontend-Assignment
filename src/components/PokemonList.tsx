import PokemonCard from './PokemonCard.tsx';
import pikachuImage from '../assets/pikachu.png';
import charizardImage from '../assets/charizard.png';
import bulbasaurImage from '../assets/Bulbasaur.png';
import blastoiseImage from '../assets/Blastoise.png';

const pokemons = [
  {
    number: '#0025',
    name: '피카츄',
    type: 'ELECTRIC',
    role: '스피드',
    image: pikachuImage,
  },
  {
    number: '#0006',
    name: '리자몽',
    type: 'FIRE',
    role: '공격',
    image: charizardImage,
  },
  {
    number: '#0001',
    name: '이상해씨',
    type: 'GRASS',
    role: '서포트',
    image: bulbasaurImage,
  },
  {
    number: '#0009',
    name: '거북왕',
    type: 'WATER',
    role: '방어',
    image: blastoiseImage,
  },
];

interface PokemonListProps {
  onAdd: (pokemon: any) => void;
}

function PokemonList({ onAdd }: PokemonListProps) {
  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.number}
          number={pokemon.number}
          name={pokemon.name}
          type={pokemon.type}
          role={pokemon.role}
          image={pokemon.image}
          onAdd={() => onAdd(pokemon)}
        />
      ))}
    </div>
  );
}

export default PokemonList;