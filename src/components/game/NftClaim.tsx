// src/components/game/NftClaim.tsx
"use client";

import { useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { GAME_ABI, GAME_ADDRESS } from "../../lib/contract-game";

interface NftClaimProps {
  stakeId: bigint;
  currentTier: number;
  // lockupEndTimestamp tidak lagi dibutuhkan secara langsung untuk logika 'canClaim'
}

export default function NftClaim({ stakeId, currentTier }: NftClaimProps) {  
  // --- KOREKSI UTAMA: Gunakan `canClaimNft` sebagai sumber kebenaran tunggal ---
  const { data: canClaim, refetch: refetchCanClaim } = useReadContract({
    address: GAME_ADDRESS,
    abi: GAME_ABI,
    functionName: 'canClaimNft',
    args: [stakeId],
    query: { 
      enabled: currentTier > 0,
      // Refetch secara berkala untuk memperbarui status tombol saat lockup berakhir
      refetchInterval: 5000, 
    }
  });

  const { data: claimFee, isLoading: isLoadingFee } = useReadContract({
    address: GAME_ADDRESS,
    abi: GAME_ABI,
    functionName: 'claimNftFee',
  });

  // --- Siapkan fungsi untuk transaksi ---
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      refetchCanClaim(); // Cukup refetch satu sumber data ini
    }
  }, [isSuccess, refetchCanClaim]);

  const handleClaim = () => {
    // Pastikan claimFee tidak undefined saat dipassing
    if (typeof claimFee === 'bigint') {
      writeContract({
        address: GAME_ADDRESS,
        abi: GAME_ABI,
        functionName: 'claimNft',
        args: [stakeId],
        value: claimFee,
      });
    }
  };

  // --- Kondisi UI yang lebih sederhana ---
  const isProcessing = isPending || isConfirming;
  
  // Tentukan teks tombol berdasarkan state transaksi
  const getButtonText = () => {
    if (isPending) return "Check Wallet...";
    if (isConfirming) return "Claiming...";
    // `isSuccess` akan membuat `canClaim` menjadi false, jadi tidak perlu state khusus
    return `Claim Tier ${currentTier} NFT`;
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
      <h4 className="text-lg font-bold text-white">NFT Reward</h4>
      
      {currentTier > 0 ? (
        <>
          <p className="text-xs text-gray-400">
            You are eligible to claim your exclusive Tier {currentTier} NFT.
          </p>
          {!isLoadingFee && claimFee !== undefined && claimFee > 0n && (
            <p className="text-xs text-center text-purple-400">
              Fee: {formatUnits(claimFee, 18)} ETH
            </p>
          )}
          <button 
            className="btn-primary mt-2" 
            disabled={!canClaim || isProcessing}
            onClick={handleClaim}
            title={!canClaim ? "NFT has been claimed or position is locked" : ""}
          >
            {canClaim ? getButtonText() : `Tier ${currentTier} NFT Claimed`}
          </button>
        </>
      ) : (
        <p className="text-xs text-gray-400">Stake funds to reach Tier 1 and become eligible for an NFT reward.</p>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center break-words mt-2">
          {error.message.includes("User rejected the request") ? "Transaction rejected." : `Error: ${error.message}`}
        </p>
      )}
    </div>
  );
}