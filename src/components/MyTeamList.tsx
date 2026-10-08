interface Pokemon {
  number: string;
  name: string;
  type: string;
  role: string;
  image: string;
}

interface MyTeamGridProps {
  team: Pokemon[];
  onRemove: (number: string) => void;
}

const typeKorMap: { [key: string]: string } = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
};

function MyTeamList({ team, onRemove }: MyTeamGridProps) {
  const slots = Array.from({ length: 6 }, (_, index) => team[index] || null);

  return (
    <section className="my-team-container">
      <div className="slot-grid">
        {slots.map((pokemon, index) => (
          <div key={index} className="slot-card">
            {pokemon ? (
              <div className="slot-content">
                <div className="pokemon-info">
                  <img src={pokemon.image} alt={pokemon.name} className="slot-image" />
                  <div>
                    <h4>{pokemon.name}</h4>
                    <span className="slot-desc">{typeKorMap[pokemon.type] || pokemon.type}</span>
                    <span className="slot-desc">·</span>
                    <span className="slot-desc">{pokemon.role}</span>
                  </div>
                </div>
                <div className="slot-actions">
                  <button className="edit-btn">편집</button>
                  <button className="red-del-shadow-button" onClick={() => onRemove(pokemon.number)}>삭제</button>
                </div>
              </div>
            ) : (
              // 빈 슬롯 (가로형)
              <div className="slot-content empty-slot">
                <div>
                  <h3>빈 슬롯</h3>
                  <p>포켓몬을 추가해 보세요.</p>
                </div>
                <span className="menu-icon">≡</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyTeamList;