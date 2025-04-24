import { render, screen, fireEvent } from '@testing-library/react';
import TracksHeader from './TracksHeader';

describe('TracksHeader', () => {
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and button', () => {
    render(<TracksHeader onCreate={mockOnCreate} />);

    expect(screen.getByTestId('tracks-header')).toBeInTheDocument();
    expect(screen.getByText(/Tracks/i)).toBeInTheDocument();

    const button = screen.getByTestId('create-track-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Create Track/i);
  });

  it('calls onCreate when button is clicked', () => {
    render(<TracksHeader onCreate={mockOnCreate} />);

    fireEvent.click(screen.getByTestId('create-track-button'));
    expect(mockOnCreate).toHaveBeenCalled();
  });
});
