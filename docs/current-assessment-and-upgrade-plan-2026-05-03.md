# Knights Motorcycles 网站升级项目：当前进度评估与第二轮全面升级计划

生成时间：2026-05-03 13:36 BST  
项目：Knights Motorcycles / 二手摩托车网站升级  
原网站：https://www.knights-motorcycles.co.uk/  
草稿站：https://knights-motorcycles.onrender.com/  
GitHub：https://github.com/circle2sixty-max/knights-motorcycles.git

---

## 1. 结论摘要

当前版本已经完成了一个可以给客户看的视觉草稿：React + Vite 项目已建立、GitHub 已推送、Render 已部署、核心页面框架已搭好，并且有明显的现代化视觉方向。

但它目前仍然是 **prototype / concept sample**，还不是可以替换原网站的正式版本。核心原因：

1. **原网站信息迁移不完整**：原站至少 16 台车辆，当前新站代码只有 6 台。
2. **业务内容没有完整搬迁**：原站的服务说明、联系方式、营业时间、Google Maps、完整承诺文案只迁移了一部分。
3. **功能仍是静态 UI**：Sell Your Bike、Finance、Contact、Legal 页面存在，但大多没有真实提交、后台记录、邮件通知、支付或金融合作方接入。
4. **视觉风格需要重新校准**：当前 Cyberpunk / neon racing 风格适合展示冲击力，但正式商用更建议转向 premium used motorcycle dealer：高级、可信、清晰、交易导向。
5. **Render 可用性需要检查**：本次检查中 Render 链接曾正常返回 200，也出现过加载页/超时；客户演示前必须确认服务稳定性。

推荐第二轮升级的目标：

> 从“好看的演示草稿”升级为“接近真实商用的二手摩托车经销商网站”：完整库存、完整原站内容、可信详情页、可提交询价/估值/预约表单、Finance/Reserve 的真实流程设计，并保留后续接入支付和 CRM 的接口空间。

---

## 2. 已找到的本地与历史存档

### 2.1 本地项目目录

```text
/Users/yuantao/.openclaw/workspace-circle-claw-feishu/projects/knights-motorcycles
```

关键文件：

```text
projects/knights-motorcycles/package.json
projects/knights-motorcycles/render.yaml
projects/knights-motorcycles/src/App.jsx
projects/knights-motorcycles/src/App.css
projects/knights-motorcycles/src/index.css
projects/knights-motorcycles/public/images/
projects/knights-motorcycles/public/videos/
projects/knights-motorcycles/dist/
```

### 2.2 GitHub / Render

```text
GitHub remote: https://github.com/circle2sixty-max/knights-motorcycles.git
Render service name: knights-motorcycles
Render URL: https://knights-motorcycles.onrender.com/
```

`render.yaml` 当前配置：

```yaml
services:
  - type: web
    name: knights-motorcycles
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npx serve -s dist -l $PORT
    envVars:
      - key: NODE_VERSION
        value: 20
```

### 2.3 方案与历史记录

```text
memory/2026-05-01-knights-motorcycles-proposal.md
```

该文件保存了之前的升级方案方向，包括：

- 原网站诊断
- 英国二手摩托车竞品分析方向
- We Buy Any Motorcycle / Any Car 入口
- Stripe / Klarna / Finance / BNPL 方案
- GDPR / Cookie / Privacy 页面
- Phase 1 / Phase 2 / Phase 3 路线图

飞书报告链接：

```text
https://feishu.cn/docx/E579dFVKhojuZJxQoW0cgGlCnXs
```

### 2.4 会话/归档命中位置

主要命中在以下位置：

```text
/Users/yuantao/.openclaw/agents/circle-claw-feishu/sessions/
/Users/yuantao/.openclaw/workspace-circle-claw-feishu/archives/agents/2026-05-01/
/Users/yuantao/.openclaw/backups/sessions_archive/_SEARCH_INDEX.md
```

重点相关 session/归档文件包括：

