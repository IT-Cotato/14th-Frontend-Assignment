import TeamEditDialog from "./TeamEditDialog";
import { useState } from 'react';

interface PokemonCardProps {
  number: string;
  name: string;
  type: string;
  image: string;
  role: string;
}

function PokemonCard({
  number,
  name,
  type,
  image,
  role,
}: PokemonCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  function handleEditOpen() {
    setIsEditOpen(!isEditOpen);
  }
  function handleEditClose() {
    setIsEditOpen(false);
  }

  return (
    <>
    <div className="pokemon-card">
      <div className="pokemon-image">
        <img src={image} alt={name} />
      </div>

      <div className="pokemon-info">
        <h3>{name}</h3>
        <p>{role}</p>
      </div>

      <div className="actions">
        <button className="edit-button"
          onClick={handleEditOpen}
          >
          편집</button>
        <button className="del-button">삭제</button>
      </div>
    </div>

      {isEditOpen && (
        <TeamEditDialog 
        name={name}
        role={role}
        onClose={handleEditClose}
        />
      )}
    </>
  );
}

export default PokemonCard;