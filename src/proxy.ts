import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Redirect /pl/... → /... so Polish stays at canonical paths without prefix
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/pl/") || pathname === "/pl") {
    const newPath = pathname.slice(3) || "/"
    return NextResponse.redirect(new URL(newPath, request.url), { status: 301 })
  }
}

export const config = {
  matcher: ["/pl/:path*"],
}
