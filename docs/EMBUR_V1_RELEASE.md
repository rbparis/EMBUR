# EMBUR v1.0

EMBUR v1.0 is the first cohesive release of the operating system for local service businesses.

## Core product

- Authenticated single-company workspace through Clerk user accounts
- Customer 360 records with contact details, service need, status, and opportunity value
- Customer creation, search, workflow updates, deletion, and direct call links
- Unified conversation history and outbound message queue records
- Operations pipeline from new lead through paid customer
- Atlas deterministic business intelligence with optional OpenAI enhancement
- Atlas executive brief, priority, forecast, recommendations, action queue, and timeline
- Business health, billing, memory, and settings surfaces
- Stripe checkout and webhook support
- Production health endpoint at `/api/health`

## Workflow

`new → waiting → contacted → follow_up → booked → completed → invoiced → paid`

Records can also be marked `lost`.

## Verification completed

- TypeScript: `npx tsc --noEmit`
- ESLint: zero errors

The production build could not be completed in the Linux packaging environment because the uploaded project contained Windows-specific native `node_modules`. Run `npm ci` on the deployment machine before `npm run build`.

## Required production services

- PostgreSQL or another production Prisma-supported database before multi-user launch
- Clerk production instance
- Stripe production products, prices, and webhook
- SMS/email provider for actual delivery; v1 currently queues and records outbound messages
- Optional OpenAI billing for natural-language Atlas output
