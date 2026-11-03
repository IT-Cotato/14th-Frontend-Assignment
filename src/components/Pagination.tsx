import './Pagination.css';

const PAGE_GROUP_SIZE = 4;

interface PaginationProps {
  offset: number;
  limit: number;
  count: number;
  previousOffset: number | null;
  nextOffset: number | null;
  onChange: (offset: number) => void;
}

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  let start = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
  const end = Math.min(start + PAGE_GROUP_SIZE - 1, totalPages);
  start = Math.max(Math.min(start, end - PAGE_GROUP_SIZE + 1), 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function Pagination({ offset, limit, count, previousOffset, nextOffset, onChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(Math.ceil(count / limit), 1);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="도감 페이지">
      {/* 이전·다음은 목록 응답의 previous·next URL에서 꺼낸 offset으로 이동. null이면 disabled */}
      <button
        type="button"
        className="pagination__button"
        aria-label="이전 페이지"
        disabled={previousOffset === null}
        onClick={() => previousOffset !== null && onChange(previousOffset)}
      >
        ‹
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            className={`pagination__button pagination__page${isCurrent ? ' pagination__page--current' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onChange((page - 1) * limit)}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        className="pagination__button"
        aria-label="다음 페이지"
        disabled={nextOffset === null}
        onClick={() => nextOffset !== null && onChange(nextOffset)}
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;