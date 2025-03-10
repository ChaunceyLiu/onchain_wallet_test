// types/wallet.ts
export type CurrencyCode = "BTC" | "ETH" | "CRO" | "BAT" | "USDT" | "MCO";

export interface Currency {
  coin_id: string;
  name: string;
  symbol: string;
  token_decimal: number;
  contract_address: string;
  withdrawal_eta: string[];
  colorful_image_url: string;
  gray_image_url: string;
  has_deposit_address_tag: boolean;
  min_balance: number;
  blockchain_symbol: string;
  trading_symbol: string;
  code: string;
  explorer: string;
  is_erc20: boolean;
  gas_limit: number;
  token_decimal_value: string;
  display_decimal: number;
  supports_legacy_address: boolean;
  deposit_address_tag_name: string;
  deposit_address_tag_type: string;
  num_confirmation_required: number;
}

export interface CombinedItem extends Currency {
  amount: number;
  usdMount: string;
  unit: string;
}

export type WalletBalance = {
  currency: string;
  amount: number;
};

export type Rates = {
  amount: string;
  rate: string;
}

export type ExchangeRatesItem = {
  from_currency: string;
  to_currency: string;
  rates: Rates[];
  time_stamp: number;
};
