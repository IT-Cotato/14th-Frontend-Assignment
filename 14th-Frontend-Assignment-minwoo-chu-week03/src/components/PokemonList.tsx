import PokemonCard from './PokemonCard'
import NoticeBox from './NoticeBox'
import { pokemonList } from '../data/pokemons' 
interface PokemonListProps {
  teamIds: number[]
  isTeamFull: boolean
  duplicateName: string | null
  onAddToTeam: (id: number) => void
}

function PokemonList({ teamIds, isTeamFull, duplicateName, onAddToTeam }: PokemonListProps) {
  return (
    <section>
      <div className="pokemon-list-header">
        <h2>추천 포켓몬</h2>
        <button type="button" className="btn-text">
          전체 보기
        </button>
      </div>

      {/*  duplicate-add notice, clears itself after a few seconds */}
      {duplicateName && (
        <NoticeBox
          tone="warning"
          title="이미 팀에 있는 포켓몬이에요"
          description={`${duplicateName} · 같은 포켓몬은 한 번만 추가할 수 있어요.`}
        />
      )}

      
      {pokemonList.length === 0 ? (
        <NoticeBox
          title="표시할 포켓몬이 없어요"
          description="다른 이름이나 번호로 검색해 보세요."
        />
      ) : (
        <div className="pokemon-grid">
          {pokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              type={pokemon.type}
              image={pokemon.image}
              isAdded={teamIds.includes(pokemon.id)}
              isTeamFull={isTeamFull}
              onAdd={() => onAddToTeam(pokemon.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default PokemonList
