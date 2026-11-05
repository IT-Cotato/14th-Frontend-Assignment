import PokemonCard, { type Pokemon } from './PokemonCard'
import { useEffect, useState } from 'react';
import chuImg from './assets/chu.png'
import { usePokemonList } from './hooks/usePokemonList';
import { fetchPokemonDetail } from './api/pokemon';
import { usePokemonDetails } from './hooks/usePokemonDetails';

// PokemonList가 부모(App)에게서 받는 값들
type PokemonListProps = {
    search: string                              // 확정된 검색어
    team: Pokemon[]                             // 현재 팀 배열 (누가 추가됐는지 알려고)
    onAddToTeam: (pokemon: Pokemon) => void     // 팀에 추가할 때 부를 함수
    isTeamFull: boolean                         // 팀이 꽉 찼는지
    duplicateName: string | null                // 중복 추가를 시도한 포켓몬 이름 (없으면 null)
};

type PokemonListItem = {
    name: string
    url: string
};

// 이름 끝 글자에 받침이 있으면 '은', 없으면 '는'을 돌려주는 함수
// 예: 리자몽 → '은', 피카츄 → '는'
function getTopicParticle(word: string) {
    const lastChar = word.charCodeAt(word.length - 1)   // 마지막 글자의 유니코드 번호
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0   // 한글 계산식으로 받침 여부 판단
    return hasBatchim ? '은' : '는'
}

