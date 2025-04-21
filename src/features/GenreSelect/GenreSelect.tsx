import React, { useEffect, useState } from 'react';
import { getGenres } from '../../api/getGenres.api';
import Select from '../../components/Select/Select';

interface GenreSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}

const GenreSelect: React.FC<GenreSelectProps> = ({ value, onChange, className }) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      try {
        const result = await getGenres();
        setGenres(result);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Select
      title="Genre"
      data-testid="genre-select"
      value={value}
      onChange={onChange}
      className={className}
      disabled={isLoading}
    >
      <option value="">Select genre</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </Select>
  );
};

export default GenreSelect;
