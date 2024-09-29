"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";

export const onGetStripeClientSecret = async () => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/client-secret`,
    method: "GET",
  });
};

export const onCreateNewGroupSubscription = async (
  groupid: string,
  price: string
) => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/create-subscription`,
    method: "POST",
    data: {
      groupid,
      price,
    },
  });
};

export const onTransferCommission = async (destination: string) => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/transfer-commission`,
    method: "POST",
    data: {
      stripeId: destination,
    },
  });
};

export const onGetActiveSubscription = async (groupId: string) => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/onGetActiveSubscription`,
    method: "GET",
    params: {
      groupId,
    },
  });
};

export const onGetGroupSubscriptionPaymentIntent = async (groupid: string) => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/onGetGroupSubscriptionPaymentIntent`,
    method: "GET",
    params: {
      groupid,
    },
  });
};

export const onActivateSubscription = async (groupid: string) => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/onActivateSubscription`,
    method: "GET",
    params: {
      groupid,
    },
  });
};

export const onGetStripeIntegration = async () => {
  return await fetcher({
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/payment/onGetStripeIntegration`,
    method: "GET",
  });
};
