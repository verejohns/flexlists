import { gql } from 'graphql-tag';
export const rolePermissionTypeDefs = gql`
  type RolePermission {
    id:Int
    entityID: String
    permissionId: Int
    roleId: Int
    permission:Permission
    role:Role
  }
  input RolePermissionWhereInput {
    AND: [RolePermissionWhereInput!]
    OR: [RolePermissionWhereInput!]
    NOT: [RolePermissionWhereInput!]
    id:IntFilter
    entityID: StringFilter
    permissionId: IntFilter
    roleId: IntFilter
    permission:PermissionRelationFilter
    role:RoleRelationFilter
  }
  input RolePermissionInclude {
     permission:Boolean
     role:Boolean
    _count: Boolean 
  }
  type Query {
    rolePermissions(where: RolePermissionWhereInput,take:Int,skip:Int,include:RolePermissionInclude): [RolePermission!]!
    getRolePermissionById(id:Int): RolePermission
  }
  type Mutation {
    createRolePermission(entityID: String,permissionId: Int,roleId: Int): RolePermission!
    updateRolePermission(id:Int,entityID: String,permissionId: Int,roleId: Int): RolePermission!
    deleteRolePermission(id:Int): RolePermission!
  }

`;