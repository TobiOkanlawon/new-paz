import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  "dev-only-secret-change-me";

export async function middleware(req: NextRequest) {
  const isHttps = req.nextUrl.protocol === "https:";

  const token = await getToken({
    req,
    secret: authSecret,
    secureCookie: isHttps,
  });

  const { pathname } = req.nextUrl;

  // Not logged in
  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/kyc")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // Logged in user on landing page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isBvnVerified = !!token.user?.isBvnVerified;
  const hasPrimaryAccount = !!token.user?.primaryAccountLinked;
  const isOnboarded = isBvnVerified && hasPrimaryAccount;

  console.log("token", token)

  if (pathname.startsWith("/dashboard")) {
    if (!isBvnVerified) {
      return NextResponse.redirect(new URL("/kyc", req.url));
    }

    if (!hasPrimaryAccount) {
      return NextResponse.redirect(new URL("/kyc/add-account", req.url));
    }
  }

  if (pathname.startsWith("/kyc")) {
    if (isOnboarded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Only allow /kyc/add-account if BVN is verified
    if (pathname.startsWith("/kyc/add-account")) {
      if (!isBvnVerified) {
        return NextResponse.redirect(new URL("/kyc", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/kyc/:path*", "/"],
};
