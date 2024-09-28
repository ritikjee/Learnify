"use server";

import { cookies } from "next/headers";

export async function setAccessTokenCookie(newAccessToken: string) {
  const cookieStore = cookies();

  cookieStore.set("access_token", newAccessToken, {
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 60 * 15,
  });
}
