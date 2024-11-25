export enum TableViewTypeEnum {
    List = 'List',
    Calendar = 'Calendar',
    KanBan = 'KanBan',
    TimeLine = 'TimeLine',
    Gantt = 'Gantt',
    Map = 'Map',
}
export enum TableViewCategoryEnum {
    Content = 'Content',
    Events = 'Events',
    HRRecruiting = 'HRRecruiting',
    Marketing = 'Marketing',
    Communications = 'Communications',
    Design = 'Design',
    ProjectManagement = 'ProjectManagement',
    RemoteWork = 'RemoteWork',
    SalesCustomers = 'SalesCustomers',
    SoftwareDevelopment = 'SoftwareDevelopment',
}
export enum TableDefinitionCategoryEnum {
    Content = 'Content',
    Events = 'Events',
    HRRecruiting = 'HRRecruiting',
    Marketing = 'Marketing',
    Communications = 'Communications',
    Design = 'Design',
    ProjectManagement = 'ProjectManagement',
    RemoteWork = 'RemoteWork',
    SalesCustomers = 'SalesCustomers',
    SoftwareDevelopment = 'SoftwareDevelopment',
}
export enum TableMigrationActionEnum {
    AddTable = 'AddTable',
    UpdateTableName = 'UpdateTableName',
    RemoveTable = 'RemoveTable',
    AddColumn = 'AddColumn',
    RemoveColumn = 'RemoveColumn',
    UpdateColumnName = 'UpdateColumnName',
    UpdateColumnType = 'UpdateColumnType',
    AddRelation = 'AddRelation',
    RemoveRelation = 'RemoveRelation',
}
export enum TableMigrationStatusEnum {
    Pending = 'Pending',
    Running = 'Running',
    Success = 'Success',
    Error = 'Error',
}
export enum FieldDefinitionTypeEnum {
    Text = 'Text',
    Integer = 'Integer',
    Decimal = 'Decimal',
    Date = 'Date',
    Time = 'Time',
    DateTime = 'DateTime',
    Money = 'Money',
    Boolean = 'Boolean',
    File = 'File',
    Image = 'Image',
    Choice = 'Choice',
    Float = 'Float',
    Double = 'Double',
    Percentage = 'Percentage',
}
export enum ResourceUserRoleUserResourceNameEnum {
    All = 'All',
    Dynamic = 'Dynamic',
    User = 'User',
    Role = 'Role',
    TableDefinition = 'TableDefinition',
    TableMigration = 'TableMigration',
    FieldDefinition = 'FieldDefinition',
}
export enum ResourceAccessKeyRoleAccessKeyResourceNameEnum {
    All = 'All',
    Dynamic = 'Dynamic',
    User = 'User',
    Role = 'Role',
    TableDefinition = 'TableDefinition',
    TableMigration = 'TableMigration',
    FieldDefinition = 'FieldDefinition',
}
