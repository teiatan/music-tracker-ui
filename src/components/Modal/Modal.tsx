import { useEffect } from 'react';
import styles from './Modal.module.scss';
import clsx from 'clsx';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<Props> = ({ onClose, children, className }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={clsx(styles.wrapper, className)} onMouseDown={handleOutsideClick}>
      {children}
    </div>
  );
};

export default Modal;
