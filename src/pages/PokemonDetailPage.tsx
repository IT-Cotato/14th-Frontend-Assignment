import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchPokemonDetails } from '../api/pokemonDetails'
import Badge from '../components/Badge/Badge'
import Button from '../components/Button/Button'
import TypeChip from '../components/TypeChip/TypeChip'
import StatePanel from '../components/StatePanel/StatePanel'
import type { Pokemon } from '../types/pokemon'
import './PokemonDetailPage.css'

export default function PokemonDetailPage({ onAdd }: { onAdd: (pokemon: Pokemon) => void }) {
  const { pokemonId = '' } = useParams()
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['pokemon', 'detail', 'full', pokemonId],
    queryFn: ({ signal }) => fetchPokemonDetails(pokemonId, signal),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
  const number = data?.number ?? (/^\d+$/.test(pokemonId) ? Number(pokemonId) : null)
  const numberLabel = number === null ? '…' : '#' + String(number).padStart(4, '0')

  return <section className="route-page pokemon-detail-page">
    <nav className="pokemon-detail-breadcrumb" aria-label="현재 위치">
      <Link to="/pokemon">도감</Link>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">{numberLabel}</span>
    </nav>
    <div className="pokedex-card-area">
      {isPending ? <StatePanel variant="loading" /> : isError ? <StatePanel variant="error" onRetry={() => void refetch()} /> : data ? (
        <article className="pokemon-detail-panel" aria-labelledby="pokemon-detail-name">
          <div className="pokemon-detail-panel__art">
            <div className="pokemon-detail-panel__image-frame">
              <img src={data.imageSrc} alt={data.name} />
            </div>
          </div>
          <div className="pokemon-detail-panel__info">
            <Badge variant="number">{numberLabel}</Badge>
            <h1 id="pokemon-detail-name">{data.name}</h1>
            <p className="pokemon-detail-panel__description">{data.description}</p>
            <div className="pokemon-detail-panel__types">
              {data.types.map((type) => <TypeChip key={type} type={type} />)}
            </div>
            <dl className="pokemon-detail-panel__facts">
              <div><dt>키</dt><dd>{data.heightMeters.toFixed(1)} m</dd></div>
              <div><dt>몸무게</dt><dd>{data.weightKg.toFixed(1)} kg</dd></div>
              <div><dt>특성</dt><dd>{data.ability}</dd></div>
            </dl>
            <div className="pokemon-detail-panel__stats" aria-label="기본 능력치">
              {data.stats.map((stat) => (
                <div className="pokemon-detail-panel__stat" key={stat.name}>
                  <span>{stat.name}</span>
                  <meter min={0} max={255} value={stat.value} aria-label={`${stat.name} ${stat.value}`} title={`${stat.name}: ${stat.value}`} />
                </div>
              ))}
            </div>
            <Button onClick={() => onAdd(data)}>내 팀에 추가</Button>
          </div>
        </article>
      ) : <StatePanel variant="empty" title="포켓몬 데이터가 없어요" description="해당 번호나 이름의 포켓몬을 찾을 수 없어요. 도감에서 다시 찾아보세요." />}
    </div>
  </section>
}
