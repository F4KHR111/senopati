import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware untuk proteksi rute server-side.
 * Memeriksa keberadaan cookie `senopati_session`.
 */
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("senopati_session")?.value;
  const { pathname } = request.nextUrl;

  // Jika mencoba masuk ke dashboard tapi belum login, redirect ke login
  if (pathname.startsWith("/dashboard") && !sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Jika sudah login tapi mencoba ke login page, redirect ke dashboard
  if (pathname === "/login" && sessionToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Terapkan middleware hanya pada rute dashboard dan login
 */
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
