// src/components/game/NftSelector.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useReadContract } from "wagmi";
import { NFT_ABI, NFT_ADDRESS } from "../../lib/contract-game";
import '../../styles/NftSelector.css'; // Impor file CSS baru

const PINATA_GATEWAY = "https://red-military-crocodile-811.mypinata.cloud";

interface NftMetadata {
  name: string;
  image: string;
}

interface NftItemProps {
  tokenId: bigint;
  onSelect: (tokenId: bigint) => void;
  isSelected: boolean;
}

const NftItem = ({ tokenId, onSelect, isSelected }: NftItemProps) => {
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);

  const { data: tokenURI } = useReadContract({
    address: NFT_ADDRESS,
    abi: NFT_ABI,
    functionName: 'tokenURI',
    args: [tokenId]
  });

  useEffect(() => {
    const fetchMetadata = async () => {
      if (tokenURI && typeof tokenURI === 'string') {
        try {
          const metadataUrl = tokenURI.startsWith('ipfs://') 
            ? tokenURI.replace('ipfs://', `${PINATA_GATEWAY}/ipfs/`) 
            : tokenURI;
            
          const response = await fetch(metadataUrl);
          const data: NftMetadata = await response.json();

          if (data.image) {
            data.image = data.image.startsWith('ipfs://')
              ? data.image.replace('ipfs://', `${PINATA_GATEWAY}/ipfs/`)
              : data.image;
          }
          setMetadata(data);
        } catch (error) {
          console.error(`Failed to fetch metadata for token #${tokenId}:`, error);
        }
      }
    };
    fetchMetadata();
  }, [tokenURI, tokenId]);

  if (!metadata) {
    return (
      <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }

  return (
    <div 
      className={`nft-selection-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(tokenId)}
    >
      <div className="nft-image-container">
        <Image src={metadata.image} alt={metadata.name} width={100} height={100} className="nft-image"/>
      </div>
      <div className="nft-info">
        <p className="nft-name">{metadata.name}</p>
        <p className="nft-id">#{tokenId.toString()}</p>
      </div>
    </div>
  );
};


interface NftSelectorProps {
  title: string;
  tokenIds: readonly bigint[];
  selectedIds: readonly bigint[];
  onSelectionChange: (ids: bigint[]) => void;
  isLoading?: boolean;
}

export default function NftSelector({ title, tokenIds, selectedIds, onSelectionChange, isLoading }: NftSelectorProps) {
  const handleSelect = (tokenId: bigint) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(tokenId)) {
      newSelection.delete(tokenId);
    } else {
      newSelection.add(tokenId);
    }
    onSelectionChange(Array.from(newSelection));
  };

  return (
    <div>
      <h4>{title}</h4>
      {isLoading ? (
        <div className="nft-grid">
          {[...Array(3)].map((_, i) => (
             <div key={i} className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      ) : tokenIds.length === 0 ? (
        <div className="empty-state">No NFTs found.</div>
      ) : (
        <div className="nft-grid">
          {tokenIds.map(id => (
            <NftItem 
              key={id.toString()} 
              tokenId={id} 
              onSelect={handleSelect}
              isSelected={selectedIds.includes(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}