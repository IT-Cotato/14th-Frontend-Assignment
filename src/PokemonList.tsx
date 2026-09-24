import chuImg from './assets/chu.png' 
import dragonImg from './assets/dragon.png' 
import turtleImg from './assets/turtle.png' 
import turtleKingImg from './assets/turtleKing.png' 
import duck from './assets/duck.png'
import Eve from './assets/Eve.png'
import PokemonCard from './PokemonCard';

type PokemonListProps = {
    search: string;
};

function PokemonList({ search }: PokemonListProps) {
    const pokemons = [
        {
            id: 25,
            name: "피카츄",
            image: chuImg,
            types: ['ELECTRIC'],
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
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default PokemonList;