import { ChampionPosition } from '@/app/types/champion';

const POSITION_MENUS = [
  {
    id: ChampionPosition.All,
    text: '전체',
  },
  {
    id: ChampionPosition.Top,
    text: '탑',
  },
  {
    id: ChampionPosition.Jug,
    text: '정글',
  },
  {
    id: ChampionPosition.Mid,
    text: '미드',
  },
  {
    id: ChampionPosition.ADC,
    text: '원딜',
  },
  {
    id: ChampionPosition.Sup,
    text: '서폿',
  },
];

export { POSITION_MENUS };
