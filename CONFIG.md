# CLI 配置说明

## 配置文件

配置文件位于 `src/config.js`，用于控制 CLI 工具的行为。

### 配置项说明

#### `askInstallAndStart`
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 初始化项目时是否询问用户是否安装依赖并自动启动开发服务器
  - `true`: 会询问用户
  - `false`: 不询问，直接显示下一步操作提示

#### `skipAskInDevMode`
- **类型**: `boolean`
- **默认值**: `true`
- **说明**: 在开发模式下是否跳过询问，直接安装依赖并启动
  - `true`: 开发模式下自动安装并启动，不询问
  - `false`: 即使开发模式也会询问

### 开发模式检测

开发模式通过以下方式检测：
- 环境变量 `EXT_CLI_DEV === 'true'`
- 环境变量 `NODE_ENV === 'development'`

### 使用示例

#### 开发模式（自动安装并启动）

```bash
# 方式1: 设置环境变量
EXT_CLI_DEV=true extension-cli init my-extension

# 方式2: 设置 NODE_ENV
NODE_ENV=development extension-cli init my-extension
```

#### 普通模式（询问用户）

```bash
extension-cli init my-extension
```

## 打包进度显示

打包时会显示：
- 旋转动画指示器（⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏）
- 构建进度百分比
- 构建时间
- 输出文件列表及大小
- 总文件大小

### 示例输出

```
🚀 Building extension in production mode...

⠋ Building... 45% compiling modules
⠙ Building... 78% building
⠹ Building... 100%

✓ Build completed successfully! (2.34s)

📦 Output files:
   popup/popup.js (45.23 KB)
   content/content.js (12.45 KB)
   background/background.js (8.90 KB)
   Total: 66.58 KB

📁 Output directory: /path/to/dist
```

