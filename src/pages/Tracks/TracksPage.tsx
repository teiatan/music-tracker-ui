import { useEffect, useMemo, useState } from 'react';
import styles from './TracksPage.module.scss';
import { Order, Sort, Track } from '../../api/types';
import Button from '../../components/Button/Button';
import { getTracks } from '../../api/getTracks.api';
import TrackAudioPlayer from '../../features/TrackAudioPlayer/TrackAudioPlayer';
import TracksList from '../../features/TracksList/TracksList';
import Pagination from '../../components/Pagination/Pagination';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';
import debounce from 'lodash/debounce';
import GenreSelect from '../../features/GenreSelect/GenreSelect';
import Modal from '../../components/Modal/Modal';
import TrackMetadataForm from '../../features/TrackMetadataForm/TrackMetadataForm';
import DeleteTrackModalContent from '../../features/DeleteTrackModalContent/DeleteTrackModalContent';
import UploadTrackModalContent from '../../features/UploadTrackModalContent/UploadTrackModalContent';

const TracksPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[] | []>([]);
  const [selectedTracksIds, setSelectedTracksIds] = useState<string[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [playerTrack, setPlayerTrack] = useState<Track | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [sortBy, setSortBy] = useState<Sort>('createdAt');
  const [sortOrder, setSortOrder] = useState<Order>('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create-or-edit' | 'delete' | 'upload-file' | ''>('');
  const debouncedSearchText = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    debouncedSearchText(searchText);
    return () => {
      debouncedSearchText.cancel();
    };
  }, [searchText]);

  const loadTracks = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getTracks({
        page,
        limit: itemsPerPage,
        sort: sortBy,
        order: sortOrder,
        search: debouncedSearch,
        genre: selectedGenre,
      });

      setTracks(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalTracks(res.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (!playerTrack) return;

    const playableTracks = tracks.filter((t) => t.audioFile);
    const currentIndex = playableTracks.findIndex((t) => t.id === playerTrack.id);

    if (currentIndex !== -1 && currentIndex < playableTracks.length - 1) {
      setPlayerTrack(playableTracks[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (!playerTrack) return;

    const playableTracks = tracks.filter((t) => t.audioFile);
    const currentIndex = playableTracks.findIndex((t) => t.id === playerTrack.id);

    if (currentIndex > 0) {
      setPlayerTrack(playableTracks[currentIndex - 1]);
    }
  };

  const resetLoadedTracksParams = () => {
    setSortBy('createdAt');
    setSortOrder('desc');
    setSelectedGenre('');
    setSearchText('');
    setCurrentPage(1);
    setSelectedTracksIds([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingTrack(null);
  };

  const handleEditClick = (track: Track) => {
    setEditingTrack(track);
    setModalType('create-or-edit');
    setShowModal(true);
  };

  const handleDeleteClick = (track: Track) => {
    setEditingTrack(track);
    setModalType('delete');
    setShowModal(true);
  };

  const handleUploadFileClick = (track: Track) => {
    setEditingTrack(track);
    setModalType('upload-file');
    setShowModal(true);
  };

  const handleSuccessCreateOrEdit = async () => {
    if (!editingTrack) {
      resetLoadedTracksParams();
    } else {
      loadTracks(currentPage);
    }
    setShowModal(false);
    setModalType('');
    setEditingTrack(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchText, selectedGenre, sortBy, sortOrder]);

  useEffect(() => {
    console.log('selectedTracksIds', selectedTracksIds);
    console.log('editingTrack', editingTrack);
  }, [selectedTracksIds, editingTrack]);
  useEffect(() => {
    loadTracks(currentPage);
  }, [currentPage, itemsPerPage, debouncedSearch, selectedGenre, sortBy, sortOrder]);

  return (
    <>
      <div className={styles.page}>
        {playerTrack && (
          <TrackAudioPlayer track={playerTrack} onNext={handleNext} onPrev={handlePrev} />
        )}
        <header className={styles.header}>
          <h1 data-testid="tracks-header">Tracks</h1>
          <Button
            variant="primary"
            data-testid="create-track-button"
            onClick={() => {
              setShowModal(true);
              setModalType('create-or-edit');
            }}
          >
            Create Track
          </Button>
        </header>

        <div className={styles.controls}>
          <Input
            title="Search"
            data-testid="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
          <GenreSelect
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className={styles.genreSelect}
          />

          <Select
            title="Sort by"
            data-testid="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as Sort)}
            className={styles.sortBySelect}
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="createdAt">Created date</option>
          </Select>

          <Select
            title="Sort order"
            data-testid="order-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as Order)}
            className={styles.orderSelect}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </Select>
          {selectedTracksIds.length > 0 && (
            <Button
              variant="danger"
              data-testid="bulk-delete-button"
              onClick={() => {
                setModalType('delete');
                setShowModal(true);
              }}
            >
              delete selected tracks ({selectedTracksIds.length})
            </Button>
          )}
        </div>

        {isLoading ? (
          <div data-testid="loading-tracks" data-loading="true">
            Loading...
          </div>
        ) : (
          <>
            <p>Tracks found {totalTracks}</p>
            <TracksList
              tracks={tracks}
              selectedTracksIds={selectedTracksIds}
              handlePlayClick={setPlayerTrack}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              handleUploadClick={handleUploadFileClick}
              handleSelectionChange={setSelectedTracksIds}
            />
          </>
        )}

        {totalTracks > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
      {showModal && modalType !== '' && (
        <Modal onClose={handleCloseModal}>
          {modalType === 'create-or-edit' && (
            <TrackMetadataForm
              initialValues={editingTrack ? editingTrack : undefined}
              trackId={editingTrack?.id}
              onUploadFileClick={() => {
                setModalType('upload-file');
              }}
              onSuccess={handleSuccessCreateOrEdit}
            />
          )}

          {modalType === 'delete' && (
            <DeleteTrackModalContent
              trackIds={editingTrack?.id ? [editingTrack.id] : selectedTracksIds}
              trackTitle={editingTrack?.title}
              onClose={handleCloseModal}
              onDeleted={handleSuccessCreateOrEdit}
            />
          )}

          {modalType === 'upload-file' && editingTrack && (
            <UploadTrackModalContent
              track={editingTrack}
              onClose={handleCloseModal}
              onUploaded={async () => {
                await loadTracks(currentPage);
                handleCloseModal();
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
};

export default TracksPage;
