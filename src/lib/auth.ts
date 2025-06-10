import { SignJWT, jwtVerify } from 'jose';
import { config } from '@/config';
import { NextRequest } from 'next/server';

const secretKey = new TextEncoder().encode(config.auth.secret);

interface JWTPayloadData {
  userId: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export async function signJWT(payload: JWTPayloadData) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(config.auth.expiresIn)
      .sign(secretKey);
    return token;
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to sign JWT');
  }
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as JWTPayloadData;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}

export async function getTokenFromHeader(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export type { JWTPayloadData as JWTPayload }; 