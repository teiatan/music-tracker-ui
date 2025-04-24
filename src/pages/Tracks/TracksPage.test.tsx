import { render, screen } from '@testing-library/react';
import TracksPage from './TracksPage';
import '@testing-library/jest-dom';

jest.mock('../../utils/useTracks');
import { useTracks } from '../../utils/useTracks';

jest.mock('../../config', () => ({
  API_BASE_URL: 'http://localhost/',
}));

jest.mock('../../api/getGenres.api', () => ({
  getGenres: jest.fn().mockResolvedValue(['Rock', 'Jazz', 'Pop']),
}));

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const baseState = {
  isLoading: false,
  tracks: [],
  selectedTracksIds: [],
  totalTracks: 3,
  isPlaying: false,
  playerTrack: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  selectedGenre: '', // ← тут виправлено
  searchText: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  showModal: false,
  modalType: null,
  editingTrack: null,
  audioRef: { current: null },
};

const baseHandlers = {
  handleNext: jest.fn(),
  handlePrev: jest.fn(),
  setIsPlaying: jest.fn(),
  setShowModal: jest.fn(),
  setModalType: jest.fn(),
  setSearchText: jest.fn(),
  setSelectedGenre: jest.fn(),
  setSortBy: jest.fn(),
  setSortOrder: jest.fn(),
  setCurrentPage: jest.fn(),
  setItemsPerPage: jest.fn(),
  handlePlayClick: jest.fn(),
  handlePauseClick: jest.fn(),
  handleEditClick: jest.fn(),
  handleDeleteClick: jest.fn(),
  handleUploadFileClick: jest.fn(),
  setSelectedTracksIds: jest.fn(),
  handleCloseModal: jest.fn(),
  handleSuccessCreateOrEdit: jest.fn(),
};

describe('TracksPage', () => {
  it('renders without crashing', () => {
    (useTracks as jest.Mock).mockReturnValue({
      state: baseState,
      handlers: baseHandlers,
    });

    render(<TracksPage />);
    expect(screen.getByText(/Tracks found/i)).toBeInTheDocument();
  });

  it('shows loading message when isLoading is true', () => {
    (useTracks as jest.Mock).mockImplementationOnce(() => ({
      state: {
        ...baseState,
        isLoading: true,
        totalTracks: 0,
      },
      handlers: baseHandlers,
    }));

    render(<TracksPage />);
    expect(screen.getByTestId('loading-tracks')).toBeInTheDocument();
  });
});
