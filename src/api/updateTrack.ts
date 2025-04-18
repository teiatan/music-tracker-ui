import axios from 'axios';
import { Track } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface UpdateTrackPayload {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
}

export const updateTrack = async (id: string, payload: UpdateTrackPayload): Promise<Track> => {
  const response = await api.put<Track>(`/api/tracks/${id}`, payload);
  return response.data;
};
