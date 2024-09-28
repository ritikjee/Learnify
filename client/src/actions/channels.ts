"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";

export const onGetChannelInfo = async (channelid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onGetChannelInfo`,
    params: channelid,
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
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onCreateNewChannel`,
    data: {
      groupid,
      data,
    },
  });
};

export const onUpdateChannelInfo = async (
  channelid: string,
  name?: string,
  icon?: string
) => {
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
  });
};

export const onDeleteChannel = async (channelId: string) => {
  return await fetcher({
    method: "DELETE",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onDeleteChannel`,
    params: {
      channelId,
    },
  });
};
