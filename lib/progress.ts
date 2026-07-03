export function calculateProgress(
  currentAmount: number,
  targetAmount: number,
): number {
  if (targetAmount <= 0) return 0;
  return Math.min(currentAmount / targetAmount, 1);
}

export function calculateUnlockedPieces(
  progress: number,
  totalPieces: number,
): number {
  return Math.floor(progress * totalPieces);
}

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString("zh-CN")}`;
}
