// src/app/game/page.tsx
"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import ConnectScreen from "../../components/ConnectScreen";
import GameDashboard from "../../components/game/GameDashboard";
import NftGallery from "../../components/game/NftGallery";
import NftStakingDashboard from "../../components/game/NftStakingDashboard";
import "../../styles/GamePage.css";

type GameTab = "TIER" | "GALLERY" | "NFT_STAKING";

export default function GamePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<GameTab>("TIER");

  if (!isConnected) {
    return <ConnectScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "TIER":
        return <GameDashboard />;
      case "GALLERY":
        return <NftGallery />;
      case "NFT_STAKING":
        return <NftStakingDashboard />;
      default:
        return <GameDashboard />;
    }
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h1 className="game-title">KimCil Stake Game Hub</h1>
        <p className="game-subtitle">
          Ascend Tiers, Claim NFTs, and Earn Rewards.
        </p>
      </header>

      {/* Navigasi Tab */}
      <div className="game-tabs">
        <button 
          className={`tab-btn ${activeTab === 'TIER' ? 'active' : ''}`}
          onClick={() => setActiveTab('TIER')}
        >
          Tier Ascension
        </button>
        <button 
          className={`tab-btn ${activeTab === 'GALLERY' ? 'active' : ''}`}
          onClick={() => setActiveTab('GALLERY')}
        >
          My NFT Gallery
        </button>
        <button 
          className={`tab-btn ${activeTab === 'NFT_STAKING' ? 'active' : ''}`}
          onClick={() => setActiveTab('NFT_STAKING')}
        >
          NFT Staking
        </button>
      </div>

      {/* Konten dinamis berdasarkan tab yang aktif */}
      <div className="game-content">
        {renderContent()}
      </div>
    </div>
  );
}