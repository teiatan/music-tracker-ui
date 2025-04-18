export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
  slug: string;
  audioFile: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackPayload {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
}

export interface CreatedTrackResponse extends Omit<Track, 'updatedAt'> {
  createdBy?: string;
}

export interface TracksMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTracksResponse {
  data: Track[];
  meta: TracksMeta;
}
