# Reddit Clone

A full-stack Reddit-style community platform built with Next.js 16, Prisma, Supabase, Clerk, and Cloudinary.

## Live Demo

🚀 [https://your-app.vercel.app](https://your-app.vercel.app)

## Features

- Authentication (Sign up / Sign in / Sign out) via Clerk
- Create and browse communities (subreddits)
- Create posts — text, image, and link types
- Upvote / Downvote posts
- Like posts
- Comment on posts and delete your own comments
- Join / Leave communities
- Member count per community
- Search posts and communities
- Trending posts (last 7 days)
- Paginated home feed
- User profile page with posts and comments tabs
- Route protection for authenticated actions
- Image uploads via Cloudinary
- Delete your own posts and comments
- Responsive UI with loading skeletons and empty states
- Custom 404 page

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma 7 | ORM |
| PostgreSQL (Supabase) | Database |
| Clerk | Authentication |
| Cloudinary | Image uploads |

## Project Structure

```
reddit-clone/
├── app/
│   ├── (auth)/          # Sign in / Sign up pages
│   ├── (main)/          # Main app pages
│   │   ├── page.tsx     # Home feed
│   │   ├── communities/ # Community pages
│   │   ├── r/[slug]/    # Community + post detail
│   │   ├── search/      # Search results
│   │   ├── trending/    # Trending posts
│   │   ├── unauthorized/# Auth required page
│   │   └── u/[username] # User profile
│   ├── api/             # API routes
│   └── not-found.tsx    # Custom 404
├── components/          # Reusable UI components
├── lib/                 # Prisma client, auth helpers, cloudinary
├── prisma/              # Schema and seed data
└── public/              # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Clerk account
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/reddit-clone.git
cd reddit-clone
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 4. Set up the database

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Set up Clerk Webhook (for user sync)

Add webhook endpoint in Clerk Dashboard:
- URL: `https://your-domain.vercel.app/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`

## API Routes

| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/communities` | List / create communities |
| GET | `/api/communities/[slug]` | Get community by slug |
| POST | `/api/communities/[slug]/membership` | Join / leave community |
| GET/POST | `/api/posts` | List / create posts |
| DELETE | `/api/posts/[postId]` | Delete post |
| POST | `/api/posts/[postId]/vote` | Upvote / downvote |
| POST | `/api/posts/[postId]/like` | Like / unlike post |
| GET/POST/DELETE | `/api/posts/[postId]/comments` | Manage comments |
| POST | `/api/upload` | Upload image to Cloudinary |
| GET | `/api/feed` | Paginated home feed |
| GET | `/api/search` | Search posts and communities |
| POST | `/api/webhooks/clerk` | Clerk user sync webhook |

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Add all environment variables from `.env.example`
4. Deploy

### Update Clerk for production

In Clerk Dashboard → Domains → add your Vercel domain.

Update webhook URL to:
```
https://your-app.vercel.app/api/webhooks/clerk
```

## Database Schema

- `User` — Clerk-synced user accounts
- `Community` — Subreddit-like communities
- `Member` — Community memberships
- `Post` — Text, image, or link posts
- `Comment` — Nested comments on posts
- `Vote` — Upvotes and downvotes on posts
- `Like` — Likes on posts

## License

MIT
