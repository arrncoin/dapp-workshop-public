// src/app/page.tsx
"use client";

import { useAccount } from "wagmi";
import SwapPabel from "../components/swap/SwapPanel";
import ConnectScreen from "../components/ConnectScreen";
import "../styles/HomePage.css";

export default function HomePage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectScreen />;
  }

  return (
    <div className="homepage-container">
      <h1 className="main-title">KimCilSwap</h1>
      <p className="main-subtitle">
        Welcome to the KimCil Swap & staking platform. Swap & Stake your assets to earn high-yield rewards.
      </p>
      <div className="swap-panel-wrapper">
        <SwapPabel />
      </div>
    </div>
  );
}