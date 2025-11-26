import NextAuth, { Account } from "next-auth";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import {
  findUserTeam,
  signInUserInterface,
  signUpUserInterface,
} from "@/lib/auth/user-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_ID!,
      clientSecret: process.env.NAVER_SECRET!,
    }),
    Credentials({
      credentials: {
        name: { label: "Name", type: "text", optional: true },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

        try {
          const user = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              role: users.role,
            })
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1)
            .then((res) => res[0]);

          if (!user) throw new Error("No credentials provided");

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error(error);
          throw new Error("No credentials provided");
        }
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
    }: {
      user: User | AdapterUser;
      account: Account | null;
    }) {
      if (!account) return false;

      const { inviteId } = account;
      const provider = account.provider;
      const email = user.email;
      const password = `oauth`;
      const username = user.name;

      if (provider === "credentials") {
        return true;
      }

      if (!email || !username) return false;

      //유저 팀 찾기
      const userWithTeamResult = await findUserTeam(email);

      switch (userWithTeamResult.ok) {
        case true:
          const signInResult = await signInUserInterface(email, password);
          if (!signInResult.ok) {
            return false;
          }
          break;
        case false:
          const inviteIdParam =
            typeof inviteId === "string" ? inviteId : undefined;

          const signUpResult = await signUpUserInterface({
            username,
            email,
            password,
            inviteId: inviteIdParam,
          });

          if (!signUpResult.ok) {
            console.log(signUpResult.error);
            return false;
          }
          break;
      }

      return true;
    },
    async session({ session }) {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.email, session.user.email!),
      });

      if (dbUser) {
        session.user.id = dbUser.id.toString();
        session.user.role = dbUser.role;
      }

      return session;
    },
    authorized({ auth }) {
      return !!auth;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
});
