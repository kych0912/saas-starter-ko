import { auth } from '@/auth';
import { Session } from 'next-auth';
import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { CustomMiddleware } from './chain';
const protectedRoutes = 'dashboard';

export function withAuthMiddleware(middleware:CustomMiddleware){
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const session = await auth();

    const { pathname } = request.nextUrl;
    const isProtectedRoute = pathname.split('/').some(value => value === protectedRoutes);
    const isAuthenticated = !!session;

    if (!isAuthenticated && isProtectedRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    
    return middleware(request,event,response);
  }
}
