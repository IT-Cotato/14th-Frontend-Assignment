import type { Pokemon } from './PokemonCard';   // PokemonCard 파일에서 Pokemon 타입만 가져옴
import './TeamSlotList.css';                     // 이 컴포넌트의 CSS 연결
import { useState } from 'react';               // 기억해야 하는 값(state)을 만드는 기능

// 고를 수 있는 역할 목록
const ROLES = ['공격', '방어', '서포트'];

type EditPanelProps = {
    pokemon: Pokemon;                                  // 편집할 포켓몬
    slotNumber: number;                                // 몇 번 슬롯인지
    onCancel: () => void;                              // 취소 누를 때
    onSave: (nickname: string, role: string, memo: string) => void;  // 저장 누를 때
};

// 포켓몬 별명·역할 편집 창
function EditPanel({ pokemon, onCancel, onSave }: EditPanelProps) {
    // 입력 중인 임시 값. 처음엔 포켓몬의 현재 값으로 시작 (없으면 빈 값)
    const [nickname, setNickname] = useState(pokemon.nickname ?? '');
    const [role, setRole] = useState(pokemon.role ?? '');
    const [memo, setMemo] = useState(pokemon.memo ?? '');

    return (
        <div
            className="editPanel-box"
            onClick={(e) => e.stopPropagation()}   // 창 안쪽 클릭이 오버레이까지 올라가서 닫히는 것 방지
        >
            <h2 className="editPanel-title">{pokemon.name} 편집</h2>
            <p className="editPanel-slot">
                /my-team/{pokemon.id}/edit · 고유 팀 항목
            </p>

            <div className="editPanel-label">별명 (선택)</div>
            <div className="editPanel-input-box">
                <input
                    className="editPanel-input"
                    type="text"
                    value={nickname}                                // 화면에 보이는 값 = state
                    onChange={(e) => setNickname(e.target.value)}   // 입력할 때마다 state 갱신
                />
            </div>

            <div className="editPanel-label">역할</div>
            <div className="editPanel-role-box">
                {ROLES.map((r) => (
                    <button
                        key={r}
                        className={`editPanel-role ${role === r ? 'active' : ''}`}  // 선택된 역할만 active
                        onClick={() => setRole(r)}                                 // 누르면 그 역할 선택
                    >
                        {r}
                    </button>
                ))}
            </div>

            <div className='editPanel-label'>메모</div>
            <div className="editPanel-input-box">
                <input
                    className="editPanel-input"
                    type="text"
                    value={memo}                                // 화면에 보이는 값 = state
                    onChange={(e) => setMemo(e.target.value)}   // 입력할 때마다 state 갱신
                />
            </div>

            <div className="editPanel-button-box">
                <button className="editPanel-cancel" onClick={onCancel}>취소</button>
                <button className="editPanel-save" onClick={() => onSave(nickname.trim(), role, memo.trim())}>저장</button>
            </div>
        </div>
    );
}

export default EditPanel;