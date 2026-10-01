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
              <button className="basic-button-dogam">홈</button>
              <button className="red-button">도감</button>
              <button className="basic-button-myteam">내 팀</button>
              <span>3 / 6</span>
          </nav>
      </header>
       <section className="alert">
        <div className="popup_content">
            <h1>포켓몬 도감</h1>
            <p>다양한 포켓몬을 만나고 팀에 추가해 보세요.</p>
        </div>
        <div className="entire">
            <span className="yellow-box">전체 151마리</span>
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