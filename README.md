# AI Tools Insights

A comprehensive website for AI tools reviews, comparisons, and tutorials. Built with Astro, React, and Tailwind CSS.

## Features

- **Modern Tech Stack**: Built with Astro 5, React, and Tailwind CSS
- **SEO Optimized**: Dynamic sitemap, robots.txt, and comprehensive meta tags
- **Admin Dashboard**: Secure authentication-protected dashboard for content management
- **Semi-Automatic Content Optimizer**: Paste markdown and optimize it with SEO enhancements
- **Fully Automatic Article Generation**: AI-powered article generation using Gemini 2.5 Flash and NewsAPI
- **Internal Linking System**: Automated internal backlinking for better SEO
- **Modular Structure**: Easy to maintain and update

## Project Structure

```
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── seo.ts
│   │   └── internal-links.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── index.astro
│   │   │   ├── login.astro
│   │   │   ├── articles/
│   │   │   ├── content-optimizer.astro
│   │   │   └── auto-generate.astro
│   │   ├── ai-tools/
│   │   ├── blog/
│   │   ├── api/
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── package.json
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
GEMINI_API_KEY=your_gemini_api_key
NEWSAPI_KEY=your_newsapi_key
JWT_SECRET=your_secret_key
SITE_URL=https://www.aitoolsinsights.com
```

### 3. Database

The project uses SQLite for development (better-sqlite3). The database will be created automatically on first run.

For production, you can switch to PostgreSQL by updating the connection in `src/lib/db.ts`.

## Commands

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build for production to `./dist/` |
| `npm run preview` | Preview production build |

## Admin Dashboard

Access the admin dashboard at `/admin/login`

**Default Credentials:**
- Username: `ahmedibrahim`
- Password: `140796@@##`

### Dashboard Features

1. **Content Optimizer** (`/admin/content-optimizer`)
   - Paste markdown content
   - Automatic SEO optimization
   - Dynamic meta tags generation
   - One-click publishing

2. **Auto-Generate** (`/admin/auto-generate`)
   - Input keyword/topic
   - Fetches latest news from NewsAPI
   - Generates comprehensive article using Gemini AI
   - Automatic category selection
   - SEO optimization included

## Pages

- **Home** - Featured AI tools and recent articles
- **AI Tools** - Directory of AI tools with detailed reviews
- **Blog** - Articles organized by subcategories:
  - Reviews
  - Comparisons
  - Tutorials
  - Industry News
  - Development
- **About** - About the website
- **Contact** - Contact form
- **Terms** - Terms and conditions
- **Privacy** - Privacy policy
- **Disclaimer** - Website disclaimer

## SEO Features

- Automatic sitemap generation
- Optimized robots.txt
- Dynamic meta tags
- OpenGraph and Twitter Card support
- Structured internal linking
- Mobile-responsive design

## Deployment

The website is configured for Node.js deployment with the `@astrojs/node` adapter.

To deploy:

```bash
npm run build
node ./dist/server/entry.mjs
```

Or use any Node.js hosting platform (Vercel, Netlify, Railway, etc.)

## License

All rights reserved.
