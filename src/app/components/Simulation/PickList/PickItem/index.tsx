import React from 'react';

import {
  ControlBox,
  Item,
  TextBox,
} from '@/app/components/Simulation/PickList/PickItem/styled';
import { ParticipantData } from '@/app/types/participant';
import { SimulationStatus, SimulationTeam } from '@/app/types/simulation';

interface Props {
  champion_id: number;
  order: number;
  team: SimulationTeam;
  img_default: string;
  socket_id: string;
  participant: ParticipantData;
  status: SimulationStatus;
  handleSwap: (orders: { before: number; after: number }) => void;
}

export default function PickItem({
  champion_id,
  order,
  team,
  img_default,
  socket_id,
  participant,
  status,
  handleSwap,
}: Props) {
  return (
    <Item champion_id={champion_id} img_default={img_default} team={team}>
      <ControlBox>
        {socket_id === participant.socket_id && (
          <span>
            {/*<BiUser color="#fff" size="20" style={{ marginTop: '2px' }} />*/}
          </span>
        )}

        {socket_id !== participant.socket_id &&
          team === participant.team &&
          status === SimulationStatus.Swap && (
            <button
              type="button"
              onClick={() =>
                handleSwap({ before: participant.order, after: order })
              }
            >
              {/*<IoIosSwap color="#fff" size="28" />*/}
            </button>
          )}
      </ControlBox>
      <TextBox>
        {team === SimulationTeam.Blue ? 'Blue' : 'Red'}
        {order}
      </TextBox>
    </Item>
  );
}
