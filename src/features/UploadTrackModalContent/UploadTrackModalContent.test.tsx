import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadTrackModalContent from './UploadTrackModalContent';
import { uploadTrackFile } from '../../api/uploadTrackFile.api';
import { deleteTrackFile } from '../../api/deleteTrackFile.api';
import { Track } from '../../api/types';

jest.mock('../../api/uploadTrackFile.api', () => ({
  uploadTrackFile: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../api/deleteTrackFile.api', () => ({
  deleteTrackFile: jest.fn().mockResolvedValue({}),
}));

jest.mock('../../context/ToastContext.tsx', () => ({
  useToast: () => ({
    addToast: jest.fn(),
  }),
}));

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: '',
  genres: [],
  coverImage: '',
  audioFile: 'audio.mp3',
  createdAt: '',
  slug: 'test-track',
  updatedAt: '',
};

describe('UploadTrackModalContent', () => {
  const onClose = jest.fn();
  const onUploaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with track title and delete button', () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    expect(screen.getByText(/Test Track/)).toBeInTheDocument();
    expect(screen.getByTestId('delete-audio-file')).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-input')).toBeInTheDocument();
  });

  it('shows error if no file is selected on upload', async () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    const uploadButton = screen.getByRole('button', { name: /^Upload$/i });
    fireEvent.click(uploadButton);
    await screen.findByText(/Please select a file/i);
  });

  it('shows error for invalid file type', async () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    const input = screen.getByTestId('upload-file-input') as HTMLInputElement;

    const invalidFile = new File(['text'], 'file.txt', { type: 'text/plain' });
    Object.defineProperty(input, 'files', { value: [invalidFile] });

    fireEvent.change(input);
    const uploadButton = screen.getByRole('button', { name: /^Upload$/i });
    fireEvent.click(uploadButton);

    await screen.findByText(/Only MP3 and WAV files are allowed/i);
  });

  it('shows error for file larger than 10MB', async () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    const input = screen.getByTestId('upload-file-input') as HTMLInputElement;

    const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'large.mp3', { type: 'audio/mp3' });
    Object.defineProperty(input, 'files', { value: [largeFile] });

    fireEvent.change(input);
    const uploadButton = screen.getByRole('button', { name: /^Upload$/i });
    fireEvent.click(uploadButton);

    await screen.findByText(/File is too large/i);
  });

  it('calls uploadTrackFile and onUploaded for valid file', async () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    const input = screen.getByTestId('upload-file-input') as HTMLInputElement;

    const validFile = new File(['test'], 'track.mp3', { type: 'audio/mp3' });
    Object.defineProperty(input, 'files', { value: [validFile] });

    fireEvent.change(input);
    const uploadButton = screen.getByRole('button', { name: /^Upload$/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(uploadTrackFile).toHaveBeenCalledWith('1', validFile);
      expect(onUploaded).toHaveBeenCalled();
    });
  });

  it('calls deleteTrackFile and onUploaded on delete', async () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    fireEvent.click(screen.getByTestId('delete-audio-file'));

    await waitFor(() => {
      expect(deleteTrackFile).toHaveBeenCalledWith('1');
      expect(onUploaded).toHaveBeenCalled();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<UploadTrackModalContent track={mockTrack} onClose={onClose} onUploaded={onUploaded} />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
});
