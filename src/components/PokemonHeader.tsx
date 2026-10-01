interface PokemonHeaderProps {
  teamCount: number;
}

function PokemonHeader({ teamCount }: PokemonHeaderProps) {
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
            <h1>나의 팀</h1>
            <p>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
          </div>
          <div className="entire">
            <span className="yellow-box">{teamCount} / 6</span>
          </div>
        </div>
        <div className="save">
          <button className="red-shadow-button">팀 저장</button>
          <button className="white-button">취소</button>
        </div>
      </section>
    </>
  );
}

export default PokemonHeader;