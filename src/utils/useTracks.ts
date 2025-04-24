import { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import { getTracks } from '../api/getTracks.api';
import { Order, Sort, Track } from '../api/types';
import { useToast } from '../context/ToastContext';

export const useTracks = () => {
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTracksIds, setSelectedTracksIds] = useState<string[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [artistFilter, setArtistFilter] = useState('');
  const [debouncedArtist, setDebouncedArtist] = useState(artistFilter);
  const [sortBy, setSortBy] = useState<Sort>('createdAt');
  const [sortOrder, setSortOrder] = useState<Order>('desc');

  const [isPlaying, setIsPlaying] = useState(false);
  const [playerTrack, setPlayerTrack] = useState<Track | null>(null);

  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create-or-edit' | 'delete' | 'upload-file' | ''>('');

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
        artist: debouncedArtist,
      });
      setTracks(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalTracks(res.meta.total);
    } catch (err) {
      console.error(err);
      addToast('Failed to load tracks', 'error');
    } finally {
      setIsLoading(false);
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

  const debouncedSearchText = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const debouncedArtistText = useMemo(
    () => debounce((value: string) => setDebouncedArtist(value), 500),
    []
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayClick = (track: Track) => {
    if (track.id === playerTrack?.id) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }
    setPlayerTrack(track);
  };

  const handlePauseClick = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handlePlayNext = () => {
    if (!playerTrack) return;
    const playable = tracks.filter((t) => t.audioFile);
    const current = playable.findIndex((t) => t.id === playerTrack.id);
    if (current !== -1 && current < playable.length - 1) setPlayerTrack(playable[current + 1]);
  };

  const handlePlayPrev = () => {
    if (!playerTrack) return;
    const playable = tracks.filter((t) => t.audioFile);
    const current = playable.findIndex((t) => t.id === playerTrack.id);
    if (current > 0) setPlayerTrack(playable[current - 1]);
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
      loadTracks(1);
    } else loadTracks(currentPage);

    setShowModal(false);
    setModalType('');
    setEditingTrack(null);

    addToast('Track saved successfully', 'success');
  };

  useEffect(() => setCurrentPage(1), [itemsPerPage, searchText, selectedGenre, sortBy, sortOrder]);

  useEffect(() => {
    void loadTracks(currentPage);
  }, [
    currentPage,
    itemsPerPage,
    debouncedSearch,
    debouncedArtist,
    selectedGenre,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    debouncedSearchText(searchText);
    return () => debouncedSearchText.cancel();
  }, [searchText]);

  useEffect(() => {
    debouncedArtistText(artistFilter);
    return () => debouncedArtistText.cancel();
  }, [artistFilter]);

  useEffect(() => {
    if (playerTrack && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [playerTrack]);

  return {
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
      artistFilter,
      sortBy,
      sortOrder,
      showModal,
      modalType,
      editingTrack,
      audioRef,
    },
    handlers: {
      setSearchText,
      setArtistFilter,
      setSelectedGenre,
      setSortBy,
      setSortOrder,
      setShowModal,
      setModalType,
      setIsPlaying,
      setItemsPerPage,
      setCurrentPage,
      setSelectedTracksIds,
      handlePlayClick,
      handlePauseClick,
      handleNext: handlePlayNext,
      handlePrev: handlePlayPrev,
      handleEditClick,
      handleDeleteClick,
      handleUploadFileClick,
      handleCloseModal,
      handleSuccessCreateOrEdit,
    },
  };
};
