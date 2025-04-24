import React, { useRef, useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './UploadTrackModalContent.module.scss';
import { Track } from '../../api/types';
import { uploadTrackFile } from '../../api/uploadTrackFile.api';
import { deleteTrackFile } from '../../api/deleteTrackFile.api';
import { useToast } from '../../context/ToastContext.tsx';

interface Props {
  track: Track | null;
  onClose: () => void;
  onUploaded: () => void;
}

const UploadTrackModalContent: React.FC<Props> = ({ track, onClose, onUploaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setError('Please select a file.');
      return;
    }

    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only MP3 and WAV files are allowed.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      if (track?.audioFile) {
        await deleteTrackFile(track.id);
        addToast('Previous file deleted successfully.', 'info');
      }

      await uploadTrackFile(track!.id, file);
      addToast('File uploaded successfully!', 'success');
      onUploaded();
    } catch (err) {
      console.error(err);
      setError('Upload failed. Try again.');
      addToast('Upload failed. Try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      await deleteTrackFile(track!.id);
      addToast('File deleted successfully!', 'success');
      onUploaded();
    } catch (err) {
      console.error(err);
      setError('Failed to delete file. Try again.');
      addToast('Failed to delete file.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.modal}>
      <h2>Upload Audio File</h2>
      <p>{track ? `Track: ${track.title}` : 'No track selected'}</p>

      {track?.audioFile && (
        <div className={styles.info}>
          <p>
            Existing file: <strong>{track.audioFile}</strong>
          </p>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isProcessing}
            data-testid="delete-audio-file"
          >
            Delete File
          </Button>
        </div>
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
        <Button onClick={handleUpload} disabled={isProcessing}>
          {isProcessing ? 'Uploading...' : 'Upload'}
        </Button>
        <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UploadTrackModalContent;
