# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React-based portfolio website using Vite as the build tool and Tailwind CSS v4 for styling. The project includes multi-language support (Portuguese BR and English) and a responsive header component.

## Common Development Commands

### Development
```bash
npm run dev              # Start Vite dev server (typically runs on http://localhost:5173)
```

### Building
```bash
npm run build            # Build for production
npm run preview          # Preview production build locally
```

### Code Quality
```bash
npm run lint             # Run ESLint checks
```

### Package Management
```bash
npm install              # Install dependencies
npm install <package>    # Add new dependency
npm install -D <package> # Add new dev dependency
```

## Architecture Overview

### Technology Stack
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 (configured via PostCSS)
- **Language**: JavaScript (JSX)
- **Build Tool**: Vite 7
- **Linting**: ESLint 9 with React-specific plugins

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Fixed header with scroll animations and language switcher
│   └── Homepage.jsx    # Main content component
├── contexts/           # React Context API providers
│   └── LanguageContext.jsx  # Language state management (pt-BR/en)
├── translations/       # Internationalization
│   └── translations.js # Translation strings for pt-BR and en
├── assets/            # Static assets (SVGs, etc.)
├── App.jsx            # Root component
├── main.jsx           # Application entry point with providers
└── index.css          # Global styles and Tailwind imports
```

### Key Design Patterns

#### Language Management
The application uses React Context API for language state management:
- `LanguageContext` provides language state globally
- Language preference persists in localStorage
- Components access translations via `useLanguage` hook
- Translation keys are structured as nested objects

#### Styling Approach
- Tailwind CSS v4 with custom utilities for the "moso" color palette
- Custom colors defined: `moso-blue` (#E5F6FD) and `moso-black` (#121713)
- Responsive design with scroll-based header animations
- PostCSS configuration for Tailwind processing

#### Component Architecture
- Functional components with React hooks
- Header component features:
  - Dynamic sizing based on scroll position
  - Toggleable menu with language switcher
  - Fixed positioning with smooth transitions
- Homepage renders content sections with translated text

### Configuration Files

**vite.config.js**: Uses React plugin for JSX transformation
**eslint.config.js**: Configured for React with hooks and refresh rules
**postcss.config.js**: Tailwind CSS v4 integration with autoprefixer

### Development Workflow

1. The development server auto-refreshes on file changes
2. ESLint enforces code quality with React-specific rules
3. Tailwind processes CSS utilities on demand
4. Vite handles HMR (Hot Module Replacement) for instant feedback

### Important Implementation Details

- The header shrinks from 96px to 64px height when scrolling past 50px
- Language selection persists across sessions using localStorage
- Fixed header requires padding-top on content (currently pt-32)
- Profile image is served from `/public/pfp.png`
- SVG icons for menu toggle are inline in Header component