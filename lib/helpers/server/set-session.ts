'use server';
import { envLoader } from '@/lib/utils/env-loader';
import { cookies } from 'next/headers';


export const setSession = async (value: string, expiry: number) => (await cookies()).set(envLoader.sessionHeader, value, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: expiry,
});
