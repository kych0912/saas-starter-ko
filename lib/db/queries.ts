import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, billingKeys, prices, products, session, teamMembers, teams, users } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.customerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      teamMembers: {
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return result?.teamMembers[0]?.team || null;
}

export async function getProducts(){
  const result = await db.select({
    productId: products.id,
    productName: products.name,
    productDescription: products.description,
    productActive: products.active,
    priceId: prices.id,
    priceUnitAmount: prices.unitAmount,
    priceInterval: prices.interval,
    priceTrialPeriodDays: prices.trialPeriodDays,
  })
  .from(products)
  .innerJoin(prices, eq(products.id, prices.productId))
  .orderBy(prices.unitAmount);
  
  return result;
}

export async function insertBillingKey(teamId: number, key: string) {
  console.log('insertBillingKey', teamId, key);
  
  const teamBillingKeys = await db
  .select()
  .from(billingKeys)
  .where(eq(billingKeys.teamId, teamId));

  console.log(teamBillingKeys);

  if (teamBillingKeys.length > 0) {
    await db.update(billingKeys).set({
      key,
      updatedAt: new Date(),
    }).where(eq(billingKeys.teamId, teamId));
    return;
  }

  await db.insert(billingKeys).values({
    teamId,
    key,
  });
}

export async function getPriceById(priceId: string) {
  const result = await db.select().from(prices).where(eq(prices.id, priceId));
  return result[0];
}

export async function getProductById(productId: string) {
  const result = await db.select().from(products).where(eq(products.id, productId));
  return result[0];
}

export async function getTeamById(teamId: number) {
  const result = await db.select().from(teams).where(eq(teams.id, teamId));
  return result[0];
}

type billingKey = typeof billingKeys.$inferSelect;

export async function getBillingKeysByTeamId(teamId: number): Promise<billingKey[] | []> {
  const result = await db.select().from(billingKeys).where(eq(billingKeys.teamId, teamId));
  return result;
}

export async function createCheckoutSession(
  teamId: number, 
  customerId: string, 
  productId: string, 
  priceId: string,
  paymentId: string,
  billingKey: string
): Promise<typeof session.$inferSelect> {

  const _session = await db.insert(session).values({
    teamId,
    customerId,
    productId,
    priceId,
    paymentId,
    billingKey
  }).returning();

  return _session[0];
}

export async function getSessionById(sessionId: number) {
  const result = await db.select().from(session).where(eq(session.id, sessionId));
  return result[0];
}