```text
/Users/yuantao/.openclaw/agents/circle-claw-feishu/sessions/bed99ea8-76ac-4c08-b473-37b5a8e4c98d.jsonl
/Users/yuantao/.openclaw/agents/circle-claw-feishu/sessions/7d7ade25-c04d-4495-8677-afeb61d582c7.jsonl
/Users/yuantao/.openclaw/agents/circle-claw-feishu/sessions/51191455-b730-4c3c-a0ec-a19676c7a1be.trajectory.jsonl
/Users/yuantao/.openclaw/agents/circle-claw-feishu/sessions/ca9e7fe9-c2b7-4e74-bbb5-7297eadb24b6.trajectory.jsonl
/Users/yuantao/.openclaw/workspace-circle-claw-feishu/archives/agents/2026-05-01/2026-05-01-23/circle-claw-feishu/7d7ade25-c04d-4495-8677-afeb61d582c7.jsonl
```

---

## 3. 原网站内容盘点

原网站：https://www.knights-motorcycles.co.uk/

### 3.1 原站定位

原站核心定位：

- West Yorkshire / Leeds 二手摩托车经销商
- 高质量 used motorcycles
- 覆盖 125cc 到 1000cc
- 30+ 库存规模描述
- HPI check
- 30-day warranty
- PDI / pre-delivery inspection
- UK delivery
- Part exchange
- Instant cash purchase
- Appointment-based viewing

### 3.2 原站联系信息

```text
Phone: 07766599955
Email: sales@knightsmotorcycles.uk
Address: Unit A4, Sunshine Mills, Wortley Road, Armley, Leeds, LS12 3HT, United Kingdom
Customer Support: 24/7, 365 days including holidays
Recommended Viewing Times: Mon-Sat, 9:00 AM - 5:00 PM
Google Maps: https://maps.app.goo.gl/G8BFDjF2UFqKBJ9B7
```

### 3.3 原站车辆清单（抓取到 16 台）

| # | 原站车辆 | 状态 | 价格 |
|---|---|---|---|
| 1 | 2009 HONDA VARADERO 125 LOW MILEAGE | Available | £3650 |
| 2 | 2017 YAMAHA YZF R125 UNDER4K | Available | £3300 |
| 3 | 2022 SUZUKI GSXR 125 LOW MILEAGE | Available | £3300 |
| 4 | 2022 HONDA CB125F LOW MILEAGE | Available | £2200 |
| 5 | 2013 YAMAHA YZF R125 GEN1 9.5K MILES | Available | £2600 |
| 6 | 2010 HONDA XL700 TRANSALP | Available | £3600 |
| 7 | 2022 KTM DUKE 125 7k | Available | £2950 |
| 8 | 2017 HONDA CBR650F LOW MILEAGE | Available | £3600 |
| 9 | 2017 YAMAHA MT125 LOW MILEAGE | Available | £2900 |
| 10 | 2017 YAMAHA YZF R125 ABS | Available | £2900 |
| 11 | 2018 KTM DUKE 125 LOW MILEAGE | Available | £2800 |
| 12 | 2022 YAMAHA XSR 125 ABS 6K | Available | £3500 |
| 13 | 2021 YAMAHA MT125 LOW MILEAGE | Available | £3500 |
| 14 | 2021 YAMAHA YZF R125 LOW MILEAGE | Available | £3500 |
| 15 | 2019 YAMAHA MT125 ABS | SOLD | £2800 |
| 16 | 2020 YAMAHA R3 ABS LOW MILEAGE | SOLD | £3600 |

### 3.4 原站核心内容模块

原站已有内容：

1. Hero / nationwide delivery / call or text now
2. FOR SALE: ALL USED BIKES
3. About Us
4. Our Service Standards
5. HPI Checks
6. Warranty Coverage
7. Test Ride Guarantee
8. Basic Inspection
9. Maintenance Service
10. Customer Services
11. Part Exchange Available
12. UK Delivery
13. Instant Cash Purchase
14. Our Commitment To You
15. Documentation Support
16. Viewing Experience
17. Contact Us
18. Directions / Google Maps

这些内容应被完整迁移，而不是只抽象成几个卡片。

---

## 4. 当前新站状态盘点

### 4.1 技术状态

```text
Framework: React + Vite
Router: react-router-dom HashRouter
Styling: Tailwind CSS + custom CSS
Build: npm run build 通过
Current branch: main
Remote: origin https://github.com/circle2sixty-max/knights-motorcycles.git
```

最近提交：

```text
a5df1cd Fix image cropping: use object-contain to show full motorcycle
5c3f9f1 Add hero background video from Leonardo Motion 2.0
4874bcc Cyberpunk redesign: neon glow, sharp angles, racing helmet logo
dc85dbf Fix button visibility: add bg-white/10 to View All Bikes button
b952685 Major redesign: splash entry page, module layout, mobile image fixes
3573a1c Add render.yaml for Render deployment
3405524 Initial commit: Knights Motorcycles v1
```

