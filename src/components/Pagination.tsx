import { Link } from "react-router-dom";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  pageHref: (page: number) => string;
};

const WINDOW_SIZE = 4;

function Pagination({
  currentPage,
  totalPages,
  hasPrevious,
  hasNext,
  pageHref,
}: PaginationProps) {
  const start = Math.floor((currentPage - 1) / WINDOW_SIZE) * WINDOW_SIZE + 1;
  const end = Math.min(start + WINDOW_SIZE - 1, totalPages);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="pagination" aria-label="페이지 이동">
      {hasPrevious ? (
        <Link to={pageHref(currentPage - 1)} className="pagination__nav" aria-label="이전 페이지">‹</Link>
      ) : (
        <button type="button" className="pagination__nav" aria-label="이전 페이지" disabled>‹</button>
      )}

      <ol className="pagination__pages">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <li key={page} className={`pagination__item${isCurrent ? " is-current" : ""}`}>
              <Link
                to={pageHref(page)}
                className={`pagination__page${isCurrent ? " is-current" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ol>

      {hasNext ? (
        <Link to={pageHref(currentPage + 1)} className="pagination__nav" aria-label="다음 페이지">›</Link>
      ) : (
        <button type="button" className="pagination__nav" aria-label="다음 페이지" disabled>›</button>
      )}
    </nav>
  );
}

export default Pagination;
