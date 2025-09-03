# Development Setup Guide

This guide will help you set up the `create-revite` package for development and publishing.

## Prerequisites

- Node.js 14.0.0 or higher
- npm (comes with Node.js)
- Git (for version control)

## Setup for Development

1. **Clone or create the project directory:**
   ```bash
   mkdir create-revite
   cd create-revite
   ```

2. **Create the project structure:**
   ```
   create-revite/
   ├── bin/
   │   └── cli.js
   ├── package.json
   ├── README.md
   ├── .gitignore
   └── INSTALLATION.md
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Make CLI executable:**
   ```bash
   chmod +x bin/cli.js
   ```

5. **Test locally by linking:**
   ```bash
   npm link
   ```
   
   Now you can test with:
   ```bash
   create-revite test-project
   ```

6. **Unlink when done testing:**
   ```bash
   npm unlink -g create-revite
   ```

## Publishing to npm

1. **Create an npm account** at [npmjs.com](https://npmjs.com) if you don't have one

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Update package.json with your details:**
   - Change `author` field
   - Update `repository` URL
   - Update `bugs` and `homepage` URLs
   - Ensure package name is unique (check with `npm info create-revite`)

4. **Test the package locally:**
   ```bash
   npm pack
   ```
   This creates a `.tgz` file you can inspect

5. **Publish to npm:**
   ```bash
   npm publish
   ```

6. **For updates, bump version and republish:**
   ```bash
   npm version patch  # or minor, major
   npm publish
   ```

## Testing the Published Package

After publishing, test it works:

```bash
# Test creating a JavaScript project
npx create-revite@latest test-js-project

# Test creating a TypeScript project  
npx create-revite@latest test-ts-project -ts

# Test creating in current directory
mkdir test-current && cd test-current
npx create-revite@latest .
```

## Package Structure Explanation

- **`bin/cli.js`** - Main CLI entry point with executable permissions
- **`package.json`** - Package configuration with dependencies and bin entry
- **`README.md`** - User-facing documentation  
- **`.gitignore`** - Files to ignore in git
- **`INSTALLATION.md`** - This development guide

## Key Dependencies

- **`commander`** - CLI framework for parsing arguments and options
- **`chalk`** - Terminal string styling (colors)
- **`ora`** - Elegant terminal spinners
- **`prompts`** - Lightweight, beautiful CLI prompts
- **`fs-extra`** - Enhanced file system methods
- **`validate-npm-package-name`** - Validates npm package names

## CLI Features Implemented

✅ **Basic usage**: `npx create-revite project-name`  
✅ **Current directory**: `npx create-revite .`  
✅ **TypeScript flag**: `-ts` or `--typescript`  
✅ **Skip Tailwind**: `--no-tailwind`  
✅ **Project name validation**  
✅ **Empty directory checks**  
✅ **Progress indicators**  
✅ **Colored output**  
✅ **Error handling**  

## Customization Options

You can modify the generated templates by updating the `installTailwind()` function in `bin/cli.js`. This function:

1. Installs Tailwind packages
2. Updates Vite config
3. Adds Tailwind import to CSS
4. Updates App component with styled example

## Troubleshooting

**Permission denied errors:**
```bash
chmod +x bin/cli.js
```

**Module not found errors:**
Check all dependencies are installed:
```bash
npm install
```

**Publishing errors:**
- Ensure package name is unique
- Check you're logged into npm
- Verify package.json is valid

**CLI not working after publish:**
Wait a few minutes for npm registry to propagate, then try again.

## Version Management

Use semantic versioning:
- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

```bash
npm version patch && npm publish
npm version minor && npm publish  
npm version major && npm publish
```