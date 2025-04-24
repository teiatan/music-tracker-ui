import { renderHook, act, waitFor } from '@testing-library/react';
import { useTracks } from './useTracks';
import { getTracks as mockGetTracks } from '../api/getTracks.api';
import { useToast } from '../context/ToastContext';
import { Track } from '../api/types';

jest.mock('../api/getTracks.api');
jest.mock('../context/ToastContext', () => ({
  useToast: jest.fn(),
}));
jest.mock('../config', () => ({
  API_BASE_URL: 'http://localhost/',
}));

const mockedGetTracks = mockGetTracks as jest.Mock;
const mockedAddToast = jest.fn();
(useToast as jest.Mock).mockReturnValue({ addToast: mockedAddToast });

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Track 1',
    audioFile: 'track1.mp3',
    artist: '',
    album: '',
    genres: [],
    coverImage: '',
    slug: '',
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Track 2',
    audioFile: 'track2.mp3',
    artist: '',
    album: '',
    genres: [],
    coverImage: '',
    slug: '',
    createdAt: '',
    updatedAt: '',
  },
];

describe('useTracks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTracks.mockResolvedValue({
      data: mockTracks,
      meta: { total: 2, totalPages: 1 },
    });
  });

  it('loads tracks on mount', async () => {
    const { result } = renderHook(() => useTracks());
    await waitFor(() => {
      expect(result.current.state.tracks).toEqual(mockTracks);
    });
    expect(result.current.state.totalTracks).toBe(2);
    expect(mockedGetTracks).toHaveBeenCalledTimes(1);
  });

  it('sets and clears loading state', async () => {
    const { result } = renderHook(() => useTracks());

    expect(result.current.state.isLoading).toBe(true);

    await waitFor(() => expect(result.current.state.isLoading).toBe(false));
  });

  it('handles track play/pause', async () => {
    const { result } = renderHook(() => useTracks());
    await waitFor(() => expect(result.current.state.tracks).toEqual(mockTracks));

    const audioRef = result.current.state.audioRef;
    const play = jest.fn().mockResolvedValue(undefined);
    const pause = jest.fn();

    Object.defineProperty(audioRef, 'current', {
      value: { play, pause, currentTime: 0 },
      writable: true,
    });

    act(() => result.current.handlers.handlePlayClick(mockTracks[0]));
    expect(result.current.state.playerTrack).toEqual(mockTracks[0]);

    act(() => result.current.handlers.handlePauseClick());
    expect(pause).toHaveBeenCalled();
  });

  it('handles search text debouncing', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useTracks());

    act(() => {
      result.current.handlers.setSearchText('test');
    });

    expect(result.current.state.searchText).toBe('test');
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('handles error during track load', async () => {
    mockedGetTracks.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useTracks());

    await waitFor(() => expect(result.current.state.tracks).toEqual([]));
    expect(mockedAddToast).toHaveBeenCalledWith('Failed to load tracks', 'error');
  });
});
