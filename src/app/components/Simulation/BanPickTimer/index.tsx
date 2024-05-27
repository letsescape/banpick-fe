import React, { useEffect } from 'react';
import styled from 'styled-components';

import {
  BAN_PICK_TURN,
  MAX_BAN_PICK_TIME,
  MAX_SWAP_TIME,
  MAX_TURN,
} from '@/app/constants/banPick';
import useTimer from '@/app/hooks/simulation/useTimer';
import { BanPick, SimulationStatus } from '@/app/types/simulation';

interface Props {
  inProgress: boolean;
  turn: number;
  status: SimulationStatus;
  handleTimerEnd: () => void;
}

export default function BanPickTimer({
  inProgress,
  turn,
  status,
  handleTimerEnd,
}: Props) {
  const { time, startTimer, stopTimer, resetTimer } =
    useTimer(MAX_BAN_PICK_TIME);

  useEffect(() => {
    if (time <= 0) {
      handleTimerEnd();
      resetTimer();
    }
  }, [time]);

  useEffect(() => {
    if (inProgress) {
      startTimer();
    } else {
      stopTimer();
    }
  }, [inProgress]);

  useEffect(() => {
    if (turn >= MAX_TURN) {
      resetTimer(MAX_SWAP_TIME);
    } else {
      resetTimer();
    }
  }, [turn]);

  const renderText = () => {
    if (status === SimulationStatus.Ready) return '준비';
    if (status === SimulationStatus.Swap) return '스왑';
    if (status === SimulationStatus.Complete) return '완료';
    if (!BAN_PICK_TURN[turn]) return '';

    const isBan = BAN_PICK_TURN[turn].type === BanPick.Ban;
    return isBan ? '금지' : '선택';
  };

  return (
    <TimerLayout>
      <h2>{renderText()}</h2>
      <p>: {time}</p>
    </TimerLayout>
  );
}

const TimerLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 186px;
  height: 150px;
  border-radius: 12px;
  background-image: linear-gradient(126deg, #9929ea 0%, #5808fb 97%);
  text-align: center;

  h2 {
    margin-bottom: 14px;
    font-size: 30px;
  }

  p {
    font-size: 38px;
    font-weight: bold;
  }
`;
