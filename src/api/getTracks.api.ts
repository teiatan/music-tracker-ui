import axios from 'axios';
import { GetTracksResponse, Order, Sort } from './types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export interface GetTracksParams {
  page?: number;
  limit?: number;
  sort?: Sort;
  order?: Order;
  search?: string;
  genre?: string;
  artist?: string;
}

export const getTracks = async (params?: GetTracksParams): Promise<GetTracksResponse> => {
  const response = await api.get<GetTracksResponse>('/api/tracks', { params });
  return response.data;
};
