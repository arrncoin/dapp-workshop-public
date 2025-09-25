// src/app/swap/page.tsx
"use client";

import { useAccount } from "wagmi";
import ConnectScreen from "../../components/ConnectScreen";
import SwapPanel from "../../components/swap/SwapPanel";
import LiquidityDisplay from "../../components/swap/LiquidityDisplay";
import { SUPPORTED_TOKENS_GAME } from "../../lib/game-config";
import { IoBatteryChargingOutline } from "react-icons/io5";
import styles from "../../styles/SwapPage.module.css";

export default function SwapPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectScreen />;
  }

  return (
    <div className="homepage-container">
      <h2 className={styles.h2}>Manage your swap assets</h2>

      {/* Wadah utama yang mengatur layout 2 kolom */}
      <div className={styles.swapPageLayout}>

        {/* Kolom Kiri: Swap Panel */}
        <div className={styles.swapPanelContainer}>
          <SwapPanel />
        </div>

        {/* Kolom Kanan: Pool Liquidity */}
        <div className={styles.liquidityPanelContainer}>
          <div className="panel-card">
            <h3 className={`${styles.liquidityPanelTitle} flex items-center justify-center gap-2`}>
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