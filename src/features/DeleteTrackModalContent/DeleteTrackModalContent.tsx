import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './DeleteTrackModalContent.module.scss';
import { deleteTrack } from '../../api/deleteTrack.api';

interface Props {
  trackId: string;
  trackTitle: string;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteTrackModalContent: React.FC<Props> = ({ trackId, trackTitle, onClose, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTrack(trackId);
      onDeleted();
    } catch {
      setError('Failed to delete track. Try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.modal}>
      <p>
        Are you sure you want to delete <strong>{trackTitle}</strong>?
      </p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
          data-testid="confirm-delete"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isDeleting}
          data-testid="cancel-delete"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DeleteTrackModalContent;
