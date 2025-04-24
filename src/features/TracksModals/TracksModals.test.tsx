import { render, screen } from '@testing-library/react';
import TracksModals from './TracksModals';
import { Track } from '../../api/types';

jest.mock('../../components/Modal/Modal', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal">{children}</div>
  ),
}));

jest.mock('../TrackMetadataForm/TrackMetadataForm', () => ({
  __esModule: true,
  default: () => <div data-testid="track-form">TrackMetadataForm</div>,
}));

jest.mock('../DeleteTrackModalContent/DeleteTrackModalContent', () => ({
  __esModule: true,
  default: () => <div data-testid="delete-modal">DeleteTrackModalContent</div>,
}));

jest.mock('../UploadTrackModalContent/UploadTrackModalContent', () => ({
  __esModule: true,
  default: () => <div data-testid="upload-modal">UploadTrackModalContent</div>,
}));

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: '',
  genres: [],
  coverImage: '',
  audioFile: '',
  createdAt: '',
  slug: 'test-track',
  updatedAt: '',
};

describe('TracksModals', () => {
  const baseProps = {
    show: true,
    type: '',
    editingTrack: mockTrack,
    selectedIds: ['1', '2'],
    onClose: jest.fn(),
    onSuccess: jest.fn(),
    onUploadFileClick: jest.fn(),
  };

  it('renders nothing if show is false', () => {
    const { container } = render(<TracksModals {...baseProps} show={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if type is empty', () => {
    const { container } = render(<TracksModals {...baseProps} type="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders TrackMetadataForm for create-or-edit type', () => {
    render(<TracksModals {...baseProps} type="create-or-edit" />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('track-form')).toBeInTheDocument();
  });

  it('renders DeleteTrackModalContent for delete type', () => {
    render(<TracksModals {...baseProps} type="delete" />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('renders UploadTrackModalContent for upload-file type with editingTrack', () => {
    render(<TracksModals {...baseProps} type="upload-file" />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('upload-modal')).toBeInTheDocument();
  });

  it('does not render UploadTrackModalContent if editingTrack is missing', () => {
    const { queryByTestId } = render(
      <TracksModals {...baseProps} type="upload-file" editingTrack={null} />
    );
    expect(queryByTestId('upload-modal')).toBeNull();
  });
});
