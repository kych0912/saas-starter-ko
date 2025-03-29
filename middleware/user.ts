import { auth } from '@/auth';
import { Session } from 'next-auth';
import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { CustomMiddleware } from './chain';
const protectedRoutes = '/dashboard';

type NextAuthRequest = NextRequest & { auth: Session | null };

const authOptions = (request: NextAuthRequest): Response | void=>{
  const { auth: session, nextUrl } = request;
  const { pathname } = nextUrl;
  const isProtectedRoute = pathname.startsWith(protectedRoutes);
  const isAuthenticated = !!session;
  
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }    
}

export function withAuthMiddleware(middleware:CustomMiddleware){
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    auth(authOptions)
    
    return middleware(request,event,response);
  }
}
