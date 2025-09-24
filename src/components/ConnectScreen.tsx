// src/components/ConnectScreen.tsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import "../styles/ConnectScreen.css";

export default function ConnectScreen() {
  return (
    <div className="connect-container">
      {/* Bagian 1: Visual (Hanya tampil di Desktop) */}
      <div className="connect-visual">
        <Image
          src="/img/kimcil.png" // Menggunakan gambar kimcilnot yang sudah ada
          alt="KimCil DeFi Platform"
          width={400}
          height={400}
          className="connect-image"
          priority
        />
      </div>

      {/* Bagian 2: Konten & Deskripsi */}
      <div className="connect-content">
        <h1 className="connect-title">Masuki Ekosistem KimCil</h1>
        <p className="connect-description">
          Selamat datang di KimCilSwap, platform DeFi terdesentralisasi yang lengkap untuk semua kebutuhan Anda. Lakukan swap dan staking aset dengan mudah untuk memperoleh imbal hasil optimal, tukar token secara instan, dan nikmati berbagai fitur inovatif lainnya, all in one place</p>
        {/* Fitur Utama */}
        <div className="connect-features">
          <div className="feature-item">
            <span> staking</span>
            <p>High-Yield Staking</p>
          </div>
          <div className="feature-item">
            <span>🔄</span>
            <p>Instant Swaps</p>
          </div>
          <div className="feature-item">
            <span>🌉</span>
            <p>Game Staking</p>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="connect-button-wrapper">
          <ConnectButton
            label="Connect Wallet to Begin"
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </div>
  );
}