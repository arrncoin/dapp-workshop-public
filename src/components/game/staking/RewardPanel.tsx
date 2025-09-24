// src/components/game/staking/RewardPanel.tsx
"use client";
import { formatUnits } from "viem";

interface RewardPanelProps {
  pendingRewards?: bigint;
  onClaim: () => void;
  isProcessing: boolean;
}

export default function RewardPanel({ pendingRewards, onClaim, isProcessing }: RewardPanelProps) {
  const rewardsAvailable = pendingRewards && pendingRewards > 0n;

  return (
    <div className="reward-panel">
      <h3>Your Pending Rewards</h3>
      <p>
        <span>{pendingRewards ? parseFloat(formatUnits(pendingRewards, 18)).toFixed(4) : "0.0000"}</span> $KimCil
      </p>
      <button 
        className="btn-primary" 
        onClick={onClaim} 
        disabled={isProcessing || !rewardsAvailable}
      >
        {isProcessing ? "Processing..." : "Claim All"}
      </button>
    </div>
  );
}