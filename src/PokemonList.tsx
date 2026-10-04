import PokemonCard, { type Pokemon } from './PokemonCard';
import { pokemons } from './pokemonData'

// PokemonList가 부모(App)에게서 받는 값들
type PokemonListProps = {
    search: string;                              // 확정된 검색어
    team: Pokemon[];                             // 현재 팀 배열 (누가 추가됐는지 알려고)
    onAddToTeam: (pokemon: Pokemon) => void;     // 팀에 추가할 때 부를 함수
    isTeamFull: boolean;                         // 팀이 꽉 찼는지
    duplicateName: string | null;                // 중복 추가를 시도한 포켓몬 이름 (없으면 null)
    sortOrder: 'asc' | 'desc';   
    selectedType : string[];
};

// 이름 끝 글자에 받침이 있으면 '은', 없으면 '는'을 돌려주는 함수
// 예: 리자몽 → '은', 피카츄 → '는'
function getTopicParticle(word: string) {
    const lastChar = word.charCodeAt(word.length - 1);   // 마지막 글자의 유니코드 번호
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0;   // 한글 계산식으로 받침 여부 판단
    return hasBatchim ? '은' : '는';
}

// 포켓몬 카드 목록을 그리는 컴포넌트
function PokemonList({ search, team, onAddToTeam, isTeamFull, duplicateName, sortOrder, selectedType }: PokemonListProps) {

    // 검색어가 이름이나 번호에 포함된 포켓몬만 남기기
    const filteredPokemons = pokemons.filter((pokemon) => {
        const keyword = search.toLowerCase();

        return (
            pokemon.name.toLowerCase().includes(keyword) ||
            String(pokemon.id).includes(keyword)
        );
    });

    // 검색 결과를 선택한 타입으로 한 번 더 거르기
    const typeFilteredPokemons = filteredPokemons.filter((pokemon) => {
        // 조건 1: 아무 타입도 안 골랐으면?
        if(selectedType.length === 0) {
            return true
        }
        // 조건 2: 골랐으면?
        return pokemon.types.some((t) => selectedType.includes(t))
    });

    // 검색으로 거른 결과를 번호순으로 정렬 (복사본을 정렬해서 원본은 그대로)
    const sortedPokemons = [...typeFilteredPokemons].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.id - b.id; // 작은 번호가 앞에 오게 하는 공식
        }
        return b.id - a.id; // 큰 번호가 앞에 오게 하는 공식
    });

    // 위에 띄울 안내 박스 내용 정하기 (중복 안내가 가득 참 안내보다 우선)
    let notice: { mark: string; title: string; desc: string } | null = null;
    if (duplicateName) {
        notice = {
            mark: '!',
            title: '이미 팀에 있는 포켓몬이에요',
            desc: `${duplicateName}${getTopicParticle(duplicateName)} 이미 내 팀에 있어요. 같은 포켓몬은 한 번만 추가할 수 있어요.`,
        };
    } else if (isTeamFull) {
        notice = {
            mark: String(team.length),
            title: '팀이 가득 찼어요',
            desc: '팀은 최대 6마리까지 만들 수 있어요. 내 팀에서 포켓몬을 삭제하면 다시 추가할 수 있어요.',
        };
    }

    return (
        <section className='dict-content2-box'>
                <div className='dict-name'>도감 </div>
            

            {/* 안내할 내용이 있을 때만 박스 표시 */}
            {notice && (
                <div className='empty-box team-full-box'>
                    <div className='empty-number-box'>
                        <div className='empty-number'>{notice.mark}</div>
                    </div>

                    <h3 className='empty-search'>{notice.title}</h3>

                    <p className='discription'>{notice.desc}</p>
                </div>
            )}

            <div className='pokeCard-box'>
                {sortedPokemons.length === 0 ? ( // 검색 결과가 없으면 안내, 있으면 카드 목록
                    <div className='empty-box'>
                        <div className='empty-number-box'>
                            <div className='empty-number'>0</div>
                        </div>

                        <h3 className='empty-search'>검색 결과가 없어요.</h3>

                        <p className='discription'>다른 이름이나 번호로 검색해 보세요.</p>
                    </div>
                ) : (
                    sortedPokemons.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            {...pokemon}
                            onAdd={() => onAddToTeam(pokemon)}               // 이 카드의 포켓몬을 넣어서 부르는 함수
                            isAdded={team.some((p) => p.id === pokemon.id)}  // 팀에 같은 id가 있으면 true
                            isTeamFull={isTeamFull}                          // 팀이 꽉 찼는지 그대로 전달
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default PokemonList;