import pikachuImage from '../assets/pikachu.png'
import searchImage from '../assets/Search.png'

function PokemonHeader() {
  return (
    <><header className="container header">
          <div className="logo">
              <span>PM</span>
              <strong>PokéMate</strong>
          </div>

          <nav>
              <button className="red-button">홈</button>
              <button className="basic-button-dogam">도감</button>
              <button className="basic-button-myteam">내 팀</button>
              <span>0 / 6</span>
          </nav>
      </header>
      <section className="container popup">
        <div className="popup_content">
            <span className="yellow-box">오늘의 추천</span>
            <h1>포켓몬과 함께하는 하루</h1>
            <p>좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.</p>
            <div>
                <button className="red-shadow-button">도감 보기</button>
                <button className="white-button">내 팀</button>
            </div>            
        </div>
        <div className="popup_pokemon">
            <img src={pikachuImage} alt='피카츄'/>
        </div>
        </section>

        <section className="search_field">
            <img src={searchImage} alt='검색'/>
            <input
            className="search_input"
            type="search"
            placeholder="이름 또는 번호"
            aria-label='포켓몬 이름 또는 번호로 검색'/>
            <button className="red-shadow-button">검색</button>
        </section>

        <section className="card_field">
            <h3>추천 포켓몬</h3>
        </section>
    </>
  )
}

export default PokemonHeader