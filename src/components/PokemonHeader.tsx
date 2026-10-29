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
  // selectedType,
  // setSelectedType,
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
          <button className="red-button">도감</button>
          <button className="basic-button-dogam">내 팀</button>
          <span>{teamCount} / 6</span>
        </nav>
      </header>

      <section className="alert">
        <div className="firstdiv">
          <div className="popup_content">
            <h1>포켓몬 도감</h1>
            <p>다양한 포켓몬을 만나고 팀에 추가해 보세요.</p>
          </div>

          <div className="entire">
            <span className="api-box">
              PokéAPI 온라인
            </span>
            {/* <span className="yellow-box">
              전체 151마리
            </span> */}
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
          <option value="NORMAL">노말</option>
          <option value="FIGHTING">격투</option>
          <option value="FLYING">비행</option>
          <option value="POISON">독</option>
          <option value="GROUND">땅</option>
          <option value="ROCK">바위</option>
          <option value="BUG">벌레</option>
          <option value="GHOST">고스트</option>
          <option value="STEEL">강철</option>
          <option value="ELECTRIC">전기</option>
          <option value="FIRE">불꽃</option>
          <option value="GRASS">풀</option>
          <option value="WATER">물</option>
          <option value="PSYCHIC">에스퍼</option>
          <option value="ICE">얼음</option>
          <option value="DRAGON">드래곤</option>
          <option value="DARK">악</option>
          <option value="FAIRY">페어리</option>
        </select> */}

        <button className="red-shadow-button">
          검색
        </button>
      </section>
    </>
  );
}

export default PokemonHeader;
