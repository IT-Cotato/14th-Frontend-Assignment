import PokemonCard from './PokemonCard.tsx'
import pikachuImage from '../assets/pikachu.png'
import charizardImage from '../assets/charizard.png'
import bulbasaurImage from '../assets/Bulbasaur.png'
import blastoiseImage from '../assets/Blastoise.png'

const pokemons = [
  {
    number: '#0025',
    name: '피카츄',
    type: 'ELECTRIC',
    image: pikachuImage,
  },
  {
    number: '#0006',
    name: '리자몽',
    type: 'FIRE',
    image: charizardImage,
  },
  {
    number: '#0001',
    name: '이상해씨',
    type: 'GRASS',
    image: bulbasaurImage,
  },
  {
    number: '#0009',
    name: '거북왕',
    type: 'WATER',
    image: blastoiseImage,
  },
]

function PokemonList() {
  return (
    <div className="pokemon-list">
      {pokemons.length === 0 ? (
        /* 👇 이미지 시안에 딱 맞는 빈 결과 UI */
        <div className="empty-result-card">
          <div className="empty-icon">0</div>
          <h3 className="empty-title">검색 결과가 없어요</h3>
          <p className="empty-description">다른 이름이나 번호로 검색해 보세요.</p>
        </div>
      ) : (
        pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.number}
            number={pokemon.number}
            name={pokemon.name}
            type={pokemon.type}
            image={pokemon.image}
          />
        ))
      )}
    </div>
  );
}
export default PokemonList