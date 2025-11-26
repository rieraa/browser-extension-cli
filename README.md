# Browser Extension CLI

一个用于创建浏览器插件的 CLI 工具，支持使用 React 语法编写。

## 安装

```bash
npm install -g
```

或者使用 npx（无需全局安装）：

```bash
npx extension-cli init my-extension
```

## 使用方法

### 初始化项目

```bash
extension-cli init [project-name]
```

或者使用简写：

```bash
ext-cli init [project-name]
```

如果不提供项目名称，CLI 会提示你输入。

### 开发模式

进入项目目录后：

```bash
cd my-extension
npm install
npm run dev
```

开发模式会：
- 监听文件变化
- 自动重新构建
- 输出到 `dist` 目录

在浏览器中：
1. 打开 `chrome://extensions/` 或 `edge://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目的 `dist` 目录

修改代码后，扩展会自动重新构建，你只需要在浏览器中点击扩展的刷新按钮即可看到更新。

### 构建

#### 生产环境构建

```bash
npm run build
```

#### 开发环境构建

```bash
npm run build:dev
```

构建完成后，`dist` 目录包含可以加载到浏览器的扩展文件。

## 项目结构

生成的项目结构：

```
my-extension/
├── public/
│   ├── manifest.json      # 扩展清单文件
│   └── icons/             # 图标文件
├── src/
│   ├── popup/             # 弹出窗口（React 组件）
│   │   ├── index.html
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   └── styles.css
│   ├── content/           # 内容脚本
│   │   └── index.ts
│   └── background/        # 后台服务
│       └── index.ts
├── dist/                  # 构建输出目录
├── package.json
├── tsconfig.json
└── README.md
```

## 功能特性

- ✅ 使用 React + TypeScript 开发
- ✅ 热重载开发模式
- ✅ 自动文件监听和重新构建
- ✅ 支持 Manifest V3
- ✅ 完整的项目模板
- ✅ 生产环境和开发环境构建

## 开发

### 本地开发 CLI

```bash
cd browser-extension-cli
npm install
npm link
```

然后就可以在任何地方使用 `extension-cli` 命令了。

## 许可证

MIT

