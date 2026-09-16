import "./SearchBar.css";

function SearchBar() {
    return (
        <form
            className="search-bar"
            onSubmit={(event) => event.preventDefault()}
        >
            <div className="search-bar__field">
                <span className="search-bar__icon" aria-hidden="true">
                    <span className="search-bar__icon-circle" />
                    <span className="search-bar__icon-handle" />
                </span>
                <input
                    className="search-bar__input"
                    type="text"
                    placeholder="이름 또는 번호"
                />
            </div>
            <button className="search-bar__button" type="submit">
                검색
            </button>
        </form>
    );
}

export default SearchBar;
