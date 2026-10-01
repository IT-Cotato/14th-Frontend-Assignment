import { useState } from 'react'
import type { TeamMember, TeamRole } from '../data/team'
import { MAX_TEAM_SIZE } from '../data/team'
import { pokemonList, POKEMON_TYPE_LABELS } from '../data/pokemons'
import EditModal from './EditModal'
import ConfirmModal from './ConfirmModal'

interface MyTeamProps {
  team: TeamMember[]
  onRemoveFromTeam: (pokemonId: number) => void
  onUpdateMember: (pokemonId: number, nickname: string, role: TeamRole) => void
  onSaveTeam: () => void
  onCancelTeam: () => void
}

function MyTeam({
  team,
  onRemoveFromTeam,
  onUpdateMember,
  onSaveTeam,
  onCancelTeam,
}: MyTeamProps) {
  //Which slot is mid-edit or mid-delete only matters inside this
  // component, so it stays local instead of living in App.
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const emptySlotCount = MAX_TEAM_SIZE - team.length

  const editingMember = team.find((member) => member.pokemonId === editingId)
  const editingPokemon = pokemonList.find((pokemon) => pokemon.id === editingId)
  const editingSlotNumber = team.findIndex((member) => member.pokemonId === editingId) + 1

  const deletingMember = team.find((member) => member.pokemonId === deletingId)
  const deletingPokemon = pokemonList.find((pokemon) => pokemon.id === deletingId)

  return (
    <section>
      {}
      <div className="team-header">
        <div className="team-title-copy">
          <h2 className="team-title">나의 팀</h2>
          <p className="team-subtitle">최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</p>
        </div>
        <span className="team-count-pill">
          {team.length} / {MAX_TEAM_SIZE}
        </span>
        <div className="team-top-actions">
          <button type="button" className="btn btn-primary" onClick={onSaveTeam}>
            팀 저장
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelTeam}>
            취소
          </button>
        </div>
      </div>

      <div className="team-grid">
        {team.map((member) => {
          const pokemon = pokemonList.find((item) => item.id === member.pokemonId)
          if (!pokemon) return null

          return (
            <div key={member.pokemonId} className="team-slot">
              <div className="team-slot-image-box">
                <img src={pokemon.image} alt={pokemon.name} />
              </div>
              <div className="team-slot-info">
                <p className="team-slot-name">{member.nickname || pokemon.name}</p>
                <p className="team-slot-meta">
                  {POKEMON_TYPE_LABELS[pokemon.type]} · {member.role}
                </p>
              </div>
              <div className="team-slot-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingId(member.pokemonId)}
                >
                  편집
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setDeletingId(member.pokemonId)}
                >
                  삭제
                </button>
              </div>
            </div>
          )
        })}

        {}
        {Array.from({ length: emptySlotCount }).map((_, index) => (
          <div key={`empty-${index}`} className="team-slot team-slot-empty">
            <div className="team-slot-info">
              <p className="team-slot-empty-title">빈 슬롯</p>
              <p className="team-slot-empty-desc">포켓몬을 추가해 보세요</p>
            </div>
            <div className="team-slot-handle" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        ))}
      </div>

      {editingMember && editingPokemon && (
        <EditModal
          pokemonName={editingPokemon.name}
          slotNumber={editingSlotNumber}
          nickname={editingMember.nickname}
          role={editingMember.role}
          onSave={(nickname, role) => {
            onUpdateMember(editingMember.pokemonId, nickname, role)
            setEditingId(null)
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {deletingMember && deletingPokemon && (
        <ConfirmModal
          title="팀에서 삭제할까요?"
          description={`${deletingMember.nickname || deletingPokemon.name}을(를) 팀에서 삭제합니다.`}
          confirmLabel="삭제"
          onConfirm={() => {
            onRemoveFromTeam(deletingMember.pokemonId)
            setDeletingId(null)
          }}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </section>
  )
}

export default MyTeam
