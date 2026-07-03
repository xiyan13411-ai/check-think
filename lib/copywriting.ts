const messages = [
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

export function getRandomMessage(): string {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getAllMessages(): string[] {
  return [...messages];
}
