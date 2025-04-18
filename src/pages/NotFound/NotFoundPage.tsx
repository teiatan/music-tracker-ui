import { useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';
import Button from '../../components/Button/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <h1>404 – Page Not Found</h1>
      <Button variant="primary" size="md" onClick={() => navigate('/tracks')}>
        Go to Tracks
      </Button>
    </div>
  );
};

export default NotFoundPage;
