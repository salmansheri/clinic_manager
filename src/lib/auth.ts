import argon from "argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        type: { label: "User Type", type: "text" },
      },

      authorize: async (credentials) => {
        if (
          !credentials.email ||
          !credentials?.password ||
          !credentials?.type
        ) {
          throw new Error("Missing Credentials");
        }

        let user;

        let userType = credentials?.type;

        try {
          switch (userType) {
            case "DOCTOR":
              user = await prisma.doctor.findUnique({
                where: {
                  email: credentials?.email as string,
                },
              });
              break;

            case "PATIENT":
              user = await prisma.patient.findUnique({
                where: {
                  email: credentials.email as string,
                },
              });

              break;

            case "RECEPTIONIST":
              user = await prisma.receptionist.findUnique({
                where: {
                  email: credentials.email as string,
                },
              });

              break;
            default:
              throw new Error("Invalid User Type");
          }

          if (!user || !user.email) {
            throw new Error("User not found");
          }

          const isCorrectPassword = await argon.verify(
            user.password,
            credentials.password as string
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid Password");
          }

          return { ...user, type: userType };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.type = user?.type;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.type = token.type;
      }

      return session;
    },
  },
});
