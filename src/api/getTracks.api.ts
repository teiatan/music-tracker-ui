import axios from 'axios';
import { GetTracksResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface GetTracksParams {
  page?: number;
  limit?: number;
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  artist?: string;
}

export const getTracks = async (params?: GetTracksParams): Promise<GetTracksResponse> => {
  const response = await api.get<GetTracksResponse>('/api/tracks', { params });
  return response.data;
};
