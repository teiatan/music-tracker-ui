import Modal from '../../components/Modal/Modal';
import TrackMetadataForm from '../TrackMetadataForm/TrackMetadataForm';
import DeleteTrackModalContent from '../DeleteTrackModalContent/DeleteTrackModalContent';
import UploadTrackModalContent from '../UploadTrackModalContent/UploadTrackModalContent';
import { Track } from '../../api/types';

const TracksModals = ({
  show,
  type,
  editingTrack,
  selectedIds,
  onClose,
  onSuccess,
  onUploadFileClick,
  reloadTracks,
}: {
  show: boolean;
  type: string;
  editingTrack: Track | null;
  selectedIds: string[];
  onClose: () => void;
  onSuccess: () => void;
  onUploadFileClick: () => void;
  reloadTracks: () => void;
}) => {
  if (!show || !type) return null;

  return (
    <Modal onClose={onClose}>
      {type === 'create-or-edit' && (
        <TrackMetadataForm
          initialValues={editingTrack || undefined}
          trackId={editingTrack?.id}
          onUploadFileClick={onUploadFileClick}
          onSuccess={onSuccess}
        />
      )}
      {type === 'delete' && (
        <DeleteTrackModalContent
          trackIds={editingTrack?.id ? [editingTrack.id] : selectedIds}
          trackTitle={editingTrack?.title}
          onClose={onClose}
          onDeleted={onSuccess}
        />
      )}
      {type === 'upload-file' && editingTrack && (
        <UploadTrackModalContent
          track={editingTrack}
          onClose={onClose}
          onUploaded={async () => {
            await reloadTracks();
            onClose();
          }}
        />
      )}
    </Modal>
  );
};

export default TracksModals;
