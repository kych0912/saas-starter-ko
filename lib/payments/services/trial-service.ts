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
    
    // 트랜잭션으로 원자성 보장장
    return await db.transaction(async (tx) => {
        // TODO: 해당 함수는 PortOne API로 보상 트랜잭션 필요....
        // 이부분은 공부 필요 (Saga 패턴?)
        const [_, session] = await createCheckoutScheduleAndSession({
        teamId: team.id.toString(),
        customerId: user.id.toString(),
        priceId: price.id,
        billingKey,
        period,
        paymentId
        });
        
        if (!session?.id) {
        throw new Error('session_creation_failed');
        }
        
        // 팀 정보 업데이트
        await tx.update(teams).set({
        subscriptionStatus: 'trial',
        productId: product.id,
        planName: product.name,
        shouldTrial: false,
        }).where(eq(teams.id, team.id));
        
        return { 
            session,
            redirectUrl: `/api/portone/checkout?sessionId=${session.id}&isTrial=true`
        };
    });
  } catch (error) {
    console.error('체험판 처리 실패', { error, teamId: team.id, userId: user.id });
    throw new Error('trial_setup_failed');
  }
}