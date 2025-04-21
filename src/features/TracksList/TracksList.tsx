import { Track } from '../../api/types';
import styles from './TracksList.module.scss';

interface Props {
  tracks: Track[];
  handlePlayClick: (track: Track) => void;
  handleEditClick: (track: Track) => void;
  handleDeleteClick: (track: Track) => void;
  handleUploadClick: (track: Track) => void;
}

const TracksList = ({
  tracks,
  handlePlayClick,
  handleEditClick,
  handleDeleteClick,
  handleUploadClick,
}: Props) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/headphones.svg';
  };

  return (
    <ul className={styles.trackList}>
      {tracks.map((track: Track) => (
        <li key={track.id} data-testid={`track-item-${track.id}`} className={styles.track}>
          <div className={styles.trackInfo}>
            <button
              className={styles.playButton}
              data-testid={`play-button-${track.id}`}
              onClick={() => (track.audioFile ? handlePlayClick(track) : handleUploadClick(track))}
              aria-label="Play"
            >
              {track.audioFile ? '▶' : '⬆'}
            </button>
            <img
              src={track.coverImage || '/headphones.svg'}
              alt="Cover"
              className={styles.coverImage}
              onError={handleImageError}
            />

            <div className={styles.trackDetails}>
              <div data-testid={`track-item-${track.id}-title`} className={styles.trackTitle}>
                {track.title}
              </div>
              <div data-testid={`track-item-${track.id}-artist`} className={styles.trackArtist}>
                {track.artist}
              </div>
              {track.album && (
                <div className={styles.trackAlbum}>
                  <em>{track.album}</em>
                </div>
              )}
            </div>
          </div>

          <div className={styles.trackActions}>
            <button
              data-testid={`edit-track-${track.id}`}
              onClick={() => handleEditClick(track)}
              className={styles.actionButton}
            >
              Edit
            </button>
            <button
              data-testid={`delete-track-${track.id}`}
              onClick={() => handleDeleteClick(track)}
              className={styles.actionButton}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TracksList;
