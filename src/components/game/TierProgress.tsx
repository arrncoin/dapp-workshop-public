// src/components/game/TierProgress.tsx
"use client";

// Definisikan tipe data untuk setiap requirement
interface Requirement {
  symbol: string;
  currentAmount: number;
  requiredAmount: number;
}

interface TierProgressProps {
  // Gunakan tipe data yang sudah didefinisikan untuk type safety
  requirements: Requirement[];
}

export default function TierProgress({ requirements }: TierProgressProps) {
  // Jika tidak ada syarat untuk tier berikutnya (misalnya sudah tier maksimal)
  if (!requirements || requirements.length === 0) {
    return (
        <div className="text-sm text-gray-500">
            You have reached the maximum tier or the next tier is not defined yet.
        </div>
    );
  }

  // --- KOREKSI LOGIKA KALKULASI ---
  // Daripada menghitung rata-rata, kita cari progres dari syarat yang paling rendah (terlemah).
  // Ini lebih akurat sesuai aturan kontrak yang mengharuskan SEMUA syarat terpenuhi.
  
  // 1. Hitung progres individual untuk setiap syarat
  const individualProgress = requirements.map(req => {
    // Hindari pembagian dengan nol
    if (req.requiredAmount === 0) return 100;
    // Hitung progres untuk token ini, batasi maksimal 100%
    return Math.min((req.currentAmount / req.requiredAmount) * 100, 100);
  });

  // 2. Ambil nilai terendah dari semua progres individual
  const progressPercentage = Math.floor(Math.min(...individualProgress));

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">Overall Progress</span>
        <span className="text-sm font-medium text-white">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}