import { SimulationTeam } from '@/app/types/simulation';

// TODO: ParticipantData 타입 정의
type ParticipantData = any;

interface ParticipantCreateReq {
  id: number;
  socket_id: string;
  name?: string | null;
  team: SimulationTeam | null;
}

interface ParticipantCreateRes {
  participants: ParticipantData;
  success: boolean;
  message: string;
}

interface ParticipantUpdateReq {
  id: number;
  socket_id: string;
  is_ready: boolean;
}

// TODO: ParticipantUpdateRes 타입 정의
type ParticipantUpdateRes = any;

export type {
  ParticipantCreateReq,
  ParticipantCreateRes,
  ParticipantData,
  ParticipantUpdateReq,
  ParticipantUpdateRes,
};
