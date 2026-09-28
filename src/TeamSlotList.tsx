import type { Pokemon } from './PokemonCard';   // 포켓몬 타입 가져오기
import './TeamSlotList.css';   
import { useState } from 'react';

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

type TeamSlotListProps = {
    team: Pokemon[];
    onRemove: (id: number) => void;
    onUpdate: (id: number, nickname: string, role: string) => void;
};

// 팀 슬롯 6칸 + 편집 창을 그리는 컴포넌트
function TeamSlotList({ team, onRemove, onUpdate }: TeamSlotListProps) {
    // 지금 편집 중인 포켓몬의 id. 편집 중이 아니면 null
    const [editingId, setEditingId] = useState<number | null>(null);

    // 6칸짜리 배열: 포켓몬이 있으면 포켓몬, 없으면 undefined
    const slots = Array.from({ length: 6 }, (_, i) => team[i]);

    // 편집 중인 포켓몬 객체와 몇 번째 슬롯인지 찾기
    const editingPokemon = team.find((p) => p.id === editingId);
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

        // 편집 중일 때: 편집하는 포켓몬 슬롯 하나 + 편집 창만 보여줌
    if (editingPokemon) {
        return (
            <>
                <div className="teamSlot-main-box">
                    <FilledSlot
                        pokemon={editingPokemon}
                        onEdit={() => setEditingId(editingPokemon.id)}
                        onRemove={() => handleRemove(editingPokemon.id)}
                    />
                </div>

                <EditPanel
                    key={editingPokemon.id}
                    pokemon={editingPokemon}
                    slotNumber={editingSlotNumber}
                    onCancel={() => setEditingId(null)}
                    onSave={handleSave}
                />
            </>
        );
    }

    // 평소: 슬롯 6칸 전체를 보여줌
    return (
        <div className="teamSlot-main-box">
            {slots.map((pokemon, index) =>
                pokemon ? (
                    <FilledSlot
                        key={pokemon.id}
                        pokemon={pokemon}
                        onEdit={() => setEditingId(pokemon.id)}
                        onRemove={() => handleRemove(pokemon.id)}
                    />
                ) : (
                    <EmptySlot key={`empty-${index}`} />
                )
            )}
        </div>
    );

    return (
        <div className="teamSlot-main-box">
            {slots.map((pokemon, index) =>
                pokemon ? (
                    <FilledSlot
                        key={pokemon.id}
                        pokemon={pokemon}
                        onEdit={() => setEditingId(pokemon.id)}    // 이 포켓몬을 편집 중으로
                        onRemove={() => handleRemove(pokemon.id)}  // 이 포켓몬을 삭제
                    />
                ) : (
                    <EmptySlot key={`empty-${index}`} />
                )
            )}
        </div>
    );
}

type FilledSlotProps = {
    pokemon: Pokemon;
    onEdit: () => void;
    onRemove: () => void;
};

// 포켓몬이 들어있는 슬롯 하나
function FilledSlot({ pokemon, onEdit, onRemove }: FilledSlotProps) {
    // ['ELECTRIC'] → "전기"
    const typeText = pokemon.types.map((type) => TYPE_LABEL[type] ?? type).join(', ');

    // 역할이 있으면 "전기 · 공격", 없으면 "전기"
    const desc = pokemon.role ? `${typeText} · ${pokemon.role}` : typeText;

    return (
        <div className="teamSlot-box">
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
    pokemon: Pokemon;
    slotNumber: number;
    onCancel: () => void; //이벤트 핸들러 props
    onSave: (nickname: string, role: string) => void; //이벤트 핸들러 props
};

// 포켓몬 별명·역할 편집 창
function EditPanel({ pokemon, slotNumber, onCancel, onSave }: EditPanelProps) {
    // 입력 중인 임시 값. 처음엔 포켓몬의 현재 값으로 시작 (없으면 빈 값)
    const [nickname, setNickname] = useState(pokemon.nickname ?? '');
    const [role, setRole] = useState(pokemon.role ?? '');

    return (
        <div className="editPanel-box">
            <h2 className="editPanel-title">{pokemon.name} 편집</h2>
            <p className="editPanel-slot">팀 슬롯 #{slotNumber}</p>

            <div className="editPanel-label">별명 (선택)</div>
            <div className="editPanel-input-box">
                <input
                    className="editPanel-input"
                    type="text"
                    value={nickname}                                   // 화면에 보이는 값 = state
                    onChange={(e) => setNickname(e.target.value)}      // 입력할 때마다 state 갱신
                />
            </div>

            <div className="editPanel-label">역할</div>
            <div className="editPanel-role-box">
                {ROLES.map((r) => (
                    <button
                        key={r}
                        className={`editPanel-role ${role === r ? 'active' : ''}`}   // 선택된 역할만 active
                        onClick={() => setRole(r)}                                  // 누르면 그 역할로 선택
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

export default TeamSlotList;