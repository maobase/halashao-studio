# 哈拉少设计工作室 · TanStack Start

基于 **TanStack Start**（React + 文件路由 + SSR）的工作室站点，关注 SEO 与内容完整度。

## 本地开发（不发布）

```bash
cd web
npm install
npm run dev
```

浏览器打开：http://localhost:3000

## 技术栈

- TanStack Start / Router（SSR）
- React 19
- Vite 8 + Nitro
- Tailwind CSS 4
- 静态媒体：`public/media` → 仓库根目录 `assets/`

## 路由

| 路径 | 说明 |
|------|------|
| `/` | 首页（满内容：片源英雄区、土酷双面、业务光谱、硬仗、语录、系统模块、客户画像） |
| `/work` | 作品 |
| `/film` | 片源放映厅 |
| `/quotes` | 范德彪语录 |
| `/team` | 班底 |
| `/services` | 服务 |
| `/process` | 流程 |
| `/about` | 关于 |
| `/stories` | 滚动叙事 |
| `/lab` | 实验室入口 |
| `/system` | 系统地图 |
| `/contact` | 开干 |

每页通过 `head()` 输出 title / description / Open Graph；根布局含 Organization JSON-LD。
