import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFoundPage from './NotFoundPage';
import '@testing-library/jest-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders 404 text and button', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404 – Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to tracks/i })).toBeInTheDocument();
  });

  it('navigates to /tracks when button is clicked', async () => {
    render(<NotFoundPage />);
    const button = screen.getByRole('button', { name: /go to tracks/i });
    await userEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/tracks');
  });
});
