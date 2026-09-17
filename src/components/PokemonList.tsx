import blastoiseArtwork from '../assets/blastoise.png'
import bulbasaurArtwork from '../assets/bulbasaur.png'
import charizardArtwork from '../assets/charizard.png'
import pikachuArtwork from '../assets/pikachu.png'
import searchIcon from '../assets/search.svg'
import PokemonCard from './PokemonCard'

const pokemon = [
  {
    number: '0025',
    name: '피카츄',
    type: 'ELECTRIC',
    typeColor: '#eed535',
    artwork: pikachuArtwork,
  },
  {
    number: '0006',
    name: '리자몽',
    type: 'FIRE',
    typeColor: '#fd7d24',
    artwork: charizardArtwork,
  },
  {
    number: '0001',
    name: '이상해씨',
    type: 'GRASS',
    typeColor: '#62b957',
    artwork: bulbasaurArtwork,
  },
  {
    number: '0009',
    name: '거북왕',
    type: 'WATER',
    typeColor: '#4a90da',
    artwork: blastoiseArtwork,
  },
]

function PokemonList() {
  return (
    <section className="pokemon-list" id="pokedex" aria-labelledby="pokemon-list-title">
      <div className="pokemon-search">
        <label className="pokemon-search__field">
          <img src={searchIcon} alt="" aria-hidden="true" />
          <span className="sr-only">포켓몬 이름 또는 번호</span>
          <input type="text" placeholder="이름 또는 번호" />
        </label>
        <button className="pokemon-search__button" type="button">
          검색
        </button>
      </div>

      <div className="pokemon-list__heading">
        <h2 id="pokemon-list-title">추천 포켓몬</h2>
        <span>전체 보기</span>
      </div>

      <div className="pokemon-grid">
        {pokemon.map((item) => (
          <PokemonCard {...item} key={item.number} />
        ))}
      </div>
    </section>
  )
}

export default PokemonList
