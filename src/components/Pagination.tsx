import { useEffect, useRef } from 'react'
import type { MouseEvent } from 'react'

type PaginationProps = {
  /** 고른 페이지 */
  currentPage: number
  /** 전체 페이지 수. 숫자 버튼은 1부터 이 값까지 모두 그린다. (기본 도감은 1~4 고정) */
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
}

/** 카드 목록 아래 페이지 이동. 이동할 수 없는 쪽의 이전·다음은 disabled로 클릭·키보드 동작을 막는다. */
function Pagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
}: PaginationProps) {
  const navRef = useRef<HTMLElement>(null)
  // 방금 누른 화살표. 페이지 이동(주소 변경)이 반영된 뒤 그 화살표가 끝 페이지에서 disabled로 바뀌어
  // 포커스를 잃었으면 현재 페이지 번호로 포커스를 옮긴다.
  const clickedArrowRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const arrow = clickedArrowRef.current
    if (!arrow) return
    clickedArrowRef.current = null
    if (arrow.disabled) {
      navRef.current?.querySelector<HTMLButtonElement>('[aria-current="page"]')?.focus()
    }
  }, [currentPage])

  function handleArrowClick(page: number, event: MouseEvent<HTMLButtonElement>) {
    clickedArrowRef.current = event.currentTarget
    onPageChange(page)
  }

  return (
    <nav ref={navRef} className="pagination" aria-label="도감 페이지">
      <button
        type="button"
        className="pagination__button"
        aria-label="이전 페이지"
        disabled={!hasPrevious}
        onClick={(event) => handleArrowClick(currentPage - 1, event)}
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
        const isCurrent = page === currentPage
        return (
          <button
            key={page}
            type="button"
            className={`pagination__button${isCurrent ? ' pagination__button--current' : ''}`}
            aria-label={`${page}페이지`}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      })}
      <button
        type="button"
        className="pagination__button"
        aria-label="다음 페이지"
        disabled={!hasNext}
        onClick={(event) => handleArrowClick(currentPage + 1, event)}
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination
