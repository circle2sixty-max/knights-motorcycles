# Knights Motorcycles Website Upgrade

主项目路径（以后默认在这里执行）：

```text
/Users/yuantao/Documents/codex/Knightsmotorcycles
```

## 当前版本

- 分支：`upgrade-v2`
- 当前本地提交：`6177211 Move project workspace and rotate hero background videos`
- 原型版保护 tag：`prototype-v1-client-demo`
- 线上 V1 / V2 部署 tag 后续在部署时创建

## 项目结构

```text
src/                         React 源码
src/data/siteContent.js       车辆、公司信息、服务文案、故事化文案
public/images/original-stock/ 原站车辆图片归档与网站使用图片
public/videos/                首页视频背景素材
data/original-site/           原站抓取文本和结构化数据
docs/                         评估文档与项目说明
scripts/                      原站抓取脚本
```

## 首页视频背景

当前首页背景轮播使用：

```text
public/videos/hero-track-gold-01.mp4
public/videos/hero-track-gold-02.mp4
```

这两个文件来自陶源放在项目根目录的两个摩托车视频。根目录原始视频保留不删，`public/videos/` 内是网站实际引用副本。

## 常用命令

```bash
npm install
npm run lint
npm run build
npm run preview -- --host 0.0.0.0 --port 4174
```

本地预览：

```text
http://localhost:4174/
http://192.168.3.56:4174/
```

## 当前注意事项

- 当前只在本地升级，尚未 push GitHub / 部署 Render。
- 表单目前采用 `mailto:` 询盘方案，还未接后端、CRM、Stripe 或 Finance API。
- 根目录的 `motion_*.mp4` 和 `20260503-154838.png` 是用户手动放入的原始素材，暂时保留不移动、不删除。
