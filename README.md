# create-revite

A CLI tool to quickly scaffold React + Vite + Tailwind CSS projects.

## Usage

You can create a new project using any of these commands:

```bash
# Create a new project in a new directory
npx create-revite my-project

# Create in current directory
npx create-revite .

# Use latest version
npx create-revite@latest my-project

# Create with TypeScript
npx create-revite my-project -ts
npx create-revite my-project --typescript

# Create without Tailwind CSS
npx create-revite my-project --no-tailwind
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
| `-ts, --typescript` | Use TypeScript template | JavaScript |
| `--no-tailwind` | Skip Tailwind CSS installation | Includes Tailwind |

## Requirements

- Node.js 14.0.0 or higher
- npm or yarn

## Examples

### Basic React + Vite + Tailwind project:
```bash
npx create-revite my-app
cd my-app
npm run dev
```

### TypeScript project:
```bash
npx create-revite my-ts-app --typescript
cd my-ts-app
npm run dev
```

### Project in current directory:
```bash
mkdir my-project && cd my-project
npx create-revite .
npm run dev
```

### React + Vite without Tailwind:
```bash
npx create-revite my-app --no-tailwind
```

## Features

- 🚀 **Fast setup** - Get started in seconds
- 🎯 **Sensible defaults** - Pre-configured for optimal development
- 🧩 **Modular** - Choose TypeScript and/or Tailwind
- 📦 **Latest packages** - Always uses the latest stable versions
- 🎨 **Beautiful starter** - Includes a welcoming landing page with examples

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name]

## Changelog

### 1.0.0
- Initial release
- React + Vite + Tailwind CSS scaffolding
- TypeScript support
- Current directory installation
- Tailwind CSS optional installation