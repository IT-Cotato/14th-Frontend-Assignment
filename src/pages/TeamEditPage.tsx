import { Link, useNavigate, useParams } from 'react-router-dom'
import TeamEditor from '../components/TeamEditor/TeamEditor'
import type { Pokemon } from '../types/pokemon'

type Props = { team: Pokemon[]; onApply: (number: number, nickname: string, role: string) => void }

export default function TeamEditPage({ team, onApply }: Props) {
  const { teamPokemonId } = useParams()
  const navigate = useNavigate()
  const member = team.find((pokemon) => String(pokemon.number) === teamPokemonId)
  if (!member) return <section className="route-page"><h1>팀에 없는 포켓몬이에요</h1><Link to="/my-team">내 팀으로</Link></section>
  return <TeamEditor key={member.number} pokemon={member} onApply={(number, nickname, role) => {
    onApply(number, nickname, role)
    navigate('/my-team', { replace: true })
  }} />
}
