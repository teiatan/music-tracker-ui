import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const getGenres = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/api/genres');
  return response.data;
};
