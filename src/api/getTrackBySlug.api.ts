import axios from 'axios';
import { Track } from './types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTrackBySlug = async (slug: string): Promise<Track> => {
  const response = await api.get<Track>(`/api/tracks/${slug}`);
  return response.data;
};
