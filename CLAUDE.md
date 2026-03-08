# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

S-P Movies is a Next.js 14 movie listing website with dark Netflix-style design. It allows users to browse movies and download from Telegram/Terabox links, with an admin panel for managing content.

## Common Commands

```bash
npm install      # Install dependencies including datasets library
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom Netflix-style dark theme
- **Database**: Hugging Face Datasets (configured in `lib/db.ts`)
- **Auth**: Cookie-based session with bcrypt password hashing

### Key Directories

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router pages and API routes |
| `app/page.tsx` | Home page - movie listing grid |
| `app/movies/[id]/page.tsx` | Movie detail page with download buttons |
| `app/admin/` | Admin dashboard and login pages |
| `app/api/` | REST API routes for movies and auth |
| `lib/` | Database and authentication utilities |
| `components/` | Reusable React components |

### API Routes

- `GET /api/movies` - List all movies
- `POST /api/movies` - Create movie (auth required)
- `GET /api/movies/[id]` - Get single movie
- `PUT /api/movies/[id]` - Update movie (auth required)
- `DELETE /api/movies/[id]` - Delete movie (auth required)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status

### Admin Credentials
- Username: `Satyaa`
- Password: `Satyaa1234`

## Hugging Face Dataset Configuration

The app uses Hugging Face Datasets as the database. To enable persistence:

1. Create a dataset on Hugging Face Hub (e.g., `your-username/sp-movies`)
2. Set these environment variables in Vercel:
   - `HF_REPO_ID` - Your dataset repository ID (e.g., `username/sp-movies`)
   - `HF_TOKEN` - Your Hugging Face access token (with write access)

Without these variables, the app uses sample data that won't persist between deployments.

## Deployment

The project is configured for Vercel deployment via `vercel.json`.

## Development Notes

- Movie IDs are generated using `Date.now()` - not sequential
- The database uses sample data by default (SAMPLE_MOVIES in lib/db.ts)
- Dark theme colors are defined in `tailwind.config.ts` under `netflix` color key
- Auth uses HTTP-only cookies with 24-hour expiry