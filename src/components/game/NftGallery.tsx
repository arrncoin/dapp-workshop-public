// src/components/game/NftGallery.tsx
"use client";

import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { NFT_ADDRESS, NFT_ABI, NFT_STAKING_ADDRESS, NFT_STAKING_ABI } from "../../lib/contract-game";
import NftCard from "./NftCard";

export default function NftGallery() {
  const { address } = useAccount();

  // 1. Ambil SEMUA tokenId yang dimiliki oleh user secara efisien
  const { 
    data: allOwnedNfts, 
    isLoading: isLoadingOwned, 
    error: errorOwned 
  } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: "tokensOfOwner", // Menggunakan helper dari NexCasaNFT.sol 
    args: [address!],
    query: { enabled: !!address },
  });

  // 2. Ambil SEMUA tokenId yang SAAT INI sedang di-stake oleh user
  const { 
    data: stakedNfts, 
    isLoading: isLoadingStaked, 
    error: errorStaked 
  } = useReadContract({
    address: NFT_STAKING_ADDRESS, // Pastikan ini alamat kontrak NexCasaNFTStaking
    abi: NFT_STAKING_ABI,
    functionName: "getUserStakedTokens", // Menggunakan helper dari NexCasaNFTStaking.sol 
    args: [address!],
    query: { enabled: !!address },
  });

  // 3. Hitung NFT mana yang ada di wallet (dimiliki tapi tidak di-stake)
  const walletNfts = useMemo(() => {
    if (!allOwnedNfts || !stakedNfts) return [];
    const stakedSet = new Set(stakedNfts.map(id => id.toString()));
    return allOwnedNfts.filter(id => !stakedSet.has(id.toString()));
  }, [allOwnedNfts, stakedNfts]);

  const isLoading = isLoadingOwned || isLoadingStaked;
  const error = errorOwned || errorStaked;

  if (isLoading) return <div className="loading-state">Loading your NFT collection...</div>;
  if (error) return <div className="info-panel text-red-400">Failed to load NFT data. Please refresh.</div>;

  return (
    <div className="space-y-8">
      {/* Bagian untuk NFT yang ada di wallet */}
      <section>
        <h2 className="text-xl font-bold mb-2">NFTs in Your Wallet</h2>
        {walletNfts.length === 0 ? (
          <div className="info-panel">No NFTs in your wallet.</div>
        ) : (
          <div className="nft-gallery-grid">
            {walletNfts.map(id => (
              <NftCard key={`wallet-${id.toString()}`} tokenId={id} />
            ))}
          </div>
        )}
      </section>

      {/* Bagian untuk NFT yang sedang di-stake */}
      <section>
        <h2 className="text-xl font-bold mb-2">Staked NFTs</h2>
        {(stakedNfts?.length ?? 0) === 0 ? (
          <div className="info-panel">No NFTs currently staked.</div>
        ) : (
          <div className="nft-gallery-grid">
            {stakedNfts!.map(id => (
              <NftCard key={`staked-${id.toString()}`} tokenId={id} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}