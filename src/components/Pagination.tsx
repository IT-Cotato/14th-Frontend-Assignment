import { Link } from "react-router";
import "./Pagination.css";

const PAGE_GROUP_SIZE = 4;

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    previousPage: number | null;
    nextPage: number | null;
    getPagePath: (page: number) => string;
};

function getPageGroup(currentPage: number, totalPages: number) {
    const start =
        Math.floor((currentPage - 1) / PAGE_GROUP_SIZE) * PAGE_GROUP_SIZE + 1;
    const end = Math.min(start + PAGE_GROUP_SIZE - 1, totalPages);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function Pagination({
    currentPage,
    totalPages,
    previousPage,
    nextPage,
    getPagePath,
}: PaginationProps) {
    const pages = getPageGroup(currentPage, totalPages);

    return (
        <nav className="pagination" aria-label="포켓몬 목록 페이지">
            {previousPage !== null ? (
                <Link
                    className="pagination__button"
                    to={getPagePath(previousPage)}
                    aria-label="이전 페이지"
                >
                    ‹
                </Link>
            ) : (
                <span
                    className="pagination__button pagination__button--disabled"
                    role="link"
                    aria-label="이전 페이지"
                    aria-disabled="true"
                >
                    ‹
                </span>
            )}
            {pages.map((page) => (
                <Link
                    key={page}
                    className={`pagination__button pagination__button--number${
                        page === currentPage
                            ? " pagination__button--current"
                            : ""
                    }`}
                    to={getPagePath(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                >
                    {page}
                </Link>
            ))}
            {nextPage !== null ? (
                <Link
                    className="pagination__button"
                    to={getPagePath(nextPage)}
                    aria-label="다음 페이지"
                >
                    ›
                </Link>
            ) : (
                <span
                    className="pagination__button pagination__button--disabled"
                    role="link"
                    aria-label="다음 페이지"
                    aria-disabled="true"
                >
                    ›
                </span>
            )}
        </nav>
    );
}

export default Pagination;
