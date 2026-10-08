import { useState } from 'react';
import type { Pokemon } from '../App';

interface MyTeamGridProps {
  team: Pokemon[];
  onRemove: (number: string) => void;
  onEdit: (number: string, nickname: string, role: string) => void;
}

const typeKorMap: { [key: string]: string } = {
  ELECTRIC: '전기',
  FIRE: '불꽃',
  GRASS: '풀',
  WATER: '물',
};

function MyTeamList({
  team,
  onRemove,
  onEdit,
}: MyTeamGridProps) {
  const [editingNumber, setEditingNumber] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('');

  const slots = Array.from(
    { length: 6 },
    (_, index) => team[index] || null
  );

  const startEdit = (pokemon: Pokemon) => {
    setEditingNumber(pokemon.number);
    setNickname(pokemon.nickname || pokemon.name);
    setRole(pokemon.role);
  };

  const saveEdit = (pokemon: Pokemon) => {
    onEdit(pokemon.number, nickname, role);
    setEditingNumber(null);
  };

  return (
    <section className="my-team-container">
      <div className="slot-grid">
        {slots.map((pokemon, index) => (
          <div key={index} className="slot-card">
            {pokemon ? (
              <div className="slot-content">
                {editingNumber === pokemon.number ? (
                  <div className="edit-form">
                    <input
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="별명"
                    />

                    <input
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="역할"
                    />

                    <button
                      className="edit-btn"
                      onClick={() => saveEdit(pokemon)}
                    >
                      저장
                    </button>

                    <button
                      className="red-del-shadow-button"
                      onClick={() => setEditingNumber(null)}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="pokemon-info">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="slot-image"
                      />

                      <div>
                        <h4>
                          {pokemon.nickname || pokemon.name}
                        </h4>

                        <span className="slot-desc">
                          {typeKorMap[pokemon.type] || pokemon.type}
                        </span>

                        <span className="slot-desc"> · </span>

                        <span className="slot-desc">
                          {pokemon.role}
                        </span>
                      </div>
                    </div>

                    <div className="slot-actions">
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(pokemon)}
                      >
                        편집
                      </button>

                      <button
                        className="red-del-shadow-button"
                        onClick={() => onRemove(pokemon.number)}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
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
