"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { cookies } from "next/headers";

export const onGetChannelInfo = async (channelid: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onGetChannelInfo`,
    params: channelid,
    headers: {
      Cookie: cookieHeader,
    },
  });
};
export const onCreateNewChannel = async (
  groupid: string,
  data: {
    id: string;
    name: string;
    icon: string;
  }
) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onCreateNewChannel`,
    data: {
      groupid,
      data,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onUpdateChannelInfo = async (
  channelid: string,
  name?: string,
  icon?: string
) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "PUT",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onUpdateChannelInfo`,
    params: {
      channelid,
    },
    data: {
      name,
      icon,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const onDeleteChannel = async (channelId: string) => {
  const cookieStore = cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return await fetcher({
    method: "DELETE",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onDeleteChannel`,
    params: {
      channelId,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });
};
