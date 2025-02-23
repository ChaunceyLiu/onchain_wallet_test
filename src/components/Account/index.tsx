import styles from "./styles.module.css";
import Logo from "@/assets/logo.png";
import Send from "@/assets/send.png";
import { useGlobalState } from "@/hooks/useGlobalState";

const Account = () => {
  const { state } = useGlobalState();
  return (
    <div className={styles.account}>
      <div className={styles.title}>
        <img className={styles.icon} src={Logo}></img>
        <span className={styles.company}>crypto.com</span>
        <span className={styles.productName}> {`| DEFI WALLET`}</span>
      </div>
      <div className={styles.money}>
        <span>$</span>
        <span className={styles.count}>{state.balance || 0}</span>
        <span>USD</span>
      </div>
      <div className={styles.opt}>
        <div className={styles.optBlock}>
          <div className={styles.optButton} onClick={() => {}}>
            <img src={Send} />
          </div>
          <div className={styles.optText}>Send</div>
        </div>
        <div className={styles.optBlock}>
          <div className={styles.optButton} onClick={() => {}}>
            <img src={Send} className={styles.flip} />
          </div>
          <div className={styles.optText}>Receive</div>
        </div>
      </div>
    </div>
  );
};

export default Account;
