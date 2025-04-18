import axios from 'axios';
import { Track } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getTrackBySlug = async (slug: string): Promise<Track> => {
  const response = await api.get<Track>(`/api/tracks/${slug}`);
  return response.data;
};
