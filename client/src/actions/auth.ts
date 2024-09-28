"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

export const onSignIn = async (payload: {
  email: string;
  password: string;
}) => {
  const cookieStore = cookies();

  const { data, error } = await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.AUTH_SERVICE}/api/auth/login`,
    data: payload,
  });

  cookieStore.set("access_token", data?.access_token);
  cookieStore.set("refresh_token", data?.refresh_token);

  return { data, error };
};

export const onSignUp = async (data: { email: string; password: string }) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.AUTH_SERVICE}/api/auth/register`,
    data,
  });
};

export const onAuthenticatedUser = async () => {
  const cookieStore = cookies();

  return await fetcher({
    url: `${config.BACKEND_URL.AUTH_SERVICE}/api/auth/me`,
    method: "GET",
  });
};

export const onSignInUser = async () => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/user/loggedInUser`,
    method: "GET",
  });
};
