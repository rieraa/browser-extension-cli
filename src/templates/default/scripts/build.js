const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { getWebpackConfig } = require('../webpack.config');

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
    process.stdout.write('\r' + ' '.repeat(30) + '\r'); // 清除进度行
  }
}

async function build() {
  // 支持通过命令行参数指定模式，或使用环境变量
  const modeArg = process.argv.find(arg => arg.startsWith('--mode='));
  const mode = modeArg 
    ? modeArg.split('=')[1] 
    : (process.env.NODE_ENV === 'production' ? 'production' : 'development');
  const projectRoot = process.cwd();

  console.log(chalk.blue(`\n🚀 Building extension in ${mode} mode...\n`));

  const config = getWebpackConfig({
    mode,
    projectRoot
  });

  // 使用 ProgressPlugin 来显示进度
  const { ProgressPlugin } = require('webpack');
  let lastPercent = 0;
  
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
      if (currentPercent !== lastPercent) {
        lastPercent = currentPercent;
        hideProgress();
        const frame = spinnerFrames[spinnerIndex % spinnerFrames.length];
        const msg = message || (args.length > 0 ? args[0] : '');
        process.stdout.write(`\r${chalk.blue(frame)} Building... ${chalk.yellow(currentPercent + '%')} ${msg ? chalk.gray(msg) : ''}`);
        spinnerIndex++;
      }
    }
  });
  
  // 将 ProgressPlugin 添加到配置中
  if (!config.plugins) {
    config.plugins = [];
  }
  config.plugins.push(progressPlugin);

  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    let buildStartTime = Date.now();
    
    // 显示初始进度
    showProgress();
    buildStartTime = Date.now();

    // 监听编译开始（如果 hooks 存在）
    if (compiler.hooks && compiler.hooks.compile) {
      compiler.hooks.compile.tap('BuildProgress', () => {
        buildStartTime = Date.now();
        showProgress();
      });
    }

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

// 运行构建
build().catch((err) => {
  console.error(err);
  process.exit(1);
});

