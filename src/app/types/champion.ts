const enum ChampionPosition {
  'All',
  'Top',
  'Jug',
  'Mid',
  'ADC',
  'Sup',
}

interface ChampionDataFilter {
  search: string;
  position: ChampionPosition;
}

// TODO: ChampionData 타입 정의
interface ChampionData {
  id: number;
  name_kr: string;
  name_en: string;
  position: string;
  tier: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
  tier_rank: number;
  position_rank: number;
  overall_rank: number;
  image: string;

  // TODO: 모름...
  champion_id: number,
  img_default: string,
}

interface ChampionsRes {
  champions: ChampionData[];
  success: boolean;
  message: string;
}

export { ChampionPosition };
export type { ChampionDataFilter, ChampionData, ChampionsRes };
