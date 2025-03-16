import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db/drizzle';
import { eq } from 'drizzle-orm';
import { Team, User, Price, Product, teams } from '../../db/schema';
import { CheckoutResult } from '../types';
import { createCheckoutScheduleAndSession } from '../portone-server';

export async function processTrialSubscription(
  team: Team,
  user: User,
  price: Price,
  product: Product,
  billingKey: string
): Promise<CheckoutResult> {
  try {
    const period = price.trialPeriodDays || 14;
    const paymentId = uuidv4();
    
    const [_, session] = await createCheckoutScheduleAndSession({
      teamId: team.id.toString(),
      customerId: user.id.toString(),
      priceId: price.id,
      billingKey,
      period,
      paymentId
      });
        
      return { 
          session,
          redirectUrl: `/api/portone/checkout?sessionId=${session.id}&isTrial=true`
      };
  } catch (error) {
    console.error('체험판 처리 실패', { error, teamId: team.id, userId: user.id });
    throw new Error('trial_setup_failed');
  }
}