import PokemonCard, { type Pokemon } from './PokemonCard'
import { useEffect, useRef, useState } from 'react';
import chuImg from './assets/chu.png'

// PokemonList가 부모(App)에게서 받는 값들
type PokemonListProps = {
    search: string                              // 확정된 검색어
    team: Pokemon[]                             // 현재 팀 배열 (누가 추가됐는지 알려고)
    onAddToTeam: (pokemon: Pokemon) => void     // 팀에 추가할 때 부를 함수
    isTeamFull: boolean                         // 팀이 꽉 찼는지
    duplicateName: string | null                // 중복 추가를 시도한 포켓몬 이름 (없으면 null)
    sortOrder: 'asc' | 'desc'
    selectedType : string[]
};

type PokemonListItem = {
    name: string
    url: string
};

type PokemonDetailResponse = {
    id: number
    name: string
    sprites: {
        front_default: string | null; //sprites는 객체이고, 그 안의 front_default는 문자열 또는 null이다.
    };

    types: {
        type: {
            name: string
        };
    }[];

    species: {
        url: string
    }

};

type PokemonSpeciesResponse = {
    names: {
        name: string,
        language: { 
            name: string 
        };
    }[];
};

// 이름 끝 글자에 받침이 있으면 '은', 없으면 '는'을 돌려주는 함수
// 예: 리자몽 → '은', 피카츄 → '는'
function getTopicParticle(word: string) {
    const lastChar = word.charCodeAt(word.length - 1)   // 마지막 글자의 유니코드 번호
    const hasBatchim = (lastChar - 0xAC00) % 28 !== 0   // 한글 계산식으로 받침 여부 판단
    return hasBatchim ? '은' : '는'
}

async function fetchPokemonDetail(url : string): Promise<Pokemon>{
    
    const response = await fetch(url);

    if (response.status === 404) {
        throw new Error (`POKEMON_NOT_FOUND`)
    }

    if(!response.ok) {
        throw new Error('포켓몬 상세 정보를 가져오지 못했어요.');
    }

    const data: PokemonDetailResponse = await response.json();

    const speciesResponse = await fetch(data.species.url);

    if(!speciesResponse.ok) {
        throw new Error('포켓몬 이름 정보를 가져오지 못했어요.');
    }

    const speciesData: PokemonSpeciesResponse = await speciesResponse.json();

    const koreanEntry = speciesData.names.find((item) => {
        return item.language.name === 'ko'
    });

    return {
        id: data.id,
        name: koreanEntry?.name ?? data.name,
        image: data.sprites.front_default ?? chuImg,
        types: data.types.map((item) => {
            return item.type.name.toUpperCase();
        }),
    };
}

// 포켓몬 카드 목록을 그리는 컴포넌트
function PokemonList({ search, team, onAddToTeam, isTeamFull, duplicateName, sortOrder, selectedType }: PokemonListProps) {
    
    // 이름과 상세 URL을 가진 포켓몬 목록을 state로 관리하며, 처음에는 빈 배열로 시작
    const [pokemonList, setPokemonList] =  useState<PokemonListItem[]>([])
    const [pokemonDetails, setPokemonDetails] = useState<Pokemon[]>([])
    const [failedPokemons, setFailedPokemons] = useState<PokemonListItem[]>([])
    const [retryingUrls, setRetryingUrls] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [retryCount, setRetryCount] = useState<number>(0)
    const keyword = search.trim().toLowerCase()
    const requestVersion = useRef(0);

    useEffect(() => {
        requestVersion.current += 1;
        setRetryingUrls([]);

        let ignore = false

        async function loadPokemonList() {
            setIsLoading(true)
            setErrorMessage('')

            try {
                if (keyword !== '') {
                    const detail = await fetchPokemonDetail(
                        `https://pokeapi.co/api/v2/pokemon/${keyword}`
                    );

                    if (!ignore) {
                        setPokemonDetails([detail]);
                        setFailedPokemons([]);
                    }

                    return;
                }

                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
            
                if (!response.ok) {
                    throw new Error('포켓몬 목록을 가져오지 못했어요.')
                }

                const data = await response.json(); // 응답 본문의 JSON을 읽음

                if (!ignore) {
                    setPokemonList(data.results); // 그중 목록 배열을 state에 저장
                    const requests = data.results.map((item: PokemonListItem) => {
                        return fetchPokemonDetail(item.url)
                    })

                    const results = await Promise.allSettled(requests)

                    const successfulPokemons: Pokemon[] = []

                    const failedItems: PokemonListItem[] = []

                    for (const [index, result] of results.entries()) {
                        if (result.status === 'fulfilled') {
                            successfulPokemons.push(result.value)
                        } else {
                            failedItems.push(data.results[index])
                        }
                    }

                    if (!ignore) {
                        setPokemonDetails(successfulPokemons)
                        setFailedPokemons(failedItems)
                    }
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
                    setFailedPokemons([])
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
            requestVersion.current += 1
        };
    }, [keyword, retryCount])

    async function retryPokemon(item: PokemonListItem) {

        const version = requestVersion.current

        setRetryingUrls((prev) => {
            return [...prev, item.url]
        })
        try {
            const detail = await fetchPokemonDetail(item.url)

            if(version !== requestVersion.current) {
                return
            }
            setPokemonDetails((prev) => {
                return [...prev, detail]
            })

            setFailedPokemons((prev) => {
                return prev.filter((failedItem) => {
                    return failedItem.url !== item.url
                })
            })
        } catch (error) {
            console.error('재시도 실패', error)
        } finally {
            if(version === requestVersion.current) {
                setRetryingUrls((prev) => {
                    return prev.filter((url) => {
                        return url !== item.url
                    })
                })
            }
        }
    }

    // 검색 결과를 선택한 타입으로 한 번 더 거르기
    const typeFilteredPokemons = pokemonDetails.filter((pokemon) => {
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

    if (isLoading) {
        return (
            <section className="dict-content2-box">

                <div className="empty-box">
                    <div className='circle-blue-box'>
                        <div className='circle-blue'>...</div>
                    </div>
                    <h3 className="empty-search">포켓몬을 불러오는 중</h3>
                    <p className="discription">잠시만 기다려 주세요.</p>
                </div>
            </section>
        );
    }

    if (errorMessage !== '') {
    return (
        <section className="dict-content2-box">

            <div className="connection-error-box">
                <div className='circle-red-box'>
                    <div className='circle-red'>!</div>
                </div>
                <h3 className="connection-error">연결이 원활하지 않아요</h3>
                <p className="discription">{errorMessage}</p>
                <button
                    type="button"
                    className="button-box"
                    onClick={() => setRetryCount((prev) => prev + 1)}
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

                {sortedPokemons.length === 0 && failedPokemons.length === 0 ?( // 검색 결과가 없으면 안내, 있으면 카드 목록
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