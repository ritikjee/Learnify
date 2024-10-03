"use server";

import config from "@/config";
import { fetcher } from "@/lib/fetcher";

export const uploadFile = async (fileName: string) => {
  return await fetcher({
    url: `${config.BACKEND_URL.FILE_SERVICE}/api/file-upload/file`,
    method: "POST",
    data: {
      fileName,
    },
  });
};
