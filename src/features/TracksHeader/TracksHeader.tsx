import Button from '../../components/Button/Button';
import styles from '../../pages/Tracks/TracksPage.module.scss';

const TracksHeader = ({ onCreate }: { onCreate: () => void }) => (
  <header className={styles.header}>
    <h1 data-testid="tracks-header">Tracks</h1>
    <Button variant="primary" data-testid="create-track-button" onClick={onCreate}>
      Create Track
    </Button>
  </header>
);

export default TracksHeader;
