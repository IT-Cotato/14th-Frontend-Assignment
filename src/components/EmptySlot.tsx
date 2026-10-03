import { useState } from 'react';
import PokemonDictPage from "./dict/PokemonDictPage";

function EmptySlot({ onOpenDict }: { onOpenDict: () => void }) {

  return (
    <>
      <div className="pokemon-card">
          <div className="pokemon-info">
              <h3>빈 슬롯</h3>
              <p>포켓몬을 추가해 보세요</p>
          </div>

        <div className="handle" onClick={onOpenDict}>
          ☰
        </div>
      </div>
    </>
  );
}

export default EmptySlot;