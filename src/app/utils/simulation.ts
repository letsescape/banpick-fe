import { BanPick, SimulationTeam } from '@/app/types/simulation';

const getBanPickState = (type: BanPick, team: SimulationTeam) =>
  Array.from({ length: 5 }, (_, i) => ({
    order: i,
    champion_id: 0,
    img_default: null,
    type,
    team,
  }));

export { getBanPickState };
