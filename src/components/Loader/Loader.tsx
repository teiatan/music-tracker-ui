import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.overlay} data-testid="loading-tracks">
      <div className={styles.spinner}></div>
      <p className={styles.message}>Loading can take up to 3 minutes</p>
    </div>
  );
};

export default Loader;
