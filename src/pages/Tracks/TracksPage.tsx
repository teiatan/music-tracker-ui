import { useEffect, useState } from 'react';
import styles from './TracksPage.module.scss';
import { Track } from '../../api/types';
// import Button from '../../components/Button/Button';
import { getTracks } from '../../api/getTracks.api';
import TrackAudioPlayer from '../../features/TrackAudioPlayer/TrackAudioPlayer';
import TracksList from '../../features/TracksList/TracksList';

const TracksPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

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
        const res = await getTracks({ page: 1, limit: 10 });
        setTracks(res.data);
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
        <TracksList
          tracks={tracks}
          handlePlayClick={(track) => setCurrentTrack(track)}
          handleEditClick={(track) => console.log('Edit', track)}
          handleDeleteClick={(track) => console.log('Delete', track)}
          handleUploadClick={(track) => console.log('Upload', track)}
        />
      )}

      {/* <div data-testid="pagination" className={styles.pagination}>
        <button data-testid="pagination-prev">Prev</button>
        <span>1</span>
        <button data-testid="pagination-next">Next</button>
      </div> */}
    </div>
  );
};

export default TracksPage;
