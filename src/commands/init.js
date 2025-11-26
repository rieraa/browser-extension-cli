const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const sharp = require('sharp');
const { spawn } = require('child_process');
const config = require('../config');

async function init(projectName) {
  let targetDir = projectName || 'my-extension';
  
  if (!projectName) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-extension',
        validate: (input) => {
          if (!input.trim()) {
            return 'Project name cannot be empty';
          }
          if (fs.existsSync(input)) {
            return 'Directory already exists';
          }
          return true;
        }
      }
    ]);
    targetDir = answers.projectName;
  }

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`Directory ${targetDir} already exists!`));
    process.exit(1);
  }

  console.log(chalk.blue(`Creating project: ${targetDir}...`));

  const templateDir = path.join(__dirname, '../templates/default');
  const targetPath = path.resolve(process.cwd(), targetDir);

  try {
    // 复制模板文件
    await fs.copy(templateDir, targetPath);

    // 生成图标文件
    const iconSourcePath = path.join(__dirname, '../static/小企鹅拿喇叭.png');
    const iconsDir = path.join(targetPath, 'public/icons');
    
    if (await fs.pathExists(iconSourcePath)) {
      console.log(chalk.blue('Generating icon files...'));
      
      const iconSizes = [16, 48, 128];
      for (const size of iconSizes) {
        await sharp(iconSourcePath)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png()
          .toFile(path.join(iconsDir, `icon${size}.png`));
      }
      
      console.log(chalk.green(`✓ Icons generated (16x16, 48x48, 128x128)`));
    } else {
      console.log(chalk.yellow(`⚠ Icon source not found, skipping icon generation`));
    }

    // 更新 package.json 中的项目名称
    const packageJsonPath = path.join(targetPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = targetDir;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green(`✓ Project created successfully!`));

    // 询问是否安装依赖并启动（根据配置决定是否询问）
    const shouldAsk = config.askInstallAndStart;
    // 检查是否是开发模式（通过环境变量或命令行参数）
    // const isDevMode = process.env.EXT_CLI_DEV === 'true' || process.env.NODE_ENV === 'development';
    const skipAsk = config.skipAskInDevMode;

    let shouldInstall = false;
    let shouldStart = false;

    if (skipAsk) {
      // 开发模式跳过询问，直接安装并启动
      shouldInstall = true;
      shouldStart = true;
      console.log(chalk.blue('\n[Dev Mode] Auto-installing dependencies and starting...'));
    } else if (shouldAsk) {
      // 询问用户
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'install',
          message: 'Install dependencies now?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'start',
          message: 'Start development server after installation?',
          default: true,
          when: (answers) => answers.install,
        },
      ]);
      shouldInstall = answers.install;
      shouldStart = answers.start;
    }

    if (shouldInstall) {
      console.log(chalk.blue('\nInstalling dependencies...'));
      await installDependencies(targetPath);
      
      if (shouldStart) {
        console.log(chalk.blue('\nStarting development server...\n'));
        startDevServer(targetPath);
      } else {
        console.log(chalk.yellow(`\nNext steps:`));
        console.log(chalk.white(`  cd ${targetDir}`));
        console.log(chalk.white(`  npm run dev`));
      }
    } else {
      console.log(chalk.yellow(`\nNext steps:`));
      console.log(chalk.white(`  cd ${targetDir}`));
      console.log(chalk.white(`  npm install`));
      console.log(chalk.white(`  npm run dev`));
    }
  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    process.exit(1);
  }
}

// 安装依赖
function installDependencies(projectPath) {
  return new Promise((resolve, reject) => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const installProcess = spawn(npm, ['install'], {
      cwd: projectPath,
      stdio: 'inherit',
      shell: true,
    });

    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✓ Dependencies installed successfully!'));
        resolve();
      } else {
        console.error(chalk.red('✗ Installation failed'));
        reject(new Error(`Installation failed with code ${code}`));
      }
    });

    installProcess.on('error', (err) => {
      console.error(chalk.red('✗ Installation error:'), err);
      reject(err);
    });
  });
}

// 启动开发服务器
function startDevServer(projectPath) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const devProcess = spawn(npm, ['run', 'dev'], {
    cwd: projectPath,
    stdio: 'inherit',
    shell: true,
  });

  devProcess.on('error', (err) => {
    console.error(chalk.red('✗ Failed to start dev server:'), err);
  });

  // 处理退出信号
  process.on('SIGINT', () => {
    devProcess.kill('SIGINT');
    process.exit(0);
  });
}

module.exports = init;

