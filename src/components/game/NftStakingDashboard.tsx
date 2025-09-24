// src/components/game/NftStakingDashboard.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NFT_ABI, NFT_ADDRESS, NFT_STAKING_ABI, NFT_STAKING_ADDRESS } from "../../lib/contract-game";
import RewardPanel from "./staking/RewardPanel";
import WalletNftPanel from "./staking/WalletNftPanel";
import StakedNftPanel from "./staking/StakedNftPanel";

// konstanta MAX_NFT_ID_TO_CHECK tidak lagi diperlukan karena metode fetch yang lebih efisien

export default function NftStakingDashboard() {
  const { address } = useAccount();

  // --- KOREKSI 1: Menggunakan fungsi `tokensOfOwner` untuk efisiensi ---
  // Mengganti logika fetch manual dengan hook `useReadContract` yang menargetkan `tokensOfOwner`.
  // Ini lebih efisien & scalable daripada iterasi manual `ownerOf`. [cite: 185, 186, 187, 188, 189]
  const { data: allOwnedNfts, refetch: refetchAllNfts, isLoading: isFetchingNfts } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokensOfOwner',
    args: [address!],
    query: { enabled: !!address }
  });

  const { data: stakedTokenIds, refetch: refetchStakedNfts, isLoading: isLoadingStakedNfts } = useReadContract({
    address: NFT_STAKING_ADDRESS,
    abi: NFT_STAKING_ABI,
    functionName: 'getUserStakedTokens', // [cite: 55]
    args: [address!],
    query: { enabled: !!address, refetchInterval: 5000 }
  });

  const { walletNfts, stakedNfts } = useMemo(() => {
    // Memastikan `allOwnedNfts` ada sebelum diproses
    const ownedIds = allOwnedNfts || [];
    const stakedSet = new Set(stakedTokenIds?.map(id => id.toString()));
    const wallet = ownedIds.filter(id => !stakedSet.has(id.toString()));
    return { walletNfts: wallet, stakedNfts: stakedTokenIds || [] };
  }, [allOwnedNfts, stakedTokenIds]);
  
  // --- KOREKSI 2: Menghapus logika `isApproved` yang tidak perlu ---
  // Kontrak NexCasaNFT secara otomatis menyetujui (approves) stakingContract resmi. 
  // Oleh karena itu, pengecekan `isApprovedForAll` dan fungsi untuk `approve` tidak diperlukan lagi.
  // const { data: isApproved, refetch: refetchApproval } = useReadContract({ /* ... DIHAPUS ... */ });

  const { data: pendingRewards, refetch: refetchRewards } = useReadContract({
      address: NFT_STAKING_ADDRESS,
      abi: NFT_STAKING_ABI,
      functionName: 'pendingRewards',
      args: [address!],
      query: { enabled: !!address, refetchInterval: 2000 }
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isSuccess: isTxSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isTxSuccess) {
      refetchStakedNfts();
      // refetchApproval(); // Dihapus karena tidak relevan lagi
      refetchRewards();
      refetchAllNfts();
    }
  }, [isTxSuccess, refetchStakedNfts, refetchRewards, refetchAllNfts]);

  // --- KOREKSI 3: Menghapus handler `approve` ---
  // const handleApprove = () => writeContract({ /* ... DIHAPUS ... */ });
  
  const handleStake = (selectedIds: bigint[]) => writeContract({ address: NFT_STAKING_ADDRESS, abi: NFT_STAKING_ABI, functionName: "stake", args: [selectedIds]});
  const handleUnstake = (selectedIds: bigint[]) => writeContract({ address: NFT_STAKING_ADDRESS, abi: NFT_STAKING_ABI, functionName: "unstake", args: [selectedIds]});
  const handleClaim = () => writeContract({ address: NFT_STAKING_ADDRESS, abi: NFT_STAKING_ABI, functionName: "claimRewards" });

  const isProcessing = isPending || isConfirming;

  return (
    <div className="nft-staking-dashboard">
      <RewardPanel 
        pendingRewards={pendingRewards}
        onClaim={handleClaim}
        isProcessing={isProcessing}
      />
      <div className="staking-area">
        <WalletNftPanel 
          walletNfts={walletNfts}
          isFetchingNfts={isFetchingNfts}
          // --- KOREKSI 4: Properti `isApproved` dan `onApprove` dihapus dari komponen anak ---
          // isApproved={isApproved} // DIHAPUS
          onStake={handleStake}
          // onApprove={handleApprove} // DIHAPUS
          isProcessing={isProcessing}
        />
        <StakedNftPanel 
          stakedNfts={stakedNfts}
          isLoadingStakedNfts={isLoadingStakedNfts}
          onUnstake={handleUnstake}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}