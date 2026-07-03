"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

type SavePanelProps = {
  onSave: (amount: number) => void;
};

const QUICK_AMOUNTS = [10, 50, 100, 500];

export default function SavePanel({ onSave }: SavePanelProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleQuickSave = (amount: number) => {
    setActiveButton(amount);
    onSave(amount);
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleCustomSave = () => {
    const parsed = parseInt(customAmount, 10);
    if (isNaN(parsed) || parsed <= 0) return;
    setActiveButton(0);
    onSave(parsed);
    setCustomAmount("");
    setTimeout(() => setActiveButton(null), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCustomSave();
    }
  };

  const isCustomValid =
    customAmount !== "" && !isNaN(parseInt(customAmount, 10)) && parseInt(customAmount, 10) > 0;

  return (
    <motion.div
      className="rounded-2xl bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="mb-3 text-sm font-medium text-stone-500">存一笔</h2>

      {/* Quick amount buttons */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <motion.button
            key={amount}
            onClick={() => handleQuickSave(amount)}
            className="min-h-[44px] rounded-xl bg-gradient-to-br from-pink-100 to-orange-100 font-semibold text-pink-600 transition-colors hover:from-pink-200 hover:to-orange-200 active:from-pink-300 active:to-orange-300"
            whileTap={{ scale: 0.92 }}
            animate={
              activeButton === amount
                ? { scale: [1, 1.08, 1] }
                : {}
            }
            transition={{ duration: 0.2 }}
          >
            ¥{amount}
          </motion.button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            ¥
          </span>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="自定义金额"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] w-full rounded-xl border border-stone-200 bg-stone-50 pl-8 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
            min={1}
          />
        </div>
        <motion.button
          onClick={handleCustomSave}
          disabled={!isCustomValid}
          className={`min-h-[44px] rounded-xl px-5 font-semibold text-white transition-colors ${
            isCustomValid
              ? "bg-gradient-to-r from-pink-400 to-orange-400 shadow-sm hover:from-pink-500 hover:to-orange-500"
              : "cursor-not-allowed bg-stone-200 text-stone-400"
          }`}
          whileTap={isCustomValid ? { scale: 0.92 } : {}}
          animate={
            activeButton === 0 ? { scale: [1, 1.08, 1] } : {}
          }
          transition={{ duration: 0.2 }}
        >
          存
        </motion.button>
      </div>
    </motion.div>
  );
}
