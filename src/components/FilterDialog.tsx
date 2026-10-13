import Button from './Button';
import Dialog from './Dialog';
import TypeChip from './TypeChip';
import type { PokemonType, SortOrder } from '../types/pokemon';
import './FilterDialog.css';

interface FilterDialogProps {
  types: readonly PokemonType[];
  selectedTypes: readonly PokemonType[];
  onToggleType: (type: PokemonType) => void;
  sortOrder: SortOrder | null;
  onToggleSort: (order: SortOrder) => void;
  onClose: () => void;
}

const SORT_OPTIONS: { order: SortOrder; label: string }[] = [
  { order: 'asc', label: '번호 ↑' },
  { order: 'desc', label: '번호 ↓' },
];

function FilterDialog({
  types,
  selectedTypes,
  onToggleType,
  sortOrder,
  onToggleSort,
  onClose,
}: FilterDialogProps) {
  return (
    <Dialog titleId="filter-dialog-title">
      <h2 id="filter-dialog-title" className="dialog__title">
        필터
      </h2>

      <p className="filter-dialog__label">타입</p>
      <div className="filter-dialog__types">
        {types.map((type) => (
          <TypeChip
            key={type}
            type={type}
            selected={selectedTypes.includes(type)}
            onClick={() => onToggleType(type)}
          />
        ))}
      </div>

      <p className="filter-dialog__label">정렬</p>
      <div className="filter-dialog__sorts">
        {SORT_OPTIONS.map(({ order, label }) => (
          <button
            key={order}
            type="button"
            className={`filter-dialog__sort${order === sortOrder ? ' filter-dialog__sort--selected' : ''}`}
            aria-pressed={order === sortOrder}
            onClick={() => onToggleSort(order)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="dialog__actions">
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </div>
    </Dialog>
  );
}

export default FilterDialog;