import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { DEFAULT_SORT_ORDER, SORT_OPTIONS } from '../data/dex.ts'
import type { SortOrder } from '../data/dex.ts'
import Dialog from './Dialog.tsx'
import type { PokemonType } from './PokemonCard.tsx'

type FilterDialogProps = {
  /** 지금 목록에 적용된 조건. 창을 열 때 임시 선택값의 시작점이 된다. */
  appliedTypes: PokemonType[]
  appliedSortOrder: SortOrder | null
  typeOptions: { type: PokemonType; count: number }[]
  onApply: (types: PokemonType[], sortOrder: SortOrder | null) => void
  onCancel: () => void
}

/**
 * 타입(복수 선택)·번호 정렬을 고르는 필터 창.
 * 고르는 중인 값(draft)은 이 컴포넌트 안에서만 들고 있다가 "적용"할 때만 부모에 전달한다.
 * 부모가 열 때마다 새로 그리므로 취소·Esc로 닫은 draft는 다음에 남지 않는다.
 */
function FilterDialog({
  appliedTypes,
  appliedSortOrder,
  typeOptions,
  onApply,
  onCancel,
}: FilterDialogProps) {
  const [types, setTypes] = useState<PokemonType[]>(appliedTypes)
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(appliedSortOrder)

  const titleId = useId()
  const descriptionId = useId()
  const typeLabelId = useId()
  const sortLabelId = useId()

  function toggleType(type: PokemonType) {
    setTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((selected) => selected !== type)
        : [...prevTypes, type],
    )
  }

  // 초기화는 창 안의 임시 선택만 기본값(타입 없음·정렬 없음)으로 되돌린다. "적용"을 눌러야 목록에 반영된다.
  function handleReset() {
    setTypes([])
    setSortOrder(DEFAULT_SORT_ORDER)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply(types, sortOrder)
  }

  return (
    <Dialog
      className="dialog--filter"
      titleId={titleId}
      descriptionId={descriptionId}
      onClose={onCancel}
    >
      <form className="dialog__body" onSubmit={handleSubmit}>
        <div className="dialog__header">
          <h2 id={titleId} className="dialog__title">
            필터
          </h2>
          <p id={descriptionId} className="dialog__meta">
            선택한 조건은 검색어와 함께 적용돼요.
          </p>
        </div>

        <div className="field">
          <p id={typeLabelId} className="field__label">
            타입 (여러 개 선택 가능)
          </p>
          {/* 아무 타입도 고르지 않은 상태가 '전체'다 */}
          <div className="type-filter" role="group" aria-labelledby={typeLabelId}>
            {typeOptions.map(({ type, count }) => (
              <button
                key={type}
                type="button"
                className={`type-chip type-chip--filter type-chip--${type.toLowerCase()}`}
                aria-pressed={types.includes(type)}
                onClick={() => toggleType(type)}
              >
                {type} <span className="type-chip__count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <p id={sortLabelId} className="field__label">
            번호 정렬
          </p>
          <div className="sort-control" role="group" aria-labelledby={sortLabelId}>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="button button--secondary button--sort"
                aria-pressed={sortOrder === option.value}
                aria-label={option.description}
                // 고른 방향을 다시 누르면 정렬을 해제해 원래 순서로 돌아간다.
                onClick={() =>
                  setSortOrder(sortOrder === option.value ? null : option.value)
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog__actions dialog__actions--split">
          <button
            type="button"
            className="button button--secondary button--slot"
            onClick={handleReset}
          >
            초기화
          </button>
          <div className="dialog__actions">
            <button
              type="button"
              className="button button--secondary button--slot"
              onClick={onCancel}
            >
              취소
            </button>
            <button type="submit" className="button button--primary button--slot">
              적용
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  )
}

export default FilterDialog
