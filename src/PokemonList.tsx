import chuImg from './assets/chu.png' 
import dragonImg from './assets/dragon.png' 
import turtleImg from './assets/turtle.png' 
import turtleKingImg from './assets/turtleKing.png' 
import duck from './assets/duck.png'
import Eve from './assets/Eve.png'
import fireMonkey from './assets/fireMonkey.png'
import PokemonCard, { type Pokemon } from './PokemonCard';

type PokemonListProps = {
    search: string;
    onAddToTeam: (pokemon: Pokemon) => void;
    isTeamFull: boolean;
};

// 포켓몬 카드 목록을 그리는 컴포넌트
function PokemonList({ search, onAddToTeam, isTeamFull }: PokemonListProps) {
    const pokemons = [
        {
            id: 25,
            name: "피카츄",
            image: chuImg,
            types: ['ELECTRIC', ],
        },
        {
            id: 6,
            name: '리자몽',
            image: dragonImg,
            types: ['FIRE'],
        },
        {
            id: 1,
            name: '이상해씨',
            image: turtleImg,
            types: ['GRASS'],
        },
        {
            id: 9,
            name: '거북왕',
            image: turtleKingImg,
            types: ['WATER'],
        },
        {
            id: 555,
            name: '가라르폼불비달마',
            image: duck,
            types: ['ELECTRIC'],
        },
        {
            id: 133,
            name: '이브이',
            image: Eve,
            types: ['NORMAL'],
        },
        {
            id: 392,
            name: '초염몽',
            image: fireMonkey,
            types: ['FIRE'],
        }
    ];

    const filteredPokemons = pokemons.filter((pokemon) => {
        const keyword = search.toLowerCase();

        return (
            pokemon.name.toLowerCase().includes(keyword) ||
            String(pokemon.id).includes(keyword)
        );
    });

    return (
        <section>

            <div className='pokeCard-box'>
                {filteredPokemons.length === 0 ? ( //조건부 렌더링
                    <div className='empty-box'>
                        <div className='empty-number-box'>
                            <div className='empty-number'>0</div>
                        </div>

                        <h3 className='empty-search'>검색 결과가 없어요.</h3>

                        <p className='discription'>다른 이름이나 번호로 검색해 보세요.</p>
                    </div>
                ) : (
                    filteredPokemons.map((pokemon) => (
                        <PokemonCard
                            key={pokemon.id}
                            {...pokemon}
                            onAdd={() => onAddToTeam(pokemon)} // 이 카드의 포켓몬을 넣어서 부르는 함수를 만들어 전달
                            disabled={isTeamFull}
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default PokemonList;