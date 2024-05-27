const enum SimulationStatus {
  Ready,
  InProgress,
  Swap,
  Complete,
  ShutDown,
}

const enum BanPick {
  'Ban' = 0,
  'Pick' = 1,
}

const enum SimulationTeam {
  'Blue' = 0,
  'Red' = 1,
}

const enum SimulationMode {
  'Solo' = 0,
  'Multi',
}

interface TempChampion {
  champion_id: number;
  img_default: string;
}


// API Types

// TODO: Define SimulationLinks
interface SimulationLinks {
  red: string;
  blue: string;
}

// TODO: Define SimulationData
type SimulationData = any & {
  links:SimulationLinks
};

interface SimulationCreateReq {
  match_name: string;
  blue_team_name: string;
  red_team_name: string;
  mode: string;
}

type SimulationCreateRes = any; // TODO: Define SimulationCreateRes

interface SimulationReq {
  id: number;
  team?: SimulationTeam;
}

interface SimulationRes {
  data: SimulationData;
} // TODO: Define SimulationRes

interface SimulationResultReq {
  id: number;
  password: string;
}

type SimulationResultRes = any; // TODO: Define SimulationResultRes

export { SimulationStatus, BanPick, SimulationTeam, SimulationMode };

export type {
  TempChampion,
  SimulationCreateReq,
  SimulationCreateRes,
  SimulationReq,
  SimulationData,
  SimulationRes,
  SimulationResultReq,
  SimulationResultRes,
  SimulationLinks
};
