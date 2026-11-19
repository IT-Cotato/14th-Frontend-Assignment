import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { searchPokemon } from '../api/pokemon'
import PokemonCard from '../components/PokemonCard/PokemonCard'
import StatePanel from '../components/StatePanel/StatePanel'
import type { Pokemon } from '../types/pokemon'

export default function PokemonDetailPage({ onAdd }: { onAdd: (pokemon: Pokemon) => void }) {
  const { pokemonId = '' } = useParams()
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['pokemon', 'detail', pokemonId],
    queryFn: ({ signal }) => searchPokemon(pokemonId, signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
  return <section className="route-page">
    <h1>포켓몬 상세</h1>
    <Link to="/pokemon">도감으로</Link>
    <div className="pokedex-card-area">
      {isPending ? <StatePanel variant="loading" /> : isError ? <StatePanel variant="error" onRetry={() => void refetch()} /> : data ? <PokemonCard {...data} onAdd={() => onAdd(data)} /> : <StatePanel variant="empty" />}
    </div>
  </section>
}
