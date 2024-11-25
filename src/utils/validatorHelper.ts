import moment from "moment";
import * as locale from "locale-codes";
import validator from "validator";
import { phone } from "phone";
import countryLookup from "country-code-lookup";
import sanitizeHtml from "sanitize-html";
import { randomUUID } from "crypto";

export class ValidationError extends Error {
  isValidationError: boolean;
  constructor(message: string, value?: any, expecting?: string) {
    if (value !== undefined) {
      message += ' with value "' + value + '"';
    }
    if (expecting && expecting.length > 0) {
      message += ' while expecting "' + expecting + '"';
    }
    super(message);
    this.isValidationError = true;
  }
}

export enum ModelValidatorEnum {
  GenericTypes = "GenericTypes",
  Subscription = "Subscription",
  Feature = "Feature",
  UserSubscription = "UserSubscription",
  SubscriptionFeature = "SubscriptionFeature",
  Integration = "Integration",
  IntegrationTableDefinition = "IntegrationTableDefinition",
  IntegrationTableView = "IntegrationTableView",
  Snapshot = "Snapshot",
  ContentManagement = "ContentManagement",
  TranslationKey = "TranslationKey",
  TranslationText = "TranslationText",
  Server = "Server",
  User = "User",
  Role = "Role",
  UserRole = "UserRole",
  UserTableDefinition = "UserTableDefinition",
  UserTableView = "UserTableView",
  GroupTableView = "GroupTableView",
  RolePermission = "RolePermission",
  Invite = "Invite",
  Group = "Group",
  Permission = "Permission",
  File = "File",
  TableDefinition = "TableDefinition",
  TableMigration = "TableMigration",
  LegacyMigrationQueue = "LegacyMigrationQueue",
  TableView = "TableView",
  ViewChat = "ViewChat",
  ContentChat = "ContentChat",
  TableHistory = "TableHistory",
  FieldDefinition = "FieldDefinition",
  AccessKey = "AccessKey",
  Product = "Product",
  ResourceUserRole = "ResourceUserRole",
  ResourceAccessKeyRole = "ResourceAccessKeyRole",
  WorkflowDefinition = "WorkflowDefinition",
  WorkflowVersion = "WorkflowVersion",
  WorkflowVersionRun = "WorkflowVersionRun",
  WorkflowStep = "WorkflowStep",
  NextWorkflowStepWorkflowStep = "NextWorkflowStepWorkflowStep",
  PreviousWorkflowStepWorkflowStep = "PreviousWorkflowStepWorkflowStep",
  WorkflowScript = "WorkflowScript",
  WorkflowScriptRun = "WorkflowScriptRun",
  WorkflowScriptAudit = "WorkflowScriptAudit",
  Application = "Application",
  ApplicationMenu = "ApplicationMenu",
  ApplicationMenuPage = "ApplicationMenuPage",
  ApplicationRoleTableView = "ApplicationRoleTableView",
  ApplicationRole = "ApplicationRole",
  ApplicationScript = "ApplicationScript",
  ApplicationScriptAudit = "ApplicationScriptAudit",
  GlobalScript = "GlobalScript",
  GlobalScriptAudit = "GlobalScriptAudit",
  GlobalWidgetScript = "GlobalWidgetScript",
  ApplicationAccessKey = "ApplicationAccessKey",
  SupportTicket = "SupportTicket",
  SupportTicketThread = "SupportTicketThread",
  SystemSettings = "SystemSettings",
  TranslationKeyContentManagement = "TranslationKeyContentManagement",
  UserContact = "UserContact",
  GroupUser = "GroupUser",
  ApplicationTableView = "ApplicationTableView",
  ApplicationMenuPageApplicationRole = "ApplicationMenuPageApplicationRole",
  ApplicationAccessKeyApplicationRole = "ApplicationAccessKeyApplicationRole",
}
export enum FieldValidatorEnum {
  id = "id",
  text = "text",
  longText = "longText",
  html = "html",
  markdown = "markdown",
  boolean = "boolean",
  integer = "integer",
  filePath = "filePath",
  json = "json",
  enum = "enum",
  i18n = "i18n",
  userName = "userName",
  email = "email",
  firstName = "firstName",
  lastName = "lastName",
  fullName = "fullName",
  phoneNumber = "phoneNumber",
  password = "password",
  city = "city",
  country = "country",
  salt = "salt",
  owner = "owner",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  dateTime = "dateTime",
  url = "url",
  imageURL = "imageURL",
  fileURL = "fileURL",
  referenceOneToOne = "referenceOneToOne",
  referenceOneToMany = "referenceOneToMany",
  referenceManyToOne = "referenceManyToOne",
  referenceManyToMany = "referenceManyToMany",
  uuid = "uuid",
  mimeType = "mimeType",
  file = "file",
  money = "money",
  name = "name",
  billType = "billType",
  price = "price",
  externalReference = "externalReference",
  feature = "feature",
  deleted = "deleted",
  syncId = "syncId",
  description = "description",
  startDate = "startDate",
  endDate = "endDate",
  status = "status",
  cancelDate = "cancelDate",
  externalSubscriptionId = "externalSubscriptionId",
  externalInvoiceId = "externalInvoiceId",
  externalUserId = "externalUserId",
  addInfo = "addInfo",
  user = "user",
  subscription = "subscription",
  type = "type",
  trigger = "trigger",
  configuration = "configuration",
  tableDefinition = "tableDefinition",
  tableView = "tableView",
  integration = "integration",
  snapshot = "snapshot",
  previousId = "previousId",
  nextId = "nextId",
  currentPoint = "currentPoint",
  path = "path",
  tableName = "tableName",
  action = "action",
  config = "config",
  publishedDate = "publishedDate",
  slug = "slug",
  contentManagement = "contentManagement",
  reusable = "reusable",
  translationKey = "translationKey",
  translation = "translation",
  region = "region",
  userCount = "userCount",
  maxUserCount = "maxUserCount",
  tableCount = "tableCount",
  maxTableCount = "maxTableCount",
  legacyId = "legacyId",
  passwordSalt = "passwordSalt",
  contact = "contact",
  forgotPasswordToken = "forgotPasswordToken",
  forgotPasswordTokenCreated = "forgotPasswordTokenCreated",
  changeEmailToken = "changeEmailToken",
  newEmail = "newEmail",
  changeEmailTokenCreated = "changeEmailTokenCreated",
  termsAndConditionsAccepted = "termsAndConditionsAccepted",
  avatarUrl = "avatarUrl",
  server = "server",
  domain = "domain",
  subDomain = "subDomain",
  color = "color",
  language = "language",
  role = "role",
  group = "group",
  entityID = "entityID",
  permission = "permission",
  inviteKey = "inviteKey",
  acceptedInvite = "acceptedInvite",
  fileReference = "fileReference",
  assignedTo = "assignedTo",
  resolver = "resolver",
  connectionId = "connectionId",
  size = "size",
  template = "template",
  category = "category",
  database = "database",
  icon = "icon",
  parent = "parent",
  tableHistory = "tableHistory",
  connections = "connections",
  implementation = "implementation",
  before = "before",
  after = "after",
  fieldDefinition = "fieldDefinition",
  credentials = "credentials",
  callback = "callback",
  totalRows = "totalRows",
  rowsDone = "rowsDone",
  migrationResult = "migrationResult",
  relationConfiguration = "relationConfiguration",
  dataConfig = "dataConfig",
  isArchived = "isArchived",
  isDefaultView = "isDefaultView",
  viewChat = "viewChat",
  visit = "visit",
  message = "message",
  contentId = "contentId",
  definition = "definition",
  customType = "customType",
  ordering = "ordering",
  required = "required",
  detailsOnly = "detailsOnly",
  minimum = "minimum",
  maximum = "maximum",
  system = "system",
  defaultValue = "defaultValue",
  indexed = "indexed",
  key = "key",
  cors = "cors",
  expiryDate = "expiryDate",
  expiredDate = "expiredDate",
  userResourceName = "userResourceName",
  resourceId = "resourceId",
  resourceUserRole = "resourceUserRole",
  accessKeyResourceName = "accessKeyResourceName",
  accessKey = "accessKey",
  resourceAccessKeyRole = "resourceAccessKeyRole",
  version = "version",
  workflowDefinition = "workflowDefinition",
  workflowVersion = "workflowVersion",
  run = "run",
  previousSteps = "previousSteps",
  nextSteps = "nextSteps",
  workflowStep = "workflowStep",
  script = "script",
  concurrent = "concurrent",
  ratePerMinute = "ratePerMinute",
  ratePerHour = "ratePerHour",
  ratePerDay = "ratePerDay",
  ratePerWeek = "ratePerWeek",
  ratePerMonth = "ratePerMonth",
  workflowVersionRun = "workflowVersionRun",
  workflowScript = "workflowScript",
  workflowScriptRun = "workflowScriptRun",
  application = "application",
  isHome = "isHome",
  layout = "layout",
  applicationMenu = "applicationMenu",
  applicationRole = "applicationRole",
  applicationMenuPage = "applicationMenuPage",
  rights = "rights",
  applicationScript = "applicationScript",
  globalScript = "globalScript",
  subject = "subject",
  secret = "secret",
  emailVerified = "emailVerified",
  supportTicket = "supportTicket",
  author = "author",
  staffMember = "staffMember",
  value = "value",
  applicationAccessKey = "applicationAccessKey",
}

