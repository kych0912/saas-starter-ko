"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Label } from "@saas/ui";
import { CircleIcon, Loader2 } from "lucide-react";
import { signIn, signUp } from "./actions";
import { ActionState } from "@/lib/auth/middleware";
import { useTranslation } from "@/app/i18n/useTranslation/client";
import { signIn as signInNextAuth } from "next-auth/react";

type ErrorKey = "AccessDenied" | "OAuthSignin" | "OAuthCallback";

const errorKeyMap: Record<ErrorKey, string> = {
  AccessDenied: "sign_in_failed",
  OAuthSignin: "sign_in_failed",
  OAuthCallback: "sign_in_failed",
};

export function Login({
  lng,
  mode = "signin",
}: {
  lng: string;
  mode?: "signin" | "signup";
}) {
  const searchParams = useSearchParams();
  const rawErrorQuery = searchParams.get("error");
  const errorQuery = rawErrorQuery
    ? errorKeyMap[rawErrorQuery as ErrorKey] ?? "invalid_email_or_password"
    : null;
  const redirect = searchParams.get("redirect");
  const priceCode = searchParams.get("priceCode");
  const productCode = searchParams.get("productCode");
  const inviteId = searchParams.get("inviteId");
  const { t } = useTranslation(lng, mode, {});
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === "signin" ? signIn : signUp,
    { error: "" }
  );

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CircleIcon className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          {mode === "signin" ? t("title") : t("title")}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" action={formAction}>
          <input type="hidden" name="redirect" value={redirect || ""} />
          <input type="hidden" name="priceCode" value={priceCode || ""} />
          <input type="hidden" name="productCode" value={productCode || ""} />
          <input type="hidden" name="inviteId" value={inviteId || ""} />

          {mode === "signup" && (
            <div>
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-muted-foreground"
              >
                {t("user")}
              </Label>
              <div className="mt-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  defaultValue={state.username}
                  required
                  maxLength={100}
                  className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-muted-foreground text-foreground focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your user name"
                />
              </div>
            </div>
          )}

          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              {t("email")}
            </Label>
            <div className="mt-1">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-muted-foreground text-foreground focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-muted-foreground"
            >
              {t("password")}
            </Label>
            <div className="mt-1">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="appearance-none rounded-full relative block w-full px-3 py-2 border border-gray-300 placeholder-muted-foreground text-foreground focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-500 text-sm">{t(`${state.error}`)}</div>
          )}

          {errorQuery && (
            <div className="text-red-500 text-sm">{t(errorQuery)}</div>
          )}

          <div>
            <Button
              type="submit"
              name="provider"
              value="credentials"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Loading...
                </>
              ) : mode === "signin" ? (
                t("submit")
              ) : (
                t("submit")
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex gap-2">
          <Button
            type="submit"
            name="provider"
            value="google"
            variant="outline"
            className="justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex w-full flex-row items-center gap-2"
            onClick={() =>
              signInNextAuth(
                "google",
                {
                  redirectTo: "/dashboard",
                  redirect: false,
                },
                {
                  inviteId,
                  productCode,
                  priceCode,
                }
              )
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09"
              ></path>
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23"
              ></path>
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"
              ></path>
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53"
              ></path>
              <path fill="none" d="M1 1h22v22H1z"></path>
            </svg>
            Google
          </Button>

          <Button
            type="submit"
            name="provider"
            value="facebook"
            variant="outline"
            className="justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex w-full flex-row items-center gap-2"
            onClick={() =>
              signInNextAuth(
                "naver",
                {
                  redirectTo: "/dashboard",
                  redirect: false,
                },
                {
                  inviteId,
                  productCode,
                  priceCode,
                }
              )
            }
          >
            <svg
              version="1.1"
              id="naver"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="50 54 100 92"
              width="20"
              height="20"
            >
              <polygon
                className="logo"
                fill="#1ec800"
                points="115.9,145.8 83.7,98.4 83.7,145.8 50,145.8 50,54.3 84.2,54.3 116.4,101.6 116.4,54.3 150,54.3 150,145.8 115.9,145.8"
              />
            </svg>
            NAVER
          </Button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-950">
                {mode === "signin" ? t("border") : t("border")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${
                mode === "signin" ? `/${lng}/sign-up` : `/${lng}/sign-in`
              }${redirect ? `?redirect=${redirect}` : ""}${
                priceCode ? `&priceCode=${priceCode}` : ""
              }`}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === "signin" ? t("login") : t("login")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
