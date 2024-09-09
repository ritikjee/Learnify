"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

export const onGetStripeClientSecret = async () => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/client-secret`,
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onCreateNewGroupSubscription = async (
  groupid: string,
  price: string
) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/create-subscription`,
    method: "POST",
    data: {
      groupid,
      price,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onTransferCommission = async (destination: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/transfer-commission`,
    method: "POST",
    data: {
      stripeId: destination,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};
