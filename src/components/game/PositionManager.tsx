// src/components/game/PositionManager.tsx

"use client";

import { useMemo } from "react";
import { useReadContracts, useReadContract } from "wagmi";
import { formatUnits, zeroAddress } from "viem";
import { GAME_ABI, GAME_ADDRESS } from "../../lib/contract-game";
import { SUPPORTED_TOKENS_GAME } from "../../lib/game-config"; 
import TierProgress from './TierProgress';
import ManageFunds from './ManageFunds';
import NftClaim from './NftClaim';
import StakedTokensList from "./StakedTokensList";
import NextTierRequirements from "./NextTierRequirements";

interface PositionManagerProps {
  stakeId: bigint;
  positionData: readonly [`0x${string}`, bigint, number];
  onPositionUpdate: () => void;
}

export default function PositionManager({ stakeId, positionData, onPositionUpdate }: PositionManagerProps) {
  const lockupEndTimestamp = positionData[1];
  const currentTier = positionData[2];
  const nextTier = currentTier + 1;

  // 1. Ambil semua jumlah token yang sudah di-stake (ini tetap dibutuhkan untuk daftar "Your Staked Assets")
  const { data: stakedAmountsData } = useReadContracts({
    contracts: SUPPORTED_TOKENS_GAME.map(t => ({
        address: GAME_ADDRESS,
        abi: GAME_ABI,
        functionName: 'getStakedAmount',
        args: [stakeId, t.address === 'Native' ? zeroAddress : t.address] as const,
    })),
    query: { refetchInterval: 5000 }
  });

  // --- KOREKSI UTAMA: Menggunakan fungsi helper `getTierRequirements` ---
  // 2. Ambil SEMUA data requirements (daftar token & jumlahnya) untuk tier selanjutnya dalam SATU PANGGILAN.
  const { data: nextTierData } = useReadContract({
    address: GAME_ADDRESS,
    abi: GAME_ABI,
    functionName: 'getTierRequirements',
    args: [nextTier],
    query: { 
      enabled: nextTier < 10, // Asumsi MAX_TIER adalah 9
      refetchInterval: 30000, // Tidak perlu sering-sering karena jarang berubah
    }
  });

  // 3. Olah data staked tokens untuk ditampilkan (tidak ada perubahan di sini)
  const stakedTokens = useMemo(() => {
    if (!stakedAmountsData) return [];
    return SUPPORTED_TOKENS_GAME.map((token, index) => ({
      token,
      amount: stakedAmountsData[index].status === 'success' ? parseFloat(formatUnits(stakedAmountsData[index].result as bigint, 18)).toFixed(4) : "0.00"
    })).filter(t => parseFloat(t.amount) > 0);
  }, [stakedAmountsData]);

  // 4. Olah data syarat tier berikutnya dengan sumber data yang baru & lebih efisien
  const nextTierRequirements = useMemo(() => {
    // Gunakan hasil dari `getTierRequirements`
    if (!nextTierData || !stakedAmountsData) return [];
    
    const [requiredTokens, requiredAmounts] = nextTierData;

    return requiredTokens.map((tokenAddress, index) => {
        const tokenInfo = SUPPORTED_TOKENS_GAME.find(t => (t.address === 'Native' ? zeroAddress : t.address) === tokenAddress)!;
        const tokenIndexInAllTokens = SUPPORTED_TOKENS_GAME.findIndex(t => (t.address === 'Native' ? zeroAddress : t.address) === tokenAddress);
        
        const stakedAmountResult = stakedAmountsData[tokenIndexInAllTokens];
        const currentStakedBigInt = stakedAmountResult?.status === 'success' ? (stakedAmountResult.result as bigint) : 0n;
        const requiredAmountBigInt = requiredAmounts[index];

        return {
          symbol: tokenInfo.symbol,
          currentAmount: parseFloat(formatUnits(currentStakedBigInt, 18)),
          requiredAmount: parseFloat(formatUnits(requiredAmountBigInt, 18)),
        }
    });
  }, [nextTierData, stakedAmountsData]);

  return (
    <div className="position-manager-grid">
      <div className="main-panel">
        <div className="panel-header">
          <h3>Stake Position #{stakeId.toString()}</h3>
          <div className="tier-display">
            <span>TIER</span>
            <span className="tier-number">{currentTier}</span>
          </div>
        </div>
        <div className="panel-body">
            <h4 className="panel-subtitle">Your Staked Assets</h4>
            <StakedTokensList stakedTokens={stakedTokens} />
            
            <hr className="divider my-6" />

            <h4 className="panel-subtitle">Progress to Tier {nextTier}</h4>
            <TierProgress requirements={nextTierRequirements} />
            <NextTierRequirements requirements={nextTierRequirements} />
        </div>
      </div>
      <div className="side-panel">
        <ManageFunds stakeId={stakeId} lockupEndTimestamp={lockupEndTimestamp} onPositionUpdate={onPositionUpdate}/>
        <NftClaim stakeId={stakeId} currentTier={currentTier} />
      </div>
    </div>
  );
}