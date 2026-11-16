import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router";
import {
    getNicknameError,
    roleLabels,
    teamRoles,
    type TeamMember,
    type TeamMemberChanges,
    type TeamRole,
} from "../data/team";
import "./TeamEditForm.css";

type TeamEditFormProps = {
    member: TeamMember;
    slotNumber: number;
    onSave: (changes: TeamMemberChanges) => void;
};

function TeamEditForm({ member, slotNumber, onSave }: TeamEditFormProps) {
    const [nickname, setNickname] = useState(member.nickname);
    const [role, setRole] = useState<TeamRole>(member.role);
    const [memo, setMemo] = useState(member.memo);

    const nicknameError = getNicknameError(nickname);
    const hasChanges =
        nickname.trim() !== member.nickname ||
        role !== member.role ||
        memo.trim() !== member.memo;
    const isSaveDisabled = nicknameError !== null || !hasChanges;

    function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
        setNickname(event.target.value);
    }

    function handleMemoChange(event: ChangeEvent<HTMLInputElement>) {
        setMemo(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSaveDisabled) {
            return;
        }
        onSave({ nickname: nickname.trim(), role, memo: memo.trim() });
    }

    return (
        <form
            className="team-edit-form"
            aria-labelledby="team-edit-form-title"
            onSubmit={handleSubmit}
        >
            <h1 id="team-edit-form-title" className="team-edit-form__title">
                {member.pokemon.name} 편집
            </h1>
            <p className="team-edit-form__subtitle">팀 슬롯 #{slotNumber}</p>

            <div className="team-edit-form__field">
                <label
                    htmlFor="team-edit-form-nickname"
                    className="team-edit-form__label"
                >
                    별명 (선택)
                </label>
                <input
                    id="team-edit-form-nickname"
                    className={`team-edit-form__input${nicknameError !== null ? " team-edit-form__input--error" : ""}`}
                    type="text"
                    value={nickname}
                    onChange={handleNicknameChange}
                    aria-invalid={nicknameError !== null}
                    aria-describedby={
                        nicknameError !== null
                            ? "team-edit-form-nickname-error"
                            : undefined
                    }
                    autoFocus
                />
                {nicknameError !== null && (
                    <p
                        id="team-edit-form-nickname-error"
                        className="team-edit-form__error"
                    >
                        {nicknameError}
                    </p>
                )}
            </div>

            <div className="team-edit-form__field">
                <p
                    id="team-edit-form-role-label"
                    className="team-edit-form__label"
                >
                    역할
                </p>
                <div
                    className="team-edit-form__roles"
                    role="group"
                    aria-labelledby="team-edit-form-role-label"
                >
                    {teamRoles.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`team-edit-form__role${option === role ? " team-edit-form__role--selected" : ""}`}
                            aria-pressed={option === role}
                            onClick={() => setRole(option)}
                        >
                            {roleLabels[option]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="team-edit-form__field">
                <label
                    htmlFor="team-edit-form-memo"
                    className="team-edit-form__label"
                >
                    메모
                </label>
                <input
                    id="team-edit-form-memo"
                    className="team-edit-form__input"
                    type="text"
                    value={memo}
                    onChange={handleMemoChange}
                />
            </div>

            <div className="team-edit-form__actions">
                <Link
                    className="team-edit-form__button team-edit-form__button--secondary"
                    to="/my-team"
                >
                    취소
                </Link>
                <button
                    type="submit"
                    className="team-edit-form__button team-edit-form__button--primary"
                    disabled={isSaveDisabled}
                >
                    저장
                </button>
            </div>
        </form>
    );
}

export default TeamEditForm;
