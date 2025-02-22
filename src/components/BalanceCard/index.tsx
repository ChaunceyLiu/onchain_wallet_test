import type { CombinedItem } from "@/types/wallet";
import CurrencyItem from "./CurrencyItem";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { getCombinedWalletData } from "@/serverApi/CombinedWalletData";

const BalanceCard = () => {
  const [coinsList, setCoinsList] = useState<CombinedItem[]>([]);
  const getCoinList = async () => {
    try {
      console.log(111)
      const combinedRes = await getCombinedWalletData();
      console.log(combinedRes);
      setCoinsList(combinedRes);
    } catch (error) {
      //todo
    }
  };

  useEffect(() => {
    getCoinList();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.list}>
        {coinsList.map((currency) => (
          <CurrencyItem
            key={currency.code}
            currency={currency}
          />
        ))}
      </div>
    </div>
  );
};

export default BalanceCard;
