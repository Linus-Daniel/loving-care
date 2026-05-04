# Loving Family Daycare

Production-oriented Next.js application for a Nigerian nursery school with a public website, parent portal, and admin dashboard.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Clerk authentication with role metadata
- Prisma ORM on Supabase PostgreSQL
- Sanity CMS for public content
- Stripe payments
- Resend + React Email
- UploadThing file uploads
- TanStack Query/Table, Zustand, Recharts, FullCalendar
- Vercel Analytics and PostHog

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.local.example .env.local
```

3. Fill required services in `.env.local`:

- `DATABASE_URL`, `DIRECT_URL`: Supabase PostgreSQL connection strings.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase project credentials.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`: Clerk auth and webhook credentials.
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`: Sanity CMS credentials.
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`: Stripe payment credentials.
- `RESEND_API_KEY`: email sending.
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`: analytics.
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID`: file uploads.
- `NEXT_PUBLIC_APP_URL`: deployed site origin.

4. Generate Prisma client and migrate:

```bash
npx prisma generate
npx prisma migrate dev
```

The `SiteSetting` model is used for persisted site, SEO, and social settings.

5. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Auth Roles

Clerk is the source of active session identity. The application reads role from Clerk public metadata:

```json
{ "role": "PARENT" }
```

Supported values are `PARENT`, `STAFF`, `ADMIN`, and `SUPER_ADMIN`.

The database `User.role` should stay in sync with Clerk metadata. Admin role changes through the dashboard update both Prisma and Clerk metadata.

## Webhooks

Configure these webhook endpoints:

- Clerk: `/api/webhooks/clerk`
- Stripe: `/api/webhooks/stripe`

Use the matching secrets in `.env.local`.

## Realtime Messaging

Parent and admin inboxes use Supabase Realtime subscriptions for the Prisma `Message` table while keeping all message creation behind the Clerk-protected `/api/messages` route.

In Supabase, enable Realtime for the `Message` table in the `public` schema. If row-level security is enabled, add policies that let parents receive rows where their Prisma user id matches `senderId` or `receiverId`, and let staff/admin roles receive assigned inbox rows. The app refreshes TanStack Query caches when realtime INSERT, UPDATE, or DELETE events arrive.

## CMS

Sanity schemas live in `sanity/schemas`. Public content APIs read from Sanity:

- `/api/public/home`
- `/api/public/programs`
- `/api/public/gallery`
- `/api/public/faq`

## Verification

Run type checking:

```bash
npx tsc --noEmit
```

Run production build:

```bash
npm run build
```

## Deployment

Deploy on Vercel with the environment variables from `.env.local.example`.

Recommended pre-deploy steps:

```bash
npx prisma generate
npm run build
```

Apply database migrations to Supabase before routing production traffic.
