import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middleware as userMiddleware } from './middleware/user';
import { middleware as lngMiddleware } from './middleware/lng';

export async function middleware(request: NextRequest) {
  // 기본 응답 객체 생성
  let response = NextResponse.next();
  
  // lngMiddleware 실행 및 결과 처리
  const lngRes = await lngMiddleware(request, response);
  if (lngRes) {
    response = lngRes;
  }

  // userMiddleware 실행 및 결과 처리
  const userRes = await userMiddleware(request, response);
  if (userRes) {
    response = userRes;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)',
  ],
};