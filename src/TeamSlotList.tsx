import type { Pokemon } from './PokemonCard';   // PokemonCard 파일에서 Pokemon 타입만 가져옴
import './TeamSlotList.css';                     // 이 컴포넌트의 CSS 연결
import { useState } from 'react';               // 기억해야 하는 값(state)을 만드는 기능
import { createPortal } from 'react-dom';       // 컴포넌트를 다른 위치(body)에 그려주는 기능

// 영어 타입을 한글로 바꿔주는 표 (18종 전체)
const TYPE_LABEL: Record<string, string> = {
    BUG: '벌레',
    DARK: '악',
    DRAGON: '드래곤',
    ELECTRIC: '전기',
    FAIRY: '페어리',
    FIGHTING: '격투',
    FIRE: '불꽃',
    FLYING: '비행',
    GHOST: '고스트',
    GRASS: '풀',
    GROUND: '땅',
    ICE: '얼음',
    NORMAL: '노말',
    POISON: '독',
    PSYCHIC: '에스퍼',
    ROCK: '바위',
    STEEL: '강철',
    WATER: '물',
};

// TeamSlotList가 부모(App)에게서 받는 값들
type TeamSlotListProps = {
    team: Pokemon[];                                                  // 현재 팀 배열
    onRemove: (id: number) => void;                                   // 삭제 요청 함수
    onUpdate: (id: number, nickname: string, role: string) => void;  // 별명·역할 저장 요청 함수
};

// 팀 슬롯 6칸 + 편집 모달을 그리는 컴포넌트
function TeamSlotList({ team, onRemove, onUpdate }: TeamSlotListProps) {
    // 지금 편집 중인 포켓몬의 id. 편집 중이 아니면 null
    const [editingId, setEditingId] = useState<number | null>(null);

    // 6칸짜리 배열: 포켓몬이 있으면 포켓몬, 없으면 undefined
    const slots = Array.from({ length: 6 }, (_, i) => team[i]);

    // 편집 중인 포켓몬 객체 (편집 중 아니면 undefined)
    const editingPokemon = team.find((p) => p.id === editingId);

    // 편집 중인 포켓몬이 몇 번째 슬롯인지 (0부터 세니까 +1)
    const editingSlotNumber = team.findIndex((p) => p.id === editingId) + 1;

    // 삭제: 편집 중인 포켓몬을 지우면 편집 창도 닫음
    function handleRemove(id: number) {
        if (editingId === id) setEditingId(null);
        onRemove(id);
    }

    // 저장: App에 새 값을 알려주고 편집 창 닫기
    function handleSave(nickname: string, role: string) {
        if (editingId === null) return;
        onUpdate(editingId, nickname, role);
        setEditingId(null);
    }

    // 슬롯 6칸은 항상 그리고, 편집 중일 때만 그 위에 모달을 띄움
    return (
        <>
            <div className="teamSlot-main-box">
                {slots.map((pokemon, index) =>
                    pokemon ? (
                        <FilledSlot
                            key={pokemon.id}
                            pokemon={pokemon}
                            isEditing={pokemon.id === editingId}       // 편집 중인 슬롯이면 true
                            onEdit={() => setEditingId(pokemon.id)}    // 편집 누르면 이 포켓몬을 편집 중으로
                            onRemove={() => handleRemove(pokemon.id)}  // 삭제 누르면 이 포켓몬 삭제
                        />
                    ) : (
                        <EmptySlot key={`empty-${index}`} />
                    )
                )}
            </div>

            {/* 편집 중일 때만, 오버레이를 body 바로 아래에 그림 (화면 정중앙 보장) */}
            {editingPokemon && createPortal(
                <div
                    className="editPanel-overlay"
                    onClick={() => setEditingId(null)}   // 어두운 배경 클릭하면 닫기
                >
                    <EditPanel
                        key={editingPokemon.id}
                        pokemon={editingPokemon}
                        slotNumber={editingSlotNumber}
                        onCancel={() => setEditingId(null)}
                        onSave={handleSave}
                    />
                </div>,
                document.body                            // 그릴 장소: <body> 태그
            )}
        </>
    );
}

