import { ChampionsRes } from '@/app/types/champion';
import { fetchApi } from '@/app/utils/api';

const fetchChampions = async () => {
  return await fetchApi<ChampionsRes>('/champions', {
    method: 'GET',
  });
};

export { fetchChampions };
