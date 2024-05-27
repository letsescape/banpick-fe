import { useMutation } from '@tanstack/react-query';
import React, { SetStateAction, useEffect, useState } from 'react';

import { fetchBanPickCreate } from '@/app/api/banPick';
import {
  ButtonBox,
  ChampionPick,
  ChampionSearchWrap,
  MainBody,
  MainHeader,
  MatchName,
} from '@/app/components/Simulation/BanPickSimulator/styled';
import BanPickTimer from '@/app/components/Simulation/BanPickTimer';
import ChampionList from '@/app/components/Simulation/ChampionList';
import ChampionSearch from '@/app/components/Simulation/ChampionSearch';
import { InputSearchVariant } from '@/app/components/Simulation/ChampionSearch/types';
import CopyLink from '@/app/components/Simulation/CopyLink';
import PickList from '@/app/components/Simulation/PickList';
import TeamHeader from '@/app/components/Simulation/TeamHeader';
import { BAN_PICK_TURN, MAX_TURN } from '@/app/constants/banPick';
import useBanPickData from '@/app/hooks/simulation/useBanPickData';
import useChampions from '@/app/hooks/simulation/useChampions';
import { BanPickCreateReq, BanPickData, SwapData } from '@/app/types/banPick';
import { ChampionDataFilter, ChampionPosition } from '@/app/types/champion';
import { ParticipantData } from '@/app/types/participant';
import {
  BanPick,
  SimulationData,
  SimulationMode,
  SimulationStatus,
  SimulationTeam,
  TempChampion,
} from '@/app/types/simulation';

interface Props {
  banPickData: BanPickData | null;
  currentParticipant: ParticipantData;
  data: SimulationData;
  isReady: boolean;
  onReady: () => void;
  participants: ParticipantData[];
  setIsReady: React.Dispatch<SetStateAction<boolean>>;
  setStatus: React.Dispatch<SetStateAction<SimulationStatus>>;
  setTurn: React.Dispatch<SetStateAction<number>>;
  status: SimulationStatus;
  swapData: SwapData | null;
  turn: number;
}

