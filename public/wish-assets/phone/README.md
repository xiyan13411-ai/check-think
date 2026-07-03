 # 愿望手机 — 视觉资产规范
 
 > 目录：`public/wish-assets/phone/`
 > 用途：为 AssetHeroScene 提供可替换的手机主视觉素材
 
 ---
 
 ## 目录结构
 
 ```
 public/wish-assets/phone/
   README.md              ← 本文件
   phone-base.png         ← 手机底图（未完成状态）
   phone-complete.png     ← 手机完整图（100% 时显示）
   fragments/
     fragment-01.png      ← 碎片素材（14–16 块）
     fragment-02.png
     ...
 ```
 
 ## 命名规则
 
 - `phone-base.png`：手机的**基础状态**，显示未拼合的手机主体
 - `phone-complete.png`：手机的**完整状态**，所有碎片拼合后的效果
 - `fragments/fragment-NN.png`：碎片图，建议透明 PNG，编号 01–16
 
 ## 尺寸建议
 
 - 手机主体图（base/complete）：建议 **400×800 px**
 - 碎片图：建议在 **80–200 px** 范围内
 - 所有图统一为 **透明背景 PNG**
 
 ## 坐标规则
 
 碎片位置在 `lib/wish-assets.ts` 中配置，坐标系为**相对于手机中心的偏移像素**：
 
 - `targetX / targetY`：碎片拼合到手机上时的位置（相对中心偏移）
 - `startX / startY`：碎片从外部飞入时的起始位置
 - `unlockAt`：碎片解锁的进度阈值（0.0–1.0）
 
 ## 替换资产
 
 1. 将新素材放入对应目录，保持命名一致
 2. 如果碎片数量/位置有变化，同步更新 `lib/wish-assets.ts`
 3. 素材缺失时自动使用内置 SVG fallback
