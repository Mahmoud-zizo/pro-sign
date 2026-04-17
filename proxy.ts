import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── middleware.ts ────────────────────────────────────────────────────────────
// Route groups (user) and (admin) don't affect URLs.
// User routes:  /dashboard, /book, /requests/[id]
// Admin routes: /admin, /admin/requests/[id]

const USER_ROUTES = ["/dashboard", "/book", "/requests"];
const ADMIN_ROUTES = ["/admin"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isUserRoute = USER_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (!isUserRoute && !isAdminRoute) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // ── Not authenticated ──────────────────────────────────────────────────────
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string | undefined;

  // ── Non-admin trying to access /admin ─────────────────────────────────────
  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ── Admin trying to access user routes ────────────────────────────────────
  if (isUserRoute && role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/book/:path*",
    "/requests/:path*",
    "/admin/:path*",
  ],
};
