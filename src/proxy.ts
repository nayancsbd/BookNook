import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/books/add" || pathname.startsWith("/books/add/")) {
    return NextResponse.redirect(new URL("/add-book", request.url));
  }
  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return NextResponse.redirect(new URL("/my-profile", request.url));
  }

  const isProtected =
    pathname === "/add-book" ||
    pathname.startsWith("/add-book/") ||
    pathname === "/my-books" ||
    pathname.startsWith("/my-books/") ||
    pathname === "/my-borrows" ||
    pathname.startsWith("/my-borrows/") ||
    pathname === "/my-profile" ||
    pathname.startsWith("/my-profile/") ||
    (pathname.startsWith("/books/") &&
      pathname !== "/books" &&
      pathname !== "/books/" &&
      !pathname.startsWith("/books/add"));

  if (isProtected) {
    const cookies = request.cookies.getAll();
    const hasSessionCookie = cookies.some(
      (c) =>
        c.name.includes("session_token") ||
        c.name.includes("session_data") ||
        c.name.includes("better-auth.session")
    );

    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-book/:path*",
    "/my-books/:path*",
    "/my-borrows/:path*",
    "/my-profile/:path*",
    "/books/:id+",
    "/profile/:path*",
  ],
};

export default proxy;
