import chuImg from './assets/chu.png' 

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

function PokemonTitle() {
    return (
        <>
            <div className='header2-box'>

                <div className='title-box'>
                    <header className='titleName'>포켓몬 도감</header>
                    <div className='disc'>
                        다양한 포켓몬을 만나고 팀에 추가해보세요.
                    </div>
                </div>

                <div className='count-box'>
                    <div className='count'>전체 151마리</div>
                </div>

            </div>
        </>
    );
}

type PokemonSearchProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
};

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
                            <circle cx="7.5" cy="7.5" r="4.5" stroke="#2A75BB" stroke-width="2"/>
                            <rect x="11" y="13" width="8" height="2" rx="1" transform="rotate(-45 11 13)" fill="#2A75BB"/>
                        </svg>
                    </div>
                    <input 
                        className='searchBar' 
                        type="text" 
                        placeholder='이름 또는 번호'
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <button 
                    className='search-box'
                    onClick={onSearch}
                >
                    <div className='search'>검색</div>
                </button>
            </section>
        </>
    );
}

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
export default PokemonHeader; //이 파일 밖에서도 PokemonHeader를 사용할 수 있게 내보낸다.