import { AuthOptions } from 'next-auth';
import prisma from '@/prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username) return null;
        if (!credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username, password: credentials.password },
        });

        if (!user) return null;

        return {
          id: `${user.id}`,
          name: user.username,
        };
      },
    }),
  ],
};
