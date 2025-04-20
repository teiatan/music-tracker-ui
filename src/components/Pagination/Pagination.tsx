import React from 'react';
import ResponsivePagination from 'react-responsive-pagination';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.paginationContainer}>
      <ResponsivePagination
        current={currentPage}
        total={totalPages}
        onPageChange={onPageChange}
        className={styles.pagination}
      />
    </div>
  );
};

export default Pagination;
