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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [track.id]);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;

    if (!audio || !canvas) return;

    if (!contextRef.current) {
      contextRef.current = new AudioContext();
    }

    const context = contextRef.current;

    // ⚠️ avoid creating multiple sources for the same media element
    if (!sourceRef.current) {
      sourceRef.current = context.createMediaElementSource(audio);
    }

    if (!analyserRef.current) {
      analyserRef.current = context.createAnalyser();
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(context.destination);
    }

    const analyser = analyserRef.current;
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        canvasCtx.fillStyle = '#1976d2';
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  const handleEnded = () => {
    onNext?.();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/headphones.svg';
  };

  return (
    <div className={styles.player}>
      <div className={styles.coverWrapper}>
        <img
          src={track.coverImage || '/headphones.svg'}
          alt={track.title}
          className={styles.cover}
          onError={handleImageError}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>{track.title}</h3>
          <p className={styles.artist}>
            {track.artist} — <em>{track.album}</em>
          </p>
          <div className={styles.genres}>
            {track.genres.map((genre) => (
              <span key={genre} className={styles.genre}>
                {genre}
              </span>
            ))}
          </div>
        </div>

        <canvas ref={canvasRef} width={500} height={60} className={styles.waveform} />

        <div className={styles.controls}>
          <button className={styles.navButton} onClick={onPrev} aria-label="Previous track">
            ◀
          </button>
          <audio
            ref={audioRef}
            controls
            onEnded={handleEnded}
            crossOrigin="anonymous"
            src={`${import.meta.env.VITE_API_BASE_URL}api/files/${track.audioFile}`}
          />
          <button className={styles.navButton} onClick={onNext} aria-label="Next track">
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackAudioPlayer;
