 # AI 视觉资产生成指南
 
 本文件提供用于生成「愿望拼图存钱」主视觉电话资产的 AI prompt 模板和生成说明。
 
 ---
 
 ## 工具推荐
 
 - Midjourney（最适合产品渲染风格）
 - DALL-E 3（适合快速验证构图）
 - 即梦 / 可灵（中文友好）
 - ComfyUI + SDXL（可控性最高）
 
 ---
 
 ## Prompt A：主手机图（phone-render.png）
 
 用于 `FragmentedPhoneScene` 的基础图，clip-path 切成碎片。
 
 建议尺寸：1000×1600 px，透明背景
 
 ### 英文 Prompt
 
 ```
 A premium white and silver futuristic smartphone back render,
 no logo, no brand marks, no text, single phone object,
 three camera lenses in a rounded square camera island,
 ceramic glass back, polished metal edges,
 subtle deep blue black reflective inner surface visible
 through fractured panels, product render,
 soft studio lighting, floating in air,
 three-quarter perspective, high detail, clean premium design,
 transparent background, isolated object,
 1000x1600, no watermark
 ```
 
 ### 中文说明
 
 一台高级白银色智能手机背面渲染图：
 - 无品牌标志、无文字、单台手机
 - 三镜头模组、陶瓷玻璃背板、金属边框
 - 带少量深蓝黑色反光区域
 - 产品渲染风、柔和棚拍光、3/4 透视
 - 透明背景、无水印
 
 ---
 
 ## Prompt B：破碎重组参考图
 
 用于指导碎片排列方式，不一定直接进代码。
 
 ```
 A premium white and silver futuristic smartphone broken into
 floating physical shards, no logo, no text,
 the phone is partially reassembled in the center,
 multiple irregular ceramic and glass fragments floating around it,
 fragments have thickness, metallic edges, shadows and highlights,
 some fragments reveal deep blue black reflective inner surfaces,
 soft studio lighting, clean beige background,
 product poster style, high-end app hero visual, no watermark
 ```
 
 ---
 
 ## Prompt C：碎片素材 sprite
 
 用于生成一批碎片 PNG，后续人工切片参考。
 
 ```
 A set of 16 isolated irregular smartphone body fragments,
 white silver ceramic glass material, polished metal edges,
 some deep blue black reflective surfaces,
 each fragment has thickness, soft shadow and highlight,
 transparent background, no phone logo, no text, no watermark,
 arranged with spacing like a sprite sheet
 ```
 
 ---
 
 ## 资产接入步骤
 
 1. 使用上述 Prompt 生成 `phone-render.png`（透明背景、单体手机）
 2. 保存到 `public/wish-assets/phone/generated/phone-render.png`
 3. 可选：生成 `phone-complete.png`（100% 完成态）
 4. 重新打开首页，`FragmentedPhoneScene` 会自动优先加载 PNG
 5. 如果 PNG 加载失败（不存在/损坏），自动回退到内置 SVG
 6. 在 `/lab/assets` 预览页确认资产切换正常
 
 ---
 
 ## 质量验收
 
 - [ ] 手机主体完整，无裁切
 - [ ] 背景透明，无白色块
 - [ ] 无品牌 Logo、文字、水印
 - [ ] 镜头模组清晰
 - [ ] 金属边框可见
 - [ ] 对比度足够，切成碎片后仍可辨识
 - [ ] 完成态手机比基础图更亮/更完整
