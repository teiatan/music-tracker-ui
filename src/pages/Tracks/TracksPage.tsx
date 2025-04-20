import { useEffect, useState } from 'react';
import styles from './TracksPage.module.scss';
import { Order, Sort, Track } from '../../api/types';
// import Button from '../../components/Button/Button';
import { getTracks } from '../../api/getTracks.api';
import TrackAudioPlayer from '../../features/TrackAudioPlayer/TrackAudioPlayer';
import TracksList from '../../features/TracksList/TracksList';
import Pagination from '../../components/Pagination/Pagination';
import { getGenres } from '../../api/getGenres.api';

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
  const [selectedArtist, setSelectedArtist] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [sortBy, setSortBy] = useState<Sort>('title');
  const [sortOrder, setSortOrder] = useState<Order>('asc');

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
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const res = await getTracks({
          page: currentPage,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder,
          search: searchText,
          genre: selectedGenre,
          artist: selectedArtist,
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
  }, [currentPage, itemsPerPage, searchText, selectedArtist, selectedGenre, sortBy, sortOrder]);

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
      {tracks.length > 0 && currentTrack && (
        <TrackAudioPlayer track={currentTrack} onNext={handleNext} onPrev={handlePrev} />
      )}
      {/* <header className={styles.header}>
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
        <input
          type="text"
          placeholder="Search..."
          data-testid="search-input"
          className={styles.input}
        />

        <select data-testid="sort-select" className={styles.select}>
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
          <option value="createdAt">Created</option>
        </select>

        <input
          type="text"
          placeholder="Filter by genre"
          data-testid="filter-genre"
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Filter by artist"
          data-testid="filter-artist"
          className={styles.input}
        />
      </div> */}

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default TracksPage;
