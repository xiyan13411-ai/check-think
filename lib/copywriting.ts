const unlockMessages = [
  "叮！新碎片回来了！",
  "愿望又完整了一点点。",
  "又一块拼图归位了。",
  "碎片 +1，目标更近了。",
  "新的一块，拼回来了。",
  "愿望正在一块一块变得完整。",
  "解锁了一块新碎片，漂亮。",
];

const progressMessages = [
  "这笔钱正在把下一块碎片推近。",
  "下一块拼图正在路上。",
  "每存一笔，就离目标近一步。",
  "别急，下一块碎片已经在路上了。",
  "这块存进去了，下一块还远吗？",
  "存着存着，下一块就来了。",
  "今天的努力，正在变成明天的碎片。",
  "再努力一点，愿望就多一块。",
];

const sharedMessages = [
  "叮！未来的愿望回来了一小块。",
  "这不是一笔钱，是一块自由。",
  "存钱这事，终于有画面了。",
  "今天也偷偷变有钱了。",
  "小金库 +1，焦虑 -1。",
  "愿望不是突然实现的，是这样一块一块拼回来的。",
  "又存了一笔，离目标又近一步。",
  "每一块拼图，都让愿望更清晰一点。",
  "为想要的生活存钱，比买买买更爽。",
  "这就是存钱的快乐——看得见。",
  "你离新手机又近了一点点。",
  "愿望基金已到账一份。",
  "每一笔小钱，都是未来的大快乐。",
  "今天对自己说：干得漂亮。",
  "一块一块拼，愿望总会完整的。",
];

export function getRandomMessage(unlockedNewPiece: boolean): string {
  if (unlockedNewPiece) {
    const pool = [...unlockMessages, ...sharedMessages];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const pool = [...progressMessages, ...sharedMessages];
  return pool[Math.floor(Math.random() * pool.length)];
}
