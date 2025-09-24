// src/lib/tokens.ts

// Mendefinisikan struktur data untuk setiap token
export interface TokenInfo {
  name: string;
  symbol: string;
  address: `0x${string}` | 'Native';
  icon: string;
}

// Mendefinisikan struktur data untuk setiap token
export interface TokenGameInfo {
  name: string;
  symbol: string;
  address: `0x${string}` | 'Native';
  icon: string;
}

// Ini adalah daftar terpusat untuk semua token yang didukung dApp Anda

// stake APY reword NN Token
export const SUPPORTED_TOKENS: TokenInfo[] = [
  {
    name: "Native Gas Token",
    symbol: "KII",
    address: "Native",
    icon: "KII",
  },
  {
    name: "KimCil BTC",
    symbol: "kiBTC",
    address: "0xeFDD64D9D73711d8F1A080cA02741044389D8dfe",
    icon: "kiBTC",
  },
  {
    name: "KimCil ETH",
    symbol: "kiETH",
    address: "0xcce84D292A63339663Bf6b98A73177E6A09126b7",
    icon: "kiETH",
  },
  {
    name: "KimCil USDT",
    symbol: "kiUSDT",
    address: "0xe9B7013d3F58DD3EDA3E46e440252CaDCf478d88",
    icon: "kiUSDT",
  },
  {
    name: "KimCil USDC",
    symbol: "kiUSDC",
    address: "0x4842B61B1D5bAA1Ab8971b13D51d70acd8543424",
    icon: "kiUSDC",
  },
];

// ini daftar token untuk stake game
export const SUPPORTED_TOKENS_GAME: TokenGameInfo[] = [
  {
    name: "Native Token",
    symbol: "KII",
    address: "Native",
    icon: "KII",
  },
  {
    name: "KimCil BTC",
    symbol: "kiBTC",
    address: "0xeFDD64D9D73711d8F1A080cA02741044389D8dfe",
    icon: "kiBTC",
  },
  {
    name: "KimCil ETH",
    symbol: "kiETH",
    address: "0xcce84D292A63339663Bf6b98A73177E6A09126b7",
    icon: "kiETH",
  },
  {
    name: "KimCil USDT",
    symbol: "kiUSDT",
    address: "0xe9B7013d3F58DD3EDA3E46e440252CaDCf478d88",
    icon: "kiUSDT",
  },
  {
    name: "KimCil USDC",
    symbol: "kiUSDC",
    address: "0x4842B61B1D5bAA1Ab8971b13D51d70acd8543424",
    icon: "kiUSDC",
  },
];

