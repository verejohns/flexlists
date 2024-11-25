// ----------------------------------------------------------------------

import { SystemRole } from "src/enums/SystemRole";

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}
export const ROOT_PATH = {
  landingPage: "/",
  pricing: "/pricing",
  existingPricing: "/existing/pricing",
};
const ROOTS_AUTH = "/auth";
export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, "/login"),
  loginExisting: path(ROOTS_AUTH, "/loginExisting"),
  loginExisting2: path(ROOTS_AUTH, "/loginExisting2"),
  loginExisting3: path(ROOTS_AUTH, "/loginExisting3"),

  register: path(ROOTS_AUTH, "/register"),
  registerExisting: path(ROOTS_AUTH, "/registerExisting"),
  verifyEmail: path(ROOTS_AUTH, "/verifyEmail"),
  resendEmailVerification: path(ROOTS_AUTH, "/resendEmailVerification"),
  forgotPasswordVerificationManual: path(
    ROOTS_AUTH,
    "/forgotPasswordVerificationManual"
  ),
  forgotPasswordVerification: path(ROOTS_AUTH, "/forgotPasswordVerification"),
  forgotPassword: path(ROOTS_AUTH, "/forgotPassword"),
  verifyToken: path(ROOTS_AUTH, "/verifyToken"),
  logout: path(ROOTS_AUTH, "/logout"),
};
const ROOTS_MAIN = "/main";
export const PATH_MAIN = {
  lists: path(ROOTS_MAIN, "/lists"),
  views: path(ROOTS_MAIN, "/views"),
  chooseTemplate: path(ROOTS_MAIN, "/lists/chooseTemplate"),
  newList: path(ROOTS_MAIN, "/lists/newList"),
  groups: path(ROOTS_MAIN, "/groups"),
  integrations: path(ROOTS_MAIN, "/integrations"),
  newIntegration: path(ROOTS_MAIN, "/integrations/newIntegration"),
  newApplication: path(ROOTS_MAIN, "/applications/newApplication"),
  applications: path(ROOTS_MAIN, "/applications"),
  newGroup: path(ROOTS_MAIN, "/groups/newGroup"),
  migratedLists: path(ROOTS_MAIN, "/migrate"),
  settings: path(ROOTS_MAIN, "/settings"),
};
export const PATH_AUTH_API = {
  verifyToken: path(ROOTS_AUTH, "/verifyToken"),
  resendSignupEmail: path(ROOTS_AUTH, "/resendSignupEmail"),
  verifySignup: path(ROOTS_AUTH, "/verifySignup"),
  verifyPasswordChange: path(ROOTS_AUTH, "/verifyPasswordChange"),
  resetPassword: path(ROOTS_AUTH, "/resetPassword"),
  registerExisting: path(ROOTS_AUTH, "/registerExisting"),
  forgotPassword: path(ROOTS_AUTH, "/forgotPassword"),
  loginExisting: path(ROOTS_AUTH, "/loginExisting"),
};
const ROOTS_API = "/api";
export const PATH_API = {
  getViewChat: path(ROOTS_API, "/listChat/getViewChat"),
  getContentChat: path(ROOTS_API, "/listChat/getContentChat"),
  getSupportTicket: path(ROOTS_API, "/support/getTicket"),
  getSupportOnlinestatus: path(ROOTS_API, "/support/getOnline")
};
const ROOTS_ADMIN = "/admin";
export const PATH_ADMIN = {
  contentManagement: path(ROOTS_ADMIN, "/contentManagement"),
  support: path(ROOTS_ADMIN, "/support"),
};
const ROOTS_ADMIN_API = "/api/admin";
export const PATH_ADMIN_API = {
  getSearchTypes: path(ROOTS_ADMIN_API, "/getSearchTypes"),
  getLanguages: path(ROOTS_ADMIN_API, "/getLanguages"),
};

export const getRolePathDefault = (role: string) => {
  switch (role) {
    case SystemRole.Admin:
    case SystemRole.Support:
      return PATH_ADMIN.support;
    case SystemRole.ContentEditor:
    case SystemRole.ContentManager:
      return PATH_ADMIN.contentManagement;
    case "user":
      return PATH_MAIN.lists;
    default:
      return PATH_MAIN.lists;
  }
};
