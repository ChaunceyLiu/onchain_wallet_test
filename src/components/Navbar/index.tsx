import styles from "./styles.module.css";
import Setting from "@/assets/settings.png";
import Scan from "@/assets/scan.png";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <img className={styles.setting} src={Setting}></img>
      <img className={styles.scan} src={Scan}></img>
    </div>
  );
};

export default Navbar;
