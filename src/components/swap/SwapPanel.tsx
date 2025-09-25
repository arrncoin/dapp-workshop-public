// src/components/swap/SwapPanel.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseUnits, maxUint256, formatUnits } from "viem";
import { ERC20_ABI, KIMCIL_ABI, KIMCIL_ADDRESS } from "../../lib/contract";
import { SUPPORTED_TOKENS_GAME } from "../../lib/game-config";
import "../../styles/SwapPanel.css"; 

// Tipe untuk props komponen SwapActions (tidak berubah)
type SwapActionsProps = {
  needsApproval: boolean;
  isApproving: boolean;
  isSwapping: boolean;
  amount: string;
  fromTokenAddress: `0x${string}`;
  handleApprove: () => void;
  handleSwap: () => void;
  swapButtonText?: string;
  swappingButtonText?: string;
};

function SwapActions({
  needsApproval, isApproving, isSwapping, amount, fromTokenAddress, handleApprove, handleSwap,
  swapButtonText = "Swap", swappingButtonText = "Swapping...",
}: SwapActionsProps) {
  const fromTokenSymbol = SUPPORTED_TOKENS_GAME.find((t) => t.address === fromTokenAddress)?.symbol || "Token";

  if (needsApproval) {
    return (
      <button onClick={handleApprove} className="btn btn-primary" disabled={isApproving}>
        {isApproving ? "Approving..." : `Approve ${fromTokenSymbol}`}
      </button>
    );
  }

  return (
    <button onClick={handleSwap} className="btn btn-primary" disabled={isSwapping || !amount}>
      {isSwapping ? swappingButtonText : swapButtonText}
    </button>
  );
}

