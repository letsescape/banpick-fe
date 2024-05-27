import { BanPick, SimulationTeam } from '@/app/types/simulation';

interface BanPickData {
  champion_id: number;
  img_default: string | null;
  order: number;
  socket_id: string;
  team: SimulationTeam;
  type: BanPick;
}

interface SwapData {
  after: BanPickData;
  before: BanPickData;
  team: SimulationTeam;
}

// API request and response

interface BanPickCreateReq {
  id: number;
  turn: number;
}

// TODO: Define the response type
type BanPickCreateRes = any;

interface BanPickUpdateReq {
  id: number;
  team: number;
  order: Array<number>;
}

// TODO: Define the response type
type BanPickUpdateRes = any;

export type {
  BanPickData,
  SwapData,
  BanPickCreateReq,
  BanPickCreateRes,
  BanPickUpdateReq,
  BanPickUpdateRes,
};
