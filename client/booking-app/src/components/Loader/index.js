import styles from "./loader.module.css";

function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loaderText}>Loading...</p>
    </div>
  );
}

export default Loader;
