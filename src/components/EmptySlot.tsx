import { useState } from 'react';

function EmptySlot() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  function handleEditOpen() {
    setIsEditOpen(!isEditOpen);
  }
  function handleEditClose() {
    setIsEditOpen(false);
  }

  return (
    <div className="pokemon-card">
        <div className="pokemon-info">
            <h3>빈 슬롯</h3>
            <p>포켓몬을 추가해 보세요</p>
        </div>

      <button className="handle" onClick={handleEditOpen}>
        ☰
      </button>
    </div>
  );
}

export default EmptySlot;