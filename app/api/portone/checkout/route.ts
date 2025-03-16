import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser, getProductById } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { teams, session } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

//webhook verify를 위한 session 확인
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');
  const isTrial = searchParams.get('isTrial') || false;

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

  const paymentId = _session[0].paymentId;
  const productId = _session[0].productId;
  const priceId = _session[0].priceId;
  const product = await getProductById(productId);

  if(!paymentId || !productId || !priceId){
    return NextResponse.redirect(new URL('/pricing?error=no_verify_session', request.url));
  }

  //team 정보 업데이트
  await db.update(teams).set({
    subscriptionStatus: isTrial === 'true' ? 'trial' : 'active',
    productId: productId,
    planName: product.name,
    shouldTrial: false,
  }).where(eq(teams.id, team.id));

  return NextResponse.redirect(new URL(`/dashboard`, request.url));
}
