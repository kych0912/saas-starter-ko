"use client";

import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@saas/ui";
import { Loader2, PlusCircle } from "lucide-react";
import { useActionState, use } from "react";
import { inviteTeamMember } from "@/app/[lng]/(login)/actions";
import { useTranslation } from "@/app/i18n/useTranslation/client";
import { useUser } from "@/lib/auth";

type ActionState = {
  error?: string;
  success?: string;
};

export function InviteTeamMember({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "team", {});
  const { userPromise } = useUser();
  const user = use(userPromise);
  const { t: tInviteResponse } = useTranslation(lng, "invite_response", {});
  const isOwner = user?.role === "owner";
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, { error: "", success: "" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <input type="hidden" name="lng" value={lng} />
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              required
              disabled={!isOwner}
            />
          </div>
          <div>
            <Label>{t("role")}</Label>
            <RadioGroup
              defaultValue="member"
              name="role"
              className="flex space-x-4"
              disabled={!isOwner}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">{t("member")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">{t("owner")}</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && (
            <p className="text-red-500">{tInviteResponse(inviteState.error)}</p>
          )}
          {inviteState?.success && (
            <p className="text-green-500">
              {tInviteResponse(inviteState.success)}
            </p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isInvitePending || !isOwner}
          >
            {isInvitePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("inviting")}
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("invite")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">{t("error")}</p>
        </CardFooter>
      )}
    </Card>
  );
}
