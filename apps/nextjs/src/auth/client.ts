"use client";

let tokenCache: string | null = null;

export const authClient = {
  getToken: () => tokenCache,
  setToken: (token: string) => {
    tokenCache = token;
    document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`;
    return Promise.resolve();
  },
  clearToken: () => {
    tokenCache = null;
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return Promise.resolve();
  },
};
