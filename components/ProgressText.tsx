import { motion, AnimatePresence } from "framer-motion";

type ProgressTextProps = {
  progress: number;
};

export default function ProgressText({ progress }: ProgressTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={Math.floor(progress * 100)}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 10, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-4xl font-bold text-pink-500 tabular-nums"
      >
        {Math.floor(progress * 100)}%
      </motion.span>
    </AnimatePresence>
  );
}
