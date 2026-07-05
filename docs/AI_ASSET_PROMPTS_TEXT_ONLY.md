# Codex 同步说明：无识图模型的文字 Prompt 资产生产方案

> 建议路径：`docs/codex-notes/2026-07-04-text-only-ai-asset-prompts.md`  
> 适用仓库：`xiyan13411-ai/check-think`  
> 当前状态：V9 已规划 AI 视觉资产接入，但用户接入的生图模型暂不支持识图  
> 本次目标：把参考图风格转成纯文字 Prompt，让不支持识图的模型也能生成可用手机素材。

---

## 1. 背景

用户接入的生图模型暂时不支持识图，因此不能直接上传小红书参考图让模型照着生成。

这不阻塞项目。

解决方式：

> 把参考图拆成文字视觉规格，再用纯文字 Prompt 生成资产。

参考图风格可以用文字描述为：

- 高级白银色智能手机
- 单台手机背面
- 3/4 斜角悬浮
- 三镜头模组
- 白色/银色陶瓷或玻璃背板
- 抛光金属边框
- 柔和棚拍光
- 浅灰或透明背景
- 轻微阴影
- 无品牌 logo
- 无文字
- 无水印
- 适合做 App 主视觉资产

---

## 2. 重要原则

### 2.1 不要让模型生成“iPhone”

不要在 Prompt 中使用：

```txt
iPhone
Apple
苹果
Dynamic Island
official product
```

原因：

- 可能生成品牌 logo
- 可能有版权/商标风险
- 可能生成过于接近官方素材的图

推荐说法：

```txt
premium futuristic smartphone
abstract high-end smartphone
white and silver smartphone
no logo
no brand marks
```

---

### 2.2 不要一开始生成碎片套装

暂时不要要求模型一次生成 20 个碎片。  
大多数模型会把碎片生成得不一致，后续很难接入。

第一步只生成：

```txt
phone-render.png
```

也就是一张高质量单机主图。

后续用当前项目的 `clip-path` 切片逻辑把它切成碎片。

---

### 2.3 如果模型不支持透明背景

可以先要求：

```txt
plain light gray background
isolated object
clean background
```

生成后再做抠图。

更推荐背景：

```txt
solid very light gray background, #f2f2f2
```

不要用复杂场景背景，否则很难抠。

---

## 3. 资产目标

### 3.1 第一步只生成 phone-render

目标路径：

```txt
public/wish-assets/phone/generated/phone-render.png
```

尺寸建议：

```txt
1000 × 1600
或 1024 × 1536
或 768 × 1152
```

比例：

```txt
2:3
或 5:8
```

主体：

```txt
单台竖向智能手机背面
```

用途：

- 作为 `FragmentedPhoneScene` 的切片底图
- 被 `clip-path` 分成不规则碎片
- 进度驱动碎片飞回重组

---

## 4. Prompt A：主手机资产，推荐第一版

### English Prompt

```text
A premium futuristic smartphone back render, single phone object only, white and silver ceramic glass body, polished metal edges, three large camera lenses in a rounded square camera island, subtle deep blue black reflective inner surface accents, high-end product render, soft studio lighting, floating in air, three-quarter perspective, clean minimal design, isolated object, transparent background if possible, no logo, no brand marks, no text, no watermark, no hands, no case, no background objects, 1000x1600
```

### 中文解释

```text
一台高级未来感智能手机背面渲染图，只有单台手机，白银色陶瓷玻璃机身，抛光金属边框，圆角方形镜头模组里有三个大镜头，带少量深蓝黑色反光区域，高端产品渲染风，柔和棚拍光，悬浮，3/4 透视，干净极简，尽量透明背景，无 logo，无品牌标识，无文字，无水印，无手、无手机壳、无背景物体。
```

---

## 5. Prompt B：如果模型总生成正面屏幕，用这个

```text
Back view only of a premium futuristic smartphone, show the rear camera system clearly, do not show the front screen, single phone object, white silver ceramic glass back, polished metal frame, rounded square camera island with three lenses, product render, three-quarter rear perspective, floating isolated object, soft studio lighting, transparent background if possible, no logo, no text, no brand marks, no watermark
```

重点：

```txt
Back view only
do not show the front screen
rear camera system clearly
```

---

## 6. Prompt C：如果模型画得太平，用这个强化材质

```text
A high-end smartphone rear body product render with realistic material details, white ceramic glass back panel, silver polished aluminum frame, beveled edges, visible thickness, soft reflections, glossy camera lenses, subtle shadows, premium industrial design, floating in air, three-quarter rear view, isolated on plain light gray background, no logo, no text, no watermark
```

重点：

```txt
realistic material details
beveled edges
visible thickness
soft reflections
glossy camera lenses
```

---

## 7. Prompt D：破碎重组参考图，不直接进代码

用于生成一张参考图，不一定作为资产：

