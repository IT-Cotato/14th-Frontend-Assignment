import TeamSlotList from "./TeamSlotList"
import type { Pokemon } from './PokemonCard';   // PokemonCard 파일에서 Pokemon 타입만 가져옴
import './TeamSidebar.css';                     // 이 컴포넌트의 CSS 연결

// TeamSlotList가 부모(App)에게서 받는 값들
type TeamSideBarProps = {
    team: Pokemon[];                                                  // 현재 팀 배열
    onRemove: (id: number) => void;                                   // 삭제 요청 함수
    onUpdate: (id: number, nickname: string, role: string) => void;  // 별명·역할 저장 요청 함수
};

// 팀 슬롯 6칸 + 편집 모달을 그리는 컴포넌트
function TeamSidebar({ team, onRemove, onUpdate }: TeamSideBarProps) {
    return(
        <>
            <section className='sideBar-box'>
                <div className='sideBar-myTeam-name'>나의 팀</div> 

                <TeamSlotList 
                    team={team}
                    onRemove={onRemove} //왼쪽은 "TeamSlotList의 칸 이름", 오른쪽은 "내 손에 든 값"
                    onUpdate={onUpdate} 
                />
            </section>   
        </>
    )
}

export default TeamSidebar;