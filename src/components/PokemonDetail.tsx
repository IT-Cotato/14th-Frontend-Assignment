import Button from './Button';
import TypeChip from './TypeChip';
import type { AddStatus } from './PokemonCard';
import { formatPokemonNumber } from '../utils/formatNumber';
import type { PokemonDetail as PokemonDetailData } from '../types/pokemon';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: PokemonDetailData;
  addStatus: AddStatus;
  onAdd: () => void;
}

const STAT_MAX = 120;

const ADD_LABELS: Record<AddStatus, string> = {
  available: '내 팀에 추가',
  added: '추가됨',
  full: '팀이 가득 찼어요',
};

function PokemonDetail({ pokemon, addStatus, onAdd }: PokemonDetailProps) {
  const { id, name, types, imageUrl, height, weight, ability, description, stats } = pokemon;

  const infoItems = [
    { label: '키', value: `${height} m` },
    { label: '몸무게', value: `${weight} kg` },
    { label: '특성', value: ability },
  ];

  return (
    <article className="pokemon-detail">
      <div className="pokemon-detail__visual">
        <div className="pokemon-detail__artwork">
          <img src={imageUrl} alt={`${name} 일러스트`} />
        </div>
      </div>

      <div className="pokemon-detail__body">
        <span className="pokemon-detail__number">{formatPokemonNumber(id)}</span>
        <h1 className="pokemon-detail__name">{name}</h1>
        <p className="pokemon-detail__description">{description}</p>

        <div className="pokemon-detail__types">
          {types.map((type) => (
            <TypeChip key={type} type={type} />
          ))}
        </div>

        <dl className="pokemon-detail__info">
          {infoItems.map(({ label, value }) => (
            <div key={label} className="pokemon-detail__info-item">
              <dt className="pokemon-detail__info-label">{label}</dt>
              <dd className="pokemon-detail__info-value">{value}</dd>
            </div>
          ))}
        </dl>

        <ul className="pokemon-detail__stats">
          {stats.map(({ label, value }) => (
            <li key={label} className="pokemon-detail__stat">
              <span className="pokemon-detail__stat-label">{label}</span>
              <span className="pokemon-detail__stat-track">
                <span
                  className="pokemon-detail__stat-fill"
                  style={{ width: `${Math.min(value / STAT_MAX, 1) * 100}%` }}
                />
              </span>
            </li>
          ))}
        </ul>

        <div className="pokemon-detail__action">
          <Button
            variant={addStatus === 'added' ? 'secondary' : 'primary'}
            disabled={addStatus !== 'available'}
            onClick={onAdd}
          >
            {ADD_LABELS[addStatus]}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PokemonDetail;