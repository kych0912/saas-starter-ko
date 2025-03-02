import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { products, Team } from '@/lib/db/schema';
import {
  getTeamByCustomerId,
  getUser,
  updateTeamSubscription,
  getPriceById,
  createCheckoutSession,
  getProductById
} from '@/lib/db/queries';
import { BillingKeyInfo } from '@portone/server-sdk/payment/billingKey';
import { db } from '../db/drizzle';
import { eq } from 'drizzle-orm';

export async function createPayMentsByBillingKey({
  team,   
  priceId,
  billingKey
}: {
  team: Team;
  priceId: string;
  billingKey: string;
}){
  const price = await getPriceById(priceId);
  const paymentId = `${Date.now()}-${team.id}-${price.id}`;

  if (!team) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  try {
      const response = await fetch(
        `https://api.portone.io/payments/${encodeURIComponent(paymentId)}/billing-key`,
        {
          method: "POST",
          headers: {
            Authorization: `PortOne ${process.env.PORTONE_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            billingKey,
            orderName: "월간 이용권 정기결제",
            customer: {
              id: team.id.toString(),
              email: "kyt031522@gmail.com",
              name: {
                full:team.name,
              }
            },
            amount: {
              total: Number(price.unitAmount) * 100,
            },
            currency: "KRW",
          }),
        },
      );

      console.log(await response.json());
      if(!response.ok){
        throw new Error("Payment failed");
      }
  } catch (error) {
    console.error('Error processing payment:', error);
    redirect(`/pricing?error=payment_failed`);
  }
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const team = await getTeamByCustomerId(customerId);

  if (!team) {
    console.error('Team not found for Stripe customer:', customerId);
    return;
  }

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.plan;
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: plan?.product as string,
      planName: (plan?.product as Stripe.Product).name,
      subscriptionStatus: status
    });
  } else if (status === 'canceled' || status === 'unpaid') {
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status
    });
  }
}

export async function getBillingKeyInfo(billingKey: string): Promise<
  BillingKeyInfo
  >{
  try {
    console.log(process.env.PORTONE_SECRET_KEY);
    const response = await fetch(`https://api.portone.io/billing-keys/${billingKey}`, {
      headers: {
        Authorization: `PortOne ${process.env.PORTONE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('빌링키 정보 조회 중 오류 발생:', error);
    throw error;
  }
}

export async function createPortOneCheckout({
  team,
  priceId
}: {
  team: Team;
  priceId: string;
}) {
  const user = await getUser();

  if (!team || !user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  redirect(`/checkout?teamId=${team.id}&priceId=${priceId}`)
}

interface CreateCheckoutScheduleResponse {
  schedule: {
    id: string;
  }
}

export async function createCheckoutSchedule({
  team,
  priceId,
  billingKey,
  period
}:{
  team: Team,
  priceId: string,
  billingKey: string,
  period: number
}): Promise<CreateCheckoutScheduleResponse>{
  const price = await getPriceById(priceId);
  const teamId = team.id.toString();
  const paymentId = `${Date.now()}-${team.id}-${price.id}`;

  try{
    const response = await fetch(`https://api.portone.io/payments/${encodeURIComponent(paymentId)}/schedule`,
    {
      method: "POST",
    headers: {
      Authorization: `PortOne ${process.env.PORTONE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payment: {
        billingKey: billingKey,
        orderName: "월간 이용권 정기결제",
        customer: {
          id: teamId,
          name: {
            full: team.name,
          }
        },
        amount: {
          total: Number(price.unitAmount) * 100,
        },
        currency: "USD",
      },
      timeToPay: new Date(Date.now() + 1000 * 60 * 60 * 24 * period).toISOString(),
    }),
  });

    const data = await response.json();
    console.log(data);
  if(!response.ok){
    throw new Error("Failed to create checkout schedule");
  }

    return data;
  } catch (error) {
    console.error('Error creating checkout schedule:', error);
    throw error;
  }
}


// create checkout and create schedule
// insert data to subscription table
// get subscription id 
export async function createCheckoutSubscription({
  team,
  priceId,
  billingKey
}:{
  team: Team;
  priceId: string;
  billingKey: string;
}){
  const price = await getPriceById(priceId);

  if(!price.productId){
    redirect(`/pricing?error=product_not_found`);
  }

  const product = await getProductById(price.productId);
  const shouldTrial = team.shouldTrial;
  const user = await getUser();

  //만약 trial을 진행했다면 결제 진행 후 schedule 생성

  if(!user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  if(!shouldTrial){
    const period = price.interval === 'month' ? 30 : 365;

    await createPayMentsByBillingKey({
      team,
      priceId,
      billingKey
    });

    const schedule = await createCheckoutSchedule({
      team,
      priceId,
      billingKey,
      period
    });

    const scheduleId = schedule.schedule.id;

    const session = await createCheckoutSession(
      team.id, 
      user.id.toString(), 
      scheduleId, 
      product.id, 
      priceId
    );
    redirect(`/api/portone/checkout?sessionId=${session.id}`)
  }

  //진행하지 않았다면 trial 기간 만료 후 결제 schedule 생성
  const period = price.trialPeriodDays || 14;
  const schedule = await createCheckoutSchedule({
    team,
    priceId,
    billingKey,
    period
  });

  const scheduleId = schedule.schedule.id;
  const session = await createCheckoutSession(
    team.id, 
    user.id.toString(), 
    scheduleId, 
    product.id, 
    priceId
  );

  redirect(`/api/portone/checkout?sessionId=${session.id}`)
}