export enum ListCategory {
  Content = "Content",
  Events = "Events",
  HRRecruiting = "HRRecruiting",
  Marketing = "Marketing",
  Communications = "Communications",
  Design = "Design",
  ProjectManagement = "ProjectManagement",
  RemoteWork = "RemoteWork",
  SalesCustomers = "SalesCustomers",
  SoftwareDevelopment = "SoftwareDevelopment",
}
export enum Errors {
  NotAUser = "NotAUser",
  InvalidCredentials = "InvalidCredentials",
  InvalidViewId = "InvalidViewId",
  NotImplemented = "NotImplemented",
}
export enum Role {
  FullAccess = "FullAccess",
  ReadEdit = "ReadEdit",
  ReadOnly = "ReadOnly",
  AddOnly = "AddOnly",
  ReadAdd = "ReadAdd",
  None = "None",
}
export enum FieldType {
  Text = "Text",
  Integer = "Integer",
  Decimal = "Decimal",
  Date = "Date",
  Time = "Time",
  DateTime = "DateTime",
  Money = "Money",
  Boolean = "Boolean",
  File = "File",
  Image = "Image",
  Choice = "Choice",
  Float = "Float",
  Double = "Double",
  Percentage = "Percentage",
  Relation = "Relation"
}
export enum FieldUiTypeEnum {
  Text = "Text",
  LongText = "LongText",
  Integer = "Integer",
  Float = "Float",
  Decimal = "Decimal",
  Double = "Double",
  Date = "Date",
  Time = "Time",
  DateTime = "DateTime",
  Money = "Money",
  Boolean = "Boolean",
  Video = "Video",
  Image = "Image",
  Document = "Document",
  Choice = "Choice",
  Percentage = "Percentage",
  Markdown = "Markdown",
  HTML = "HTML",
  Color = "Color",
  Lookup = "Lookup",
  Sublist = "Sublist",
  ManyToMany = "ManyToMany",
  User = "User",
  Link = "Link",
  Rating = "Rating",
  Formula = "Formula",
}
export enum SearchType {
  List = "List",
  AllLists = "AllLists",
  View = "View",
  AllViews = "AllViews",
  Site = "Site",
  All = "All",
}
export enum ImportType {
  CSV = "CSV",
  JSON = "JSON",
  XML = "XML",
  YML = "YML",
  XLSX = "XLSX",
}
export enum ExportType {
  CSV = "CSV",
  JSON = "JSON",
  RSS = "RSS",
  XML = "XML",
  YML = "YML",
  XLSX = "XLSX",
  HTML = "HTML",
}
export enum ViewType {
  List = "List",
  Calendar = "Calendar",
  KanBan = "KanBan",
  Gallery = "Gallery",
  TimeLine = "TimeLine",
  Gantt = "Gantt",
  Map = "Map",
  Spreadsheet = "Spreadsheet",
  Chart = "Chart"
}
export enum PublishType {
  HTML = "HTML",
  JS = "JS",
  RSS = "RSS",
  JSON = "JSON",
  JSIframe = "JSIframe",
}
export enum FilterOperator {
  eq = "eq",
  neq = "neq",
  ne = "ne",
  gt = "gt",
  gte = "gte",
  lt = "lt",
  lte = "lte",
  like = "like",
  nlike = "nlike",
  in = "in",
  nin = "nin",
}
export enum UserStatus {
  InActive = "InActive",
  Active = "Active",
  Suspended = "Suspended",
  ActivationPending = "ActivationPending",
}
export enum MembershipLevel {
  Free = "Free",
  Premium = "Premium",
  Enterprise = "Enterprise",
}
export enum TranslationKeyType {
  Text = "Text",
  Html = "Html",
  Markdown = "Markdown",
  Image = "Image",
}
export enum PresetType {
  View = "View",
  Everyone = "Everyone",
  Yourself = "Yourself",
}
