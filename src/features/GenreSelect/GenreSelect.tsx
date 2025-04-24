import React, { useEffect, useState } from 'react';
import { getGenres } from '../../api/getGenres.api';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import styles from './GenreSelect.module.scss';
import { useToast } from '../../context/ToastContext';

interface Props {
  mode?: 'select' | 'button';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenreClick?: (genre: string) => void;
  className?: string;
  excludeGenres?: string[];
  title?: string;
}

const GenreSelect: React.FC<Props> = ({
  mode = 'select',
  value = '',
  onChange,
  onGenreClick,
  className,
  excludeGenres = [],
  title = 'Genre',
}) => {
  const { addToast } = useToast();
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      try {
        const result = await getGenres();
        setGenres(result);
      } catch (error) {
        console.error('Error fetching genres:', error);
        addToast('Failed to load genres', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const filteredGenres = genres.filter((genre) => !excludeGenres.includes(genre));

  if (mode === 'button') {
    return (
      <div className={styles.genreButtonWrapper}>
        <Button
          type="button"
          size="sm"
          onClick={() => setShowDropdown((prev) => !prev)}
          disabled={isLoading || filteredGenres.length === 0}
        >
          +
        </Button>

        {showDropdown && (
          <ul className={styles.dropdown}>
            {filteredGenres.map((genre) => (
              <li key={genre}>
                <button
                  type="button"
                  onClick={() => {
                    onGenreClick?.(genre);
                    setShowDropdown(false);
                  }}
                  className={styles.dropdownItem}
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <Select
      title={title}
      data-testid="filter-genre"
      value={value}
      onChange={onChange}
      className={className}
      disabled={isLoading}
    >
      <option value="">Select genre</option>
      {filteredGenres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </Select>
  );
};

export default GenreSelect;
