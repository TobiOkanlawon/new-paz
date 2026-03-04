import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const res = await fetch(
          `${process.env.API_BASE_URL}/v1/users/user/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        );

        const data = await res.json();

        if (data.responseCode !== "00") {
          return null;
        }

        /*
          Transform backend shape into clean frontend shape.
          This prevents snake_case leaking into your app.
        */

        return {
          id: data.user.username, // required field
          email: data.user.email,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          roleId: data.user.role_id,
          isActive: data.user.is_active,
          isBvnVerified: data.user.is_bvn_verified,
          primaryAccountLinked: data.user.primary_account_linked,
          walletAccount: data.user.wallet_account,

          accessToken: data.token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
