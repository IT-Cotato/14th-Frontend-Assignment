import type { FormEvent } from 'react';
import Button from './Button';
import searchIcon from '../assets/Search.png';
import './SearchBar.css';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFilterClick?: () => void;
}

function SearchBar({ placeholder, value, onChange, onSearch, onFilterClick }: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form
      className={`search-bar${onFilterClick ? ' search-bar--with-filter' : ''}`}
      onSubmit={handleSubmit}
    >
      <div className="search-bar__field">
        <img className="search-bar__icon" src={searchIcon} alt="" />
        <input
          className="search-bar__input"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <Button variant="primary" onClick={onSearch}>
        검색
      </Button>
      {onFilterClick && (
        <Button variant="secondary" onClick={onFilterClick}>
          필터
        </Button>
      )}
    </form>
  );
}

export default SearchBar;