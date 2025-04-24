import styles from './Loader.module.scss';

const Loader = () => {
  return (
    <div className={styles.overlay} data-testid="fullscreen-loader">
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
