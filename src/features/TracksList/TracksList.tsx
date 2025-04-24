import React from 'react';
import { Track } from '../../api/types';
import styles from './TracksList.module.scss';

interface Props {
  tracks: Track[];
  selectionMode: boolean;
  toggleSelectionMode: () => void;
  playerTrack: Track | null;
  isPlaying: boolean;
  selectedTracksIds: string[];
  handlePlayClick: (track: Track) => void;
  handlePauseClick: () => void;
  handleEditClick: (track: Track) => void;
  handleDeleteClick: (track: Track) => void;
  handleUploadClick: (track: Track) => void;
  handleSelectionChange: (selectedIds: string[]) => void;
}

const TracksList = ({
  tracks,
  selectionMode,
  toggleSelectionMode,
  playerTrack,
  isPlaying,
  selectedTracksIds,
  handlePlayClick,
  handlePauseClick,
  handleEditClick,
  handleDeleteClick,
  handleUploadClick,
  handleSelectionChange,
}: Props) => {
  const allSelected = tracks.length > 0 && selectedTracksIds.length === tracks.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      handleSelectionChange([]);
    } else {
      handleSelectionChange(tracks.map((track) => track.id));
    }
  };

  const handleCheckboxChange = (id: string) => {
    const isSelected = selectedTracksIds.includes(id);
    const updatedSelected = isSelected
      ? selectedTracksIds.filter((trackId) => trackId !== id)
      : [...selectedTracksIds, id];

    handleSelectionChange(updatedSelected);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/headphones.svg';
  };

  return (
    <>
      {tracks.length > 1 && (
        <div className={styles.topControls}>
          <label className={styles.toggleWrapper}>
            <input
              type="checkbox"
              checked={selectionMode}
              onChange={toggleSelectionMode}
              className={styles.toggleCheckbox}
              data-testid="select-mode-toggle"
            />
            <span className={styles.toggleSlider} />
            <span className={styles.toggleLabel}>
              {selectionMode ? 'Selection mode ON' : 'Selection mode OFF'}
            </span>
          </label>
        </div>
      )}
      {selectionMode && tracks.length > 1 && (
        <div className={styles.selectAll}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            data-testid="select-all"
          />
          <label>Select all</label>
        </div>
      )}

      <ul className={styles.trackList}>
        {tracks.map((track: Track) => (
          <li key={track.id} data-testid={`track-item-${track.id}`} className={styles.track}>
            <div className={styles.trackInfo}>
              {selectionMode && tracks.length > 1 && (
                <input
                  type="checkbox"
                  checked={selectedTracksIds.includes(track.id)}
                  onChange={() => handleCheckboxChange(track.id)}
                  className={styles.checkbox}
                  aria-label="Select track"
                  data-testid={`track-checkbox-${track.id}`}
                />
              )}
              {playerTrack?.id === track.id && isPlaying ? (
                <button
                  className={styles.playButton}
                  data-testid={`pause-button-${track.id}`}
                  onClick={handlePauseClick}
                  aria-label="Pause"
                >
                  ⏸
                </button>
              ) : (
                <button
                  className={styles.playButton}
                  data-testid={`${track.audioFile ? 'play' : 'upload'}-track-${track.id}`}
                  onClick={() =>
                    track.audioFile ? handlePlayClick(track) : handleUploadClick(track)
                  }
                  aria-label="Play"
                >
                  {track.audioFile ? '▶' : '⬇'}
                </button>
              )}
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
    </>
  );
};

export default TracksList;
