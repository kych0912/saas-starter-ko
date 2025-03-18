import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middleware as userMiddleware } from './middleware/user';
import { middleware as lngMiddleware } from './middleware/lng';

export async function middleware(request: NextRequest) {
  const lngRes = await lngMiddleware(request);
  if( lngRes ){
    return lngRes;
  }

  const userRes = await userMiddleware(request);
  if( userRes ){
    return userRes;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};