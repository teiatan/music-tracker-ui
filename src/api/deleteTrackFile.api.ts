import axios from 'axios';
import { Track } from './types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const deleteTrackFile = async (id: string): Promise<Track> => {
  const response = await api.delete<Track>(`/api/tracks/${id}/file`);
  return response.data;
};
