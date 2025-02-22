export const walletBalance = () => {
  return Promise.resolve({
    ok: true,
    warning: "",
    wallet: [
      {
        currency: "USDT",
        amount: 1245,
      },
      {
        currency: "BTC",
        amount: 1.4,
      },
      {
        currency: "ETH",
        amount: 20.3,
      },
      {
        currency: "CRO",
        amount: 259.1,
      },
      {
        currency: "DAI",
        amount: 854,
      },
    ],
  }); // 模拟API调用
};
