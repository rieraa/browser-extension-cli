#!/usr/bin/env node

const { program } = require('commander');
const initCommand = require('../src/commands/init');
const devCommand = require('../src/commands/dev');
const buildCommand = require('../src/commands/build');

program
  .name('extension-cli')
  .description('CLI tool for creating browser extensions with React')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new browser extension project')
  .argument('[project-name]', 'Project name')
  .action(initCommand);

program
  .command('dev')
  .description('Start development server with hot reload')
  .option('-p, --port <port>', 'Port number', '3000')
  .action(devCommand);

program
  .command('build')
  .description('Build extension for production')
  .option('-m, --mode <mode>', 'Build mode (production or development)', 'production')
  .action(buildCommand);

program.parse();

