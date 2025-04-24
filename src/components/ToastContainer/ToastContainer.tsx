import React from 'react';
import styles from './ToastContainer.module.scss';
import { useToast } from '../../context/ToastContext.tsx';

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className={styles.toastContainer} data-testid="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          data-testid={`toast-${toast.type}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
