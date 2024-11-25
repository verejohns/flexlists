import {
  FieldType,
  PresetType,
  TranslationKeyType,
} from "src/enums/SharedEnums";
import { Role } from "src/enums/SharedEnums";
import { ViewType } from "src/enums/SharedEnums";
import { ListCategory } from "src/enums/SharedEnums";
import { UserStatus } from "src/enums/SharedEnums";
import { MembershipLevel } from "src/enums/SharedEnums";

export type CmpValueType = "Field" | "Array" | "Variable" | "SearchString";

export type WhereCmp = {
  Or: never;
  And: never;
  left: number | string; // fieldId or value
  leftType: CmpValueType;
  cmp:
    | "eq"
    | "neq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "in"
    | "nin";
  right: number | string | Date; // fieldId or value
  rightType: CmpValueType;
};
export type FlatWhere = WhereCmp | "Or" | "And";

export type Field = {
  id: number;
  listId: number;
  name: string;
  uiField: string;
  type: FieldType;
  ordering: number;
  required: boolean;
  detailsOnly: boolean;
  deleted: boolean;
  config: any;
  icon: any;
  description?: string;
  minimum?: number;
  maximum?: number;
  system: boolean;
  defaultValue?: string;
  indexed: boolean;
  typedDefaultValue: any;
};
export type List = {
  id: number;
  name: string;
  fields: Field[];
  subList: List[];
  role: Role[];
  description?: string;
};
export type Sort = {
  fieldId: number;
  direction: string;
};
export type Query = {
  table: string[];
  field: any;
  query: any;
};
export type ViewFieldConfig = {
  id: number;
  color?: string;
  name?: string;
  detailsOnly?: boolean;
  visible?: boolean;
  ordering?: number;
  default?: string;
  columnSize?: number;
};
export type View = {
  id: number;
  name: string;
  type: ViewType;
  listId: number;
  isLegacy?: boolean;
  category: ListCategory;
  template?: boolean;
  config: any;
  icon?: string;
  fields?: ViewFieldConfig[];
  page?: number;
  limit?: number;
  order?: Sort[];
  query?: string;
  conditions?: FlatWhere[];
  presets: any[];
  description?: string;
  role: Role;
  isArchived: boolean;
  isDefaultView: boolean;
  parentViewId?: number;
  parentFieldId?: number;
  parentContentId?: number;
};
export type FieldUIType = {
  name: string;
  description: string;
  baseType: FieldType;
  minimum: number;
  maximum: number;
  group: string;
  validator: (value: any) => boolean;
  conversionOptions: string[];
};
export type SearchTypeModel = {
  name: string;
  description: string;
  text: string;
};
export type User = {
  userId: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  systemRole: string;
  status: UserStatus;
  membershipLevel: MembershipLevel;
};
export type OwnerInfo = {
  userName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
};
export type ViewChat = {
  id: number;
  contentId?: number;
  message: string;
  ownerId: number;
  ownerInfo?: OwnerInfo;
  createdAt?: Date;
  updatedAt?: Date;
} & {
  over?: boolean;
  author?: string;
};
export type TranslationText = {
  id: number;
  translationKey: string;
  translationKeyId?: number;
  translationKeyType: TranslationKeyType;
  i18n: string;
  translation: string;
  ownerId: number;
};
export type Integration = {
  id: number;
  name: string;
  description: string;
  type: string;
  trigger: string;
  email: string;
};

export type Application = {
  id: number;
  name: string;
  description: string;
  icon: string;
};
export type PresetModel = {
  name?: string;
  type?: PresetType;
  page?: number;
  limit?: number;
  order?: any;
  query?: string;
  conditions?: any;
  fields?: any;
};
