import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const deleteTrack = async (id: string): Promise<void> => {
  await api.delete(`/api/tracks/${id}`);
};
