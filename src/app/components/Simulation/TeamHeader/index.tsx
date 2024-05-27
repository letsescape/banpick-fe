import React from 'react';
import styled, { css } from 'styled-components';

import BanList from '@/app/components/Simulation/BanList';
import { SimulationTeam } from '@/app/types/simulation';

interface TeamHeaderProps {
  teamName: string;
  teamType: SimulationTeam;
  bans: Array<any>;
  turn: number;
}

const TeamHeaderLayout = styled.div<{ teamType: SimulationTeam }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  width: 360px;
  height: 150px;
  padding: 0 30px;
  border-radius: 12px;
  color: ${props => props.theme.colors.white};

  ${props =>
    props.teamType === SimulationTeam.Blue &&
    css`
      align-items: flex-start;
      background-image: linear-gradient(111deg, #46aef7 0%, #1dd5e6 99%);
    `};

  ${props =>
    props.teamType === SimulationTeam.Red &&
    css`
      align-items: flex-end;
      background-image: linear-gradient(111deg, #f94735 0%, #b6325f 99%);
    `};

  h2 {
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
  }
`;

export default function TeamHeader({
  teamType,
  teamName,
  bans,
}: TeamHeaderProps) {
  return (
    <TeamHeaderLayout teamType={teamType}>
      <h2>{teamName}</h2>
      <BanList bans={bans} />
    </TeamHeaderLayout>
  );
}
