import {
  BanPickCreateReq,
  BanPickCreateRes,
  BanPickUpdateReq,
  BanPickUpdateRes,
} from '@/app/types/banPick';
import { fetchApi } from '@/app/utils/api';

const fetchBanPickCreate = async ({ id, ...params }: BanPickCreateReq) => {
  return await fetchApi<BanPickCreateRes>(`/simulations/${id}/ban-picks`, {
    method: 'POST',
    body: JSON.stringify(params),
  });
};

const fetchBanPickUpdate = async ({ id, ...params }: BanPickUpdateReq) => {
  return await fetchApi<BanPickUpdateRes>(
    `/simulations/${id}/ban-picks/update`,
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  );
};

export { fetchBanPickCreate, fetchBanPickUpdate };
