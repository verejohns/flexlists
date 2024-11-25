import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { JWT_SECRET } from "./secrets";
import * as jwt from "jsonwebtoken";
import { TokenPayload } from "./tokenUtils";
import { AuthValidate } from "src/models/AuthValidate";

export function setCookieToken(token: string, req: any, res: any) {
  setCookie("token", token, {
    req,
    res,
  });
  setAuthCookie(token, req, res);
};

export function getCookieValue(cookieName: string): string | null {
  const cookieString = document.cookie;
  const cookieArray = cookieString.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
};

export function getAuthValidatePayLoad(): AuthValidate {
  try {
    const cookieValue = getCookieValue('authValidate');

    if (!cookieValue) {
      return { isUserValidated: false, isKeyValidated: false };
    }
    return JSON.parse(decodeURIComponent(cookieValue));
  }
  catch (e) {
  }
  return { isUserValidated: false, isKeyValidated: false };;


};

//create cookie which use for frontend to check token contain user or keys or both
function setAuthCookie(token: string, req: any, res: any) {
  try {
    let jwtPayload = <TokenPayload>jwt.verify(token, JWT_SECRET);
    if (jwtPayload) {
      setCookie("authValidate", JSON.stringify(
        {
          isUserValidated: jwtPayload.user !== undefined,
          isKeyValidated: (jwtPayload.keys !== undefined && jwtPayload.keys.length > 0),
          user: jwtPayload.user
        }), {
        req,
        res,
      });
    }
  }
  catch (error) {
  }
}

export function setCookieScreenMode(mode: string, req: any, res: any) {
  setCookie("screenMode", mode, {
    req,
    res,
  });
};

export function getScreenModePayLoad(): any {
  try {
    const cookieValue = getCookieValue('screenMode');

    if (!cookieValue) {
      return 'light';
    }

    return cookieValue;
  } catch (e) {
  }
  return '';
};

export function getCookieToken(req: any, res: any): string {
  return getCookie("token", {
    req,
    res,
  }) as string;
};

export function setCookieRefreshToken(refreshToken: string, req: any, res: any) {
  setCookie("refreshToken", refreshToken, {
    req,
    res,
  });
};

export function getCookieRefreshToken(req: any, res: any): string {
  return getCookie("refreshToken", {
    req,
    res,
  }) as string;
};

export function removeCookie(key: string, req: any, res: any) {
  deleteCookie(key, {
    req,
    res,
  });
  if (key === 'token') {
    deleteCookie('authValidate', {
      req,
      res,
    });
  }
};

export function getTokenPayload(req: any, res: any): any {
  let jwtPayload: TokenPayload | undefined = undefined;
  let token = getCookieToken(req, res);
  if (!token) {
    return jwtPayload;
  }

  try {
    jwtPayload = <TokenPayload>jwt.verify(token, JWT_SECRET);
  }
  catch (error) {
  }
  return { user: jwtPayload?.user, keys: jwtPayload?.keys };
};

export function setAnonymousTicketSecret(secret: string, req: any, res: any) {
  setCookie("anonymousTicketSecret", secret, {
    req,
    res,
  });
};

export function getAnonymousTicketSecret(): any {
  try {
    const cookieValue = getCookieValue('anonymousTicketSecret');

    if (!cookieValue) {
      return '';
    }

    return cookieValue;
  } catch (e) {
  }
  return '';
};