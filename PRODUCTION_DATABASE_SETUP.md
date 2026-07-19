# EMBUR Production Database Setup

EMBUR now uses Neon PostgreSQL in both local development and production.

## 1. Get both Neon connection strings

In Neon, open **Connect** and copy:

- The **pooled** connection string for `DATABASE_URL`.
- The **direct/unpooled** connection string for `DIRECT_URL`.

Keep both values private.

## 2. Create `.env.local`

Copy `.env.example` to `.env.local`, then set:

```env
DATABASE_URL="YOUR_NEON_POOLED_CONNECTION_STRING"
DIRECT_URL="YOUR_NEON_DIRECT_CONNECTION_STRING"
APP_URL="http://localhost:3000"
```

Add your rotated Clerk and Stripe credentials. OpenAI is optional.

## 3. Install and create the production schema

Run from the EMBUR project root:

```powershell
npm.cmd install
npm.cmd run db:deploy
npm.cmd run db:seed
npm.cmd run build
npm.cmd run dev
```

`db:seed` creates the demo business and sample customers. Skip it if you want a completely empty production database.

## 4. Add variables to Vercel

Add these to **Production**, **Preview**, and **Development** unless you intentionally use separate databases:

- `DATABASE_URL` — pooled Neon URL
- `DIRECT_URL` — direct Neon URL
- `APP_URL` — use the Vercel deployment URL initially
- Clerk variables
- Stripe variables

Do not add an OpenAI key until you create a new private key with funded API quota.

## 5. Deploy

Push this project to GitHub. In Vercel, import the repository and click **Deploy** after all environment variables are present and the migration has succeeded.
