// src/lib/game-config.ts

// 1. Definisi tipe dan daftar token yang didukung untuk Game
// =============================================================
export interface TokenGameInfo {
  name: string;
  symbol: string;
  address: `0x${string}` | 'Native';
  icon: string;
}
  
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
      icon: "BTC",
    },
    {
      name: "KimCil ETH",
      symbol: "kiETH",
      address: "0xcce84D292A63339663Bf6b98A73177E6A09126b7",
      icon: "ETH",
    },
    {
      name: "KimCil USDT",
      symbol: "kiUSDT",
      address: "0xe9B7013d3F58DD3EDA3E46e440252CaDCf478d88",
      icon: "USDT",
    },
    {
      name: "KimCil USDC",
      symbol: "kiUSDC",
      address: "0x4842B61B1D5bAA1Ab8971b13D51d70acd8543424",
      icon: "USDC",
    },
];

// 2. Definisi daftar token yang dibutuhkan untuk setiap tier
// =============================================================
const allGameTokens: (`0x${string}` | 'Native')[] = [
    'Native', 
    '0x9B27c0B8bd7E4c50A756eAdD0639c315Ae500aD5', 
    '0x7b2F4D724f1B345fEbe1a78bca69ffcF9746164D', 
    '0x691BdE8881aEdf74E02300387cb6553268a1BA53', 
    '0x7830529B761D7168648FB536B8Ea3A77439C925C'
];

export const TIER_CHECK_TOKENS: Record<number, (`0x${string}` | 'Native')[]> = {
  1: allGameTokens,
  2: allGameTokens,
  3: allGameTokens,
  4: allGameTokens,
  5: allGameTokens,
  6: allGameTokens,
  7: allGameTokens,
  8: allGameTokens,
  9: allGameTokens,
};

// 3. Definisi Lockup Days untuk setiap Tier
// =============================================================
export const TIER_LOCKUP_DAYS: Record<number, number> = {
    1: 1,
    2: 5,
    3: 7,
    4: 10,
    5: 12,
    6: 15,
    7: 20,
    8: 25,
    9: 30,
};