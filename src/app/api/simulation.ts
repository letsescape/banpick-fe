import {
  SimulationCreateReq,
  SimulationCreateRes,
  SimulationReq,
  SimulationRes,
  SimulationResultReq,
  SimulationResultRes,
} from '@/app/types/simulation';
import { fetchApi } from '@/app/utils/api';

const fetchSimulation = async ({ id, ...req }: SimulationReq) => {
  return await fetchApi<SimulationRes>(`/simulations/${id}`, {
    method: 'GET',
    body: JSON.stringify(req),
  });
};

const fetchSimulationCreate = async (req: SimulationCreateReq) => {
  return await fetchApi<SimulationCreateRes>('/simulations', {
    method: 'POST',
    body: JSON.stringify(req),
  });
};

const fetchSimulationResult = async ({ id, password }: SimulationResultReq) => {
  return await fetchApi<SimulationResultRes>(
    `/simulations/${id}/result?password=${password}`,
    {
      method: 'GET',
    }
  );
};

export { fetchSimulation, fetchSimulationCreate, fetchSimulationResult };
