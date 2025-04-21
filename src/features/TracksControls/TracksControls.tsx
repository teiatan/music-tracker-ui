import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import GenreSelect from '../../features/GenreSelect/GenreSelect';
import Button from '../../components/Button/Button';
import { Order, Sort } from '../../api/types';
import styles from '../../pages/Tracks/TracksPage.module.scss';

const TracksControls = ({
  searchText,
  selectedGenre,
  sortBy,
  sortOrder,
  selectedTracksIds,
  setSearchText,
  setSelectedGenre,
  setSortBy,
  setSortOrder,
  onBulkDelete,
}: {
  searchText: string;
  selectedGenre: string;
  sortBy: Sort;
  sortOrder: Order;
  selectedTracksIds: string[];
  setSearchText: (value: string) => void;
  setSelectedGenre: (value: string) => void;
  setSortBy: (value: Sort) => void;
  setSortOrder: (value: Order) => void;
  onBulkDelete: () => void;
}) => (
  <div className={styles.controls}>
    <Input
      title="Search"
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
      value={sortOrder}
      onChange={(e) => setSortOrder(e.target.value as Order)}
      className={styles.orderSelect}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </Select>
    {selectedTracksIds.length > 0 && (
      <Button variant="danger" onClick={onBulkDelete}>
        delete selected tracks ({selectedTracksIds.length})
      </Button>
    )}
  </div>
);

export default TracksControls;
