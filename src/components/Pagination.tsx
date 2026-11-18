type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSelectPage: (page: number) => void;
};

const WINDOW_SIZE = 4; // PC?ì„œ ë²ˆí˜¸ë¥?4ê°œì”©

function Pagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSelectPage,
}: PaginationProps) {
  const start = Math.floor((currentPage - 1) / WINDOW_SIZE) * WINDOW_SIZE + 1;
  const end = Math.min(start + WINDOW_SIZE - 1, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="pagination" aria-label="?˜ì´ì§€ ?´ë™">
      <button
        type="button"
        className="pagination__nav"
        aria-label="?´ì „ ?˜ì´ì§€"
        disabled={!hasPrevious}
        onClick={onPrevious}
      >
        ??
      </button>

      <ol className="pagination__pages">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li
              key={page}
              className={`pagination__item${isCurrent ? " is-current" : ""}`}
            >
              <button
                type="button"
                className={`pagination__page${isCurrent ? " is-current" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
                onClick={() => onSelectPage(page)}
              >
                {page}
              </button>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        className="pagination__nav"
        aria-label="?¤ìŒ ?˜ì´ì§€"
        disabled={!hasNext}
        onClick={onNext}
      >
        ??
      </button>
    </nav>
  );
}

export default Pagination;
