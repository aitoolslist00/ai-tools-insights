---
description: Repository Information Overview
alwaysApply: true
---

# AI Tools List Information

## Summary
A comprehensive, SEO-optimized directory of AI tools built with Next.js 15, targeting US and Europe markets. Features a clean, modern design with full responsiveness and advanced functionality including tool listings, blog system, and search capabilities.

## Structure
- **app/**: Next.js App Router with pages and routes
- **components/**: Reusable React components
- **lib/**: Utility functions and data handling
- **public/**: Static assets and SEO files
- **.next/**: Build output (generated)

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.6.3
**Framework**: Next.js 15.0.3
**Node Requirement**: >= 18.0.0
**Package Manager**: npm >= 8.0.0

## Dependencies
**Main Dependencies**:
- next: ^15.0.3
- react: ^18.3.1
- react-dom: ^18.3.1
- lucide-react: ^0.451.0
- @headlessui/react: ^2.1.9
- clsx: ^2.1.1
- tailwind-merge: ^2.5.4

**Development Dependencies**:
- typescript: ^5.6.3
- tailwindcss: ^3.4.14
- postcss: ^8.4.47
- autoprefixer: ^10.4.20
- eslint: ^8.57.1
- eslint-config-next: ^15.0.3

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Clean build cache
npm run clean
```

## Deployment
**Platform**: Vercel
**Configuration**: vercel.json with custom routes and security headers
**Build Command**: npm run build
**Output Directory**: .next

## Main Files
**Entry Point**: app/page.tsx (homepage)
**Layout**: app/layout.tsx (root layout)
**Navigation**: components/Navbar.tsx
**Tool Pages**: app/ai-tools/[slug]/page.tsx
**Blog System**: app/blog/[slug]/page.tsx

## Configuration
**Next.js**: next.config.js with image optimization and experimental features
**TypeScript**: tsconfig.json with strict mode and path aliases
**Tailwind**: tailwind.config.js with custom color palette and animations
**ESLint**: .eslintrc.json for code quality
**Vercel**: vercel.json for deployment and routing