import React, { useState } from 'react';

import styles from './TrackMetadataForm.module.scss';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import GenreSelect from '../GenreSelect/GenreSelect';
import { createTrack } from '../../api/createTrack.api';
import { updateTrack } from '../../api/updateTrack';
import { deleteTrackFile } from '../../api/deleteTrackFile.api';
import { Track } from '../../api/types';

export interface TrackMetadataFormValues {
  title: string;
  artist: string;
  album: string;
  genres: string[];
  coverImage: string;
}

interface Props {
  initialValues?: Track;
  trackId?: string;
  onUploadFileClick?: () => void;
  onSuccess: () => void;
}

const validateImageUrl = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};

const TrackMetadataForm: React.FC<Props> = ({
  initialValues,
  trackId,
  onUploadFileClick,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<TrackMetadataFormValues>({
    title: initialValues?.title ?? '',
    artist: initialValues?.artist ?? '',
    album: initialValues?.album ?? '',
    genres: initialValues?.genres ?? [],
    coverImage: initialValues?.coverImage ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const validate = async (): Promise<boolean> => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.artist.trim()) errs.artist = 'Artist is required';

    if (formData.coverImage) {
      const isFormatValid = /^https?:\/\/[^\\s]+?\.(jpg|jpeg|png|webp)$/i.test(formData.coverImage);
      const isLoadable = await validateImageUrl(formData.coverImage);

      if (!isFormatValid || !isLoadable) {
        errs.coverImage = 'Cover image must be a valid and accessible image URL';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof TrackMetadataFormValues, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }));
  };

  const handleDeleteAudioFile = async () => {
    if (!trackId) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteTrackFile(trackId);
      onSuccess();
    } catch (err) {
      console.error('Failed to delete audio file', err);
      setDeleteError('Failed to delete audio file.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validate();
    if (!isValid) return;

    try {
      if (trackId) {
        await updateTrack(trackId, {
          title: formData.title,
          artist: formData.artist,
          album: formData.album,
          genres: formData.genres,
          coverImage: formData.coverImage,
        });
      } else {
        await createTrack({
          title: formData.title,
          artist: formData.artist,
          album: formData.album,
          genres: formData.genres,
          coverImage: formData.coverImage,
        });
      }
      onSuccess();
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
        <GenreSelect
          mode="button"
          excludeGenres={formData.genres}
          onGenreClick={(genre) =>
            setFormData((prev) => ({
              ...prev,
              genres: [...prev.genres, genre],
            }))
          }
        />
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
      </div>

      <Input
        title="Cover Image URL"
        value={formData.coverImage}
        onChange={(e) => handleChange('coverImage', e.target.value)}
        data-testid="input-cover-image"
      />
      {errors.coverImage && (
        <div className={styles.error} data-testid="error-coverImage">
          {errors.coverImage}
        </div>
      )}

      {formData.coverImage && !errors.coverImage && (
        <div className={styles.coverPreview}>
          <img
            src={formData.coverImage}
            alt="Cover Preview"
            className={styles.coverImage}
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        </div>
      )}

      {trackId && (
        <div className={styles.audioBlock}>
          <label className={styles.label}>Audio File</label>

          {initialValues?.audioFile ? (
            <div className={styles.audioInfo}>
              <p className={styles.fileName}>Current file: {initialValues.audioFile}</p>
              <div className={styles.audioActions}>
                <Button type="button" size="sm" onClick={onUploadFileClick}>
                  Replace File
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  onClick={handleDeleteAudioFile}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete File'}
                </Button>
              </div>
              {deleteError && <p className={styles.error}>{deleteError}</p>}
            </div>
          ) : (
            <Button type="button" size="sm" onClick={onUploadFileClick}>
              Upload File
            </Button>
          )}
        </div>
      )}

      <Button type="submit" data-testid="submit-button">
        Save Track
      </Button>
    </form>
  );
};

export default TrackMetadataForm;
