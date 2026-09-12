import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
export async function proxy(request: NextRequest) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  ) {
    return request.nextUrl.pathname.startsWith("/admin")
      ? NextResponse.redirect(new URL("/auth/login", request.url))
      : NextResponse.next();
  }
  return updateSession(request);
}
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/favorites", "/settings"],
};
