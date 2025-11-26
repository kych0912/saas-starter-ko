"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  User,
  users,
  teamMembers,
  activityLogs,
  type NewActivityLog,
  ActivityType,
  invitations,
} from "@/lib/db/schema";
import { comparePasswords, hashPassword } from "@/lib/auth/session";
import { redirect } from "next/navigation";

import { getUserWithTeam } from "@/lib/db/queries";
import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";
import {
  authenticateUser,
  signInUserInterface,
  signUpUserInterface,
  deleteCustomer,
} from "@/lib/auth/user-auth";
import { signOut } from "@/auth";
import { Resend } from "resend";
import TeamInviteEmail from "@/components/email/invite-team";
import app from "@/data/app";
import { teams } from "@/lib/db/schema";

export async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType,
  ipAddress?: string
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: ipAddress || "",
  };
  await db.insert(activityLogs).values(newActivity);
}

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const userResult = await signInUserInterface(email, password);
  if (!userResult.ok) {
    return userResult.error;
  }

  const user = userResult.value;

  //유저 인증
  await authenticateUser(user, password);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceCode = formData.get("priceCode") as string;
    const productCode = formData.get("productCode") as string;
    // return createCheckoutSession({ team: foundTeam, priceId });
  }

  redirect("/dashboard");
});

const signUpSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { username, email, password, inviteId } = data;

  const userResult = await signUpUserInterface({
    username,
    email,
    password,
    inviteId,
  });

  if (!userResult.ok) {
    return userResult.error;
  }

  const user = userResult.value;

  //유저 인증
  await authenticateUser(user, password);

  const redirectTo = formData.get("redirect") as string | null;
  if (redirectTo === "checkout") {
    const priceCode = formData.get("priceCode") as string;
    const productCode = formData.get("productCode") as string;
    // return createCheckoutSession({ team: createdTeam, priceId });
  }

  redirect("/dashboard");
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.passwordHash!
    );

    if (!isPasswordValid) {
      return { error: "password_incorrect" };
    }

    if (currentPassword === newPassword) {
      return {
        error: "new_password_must_be_different",
      };
    }

    const newPasswordHash = await hashPassword(newPassword);
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db
        .update(users)
        .set({ passwordHash: newPasswordHash })
        .where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_PASSWORD),
    ]);

    return { success: "password_updated" };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().optional(),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    let { password } = data;

    if (!password) {
      password = "oauth";
    }

    const isPasswordValid = await comparePasswords(
      password,
      user.passwordHash!
    );
    if (!isPasswordValid) {
      return { error: "delete_account_password_error" };
    }

    const userWithTeam = await getUserWithTeam(user.id);

    await logActivity(
      userWithTeam?.teamId,
      user.id,
      ActivityType.DELETE_ACCOUNT
    );

    // 오너일 경우에만 CustomerId 삭제
    if (userWithTeam?.stepPayCustomerId && userWithTeam.role === "owner") {
      const response = await deleteCustomer(userWithTeam.stepPayCustomerId);
      if (!response.ok) {
        return { error: response.error.error };
      }
    }

    // Soft delete
    await db
      .update(users)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // Ensure email uniqueness
      })
      .where(eq(users.id, user.id));

    if (userWithTeam?.teamId) {
      await db
        .delete(teamMembers)
        .where(
          and(
            eq(teamMembers.userId, user.id),
            eq(teamMembers.teamId, userWithTeam.teamId)
          )
        );
    }
    await signOut();
    redirect("/sign-in");
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    await Promise.all([
      db.update(users).set({ name, email }).where(eq(users.id, user.id)),
      logActivity(userWithTeam?.teamId, user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    return { success: "account_updated" };
  }
);

const removeTeamMemberSchema = z.object({
  memberId: z.number(),
});

export const removeTeamMember = validatedActionWithUser(
  removeTeamMemberSchema,
  async (data, _, user) => {
    const { memberId } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "User is not part of a team" };
    }

    await db
      .delete(teamMembers)
      .where(
        and(
          eq(teamMembers.id, memberId),
          eq(teamMembers.teamId, userWithTeam.teamId)
        )
      );

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.REMOVE_TEAM_MEMBER
    );

    return { success: "Team member removed successfully" };
  }
);

const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["member", "owner"]),
  lng: z.string().min(2).max(5).optional(),
});

export const inviteTeamMember = validatedActionWithUser(
  inviteTeamMemberSchema,
  async (data, _, user) => {
    const { email, role } = data;
    const userWithTeam = await getUserWithTeam(user.id);

    if (!userWithTeam?.teamId) {
      return { error: "user_not_in_team" };
    }

    const existingMember = await db
      .select()
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .where(
        and(eq(users.email, email), eq(teamMembers.teamId, userWithTeam.teamId))
      )
      .limit(1);

    if (existingMember.length > 0) {
      return { error: "already_member" };
    }

    // 만약 초대 대상이 이미 유저 테이블에 있으면 초대 생성 불가
    // TODO: 초대 대상이 여러 팀에 속할 수 있음
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: "user_already_exists" };
    }

    // Check if there's an existing invitation
    const existingInvitation = await db
      .select()
      .from(invitations)
      .where(
        and(
          eq(invitations.email, email),
          eq(invitations.teamId, userWithTeam.teamId),
          eq(invitations.status, "pending")
        )
      )
      .limit(1);

    if (existingInvitation.length > 0) {
      return { error: "invitation_exists" };
    }

    // Create a new invitation and get ID
    const [inv] = await db
      .insert(invitations)
      .values({
        teamId: userWithTeam.teamId,
        email,
        role,
        invitedBy: user.id,
        status: "pending",
      })
      .returning({ id: invitations.id });

    await logActivity(
      userWithTeam.teamId,
      user.id,
      ActivityType.INVITE_TEAM_MEMBER
    );

    // Send invitation email via Resend
    try {
      const lng = data.lng ?? "ko";
      const team = await db.query.teams.findFirst({
        where: eq(teams.id, userWithTeam.teamId),
      });

      if (!team) {
        return { error: "team_not_found" };
      }

      const invitationLink = `${app.url}/${lng}/sign-up?inviteId=${inv.id}`;
      const subject = `[${app.name}] You have been invited to join the ${
        team?.name ?? "your"
      } team`;

      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM ?? "onboarding@resend.dev";

      // TODO: 언어 처리, 현재 한국어만 지원
      // TODO: 7일 이후 초대 링크 만료
      const result = await resend.emails.send({
        from,
        to: email,
        subject,
        react: TeamInviteEmail({
          team: team,
          invitationLink,
          subject,
        }),
      });
      if (result.error) {
        return { error: "failed_to_send_invitation" };
      }
    } catch (e) {
      return { error: "failed_to_send_invitation" };
    }

    return { success: "success" };
  }
);