export default function BanPickSimulator({
  banPickData,
  currentParticipant,
  data,
  isReady,
  onReady,
  participants,
  setStatus,
  setTurn,
  status,
  swapData,
  turn,
}: Props) {
  const [blueBans, setBlueBans] = useBanPickData({
    type: BanPick.Ban,
    team: SimulationTeam.Blue,
  });
  const [redBans, setRedBans] = useBanPickData({
    type: BanPick.Ban,
    team: SimulationTeam.Red,
  });
  const [bluePicks, setBluePicks] = useBanPickData({
    type: BanPick.Pick,
    team: SimulationTeam.Blue,
  });
  const [redPicks, setRedPicks] = useBanPickData({
    type: BanPick.Pick,
    team: SimulationTeam.Red,
  });

  const [searchFilters, setSearchFilters] = useState<ChampionDataFilter>({
    search: '',
    position: ChampionPosition.All,
  });
  const [champions, setFilters] = useChampions(searchFilters);
  const [selectedChampions, setSelectedChampion] = useState<number[]>([]);
  const [tempChampion, setTempChampion] = useState<TempChampion | null>(null);

  const [isInProgressTimer, setIsInProgressTimer] = useState(false);

  const banPickCreateMutate = useMutation({
    mutationFn: (params: BanPickCreateReq) => fetchBanPickCreate(params),
  });

  useEffect(() => {
    if (!participants) return;

    const { mode } = data;
    if (mode === SimulationMode.Multi) {
      const initialParticipant = {
        id: null,
        name: null,
        socket_id: null,
      };
      const redParticipant =
        participants.find(
          participant => participant.team === SimulationTeam.Red
        ) || initialParticipant;

      const newRedPicks = redPicks.map((obj, i: number) => ({
        ...obj,
        ...redParticipant,
        order: i,
      }));
      setRedPicks(newRedPicks);

      const blueParticipant =
        participants.find(
          participant => participant.team === SimulationTeam.Blue
        ) || initialParticipant;
      const newBluePicks = bluePicks.map((obj, i: number) => ({
        ...obj,
        ...blueParticipant,
        order: i,
      }));
      setBluePicks(newBluePicks);
    }
  }, [bluePicks, data, participants, redPicks, setBluePicks, setRedPicks]);

  // 챔피언 검색 이벤트시 검색 필터 반영
  useEffect(() => {
    setFilters(searchFilters);
  }, [searchFilters, setFilters]);

  // 턴 진행 시 이벤트
  useEffect(() => {
    if (
      status === SimulationStatus.Ready ||
      status === SimulationStatus.Complete
    )
      return;

    if (turn >= MAX_TURN) {
      setStatus(SimulationStatus.Swap);
    } else {
      setSelectedChampion(getSelectedChampions());
      setTempChampion(null);
      setIsInProgressTimer(true);
    }
  }, [turn]);

  useEffect(() => {
    if (
      status === SimulationStatus.InProgress ||
      status === SimulationStatus.Swap
    ) {
      setIsInProgressTimer(true);
    }
  }, [status]);

  useEffect(() => {
    if (!banPickData) return;
    setIsInProgressTimer(false);
    updateBanPickState({
      champion_id: banPickData.champion_id,
      img_default: banPickData.img_default,
    });

    setTurn((turn: number) => turn + 1);
    setIsInProgressTimer(true);
  }, [banPickData]);

  useEffect(() => {
    if (!swapData) return;

    if (swapData.team === SimulationTeam.Blue) {
      setBluePicks(swapChampion(bluePicks));
    } else {
      setRedPicks(swapChampion(redPicks));
    }
  }, [swapData]);

  // 현재 밴/픽 권한 체크
  const getBanPickAuth = () => {
    if (
      status !== SimulationStatus.InProgress ||
      banPickCreateMutate.isPending ||
      turn >= MAX_TURN
    ) {
      return false;
    }

    const { team } = BAN_PICK_TURN[turn];
    return currentParticipant.team === team;
  };

  // 현재 턴까지 선택 된 챔피언들 값 return
  const getSelectedChampions = () => {
    return [blueBans, redBans, bluePicks, redPicks]
      .flat()
      .filter(({ champion_id }) => champion_id)
      .map(({ champion_id }) => champion_id);
  };

  // 챔피언 검색
  const handleChampionSearch = (value: string) => {
    setSearchFilters({
      ...searchFilters,
      search: value,
    });
  };

  // 해당 턴의 밴/픽 데이터 변경
  const updateBanPickState = ({
    champion_id,
    img_default = '',
  }: {
    champion_id: number;
    img_default?: string | null;
  }) => {
    const { team, order, type } = BAN_PICK_TURN[turn];
    const updateBanPick = (data: BanPickData[]) => {
      const newData = [...data];
      newData[order].champion_id = champion_id;
      newData[order].img_default = img_default;
      return newData;
    };

    if (type === BanPick.Ban && team === SimulationTeam.Blue) {
      setBlueBans(updateBanPick(blueBans));
    } else if (type === BanPick.Ban && team === SimulationTeam.Red) {
      setRedBans(updateBanPick(redBans));
    } else if (type === BanPick.Pick && team === SimulationTeam.Blue) {
      setBluePicks(updateBanPick(bluePicks));
    } else if (type === BanPick.Pick && team === SimulationTeam.Red) {
      setRedPicks(updateBanPick(redPicks));
    }
  };

  const handleBanPickCreate = () => {
    const { team, order, type } = BAN_PICK_TURN[turn];
    let params = {};

    if (type === BanPick.Ban && team === SimulationTeam.Blue) {
      params = blueBans[order];
    } else if (type === BanPick.Ban && team === SimulationTeam.Red) {
      params = redBans[order];
    } else if (type === BanPick.Pick && team === SimulationTeam.Blue) {
      params = bluePicks[order];
    } else if (type === BanPick.Pick && team === SimulationTeam.Red) {
      params = redPicks[order];
    }

    banPickCreateMutate.mutate({
      ...params,
      id: data.id,
      turn,
    });
  };

  /*
   * 챔피언 클릭시 이벤트
   * 실제 밴/픽 리스트에 반영되기 전
   * */
  const handleChampionClick = ({ champion_id, img_default }: TempChampion) => {
    updateBanPickState({
      champion_id,
      img_default,
    });
    setTempChampion({
      champion_id,
      img_default,
    });
  };

  /*
   * 챔피언 선택 이벤트
   * 실제 밴/픽 리스트에 반영
   * */
  const handleChampionSelect = () => {
    if (banPickCreateMutate.isPending) return;
    if (!tempChampion) {
      alert('챔피언을 선택해 주세요.');
      return;
    }
    handleBanPickCreate();
  };

  /*
   * 밴/픽 진행시 선택 가능 시간이 끝났을 때 이벤트
   * 밴 => 노밴 or tempChampion
   * 픽 => 램덤 픽 or tempChampion
   * */
  const handleTimerEnd = () => {
    setIsInProgressTimer(false);
    if (status === SimulationStatus.Swap) {
      setStatus(SimulationStatus.Complete);
      return;
    }
    if (!isBanPickAuth) return;

    // 선택 된 챔피언이 있을때

    const champion_id = tempChampion?.champion_id || 0;

    updateBanPickState({
      champion_id,
    });
    handleBanPickCreate();
  };

  // 현재 진행 상태 체크 함수
  const checkStatus = (value: SimulationStatus): boolean => {
    return status === value;
  };

  const swapChampion = (picks: BanPickData[]) => {
    const newPicks = [...picks];
    if (!swapData) return newPicks;

    const temp = { ...newPicks[swapData.after.order] };

    newPicks[swapData.after.order].champion_id =
      newPicks[swapData.before.order].champion_id;
    newPicks[swapData.after.order].img_default =
      newPicks[swapData.before.order].img_default;
    newPicks[swapData.before.order].img_default = temp.img_default;
    newPicks[swapData.before.order].champion_id = temp.champion_id;

    return newPicks;
  };

  const isBanPickAuth = getBanPickAuth();

  return (
    <>
      <MatchName>{data.name}</MatchName>
      <MainHeader>
        <TeamHeader
          teamName={data.blue}
          teamType={SimulationTeam.Blue}
          bans={blueBans}
          turn={turn}
        />
        <BanPickTimer
          inProgress={isInProgressTimer}
          turn={turn}
          status={status}
          handleTimerEnd={handleTimerEnd}
        />
        <TeamHeader
          teamName={data.red}
          teamType={SimulationTeam.Red}
          bans={redBans}
          turn={turn}
        />
      </MainHeader>

      <MainBody>
        <ChampionSearchWrap>
          <ChampionSearch
            id="simulationSearchBar"
            name="simulationSearchBar"
            placeholder="챔피언 검색"
            variant={InputSearchVariant.White}
            onSubmit={handleChampionSearch}
          />
        </ChampionSearchWrap>

        <ChampionPick>
          <PickList
            picks={bluePicks}
            teamType={SimulationTeam.Blue}
            data={data}
            currentParticipant={currentParticipant}
            status={status}
          />

          {status === SimulationStatus.Ready && (
            <CopyLink blue={data.blue} red={data.red} links={data.links} />
          )}

          {status !== SimulationStatus.Ready && (
            <ChampionList
              champions={champions}
              isMyTurn={isBanPickAuth}
              isInProgress={checkStatus(SimulationStatus.InProgress)}
              selectedChampions={selectedChampions}
              onChampionClick={handleChampionClick}
            />
          )}
          <PickList
            picks={redPicks}
            teamType={SimulationTeam.Red}
            data={data}
            currentParticipant={currentParticipant}
            status={status}
          />
        </ChampionPick>

        <ButtonBox>
          {checkStatus(SimulationStatus.Ready) &&
            currentParticipant.team !== null &&
            currentParticipant.order === 0 && (
              <button type="button" onClick={onReady}>
                {isReady ? '준비 완료' : '준비'}
              </button>
            )}

          {checkStatus(SimulationStatus.InProgress) &&
            currentParticipant.team !== null && (
              <button type="button" onClick={handleChampionSelect}>
                챔피언 선택
              </button>
            )}
        </ButtonBox>
      </MainBody>
    </>
  );
}
