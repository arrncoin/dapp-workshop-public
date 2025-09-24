// src/components/LiquidityDisplay.tsx
"use client";

import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { KIMCIL_ABI, KIMCIL_ADDRESS } from '../../lib/contract'; // Pastikan path ini benar

// Definisikan tipe untuk props
type LiquidityDisplayProps = {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
};

export default function LiquidityDisplay({ tokenAddress, tokenSymbol }: LiquidityDisplayProps) {
  // Hook untuk memanggil fungsi getLiquidity dari kontrak Anda
  const { data: liquidityAmount, isLoading } = useReadContract({
    address: KIMCIL_ADDRESS,
    abi: KIMCIL_ABI,
    functionName: 'getLiquidity',
    args: [tokenAddress],
    // Hapus 'watch: true' dan ganti dengan objek query
    query: {
      // Data akan di-refetch setiap 5 detik (5000 milidetik)
      // untuk menjaga data tetap up-to-date.
      refetchInterval: 5000,
    }
  });

  // Tampilkan pesan loading saat data sedang diambil
  if (isLoading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', opacity: 0.6 }}>
            <strong>{tokenSymbol}</strong>
            <span>Memuat...</span>
        </div>
    );
  }

  // Format angka besar dari kontrak menjadi angka yang mudah dibaca
  const formattedAmount = typeof liquidityAmount === 'bigint' 
    ? parseFloat(formatUnits(liquidityAmount, 18)).toLocaleString('id-ID', { maximumFractionDigits: 2 })
    : '0';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
      <strong>{tokenSymbol}</strong>
      <span>{formattedAmount}</span>
    </div>
  );
}