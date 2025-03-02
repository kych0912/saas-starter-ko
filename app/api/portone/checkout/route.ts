import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser, insertBillingKey, getProductById } from '@/lib/db/queries';
import { createPayMentsByBillingKey } from '@/lib/payments/portone-server';
import { db } from '@/lib/db/drizzle';
import { teams, session } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

//webhook verify를 위한 session 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if(!sessionId){
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  const _session = await db.select().from(session).where(eq(session.id, Number(sessionId)));
  
  if (!_session) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  const user = await getUser();

  if(!user){
      return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  const team = await getTeamForUser(user.id);
  
  if (!team) {
    return NextResponse.redirect(new URL('/pricing?error=no_team', request.url));
  }

  const scheduleId = _session[0].scheduleId;
  const productId = _session[0].productId;
  const priceId = _session[0].priceId;

  if(!scheduleId || !productId || !priceId){
    return NextResponse.redirect(new URL('/pricing?error=no_scheduleId', request.url));
  }

  return NextResponse.redirect(new URL(`/dashboard`, request.url));
}
