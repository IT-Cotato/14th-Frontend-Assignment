import TeamSlot from './TeamSlot';
import type { Pokemon } from '../types/pokemon';
import './TeamSlotList.css';

interface TeamSlotListProps {
  team: readonly Pokemon[];
  size: number;
}

function TeamSlotList({ team, size }: TeamSlotListProps) {
  // 팀이 없는 칸은 undefined
  const slots = Array.from({ length: size }, (_, index): Pokemon | undefined => team[index]);

  return (
    <section className="team-slot-list">
      <h2 className="team-slot-list__title">내 팀</h2>
      <div className="team-slot-list__grid">
        {slots.map((pokemon, index) =>
          pokemon ? (
            <TeamSlot key={pokemon.id} pokemon={pokemon} />
          ) : (
            <TeamSlot key={`empty-${index}`} />
          ),
        )}
      </div>
    </section>
  );
}

export default TeamSlotList;
