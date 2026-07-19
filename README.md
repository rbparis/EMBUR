# EMBUR

The operating system for local service businesses. EMBUR recovers opportunities, organizes customer work, and tells the owner what to do next.

## Local setup

```powershell
copy .env.example .env
npm.cmd ci
npx.cmd prisma generate
npx.cmd prisma migrate dev
npm.cmd run dev
```

Open `http://localhost:3000`.

## Verification

```powershell
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

## Product areas

- `/` — public website and time-return experience
- `/app` — authenticated EMBUR workspace
- `/app/billing` — subscription plans
- `/api/health` — production health check

## Architecture

- Next.js App Router
- React 19
- Clerk authentication and organizations
- Prisma data layer
- Stripe billing
- Atlas rules engine with optional OpenAI enhancement

See `docs/EMBUR_V1_RELEASE.md` for release scope and production requirements.
