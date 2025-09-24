"use client";

interface Requirement {
  symbol: string;
  currentAmount: number;
  requiredAmount: number;
}

// Saran stilistik: Mendefinisikan props dengan interface terpisah
interface NextTierRequirementsProps {
    requirements: Requirement[];
}

export default function NextTierRequirements({ requirements }: NextTierRequirementsProps) {
  if (!requirements || requirements.length === 0) {
    // Anda bisa mengembalikan null agar tidak merender apa pun jika tidak ada syarat
    return null;
  }

  return (
    <div className="tier-requirements mt-4 space-y-3">
      {requirements.map(req => {
        // Hindari pembagian dengan nol untuk keamanan
        const progress = req.requiredAmount > 0 
            ? Math.min((req.currentAmount / req.requiredAmount) * 100, 100) 
            : 100;
        
        const isComplete = req.currentAmount >= req.requiredAmount;
        
        const progressBarColorClass = isComplete ? 'bg-green-500' : 'bg-pink-600';

        return (
          <div key={req.symbol} className="requirement-item">
            <div className="requirement-info text-sm mb-1">
              <span>Stake {req.symbol}</span>
              <span className={isComplete ? 'text-green-400 font-medium' : 'text-gray-400'}>
                {/* Memformat angka agar lebih rapi */}
                {req.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} 
                / {req.requiredAmount.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className={`${progressBarColorClass} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}