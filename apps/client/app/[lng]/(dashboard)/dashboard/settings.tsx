"use client";

import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@saas/ui";
import { useActionState } from "react";
import { TeamDataWithMembers, User } from "@/lib/db/schema";
import { removeTeamMember } from "@/app/[lng]/(login)/actions";
import { InviteTeamMember } from "./invite-team";
import { useTranslation } from "@/app/i18n/useTranslation/client";
import { createCustomPortalSessionAction } from "@/lib/payments/actions";

type ActionState = {
  error?: string;
  success?: string;
};

export function Settings({
  teamData,
  lng,
}: {
  teamData: TeamDataWithMembers;
  lng: string;
}) {
  const { t } = useTranslation(lng, "setting", {});
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(removeTeamMember, { error: "", success: "" });

  const getUserDisplayName = (user: Pick<User, "id" | "name" | "email">) => {
    return user.name || user.email || "Unknown User";
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">{t("title")}</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("subscription")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium">
                  {t("current_plan")}: {teamData.planName || t("free")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {teamData.subscriptionStatus === "ACTIVE"
                    ? t("monthly")
                    : teamData.subscriptionStatus === "trialing"
                    ? t("trial")
                    : t("no_subscription")}
                </p>
              </div>
              <form action={createCustomPortalSessionAction}>
                <Button type="submit" variant="outline">
                  {t("manage")}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("members")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {teamData.teamMembers.map((member, index) => (
              <li key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=32&width=32`}
                      alt={getUserDisplayName(member.user)}
                    />
                    <AvatarFallback>
                      {getUserDisplayName(member.user)
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {getUserDisplayName(member.user)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>
                {index > 1 ? (
                  <form action={removeAction}>
                    <input type="hidden" name="memberId" value={member.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      disabled={isRemovePending}
                    >
                      {isRemovePending ? t("removing") : t("remove")}
                    </Button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
          {removeState?.error && (
            <p className="text-red-500 mt-4">{removeState.error}</p>
          )}
        </CardContent>
      </Card>
      <InviteTeamMember lng={lng} />
    </section>
  );
}
