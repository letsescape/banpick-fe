import { BanPick, SimulationTeam } from '@/app/types/simulation';

const BAN_PICK_TURN = [
  {
    order: 0,
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  },
  {
    order: 0,
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  },
  {
    order: 1,
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  },
  {
    order: 1,
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  },
  {
    order: 2,
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  },
  {
    order: 2,
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  },

  {
    order: 0,
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  },
  {
    order: 0,
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  },
  {
    order: 1,
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  },
  {
    order: 1,
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  },
  {
    order: 2,
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  },
  {
    order: 2,
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  },

  {
    order: 3,
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  },
  {
    order: 3,
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  },
  {
    order: 4,
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  },
  {
    order: 4,
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  },

  {
    order: 3,
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  },
  {
    order: 3,
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  },
  {
    order: 4,
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  },
  {
    order: 4,
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  },
];

const MAX_TURN = BAN_PICK_TURN.length;

const MAX_BAN_PICK_TIME = 30;
const MAX_SWAP_TIME = 60;

export { BAN_PICK_TURN, MAX_TURN, MAX_BAN_PICK_TIME, MAX_SWAP_TIME };
