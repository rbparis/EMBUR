# EMBUR v1 Authentication Stabilization

EMBUR v1 uses Clerk user authentication with one workspace per owner account.

## Runtime flow

1. A visitor signs in with Clerk.
2. `/app` resolves the authenticated Clerk user.
3. EMBUR finds the local `User` record by `clerkUserId`.
4. On the first login, EMBUR links the seeded demo workspace when available; otherwise it creates a new private workspace.
5. Every protected API route scopes reads and writes to that user's business.

Clerk Organizations and organization switching are intentionally excluded from v1. They can be introduced later as a team/multi-location feature without blocking the MVP.
