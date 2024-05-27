import { useState } from 'react';

import { BanPickData } from '@/app/types/banPick';
import { ParticipantData } from '@/app/types/participant';
import { BanPick, SimulationTeam } from '@/app/types/simulation';
import { getBanPickState } from '@/app/utils/simulation';

interface BanPickProps {
  type: BanPick;
  team: SimulationTeam;
}

export default function useBanPickData({
  type,
  team,
}: BanPickProps): [
  BanPickData[],
  (participants: ParticipantData[] | null) => void,
] {
  const [data, setData] = useState(getBanPickState(type, team));

  const handleChangeData = (participants: Array<ParticipantData> | null) => {
    const newData = [...data];

    participants?.forEach(participant => {
      newData[participant.order] = {
        ...newData[participant.order],
        ...participant,
      };
    });

    setData(newData);
  };

  return [data as BanPickData[], handleChangeData];
}
