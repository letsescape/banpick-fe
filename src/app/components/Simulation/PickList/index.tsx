import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { fetchBanPickUpdate } from '@/app/api/banPick';
import PickItem from '@/app/components/Simulation/PickList/PickItem';
import { BanPickData, BanPickUpdateReq } from '@/app/types/banPick';
import { ParticipantData } from '@/app/types/participant';
import {
  SimulationData,
  SimulationStatus,
  SimulationTeam,
} from '@/app/types/simulation';

interface Props {
  picks: BanPickData[];
  status: SimulationStatus;
  teamType: SimulationTeam;
  data: SimulationData;
  currentParticipant: ParticipantData;
}

export default function PickList({
  picks,
  status,
  teamType,
  data,
  currentParticipant,
}: Props) {
  const swapMutate = useMutation({
    mutationFn: (req: BanPickUpdateReq) => fetchBanPickUpdate(req),
  });

  const handleSwap = ({ before, after }: { before: number; after: number }) => {
    if (swapMutate.isPending) return;

    swapMutate.mutate(
      {
        id: data.id,
        team: teamType,
        order: [before, after],
      },
      {
        onSuccess: () => {
          alert('스왑이 완료되었습니다.');
        },
        onError: () => {
          alert('오류');
        },
      }
    );
  };

  return (
    <div>
      {picks.map(
        ({ champion_id, order, team, socket_id = '', img_default }) => (
          <PickItem
            key={order}
            champion_id={champion_id}
            order={order}
            team={team}
            img_default={img_default || ''}
            socket_id={socket_id}
            participant={currentParticipant}
            status={status}
            handleSwap={handleSwap}
          />
        )
      )}
    </div>
  );
}
