import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from './api/pokemon';
import type { Pokemon } from './PokemonCard';
import './Pokemon.css'
import './PokemonDetail.css'

const statLabels: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    speed: 'Speed',
};

type PokemonDetailProps = {
    onAddToTeam: (pokemon: Pokemon) => void;
    isTeamFull: boolean;
    team: Pokemon[];
};

function PokemonDetail({
    onAddToTeam, 
    isTeamFull, 
    team,
}: PokemonDetailProps) {
    const { pokemonId } = useParams();

    const detailQuery = useQuery({
        queryKey: ['pokemon', 'detail-page', pokemonId],
        queryFn: () =>
            fetchPokemonDetail(
                `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
            ),
        enabled: Boolean(pokemonId),
    });

    if (detailQuery.isPending) {
        return (
            <div className="empty-search">포켓몬을 불러오는 중...</div>
        );
    } 

    if (detailQuery.isError) {
        if(detailQuery.error.message === 'POKEMON_NOT_FOUND') {
            return (
                <div>해당 포켓몬이 없어요.</div>
            );
        }

        return(
            <div>
                <div>포켓몬 정보를 불러오지 못했어요.</div>
                <button
                    type='button'
                    onClick={() => detailQuery.refetch()}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    const pokemon = detailQuery.data;

    const isAdded = team.some((member) => {
        return member.id === pokemon.id;
    });

    return (
        <>
            <div 
                className="
                    text-[var(--color-text-brand)]
                    text-[13px]
                    font-[500]
                "
            >
                    도감 / #{String(detailQuery.data?.id).padStart(4, '0')}
            </div>

            <div 
                className="
                    flex flex-col lg:flex-row
                    py-[24px]! px-[22px]! lg:p-[40px]!
                    gap-[18px] lg:gap-[48px]
                    rounded-[20px]
                    items-stretch
                    self-stretch
                    border-[length:var(--stroke-1)] border-solid border-[var(--line)]
                    bg-[var(--panel)]
                    shadow-[0_24px_70px_0_rgba(42,117,187,0.16)]
                "
            >
                <div 
                    className="
                        flex
                        w-[250px] lg:w-[470px]
                        h-[250px] lg:h-[90%]
                        py-[60px]! px-[40px]!
                        flex-col
                        items-center
                        justify-center
                        rounded-[16px]
                        bg-[#FFF0F3]
                    "
                >
                    <div 
                        className="
                            flex
                            w-[203px] lg:w-[350px]
                            h-[203px] lg:h-[350px]
                            p-[25px]!
                            items-center
                            justify-center
                            shrink-[0]
                            rounded-[40px]
                            bg-[var(--panel-strong)]
                        "
                    >
                        <img
                            src={detailQuery.data?.image}
                            alt={detailQuery.data?.name}
                            className="
                                w-[174px] lg:w-[300px]
                                h-[174px] lg:h-[300px]
                                shrink-[0]
                            "
                        />
                    </div>
                </div>

                <div 
                    className="
                        flex
                        flex-col
                        gap-[12px]! lg:gap-[18px]!
                        items-start
                        flex-[1_0_0]
                    "
                >
                    <div 
                        className="
                            flex
                            py-[8px]! px-[12px]!
                            items-start
                            rounded-[999px]
                            bg-[var(--red)]
                            text-[var(--color-text-inverse)]    
                            text-[12px]
                            font-[700]
                        "
                    >
                        #{String(detailQuery.data?.id).padStart(4, '0')}
                    </div>

                    <div
                        className="
                            text-[var(--ink)]
                            text-[30px]! lg:text-[42px]
                            font-[700]
                        "
                    >
                        {detailQuery.data?.name}</div>
                    
                    <div
                        className="
                            text-[var(--muted)]
                            text-[14px] lg:text-[16px]
                            font-[400]
                            leading-[27px]
                        "    
                    >
                        {detailQuery.data?.description}
                    </div>

                    <div className="attr-box">
                        <div className="type-box">
                            {detailQuery.data?.types.map((type) => (
                                <div
                                    key={type}
                                    className={`type-chip ${type.toLowerCase()}`}
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div 
                        className="
                            flex
                            items-start
                            gap-[12px]
                        "
                    >
                        <div className='info-box'>
                            <div className='info-text'>키</div>
                            <div className='info-dict'>
                                {detailQuery.data?.height}m
                            </div>
                        </div>

                        <div className='info-box'>
                            <div className='info-text'>몸무게</div>
                            <div className='info-dict'>
                                {detailQuery.data?.weight}kg
                            </div>
                        </div>
                        
                        <div className='info-box'>
                            <div className='info-text'>특성</div>
                            <div className='info-dict'>
                                {detailQuery.data?.abilities.join(' ')}
                            </div>
                        </div>
                    </div>

                    {/*스탯바*/}
                    <div 
                        className="
                            flex
                            flex-col
                            items-start
                            gap-[10px]
                        "
                    >
                        {detailQuery.data?.stats
                            .filter((stat) =>
                                ['hp', 'attack', 'defense', 'speed'].includes(stat.name)
                            )
                            .map((stat) =>
                            <div
                                key={stat.name} 
                                className="
                                    flex
                                    items-center
                                    gap-[10px]
                                    h-[13px]
                                "
                            >
                                <div 
                                    className="
                                        text-[var(--muted)]
                                        text-[11px]
                                        font-[600]
                                    "
                                >
                                    {statLabels[stat.name] ?? stat.name}
                                </div>

                                <div 
                                    className='
                                        flex
                                        w-[280px]
                                        h-[8px]
                                        items-start
                                        rounded-[999px]
                                        bg-[var(--panel-strong)]    
                                    '
                                >
                                    <div 
                                        className=' 
                                            h-full
                                            rounded-[999px]
                                            bg-[var(--red)]
                                        '
                                        style={{
                                            width: `${Math.min(stat.value / 255 * 100, 100)}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="button"
                        onClick={() => onAddToTeam(pokemon)}
                        disabled={isTeamFull || isAdded}
                        className={`
                            flex
                            py-[12px]! px-[16px]! lg:px-[20px]!
                            items-center
                            gap-[8px]
                            rounded-[8px]

                            text-[var(--color-text-inverse)]
                            text-[13px]! lg:text-[14px]
                            font-[700]!

                            ${isAdded
                                ? 'bg-[#C5CDD8]! shadow-[0_8px_0_0_#A5AFBD] text-white!'
                                : 'bg-[var(--red)]! shadow-[0_8px_0_0_#B92F51]'
                            }
                        `}
                    >
                        {isAdded ? '추가됨' : isTeamFull ? '팀이 가득 찼어요' : '내 팀에 추가'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default PokemonDetail;