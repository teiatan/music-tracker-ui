import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteTrackModalContent from './DeleteTrackModalContent';
import '@testing-library/jest-dom';

jest.mock('../../api/deleteTrack.api', () => ({
  deleteTrack: jest.fn(),
}));

jest.mock('../../api/deleteMultipleTracks.api', () => ({
  deleteMultipleTracks: jest.fn(),
}));

jest.mock('../../api/deleteTrack.api', () => ({
  deleteTrack: jest.fn(),
}));
const { deleteTrack: mockDeleteTrack } = jest.requireMock('../../api/deleteTrack.api');
import { deleteMultipleTracks } from '../../api/deleteMultipleTracks.api';
const mockDeleteMultipleTracks = deleteMultipleTracks as jest.Mock;

describe('DeleteTrackModalContent', () => {
  const onClose = jest.fn();
  const onDeleted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders single delete confirmation with title', () => {
    render(
      <DeleteTrackModalContent
        trackIds={['123']}
        trackTitle="Test Track"
        onClose={onClose}
        onDeleted={onDeleted}
      />
    );

    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Track/)).toBeInTheDocument();
  });

  it('renders multiple delete confirmation', () => {
    render(
      <DeleteTrackModalContent trackIds={['123', '456']} onClose={onClose} onDeleted={onDeleted} />
    );

    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        (_content, node) => node?.textContent === 'Are you sure you want to delete 2 tracks?'
      )
    ).toBeInTheDocument();
  });

  it('calls deleteTrack and onDeleted for single track', async () => {
    mockDeleteTrack.mockResolvedValueOnce({});
    render(
      <DeleteTrackModalContent
        trackIds={['123']}
        trackTitle="Test Track"
        onClose={onClose}
        onDeleted={onDeleted}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-delete'));

    await waitFor(() => {
      expect(mockDeleteTrack).toHaveBeenCalledWith('123');
      expect(onDeleted).toHaveBeenCalled();
    });
  });

  it('calls deleteMultipleTracks and onDeleted for multiple tracks', async () => {
    mockDeleteMultipleTracks.mockResolvedValueOnce({});
    render(
      <DeleteTrackModalContent trackIds={['123', '456']} onClose={onClose} onDeleted={onDeleted} />
    );

    fireEvent.click(screen.getByTestId('confirm-delete'));

    await waitFor(() => {
      expect(mockDeleteMultipleTracks).toHaveBeenCalledWith({ ids: ['123', '456'] });
      expect(onDeleted).toHaveBeenCalled();
    });
  });

  it('shows error on deletion failure', async () => {
    mockDeleteTrack.mockRejectedValueOnce(new Error('Fail'));
    render(
      <DeleteTrackModalContent
        trackIds={['123']}
        trackTitle="Track"
        onClose={onClose}
        onDeleted={onDeleted}
      />
    );

    fireEvent.click(screen.getByTestId('confirm-delete'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete track/i)).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <DeleteTrackModalContent
        trackIds={['123']}
        trackTitle="Track"
        onClose={onClose}
        onDeleted={onDeleted}
      />
    );

    fireEvent.click(screen.getByTestId('cancel-delete'));
    expect(onClose).toHaveBeenCalled();
  });
});
