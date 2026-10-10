import type { Pokemon } from '../../types/pokemon'
import PokemonSlot from '../PokemonSlot/PokemonSlot'
import './PokedexTeam.css'

type PokedexTeamProps = {
  team: Pokemon[]
  onDelete: (number: number) => void
  onEdit: (number: number) => void
  message: string
}

const typeLabels: Record<string, string> = {
  ELECTRIC: '전기', FIRE: '불꽃', GRASS: '풀', WATER: '물',
}

function PokedexTeam({ team, onDelete, onEdit, message }: PokedexTeamProps) {
  return (
    <aside className="pokedex-team" aria-labelledby="pokedex-team-title">
      <h2 id="pokedex-team-title" className="pokedex-team__title">나의 팀</h2>
      <div className="pokedex-team__list">
        {team.length === 0 ? (
          <p className="pokedex-team__empty">포켓몬을 추가해 보세요.</p>
        ) : team.map((pokemon) => (
          <PokemonSlot
            key={pokemon.number}
            name={pokemon.nickname || pokemon.name}
            onEdit={() => onEdit(pokemon.number)}
            imageSrc={pokemon.imageSrc}
            ability={[
              ...pokemon.types.map((type) => typeLabels[type] ?? type),
              pokemon.role,
            ].filter(Boolean).join(' · ')}
            onDelete={() => onDelete(pokemon.number)}
          />
        ))}
      </div>
      {message && <p role="status" className="pokedex-team__empty">{message}</p>}
    </aside>
  )
}

export default PokedexTeam
