import {
    useState,
    type ChangeEvent,
    type FormEvent,
    type MouseEvent,
} from "react";
import {
    getNicknameError,
    roleLabels,
    teamRoles,
    type TeamMember,
    type TeamMemberChanges,
    type TeamRole,
} from "../data/team";
import "./EditDialog.css";

type EditDialogProps = {
    member: TeamMember;
    slotNumber: number;
    onSave: (changes: TeamMemberChanges) => void;
    onCancel: () => void;
};

function EditDialog({ member, slotNumber, onSave, onCancel }: EditDialogProps) {
    // 편집 중인 임시 값. 저장 전까지 팀 state에는 반영되지 않음
    const [nickname, setNickname] = useState(member.nickname);
    const [role, setRole] = useState<TeamRole>(member.role);

    const nicknameError = getNicknameError(nickname);

    function handleNicknameChange(event: ChangeEvent<HTMLInputElement>) {
        setNickname(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (nicknameError !== null) {
            return;
        }
        onSave({ nickname: nickname.trim(), role });
    }

    function handleDialogClick(event: MouseEvent<HTMLFormElement>) {
        // dialog 안쪽 클릭이 오버레이의 onCancel까지 전파되지 않도록 막음
        event.stopPropagation();
    }

    return (
        <div className="edit-dialog__overlay" onClick={onCancel}>
            <form
                className="edit-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-dialog-title"
                onClick={handleDialogClick}
                onSubmit={handleSubmit}
            >
                <h2 id="edit-dialog-title" className="edit-dialog__title">
                    {member.pokemon.name} 편집
                </h2>
                <p className="edit-dialog__subtitle">팀 슬롯 #{slotNumber}</p>

                <div className="edit-dialog__field">
                    <label
                        htmlFor="edit-dialog-nickname"
                        className="edit-dialog__label"
                    >
                        별명 (선택)
                    </label>
                    <input
                        id="edit-dialog-nickname"
                        className={`edit-dialog__input${nicknameError !== null ? " edit-dialog__input--error" : ""}`}
                        type="text"
                        value={nickname}
                        onChange={handleNicknameChange}
                        aria-invalid={nicknameError !== null}
                        aria-describedby={
                            nicknameError !== null
                                ? "edit-dialog-nickname-error"
                                : undefined
                        }
                        autoFocus
                    />
                    {nicknameError !== null && (
                        <p
                            id="edit-dialog-nickname-error"
                            className="edit-dialog__error"
                        >
                            {nicknameError}
                        </p>
                    )}
                </div>

                <div className="edit-dialog__field">
                    <p
                        id="edit-dialog-role-label"
                        className="edit-dialog__label"
                    >
                        역할
                    </p>
                    <div
                        className="edit-dialog__roles"
                        role="group"
                        aria-labelledby="edit-dialog-role-label"
                    >
                        {teamRoles.map((option) => (
                            <button
                                key={option}
                                type="button"
                                className={`edit-dialog__role${option === role ? " edit-dialog__role--selected" : ""}`}
                                aria-pressed={option === role}
                                onClick={() => setRole(option)}
                            >
                                {roleLabels[option]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="edit-dialog__actions">
                    <button
                        type="button"
                        className="edit-dialog__button edit-dialog__button--secondary"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="edit-dialog__button edit-dialog__button--primary"
                        disabled={nicknameError !== null}
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditDialog;
