"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export const onGetAffiliateInfo = async (id: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetAffiliateInfo`,
    params: {
      id,
    },
  });
};

export const onCreateNewGroup = async (data: {
  name: string;
  category: string;
}) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onCreateNewGroup`,
    data,
  });
};

export const onGetGroupInfo = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupInfo`,
    params: {
      groupid, // Send groupid as a query parameter
    },
  });
};

export const onGetUserGroups = async (): Promise<any> => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetUserGroups`,
  });
};

export const onGetGroupChannels = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupChannels`,
    params: {
      groupid,
    },
  });
};

export const onGetGroupSubscriptions = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetGroupSubscriptions`,
    params: {
      groupid,
    },
  });
};

export const onGetAllGroupMembers = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetAllGroupMembers`,
    params: {
      groupid,
    },
  });
};

export const onUpDateGroupSettings = async (
  groupid: string,
  type:
    | "IMAGE"
    | "ICON"
    | "NAME"
    | "DESCRIPTION"
    | "JSONDESCRIPTION"
    | "HTMLDESCRIPTION",
  content: string,
  path: string
) => {
  const { data, error } = await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onUpDateGroupSettings`,
    data: {
      groupid,
      type,
      content,
    },
  });

  if (!error) revalidatePath(path);

  return { data, error };
};

export const onSearchGroups = async (
  mode: "GROUPS" | "POSTS",
  query: string,
  paginate?: number
) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onSearchGroups`,
    data: {
      query,
      mode,
      paginate,
    },
  });
};

export const onGetExploreGroup = async (category: string, paginate: number) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetExploreGroup`,
    data: {
      category,
      paginate,
    },
  });
};
export const onGetPaginatedPosts = async (
  identifier: string,
  paginate: number
) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetPaginatedPosts`,
    params: {
      identifier,
      paginate,
    },
  });
};

export const onUpdateGroupGallery = async (
  groupid: string,
  content: string
) => {
  const { data, error } = await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onUpdateGroupGallery`,
    data: {
      groupid,
      content,
    },
  });

  if (!error) revalidatePath(`/group/${groupid}`);

  return { data, error };
};

export const onJoinGroup = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onJoinGroup`,
    params: {
      groupid,
    },
  });
};

export const onGetAffiliateLink = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onGetAffiliateLink`,
    params: {
      groupid,
    },
  });
};

export const onVerifyAffilateLink = async (id: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/group/onVerifyAffilateLink`,
    params: {
      id,
    },
  });
};
