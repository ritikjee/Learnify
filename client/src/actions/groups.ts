"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

export const onGetAffiliateInfo = async (id: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/group/onGetAffiliateInfo`,
    params: {
      id,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onCreateNewGroup = async (data: {
  name: string;
  category: string;
}) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onCreateNewGroup`,
    data,
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onGetGroupInfo = async (groupid: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupInfo`,
    params: {
      groupid, // Send groupid as a query parameter
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onGetUserGroups = async () => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetUserGroups`,
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onGetGroupChannels = async (groupid: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupChannels`,
    params: {
      groupid,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onGetGroupSubscriptions = async (groupid: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupSubscriptions`,
    params: {
      groupid,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onGetAllGroupMembers = async (groupid: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetAllGroupMembers`,
    params: {
      groupid,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onSearchGroups = async (
  mode: "GROUPS" | "POSTS",
  query: string,
  paginate?: number
) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onSearchGroups`,
    data: {
      query,
      mode,
      paginate,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};
