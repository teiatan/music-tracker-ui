import axios from 'axios';
import { Track } from './types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
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
