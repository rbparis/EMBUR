import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
  "/founder(.*)",
  "/api/agents(.*)",
  "/api/internal-agents(.*)",
  "/api/growth-agents(.*)",
  "/api/outreach(.*)",
  "/api/blog(.*)",
  "/api/metrics/founder(.*)",
  "/api/customers(.*)",
  "/api/conversations(.*)",
  "/api/demo/conversations(.*)",
  "/api/atlas(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    await auth.protect();
  }
}, {
  frontendApiProxy: {
    enabled: true,
    path: "/__clerk",
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
