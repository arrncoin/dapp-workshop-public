// src/components/game/ManageFunds.tsx
"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi";
import { parseUnits, maxUint256, zeroAddress, formatUnits } from "viem";
import { GAME_ABI, GAME_ADDRESS, ERC20_ABI } from "../../lib/contract-game";
import { SUPPORTED_TOKENS_GAME, TokenGameInfo } from "../../lib/game-config";
import ConfirmationModal from "../common/ConfirmationModal";

interface ManageFundsProps {
  stakeId: bigint;
  lockupEndTimestamp: bigint;
  onPositionUpdate: () => void;
}

export default function ManageFunds({ stakeId, lockupEndTimestamp, onPositionUpdate }: ManageFundsProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<`0x${string}` | 'Native'>('Native');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isLocked = BigInt(Math.floor(Date.now() / 1000)) < lockupEndTimestamp;
  const selectedToken = SUPPORTED_TOKENS_GAME.find((t: TokenGameInfo) => t.address === selectedTokenAddress)!;
  const isNative = selectedTokenAddress === 'Native';
  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;

  // --- Hooks untuk Fetch Data (tidak ada perubahan signifikan) ---
  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({ address, query: { enabled: !!address && isNative } });
  const { data: erc20Balance, refetch: refetchErc20Balance } = useReadContract({
    address: isNative ? undefined : (selectedTokenAddress as `0x${string}`),
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address && !isNative }
  });
  const walletBalance = isNative ? nativeBalance?.value : erc20Balance;
  const formattedBalance = walletBalance !== undefined ? parseFloat(formatUnits(walletBalance, 18)).toFixed(4) : "0.00";
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: isNative ? undefined : (selectedTokenAddress as `0x${string}`),
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: [address!, GAME_ADDRESS],
    query: { enabled: !!address && !isNative }
  });

  // --- Hooks untuk Mengirim Transaksi ---
  const { data: hash, writeContract, isPending, reset } = useWriteContract();
  const { isSuccess: isTxSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // --- Logika setelah Transaksi Berhasil ---
  useEffect(() => {
    if (isTxSuccess) {
      setAmount("");
      onPositionUpdate(); 
      refetchAllowance();
      refetchNativeBalance();
      refetchErc20Balance();
      setIsModalOpen(false);
      reset(); // Reset state dari useWriteContract
    }
  }, [isTxSuccess, onPositionUpdate, refetchAllowance, refetchNativeBalance, refetchErc20Balance, reset]);
  
  // --- Fungsi Handler untuk Aksi Pengguna ---
  const handleApprove = () => {
    writeContract({
      address: selectedTokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [GAME_ADDRESS, maxUint256]
    });
  };

  const handleAddToStake = () => {
    const tokenArg = isNative ? zeroAddress : selectedTokenAddress;
    writeContract({
      address: GAME_ADDRESS,
      abi: GAME_ABI,
      functionName: "addToStake",
      args: [stakeId, tokenArg, parsedAmount],
      value: isNative ? parsedAmount : 0n,
    });
  };
  
// KOREKSI 1: Menambahkan fungsi handleWithdraw yang hilang
  const handleWithdraw = () => {
    const tokenArg = isNative ? zeroAddress : selectedTokenAddress;
    writeContract({
      address: GAME_ADDRESS,
      abi: GAME_ABI,
      functionName: "withdrawToken",
      args: [stakeId, tokenArg],
    });
  };

  // Fungsi yang dipanggil ketika tombol di klik (membuka modal)
  const handleDeleteClick = () => setIsModalOpen(true);
  const handleConfirmDelete = () => {
    writeContract({
      address: GAME_ADDRESS,
      abi: GAME_ABI,
      functionName: "deleteStakePosition",
      args: [stakeId],
    });
  };

  const handleMax = () => {
    if (walletBalance) {
      setAmount(formatUnits(walletBalance, 18));
    }
  };
  
  const needsApproval = !isNative && typeof allowance === 'bigint' && allowance < parsedAmount;
  const isProcessing = isPending || isConfirming;
  const isAddButtonDisabled = isLocked || isProcessing || !amount || parsedAmount === 0n;
  const isWithdrawButtonDisabled = isLocked || isProcessing;
  const isDeleteButtonDisabled = isProcessing;

  return (
    <div className="flex flex-col gap-4">
      <h4 className="funds-panel-title">Manage Funds</h4>
      
      {isLocked && (
        <p className="text-xs text-yellow-400 bg-yellow-900/50 p-2 rounded-md">
          Position is currently locked. You can add or withdraw funds after the lockup period ends.
        </p>
      )}

      <div className="input-area">
        <div className="balance-and-max-row">
          <div className="balance-display">
            Balance: {formattedBalance}
          </div>
          <button onClick={handleMax} className="max-button" disabled={isLocked}>MAX</button>
        </div>
        <div className="input-row">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="amount-input"
            disabled={isLocked}
          />
          <select
            value={selectedTokenAddress}
            onChange={(e) => setSelectedTokenAddress(e.target.value as `0x${string}` | 'Native')}
            className="token-select"
            disabled={isLocked}
          >
            {SUPPORTED_TOKENS_GAME.map((token: TokenGameInfo) => (
              <option key={token.address} value={token.address}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isNative ? (
        <button onClick={handleAddToStake} className="btn-primary" disabled={isAddButtonDisabled}>
          {isProcessing ? 'Processing...' : 'Add Funds'}
        </button>
      ) : needsApproval ? (
        <button onClick={handleApprove} className="btn-primary" disabled={isAddButtonDisabled}>
          {isProcessing ? 'Processing...' : `Approve ${selectedToken.symbol}`}
        </button>
      ) : (
        <button onClick={handleAddToStake} className="btn-primary" disabled={isAddButtonDisabled}>
          {isProcessing ? 'Processing...' : 'Add Funds'}
        </button>
      )}
      
      {/* KOREKSI 3: Memisahkan Tombol Withdraw dan Delete */}
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-xs text-gray-400">Actions:</p>
        <button 
          className="btn-secondary" 
          onClick={handleWithdraw}
          disabled={isWithdrawButtonDisabled}
          title={isLocked ? "You can only withdraw after the lockup period ends." : `Withdraw all ${selectedToken.symbol}`}
        >
          {isProcessing ? "Processing..." : `Withdraw ${selectedToken.symbol}`}
        </button>
        <button 
          className="withdraw-button" 
          onClick={handleDeleteClick}
          disabled={isDeleteButtonDisabled}
          title="Withdraws all recognized assets and permanently deletes this position."
        >
          {isProcessing ? "Processing..." : "Delete Position"}
        </button>
      </div>

      {/* Komponen Modal Konfirmasi */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Position Deletion"
        message="Are you sure you want to delete this staking position? This will attempt to withdraw all assets recognized by your current tier and the position will be gone forever. This action cannot be undone."
        confirmText={isProcessing ? "Processing..." : "Confirm & Delete"}
        cancelText="Cancel"
      />
    </div>
  );
}