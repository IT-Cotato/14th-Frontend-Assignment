import PokemonCard from "./PokemonCard";
import StatePanel from "./StatePanel";
import type { TeamMember } from "./teamTypes";

export type PokemonItem = {
  id: number;
  image: string;
  number: string;
  name: string;
  type: string;
};

export const defaultPokemons: PokemonItem[] = [
  {
    id: 25,
    image: "/Pikachu.svg",
    number: "#0025",
    name: "피카츄",
    type: "ELECTRIC",
  },
  {
    id: 6,
    image: "/charizard.svg",
    number: "#0006",
    name: "리자몽",
    type: "FIRE",
  },
  {
    id: 1,
    image: "/bulbasaur.svg",
    number: "#0001",
    name: "이상해씨",
    type: "GRASS",
  },
  {
    id: 9,
    image: "/blastoise.svg",
    number: "#0009",
    name: "거북왕",
    type: "WATER",
  },

  {
    id: 94,
    image: "/Gengar.svg",
    number: "#0094",
    name: "팬텀",
    type: "GHOST",
  },

  {
    id: 54,
    image: "/Psyduck.svg",
    number: "#0054",
    name: "고라파덕",
    type: "WATER",
  },

  {
    id: 149,
    image: "/Dragonite.svg",
    number: "#0149",
    name: "망나뇽",
    type: "DRAGON",
  },

  {
    id: 133,
    image: "/Eevee.svg",
    number: "#0133",
    name: "이브이",
    type: "NORMAL",
  },
];

type PokemonListProps = {
  pokemons?: PokemonItem[];
  team: TeamMember[];
  onAddToTeam: (member: TeamMember) => void;
  limit?: number;
};

function PokemonList({
  pokemons = defaultPokemons,
  team,
  onAddToTeam,
  limit,
}: PokemonListProps) {
  if (pokemons.length === 0) {
    return <StatePanel />;
  }

  const visiblePokemons = limit ? pokemons.slice(0, limit) : pokemons;

  return (
    <div className="pokemon-grid">
      {visiblePokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          {...pokemon}
          team={team}
          onAddToTeam={onAddToTeam}
        />
      ))}
    </div>
  );
}

export default PokemonList;