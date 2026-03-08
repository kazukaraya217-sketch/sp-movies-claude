# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

S-P Movies is a Next.js 14 movie listing website with dark Netflix-style design. Users browse movies and download from Telegram/Terabox links. Admin panel at `/admin` allows managing content.

## Common Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with Netflix dark theme (#141414)
- **Database**: Hugging Face Hub via REST API (lib/db.ts)
- **Auth**: HTTP-only cookie sessions with bcrypt

### Key Pages
| Route | Purpose |
|-------|---------|
| `/` | Movie listing grid with hero section |
| `/movies/[id]` | Movie detail with download buttons |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login page |

### API Routes
- `GET/POST /api/movies` - List/Create movies
- `GET/PUT/DELETE /api/movies/[id]` - Single movie CRUD
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/check` - Auth status check

### Admin Credentials
- Username: `Satyaa`
- Password: `Satyaa1234`

## Hugging Face Integration

The app uses Hugging Face Hub REST API to store movies as a JSON file in a dataset repository.

**Required for persistence:**
1. Create a dataset on huggingface.co (e.g., `username/sp-movies`)
2. Add a `movies.json` file with an empty array: `[]`
3. Set Vercel env vars: `HF_REPO_ID` and `HF_TOKEN` (with Write permission)

**Without these**, the app uses in-memory sample data that resets on each deployment.

## Deployment

Configured for Vercel via `vercel.json`. The app runs as a serverless Next.js application.

## Development Notes

- Movie IDs use `Date.now()` (not sequential)
- In-memory cache per serverless function instance
- Dark theme colors in `tailwind.config.ts` under `netflix` key
- Auth cookie: 24-hour expiry, HTTP-only, secure in production