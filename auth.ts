import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || user.role !== "ADMIN" || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ── Credentials sign-in ──────────────────────────────────────────────
      if (user && account?.provider === "credentials") {
        token.id = user.id!;
        token.role = (user as { role?: string }).role ?? "USER";
        token.defaultRedirect =
          token.role === "ADMIN" ? "/admin" : "/dashboard";
        return token;
      }

      // ── Google sign-in ───────────────────────────────────────────────────
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email as string;
        const name = (profile.name as string | undefined) ?? null;
        const image = (profile.picture as string | undefined) ?? null;
        const providerAccountId = account.providerAccountId as string;

        try {
          // 1. Find or create User
          let dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: { email, name, image, role: "USER" },
            });
          } else if (!dbUser.image && image) {
            // Update image if missing
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: { image },
            });
          }

          // 2. Find or create Account — use where clause directly, not compound key accessor
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: "google",
              providerAccountId: providerAccountId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: "oauth",
                provider: "google",
                providerAccountId: providerAccountId,
                access_token: (account.access_token as string) ?? null,
                refresh_token: (account.refresh_token as string) ?? null,
                expires_at: (account.expires_at as number) ?? null,
                token_type: (account.token_type as string) ?? null,
                scope: (account.scope as string) ?? null,
                id_token: (account.id_token as string) ?? null,
              },
            });
          }

          token.id = dbUser.id;
          token.role = dbUser.role;
        } catch (err) {
          console.error("[auth] jwt callback error:", err);
          // Return token without id/role rather than crashing —
          // session callback will handle the missing fields gracefully
        }

        return token;
      }

      // ── Subsequent requests ───────────────────────────────────────────────
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/login",
  },
});
