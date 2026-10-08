import searchImage from '../assets/Search.png';

interface PokemonHeaderProps {
  teamCount: number;
  search: string;
  setSearch: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
}

function PokemonHeader({
  teamCount,
  search,
  setSearch,
  selectedType,
  setSelectedType,
}: PokemonHeaderProps) {
  return (
    <>
      <header className="container header">
        <div className="logo">
          <span>PM</span>
          <strong>PokéMate</strong>
        </div>

        <nav>
          <button className="basic-button-dogam">홈</button>
          <button className="basic-button-dogam">도감</button>
          <button className="red-button">내 팀</button>
          <span>{teamCount} / 6</span>
        </nav>
      </header>

      <section className="alert">
        <div className="firstdiv">
          <div className="popup_content">
            <h1>포켓몬을 찾고 팀을 완성하세요</h1>
            <p>도감과 나의 팀을 한 화면에서 관리할 수 있어요.</p>
          </div>

          <div className="entire">
            <span className="yellow-box">
              내 팀 {teamCount} / 6
            </span>
          </div>
        </div>
      </section>

      <section className="search_field">
        <img src={searchImage} alt="검색" />

        <input
          className="search_input"
          type="search"
          placeholder="이름 또는 번호"
          aria-label="포켓몬 이름 또는 번호로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="ALL">전체 타입</option>
          <option value="ELECTRIC">전기</option>
          <option value="FIRE">불꽃</option>
          <option value="GRASS">풀</option>
          <option value="WATER">물</option>
        </select> */}

        <button className="red-shadow-button">
          검색
        </button>
      </section>
    </>
  );
}

export default PokemonHeader;

