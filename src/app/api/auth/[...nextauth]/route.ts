import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { UserModel } from '@/models/User';
import jwt from 'jsonwebtoken';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: string;
      myInvitationCode: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    myInvitationCode: string;
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: string;
    myInvitationCode: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        accessToken: { label: "Access Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          console.log(credentials, 'credentials');
          // If accessToken is provided, verify it and return user
          if (credentials?.accessToken && credentials.email) {
            const user = await UserModel.findOne({ email: credentials.email });
            
            if (!user) {
              throw new Error('User not found');
            }

            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
              myInvitationCode: user.myInvitationCode,
            };
          }

          // Regular email/password authentication
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter an email and password');
          }

          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found');
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordMatch) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            myInvitationCode: user.myInvitationCode,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.myInvitationCode = user.myInvitationCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.myInvitationCode = token.myInvitationCode;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 