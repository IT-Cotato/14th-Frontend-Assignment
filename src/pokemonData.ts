import chuImg from './assets/chu.png'
import dragonImg from './assets/dragon.png'
import turtleImg from './assets/turtle.png'
import turtleKingImg from './assets/turtleKing.png'
import duck from './assets/duck.png'
import Eve from './assets/Eve.png'
import fireMonkey from './assets/fireMonkey.png'

// 도감에 보여줄 포켓몬 데이터
export const pokemons = [
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
    },
    {
        id: 392,
        name: '초염몽',
        image: fireMonkey,
        types: ['FIRE'],
    }
];