import 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from '@/schemas/auth.schema';

declare module 'next-auth' {
  interface Session {
    user: User;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    accessToken: string;
  }
} 