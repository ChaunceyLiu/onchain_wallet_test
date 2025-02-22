import { WalletBalance, ExchangeRatesItem, Rates } from "@/types/wallet";
import { currencies } from "./currencies";
import { walletBalance } from "./walletBalance";
import { liveRate } from "./liveRate";

export const getCombinedWalletData = async () => {
  // 并行获取数据（若实际场景支持）
  const [currenciesRes, balanceRes, liveRateRes] = await Promise.all([
    currencies(),
    walletBalance(),
    liveRate(),
  ]);

  // 创建哈希映射
  const balanceMap = balanceRes.wallet.reduce(
    (map: { [key: string]: WalletBalance }, curr) => {
      map[curr.currency] = curr; // 使用 symbol 作为唯一键
      return map;
    },
    {}
  );

  // 创建换美元的映射

  const rateMap = liveRateRes.tiers.reduce(
    (map: { [key: string]: Rates[] }, curr: ExchangeRatesItem) => {
      map[curr.from_currency] = curr.rates; // 使用 from_currency 作为唯一键
      return map;
    },
    {}
  );

  // 合并数据（O(n) 复杂度）
  return currenciesRes.currencies
    .map((currency) => {
      const walletItem = balanceMap[currency.symbol];
      const errorCoinInfo = currency?.symbol
        ? currency.symbol
        : walletItem?.currency;
      const usdMount =
        (Number(rateMap[walletItem?.currency]?.[0]?.rate || 0) *
          walletItem?.amount || 0) /
        Number(rateMap[walletItem?.currency]?.[0]?.amount || 0);
      return {
        ...currency, // 直接通过哈希查找
        ...(walletItem || {}), // 直接通过哈希查找
        name: errorCoinInfo,
        unit: errorCoinInfo,
        usdMount: isNaN(usdMount) ? "0" : usdMount.toFixed(2), // 直接通过哈希查找
      };
    })
    .sort((a, b) => Number(b.usdMount) - Number(a.usdMount));
};
