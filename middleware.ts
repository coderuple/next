import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "*");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
