const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { getWebpackConfig } = require('../utils/webpack-config');

// 进度动画字符
const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let spinnerIndex = 0;
let progressInterval = null;

function showProgress() {
  if (progressInterval) return;
  
  progressInterval = setInterval(() => {
    process.stdout.write(`\r${chalk.blue(spinnerFrames[spinnerIndex])} Building...`);
    spinnerIndex = (spinnerIndex + 1) % spinnerFrames.length;
  }, 100);
}

function hideProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
    process.stdout.write('\r' + ' '.repeat(20) + '\r'); // 清除进度行
  }
}

async function build(options) {
  const mode = options.mode || 'production';
  const projectRoot = process.cwd();

  console.log(chalk.blue(`\n🚀 Building extension in ${mode} mode...\n`));

  const config = getWebpackConfig({
    mode,
    projectRoot
  });

  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    let lastPercent = 0;
    let buildStartTime = Date.now();
    
    // 显示初始进度
    showProgress();

    // 监听编译开始
    compiler.hooks.compile.tap('BuildProgress', () => {
      buildStartTime = Date.now();
      showProgress();
    });

    // 监听进度更新（webpack 5 的进度钩子）
    compiler.hooks.progress.tap('BuildProgress', (percent, msg) => {
      const currentPercent = Math.floor(percent * 100);
      if (currentPercent !== lastPercent) {
        lastPercent = currentPercent;
        hideProgress();
        const frame = spinnerFrames[spinnerIndex % spinnerFrames.length];
        process.stdout.write(`\r${chalk.blue(frame)} Building... ${chalk.yellow(currentPercent + '%')} ${msg ? chalk.gray(msg) : ''}`);
        spinnerIndex++;
      }
    });

    compiler.run((err, stats) => {
      hideProgress();

      if (err) {
        console.error(chalk.red('\n✗ Build failed:'), err);
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        console.error(chalk.red('\n✗ Build errors:'));
        console.error(stats.toString({ 
          colors: true,
          chunks: false,
          modules: false,
        }));
        reject(new Error('Build failed with errors'));
        return;
      }

      const buildTime = ((Date.now() - buildStartTime) / 1000).toFixed(2);

      // 显示构建统计信息
      const statsData = stats.toJson({
        colors: true,
        chunks: false,
        modules: false,
      });

      console.log(chalk.green(`\n✓ Build completed successfully! ${chalk.gray(`(${buildTime}s)`)}`));
      
      // 显示文件大小信息
      if (statsData.assets && statsData.assets.length > 0) {
        console.log(chalk.blue('\n📦 Output files:'));
        let totalSize = 0;
        statsData.assets.forEach((asset) => {
          const size = asset.size / 1024;
          totalSize += size;
          console.log(chalk.white(`   ${asset.name} ${chalk.gray(`(${size.toFixed(2)} KB)`)}`));
        });
        console.log(chalk.gray(`   Total: ${totalSize.toFixed(2)} KB`));
      }

      console.log(chalk.yellow(`\n📁 Output directory: ${path.join(projectRoot, 'dist')}`));
      console.log(chalk.yellow(`\n🔧 To load the extension:`));
      console.log(chalk.white(`  1. Open Chrome/Edge and go to chrome://extensions/`));
      console.log(chalk.white(`  2. Enable "Developer mode"`));
      console.log(chalk.white(`  3. Click "Load unpacked"`));
      console.log(chalk.white(`  4. Select the directory: ${path.join(projectRoot, 'dist')}\n`));

      resolve();
    });
  });
}

module.exports = build;

