import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getGenres = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/api/genres');
  return response.data;
};
