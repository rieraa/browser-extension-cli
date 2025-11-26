const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { getWebpackConfig } = require('../utils/webpack-config');

function dev(options) {
  const projectRoot = process.cwd();

  console.log(chalk.blue('Starting development build with watch mode...'));

  const config = getWebpackConfig({
    mode: 'development',
    projectRoot,
  });

  const compiler = webpack(config);

  let isFirstBuild = true;

  compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/,
  }, (err, stats) => {
    if (err) {
      console.error(chalk.red('Build error:'), err);
      return;
    }

    if (stats.hasErrors()) {
      console.error(chalk.red('\n✗ Build failed with errors:'));
      console.error(stats.toString({ colors: true, chunks: false }));
      return;
    }

    if (stats.hasWarnings()) {
      console.warn(chalk.yellow('\n⚠ Build warnings:'));
      console.warn(stats.toString({ colors: true, chunks: false }));
    }

    if (isFirstBuild) {
      console.log(chalk.green('\n✓ Initial build completed!'));
      console.log(chalk.yellow(`\nTo load the extension in your browser:`));
      console.log(chalk.white(`  1. Open Chrome/Edge and go to chrome://extensions/`));
      console.log(chalk.white(`  2. Enable "Developer mode"`));
      console.log(chalk.white(`  3. Click "Load unpacked"`));
      console.log(chalk.white(`  4. Select the directory: ${path.join(projectRoot, 'dist')}`));
      console.log(chalk.white(`\nWatching for file changes...\n`));
      isFirstBuild = false;
    } else {
      console.log(chalk.green('\n✓ Rebuild completed!'));
      console.log(chalk.blue('Extension files updated. Reload the extension in your browser.\n'));
    }
  });
}

module.exports = dev;

