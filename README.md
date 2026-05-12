# CodeSnap - Beautiful Code Snippet Manager

> Save, organize, and share your code snippets with stunning visuals.

![Status Badge](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)

![CodeSnap Mockup](documentation/mockup.png)

## Overview

**CodeSnap** is a modern web application that lets developers save, organize, and share code snippets with beautiful syntax-highlighted screenshots. Think of it as a personal snippet library that generates social media-ready code images.

## Features

- **50+ Syntax Themes** — Dracula, Monokai, GitHub, Nord, Tokyo Night, and more
- **Export as Images** — Generate beautiful PNG screenshots in 1x, 2x, and 3x resolutions
- **Tag-Based Organization** — Organize snippets with custom tags
- **Full-Text Search** — Search across titles, code, and descriptions via PostgreSQL
- **Private by Default** — Snippets are private unless explicitly shared
- **Public Sharing** — Generate shareable links for any snippet
- **Window Mockups** — macOS, Windows, or minimal styles
- **Custom Backgrounds** — Solid colors, gradients, or transparent
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Category                | Technology                    |
| ----------------------- | ----------------------------- |
| **Framework**           | Next.js 14 (App Router)       |
| **Language**            | TypeScript                    |
| **Database**            | Supabase (PostgreSQL)         |
| **Authentication**      | Supabase Auth (GitHub/Google) |
| **Styling**             | Tailwind CSS                  |
| **UI Components**       | shadcn/ui                     |
| **Syntax Highlighting** | Shiki (VS Code engine)        |
| **Image Generation**    | html-to-image                 |
| **Deployment**          | Vercel                        |

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier)

### Local Development

```bash
git clone https://github.com/yourusername/codesnap.git
cd codesnap
npm install
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema from `supabase/schema.sql` in the Supabase SQL Editor
3. Enable GitHub and/or Google OAuth under **Authentication → Providers**
4. Copy your project URL and anon key into `.env.local`

**Test Credentials** (for local development):

- Email: `test@example.com`
- Password: `password123`

## Deployment

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy — done in ~2 minutes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a Pull Request

## License

MIT License — free to use for personal or commercial projects.

## Acknowledgments

Inspired by [Carbon](https://carbon.now.sh), [Ray.so](https://ray.so), and [Snappify](https://snappify.com).
