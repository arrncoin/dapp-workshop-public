// src/components/game/staking/StakedNftPanel.tsx
"use client";
import { useState } from "react";
import NftSelector from "../NftSelector";

interface StakedNftPanelProps {
  stakedNfts: readonly bigint[];
  isLoadingStakedNfts: boolean;
  onUnstake: (selectedIds: bigint[]) => void;
  isProcessing: boolean;
}

export default function StakedNftPanel({ stakedNfts, isLoadingStakedNfts, onUnstake, isProcessing }: StakedNftPanelProps) {
  const [selectedStakedNfts, setSelectedStakedNfts] = useState<bigint[]>([]);

  const handleUnstakeClick = () => {
    onUnstake(selectedStakedNfts);
    
    // --- PENYESUAIAN (UX Improvement) ---
    // Mengosongkan state pilihan setelah unstake di-trigger.
    // Ini memberikan feedback visual langsung kepada pengguna.
    setSelectedStakedNfts([]);
  };

  return (
    <div className="staked-nfts">
      <NftSelector
        title="Your Staked NFTs"
        tokenIds={stakedNfts}
        selectedIds={selectedStakedNfts}
        onSelectionChange={setSelectedStakedNfts}
        isLoading={isLoadingStakedNfts}
      />
      <button 
        className="withdraw-button mt-4" 
        onClick={handleUnstakeClick} 
        disabled={isProcessing || selectedStakedNfts.length === 0}
      >
        {isProcessing ? "Processing..." : "Unstake Selected"}
      </button>
    </div>
  );
}