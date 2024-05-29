import { useMutation } from '@tanstack/react-query';
import Echo from 'laravel-echo';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchParticipantUpdate } from '@/app/api/participant';
import { fetchSimulationResult } from '@/app/api/simulation';
import BanPickSimulator from '@/app/components/Simulation/BanPickSimulator';
import Result from '@/app/components/Simulation/Result';
import { BanPickData, SwapData } from '@/app/types/banPick';
import { ParticipantData, ParticipantUpdateReq } from '@/app/types/participant';
import {
  SimulationData,
  SimulationResultReq,
  SimulationStatus,
} from '@/app/types/simulation';

interface SimulationProps {
  data: SimulationData;
  initialParticipants: ParticipantData[];
  socketId: string;
  echo: Echo;
}

export default function Simulation({
  data,
  initialParticipants,
  socketId,
  echo,
}: SimulationProps) {
  const router = useRouter();
  const params = useParams<{ id: string; password: string }>();
  const id = Number(params.id || 0);
  const password = params.password || '';

  // 접속자 데이터
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantData>(
    {}
  );
  // 현재 밴픽 참여자 리스트 TODO: Hook 분리
  const [participants, setParticipants] = useState(
    initialParticipants.filter(u => u.team !== null)
  );
  // 관전 참여자 리스트 TODO: Hook 분리
  const [spectateParticipants, setSpectateParticipants] = useState(
    initialParticipants.filter(u => u.team === null)
  );

  const [isReady, setIsReady] = useState(false); // 준비
  // 현재 시뮬레이터 진행 상태 값
  const [status, setStatus] = useState<SimulationStatus>(
    SimulationStatus.Ready
  );
  // 시뮬레이터 status InProgress 상태일때 진행 순서 (밴/픽 순서)
  const [turn, setTurn] = useState(0);

  const [banPickData, setBanPickData] = useState<BanPickData | null>(null);
  const [swapData, setSwapData] = useState<SwapData | null>(null);

  const [result, setResult] = useState<{
    name: string;
    blue: string;
    red: string;
    ban_picks: any[];
  }>({
    name: '',
    blue: '',
    red: '',
    ban_picks: [],
  });

  const participantUpdateMutate = useMutation({
    mutationFn: (req: ParticipantUpdateReq) => fetchParticipantUpdate(req),
  });

  const resultMutate = useMutation({
    mutationFn: (req: SimulationResultReq) => fetchSimulationResult(req),
  });

  /*
   * 초기 소켓 연결 작업
   * */
  useEffect(() => {
    const participant = [participants, spectateParticipants]
      .flat()
      .find((u: any) => u.socket_id === socketId);
    setCurrentParticipant(participant || '');

    echo
      .private(`presence-simulations.${id}`)
      .error(() => {
        alert('오류');
        router.push('/');
      })
      .listen('simulation.processed', (res: any) => {
        if (res.is_shutdown) {
          setStatus(SimulationStatus.ShutDown);
          alert('방 삭제 됨');
          router.push('/');
        }
      })
      .listen('simulation.participant.processed', (data: any) => {
        const participants = data.participants.filter(
          (u: any) => u.team !== null
        );
        setParticipants(participants);

        const spectates = data.participants.filter((u: any) => u.team === null);
        setSpectateParticipants(spectates);

        if (data.is_start && status === SimulationStatus.Ready) {
          setStatus(SimulationStatus.InProgress);
        }
      })
      .listen('simulation.ended', (res: any) => {
        if (res.is_shutdown) {
          setStatus(SimulationStatus.ShutDown);
          alert('종료 됨');
          router.push('/');
        }

        setStatus(SimulationStatus.Swap);
      })
      .listen('ban-pick.processed', (res: any) => {
        setBanPickData({
          ...res['ban-pick'],
          turn: res.turn,
          img_default: res.champion?.img_default || '',
        });
      })
      .listen('ban-pick.updated', (data: any) => {
        setSwapData({
          ...data,
          team: data.before.team,
        });
      });

    return () => {
      echo.leave(`presence-simulations.${id}`);
    };
  }, []);

  useEffect(() => {
    if (status === SimulationStatus.Complete) {
      handleBanPickResult();
    }
  }, [status]);

  /*
   * 사용자가 준비 버튼 클릭시 이벤트
   * single => ?
   * multi(1vs1 or 5vs5) => ?
   * */
  const handleReady = () => {
    if (participantUpdateMutate.isPending) return;
    setIsReady((ready: boolean) => !ready);

    participantUpdateMutate.mutate(
      {
        id: data.id,
        socket_id: socketId,
        is_ready: !isReady,
      },
      {
        onError: () => {
          alert('오류');
          setIsReady((ready: boolean) => !ready);
        },
      }
    );
  };

  const handleBanPickResult = () => {
    resultMutate.mutate(
      {
        id: data.id,
        password,
      },
      {
        onSuccess: ({ simulation }) => {
          setResult(simulation);
        },
      }
    );
  };

  return (
    <section>
      {status !== SimulationStatus.Complete && (
        <BanPickSimulator
          data={data}
          currentParticipant={currentParticipant}
          participants={participants}
          status={status}
          isReady={isReady}
          turn={turn}
          banPickData={banPickData}
          swapData={swapData}
          setStatus={setStatus}
          setIsReady={setIsReady}
          setTurn={setTurn}
          onReady={handleReady}
        />
      )}

      {status === SimulationStatus.Complete && <Result data={result} />}
    </section>
  );
}
