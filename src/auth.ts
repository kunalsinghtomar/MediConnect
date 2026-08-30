import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// This file is the main login setup for the app.
// It tells NextAuth: use Google login, keep user session, and remember the saved role.
// Simple idea: when user signs in, we check their email in the database and know if they are patient or doctor.

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // This runs after Google login. We send the user to role-selection by default.
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/`) {
        // After login, we always ask the user to choose patient or doctor.
        return `${baseUrl}/role-selection`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },

    // This saves user info in the token. We use the token to remember the user between pages.
    async jwt({ token, user }) {
      if (user?.email) {
        token.id = user.id;
        token.email = user.email;

        // Find the saved role from the database for this Google account.
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { role: true },
        });

        token.role = dbUser?.role ?? null;
      }

      // If the role is still empty, check again using the email.
      if (!token.role && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true },
        });

        token.role = dbUser?.role ?? null;
      }

      return token;
    },

    // This sends the role to the frontend session.
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role ?? null;
      }
      return session;
    },
  },
};

// This small helper is used by server pages and APIs to get the current login user.
export async function auth() {
  return getServerSession(authOptions);
}
