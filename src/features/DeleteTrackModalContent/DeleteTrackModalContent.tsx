import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import styles from './DeleteTrackModalContent.module.scss';
import { deleteTrack } from '../../api/deleteTrack.api';
import { deleteMultipleTracks } from '../../api/deleteMultipleTracks.api';

interface Props {
  trackIds: string[];
  trackTitle?: string;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteTrackModalContent: React.FC<Props> = ({ trackIds, trackTitle, onClose, onDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSingleDeleting = trackIds.length === 1;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      if (trackIds.length === 1) {
        await deleteTrack(trackIds[0]);
      } else {
        await deleteMultipleTracks({ ids: trackIds });
      }
      onDeleted();
    } catch {
      setError('Failed to delete track(s). Try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.modal} data-testid="confirm-dialog">
      <p>
        {isSingleDeleting && trackTitle ? (
          <>
            Are you sure you want to delete <strong>{trackTitle}</strong>?
          </>
        ) : (
          <>
            Are you sure you want to delete <strong>{trackIds.length}</strong> track
            {isSingleDeleting ? '' : 's'}?
          </>
        )}
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
