"use server";

import { cookies } from "next/headers";

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