type FilledSlotProps = {
    pokemon: Pokemon;      // 이 슬롯에 들어갈 포켓몬
    isEditing: boolean;    // 지금 편집 중인 슬롯인지 (true/false)
    onEdit: () => void;    // 편집 버튼 누를 때
    onRemove: () => void;  // 삭제 버튼 누를 때
};

// 포켓몬이 들어있는 슬롯 하나 (편집 중이면 editing 클래스 추가)
function FilledSlot({ pokemon, isEditing, onEdit, onRemove }: FilledSlotProps) {
    // ['ELECTRIC'] → "전기"
    const typeText = pokemon.types.map((type) => TYPE_LABEL[type] ?? type).join(', ');

    // 역할이 있으면 "전기 · 공격", 없으면 "전기"
    const desc = pokemon.role ? `${typeText} · ${pokemon.role}` : typeText;

    return (
        <div className={`teamSlot-box ${isEditing ? 'editing' : ''}`}>
            <div className="teamSlot-img-box">
                <img className="teamSlot-img" src={pokemon.image} alt={pokemon.name} />
            </div>

            <div className="teamSlot-info">
                {/* 별명이 있으면 별명, 없으면 원래 이름 */}
                <div className="teamSlot-name">{pokemon.nickname || pokemon.name}</div>
                <div className="teamSlot-desc">{desc}</div>
            </div>

            <div className="teamSlot-button-box">
                <div className="teamSlot-edit-box">
                    <button className="teamSlot-edit" onClick={onEdit}>편집</button>
                </div>
                <div className="teamSlot-delete-box">
                    <button className="teamSlot-delete" onClick={onRemove}>삭제</button>
                </div>
            </div>
        </div>
    );
}

// 비어 있는 슬롯 하나
function EmptySlot() {
    return (
        <div className="teamSlot-box-empty">
            <div className="teamSlot-info">
                <div className="teamSlot-name-empty">빈 슬롯</div>
                <div className="teamSlot-desc-empty">포켓몬을 추가해 보세요</div>
            </div>
            {/* 오른쪽 파란 줄 3개 아이콘 */}
            <div className="teamSlot-logo-box">
                <div className="teamSlot-logo"></div>
                <div className="teamSlot-logo"></div>
                <div className="teamSlot-logo"></div>
            </div>
        </div>
    );
}

// 고를 수 있는 역할 목록
const ROLES = ['공격', '방어', '서포트'];

type EditPanelProps = {
    pokemon: Pokemon;                                  // 편집할 포켓몬
    slotNumber: number;                                // 몇 번 슬롯인지
    onCancel: () => void;                              // 취소 누를 때
    onSave: (nickname: string, role: string) => void;  // 저장 누를 때
};

// 포켓몬 별명·역할 편집 창
function EditPanel({ pokemon, slotNumber, onCancel, onSave }: EditPanelProps) {
    // 입력 중인 임시 값. 처음엔 포켓몬의 현재 값으로 시작 (없으면 빈 값)
    const [nickname, setNickname] = useState(pokemon.nickname ?? '');
    const [role, setRole] = useState(pokemon.role ?? '');

    return (
        <div
            className="editPanel-box"
            onClick={(e) => e.stopPropagation()}   // 창 안쪽 클릭이 오버레이까지 올라가서 닫히는 것 방지
        >
            <h2 className="editPanel-title">{pokemon.name} 편집</h2>
            <p className="editPanel-slot">팀 슬롯 #{slotNumber}</p>

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

            <div className="editPanel-button-box">
                <button className="editPanel-cancel" onClick={onCancel}>취소</button>
                <button className="editPanel-save" onClick={() => onSave(nickname.trim(), role)}>저장</button>
            </div>
        </div>
    );
}

export default TeamSlotList;   // App에서 import 할 수 있게 내보냄