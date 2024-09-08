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
