// src/components/game/CreatePosition.tsx
"use client";

import { useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { GAME_ABI, GAME_ADDRESS } from "../../lib/contract-game";

interface CreatePositionProps {
  onPositionCreated: () => void; // Prop untuk callback
}

export default function CreatePosition({ onPositionCreated }: CreatePositionProps) {
  const { data: hash, isPending, writeContract } = useWriteContract();

  const handleCreate = () => {
    writeContract({
      address: GAME_ADDRESS,
      abi: GAME_ABI,
      functionName: 'createStakePosition',
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  // Panggil callback setelah transaksi berhasil
  useEffect(() => {
    if (isSuccess) {
      onPositionCreated();
    }
  }, [isSuccess, onPositionCreated]);

  return (
    <div className="create-position-panel">
      <h2>Begin Your Ascension</h2>
      <p>Create a staking position to start your journey and earn NFT rewards.</p>
      <button onClick={handleCreate} disabled={isPending} className="btn-primary">
        {isPending ? "Creating Position..." : "Create Stake Position"}
      </button>
    </div>
  );
}