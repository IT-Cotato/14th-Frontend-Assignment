import Button from './Button';
import TypeChip from './TypeChip';
import type { Pokemon } from '../types/pokemon';
import './PokemonCard.css';

// 카드 버튼이 보여줄 추가 가능 여부
export type AddStatus = 'available' | 'added' | 'full';

type PokemonCardProps = Pokemon & {
  addStatus: AddStatus;
  onAdd: () => void;
};

const ADD_LABELS: Record<AddStatus, string> = {
  available: '팀에 추가',
  added: '추가됨',
  full: '팀이 가득 찼어요',
};

function PokemonCard({ id, name, types, imageUrl, addStatus, onAdd }: PokemonCardProps) {
  const displayNumber = `#${String(id).padStart(4, '0')}`;

  return (
    <article className={`pokemon-card${addStatus === 'added' ? ' pokemon-card--added' : ''}`}>
      <div className="pokemon-card__artwork">
        <img src={imageUrl} alt={`${name} 일러스트`} />
      </div>

      <p className="pokemon-card__number">{displayNumber}</p>
      <h3 className="pokemon-card__name" title={name}>
        {name}
      </h3>
      <div className="pokemon-card__types">
        {types.map((type) => (
          <TypeChip key={type} type={type} />
        ))}
      </div>

      <div className="pokemon-card__action">
        {/* onAdd()가 아니라 onAdd를 넘겨야 클릭했을 때만 실행됨.
            '추가됨'은 눌러도 추가되지 않고, 이미 팀에 있다는 안내만 뜸 */}
        <Button
          variant={addStatus === 'added' ? 'secondary' : 'primary'}
          size="sm"
          disabled={addStatus === 'full'}
          onClick={onAdd}
        >
          {ADD_LABELS[addStatus]}
        </Button>
      </div>
    </article>
  );
}

export default PokemonCard;