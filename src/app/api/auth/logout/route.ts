import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'purposefinderAuthToken';
    
    // Clear the auth cookie
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
    
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}

export async function GET() {
  // Allow GET requests for easy browser access
  return POST();
}
