// src/components/game/NftCard.tsx
"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { NFT_ABI, NFT_ADDRESS } from "../../lib/contract-game";
import Image from "next/image";

interface NftCardProps {
  tokenId: bigint;
}

interface NftMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: { trait_type: string; value: string | number }[];
}

const PINATA_GATEWAY = "https://red-military-crocodile-811.mypinata.cloud";

export default function NftCard({ tokenId }: NftCardProps) {
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [isRedeemed, setIsRedeemed] = useState(false); // State untuk menandai NFT yg sudah di-redeem

  // 1. Hook untuk membaca data dari kontrak
  const { data: tokenURI, isLoading: isLoadingUri } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  // Ambil data tier dari kontrak
  const { data: tier } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'nftTier',
    args: [tokenId],
  });

  // 2. Hook untuk menulis (mengirim transaksi) ke kontrak
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // 3. Fetch metadata dari IPFS saat tokenURI tersedia
  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI && typeof tokenURI === 'string') {
        try {
          const metadataUrl = tokenURI.replace('ipfs://', `${PINATA_GATEWAY}/ipfs/`);
          const response = await fetch(metadataUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          const data: NftMetadata = await response.json();
          // Pastikan gambar juga menggunakan gateway jika formatnya IPFS
          if (data.image && data.image.startsWith('ipfs://')) {
            data.image = data.image.replace('ipfs://', `${PINATA_GATEWAY}/ipfs/`);
          }
          setMetadata(data);
        } catch (error) {
          console.error("Failed to fetch NFT metadata:", error);
        }
      }
    };
    fetchMetadata();
  }, [tokenURI]);

  // Set state isRedeemed setelah transaksi sukses
  useEffect(() => {
    if (isSuccess) {
      setIsRedeemed(true);
    }
  }, [isSuccess]);

  // Fungsi untuk memanggil `redeem` di smart contract
  const handleRedeem = () => {
    writeContract({
      address: NFT_ADDRESS,
      abi: NFT_ABI,
      functionName: 'redeem',
      args: [tokenId],
    });
  };

  const isLoading = isLoadingUri || !metadata;

  if (isRedeemed) {
    return (
      <div className="nft-card-redeemed">
        <p>NFT #{tokenId.toString()} Redeemed!</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="nft-card animate-pulse">
        <div className="nft-card-image bg-gray-700"></div>
        <div className="nft-card-info">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2 mt-1"></div>
        </div>
      </div>
    );
  }

  const isProcessingTx = isPending || isConfirming;

  return (
    <div className="nft-card">
      {tier && <div className="nft-tier-badge">Tier {tier.toString()}</div>}
      <div className="nft-card-image">
        <Image 
          src={metadata.image} 
          alt={metadata.name} 
          width={200}
          height={200}
          className="rounded-md object-cover"
          priority // Prioritaskan gambar yang terlihat di viewport
        />
      </div>
      <div className="nft-card-info">
        <p>{metadata.name}</p>
        <span className="text-xs text-gray-400">#{tokenId.toString()}</span>
      </div>
      <button 
        onClick={handleRedeem} 
        className="btn-secondary"
        disabled={isProcessingTx}
      >
        {isPending ? "Confirm..." : isConfirming ? "Redeeming..." : "Redeem"}
      </button>
    </div>
  );
}