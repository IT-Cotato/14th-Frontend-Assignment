import "./FilterButton.css";

type FilterButtonProps = {
    className?: string;
    onClick: () => void;
};

function FilterButton({ className, onClick }: FilterButtonProps) {
    return (
        <button
            type="button"
            className={`filter-button${className ? ` ${className}` : ""}`}
            aria-haspopup="dialog"
            onClick={onClick}
        >
            필터
        </button>
    );
}

export default FilterButton;
