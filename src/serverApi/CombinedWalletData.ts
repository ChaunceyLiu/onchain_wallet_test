import {
  WalletBalance,
  ExchangeRatesItem,
  Rates,
  CombinedItem,
} from "@/types/wallet";
import { currencies } from "./currencies";
import { walletBalance } from "./walletBalance";
import { liveRate } from "./liveRate";
import Decimal from "decimal.js";

interface ResultType<T> {
  value: T;
}

const ErrorFetch = <T extends { ok: boolean }>(
  result: ResultType<T>,
  key: string
): T | void => {
  if (!!result.value.ok) {
    localStorage.setItem("cachedCurrencies", JSON.stringify(result.value));
    return result.value;
  } else {
    console.error("接口异常，使用本地缓存:");
    const cached = JSON.parse(localStorage.getItem(key) || "{}");
    return cached;
  }
};

export const getCombinedWalletData = async () => {
  const controller = new AbortController();
  const signal = controller.signal;
  try {
    const results = await Promise.allSettled([
      currencies({ signal }),
      walletBalance({ signal }),
      liveRate({ signal }),
    ]);

    const [currenciesRes, balanceRes, liveRateRes] = results.map(
      (result, index) => {
        if (result.status === "fulfilled") {
          switch (index) {
            case 0:
              return ErrorFetch({ value: result.value }, "cachedCurrencies");
            case 1:
              return ErrorFetch({ value: result.value }, "cachedBalance");
            case 2:
              return ErrorFetch({ value: result.value }, "cachedLiveRate");
            default:
              return {};
          }
        }

        // 错误处理（分接口差异化降级）
        switch (index) {
          case 0:
            console.error("币种接口异常，使用本地缓存");
            return JSON.parse(localStorage.getItem("cachedCurrencies") || "{}");
          case 1:
            console.error("余额接口异常，展示空数据");
            return JSON.parse(localStorage.getItem("cachedBalance") || "{}");
          case 2:
            console.error("汇率接口异常，使用最后有效值");
            return JSON.parse(localStorage.getItem("cachedLiveRate") || "{}");
          default:
            return {};
        }
      }
    );

    // // 创建哈希映射
    const balanceMap = balanceRes.wallet.reduce(
      (map: { [key: string]: WalletBalance }, curr: WalletBalance) => {
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

    return currenciesRes.currencies
      .map((currency: CombinedItem) => {
        const walletItem = balanceMap[currency.symbol];
        const errorCoinInfo = currency?.symbol
          ? currency.symbol
          : walletItem?.currency;
        const usdMount = new Decimal(
          rateMap[walletItem?.currency]?.[0]?.rate || 0
        )
          .mul(new Decimal(walletItem?.amount || 0))
          .div(new Decimal(rateMap[walletItem?.currency]?.[0]?.amount || 0))
          .toFixed(2);
        return {
          ...currency, // 直接通过哈希查找
          ...(walletItem || {}), // 直接通过哈希查找
          name: errorCoinInfo,
          unit: errorCoinInfo,
          usdMount: !isNaN(Number(usdMount)) ? usdMount : "0", // 直接通过哈希查找
        };
      })
      .sort(
        (a: CombinedItem, b: CombinedItem) =>
          Number(b.usdMount) - Number(a.usdMount)
      );
  } catch (e) {
    //report error
    console.error(e);
  } finally {
    controller.abort();
  }
};
