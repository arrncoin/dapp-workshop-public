// src/components/Dashboard.tsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <ConnectButton />
      </header>
      <div className="main-content-wrapper">
        <div className="panel-card max-w-2xl mx-auto">
          <h2 className="dashboard-title">Welcome to KimCil</h2>
          <p className="panel-text mb-6">
            Explore our Swap and staking programs to earn rewards.
          </p>
          
          <div className="flex justify-center">
            <Link href="/swap" passHref legacyBehavior>
              <a className="btn-primary">
                Go to Swap
              </a>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}