### 4.2 当前页面结构

代码中已有路由：

```text
/
/home
/bikes
/bikes/:slug
/sell-your-bike
/finance
/contact
/about
/legal/:type
```

页面覆盖面是不错的，说明项目框架已经搭起来了。

### 4.3 当前车辆数据

当前代码中只有 6 台车：

1. 2022 KTM DUKE 125
2. 2017 HONDA CBR650F
3. 2017 YAMAHA MT125
4. 2017 YAMAHA YZF R125 ABS
5. 2018 KTM DUKE 125
6. 2022 YAMAHA XSR 125 ABS

缺失：原站 16 台中的 10 台，以及 SOLD 状态展示逻辑。

### 4.4 当前静态资源

```text
public/images/bike-1.webp
public/images/bike-2.webp
public/images/bike-3.webp
public/images/bike-4.webp
public/images/bike-5.webp
public/images/bike-6.webp
public/images/delivery.jpg
public/images/finance.jpg
public/images/hero-beach.jpeg
public/images/hero-track.jpeg
public/images/showroom.jpg
public/images/workshop.webp
```

问题：

- 图片数量不足以支持每台车详情页 gallery。
- 多数图片更偏概念展示，不一定是原车真实图片。
- 正式版需要：每台车至少 8-15 张图片，包括左/右侧、仪表盘、里程、轮胎、发动机、瑕疵细节。

### 4.5 当前线上访问状态

本次检查观察到：

- 原站 `https://www.knights-motorcycles.co.uk/` 返回快且稳定，约 0.07s。
- Render 草稿 `https://knights-motorcycles.onrender.com/` 曾返回 200，也出现过 20s timeout / application loading 情况。

判断：

- 很可能是 Render 免费实例冷启动或服务未保持热运行。
- 客户演示前必须做一次 Render dashboard / deploy logs / service health 检查。
- 如果正式给客户长期访问，建议升级 Render plan、迁移到 Vercel/Netlify，或使用静态部署方案。

---

## 5. 原站 vs 当前草稿差距

| 维度 | 原站 | 当前草稿 | 评估 |
|---|---|---|---|
| 库存数量 | 16 台可见 | 6 台 | 严重缺失 |
| SOLD 标记 | 有 SOLD | 无完整 SOLD 列表 | 需补 |
| 联系电话 | 07766599955 | 有 | 基本正确 |
| Email | sales@knightsmotorcycles.uk | 当前 footer 出现 info@knights-mc.co.uk | 需要修正 |
| 地址 | Unit A4, Sunshine Mills... | 有 | 基本正确 |
| Google Maps | 有 | 未完整嵌入 | 需补 |
| About 文案 | 完整长文 | 简化 | 需补完整内容 |
| HPI / Warranty / PDI | 有文字说明 | 有徽章但偏简化 | 需增强到车辆详情页 |
| Part Exchange | 有 | 有概念入口 | 需补流程 |
| UK Delivery | 有 | 有卡片 | 需补说明和 CTA |
| Instant Cash Purchase | 有文字 | 有 Sell Your Bike 表单 | 需做真实提交流程 |
| Finance | 原站无 | 新站有展示页 | 是升级亮点，但仍静态 |
| Legal / Privacy | 原站缺失 | 新站有占位 | 需写正式内容 |
| 风格 | 简单文档型 | Cyberpunk neon | 视觉强但可信感需校准 |
| SEO | 原站内容可抓取 | SPA 需优化 | 正式版需加 metadata/SSR 或预渲染 |

---

## 6. 当前草稿评分

### 6.1 信息架构：7/10

优点：页面结构比原站更完整，有 Buy / Sell / Finance / About / Contact / Legal。

问题：入口层级偏概念化；库存、服务、信任、联系方式之间还没形成真实购买路径。

### 6.2 车辆展示：4/10

优点：列表和详情页已存在，卡片视觉不错。

问题：车辆数量少，参数少，缺 gallery，缺真实车况、MOT、HPI、service history、delivery/reserve CTA。

### 6.3 信任构建：5/10

优点：已有 HPI / warranty / PDI badge。

问题：还停留在首页层面；应进入每台车详情页，形成“这台车已完成哪些检查”的 checklist。

### 6.4 移动端体验：6.5/10

优点：Tailwind 响应式布局已做。

