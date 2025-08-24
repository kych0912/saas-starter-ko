"use client";
import { CookiesProvider } from "react-cookie";

export function ClientCookiesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
