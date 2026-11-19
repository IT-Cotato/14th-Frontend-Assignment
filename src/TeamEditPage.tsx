import { useParams, useNavigate } from 'react-router';
import type { Pokemon } from './PokemonCard';
import EditPanel from './EditPanel';

type TeamEditPageProps = {
    team: Pokemon[];
    onUpdate: (id: number, nickname: string, role: string, memo: string) => void;
};

function TeamEditPage({ team, onUpdate }: TeamEditPageProps) {
    const { teamPokemonId } = useParams();
    const navigate = useNavigate();

    // 여기에 URL의 번호와 id가 같은 팀원을 찾아줘.
    const pokemon = team.find((member) => {
        return member.id === Number(teamPokemonId);
    });

    if (!pokemon) {
        return <div>팀에 없는 포켓몬이에요.</div>
    }

    const slotNumber = team.findIndex(
        (member) => member.id === pokemon?.id
    ) + 1;
    
    return (
        <EditPanel
            key={pokemon.id}
            pokemon={pokemon}
            slotNumber={slotNumber}
            onCancel={() => navigate('/my-team')}
            onSave={(nickname, role, memo) => {
                onUpdate(pokemon.id, nickname, role, memo);
                navigate('/my-team');
            }}
        />
    );
}

export default TeamEditPage;