// this needs to have setErrors;
//   const [errors, setErrors] = useState<{ [key: string]: string|boolean }>({});
export async function frontendValidate(
  model: ModelValidatorEnum,
  field: FieldValidatorEnum,
  value: any,
  errors: { [key: string]: string | boolean },
  setErrors: (value: { [key: string]: string | boolean }) => void,
  required?: boolean,
  setError?: (message: string) => void,
  minimum?: bigint,
  maximum?: bigint,
  config?: any
): Promise<any> {
  let newErrors = { [field.toString()]: false, ...errors } as {
    [key: string]: string | boolean;
  };
  try {
    value = await (Validator as any)[model.toString()][field.toString()](
      value,
      required,
      minimum,
      maximum,
      config
    );
  } catch (e: any) {
    if (e.isValidationError) {
      newErrors[field.toString()] = e.message;
      if (setError) {
        setError(e.message);
      }
    } else {
      throw e;
    }
  }
  setErrors(newErrors);
  return value;
}
export const isFrontendError = (
  key: FieldValidatorEnum,
  errors: { [key: string]: string | boolean },
  setErrors?: (value: { [key: string]: string | boolean }) => void,
  setError?: (message: string) => void
) => {
  if (setErrors) {
    setErrors(errors);
  }
  let _error = errors[key];
  if (_error !== undefined && _error !== false) {
    if (setError) {
      setError(_error as string);
    }
    return true;
  }
  return false;
};
export function isInputValidateError(error: any): boolean {
  return error.isValidationError;
}

