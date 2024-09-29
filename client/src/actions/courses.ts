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

export const onGetCourseModules = async (courseId: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onGetCourseModules`,
    params: {
      courseId,
    },
  });
};

export const onCreateCourseModule = async (
  courseId: string,
  name: string,
  moduleId: string
) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onCreateCourseModule`,
    data: {
      courseId,
      name,
      moduleId,
    },
  });
};

export const onUpdateModule = async (
  moduleId: string,
  type: "NAME" | "DATA",
  content: string
) => {
  return await fetcher({
    method: "PUT",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onUpdateModule`,
    data: {
      moduleId,
      type,
      content,
    },
  });
};

export const onUpdateSection = async (
  sectionId: string,
  type: "NAME" | "COMPLETE",
  content: string
) => {
  return await fetcher({
    method: "PUT",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onUpdateSection`,
    data: {
      sectionId,
      type,
      content,
    },
  });
};

export const onCreateModuleSection = async (
  moduleId: string,
  sectionid: string
) => {
  return await fetcher({
    method: "POST",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onCreateModuleSection`,
    data: {
      moduleId,
      sectionid,
    },
  });
};

export const onGetSectionInfo = async (sectionid: string) => {
  return await fetcher({
    method: "GET",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onGetSectionInfo`,
    params: {
      sectionid,
    },
  });
};

export const onUpdateCourseSectionContent = async (
  sectionid: string,
  html: string,
  json: string,
  content: string
) => {
  return await fetcher({
    method: "PUT",
    url: `${config.BACKEND_URL.CORE_SERVICE}/api/course/onUpdateCourseSectionContent`,
    data: {
      sectionid,
      html,
      json,
      content,
    },
  });
};
