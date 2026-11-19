import { Link } from 'react-router-dom'
import { useState } from 'react'
import type { Pokemon } from '../../types/pokemon'
import Button from '../Button/Button'
import './TeamEditor.css'

type TeamEditorProps = {
  pokemon: Pokemon
  onApply: (number: number, nickname: string, role: string) => void
}

function TeamEditor({ pokemon, onApply }: TeamEditorProps) {
  const [nickname, setNickname] = useState(pokemon.nickname ?? '')
  const [role, setRole] = useState(pokemon.role ?? '')

  return (
    <section className="team-editor" aria-labelledby="team-editor-title">
      <form onSubmit={(event) => {
        event.preventDefault()
        onApply(pokemon.number, nickname, role)
      }}>
        <h2 id="team-editor-title">{pokemon.name} 정보 편집</h2>
        <label>
          별명
          <input autoFocus value={nickname} maxLength={30} placeholder={pokemon.name}
            onChange={(event) => setNickname(event.target.value)} />
        </label>
        <label>
          역할
          <input value={role} maxLength={50} placeholder="예: 스피드, 공격, 서포트"
            onChange={(event) => setRole(event.target.value)} />
        </label>
        <p>별명을 비우면 원래 이름이 표시됩니다. 적용한 내용은 자동 저장됩니다.</p>
        <div className="team-editor__actions">
          <Button type="submit">적용</Button>
          <Link className="button button--secondary" to="/my-team">취소</Link>
        </div>
      </form>
    </section>
  )
}

export default TeamEditor
