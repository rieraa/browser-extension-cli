const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { getWebpackConfig } = require('../webpack.config');

// Dev 模式专用动画字符 - 更活泼的风格
const devSpinnerFrames = ['⚡', '✨', '🔥', '💫', '🚀', '⭐', '🌟', '⚡'];
const statusFrames = ['◐', '◓', '◑', '◒'];
let spinnerIndex = 0;
let statusIndex = 0;
let progressInterval = null;
let statusInterval = null;

function showProgress() {
  if (progressInterval) return;
  
  progressInterval = setInterval(() => {
    const frame = devSpinnerFrames[spinnerIndex % devSpinnerFrames.length];
    process.stdout.write(`\r${chalk.cyan(frame)} ${chalk.gray('Compiling...')}`);
    spinnerIndex++;
  }, 150);
}

function showWatchingStatus() {
  if (statusInterval) return;
  
  statusInterval = setInterval(() => {
    const frame = statusFrames[statusIndex % statusFrames.length];
    process.stdout.write(`\r${chalk.green(frame)} ${chalk.gray('Watching for changes...')}`);
    statusIndex++;
  }, 500);
}

function hideProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
  process.stdout.write('\r' + ' '.repeat(50) + '\r'); // 清除进度行
}

function dev() {
  const projectRoot = process.cwd();

  // 显示启动横幅
  console.log(chalk.cyan('\n╔════════════════════════════════════════╗'));
  console.log(chalk.cyan('║  ') + chalk.bold.white('🚀 Development Mode') + chalk.cyan('                    ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════╝\n'));

  const config = getWebpackConfig({
    mode: 'development',
    projectRoot,
  });

  // 使用 ProgressPlugin 来显示进度
  const { ProgressPlugin } = require('webpack');
  let lastPercent = 0;
  let currentBuildStartTime = Date.now();
  let changedFiles = [];
  
  const progressPlugin = new ProgressPlugin({
    activeModules: false,
    entries: true,
    modules: true,
    modulesCount: 100,
    profile: false,
    dependencies: true,
    dependenciesCount: 100,
    percentBy: 'modules',
    handler: (percentage, message, ...args) => {
      const currentPercent = Math.floor(percentage * 100);
      if (currentPercent !== lastPercent && currentPercent % 10 === 0) {
        lastPercent = currentPercent;
        hideProgress();
        const frame = devSpinnerFrames[spinnerIndex % devSpinnerFrames.length];
        process.stdout.write(`\r${chalk.cyan(frame)} ${chalk.yellow(currentPercent + '%')} ${chalk.gray('compiling...')}`);
        spinnerIndex++;
      }
      // 当达到 100% 时，立即清除进度行
      if (currentPercent >= 100) {
        hideProgress();
      }
    }
  });
  
  // 将 ProgressPlugin 添加到配置中
  if (!config.plugins) {
    config.plugins = [];
  }
  config.plugins.push(progressPlugin);

  const compiler = webpack(config);

  let isFirstBuild = true;
  let buildCount = 0;

  // 监听编译开始
  if (compiler.hooks && compiler.hooks.compile) {
    compiler.hooks.compile.tap('DevProgress', () => {
      currentBuildStartTime = Date.now();
      lastPercent = 0;
      hideProgress();
      if (!isFirstBuild) {
        console.log(chalk.cyan('\n┌────────────────────────────────────────┐'));
        console.log(chalk.cyan('│  ') + chalk.yellow('🔄 File changed, rebuilding...') + chalk.cyan('     │'));
        console.log(chalk.cyan('└────────────────────────────────────────┘\n'));
      }
      showProgress();
    });
  }

  compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  }, (err, stats) => {
    // 确保清除所有进度显示
    hideProgress();
    // 额外清除一次，确保进度行被完全清除
    process.stdout.write('\r' + ' '.repeat(60) + '\r');

    if (err) {
      console.error(chalk.red('\n❌ Build error:'), err);
      return;
    }

    if (stats.hasErrors()) {
      console.error(chalk.red('\n┌────────────────────────────────────────┐'));
      console.error(chalk.red('│  ') + chalk.bold('❌ Build failed with errors') + chalk.red('          │'));
      console.error(chalk.red('└────────────────────────────────────────┘\n'));
      console.error(stats.toString({ colors: true, chunks: false, modules: false }));
      return;
    }

    if (stats.hasWarnings()) {
      console.warn(chalk.yellow('\n⚠️  Build warnings:'));
      console.warn(stats.toString({ colors: true, chunks: false, modules: false }));
    }

    const buildTime = ((Date.now() - currentBuildStartTime) / 1000).toFixed(2);
    buildCount++;

    if (isFirstBuild) {
      // 首次构建完成 - 显示详细信息
      console.log(chalk.green('\n┌────────────────────────────────────────┐'));
      console.log(chalk.green('│  ') + chalk.bold.white('✅ Initial build completed!') + chalk.gray(` (${buildTime}s)`) + chalk.green('  │'));
      console.log(chalk.green('└────────────────────────────────────────┘\n'));
      
      console.log(chalk.cyan('📦 Extension ready to load:\n'));
      console.log(chalk.white('   1. ') + chalk.gray('Open ') + chalk.yellow('chrome://extensions/') + chalk.gray(' or ') + chalk.yellow('edge://extensions/'));
      console.log(chalk.white('   2. ') + chalk.gray('Enable ') + chalk.yellow('"Developer mode"'));
      console.log(chalk.white('   3. ') + chalk.gray('Click ') + chalk.yellow('"Load unpacked"'));
      console.log(chalk.white('   4. ') + chalk.gray('Select: ') + chalk.cyan(path.join(projectRoot, 'dist')) + '\n');
      
      console.log(chalk.green('👀 ') + chalk.gray('Watching for file changes...\n'));
      showWatchingStatus();
      isFirstBuild = false;
    } else {
      // 重新构建完成 - 简洁显示
      console.log(chalk.green(`✅ Rebuild #${buildCount} completed`) + chalk.gray(` (${buildTime}s)`));
      console.log(chalk.blue('   📦 Files updated - reload extension in browser\n'));
      showWatchingStatus();
    }
  });
}

// 运行开发模式
dev();

