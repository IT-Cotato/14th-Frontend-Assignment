import chuImg from './assets/chu.png' 
import dragonImg from './assets/dragon.png' 
import turtleImg from './assets/turtle.png' 
import turtleKingImg from './assets/turtleKing.png' 

function PokemonCard() {
    return (
        <>
            <div className="pokeCard-box">
                <div className="card-box1"> {/*피카츄*/}
                    <div className="img-box1">
                        <img className="chu2" src={chuImg} alt="피카츄"/> 
                    </div>

                    <div className='chu-num'>#0025</div>

                    <div className='chu-name'>피카츄</div>

                    <div className='attr-box-1'>
                        <div className='attr1'>ELECTRIC</div>
                    </div>

                    <button className='button-1-box'>
                        <div className='button-1'>팀에 추가</div>
                    </button>
                </div>
                
                <div className="card-box1"> {/*리자몽*/}
                    <div className="img-box2">
                        <img className='dragon' src={dragonImg} alt="리자몽"/>
                    </div>

                    <div className='dragon-num'>#0006</div>

                    <div className='dragon-name'>리자몽</div>

                    <div className='attr-box-2'>
                        <div className='attr2'>FIRE</div>
                    </div>

                    <button className='button-2-box'>
                        <div className='button-2'>팀에 추가</div>
                    </button>
                </div>
                
                <div className="card-box1"> {/*이상해씨*/}
                    <div className="img-box3">
                        <img className='turtle' src={turtleImg} alt="꼬북이"/>
                    </div>

                    <div className='turtle-num'>#0001</div>

                    <div className='turtle-name'>이상해씨</div>

                    <div className='attr-box-3'>
                        <div className='attr3'>GRASS</div>
                    </div>

                    <button className='button-3-box'>
                        <div className='button-3'>팀에 추가</div>
                    </button>
                </div>
                
                <div className="card-box1"> {/*거북왕*/}
                    <div className="img-box4">
                        <img className='turtleKing' src={turtleKingImg} alt="거북왕"/>
                    </div>

                    <div className='turtleKing-num'>#0009</div>

                    <div className='turtleKing-name'>거북왕</div>

                    <div className='attr-box-4'>
                        <div className='attr4'>WATER</div>
                    </div>

                    <button className='button-4-box'>
                        <div className='button-4'>팀에 추가</div>
                    </button>
                </div>
            </div>
        </>
    );
}

export default PokemonCard