// src/components/game/StakedTokensList.tsx
"use client";

import { TokenGameInfo } from "../../lib/tokens";

interface StakedToken {
  token: TokenGameInfo;
  amount: string;
}

export default function StakedTokensList({ stakedTokens }: { stakedTokens: StakedToken[] }) {
  if (stakedTokens.length === 0) {
    return <p className="staked-token-empty">You haven&apos;t staked any tokens in this position yet.</p>;
  }

  return (
    <div className="staked-token-list">
      {stakedTokens.map(({ token, amount }) => (
        <div key={token.address} className="staked-token-item">
          <span className="token-name">{token.name} ({token.symbol})</span>
          <span className="token-amount">{amount}</span>
        </div>
      ))}
    </div>
  );
}