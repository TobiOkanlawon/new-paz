import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      credentials: { password: { label: "password", type: "password" } },
    }),
  ],
});

export { handler as GET, handler as POST };
