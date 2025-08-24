"use client";

import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
} from "@saas/ui";
import { Lock, Loader2 } from "lucide-react";
import { startTransition, useActionState, use } from "react";
import { updatePassword } from "@/app/[lng]/(login)/actions";
import { useTranslation } from "@/app/i18n/useTranslation/client";
import { useParams } from "next/navigation";

type ActionState = {
  error?: string;
  success?: string;
};

export function UpdatePasswordCard({
  isOauthPromise,
}: {
  isOauthPromise: Promise<boolean>;
}) {
  const isOauth = use(isOauthPromise);
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, "security", {});
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    ActionState,
    FormData
  >(updatePassword, { error: "", success: "" });

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    // If you call the Server Action directly, it will automatically
    // reset the form. We don't want that here, because we want to keep the
    // client-side values in the inputs. So instead, we use an event handler
    // which calls the action. You must wrap direct calls with startTransition.
    // When you use the `action` prop it automatically handles that for you.
    // Another option here is to persist the values to local storage. I might
    // explore alternative options.
    startTransition(() => {
      passwordAction(new FormData(event.currentTarget));
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t("card_title_password")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <Label htmlFor="current-password">{t("current_password")}</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              placeholder={isOauth ? t("oauth_password") : ""}
              disabled={isOauth}
              required
              minLength={8}
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="new-password">{t("new_password")}</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={100}
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">
              {t("new_password_confirm")}
            </Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              maxLength={100}
            />
          </div>
          {passwordState.error && (
            <p className="text-red-500 text-sm">{t(passwordState.error)}</p>
          )}
          {passwordState.success && (
            <p className="text-green-500 text-sm">{t(passwordState.success)}</p>
          )}
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isPasswordPending}
          >
            {isPasswordPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t("update_password")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