const Validator = {
  GenericTypes: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    text: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Text is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (value.length < (minimum ?? 0))
        throw new ValidationError(
          "Text must be at least " + (minimum ?? 0) + " characters",
          value
        );
      if (value.length > (maximum ?? 1000))
        throw new ValidationError(
          "Text must be at most " + (maximum ?? 1000) + " characters",
          value
        );
      return value;
    },
    longText: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("LongText is required", value);
      else if (!required && !value) return undefined;
      if (value.length < (minimum ?? 0))
        throw new ValidationError(
          "LongText must be at least " + (minimum ?? 0) + " characters",
          value
        );
      if (value.length > (maximum ?? 100000))
        throw new ValidationError(
          "LongText must be at most " + (maximum ?? 100000) + " characters",
          value
        );
      return value;
    },
    html: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("HTML is required", value);
      else if (!required && !value) return undefined;
      if (value.length < (minimum ?? 0))
        throw new ValidationError(
          "HTML must be at least " + (minimum ?? 0) + " characters",
          value
        );
      if (value.length > (maximum ?? 100000))
        throw new ValidationError(
          "HTML must be at most " + (maximum ?? 100000) + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "HTML contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    markdown: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Markdown is required", value);
      else if (!required && !value) return undefined;
      if (value.length < (minimum ?? 0))
        throw new ValidationError(
          "Markdown must be at least " + (minimum ?? 0) + " characters",
          value
        );
      if (value.length > (maximum ?? 100000))
        throw new ValidationError(
          "Markdown must be at most " + (maximum ?? 100000) + " characters",
          value
        );
      return value;
    },
    boolean: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Boolean is required", value);
      else if (!required && !value) return undefined;
    },
    integer: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Integer is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? -2147483647899000000))
        throw new ValidationError(
          "Integer must be at least " + (minimum ?? -2147483647899000000),
          value
        );
      if (value > (maximum ?? 2147483647899000000))
        throw new ValidationError(
          "Integer must be at most " + (maximum ?? 2147483647899000000),
          value
        );
      return value;
    },
    filePath: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("FilePath is required", value);
      else if (!required && !value) return undefined;
      if (!value.match(/^([a-zA-Z0-9_\-\.\/]+)$/))
        throw new ValidationError(
          "FilePath must be a valid unix file path",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "FilePath contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    json: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("JSON must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("JSON is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    enum: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Enum is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Enum is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Option1", "Option2", "Option3"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Enum must be one of " + options.join(","),
          value
        );
      return value;
    },
    i18n: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("I18N is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("I18N is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!locale.getByTag(value.replace("_", "-")))
        throw new ValidationError("I18N must be a valid locale code", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "I18N contains invalid HTML, allowed are ",
          value
        );
      const sp = value.replace("_", "-").split("-");
      return sp[0].toLowerCase() + "-" + sp[1].toUpperCase();
    },
    userName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("UserName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "UserName must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "UserName must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "UserName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    email: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Email is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Email is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isEmail(value))
        throw new ValidationError("Email must be a valid email", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Email contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    firstName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("FirstName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "FirstName must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "FirstName must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "FirstName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    lastName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("LastName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "LastName must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "LastName must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "LastName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    fullName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("FullName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "FullName must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "FullName must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "FullName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    phoneNumber: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("PhoneNumber is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("PhoneNumber is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      value = value.replace(/[^0-9+]/g, "");
      if (!phone(value).isValid)
        throw new ValidationError(
          "PhoneNumber must be a valid phone number",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "PhoneNumber contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    password: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Password is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Password is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Password must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "Password must be at most " + maximum + " characters",
          value
        );
      if (
        !value.match(
          /^([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@\#\$%\^&\*\(\)_\+~`\|\}\{\[\]:;\?><\,\./\-=]+)$/
        )
      )
        throw new ValidationError(
          "Password must contain only valid characters, The password has to be at least 8 characters long and contain at least 1 of ABCDEFGHIJKLMNOPQRSTUVWXYZ and contain at least 1 of abcdefghijklmnopqrstuvwxyz and contain at least 1 of 0123456789 and contain at least 1 of !@#$%^&*()_+~`|}{[]:;?><,./-=",
          value
        );
      return value;
    },
    city: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("City is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "City must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "City must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "City contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    country: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Country is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Country is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      const country =
        countryLookup.byCountry(value) ??
        countryLookup.byFips(value) ??
        countryLookup.byIso(value) ??
        countryLookup.byInternet(value) ??
        countryLookup.byIso(value);
      if (!country)
        throw new ValidationError(
          "Country must be a valid country code",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Country contains invalid HTML, allowed are ",
          value
        );
      return value.country;
    },
    salt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Salt is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(15);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Salt must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "Salt must be at most " + maximum + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    dateTime: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("DateTime is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "DateTime must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("DateTime must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    url: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("URL is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("URL is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("URL must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "URL contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    imageURL: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ImageURL is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("ImageURL is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("ImageURL must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "ImageURL contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    fileURL: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("FileURL is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("FileURL is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("FileURL must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "FileURL contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    referenceOneToOneId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ReferenceOneToOne is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError(
          "ReferenceOneToOne must be at least 1",
          value
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ReferenceOneToOne must be smaller than 2147483647",
          value
        );
      return value;
    },
    referenceOneToManyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ReferenceOneToMany is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ReferenceOneToMany must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ReferenceOneToMany must be smaller than 2147483647",
          value
        );
      return value;
    },
    referenceManyToOneId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ReferenceManyToOne is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ReferenceManyToOne must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ReferenceManyToOne must be smaller than 2147483647",
          value
        );
      return value;
    },
    referenceManyToManyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ReferenceManyToMany is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ReferenceManyToMany must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ReferenceManyToMany must be smaller than 2147483647",
          value
        );
      return value;
    },
    uuid: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("UUID is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("UUID is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("UUID must be a valid UUID", value);
      return value;
    },
    mimeType: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("MimeType is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("MimeType is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "MimeType must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "MimeType must be at most " + maximum + " characters",
          value
        );
      if (!validator.isMimeType(value))
        throw new ValidationError("MimeType must be a valid MimeType", value);
      return value;
    },
    file: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("File is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("File is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!value.match(/^([a-zA-Z0-9_\-\.\/]+)$/))
        throw new ValidationError("File must be a valid unix file path", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "File contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    money: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Money is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
  },
  Subscription: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    billType: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Monthly";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("BillType is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("BillType is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Monthly", "Yearly", "LifeTime"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "BillType must be one of " + options.join(","),
          value
        );
      return value;
    },
    price: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Price is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    externalReference: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ExternalReference is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ExternalReference must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "ExternalReference must be at most " +
            (maximum ?? 10000) +
            " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    featureId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Feature is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Feature must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Feature must be smaller than 2147483647",
          value
        );
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Feature: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 10000) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  UserSubscription: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    startDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("StartDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "StartDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("StartDate must be a valid date time");
      if (value.getTime() === 0)
        throw new ValidationError("StartDate is required", value);
      return value;
    },
    endDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("EndDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError("EndDate must be a valid date time", value);
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("EndDate must be a valid date time");
      if (value.getTime() === 0)
        throw new ValidationError("EndDate is required", value);
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "InActive";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["InActive", "Active", "Cancel"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    cancelDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CancelDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CancelDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CancelDate must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    externalSubscriptionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ExternalSubscriptionId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ExternalSubscriptionId must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "ExternalSubscriptionId must be at most " +
            (maximum ?? 10000) +
            " characters",
          value
        );
      return value;
    },
    externalInvoiceId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ExternalInvoiceId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ExternalInvoiceId must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "ExternalInvoiceId must be at most " +
            (maximum ?? 10000) +
            " characters",
          value
        );
      return value;
    },
    externalUserId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ExternalUserId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ExternalUserId must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "ExternalUserId must be at most " +
            (maximum ?? 10000) +
            " characters",
          value
        );
      return value;
    },
    addInfo: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("AddInfo is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "AddInfo must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "AddInfo must be at most " + (maximum ?? 10000) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    subscriptionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Subscription is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Subscription must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Subscription must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  SubscriptionFeature: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    subscriptionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Subscription is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Subscription must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Subscription must be smaller than 2147483647",
          value
        );
      return value;
    },
    featureId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Feature is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Feature must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Feature must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Integration: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 10000))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 10000) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Email", "Webhook"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    trigger: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      if (Array.isArray(value)) value = value.join(";");
      else value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Trigger is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Trigger is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "Create",
        "Read",
        "Update",
        "Delete",
        "CreateOwned",
        "ReadOwned",
        "UpdateOwned",
        "DeleteOwned",
        "CreateField",
        "UpdateField",
        "DeleteField",
      ];
      if (config && config.options) options = config.options;
      let values = value.split(";");
      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        if (!options.includes(element))
          throw new ValidationError(
            "Trigger must be one of " + options.join(","),
            value
          );
      }
      return value;
    },
    configuration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError(
            "Configuration must be a valid JSON",
            value
          );
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Configuration is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  IntegrationTableDefinition: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    configuration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError(
            "Configuration must be a valid JSON",
            value
          );
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Configuration is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    integrationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Integration is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Integration must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Integration must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  IntegrationTableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    configuration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError(
            "Configuration must be a valid JSON",
            value
          );
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Configuration is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    integrationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Integration is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Integration must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Integration must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Snapshot: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    snapshot: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Snapshot is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Snapshot must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 16000000))
        throw new ValidationError(
          "Snapshot must be at most " + (maximum ?? 16000000) + " characters",
          value
        );
      return value;
    },
    previousId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("PreviousId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "PreviousId must be at least " + minimum,
          value
        );
      if (maximum !== undefined && value > maximum)
        throw new ValidationError(
          "PreviousId must be at most " + maximum,
          value
        );
      return value;
    },
    nextId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("NextId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError("NextId must be at least " + minimum, value);
      if (maximum !== undefined && value > maximum)
        throw new ValidationError("NextId must be at most " + maximum, value);
      return value;
    },
    currentPoint: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("CurrentPoint is required", value);
      else if (!required && !value) return undefined;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    path: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Path is required", value);
      else if (!required && !value) return undefined;
      if (!value.match(/^([a-zA-Z0-9_\-\.\/]+)$/))
        throw new ValidationError("Path must be a valid unix file path", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Path contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    tableName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("TableName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "TableName must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "TableName must be at most " + maximum + " characters",
          value
        );
      return value;
    },
    action: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Action is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Action is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "AddTable",
        "UpdateTableName",
        "RemoveTable",
        "AddColumn",
        "RemoveColumn",
        "UpdateColumnName",
        "UpdateColumnType",
        "AddRelation",
        "RemoveRelation",
        "Insert",
        "Update",
        "Remove",
        "RestoreSnapshot",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Action must be one of " + options.join(","),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ContentManagement: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    config: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Config must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Config is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Page";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Blog", "Roadmap", "Tutorials", "Page"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    publishedDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("PublishedDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "PublishedDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("PublishedDate must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    slug: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Slug is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Slug must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "Slug must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TranslationKey: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Text";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Text", "Html", "Markdown", "Image"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    contentManagementId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ContentManagement is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ContentManagement must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ContentManagement must be smaller than 2147483647",
          value
        );
      return value;
    },
    config: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Config must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Config is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    reusable: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Reusable is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TranslationText: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    translationKeyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TranslationKey is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TranslationKey must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TranslationKey must be smaller than 2147483647",
          value
        );
      return value;
    },
    i18n: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("I18n is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("I18n is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!locale.getByTag(value.replace("_", "-")))
        throw new ValidationError("I18n must be a valid locale code", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "I18n contains invalid HTML, allowed are ",
          value
        );
      const sp = value.replace("_", "-").split("-");
      return sp[0].toLowerCase() + "-" + sp[1].toUpperCase();
    },
    translation: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Translation is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Translation must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Translation must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Server: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    url: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("URL is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "URL must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "URL must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Shared";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Shared", "Dedicated"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    region: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Germany";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Region is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Region is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "Germany",
        "UnitedKingdom",
        "WestUnitedstates",
        "EastUnitedstates",
        "CentralUnitedstates",
        "Singapore",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Region must be one of " + options.join(","),
          value
        );
      return value;
    },
    userCount: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("UserCount is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "UserCount must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "UserCount must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    maxUserCount: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("MaxUserCount is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "MaxUserCount must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "MaxUserCount must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableCount: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("TableCount is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "TableCount must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "TableCount must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    maxTableCount: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("MaxTableCount is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "MaxTableCount must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "MaxTableCount must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  User: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    userName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("UserName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "UserName must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "UserName must be at most " + (maximum ?? 250) + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "UserName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    email: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Email is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Email is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isEmail(value))
        throw new ValidationError("Email must be a valid email", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Email contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    firstName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("FirstName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "FirstName must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "FirstName must be at most " + (maximum ?? 50) + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "FirstName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    lastName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("LastName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "LastName must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "LastName must be at most " + (maximum ?? 50) + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "LastName contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    phoneNumber: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("PhoneNumber is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("PhoneNumber is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      value = value.replace(/[^0-9+]/g, "");
      if (!phone(value).isValid)
        throw new ValidationError(
          "PhoneNumber must be a valid phone number",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "PhoneNumber contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    legacyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("LegacyId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "LegacyId must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "LegacyId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    city: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("City is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "City must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "City must be at most " + (maximum ?? 50) + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "City contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    country: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Country is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Country is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      const country =
        countryLookup.byCountry(value) ??
        countryLookup.byFips(value) ??
        countryLookup.byIso(value) ??
        countryLookup.byInternet(value) ??
        countryLookup.byIso(value);
      if (!country)
        throw new ValidationError(
          "Country must be a valid country code",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Country contains invalid HTML, allowed are ",
          value
        );
      return value.country;
    },
    password: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Password is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Password is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value.length < (minimum ?? 8))
        throw new ValidationError(
          "Password must be at least " + (minimum ?? 8) + " characters",
          value
        );
      if (value.length > (maximum ?? 70))
        throw new ValidationError(
          "Password must be at most " + (maximum ?? 70) + " characters",
          value
        );
      if (
        !value.match(
          /^([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@\#\$%\^&\*\(\)_\+~`\|\}\{\[\]\\:;\?><\,\./\-=]+)$/
        )
      )
        throw new ValidationError(
          "Password must contain only valid characters, The password has to be at least 8 characters long and contain at least 1 of ABCDEFGHIJKLMNOPQRSTUVWXYZ and contain at least 1 of abcdefghijklmnopqrstuvwxyz and contain at least 1 of 0123456789 and contain at least 1 of !@#$%^&*()_+~`|}{[]:;?><,./-=",
          value
        );
      if (
        !value.match(/([ABCDEFGHIJKLMNOPQRSTUVWXYZ])/g) ||
        value.match(/([ABCDEFGHIJKLMNOPQRSTUVWXYZ])/g).length < 1
      )
        throw new ValidationError(
          "Password must contain at least 1 capital letters, The password has to be at least 8 characters long and contain at least 1 of ABCDEFGHIJKLMNOPQRSTUVWXYZ and contain at least 1 of abcdefghijklmnopqrstuvwxyz and contain at least 1 of 0123456789 and contain at least 1 of !@#$%^&*()_+~`|}{[]:;?><,./-=",
          value
        );
      if (
        !value.match(/([0123456789])/g) ||
        value.match(/([0123456789])/g).length < 1
      )
        throw new ValidationError(
          "Password must contain at least 1 numbers, The password has to be at least 8 characters long and contain at least 1 of ABCDEFGHIJKLMNOPQRSTUVWXYZ and contain at least 1 of abcdefghijklmnopqrstuvwxyz and contain at least 1 of 0123456789 and contain at least 1 of !@#$%^&*()_+~`|}{[]:;?><,./-=",
          value
        );
      if (
        !value.match(/([!@\#\$%\^&\*\(\)_\+~`\|\}\{\[\]\\:;\?><\,\./\-=])/g) ||
        value.match(/([!@\#\$%\^&\*\(\)_\+~`\|\}\{\[\]\\:;\?><\,\./\-=])/g)
          .length < 1
      )
        throw new ValidationError(
          "Password must contain at least 1 special characters, The password has to be at least 8 characters long and contain at least 1 of ABCDEFGHIJKLMNOPQRSTUVWXYZ and contain at least 1 of abcdefghijklmnopqrstuvwxyz and contain at least 1 of 0123456789 and contain at least 1 of !@#$%^&*()_+~`|}{[]:;?><,./-=",
          value
        );
      return value;
    },
    passwordSalt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("PasswordSalt is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(15);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "PasswordSalt must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "PasswordSalt must be at most " + maximum + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    contactId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Contact is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Contact must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Contact must be smaller than 2147483647",
          value
        );
      return value;
    },
    forgotPasswordToken: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ForgotPasswordToken is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ForgotPasswordToken must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "ForgotPasswordToken must be at most " +
            (maximum ?? 50) +
            " characters",
          value
        );
      return value;
    },
    forgotPasswordTokenCreated: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError(
          "ForgotPasswordTokenCreated is required",
          value
        );
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "ForgotPasswordTokenCreated must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError(
          "ForgotPasswordTokenCreated must be a valid date time"
        );
      if (value.getTime() === 0) return undefined;
      return value;
    },
    changeEmailToken: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ChangeEmailToken is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ChangeEmailToken must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "ChangeEmailToken must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    newEmail: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("NewEmail is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("NewEmail is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isEmail(value))
        throw new ValidationError("NewEmail must be a valid email", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "NewEmail contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    changeEmailTokenCreated: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ChangeEmailTokenCreated is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "ChangeEmailTokenCreated must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError(
          "ChangeEmailTokenCreated must be a valid date time"
        );
      if (value.getTime() === 0) return undefined;
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "InActive";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["InActive", "Active", "Suspended", "ActivationPending"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    termsAndConditionsAccepted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError(
          "TermsAndConditionsAccepted is required",
          value
        );
      else if (!required && !value) return undefined;
    },
    avatarUrl: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("AvatarUrl is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "AvatarUrl must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "AvatarUrl must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    subscriptionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Subscription is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Subscription must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Subscription must be smaller than 2147483647",
          value
        );
      return value;
    },
    serverId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Server is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Server must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Server must be smaller than 2147483647",
          value
        );
      return value;
    },
    domain: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Domain is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Domain must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "Domain must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    subDomain: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SubDomain is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "SubDomain must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 100))
        throw new ValidationError(
          "SubDomain must be at most " + (maximum ?? 100) + " characters",
          value
        );
      return value;
    },
    color: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Color is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Color must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Color must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    language: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "en-US";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Language is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Language must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Language must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Role: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  UserRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  UserTableDefinition: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Role must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  UserTableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Role must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    config: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Config must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Config is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  GroupTableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Role must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    groupId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Group is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Group must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Group must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  RolePermission: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    entityID: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("EntityID is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("EntityID is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("EntityID must be a valid UUID", value);
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    permissionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Permission is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Permission must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Permission must be smaller than 2147483647",
          value
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Invite: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    inviteKey: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("InviteKey is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "InviteKey must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "InviteKey must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    acceptedInvite: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("AcceptedInvite is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "AcceptedInvite must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("AcceptedInvite must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableView must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Role must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Group: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    avatarUrl: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("AvatarUrl is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "AvatarUrl must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "AvatarUrl must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    color: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Color is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Color must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Color must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Permission: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  File: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    mimeType: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("MimeType is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("MimeType is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "MimeType must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 100))
        throw new ValidationError(
          "MimeType must be at most " + (maximum ?? 100) + " characters",
          value
        );
      if (!validator.isMimeType(value))
        throw new ValidationError("MimeType must be a valid MimeType", value);
      return value;
    },
    fileReference: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("fileReference is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "fileReference must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "fileReference must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    assignedTo: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("AssignedTo is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("AssignedTo is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "User",
        "Group",
        "Application",
        "List",
        "Legacy",
        "Snapshot",
        "UIField",
        "Screenshot",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "AssignedTo must be one of " + options.join(","),
          value
        );
      return value;
    },
    resolver: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Resolver is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Resolver must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "Resolver must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    connectionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("ConnectionId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "ConnectionId must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "ConnectionId must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    size: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Size is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "Size must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 9223372036854776000))
        throw new ValidationError(
          "Size must be at most " + (maximum ?? 9223372036854776000),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TableDefinition: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    legacyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("LegacyId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "LegacyId must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "LegacyId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    template: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Template is required", value);
      else if (!required && !value) return undefined;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "Content",
        "Events",
        "HRRecruiting",
        "Marketing",
        "Communications",
        "Design",
        "ProjectManagement",
        "RemoteWork",
        "SalesCustomers",
        "SoftwareDevelopment",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    database: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Database is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Database must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Database must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    serverId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Server is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Server must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Server must be smaller than 2147483647",
          value
        );
      return value;
    },
    icon: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Icon is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Icon is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("Icon must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Icon contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    parentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Parent is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Parent must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Parent must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableHistoryId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableHistory is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableHistory must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableHistory must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    connections: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (value === undefined) value = "[]";
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Connections must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Connections is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    implementation: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "Dynamic";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Implementation is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Implementation is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Dynamic", "Static"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Implementation must be one of " + options.join(","),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  TableMigration: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    before: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Before is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Before must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Before must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    after: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("After is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "After must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "After must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    action: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Action is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Action is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "AddTable",
        "UpdateTableName",
        "RemoveTable",
        "AddColumn",
        "RemoveColumn",
        "UpdateColumnName",
        "UpdateColumnType",
        "AddRelation",
        "RemoveRelation",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Action must be one of " + options.join(","),
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Pending", "Running", "Success", "Error"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    fieldDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("FieldDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("FieldDefinition must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "FieldDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  LegacyMigrationQueue: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    legacyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && value !== 0 && !value)
        throw new ValidationError("LegacyId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 1))
        throw new ValidationError(
          "LegacyId must be at least " + (minimum ?? 1),
          value
        );
      if (value > (maximum ?? 20000000))
        throw new ValidationError(
          "LegacyId must be at most " + (maximum ?? 20000000),
          value
        );
      return value;
    },
    credentials: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Credentials must be a valid JSON", value);
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Credentials is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    callback: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Callback is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Callback is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("Callback must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Callback contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Pending", "Running", "Success", "Error"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    totalRows: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = true;
      if (required && value !== 0 && !value)
        throw new ValidationError("TotalRows is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "TotalRows must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 20000000))
        throw new ValidationError(
          "TotalRows must be at most " + (maximum ?? 20000000),
          value
        );
      return value;
    },
    rowsDone: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = true;
      if (required && value !== 0 && !value)
        throw new ValidationError("RowsDone is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "RowsDone must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 20000000))
        throw new ValidationError(
          "RowsDone must be at most " + (maximum ?? 20000000),
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableView must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    migrationResult: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("MigrationResult is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "MigrationResult must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 2000000))
        throw new ValidationError(
          "MigrationResult must be at most " +
            (maximum ?? 2000000) +
            " characters",
          value
        );
      return value;
    },
    relationConfiguration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("RelationConfiguration is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "RelationConfiguration must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 2000000))
        throw new ValidationError(
          "RelationConfiguration must be at most " +
            (maximum ?? 2000000) +
            " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "List",
        "Calendar",
        "KanBan",
        "Gallery",
        "TimeLine",
        "Gantt",
        "Map",
        "Spreadsheet",
        "Chart",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    template: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Template is required", value);
      else if (!required && !value) return undefined;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "Content",
        "Events",
        "HRRecruiting",
        "Marketing",
        "Communications",
        "Design",
        "ProjectManagement",
        "RemoteWork",
        "SalesCustomers",
        "SoftwareDevelopment",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    icon: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Icon is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Icon is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isURL(value))
        throw new ValidationError("Icon must be a valid URL", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Icon contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    config: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Config must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Config is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    dataConfig: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("DataConfig must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("DataConfig is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    isArchived: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("IsArchived is required", value);
      else if (!required && !value) return undefined;
    },
    isDefaultView: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("IsDefaultView is required", value);
      else if (!required && !value) return undefined;
    },
    viewChatId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ViewChat is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("ViewChat must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ViewChat must be smaller than 2147483647",
          value
        );
      return value;
    },
    visit: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Visit is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError("Visit must be at least " + minimum, value);
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "Visit must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  ViewChat: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    message: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Message is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Message must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Message must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    contentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("ContentId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "ContentId must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "ContentId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  ContentChat: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    contentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("ContentId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "ContentId must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "ContentId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    message: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Message is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Message must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Message must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TableHistory: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    definition: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Definition must be a valid JSON", value);
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Definition is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    snapshot: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Snapshot is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Snapshot is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!value.match(/^([a-zA-Z0-9_\-\.\/]+)$/))
        throw new ValidationError(
          "Snapshot must be a valid unix file path",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Snapshot contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  FieldDefinition: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    customType: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("CustomType is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "CustomType must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "CustomType must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "Text",
        "Integer",
        "Decimal",
        "Date",
        "Time",
        "DateTime",
        "Money",
        "Boolean",
        "File",
        "Image",
        "Choice",
        "Float",
        "Double",
        "Percentage",
        "Relation",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    ordering: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 0;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Ordering is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "Ordering must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 650000))
        throw new ValidationError(
          "Ordering must be at most " + (maximum ?? 650000),
          value
        );
      return value;
    },
    required: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Required is required", value);
      else if (!required && !value) return undefined;
    },
    detailsOnly: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("DetailsOnly is required", value);
      else if (!required && !value) return undefined;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    tableDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TableDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    minimum: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Minimum is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError("Minimum must be at least " + minimum, value);
      if (value > (maximum ?? 2147483647899000000))
        throw new ValidationError(
          "Minimum must be at most " + (maximum ?? 2147483647899000000),
          value
        );
      return value;
    },
    maximum: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Maximum is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError("Maximum must be at least " + minimum, value);
      if (value > (maximum ?? 2147483647899000000))
        throw new ValidationError(
          "Maximum must be at most " + (maximum ?? 2147483647899000000),
          value
        );
      return value;
    },
    legacyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("LegacyId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "LegacyId must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "LegacyId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    config: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Config must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Config is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    system: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("System is required", value);
      else if (!required && !value) return undefined;
    },
    icon: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Icon is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Icon must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Icon must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    deleted: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Deleted is required", value);
      else if (!required && !value) return undefined;
    },
    defaultValue: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("DefaultValue is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "DefaultValue must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "DefaultValue must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    indexed: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Indexed is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  AccessKey: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    key: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Key is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Key must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Key must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    cors: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Cors is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Cors must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Cors must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    expiryDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ExpiryDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "ExpiryDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("ExpiryDate must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Product: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    price: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Price is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    expiredDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ExpiredDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "ExpiredDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("ExpiredDate must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ResourceUserRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    userResourceName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("UserResourceName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("UserResourceName is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "All",
        "Dynamic",
        "User",
        "Role",
        "TableDefinition",
        "TableMigration",
        "FieldDefinition",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "UserResourceName must be one of " + options.join(","),
          value
        );
      return value;
    },
    resourceId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && value !== 0 && !value)
        throw new ValidationError("ResourceId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "ResourceId must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "ResourceId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    parentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Parent is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Parent must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Parent must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    resourceUserRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ResourceUserRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ResourceUserRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ResourceUserRole must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  ResourceAccessKeyRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    accessKeyResourceName: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("AccessKeyResourceName is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("AccessKeyResourceName is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = [
        "All",
        "Dynamic",
        "User",
        "Role",
        "TableDefinition",
        "TableMigration",
        "FieldDefinition",
      ];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "AccessKeyResourceName must be one of " + options.join(","),
          value
        );
      return value;
    },
    resourceId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && value !== 0 && !value)
        throw new ValidationError("ResourceId is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (minimum !== undefined && value < minimum)
        throw new ValidationError(
          "ResourceId must be at least " + minimum,
          value
        );
      if (value > (maximum ?? 2147483647))
        throw new ValidationError(
          "ResourceId must be at most " + (maximum ?? 2147483647),
          value
        );
      return value;
    },
    accessKeyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("AccessKey is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("AccessKey must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "AccessKey must be smaller than 2147483647",
          value
        );
      return value;
    },
    roleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Role is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Role must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Role must be smaller than 2147483647",
          value
        );
      return value;
    },
    parentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Parent is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Parent must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Parent must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    resourceAccessKeyRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ResourceAccessKeyRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ResourceAccessKeyRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ResourceAccessKeyRole must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  WorkflowDefinition: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Notification", "Data", "Scraping", "AIML", "CRM", "HRM"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowVersion: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowDefinitionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowDefinition is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowDefinition must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowDefinition must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowVersionRun: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowVersionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowVersion is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowVersion must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowVersion must be smaller than 2147483647",
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["New", "Running", "Stopped", "Error", "Success"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowStep: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowVersionId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowVersion is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowVersion must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowVersion must be smaller than 2147483647",
          value
        );
      return value;
    },
    previousStepsId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("PreviousSteps is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("PreviousSteps must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "PreviousSteps must be smaller than 2147483647",
          value
        );
      return value;
    },
    nextStepsId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("NextSteps is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("NextSteps must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "NextSteps must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  NextWorkflowStepWorkflowStep: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    configuration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError(
            "Configuration must be a valid JSON",
            value
          );
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Configuration is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    workflowStepId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowStep is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowStep must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowStep must be smaller than 2147483647",
          value
        );
      return value;
    },
    nextStepsId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("NextSteps is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("NextSteps must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "NextSteps must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  PreviousWorkflowStepWorkflowStep: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    configuration: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError(
            "Configuration must be a valid JSON",
            value
          );
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Configuration is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    workflowStepId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowStep is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowStep must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowStep must be smaller than 2147483647",
          value
        );
      return value;
    },
    previousStepsId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("PreviousSteps is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("PreviousSteps must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "PreviousSteps must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowScript: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    version: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "v1";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Version is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Version must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Version must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["JSON", "Lisp", "Python", "Javascript"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Notification", "Data", "Scraping", "AIML", "CRM", "HRM"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowStepId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowStep is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowStep must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowStep must be smaller than 2147483647",
          value
        );
      return value;
    },
    concurrent: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 10;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("Concurrent is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "Concurrent must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "Concurrent must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    ratePerMinute: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 10;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("RatePerMinute is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "RatePerMinute must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "RatePerMinute must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    ratePerHour: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 100;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("RatePerHour is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "RatePerHour must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "RatePerHour must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    ratePerDay: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 1000;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("RatePerDay is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "RatePerDay must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "RatePerDay must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    ratePerWeek: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 10000;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("RatePerWeek is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "RatePerWeek must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "RatePerWeek must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    ratePerMonth: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 10000;
      if (required === undefined) required = false;
      if (required && value !== 0 && !value)
        throw new ValidationError("RatePerMonth is required", value);
      else if (!required && value !== 0 && !value) return undefined;
      if (value < (minimum ?? 0))
        throw new ValidationError(
          "RatePerMonth must be at least " + (minimum ?? 0),
          value
        );
      if (value > (maximum ?? 100000))
        throw new ValidationError(
          "RatePerMonth must be at most " + (maximum ?? 100000),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowScriptRun: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowVersionRunId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowVersionRun is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowVersionRun must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowVersionRun must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowScriptId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowScript is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowScript must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowScript must be smaller than 2147483647",
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["New", "Running", "Stopped", "Error", "Success"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  WorkflowScriptAudit: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    workflowScriptRunId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("WorkflowScriptRun is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("WorkflowScriptRun must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "WorkflowScriptRun must be smaller than 2147483647",
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["New", "Running", "Stopped", "Error", "Success"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  Application: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    icon: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Icon is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Icon must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Icon must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    subDomain: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SubDomain is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "SubDomain must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 100))
        throw new ValidationError(
          "SubDomain must be at most " + (maximum ?? 100) + " characters",
          value
        );
      return value;
    },
    domain: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Domain is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Domain must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 200))
        throw new ValidationError(
          "Domain must be at most " + (maximum ?? 200) + " characters",
          value
        );
      return value;
    },
    cors: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Cors is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Cors must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Cors must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    color: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Color is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Color must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Color must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationMenu: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    applicationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Application is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Application must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Application must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationMenuPage: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    isHome: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("IsHome is required", value);
      else if (!required && !value) return undefined;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    layout: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Layout must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Layout is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    applicationMenuId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationMenu is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationMenu must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationMenu must be smaller than 2147483647",
          value
        );
      return value;
    },
    applicationRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ApplicationRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationRole must be smaller than 2147483647",
          value
        );
      return value;
    },
    parentId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Parent is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Parent must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Parent must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
    applicationMenuPageId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ApplicationMenuPage is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationMenuPage must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationMenuPage must be smaller than 2147483647",
          value
        );
      return value;
    },
  },
  ApplicationRoleTableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    rights: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Rights must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Rights is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    applicationRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationRole must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    applicationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Application is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Application must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Application must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationScript: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["JSON", "Lisp", "Python", "Javascript"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Notification", "Data", "Scraping", "AIML", "CRM", "HRM"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    applicationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Application is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Application must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Application must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationScriptAudit: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    applicationScriptId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationScript is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationScript must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationScript must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  GlobalScript: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["JSON", "Lisp", "Python", "Javascript"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Notification", "Data", "Scraping", "AIML", "CRM", "HRM"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  GlobalScriptAudit: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    globalScriptId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("GlobalScript is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("GlobalScript must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "GlobalScript must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  GlobalWidgetScript: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    type: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Type is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Type is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["ReactTypescript", "ReactJavascript"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Type must be one of " + options.join(","),
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["Notification", "Data", "Scraping", "AIML", "CRM", "HRM"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationAccessKey: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Name must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    key: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Key is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Key must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Key must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 65535))
        throw new ValidationError(
          "Description must be at most " + (maximum ?? 65535) + " characters",
          value
        );
      return value;
    },
    applicationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Application is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Application must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Application must be smaller than 2147483647",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    cors: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Cors is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Cors must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 250))
        throw new ValidationError(
          "Cors must be at most " + (maximum ?? 250) + " characters",
          value
        );
      return value;
    },
    expiryDate: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ExpiryDate is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "ExpiryDate must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("ExpiryDate must be a valid date time");
      if (value.getTime() === 0)
        throw new ValidationError("ExpiryDate is required", value);
      return value;
    },
    applicationRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("ApplicationRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationRole must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  SupportTicket: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    name: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Name is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Name must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "Name must be at most " + maximum + " characters",
          value
        );
      return value;
    },
    email: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Email is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Email is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (!validator.isEmail(value))
        throw new ValidationError("Email must be a valid email", value);
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Email contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    category: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Category is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Category is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["General", "Billing", "Technical", "Other"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Category must be one of " + options.join(","),
          value
        );
      return value;
    },
    subject: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Subject is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Subject must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "Subject must be at most " + maximum + " characters",
          value
        );
      return value;
    },
    description: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Description is required", value);
      else if (!required && !value) return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Description must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 100000000))
        throw new ValidationError(
          "Description must be at most " +
            (maximum ?? 100000000) +
            " characters",
          value
        );
      return value;
    },
    status: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Status is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Status is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      let options = ["New", "Open", "Resolved"];
      if (config && config.options) options = config.options;
      if (!options.includes(value))
        throw new ValidationError(
          "Status must be one of " + options.join(","),
          value
        );
      return value;
    },
    secret: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Secret is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("Secret is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("Secret must be a valid UUID", value);
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (value === undefined) value = 1;
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    emailVerified: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("EmailVerified is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  SupportTicketThread: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    supportTicketId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("SupportTicket is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("SupportTicket must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "SupportTicket must be smaller than 2147483647",
          value
        );
      return value;
    },
    message: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Message is required", value);
      else if (!required && !value) return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Message must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 100000000))
        throw new ValidationError(
          "Message must be at most " + (maximum ?? 100000000) + " characters",
          value
        );
      return value;
    },
    author: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Author is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum === undefined) minimum = BigInt(3);
      if (maximum === undefined) maximum = BigInt(30);
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Author must be at least " + minimum + " characters",
          value
        );
      if (maximum !== undefined && value.length > maximum)
        throw new ValidationError(
          "Author must be at most " + maximum + " characters",
          value
        );
      const svalue = sanitizeHtml(value, { allowedTags: [""] });
      if (
        svalue.replace(/&lt;/g, "<").split("<").length !==
        value.replace(/&lt;/g, "<").split("<").length
      )
        throw new ValidationError(
          "Author contains invalid HTML, allowed are ",
          value
        );
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    staffMember: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<boolean | undefined> => {
      if (value === undefined) value = false;
      if (value === true || value === false) return value;
      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }
      if (typeof value === "number") {
        return value !== 0;
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("StaffMember is required", value);
      else if (!required && !value) return undefined;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  SystemSettings: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    key: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (required === undefined) required = true;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("Key is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (minimum !== undefined && value.length < minimum)
        throw new ValidationError(
          "Key must be at least " + minimum + " characters",
          value
        );
      if (value.length > (maximum ?? 50))
        throw new ValidationError(
          "Key must be at most " + (maximum ?? 50) + " characters",
          value
        );
      return value;
    },
    value: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<any | undefined> => {
      if (typeof value === "string") {
        if (!validator.isJSON(value))
          throw new ValidationError("Value must be a valid JSON", value);
      }
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Value is required", value);
      else if (!required && !value) return undefined;
      return value;
    },
    ownerId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Owner is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Owner must be at least 1", value);
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Owner must be smaller than 2147483647",
          value
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  TranslationKeyContentManagement: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    translationKeyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TranslationKey is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("TranslationKey must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TranslationKey must be smaller than 2147483647",
          value
        );
      return value;
    },
    contentManagementId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ContentManagement is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ContentManagement must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ContentManagement must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  UserContact: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    contactId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Contact is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Contact must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Contact must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  GroupUser: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    groupId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Group is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("Group must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Group must be smaller than 2147483647",
          value
        );
      return value;
    },
    userId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("User is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("User must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "User must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationTableView: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    applicationId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("Application is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("Application must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Application must be smaller than 2147483647",
          value
        );
      return value;
    },
    tableViewId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("TableView is required", value);
      else if (!required && !value) return undefined;
      if (value < 1) throw new ValidationError("TableView must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "TableView must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationMenuPageApplicationRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    applicationMenuPageId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationMenuPage is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationMenuPage must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationMenuPage must be smaller than 2147483647",
          value
        );
      return value;
    },
    applicationRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationRole must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
  ApplicationAccessKeyApplicationRole: {
    id: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("Id is required", value);
      else if (!required && !value) return undefined;
      if (!(value > 0))
        throw new ValidationError(
          "Id must be greater than zero",
          value,
          "a number larger than 0"
        );
      if (!(value <= 2147483647))
        throw new ValidationError(
          "Id must be smaller than 2147483647",
          value,
          "a number larger than 0"
        );
      return value;
    },
    createdAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("CreatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "CreatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("CreatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    updatedAt: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<Date | undefined> => {
      if (required === undefined) required = false;
      if (required && !value)
        throw new ValidationError("UpdatedAt is required", value);
      else if (!required && !value) return undefined;
      if (typeof value === "string") {
        try {
          value = moment(value).toDate();
        } catch (e) {
          throw new ValidationError(
            "UpdatedAt must be a valid date time",
            value
          );
        }
      }
      if (isNaN(value.getTime()))
        throw new ValidationError("UpdatedAt must be a valid date time");
      if (value.getTime() === 0) return undefined;
      return value;
    },
    applicationAccessKeyId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationAccessKey is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationAccessKey must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationAccessKey must be smaller than 2147483647",
          value
        );
      return value;
    },
    applicationRoleId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<number | undefined> => {
      value = parseInt(value);
      if (required === undefined) required = true;
      if (required && !value)
        throw new ValidationError("ApplicationRole is required", value);
      else if (!required && !value) return undefined;
      if (value < 1)
        throw new ValidationError("ApplicationRole must be at least 1");
      if (!(value <= 2147483647))
        throw new ValidationError(
          "ApplicationRole must be smaller than 2147483647",
          value
        );
      return value;
    },
    syncId: async (
      value: any,
      required?: boolean,
      minimum?: bigint,
      maximum?: bigint,
      config?: any
    ): Promise<string | undefined> => {
      value = value ? value.toString() : undefined;
      if (value === undefined) value = "auto";
      if (required === undefined) required = false;
      // could be an empty string, which is ! in JS...
      if (required && typeof value !== "string" && !value)
        throw new ValidationError("SyncId is required", value);
      else if (!required && typeof value !== "string" && !value)
        return undefined;
      if (required && value.trim().length === 0)
        throw new ValidationError("SyncId is required", value);
      else if (!required && value.trim().length === 0) return undefined;
      if (value === "auto") value = randomUUID();
      if (!validator.isUUID(value))
        throw new ValidationError("SyncId must be a valid UUID", value);
      return value;
    },
  },
};
export default Validator;
