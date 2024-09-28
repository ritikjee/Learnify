"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";

export const onGetGroupCourses = async (groupid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onGetGroupCourses`,
    params: {
      groupid,
    },
  });
};

export const onCreateGroupCourse = async (
  groupid: string,
  name: string,
  image: string,
  description: string,
  courseid: string,
  privacy: string,
  published: boolean
) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onCreateGroupCourse`,
    data: {
      groupid,
      courseid,
      name,
      image,
      description,
      privacy,
      published,
    },
  });
};
