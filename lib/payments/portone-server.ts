import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { products, teams, Team, session } from '@/lib/db/schema';
import {
  getTeamByCustomerId,
  getUser,
  updateTeamSubscription,
  getPriceById,
  createCheckoutSession,
  getProductById,
  getTeamById
} from '@/lib/db/queries';
import { BillingKeyInfo } from '@portone/server-sdk/payment/billingKey';
import { db } from '../db/drizzle';
import { eq } from 'drizzle-orm';
import { PayWithBillingKeyResponse } from '@portone/server-sdk/payment';
import { v4 as uuidv4 } from 'uuid';

export async function createPayMentsByBillingKey({
  team,   
  customerId,
  priceId,
  billingKey,
  paymentId
}: {
  team: Team;
  customerId: string;
  priceId: string;
  billingKey: string;
  paymentId: string;
}): Promise<[PayWithBillingKeyResponse, typeof session.$inferSelect]>{
  const price = await getPriceById(priceId);  

  if (!team) {
    throw new Error("Team not found");
  }

  if(!price.productId){
    throw new Error("Product not found");
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
              id: customerId,
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

      const data: PayWithBillingKeyResponse = await response.json();
      console.log(data);
      if(!response.ok){
        throw new Error("Payment failed");
      }

      const session = await createCheckoutSession(
        team.id,
        customerId,
        price.productId,
        priceId,
        paymentId,
        billingKey
      );

      return [data, session];
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
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
  teamId,
  customerId,
  priceId,
  billingKey,
  period,
  paymentId
}:{
  teamId: string,
  customerId: string,
  priceId: string,
  billingKey: string,
  period: number,
  paymentId: string
}): Promise<[CreateCheckoutScheduleResponse, typeof session.$inferSelect]>{
  const price = await getPriceById(priceId);
  const team = await getTeamById(Number(teamId));


  if(!price.productId){
    throw new Error("Product not found");
  }

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
          id: customerId,
          name: {
            full: team.name,
          }
        },
        amount: {
          total: Number(price.unitAmount) * 100,
        },
        currency: "KRW",
      },
      timeToPay: new Date(Date.now() + 1000 * 60 * 60 * 24 * period).toISOString(),
    }),
  });

    const data = await response.json();

    if(!response.ok){
      throw new Error("Failed to create checkout schedule");
    }

    const session = await createCheckoutSession(
      team.id,
      customerId,
      price.productId,
      priceId,
      paymentId,
      billingKey
    );  

    return [data, session];
  } catch (error) {
    console.error('Error creating checkout schedule:', error);
    throw error;
  }
}


/**
 * plan 결제 후 결제 정보 생성
 * 
 * 1. 결제 진행
 * 
 * 2-1. 만약 결제되면 checkout api로 redirect후 session 검증
 * 
 * 2-2. 만약 trial일 경우 team 정보 업데이트 후 session 생성, checkout api로 redirect
 */

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

  //만약 trial을 진행했다면 결제 진행 후 session 생성
  if(!user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  if(!shouldTrial){
    const paymentId = uuidv4();

    //결제 진행
    const [_, session] = await createPayMentsByBillingKey({
      team,
      customerId: user.id.toString(),
      priceId,
      billingKey,
      paymentId
    });

    redirect(`/api/portone/checkout?sessionId=${session.id}`)
  }

  //진행하지 않았다면 schedule 생성 후 team 정보 업데이트
  const period = price.trialPeriodDays || 14;
  const paymentId = uuidv4();
  const [_, session] = await createCheckoutSchedule({
    teamId: team.id.toString(),
    customerId: user.id.toString(),
    priceId,
    billingKey,
    period,
    paymentId
  });

  //team 정보 업데이트
  await db.update(teams).set({
    subscriptionStatus: 'trial',
    productId: product.id,
    planName: product.name,
    shouldTrial: false
  }).where(eq(teams.id, team.id));

  redirect(`/api/portone/checkout?sessionId=${session.id}&isTrial=true`);
}