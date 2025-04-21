import styles from './TracksContainer.module.scss';
import TracksList from '../../features/TracksList/TracksList';
import Pagination from '../../components/Pagination/Pagination';

const TracksContainer = () => {
  return (
    <div className={styles.container}>
      <TracksList
        tracks={[]}
        playerTrack={null}
        isPlaying={false}
        selectedTracksIds={[]}
        handlePlayClick={() => {}}
        handlePauseClick={() => {}}
        handleEditClick={() => {}}
        handleDeleteClick={() => {}}
        handleUploadClick={() => {}}
        handleSelectionChange={() => {}}
      />
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        itemsPerPage={10}
        onItemsPerPageChange={() => {}}
      />
    </div>
  );
};

export default TracksContainer;
