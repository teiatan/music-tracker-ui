import { render, screen, fireEvent } from '@testing-library/react';
import TrackAudioPlayer from './TrackAudioPlayer';
import { Track } from '../../api/types';

const mockTrack: Track = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock', 'Jazz'],
  coverImage: '',
  audioFile: 'test-audio.mp3',
  createdAt: '',
  slug: 'test-track',
  updatedAt: '',
};

jest.mock('../../config', () => ({
  API_BASE_URL: 'http://localhost/',
}));

beforeAll(() => {
  class MockAudioContext {
    createMediaElementSource() {
      return {
        connect: jest.fn(),
      };
    }
    createAnalyser() {
      return {
        connect: jest.fn(),
        fftSize: 0,
        frequencyBinCount: 32,
        getByteFrequencyData: jest.fn(),
      };
    }
    destination = {};
  }

  global.AudioContext = MockAudioContext as unknown as typeof AudioContext;
});

describe('TrackAudioPlayer', () => {
  let audioRef: React.RefObject<HTMLAudioElement>;

  beforeEach(() => {
    audioRef = { current: document.createElement('audio') };
  });

  it('renders track info and genres', () => {
    render(<TrackAudioPlayer track={mockTrack} audioRef={audioRef} />);
    expect(screen.getByText(/Test Track/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Artist/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Album/i)).toBeInTheDocument();
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });

  it('renders audio element with correct src', () => {
    render(<TrackAudioPlayer track={mockTrack} audioRef={audioRef} />);
    const audio = screen.getByTestId('audio-player-1') as HTMLAudioElement;
    expect(audio).toBeInTheDocument();
    expect(audio.src).toContain('/api/files/test-audio.mp3');
  });

  it('calls onNext when audio ends', () => {
    const onNext = jest.fn();
    render(<TrackAudioPlayer track={mockTrack} audioRef={audioRef} onNext={onNext} />);
    const audio = screen.getByTestId('audio-player-1') as HTMLAudioElement;
    fireEvent.ended(audio);
    expect(onNext).toHaveBeenCalled();
  });

  it('calls handlePlaying on play and pause', () => {
    const handlePlaying = jest.fn();
    render(
      <TrackAudioPlayer track={mockTrack} audioRef={audioRef} handlePlaying={handlePlaying} />
    );
    const audio = screen.getByTestId('audio-player-1') as HTMLAudioElement;
    fireEvent.play(audio);
    fireEvent.pause(audio);
    expect(handlePlaying).toHaveBeenCalledWith(true);
    expect(handlePlaying).toHaveBeenCalledWith(false);
  });

  it('calls onPrev and onNext when nav buttons are clicked', () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();
    render(
      <TrackAudioPlayer track={mockTrack} audioRef={audioRef} onPrev={onPrev} onNext={onNext} />
    );
    fireEvent.click(screen.getByLabelText(/Previous track/i));
    fireEvent.click(screen.getByLabelText(/Next track/i));
    expect(onPrev).toHaveBeenCalled();
    expect(onNext).toHaveBeenCalled();
  });
});
