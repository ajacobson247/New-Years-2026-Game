import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Simple Basic Auth gate for the admin page.
  // Set these in Vercel env vars.
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // If not configured, leave admin unprotected (useful for local dev).
  if (!user || !pass) {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");
  const expected = `Basic ${btoa(`${user}:${pass}`)}`;

  if (auth === expected) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
