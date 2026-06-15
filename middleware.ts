import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const visited = request.cookies.get("visited");

  if (!visited && request.nextUrl.pathname === "/") {
    const response = NextResponse.redirect(new URL("/welcome", request.url));

    response.cookies.set("visited", "true", {
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  }

  return NextResponse.next();
}
