import "./Pagination.css";

const PAGE_GROUP_SIZE = 4;

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
    onPageChange: (page: number) => void;
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
    onPrevious,
    onNext,
    onPageChange,
}: PaginationProps) {
    const pages = getPageGroup(currentPage, totalPages);

    return (
        <nav className="pagination" aria-label="포켓몬 목록 페이지">
            <button
                type="button"
                className="pagination__button"
                aria-label="이전 페이지"
                onClick={onPrevious}
            >
                ‹
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    className={`pagination__button pagination__button--number${
                        page === currentPage
                            ? " pagination__button--current"
                            : ""
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            <button
                type="button"
                className="pagination__button"
                aria-label="다음 페이지"
                onClick={onNext}
            >
                ›
            </button>
        </nav>
    );
}

export default Pagination;
