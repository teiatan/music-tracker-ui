import { render, screen, fireEvent } from '@testing-library/react';
import TracksList from './TracksList';
import { Track } from '../../api/types';

const tracks: Track[] = [
  {
    id: '1',
    title: 'Track 1',
    artist: 'Artist 1',
    album: 'Album 1',
    genres: ['Rock'],
    coverImage: '',
    audioFile: 'file.mp3',
    createdAt: '',
    slug: 'track-1',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Track 2',
    artist: 'Artist 2',
    album: '',
    genres: ['Jazz'],
    coverImage: '',
    audioFile: '',
    createdAt: '',
    slug: 'track-2',
    updatedAt: '',
  },
];

const baseProps = {
  tracks,
  selectionMode: false,
  toggleSelectionMode: jest.fn(),
  playerTrack: null,
  isPlaying: false,
  selectedTracksIds: [],
  handlePlayClick: jest.fn(),
  handlePauseClick: jest.fn(),
  handleEditClick: jest.fn(),
  handleDeleteClick: jest.fn(),
  handleUploadClick: jest.fn(),
  handleSelectionChange: jest.fn(),
};

describe('TracksList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of tracks with details', () => {
    render(<TracksList {...baseProps} />);
    expect(screen.getByTestId('track-item-1-title')).toHaveTextContent('Track 1');
    expect(screen.getByTestId('track-item-2-title')).toHaveTextContent('Track 2');
  });

  it('renders play and upload buttons correctly', () => {
    render(<TracksList {...baseProps} />);
    expect(screen.getByTestId('play-track-1')).toBeInTheDocument();
    expect(screen.getByTestId('upload-track-2')).toBeInTheDocument();
  });

  it('calls handlePlayClick and handleUploadClick correctly', () => {
    render(<TracksList {...baseProps} />);
    fireEvent.click(screen.getByTestId('play-track-1'));
    fireEvent.click(screen.getByTestId('upload-track-2'));
    expect(baseProps.handlePlayClick).toHaveBeenCalledWith(tracks[0]);
    expect(baseProps.handleUploadClick).toHaveBeenCalledWith(tracks[1]);
  });

  it('calls handlePauseClick when playerTrack is playing', () => {
    render(<TracksList {...baseProps} playerTrack={tracks[0]} isPlaying={true} />);
    fireEvent.click(screen.getByTestId('pause-button-1'));
    expect(baseProps.handlePauseClick).toHaveBeenCalled();
  });

  it('calls handleEditClick and handleDeleteClick', () => {
    render(<TracksList {...baseProps} />);
    fireEvent.click(screen.getByTestId('edit-track-1'));
    fireEvent.click(screen.getByTestId('delete-track-1'));
    expect(baseProps.handleEditClick).toHaveBeenCalledWith(tracks[0]);
    expect(baseProps.handleDeleteClick).toHaveBeenCalledWith(tracks[0]);
  });

  it('toggles selection mode', () => {
    render(<TracksList {...baseProps} />);
    fireEvent.click(screen.getByTestId('select-mode-toggle'));
    expect(baseProps.toggleSelectionMode).toHaveBeenCalled();
  });

  it('shows checkboxes in selection mode and allows selection', () => {
    render(<TracksList {...baseProps} selectionMode={true} selectedTracksIds={['2']} />);
    fireEvent.click(screen.getByTestId('track-checkbox-1'));
    expect(baseProps.handleSelectionChange).toHaveBeenCalledWith(['2', '1']);
  });

  it('allows selecting all tracks', () => {
    render(<TracksList {...baseProps} selectionMode={true} selectedTracksIds={['1']} />);
    fireEvent.click(screen.getByTestId('select-all'));
    expect(baseProps.handleSelectionChange).toHaveBeenCalledWith(['1', '2']);
  });

  it('deselects all if already all selected', () => {
    render(<TracksList {...baseProps} selectionMode={true} selectedTracksIds={['1', '2']} />);
    fireEvent.click(screen.getByTestId('select-all'));
    expect(baseProps.handleSelectionChange).toHaveBeenCalledWith([]);
  });
});
