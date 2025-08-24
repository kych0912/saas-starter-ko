"use client";

import { Button } from "@saas/ui";
import { ArrowRight, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useTranslation } from "@/app/i18n/useTranslation/client";

export function SubmitButton({ lng }: { lng: string }) {
  const { pending } = useFormStatus();
  const { t } = useTranslation(lng, "pricing", {});

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full flex items-center justify-center"
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          {t("loading")}
        </>
      ) : (
        <>
          {t("button")}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
