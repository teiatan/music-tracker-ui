import styles from './TracksPage.module.scss';

import TracksList from '../../features/TracksList/TracksList';
import Pagination from '../../components/Pagination/Pagination';
import TrackAudioPlayer from '../../features/TrackAudioPlayer/TrackAudioPlayer';
import { useTracksPage } from '../../utils/useTracks';
import TracksHeader from '../../features/TracksHeader/TracksHeader';
import TracksControls from '../../features/TracksControls/TracksControls';
import TracksModals from '../../features/TracksModalManager/TracksModalManager';

const TracksPage = () => {
  const {
    state: {
      isLoading,
      tracks,
      selectedTracksIds,
      totalTracks,
      isPlaying,
      playerTrack,
      currentPage,
      totalPages,
      itemsPerPage,
      selectedGenre,
      searchText,
      sortBy,
      sortOrder,
      showModal,
      modalType,
      editingTrack,
      audioRef,
    },
    handlers,
  } = useTracksPage();

  return (
    <>
      <div className={styles.page}>
        {playerTrack && (
          <TrackAudioPlayer
            track={playerTrack}
            onNext={handlers.handleNext}
            onPrev={handlers.handlePrev}
            handlePlaying={(p) => handlers.setIsPlaying?.(p)}
            audioRef={audioRef}
          />
        )}

        <TracksHeader
          onCreate={() => {
            handlers.setShowModal(true);
            handlers.setModalType('create-or-edit');
          }}
        />

        <TracksControls
          searchText={searchText}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
          sortOrder={sortOrder}
          selectedTracksIds={selectedTracksIds}
          setSearchText={handlers.setSearchText}
          setSelectedGenre={handlers.setSelectedGenre}
          setSortBy={handlers.setSortBy}
          setSortOrder={handlers.setSortOrder}
          onBulkDelete={() => {
            handlers.setShowModal(true);
            handlers.setModalType('delete');
          }}
        />

        {isLoading ? (
          <div data-testid="loading-tracks">Loading...</div>
        ) : (
          <>
            <p>Tracks found {totalTracks}</p>
            <TracksList
              tracks={tracks}
              playerTrack={playerTrack}
              isPlaying={isPlaying}
              selectedTracksIds={selectedTracksIds}
              handlePlayClick={handlers.handlePlayClick}
              handlePauseClick={handlers.handlePauseClick}
              handleEditClick={handlers.handleEditClick}
              handleDeleteClick={handlers.handleDeleteClick}
              handleUploadClick={handlers.handleUploadFileClick}
              handleSelectionChange={handlers.setSelectedTracksIds}
            />
          </>
        )}

        {totalTracks > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlers.setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handlers.setItemsPerPage}
          />
        )}
      </div>

      <TracksModals
        show={showModal}
        type={modalType}
        editingTrack={editingTrack}
        selectedIds={selectedTracksIds}
        onClose={handlers.handleCloseModal}
        onSuccess={handlers.handleSuccessCreateOrEdit}
        onUploadFileClick={() => handlers.setModalType('upload-file')}
        reloadTracks={() => handlers.setCurrentPage(currentPage)}
      />
    </>
  );
};

export default TracksPage;
