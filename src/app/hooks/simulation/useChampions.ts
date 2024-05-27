import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { fetchChampions } from '@/app/api/champion';
import { ChampionData, ChampionDataFilter } from '@/app/types/champion';

function useChampions(
  initialFilters: ChampionDataFilter
): [
  ChampionData[],
  Dispatch<SetStateAction<ChampionDataFilter>>,
  ChampionData[],
] {
  const [searchChampions, setSearchChampions] = useState<ChampionData[]>([]);
  const [filters, setFilters] = useState(initialFilters);

  const { data, isLoading } = useQuery({
    queryKey: ['champions'],
    queryFn: fetchChampions,
    initialData: {
      champions: [],
      success: false,
      message: '',
    },
  });

  const champions = data.champions;

  useEffect(() => {
    if (isLoading) return;
    const regex = new RegExp(filters.search, 'i');

    const newChampions = [...champions].filter(({ name_kr }) =>
      name_kr.match(regex)
    );
    setSearchChampions(newChampions);
  }, [champions, filters, isLoading]);

  return [searchChampions, setFilters, champions];
}

export default useChampions;
