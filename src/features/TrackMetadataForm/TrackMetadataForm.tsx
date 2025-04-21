import React, { useState } from 'react';

import styles from './TrackMetadataForm.module.scss';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import GenreSelect from '../GenreSelect/GenreSelect';
import { createTrack } from '../../api/createTrack.api';
import { updateTrack } from '../../api/updateTrack';

export interface TrackMetadataFormValues {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImageUrl: string;
}

interface TrackMetadataFormProps {
  initialValues?: TrackMetadataFormValues;
  trackId?: string;
  onSuccess?: () => void;
}

const TrackMetadataForm: React.FC<TrackMetadataFormProps> = ({
  initialValues,
  trackId,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TrackMetadataFormValues>({
    title: '',
    artist: '',
    album: '',
    genres: [],
    coverImageUrl: '',
    ...initialValues,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newGenre, setNewGenre] = useState('');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.artist.trim()) errs.artist = 'Artist is required';

    if (
      formData.coverImageUrl &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(formData.coverImageUrl)
    ) {
      errs.coverImageUrl = 'Invalid image URL';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof TrackMetadataFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGenre = () => {
    if (newGenre && !formData.genres.includes(newGenre)) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, newGenre],
      }));
    }
    setNewGenre('');
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (trackId) {
        await updateTrack(trackId, {
          title: formData.title,
          artist: formData.artist,
          album: formData.album,
          genres: formData.genres,
          coverImage: formData.coverImageUrl,
        });
      } else {
        await createTrack({
          title: formData.title,
          artist: formData.artist,
          album: formData.album,
          genres: formData.genres,
          coverImage: formData.coverImageUrl,
        });
      }

      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit track', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} data-testid="track-form">
      <Input
        title="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        data-testid="input-title"
      />
      {errors.title && (
        <div className={styles.error} data-testid="error-title">
          {errors.title}
        </div>
      )}

      <Input
        title="Artist"
        value={formData.artist}
        onChange={(e) => handleChange('artist', e.target.value)}
        data-testid="input-artist"
      />
      {errors.artist && (
        <div className={styles.error} data-testid="error-artist">
          {errors.artist}
        </div>
      )}

      <Input
        title="Album"
        value={formData.album}
        onChange={(e) => handleChange('album', e.target.value)}
        data-testid="input-album"
      />

      <div className={styles.genresBlock}>
        <label className={styles.label}>Genres</label>
        <div className={styles.tags} data-testid="genre-selector">
          {formData.genres.map((genre) => (
            <span key={genre} className={styles.tag}>
              {genre}
              <button type="button" onClick={() => handleRemoveGenre(genre)}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className={styles.genreSelectWrapper}>
          <GenreSelect value={newGenre} onChange={(e) => setNewGenre(e.target.value)} />
          <Button type="button" size="sm" onClick={handleAddGenre}>
            Add
          </Button>
        </div>
      </div>

      <Input
        title="Cover Image URL"
        value={formData.coverImageUrl}
        onChange={(e) => handleChange('coverImageUrl', e.target.value)}
        data-testid="input-cover-image"
      />
      {errors.coverImageUrl && (
        <div className={styles.error} data-testid="error-coverImageUrl">
          {errors.coverImageUrl}
        </div>
      )}

      <Button type="submit" data-testid="submit-button">
        Save Track
      </Button>
    </form>
  );
};

export default TrackMetadataForm;
