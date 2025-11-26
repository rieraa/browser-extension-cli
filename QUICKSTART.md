# 快速开始指南

## 1. 安装 CLI 工具

### 方式一：全局安装

```bash
cd browser-extension-cli
npm install
npm link
```

### 方式二：使用 npx（推荐，无需安装）

```bash
npx extension-cli init my-extension
```

## 2. 创建新项目

```bash
extension-cli init my-extension
```

或者使用简写：

```bash
ext-cli init my-extension
```

## 3. 安装依赖

```bash
cd my-extension
npm install
```

## 4. 开发模式

```bash
npm run dev
```

这个命令会：
- 启动文件监听
- 自动构建到 `dist` 目录
- 文件变化时自动重新构建

## 5. 在浏览器中加载扩展

1. 打开 Chrome/Edge 浏览器
2. 访问 `chrome://extensions/` 或 `edge://extensions/`
3. 启用右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 6. 开发流程

1. 修改 `src/` 目录下的代码
2. 保存文件后，webpack 会自动重新构建
3. 在浏览器扩展管理页面，点击扩展卡片的刷新按钮
4. 查看更新后的效果

## 7. 构建生产版本

```bash
npm run build
```

构建完成后，`dist` 目录包含可以打包发布的扩展文件。

## 项目结构说明

```
my-extension/
├── public/
│   ├── manifest.json      # 扩展配置（权限、图标等）
│   └── icons/             # 图标文件（需要自己添加）
├── src/
│   ├── popup/             # 弹出窗口
│   │   ├── index.html     # HTML 模板
│   │   ├── index.tsx      # 入口文件
│   │   ├── App.tsx        # React 主组件
│   │   └── styles.css     # 样式文件
│   ├── content/           # 内容脚本（注入到网页中）
│   │   └── index.ts
│   └── background/        # 后台服务
│       └── index.ts
└── dist/                  # 构建输出（不要手动编辑）
```

## 常见问题

### Q: 图标文件在哪里？

A: 需要在 `public/icons/` 目录下放置以下文件：
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

如果没有图标，扩展仍然可以运行，但会显示默认图标。

### Q: 如何修改扩展名称和描述？

A: 编辑 `public/manifest.json` 文件中的 `name` 和 `description` 字段。

### Q: 如何添加更多权限？

A: 在 `public/manifest.json` 的 `permissions` 数组中添加所需权限，例如：
```json
"permissions": [
  "activeTab",
  "storage",
  "tabs",
  "bookmarks"
]
```

### Q: 开发时如何调试？

A: 
- **Popup**: 右键点击扩展图标 → "检查弹出内容"
- **Content Script**: 在网页中按 F12，在 Console 中查看
- **Background**: 在扩展管理页面，点击"service worker"链接

## 下一步

- 修改 `src/popup/App.tsx` 来自定义弹出窗口
- 在 `src/content/index.ts` 中添加网页交互功能
- 在 `src/background/index.ts` 中添加后台逻辑
- 查看 [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/) 了解更多功能

