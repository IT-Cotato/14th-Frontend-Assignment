import Button from './Button';
import searchIcon from '../assets/Search.png';
import './SearchBar.css';

interface SearchBarProps {
  placeholder: string;
}

function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <img className="search-bar__icon" src={searchIcon} alt="" />
        <input className="search-bar__input" type="text" placeholder={placeholder} />
      </div>
      <Button variant="primary">검색</Button>
    </div>
  );
}

export default SearchBar;
