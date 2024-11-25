import {
  FieldType,
  FieldUiTypeEnum,
  FilterOperator,
  ListCategory,
  Role,
} from "./SharedEnums";

export const RoleLabel = new Map<string, string>([
  [Role.ReadOnly, "Read Only"],
  [Role.ReadAdd, "Read and Add"],
  [Role.ReadEdit, "Read and Edit"],
  [Role.AddOnly, "Add Only"],
  [Role.FullAccess, "Full Access"],
]);
export const ListCategoryLabel = new Map<string, string>([
  [ListCategory.Content, "Content"],
  [ListCategory.Events, "Events"],
  [ListCategory.HRRecruiting, "HR Recruiting"],
  [ListCategory.Marketing, "Marketing"],
  [ListCategory.Communications, "Communications"],
  [ListCategory.Design, "Design"],
  [ListCategory.ProjectManagement, "Project Management"],
  [ListCategory.RemoteWork, "Remote Work"],
  [ListCategory.SalesCustomers, "Sales Customers"],
  [ListCategory.SoftwareDevelopment, "Software Development"],
]);
// export const FieldTypeGroupLabel = new Map<string,string[]>([
//     ["Text",[
//           FieldType.Text,
//       ]
//     ],
//     ["Number",[
//       FieldType.Integer,
//       FieldType.Float,
//       FieldType.Double,
//       FieldType.Decimal,
//       FieldType.Percentage,
//       FieldType.Money,
//      ]
//    ],
//    ["Time",[
//         FieldType.Date,
//         FieldType.DateTime
//       ]
//     ],
//    ["Switch",[
//         FieldType.Choice,
//         FieldType.Boolean
//       ]
//     ],
//    ["File",[
//         FieldType.File,
//         FieldType.Image
//       ]
//     ]
// ])

export const StringFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.like, "contain"],
  [FilterOperator.nlike, "not contain"],
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
]);
export const NumberFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "="],
  [FilterOperator.neq, "!="],
  [FilterOperator.lt, "<"],
  [FilterOperator.lte, "<="],
  [FilterOperator.gt, ">"],
  [FilterOperator.gte, ">="],
]);
export const DateFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
  [FilterOperator.lt, "is before"],
  [FilterOperator.lte, "is on or before"],
  [FilterOperator.gt, "is after"],
  [FilterOperator.gte, "is on or after"],
]);
export const SingleChoiceFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
  [FilterOperator.in, "is any of"],
  [FilterOperator.nin, "is none of"],
]);
export const MultipleChoiceFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.like, "contain"],
  [FilterOperator.nlike, "not contain"],
]);
export const BooleanFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
]);
export const ColorFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
]);
export const SingleUserFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
  [FilterOperator.in, "is any of"],
  [FilterOperator.nin, "is none of"],
]);
export const MultipleUserFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.like, "contain"],
  [FilterOperator.nlike, "not contain"],
]);
export const LookupFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.eq, "is"],
  [FilterOperator.neq, "is not"],
  [FilterOperator.like, "contain"],
  [FilterOperator.nlike, "not contain"],
]);
export const LinkFilterOperatorLabel = new Map<string, string>([
  [FilterOperator.like, "contain"],
  [FilterOperator.nlike, "not contain"],
]);
