/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

interface SetTokenCookieOptions {
  cookieStore: any;
  name: 'accessToken' | 'refreshToken';
  token: string;
}

/**
 * Secure cookies only work on HTTPS. NODE_ENV=production on http://IP causes
 * browsers to drop Set-Cookie, which breaks auth after login.
 *
 * Opt in with COOKIE_SECURE=true or NEXT_PUBLIC_APP_URL=https://...
 */
const shouldUseSecureCookies = (): boolean => {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  return "https://api.mycdlclass.com/api/v1"?.startsWith('https://') === true;
};

export const setTokenCookie = (options: SetTokenCookieOptions): void => {
  const { cookieStore, name, token } = options;

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    if (!exp) return;

    const maxAge = Math.max(0, exp - Math.floor(Date.now() / 1000));
    const secure = shouldUseSecureCookies();

    const cookieConfig: Partial<ResponseCookie> = {
      httpOnly: true,
      // First-party Next.js cookies — lax is correct; none is only for cross-site.
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge,
    };

    cookieStore.set(name, token, cookieConfig);
  } catch (error) {
    console.error(`Error setting cookie [${name}]:`, error);
  }
};
