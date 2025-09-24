// src/components/game/GameDashboard.tsx
"use client";

import { useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
// 1. Impor hook yang diperlukan
import { useQueryClient } from "@tanstack/react-query";
import { GAME_ABI, GAME_ADDRESS } from "../../lib/contract-game";
import PositionManager from "./PositionManager";

// ----- Komponen Detail Posisi (Tidak ada perubahan) -----
interface PositionDetailProps {
    stakeId: bigint;
    refetchPositions: () => void;
}
type StakeInfoResult = readonly [`0x${string}`, number, bigint, readonly `0x${string}`[], readonly bigint[]];

function PositionDetail({ stakeId, refetchPositions }: PositionDetailProps) {
    const { 
        data: positionData, 
        isLoading, 
        refetch 
    } = useReadContract({
        address: GAME_ADDRESS,
        abi: GAME_ABI,
        functionName: 'getStakeInfo',
        args: [stakeId],
    });

    const handlePositionUpdate = () => {
        refetch();
        refetchPositions();
    };

    if (isLoading) {
        return <div className="position-manager-loading">Loading Position #{stakeId.toString()}...</div>;
    }
    if (!positionData) {
        return <div className="position-manager-error">Could not load data for Position #{stakeId.toString()}.</div>;
    }
    const typedPositionData = positionData as StakeInfoResult;
    const formattedPositionData = [
        typedPositionData[0], // owner
        typedPositionData[2], // lockupEnd
        typedPositionData[1]  // tier
    ] as const;

    return (
        <PositionManager 
            stakeId={stakeId} 
            positionData={formattedPositionData}
            onPositionUpdate={handlePositionUpdate}
        />
    );
}


// ----- Komponen Dashboard Utama (Dengan Perbaikan) -----
export default function GameDashboard() {
    const { address, isConnected } = useAccount();
    // 2. Dapatkan instance queryClient untuk mengelola cache
    const queryClient = useQueryClient();

    const { 
        data: stakeIds, 
        isLoading: isLoadingIds, 
        refetch: refetchPositions,
        // 3. Ambil 'queryKey' agar kita tahu data mana yang harus di-invalidate
        queryKey 
    } = useReadContract({
        address: GAME_ADDRESS,
        abi: GAME_ABI,
        functionName: 'getOwnerStakeIds',
        args: [address!],
        query: {
            enabled: isConnected,
        },
    });

    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isSuccess: isCreationSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

    // 4. Inilah perbaikan utamanya
    useEffect(() => {
        if (isCreationSuccess) {
            console.log("Transaksi sukses! Menginvalidasi query...");
            // Perintah untuk membuang cache dan memaksa ambil data baru
            queryClient.invalidateQueries({ queryKey });
            // Reset state transaksi agar siap untuk berikutnya
            reset();
        }
    }, [isCreationSuccess, queryClient, queryKey, reset]);

    const handleCreatePosition = () => {
        writeContract({
            address: GAME_ADDRESS,
            abi: GAME_ABI,
            functionName: 'createStakePosition',
        });
    };
    
    const isProcessing = isPending || isConfirming;
    const hasPositions = stakeIds && stakeIds.length > 0;

    if (!isConnected) {
        return <div className="info-panel">Please connect your wallet to manage your staking positions.</div>;
    }

    return (
        <div className="game-dashboard pt-4">
            <div className="dashboard-content">
                {isLoadingIds ? (
                    <div className="info-panel">Loading your staking positions...</div>
                ) : hasPositions ? (
                    <>
                        <div className="positions-list">
                            {[...stakeIds].reverse().map(id => (
                                <PositionDetail 
                                    key={id.toString()} 
                                    stakeId={id}
                                    refetchPositions={refetchPositions}
                                />
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <button
                                className="btn-secondary"
                                onClick={handleCreatePosition}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Creating..." : "+ Create Another Position"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="empty-state flex flex-col items-center">
                        <p>You have no active staking positions.</p>
                        <button
                            className="btn-primary mt-4"
                            onClick={handleCreatePosition}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Creating..." : "Create First Position"}
                        </button>
                    </div>
                )}
            </div>
            
            {error && (
                <p className="error-message flex flex-col items-center">
                    {error.message.includes("User rejected the request") ? "Transaction rejected." : "An error occurred."}
                </p>
            )}
        </div>
    );
}