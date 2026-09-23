import chuImg from './assets/chu.png' 
import dragonImg from './assets/dragon.png' 
import turtleImg from './assets/turtle.png' 
import turtleKingImg from './assets/turtleKing.png' 
import PokemonCard from './PokemonCard';

function PokemonList() {
    const pokemons = [
        {
            id: 25,
            name: "피카츄",
            image: chuImg,
            type: 'ELECTRIC',
            imgClassName: 'chu2',
            numClassName: 'chu-num',
            nameClassName: 'chu-name',
            attrBoxClassName: 'attr-box-1',
            attrClassName: 'attr1',
            buttonBoxClassName: 'button-1-box',
            buttonClassName: 'button-1',
        },
        {
            id: 6,
            name: '리자몽',
            image: dragonImg,
            type: 'FIRE',
            imgClassName: 'dragon',
            numClassName: 'dragon-num',
            nameClassName: 'dragon-name',
            attrBoxClassName: 'attr-box-2',
            attrClassName: 'attr2',
            buttonBoxClassName: 'button-2-box',
            buttonClassName: 'button-2',
        },
        {
            id: 1,
            name: '이상해씨',
            image: turtleImg,
            type: 'GRASS',
            imgClassName: 'turtle',
            numClassName: 'turtle-num',
            nameClassName: 'turtle-name',
            attrBoxClassName: 'attr-box-3',
            attrClassName: 'attr3',
            buttonBoxClassName: 'button-3-box',
            buttonClassName: 'button-3',
        },
        {
            id: 9,
            name: '거북왕',
            image: turtleKingImg,
            type: 'WATER',
            imgClassName: 'turtleKing',
            numClassName: 'turtleKing-num',
            nameClassName: 'turtleKing-name',
            attrBoxClassName: 'attr-box-4',
            attrClassName: 'attr4',
            buttonBoxClassName: 'button-4-box',
            buttonClassName: 'button-4',
        },
    ];

    return (
        <section>
            <div className="sectionHeader">
                <h2 className="reco-pok">추천 포켓몬</h2>
                <div className="show">전체 보기</div>
            </div>

            <div className='pokeCard-box'>
                {pokemons.map((pokemon) => (
                    <PokemonCard
                    key={pokemon.id}
                    {...pokemon}
                    />
                ))}
            </div>
        </section>
    );
}

export default PokemonList;