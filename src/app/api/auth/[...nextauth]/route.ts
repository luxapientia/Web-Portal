import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userSchema, type User } from '@/schemas/auth.schema';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          // Make API call to your existing login endpoint
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            throw new Error('Login failed');
          }

          const data = await response.json();
          const user = userSchema.parse(data.user);
          
          // Return both user data and token
          return {
            ...user,
            token: data.token // NextAuth will store this in the JWT
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Store all user data and token in the JWT
        token.user = user as User;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data and token to the session
      session.user = token.user as User;
      session.token = token.accessToken as string;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
