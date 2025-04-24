import axios from 'axios';
import { CreateTrackPayload, CreatedTrackResponse } from './types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createTrack = async (payload: CreateTrackPayload): Promise<CreatedTrackResponse> => {
  const response = await api.post('/api/tracks', payload);
  return response.data;
};
