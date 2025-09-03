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
  .version('1.0.1')
  .argument('[project-directory]', 'project directory name')
  .option('-ts, --typescript', 'use TypeScript template')
  .option('--no-tailwind', 'skip Tailwind CSS installation')
  .option('-t, --template <template>', 'choose template: basic, dashboard, landing, blog', 'basic')
  .action(async (projectDirectory, options) => {
    try {
      await createProject(projectDirectory, options);
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error.message);
      process.exit(1);
    }
  });

async function createProject(projectDirectory, options) {
  // Validate template option
  const validTemplates = ['basic', 'dashboard', 'landing', 'blog'];
  if (!validTemplates.includes(options.template)) {
    console.error(chalk.red(`Invalid template "${options.template}". Available templates: ${validTemplates.join(', ')}`));
    return;
  }

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
  console.log(chalk.gray(`Using template: ${chalk.cyan(options.template)}`));
  console.log();

  const template = options.typescript ? 'react-ts' : 'react';
  const useTailwind = options.tailwind !== false;
  const spinner = ora('Creating Vite project...').start();
  
  try {
    await createViteProject(projectPath, template, projectName);
    spinner.succeed('Vite project created');

    if (useTailwind) {
      spinner.start('Installing Tailwind CSS...');
      await installTailwind(projectPath, options.typescript, options.template);
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
        reject(new Error(`Vite creation failed with exit code ${code}. Please check your internet connection and try again.`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function generateAppTemplate(templateType) {
  const templates = {
    basic: `import reactLogo from './assets/react.svg'
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

export default App`,

    dashboard: `function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                New Project
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-gray-900">8</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">C</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">4</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Alpha</p>
                  <p className="text-sm text-gray-500">Updated 2 hours ago</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Beta</p>
                  <p className="text-sm text-gray-500">Updated 1 day ago</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App`,

    landing: `function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">ReVite</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-500 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-500 hover:text-gray-900">Pricing</a>
              <a href="#about" className="text-gray-500 hover:text-gray-900">About</a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Build faster with</span>
              <span className="block text-blue-600">React + Vite + Tailwind</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create modern React applications with the power of Vite and the beauty of Tailwind CSS. 
              Get started in seconds, not hours.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                  Get Started
                </button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="h-[45vh] flex items-center justify-center py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Features</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need to build modern web applications</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <span className="font-bold">⚡</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Lightning Fast</h3>
              <p className="mt-2 text-base text-gray-500">Powered by Vite for instant hot reload and optimized builds</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <span className="font-bold">🎨</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Beautiful Design</h3>
              <p className="mt-2 text-base text-gray-500">Tailwind CSS for rapid UI development and consistent styling</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                <span className="font-bold">⚛️</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Modern React</h3>
              <p className="mt-2 text-base text-gray-500">Latest React features with TypeScript support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 mt-2">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 ReVite. Built with React + Vite + Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App`,

    blog: `function App() {
  const posts = [
    {
      id: 1,
      title: "Getting Started with React + Vite + Tailwind",
      excerpt: "Learn how to build modern web applications with this powerful combination of tools.",
      date: "Mar 16, 2024",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Advanced Tailwind CSS Techniques",
      excerpt: "Discover advanced patterns and techniques for building beautiful UIs with Tailwind CSS.",
      date: "Mar 12, 2024",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "Vite: The Next Generation Build Tool",
      excerpt: "Why Vite is revolutionizing the way we build and develop web applications.",
      date: "Mar 8, 2024",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto h-[80px] flex items-center justify-between px-4 sm:px-6 lg:px-8 ">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Blog</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-233px)]">
        {/* Featured Post */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-12">
          <div className="p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">
                Featured
              </span>
              <span>Mar 16, 2024</span>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started with React + Vite + Tailwind
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Learn how to build modern web applications with this powerful combination of tools. 
              We'll cover everything from setup to deployment, including best practices and common patterns.
            </p>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Read more →
            </button>
          </div>
        </article>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {posts.slice(1).map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Read more →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">Get the latest posts delivered right to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 h-[80px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 My Blog. Built with React + Vite + Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App`
  };

  return templates[templateType] || templates.basic;
}

async function installTailwind(projectPath, isTypeScript, templateType = 'basic') {
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
  
  const appContent = generateAppTemplate(templateType);

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