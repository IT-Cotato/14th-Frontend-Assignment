import { useNavigate, useParams } from "react-router";
import TeamEditForm from "./TeamEditForm";
import StatePanel from "./StatePanel";
import type { TeamMember, TeamMemberChanges } from "../data/team";

type TeamEditPageProps = {
    team: TeamMember[];
    onUpdateTeamMember: (pokemonId: number, changes: TeamMemberChanges) => void;
};

function TeamEditPage({ team, onUpdateTeamMember }: TeamEditPageProps) {
    const { teamPokemonId = "" } = useParams();
    const navigate = useNavigate();

    const memberIndex = team.findIndex(
        (member) => String(member.pokemon.id) === teamPokemonId,
    );

    if (memberIndex === -1) {
        return (
            <StatePanel
                variant="notFound"
                title="팀 항목을 찾을 수 없어요"
                description="주소를 확인하거나 내 팀으로 돌아가세요."
                links={[
                    { label: "내 팀으로", to: "/my-team", variant: "primary" },
                ]}
            />
        );
    }

    const member = team[memberIndex];

    function handleSave(changes: TeamMemberChanges) {
        onUpdateTeamMember(member.pokemon.id, changes);
        navigate("/my-team");
    }

    return (
        <TeamEditForm
            key={member.pokemon.id}
            member={member}
            slotNumber={memberIndex + 1}
            onSave={handleSave}
        />
    );
}

export default TeamEditPage;