问题：没有实际移动端交互审查；霓虹风格和大图/视频可能影响低端手机加载。

### 6.5 加载速度：6/10

优点：build 包不算大，dist JS gzip 约 82.9kB。

问题：Render 服务不稳定；视频和外链图片需要优化；正式部署前要做 Lighthouse。

### 6.6 CTA 转化路径：5/10

优点：CALL NOW / VIEW BIKES / FINANCE / SELL 已有。

问题：表单没有真实提交；Reserve Now / Book Viewing / WhatsApp/Text / Email quote 缺失。

### 6.7 品牌呈现：6/10

优点：有记忆点，有冲击力。

问题：目前更像游戏/赛车主题，不像可信的英国二手摩托车经销商。需要把“酷”降一点，把“专业可信”提高。

### 6.8 商用完整度：4/10

优点：骨架完整。

问题：库存、内容、表单、合规、SEO、部署稳定性都没到正式上线标准。

---

## 7. 第二轮全面升级建议

### 7.1 Phase 0：保护现有草稿

目标：保留当前可演示版本，不破坏客户已看过的样子。

建议动作：

1. 建立分支：`upgrade-v2`
2. 给当前版本打 tag：`prototype-v1-client-demo`
3. 保存一份当前页面截图
4. 不直接在 main 上大改，避免 Render 自动部署影响已有链接

### 7.2 Phase 1：完整迁移原站内容

优先级：最高

需要完成：

1. 建立结构化车辆数据文件，例如：

```text
src/data/bikes.js
```

2. 把原站 16 台车全部录入：

- title
- make
- model
- year
- mileage
- price
- status
- type
- colour
- engine
- description
- original URL
- image list

3. 补齐 SOLD 状态展示：

- Available / Reserved / Sold
- SOLD 车辆可以展示但弱化 CTA

4. 完整迁移原站文本：

- About Us
- Service Standards
- HPI Checks
- Warranty Coverage
- Test Ride Guarantee
- Basic Inspection
- Maintenance Service
- Customer Services
- Part Exchange
- UK Delivery
- Instant Cash Purchase
- Commitment
- Documentation Support
- Viewing Experience
- Contact / Hours / Maps

### 7.3 Phase 2：重做正式商用视觉

优先级：高

建议方向：

- 保留黑色/深色高级感
- 减少过强霓虹和 cyberpunk 元素
- 增加真实经销商质感：白色空间、灰黑金属、清晰 CTA、信任徽章
- 首页首屏从“RIDE WITHOUT COMPROMISE”调整为更交易导向：

```text
Quality Used Motorcycles in Leeds
HPI checked · 30-day warranty · UK delivery · Part exchange available
```

### 7.4 Phase 3：车辆详情页增强

优先级：高

每台车详情页应包含：

1. 图片 gallery
2. 价格 + Reserve / Enquire / Book Viewing
3. 基础参数：Year / Mileage / Engine / Colour / Type / Status
4. Trust checklist：
   - HPI checked
   - 30-day warranty
   - PDI inspected
   - Oil changed
   - Brake fluid checked
   - Coolant checked
   - UK delivery available
5. Finance example
6. Part exchange prompt
7. Contact CTA sticky bar on mobile

### 7.5 Phase 4：真实表单与询盘流程

优先级：高

建议先做轻量方案，不急着接完整后台：

1. Contact form
2. Book viewing form
3. Sell your bike valuation form
4. Finance enquiry form
5. Reserve interest form

提交方式建议：

- 第一阶段：Formspree / Netlify Forms / Render backend endpoint / Email webhook
- 第二阶段：Supabase / Airtable / CRM / Feishu webhook

字段需要保存：

- name
- phone
- email
- preferred contact method
- target bike
- appointment time
- valuation details
- consent checkbox

### 7.6 Phase 5：Finance / Reserve / Payment

优先级：中高，但需谨慎

建议顺序：

1. 先做 Finance enquiry，不直接做真实 finance application。
2. 先做 Reserve interest，不直接收钱。
3. 如果客户确认商业模式，再接 Stripe deposit。

Reserve 设计建议：

- Reserve this bike for £199 / £300 / £500
- Reservation valid for 48 hours
- Refund policy clearly displayed
- Stripe Checkout
- Manual confirmation after payment

Finance 设计建议：

- 页面上展示 representative example
- 车辆详情页显示 “From £XX/month”
- 合作方：MotoNovo / Close Brothers / First Response 需客户确认
- 必须处理 FCA 合规文案

