import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT use supabase.auth.getSession() here! It relies
  // on a potentially spoofed cookie. getUser() talks to the server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect logic
  // Protect /dashboard
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect away from login if already authenticated
  if (
    user &&
    (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/onboarding")
  ) {
    // If the user goes to /onboarding but they are already authenticated, 
    // They should probably be seeing the actual onboarding questions or be redirected to dashboard if onboarding is done.
    // For now, if they just login, redirecting to /onboarding/step2 or /dashboard depends on logic we will implement later.
    // Let's keep it simple: if trying to login again while logged in, go to dashboard.
    if(request.nextUrl.pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it
  // has the set-cookie headers
  return supabaseResponse;
}
