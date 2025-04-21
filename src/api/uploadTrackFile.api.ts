import axios from 'axios';
import { Track } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const uploadTrackFile = async (id: string, file: File): Promise<Track> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<Track>(`/api/tracks/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
