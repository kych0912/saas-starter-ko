import { cookieName, fallbackLng, languages } from "@/app/i18n/setting"
import acceptLanguage from "accept-language"
import { NextRequest, NextResponse } from "next/server"

acceptLanguage.languages(languages);

export async function middleware(request: NextRequest) {

    // 언어 설정
    let lng
    if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName)?.value || fallbackLng )
    if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
    if (!lng) lng = fallbackLng

    // Redirect if lng in path is not supported
    if (
        !languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !request.nextUrl.pathname.startsWith('/_next')
    ) {
        console.log('redirecting to', `/${lng}${request.nextUrl.pathname}`);
        return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
    }
    
    if (request.headers.has('referer')) {
        const refererUrl = new URL(request.headers.get('referer') || '')
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
        const response = NextResponse.next()
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
        return null
    }

    return null;
}