```text
A premium white and silver futuristic smartphone partially broken into floating physical shards, the phone is being reassembled in mid air, irregular ceramic glass fragments floating around the main body, fragments have thickness, metallic edges, shadows and highlights, some fragments reveal deep blue black reflective surfaces, soft studio lighting, clean product poster style, high-end mobile app hero visual, no logo, no text, no watermark
```

用途：

- 给自己看方向
- 作为后续手工切片参考
- 不建议直接作为 `phone-render.png`

---

## 8. Negative Prompt

如果模型支持 negative prompt，请使用：

```text
logo, apple logo, brand mark, text, watermark, hands, person, case, charger, messy background, multiple phones, front screen, app icons, cracked screen, broken glass dust, low quality, blurry, cartoon, anime, toy, plastic, overexposed, dark background
```

中文：

```text
不要 logo、不要苹果标志、不要品牌标识、不要文字、不要水印、不要手、不要人物、不要手机壳、不要充电器、不要复杂背景、不要多台手机、不要正面屏幕、不要 App 图标、不要低质量、不要模糊、不要卡通、不要玩具感、不要塑料感。
```

---

## 9. 生成参数建议

如果模型支持参数：

```txt
Aspect ratio: 2:3 或 5:8
Size: 1024x1536 或 1000x1600
Style: product render / studio lighting / realistic
Background: transparent / plain light gray
Quality: high
CFG: 中等，不要太高
Steps: 中高
```

如果只能输入一句话，使用 Prompt A。

---

## 10. 筛选标准

生成 4-8 张后，优先选符合这些条件的：

- [ ] 单台手机
- [ ] 背面为主
- [ ] 没有 logo
- [ ] 没有文字
- [ ] 没有水印
- [ ] 机身完整
- [ ] 镜头模组清晰
- [ ] 金属边和阴影明显
- [ ] 背景干净或透明
- [ ] 适合被切成碎片
- [ ] 视觉上比当前 SVG 更像产品渲染

不要选：

- 两台手机
- 正面大屏幕
- 有品牌 logo
- 有水印
- 背景复杂
- 手机被遮挡
- 机身太扁平
- 卡通风
- 模糊图

---

## 11. 放入项目的步骤

生成图片后：

1. 命名为：

```txt
phone-render.png
```

2. 放入：

```txt
public/wish-assets/phone/generated/phone-render.png
```

3. 确认 Codex 已完成 V9 PNG fallback 逻辑。

4. 打开：

```txt
/lab/assets
```

5. 切换到 fragmented 模式。

6. 用 progress slider 测试：

```txt
0%
25%
50%
75%
100%
```

7. 检查碎片是否像手机的一部分。

---

## 12. 如果图片没有透明背景

可以先放进去测试，但建议后续抠图。

临时接受条件：

- 背景接近白色 / 浅灰
- 与页面背景不冲突
- 手机边缘清晰

不接受：

- 复杂场景
- 有文字背景
- 有水印
- 有明显阴影切不干净

---

## 13. Codex 后续任务

如果生成了 `phone-render.png`，请让 Codex 做：

1. 检查图片是否存在。
2. 优先用 PNG。
3. SVG fallback 保留。
4. 调整 `fragmented-phone-map.ts` 的 clip-path，使碎片切到关键区域：
   - 镜头模组
   - 左上机身
   - 右边框
   - 中部背板
   - 底部边框
   - 深色反光区域

---

## 14. 可直接发给生图模型的一句话版本

```text
A premium futuristic smartphone back render, single phone object only, white and silver ceramic glass body, polished metal edges, three large camera lenses in a rounded square camera island, subtle deep blue black reflective accents, realistic high-end product render, soft studio lighting, floating in air, three-quarter rear perspective, isolated object, transparent or plain light gray background, no logo, no brand marks, no text, no watermark, no hands, no case, no background objects
```

---

## 15. 可直接发送给 Codex 的 Prompt

```text
请进入「无识图模型素材生产支持」阶段。

背景：
用户接入的生图模型暂不支持识图，不能上传参考图让模型照着生成。因此需要在文档中提供纯文字 Prompt，让不支持识图的模型也能生成 phone-render.png 资产。

请完成：

1. 新增 docs/AI_ASSET_PROMPTS_TEXT_ONLY.md
   - 写明参考图的文字视觉规格
   - 写明 Prompt A/B/C/D
   - 写明 negative prompt
   - 写明生成参数建议
   - 写明筛选标准
   - 写明如何命名和放入 public/wish-assets/phone/generated/phone-render.png

2. 更新 docs/AI_ASSET_PROMPTS.md
   - 增加“模型不支持识图时使用 TEXT_ONLY 文档”的说明

3. 更新 README
   - 在 V9 AI 资产接入部分补充：不支持识图也可以使用文字 Prompt 生成素材

要求：
- 不要改主功能
- 不要改 Hero 视觉
- 不要引入后端
- 不要做登录
- 不要做云同步
- 不要打包 APK
- 完成后运行 npm run build 并汇报结果
```
