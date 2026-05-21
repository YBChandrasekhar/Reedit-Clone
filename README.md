# Reddit Clone

A full-stack Reddit-style community platform built with Next.js 16, Prisma, Supabase, Clerk, and Cloudinary.

## Features

- Authentication (Sign up / Sign in) via Clerk
- Create and browse communities (subreddits)
- Create posts — text, image, and link types
- Upvote / Downvote posts
- Like posts with ❤️
- Comment on posts and delete your own comments
- Join / Leave communities
- Search posts and communities
- Trending posts (last 7 days)
- User profile page
- Route protection for authenticated actions
- Image uploads via Cloudinary
- Responsive UI

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
| ngrok | Webhook tunneling (dev only) |

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
│   │   └── u/[username] # User profile
│   └── api/             # API routes
├── components/          # Reusable UI components
├── lib/                 # Prisma client, auth helpers
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
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

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

Run ngrok to expose localhost:

```bash
.\ngrok http 3000
```

Add webhook endpoint in Clerk Dashboard:
- URL: `https://your-ngrok-url.ngrok-free.dev/api/webhooks/clerk`
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
| POST | `/api/posts/[postId]/like` | Like / unlike |
| GET/POST/DELETE | `/api/posts/[postId]/comments` | Manage comments |
| POST | `/api/upload` | Upload image to Cloudinary |
| GET | `/api/feed` | Paginated home feed |
| GET | `/api/search` | Search posts and communities |
| POST | `/api/webhooks/clerk` | Clerk user sync webhook |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all environment variables from `.env`
4. Deploy

### Update Clerk for production

In Clerk Dashboard → Domains → add your Vercel domain.

Update webhook URL to your Vercel domain:
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
- `Like` — Heart likes on posts

## License

MIT
