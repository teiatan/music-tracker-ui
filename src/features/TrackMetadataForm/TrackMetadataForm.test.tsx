import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrackMetadataForm from './TrackMetadataForm';
import { createTrack } from '../../api/createTrack.api';
import { updateTrack } from '../../api/updateTrack';

jest.mock('../../api/createTrack.api', () => ({
  createTrack: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../api/updateTrack', () => ({
  updateTrack: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../api/deleteTrackFile.api', () => ({
  deleteTrackFile: jest.fn().mockResolvedValue({}),
}));

jest.mock('../GenreSelect/GenreSelect', () => ({
  __esModule: true,
  default: ({ onGenreClick }: { onGenreClick: (g: string) => void }) => (
    <button onClick={() => onGenreClick('Jazz')} data-testid="mock-genre">
      Add Jazz
    </button>
  ),
}));

beforeAll(() => {
  // @ts-expect-error: Mocking window.Image for testing purposes
  window.Image = class {
    _src = '';
    set src(value: string) {
      this._src = value;
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
    get src() {
      return this._src;
    }
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
  };
});

describe('TrackMetadataForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<TrackMetadataForm onSuccess={mockOnSuccess} />);
    expect(screen.getByTestId('input-title')).toBeInTheDocument();
    expect(screen.getByTestId('input-artist')).toBeInTheDocument();
    expect(screen.getByTestId('input-album')).toBeInTheDocument();
    expect(screen.getByTestId('input-cover-image')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('shows validation errors if required fields are missing', async () => {
    render(<TrackMetadataForm onSuccess={mockOnSuccess} />);
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-title')).toBeInTheDocument();
      expect(screen.getByTestId('error-artist')).toBeInTheDocument();
      expect(screen.getByTestId('error-genre')).toBeInTheDocument();
    });

    expect(createTrack).not.toHaveBeenCalled();
  });

  it('submits form with valid data (create)', async () => {
    render(<TrackMetadataForm onSuccess={mockOnSuccess} />);

    fireEvent.change(screen.getByTestId('input-title'), {
      target: { value: 'Title' },
    });
    fireEvent.change(screen.getByTestId('input-artist'), {
      target: { value: 'Artist' },
    });
    fireEvent.change(screen.getByTestId('input-cover-image'), {
      target: { value: 'https://via.placeholder.com/150.jpg' },
    });

    fireEvent.click(screen.getByTestId('mock-genre'));
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(createTrack).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('submits form with valid data (update)', async () => {
    render(
      <TrackMetadataForm
        onSuccess={mockOnSuccess}
        trackId="1"
        initialValues={{
          id: '1',
          title: 'Existing',
          artist: 'Old Artist',
          album: '',
          genres: ['Jazz'],
          coverImage: '',
          audioFile: '',
          createdAt: '',
          slug: 'existing-track',
          updatedAt: '',
        }}
      />
    );

    fireEvent.change(screen.getByTestId('input-title'), {
      target: { value: 'Updated Title' },
    });

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(updateTrack).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ title: 'Updated Title' })
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
