import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // =========================
  // POS
  // =========================

  if (pathname.startsWith("/pos")) {
    if (!session && pathname !== "/pos/login") {
      return NextResponse.redirect(new URL("/pos/login", request.url));
    }

    if (session && pathname === "/pos/login") {
      return NextResponse.redirect(new URL("/pos/dashboard", request.url));
    }
  }

  // =========================
  // ADMIN WEBSITE
  // =========================

  if (pathname.startsWith("/admin")) {
    if (!session && pathname !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (session && pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/pos/:path*",
    "/admin/:path*",
  ],
};