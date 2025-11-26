import { db } from "@/lib/db/drizzle";
import {
  users,
  teams,
  teamMembers,
  ActivityType,
  NewUser,
  invitations,
  Invitation,
  NewTeam,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { comparePasswords, hashPassword } from "./session";
import { User, Team } from "@/lib/db/schema";
import { logActivity } from "@/app/[lng]/(login)/actions";
import { signIn } from "@/auth";

export interface AuthError {
  error: string;
  message: Record<string, any>;
}

// Result 타입 정의 (Either 패턴)
export type Result<T, E = AuthError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function logErrorResult<T, E extends AuthError>(
  result: Result<T, E>,
  context: string
): T | false {
  if (!result.ok) {
    console.error(`[${context}] error!:`, {
      errorCode: result.error.error,
      details: result.error.message,
    });
    return false;
  }
  return result.value;
}

// 유저 팀 찾기
export async function findUserTeam(
  email: string
): Promise<Result<{ user: User; team: Team }>> {
  try {
    const userWithTeam = await db
      .select({
        user: users,
        team: teams,
      })
      .from(users)
      .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
      .leftJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(users.email, email))
      .limit(1);

    if (userWithTeam.length === 0) {
      return {
        ok: false,
        error: {
          error: "team_not_found",
          message: { email },
        },
      };
    }

    const result = userWithTeam[0];

    if (!result.user || !result.team) {
      return {
        ok: false,
        error: {
          error: "invalid_email_or_password",
          message: { email },
        },
      };
    }

    return {
      ok: true,
      value: {
        user: result.user,
        team: result.team,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: {
        error: "user_team_not_found",
        message: { email },
      },
    };
  }
}

// 비밀번호 검증 함수
export async function validateUserPassword(
  user: User,
  password: string
): Promise<Result<boolean>> {
  const isPasswordValid = await comparePasswords(password, user.passwordHash!);

  if (!isPasswordValid) {
    return {
      ok: false,
      error: {
        error: "invalid_email_or_password",
        message: { email: user.email },
      },
    };
  }

  return { ok: true, value: true };
}

export async function authenticateUser(
  user: User,
  password: string
): Promise<void> {
  if (user.name) {
    await signIn("credentials", {
      name: user.name,
      email: user.email,
      password: password,
      redirect: false,
    });
  }

  await signIn("credentials", {
    email: user.email,
    password: password,
    redirect: false,
  });
}

export async function createUser({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}): Promise<Result<User>> {
  const passwordHash = await hashPassword(password);

  const newUser: NewUser = {
    name: username,
    email,
    passwordHash,
    role: "owner",
  };

  try {
    const [createdUser] = await db
      .insert(users)
      .values(newUser)
      .onConflictDoNothing({ target: users.email })
      .returning();

    return { ok: true, value: createdUser };
    // 유저 생성 실패
    // db 에러 처리
  } catch (err: any) {
    if (
      err?.code === "23505" ||
      (typeof err?.message === "string" &&
        err.message.includes("users_email_unique"))
    ) {
      return {
        ok: false,
        error: { error: "user_already_exists", message: { email } },
      };
    } else {
      return {
        ok: false,
        error: { error: "user_creation_failed", message: { email } },
      };
    }
  }
}

export async function findInvitation(
  inviteId: string,
  email: string
): Promise<Result<Invitation>> {
  const [invitation] = await db
    .select()
    .from(invitations)
    .where(
      and(
        eq(invitations.id, parseInt(inviteId)),
        eq(invitations.email, email),
        eq(invitations.status, "pending")
      )
    )
    .limit(1);

  if (!invitation) {
    return {
      ok: false,
      error: {
        error: "invalid_invitation",
        message: { detail: "Invalid or expired invitation." },
      },
    };
  }

  return { ok: true, value: invitation };
}

export async function acceptInvitation(
  invitationId: number
): Promise<Result<void>> {
  try {
    await db
      .update(invitations)
      .set({ status: "accepted" })
      .where(eq(invitations.id, invitationId));

    return { ok: true, value: undefined };
  } catch (error) {
    return {
      ok: false,
      error: {
        error: "invitation_update_failed",
        message: { detail: "Failed to update invitation status." },
      },
    };
  }
}

export async function createTeam(username: string): Promise<Result<Team>> {
  const newTeam: NewTeam = {
    name: `${username}'s Team`,
  };

  try {
    const [createdTeam] = await db.insert(teams).values(newTeam).returning();

    if (!createdTeam) {
      return {
        ok: false,
        error: {
          error: "team_creation_failed",
          message: { detail: "Failed to create team." },
        },
      };
    }

    return { ok: true, value: createdTeam };
  } catch (error) {
    return {
      ok: false,
      error: {
        error: "team_creation_failed",
        message: { detail: "Failed to create team. Database error." },
      },
    };
  }
}

export async function signInUserInterface(
  email: string,
  password: string
): Promise<Result<User>> {
  try {
    //유저 팀 찾기
    const userResult = await findUserTeam(email);

    if (!userResult.ok) {
      return {
        ok: false,
        error: userResult.error,
      };
    }

    const { user, team } = userResult.value;

    //비밀번호 검증
    const passwordResult = await validateUserPassword(user, password);

    if (!passwordResult.ok) {
      return {
        ok: false,
        error: passwordResult.error,
      };
    }

    await logActivity(team.id, user.id, ActivityType.SIGN_IN);

    return { ok: true, value: user };
  } catch (error) {
    return {
      ok: false,
      error: {
        error: "sign_in_failed",
        message: { detail: "Failed to sign in." },
      },
    };
  }
}

export async function signUpUserInterface({
  username,
  email,
  password,
  inviteId,
}: {
  username: string;
  email: string;
  password: string;
  inviteId: string | undefined;
}): Promise<Result<User>> {
  try {
    //유저 팀 찾기
    const userWithTeamResult = await findUserTeam(email);

    // 유저 팀이 있으면 에러
    if (userWithTeamResult.ok) {
      return {
        ok: false,
        error: {
          error: "team_not_found",
          message: { email },
        },
      };
    }

    //유저 생성
    const createdUser = await createUser({
      username,
      email,
      password,
    });

    if (!createdUser.ok) {
      return {
        ok: false,
        error: createdUser.error,
      };
    }

    const user = createdUser.value;

    let teamId: number;
    let userRole: string;
    let createdTeam: typeof teams.$inferSelect | null = null;

    if (inviteId) {
      // 유효한 초대가 있는지 확인
      const invitationResult = await findInvitation(inviteId, email);

      if (!invitationResult.ok) {
        return {
          ok: false,
          error: invitationResult.error,
        };
      }

      const invitation = invitationResult.value;

      // 초대가 있으면 초대 수락
      if (invitation) {
        teamId = invitation.teamId;
        userRole = invitation.role;

        await acceptInvitation(invitation.id);

        await logActivity(teamId, user.id, ActivityType.ACCEPT_INVITATION);

        [createdTeam] = await db
          .select()
          .from(teams)
          .where(eq(teams.id, teamId))
          .limit(1);
      } else {
        return {
          ok: false,
          error: {
            error: "invalid_or_expired_invitation",
            message: { email, password },
          },
        };
      }
    } else {
      // 초대가 없으면 새로운 팀 생성
      const createdTeamResult = await createTeam(username);

      if (!createdTeamResult.ok) {
        return {
          ok: false,
          error: createdTeamResult.error,
        };
      }

      createdTeam = createdTeamResult.value;

      teamId = createdTeam.id;
      userRole = "owner";

      await logActivity(teamId, user.id, ActivityType.CREATE_TEAM);
    }

    await Promise.all([
      db.insert(teamMembers).values({
        userId: user.id,
        teamId: teamId,
        role: userRole,
      }),
      logActivity(teamId, user.id, ActivityType.SIGN_UP),
    ]);

    return {
      ok: true,
      value: user,
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        error: "sign_up_failed",
        message: { detail: "Failed to sign up." },
      },
    };
  }
}

export async function deleteCustomer(customerId: string) {
  const response = await fetch(
    `https://api.steppay.kr/api/v1/customers/${customerId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        "Secret-Token": `${process.env.STEPPAY_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    switch (response.status) {
      case 404:
        return {
          ok: false,
          error: {
            error: "customer_not_found",
            message: "Customer not found",
          },
        };
      case 400:
        return {
          ok: false,
          error: {
            error: "customer_has_subscription",
            message: "Customer has subscription",
          },
        };
    }
  }

  const data = await response.json();
  return data;
}

export async function isOauthPassword(password: string): Promise<boolean> {
  const oauthPassword = "oauth";
  return comparePasswords(oauthPassword, password);
}
