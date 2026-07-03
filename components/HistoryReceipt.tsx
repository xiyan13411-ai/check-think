"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/progress";
import type { SavingRecord } from "@/types/record";

type HistoryReceiptProps = {
  records: SavingRecord[];
};

export default function HistoryReceipt({ records }: HistoryReceiptProps) {
  const recentRecords = records.slice(-5).reverse();

  if (recentRecords.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="rounded-2xl bg-white p-5 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h2 className="mb-3 text-sm font-medium text-stone-500">存钱小票</h2>

      <div className="space-y-2">
        <AnimatePresence>
          {recentRecords.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between rounded-xl bg-stone-50 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-pink-500">
                  {formatCurrency(record.amount)}
                </span>
                <span className="text-xs text-stone-400">|</span>
                <span className="text-xs text-stone-400">
                  {new Date(record.createdAt).toLocaleString("zh-CN", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                {Math.floor(record.progressAfter * 100)}%
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
