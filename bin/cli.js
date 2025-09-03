#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const prompts = require('prompts');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const validateProjectName = require('validate-npm-package-name');

const program = new Command();

program
  .name('create-revite')
  .description('Create React + Vite + Tailwind projects')
  .version('1.0.0')
  .argument('[project-directory]', 'project directory name')
  .option('-ts, --typescript', 'use TypeScript template')
  .option('--no-tailwind', 'skip Tailwind CSS installation')
  .action(async (projectDirectory, options) => {
    try {
      await createProject(projectDirectory, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error.message);
      process.exit(1);
    }
  });

async function createProject(projectDirectory, options) {
  let projectName = projectDirectory;
  let projectPath;

  if (!projectDirectory || projectDirectory === '.') {
    projectName = path.basename(process.cwd());
    projectPath = process.cwd();
    
    const files = await fs.readdir(projectPath);
    const relevantFiles = files.filter(file => !file.startsWith('.'));
    
    if (relevantFiles.length > 0) {
      const response = await prompts({
        type: 'confirm',
        name: 'continue',
        message: 'Current directory is not empty. Continue anyway?',
        initial: false
      });
      
      if (!response.continue) {
        console.log(chalk.yellow('Operation cancelled.'));
        return;
      }
    }
  } else {
    const validation = validateProjectName(projectDirectory);
    if (!validation.validForNewPackages) {
      console.error(chalk.red('Invalid project name:'));
      validation.errors && validation.errors.forEach(err => console.error(chalk.red(`  • ${err}`)));
      validation.warnings && validation.warnings.forEach(warn => console.error(chalk.yellow(`  • ${warn}`)));
      return;
    }

    projectPath = path.resolve(projectDirectory);
    
    if (await fs.pathExists(projectPath)) {
      console.error(chalk.red(`Directory "${projectDirectory}" already exists.`));
      return;
    }
  }

  console.log(chalk.blue(`Creating a new React + Vite + Tailwind app in ${chalk.green(projectPath)}`));
  console.log();

  const template = options.typescript ? 'react-ts' : 'react';
  const useTailwind = options.tailwind !== false;
  const spinner = ora('Creating Vite project...').start();
  
  try {
    await createViteProject(projectPath, template, projectName);
    spinner.succeed('Vite project created');

    if (useTailwind) {
      spinner.start('Installing Tailwind CSS...');
      await installTailwind(projectPath, options.typescript);
      spinner.succeed('Tailwind CSS installed');
    }

    spinner.start('Installing dependencies...');
    await installDependencies(projectPath);
    spinner.succeed('Dependencies installed');

    console.log();
    console.log(chalk.green('Success! Created'), chalk.cyan(projectName), chalk.green('at'), chalk.cyan(projectPath));
    console.log();
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan('  npm run dev'));
    console.log('    Starts the development server.');
    console.log();
    console.log(chalk.cyan('  npm run build'));
    console.log('    Bundles the app into static files for production.');
    console.log();
    console.log(chalk.cyan('  npm run preview'));
    console.log('    Preview the production build locally.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    
    if (projectDirectory && projectDirectory !== '.') {
      console.log(chalk.cyan(`  cd ${projectName}`));
    }
    console.log(chalk.cyan('  npm run dev'));
    console.log();
    console.log(chalk.blue('Happy coding! 🚀'));

  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}

async function createViteProject(projectPath, template, projectName) {
  return new Promise((resolve, reject) => {
    const targetName = projectPath === process.cwd() ? '.' : projectName;
    const args = [
      'create-vite@latest',
      targetName,
      '--template', template,
      '--yes'  // Force non-interactive mode
    ];

    const child = spawn('npx', args, {
      stdio: 'inherit',
      cwd: path.dirname(projectPath),
      shell: true
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Vite creation failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function installTailwind(projectPath, isTypeScript) {
  await runCommand('npm', ['install', 'tailwindcss', '@tailwindcss/vite'], projectPath);

  const viteConfigFile = isTypeScript ? 'vite.config.ts' : 'vite.config.js';
  const viteConfigPath = path.join(projectPath, viteConfigFile);
  
  let viteConfig = await fs.readFile(viteConfigPath, 'utf-8');
  
  if (isTypeScript) {
    viteConfig = viteConfig.replace(
      "import { defineConfig } from 'vite'",
      "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'"
    );
  } else {
    viteConfig = viteConfig.replace(
      "import { defineConfig } from 'vite'",
      "import { defineConfig } from 'vite'\nimport tailwindcss from '@tailwindcss/vite'"
    );
  }
  
  viteConfig = viteConfig.replace(
    'plugins: [react()]',
    'plugins: [react(), tailwindcss()]'
  );
  
  await fs.writeFile(viteConfigPath, viteConfig);

  const cssPath = path.join(projectPath, 'src/index.css');
  const tailwindImports = '@import "tailwindcss";\n';
  
  await fs.writeFile(cssPath, tailwindImports);

  const appFile = isTypeScript ? 'App.tsx' : 'App.jsx';
  const appPath = path.join(projectPath, 'src', appFile);
  
  const appContent = `import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-16 w-16 hover:animate-spin" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-16 w-16 hover:animate-spin" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-blue-600">ReVite</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          React + Vite + Tailwind CSS
        </p>
        <div className="space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Get Started
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition duration-200">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
`;

  await fs.writeFile(appPath, appContent);

  const appCssPath = path.join(projectPath, 'src/App.css');
  if (await fs.pathExists(appCssPath)) {
    await fs.remove(appCssPath);
  }
}

async function installDependencies(projectPath) {
  return runCommand('npm', ['install'], projectPath);
}

async function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: cwd,
      shell: true,
      stdio: 'inherit',
      env: { ...process.env }
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with exit code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

program.parse();