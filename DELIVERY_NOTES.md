# EMBUR v1.0 Stabilized Delivery

This delivery removes Clerk Organizations from the v1 runtime and uses one private EMBUR workspace per authenticated Clerk user.

## Included changes

- `/app` now uses the authenticated Clerk user directly.
- Signed-out visitors are sent explicitly to the local `/sign-in` route.
- The first authenticated owner is linked to the seeded EMBUR demo workspace when available.
- Later owners receive their own private workspace automatically.
- Every customer, conversation, Atlas, timeline, memory, action, and billing route is scoped through the authenticated user's business.
- Organization switching was removed from the UI.
- Stripe metadata now records the Clerk user ID rather than a Clerk organization ID.
- The obsolete organization-linking script was removed.
- PostgreSQL, Neon, Prisma, Clerk authentication, Atlas, Stripe billing, customers, conversations, and the dashboard remain intact.

## Deploy

From the project folder:

```powershell
npm install
npm run build
git add .
git commit -m "Stabilize EMBUR v1 user workspace"
git push origin main
```

Vercel will deploy the pushed commit automatically. A manual production deployment may also be run with:

```powershell
npx vercel --prod
```

No new environment variables and no database migration are required by this refactor.
