import { render, screen, fireEvent } from '@testing-library/react';
import TracksControls from './TracksControls';
import { Order, Sort } from '../../api/types';

jest.mock('../../features/GenreSelect/GenreSelect', () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }) => (
    <select data-testid="genre-select" value={value} onChange={onChange}>
      <option value="">All</option>
      <option value="Rock">Rock</option>
    </select>
  ),
}));

describe('TracksControls', () => {
  const props = {
    searchText: '',
    artistFilter: '',
    selectedGenre: '',
    sortBy: 'title' as Sort,
    sortOrder: 'asc' as Order,
    selectedTracksIds: [],
    setSearchText: jest.fn(),
    setArtistFilter: jest.fn(),
    setSelectedGenre: jest.fn(),
    setSortBy: jest.fn(),
    setSortOrder: jest.fn(),
    onBulkDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input and select fields', () => {
    render(<TracksControls {...props} />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('filter-artist')).toBeInTheDocument();
    expect(screen.getByTestId('genre-select')).toBeInTheDocument();
    expect(screen.getByTestId('sort-select')).toBeInTheDocument();
  });

  it('calls setSearchText on search input change', () => {
    render(<TracksControls {...props} />);
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'test' } });
    expect(props.setSearchText).toHaveBeenCalledWith('test');
  });

  it('calls setArtistFilter on artist input change', () => {
    render(<TracksControls {...props} />);
    fireEvent.change(screen.getByTestId('filter-artist'), { target: { value: 'artist' } });
    expect(props.setArtistFilter).toHaveBeenCalledWith('artist');
  });

  it('calls setSelectedGenre on genre select change', () => {
    render(<TracksControls {...props} />);
    fireEvent.change(screen.getByTestId('genre-select'), { target: { value: 'Rock' } });
    expect(props.setSelectedGenre).toHaveBeenCalledWith('Rock');
  });

  it('calls setSortBy on sort select change', () => {
    render(<TracksControls {...props} />);
    fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'artist' } });
    expect(props.setSortBy).toHaveBeenCalledWith('artist');
  });

  it('calls setSortOrder on sort order change', () => {
    render(<TracksControls {...props} />);
    fireEvent.change(screen.getByDisplayValue('Ascending'), { target: { value: 'desc' } });
    expect(props.setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('shows and triggers bulk delete button when selectedTracksIds is not empty', () => {
    const updatedProps = {
      ...props,
      selectedTracksIds: ['1', '2'],
    };
    render(<TracksControls {...updatedProps} />);
    const btn = screen.getByTestId('bulk-delete-button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(props.onBulkDelete).toHaveBeenCalled();
  });

  it('does not show bulk delete button when no tracks are selected', () => {
    render(<TracksControls {...props} />);
    expect(screen.queryByTestId('bulk-delete-button')).not.toBeInTheDocument();
  });
});
