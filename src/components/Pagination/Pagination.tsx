import React, { useEffect, useMemo, useState } from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import { debounce } from 'lodash';
import styles from './Pagination.module.scss';

interface Props {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const [localItemsPerPage, setLocalItemsPerPage] = useState(itemsPerPage);

  const debouncedItemsPerPageChange = useMemo(
    () =>
      debounce((value: number) => {
        onItemsPerPageChange(value);
      }, 1500),
    [onItemsPerPageChange]
  );

  useEffect(() => {
    debouncedItemsPerPageChange(localItemsPerPage);

    return () => {
      debouncedItemsPerPageChange.cancel();
    };
  }, [localItemsPerPage, debouncedItemsPerPageChange]);

  useEffect(() => {
    const pagination = document.querySelector(`.${styles.pagination}`);
    if (!pagination) return;

    pagination.setAttribute('data-testid', 'pagination');

    const listItems = pagination.querySelectorAll('li');

    listItems.forEach((li) => {
      const content = li.textContent?.trim();
      if (content === '»') {
        const link = li.querySelector('a, span');
        if (link) link.setAttribute('data-testid', 'pagination-next');
      } else if (content === '«') {
        const link = li.querySelector('a, span');
        if (link) link.setAttribute('data-testid', 'pagination-prev');
      }
    });
  }, [currentPage, totalPages]);

  return (
    <div className={styles.paginationContainer}>
      <ResponsivePagination
        current={currentPage}
        total={totalPages}
        onPageChange={onPageChange}
        className={styles.pagination}
      />

      <div className={styles.itemsPerPage}>
        <label htmlFor="items-per-page">Items per page:</label>
        <input
          id="items-per-page"
          type="number"
          min={1}
          value={localItemsPerPage}
          onChange={(e) => setLocalItemsPerPage(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Pagination;
