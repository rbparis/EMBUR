# Hosted operations requirements

The checked-in Vercel schedule is deliberately daily so it remains deployable on Hobby. Continuous five-minute execution requires Vercel Pro or an authenticated external scheduler calling `/api/hosted-sales/dispatch`. Confirm that scheduler outside the repository; configuration alone is not proof that it runs. Vercel cron does not retry failures, so the application keeps durable retry, backoff, stale-run recovery, and dead-letter state.

Gmail is reported as `not_connected` unless OAuth client, secret, and refresh token are present, and only `configured_unverified` when they are. A production Gmail watcher must renew its watch daily (Google expires it within seven days), persist history IDs, and reconcile with `history.list` because push notifications can be delayed or dropped. This repository does not claim that watcher exists.

Readiness is available at `/api/health`. It returns 503 until the database responds and a hosted job has a fresh successful scheduler heartbeat. Provider fields expose configuration presence only and never secrets.
