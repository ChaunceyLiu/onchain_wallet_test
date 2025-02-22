import { CombinedItem } from "@/types/wallet";
import styles from "./styles.module.css";
import ImageWithFallback from "@/components/ImageWithFallback";

interface CurrencyItemProps {
  currency: CombinedItem;
}

const CurrencyItem = ({ currency }: CurrencyItemProps) => (
  <div className={styles.item}>
    <div className={styles.infoSection}>
      <ImageWithFallback
        className={styles.icon}
        src={currency.colorful_image_url}
      ></ImageWithFallback>
      <h3 className={styles.currencyName}>
        {currency?.name || currency?.coin_id}
      </h3>
    </div>
    <div className={styles.usdValue}>
      <p className={styles.balance}>
        {currency?.amount} {currency?.unit}
      </p>
      <p className={styles.usdMount}>${currency?.usdMount}</p>
    </div>
  </div>
);

export default CurrencyItem;
