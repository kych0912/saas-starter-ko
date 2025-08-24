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
import { Trash2, Loader2 } from "lucide-react";
import { startTransition, useActionState, use } from "react";
import { deleteAccount } from "@/app/[lng]/(login)/actions";
import { useTranslation } from "@/app/i18n/useTranslation/client";
import { useParams } from "next/navigation";

type ActionState = {
  error?: string;
  success?: string;
};

export function DeleteAccountCard({
  isOauthPromise,
}: {
  isOauthPromise: Promise<boolean>;
}) {
  const isOauth = use(isOauthPromise);
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation(lng, "security", {});
  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAccount, { error: "", success: "" });

  const handleDeleteSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    startTransition(() => {
      deleteAction(new FormData(event.currentTarget));
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("card_title_delete")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {t("delete_account_warning")}
        </p>
        <form onSubmit={handleDeleteSubmit} className="space-y-4">
          <div>
            <Label htmlFor="delete-password">
              {t("delete_account_confirm")}
            </Label>
            <Input
              id="delete-password"
              name="password"
              type="password"
              placeholder={isOauth ? t("oauth_password") : ""}
              required
              minLength={isOauth ? 0 : 8}
              maxLength={100}
              disabled={isOauth}
            />
          </div>
          {deleteState.error && (
            <p className="text-red-500 text-sm">{t(deleteState.error)}</p>
          )}
          <Button
            type="submit"
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeletePending}
          >
            {isDeletePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete_account")}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
