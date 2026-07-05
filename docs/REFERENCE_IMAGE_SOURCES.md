 # 手机背面视觉参考图来源
 
 收集用于指导 AI 生成 `phone-render.png` 的高品质参考图来源。
 
 > **版权说明**：以下链接仅供风格参考，不要直接将带水印/版权图片放入项目。
 
 ---
 
 ## 推荐参考来源
 
 ### 1. Behance — 产品渲染作品集
 
 Behance 上有大量 3D 产品渲染师发布的智能手机渲染作品，搜索关键词：
 
 - `smartphone product render`
 - `phone back render`
 - `product visualization smartphone`
 - `white smartphone back`
 
 链接：https://www.behance.net/search/projects?search=smartphone+back+render
 
 ### 2. Dribbble — UI/UX 设计师作品
 
 Dribbble 上有许多 App 展示和手机 Mockup，适合参考视角和构图：
 
 - `phone mockup back`
 - `app showcase phone render`
 - `smartphone back view`
 
 链接：https://dribbble.com/search/smartphone-back-render
 
 ### 3. Freepik — 手机 Mockup 素材
 
 Freepik 有大量可商用的手机 PSD/SVG Mockup，适合参考光影和结构：
 
 链接：https://www.freepik.com/search?format=search&query=smartphone+back+mockup
 
 ### 4. Pinterest — 视觉灵感板
 
 Pinterest 的图片聚合适合寻找风格灵感：
 
 搜索：`smartphone back render` / `phone product photography`
 
 链接：https://www.pinterest.com/search/pins/?q=smartphone+back+render
 
 ### 5. 品牌官网产品页（参考材质）
 
 各大手机品牌官网的产品展示页有高质量的产品图，可作为材质参考：
 
 - Samsung Galaxy 系列：https://www.samsung.com/global/galaxy/
 - 一加/OPPO/Vivo 等品牌的白色/银色机型
 - Sony Xperia 系列的方正设计
 
 > 这些品牌官网的图片受版权保护，**仅供观察材质和光影**，不要直接下载使用。
 
 ---
 
 ## 用于 AI 生成的最佳参考策略
 
 由于大多数图片网站难以直接批量获取，推荐的工作流：
 
 1. **在 Behance / Dribbble / Pinterest 上直接用关键词搜索**
    - 选择「产品渲染」「3D 可视化」类的结果
    - 收藏 3-5 张符合白银/白色风格、镜头清晰的图
    - 观察其光影、角度、材质表现
 
 2. **用文字 Prompt 描述参考图风格**
    - 使用 `docs/AI_ASSET_PROMPTS.md` 中的标准 Prompt
    - 如果模型不支持识图，使用 `docs/AI_ASSET_PROMPTS_TEXT_ONLY.md`
    - 已为无识图模型优化了详细的文字描述
 
 3. **生成后筛选**
    - 按照 `docs/AI_ASSET_PROMPTS.md` 中的筛选标准
    - 重点检查：透明背景、单体手机、镜头清晰、无 logo、无文字
 
 4. **放入项目**
    - `public/wish-assets/phone/generated/phone-render.png`
    - 自动生效，无需改代码
 
 ---
 
 ## Unsplash（免费可商用图片）
 
 Unsplash 上有一些手机产品摄影图，虽然不是专业渲染但胜在免费：
 
 搜索：`smartphone back` / `phone back white`
 
 链接：https://unsplash.com/s/photos/smartphone-back-white
 
 ---
 
 *文档版本：2026-07-05*
 *关联：docs/AI_ASSET_PROMPTS.md, docs/AI_ASSET_PROMPTS_TEXT_ONLY.md*
