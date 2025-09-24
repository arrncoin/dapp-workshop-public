// src/components/game/staking/WalletNftPanel.tsx
"use client";
import { useState } from "react";
import NftSelector from "../NftSelector";

// --- KOREKSI 1: Menghapus prop yang tidak lagi digunakan ---
// Prop `isApproved` dan `onApprove` dihapus karena kontrak NexCasaNFT
// secara otomatis menyetujui kontrak staking resmi. 
interface WalletNftPanelProps {
  walletNfts: readonly bigint[];
  isFetchingNfts: boolean;
  onStake: (selectedIds: bigint[]) => void;
  isProcessing: boolean;
}

export default function WalletNftPanel({ walletNfts, isFetchingNfts, onStake, isProcessing }: WalletNftPanelProps) {
  const [selectedWalletNfts, setSelectedWalletNfts] = useState<bigint[]>([]);

  const handleStakeClick = () => {
    onStake(selectedWalletNfts);
    // Kosongkan pilihan setelah stake untuk UX yang lebih baik
    setSelectedWalletNfts([]);
  };

  return (
    <div className="wallet-nfts">
      <NftSelector
        title="Your Wallet NFTs"
        tokenIds={walletNfts}
        selectedIds={selectedWalletNfts}
        onSelectionChange={setSelectedWalletNfts}
        isLoading={isFetchingNfts}
      />
      
      {/* --- KOREKSI 2: Menghapus logika kondisional untuk tombol --- */}
      {/* Tombol "Approve" dan logikanya telah dihapus sepenuhnya. */}
      {/* Sekarang hanya ada satu tombol yaitu "Stake Selected". */}
      <button 
        className="btn-primary mt-4" 
        onClick={handleStakeClick} 
        disabled={isProcessing || selectedWalletNfts.length === 0}
      >
        {isProcessing ? "Processing..." : "Stake Selected"}
      </button>
    </div>
  );
}