import chuImg from './assets/chu.png' 
import { pokemons } from './pokemonData';
import { useState } from 'react';               // 기억해야 하는 값(state)을 만드는 기능
import { createPortal } from 'react-dom';      // 모달을 body에 그려서 화면 정중앙에 띄우는 기능

type HeaderBoxProps = {
    menu: 'home' | 'dict' | 'myTeam';
    teamCount: number;
    teamMax: number;
    onMenuChange: (menu: 'home' | 'dict' | 'myTeam') => void;
};

function HeaderBox({
    menu,
    teamCount,
    teamMax,
    onMenuChange,
}: HeaderBoxProps) {
    return (
        <>
            <div className='header-box'>
                <header className="pokemon-header">

                    <div className="logo"> {/* logo 묶어줄 div */}
                        <div className="pm-box">
                            <span className="pm">PM</span>
                        </div>
                        
                        <span className="pokeMate">PokéMate</span>
                    </div>

                    <div className="nav"> {/*navigation 묶어줄 div */}

                        <div 
                            className={`home-box ${
                                menu === 'home' ? 'active' : ''}`}
                            onClick={() => onMenuChange('home')}
                        >
                            <span className="home">홈</span>
                        </div>

                        <div 
                            className={`dict-box ${
                                menu === 'dict' ? 'active' : '' }`}
                            onClick={() => onMenuChange('dict')}
                        >
                            <span className='dict'>도감</span>
                        </div>
                        
                        <div 
                            className={`myTeam-box ${
                                menu === 'myTeam' ? 'active' : ''}`}
                            onClick={() => onMenuChange('myTeam')}
                        >
                            <span className="myTeam">내 팀</span>
                        </div>
                        
                        <span className="num">
                            {teamCount}/{teamMax}
                        </span>
                        
                    </div>

                </header>
            </div>
        </>
    );
}
 
function PokemonHeader() { //PokemonHeader 라는 react 컴포넌트를 만든다.
    return ( //이 컴포넌트가 화면에 보여줄 것을 반환한다.
        <>
            <section className="hero-box">
                <div className="hero-content">
                    <p className="reco-box">
                        <span className="reco">오늘의 추천</span>
                    </p>

                    <h1 className="sub">포켓몬과 함께하는 하루</h1>

                    <p className="dis">좋아하는 포켓몬을 찾고 나만의 팀을 만들어 보세요.</p>

                    <div className="button-row">
                        <div className="butt-1-box">
                            <button className="butt-1">도감 보기</button>
                        </div>

                        <div className="butt-2-box">
                            <button className="butt-2">내 팀</button>
                        </div>
                    </div>
                </div>
                
                <div className="chu-box">
                    <img className="chu" src={chuImg} alt="피카츄"/>
                </div>
            </section>
        </>
    );
}

type PokemonTeamProps = {
    teamCount: number;
    teamMax: number;
};

function PokemonTitle({
    teamCount,
    teamMax,
}: PokemonTeamProps) {
    return (
        <>
            <div className='header2-box'>

                <div className='title-box'>
                    <header className='titleName'>포켓몬을 찾고 팀을 완성하세요</header>
                    <div className='disc'>
                        도감과 나의 팀을 한 화면에서 관리할 수 있어요.
                    </div>
                </div>

                <div className='myTeam-num-box0'>
                    <div className='myTeam-num-box'>
                        내 팀 {teamCount}/{teamMax}
                    </div>
                </div>

            </div>
        </>
    );
}

function PokemonTeam({
    teamCount,
    teamMax,
}: PokemonTeamProps) {
    return (
        <> {/* Fragment: 불필요한 div를 하나 더 만들지 않고 여러 요소를 묶는 빈 껍데기 */}
            <div className= 'myTeam-team-box'>
                
                <div className='myTeam-title-box'>
                    <header className='myTeam-title'>나의 팀</header>
                    <div className='myTeam-dict'>최대 6마리의 포켓몬으로 나만의 팀을 완성하세요.</div>
                </div>
                
                <div className='myTeam-num-box'>
                    {teamCount}/{teamMax}
                </div>
                

                <div className='myTeam-button-box'>
                    <div className='myTeam-store-box'>
                        <button className='myTeam-store'>팀 저장</button>
                    </div>
                    <div className='myTeam-cancle-box'>
                        <button className='myTeam-cancle'>취소</button>
                    </div>
                </div>
            </div>
                
        </>
    );
}

type PokemonSearchProps = {
    search: string;                                  // 검색창에 입력 중인 글자
    onSearchChange: (value: string) => void;         // 입력할 때마다 부를 함수
    onSearch: () => void;                            // 검색 버튼 누를 때 부를 함수
    sortOrder: 'asc' | 'desc';                       // 칠판: 지금 정렬 방향
    onSortChange: (order: 'asc' | 'desc') => void;   // 분필: 정렬 방향 바꾸는 함수
    selectedType: string[];                          // 칠판: 지금 선택된 타입들
    onTypeChange: (types: string[]) => void;         // 분필: 선택을 바꾸는 함수
};

