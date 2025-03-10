import { v4 as uuidv4 } from 'uuid';
import { Team, User } from '../../db/schema';
import { CheckoutResult } from '../types';
import { createPayMentsByBillingKeyAndSession } from '../portone-server';

export async function processPayment(
  team: Team, 
  user: User, 
  priceId: string, 
  billingKey: string
): Promise<CheckoutResult> {
  try {
    const paymentId = uuidv4();
    
    const [_, session] = await createPayMentsByBillingKeyAndSession({
      team,
      customerId: user.id.toString(),
      priceId,
      billingKey,
      paymentId
    });
    
    if (!session?.id) {
      throw new Error('session_creation_failed');
    }
    
    return { 
      session,
      redirectUrl: `/api/portone/checkout?sessionId=${session.id}`
    };
  } catch (error) {
    console.error('결제 처리 실패', { error, teamId: team.id, userId: user.id });
    throw new Error('payment_failed');
  }
}