import { Link } from "react-router";
import { typeLabels } from "../data/pokemons";
import { getDisplayName, roleLabels, type TeamMember } from "../data/team";
import "./TeamSlot.css";

type FilledTeamSlotProps = {
    member: TeamMember;
    isCompact?: boolean;
} & (
    | { editTo: string; onDelete: () => void }
    | { editTo?: never; onDelete?: never }
);

type EmptyTeamSlotProps = {
    member: null;
    isCompact?: never;
    editTo?: never;
    onDelete?: never;
};

type TeamSlotProps = FilledTeamSlotProps | EmptyTeamSlotProps;

function TeamSlot({
    member,
    isCompact = false,
    editTo,
    onDelete,
}: TeamSlotProps) {
    if (member === null) {
        return (
            <div className="team-slot team-slot--empty">
                <div className="team-slot__info">
                    <p className="team-slot__name">빈 슬롯</p>
                    <p className="team-slot__meta">포켓몬을 추가해 보세요</p>
                </div>
                <div className="team-slot__handle" aria-hidden="true">
                    <span className="team-slot__handle-bar" />
                    <span className="team-slot__handle-bar" />
                    <span className="team-slot__handle-bar" />
                </div>
            </div>
        );
    }

    const { pokemon, role } = member;
    const typeText = pokemon.types.map((type) => typeLabels[type]).join(" · ");

    return (
        <div className={`team-slot${isCompact ? " team-slot--compact" : ""}`}>
            <div className="team-slot__artwork">
                <img
                    className="team-slot__image"
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                />
            </div>
            <div className="team-slot__info">
                <p className="team-slot__name">{getDisplayName(member)}</p>
                <p className="team-slot__meta">
                    {typeText} · {roleLabels[role]}
                </p>
            </div>
            {editTo !== undefined && onDelete !== undefined && (
                <div className="team-slot__actions">
                    <Link
                        className="team-slot__button team-slot__button--secondary"
                        to={editTo}
                    >
                        편집
                    </Link>
                    <button
                        type="button"
                        className="team-slot__button team-slot__button--danger"
                        onClick={onDelete}
                    >
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
}

export default TeamSlot;