// 검색창 + 검색 버튼 + 필터 버튼 + 필터 모달
function PokemonSearch({
    search,
    onSearchChange,
    onSearch,
    sortOrder,
    onSortChange,
    selectedType,
    onTypeChange
}: PokemonSearchProps) {

    // 포켓몬 데이터에서 타입만 뽑아 중복 없이 모은 목록
    const typeList = [...new Set(pokemons.flatMap((p) => p.types))];

     // 필터 모달이 열려 있는지 (이 컴포넌트만 알면 되니까 여기서 관리)
    const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);

    // chip을 눌렀을 때: 이미 선택된 타입이면 빼고, 아니면 넣기
    function handleTypeClick(type: string) {
        if ( selectedType.includes(type) ) {
            onTypeChange( selectedType.filter((t) => t !== type)); // 하나씩 보면서 조건이 true면 남기고, false면 버려
        } else {
            onTypeChange([...selectedType, type]);   // 기존 목록 펼치고 끝에 붙인 새 배열
        }
    }

    // 초기화: 선택한 타입 비우고 정렬도 기본(번호 작은 순)으로
    function handleReset() {
        onTypeChange([]);
        onSortChange('asc');
    }

    return(
        <>
            <section className='search-container'>
                <div className='searchBar-box'>
                    <div className='diagram-box'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="7.5" cy="7.5" r="4.5" stroke="#2A75BB" stroke-width="2"/>
                            <rect x="11" y="13" width="8" height="2" rx="1" transform="rotate(-45 11 13)" fill="#2A75BB"/>
                        </svg>
                    </div>
                    <input 
                        className='searchBar' 
                        type="text" 
                        placeholder='피카츄 또는 25'
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <button 
                    className='search-box'
                    onClick={onSearch}
                >
                    검색
                </button>

                {/* 필터 버튼: 누르면 모달 열고 닫기 */}
                <button 
                    className='filterButton-box'
                    onClick={() => setIsOpenFilter(!isOpenFilter)}
                >
                    필터
                    {/* 선택된 타입이 있으면 개수 배지 표시 (state 아니고 계산값) */}
                    {selectedType.length > 0 && (
                        <span className='filter-count'>{selectedType.length}</span>
                    )}
                </button>
                
                {/* 모달이 열렸을 때만, body 바로 아래에 그림 (화면 정중앙 보장) */}
                {isOpenFilter && createPortal(
                    <div 
                        className='editPanel-overlay'
                        onClick={() => setIsOpenFilter(!isOpenFilter)}  // 어두운 배경 클릭하면 닫기
                    >
                        <div 
                            className='filterOpen-box'
                            onClick={(e) => e.stopPropagation()}   // 창 안쪽 클릭이 오버레이까지 올라가서 닫히는 것 방지
                        >
                            {/* 모달 제목 */}
                            <h2 className='filter-title'>필터</h2>

                            {/* 🔧 타입 영역: 라벨 + chip들 */}
                            <div className='filter-section'>
                                <div className='filter-label'>타입</div>
                                <div className='filter-type-box'>
                                    {typeList.map((type) =>
                                        <button
                                            key={type}
                                            className={`type-chip ${type.toLowerCase()} ${selectedType.includes(type) ? 'active' : ''}`}
                                            onClick={() => handleTypeClick(type)}
                                        >
                                            {type}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* 정렬 영역: 라벨 + 번호 버튼 2개 */}
                            <div className='filter-section'>
                                <div className='filter-label'>정렬</div>
                                <div className='filter-sort-box'>
                                    <button 
                                        className={`filter-sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
                                        onClick={() => onSortChange('asc')}
                                    >
                                        번호 ↑
                                    </button>
                                    <button 
                                        className={`filter-sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
                                        onClick={() => onSortChange('desc')}
                                    >
                                        번호 ↓
                                    </button>
                                </div>
                            </div>
                            
                            {/* 아래 버튼 줄: 왼쪽 초기화, 오른쪽 닫기 */}
                            <div className='filter-footer'>
                                <button
                                    className='filter-reset'
                                    onClick={handleReset}
                                >
                                    초기화
                                </button>
                                <button 
                                    className="editPanel-cancel" 
                                    onClick={() => setIsOpenFilter(!isOpenFilter)}
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
                
            </section>
        </>
    );
}

// 홈 화면 "추천 포켓몬 / 전체 보기" 줄
function PokemonReco() {
    return (
        <div className="sectionHeader">
            <h2 className="reco-pok">추천 포켓몬</h2>
            <div className="show">전체 보기</div>
        </div>
    );
}

export {HeaderBox};
export {PokemonTitle};
export {PokemonSearch};
export {PokemonReco};
export {PokemonTeam};
export default PokemonHeader; //이 파일 밖에서도 PokemonHeader를 사용할 수 있게 내보낸다.