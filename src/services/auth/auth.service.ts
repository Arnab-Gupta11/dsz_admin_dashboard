'use server';

import { TLoginUser, TUserRole } from '@/types/userRole.types';
import { setTokenCookie } from '@/utils/setTokenCookieOption';
import { cookies } from 'next/headers';

// Get Current User Role
export type CurrentUserRole = {
  role: TUserRole;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCurrentUserRole = async (): Promise<any> => {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      return { role: user.role } as CurrentUserRole;
    } catch (err) {
      console.error('Error parsing user cookie:', err);
      return null;
    }
  }

  return null;
};

//Logout user
export const logoutUser = async () => {
  const cookiesStore = await cookies();
  cookiesStore.delete('accessToken');
  cookiesStore.delete('refreshToken');
  cookiesStore.delete('user');
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies();
  setTokenCookie({
    cookieStore,
    name: 'accessToken',
    token: accessToken,
  });
  setTokenCookie({
    cookieStore,
    name: 'refreshToken',
    token: refreshToken,
  });
};

export const setUserProfile = async (user: TLoginUser) => {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user));
};

export const setAccessToken = async (accessToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken);
};
export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  return accessToken || null;
};

export const updateUserProfile = async (user: TLoginUser) => {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user));
};
