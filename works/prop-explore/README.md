# Prop Explore · CS2 道具学习图鉴

## 部署说明

这是一个**纯静态网站**，无需构建、无需后端、无需数据库，整个文件夹原样部署即可。

- 入口页面：`index.html`（登录页）
- 本地预览：解压后双击 `index.html`，或运行 `npx serve .` / `python -m http.server`
- 部署：将本文件夹内全部内容上传到任意静态托管（Vercel / Netlify / GitHub Pages / 云服务器 Nginx 均可），入口指向 `index.html`

## 文件结构

```
index.html      登录页（入口）
home.html       主页（道具图鉴）
css/            样式（暗/亮双主题 CSS 变量）
js/app.js       交互逻辑（筛选 / 翻页 / 主题切换 / 移动端手势）
assets/         图片素材
  hero-login.jpg   登录页主视觉
  map-*.png        地图选择卡片
  props/           道具点位图（ct / t × 烟雾弹 / 闪光弹 / 燃烧瓶）
```

## 功能要点

- 桌面端 1920×1080 舞台等比缩放，支持暗 / 亮双主题（localStorage 记忆）
- 移动端 ≤900px 断点重排：筛选面板右侧抽屉、雷达图可折叠、图1/图2 并行、触摸滑动翻页
- 未上新道具置灰，点击提示「该道具暂未上新，敬请期待」
- 点位搜索实时过滤区域标签