export default function SwapPanel() {
  const { address } = useAccount();

  // State utama (tidak berubah)
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [amount, setAmount] = useState("");
  const [fromTokenAddress, setFromTokenAddress] = useState<`0x${string}`>(SUPPORTED_TOKENS_GAME[1].address as `0x${string}`);
  const [toTokenAddress, setToTokenAddress] = useState<`0x${string}`>(SUPPORTED_TOKENS_GAME[2].address as `0x${string}`);
  const [multiTargets, setMultiTargets] = useState<{ token: `0x${string}`; percent: number }[]>([]);
  
  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;

  // Hooks untuk allowance, balance, write, dan wait (tidak berubah)
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: fromTokenAddress, abi: ERC20_ABI, functionName: "allowance",
    args: [address!, KIMCIL_ADDRESS], query: { enabled: !!address },
  });
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: fromTokenAddress, abi: ERC20_ABI, functionName: 'balanceOf',
    args: [address!], query: { enabled: !!address },
  });
  const { data: swapHash, isPending: isSwapping, writeContract: writeSwap } = useWriteContract();
  const { data: approveHash, isPending: isApproving, writeContract: writeApprove } = useWriteContract();
  const { isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({ hash: swapHash });
  
  // useEffect (tidak berubah)
  useEffect(() => {
    if (isApproveSuccess) refetchAllowance();
    if (isSwapSuccess) {
      setAmount("");
      setMultiTargets([]);
      refetchBalance();
    }
  }, [isApproveSuccess, isSwapSuccess, refetchAllowance, refetchBalance]);

  // <-- PERUBAHAN 1: Menyiapkan array token tujuan secara dinamis -->
  const tokensOutAddresses = useMemo(() => {
    if (mode === 'single') {
      // Untuk single, array hanya berisi satu token tujuan
      return [toTokenAddress];
    }
    // Untuk multi, array berisi semua token dari multiTargets
    return multiTargets.map(t => t.token);
  }, [mode, toTokenAddress, multiTargets]);

  // <-- PERUBAHAN 2: Satu hook untuk mengambil semua kurs dengan fungsi baru -->
  const { data: ratesData } = useReadContract({
    address: KIMCIL_ADDRESS,
    abi: KIMCIL_ABI,
    functionName: 'getRatesForToken', // Menggunakan fungsi baru dari kontrak
    args: [fromTokenAddress, tokensOutAddresses],
    query: {
      // Hanya aktifkan jika ada token input dan minimal satu token output
      enabled: !!fromTokenAddress && tokensOutAddresses.length > 0 && tokensOutAddresses.every(addr => !!addr),
    }
  });

  // <-- PERUBAHAN 3: Logika estimasi disesuaikan untuk membaca hasil dari `ratesData` -->
  const singleEstOutput = useMemo(() => {
    // Di mode single, kursnya adalah elemen pertama dari array hasil
    const currentRate = ratesData?.[0] ?? 0n;
    if (!parsedAmount || currentRate === 0n) return 0n;
    return (parsedAmount * currentRate) / 1_000_000_000_000_000_000n;
  }, [parsedAmount, ratesData]);

  const multiEstOutputs = useMemo(() => {
    if (!parsedAmount || multiTargets.length === 0 || !ratesData || ratesData.length !== multiTargets.length) {
      return [];
    }
    
    return multiTargets.map((target, index) => {
      // Kurs untuk setiap target sesuai dengan urutan index di array hasil
      const rate = ratesData[index] ?? 0n;
      if (rate === 0n || target.percent === 0) {
        return { token: target.token, amount: 0n };
      }
      const amountInForTarget = (parsedAmount * BigInt(target.percent)) / 100n;
      const estOutput = (amountInForTarget * rate) / 1_000_000_000_000_000_000n;
      return { token: target.token, amount: estOutput };
    });
  }, [multiTargets, parsedAmount, ratesData]);

  const needsApproval = typeof allowance === "bigint" && allowance < parsedAmount;

  // Handler fungsi (tidak berubah)
  const handleApprove = () => writeApprove({
      address: fromTokenAddress, abi: ERC20_ABI, functionName: "approve", args: [KIMCIL_ADDRESS, maxUint256],
  });
  const handleSwap = () => writeSwap({
      address: KIMCIL_ADDRESS, abi: KIMCIL_ABI, functionName: "swap", args: [fromTokenAddress, toTokenAddress, parsedAmount],
  });
  const handleSwapMulti = () => {
    if (multiTargets.length === 0) return;
    const totalPercent = multiTargets.reduce((sum, t) => sum + t.percent, 0);
    if (totalPercent !== 100) { alert("Total persentase harus 100%!"); return; }
    const tokensOut = multiTargets.map((t) => t.token);
    const percentages = multiTargets.map((t) => BigInt(t.percent));
    writeSwap({
      address: KIMCIL_ADDRESS, abi: KIMCIL_ABI, functionName: "swapMulti", args: [fromTokenAddress, parsedAmount, tokensOut, percentages],
    });
  };
  const addTarget = () => setMultiTargets([...multiTargets, { token: SUPPORTED_TOKENS_GAME[2].address as `0x${string}`, percent: 0 }]);
  const updateTarget = (index: number, key: "token" | "percent", value: string) => {
    const updated = [...multiTargets];
    if (key === "token") { updated[index].token = value as `0x${string}`; }
    else { updated[index].percent = Math.max(0, Math.min(100, Number(value) || 0)); }
    setMultiTargets(updated);
  };
  const totalMultiPercent = multiTargets.reduce((sum, t) => sum + t.percent, 0);

  // JSX (tidak ada perubahan signifikan, karena sudah reaktif)
  return (
    <div className="panel-card">
      <h3 className="panel-title">Swap Panel</h3>

      <div className="mode-toggle">
        <button className={`btn btn-secondary ${mode === "single" ? "btn-active" : ""}`} onClick={() => setMode("single")}>
          Single Swap
        </button>
        <button className={`btn btn-secondary ${mode === "multi" ? "btn-active" : ""}`} onClick={() => setMode("multi")}>
          Multi Swap
        </button>
      </div>
      
      <div className="input-group">
        <div className="label-with-balance">
          <label className="panel-label">From Token</label>
          {typeof balance === 'bigint' && (
            <div className="balance-display">
              Saldo: {parseFloat(formatUnits(balance, 18)).toFixed(4)}
              <button 
                className="max-button" 
                onClick={() => setAmount(formatUnits(balance, 18))}
              >
                MAX
              </button>
            </div>
          )}
        </div>
        <select
          value={fromTokenAddress}
          onChange={(e) => setFromTokenAddress(e.target.value as `0x${string}`)}
          className="panel-select"
        >
          {SUPPORTED_TOKENS_GAME.filter((t) => t.address !== "Native").map((token) => (
            <option key={token.address} value={token.address}>{token.symbol}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="panel-input"
        />
      </div>

      {mode === "single" && (
        <>
          <div className="input-group">
            <label className="panel-label">To Token</label>
            <select
              value={toTokenAddress}
              onChange={(e) => setToTokenAddress(e.target.value as `0x${string}`)}
              className="panel-select"
            >
              {SUPPORTED_TOKENS_GAME.filter(
                (t) => t.address !== "Native" && t.address !== fromTokenAddress
              ).map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>

          {singleEstOutput > 0n && (
            <div className="panel-text estimation-summary">
              Est. Receive:{" "}
              <strong>
                {parseFloat(formatUnits(singleEstOutput, 18)).toFixed(4)}{" "}
                {SUPPORTED_TOKENS_GAME.find((t) => t.address === toTokenAddress)?.symbol}
              </strong>
            </div>
          )}

          <SwapActions
             needsApproval={!!needsApproval} isApproving={isApproving} isSwapping={isSwapping}
             amount={amount} fromTokenAddress={fromTokenAddress}
             handleApprove={handleApprove} handleSwap={handleSwap}
          />
        </>
      )}

      {mode === "multi" && (
        <>
          <div className="multi-target-list">
            {multiTargets.map((t, i) => {
              const est = multiEstOutputs.find((e, idx) => idx === i && e.token === t.token);
              const toTokenInfo = SUPPORTED_TOKENS_GAME.find(tk => tk.address === t.token);

              return (
                <div key={i} className="multi-target-row">
                  <select
                    value={t.token}
                    onChange={(e) => updateTarget(i, "token", e.target.value)}
                    className="panel-select multi-target-select"
                  >
                    {SUPPORTED_TOKENS_GAME.filter(
                      (tk) => tk.address !== "Native" && tk.address !== fromTokenAddress
                    ).map((token) => (
                      <option key={token.address} value={token.address}>{token.symbol}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={t.percent}
                    onChange={(e) => updateTarget(i, "percent", e.target.value)}
                    placeholder="%"
                    className="panel-input multi-target-percent"
                  />
                  {est && est.amount > 0n && (
                     <div className="panel-text multi-target-estimation">
                      ≈ {parseFloat(formatUnits(est.amount, 18)).toFixed(4)} {toTokenInfo?.symbol}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="multi-actions">
            <button onClick={addTarget} className="btn btn-secondary">
              + Add Token
            </button>
            <div className={`total-percent-display ${totalMultiPercent !== 100 ? 'invalid-percent' : 'valid-percent'}`}>
                Total: {totalMultiPercent}%
            </div>
          </div>

          <SwapActions
             needsApproval={!!needsApproval} isApproving={isApproving} isSwapping={isSwapping}
             amount={amount} fromTokenAddress={fromTokenAddress}
             handleApprove={handleApprove} handleSwap={handleSwapMulti}
             swapButtonText="Swap Multi" swappingButtonText="Swapping Multi..."
          />
        </>
      )}
    </div>
  );
}