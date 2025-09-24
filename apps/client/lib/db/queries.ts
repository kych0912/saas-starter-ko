import { desc, and, eq, isNull } from "drizzle-orm";
import { db } from "./drizzle";
import { activityLogs, Team, teamMembers, teams, users } from "./schema";
import { auth } from "@/auth";

export async function getUser() {
  const session = await auth();

  if (!session || !session.user.id) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, Number(session.user.id)), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function updateTeamSubscription({
  teamid,
  subscriptionStatus,
  stepPaySubscriptionId,
  planName,
  stepPayProductCode,
  stepPayPriceCode,
}: {
  teamid: number;
  subscriptionStatus: string | null;
  stepPaySubscriptionId: string | null;
  planName: string | null;
  stepPayProductCode: string | null;
  stepPayPriceCode: string | null;
  updatedAt: Date;
}) {
  await db
    .update(teams)
    .set({
      subscriptionStatus,
      stepPaySubscriptionId,
      planName,
      stepPayProductCode,
      stepPayPriceCode,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamid));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
      stepPayCustomerId: teams.stepPayCustomerId,
      role: teamMembers.role,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .leftJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
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
