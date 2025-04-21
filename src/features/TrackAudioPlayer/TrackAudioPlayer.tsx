import { useEffect, useRef } from 'react';
import styles from './TrackAudioPlayer.module.scss';
import { Track } from '../../api/types';

interface Props {
  track: Track;
  onNext?: () => void;
  onPrev?: () => void;
}

const TrackAudioPlayer = ({ track, onNext, onPrev }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [track.id]);

  const handleEnded = () => {
    onNext?.();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/headphones.svg';
  };

  return (
    <div className={styles.player}>
      <img
        src={track.coverImage || '/headphones.svg'}
        alt={track.title}
        className={styles.cover}
        onError={handleImageError}
      />
      <div className={styles.info}>
        <h3>{track.title}</h3>
        <p>
          {track.artist} — {track.album}
        </p>
        <div className={styles.genres}>
          {track.genres.map((genre) => (
            <span key={genre} className={styles.genre}>
              {genre}
            </span>
          ))}
        </div>
        <div className={styles.controls}>
          <button onClick={onPrev} aria-label="Previous track">
            ◀
          </button>
          <audio
            ref={audioRef}
            controls
            onEnded={handleEnded}
            data-testid={`audio-player-${track.id}`}
            src={track.audioFile}
          />
          <button onClick={onNext} aria-label="Next track">
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackAudioPlayer;
