import { NextRequest, NextResponse } from 'next/server';
import { getUser, getTeamForUser } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { teams } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getOrder } from '@/lib/payments/steppay/steppay';
import { OrderType, SubscriptionStatus } from '@/lib/payments/types/Order';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('order_id');
  const orderCode = searchParams.get('order_code');
  const status = searchParams.get('status');

  if(!orderId || !orderCode || !status){
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  if(!(status === 'success')){
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', request.url));
  }

  try{
    const user = await getUser();

    if(!user){
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  
    const team = await getTeamForUser(user.id);
    
    if (!team) {
      return NextResponse.redirect(new URL('/pricing?error=no_team', request.url));
    }

    const order = await getOrder(orderCode);

    if(!order.subscriptions){
      return NextResponse.redirect(new URL('/pricing?error=no_subscription', request.url));
    }

    const subscription = order.subscriptions[0];

    if(subscription.status !== SubscriptionStatus.ACTIVE){
      return NextResponse.redirect(new URL('/pricing?error=subscription_not_active', request.url));
    }

    const item = subscription.items[0];

    const subscriptionStatus = subscription.status;
    const subscriptionId = subscription.id;
    const planName = item.plan.name;
    const productCode = item.productCode;
    const priceCode = item.priceCode;

    await db.update(teams).set({
      subscriptionStatus,
      stepPaySubscriptionId: subscriptionId.toString(),
      planName,
      stepPayProductCode: productCode,
      stepPayPriceCode: priceCode,
      updatedAt: new Date(),
    }).where(eq(teams.id, team.id));
      
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL('/pricing?error=payment_failed', request.url));
  }
}
