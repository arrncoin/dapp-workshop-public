// src/app/swap/page.tsx
"use client";

import { useAccount } from "wagmi";
import ConnectScreen from "../../components/ConnectScreen";
import SwapPanel from "../../components/swap/SwapPanel";
import LiquidityDisplay from "../../components/swap/LiquidityDisplay";
import { SUPPORTED_TOKENS_GAME } from "../../lib/game-config";
import { IoBatteryChargingOutline } from "react-icons/io5";
import "../../styles/SwapPage.css"; // Pastikan CSS diimpor

export default function SwapPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectScreen />;
  }

  return (
    <div className="homepage-container">
      <h2>Manage your swap assets</h2>

      {/* Wadah utama yang mengatur layout 2 kolom */}
      <div className="swap-page-layout">

        {/* Kolom Kiri: Swap Panel */}
        <div className="swap-panel-container">
          <SwapPanel />
        </div>

        {/* Kolom Kanan: Pool Liquidity */}
        <div className="liquidity-panel-container">
          <div className="panel-card">
            <h3 className="liquidity-panel-title flex items-center justify-center gap-2">
              Pool Liquidity <IoBatteryChargingOutline />
              </h3>
            {SUPPORTED_TOKENS_GAME
              .filter(token => token.address !== 'Native')
              .map(token => (
                <LiquidityDisplay
                  key={token.address}
                  tokenAddress={token.address as `0x${string}`}
                  tokenSymbol={token.symbol}
                />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}