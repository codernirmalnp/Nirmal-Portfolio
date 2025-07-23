import NextAuth, { type AuthOptions, type SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../lib/prisma';

// Try to load .env if DATABASE_URL is missing (for local/dev environments)
if (!process.env.DATABASE_URL) {
  try {
    // Dynamically import dotenv only if needed
    // @ts-ignore
    require('dotenv').config();
  } catch (e) {
    // Ignore if dotenv is not available
  }
}
// Validate required environment variable for Prisma
if (!process.env.DATABASE_URL) {
  throw new Error('Missing required environment variable: DATABASE_URL. Please set it in your .env file.');
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Use Prisma to find the user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
export { authOptions };
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };