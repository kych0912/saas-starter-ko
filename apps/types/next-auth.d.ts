import NextAuth, { DefaultSession } from "next-auth"
import { User as DbUser } from "@/lib/db/schema"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"]
  }
} 