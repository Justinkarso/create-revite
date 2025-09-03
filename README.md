# create-revite

A CLI tool to quickly scaffold React + Vite + Tailwind CSS projects with starter templates.

![Hero](https://i.imgur.com/e8I3uwx_d.webp?maxwidth=760&fidelity=grand)

## Usage

### Quick Start

```bash
# Create a new project with default template
npx create-revite my-project

# Create with specific template
npx create-revite my-project --template dashboard

# Create in current directory
npx create-revite . --template landing

# Create with TypeScript
npx create-revite my-project --template blog --typescript
```

### ✨ Templates

Choose from professionally designed starter templates:

```bash
# Basic template (default) - Clean welcome page
npx create-revite my-app

# Dashboard template - Admin dashboard with stats & charts
npx create-revite my-app --template dashboard

# Landing page template - Marketing/product page with hero section
npx create-revite my-app --template landing

# Blog template - Blog layout with posts and newsletter
npx create-revite my-app --template blog
```

### All Options

```bash
# Template options
npx create-revite my-project --template <basic|dashboard|landing|blog>

# TypeScript support
npx create-revite my-project -ts
npx create-revite my-project --typescript

# Skip Tailwind CSS (not recommended)
npx create-revite my-project --no-tailwind

# Use latest version
npx create-revite@latest my-project
```

## What it does

This tool creates a complete React development environment with:

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React** - Modern JavaScript library for building user interfaces  
- 🎨 **Tailwind CSS** - Utility-first CSS framework (optional)
- 📝 **TypeScript support** - Optional TypeScript configuration
- 🔥 **Hot reload** - Instant updates during development

## Project Structure

After running the command, you'll get a project structure like this:

```
my-project/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx (or App.tsx)
│   ├── index.css
│   └── main.jsx (or main.tsx)
├── index.html
├── package.json
├── vite.config.js (or vite.config.ts)
└── README.md
```

## Configuration Details

### Vite Configuration

The generated `vite.config.js/ts` includes:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### Tailwind CSS Setup

Tailwind is configured using the new Vite plugin approach:

1. **Packages installed**: `tailwindcss` and `@tailwindcss/vite`
2. **Plugin added** to Vite configuration
3. **CSS import** added to `src/index.css`:
   ```css
   @import "tailwindcss";
   ```
4. **Sample styling** applied to demonstrate Tailwind classes

## Available Scripts

After project creation, you can run:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if TypeScript template)

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `-t, --template <name>` | Choose starter template: `basic`, `dashboard`, `landing`, `blog` | `basic` |
| `-ts, --typescript` | Use TypeScript template | JavaScript |
| `--no-tailwind` | Skip Tailwind CSS installation | Includes Tailwind |

## Requirements

- Node.js 14.0.0 or higher
- npm or yarn

## Examples

### Dashboard application:
```bash
npx create-revite admin-panel --template dashboard
cd admin-panel
npm run dev
```

### Landing page with TypeScript:
```bash
npx create-revite my-product --template landing --typescript
cd my-product
npm run dev
```

### Blog project:
```bash
npx create-revite my-blog --template blog
cd my-blog
npm run dev
```

### Basic project in current directory:
```bash
mkdir my-project && cd my-project
npx create-revite .
npm run dev
```

### React + Vite without Tailwind:
```bash
npx create-revite my-app --no-tailwind
```

## 🎨 Template Showcase

### 🏠 Basic Template
Perfect for learning or simple projects:
- Clean welcome page with React + Vite + Tailwind branding
- Animated logos and call-to-action buttons
- Minimal, focused design

### 📊 Dashboard Template  
Ready-to-use admin interface:
- Header with navigation and actions
- Stats cards with metrics display
- Recent activity feed
- Responsive grid layout

### 🚀 Landing Page Template
Professional marketing page:
- Hero section with compelling copy
- Features showcase with icons
- Navigation bar and footer
- Call-to-action buttons
- Gradient backgrounds

### 📝 Blog Template
Complete blog layout:
- Featured post section
- Blog post grid with metadata
- Newsletter signup form
- Clean typography and spacing
- Responsive design

## Features

- 🚀 **Fast setup** - Get started in seconds, not hours
- 🎨 **4 Beautiful templates** - Professional designs for different use cases
- 🎯 **Sensible defaults** - Pre-configured for optimal development
- 🧩 **Modular** - Choose TypeScript and/or Tailwind
- 📦 **Latest packages** - Always uses the latest stable versions
- ⚡ **Production ready** - Optimized builds and modern tooling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © Justin Karso

## Changelog

### 1.1.0
- 🎨 **NEW**: Multiple starter templates (basic, dashboard, landing, blog)
- 🚀 **NEW**: `--template` option to choose from professional designs
- ✨ **IMPROVED**: Enhanced user experience with template showcase
- 📝 **IMPROVED**: Better error messages and validation

### 1.0.1
- 🐛 **FIX**: Improved error handling with more descriptive messages
- 🔧 **FIX**: Better Windows compatibility for npm commands

### 1.0.0
- 🎉 Initial release
- React + Vite + Tailwind CSS scaffolding
- TypeScript support
- Current directory installation
- Tailwind CSS optional installation