import React, { useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './UploadTrackModalContent.module.scss';
import { Track } from '../../api/types';
import { uploadTrackFile } from '../../api/uploadTrackFile.api';

interface Props {
  track: Track | null;
  onClose: () => void;
  onUploaded: () => void;
}

const UploadTrackModalContent: React.FC<Props> = ({ track, onClose, onUploaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError('Please select a file.');
      return;
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only mp3 and wav files are allowed.');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      await uploadTrackFile(track!.id, file);

      onUploaded();
    } catch (err) {
      console.error(err);
      setError('Upload failed. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <h2>Upload Audio File</h2>
      <p>{track ? `Track: ${track.title}` : 'No track selected'}</p>

      {track?.audioFile && (
        <p>
          Existing file: <strong>{track.audioFile}</strong> — will be replaced if you upload a new
          one.
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        data-testid="upload-file-input"
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={isUploading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UploadTrackModalContent;
