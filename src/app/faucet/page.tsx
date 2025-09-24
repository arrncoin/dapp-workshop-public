// src/app/faucet/page.tsx
"use client";

import { useAccount } from "wagmi";
import ConnectScreen from "../../components/ConnectScreen";
import FaucetPanel from "../../components/FaucetPanel"; // Komponen yang akan kita buat
import "../../styles/FaucetPage.css"; // File CSS yang akan kita buat

export default function FaucetPage() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <ConnectScreen />;
  }

  return (
    <div className="faucet-container">
      <header className="faucet-header">
        <h1 className="faucet-title">Testnet Token Faucet</h1>
        <p className="faucet-subtitle">
          Claim free testnet tokens to try out the KimCil ecosystem.
        </p>
      </header>
      <FaucetPanel />
    </div>
  );
}