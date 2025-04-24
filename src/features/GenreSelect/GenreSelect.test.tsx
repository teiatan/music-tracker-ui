import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import GenreSelect from './GenreSelect';
import '@testing-library/jest-dom';

jest.mock('../../api/getGenres.api', () => ({
  getGenres: jest.fn(),
}));

import { getGenres } from '../../api/getGenres.api';
const mockGetGenres = getGenres as jest.Mock;

describe('GenreSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays genres as buttons in button mode', async () => {
    mockGetGenres.mockResolvedValueOnce(['Pop', 'EDM']);

    render(<GenreSelect mode="button" />);

    await waitFor(() => {
      expect(screen.queryByText('Pop')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+' }));

    expect(await screen.findByText('Pop')).toBeInTheDocument();
    expect(await screen.findByText('EDM')).toBeInTheDocument();
  });

  it('calls onGenreClick and closes dropdown when genre is clicked', async () => {
    const onGenreClick = jest.fn();
    mockGetGenres.mockResolvedValueOnce(['Hip-hop']);

    render(<GenreSelect mode="button" onGenreClick={onGenreClick} />);

    await waitFor(() => {
      expect(screen.queryByText('Hip-hop')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: '+' }));

    const genreButton = await screen.findByText('Hip-hop');
    fireEvent.click(genreButton);

    expect(onGenreClick).toHaveBeenCalledWith('Hip-hop');
    expect(screen.queryByText('Hip-hop')).not.toBeInTheDocument();
  });

  it('fetches and displays genres in select mode', async () => {
    mockGetGenres.mockResolvedValueOnce(['Rock', 'Jazz']);

    render(<GenreSelect onChange={() => {}} />);

    await waitFor(() => {
      expect(screen.getByTestId('filter-genre')).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Rock' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Jazz' })).toBeInTheDocument();
    });
  });

  it('filters out genres using excludeGenres', async () => {
    mockGetGenres.mockResolvedValueOnce(['Classical', 'Rock', 'Jazz']);

    render(<GenreSelect excludeGenres={['Rock']} onChange={() => {}} />); // ✅ додано onChange

    await waitFor(() => {
      expect(screen.queryByRole('option', { name: 'Rock' })).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Jazz' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Classical' })).toBeInTheDocument();
    });
  });

  it('disables select while loading', async () => {
    let resolveFn: (value: string[]) => void = () => {};
    mockGetGenres.mockImplementationOnce(() => new Promise((resolve) => (resolveFn = resolve)));

    render(<GenreSelect onChange={() => {}} />);

    const select = screen.getByTestId('filter-genre');
    expect(select).toBeDisabled();

    resolveFn(['Metal']);
    await waitFor(() => expect(select).not.toBeDisabled());
  });
});
