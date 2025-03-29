import { cookieName, fallbackLng, languages } from "@/app/i18n/setting";
import acceptLanguage from "accept-language";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

acceptLanguage.languages(languages);

export function withLngMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {

    const res = response || NextResponse.next();

    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api')
    ) {
      return middleware(request, event, res);
    }

    // 언어 설정
    let lng;
    if (request.cookies.has(cookieName)) 
      lng = acceptLanguage.get(request.cookies.get(cookieName)?.value || fallbackLng);
    if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'));
    if (!lng) lng = fallbackLng;

    // Redirect if lng in path is not supported
    if (
      !languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !request.nextUrl.pathname.startsWith('/_next')
    ) {
      console.log('redirecting to', `/${lng}${request.nextUrl.pathname}${request.nextUrl.search}`);
      res.cookies.set(cookieName, lng);
      return NextResponse.redirect(
        new URL(`/${lng}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url)
      );
    }
    
    if (request.headers.has('referer')) {
      const refererUrl = new URL(request.headers.get('referer') || '');
      const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
      if (lngInReferer) {
        res.cookies.set(cookieName, lngInReferer);
      }
    }

    return middleware(request, event, res);
  };
}
