import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthPath = ["/sign-up", "/sign-in", "/verify"].some((path) =>
    url.pathname.startsWith(path)
  );

  // If the user is authenticated and trying to access auth pages, redirect to dashboard
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is unauthenticated and trying to access protected routes, redirect to sign-in
  const isProtectedPath = ["/dashboard", "/dashboard/:path*"].some((path) =>
    url.pathname.startsWith(path)
  );

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

// Apply middleware to the specified routes
export const config = {
  matcher: ["/sign-in", "/sign-up", "/verify", "/dashboard/:path*"],
};
