import { useState, type FormEvent, type MouseEvent } from "react";
import {
    DEFAULT_FILTERS,
    sortOrderLabels,
    type PokemonFilters,
    type PokemonType,
    type SortOrder,
} from "../data/pokemons";
import "./FilterDialog.css";

type FilterDialogProps = {
    availableTypes: PokemonType[];
    typeCounts: Record<PokemonType, number>;
    initialFilters: PokemonFilters;
    onApply: (filters: PokemonFilters) => void;
    onCancel: () => void;
};

const sortOrders: SortOrder[] = ["asc", "desc"];

function FilterDialog({
    availableTypes,
    typeCounts,
    initialFilters,
    onApply,
    onCancel,
}: FilterDialogProps) {
    const [draft, setDraft] = useState<PokemonFilters>(initialFilters);

    const isDefault = draft.types.length === 0 && draft.sortOrder === null;

    function handleToggleType(type: PokemonType) {
        setDraft((prev) => ({
            ...prev,
            types: prev.types.includes(type)
                ? prev.types.filter((prevType) => prevType !== type)
                : [...prev.types, type],
        }));
    }

    function handleToggleSort(order: SortOrder) {
        setDraft((prev) => ({
            ...prev,
            sortOrder: prev.sortOrder === order ? null : order,
        }));
    }

    function handleReset() {
        setDraft(DEFAULT_FILTERS);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onApply(draft);
    }

    function handleDialogClick(event: MouseEvent<HTMLFormElement>) {
        event.stopPropagation();
    }

    return (
        <div className="filter-dialog__overlay" onClick={onCancel}>
            <form
                className="filter-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-dialog-title"
                onClick={handleDialogClick}
                onSubmit={handleSubmit}
            >
                <h2 id="filter-dialog-title" className="filter-dialog__title">
                    필터
                </h2>
                <p className="filter-dialog__subtitle">
                    선택한 조건은 검색어와 함께 적용돼요.
                </p>

                <div className="filter-dialog__field">
                    <p
                        id="filter-dialog-type-label"
                        className="filter-dialog__label"
                    >
                        타입 (여러 개 선택 가능)
                    </p>
                    <div
                        className="filter-dialog__chips"
                        role="group"
                        aria-labelledby="filter-dialog-type-label"
                    >
                        {availableTypes.map((type) => {
                            const isSelected = draft.types.includes(type);

                            return (
                                <button
                                    key={type}
                                    type="button"
                                    className={`filter-dialog__chip${isSelected ? " filter-dialog__chip--selected" : ""}`}
                                    style={{
                                        backgroundColor: `var(--type-${type})`,
                                    }}
                                    aria-pressed={isSelected}
                                    onClick={() => handleToggleType(type)}
                                >
                                    {type.toUpperCase()} {typeCounts[type]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="filter-dialog__field">
                    <p
                        id="filter-dialog-sort-label"
                        className="filter-dialog__label"
                    >
                        번호 정렬
                    </p>
                    <div
                        className="filter-dialog__sorts"
                        role="group"
                        aria-labelledby="filter-dialog-sort-label"
                    >
                        {sortOrders.map((order) => (
                            <button
                                key={order}
                                type="button"
                                className={`filter-dialog__sort${draft.sortOrder === order ? " filter-dialog__sort--selected" : ""}`}
                                aria-pressed={draft.sortOrder === order}
                                onClick={() => handleToggleSort(order)}
                            >
                                {sortOrderLabels[order]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-dialog__actions">
                    <button
                        type="button"
                        className="filter-dialog__button filter-dialog__button--secondary filter-dialog__button--reset"
                        disabled={isDefault}
                        onClick={handleReset}
                    >
                        초기화
                    </button>
                    <button
                        type="button"
                        className="filter-dialog__button filter-dialog__button--secondary"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="filter-dialog__button filter-dialog__button--primary"
                    >
                        적용
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FilterDialog;
