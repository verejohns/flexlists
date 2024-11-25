import { authService } from "flexlists-api";
import { parse, serialize } from "cookie";
import { isSucc } from "./responses";
import { getRolePathDefault } from "src/routes/paths";
import { SystemRole } from "src/enums/SystemRole";
import { deleteCookie } from "cookies-next";
export type TokenPayload = {
  user?: {
    userId: number;
    userName: string;
    email: string;
    systemRole: string;
    firstName: string;
    lastName: string;
  };
  keys?: string[];
};
export async function validateToken(context: any): Promise<any> {
  let isValidated: Boolean = false;
  let authValidate: any;
  try {
    const { req } = context;
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    const authValidateCookie = cookies.authValidate;
    let config: any = {
      headers: {
        Cookie: serialize("token", token),
      },
    };
    var verifyTokenResponse = await authService.verifyToken(config, true);
    isValidated =
      isSucc(verifyTokenResponse) &&
      verifyTokenResponse.data &&
      verifyTokenResponse.data.isValidated;

    if (authValidateCookie) {
      authValidate = JSON.parse(decodeURIComponent(authValidateCookie));
    }
  } catch (error) {
    return undefined;
  }

  if (isValidated) {
    return {
      redirect: {
        destination: getRolePathDefault(
          authValidate?.user?.systemRole ?? SystemRole.User
        ),
        permanent: false, // Set this to true if the redirect is permanent
      },
    };
  } else {
    const { req, res } = context;
    deleteCookie("token", {
      req,
      res,
    });
    deleteCookie("refreshToken", {
      req,
      res,
    });
    deleteCookie("authValidate", {
      req,
      res,
    });
  }
  return undefined;
}
