# Next.js patched-release upgrade plan

Status: PLAN ONLY. No dependency upgrade, merge, or Production deployment authorized by this document.
Base: Stage A2 merge 4bdfa81b98f0c088ed640fdd40f745a08c0c3255, production-continuity-20260801.
Checked: October 18, 2026.

## Target and evidence

Current lockfile resolves next and eslint-config-next 16.2.12. Target exact next 16.4.2 and matching eslint-config-next 16.4.2, the current stable npm release and GitHub Latest release checked today. Recheck the latest stable patched release before implementing; do not use a canary.

Official sources:
- https://nextjs.org/blog/nextjs-security-update-october-14-2026 — patched Active LTS 16.4.1; fixes two critical upstream issues and one high-severity issue.
- https://github.com/vercel/next.js/releases/tag/v16.4.2 — latest stable successor, released October 15.
- https://nextjs.org/blog/next-16-4 — release changes and compatibility review.

Baseline npm audit: 25 vulnerable packages, 1 critical / 18 high / 6 moderate / 0 low. Critical package next. GitHub Dependabot reports 56 open advisory alerts (3 critical / 26 high / 25 moderate / 2 low), a different unit and default-branch dependency inventory. Do not claim every alert is fixed by updating Next.js.

## Implementation scope for a later reviewed patch

1. Start from this Stage A2 base. Update only next and eslint-config-next to exact target versions in package.json and regenerate package-lock.json in a clean checkout. Review all transitive changes. No npm audit fix --force or broad dependency refresh.
2. Check target peer requirements against React/react-dom 19.2.4 and Clerk 7.5.17. Keep React and Clerk unchanged if compatible; report and seek approval for additional package changes if required. Preserve Node runtime and next.config.ts behavior. Do not enable Cache Components or new experimental features.
3. Verify resolved sharp is at least 0.35.5 as required by the October 14 advisory. Inspect duplicate copies, bundled dependencies, and new audit output; report residual findings. Do not suppress alerts.
4. Read installed Next.js guides and release notes. Check proxy.ts/Clerk middleware, App Router request APIs, static metadata, image optimization, and build compatibility. Make no authentication, billing, Prisma, environment, or application-copy changes without separate review.
5. Generate Prisma Client only if needed for compilation. Never run migrate deploy, migrate dev, db push, seed, or database writes.

## Preview test plan

- Use a separate implementation branch with Clerk Development and an isolated Neon Preview branch; compare endpoint IDs only, and verify it differs from Production ep-bitter-resonance-aws5nm16 before any write. Do not attach Production database to Preview.
- Run npm ci, lint, TypeScript and migration-free build (npx prisma generate && next build). Record existing versus newly introduced lint/type failures. Preview must be READY from the exact reviewed SHA; inspect logs for no migration execution or failure.
- Render desktop/mobile homepage and /blog, /terms, /privacy, /refunds, /support. Compare exact Stage A2 copy and metadata; /og.png stays 404; pilot CTAs remain mailto:getembur@gmail.com without sending mail.
- Verify checkout POST stays 403 with no Stripe session; /app/billing redirects to /#early-access. Test signed-out protected routes and authorized Development founder/client access; one existing Preview workspace opens read only. Do not create invitations or alter Clerk settings.
- Verify public intake page loads only; no test submissions, emails, SMS, paid AI calls, Stripe writes, or customer-record edits.
- Inspect Next.js/image runtime errors and browser console. Do not execute exploit payloads or destructive load tests. Re-audit dependencies and confirm Next.js critical advisories are resolved in the actual lockfile, not merely absent from a UI.
- Confirm diff contains only reviewed dependency changes and any separately approved compatibility edits. No Prisma/schema/migration/env/auth/billing changes.

## Release gate and rollback

This PR documents the plan only. An implementation PR needs its own review and explicit merge/deploy approval. Do not enable automatic security updates. Keep Dependabot alerts and secret-scanning push protection enabled.

Before a future release, record the then-current known-good Production deployment ID and row counts. Create a NEW target Production Git-source deployment from the approved merge SHA with a migration-free build command. Verify domain alias, READY state, metadata/copy, checkout403/no session, billing redirect, founder access, Stripe subscriptions and unchanged database counts. Roll back to the recorded deployment if required checks fail; report and stop before attempting fixes.
