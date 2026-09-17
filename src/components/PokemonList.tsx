import PokemonCard from './PokemonCard'
import pikachu from '../assets/pikachu.png'
import charizard from '../assets/charizard.png'
import bulbasaur from '../assets/bulbasaur.png'
import blastoise from '../assets/blastoise.png'

const pokemonList = [
  { id: 25, name: '피카츄', type: 'electric', image: pikachu },
  { id: 6, name: '리자몽', type: 'fire', image: charizard },
  { id: 1, name: '이상해씨', type: 'grass', image: bulbasaur },
  { id: 9, name: '거북왕', type: 'water', image: blastoise },
]

function PokemonList() {
  return (
    <section>
      <div className="pokemon-list-header">
        <h2>추천 포켓몬</h2>
        <button type="button" className="btn-text">
          전체 보기
        </button>
      </div>

      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            type={pokemon.type}
            image={pokemon.image}
          />
        ))}
      </div>
    </section>
  )
}

export default PokemonList