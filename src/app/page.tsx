'use client';

import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { fetchSimulationCreate } from '@/app/api/simulation';
import { SimulationCreateReq } from '@/app/types/simulation';

interface SimulationCreateInput {
  match_name: string;
  blue_team_name: string;
  red_team_name: string;
  mode: string;
}

export default function Home() {
  const { handleSubmit } = useForm<SimulationCreateInput>({
    defaultValues: {
      match_name: '',
      blue_team_name: '',
      red_team_name: '',
      mode: '',
    },
  });
  const { mutate: createMutate } = useMutation({
    mutationFn: (params: SimulationCreateReq) => fetchSimulationCreate(params),
  });

  const onSubmit: SubmitHandler<SimulationCreateInput> = data => {
    createMutate(data as unknown as SimulationCreateReq, {
      onSuccess: () => {
        alert('success');
      },
      onError: () => {
        alert('fail');
      },
    });
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" name="match_name" placeholder="매치 명" />
        <input type="text" name="blue_team_name" placeholder="블루팀 이름" />
        <input type="text" name="red_team_name" placeholder="레드팀 이름" />

        <div>
          <input type="radio" name="mode" value="solo" />
          <input type="radio" name="mode" value="multi" />
        </div>

        <button type="submit">다음</button>
      </form>
    </section>
  );
}
