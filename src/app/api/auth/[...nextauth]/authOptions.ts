import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiFetch } from "@/libs/api";
import { BackendError } from "@/libs/errors";

const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
    "dev-only-secret-change-me";

export const authOptions: NextAuthOptions = {
  secret: authSecret,
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
        let data: TLoginResponse;
        try {
          data = await apiFetch<any>("/v1/users/user/login", {
            method: "POST",
            isProtected: false,
            body: {
              email: credentials?.email,
              password: credentials?.password,
            },
          });
        } catch (e) {
          if (e instanceof BackendError) {
            // so, if the problem is that the user's email is not verified, then we will throw a redirect to the email verification page.

            if (e.message === "email not verified") {
              throw new Error("EMAIL_NOT_VERIFIED");
            } else if (e.message === "phone number not verified") {
              throw new Error("PHONE_NOT_VERIFIED");
            }

            // Any other backend-reported error (wrong credentials, locked
            // account, etc.) — surface the real message instead of masking
            // it. NextAuth passes thrown error.message straight through to
            // signIn()'s result.error on the client (see
            // node_modules/next-auth/core/routes/callback.js), so this is
            // safe to read back verbatim in LoginForm.
            throw new Error(`BACKEND_ERROR:${e.message}`);
          }

          // Not a BackendError means the request to the backend itself
          // failed (network error, timeout, DNS failure, non-JSON response,
          // etc.) rather than the backend rejecting the credentials — don't
          // let this collapse into "Invalid email or password".
          throw new Error("NETWORK_ERROR");
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
    async jwt({ token, trigger, user, session }) {
      if (trigger == "update") {
        if (token.user) {
          if (session?.isBvnVerified) {
            token.user.isBvnVerified = session.isBvnVerified;
          }

          if (session?.primaryAccountLinked) {
            token.user.primaryAccountLinked = session.primaryAccountLinked;
          }
        }
      }
      if (user) {
        token.accessToken = user.accessToken;
        token.user = user;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

