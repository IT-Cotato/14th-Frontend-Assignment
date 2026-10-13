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
  status?: 'default' | 'loading' | 'error';
}

function SearchBar({
  placeholder,
  value,
  onChange,
  onSearch,
  onFilterClick,
  status = 'default',
}: SearchBarProps) {
  const isLoading = status === 'loading';
  const classNames = ['search-bar'];
  if (onFilterClick) classNames.push('search-bar--with-filter');
  if (status !== 'default') classNames.push(`search-bar--${status}`);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className={classNames.join(' ')} onSubmit={handleSubmit}>
      <div className="search-bar__field">
        <img className="search-bar__icon" src={searchIcon} alt="" />
        <input
          className="search-bar__input"
          type="text"
          placeholder={isLoading ? '불러오는 중...' : placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <Button variant="primary" disabled={isLoading} onClick={onSearch}>
        {isLoading ? '검색 중' : '검색'}
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