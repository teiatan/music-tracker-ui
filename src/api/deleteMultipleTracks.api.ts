import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export interface DeleteMultipleTracksPayload {
  ids: string[];
}

export interface DeleteMultipleTracksResponse {
  success: string[];
  failed: string[];
}

export const deleteMultipleTracks = async (
  payload: DeleteMultipleTracksPayload
): Promise<DeleteMultipleTracksResponse> => {
  const response = await api.post<DeleteMultipleTracksResponse>('/api/tracks/delete', payload);
  return response.data;
};
