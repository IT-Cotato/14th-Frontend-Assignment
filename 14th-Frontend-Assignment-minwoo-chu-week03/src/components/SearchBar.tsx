function SearchBar() {
  return (
    <div className="search-bar">
      <div className="search-field">
        <img className="search-icon" src="/icon.svg" alt="" />
        <input type="text" placeholder="이름 또는 번호" />
      </div>
      <button type="button" className="btn btn-primary">
        검색
      </button>
    </div>
  )
}

export default SearchBar