### 7.7 Phase 6：SEO / 合规 / 正式部署

优先级：中高

需要完成：

1. 页面 title / meta description
2. Open Graph image
3. Sitemap
4. Robots.txt
5. Schema.org Vehicle / LocalBusiness
6. Privacy Policy
7. Cookie Policy
8. Terms & Conditions
9. Cookie consent banner
10. Google Analytics / Search Console
11. 正式域名绑定策略

---

## 8. 需要从客户确认/补充的信息

在全面升级前，建议向客户确认：

1. 是否允许完全替代原站，还是先作为独立 demo？
2. 车辆库存是否仍以原站 16 台为准？是否有最新库存？
3. 每台车是否有更多真实图片？
4. 是否已有 eBay 详情页链接？
5. 是否真的要做在线定金/支付？定金金额是多少？
6. 是否已有 finance partner？
7. 是否允许接入第三方表单/CRM？
8. 是否希望保留当前 neon/cyberpunk 风格，还是改为更稳重商业风？
9. 正式部署用 Render、Vercel、Netlify 还是客户自有主机？
10. 是否要绑定原域名 knights-motorcycles.co.uk？

---

## 9. 第二轮实施优先级

| 阶段 | 工作 | 优先级 | 预计工作量 | 目的 |
|---|---|---:|---:|---|
| Phase 0 | 保护当前版本，建分支/tag | P0 | 0.5h | 避免破坏客户已看版本 |
| Phase 1 | 原站 16 台车与文案完整迁移 | P0 | 3-5h | 解决“内容没搬完整” |
| Phase 2 | 视觉风格商用化调整 | P1 | 3-6h | 提高客户信任与成交感 |
| Phase 3 | 车辆详情页增强 | P1 | 3-5h | 提升询盘转化 |
| Phase 4 | 表单与询盘流程 | P1 | 2-4h | 让网站能收线索 |
| Phase 5 | Finance / Reserve 原型 | P2 | 3-6h | 支持高级销售功能 |
| Phase 6 | SEO / Legal / Analytics | P2 | 2-4h | 为正式上线准备 |
| Phase 7 | 部署稳定性与域名 | P2 | 1-3h | 解决 Render 冷启动和正式访问 |

---

## 10. 推荐的下一步执行方案

### 推荐方案 A：先做“内容完整 + 商用视觉”版本

这是最稳的方案。

本轮只做：

1. 建 `upgrade-v2` 分支
2. 结构化车辆数据
3. 迁移原站 16 台车
4. 补齐原站所有文案
5. 修正联系方式和 email
6. 增加 Google Maps / hours
7. 详情页增强 trust checklist
8. 调整视觉到更可信的 premium dealer 风格
9. 本地构建测试
10. 预览后再决定是否部署

不做：

- 不接 Stripe
- 不接 Finance API
- 不接真实 CRM
- 不直接改原域名

### 方案 B：直接做全功能版本

包含表单、Reserve、Finance、Legal、SEO、部署。

优点：一步到位。  
缺点：范围大，需要客户确认信息较多，容易返工。

### 方案 C：只修视觉和缺失内容

优点：最快。  
缺点：功能仍然像样板，不能体现完整升级方案价值。

### 我的建议

选 **方案 A**。先把草稿升级到“客户一看就觉得这是认真做的正式新版网站”的程度，再逐步加支付、Finance、CRM。

---

## 11. 全面升级前的验收标准

第二轮升级完成后，至少应满足：

1. 原站 16 台车辆全部可见。
2. SOLD 车辆有明确标识。
3. 联系方式与原站一致。
4. 原站 About / Services / Commitment / Contact 内容完整迁移。
5. 每台车有详情页。
6. 每台车详情页有 HPI / Warranty / PDI 信任模块。
7. 移动端能清晰看到 Call / Enquire / Book Viewing。
8. Contact / Sell / Finance 表单至少有可提交方案或明确下一步。
9. Legal 页面不再是占位文案。
10. `npm run build` 通过。
11. 本地预览通过。
12. 部署前确认 Render 不再频繁 timeout。

---

## 12. 给客户的一句话总结

The current demo proves the visual direction, but the next upgrade should turn it into a complete, trustworthy, lead-generating motorcycle dealer website with full stock migration, stronger vehicle detail pages, and clear enquiry/valuation flows.
