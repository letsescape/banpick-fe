'use client';

import { useQuery } from '@tanstack/react-query';
import Echo from 'laravel-echo';
import { useParams, useSearchParams } from 'next/navigation';
import Pusher from 'pusher-js';
import { useEffect, useRef } from 'react';

import { fetchParticipantCreate } from '@/app/api/participant';
import { fetchSimulation } from '@/app/api/simulation';
import Simulation from '@/app/components/Simulation';

Pusher.logToConsole = process.env.NODE_ENV === 'test';

export default function BanPickSimulator() {
  const echoRef = useRef<Echo | null>(null);
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = Number(params.id || 0);
  const team = Number(searchParams.get('team') || 0);

  const { data: simulationData, isLoading } = useQuery({
    queryKey: ['simulation', id],
    queryFn: () => fetchSimulation({ id }),
  });

  const { data: participantCreateData } = useQuery({
    queryKey: ['participantCreate', id, echoRef.current, team],
    queryFn: () =>
      fetchParticipantCreate({
        id,
        socket_id: (echoRef.current as Echo).socketId(),
        team,
      }),
    enabled: !!id && !!echoRef.current,
  });

  useEffect(() => {
    window.Pusher = Pusher;

    echoRef.current = new Echo({
      broadcaster: 'reverb',
      key: process.env.REVERB_APP_KEY,
      wsHost: process.env.REVERB_HOST,
      wsPort: process.env.REVERB_PORT ?? 80,
      wssPort: process.env.REVERB_PORT ?? 443,
      forceTLS: (process.env.REVERB_SCHEME ?? 'https') === 'https',
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          Authorization: 'TOKEN',
        },
      },
    });

    return () => {
      window.Pusher = undefined;
      echoRef.current?.disconnect();
      echoRef.current = null;
    };
  }, []);

  if (!echoRef.current || isLoading) return null;

  return (
    <Simulation
      data={simulationData}
      initialParticipants={participantCreateData?.participants || []}
      socketId={echoRef.current.socketId()}
      echo={echoRef.current}
    />
  );
}
