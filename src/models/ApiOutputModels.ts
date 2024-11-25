import { Role } from "src/enums/SharedEnums";
import { TranslationKeyType } from "src/enums/SharedEnums";
export type CreatePaymentCheckoutSessionOutputDto = {
  sessionId: number;
};
export type CreateSubscriptionOrderOutputDto = {
  subscriptionOrderId: number;
};
export type CreateListOutputDto = {
  listId: number;
};
export type CreateUIFieldOutputDto = {
  viewId: number;
  fieldId: number;
};
export type CreateFieldOutputDto = {
  viewId: number;
  fieldId: number;
  ordering: number;
};
export type UpdateUiFieldOutputDto = {
  viewId: number;
  fieldId: number;
};
export type CreateContentOutputDto = {
  viewId: number;
  contentId: number;
};
export type CloneContentOutputDto = {
  viewId: number;
  contentId: number;
};
export type SearchContentsOutputDto = {
  listId: number;
  count: number;
  content: any[];
};
export type SearchOutputDto = {
  listId: number;
  count: number;
  content: any[];
};
export type GetViewUsersOutputDto = {
  userId: number;
  name: any;
  email: any;
  role: Role;
};
export type CreateViewOutputDto = {
  listId: number;
  viewId: number;
};
export type SearchViewsOutputDto = {
  views: any[];
};
export type AcceptInviteOutputDto = {
  viewId?: any;
};
export type GetViewGroupsOutputDto = {
  groupId: number;
  name: any;
  role: Role;
  avatarUrl?: string;
};
export type AddTableViewToGroupOutputDto = {
  groupTableViewId: number;
};
export type AddKeyToViewOutputDto = {
  keyId: number;
  key: any;
};
export type GetKeysForViewOutputDto = {
  keyId: number;
  key: any;
  role: Role;
  name?: any;
};
export type GetViewTemplatesOutputDto = {
  id: number;
  name: any;
  icon: any;
};
export type CreateCoreViewOutputDto = {
  listId: number;
  viewId: number;
};
export type GetUserContactsOutputDto = {
  userId: number;
  name: any;
  email: any;
  avatarUrl?: any;
  color: string;
  firstName?: string;
  lastName?: string;
};
export type GetProfileOutputDto = {
  firstName: any;
  lastName: any;
  email: any;
  phoneNumber?: any;
  avatarUrl?: any;
};
export type CreateUserGroupOutputDto = {
  groupId: number;
};
export type GetUserGroupsOutputDto = {
  groupId: number;
  name: any;
  description?: any;
  avatarUrl?: any;
  color: string;
};
export type GetGroupViewsOutputDto = {
  tableViewId: number;
  tableViewName: any;
  role: any;
  isDefaultView: boolean;
};
export type GetGroupUsersOutputDto = {
  userId: number;
  userName: any;
  firstName: any;
  lastName: any;
  avatarUrl: string;
  color: string;
};
export type AddUserToGroupOutputDto = {
  groupUserId: number;
};
export type AddTranslationKeyToContentManagementOutputDto = {
  id: number;
};
export type GetTranslationKeysOfContentManagementOutputDto = {
  id: number;
  name: any;
  type: TranslationKeyType;
};
export type GetContentManagementTranslationTextsOutputDto = {};
export type SaveManyTranslationTextsOutputDto = {};
export type GetTranslationTextsOutputDto = {
  id: number;
  translationKey: any;
  i18n: any;
  translation?: any;
};
export type GetUserGroupByIdOutputDto = {
  groupId: number;
  name: any;
  description?: any;
  avatarUrl?: any;
  color: string;
};
export type CreateIntegrationOutputDto = {
  viewId: number;
  fieldId: number;
};