// 포켓몬 카드 목록을 그리는 컴포넌트
function PokemonList({ search, team, onAddToTeam, isTeamFull, duplicateName }: PokemonListProps) {
    
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [retryCount, setRetryCount] = useState<number>(0)
    const keyword = search.trim().toLowerCase()
    const limit = 6;
    const [offset, setOffset] = useState<number>(0);
    const listQuery = usePokemonList(limit, offset, keyword === '')
    const detailQueries = usePokemonDetails(listQuery.data?.results ?? []);
    const listPokemons: Pokemon[] = [];
    const currentPage = Math.floor(offset / limit) + 1;
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;

    const pageNumbers = Array.from(
        { length: 5 },
        (_, index) => startPage + index
    )

    for (const query of detailQueries) {
        if (query.data !== undefined) {
            listPokemons.push(query.data);
        }
    }

    const displayedPokemons = keyword === '' ? listPokemons : pokemonDetails;

    const failedPokemons =
        keyword === ''
            ? (listQuery.data?.results ?? []).filter((_, index) => {
                const query = detailQueries[index];

                return query.isError && query.data === undefined;
            })
            : [];

    const retryingUrls = (listQuery.data?.results ?? [])
        .filter((_, index) => {
            return detailQueries[index].isFetching;
        })
        .map((item) => item.url);

    useEffect(() => {

        let ignore = false

        async function loadPokemonList() {
            if (keyword === '') {
                return;
            }

            setIsLoading(true)
            setErrorMessage('')

            try {
                if (keyword !== '') {
                    const detail = await fetchPokemonDetail(
                        `https://pokeapi.co/api/v2/pokemon/${keyword}`
                    );

                    if (!ignore) {
                        setPokemonDetails([detail]);
                    }

                    return;
                }
            } catch (error) {
                console.error(error)

                if (!ignore) {
                    if (
                        keyword !== '' &&
                        error instanceof Error &&
                        error.message === 'POKEMON_NOT_FOUND'
                    ) {
                        setPokemonDetails([])
                    } else {
                        setErrorMessage('정보를 불러오지 못했어요. 다시 시도해 주세요.');
                    }
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false)
                }
            }
            
        }
        loadPokemonList()

        return () => {
            ignore = true
        };
    }, [keyword, retryCount])

    function retryPokemon(item: PokemonListItem) {
        const index = listQuery.data?.results.findIndex((pokemon) => {
            return pokemon.url === item.url;
        });

        if (index === undefined || index === -1) {
            return;
        }

        detailQueries[index].refetch();
    }

    function movePage(url: string | null | undefined) {
        if (!url) {
            return;
        }

        const pageUrl = new URL(url);
        const nextOffset = Number(pageUrl.searchParams.get('offset') ?? '0');

        setOffset(nextOffset);
    }

    
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

    const isListLoading =
        listQuery.isPending ||
        (listPokemons.length === 0 &&
            detailQueries.some((query) => query.isPending));
    
    const isListFetching =
        listQuery.isFetching ||
        detailQueries.some((query) => query.isFetching);

    const showLoading = keyword === '' ? isListLoading : isLoading;

    if (showLoading) {
        return (
            <section className="dict-content2-box">
                <div className="empty-box">
                    <div className="circle-blue-box">
                        <div className="circle-blue">...</div>
                    </div>

                    <h3 className="empty-search">
                        포켓몬을 불러오는 중
                    </h3>

                    <p className="discription">
                        잠시만 기다려 주세요.
                    </p>
                </div>
            </section>
        );
    }

    const displayedErrorMessage =
        keyword === ''
            ? (
                listQuery.isError && listQuery.data === undefined
                    ? listQuery.error.message
                    : ''
            )
            : errorMessage;

    if (displayedErrorMessage !== '') {
    return (
        <section className="dict-content2-box">

            <div className="connection-error-box">
                <div className='circle-red-box'>
                    <div className='circle-red'>!</div>
                </div>
                <h3 className="connection-error">연결이 원활하지 않아요</h3>
                <p className="discription">{displayedErrorMessage}</p>
                <button
                    type="button"
                    className="button-box"
                    onClick={() => {
                        if (keyword === '') {
                            listQuery.refetch();
                        } else {
                            setRetryCount((prev) => prev + 1)
                        }
                    }}
                >
                    <div className = 'retry-text'>다시 시도</div>
                </button>
            </div>
        </section>
    );
}

    return (
        <section className='dict-content2-box'>
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
                {failedPokemons.map((item) => {
                    const id = item.url.split('/').filter(Boolean).pop() ?? '';

                    return (
                        <div className="cardInfo-fail-box" key={item.url}>
                            <div className="img-box2">
                                <img
                                    className="pokemon-image2"
                                    src={chuImg}
                                    alt="상세 정보 없음"
                                />
                            </div>

                            <p className="pokemonNum">
                                #{id.padStart(4, '0')}
                            </p>

                            <p className="detail-error-title">상세 정보 실패</p>

                            <button
                                type="button"
                                className="button-box"
                                onClick={() => retryPokemon(item)}
                                disabled={retryingUrls.includes(item.url)}
                            >
                                <span className="retry-text">
                                    {retryingUrls.includes(item.url)
                                        ? '재시도 중…'
                                        : '다시 시도'}
                                </span>
                            </button>
                        </div>
                    );
                })}

                {keyword === '' && isListFetching && (
                    <p className='card-box' role="status">
                        <div className="img-box3">
                            <img
                                className="pokemon-image3"
                                src={chuImg}
                                alt="포켓몬 찾는 중"
                            />
                        </div>

                        <div className="pokemonNum">
                            #----
                        </div>

                        <p className="fetching-notice-text">포켓몬을 찾는 중</p>

                        <div className='button-faint-box'>
                            <div className='button-chip'>
                                팀에 추가
                            </div>
                        </div>
                    </p>
                )}
                {displayedPokemons.length === 0 && failedPokemons.length === 0 ?( // 검색 결과가 없으면 안내, 있으면 카드 목록
                    <div className='empty-box'>
                        <div className='empty-number-box'>
                            <div className='empty-number'>0</div>
                        </div>

                        <h3 className='empty-search'>검색 결과가 없어요.</h3>

                        <p className='discription'>다른 이름이나 번호로 검색해 보세요.</p>
                    </div>
                ) : (
                    displayedPokemons.map((pokemon) => (
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
            {keyword === '' && (
                <div className='pagination'>
                    <button
                        type="button"
                        disabled={!listQuery.data?.previous}
                        onClick={() => movePage(listQuery.data?.previous)}
                        className='pagination-box'
                        aria-label="이전 페이지"
                    >
                        <span className='pagination-logo'>&lt;</span>
                        
                    </button>

                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            type="button"
                            className={`pagination-box ${currentPage === page ? 'selected' : ''}`}
                            onClick={() => setOffset((page - 1) * limit)}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            <span className="pagination-logo">{page}</span>
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={!listQuery.data?.next}
                        onClick={() => movePage(listQuery.data?.next)}
                        className="pagination-box"
                        aria-label="다음 페이지"
                    >
                        <span className='pagination-logo'>&gt;</span>
                    </button>
                </div>
            )}
        </section>
    );
}

export default PokemonList;