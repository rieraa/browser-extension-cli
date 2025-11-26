# 浏览器插件项目

这是一个使用 React 开发的浏览器插件项目。

## 开发

```bash
npm install
npm run dev
```

开发服务器启动后：
1. 打开 Chrome/Edge 浏览器，访问 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目中的 `dist` 目录

## 构建

### 生产环境构建
```bash
npm run build
```

### 开发环境构建
```bash
npm run build:dev
```

## 项目结构

```
.
├── public/          # 静态资源（manifest.json, icons 等）
├── src/
│   ├── popup/      # 弹出窗口（React 组件）
│   ├── content/    # 内容脚本
│   └── background/ # 后台服务
└── dist/           # 构建输出目录
```

## 功能说明

- **popup**: 点击扩展图标时显示的弹出窗口
- **content**: 注入到网页中的脚本
- **background**: 后台服务，处理扩展的核心逻辑

