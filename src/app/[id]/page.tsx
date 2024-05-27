'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';
import { useEffect, useRef } from 'react';

import { fetchParticipantCreate } from '@/app/api/participant';
import { fetchSimulation } from '@/app/api/simulation';
import Simulation from '@/app/components/Simulation';

Pusher.logToConsole = process.env.NODE_ENV === 'test';

export default function BanPickSimulator() {
  const pusher = useRef<Pusher>();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = Number(params.id || 0);
  const team = Number(searchParams.get('team') || 0);

  const { data: simulationData, isLoading } = useQuery({
    queryKey: ['simulation', id],
    queryFn: () => fetchSimulation({ id }),
  });

  const { data: participantCreateData } = useQuery({
    queryKey: ['participantCreate', id, pusher.current, team],
    queryFn: () =>
      fetchParticipantCreate({
        id,
        socket_id: (pusher.current as Pusher).connection.socket_id,
        team,
      }),
    enabled: !!id && !!pusher.current,
  });

  useEffect(() => {
    pusher.current = new Pusher(process.env.PUSHER_APP_KEY, {
      cluster: 'ap3',
      authEndpoint: `${process.env.APP_API_URL}/auth/pusher`,
    });

    return () => {
      pusher.current?.disconnect();
    };
  }, []);

  if (!pusher.current || isLoading) return null;

  return (
    <Simulation
      data={simulationData}
      initialParticipants={participantCreateData?.participants || []}
      socketId={pusher.current.connection.socket_id}
      pusher={pusher.current}
    />
  );
}
