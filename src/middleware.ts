import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Not logged in
  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/kyc")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const isOnboarded =
    token.user?.isBvnVerified && token.user?.primaryAccountLinked;

  // User NOT onboarded → force /kyc
  if (!isOnboarded && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/kyc", req.url));
  }

  // User IS onboarded → block access to /kyc
  if (isOnboarded && pathname.startsWith("/kyc")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/kyc/:path*"],
};
