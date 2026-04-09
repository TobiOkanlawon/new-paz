import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: TAuthUser;
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roleId: "1" | "2";
    isActive: boolean;
    isBvnVerified: boolean;
    primaryAccountLinked: boolean;
    walletAccount: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: TAuthUser;
  }
}

export {};
