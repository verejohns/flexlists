import { gql } from 'graphql-tag';
export const graphqlRelationFilterTypeDefs = gql`
    input UserRelationFilter {
    is: UserWhereInput
    isNot: UserWhereInput
    }
    input RoleRelationFilter {
    is: RoleWhereInput
    isNot: RoleWhereInput
    }
    input PermissionRelationFilter {
    is: PermissionWhereInput
    isNot: PermissionWhereInput
    }
    input TableDefinitionRelationFilter {
    is: TableDefinitionWhereInput
    isNot: TableDefinitionWhereInput
    }
    input ApplicationRelationFilter {
    is: ApplicationWhereInput
    isNot: ApplicationWhereInput
    }
    input UserListRelationFilter {
    every: UserWhereInput
    some: UserWhereInput
    none: UserWhereInput
    }
    input RoleListRelationFilter {
    every: RoleWhereInput
    some: RoleWhereInput
    none: RoleWhereInput
    }
    input UserRoleListRelationFilter {
    every: UserRoleWhereInput
    some: UserRoleWhereInput
    none: UserRoleWhereInput
    }
    input PermissionListRelationFilter {
    every: PermissionWhereInput
    some: PermissionWhereInput
    none: PermissionWhereInput
    }
    input ApplicationListRelationFilter {
    every: ApplicationWhereInput
    some: ApplicationWhereInput
    none: ApplicationWhereInput
    }
    input TableDefinitionListRelationFilter {
    every: TableDefinitionWhereInput
    some: TableDefinitionWhereInput
    none: TableDefinitionWhereInput
    }
    input TableMigrationListRelationFilter {
    every: TableMigrationWhereInput
    some: TableMigrationWhereInput
    none: TableMigrationWhereInput
    }
    input FieldDefinitionListRelationFilter {
    every: FieldDefinitionWhereInput
    some: FieldDefinitionWhereInput
    none: FieldDefinitionWhereInput
    }
    input AccessKeyListRelationFilter {
    every: AccessKeyWhereInput
    some: AccessKeyWhereInput
    none: AccessKeyWhereInput
    }
    input ProductListRelationFilter {
    every: ProductWhereInput
    some: ProductWhereInput
    none: ProductWhereInput
    }
    input RolePermissionListRelationFilter {
    every: RolePermissionWhereInput
    some: RolePermissionWhereInput
    none: RolePermissionWhereInput
    }
    input RelTableDefinitionApplicationListRelationFilter {
    every: RelTableDefinitionApplicationWhereInput
    some: RelTableDefinitionApplicationWhereInput
    none: RelTableDefinitionApplicationWhereInput
    }
`;