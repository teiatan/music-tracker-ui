import { useEffect, useMemo, useState } from 'react';
import styles from './TracksPage.module.scss';
import { Order, Sort, Track } from '../../api/types';
import Button from '../../components/Button/Button';
import { getTracks } from '../../api/getTracks.api';
import TrackAudioPlayer from '../../features/TrackAudioPlayer/TrackAudioPlayer';
import TracksList from '../../features/TracksList/TracksList';
import Pagination from '../../components/Pagination/Pagination';
import { getGenres } from '../../api/getGenres.api';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import debounce from 'lodash/debounce';

const TracksPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [sortBy, setSortBy] = useState<Sort>('createdAt');
  const [sortOrder, setSortOrder] = useState<Order>('asc');
  const debouncedSearchText = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    debouncedSearchText(searchText);
    return () => {
      debouncedSearchText.cancel();
    };
  }, [searchText]);

  const handleNext = () => {
    if (!currentTrack) return;

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      const nextTrack = tracks[currentIndex + 1];
      setCurrentTrack(nextTrack);
    }
  };

  const handlePrev = () => {
    if (!currentTrack) return;

    const currentIndex = tracks.findIndex((track) => track.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = tracks[currentIndex - 1];
      setCurrentTrack(prevTrack);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchText, selectedGenre, sortBy, sortOrder]);

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const res = await getTracks({
          page: currentPage,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder,
          search: debouncedSearch,
          genre: selectedGenre,
        });
        setTracks(res.data);
        setTotalPages(res.meta.totalPages);
        setTotalTracks(res.meta.total);
        if (res.data.length > 0) {
          setCurrentTrack(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, [currentPage, itemsPerPage, debouncedSearch, selectedGenre, sortBy, sortOrder]);

  useEffect(() => {
    const fetchGenres = async () => {
      getGenres()
        .then((response) => {
          setGenres(response);
        })
        .catch((error) => {
          console.error('Error fetching genres:', error);
        });
    };

    fetchGenres();
  }, []);

  return (
    <div className={styles.page}>
      {currentTrack && (
        <TrackAudioPlayer track={currentTrack} onNext={handleNext} onPrev={handlePrev} />
      )}
      <header className={styles.header}>
        <h1 data-testid="tracks-header">Tracks</h1>
        <Button
          variant="primary"
          data-testid="create-track-button"
          onClick={() => {
            // Відкрити модалку
          }}
        >
          Create Track
        </Button>
      </header>

      <div className={styles.controls}>
        <Input
          title="Search"
          data-testid="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
        <Select
          title="Genre"
          data-testid="genre-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className={styles.genreSelect}
        >
          <option value="">Select genre</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>

        <Select
          title="Sort by"
          data-testid="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as Sort)}
          className={styles.sortBySelect}
        >
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
          <option value="createdAt">Created date</option>
        </Select>

        <Select
          title="Sort order"
          data-testid="order-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as Order)}
          className={styles.orderSelect}
        >
          <option value="">Sort order</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
      </div>

      {isLoading ? (
        <div data-testid="loading-tracks" data-loading="true">
          Loading...
        </div>
      ) : (
        <>
          <p>Tracks found {totalTracks}</p>
          <TracksList
            tracks={tracks}
            handlePlayClick={(track) => setCurrentTrack(track)}
            handleEditClick={(track) => console.log('Edit', track)}
            handleDeleteClick={(track) => console.log('Delete', track)}
            handleUploadClick={(track) => console.log('Upload', track)}
          />
        </>
      )}

      {totalTracks > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      )}
    </div>
  );
};

export default TracksPage;
