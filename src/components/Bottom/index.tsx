import styles from "./styles.module.css";
import Setting from "@/assets/settings.png";
import Scan from "@/assets/scan.png";

const Bottom = () => {
  return (
    <div className={styles.bottom}>
      <div>
        <img
          className={`${styles.setting} ${styles.focus}`}
          src={Setting}
        ></img>
        <p className={styles.focus}>wallet</p>
      </div>
      <div>
        <img className={styles.scan} src={Scan}></img>
        <p>DeFi</p>
      </div>
    </div>
  );
};

export default Bottom;
