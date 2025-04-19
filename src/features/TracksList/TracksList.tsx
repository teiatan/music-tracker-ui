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
  return (
    <ul className={styles.trackList}>
      {tracks.map((track: Track) => (
        <li key={track.id} data-testid={`track-item-${track.id}`} className={styles.track}>
          <div className={styles.trackInfo}>
            {track.audioFile ? (
              <button
                className={styles.playButton}
                data-testid={`play-button-${track.id}`}
                onClick={() => handlePlayClick(track)}
                aria-label="Play"
              >
                ▶
              </button>
            ) : (
              <button
                className={styles.uploadButton}
                data-testid={`upload-track-${track.id}`}
                onClick={() => handleUploadClick(track)}
                aria-label="Upload Audio"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5-.5h3.5V1.5a.5.5 0 0 1 1 0v7.9H9a.5.5 0 0 1 0 1H5.5v7.9a.5.5 0 0 1-1 0V10.9H1a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>
            )}
            <div className={styles.trackDetails}>
              <div data-testid={`track-item-${track.id}-title`} className={styles.trackTitle}>
                {track.title}
              </div>
              <div data-testid={`track-item-${track.id}-artist`} className={styles.trackArtist}>
                {track.artist}
              </div>
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
