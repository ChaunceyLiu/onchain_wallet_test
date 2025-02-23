import type { CombinedItem } from "@/types/wallet";
import CurrencyItem from "./CurrencyItem";
import styles from "./styles.module.css";
import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getCombinedWalletData } from "@/serverApi/CombinedWalletData";
import { usePolling } from "@/hooks/usePolling";
import { useGlobalState } from "@/hooks/useGlobalState";
import Decimal from 'decimal.js';

let isUpdating = false; // 全局状态锁

// 高效数组合并
const mergeLists = (oldList: CombinedItem[], newList: CombinedItem[]) => {
  const shallowEqual = (a: CombinedItem, b: CombinedItem) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(
      (key) => a[key as keyof CombinedItem] === b[key as keyof CombinedItem]
    );
  };

  const map = new Map(oldList.map((item) => [item.symbol, item]));

  return newList.map((newItem) => {
    const existing = map.get(newItem.symbol);
    // 保留未变化项的引用
    return existing && shallowEqual(existing, newItem) ? existing : newItem;
  });
};

const BalanceCard = () => {
  const { dispatch } = useGlobalState();
  const [coinsList, setCoinsList] = useState<CombinedItem[]>([]);
  const getCoinList = async () => {
    if (isUpdating) return;
    isUpdating = true;
    try {
      const combinedRes = await getCombinedWalletData();
      setCoinsList((prev) => {
        if (!prev) return combinedRes;
        return mergeLists(prev, combinedRes);
      });
      const total = combinedRes?.reduce((acc: number, cur: CombinedItem) => {
        return new Decimal(acc).plus(cur.usdMount).toFixed(2) ;
      }, 0);
      dispatch({ type: "UPDATE_ACCOUNT", payload: total });
    } catch (error) {
      //todo
      console.error(error);
    } finally {
      isUpdating = false;
    }
  };

  usePolling(getCoinList, 500);

  return (
    <ErrorBoundary
      cachedData={coinsList}
      fallback={({ error, data, retry }) => (
        <div className="fallback-ui">
          <h2>系统暂时不可用</h2>
          <p>错误原因：{error?.message || "网络问题"}</p>
          {data && (
            <div>
              <p>最后可用数据：</p>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
          <button onClick={retry}>重试</button>
        </div>
      )}
    >
      <div className={styles.card}>
        <div className={styles.list}>
          {coinsList?.length ? (
            coinsList.map((currency) => (
              <CurrencyItem key={currency.code} currency={currency} />
            ))
          ) : (
            <div>数据异常</div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BalanceCard;
