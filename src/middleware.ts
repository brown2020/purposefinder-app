import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = ['/introduction', '/purpose', '/moonshot', '/profile'];

// Public routes that should redirect to home if authenticated
const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the auth token from cookies using the correct cookie name
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'purposefinderAuthToken';
  const authToken = request.cookies.get(cookieName)?.value;
  
  const isAuthenticated = !!authToken;
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect authenticated users away from login page to home
  if (isPublicRoute && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }
  
  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
