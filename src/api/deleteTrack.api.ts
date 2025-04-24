import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const deleteTrack = async (id: string): Promise<void> => {
  await api.delete(`/api/tracks/${id}`);
};
