import config from "@/config";
import { fetcher } from "@/lib/fetcher";

const { AUTH_SERVICE } = config.BACKEND_URL;
export class AuthService {
  static async SignIn(data: { email: string; password: string }) {
    return await fetcher({
      method: "POST",
      url: `${AUTH_SERVICE}/api/auth/login`,
      data,
    });
  }
  static async SignUp(data: { email: string; password: string }) {
    return await fetcher({
      method: "POST",
      url: `${AUTH_SERVICE}/api/auth/register`,
      data,
    });
  }
}
