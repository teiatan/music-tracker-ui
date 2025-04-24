import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.overlay} data-testid="loading-tracks">
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
