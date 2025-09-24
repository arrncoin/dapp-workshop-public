// src/components/FaucetPanel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatUnits } from "viem";
import { FAUCET_ADDRESS, FAUCET_ABI, ERC20_ABI } from "../lib/contract";
import { formatLargeNumber } from "../lib/formatNumber";

// Faucet Game Tokens
const FAUCET = [
  {
    name: "kiBTC",
    address: "0xeFDD64D9D73711d8F1A080cA02741044389D8dfe" as const,
    decimals: 18,
  },
  {
    name: "kiETH",
    address: "0xcce84D292A63339663Bf6b98A73177E6A09126b7" as const,
    decimals: 18,
  },
  {
    name: "kiUSDT",
    address: "0xe9B7013d3F58DD3EDA3E46e440252CaDCf478d88" as const,
    decimals: 18,
  },
  {
    name: "kiUSDC",
    address: "0x4842B61B1D5bAA1Ab8971b13D51d70acd8543424" as const,
    decimals: 18,
  },
];

interface BalanceResult {
  status: "success" | "error" | "loading";
  result?: bigint;
}

export default function FaucetPanel() {
  const { address, isConnected } = useAccount();
  const [claimingGameToken, setClaimingGameToken] = useState<string | null>(
    null
  );

  // Baca saldo token game
  const {
    data: gameBalances,
    refetch: refetchGameBalances,
    isFetching: isGameBalancesFetching,
  } = useReadContracts({
    contracts: FAUCET.map((token) => ({
      address: token.address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address!] as const,
    })),
    query: {
      enabled: isConnected && !!address,
      staleTime: 5000,
    },
  }) as { data: BalanceResult[]; refetch: () => void; isFetching: boolean };

  // Claim token game
  const { data: claimGameHash, writeContract: claimGameTokens } =
    useWriteContract();
  const { isSuccess: isClaimGameSuccess } = useWaitForTransactionReceipt({
    hash: claimGameHash,
  });

  const handleClaimGame = useCallback(
    (tokenAddress: `0x${string}`) => {
      setClaimingGameToken(tokenAddress);
      claimGameTokens({
        address: FAUCET_ADDRESS,
        abi: FAUCET_ABI,
        functionName: "claim",
        args: [tokenAddress],
      });
    },
    [claimGameTokens]
  );

  useEffect(() => {
    if (isClaimGameSuccess) {
      refetchGameBalances();
      setClaimingGameToken(null);
    }
  }, [isClaimGameSuccess, refetchGameBalances]);

  const renderTokenCard = (
    token: typeof FAUCET[0],
    balance: BalanceResult | undefined,
    claiming: boolean,
    onClaim: () => void
  ) => {
    let formattedBalance = "0.0000";

    if (balance?.status === "success" && typeof balance.result === "bigint") {
      const balanceNumber = parseFloat(
        formatUnits(balance.result, token.decimals)
      );
      formattedBalance = formatLargeNumber(balanceNumber);
    }

    const isPending = claiming;
    const isDisabled =
      isPending || isGameBalancesFetching || !isConnected;

    return (
      <div
        key={token.address}
        className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center justify-between"
      >
        <h3 className="text-lg font-bold mb-2">{token.name}</h3>
        <p className="mb-4 text-sm">
          Saldo Game Anda:{" "}
          <span className="font-mono">{formattedBalance}</span>
        </p>
        <button
          className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white w-full ${
            isDisabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
          onClick={onClaim}
          disabled={isDisabled}
        >
          {claiming ? "Claiming..." : `Claim ${token.name}`}
        </button>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-center text-gray-400">
        Silakan hubungkan dompet Anda untuk mengklaim token faucet game.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
        Faucet Stake Game
      </h2>
      <p className="text-gray-400 mb-4">
        Klaim token untuk Game Staking dan berpartisipasi dalam KimCil Stake
        Game Hub.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {FAUCET.map((token, index) =>
          renderTokenCard(
            token,
            gameBalances?.[index],
            claimingGameToken === token.address,
            () => handleClaimGame(token.address)
          )
        )}
      </div>
    </div>
  );
}
