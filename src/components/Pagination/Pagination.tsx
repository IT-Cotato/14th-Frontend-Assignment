import './Pagination.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  disabled?: boolean
  hasPrevious?: boolean
  hasNext?: boolean
  onPrevious: () => void
  onNext: () => void
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, disabled = false, hasPrevious = true, hasNext = true, onPrevious, onNext, onPageChange }: PaginationProps) {
  // 1–4, 5–8, 9–12, 현재 페이지가 포함된 네 개의 페이지 번호 표시
  const start = Math.floor((currentPage - 1) / 4) * 4 + 1
  const count = Math.min(4, totalPages - start + 1)
  const pages = Array.from({ length: count }, (_, index) => start + index)

  return (
    <nav className="pagination" aria-label="도감 페이지 이동">
      <button className="pagination__button" type="button" aria-label="이전 페이지"
        disabled={disabled || !hasPrevious || currentPage <= 1} onClick={onPrevious}>‹</button>
      {pages.map((number) => (
        <button key={number} className="pagination__button" type="button"
          aria-label={`${number} 페이지`} aria-current={number === currentPage ? 'page' : undefined}
          disabled={disabled} onClick={() => onPageChange(number)}>{number}</button>
      ))}
      <button className="pagination__button" type="button" aria-label="다음 페이지"
        disabled={disabled || !hasNext || currentPage >= totalPages} onClick={onNext}>›</button>
    </nav>
  )
}

export default Pagination
