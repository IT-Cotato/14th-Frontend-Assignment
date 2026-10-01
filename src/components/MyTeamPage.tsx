import SiteHeader, { type MenuKey } from "./SiteHeader";
import TeamSlot from "./TeamSlot";
import type { TeamMember } from "../data/team";
import "./MyTeamPage.css";

type MyTeamPageProps = {
    team: TeamMember[];
    maxTeamSize: number;
    onNavigate: (menu: MenuKey) => void;
};

function MyTeamPage({ team, maxTeamSize, onNavigate }: MyTeamPageProps) {
    const emptySlotCount = maxTeamSize - team.length;

    return (
        <div className="page">
            <SiteHeader
                activeMenu="team"
                teamCount={team.length}
                maxTeamSize={maxTeamSize}
                onNavigate={onNavigate}
            />
            <div className="my-team__title-row">
                <div className="my-team__title-copy">
                    <h1 className="my-team__title">나의 팀</h1>
                    <p className="my-team__description">
                        최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.
                    </p>
                </div>
                <div className="my-team__controls">
                    <span className="my-team__pill">
                        {team.length} / {maxTeamSize}
                    </span>
                    <div className="my-team__actions">
                        <button
                            type="button"
                            className="my-team__button my-team__button--primary"
                        >
                            팀 저장
                        </button>
                        <button
                            type="button"
                            className="my-team__button my-team__button--secondary my-team__button--cancel"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
            <ul className="my-team__grid">
                {team.map((member) => (
                    <li key={member.pokemon.id}>
                        <TeamSlot member={member} />
                    </li>
                ))}
                {Array.from({ length: emptySlotCount }, (_, index) => (
                    <li key={`empty-${index}`}>
                        <TeamSlot member={null} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MyTeamPage;
