"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";

export const onGetChannelInfo = async (channelid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onGetChannelInfo`,
    params: {
      channelid,
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

export const onCreateChannelPost = async (
  channelid: string,
  title: string,
  content: string,
  htmlContent: string,
  jsonContent: string
) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onCreateChannelPost`,
    data: {
      channelid,
      title,
      content,
      htmlContent,
      jsonContent,
    },
  });
};

export const onLikeChannelPost = async (postid: string, likeid: string) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/channel/onLikeChannelPost`,
    data: {
      postid,
      likeid,
    },
  });
};
