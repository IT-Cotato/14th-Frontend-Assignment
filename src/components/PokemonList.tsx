import searchIcon from '../assets/pokemon/search.svg'
import pikachuImage from '../assets/pokemon/pikachu.png'
import charizardImage from '../assets/pokemon/charizard.png'
import bulbasaurImage from '../assets/pokemon/bulbasaur.png'
import blastoiseImage from '../assets/pokemon/blastoise.png'
import PokemonCard from './PokemonCard.tsx'
import type { PokemonCardProps } from './PokemonCard.tsx'

const sectionTitle = '추천 포켓몬'
const searchPlaceholder = '이름 또는 번호'

const pokemons: PokemonCardProps[] = [
  { number: '#0025', name: '피카츄', type: 'ELECTRIC', image: pikachuImage },
  { number: '#0006', name: '리자몽', type: 'FIRE', image: charizardImage },
  { number: '#0001', name: '이상해씨', type: 'GRASS', image: bulbasaurImage },
  { number: '#0009', name: '거북왕', type: 'WATER', image: blastoiseImage },
]

function PokemonList() {
  return (
    <main className="pokemon-list">
      <div className="search" role="search">
        <div className="search__field">
          <img
            className="search__icon"
            src={searchIcon}
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
          />
          <input
            className="search__input"
            type="search"
            placeholder={searchPlaceholder}
            aria-label="포켓몬 이름 또는 번호로 검색"
          />
        </div>
        <button type="button" className="button button--primary">
          검색
        </button>
      </div>

      <section className="recommend" aria-labelledby="recommend-title">
        <div className="section-header">
          <h2 id="recommend-title" className="section-header__title">
            {sectionTitle}
          </h2>
          <button type="button" className="text-button">
            전체 보기
          </button>
        </div>

        <ul className="card-grid">
          {pokemons.map((pokemon) => (
            <li key={pokemon.number}>
              <PokemonCard
                number={pokemon.number}
                name={pokemon.name}
                type={pokemon.type}
                image={pokemon.image}
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default PokemonList
