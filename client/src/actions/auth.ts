"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

export const onAuthenticatedUser = async () => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return await fetcher({
    url: `${config.BACKEND_URL.AUTH_SERVICE}/api/auth/me`,
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onSignInUser = async () => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/user/loggedInUser`,
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });
};
