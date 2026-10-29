import chuImg from './assets/chu.png' 
import { useState } from 'react';               // 기억해야 하는 값(state)을 만드는 기능

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

function PokemonTitle() {
    return (
        <>
            <div className='header2-box'>

                <div className='title-box'>
                    <header className='titleName'>실시간 포켓몬 도감</header>
                    <div className='disc'>
                        이름이나 도감 번호로 포켓몬을 바로 찾아보세요.
                    </div>
                </div>

                <div className='pokeOnline-box'>
                    <span className="pokeOnline">PokéAPI 온라인</span>
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
};

// 검색창 + 검색 버튼
function PokemonSearch({
    search,
    onSearchChange,
    onSearch,
}: PokemonSearchProps) {
    return(
        <>
            <section className='search-container'>
                <div className='searchBar-box'>
                    <div className='diagram-box'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="7.5" cy="7.5" r="4.5" stroke="#2A75BB" strokeWidth="2"/>
                            <rect x="11" y="13" width="8" height="2" rx="1" transform="rotate(-45 11 13)" fill="#2A75BB"/>
                        </svg>
                    </div>
                    <input 
                        className='searchBar' 
                        type="text" 
                        placeholder='pikachu'
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