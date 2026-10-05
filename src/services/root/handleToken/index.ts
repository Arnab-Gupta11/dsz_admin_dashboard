'use server';

import { setTokenCookie } from '@/utils/setTokenCookieOption';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

export const getNewToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const baseApi = "https://api.mycdlclass.com/api/v1" ;

  if (!refreshToken) return null;

  try {
    const res = await fetch(`${baseApi}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return null;
  }
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 - 60000 < Date.now();
  } catch {
    return true;
  }
};

type GetValidTokenOptions = {
  /** Skip the cached access token and rotate via refresh token (e.g. after 401). */
  forceRefresh?: boolean;
};

export const getValidToken = async (
  options?: GetValidTokenOptions,
): Promise<string | null> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value ?? null;

  if (
    !options?.forceRefresh &&
    accessToken &&
    !(await isTokenExpired(accessToken))
  ) {
    return accessToken;
  }

  const res = await getNewToken();
  const data = res?.data;

  if (!data?.accessToken) {
    return null;
  }

  setTokenCookie({
    cookieStore,
    name: 'accessToken',
    token: data.accessToken,
  });

  if (data.refreshToken) {
    setTokenCookie({
      cookieStore,
      name: 'refreshToken',
      token: data.refreshToken,
    });
  }

  return data.accessToken;
};
