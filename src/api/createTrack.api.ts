import axios from 'axios';
import { CreateTrackPayload, CreatedTrackResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const createTrack = async (payload: CreateTrackPayload): Promise<CreatedTrackResponse> => {
  const response = await api.post('/api/tracks', payload);
  return response.data;
};
