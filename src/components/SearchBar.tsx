import type { ChangeEvent, FormEvent } from "react";
import "./SearchBar.css";

type SearchBarProps = {
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
};

function SearchBar({ value, placeholder, onChange, onSubmit }: SearchBarProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form className="search-bar" role="search" onSubmit={handleSubmit}>
            <div className="search-bar__field">
                <span className="search-bar__icon" aria-hidden="true">
                    <span className="search-bar__icon-circle" />
                    <span className="search-bar__icon-handle" />
                </span>
                <input
                    className="search-bar__input"
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    aria-label="포켓몬 이름 또는 번호 검색"
                    onChange={handleChange}
                />
            </div>
            <button className="search-bar__button" type="submit">
                검색
            </button>
        </form>
    );
}

export default SearchBar;
