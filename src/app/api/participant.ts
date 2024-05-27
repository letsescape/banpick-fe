import {
  ParticipantCreateReq,
  ParticipantCreateRes,
  ParticipantUpdateReq,
  ParticipantUpdateRes,
} from '@/app/types/participant';
import { fetchApi } from '@/app/utils/api';

const fetchParticipantCreate = async ({ id, ...req }: ParticipantCreateReq) => {
  return await fetchApi<ParticipantCreateRes>(
    `/simulations/${id}/participants`,
    {
      method: 'POST',
      body: JSON.stringify(req),
    }
  );
};

const fetchParticipantUpdate = async ({ id, ...req }: ParticipantUpdateReq) => {
  return await fetchApi<ParticipantUpdateRes>(
    `/simulations/${id}/participants/update`,
    {
      method: 'POST',
      body: JSON.stringify(req),
    }
  );
};

export { fetchParticipantCreate, fetchParticipantUpdate };
